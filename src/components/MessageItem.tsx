import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Message } from '../types';
import '../styles/messages.css';

interface Props {
  message: Message;
  isOwn: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  onEdit: (messageId: string, content: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
  isNew?: boolean;
}

function formatTime(timestamp: number): string {
  const date = new Date(
    // heuristic: if timestamp looks like seconds rather than ms, convert
    timestamp < 1e12 ? timestamp * 1000 : timestamp,
  );
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function avatarChar(username: string): string {
  return username.charAt(0).toUpperCase();
}

export function MessageItem({
  message,
  isOwn,
  isDeleted,
  isEdited,
  onEdit,
  onDelete,
  isNew,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(message.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  async function handleSave() {
    const trimmed = editVal.trim();
    if (!trimmed || trimmed === message.content) { setEditing(false); return; }
    setSaving(true);
    try {
      await onEdit(message.message_id, trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`delete message?`)) return;
    setDeleting(true);
    try {
      await onDelete(message.message_id);
    } finally {
      setDeleting(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); void handleSave(); }
    if (e.key === 'Escape') { setEditing(false); setEditVal(message.content); }
  }

  const rowClass = ['msg-row', isNew ? 'new' : ''].filter(Boolean).join(' ');

  return (
    <div className={rowClass}>
      <div className={`msg-avatar${isOwn ? ' own' : ''}`}>
        {avatarChar(message.username)}
      </div>

      <div className="msg-content">
        <div className="msg-meta">
          <span className={`msg-username${isOwn ? ' own' : ''}`}>
            {message.username}
          </span>
          <span className="msg-time">{formatTime(message.timestamp)}</span>
        </div>

        {editing ? (
          <div className="msg-edit-form">
            <input
              ref={editRef}
              className="msg-edit-input"
              value={editVal}
              onChange={e => setEditVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={saving}
              maxLength={4096}
            />
            <button className="msg-edit-btn save" onClick={() => void handleSave()} disabled={saving}>save</button>
            <button className="msg-edit-btn cancel" onClick={() => { setEditing(false); setEditVal(message.content); }} disabled={saving}>esc</button>
          </div>
        ) : (
          <span
            className={[
              'msg-text',
              isDeleted ? 'deleted' : '',
              isEdited && !isDeleted ? 'edited' : '',
            ].filter(Boolean).join(' ')}
          >
            {isDeleted ? 'message deleted' : message.content}
          </span>
        )}
      </div>

      {/* Action buttons — only shown for own, non-deleted messages */}
      {isOwn && !isDeleted && !editing && (
        <div className="msg-actions">
          <button
            className="msg-action-btn edit"
            onClick={() => { setEditing(true); setEditVal(message.content); }}
          >
            edit
          </button>
          <button
            className="msg-action-btn delete"
            onClick={() => void handleDelete()}
            disabled={deleting}
          >
            {deleting ? '...' : 'del'}
          </button>
        </div>
      )}
    </div>
  );
}
