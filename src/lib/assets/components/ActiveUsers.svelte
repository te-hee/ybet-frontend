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
    @import '../styles/activeUsers.scss';
</style>