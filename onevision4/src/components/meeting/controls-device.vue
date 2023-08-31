<template>
    <div
      class="controls-device"
      ref="controls"
      :class="[theme, {sharing: deviceInSharing, trans: transEnabled}]"
      :style="{
        left: controlPos.left,
        bottom: controlPos.bottom,
      }"
    >
      <div class="wrap">
        <div v-if="deviceInSharing" class="bar" >
          <div class="handle" @click="toggleCollapse" >
            <span class="lbtxt">Control {{devicePairedName}} remotely</span>
            <wl-icon :name="collapsed ? 'arrow-up-bold' : 'arrow-down-bold'" size="12" color="white" />
          </div>
        </div>
        
        <div
          class="btn btn_mute"
          @click="toggleMute"
        >

          <div class="ico ico_audio" v-tooltip="{
            html: true,
            content: muted ? 'Unmute device' : 'Mute device',
          }">

            <wl-icon v-if="muted" name="microphone-muted-regular" :color=" theme === 'light' ? 'red-60' : 'red-40' " size="26" />
            <wl-icon v-if="!muted" name="microphone-regular" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="26" />

          </div>
          <span class="lb" >{{muted ? 'Unmute' : 'Mute'}}</span>


        </div>

        <div
          class="btn btn_video"
          @click="toggleVideo"
          
        >
          <div class="ico" v-tooltip="!cameraOn ? 'Turn on my video' : 'Turn off my video'">
            <wl-icon v-if="cameraOn" name="camera-regular" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="26" />
            <wl-icon v-if="!cameraOn" name="camera-muted-regular" :color=" theme === 'light' ? 'red-60' : 'red-40' " size="26" />

          </div>
          <span class="lb" >{{!cameraOn ? 'Start video' : 'Stop video'}}</span>
        </div>

        <div
          v-if="!deviceConnecting"
          class="btn btn_volume"
          ref="btn_volume"
          
          @click="toggleVolume"
        >
          <div class="ico" v-tooltip="'Volume'">
            <wl-icon
              name="speaker-regular" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="26"
            />
          </div>
          <span class="lb">Volume</span>
        </div>

        <div
          v-if="!deviceConnecting"
          class="btn btn_share"
          ref="btn_share"
          v-tooltip="'Share content'"
        >
          <div class="ico">
            <wl-icon
              name="share-screen-regular" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="26"
            /> 
          </div>
          <span class="lb">Share</span>
        </div>

        <div 
          v-if="!deviceConnecting"
          class="btn btn_reaction" 
          :class="{
            active: popmenuReactionVisible,
          }"
          ref="btn_reaction"
          
        >
          <span class="ico" v-tooltip="'Reactions'" >
            <wl-icon
              name="reactions-regular" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="26"
            />
          </span>
          <span class="lb">Reactions</span>
        </div>

        <div 
          class="btn btn_more" 
          ref="btn_more"
          :class="{
            active: popmenuMoreVisible,
          }"
          
        >
          <span class="ico" v-tooltip="'More options'" >
            <wl-icon
              name="more-regular" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="26"
            /> 
          </span>
          <span class="lb">More</span>

        </div>
        <div class="btn btn_x" ref="btn_x" >
          <span class="ico" v-tooltip="'Leave'" >
            <wl-icon
              name="cancel-regular" 
              color="white-95"
              size="26"
            /> 
          </span>
          <span class="lb">Leave</span>
        </div>

      </div><!--wrap-->



    </div>
</template>

<script>

