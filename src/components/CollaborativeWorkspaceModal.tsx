import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  MessageSquare,
  MessageSquarePlus,
  Send,
  Trash2,
  Share2,
  Check,
} from 'lucide-react';
import { ReviewComment, ThumbnailProject } from '../types/thumbnail';

interface CollaborativeWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ThumbnailProject['status'];
  onUpdateStatus: (status: ThumbnailProject['status']) => void;
  comments: ReviewComment[];
  onAddComment: (commentText: string, author: string, role: string) => void;
  onToggleResolveComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onStartAddPin: () => void;
}

const TEAM_MEMBERS = [
  {
    name: 'Sarah Chen',
    role: 'Art Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    color: 'border-pink-500',
  },
  {
    name: 'Marcus Vance',
    role: 'Channel Manager',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    color: 'border-blue-500',
  },
  {
    name: 'Alex Rivera',
    role: 'Lead Creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    color: 'border-amber-500',
  },
  {
    name: 'David Kim',
    role: 'Video Editor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    color: 'border-emerald-500',
  },
];

export const CollaborativeWorkspaceModal: React.FC<CollaborativeWorkspaceModalProps> = ({
  isOpen,
  onClose,
  status,
  onUpdateStatus,
  comments,
  onAddComment,
  onToggleResolveComment,
  onDeleteComment,
  onStartAddPin,
}) => {
  const [activeMember, setActiveMember] = useState(TEAM_MEMBERS[0]);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handlePostComment = () => {
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText, activeMember.name, activeMember.role);
    setNewCommentText('');
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const workflowSteps: { id: ThumbnailProject['status']; label: string; icon: any }[] = [
    { id: 'draft', label: '1. Draft', icon: FileCheck },
    { id: 'in_review', label: '2. In Review', icon: Clock },
    { id: 'needs_changes', label: '3. Needs Changes', icon: AlertCircle },
    { id: 'approved', label: '4. Approved', icon: ShieldCheck },
    { id: 'published', label: '5. Published', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Team Collaboration & Design Review Board</h2>
              <p className="text-xs text-zinc-400">
                Align art directors, video editors, and channel managers with on-canvas pin feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Review Link'}</span>
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
          {/* Workflow Pipeline */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Approval Pipeline Status
            </span>
            <div className="grid grid-cols-5 gap-2">
              {workflowSteps.map((step) => {
                const isActive = status === step.id;
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => onUpdateStatus(step.id)}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Reviewer Perspective */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Reviewing As Team Member:
              </span>
              <span className="text-xs text-indigo-400 font-semibold">{activeMember.role}</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member.name}
                  onClick={() => setActiveMember(member)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    activeMember.name === member.name
                      ? 'bg-zinc-800 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="truncate">
                    <div className="font-bold text-xs text-white truncate">{member.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{member.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Comments and Pin Markers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span className="font-extrabold text-sm text-white">Review Feedback & Pins ({comments.length})</span>
              </div>

              <button
                onClick={() => {
                  onStartAddPin();
                  onClose();
                }}
                className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Drop Review Pin on Canvas</span>
              </button>
            </div>

            {/* Quick Comment Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                placeholder={`Leave feedback as ${activeMember.name} (${activeMember.role})...`}
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 outline-none"
              />
              <button
                onClick={handlePostComment}
                disabled={!newCommentText.trim()}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {comments.map((comment, idx) => (
                <div
                  key={comment.id}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                    comment.resolved
                      ? 'bg-zinc-950/50 border-zinc-800/60 opacity-60'
                      : 'bg-zinc-950/90 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-white">{comment.author}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {comment.role}
                        </span>
                        <span className="text-[10px] text-zinc-500">• {comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-snug">{comment.text}</p>
                      <div className="text-[10px] text-zinc-500">
                        Pin placed at: X {comment.x}%, Y {comment.y}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleResolveComment(comment.id)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded-md border flex items-center gap-1 transition-colors ${
                        comment.resolved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{comment.resolved ? 'Resolved' : 'Resolve'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="p-1 rounded hover:bg-red-900/40 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
