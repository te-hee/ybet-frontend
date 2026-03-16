import { useState, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import { useAuth } from '../../authContext.tsx';

import '../styles/chat.scss'

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
        const socket = new WebSocket("ws://localhost:8081/ws"); // [cite: 38]

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
                        ); // [cite: 40, 41]
                        break;
                    case "deleteMessage":
                        updatedMessages = updatedMessages.filter(
                            m => m.message_id !== data.payload.message_id
                        ); // [cite: 41, 42]
                        break;
                    default:
                        break;
                }

                if (updatedMessages.length > limit) {
                    return updatedMessages.slice(-limit); // [cite: 42]
                }
                return updatedMessages;
            });
        };

        socket.onerror = (err: Event) => console.error("WebSocket error:", err); // [cite: 43]
        socket.onclose = () => console.log("WS disconnected"); // [cite: 44]

        return () => {
            socket.close(); // [cite: 45]
        };
    }, [limit]);

    const handleEdit = async (id: string, message: string) => {
        const newContent = prompt("Edit message:", message); // [cite: 29]
        if (newContent !== null && newContent !== message) {
            try {
                await axios.patch("/api/messages", {
                    message_id: id,
                    content: newContent
                }, {
                    headers: { Authorization: `Bearer ${token}` } // [cite: 30, 31]
                });
            } catch (err) {
                console.error("Error editing message:", err);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this message?")) { // [cite: 34]
            try {
                await axios.delete("/api/messages", {
                    data: { message_id: id },
                    headers: { Authorization: `Bearer ${token}` } // [cite: 35]
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
                    message={msg.content}
                    timestamp={msg.timestamp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
}