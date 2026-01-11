<script>
  export let id = "0"
  export let message = "";
  const time = new Date();
  const hours = time.getHours()
  const minutes = time.getMinutes();
</script>

<div class="main">
        <div class="message">
            <div class="not-time">
                <span class="username-msg">{id}:</span>
                <span>{message}</span>
            </div>
            <span class="time">{hours}:{minutes.toString().padStart(2, "0")}</span>
        </div>
</div>

<style>
    @import '../styles/message.scss';
</style>

