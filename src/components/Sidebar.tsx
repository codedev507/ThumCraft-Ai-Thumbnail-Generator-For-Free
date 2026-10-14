import React, { useState } from 'react';
import {
  Type,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Folder,
  Plus,
  Flame,
  ArrowRight,
  Upload,
  PenTool,
  Sliders,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  Wand2,
} from 'lucide-react';
import { CanvasLayer, BrandPalette, TextLayer } from '../types/thumbnail';
import { BRAND_PALETTES } from '../constants/palettes';
import { PRESET_STICKERS, PRESET_BACKDROPS } from '../constants/stickers';
import { PRESET_TEXT_STYLES, TextStylePreset } from '../constants/textStyles';

interface SidebarProps {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onAddTextLayer: (preset?: { text: string; color: string; strokeColor: string; fontSize: number }) => void;
  onAddStickerLayer: (sticker: (typeof PRESET_STICKERS)[0]) => void;
  onAddImageLayer: (src: string, name?: string) => void;
  onAddVectorLayer: () => void;
  onUpdateLayer: (layer: CanvasLayer) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorderLayers: (newLayers: CanvasLayer[]) => void;
  onApplyPalette: (palette: BrandPalette) => void;
  onOpenAIImageGen: () => void;
  onAIMagicPunch: () => void;
  onAIMobileOptimize: () => void;
  onOpenTextToThumbnail: () => void;
  onOpenSEO: () => void;
  onOpenBrandKit: () => void;
  onApplyTextStyle: (style: TextStylePreset) => void;
  // Collapsible panel state
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onAddTextLayer,
  onAddStickerLayer,
  onAddImageLayer,
  onAddVectorLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onReorderLayers,
  onApplyPalette,
  onOpenAIImageGen,
  onAIMagicPunch,
  onAIMobileOptimize,
  onOpenTextToThumbnail,
  onOpenSEO,
  onOpenBrandKit,
  onApplyTextStyle,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'ai' | 'palettes' | 'backdrops'>('elements');

