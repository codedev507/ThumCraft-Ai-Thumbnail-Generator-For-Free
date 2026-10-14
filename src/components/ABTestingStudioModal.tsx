import React, { useState, useEffect } from 'react';
import {
  SplitSquareVertical,
  Trophy,
  Play,
  Plus,
  Upload,
  BarChart2,
  Clock,
  Eye,
  MousePointerClick,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Camera,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { CanvasLayer } from '../types/thumbnail';
import { exportPresetToBlob, PLATFORM_PRESETS } from '../utils/exportZip';

interface ABTestingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  currentLayers: CanvasLayer[];
  currentBgColor: string;
  onApplyVariantToCanvas: (variantThumbnailUrl: string) => void;
}

export const ABTestingStudioModal: React.FC<ABTestingStudioModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  currentLayers,
  currentBgColor,
  onApplyVariantToCanvas,
}) => {
  const [experiment, setExperiment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // New Variant Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantTagline, setNewVariantTagline] = useState('');

  // Fetch current experiment
  const fetchExperiment = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ab-tests/default');
      const data = await res.json();
      setExperiment(data.experiment);
    } catch (err) {
      console.error('Failed to load AB experiment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExperiment();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Capture current canvas as a new variant
  const handleCaptureCurrentCanvas = async () => {
    try {
      const preset = PLATFORM_PRESETS[0]; // 1280x720 YouTube
      const { dataUrl } = await exportPresetToBlob(preset, currentLayers, currentBgColor, 'image/jpeg', 0.9);

      const nextLetter = String.fromCharCode(65 + (experiment?.variants?.length || 0));
      const res = await fetch('/api/ab-tests/default/variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Variant ${nextLetter}: Current Canvas Design`,
          tagline: 'Custom captured variation from live studio editor',
          thumbnailDataUrl: dataUrl,
        }),
      });
      const data = await res.json();
      setExperiment(data.experiment);
    } catch (err) {
      console.error('Failed to capture variant:', err);
    }
  };

  // Upload custom external thumbnail file
  const handleUploadCustomVariant = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const nextLetter = String.fromCharCode(65 + (experiment?.variants?.length || 0));
      const res = await fetch('/api/ab-tests/default/variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newVariantName || `Variant ${nextLetter}: Uploaded Image`,
          tagline: newVariantTagline || 'Uploaded external creative candidate',
          thumbnailDataUrl: dataUrl,
        }),
      });
      const data = await res.json();
      setExperiment(data.experiment);
      setShowAddForm(false);
      setNewVariantName('');
      setNewVariantTagline('');
    };
    reader.readAsDataURL(file);
  };

  // Simulate traffic batch
  const handleSimulateTraffic = async () => {
    try {
      setSimulating(true);
      const res = await fetch('/api/ab-tests/default/simulate-traffic', { method: 'POST' });
      const data = await res.json();
      setExperiment(data.experiment);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  // Declare winner
  const handleDeclareWinner = async (variantId: string) => {
    try {
      const res = await fetch('/api/ab-tests/default/declare-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId }),
      });
      const data = await res.json();
      setExperiment(data.experiment);
    } catch (err) {
      console.error(err);
    }
  };

  // Run AI Insights
  const handleGenerateAIInsights = async () => {
    if (!experiment) return;
    try {
      setLoadingInsights(true);
      const res = await fetch('/api/ai/ab-test-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle,
          variants: experiment.variants,
        }),
      });
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <SplitSquareVertical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-white">YouTube A/B/C/D Multi-Variant Testing Studio</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  Live Traffic Tracker
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Track click-through rate, watch time, and retention across multiple thumbnail designs for "{videoTitle || 'Untitled Video'}".
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCaptureCurrentCanvas}
              className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors"
              title="Add whatever is currently on your canvas as a new variation"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Capture Canvas as Variant</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Custom Variant</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors font-bold ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Experiment Status Banner */}
          {experiment && (
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Experiment Status</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-xs text-white capitalize">{experiment.status}</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-zinc-800" />

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Total Impressions</span>
                  <span className="font-extrabold text-sm text-zinc-200 font-mono">
                    {experiment.totalImpressions.toLocaleString()}
                  </span>
                </div>

                <div className="h-8 w-px bg-zinc-800" />

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Statistical Confidence</span>
                  <span className="font-extrabold text-sm text-emerald-400 font-mono">
                    {experiment.confidenceScore}% {experiment.confidenceScore >= 95 ? '(Winner Confirmed)' : '(Gathering Data)'}
                  </span>
                </div>
              </div>

              {/* Simulation Action */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateTraffic}
                  disabled={simulating}
                  className="py-2 px-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Simulate 5,000+ home feed impressions across all variants"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${simulating ? 'animate-spin' : ''}`} />
                  <span>Simulate Next Traffic Batch</span>
                </button>

                <button
                  onClick={handleGenerateAIInsights}
                  disabled={loadingInsights}
                  className="py-2 px-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loadingInsights ? 'Analyzing...' : 'AI Winner Diagnostic'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Add Variant Form Accordion */}
          {showAddForm && (
            <div className="p-4 bg-zinc-950 rounded-xl border border-indigo-500/40 space-y-3 animate-in fade-in">
              <span className="font-bold text-xs text-white block">Add External Thumbnail Variation</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                  placeholder="Variant Name (e.g. Variant C: Dramatic Red Lighting)"
                  className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                />
                <input
                  type="text"
                  value={newVariantTagline}
                  onChange={(e) => setNewVariantTagline(e.target.value)}
                  placeholder="Hypothesis / Tagline (e.g. Higher emotional arousal on face)"
                  className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="flex items-center justify-center p-3 border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-lg cursor-pointer bg-zinc-900/50 hover:bg-zinc-900 text-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-zinc-300">Choose Thumbnail Image File (16:9)</span>
                  <input type="file" accept="image/*" onChange={handleUploadCustomVariant} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Variants Grid */}
          <div className="grid grid-cols-2 gap-4">
            {experiment?.variants?.map((variant: any) => {
              const isWinner = variant.status === 'winner' || experiment.winnerVariantId === variant.id;
              const minutes = Math.floor(variant.avgWatchTimeSeconds / 60);
              const seconds = variant.avgWatchTimeSeconds % 60;

              return (
                <div
                  key={variant.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isWinner
                      ? 'bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Variant Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{variant.name}</span>
                        {isWinner && (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-md">
                            <Trophy className="w-3 h-3" />
                            WINNER
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {variant.trafficSharePercent}% Traffic
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-1">{variant.tagline}</p>

                    {/* Thumbnail Preview Card */}
                    <div className="relative rounded-lg overflow-hidden aspect-video bg-black border border-zinc-800 shadow-md">
                      {variant.thumbnailDataUrl ? (
                        <img
                          src={variant.thumbnailDataUrl}
                          alt={variant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-zinc-900 to-zinc-950 text-center">
                          <span className="font-black text-amber-400 font-['Anton'] text-2xl tracking-wider">
                            I SURVIVED
                          </span>
                          <span className="font-black text-white font-['Anton'] text-3xl tracking-wider">
                            100 HOURS!
                          </span>
                        </div>
                      )}

                      {/* CTR Pill on Thumbnail */}
                      <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm border border-zinc-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow">
                        <MousePointerClick className="w-3 h-3 text-cyan-400" />
                        <span className="text-xs font-black text-white font-mono">{variant.ctr}% CTR</span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                      <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 block">CTR</span>
                        <span className={`text-sm font-black font-mono ${isWinner ? 'text-amber-400' : 'text-zinc-200'}`}>
                          {variant.ctr}%
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 block">Watch Time</span>
                        <span className="text-xs font-bold font-mono text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {minutes}m {seconds}s
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 block">Retention</span>
                        <span className="text-sm font-black font-mono text-indigo-400">
                          {variant.retentionRate}%
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 block">Clicks</span>
                        <span className="text-xs font-bold font-mono text-zinc-300 mt-0.5 block">
                          {variant.clicks.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Daily Trajectory Mini-Graph */}
                    {variant.dailyStats && variant.dailyStats.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">CTR Trajectory Over Time</span>
                        <div className="flex items-end gap-1.5 h-10 pt-1">
                          {variant.dailyStats.map((d: any, idx: number) => {
                            const barHeight = Math.min(100, Math.max(15, (d.ctr / 15) * 100));
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                                <div
                                  style={{ height: `${barHeight}%` }}
                                  className={`w-full rounded-t transition-all ${
                                    isWinner ? 'bg-amber-500' : 'bg-zinc-700 hover:bg-zinc-600'
                                  }`}
                                  title={`${d.day}: ${d.ctr}% CTR (${d.clicks} clicks)`}
                                />
                                <span className="text-[8px] text-zinc-500">{d.day.replace('Day ', 'D')}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center gap-2">
                    {!isWinner && (
                      <button
                        onClick={() => handleDeclareWinner(variant.id)}
                        className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-600/30 hover:text-amber-300 text-zinc-300 text-xs font-bold border border-zinc-700 transition-colors"
                      >
                        Declare Winner
                      </button>
                    )}

                    {variant.thumbnailDataUrl && (
                      <button
                        onClick={() => onApplyVariantToCanvas(variant.thumbnailDataUrl)}
                        className="py-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold border border-indigo-500/40 transition-colors"
                        title="Load this thumbnail variation into your canvas editor"
                      >
                        Load into Canvas
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Winner Diagnostic Section */}
          {aiInsights && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-zinc-950 to-purple-950/40 border border-indigo-500/40 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">AI Diagnostic: Why the Winning Variant Succeeded</h3>
                    <p className="text-xs text-zinc-400">{aiInsights.winnerSummary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
                    {aiInsights.ctrLiftPercentage}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                    {aiInsights.watchTimeLift}
                  </span>
                </div>
              </div>

              {/* Psychological Drivers */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                  Core Visual Psychology Drivers
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {aiInsights.whyWinnerWon?.map((reason: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 leading-snug">
                      <div className="font-bold text-indigo-400 mb-1">Principle #{i + 1}</div>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources Breakdown */}
              {aiInsights.trafficSourceBreakdown && (
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-2.5 bg-zinc-900/70 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Browse / Home Feed</span>
                    <span className="text-xs font-bold text-cyan-400">{aiInsights.trafficSourceBreakdown.browseFeatures}</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900/70 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Suggested Videos</span>
                    <span className="text-xs font-bold text-purple-400">{aiInsights.trafficSourceBreakdown.suggestedVideos}</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900/70 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">YouTube Search</span>
                    <span className="text-xs font-bold text-amber-400">{aiInsights.trafficSourceBreakdown.youtubeSearch}</span>
                  </div>
                </div>
              )}

              {/* Future Rules */}
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
                  Golden Takeaways for Your Channel:
                </span>
                <ul className="space-y-1 text-xs text-zinc-300">
                  {aiInsights.futureRules?.map((rule: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
