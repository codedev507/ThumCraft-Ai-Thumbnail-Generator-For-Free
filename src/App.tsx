import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CanvasEditor } from './components/CanvasEditor';
import { StylePanel } from './components/StylePanel';
import { TemplateLibraryModal } from './components/TemplateLibraryModal';
import { AIIdeasPanel } from './components/AIIdeasPanel';
import { AIImageGenModal } from './components/AIImageGenModal';
import { BulkExportModal } from './components/BulkExportModal';
import { FeedSimulatorModal } from './components/FeedSimulatorModal';
import { AIReportModal } from './components/AIReportModal';
import { CollaborativeWorkspaceModal } from './components/CollaborativeWorkspaceModal';
import { AIDesignAssistantModal } from './components/AIDesignAssistantModal';
import { ABTestingStudioModal } from './components/ABTestingStudioModal';
import { TextToThumbnailModal } from './components/TextToThumbnailModal';
import { YouTubeSEOSuiteModal } from './components/YouTubeSEOSuiteModal';
import { CompetitorBenchmarkModal } from './components/CompetitorBenchmarkModal';
import { BrandKitModal } from './components/BrandKitModal';

import {
  ThumbnailProject,
  CanvasLayer,
  TextLayer,
  ImageLayer,
  StickerLayer,
  VectorLayer,
  BrandPalette,
  ThumbnailTemplate,
  ReviewComment,
  AIConceptIdea,
  CTRStressTestMode,
  BrandKitItem,
} from './types/thumbnail';
import { HIGH_CTR_TEMPLATES } from './constants/templates';
import { BRAND_PALETTES } from './constants/palettes';
import { PRESET_STICKERS } from './constants/stickers';
import { TextStylePreset } from './constants/textStyles';
import { exportPresetToBlob, PLATFORM_PRESETS, downloadSingleThumbnail } from './utils/exportZip';

