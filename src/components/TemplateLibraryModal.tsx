import React, { useState } from 'react';
import { LayoutTemplate, Sparkles, TrendingUp, Check, ArrowRight } from 'lucide-react';
import { HIGH_CTR_TEMPLATES } from '../constants/templates';
import { ThumbnailTemplate } from '../types/thumbnail';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ThumbnailTemplate) => void;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = [
    'All',
    'Extreme Emotion',
    'Versus / Comparison',
    'Curiosity & Mystery',
    'Educational & Tech',
    'Fitness & Growth',
    'Ranking & Reviews',
  ];

  const filteredTemplates =
    selectedCategory === 'All'
      ? HIGH_CTR_TEMPLATES
      : HIGH_CTR_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">High-Converting YouTube Template Library</h2>
              <p className="text-xs text-zinc-400">
                Pre-engineered layouts based on billions of YouTube home feed impressions.
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

        {/* Category Filter Pills */}
        <div className="p-3 border-b border-zinc-800 bg-zinc-950/40 flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-semibold ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
              className="group bg-zinc-950/70 hover:bg-zinc-800/40 border border-zinc-800 hover:border-amber-500/50 rounded-xl p-3.5 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Visual Preview */}
                <div className="relative rounded-lg overflow-hidden aspect-video bg-zinc-900 border border-zinc-800 shadow">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white border border-zinc-700">
                    {template.category}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-emerald-500/90 text-black px-2 py-0.5 rounded text-[11px] font-black font-mono shadow">
                    CTR {template.estimatedCTR}
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-1">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Psychology trigger note */}
              <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800/80 flex items-start gap-2 text-[10px] text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{template.psychologyNote}</span>
              </div>

              <button className="w-full py-2 bg-zinc-800 group-hover:bg-amber-500 text-zinc-300 group-hover:text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow">
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
