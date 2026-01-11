<script lang="ts">
    import { onMount } from 'svelte';
    import Message from './Message.svelte';

    export let limit: number = 1;

    interface Message {
        uuid: string;
        content: string;
        timestamp: number;
    }

    let messages: Message[] = [];
    onMount(async () => {
        const res = await fetch(`http://localhost:8080/messages?limit=${limit}`);
        const data = await res.json();
        messages = data.messages;
    });
</script>

<div class="chat">
    {#each messages as msg}
        <Message message={msg.content} id={msg.uuid[0]}/>
    {/each}
</div>

<style>
    @import '../styles/chat.scss';
</style>