  // Custom Palette state
  const [customPrimary, setCustomPrimary] = useState('#FFE600');
  const [customAccent, setCustomAccent] = useState('#00F0FF');
  const [customBg, setCustomBg] = useState('#0B0F19');

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onAddImageLayer(result, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  // If collapsed, show clean minimal vertical icon rail
  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-zinc-800 bg-[#0e0e11] flex flex-col items-center py-3 select-none z-20 shrink-0 space-y-4">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="Expand Left Panel (>)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-6 h-px bg-zinc-800" />

        <button
          onClick={() => {
            onToggleCollapse();
            setActiveTab('elements');
          }}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          title="Assets & Elements"
        >
          <Type className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onToggleCollapse();
            setActiveTab('ai');
          }}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          title="AI Studio Suite"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onToggleCollapse();
            setActiveTab('palettes');
          }}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          title="Brand Palettes"
        >
          <Palette className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onToggleCollapse();
            setActiveTab('backdrops');
          }}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          title="Studio Backdrops"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenBrandKit}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          title="Brand Asset Kit"
        >
          <Folder className="w-4 h-4" />
        </button>

        <button
          onClick={onAddVectorLayer}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          title="Vector Pen Tool"
        >
          <PenTool className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-zinc-800 bg-[#0e0e11] flex flex-col h-[calc(100vh-3rem)] shrink-0 select-none z-20 transition-all">
      {/* Top Tab Bar & Collapse Button */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-2 py-1.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('elements')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'elements' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Elements
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'ai' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI Suite
          </button>
          <button
            onClick={() => setActiveTab('palettes')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'palettes' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Palettes
          </button>
          <button
            onClick={() => setActiveTab('backdrops')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'backdrops' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Backdrops
          </button>
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="Collapse Panel (<)"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 text-xs text-zinc-300">
        {/* ================= 1. ELEMENTS TAB ================= */}
        {activeTab === 'elements' && (
          <div className="space-y-4">
            {/* Quick Text Overlays - Clean Muted Grey Tiles */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-zinc-300 text-xs">Text Overlays</span>
                <span className="text-[10px] text-zinc-500">Click to add</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    onAddTextLayer({
                      text: 'VIRAL HOOK',
                      color: '#FFE600',
                      strokeColor: '#000000',
                      fontSize: 78,
                    })
                  }
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left transition-all hover:scale-[1.01]"
                >
                  <div className="font-bold text-zinc-100 text-xs font-['Anton'] tracking-wide">
                    VIRAL HOOK
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Primary hook</div>
                </button>

                <button
                  onClick={() =>
                    onAddTextLayer({
                      text: 'THEY LIED!',
                      color: '#EF4444',
                      strokeColor: '#FFFFFF',
                      fontSize: 74,
                    })
                  }
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left transition-all hover:scale-[1.01]"
                >
                  <div className="font-bold text-zinc-100 text-xs font-['Anton'] tracking-wide">
                    THEY LIED!
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">High drama</div>
                </button>

                <button
                  onClick={() =>
                    onAddTextLayer({
                      text: '10X FASTER',
                      color: '#8B5CF6',
                      strokeColor: '#000000',
                      fontSize: 70,
                    })
                  }
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left transition-all hover:scale-[1.01]"
                >
                  <div className="font-bold text-zinc-100 text-xs font-['Montserrat'] tracking-wide">
                    10X FASTER
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Tech authority</div>
                </button>

                <button
                  onClick={() =>
                    onAddTextLayer({
                      text: 'FREE GUIDE',
                      color: '#10B981',
                      strokeColor: '#000000',
                      fontSize: 68,
                    })
                  }
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left transition-all hover:scale-[1.01]"
                >
                  <div className="font-bold text-zinc-100 text-xs font-['Anton'] tracking-wide">
                    FREE GUIDE
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Outcome badge</div>
                </button>
              </div>
            </div>

            {/* Pro Vector Pen & Custom Shape Tool */}
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200 text-xs flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Vector Pen & Framing Shapes</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Draw custom vector curves, curved framing masks, and accent swooshes.
              </p>
              <button
                onClick={onAddVectorLayer}
                className="w-full py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-md border border-zinc-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vector Shape Path</span>
              </button>
            </div>

            {/* Preset Typography Designs (1-Click Styling) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-zinc-300 text-xs">Viral Typography Presets</span>
                <span className="text-[10px] text-zinc-500">1-click apply</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                {PRESET_TEXT_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onApplyTextStyle(style)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-left transition-all group shadow-sm"
                  >
                    <div
                      className="truncate text-sm font-black"
                      style={{
                        fontFamily: style.fontFamily,
                        color: style.color,
                        WebkitTextStroke: style.strokeWidth ? `1px ${style.strokeColor}` : undefined,
                      }}
                    >
                      {style.name}
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-0.5 truncate">{style.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Clickbait Badges - Clean Muted Tiles */}
            <div>
              <span className="font-semibold text-zinc-300 text-xs block mb-1.5">
                Badges & Action Stamps
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {PRESET_STICKERS.filter((s) => s.category === 'badges').map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => onAddStickerLayer(sticker)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-center font-bold font-['Anton'] text-[11px] text-zinc-200 truncate transition-colors"
                  >
                    {sticker.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Viral Red Arrows & Focal Circles */}
            <div>
              <span className="font-semibold text-zinc-300 text-xs block mb-1.5">
                Arrows & Focus Circles
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESET_STICKERS.filter((s) => s.category === 'arrows').map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => onAddStickerLayer(sticker)}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    <span className="text-xl leading-none text-red-500 font-black">{sticker.label}</span>
                    <span className="text-[10px] text-zinc-400 truncate w-full text-center">{sticker.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Brand Asset Kit Trigger */}
            <div className="pt-1">
              <button
                onClick={onOpenBrandKit}
                className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-200 text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-indigo-400" />
                  <span>My Brand Asset Kit</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>

            {/* Custom Upload */}
            <div>
              <label className="flex flex-col items-center justify-center border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 rounded-lg p-3 cursor-pointer transition-colors text-center">
                <Upload className="w-4 h-4 text-zinc-400 mb-1" />
                <span className="text-xs font-medium text-zinc-300">Upload Cutout / Image</span>
                <input type="file" accept="image/*" onChange={handleCustomFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* ================= 2. AI SUITE TAB ================= */}
        {activeTab === 'ai' && (
          <div className="space-y-3.5">
            {/* AI Text-to-Thumbnail */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Text-to-Thumbnail AI</span>
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Type your script or raw video idea — Gemini generates the artwork, hook text, and viral layout in one shot.
              </p>
              <button
                onClick={onOpenTextToThumbnail}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>One-Click Text-to-Thumbnail</span>
              </button>
            </div>

            {/* 100% YouTube SEO Suite */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% YouTube SEO Suite</span>
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  RANK #1
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Audit Title-Thumbnail Curiosity Synergy, mobile character length truncation, search tags & chapters.
              </p>
              <button
                onClick={onOpenSEO}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs rounded-lg border border-zinc-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Launch YouTube SEO Suite</span>
              </button>
            </div>

            {/* 1-Click AI Enhancers */}
            <div className="space-y-1.5 pt-1">
              <span className="font-semibold text-zinc-300 text-xs block">Quick AI Actions</span>
              <button
                onClick={onAIMagicPunch}
                className="w-full p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium text-xs text-zinc-200">AI Contrast & Color Punch</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              <button
                onClick={onAIMobileOptimize}
                className="w-full p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-medium text-xs text-zinc-200">Mobile Screen Optimizer</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              <button
                onClick={onOpenAIImageGen}
                className="w-full p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium text-xs text-zinc-200">AI Custom Backdrop</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. PALETTES TAB ================= */}
        {activeTab === 'palettes' && (
          <div className="space-y-3">
            <span className="font-semibold text-zinc-300 text-xs block">High-CTR Color Palettes</span>
            <div className="space-y-2">
              {BRAND_PALETTES.map((palette) => (
                <div
                  key={palette.id}
                  onClick={() => onApplyPalette(palette)}
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200 text-xs">{palette.name}</span>
                    <span className="text-[10px] text-zinc-500">Apply</span>
                  </div>
                  <div className="flex items-center gap-1 h-5 rounded overflow-hidden p-0.5 bg-zinc-950">
                    <div className="flex-1 h-full rounded" style={{ backgroundColor: palette.primary }} />
                    <div className="flex-1 h-full rounded" style={{ backgroundColor: palette.secondary }} />
                    <div className="flex-1 h-full rounded" style={{ backgroundColor: palette.accent }} />
                    <div className="w-5 h-full rounded border border-zinc-700" style={{ backgroundColor: palette.background }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. BACKDROPS TAB ================= */}
        {activeTab === 'backdrops' && (
          <div className="space-y-3">
            <span className="font-semibold text-zinc-300 text-xs block">Studio Backdrops</span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_BACKDROPS.map((bg) => (
                <div
                  key={bg.id}
                  onClick={() => onAddImageLayer(bg.url, bg.name)}
                  className="group relative rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 aspect-video cursor-pointer transition-all"
                >
                  <img src={bg.url} alt={bg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                    <span className="text-[10px] font-semibold text-white truncate">{bg.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
