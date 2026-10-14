import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Target,
  Swords,
  Layout,
  Palette,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Wand2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { CanvasLayer, TextLayer } from '../types/thumbnail';

interface AIDesignAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  niche: string;
  onApplyPreset: (preset: {
    overlayText: string;
    primaryColor: string;
    accentColor: string;
    layoutAdvice: string;
  }) => void;
}

export const AIDesignAssistantModal: React.FC<AIDesignAssistantModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  niche,
  onApplyPreset,
}) => {
  const [title, setTitle] = useState(videoTitle || 'I Spent 100 Hours Building an AI Robot');
  const [genre, setGenre] = useState(niche || 'Technology & Creator Economy');
  const [keywords, setKeywords] = useState('AI coding, robotics, tech challenge, autonomous build');
  const [description, setDescription] = useState(
    'I documented the entire 48-hour sprint building an autonomous AI agent from scratch. It solved coding puzzles, controlled hardware, and nearly caught fire.'
  );
  const [optimizationGoal, setOptimizationGoal] = useState<'ctr' | 'retention' | 'viral_browse' | 'search_seo'>('ctr');
  const [targetAudience, setTargetAudience] = useState('Tech enthusiasts, aspiring developers, and viral challenge viewers');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAssistant = async () => {
    setLoading(true);
    setAppliedPresetId(null);
    try {
      const res = await fetch('/api/ai/design-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: title,
          genre,
          keywords,
          description,
          optimizationGoal,
          targetAudience,
        }),
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to run AI design assistant:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-white">AI Thumbnail Design Assistant</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Content & Trends Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Analyzes video narrative, target audience goals, emerging platform trends & competitor strategy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Brief Input Form */}
          <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Video Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. I Spent 100 Hours Building an AI Robot"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Niche / Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 outline-none"
                >
                  <option value="Technology & Creator Economy">Technology & Coding</option>
                  <option value="Gaming & Esports">Gaming & Challenges</option>
                  <option value="Finance & Wealth">Finance, Stocks & Crypto</option>
                  <option value="Fitness & Health">Fitness & Transformation</option>
                  <option value="Documentary & True Crime">Documentary & True Crime</option>
                  <option value="Education & Science">Education & Science</option>
                  <option value="Vlog & Lifestyle">Vlog & Entertainment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Target Keywords</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. AI Robot, OpenAI, autonomous hardware, coding challenge"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Optimization Goal */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Primary Optimization Goal</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'ctr', label: '⚡ Maximize CTR' },
                    { id: 'retention', label: '⏱️ High Watch Time' },
                    { id: 'viral_browse', label: '🔥 Viral Browse' },
                    { id: 'search_seo', label: '🔍 Search / SEO' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setOptimizationGoal(g.id as any)}
                      className={`text-[11px] font-semibold py-1.5 px-2 rounded-lg border transition-all text-left ${
                        optimizationGoal === g.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleRunAssistant}
                disabled={loading || !title.trim()}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 disabled:opacity-40 transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Trends & Competitors...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate AI Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Output */}
          {report && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* 1. Content Synthesis & Psychological Trigger */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Lightbulb className="w-4 h-4" />
                  <span>Strategic Content Thesis & Curiosity Trigger</span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Core Hook</span>
                    <span className="text-xs font-bold text-zinc-200 mt-0.5 block">{report.contentSynthesis?.coreHook}</span>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Psychological Trigger</span>
                    <span className="text-xs font-bold text-amber-400 mt-0.5 block">{report.contentSynthesis?.psychologicalTrigger}</span>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Viewer Emotion Target</span>
                    <span className="text-xs font-bold text-rose-400 mt-0.5 block">{report.contentSynthesis?.viewerEmotionTarget}</span>
                  </div>
                </div>
              </div>

              {/* 2. Emerging Trends & Competitor Counter-Strategy */}
              <div className="grid grid-cols-2 gap-4">
                {/* Emerging Trends */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <TrendingUp className="w-4 h-4" />
                    <span>Emerging 2026 YouTube Trends in {genre}</span>
                  </div>
                  <div className="space-y-2">
                    {report.emergingTrends?.map((trend: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-200 text-xs">{trend.trendName}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            {trend.saturationLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug">{trend.description}</p>
                        <p className="text-[10px] text-indigo-400 font-medium italic">Why it works: {trend.whyItWorksNow}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Audit */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <Swords className="w-4 h-4" />
                    <span>Competitor Analysis & Counter-Positioning</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800/80">
                      <span className="text-[10px] text-red-400 font-bold uppercase block">Common Competitor Trap:</span>
                      <p className="text-[11px] text-zinc-300 mt-0.5">{report.competitorAudit?.commonMistake}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">Our Winning Counter-Strategy:</span>
                      <p className="text-[11px] text-zinc-200 font-medium mt-0.5">{report.competitorAudit?.counterStrategy}</p>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Common Competitor Archetypes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {report.competitorAudit?.competitorArchetypes?.map((arch: string, i: number) => (
                          <span key={i} className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 border border-zinc-700">
                            {arch}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Optimal Layout & Palette Architecture */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Layout className="w-4 h-4" />
                    <span>Recommended Layout Architecture</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div className="font-bold text-white text-sm">{report.recommendedLayout?.compositionName}</div>
                    <p className="text-[11px] text-zinc-400">{report.recommendedLayout?.focalPointCoordinates}</p>
                    <p className="text-[11px] text-cyan-300">📐 {report.recommendedLayout?.textPlacementRule}</p>
                    <p className="text-[11px] text-amber-400">⚠️ {report.recommendedLayout?.safeZoneAdvice}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <Palette className="w-4 h-4" />
                    <span>Recommended Color Psychology</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md shadow border border-zinc-700" style={{ backgroundColor: report.recommendedPalette?.primaryHex }} />
                      <div className="w-6 h-6 rounded-md shadow border border-zinc-700" style={{ backgroundColor: report.recommendedPalette?.secondaryHex }} />
                      <div className="w-6 h-6 rounded-md shadow border border-zinc-700" style={{ backgroundColor: report.recommendedPalette?.accentHex }} />
                      <span className="font-bold text-xs text-white ml-1">{report.recommendedPalette?.name}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">{report.recommendedPalette?.rationale}</p>
                    <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                      <span>Primary Text Hook:</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-white font-['Anton'] tracking-wider">
                        "{report.recommendedTextOverlay}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Concrete Design Presets Ready for 1-Click Apply */}
              <div>
                <span className="font-bold text-zinc-200 text-xs uppercase tracking-wider block mb-2.5">
                  Ready-to-Apply Thumbnail Presets ({report.designPresets?.length})
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {report.designPresets?.map((preset: any) => {
                    const isApplied = appliedPresetId === preset.id;
                    return (
                      <div
                        key={preset.id}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                          isApplied
                            ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30'
                            : 'bg-zinc-950/90 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                              {preset.styleTag}
                            </span>
                            <span className="text-xs font-black text-emerald-400">
                              CTR {preset.projectedCTR}
                            </span>
                          </div>

                          <div className="font-black text-white text-sm">{preset.name}</div>

                          <div
                            className="p-2.5 rounded-lg border border-black/40 text-center font-['Anton'] font-black text-lg tracking-wider shadow-inner"
                            style={{
                              backgroundColor: '#09090B',
                              color: preset.primaryColor,
                              textShadow: `0 2px 4px ${preset.accentColor}80`,
                            }}
                          >
                            {preset.overlayText}
                          </div>

                          <p className="text-[10px] text-zinc-400 leading-tight">
                            {preset.layoutAdvice}
                          </p>
                        </div>

                        <div className="pt-3">
                          <button
                            onClick={() => {
                              onApplyPreset(preset);
                              setAppliedPresetId(preset.id);
                            }}
                            className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                              isApplied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Applied to Canvas!</span>
                              </>
                            ) : (
                              <>
                                <span>Apply to Thumbnail</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
