import React, { useState } from 'react';
import {
  Type,
  Maximize,
  RotateCw,
  Palette,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Sun,
  Thermometer,
  ChevronRight,
  ChevronLeft,
  Layers,
  Edit2,
  Check,
  Plus,
} from 'lucide-react';
import { CanvasLayer, TextLayer, ImageLayer, StickerLayer, ShapeLayer, VectorLayer } from '../types/thumbnail';
import { PRESET_TEXT_STYLES, TextStylePreset } from '../constants/textStyles';

export interface FontPairingSuggestion {
  primary: string;
  recommendedSub: string;
  alternativeSub: string;
  badge: string;
  reason: string;
  subTextIdea: string;
}

export const FONT_PAIRING_RULES: Record<string, FontPairingSuggestion> = {
  Anton: {
    primary: 'Anton',
    recommendedSub: 'Montserrat',
    alternativeSub: 'Poppins',
    badge: 'High-CTR Viral',
    reason: 'Ultra-condensed display headline pairs best with geometric modern sans for sub-headings & numbers.',
    subTextIdea: 'IN 24 HOURS',
  },
  Bangers: {
    primary: 'Bangers',
    recommendedSub: 'Outfit',
    alternativeSub: 'Montserrat',
    badge: 'Gaming & Dynamic',
    reason: 'Energetic comic style needs a structured modern sans to keep numbers and sub-points sharp.',
    subTextIdea: 'LEVEL 100 BOSS',
  },
  'Permanent Marker': {
    primary: 'Permanent Marker',
    recommendedSub: 'Anton',
    alternativeSub: 'Montserrat',
    badge: 'Raw Shock Value',
    reason: 'Handwritten expressiveness anchors against heavy architectural block text for proof/shock.',
    subTextIdea: 'THE SECRET TRUTH',
  },
  Montserrat: {
    primary: 'Montserrat',
    recommendedSub: 'Anton',
    alternativeSub: 'Bangers',
    badge: 'Tech & Authority',
    reason: 'Geometric corporate foundation accented by an ultra-punchy display font for high conversion.',
    subTextIdea: 'DO NOT SKIP THIS',
  },
  Poppins: {
    primary: 'Poppins',
    recommendedSub: 'Anton',
    alternativeSub: 'Outfit',
    badge: 'Modern Creator',
    reason: 'Friendly open letterforms complemented by compact high-contrast title emphasis.',
    subTextIdea: 'STEP-BY-STEP GUIDE',
  },
  Outfit: {
    primary: 'Outfit',
    recommendedSub: 'Bangers',
    alternativeSub: 'Anton',
    badge: 'Minimalist Punch',
    reason: 'Sophisticated geometric structure paired with explosive accent typography.',
    subTextIdea: '100% UNFILTERED',
  },
  Righteous: {
    primary: 'Righteous',
    recommendedSub: 'Montserrat',
    alternativeSub: 'Poppins',
    badge: 'Retro Cyberpunk',
    reason: 'Curved futuristic title complemented by razor-sharp geometric subtext.',
    subTextIdea: 'SYSTEM OVERLOAD',
  },
  'Russo One': {
    primary: 'Russo One',
    recommendedSub: 'Outfit',
    alternativeSub: 'Poppins',
    badge: 'Heavy Action',
    reason: 'Square industrial weight balanced with soft contemporary sans-serif letterforms.',
    subTextIdea: 'MISSION COMPLETE',
  },
};

