export type LayerType = 'text' | 'image' | 'sticker' | 'shape' | 'vector';

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number;
  height: number;
  rotation: number; // in degrees
  opacity: number; // 0 to 1
  zIndex: number;
  isLocked?: boolean;
  isVisible: boolean;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  gradientColor?: string;
  useGradient?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  strokePosition?: 'outer' | 'inner' | 'center';
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  glowColor?: string;
  glowBlur?: number;
  glowIntensity?: number;
  hasBackgroundBadge?: boolean;
  badgeColor?: string;
  badgePadding?: number;
  badgeRadius?: number;
  isUppercase?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  objectFit?: 'cover' | 'contain';
  brightness?: number; // 0 to 2, default 1
  contrast?: number; // 0 to 2, default 1
  saturation?: number; // 0 to 2, default 1
  blur?: number; // px
  hasVignette?: boolean;
  isCutout?: boolean;
  dropShadow?: boolean;
  // Pro Ambience & Lighting Matcher
  temperature?: number; // -100 (cool cyan) to +100 (warm amber)
  tint?: number; // -100 (green) to +100 (magenta)
  exposure?: number; // -2 to +2
  highlights?: number; // -100 to +100
  shadows?: number; // -100 to +100
  maskDataUrl?: string;
}

export interface StickerLayer extends BaseLayer {
  type: 'sticker';
  stickerType: 'badge' | 'arrow' | 'circle' | 'emoji' | 'versus' | 'warning' | 'custom';
  label?: string;
  color: string;
  secondaryColor?: string;
  icon?: string;
  src?: string;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'divider' | 'glow';
  fillColor: string;
  borderColor?: string;
  borderWidth?: number;
  blur?: number;
}

export interface VectorPoint {
  x: number; // percentage (0-100) relative to layer
  y: number; // percentage (0-100) relative to layer
}

export interface VectorLayer extends BaseLayer {
  type: 'vector';
  points: VectorPoint[];
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  isClosed?: boolean;
  curveType?: 'linear' | 'smooth';
}

export type CanvasLayer = TextLayer | ImageLayer | StickerLayer | ShapeLayer | VectorLayer;

export interface BrandPalette {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  textColor: string;
  textStroke: string;
}

export interface ThumbnailProject {
  id: string;
  title: string;
  niche: string;
  canvasWidth: number;
  canvasHeight: number;
  layers: CanvasLayer[];
  backgroundColor: string;
  activePaletteId?: string;
  status: 'draft' | 'in_review' | 'needs_changes' | 'approved' | 'published';
  updatedAt: string;
}

export interface ThumbnailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  previewColor: string;
  layers: CanvasLayer[];
  backgroundColor: string;
  paletteId: string;
  estimatedCTR: string;
  psychologyNote: string;
}

export interface ReviewComment {
  id: string;
  projectId: string;
  author: string;
  role: string;
  avatar: string;
  x: number;
  y: number;
  text: string;
  timestamp: string;
  resolved: boolean;
}

export interface AIAnalysisReport {
  overallScore: number;
  grade: string;
  predictedCTR: string;
  industryAverageCTR: string;
  breakdown: {
    mobileReadability: number;
    contrastVibrancy: number;
    emotionalImpact: number;
    curiosityGap: number;
    timestampSafety: string;
  };
  verdict: string;
  strengths: string[];
  frictionPoints: string[];
  actionRecommendations: {
    title: string;
    impact: string;
    description: string;
    suggestedChange: string;
  }[];
  attentionHotspots: {
    x: number;
    y: number;
    intensity: number;
    label: string;
  }[];
}

export interface AIConceptIdea {
  title: string;
  category: string;
  overlayText: string;
  visualComposition: string;
  colorPaletteName: string;
  primaryColor: string;
  accentColor: string;
  contrastRatio?: string;
  predictedCTR: string;
  psychologicalTrigger: string;
  imagePrompt: string;
}

export interface PlatformExportPreset {
  id: string;
  platform: string;
  formatName: string;
  width: number;
  height: number;
  aspectRatioLabel: string;
  description: string;
  iconName: string;
  maxSizeBytes?: number;
}

// Pro-Grade Brand Kit Cataloging
export interface BrandKitItem {
  id: string;
  name: string;
  type: 'cutout' | 'logo' | 'typography' | 'color';
  src?: string;
  data?: any;
}

export interface BrandKitFolder {
  id: string;
  name: string;
  description: string;
  items: BrandKitItem[];
}

// Competitor Benchmark
export interface CompetitorBenchmarkItem {
  id: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  views: string;
  publishedTime: string;
  CTRScoreEstimate: number;
}

// CTR Stress Test Mode
export type CTRStressTestMode = 'normal' | 'squint_blur' | 'greyscale' | 'mobile_tiny';
