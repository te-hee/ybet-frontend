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
    .login-card {
        background: white;
        padding: 2rem 2.5rem;
        border-radius: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 320px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    h2 {
        text-align: center;
        color: #333;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }

    .input {
        padding: 0.75rem 1rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border 0.2s, box-shadow 0.2s;
    }

    .input:focus {
        border-color: #7b4397;
        box-shadow: 0 0 0 2px rgba(123, 67, 151, 0.2);
        outline: none;
    }

    .button {
        background: #7b4397;
        color: white;
        font-weight: 600;
        border: none;
        border-radius: 0.5rem;
        padding: 0.75rem;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
    }

    .button:hover {
        background: #9b5fc0;
    }

    .button:active {
        transform: scale(0.98);
    }
</style>