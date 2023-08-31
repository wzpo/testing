<template>
  <div class="status-indicator" :class="[os, theme]">

    <div v-if="meetingType === 'webex' || meetingType === 'video-call'" class="time" :class="{bg: fullscreen}" >{{ timestr }}</div>

    <span v-if="(meetingType === 'webex' || os === 'win') && !fullscreen" style="width:2px; margin-right: 4px;" ></span>

    <wl-icon v-if="meetingType === 'webex' && recordOn && !recordPaused" style="margin-right: 4px;" name="record-filled" size="20" :color=" theme === 'light' ? 'red-60' : 'red-50' " />
    <wl-icon v-if="meetingType === 'webex' && recordOn && recordPaused" style="margin-right: 4px;" name="record-paused-filled" size="20" :color=" theme === 'light' ? 'yellow-60' : 'yellow-50' " />

    <wl-icon v-if="meetingType === 'webex' && meetingLocked" style="margin-right: 4px;" name="private-circle-filled" size="20" :color=" theme === 'light' ? 'gray-50' : 'gray-50' " />

    <svg v-if="meetingType === 'webex' && networkgood" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99859 18.4405C14.6599 18.4405 18.4386 14.6618 18.4386 10.0005C18.4386 5.33926 14.6599 1.56055 9.99859 1.56055C5.33731 1.56055 1.55859 5.33926 1.55859 10.0005C1.55859 14.6618 5.33731 18.4405 9.99859 18.4405ZM13.1636 5.78052C13.4549 5.78052 13.6911 6.01669 13.6911 6.30802V13.1655C13.6911 13.4568 13.4549 13.693 13.1636 13.693C12.8723 13.693 12.6361 13.4568 12.6361 13.1655V6.30802C12.6361 6.01669 12.8723 5.78052 13.1636 5.78052ZM10.5261 7.89054C10.5261 7.59921 10.2899 7.36304 9.9986 7.36304C9.70727 7.36304 9.4711 7.59921 9.4711 7.89054V13.1655C9.4711 13.4569 9.70727 13.693 9.9986 13.693C10.2899 13.693 10.5261 13.4569 10.5261 13.1655V7.89054ZM7.36109 10.0005C7.36109 9.70919 7.12492 9.47302 6.83359 9.47302C6.54226 9.47302 6.30609 9.70919 6.30609 10.0005V13.1655C6.30609 13.4569 6.54226 13.693 6.83359 13.693C7.12492 13.693 7.36109 13.4569 7.36109 13.1655V10.0005Z" fill="#3CC29A"/>
    </svg>
    <span v-if="meetingType === 'webex' && !networkgood" ref="signal" @mouseover="showSignalDropdown">
      <svg style="pointer-events: none;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99859 18.4405C14.6599 18.4405 18.4386 14.6618 18.4386 10.0005C18.4386 5.33926 14.6599 1.56055 9.99859 1.56055C5.33731 1.56055 1.55859 5.33926 1.55859 10.0005C1.55859 14.6618 5.33731 18.4405 9.99859 18.4405ZM10.5261 7.89054C10.5261 7.59921 10.2899 7.36304 9.9986 7.36304C9.70727 7.36304 9.4711 7.59921 9.4711 7.89054V13.1655C9.4711 13.4569 9.70727 13.693 9.9986 13.693C10.2899 13.693 10.5261 13.4569 10.5261 13.1655V7.89054ZM7.36109 10.0005C7.36109 9.70919 7.12492 9.47302 6.83359 9.47302C6.54226 9.47302 6.30609 9.70919 6.30609 10.0005V13.1655C6.30609 13.4569 6.54226 13.693 6.83359 13.693C7.12492 13.693 7.36109 13.4569 7.36109 13.1655V10.0005ZM13.1636 12.6381C13.4549 12.6381 13.6911 12.8742 13.6911 13.1656C13.6911 13.4569 13.4549 13.6931 13.1636 13.6931C12.8723 13.6931 12.6361 13.4569 12.6361 13.1656C12.6361 12.8742 12.8723 12.6381 13.1636 12.6381Z" fill="#FF9D52"/>
      </svg>
    </span>
    
  </div>
</template>

<script>

export default {
  name: 'StatusIndicator',
  props:{
    meetingId: {
      type: String,
    },
    type: {
      default: 'in-meeting',
    },
  },
  data () {
    return {
      networkgood: true,
      signalDropdownVisible: false,
    }
  },
  mounted () {
    this.startTimer();
  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    recordOn() {
      return this.$store.state.recordOn;
    },
    recordPaused() {
      return this.$store.state.recordPaused;
    },
    meetingLocked() {
      return this.$store.state.meetingLocked;
    },
    meetingTimerObj() {
      return this.$store.state.meetingTimerObj;
    },
    timestr() {
      const sec = this.meetingTimerObj.value;
      var m = Math.floor(sec / 60);
      var s = sec % 60
      return this.formatNum(m) + ':' + this.formatNum(s);
    },
    meetingType() {
      return this.$store.getters.meetingType(this.meetingId)
    },

  },
  watch: {

  },
  methods: {
    startTimer(){
      if (this.meetingTimerObj.intervalId === 0) {
        const intervalId = setInterval(() => {
          this.$store.commit("meetingTimerObj", {value: this.countTime(), intervalId: this.meetingTimerObj.intervalId});
          this.networkgood = this.countTime() % 10 > 5;
        }, 1000);
        
        this.$store.commit("meetingTimerObj", {value: this.countTime(), intervalId: intervalId});
      }
    },
    stopTimer(){
      clearInterval(this.meetingTimerObj.intervalId);
    },
    countTime(){
      return this.meetingTimerObj.value + 1;
    },
    formatNum(n){
      if(n < 10){
        return ('0' + n);
      }else{
        return n;
      }
    },

    showSignalDropdown() {
      if (!this.signalDropdownVisible) {
        this.$popper.show(
          {
            template: `
              <div style="width:290px; padding: 10px;" >
                <div style="font-weight: bold; font-size: 15px;" >Heads up</div>
                <div style="line-height: 22px; font-size: 15px;" >You're having bandwidth issues. We've turned off your video until bandwidth improves.</div>
              </div>
            `,
            props: [],
            methods: {
              close() {
                this.$popper.hideAll();
              },
            }
          },
          {
          }, // component props
          {
            reference: this.$refs.signal,
            closeTrigger: 'mouseout',
            arrowVisible: false,
            roundedCorner: true,
            frameless: false,
            borderRadius: '12px',
            backgroundColor: this.themeColorList['dark'][this.themeColor]['content'][1],
            appendToBody: true,
            theme: `dark ${this.themeColor}`,
            options: {placement: 'bottom'},
          }, // popper props
          {
            opened: () => {this.signalDropdownVisible = true},
            closed: () => {this.signalDropdownVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },


  },
}
</script>

<style lang="scss">
  .status-indicator {
    display: flex;
    align-items: center;
  
    font-size: 12px;
    color: #000000;
    user-select: none;

    .time {
      margin-right: 10px;

      &.bg {
        padding: 0 4px;
        border-radius: 4px;
        background-color: white;
      }
    }

    .ico-lock path {
      fill: #000000;
      fill-opacity: .6;
    }

    

    /* ------ dark/hybrid ------- */
    &.dark, &.hybrid {
      color: $text-color-primary-dark-ui;

      .divider{
        stroke: $md-gray-50;
      }

      .time {
        &.bg {
          background-color: $md-gray-90;
        }
      }

      .ico-lock path {
        fill: #FFFFFF;
        fill-opacity: .6;
      }
    }

}

</style>
