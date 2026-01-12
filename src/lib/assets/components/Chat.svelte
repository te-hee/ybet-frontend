<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Message from './Message.svelte';

    export let limit: number = 10;
    const refreshTime = 300;

    interface Message {
        uuid: string;
        content: string;
        timestamp: number;
    }

    let messages: Message[] = [];
    let intervalId: any;

    async function fetchMessages() {
        try {
            const res = await fetch(`http://localhost:8080/messages?limit=${limit}`);
            if (!res.ok) throw new Error("Failed to fetch messages");
            const data = await res.json();
            messages = data.messages;
        } catch (err) {
            console.error(err);
        }
    }

    onMount(() => {
        fetchMessages();
        intervalId = setInterval(fetchMessages, refreshTime);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<div class="chat">
    {#each messages as msg (msg.uuid)}
        <Message message={msg.content} id={msg.uuid} timestamp={msg.timestamp}/>
    {/each}
</div>
