export default {
  start(timeObj){
    timeObj.seconds = timeObj.value
    if (!timeObj.intervalId) {
      timeObj.intervalId = setInterval(() => {
        if (!timeObj.paused) {
          this.setTimer(timeObj);
        }
      }, 1000);
      this.setTimer(timeObj);
    }
  },
  stop(timeObj){
    clearInterval(timeObj.intervalId);
  },
  pause(timeObj){
    timeObj.paused = true;
  },
  resume(timeObj){
    timeObj.paused = false;
  },
  setTimer(timeObj){
    function formatNum(n){
      if(n < 10){
        return ('0' + n);
      }else{
        return n;
      }
    }
    if (timeObj.countdown){
      if (timeObj.seconds > 0) {
        timeObj.seconds--;
      }
      
    } else {
      timeObj.seconds++;
    }
    var m = Math.floor(timeObj.seconds / 60);
    var s = timeObj.seconds % 60

    timeObj.value = formatNum(m) + ':' + formatNum(s);
  },
}