export default {
  props: {
    meetingId: String,
  },
  data() {
    return {
      popmenuMoreVisible: false,
      popVolumeVisible: false,
      popmenuReactionVisible: false,
      controlPos: {
        left: '',
        bottom: '',
      },
      collapsed: false,
      transEnabled: false,
      itvcls: 0,
    };
  },
  computed: {
    windowMinimized(){
      return this.$store.state.windowMinimized
    },
    host(){
      return this.$store.getters.host
    },
    me(){
      return this.$store.getters.me
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    recordOn() {
      return this.$store.state.recordOn;
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
    os() {
      return this.$store.state.os;
    },

    sidePanelIsOpen() {
      return this.$store.state.sidePanelIsOpen;
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId);
    },
    audioConnected() {
      return this.$store.state.audioConnected;
    },
    videoConnected() {
      return this.$store.state.videoConnected;
    },
    muted() {
      return this.$store.state.muted;
    },
    cameraOn() {
      return this.$store.state.cameraOn;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    popShareVisible() {
      return this.$store.state.popShareVisible;
    },
    devicePaired() {
      return this.$store.state.devicePaired;
    },
    devicePairedName() {
      return this.$store.state.devicePairedName;
    },
    deviceInSharing() {
      return this.$store.state.deviceInSharing;
    },
    deviceConnecting() {
      return this.$store.state.deviceConnecting;
    },
    audioType() {
      return this.$store.state.audioType;
    },
    meetingTitle() {
      return this.$store.state.meetingTitle;
    },
    activeSpeakerName() {
      return this.$store.state.activeSpeakerName;
    },
    plistPanelVisible() {
      return this.$store.state.plistPanelVisible;
    },
    chatPanelVisible() {
      return this.$store.state.chatPanelVisible;
    },
    appsPanelVisible() {
      return this.$store.state.appsPanelVisible;
    },
    meetingType() {
      return this.$store.getters.meetingType(this.meetingId)
    },
    selectedSmartAudio() {
      return this.$store.state.selectedSmartAudio;
    },
    
  },
  mounted() {
    this.resizeLayout();
    this.initResizeWatch();

    setTimeout(() => {
      this.$store.commit('deviceConnecting', false);
    }, 3000);

  },
  watch: {
    deviceInSharing(val) {
      requestAnimationFrame(() => {
        this.resizeLayout();
      });
      clearTimeout(this.itvcls)
      if (val) {
        this.itvcls = setTimeout(() => {
          this.collapse()
        }, 3000);
      }
    },
    collapsed() {
      this.resizeLayout();
    },
    deviceConnecting() {
      this.resizeLayout();
    },
  },
  methods: {
    toggleCollapse() {
      if (this.collapsed) {
        this.expand()
      } else {
        this.collapse()
      }
      
    },
    collapse() {
      this.collapsed = true;
      this.transEnabled = true; 
    },
    expand() {
      this.collapsed = false;
      this.transEnabled = true; 
    },
    resizeLayout() {
      const rect1 = document.getElementById('meetings-app').getBoundingClientRect();
      const rect2 = document.getElementById('stage-device-paired-content').getBoundingClientRect();

      if (!this.deviceInSharing) {
        let num = this.deviceConnecting ? 4 : 7;
        this.controlPos.left = `${rect2.left - rect1.left + (rect2.width - (74 * num)) / 2}px`;
        this.controlPos.bottom = `${(rect1.bottom - rect2.bottom) + 96}px`;
      } else {
        this.controlPos.left = `${(rect1.width - (66 * 7 + 30 * 2)) / 2}px`;
        this.controlPos.bottom = this.collapsed ? `-26px` : `0px`;
      }
      
    },

    initResizeWatch() {
      // watch resize
      const elem = document.getElementById('maincon-L');
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.contentRect) {
            this.resizeLayout();
          }
        }
      });
      resizeObserver.observe(elem);
    },

    toggleVolume() {
      if (!this.popVolumeVisible) {
        //this.$popper.show
      } else {
        this.$popper.hideAll();
      }
    },

    toggleMute() {
      if (this.muted) {
        this.$store.commit('muted', false);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.muted = false;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

      } else {
        this.$store.commit('muted', true);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.muted = true;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

      }
    },

    toggleVideo() {
      if (this.cameraOn) {
        this.$store.commit('cameraOn', false);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.video = null;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

      } else {
        this.$store.commit('videoConnected', true);
        this.$store.commit('cameraOn', true);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.video = 'camera';
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);
      }
    },


  }
};
</script>

<style lang="scss">

  .controls-device {
    position: absolute;
    z-index: 10;

    user-select: none;

    flex-grow: 1;
    flex-shrink: 0;
    height: 54px;
    text-align: center;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    border-radius: 0; 
    padding: 0;
    height: auto;
    border: none;

    &.trans {
      transition: all 0.2s ease-out;
    }

    &.sharing {
      background: #181818;
      
      border-radius: 20px 20px 0px 0px; 
      padding: 10px 30px;
      height: 95px;
      border: 1px solid rgba($color: #FFFFFF, $alpha: .1);
      border-bottom: none;

      .btn {
        width: calc(50px + 16px);
        .ico {
          width: 50px;
          height: 50px;
        }
        .lb {
          font-size: 11px;
        }
      }
    }

    .wrap {
      position: relative;
      @include flex;
      flex-grow: 1;
    }

    .bar {
      position: absolute;
      @include flex;
      width: 100%;
      top: -35px;
      
      .handle {
        @include flex;
        background: #181818;
        border-radius: 20px 20px 0px 0px;
        padding: 4px 20px 0 20px;
        border: 1px solid rgba($color: #FFFFFF, $alpha: .1);
        box-sizing: border-box;
        border-bottom: none;
        pointer-events: auto;

        .lbtxt {
          @include flex;
          flex-grow: 1;
          margin-right: 8px;
          font-size: 12px;
        }
        
      }
    }

    .btn {
      @include flex(column);
      width: calc(58px + 16px);

      pointer-events: auto;
      cursor: default;
      text-align: center;
      vertical-align: middle;
      margin: 0;
      flex-shrink: 0;
      box-sizing: border-box;

      

      .redsvg {
        path {
          fill: $textColor-error-lightUi;
        }
      }


      &.off {
        color: #FFF;
        background-color: #ff503c;
      }

      .ico {
        @include flex;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        border: 1px solid rgba($color: #000000, $alpha: .3);
        box-sizing: border-box;

        &:hover{
          border: 1px solid rgba($color: #000000, $alpha: .5);
          background-color: rgba($color: #000000, $alpha: .07);
        }
        &:active,
        &.active{
          background-color: rgba($color: #000000, $alpha: .2);
        }
      }

      &.btn_x .ico {
        border: none;
        background: $md-red-60;

        &:hover{
          border: none;
          background: $md-red-70;
        }
        &:active{
          border: none;
          background: $md-red-80;
        }
      }
    }
    
    
    .lb {
      user-select: none;
      font-size: 12px;
      margin-top: 8px;
    
    }


    /* ------------------ drak/hybrid ------------------ */

    &.dark,
    &.hybrid {

      .btn {

        .redsvg {
          path {
            fill: $textColor-error-darkUi;
          }
        }

        &.off {
          background-color: $md-red-60;
        }


        .ico {
          border: 1px solid rgba($color: #FFFFFF, $alpha: .3);

          &:hover{
            border: 1px solid rgba($color: #FFFFFF, $alpha: .5);
            background-color: rgba($color: #FFFFFF, $alpha: .07);
          }
          &:active,
          &.active{
            background-color: rgba($color: #FFFFFF, $alpha: .2);
          }
        }

        &.btn_x .ico {
          border: none;
          background: $md-red-60;

          &:hover{
            border: none;
            background: $md-red-70;
          }
          &:active{
            border: none;
            background: $md-red-80;
          }
        }

      }
      
    }
  }
</style>