interface StylePanelProps {
  layers: CanvasLayer[];
  selectedLayer: CanvasLayer | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (layer: CanvasLayer) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onApplyTextStyle: (style: TextStylePreset) => void;
  backgroundColor: string;
  onChangeBackgroundColor: (color: string) => void;
  onAddTextLayer?: (preset?: {
    text: string;
    color: string;
    strokeColor: string;
    fontSize: number;
    fontFamily?: string;
    x?: number;
    y?: number;
  }) => void;
  // Collapsible panel state
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const GOOGLE_FONTS = [
  'Anton',
  'Montserrat',
  'Bangers',
  'Poppins',
  'Outfit',
  'Permanent Marker',
  'Righteous',
  'Russo One',
];

export const StylePanel: React.FC<StylePanelProps> = ({
  layers,
  selectedLayer,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onBringForward,
  onSendBackward,
  onApplyTextStyle,
  backgroundColor,
  onChangeBackgroundColor,
  onAddTextLayer,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  const [renamingLayerId, setRenamingLayerId] = useState<string | null>(null);
  const [renamingText, setRenamingText] = useState('');

  // Font Pairing calculation for selected primary text
  const selectedTextLayer = selectedLayer?.type === 'text' ? (selectedLayer as TextLayer) : null;
  const currentFont = selectedTextLayer?.fontFamily || 'Anton';
  const pairing = FONT_PAIRING_RULES[currentFont] || FONT_PAIRING_RULES['Anton'];

  const otherTextLayers = layers.filter(
    (l) => l.type === 'text' && l.id !== selectedLayer?.id
  ) as TextLayer[];

  const handleAddPairedSubheading = (fontToUse?: string) => {
    const subFont = fontToUse || pairing.recommendedSub;
    if (onAddTextLayer) {
      onAddTextLayer({
        text: pairing.subTextIdea,
        color: '#FFFFFF',
        strokeColor: '#000000',
        fontSize: Math.max(38, Math.round((selectedTextLayer?.fontSize || 78) * 0.65)),
        fontFamily: subFont,
        x: selectedTextLayer ? Math.min(75, selectedTextLayer.x + 2) : 12,
        y: selectedTextLayer ? Math.min(75, selectedTextLayer.y + 24) : 55,
      });
    }
  };

  const handleApplyToOtherTextLayer = (font: string) => {
    if (otherTextLayers.length > 0) {
      const target = otherTextLayers[0];
      onUpdateLayer({ ...target, fontFamily: font });
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-l border-zinc-800 bg-[#0e0e11] flex flex-col items-center py-3 select-none z-20 shrink-0 space-y-4">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="Expand Properties Inspector (<)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="w-6 h-px bg-zinc-800" />

        <button
          onClick={() => {
            onToggleCollapse();
            setActiveTab('properties');
          }}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          title="Inspector Properties"
        >
          <Sliders className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onToggleCollapse();
            setActiveTab('layers');
          }}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white relative"
          title="Layers Tree"
        >
          <Layers className="w-4 h-4" />
          <span className="absolute top-1 right-1 text-[8px] bg-zinc-700 px-1 rounded-full text-zinc-300">
            {layers.length}
          </span>
        </button>
      </div>
    );
  }

  const handleStartRename = (layer: CanvasLayer) => {
    setRenamingLayerId(layer.id);
    setRenamingText(layer.name);
  };

  const handleSaveRename = (layer: CanvasLayer) => {
    if (renamingText.trim()) {
      onUpdateLayer({ ...layer, name: renamingText.trim() });
    }
    setRenamingLayerId(null);
  };

  return (
    <div className="w-72 border-l border-zinc-800 bg-[#0e0e11] flex flex-col h-[calc(100vh-3rem)] shrink-0 select-none z-20 transition-all text-xs text-zinc-300">
      {/* Top Tab Bar & Collapse Button */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-2.5 py-1.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'properties' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors relative ${
              activeTab === 'layers' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Layers ({layers.length})
          </button>
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="Collapse Panel (>)"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* ================= LAYERS TREE TAB ================= */}
        {activeTab === 'layers' && (
          <div className="space-y-2">
            <span className="font-semibold text-zinc-400 text-xs block mb-1">
              Active Layer Stack (Top is Front)
            </span>

            <div className="space-y-1">
              {[...layers]
                .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                .map((layer, index) => {
                  const isSelected = layer.id === selectedLayer?.id;
                  const isRenaming = renamingLayerId === layer.id;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => onSelectLayer(layer.id)}
                      className={`p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500/50 text-white'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-zinc-500">#{index + 1}</span>

                        {isRenaming ? (
                          <div className="flex items-center gap-1 flex-1">
                            <input
                              type="text"
                              value={renamingText}
                              onChange={(e) => setRenamingText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(layer)}
                              className="bg-zinc-950 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-white outline-none w-full"
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveRename(layer);
                              }}
                              className="p-0.5 text-emerald-400"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onDoubleClick={() => handleStartRename(layer)}
                            className="font-semibold text-xs truncate flex-1"
                            title="Double-click to rename layer"
                          >
                            {layer.name}
                          </div>
                        )}
                      </div>

                      {/* Layer Actions */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateLayer({ ...layer, isVisible: !layer.isVisible });
                          }}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                          title={layer.isVisible ? 'Hide layer' : 'Show layer'}
                        >
                          {layer.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-zinc-600" />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateLayer({ ...layer, isLocked: !layer.isLocked });
                          }}
                          className={`p-1 rounded hover:bg-zinc-800 ${layer.isLocked ? 'text-amber-400' : 'text-zinc-400 hover:text-white'}`}
                          title={layer.isLocked ? 'Unlock layer' : 'Lock layer'}
                        >
                          {layer.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateLayer(layer.id);
                          }}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLayer(layer.id);
                          }}
                          className="p-1 rounded hover:bg-red-900/40 text-zinc-500 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ================= PROPERTIES TAB ================= */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            {!selectedLayer ? (
              <div className="space-y-4">
                <span className="font-semibold text-zinc-300 text-xs block">Canvas Settings</span>

                {/* Canvas Background Color */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400 block">Canvas Background Fill</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => onChangeBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded bg-transparent cursor-pointer border border-zinc-700"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => onChangeBackgroundColor(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                  Select any text, image, or sticker on the canvas to configure non-destructive effects, strokes, and typography.
                </div>
              </div>
            ) : selectedLayer.type === 'text' ? (
              /* TEXT LAYER PROPERTIES */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-200 text-xs">Text Inspector</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Z: {selectedLayer.zIndex}</span>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400">Content</label>
                  <textarea
                    rows={2}
                    value={(selectedLayer as TextLayer).text}
                    onChange={(e) => onUpdateLayer({ ...(selectedLayer as TextLayer), text: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none font-bold resize-none"
                  />
                </div>

                {/* Font Family */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400">Font</label>
                  <select
                    value={(selectedLayer as TextLayer).fontFamily}
                    onChange={(e) => onUpdateLayer({ ...(selectedLayer as TextLayer), fontFamily: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs text-white outline-none"
                  >
                    {GOOGLE_FONTS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Pairings Suggestion Card */}
                {pairing && (
                  <div className="rounded-xl border border-indigo-500/35 bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-950 p-3 space-y-2 shadow-sm animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Font Pairings</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30">
                        {pairing.badge}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-300 leading-snug">
                      Pair <span className="font-bold text-white underline decoration-indigo-400/60">{currentFont}</span> with{' '}
                      <span className="font-bold text-indigo-300">{pairing.recommendedSub}</span>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                        {pairing.reason}
                      </p>
                    </div>

                    {/* Quick 1-Click Action to add complementary sub-heading */}
                    <div className="space-y-1.5 pt-1 border-t border-zinc-800/80">
                      <button
                        type="button"
                        onClick={() => handleAddPairedSubheading(pairing.recommendedSub)}
                        className="w-full py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
                        title={`Add sub-heading using ${pairing.recommendedSub}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Sub-Heading ({pairing.recommendedSub})</span>
                      </button>

                      <div className="flex items-center justify-between text-[10px] pt-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-500">Alt:</span>
                          <button
                            type="button"
                            onClick={() => handleAddPairedSubheading(pairing.alternativeSub)}
                            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700/60 font-semibold transition-colors"
                            title={`Add sub-heading using alternative ${pairing.alternativeSub}`}
                          >
                            + {pairing.alternativeSub}
                          </button>
                        </div>

                        {otherTextLayers.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleApplyToOtherTextLayer(pairing.recommendedSub)}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold underline transition-colors"
                            title="Set your existing secondary text layer to the recommended pairing font"
                          >
                            Apply to Sub-Hook
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Size & Rotation */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-zinc-400 block mb-1">
                      Size ({(selectedLayer as TextLayer).fontSize}px)
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={140}
                      value={(selectedLayer as TextLayer).fontSize}
                      onChange={(e) =>
                        onUpdateLayer({ ...(selectedLayer as TextLayer), fontSize: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-zinc-400 block mb-1">
                      Angle ({(selectedLayer as TextLayer).rotation}°)
                    </label>
                    <input
                      type="range"
                      min={-30}
                      max={30}
                      value={(selectedLayer as TextLayer).rotation}
                      onChange={(e) =>
                        onUpdateLayer({ ...(selectedLayer as TextLayer), rotation: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Fill Color */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400">Fill Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedLayer as TextLayer).color}
                      onChange={(e) => onUpdateLayer({ ...(selectedLayer as TextLayer), color: e.target.value })}
                      className="w-7 h-7 rounded bg-transparent cursor-pointer border border-zinc-700"
                    />
                    <input
                      type="text"
                      value={(selectedLayer as TextLayer).color}
                      onChange={(e) => onUpdateLayer({ ...(selectedLayer as TextLayer), color: e.target.value })}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 font-mono"
                    />
                  </div>
                </div>

                {/* Non-Destructive Stroke (Outline) */}
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200 text-xs">Stroke / Outline</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {(selectedLayer as TextLayer).strokeWidth}px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedLayer as TextLayer).strokeColor || '#000000'}
                      onChange={(e) =>
                        onUpdateLayer({ ...(selectedLayer as TextLayer), strokeColor: e.target.value })
                      }
                      className="w-6 h-6 rounded bg-transparent cursor-pointer border border-zinc-700"
                    />
                    <input
                      type="range"
                      min={0}
                      max={24}
                      value={(selectedLayer as TextLayer).strokeWidth || 0}
                      onChange={(e) =>
                        onUpdateLayer({ ...(selectedLayer as TextLayer), strokeWidth: Number(e.target.value) })
                      }
                      className="flex-1 accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Outer Glow Effect */}
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200 text-xs">Outer Glow</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {(selectedLayer as TextLayer).glowBlur || 0}px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedLayer as TextLayer).glowColor || '#00F0FF'}
                      onChange={(e) =>
                        onUpdateLayer({ ...(selectedLayer as TextLayer), glowColor: e.target.value })
                      }
                      className="w-6 h-6 rounded bg-transparent cursor-pointer border border-zinc-700"
                    />
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={(selectedLayer as TextLayer).glowBlur || 0}
                      onChange={(e) =>
                        onUpdateLayer({ ...(selectedLayer as TextLayer), glowBlur: Number(e.target.value) })
                      }
                      className="flex-1 accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Drop Shadow */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400">Drop Shadow Blur</label>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    value={(selectedLayer as TextLayer).shadowBlur || 0}
                    onChange={(e) =>
                      onUpdateLayer({
                        ...(selectedLayer as TextLayer),
                        shadowBlur: Number(e.target.value),
                        shadowOffsetX: 4,
                        shadowOffsetY: 4,
                      })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Quick 1-Click Viral Typography Suggestions */}
                <div className="pt-1">
                  <span className="font-semibold text-zinc-300 text-xs block mb-1.5">
                    Suggested Typography Styles
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                    {PRESET_TEXT_STYLES.slice(0, 6).map((style) => (
                      <button
                        key={style.id}
                        onClick={() => onApplyTextStyle(style)}
                        className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-[11px] font-bold truncate text-zinc-200"
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : selectedLayer.type === 'image' ? (
              /* IMAGE & CUTOUT LAYER PROPERTIES + AMBIENCE MATCHER */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-200 text-xs">Image & Cutout Inspector</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Z: {selectedLayer.zIndex}</span>
                </div>

                {/* Ambience & Lighting Matcher Section */}
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ambience & Lighting Matcher</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight">
                    Grade cutout warmth & exposure to match background lighting.
                  </p>

                  {/* Temperature (Warmth / Cool) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400">Color Temperature</span>
                      <span className="font-mono text-zinc-300">
                        {(selectedLayer as ImageLayer).temperature || 0}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      value={(selectedLayer as ImageLayer).temperature || 0}
                      onChange={(e) =>
                        onUpdateLayer({ ...(selectedLayer as ImageLayer), temperature: Number(e.target.value) })
                      }
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Exposure */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400">Exposure</span>
                      <span className="font-mono text-zinc-300">
                        {((selectedLayer as ImageLayer).exposure || 0).toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-1.5}
                      max={1.5}
                      step={0.1}
                      value={(selectedLayer as ImageLayer).exposure || 0}
                      onChange={(e) =>
                        onUpdateLayer({ ...(selectedLayer as ImageLayer), exposure: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400">Contrast</span>
                    <span className="font-mono text-zinc-300">{(selectedLayer as ImageLayer).contrast ?? 1}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.05}
                    value={(selectedLayer as ImageLayer).contrast ?? 1}
                    onChange={(e) =>
                      onUpdateLayer({ ...(selectedLayer as ImageLayer), contrast: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400">Saturation</span>
                    <span className="font-mono text-zinc-300">{(selectedLayer as ImageLayer).saturation ?? 1}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.05}
                    value={(selectedLayer as ImageLayer).saturation ?? 1}
                    onChange={(e) =>
                      onUpdateLayer({ ...(selectedLayer as ImageLayer), saturation: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            ) : selectedLayer.type === 'vector' ? (
              /* VECTOR PEN LAYER PROPERTIES */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-zinc-200 text-xs">Vector Path Inspector</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Z: {selectedLayer.zIndex}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400">Stroke Color</label>
                  <input
                    type="color"
                    value={(selectedLayer as VectorLayer).strokeColor}
                    onChange={(e) =>
                      onUpdateLayer({ ...(selectedLayer as VectorLayer), strokeColor: e.target.value })
                    }
                    className="w-full h-8 rounded bg-transparent cursor-pointer border border-zinc-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400">
                    Stroke Width ({(selectedLayer as VectorLayer).strokeWidth}px)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={24}
                    value={(selectedLayer as VectorLayer).strokeWidth}
                    onChange={(e) =>
                      onUpdateLayer({ ...(selectedLayer as VectorLayer), strokeWidth: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
                  <span className="text-xs text-zinc-300">Smooth Curves</span>
                  <input
                    type="checkbox"
                    checked={(selectedLayer as VectorLayer).curveType === 'smooth'}
                    onChange={(e) =>
                      onUpdateLayer({
                        ...(selectedLayer as VectorLayer),
                        curveType: e.target.checked ? 'smooth' : 'linear',
                      })
                    }
                    className="accent-indigo-500 w-4 h-4"
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
