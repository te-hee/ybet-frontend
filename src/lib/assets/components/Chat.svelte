<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Message from './Message.svelte';
    import { token } from '$lib/stores/auth';
    import axios from 'axios';
    import { get } from 'svelte/store';

    export let limit: number = 10;

    interface ChatMessage {
        message_id: string;
        user_id: string;
        username: string;
        content: string;
        timestamp: number;
    }

    let messages: ChatMessage[] = [];
    let socket: WebSocket;

    async function handleEdit(event: CustomEvent<{ id: string, message: string }>) {
        const { id, message } = event.detail;
        const newContent = prompt("Edit message:", message);
        if (newContent !== null && newContent !== message) {
            const $token = get(token);
            try {
                await axios.patch("/api/messages", {
                    message_id: id,
                    content: newContent
                }, {
                    headers: {
                        Authorization: `Bearer ${$token}`
                    }
                });
            } catch (err) {
                console.error("Error editing message:", err);
            }
        }
    }

    async function handleDelete(event: CustomEvent<{ id: string }>) {
        const { id } = event.detail;
        if (confirm("Are you sure you want to delete this message?")) {
            const $token = get(token);
            try {
                await axios.delete("/api/messages", {
                    data: { message_id: id },
                    headers: {
                        Authorization: `Bearer ${$token}`
                    }
                });
            } catch (err) {
                console.error("Error deleting message:", err);
            }
        }
    }

    onMount(() => {
        socket = new WebSocket("ws://localhost:8081/ws");

        socket.onopen = () => {
            console.log("WS connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "userMessage":
                    messages = [...messages, data.payload];
                    break;

                case "editMessage":
                    messages = messages.map(m =>
                        m.message_id === data.payload.message_id
                            ? { ...m, content: data.payload.content }
                            : m
                    );
                    break;

                case "deleteMessage":
                    messages = messages.filter(
                        m => m.message_id !== data.payload.message_id
                    );
                    break;
            }

            if (messages.length > limit) {
                messages = messages.slice(-limit);
            }
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        socket.onclose = () => {
            console.log("WS disconnected");
        };
    });

    onDestroy(() => {
        socket?.close();
    });
</script>

<div class="chat">
    {#each messages as msg (msg.message_id)}
        <Message
                message={msg.content}
                id={msg.message_id}
                timestamp={msg.timestamp}
                on:edit={handleEdit}
                on:delete={handleDelete}
        />
    {/each}
</div>
