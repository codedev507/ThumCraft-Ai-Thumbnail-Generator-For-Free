import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  ShieldAlert,
  Flame,
  Undo2,
  Redo2,
  MessageSquarePlus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
} from 'lucide-react';
import { CanvasLayer, ReviewComment } from '../types/thumbnail';
import { renderThumbnailCanvas } from '../utils/canvasRender';

interface CanvasEditorProps {
  layers: CanvasLayer[];
  backgroundColor: string;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  onUpdateLayer: (updatedLayer: CanvasLayer) => void;
  onDeleteLayer: (layerId: string) => void;
  onDuplicateLayer: (layerId: string) => void;
  onBringForward: (layerId: string) => void;
  onSendBackward: (layerId: string) => void;
  comments: ReviewComment[];
  isAddingPin: boolean;
  onCancelAddPin: () => void;
  onPlacePin: (x: number, y: number) => void;
  onSelectPin: (comment: ReviewComment) => void;
  isHeatmapActive: boolean;
  heatmapHotspots?: { x: number; y: number; intensity: number; label: string }[];
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom?: number;
  onZoomChange?: (newZoom: number) => void;
  showGuides?: boolean;
  onToggleGuides?: () => void;
  showTimestampShield?: boolean;
  onToggleTimestampShield?: () => void;
  stressTestMode?: import('../types/thumbnail').CTRStressTestMode;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  layers,
  backgroundColor,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onBringForward,
  onSendBackward,
  comments,
  isAddingPin,
  onCancelAddPin,
  onPlacePin,
  onSelectPin,
  isHeatmapActive,
  heatmapHotspots,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom: zoomProp,
  onZoomChange,
  showGuides: showGuidesProp,
  showTimestampShield: showTimestampShieldProp,
  stressTestMode = 'normal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [localZoom, setLocalZoom] = useState<number>(1);
  const [localShowGuides, setLocalShowGuides] = useState<boolean>(true);
  const [localShowTimestampShield, setLocalShowTimestampShield] = useState<boolean>(true);

