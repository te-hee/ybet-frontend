<script>
    import Message from "$lib/assets/components/Message.svelte";
</script>

<div>
    <Message message="Hey, how are you?" fromMe={false} id=0 />
    <Message message="I'm good, you?" fromMe={true} id=1 />
    <Message message="Doing great, thanks!" fromMe={false} id=0 />
    <Message message="Let's meet later." fromMe={true} id=1 />
</div>
