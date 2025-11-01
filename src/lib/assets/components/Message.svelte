<script>
  export let id = "0"
  export let message = "siema";
  export let fromMe = false;
  const time = new Date();
  const hours = time.getHours()
  const minutes = time.getMinutes();
</script>

<div class="main {fromMe ? 'right' : 'left'}">
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
  }

  .my-message,
  .ur-message {
      border-radius: 0.5rem;
      position: relative;
      padding: 0 1rem;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 70%;
      word-wrap: break-word;
      font-size: .75rem;
  }

  .my-message {
      border: 1px solid #38125A;
      align-self: flex-end;
      background: #25083F;
  }

  .ur-message {
      border: 1px solid #302173;
      background: #231251;
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

