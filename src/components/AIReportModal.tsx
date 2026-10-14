import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2,
  Wand2,
  Flame,
  Smartphone,
  Eye,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { CanvasLayer, AIAnalysisReport } from '../types/thumbnail';
import { renderThumbnailCanvas } from '../utils/canvasRender';

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  niche: string;
  layers: CanvasLayer[];
  backgroundColor: string;
  onApplyAutoFix: (fixTitle: string) => void;
  onToggleHeatmap: (hotspots: any[]) => void;
}

export const AIReportModal: React.FC<AIReportModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  niche,
  layers,
  backgroundColor,
  onApplyAutoFix,
  onToggleHeatmap,
}) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIAnalysisReport | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    async function runAnalysis() {
      setLoading(true);
      try {
        const canvas = document.createElement('canvas');
        await renderThumbnailCanvas({
          canvas,
          layers,
          backgroundColor,
          width: 1280,
          height: 720,
          showGuides: false,
          showTimestampShield: false,
          showHeatmap: false,
        });

        const dataUrl = canvas.toDataURL('image/png');
        setThumbnailUrl(dataUrl);

        const res = await fetch('/api/ai/analyze-thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: dataUrl,
            title: videoTitle,
            targetNiche: niche,
          }),
        });

        const data: AIAnalysisReport = await res.json();
        setReport(data);
      } catch (err) {
        console.error('Failed to analyze thumbnail:', err);
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [isOpen, layers, backgroundColor, videoTitle, niche]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">AI Thumbnail Performance & Conversion Audit</h2>
              <p className="text-xs text-zinc-400">
                Deep neural critique: contrast, mobile readability, emotional arousal, and projected CTR.
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
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <div className="font-extrabold text-base text-white">
                Gemini 3.8 Multimodal Analysis in Progress...
              </div>
              <p className="text-xs text-zinc-400 max-w-md">
                Measuring visual saliency, text readability on 5-inch phone screens, color harmony, and curiosity gap open loops.
              </p>
            </div>
          )}

          {!loading && report && (
            <div className="space-y-6 animate-in fade-in">
              {/* Overall Score Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-zinc-950 to-indigo-950/40 border border-emerald-500/30 flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-emerald-400 font-mono leading-none">
                      {report.overallScore}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold mt-1">Grade {report.grade}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Projected CTR: {report.predictedCTR}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        (Industry Avg: {report.industryAverageCTR})
                      </span>
                    </div>
                    <p className="font-bold text-sm text-zinc-100">{report.verdict}</p>
                  </div>
                </div>

                {report.attentionHotspots && (
                  <button
                    onClick={() => {
                      onToggleHeatmap(report.attentionHotspots);
                      onClose();
                    }}
                    className="py-2 px-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all active:scale-95 shrink-0"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>View Attention Heatmap</span>
                  </button>
                )}
              </div>

              {/* Dimensional Metrics */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-cyan-400" /> Mobile Readability
                  </span>
                  <div className="text-xl font-black text-cyan-400 font-mono">
                    {report.breakdown?.mobileReadability}%
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${report.breakdown?.mobileReadability}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Contrast & Vibrancy
                  </span>
                  <div className="text-xl font-black text-amber-400 font-mono">
                    {report.breakdown?.contrastVibrancy}%
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${report.breakdown?.contrastVibrancy}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-purple-400" /> Emotional Arousal
                  </span>
                  <div className="text-xl font-black text-purple-400 font-mono">
                    {report.breakdown?.emotionalImpact}%
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: `${report.breakdown?.emotionalImpact}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Timestamp Safety
                  </span>
                  <div className="text-xs font-bold text-emerald-400 mt-1 truncate">
                    {report.breakdown?.timestampSafety}
                  </div>
                </div>
              </div>

              {/* Strengths & Friction Points */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Conversion Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {report.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Friction Points to Optimize</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {report.frictionPoints?.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Recommendations with 1-Click Fixes */}
              <div className="space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-200 block">
                  Actionable AI Recommendations
                </span>
                <div className="space-y-2">
                  {report.actionRecommendations?.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">{rec.title}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {rec.impact} Impact
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{rec.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          onApplyAutoFix(rec.title);
                          onClose();
                        }}
                        className="py-1.5 px-3 bg-zinc-800 hover:bg-emerald-600 text-zinc-200 hover:text-white rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Apply AI Fix</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
