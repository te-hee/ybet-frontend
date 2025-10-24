<script>
  export let id = 0
  export let message = "siema";
  const time = new Date();
  const hours = time.getHours()
  const minutes = time.getMinutes();
</script>

<div class="main">
  <div class="my-message ur-message">
    <h3>{message}</h3>
    <span class="time">{hours} : {minutes}</span>
  </div>
  <div class="pfp"><span>{id}</span></div>
  <!--someone message  -->
</div>
  <style>
    .main {
    color: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    width: 600px;
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 1rem;
  }

  .pfp{
    flex: 1;
    border-radius: 90%;
    background-color: brown;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
      max-height: 50px;
    width: 50px;
      max-width: 50px;
      outline: #7340a3 2px solid;
  }

  .my-message{
    position: relative;
    flex: 9;
    display: flex;
    align-items: center;
      padding: 0 1rem;
      outline: 1px solid #fff;
      border-radius: 1rem;
  }
  .time{
      position:absolute;
      bottom: -25px;
      left: 5px;
  }
 
  
</style>
