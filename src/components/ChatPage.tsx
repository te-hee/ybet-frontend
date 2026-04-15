import {
    useState,
    useEffect,
    useRef,
    useCallback,
    KeyboardEvent,
} from 'react';

import { AuthState, ChatItem, Message, OnlineUser, WSEnvelope } from '../types';
import { getMessages, sendMessage, editMessage, deleteMessage } from '../api';
import { useWebSocket, WSStatus } from '../hooks/useWebSocket';
import { MessageItem } from './MessageItem';
import '../styles/chat.css';
import '../styles/input.css';
import { UserList } from './UserList';

interface Props {
    auth: AuthState;
    onLogout: () => void;
}

let systemIdCounter = 0;
function sysId() { return `sys-${++systemIdCounter}`; }


export function ChatPage({ auth, onLogout }: Props) {
    const [items, setItems] = useState<ChatItem[]>([]);
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
    const [editedIds, setEditedIds] = useState<Set<string>>(new Set());
    const [newIds, setNewIds] = useState<Set<string>>(new Set());
    const [users, setUsers] = useState<OnlineUser[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loadError, setLoadError] = useState('');

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        getMessages(auth.token, 100)
            .then(msgs => {
                setItems(msgs.map(m => ({ kind: 'message', data: m })));

                const seen = new Map<string, OnlineUser>();
                for (const m of msgs) {
                    if (!seen.has(m.user_id)) {
                        seen.set(m.user_id, { user_id: m.user_id, username: m.username });
                    }
                }
                setUsers(Array.from(seen.values()));
            })
            .catch(err => {
                setLoadError(err instanceof Error ? err.message : 'Failed to load messages');
            });
    }, [auth.token]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [items]);

    useEffect(() => {
        const poll = setInterval(async () => {
            try {
                const msgs = await getMessages(auth.token, 100);
                setItems(prev => {
                    const existingIds = new Set(
                        prev.flatMap(i => i.kind === 'message' ? [i.data.message_id] : [])
                    );
                    const incoming = msgs.filter(m => !existingIds.has(m.message_id));
                    if (incoming.length === 0) return prev;
                    return [...prev, ...incoming.map(m => ({ kind: 'message' as const, data: m }))];
                });
                setItems(prev => prev.map(item => {
                    if (item.kind !== 'message') return item;
                    const fresh = msgs.find(m => m.message_id === item.data.message_id);
                    if (!fresh) return item;
                    if (fresh.content !== item.data.content) {
                        setEditedIds(e => new Set(e).add(fresh.message_id));
                        return { ...item, data: fresh };
                    }
                    return item;
                }));
            } catch {
            }
        }, 3000);
        return () => clearInterval(poll);
    }, [auth.token]);

    const handleWS = useCallback((env: WSEnvelope) => {
        switch (env.type) {

            case 'userMessage': {
                const p = env.payload as Message;
                setItems(prev => {
                    if (prev.some(i => i.kind === 'message' && i.data.message_id === p.message_id)) {
                        return prev;
                    }
                    return [...prev, { kind: 'message', data: p }];
                });
                setNewIds(prev => new Set(prev).add(p.message_id));
                setTimeout(() => {
                    setNewIds(prev => { const s = new Set(prev); s.delete(p.message_id); return s; });
                }, 400);
                break;
            }

            case 'editMessage': {
                const p = env.payload as { message_id: string; content: string };
                setItems(prev =>
                    prev.map(i =>
                        i.kind === 'message' && i.data.message_id === p.message_id
                            ? { ...i, data: { ...i.data, content: p.content } }
                            : i,
                    ),
                );
                setEditedIds(prev => new Set(prev).add(p.message_id));
                break;
            }

            case 'deleteMessage': {
                const p = env.payload as { message_id: string };
                setDeletedIds(prev => new Set(prev).add(p.message_id));
                break;
            }

            case 'systemMessage': {
                const p = env.payload as { content: string };
                setItems(prev => [...prev, { kind: 'system', id: sysId(), content: p.content }]);
                break;
            }

            case 'userListUpdate': {
                const p = env.payload as { action: 'connect' | 'disconnect'; user_id: string; username: string };
                if (p.action === 'connect') {
                    setUsers(prev => {
                        if (prev.some(u => u.user_id === p.user_id)) return prev;
                        return [...prev, { user_id: p.user_id, username: p.username }];
                    });
                } else {
                    setUsers(prev => prev.filter(u => u.user_id !== p.user_id));
                }
                break;
            }
        }
    }, []);

    const { status } = useWebSocket(auth.token, handleWS);

    async function handleSend() {
        const content = input.trim();
        if (!content || sending) return;

        setSending(true);
        setInput('');
        try {
            await sendMessage(auth.token, content);
        } catch (err) {
            setInput(content);
            console.error('Send failed', err);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSend();
        }
    }

    async function handleEdit(messageId: string, content: string) {
        await editMessage(auth.token, messageId, content);
        setItems(prev =>
            prev.map(i =>
                i.kind === 'message' && i.data.message_id === messageId
                    ? { ...i, data: { ...i.data, content } }
                    : i,
            ),
        );
        setEditedIds(prev => new Set(prev).add(messageId));
    }

    async function handleDelete(messageId: string) {
        await deleteMessage(auth.token, messageId);
        setDeletedIds(prev => new Set(prev).add(messageId));
    }

    const statusLabel: Record<WSStatus, string> = {
        open: 'connected',
        connecting: 'connecting...',
        closed: 'disconnected',
    };

    return (
        <div className="chat-root">
            <header className="chat-header">
                <span className="chat-header-logo">YBET</span>
                <span className="chat-header-sep">·</span>
                <span className="chat-header-channel">Main Chat</span>

                <div className="chat-header-status">
                    <div className={`status-dot ${status}`} />
                    {statusLabel[status]}
                    <span style={{ color: 'var(--border-hi)', margin: '0 4px' }}>·</span>
                    <span style={{ color: 'var(--text-muted)' }}>{auth.username}</span>
                    <button
                        onClick={onLogout}
                        style={{
                            marginLeft: 8,
                            background: 'none',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--text-faint)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            padding: '2px 8px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            transition: 'color 0.1s, border-color 0.1s',
                        }}
                        onMouseEnter={e => {
                            (e.target as HTMLButtonElement).style.color = 'var(--red)';
                            (e.target as HTMLButtonElement).style.borderColor = 'var(--red)';
                        }}
                        onMouseLeave={e => {
                            (e.target as HTMLButtonElement).style.color = 'var(--text-faint)';
                            (e.target as HTMLButtonElement).style.borderColor = 'var(--border)';
                        }}
                    >
                        logout
                    </button>
                </div>
            </header>

            <div className="chat-body">
                <div className="messages-col">
                    <div className="messages-scroll">
                        {loadError && (
                            <div className="login-error" style={{ margin: '8px 0' }}>
                                ⚠ {loadError}
                            </div>
                        )}

                        {items.length === 0 && !loadError && (
                            <div className="empty-state">
                                <div className="empty-emoji">💬</div>
                                <div>no messages yet</div>
                                <div style={{ color: 'var(--text-faint)', fontSize: 11 }}>
                                    be the first to yap :3
                                </div>
                            </div>
                        )}

                        {items.map(item => {
                            if (item.kind === 'system') {
                                return (
                                    <div key={item.id} className="system-msg">
                                        New user joined
                                    </div>
                                );
                            }

                            const msg = item.data;
                            return (
                                <MessageItem
                                    key={msg.message_id}
                                    message={msg}
                                    isOwn={msg.user_id === auth.user_id || msg.username === auth.username}
                                    isDeleted={deletedIds.has(msg.message_id)}
                                    isEdited={editedIds.has(msg.message_id)}
                                    isNew={newIds.has(msg.message_id)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            );
                        })}

                        <div ref={bottomRef} />
                    </div>

                    <div className="input-bar">
                        <div className="input-wrap">
                            <span className="input-prompt">›</span>
                            <textarea
                                ref={inputRef}
                                className="input-field"
                                rows={1}
                                placeholder="yap something... (shift+enter for newline)"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={sending || status !== 'open'}
                                maxLength={4096}
                            />
                            <button
                                className="send-btn"
                                onClick={() => void handleSend()}
                                disabled={!input.trim() || sending || status !== 'open'}
                                title="send"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <UserList users={users} selfUserId={auth.user_id} />
            </div>
        </div>
    );
}