<script>
    import { onMount } from "svelte";

    onMount(() => {
        if (!document.cookie.includes('id=')){
            document.cookie = `id=${Math.floor(Math.random() * 1000000)}; path=/; max-age=86400`;
        }
    });
</script>

<div class="login-card">
    <h2>Log In</h2>
    <input placeholder="Username" class="input" />
    <input placeholder="Password" type="password" class="input" />
    <button id="login" class="button">Log In</button>
</div>

<style>
    @import '../styles/login.scss';
</style>