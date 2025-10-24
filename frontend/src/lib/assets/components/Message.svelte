<script>
  export let id = "0"
  export let message = "siema";
  export let fromMe = false;
  const time = new Date();
  const hours = time.getHours()
  const minutes = time.getMinutes();
</script>

<div class="main {fromMe ? 'left' : 'right'}">
    {#if fromMe}
        <div class="my-message">
            <h3>{message}</h3>
            <span class="time">{hours}:{minutes.toString().padStart(2, "0")}</span>
        </div>
        <div class="pfp"><span>{id}</span></div>
    {:else}
        <div class="pfp"><span>{id}</span></div>
        <div class="ur-message">
            <h3>{message}</h3>
            <span class="time">{hours}:{minutes.toString().padStart(2, "0")}</span>
        </div>
    {/if}
</div>

<style>
  .main {
      color: #fff;
      padding: 1rem;
      border-radius: 1rem;
      width: 1000px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1rem auto;
  }

  .left {
      justify-content: flex-start;
      flex-direction: row-reverse;
  }

  .right {
      justify-content: flex-end;
      flex-direction: row-reverse;
  }

  .pfp {
      flex-shrink: 0;
      border-radius: 50%;
      background-color: brown;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 50px;
      outline: #7340a3 2px solid;
  }

  .my-message,
  .ur-message {
      position: relative;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      max-width: 70%;
      word-wrap: break-word;
  }

  .my-message {
      background-color: #7340a3;
      align-self: flex-end;
  }

  .ur-message {
      background-color: #333;
      align-self: flex-start;
  }

  .time {
      position: absolute;
      bottom: -20px;
      left: 5px;
      font-size: 0.75rem;
      opacity: 0.7;
  }

</style>

