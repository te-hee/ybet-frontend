<script>
  export let id = "0"
  export let message = "";
  export let timestamp;
  const time = new Date(timestamp * 1000);
  const hours = time.getHours()
  const minutes = time.getMinutes();
</script>

<div class="message">
    <div class="not-time">
        <span class="username-msg">{id}:</span>
        <span>{message}</span>
    </div>
    <span class="time">{new Date(timestamp * 1000)}</span>
    <span class="time">{hours}:{minutes.toString().padStart(2, "0")}</span>
</div>

<style>
    @import '../styles/message.scss';
</style>

