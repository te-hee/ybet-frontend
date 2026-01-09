<script lang="ts">
    export let users: String[]
</script>

<div class="users">
    <h1>YbEt</h1>
    <div>
        {#each users as user}
            <span>{user}</span>
        {/each}
    </div>
</div>

<style>
    .users {
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    h1{
        font-size: 4rem;
        flex: 1;
    }
    .users > div{
        flex: 9;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
</style>