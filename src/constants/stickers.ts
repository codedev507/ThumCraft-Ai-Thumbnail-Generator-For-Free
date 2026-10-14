export interface StickerPreset {
  id: string;
  name: string;
  category: 'badges' | 'arrows' | 'reactions' | 'accents';
  type: 'badge' | 'arrow' | 'circle' | 'emoji' | 'versus' | 'warning' | 'custom';
  label?: string;
  color: string;
  secondaryColor?: string;
  previewSvg?: string;
  src?: string;
}

export const PRESET_STICKERS: StickerPreset[] = [
  // Viral Badges
  {
    id: 'badge-new',
    name: 'NEW!',
    category: 'badges',
    type: 'badge',
    label: 'NEW!',
    color: '#EF4444',
    secondaryColor: '#FFFFFF',
  },
  {
    id: 'badge-100',
    name: '100% REAL',
    category: 'badges',
    type: 'badge',
    label: '100% REAL',
    color: '#10B981',
    secondaryColor: '#FFFFFF',
  },
  {
    id: 'badge-shocking',
    name: 'SHOCKING',
    category: 'badges',
    type: 'badge',
    label: 'SHOCKING',
    color: '#FFE600',
    secondaryColor: '#000000',
  },
  {
    id: 'badge-warning',
    name: 'WARNING',
    category: 'badges',
    type: 'warning',
    label: '⚠️ WARNING',
    color: '#F59E0B',
    secondaryColor: '#000000',
  },
  {
    id: 'badge-secret',
    name: 'TOP SECRET',
    category: 'badges',
    type: 'badge',
    label: 'TOP SECRET',
    color: '#DC2626',
    secondaryColor: '#FFFFFF',
  },
  {
    id: 'badge-10x',
    name: '10X FASTER',
    category: 'badges',
    type: 'badge',
    label: '10X FASTER',
    color: '#8B5CF6',
    secondaryColor: '#FFFFFF',
  },
  {
    id: 'badge-vs',
    name: 'VS (VERSUS)',
    category: 'badges',
    type: 'versus',
    label: 'VS',
    color: '#EF4444',
    secondaryColor: '#FFE600',
  },
  {
    id: 'badge-free',
    name: 'FREE',
    category: 'badges',
    type: 'badge',
    label: 'FREE',
    color: '#06B6D4',
    secondaryColor: '#FFFFFF',
  },

  // Red Arrows & Attention Grabbers
  {
    id: 'arrow-red-bold',
    name: 'Viral Red Arrow',
    category: 'arrows',
    type: 'arrow',
    label: '➔',
    color: '#EF4444',
    secondaryColor: '#FFFFFF',
  },
  {
    id: 'circle-red-glow',
    name: 'Red Focus Circle',
    category: 'arrows',
    type: 'circle',
    label: '⭕',
    color: '#EF4444',
    secondaryColor: 'rgba(239, 68, 68, 0.25)',
  },
  {
    id: 'arrow-curved-yellow',
    name: 'Curved Yellow Arrow',
    category: 'arrows',
    type: 'arrow',
    label: '➥',
    color: '#FFE600',
    secondaryColor: '#000000',
  },

  // Emojis / Accents
  {
    id: 'emoji-fire',
    name: 'Fire Flame',
    category: 'accents',
    type: 'emoji',
    label: '🔥',
    color: '#F97316',
  },
  {
    id: 'emoji-mindblow',
    name: 'Mind Blown',
    category: 'accents',
    type: 'emoji',
    label: '🤯',
    color: '#FBBF24',
  },
  {
    id: 'emoji-skull',
    name: 'Dead Skull',
    category: 'accents',
    type: 'emoji',
    label: '💀',
    color: '#9CA3AF',
  },
  {
    id: 'emoji-money',
    name: 'Money Bag',
    category: 'accents',
    type: 'emoji',
    label: '💰',
    color: '#10B981',
  },
  {
    id: 'emoji-rocket',
    name: 'Rocket Launch',
    category: 'accents',
    type: 'emoji',
    label: '🚀',
    color: '#3B82F6',
  },

  // Cutouts / Reactions (High quality transparent-ready portraits)
  {
    id: 'cutout-surprised-guy',
    name: 'Astonished Creator',
    category: 'reactions',
    type: 'custom',
    color: '#FFE600',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cutout-hyped-girl',
    name: 'Hyped / Screaming',
    category: 'reactions',
    type: 'custom',
    color: '#00F0FF',
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cutout-thinking-man',
    name: 'Skeptical / Thinking',
    category: 'reactions',
    type: 'custom',
    color: '#8B5CF6',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cutout-serious-pro',
    name: 'Authority / Direct Gaze',
    category: 'reactions',
    type: 'custom',
    color: '#10B981',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  },
];

export const PRESET_BACKDROPS = [
  {
    id: 'bg-dark-neon-studio',
    name: 'Dark Cyber Studio',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280&auto=format&fit=crop&q=80',
    category: 'Tech & Gaming',
  },
  {
    id: 'bg-dramatic-spotlight',
    name: 'Dramatic Obsidian Spotlight',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1280&auto=format&fit=crop&q=80',
    category: 'Mystery & Crime',
  },
  {
    id: 'bg-finance-wealth',
    name: 'Wall Street Luxury',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1280&auto=format&fit=crop&q=80',
    category: 'Finance & Money',
  },
  {
    id: 'bg-creator-setup',
    name: 'Clean Creator Studio',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&auto=format&fit=crop&q=80',
    category: 'Podcasts & Vlog',
  },
  {
    id: 'bg-sunset-abstract',
    name: 'High Saturation Gradient',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1280&auto=format&fit=crop&q=80',
    category: 'Vibrant & Viral',
  },
  {
    id: 'bg-split-versus',
    name: 'Electric Split Arena',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80',
    category: 'Versus & Battle',
  },
];
