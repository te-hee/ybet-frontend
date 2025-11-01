<script lang="ts">
    import { onMount } from 'svelte';
    import Message from './Message.svelte';

    export let limit: number = 1;

    interface Message {
        Uuid: string;
        Content: string;
        Timestamp: number;
    }

    let messages: Message[] = [];
    onMount(async () => {
        const res = await fetch(`http://localhost:8080/messages?limit=${limit}`);
        const data = await res.json();
        messages = data.Messages;
    });
</script>

{#each messages as msg}
    <Message message={msg.Content} />
{/each}