  const zoom = zoomProp !== undefined ? zoomProp : localZoom;
  const setZoom = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(zoom) : val;
    if (onZoomChange) {
      onZoomChange(nextVal);
    } else {
      setLocalZoom(nextVal);
    }
  };

  const showGuides = showGuidesProp !== undefined ? showGuidesProp : localShowGuides;
  const showTimestampShield =
    showTimestampShieldProp !== undefined ? showTimestampShieldProp : localShowTimestampShield;

  // Dragging and resizing states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragHandle, setDragHandle] = useState<'move' | 'nw' | 'ne' | 'se' | 'sw' | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [layerInitialBox, setLayerInitialBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  // Render canvas whenever layers, background, or visual toggles change
  useEffect(() => {
    if (!canvasRef.current) return;
    renderThumbnailCanvas({
      canvas: canvasRef.current,
      layers,
      backgroundColor,
      width: 1280,
      height: 720,
      showGuides,
      showTimestampShield,
      showHeatmap: isHeatmapActive,
      heatmapHotspots,
      stressTestMode,
    });
  }, [layers, backgroundColor, showGuides, showTimestampShield, isHeatmapActive, heatmapHotspots, stressTestMode]);

  // Auto-fit zoom based on container width
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 80;
    const containerHeight = containerRef.current.clientHeight - 80;
    const scaleX = containerWidth / 1280;
    const scaleY = containerHeight / 720;
    const fitScale = Math.min(scaleX, scaleY, 1);
    const calculated = Math.max(0.35, Math.round(fitScale * 100) / 100);
    if (onZoomChange) {
      onZoomChange(calculated);
    } else {
      setLocalZoom(calculated);
    }
  }, [onZoomChange]);

  useEffect(() => {
    handleFitToScreen();
    window.addEventListener('resize', handleFitToScreen);
    return () => window.removeEventListener('resize', handleFitToScreen);
  }, [handleFitToScreen]);

  // Handle Canvas Mouse Clicks & Pin Placement
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (isAddingPin) {
      onPlacePin(clickX, clickY);
      return;
    }

    // Hit test layers from highest zIndex to lowest
    const sorted = [...layers]
      .filter((l) => l.isVisible !== false && !l.isLocked)
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

    const hit = sorted.find((l) => {
      return (
        clickX >= l.x &&
        clickX <= l.x + l.width &&
        clickY >= l.y &&
        clickY <= l.y + l.height
      );
    });

    if (hit) {
      onSelectLayer(hit.id);
    } else {
      onSelectLayer(null);
    }
  };

  // Start Dragging or Resizing
  const handleMouseDownHandle = (
    e: React.MouseEvent,
    handle: 'move' | 'nw' | 'ne' | 'se' | 'sw'
  ) => {
    e.stopPropagation();
    if (!selectedLayer || selectedLayer.isLocked) return;

    setIsDragging(true);
    setDragHandle(handle);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setLayerInitialBox({
      x: selectedLayer.x,
      y: selectedLayer.y,
      width: selectedLayer.width,
      height: selectedLayer.height,
    });
  };

  // Drag / Resize Movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !selectedLayer || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - dragStartPos.x) / canvasRect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartPos.y) / canvasRect.height) * 100;

      if (dragHandle === 'move') {
        const newX = Math.round((layerInitialBox.x + deltaXPercent) * 10) / 10;
        const newY = Math.round((layerInitialBox.y + deltaYPercent) * 10) / 10;
        onUpdateLayer({
          ...selectedLayer,
          x: Math.max(-20, Math.min(100, newX)),
          y: Math.max(-20, Math.min(100, newY)),
        });
      } else if (dragHandle === 'se') {
        const newWidth = Math.max(5, Math.round((layerInitialBox.width + deltaXPercent) * 10) / 10);
        const newHeight = Math.max(5, Math.round((layerInitialBox.height + deltaYPercent) * 10) / 10);
        onUpdateLayer({
          ...selectedLayer,
          width: newWidth,
          height: newHeight,
        });
      } else if (dragHandle === 'sw') {
        const newWidth = Math.max(5, Math.round((layerInitialBox.width - deltaXPercent) * 10) / 10);
        const newX = Math.round((layerInitialBox.x + deltaXPercent) * 10) / 10;
        const newHeight = Math.max(5, Math.round((layerInitialBox.height + deltaYPercent) * 10) / 10);
        onUpdateLayer({
          ...selectedLayer,
          x: newX,
          width: newWidth,
          height: newHeight,
        });
      } else if (dragHandle === 'ne') {
        const newWidth = Math.max(5, Math.round((layerInitialBox.width + deltaXPercent) * 10) / 10);
        const newHeight = Math.max(5, Math.round((layerInitialBox.height - deltaYPercent) * 10) / 10);
        const newY = Math.round((layerInitialBox.y + deltaYPercent) * 10) / 10;
        onUpdateLayer({
          ...selectedLayer,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      } else if (dragHandle === 'nw') {
        const newWidth = Math.max(5, Math.round((layerInitialBox.width - deltaXPercent) * 10) / 10);
        const newHeight = Math.max(5, Math.round((layerInitialBox.height - deltaYPercent) * 10) / 10);
        const newX = Math.round((layerInitialBox.x + deltaXPercent) * 10) / 10;
        const newY = Math.round((layerInitialBox.y + deltaYPercent) * 10) / 10;
        onUpdateLayer({
          ...selectedLayer,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragHandle(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragHandle, dragStartPos, layerInitialBox, selectedLayer, onUpdateLayer]);

  return (
    <div className="flex-1 flex flex-col bg-[#1e2024] overflow-hidden relative">
      {/* Floating Notification / Pin Placement Banner if active */}
      {isAddingPin && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-indigo-400/30 animate-bounce">
          <MessageSquarePlus className="w-4 h-4" />
          <span>Click anywhere on the thumbnail to drop a review pin</span>
          <button
            onClick={onCancelAddPin}
            className="text-white/80 hover:text-white font-bold ml-2 bg-black/20 hover:bg-black/40 rounded-full w-5 h-5 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Interactive Canvas Viewport */}
      <div
        ref={containerRef}
        onClick={() => {
          if (!isAddingPin) onSelectLayer(null);
        }}
        className="flex-1 flex items-center justify-center p-8 overflow-auto select-none bg-[#18191c] bg-[radial-gradient(#2d3036_1.5px,transparent_1.5px)] [background-size:24px_24px] cursor-default relative"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 1280 * zoom,
            height: 720 * zoom,
            transformOrigin: 'center center',
          }}
          className="relative shadow-2xl shadow-black/80 rounded-lg overflow-hidden border border-zinc-800 transition-transform duration-75"
        >
          {/* HTML5 Native Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block pointer-events-none"
            width={1280}
            height={720}
          />

          {/* Interactive Layer & Selection Overlay */}
          <div
            onClick={handleCanvasClick}
            className={`absolute inset-0 z-20 ${
              isAddingPin ? 'cursor-crosshair' : 'cursor-default'
            }`}
          >
            {/* Selected Layer Bounding Box & Handles */}
            {selectedLayer && !selectedLayer.isLocked && (
              <div
                style={{
                  left: `${selectedLayer.x}%`,
                  top: `${selectedLayer.y}%`,
                  width: `${selectedLayer.width}%`,
                  height: `${selectedLayer.height}%`,
                  transform: `rotate(${selectedLayer.rotation || 0}deg)`,
                }}
                className="absolute border-2 border-red-500 pointer-events-auto group shadow-sm shadow-red-500/50"
              >
                {/* Drag Move Handle Area */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'move')}
                  className="w-full h-full cursor-move bg-red-500/5"
                  title="Drag to reposition layer"
                />

                {/* Corner Resize Handles */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'nw')}
                  className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-red-500 rounded-sm cursor-nwse-resize shadow"
                />
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'ne')}
                  className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-red-500 rounded-sm cursor-nesw-resize shadow"
                />
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'sw')}
                  className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-red-500 rounded-sm cursor-nesw-resize shadow"
                />
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'se')}
                  className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-red-500 rounded-sm cursor-nwse-resize shadow"
                />

                {/* Layer Name Tag on Hover */}
                <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                  {selectedLayer.name}
                </div>
              </div>
            )}

            {/* Collaborative Review Pin Markers on Canvas */}
            {comments.map((comment, index) => (
              <button
                key={comment.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPin(comment);
                }}
                style={{
                  left: `${comment.x}%`,
                  top: `${comment.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-30 group flex items-center justify-center pointer-events-auto transition-transform hover:scale-110 active:scale-95 ${
                  comment.resolved ? 'opacity-50' : 'opacity-100'
                }`}
                title={`Review Pin #${index + 1}: ${comment.author} - "${comment.text}"`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-xl border-2 transition-all ${
                    comment.resolved
                      ? 'bg-zinc-700 text-zinc-300 border-zinc-500'
                      : 'bg-indigo-600 text-white border-white ring-2 ring-indigo-500/50 animate-bounce'
                  }`}
                >
                  {index + 1}
                </div>
                {/* Floating tooltip */}
                <div className="absolute left-8 hidden group-hover:block bg-zinc-900 border border-zinc-700 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap z-40 max-w-xs">
                  <div className="font-bold text-indigo-400">{comment.author}</div>
                  <div className="text-zinc-300 text-[11px] truncate">{comment.text}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status & Dimension Bar */}
      <div className="h-7 border-t border-zinc-800 bg-zinc-900/90 px-4 flex items-center justify-between text-[11px] text-zinc-400 z-10 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="font-mono text-zinc-300 font-bold">1280 × 720 px</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">YouTube 16:9 HD</span>
          <span className="text-zinc-500">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OLED High-Contrast Ready
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>{layers.length} Active Layers</span>
          <span className="text-zinc-500">•</span>
          <span>{selectedLayer ? `Selected: ${selectedLayer.name}` : 'Click any element to edit'}</span>
        </div>
      </div>
    </div>
  );
};
