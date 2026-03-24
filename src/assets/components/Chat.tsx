import { useState, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import { useAuth } from '../../authContext.tsx';

import '../styles/chat.scss'

const message_api_url = '/api/messages';

interface ChatMessage {
    message_id: string;
    user_id: string;
    username: string;
    content: string;
    timestamp: number;
}

interface ChatProps {
    limit?: number;
}

export default function Chat({ limit = 10 }: ChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;

        const loadHistory = async () => {
            try {
                const response = await axios.get('/api/messages', {
                    params: { limit: limit },
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("API Response:", response.data);

                const incomingMessages = Array.isArray(response.data)
                    ? response.data
                    : (response.data.messages || []);

                setMessages(incomingMessages.slice(-limit));
            } catch (err) {
                console.error("Failed to load history", err);
            }
        };

        loadHistory();
    }, [limit, token]);

    useEffect(() => {
        if (!token) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws-proxy`;

        const socket = new WebSocket(wsUrl, [token]);

        socket.onopen = () => console.log("WS connected");

        socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            setMessages((prevMessages) => {
                let updatedMessages = [...prevMessages];

                switch (data.type) {
                    case "userMessage":
                        updatedMessages.push(data.payload);
                        break;
                    case "editMessage":
                        updatedMessages = updatedMessages.map(m =>
                            m.message_id === data.payload.message_id
                                ? { ...m, content: data.payload.content }
                                : m
                        );
                        break;
                    case "deleteMessage":
                        updatedMessages = updatedMessages.filter(
                            m => m.message_id !== data.payload.message_id
                        );
                        break;
                    default:
                        break;
                }

                if (updatedMessages.length > limit) {
                    return updatedMessages.slice(-limit);
                }
                return updatedMessages;
            });
        };

        socket.onerror = (err: Event) => console.error("WebSocket error:", err);
        socket.onclose = () => console.log("WS disconnected");

        return () => {
            socket.close();
        };
    }, [limit, token]);

    const handleEdit = async (id: string, message: string) => {
        const newContent = prompt("Edit message:", message);
        if (newContent !== null && newContent !== message) {
            try {
                await axios.patch(message_api_url, {
                    message_id: id,
                    content: newContent
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Error editing message:", err);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await axios.delete(message_api_url, {
                    data: { message_id: id },
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Error deleting message:", err);
            }
        }
    };

    return (
        <div className="chat">
            {messages.map((msg) => (
                <Message
                    key={msg.message_id}
                    id={msg.message_id}
                    username={msg.username}
                    message={msg.content}
                    timestamp={msg.timestamp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
}