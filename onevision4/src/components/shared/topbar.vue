<template>
  <div class="wintopbar" :class="[os, theme]" @mousedown="appHeaderMousedown">
    <div v-if="os === 'win'" class="titlebar" :style="{height: height}">
      <div class="left">
        <div v-if="showLogo && !fullscreen" class="logo webex"></div>
        <!--
        <div v-if="meetingTitle || title" class="title txt">{{ type==='in-meeting' ? meetingTitle : title }}</div>
        -->

        <div v-if="menuVisible && !fullscreen" class="title txt">
          Webex
          <wl-icon 
            name="arrow-down-bold" 
            size="12"
            style="margin-left: 4px;"
          />
        </div>
        <wl-icon v-if="menuVisible && !fullscreen" name="dot-divider-XXX" size="4" class="dot-divider" />
        <div v-if="title" class="title txt">{{ title }}</div>

        <svg v-if="meetingType === 'audio-call' || meetingType === 'video-call'" class="noise-remove-icon" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.375 8.09082C15.375 11.6807 12.4649 14.5908 8.875 14.5908C5.28515 14.5908 2.375 11.6807 2.375 8.09082C2.375 4.50097 5.28515 1.59082 8.875 1.59082C12.4649 1.59082 15.375 4.50097 15.375 8.09082ZM9.37287 3.54472C9.34906 3.28754 9.13328 3.09082 8.875 3.09082C8.61672 3.09082 8.40094 3.28754 8.37713 3.54472L8.09398 6.6027L7.77299 6.2817L7.70463 5.72334C7.67484 5.48005 7.4731 5.29423 7.22819 5.28449C7.10122 5.27944 6.98205 5.3225 6.8899 5.39861L5.72855 4.23727C5.53329 4.042 5.21671 4.042 5.02145 4.23727C4.85012 4.40859 4.82912 4.67332 4.95845 4.86755L12.0983 12.0074C12.2925 12.1367 12.5572 12.1157 12.7286 11.9444C12.9238 11.7491 12.9238 11.4325 12.7286 11.2373L11.7207 10.2294C11.781 10.1717 11.8274 10.0985 11.8531 10.0145L12.2022 8.8739C12.2922 8.95711 12.4122 9.00679 12.5417 9.00679H13.875C14.1511 9.00679 14.375 8.78293 14.375 8.50679C14.375 8.23064 14.1511 8.00679 13.875 8.00679H12.934L12.694 7.02653C12.6405 6.80794 12.4475 6.65204 12.2226 6.64564C11.9976 6.63925 11.7961 6.78392 11.7302 6.99911L11.472 7.84272L11.0316 5.68413C10.9826 5.44398 10.7667 5.27476 10.5218 5.28449C10.2769 5.29423 10.0752 5.48005 10.0454 5.72334L9.77732 7.91279L9.37287 3.54472ZM10.3272 11.6505L8.99586 10.3192L9.21046 12.6369C9.23402 12.8913 9.44553 13.087 9.70096 13.0908C9.95639 13.0945 10.1736 12.9051 10.2046 12.6516L10.3272 11.6505ZM8.77463 10.0979L6.31889 7.64221L6.27798 7.84272L6.17149 7.49481L5.35731 6.68063C5.21 6.73909 5.09535 6.86588 5.05601 7.02653L4.81599 8.00679H3.875C3.59886 8.00679 3.375 8.23064 3.375 8.50679C3.375 8.78293 3.59886 9.00679 3.875 9.00679H5.20833C5.33775 9.00679 5.45776 8.95711 5.5478 8.8739L5.89689 10.0145C5.96381 10.2331 6.17053 10.3785 6.39892 10.3676C6.62732 10.3566 6.81919 10.1921 6.86491 9.96809L7.08486 8.89011L7.54537 12.6516C7.57642 12.9051 7.79361 13.0945 8.04904 13.0908C8.30447 13.087 8.51598 12.8913 8.53954 12.6369L8.77463 10.0979ZM10.7379 9.24659L10.6342 9.1429L10.6651 8.89011L10.7379 9.24659Z" fill="white"/>
        </svg>

        <!--wl-icon v-if="meetingType === 'audio-call'" name="dot-divider" size="4" class="dot-divider" style="margin-right: -8px;" /-->

        <span v-if="meetingType === 'audio-call' || meetingType === 'video-call'" class="callinfo">
          {{meetingCallInfo.people.name}}
          <!--svg v-if="meetingType === 'video-call'" class="divider" width="2" height="14" viewBox="0 0 2 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.750916 1.39673V13.3967" stroke="white" stroke-opacity="0.2" stroke-linecap="round"/>
          </svg-->
          <!--span v-if="meetingType === 'video-call'" >Work: {{meetingCallInfo.number}}</span-->
        </span>

        <div v-if="type==='in-meeting'" ref="btninfo" class="btn_info" :class="{active: popInfoVisible}" @click="toggleInfo" >
          <wl-icon 
            v-if="meetingType === 'webex'"
            name="end-to-end-encryption" 
            color="blue-50"
            size="14"
            class="infoicon"
          />
          <span v-if="meetingType === 'webex'" class="txt">Meeting Info</span>
        </div>

      </div>

      <div class="mid" >
        <speaking-bubble v-if="type==='in-meeting' && !devicePaired" :activeSpeaker="activeSpeakerName" />
      </div>

      <div class="right">

        <slot name="right"></slot>
        
        <status-indicator v-if="type==='in-meeting'" :meetingId="meetingId"></status-indicator>


        <div 
          v-if="type==='in-meeting' && meetingType === 'webex'"
          v-show="!devicePaired || deviceInSharing" 
          class="btn-zoom" 
          :style="styleObject" >
          <wl-icon 
            name="zoom-in-bold" 
            size="14"
            class="ico"
          />
        </div>

        <layout-switch 
          v-if="type==='in-meeting' && meetingType === 'webex'"
          :meetingId="meetingId"
          v-show="!devicePaired || deviceInSharing" 
          :defaultLabel="!devicePaired ? 'Layout' : 'Device layout'"
          class="btn-switch"
        ></layout-switch>

        <div v-if="$store.state.aiEnabled && type==='in-meeting' && meetingType === 'webex'" class="topbar-ai" :class="{active: inMeetingGptPanelVisible}" @click="toggleGptPanel">
          <div class="ai" >
            <img src="~@/assets/img/ai-bot.svg" class="aiicon" />
          </div>
          <!--div class="ai">
            <video ref="aianimation" src="~@/assets/video/ai-talk-animation.mp4" loop="true"
              class="aianimation"></video>
          </div-->
        </div>

        <span style="margin-right: 8px;" ></span>
        
        <window-controls
          v-show="!fullscreen"
          :buttons="buttons"
          :active="active"
          :windowsSize="windowsSize"
          @minimize="minimize"
          @close="close"
          @toggleSize="toggleWindowsSize"
        />

      </div>
    </div> <!---win--->


    <div v-if="os === 'mac'" class="titlebar" :style="{height: height}">
      <div class="left">
        <window-controls
          :active="active"
          :buttons="buttons"
          :windowsSize="windowsSize"
          @minimize="minimize"
          @close="close"
          @toggleSize="toggleWindowsSize"
        />

        <div v-if="type==='in-meeting'" ref="btninfo" class="btn_info" :class="{active: popInfoVisible}" @click="toggleInfo"  style="margin-left:15px;">
          <wl-icon 
            v-if="meetingType === 'webex'"
            name="end-to-end-encryption" 
            color="blue-50"
            size="14"
            class="infoicon"
          />
          <span v-if="meetingType === 'webex'" class="txt">Meeting Info</span>
          <span v-if="meetingType !== 'webex'" class="txt">{{meetingCallInfo.number}}</span>
        </div>

      </div>

      <div class="mid" >
        <!--div v-if="title" class="logo webex"></div-->
        <!--
        <div v-if="meetingTitle || title" class="title txt">{{ type==='in-meeting' ? meetingTitle : title }}</div>
        -->
        <!--div v-if="title" class="title txt">{{ title }}</div-->

        <speaking-bubble v-if="type==='in-meeting' && !devicePaired" :activeSpeaker="activeSpeakerName" />

      </div>

      <div class="right">

        <slot name="right"></slot>

        <status-indicator v-if="type==='in-meeting'" :meetingId="meetingId"></status-indicator>

        <div 
          v-if="type==='in-meeting' && meetingType === 'webex'"
          v-show="!devicePaired || deviceInSharing" 
          class="btn-zoom" 
          :style="styleObject" >
          <wl-icon 
            name="zoom-in-bold" 
            size="16"
            class="ico"
          />
        </div>

        <layout-switch 
          v-if="type==='in-meeting' && meetingType === 'webex'"
          :meetingId="meetingId"
          v-show="!devicePaired || deviceInSharing" 
          :defaultLabel="!devicePaired ? 'Layout' : 'Device layout'"
          class="btn-switch"
        ></layout-switch>

        

        <span style="margin-left: 8px;" ></span>

      </div>
    </div> <!---mac--->

  </div>
