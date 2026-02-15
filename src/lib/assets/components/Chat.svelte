<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Message from './Message.svelte';
    import { token } from '$lib/stores/auth';

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
                timestamp={msg.timestamp}/>
    {/each}
</div>
