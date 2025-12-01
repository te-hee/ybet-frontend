<script>
    import Chat from "$lib/assets/components/Chat.svelte";
    import Input from "$lib/assets/components/Input.svelte";
    import ActiveUsers from "$lib/assets/components/ActiveUsers.svelte";
</script>

<div class="main">
    <div class="left">
        <Chat limit="100"/>
        <Input />
    </div>
    <div class="right">
        <ActiveUsers users={['Adam', 'Bartek']}/>
    </div>
</div>

<style>
    .main {
        max-height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .left{
        max-height: 100%;
        flex: 10;
    }
    .right{
        flex: 2;
    }
</style>