<script lang="ts">
    import sendIcon from "../icons/sendIcon.svg";
    import Message from "$lib/assets/components/Message.svelte";
    import Axios from "axios"
    import {onMount} from "svelte";
    import {resolve} from "$app/paths";
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
    }

    let message: string = "";
    let messages: ChatMessage[] = [];

    // function sendMessage() {
    //     if(!message.trim()) return;
    //
    //     messages = [
    //         ...messages,
    //         {
    //             id: message.length + 1,
    //             text: message,
    //             fromMe: true
    //         }
    //     ];
    //
    //     message = "";
    // }
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
    />


</div>

<style>
    .main {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 60%;
    }

    input {
        background-color: #280A40;
        border: 3px solid #3F1463;
        color: #573574;
        flex: 1;
        padding: 0.5rem;
        border-radius: 8px;
    }

    input:focus {
        outline: none;
    }

    .btn {
        background: #573574;
        border: none;
        border-radius: 15%;
        cursor: pointer;
        padding: 0.5rem;
    }

    .btn img {
        width: 20px;
        height: 20px;
    }

    .btn:hover {
        opacity: 0.8;
    }
</style>