export default function App() {
  // Initialize with the first viral template (MrBeast Shock Reaction)
  const defaultTemplate = HIGH_CTR_TEMPLATES[0];

  const [project, setProject] = useState<ThumbnailProject>({
    id: 'default',
    title: 'I Survived 100 Hours Inside an Autonomous AI Vault',
    niche: 'Technology & Gaming',
    canvasWidth: 1280,
    canvasHeight: 720,
    layers: defaultTemplate.layers,
    backgroundColor: defaultTemplate.backgroundColor,
    activePaletteId: defaultTemplate.paletteId,
    status: 'in_review',
    updatedAt: new Date().toISOString(),
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('text-1');

  // History for Undo / Redo
  const [history, setHistory] = useState<{ layers: CanvasLayer[]; backgroundColor: string }[]>([
    { layers: defaultTemplate.layers, backgroundColor: defaultTemplate.backgroundColor },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modals state
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isTextToThumbnailOpen, setIsTextToThumbnailOpen] = useState(false);
  const [isSEOOpen, setIsSEOOpen] = useState(false);
  const [isAIIdeasOpen, setIsAIIdeasOpen] = useState(false);
  const [isAIImageGenOpen, setIsAIImageGenOpen] = useState(false);
  const [isAIReportOpen, setIsAIReportOpen] = useState(false);
  const [isFeedSimOpen, setIsFeedSimOpen] = useState(false);
  const [isBulkExportOpen, setIsBulkExportOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isABTestOpen, setIsABTestOpen] = useState(false);
  const [isCompetitorOpen, setIsCompetitorOpen] = useState(false);
  const [isBrandKitOpen, setIsBrandKitOpen] = useState(false);

  // Layout & Collapsible Sidebars (Figma/Photoshop spatial architecture)
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Viewport & Canvas Controls state
  const [zoom, setZoom] = useState<number>(1);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [showTimestampShield, setShowTimestampShield] = useState<boolean>(true);
  const [stressTestMode, setStressTestMode] = useState<CTRStressTestMode>('normal');

  // Eye-Tracking Heatmap Simulation
  const [isHeatmapActive, setIsHeatmapActive] = useState(false);
  const [heatmapHotspots, setHeatmapHotspots] = useState<
    { x: number; y: number; intensity: number; label: string }[]
  >([
    { x: 32, y: 34, intensity: 0.95, label: 'Primary Hook Text' },
    { x: 74, y: 44, intensity: 0.88, label: 'Shocked Facial Expression' },
    { x: 22, y: 78, intensity: 0.72, label: 'Action Stamp Badge' },
  ]);

  // Review Pins State
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [comments, setComments] = useState<ReviewComment[]>([]);

  // Fetch comments on mount
  useEffect(() => {
    fetch('/api/comments?projectId=default')
      .then((res) => res.json())
      .then((data) => {
        if (data.comments) setComments(data.comments);
      })
      .catch((e) => console.error(e));
  }, []);

  // Responsive layout adaptation for mobile and tablet screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsRightCollapsed(true);
      }
      if (window.innerWidth < 768) {
        setIsLeftCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Push state to undo/redo history
  const pushToHistory = useCallback(
    (newLayers: CanvasLayer[], newBgColor: string) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ layers: newLayers, backgroundColor: newBgColor });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject((p) => ({ ...p, layers: prev.layers, backgroundColor: prev.backgroundColor }));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject((p) => ({ ...p, layers: next.layers, backgroundColor: next.backgroundColor }));
    }
  };

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Layer Operations
  const handleUpdateLayer = (updated: CanvasLayer) => {
    const updatedLayers = project.layers.map((l) => (l.id === updated.id ? updated : l));
    setProject((p) => ({ ...p, layers: updatedLayers }));
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  const handleDeleteLayer = (id: string) => {
    const updatedLayers = project.layers.filter((l) => l.id !== id);
    setProject((p) => ({ ...p, layers: updatedLayers }));
    if (selectedLayerId === id) setSelectedLayerId(null);
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  const handleDuplicateLayer = (id: string) => {
    const layer = project.layers.find((l) => l.id === id);
    if (!layer) return;
    const duplicated: CanvasLayer = {
      ...layer,
      id: `layer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${layer.name} Copy`,
      x: Math.min(80, layer.x + 4),
      y: Math.min(80, layer.y + 4),
      zIndex: (layer.zIndex || 0) + 1,
    };
    const updatedLayers = [...project.layers, duplicated];
    setProject((p) => ({ ...p, layers: updatedLayers }));
    setSelectedLayerId(duplicated.id);
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  const handleBringForward = (id: string) => {
    const updatedLayers = project.layers.map((l) => (l.id === id ? { ...l, zIndex: (l.zIndex || 0) + 2 } : l));
    setProject((p) => ({ ...p, layers: updatedLayers }));
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  const handleSendBackward = (id: string) => {
    const updatedLayers = project.layers.map((l) =>
      l.id === id ? { ...l, zIndex: Math.max(1, (l.zIndex || 0) - 2) } : l
    );
    setProject((p) => ({ ...p, layers: updatedLayers }));
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  // Add Elements
  const handleAddTextLayer = (preset?: {
    text: string;
    color: string;
    strokeColor: string;
    fontSize: number;
    fontFamily?: string;
    x?: number;
    y?: number;
  }) => {
    const newText: TextLayer = {
      id: `text_${Date.now()}`,
      type: 'text',
      name: preset?.text || 'Custom Hook',
      x: preset?.x !== undefined ? preset.x : 10,
      y: preset?.y !== undefined ? preset.y : 30,
      width: 55,
      height: 25,
      rotation: -3,
      opacity: 1,
      zIndex: project.layers.length + 5,
      isVisible: true,
      text: preset?.text || 'NEW VIDEO!',
      fontFamily: preset?.fontFamily || 'Anton',
      fontSize: preset?.fontSize || 78,
      fontWeight: '900',
      color: preset?.color || '#FFE600',
      strokeColor: preset?.strokeColor || '#000000',
      strokeWidth: 10,
      shadowColor: 'rgba(0,0,0,0.85)',
      shadowBlur: 16,
      shadowOffsetX: 4,
      shadowOffsetY: 4,
      isUppercase: true,
    };
    const updated = [...project.layers, newText];
    setProject((p) => ({ ...p, layers: updated }));
    setSelectedLayerId(newText.id);
    pushToHistory(updated, project.backgroundColor);
  };

  const handleAddStickerLayer = (stickerPreset: (typeof PRESET_STICKERS)[0]) => {
    const newSticker: StickerLayer = {
      id: `sticker_${Date.now()}`,
      type: 'sticker',
      name: stickerPreset.name,
      stickerType: stickerPreset.type,
      label: stickerPreset.label,
      color: stickerPreset.color,
      secondaryColor: stickerPreset.secondaryColor,
      x: 35,
      y: 40,
      width: stickerPreset.type === 'circle' ? 22 : stickerPreset.type === 'arrow' ? 20 : 24,
      height: stickerPreset.type === 'circle' ? 38 : stickerPreset.type === 'arrow' ? 18 : 12,
      rotation: 0,
      opacity: 1,
      zIndex: project.layers.length + 6,
      isVisible: true,
    };
    const updated = [...project.layers, newSticker];
    setProject((p) => ({ ...p, layers: updated }));
    setSelectedLayerId(newSticker.id);
    pushToHistory(updated, project.backgroundColor);
  };

  const handleAddImageLayer = (src: string, name?: string) => {
    const newImage: ImageLayer = {
      id: `image_${Date.now()}`,
      type: 'image',
      name: name || 'Custom Image',
      src,
      x: 15,
      y: 15,
      width: 70,
      height: 70,
      rotation: 0,
      opacity: 1,
      zIndex: project.layers.length + 1,
      isVisible: true,
      contrast: 1.15,
      saturation: 1.2,
      brightness: 1,
    };
    const updated = [...project.layers, newImage];
    setProject((p) => ({ ...p, layers: updated }));
    setSelectedLayerId(newImage.id);
    pushToHistory(updated, project.backgroundColor);
  };

  const handleAddVectorLayer = () => {
    const newVector: VectorLayer = {
      id: `vector_${Date.now()}`,
      type: 'vector',
      name: 'Dynamic Swoosh',
      x: 15,
      y: 25,
      width: 70,
      height: 50,
      rotation: 0,
      opacity: 0.95,
      zIndex: project.layers.length + 3,
      isVisible: true,
      points: [
        { x: 0, y: 75 },
        { x: 30, y: 15 },
        { x: 65, y: 85 },
        { x: 100, y: 20 },
      ],
      strokeColor: '#FFE600',
      strokeWidth: 12,
      fillColor: 'transparent',
      isClosed: false,
      curveType: 'smooth',
    };
    const updated = [...project.layers, newVector];
    setProject((p) => ({ ...p, layers: updated }));
    setSelectedLayerId(newVector.id);
    pushToHistory(updated, project.backgroundColor);
  };

  // 1-Click Apply Brand Palette
  const handleApplyPalette = (palette: BrandPalette) => {
    const updatedLayers = project.layers.map((layer) => {
      if (layer.type === 'text') {
        const textL = layer as TextLayer;
        return {
          ...textL,
          color: palette.textColor,
          strokeColor: palette.textStroke,
          shadowColor: `${palette.accent}99`,
        };
      }
      if (layer.type === 'sticker') {
        const stickerL = layer as StickerLayer;
        return {
          ...stickerL,
          color: palette.primary,
          secondaryColor: palette.secondary,
        };
      }
      return layer;
    });

    setProject((p) => ({
      ...p,
      backgroundColor: palette.background,
      activePaletteId: palette.id,
      layers: updatedLayers,
    }));
    pushToHistory(updatedLayers, palette.background);
  };

  // 1-Click Load Template
  const handleSelectTemplate = (template: ThumbnailTemplate) => {
    setProject((p) => ({
      ...p,
      layers: template.layers,
      backgroundColor: template.backgroundColor,
      activePaletteId: template.paletteId,
    }));
    setSelectedLayerId(template.layers[0]?.id || null);
    pushToHistory(template.layers, template.backgroundColor);
  };

  // 1-Click Apply AI Concept
  const handleApplyConcept = (concept: AIConceptIdea) => {
    let textUpdated = false;
    const updatedLayers = project.layers.map((layer) => {
      if (layer.type === 'text' && !textUpdated) {
        textUpdated = true;
        const textL = layer as TextLayer;
        return {
          ...textL,
          text: concept.overlayText,
          color: concept.primaryColor || '#FFE600',
          shadowColor: `${concept.accentColor || '#FF0055'}80`,
          strokeColor: '#000000',
        };
      }
      return layer;
    });

    if (!textUpdated) {
      handleAddTextLayer({
        text: concept.overlayText,
        color: concept.primaryColor || '#FFE600',
        strokeColor: '#000000',
        fontSize: 82,
      });
      return;
    }

    setProject((p) => ({ ...p, layers: updatedLayers }));
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  // 1-Click Apply Text Style Preset
  const handleApplyTextStyle = (preset: TextStylePreset) => {
    const currentSelected = project.layers.find((l) => l.id === selectedLayerId);
    if (currentSelected && currentSelected.type === 'text') {
      const updated = project.layers.map((l) => {
        if (l.id === currentSelected.id) {
          return {
            ...l,
            fontFamily: preset.fontFamily,
            fontSize: preset.fontSize,
            fontWeight: preset.fontWeight,
            color: preset.color,
            gradientColor: preset.gradientColor,
            useGradient: preset.useGradient,
            strokeColor: preset.strokeColor,
            strokeWidth: preset.strokeWidth,
            shadowColor: preset.shadowColor,
            shadowBlur: preset.shadowBlur,
            shadowOffsetX: preset.shadowOffsetX,
            shadowOffsetY: preset.shadowOffsetY,
            isUppercase: preset.isUppercase ?? true,
            rotation: preset.rotation ?? l.rotation,
            hasBackgroundBadge: preset.hasBackgroundBadge,
            badgeColor: preset.badgeColor,
            badgePadding: preset.badgePadding,
            badgeRadius: preset.badgeRadius,
          } as TextLayer;
        }
        return l;
      });
      setProject((p) => ({ ...p, layers: updated }));
      pushToHistory(updated, project.backgroundColor);
    } else {
      handleAddTextLayer({
        text: preset.name.toUpperCase(),
        color: preset.color,
        strokeColor: preset.strokeColor,
        fontSize: preset.fontSize,
      });
    }
  };

  // 1-Click AI Design Assistant Preset Apply
  const handleApplyAssistantPreset = (preset: {
    overlayText: string;
    primaryColor: string;
    accentColor: string;
    layoutAdvice: string;
  }) => {
    let replacedText = false;
    const updatedLayers = project.layers.map((l) => {
      if (l.type === 'text' && !replacedText) {
        replacedText = true;
        const t = l as TextLayer;
        return {
          ...t,
          text: preset.overlayText,
          color: preset.primaryColor,
          shadowColor: `${preset.accentColor}80`,
          strokeColor: '#000000',
          strokeWidth: 10,
        };
      }
      return l;
    });

    setProject((p) => ({ ...p, layers: updatedLayers }));
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  // 1-Click Apply AI Generated Text-To-Thumbnail
  const handleApplyGeneratedThumbnail = (layers: CanvasLayer[], backgroundColor: string, title: string) => {
    setProject((p) => ({
      ...p,
      title: title || p.title,
      layers,
      backgroundColor: backgroundColor || p.backgroundColor,
    }));
    setSelectedLayerId(layers[0]?.id || null);
    pushToHistory(layers, backgroundColor || project.backgroundColor);
  };

  // Insert Brand Kit Asset
  const handleInsertBrandKitItem = (item: BrandKitItem) => {
    if (item.src) {
      handleAddImageLayer(item.src, item.name);
    }
    setIsBrandKitOpen(false);
  };

  // 1-Click AI Auto Enhancements
  const handleAIMagicPunch = () => {
    const updatedLayers = project.layers.map((l) => {
      if (l.type === 'image') {
        const img = l as ImageLayer;
        return {
          ...img,
          contrast: Math.min(1.8, (img.contrast || 1) * 1.2),
          saturation: Math.min(1.8, (img.saturation || 1) * 1.25),
          hasVignette: true,
        };
      }
      if (l.type === 'text') {
        const txt = l as TextLayer;
        return {
          ...txt,
          strokeWidth: Math.max(8, (txt.strokeWidth || 0) + 2),
          shadowBlur: Math.max(16, (txt.shadowBlur || 0) + 6),
        };
      }
      return l;
    });
    setProject((p) => ({ ...p, layers: updatedLayers }));
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  const handleAIMobileOptimize = () => {
    const updatedLayers = project.layers.map((l) => {
      if (l.type === 'text') {
        const txt = l as TextLayer;
        return {
          ...txt,
          fontSize: Math.min(110, Math.round(txt.fontSize * 1.15)),
          strokeWidth: Math.max(10, (txt.strokeWidth || 0) + 3),
          isUppercase: true,
        };
      }
      return l;
    });
    setProject((p) => ({ ...p, layers: updatedLayers }));
    pushToHistory(updatedLayers, project.backgroundColor);
  };

  const handleApplyAutoFix = (fixTitle: string) => {
    if (fixTitle.toLowerCase().includes('glow') || fixTitle.toLowerCase().includes('ambient')) {
      const updated = project.layers.map((l) =>
        l.type === 'text' ? { ...(l as TextLayer), shadowBlur: 28, shadowColor: 'rgba(255, 230, 0, 0.6)' } : l
      );
      setProject((p) => ({ ...p, layers: updated }));
      pushToHistory(updated, project.backgroundColor);
    } else if (fixTitle.toLowerCase().includes('angle') || fixTitle.toLowerCase().includes('tilt')) {
      const updated = project.layers.map((l) =>
        l.type === 'text' ? { ...(l as TextLayer), rotation: -4 } : l
      );
      setProject((p) => ({ ...p, layers: updated }));
      pushToHistory(updated, project.backgroundColor);
    } else {
      handleAIMagicPunch();
    }
  };

  // Quick Export (1280x720 PNG download immediately)
  const handleQuickExport = async () => {
    const preset = PLATFORM_PRESETS[0]; // YouTube HD
    const { dataUrl } = await exportPresetToBlob(preset, project.layers, project.backgroundColor, 'image/png');
    downloadSingleThumbnail(
      dataUrl,
      `${project.title.toLowerCase().replace(/\s+/g, '-')}-youtube-1280x720.png`
    );
  };

  // Pin Placement
  const handlePlacePin = async (x: number, y: number) => {
    setIsAddingPin(false);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          author: 'Alex Rivera',
          role: 'Lead Creator',
          x,
          y,
          text: `Review note at coordinates ${Math.round(x)}%, ${Math.round(y)}%`,
        }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setIsCollabOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCommentFromModal = async (text: string, author: string, role: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          author,
          role,
          x: 50,
          y: 50,
          text,
        }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleResolveComment = async (id: string) => {
    try {
      const res = await fetch(`/api/comments/${id}/toggle-resolve`, { method: 'PATCH' });
      const data = await res.json();
      if (data.comment) {
        setComments((prev) => prev.map((c) => (c.id === id ? data.comment : c)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId) || null;
  const unresolvedComments = comments.filter((c) => !c.resolved).length;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0e0e11] text-zinc-100 overflow-hidden font-sans">
      {/* Consolidated Top Header Bar */}
      <Header
        project={project}
        onUpdateTitle={(title) => setProject((p) => ({ ...p, title }))}
        onUpdateStatus={(status) => setProject((p) => ({ ...p, status }))}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenTextToThumbnail={() => setIsTextToThumbnailOpen(true)}
        onOpenSEO={() => setIsSEOOpen(true)}
        onOpenFeedSim={() => setIsFeedSimOpen(true)}
        onOpenCollab={() => setIsCollabOpen(true)}
        onOpenABTest={() => setIsABTestOpen(true)}
        onOpenCompetitorBenchmark={() => setIsCompetitorOpen(true)}
        onOpenBulkExport={() => setIsBulkExportOpen(true)}
        onQuickExport={handleQuickExport}
        zoom={zoom}
        onZoomChange={setZoom}
        onFitToScreen={() => setZoom(1)}
        showGuides={showGuides}
        onToggleGuides={() => setShowGuides(!showGuides)}
        showTimestampShield={showTimestampShield}
        onToggleTimestampShield={() => setShowTimestampShield(!showTimestampShield)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isHeatmapActive={isHeatmapActive}
        onToggleHeatmap={() => setIsHeatmapActive(!isHeatmapActive)}
        stressTestMode={stressTestMode}
        onChangeStressTestMode={setStressTestMode}
        unresolvedCommentCount={unresolvedComments}
        isSavedToCloud={true}
      />

      {/* Main Three-Panel Workspace: Left Asset Library, Center Interactive Canvas, Right Contextual Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Asset & Tool Library */}
        <Sidebar
          layers={project.layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onAddTextLayer={handleAddTextLayer}
          onAddStickerLayer={handleAddStickerLayer}
          onAddImageLayer={handleAddImageLayer}
          onAddVectorLayer={handleAddVectorLayer}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onReorderLayers={(newLayers) => {
            setProject((p) => ({ ...p, layers: newLayers }));
            pushToHistory(newLayers, project.backgroundColor);
          }}
          onApplyPalette={handleApplyPalette}
          onOpenAIImageGen={() => setIsAIImageGenOpen(true)}
          onAIMagicPunch={handleAIMagicPunch}
          onAIMobileOptimize={handleAIMobileOptimize}
          onOpenTextToThumbnail={() => setIsTextToThumbnailOpen(true)}
          onOpenSEO={() => setIsSEOOpen(true)}
          onOpenBrandKit={() => setIsBrandKitOpen(true)}
          onApplyTextStyle={handleApplyTextStyle}
          isCollapsed={isLeftCollapsed}
          onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
        />

        {/* Center: Main Interactive Canvas with isolated neutral workbench backdrop */}
        <CanvasEditor
          layers={project.layers}
          backgroundColor={project.backgroundColor}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          comments={comments}
          isAddingPin={isAddingPin}
          onCancelAddPin={() => setIsAddingPin(false)}
          onPlacePin={handlePlacePin}
          onSelectPin={(_c) => setIsCollabOpen(true)}
          isHeatmapActive={isHeatmapActive}
          heatmapHotspots={heatmapHotspots}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          zoom={zoom}
          onZoomChange={setZoom}
          showGuides={showGuides}
          onToggleGuides={() => setShowGuides(!showGuides)}
          showTimestampShield={showTimestampShield}
          onToggleTimestampShield={() => setShowTimestampShield(!showTimestampShield)}
          stressTestMode={stressTestMode}
        />

        {/* Right: Contextual Properties Inspector & Full-Scale Layer Management */}
        <StylePanel
          layers={project.layers}
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onApplyTextStyle={handleApplyTextStyle}
          backgroundColor={project.backgroundColor}
          onChangeBackgroundColor={(color) => {
            setProject((p) => ({ ...p, backgroundColor: color }));
            pushToHistory(project.layers, color);
          }}
          onAddTextLayer={handleAddTextLayer}
          isCollapsed={isRightCollapsed}
          onToggleCollapse={() => setIsRightCollapsed(!isRightCollapsed)}
        />
      </div>

      {/* Mobile Floating Viewport Quick Controls for small screens */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-[#0e0e11]/95 backdrop-blur-md border border-zinc-800 p-1 rounded-full shadow-2xl md:hidden">
        <button
          onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors ${
            !isLeftCollapsed ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          <span>Assets</span>
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          title="Reset Zoom to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors ${
            !isRightCollapsed ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          <span>Inspector</span>
        </button>
      </div>

      {/* Modals & Workflow Engines */}
      <TemplateLibraryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <TextToThumbnailModal
        isOpen={isTextToThumbnailOpen}
        onClose={() => setIsTextToThumbnailOpen(false)}
        onApplyGeneratedThumbnail={handleApplyGeneratedThumbnail}
      />

      <YouTubeSEOSuiteModal
        isOpen={isSEOOpen}
        onClose={() => setIsSEOOpen(false)}
        videoTitle={project.title}
        onUpdateTitle={(title) => setProject((p) => ({ ...p, title }))}
        thumbnailOverlayText={
          (project.layers.find((l) => l.type === 'text') as TextLayer)?.text || 'VIRAL HOOK'
        }
        genre={project.niche}
      />

      <CompetitorBenchmarkModal
        isOpen={isCompetitorOpen}
        onClose={() => setIsCompetitorOpen(false)}
        videoTitle={project.title}
        layers={project.layers}
        backgroundColor={project.backgroundColor}
      />

      <BrandKitModal
        isOpen={isBrandKitOpen}
        onClose={() => setIsBrandKitOpen(false)}
        onInsertAsset={handleInsertBrandKitItem}
      />

      <AIIdeasPanel
        isOpen={isAIIdeasOpen}
        onClose={() => setIsAIIdeasOpen(false)}
        videoTitle={project.title}
        niche={project.niche}
        onApplyConcept={handleApplyConcept}
      />

      <AIImageGenModal
        isOpen={isAIImageGenOpen}
        onClose={() => setIsAIImageGenOpen(false)}
        onImageGenerated={(src, name) => handleAddImageLayer(src, name)}
      />

      <BulkExportModal
        isOpen={isBulkExportOpen}
        onClose={() => setIsBulkExportOpen(false)}
        projectTitle={project.title}
        layers={project.layers}
        backgroundColor={project.backgroundColor}
      />

      <FeedSimulatorModal
        isOpen={isFeedSimOpen}
        onClose={() => setIsFeedSimOpen(false)}
        videoTitle={project.title}
        layers={project.layers}
        backgroundColor={project.backgroundColor}
      />

      <AIReportModal
        isOpen={isAIReportOpen}
        onClose={() => setIsAIReportOpen(false)}
        videoTitle={project.title}
        niche={project.niche}
        layers={project.layers}
        backgroundColor={project.backgroundColor}
        onApplyAutoFix={handleApplyAutoFix}
        onToggleHeatmap={(hotspots) => {
          setHeatmapHotspots(hotspots);
          setIsHeatmapActive(true);
        }}
      />

      <CollaborativeWorkspaceModal
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
        status={project.status}
        onUpdateStatus={(st) => setProject((p) => ({ ...p, status: st }))}
        comments={comments}
        onAddComment={handleAddCommentFromModal}
        onToggleResolveComment={handleToggleResolveComment}
        onDeleteComment={handleDeleteComment}
        onStartAddPin={() => setIsAddingPin(true)}
      />

      <AIDesignAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        videoTitle={project.title}
        niche={project.niche}
        onApplyPreset={handleApplyAssistantPreset}
      />

      <ABTestingStudioModal
        isOpen={isABTestOpen}
        onClose={() => setIsABTestOpen(false)}
        videoTitle={project.title}
        currentLayers={project.layers}
        currentBgColor={project.backgroundColor}
        onApplyVariantToCanvas={(url) => handleAddImageLayer(url, 'AB Test Variant Backdrop')}
      />
    </div>
  );
}