</template>

<script>
import popInfo from '../meeting/pop-info.vue'

export default {
  name: 'Topbar',
  props: {
    meetingId: null,
    active: {
      type: Boolean,
      default: true,
    },
    type: {
      default: 'in-meeting'
    },
    title: {
      default: null,//'Webex'
    },
    menuVisible: {
      default: false
    },
    buttons: {
      type: Array,
    },
    height: {
      type: String,
      default: '32px'
    },
    showLogo: {
      default: true
    },
    titleStyle: {
      default: ''
    },
    defaultWindowsSize: {
      default: 'normal'
    },
  },
  data () {
    return {
      popInfoVisible: false,
      windowsSize: null,
    }
  },
  beforeMount() {
    this.windowsSize = this.defaultWindowsSize
  },
  mounted () {
    if(this.aiEnabled && this.$refs.aianimation){
      this.$refs.aianimation.currentTime = 3
      this.$eventBus.$on('ai-animation-start', this.playAiAnimation );
      this.$eventBus.$on('ai-animation-stop', this.stopAiAnimation );
    }
    
  },
  beforeDestroy() {
    if(this.aiEnabled){
      this.$eventBus.$off('ai-animation-start', this.playAiAnimation );
      this.$eventBus.$off('ai-animation-stop', this.stopAiAnimation );
    }
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
    itembgColor() {
      return this.themeColorList[this.theme][this.themeColor]['itembg'];
    },
    styleObject() {
      return {
        '--item-back-color': this.themeColorList[this.theme][this.themeColor]['app'][1],
        '--item-back-hover': this.itembgColor.hover,
        '--item-back-active': this.itembgColor.active,
      };
    },

    fullscreen() {
      return this.$store.state.fullscreen;
    },
    recordOn() {
      return this.$store.state.recordOn;
    },
    currentSharing() {
      return this.$store.getters.currentSharing(this.meetingId)
    },
    meetingTitle() {
      return this.meetingType === 'webex' ? this.$store.state.meetingTitle : this.meetingCallInfo.people.name;
    },
    meetingLocked() {
      return this.$store.state.meetingLocked;
    },
    systemBarVisible() {
      return this.$store.state.systemBarVisible;
    },
    meetingType() {
      return this.$store.getters.meetingType(this.meetingId)
    },
    meetingCallInfo() {
      return this.$store.getters.meetingCallInfo(this.meetingId)
    },
    devicePaired() {
      return this.$store.state.devicePaired;
    },
    deviceInSharing() {
      return this.$store.state.deviceInSharing;
    },
    activeSpeakerName() {
      return this.$store.state.activeSpeakerName;
    },
    inMeetingGptPanelVisible() {
      return this.$store.state.inMeetingGptPanelVisible;
    },
    stageMaximized() {
      return this.$store.state.stageMaximized;
    },

  },
  watch: {

  },
  methods: {
    playAiAnimation() {
      this.$refs.aianimation.play()
    },
    stopAiAnimation() {
      this.$refs.aianimation.pause()
      this.$refs.aianimation.currentTime = 3
    },
    appHeaderMousedown(evt) {
      this.$emit('mousedown', evt);
    },
    toggleWindowsSize(){
      this.$store.commit('disableElementTransition', true);
      if (this.windowsSize === 'max') {
        this.windowsSize = 'normal'
        this.$emit('windowsSizeChanged', 'normal');
      } else {
        this.windowsSize = 'max'
        this.$emit('windowsSizeChanged', 'max');
      }
    },

    toggleInfo() {
      if (!this.popInfoVisible) {

        this.$popper.show(
          popInfo, 
          {
            
          }, // component props
          {
            reference: this.$refs.btninfo,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
            options: {placement: 'bottom'},
          }, // popper props
          {
            opened: () => {this.popInfoVisible = true},
            closed: () => {this.popInfoVisible = false},
          } // popper eventlistener
        );

      } else {
        this.$popper.hideAll();
      }
      
    },

    close(evt) {
      this.$emit('close', evt);
    },
    minimize() {
      /*
      if (this.type !== 'in-meeting') {
        return;
      }
      this.$store.commit("windowMinimized", true);
      */
    },

    hideAllPanels(){
      this.$store.commit("plistPanelVisible", false);
      this.$store.commit("chatPanelVisible", false);
      this.$store.commit("appsPanelVisible", false);
      this.$store.commit("ccPanelVisible", false);
      this.$store.commit("inMeetingGptPanelVisible", false);
      this.$store.commit("shareStagePanelVisible", false);
    },

    toggleGptPanel() {
      
      if (!this.inMeetingGptPanelVisible) {
        this.hideAllPanels();
        this.$store.commit("inMeetingGptPanelVisible", true);
        this.$store.commit('sidePanelIsOpen', true);
        if (this.stageMaximized) {
          this.$store.commit("inMeetingGptPanelPopouted", true);
        }
      } else {
        this.hideAllPanels();
        this.$store.commit('sidePanelIsOpen', false);
      }
    },

  },
}
</script>

