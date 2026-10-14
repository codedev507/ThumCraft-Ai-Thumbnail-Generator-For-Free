import React, { useState } from 'react';
import {
  Sparkles,
  LayoutTemplate,
  Tv,
  Flame,
  BarChart3,
  Users,
  Download,
  FolderArchive,
  SplitSquareVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  ShieldAlert,
  Search,
  Wand2,
  CloudCheck,
  Menu,
  X,
  Swords,
  Activity,
} from 'lucide-react';
import { ThumbnailProject, CTRStressTestMode } from '../types/thumbnail';

interface HeaderProps {
  project: ThumbnailProject;
  onUpdateTitle: (title: string) => void;
  onUpdateStatus: (status: ThumbnailProject['status']) => void;
  // Modals & Panels
  onOpenTemplates: () => void;
  onOpenTextToThumbnail: () => void;
  onOpenSEO: () => void;
  onOpenFeedSim: () => void;
  onOpenCollab: () => void;
  onOpenABTest: () => void;
  onOpenCompetitorBenchmark: () => void;
  onOpenBulkExport: () => void;
  onQuickExport: () => void;
  // Viewport & Canvas Controls
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onFitToScreen: () => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  showTimestampShield: boolean;
  onToggleTimestampShield: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  // Analytics
  isHeatmapActive: boolean;
  onToggleHeatmap: () => void;
  stressTestMode: CTRStressTestMode;
  onChangeStressTestMode: (mode: CTRStressTestMode) => void;
  unresolvedCommentCount: number;
  isSavedToCloud?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onUpdateTitle,
  onUpdateStatus,
  onOpenTemplates,
  onOpenTextToThumbnail,
  onOpenSEO,
  onOpenFeedSim,
  onOpenCollab,
  onOpenABTest,
  onOpenCompetitorBenchmark,
  onOpenBulkExport,
  onQuickExport,
  zoom,
  onZoomChange,
  onFitToScreen,
  showGuides,
  onToggleGuides,
  showTimestampShield,
  onToggleTimestampShield,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isHeatmapActive,
  onToggleHeatmap,
  stressTestMode,
  onChangeStressTestMode,
  unresolvedCommentCount,
  isSavedToCloud = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getStatusBadge = () => {
    switch (project.status) {
      case 'published':
        return { label: 'Published', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'approved':
        return { label: 'Approved', style: 'bg-green-500/10 text-green-400 border-green-500/30' };
      case 'needs_changes':
        return { label: 'Needs Changes', style: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'in_review':
        return { label: 'In Review', style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' };
      default:
        return { label: 'Draft', style: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <header className="h-12 border-b border-zinc-800 bg-[#0e0e11] px-3 flex items-center justify-between select-none z-30 shrink-0 text-xs">
      {/* ================= LEFT: Brand, Project Name & Cloud Save ================= */}
      <div className="flex items-center gap-3">
        {/* App Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center font-black text-white text-xs tracking-tight shadow-sm">
            TF
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">
            ThumbCraft <span className="text-indigo-400 font-medium">Pro</span>
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

        {/* Project Title & Cloud Save Status */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="bg-transparent hover:bg-zinc-800/50 focus:bg-zinc-800 text-xs font-semibold text-zinc-200 px-2 py-1 rounded border border-transparent focus:border-zinc-700 outline-none max-w-[140px] md:max-w-[200px] truncate transition-colors"
            placeholder="Untitled Thumbnail"
          />

          {/* Saved to Cloud Indicator */}
          <div
            className="flex items-center gap-1 text-[11px] text-zinc-400 hidden lg:flex"
            title="All changes permanently saved in real-time"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-500">Saved</span>
          </div>

          {/* Status Dropdown */}
          <div className="relative group hidden sm:block">
            <button
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${statusInfo.style}`}
            >
              {statusInfo.label}
            </button>
            <div className="absolute left-0 mt-1 hidden group-hover:flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-1 z-50 min-w-[120px]">
              {(['draft', 'in_review', 'needs_changes', 'approved', 'published'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(st)}
                  className={`text-left text-xs px-2 py-1 rounded capitalize hover:bg-zinc-800 transition-colors ${
                    project.status === st ? 'text-indigo-400 font-bold bg-zinc-800/40' : 'text-zinc-300'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CENTER: Core Workflow Modes ================= */}
      <div className="hidden md:flex items-center gap-1 bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800">
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 font-medium text-zinc-300 hover:text-white px-2.5 py-1 rounded-md hover:bg-zinc-800 transition-colors"
          title="Browse 100+ proven high-CTR viral templates"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-zinc-400" />
          <span>Templates</span>
        </button>

        <button
          onClick={onOpenTextToThumbnail}
          className="flex items-center gap-1.5 font-semibold text-indigo-300 hover:text-white px-2.5 py-1 rounded-md bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors"
          title="Generate a complete thumbnail from a text prompt or video script"
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Text-to-Thumbnail</span>
        </button>

        <button
          onClick={onOpenSEO}
          className="flex items-center gap-1.5 font-medium text-zinc-300 hover:text-white px-2.5 py-1 rounded-md hover:bg-zinc-800 transition-colors"
          title="100% YouTube SEO Title-Thumbnail Synergy & Algorithm Suite"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span>SEO Suite</span>
        </button>

        <button
          onClick={onOpenFeedSim}
          className="flex items-center gap-1.5 font-medium text-zinc-300 hover:text-white px-2.5 py-1 rounded-md hover:bg-zinc-800 transition-colors"
          title="Live Omni-Channel YouTube Feed Simulator (Desktop, Mobile, Suggested)"
        >
          <Tv className="w-3.5 h-3.5 text-zinc-400" />
          <span>Feed Simulator</span>
        </button>

        <button
          onClick={onOpenABTest}
          className="flex items-center gap-1.5 font-medium text-zinc-300 hover:text-white px-2.5 py-1 rounded-md hover:bg-zinc-800 transition-colors"
          title="Multi-Variant A/B/C/D Performance Tracker & Winner Predictor"
        >
          <SplitSquareVertical className="w-3.5 h-3.5 text-zinc-400" />
          <span>A/B Testing</span>
        </button>

        <button
          onClick={onOpenCompetitorBenchmark}
          className="flex items-center gap-1.5 font-medium text-zinc-300 hover:text-white px-2.5 py-1 rounded-md hover:bg-zinc-800 transition-colors"
          title="Benchmark side-by-side against top competing thumbnails"
        >
          <Swords className="w-3.5 h-3.5 text-zinc-400" />
          <span>Competitors</span>
        </button>
      </div>

      {/* ================= RIGHT: Viewport Controls & Export Actions ================= */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-zinc-900 p-0.5 rounded-md border border-zinc-800 hidden xl:flex">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport Zoom */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-md border border-zinc-800 hidden lg:flex">
          <button
            onClick={() => onZoomChange(Math.max(0.3, Math.round((zoom - 0.1) * 10) / 10))}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-zinc-300 w-10 text-center font-semibold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(2.5, Math.round((zoom + 0.1) * 10) / 10))}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onFitToScreen}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
            title="Fit Canvas to Viewport"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Guides & Shield Toggles */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-md border border-zinc-800 hidden sm:flex">
          <button
            onClick={onToggleGuides}
            className={`p-1 rounded transition-colors ${
              showGuides ? 'bg-indigo-600/30 text-indigo-400' : 'text-zinc-400 hover:text-white'
            }`}
            title="Toggle Safe Margins & Rule of Thirds Guides"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleTimestampShield}
            className={`p-1 rounded transition-colors ${
              showTimestampShield ? 'bg-amber-600/30 text-amber-400' : 'text-zinc-400 hover:text-white'
            }`}
            title="Toggle YouTube Timestamp Collision Shield"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleHeatmap}
            className={`p-1 rounded transition-colors ${
              isHeatmapActive ? 'bg-rose-600/30 text-rose-400' : 'text-zinc-400 hover:text-white'
            }`}
            title="Toggle Eye-Tracking Attention Heatmap"
          >
            <Flame className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CTR Stress Test Selector */}
        <div className="relative group hidden 2xl:block">
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-semibold transition-colors ${
              stressTestMode !== 'normal'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
            title="CTR Stress Test: View under squint blur, greyscale, or tiny mobile size"
          >
            <Activity className="w-3 h-3 text-amber-400" />
            <span>Stress: {stressTestMode.replace('_', ' ')}</span>
          </button>
          <div className="absolute right-0 mt-1 hidden group-hover:flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-1 z-50 min-w-[140px]">
            {(['normal', 'squint_blur', 'greyscale'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onChangeStressTestMode(mode)}
                className={`text-left text-xs px-2.5 py-1.5 rounded capitalize hover:bg-zinc-800 transition-colors ${
                  stressTestMode === mode ? 'text-indigo-400 font-bold bg-zinc-800/40' : 'text-zinc-300'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Collaborative Review Button */}
        <button
          onClick={onOpenCollab}
          className="relative p-1.5 sm:px-2.5 sm:py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors flex items-center gap-1.5 font-medium"
          title="Team Review & On-Canvas Feedback Pins"
        >
          <Users className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline">Review</span>
          {unresolvedCommentCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
              {unresolvedCommentCount}
            </span>
          )}
        </button>

        {/* Quick Export PNG */}
        <button
          onClick={onQuickExport}
          className="py-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-md font-semibold transition-colors flex items-center gap-1.5"
          title="Download 1280x720 PNG immediately"
        >
          <Download className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Quick PNG</span>
        </button>

        {/* Unified Primary CTA: Bulk Export (.ZIP) */}
        <button
          onClick={onOpenBulkExport}
          className="py-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          title="Export multi-platform sizes (YouTube, Shorts, TikTok, Instagram, X) as .ZIP"
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Export All</span>
        </button>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded md:hidden bg-zinc-900 text-zinc-300 border border-zinc-800"
          title="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-12 left-0 right-0 bg-[#0e0e11] border-b border-zinc-800 p-4 flex flex-col gap-2 z-50 md:hidden animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onOpenTemplates();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 text-zinc-200 font-semibold"
          >
            <LayoutTemplate className="w-4 h-4 text-amber-400" />
            <span>Templates</span>
          </button>
          <button
            onClick={() => {
              onOpenTextToThumbnail();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30"
          >
            <Wand2 className="w-4 h-4 text-indigo-400" />
            <span>AI Text-to-Thumbnail</span>
          </button>
          <button
            onClick={() => {
              onOpenSEO();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 text-zinc-200 font-semibold"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>100% YouTube SEO Suite</span>
          </button>
          <button
            onClick={() => {
              onOpenFeedSim();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 text-zinc-200 font-semibold"
          >
            <Tv className="w-4 h-4 text-cyan-400" />
            <span>Feed Simulator</span>
          </button>
          <button
            onClick={() => {
              onOpenABTest();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 text-zinc-200 font-semibold"
          >
            <SplitSquareVertical className="w-4 h-4 text-blue-400" />
            <span>A/B Testing Studio</span>
          </button>
          <button
            onClick={() => {
              onOpenCompetitorBenchmark();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 text-zinc-200 font-semibold"
          >
            <Swords className="w-4 h-4 text-rose-400" />
            <span>Competitor Benchmark Canvas</span>
          </button>
        </div>
      )}
    </header>
  );
};
