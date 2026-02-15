<script lang="ts">
    import Message from "$lib/assets/components/Message.svelte";
    import axios from "axios";

    type ChatMessage = {
        id: number;
        text: string;
        fromMe: boolean;
    }

    import { token } from '$lib/stores/auth';
    import { get } from 'svelte/store';

    function sendMessage(content: string){
        const $token = get(token);
        axios.post("/api/messages", {
           content: content,
        }, {
            headers: {
                Authorization: `Bearer ${$token}`
            }
        })

        message = "";
    }

    let message: string = "";
    let messages: ChatMessage[] = [];

</script>

<div class="chat">
    {#each messages as msg (msg.id)}
        <Message message={msg.text} fromMe={true} id=0 />
    {/each}
</div>

<div class="main">
    <input
            type="text"
            placeholder="Enter message..."
            bind:value={message}
            on:keyup={(e) => e.key === "Enter" && sendMessage(message)}>

</div>

<style>
    @import '../styles/input.scss';
</style>
