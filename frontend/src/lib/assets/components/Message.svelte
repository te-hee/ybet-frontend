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
    background: linear;
    color: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    width: 600px;
    min-height: 800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    outline: 1px solid #fff;
    gap: 3rem;
   
  }

  .pfp{
    flex: 1;
    border-radius: 90%;
    background-color: purple;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
  }

  .my-message{
    flex: 9;
    display: flex;
    align-items: center;
    background-color: blue;
  }
  .time{
    position:absolute;
    bottom: 0; 
  }
 
  
</style>
