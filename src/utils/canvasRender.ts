import {
  CanvasLayer,
  TextLayer,
  ImageLayer,
  StickerLayer,
  ShapeLayer,
  VectorLayer,
  CTRStressTestMode,
} from '../types/thumbnail';

// Cache loaded images to prevent flickering and re-fetching
const imageCache: Map<string, HTMLImageElement> = new Map();

export async function preloadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) return cached;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      const fallback = new Image();
      resolve(fallback);
    };
    img.src = src;
  });
}

export interface RenderCanvasOptions {
  canvas: HTMLCanvasElement;
  layers: CanvasLayer[];
  backgroundColor: string;
  width: number;
  height: number;
  showGuides?: boolean;
  showTimestampShield?: boolean;
  heatmapHotspots?: { x: number; y: number; intensity: number; label: string }[];
  showHeatmap?: boolean;
  stressTestMode?: CTRStressTestMode;
}

export async function renderThumbnailCanvas({
  canvas,
  layers,
  backgroundColor,
  width,
  height,
  showGuides = false,
  showTimestampShield = false,
  heatmapHotspots,
  showHeatmap = false,
  stressTestMode = 'normal',
}: RenderCanvasOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = width;
  canvas.height = height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Background fill
  ctx.fillStyle = backgroundColor || '#0B0F19';
  ctx.fillRect(0, 0, width, height);

  // Sort layers by zIndex ascending
  const sortedLayers = [...layers]
    .filter((l) => l.isVisible !== false)
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Render each layer
  for (const layer of sortedLayers) {
    ctx.save();

    // Coordinates in percentages of canvas width/height
    const lx = (layer.x / 100) * width;
    const ly = (layer.y / 100) * height;
    const lw = (layer.width / 100) * width;
    const lh = (layer.height / 100) * height;

    ctx.globalAlpha = layer.opacity ?? 1;

    // Apply rotation around layer center
    if (layer.rotation) {
      const centerX = lx + lw / 2;
      const centerY = ly + lh / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    if (layer.type === 'shape') {
      renderShapeLayer(ctx, layer as ShapeLayer, lx, ly, lw, lh);
    } else if (layer.type === 'image') {
      await renderImageLayer(ctx, layer as ImageLayer, lx, ly, lw, lh);
    } else if (layer.type === 'text') {
      renderTextLayer(ctx, layer as TextLayer, lx, ly, lw, lh, width);
    } else if (layer.type === 'sticker') {
      renderStickerLayer(ctx, layer as StickerLayer, lx, ly, lw, lh);
    } else if (layer.type === 'vector') {
      renderVectorLayer(ctx, layer as VectorLayer, lx, ly, lw, lh);
    }

    ctx.restore();
  }

  // Draw Heatmap Overlay if requested
  if (showHeatmap && heatmapHotspots && heatmapHotspots.length > 0) {
    drawAttentionHeatmap(ctx, heatmapHotspots, width, height);
  }

  // Draw YouTube Timestamp Collision Shield warning
  if (showTimestampShield) {
    drawTimestampBadge(ctx, width, height);
  }

  // Draw Safe Zone and Rule of Thirds Guides
  if (showGuides) {
    drawCanvasGuides(ctx, width, height);
  }

  // CTR Stress Test Post-Processing (Squint blur or Greyscale)
  if (stressTestMode === 'squint_blur') {
    applySquintBlurTest(ctx, width, height);
  } else if (stressTestMode === 'greyscale') {
    applyGreyscaleTest(ctx, width, height);
  }
}

function renderShapeLayer(
  ctx: CanvasRenderingContext2D,
  layer: ShapeLayer,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = layer.fillColor;
  if (layer.shapeType === 'circle') {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (layer.shapeType === 'glow') {
    const gradient = ctx.createRadialGradient(
      x + w / 2,
      y + h / 2,
      0,
      x + w / 2,
      y + h / 2,
      Math.max(w, h) / 2
    );
    gradient.addColorStop(0, layer.fillColor);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);
  } else {
    ctx.fillRect(x, y, w, h);
  }

  if (layer.borderColor && layer.borderWidth) {
    ctx.strokeStyle = layer.borderColor;
    ctx.lineWidth = layer.borderWidth;
    ctx.strokeRect(x, y, w, h);
  }
}

function renderVectorLayer(
  ctx: CanvasRenderingContext2D,
  layer: VectorLayer,
  x: number,
  y: number,
  w: number,
  h: number
) {
  if (!layer.points || layer.points.length < 2) return;

  ctx.save();
  ctx.strokeStyle = layer.strokeColor || '#00F0FF';
  ctx.lineWidth = layer.strokeWidth || 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  const startX = x + (layer.points[0].x / 100) * w;
  const startY = y + (layer.points[0].y / 100) * h;
  ctx.moveTo(startX, startY);

  if (layer.curveType === 'smooth' && layer.points.length > 2) {
    for (let i = 1; i < layer.points.length - 1; i++) {
      const xc = x + ((layer.points[i].x + layer.points[i + 1].x) / 200) * w;
      const yc = y + ((layer.points[i].y + layer.points[i + 1].y) / 200) * h;
      const cpX = x + (layer.points[i].x / 100) * w;
      const cpY = y + (layer.points[i].y / 100) * h;
      ctx.quadraticCurveTo(cpX, cpY, xc, yc);
    }
    const lastP = layer.points[layer.points.length - 1];
    ctx.lineTo(x + (lastP.x / 100) * w, y + (lastP.y / 100) * h);
  } else {
    for (let i = 1; i < layer.points.length; i++) {
      ctx.lineTo(x + (layer.points[i].x / 100) * w, y + (layer.points[i].y / 100) * h);
    }
  }

  if (layer.isClosed) {
    ctx.closePath();
    if (layer.fillColor) {
      ctx.fillStyle = layer.fillColor;
      ctx.fill();
    }
  }

  ctx.stroke();
  ctx.restore();
}

async function renderImageLayer(
  ctx: CanvasRenderingContext2D,
  layer: ImageLayer,
  x: number,
  y: number,
  w: number,
  h: number
) {
  if (!layer.src) return;

  try {
    const img = await preloadImage(layer.src);
    if (!img.complete || img.naturalWidth === 0) return;

    if (layer.dropShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 8;
    }

    // Apply CSS filters if supported in Canvas 2D
    const filters: string[] = [];
    if (layer.contrast !== undefined && layer.contrast !== 1) filters.push(`contrast(${layer.contrast})`);
    if (layer.brightness !== undefined && layer.brightness !== 1) filters.push(`brightness(${layer.brightness})`);
    if (layer.saturation !== undefined && layer.saturation !== 1) filters.push(`saturate(${layer.saturation})`);

    // Exposure filter approximation
    if (layer.exposure !== undefined && layer.exposure !== 0) {
      const expMult = Math.max(0.2, 1 + layer.exposure * 0.4);
      filters.push(`brightness(${expMult})`);
    }

    if (filters.length > 0) {
      ctx.filter = filters.join(' ');
    }

    ctx.drawImage(img, x, y, w, h);
    ctx.filter = 'none';

    // Ambience & Color Temperature Overlay (Warm Amber / Cool Cyan Matcher)
    if (layer.temperature !== undefined && layer.temperature !== 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const alpha = Math.min(0.4, Math.abs(layer.temperature) / 200);
      ctx.fillStyle = layer.temperature > 0 ? `rgba(255, 140, 0, ${alpha})` : `rgba(0, 180, 255, ${alpha})`;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }

    // Vignette overlay
    if (layer.hasVignette) {
      const grad = ctx.createRadialGradient(
        x + w / 2,
        y + h / 2,
        Math.min(w, h) * 0.3,
        x + w / 2,
        y + h / 2,
        Math.max(w, h) * 0.7
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
    }
  } catch (err) {
    console.warn('Failed to render image layer:', err);
  }
}

function renderTextLayer(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  x: number,
  y: number,
  w: number,
  h: number,
  canvasWidth: number
) {
  const text = layer.isUppercase ? (layer.text || '').toUpperCase() : layer.text || '';
  if (!text) return;

  const scaleFactor = canvasWidth / 1280;
  const scaledFontSize = Math.max(14, Math.round((layer.fontSize || 60) * scaleFactor));
  const fontFamily = layer.fontFamily || 'Anton';
  const fontWeight = layer.fontWeight || '900';

  ctx.font = `${fontWeight} ${scaledFontSize}px "${fontFamily}", sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = layer.textAlign || 'center';

  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = scaledFontSize * 1.1;

  const drawX =
    layer.textAlign === 'left' ? x : layer.textAlign === 'right' ? x + w : x + w / 2;
  const drawY = y + h / 2;

  // Background badge
  if (layer.hasBackgroundBadge) {
    const pad = (layer.badgePadding || 16) * scaleFactor;
    const badgeX = drawX - (layer.textAlign === 'left' ? 0 : layer.textAlign === 'right' ? textWidth : textWidth / 2) - pad;
    const badgeY = drawY - textHeight / 2 - pad / 2;
    const badgeW = textWidth + pad * 2;
    const badgeH = textHeight + pad;
    const radius = (layer.badgeRadius || 8) * scaleFactor;

    ctx.save();
    ctx.fillStyle = layer.badgeColor || '#FFE600';
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, radius);
    ctx.fill();
    ctx.restore();
  }

  // Outer Glow Effect
  if (layer.glowColor && layer.glowBlur) {
    ctx.save();
    ctx.shadowColor = layer.glowColor;
    ctx.shadowBlur = (layer.glowBlur || 20) * scaleFactor;
    ctx.fillStyle = layer.glowColor;
    ctx.fillText(text, drawX, drawY);
    ctx.restore();
  }

  // Drop Shadow
  if (layer.shadowBlur || layer.shadowColor) {
    ctx.shadowColor = layer.shadowColor || 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = (layer.shadowBlur || 8) * scaleFactor;
    ctx.shadowOffsetX = (layer.shadowOffsetX || 4) * scaleFactor;
    ctx.shadowOffsetY = (layer.shadowOffsetY || 4) * scaleFactor;
  }

  // Heavy Stroke Outline
  if (layer.strokeWidth && layer.strokeWidth > 0) {
    ctx.strokeStyle = layer.strokeColor || '#000000';
    ctx.lineWidth = layer.strokeWidth * scaleFactor * 1.4;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;
    ctx.strokeText(text, drawX, drawY);
  }

  // Text Fill
  if (layer.useGradient && layer.gradientColor) {
    const textGrad = ctx.createLinearGradient(
      drawX - textWidth / 2,
      drawY - textHeight / 2,
      drawX + textWidth / 2,
      drawY + textHeight / 2
    );
    textGrad.addColorStop(0, layer.color || '#FFFFFF');
    textGrad.addColorStop(1, layer.gradientColor);
    ctx.fillStyle = textGrad;
  } else {
    ctx.fillStyle = layer.color || '#FFFFFF';
  }

  ctx.fillText(text, drawX, drawY);
}

function renderStickerLayer(
  ctx: CanvasRenderingContext2D,
  layer: StickerLayer,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();

  if (layer.stickerType === 'arrow') {
    ctx.fillStyle = layer.color || '#EF4444';
    ctx.strokeStyle = layer.secondaryColor || '#FFFFFF';
    ctx.lineWidth = Math.max(3, w * 0.08);

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.35);
    ctx.lineTo(x + w * 0.55, y + h * 0.35);
    ctx.lineTo(x + w * 0.55, y + h * 0.1);
    ctx.lineTo(x + w, y + h * 0.5);
    ctx.lineTo(x + w * 0.55, y + h * 0.9);
    ctx.lineTo(x + w * 0.55, y + h * 0.65);
    ctx.lineTo(x, y + h * 0.65);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (layer.stickerType === 'circle') {
    ctx.strokeStyle = layer.color || '#EF4444';
    ctx.lineWidth = Math.max(4, Math.min(w, h) * 0.08);
    ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
    ctx.shadowBlur = 18;

    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w * 0.45, h * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();

    if (layer.secondaryColor) {
      ctx.fillStyle = layer.secondaryColor;
      ctx.fill();
    }
  } else if (layer.stickerType === 'versus') {
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 18;

    ctx.fillStyle = layer.color || '#EF4444';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = layer.secondaryColor || '#FFE600';
    ctx.lineWidth = Math.max(3, Math.min(w, h) * 0.06);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${Math.round(Math.min(w, h) * 0.45)}px "Anton", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VS', x + w / 2, y + h / 2);
  } else if (layer.stickerType === 'emoji') {
    ctx.font = `${Math.round(Math.min(w, h) * 0.85)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(layer.label || '🔥', x + w / 2, y + h / 2);
  } else {
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = layer.color || '#EF4444';
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill();

    ctx.strokeStyle = layer.secondaryColor || '#FFFFFF';
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, w, h, 8);
    ctx.stroke();

    ctx.fillStyle = layer.secondaryColor || '#FFFFFF';
    ctx.font = `900 ${Math.round(h * 0.55)}px "Anton", "Montserrat", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(layer.label || 'NEW!', x + w / 2, y + h / 2);
  }

  ctx.restore();
}

function drawAttentionHeatmap(
  ctx: CanvasRenderingContext2D,
  hotspots: { x: number; y: number; intensity: number; label: string }[],
  width: number,
  height: number
) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, width, height);

  for (const spot of hotspots) {
    const sx = (spot.x / 100) * width;
    const sy = (spot.y / 100) * height;
    const radius = Math.max(width, height) * 0.16 * (spot.intensity || 0.8);

    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
    grad.addColorStop(0, 'rgba(255, 0, 50, 0.85)');
    grad.addColorStop(0.35, 'rgba(255, 170, 0, 0.7)');
    grad.addColorStop(0.65, 'rgba(255, 255, 0, 0.45)');
    grad.addColorStop(0.85, 'rgba(0, 220, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 220, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 6;
    ctx.fillText(`👀 ${spot.label} (${Math.round((spot.intensity || 0.8) * 100)}%)`, sx, sy - radius * 0.4);
  }

  ctx.restore();
}

function drawTimestampBadge(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const badgeW = width * 0.12;
  const badgeH = height * 0.11;
  const padRight = width * 0.02;
  const padBottom = height * 0.035;

  const bx = width - badgeW - padRight;
  const by = height - badgeH - padBottom;

  // Danger zone highlight
  ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.fillRect(bx - 8, by - 8, badgeW + 16, badgeH + 16);
  ctx.strokeRect(bx - 8, by - 8, badgeW + 16, badgeH + 16);

  // Black YouTube timestamp badge
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  roundRect(ctx, bx, by, badgeW, badgeH, 6);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${Math.round(badgeH * 0.55)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('14:28', bx + badgeW / 2, by + badgeH / 2);

  ctx.fillStyle = '#EF4444';
  ctx.font = '700 11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('⚠️ Timestamp Danger Zone', bx + badgeW, by - 10);

  ctx.restore();
}

function drawCanvasGuides(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  // Rule of thirds
  ctx.beginPath();
  ctx.moveTo(width / 3, 0);
  ctx.lineTo(width / 3, height);
  ctx.moveTo((width * 2) / 3, 0);
  ctx.lineTo((width * 2) / 3, height);
  ctx.moveTo(0, height / 3);
  ctx.lineTo(width, height / 3);
  ctx.moveTo(0, (height * 2) / 3);
  ctx.lineTo(width, (height * 2) / 3);
  ctx.stroke();

  // Mobile Safe margins
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
  ctx.strokeRect(width * 0.08, height * 0.08, width * 0.84, height * 0.84);

  ctx.restore();
}

function applySquintBlurTest(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.drawImage(ctx.canvas, 0, 0);

  ctx.save();
  ctx.filter = 'blur(6px)';
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';

  // Stress test banner
  ctx.fillStyle = 'rgba(234, 88, 12, 0.9)';
  ctx.fillRect(0, 0, width, 36);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧪 CTR Squint Test: Can you still recognize the focal hero subject and hook?', width / 2, 23);
  ctx.restore();
}

function applyGreyscaleTest(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.drawImage(ctx.canvas, 0, 0);

  ctx.save();
  ctx.filter = 'grayscale(100%) contrast(1.1)';
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';

  // Stress test banner
  ctx.fillStyle = 'rgba(79, 70, 229, 0.9)';
  ctx.fillRect(0, 0, width, 36);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧪 Luminance Value Test: Checking pure brightness contrast without color hue bias', width / 2, 23);
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