<style lang="scss">
  .wintopbar {
    width: 100%;
    display: flex;
    flex-direction: column;
    cursor: default;
  
    font-size: 12px;
    color: #000000;
    user-select: none;
    
    .titlebar, .menubar {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .titlebar {
      height: 31px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
    }

    .left {
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-grow: 1;
      width: 30%;
    }
    .mid {
      @include flex;
    }
    .logo {
      margin-right: 4px;
      margin-left: 0;
      width: 16px;
      height: 12px;
      background-image: url(~@/assets/icon/webex_logo.svg);
      background-repeat: no-repeat;
      background-size: 16px 12px;
      background-position: center;
    }
    .title{
      @include flex;
      font-size: 12px;
      padding: 0 8px;
      font-weight: 600;
    }
    .left .menubutton{
      cursor: default;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-left: 1px solid #d4d7d8;
      padding-left: 8px;
    }
    .left .menubutton .tt{
      height: 10px;
      line-height: 8px;
      margin-right: 3px;
      padding-bottom: 1px;
    }

    .right {
      width: 30%;
      padding-left: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      flex-grow: 1;
    }
    .right span {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    .cnnedlabel {
      font-size: 12px;
      margin-right: 10px;
    }
    
    .callinfo {
      display: flex;
      align-items: center;
      margin-left: 8px;

      .divider {
        margin: 0 8px;
      }
    }


    .btn_info {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 8px;
      margin-right: 8px;
      height: 24px;
      font-weight: 600;
      border-radius: 12px;
      pointer-events: auto;

      .infoicon {
        margin-right: 4px;
      }

      &:hover {
        background: rgba($color: #000000, $alpha: .1);
      }
      &:active, &.active {
        background: rgba($color: #000000, $alpha: .2);
      }
    }

  .btn-switch {
    margin-left: 8px;
  }

  .btn-zoom {
    @include flex;
    pointer-events: auto;
    cursor: default;
    user-select: none;
    height: 24px;
    width: 24px;
    border-radius: 12px;
    margin-left: 16px;

    border: 1px solid rgba($color: #FFF, $alpha: .5);

    &.small {
      height: 28px;
      border-radius: 14px;
    }

    &:hover {
      background-color: var(--item-back-hover);
      border: 1px solid rgba($color: #FFF, $alpha: .7);
    }

    &:active,
    &.active {
      background-color: var(--item-back-active);
      border: 1px solid rgba($color: #FFF, $alpha: .9);
    }
  }

  .topbar-ai {
      position: relative;
      @include flex;
      margin: 0 0 0 8px;
      width: 28px;
      height: 28px;
      pointer-events: auto;
      border-radius: 50%;

      &:hover {
        background-color: rgba($color: white, $alpha: 0.07);
      }
      &:active, &.active {
        background-color: rgba($color: white, $alpha: 0.1);
      }

      .ai {
        @include flex;
        height: 30px;
        width: 30px;
        pointer-events: auto;
        
        .aianimation {
          width: 24px;
          height: 24px;
          mix-blend-mode: screen;
        }

        .aiicon {
          width: 16px;
          height: 16px;
        }
      }
    }

  .dot-divider {
    margin: 0 0;
  }

  /* ------ dark/hybrid ------- */
  &.dark, &.hybrid {
    color: $text-color-primary-dark-ui;

    .left .menubutton {
      border-left: 1px solid $md-gray-50;
    }

    .winico {
      fill: #FFF;
    }
    .divider{
      stroke: $md-gray-50;
    }

    .btn_info {
      &:hover {
        background: rgba($color: #FFFFFF, $alpha: .1);
      }
      &:active, &.active {
        background: rgba($color: #FFFFFF, $alpha: .2);
      }
    }

  }
  

  &.mac {
    .left {
      width: 30%;
      flex-grow: 1;
    }

    .right {
      width: 30%;
      flex-grow: 1;
    }

  }
}

</style>
