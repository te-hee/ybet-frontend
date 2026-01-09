<script lang="ts">
    import Message from "$lib/assets/components/Message.svelte";
    import axios from "axios";

    type ChatMessage = {
        id: number;
        text: string;
        fromMe: boolean;
    }

    function sendMessage(content: string){
        axios.post("http://localhost:8080/messages", {
           content: content,
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
    .main {
        bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        opacity: 25%;
        transition:  .25s;
    }

    .main:hover {
        opacity: 1;
    }

    input {
        background-color: #8E8E8E;
        color: #ffffff;
        flex: 1;
        padding: 0.5rem;
    }

    input:focus {
        outline: none;
    }
</style>
