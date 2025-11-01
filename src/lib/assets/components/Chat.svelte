<script>
    import Message from "$lib/assets/components/Message.svelte";
    import axios from "axios";
    import { onMount } from "svelte"

    let messages = [];
    async function getMessages() {

    }

    onMount(() => {
        console.log("duh");
        getMessages();
    })

</script>

<div>
    {#each messages as msg, i}
        <Message messages={msg.Content} id="{1}"/>
    {/each}
</div>
