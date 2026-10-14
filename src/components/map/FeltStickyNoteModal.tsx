import React, { useState, useEffect } from 'react';
import { X, StickyNote, Trash2, CheckCircle2 } from 'lucide-react';
import { FeltStickyNote } from '../../types/setu.ts';

interface FeltStickyNoteModalProps {
  isOpen: boolean;
  note: FeltStickyNote | null;
  isNew: boolean;
  onSave: (updated: FeltStickyNote) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const FeltStickyNoteModal: React.FC<FeltStickyNoteModalProps> = ({
  isOpen,
  note,
  isNew,
  onSave,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [author, setAuthor] = useState(note?.author || '');
  const [priority, setPriority] = useState<'Critical' | 'Urgent' | 'Info'>(note?.priority || 'Critical');
  const [resolved, setResolved] = useState(note?.resolved || false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setAuthor(note.author);
      setPriority(note.priority);
      setResolved(note.resolved);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave({
      ...note,
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      author: author.trim() || 'Rescue Team',
      priority,
      resolved,
      timestamp: isNew ? 'Just now' : note.timestamp,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[12px] animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E3E0DD] shadow-2xl overflow-hidden text-[#423D38] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E3E0DD] bg-[#F3F4F6]">
          <div className="flex items-center gap-2 text-[#FE6E00] font-bold text-xs uppercase font-mono tracking-wider">
            <StickyNote className="w-4 h-4 text-[#FE6E00]" />
            <span className="text-[#423D38]">{isNew ? 'New Spatial Field Note' : 'Field Bulletin Note'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#797067] hover:text-[#423D38] hover:bg-[#EDEBE9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase text-[#797067] block mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Syabrubesi Ridge Cut-off"
              className="w-full px-3 py-2 rounded-xl bg-[#F3F4F6] border border-[#E3E0DD] text-sm font-semibold text-[#423D38] focus:outline-none focus:border-[#FE6E00]"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#797067] block mb-1">
              Field Observation / Instructions
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe situation, stranded population, winch requirements..."
              className="w-full px-3 py-2 rounded-xl bg-[#F3F4F6] border border-[#E3E0DD] text-xs text-[#423D38] focus:outline-none focus:border-[#FE6E00] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#797067] block mb-1">
                Author / Call-sign
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Capt. P. Thapa"
                className="w-full px-3 py-1.5 rounded-xl bg-[#F3F4F6] border border-[#E3E0DD] text-xs text-[#423D38] focus:outline-none focus:border-[#FE6E00]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#797067] block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#F3F4F6] border border-[#E3E0DD] text-xs text-[#423D38] focus:outline-none focus:border-[#FE6E00]"
              >
                <option value="Critical">🔴 Critical (Immediate)</option>
                <option value="Urgent">🟡 Urgent (4-6 hrs)</option>
                <option value="Info">🔵 Informational</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F3F4F6] border border-[#E3E0DD] text-xs">
            <span className="text-[#423D38] font-medium">Mark as Resolved</span>
            <button
              onClick={() => setResolved(!resolved)}
              className={`px-3 py-1 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition-colors ${
                resolved
                  ? 'bg-[#00C758]/20 text-[#016630] border border-[#00C758]/40'
                  : 'bg-[#EDEBE9] text-[#797067] border border-[#E3E0DD]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{resolved ? 'Resolved' : 'Active Open'}</span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-[#797067] flex items-center gap-2">
            <span>Coordinates:</span>
            <span className="text-[#FE6E00] font-bold">
              {note.lat.toFixed(4)}°N, {note.lng.toFixed(4)}°E
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E3E0DD] bg-[#F3F4F6]">
          {!isNew && onDelete ? (
            <button
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
              className="text-xs text-[#FB2C36] hover:text-red-700 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Note</span>
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#EDEBE9] hover:bg-[#E3E0DD] text-[#423D38] text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-[#FE6E00] hover:bg-[#FF6B00] text-white font-bold text-xs transition-colors shadow-sm"
            >
              {isNew ? 'Pin to Map' : 'Update Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
