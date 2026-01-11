<script>
    import Chat from "$lib/assets/components/Chat.svelte";
    import Input from "$lib/assets/components/Input.svelte";
    import ActiveUsers from "$lib/assets/components/ActiveUsers.svelte";
</script>

<main>
    <div class="left">
        <Chat limit="100"/>
        <Input />
    </div>
    <div class="right">
        <ActiveUsers users={['Adam', 'Bartek']}/>
    </div>
</main>

<style>
    main {
        height: 100vh;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .left{
        flex: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .right{
        flex: 2;
    }
</style>