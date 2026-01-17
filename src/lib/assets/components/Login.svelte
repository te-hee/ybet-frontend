<script>
    import { onMount } from "svelte";
    import { token } from "$lib/stores/auth.js";

    let username = "";

    onMount(() => {
        if (!document.cookie.includes('id=')){
            document.cookie = `id=${Math.floor(Math.random() * 1000000)}; path=/; max-age=86400`;
        }
    });

    async function login() {
      console.log(username)
      const res = await fetch('http://localhost:8080/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      }).then(res => {
        if (!res.ok) throw new Error("login failed");
        return res.json();
      }).then(data => {
        token.set(data.token);
        console.log("JWT:", data.token)
      }).catch(err => {
        console.error(err);
      })
    }
</script>

<div class="login-card">
    <h2>Log In</h2>
    <input placeholder="Username" class="input" bind:value={username} />
    <!-- <input placeholder="Password" type="password" class="input" /> -->
    <button id="login" class="button" on:click={login}>Log In</button>
</div>

<style>
    @import '../styles/login.scss';
</style>
