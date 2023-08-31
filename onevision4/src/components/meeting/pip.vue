<template>
  <drag-resize
    id="pip"
    ref="pip"
    :isActive="true"
    :preventActiveBehavior="true"
    :w="stripWrapWidth"
    :h="stripWrapHeight"
    :minw="280"
    :minh="231"
    :x="stripWrapLeft"
    :y="stripWrapTop"
    :parentW="9999"
    :parentH="9999"
    :isDraggable="false"
    :isResizable="!clsed"
    :aspectRatio="false"
    :parentLimitation="true"
    :showHandle="false"
    :borderIsHandle="true"
    @resizing="onresizing"
    @resizestop="onresizestop"
    :class="[theme, {clsed: clsed}]"
    :style="{
      background: `${themeColorList[theme][themeColor]['bg']}`,
    }"
  >
    <div class="floating_strip_head" @mousedown="floatingStripMousedown">
      <div class="btnround" @click="toggleCls" >
        <wl-icon name="arrow-down-bold" size="16" v-if="!clsed" />
        <wl-icon name="arrow-right-bold" size="16" v-if="clsed" />
      </div>
      <div class="btngrp" v-if="!clsed">
        <div class="btn" :class="{selected: floatingStripLayout === 'single'}" @click="floatingStripLayout = 'single'" >
          <wl-icon name="video-layout-single-bold" size="12" class="ico" :class="{on: floatingStripLayout === 'single'}" />
        </div>
        <div class="btn" :class="{selected: floatingStripLayout === 'list'}" @click="floatingStripLayout = 'list'" >
          <wl-icon name="video-layout-equal-bold" size="12" class="ico" :class="{on: floatingStripLayout === 'list'}" />
        </div>
      </div>
      <div class="aslb" v-if="clsed">
        Speaking: {{activeSpeakerName}}
      </div>
    </div>

    <div ref='video_scrollpane'
      class="video_scrollpane vertical"
      v-if="!clsed"
      :style="{
        width: stripWidth, 
        height: stripHeight, 
        top: stripTop,
        left: stripLeft,
      }"
      >
        <div
          class="video_list_container"
          :style="{
              width: videoListRect && videoListRect.width ? videoListRect.width : '',
              height: videoListRect && videoListRect.height ? videoListRect.height : '',
            }"
          ref='video_list_container'
        >
            <video-item
              v-for='p in filteredPeopleList'
              :id="`video-item_pip_${p.name.replace(/ /g, '-')}`"
              :style="{
                width: `${videoColumnWidth}px`,
                height: `${videoRowHeight}px`,
              }"
              :key='p.name'
              :index="p.index"
              :absolute="true"
              :name='p.name'
              :host='p.host'
              :avatar='p.avatar'
              :video='p.video'
              :audio='p.audio'
              :muted='p.muted'
              :sort='p.sort'
              :isBgVideo='false'
              :isActiveSpeaker='p.name === activeSpeakerName'
              :activeBorder='floatingStripLayout === "single" ? "hide" : null'
              :positionLeft='videoItemPosition[p.name] ? videoItemPosition[p.name].left : ""'
              :positionTop='videoItemPosition[p.name] ? videoItemPosition[p.name].top : ""'
            />
            
        </div>
        
    </div><!--video_scrollpane-->

    <div class="controls" ref="controls">

      <div
        class="btn btn_splitted btn_mute ico-with-lb"
        v-if="audioType !== 'none'"
        @click="toggleMute"
        :class="{
          hover_splited: hoverSplitted,
          active: ctrlMenuAudioVisible,
        }"
      >
        <span class="lft" v-tooltip="{
          html: true,
          content: muted ? 'Unmute my microphone' : 'Mute my microphone',
        }">
          <div class="ico ico_audio">
            <svg v-show="!muted" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0012 14H11.0115C10.4215 14.0146 9.84622 13.8147 9.39243 13.4374C8.93864 13.06 8.63713 12.5309 8.54386 11.9481C9.23297 11.8206 9.85576 11.456 10.3044 10.9176C10.753 10.3792 10.9992 9.70082 11.0002 9V4C11.0002 3.20435 10.6842 2.44129 10.1216 1.87868C9.55896 1.31607 8.79589 1 8.00025 1C7.2046 1 6.44153 1.31607 5.87893 1.87868C5.31632 2.44129 5.00025 3.20435 5.00025 4V9C5.00149 9.71404 5.25721 10.4043 5.7215 10.9468C6.18579 11.4892 6.82824 11.8485 7.53353 11.96C7.62772 12.7332 7.98019 13.452 8.53387 14H4.00122C3.86861 14 3.74144 14.0527 3.64767 14.1464C3.5539 14.2402 3.50122 14.3674 3.50122 14.5C3.50122 14.6326 3.5539 14.7598 3.64767 14.8536C3.74144 14.9473 3.86861 15 4.00122 15H12.0012C12.1338 15 12.261 14.9473 12.3548 14.8536C12.4485 14.7598 12.5012 14.6326 12.5012 14.5C12.5012 14.3674 12.4485 14.2402 12.3548 14.1464C12.261 14.0527 12.1338 14 12.0012 14ZM6.00025 7.494V6.5H10.0002V7.494H6.00025ZM8.00025 2C8.53052 2.00053 9.03892 2.21141 9.41387 2.58637C9.78883 2.96133 9.99972 3.46973 10.0002 4V5.5H6.00025V4C6.00078 3.46973 6.21166 2.96133 6.58662 2.58637C6.96157 2.21141 7.46997 2.00053 8.00025 2Z" fill="white" fill-opacity="0.95"/>
              <path d="M6 7.5H10V9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9V7.5Z" fill="#3CC29A"/>
              <rect x="6" y="5.5" width="4" height="1" fill="#3CC29A"/>
            </svg>

            <wl-icon
              v-if="muted" 
              name="microphone-muted-bold" 
              :color=" theme === 'light' ? 'red-60' : 'red-40' "
              size="16"
            />

          </div>
        </span>
        <div 
          class="splitted btn_audio2" 
          ref="btn_audio2"
          :class="{active: ctrlMenuAudioVisible}"
          v-if="(audioType === 'pc' || audioType === 'callme' || audioType === 'callin' || devicePaired) " 
          @click="showAudioOptionMenu" 
          @mouseenter="_ => hoverSplitted = true"
          @mouseleave="_ => hoverSplitted = false"
        >
          <wl-icon
            name="arrow-down-filled" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="8"
            class="arr"
          />
        </div>
      </div>

      <div
        class="btn btn_splitted btn_video ico-with-lb"
        @click="toggleVideo"
        v-if="!devicePaired || meetingType === 'video-call'"
        :class="{
          hover_splited: hoverSplitted,
          active: ctrlMenuVideoVisible,
        }"
      >
        <span class="lft" v-tooltip="!cameraOn ? 'Turn on my video' : 'Turn off my video'">
          <div class="ico">

            <svg v-if="cameraOn" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5251 4.64893C14.3804 4.55868 14.2149 4.50723 14.0446 4.49953C13.8742 4.49183 13.7047 4.52815 13.5525 4.60498C13.5373 4.61267 13.5224 4.62115 13.5081 4.63037L12.0007 5.5885V5C12 4.3372 11.7363 3.70177 11.2676 3.23309C10.799 2.76442 10.1635 2.50078 9.50073 2.5H3.50073C2.83793 2.50078 2.2025 2.76442 1.73383 3.23309C1.26515 3.70177 1.00151 4.3372 1.00073 5V11C1.00151 11.6628 1.26515 12.2982 1.73383 12.7669C2.2025 13.2356 2.83793 13.4992 3.50073 13.5H9.50073C10.1635 13.4992 10.799 13.2356 11.2676 12.7669C11.7363 12.2982 12 11.6628 12.0007 11V10.4105L13.5081 11.3686C13.5222 11.3779 13.5368 11.3862 13.552 11.3935C13.7044 11.4699 13.8738 11.5061 14.0442 11.4985C14.2145 11.4909 14.38 11.4399 14.5251 11.3503C14.6701 11.2607 14.7898 11.1355 14.8728 10.9866C14.9558 10.8377 14.9994 10.67 14.9993 10.4995V5.49949C14.9999 5.32895 14.9566 5.16112 14.8735 5.01215C14.7905 4.86318 14.6705 4.7381 14.5251 4.64893ZM11.0007 11C11.0003 11.3977 10.8421 11.779 10.5609 12.0602C10.2797 12.3414 9.89842 12.4996 9.50073 12.5H3.50073C3.10304 12.4996 2.72176 12.3414 2.44055 12.0602C2.15934 11.779 2.00117 11.3977 2.00073 11V5C2.00117 4.60231 2.15934 4.22103 2.44055 3.93982C2.72176 3.65861 3.10304 3.50043 3.50073 3.5H9.50073C9.89842 3.50043 10.2797 3.65861 10.5609 3.93982C10.8421 4.22103 11.0003 4.60231 11.0007 5V11ZM12.0007 9.22595V6.77307L13.9993 5.50293L14.0003 10.4966L12.0007 9.22595Z" fill="white" fill-opacity="0.95"/>
              <path d="M4.5 7C5.05228 7 5.5 6.55228 5.5 6C5.5 5.44772 5.05228 5 4.5 5C3.94772 5 3.5 5.44772 3.5 6C3.5 6.55228 3.94772 7 4.5 7Z" fill="#3CC29A"/>
            </svg>

            <wl-icon
              v-if="!cameraOn" 
              name="camera-muted-bold" 
              :color=" theme === 'light' ? 'red-60' : 'red-40' "
              size="16"
            />

          </div>
        </span>
        <div 
          class="splitted btn_video2" 
          ref="btn_video2"
          :class="{active: ctrlMenuVideoVisible}"
          v-if="!devicePaired " 
          @click="showVideoOptionMenu" 
          @mouseenter="_ => hoverSplitted = true"
          @mouseleave="_ => hoverSplitted = false"
        >
          <wl-icon
            name="arrow-down-filled" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="8"
            class="arr"
          />
        </div>
      </div>




      <div 
        class="btn btn_plist" 
        ref="btn_plist"
        v-tooltip="'Participants'" 
        @click="openPlist"
      >
        <wl-icon
          name="participant-list-bold" 
          :color=" theme === 'light' ? 'black-95' : 'white-95' "
          size="16"
        />
      </div>

      <div 
        class="btn btn_more" 
        ref="btn_more"
        :class="{
          active: popmenuMoreVisible,
        }"
        v-tooltip="'More options'" 
        @click="togglePopmenuMore"
      >
        <wl-icon
          name="more-bold" 
          :color=" theme === 'light' ? 'black-95' : 'white-95' "
          size="16"
        />
      </div>

    </div><!--controls-->

  </drag-resize>
</template>

<script>
import mframe from 'mframe'
import ctrlMenuMore from "./ctrl-menu-more-pip.vue";
import ctrlMenuAudio from "./ctrl-menu-audio.vue";
import ctrlMenuVideo from "./ctrl-menu-video.vue";

export default {
  props: {
    meetingId: {
      type: String,
      default: 'webex-meeting',
    },
  },
  data() {
    return {
      clsed: false,
      videoColumnWidth: null,
      videoRowHeight: null,
      stripWidth: '',
      stripHeight: '',
      stripTop: '0',
      stripLeft: '0',
      stripWrapWidth: 280,
      stripWrapHeight: 452,
      previousHeightSingle: 231,
      previousHeightList: 452,
      stripWrapTop: 0,
      stripWrapLeft: 0,
      videoListRect: null,
      floatingStripLayout: 'single',
      floatingStripPositionInited: false,
      isStripDragging: false,
      stripDragPosition: {
        left: 0,
        top: 0,
      },
      videoItemPosition: {},
      listColumn: 1,
      hoverSplitted: false,
      popmenuMoreVisible: false,
      ctrlMenuAudioVisible: false,
      ctrlMenuVideoVisible: false,
    };
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
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId);

    },
    activeSpeakerName() {
      return this.$store.state.activeSpeakerName;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    disableElementTransition() {
      return this.$store.state.disableElementTransition;
    },
    filteredPeopleList() {
      if (this.floatingStripLayout === 'list') {
        return this.peopleList.slice();
      } else {
        return [this.$store.getters.activeSpeaker];
      }
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
    plistPanelVisible() {
      return this.$store.state.plistPanelVisible;
    },
    audioType() {
      return this.$store.state.audioType;
    },
    devicePaired() {
      return this.$store.state.devicePaired;
    },
    activeSpeakerMoveToFirst() {
      return this.$store.state.activeSpeakerMoveToFirst;
    },

  },
  mounted() {
    this.setLayout();
    //this.playAudioAnimation();
    this.$store.commit('hudVisible', true);// video ctrl button need hudVisible = true
  },
  watch: {
    floatingStripLayout() {
      if (!this.disableElementTransition) {
        this.$store.commit('disableElementTransition', true);
        setTimeout(() => {
          this.$store.commit('disableElementTransition', false);
        }, 500);
      }

      this.$refs.video_scrollpane.scrollTop = 0;
      this.setLayout();
    },
  },
  methods: {
    playAudioAnimation() {
      const aduioMotion = mframe([{
        dom: document.getElementById('aduioIconRectBackground1-pip'),
        frames: [
            { attr: {y:'6'} , time:0 },
            { attr: {y:'12.0'} , time:24, tween: 'easeInOut' },
            { attr: {y:'9.0'} , time:42, tween: 'easeInOut' },
            { attr: {y:'8.0'} , time:44, tween: 'easeInOut' },
            { attr: {y:'10.0'} , time:62, tween: 'easeInOut' },
            { attr: {y:'12.0'} , time:86, tween: 'easeInOut' },
            { attr: {y:'9.0'} , time:112, tween: 'easeInOut' },
            { attr: {y:'7.0'} , time:134, tween: 'easeInOut' },
            { attr: {y:'10.0'} , time:158, tween: 'easeInOut' },
            { attr: {y:'9.0'} , time:178, tween: 'easeInOut' },
            { attr: {y:'6.0'} , time:204, tween: 'easeInOut' }
        ]
      }]);
      aduioMotion.repeat(Infinity);

      const aduioMotion2 = mframe([{
        dom: document.getElementById('aduioIconRectBackground2-pip'),
        frames: [
            { attr: {y:'8'} , time:0 },
            { attr: {y:'14.0'} , time:24, tween: 'easeInOut' },
            { attr: {y:'11.0'} , time:42, tween: 'easeInOut' },
            { attr: {y:'10.0'} , time:44, tween: 'easeInOut' },
            { attr: {y:'12.0'} , time:62, tween: 'easeInOut' },
            { attr: {y:'14.0'} , time:86, tween: 'easeInOut' },
            { attr: {y:'11.0'} , time:112, tween: 'easeInOut' },
            { attr: {y:'9.0'} , time:134, tween: 'easeInOut' },
            { attr: {y:'12.0'} , time:158, tween: 'easeInOut' },
            { attr: {y:'11.0'} , time:178, tween: 'easeInOut' },
            { attr: {y:'8.0'} , time:204, tween: 'easeInOut' }
        ]
      }]);
      aduioMotion2.repeat(Infinity);
    },
    toggleCls() {
      this.clsed = !this.clsed;
    },
    showAudioOptionMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.ctrlMenuAudioVisible) {
        this.$popper.show(
          ctrlMenuAudio, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_audio2,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {placement: 'bottom-end'},
          }, // popper props
          {
            opened: () => {this.ctrlMenuAudioVisible = true},
            closed: () => {this.ctrlMenuAudioVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    showVideoOptionMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.ctrlMenuVideoVisible) {
        this.$popper.show(
          ctrlMenuVideo, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_video2,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {placement: 'bottom-end'},
          }, // popper props
          {
            opened: () => {this.ctrlMenuVideoVisible = true},
            closed: () => {this.ctrlMenuVideoVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    togglePopmenuMore() {
      if (!this.popmenuMoreVisible) {
        this.$popper.show(
          ctrlMenuMore, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_more,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {
              placement: 'bottom',
            },
          }, // popper props
          {
            opened: () => {this.popmenuMoreVisible = true},
            closed: () => {this.popmenuMoreVisible = false},
          } // popper eventlistener
        );
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

    openPlist() {
      this.$store.commit("plistPanelVisible", true);
      this.$store.commit("plistPanelPopouted", true);
    },

    setLayout(resizing) {
      const parentRect = document.querySelector('#desktop').getBoundingClientRect();
      const paneRect = document.querySelector('#pip').getBoundingClientRect();
      const headRect = document.querySelector('.floating_strip_head').getBoundingClientRect();
      const ctrlRect = this.$refs.controls.getBoundingClientRect();
      const videoGap = 6;
      const asBorderSize = 4;
      const fitPadding = 8;
      const headerMarginBottom = 8;
      const ctrlH = ctrlRect.height;
      const defaultVideoWidth = 264;

      let w = Math.max((paneRect.width - fitPadding * 2), defaultVideoWidth);
      let h = Math.ceil(w / 16 * 9);
      let fitHeight;

      if (this.floatingStripLayout === 'single') {
        fitHeight = this.previousHeightSingle;
      } else if (this.floatingStripLayout === 'list') {
        fitHeight = this.previousHeightList;
      }

      const viewportH0 = fitHeight - headRect.height - fitPadding - headerMarginBottom - ctrlH + asBorderSize * 2;
      let viewportH = `${viewportH0}px`;

      if (this.floatingStripLayout === 'list') {
        if (paneRect.width > defaultVideoWidth * 3 + fitPadding * 2 + videoGap * 2) {
          this.listColumn = 3;
          w = (w - videoGap * 2) / 3;
          h = (h - videoGap * 2) / 3;
        } else if (paneRect.width > defaultVideoWidth * 2 + fitPadding * 2 + videoGap) {
          this.listColumn = 2;
          w = (w - videoGap) / 2;
          h = (h - videoGap) / 2;
        } else {
          this.listColumn = 1;
        }
        this.videoColumnWidth = w;
        this.videoRowHeight = h;
      } else {
        this.listColumn = 1;
        this.videoColumnWidth = w;
        this.videoRowHeight = viewportH0 - asBorderSize * 2;
      }

      const activeSpeakerMoveToFirst = this.floatingStripLayout === 'single';
      this.$store.commit("activeSpeakerMoveToFirst", activeSpeakerMoveToFirst);
      let plist = this.filteredPeopleList.slice();
      plist.sort((a, b) => {
          if(activeSpeakerMoveToFirst){
            if (a.name === this.activeSpeakerName) {
              return -1;
            } else if (b.name === this.activeSpeakerName) {
              return 1;
            }
          }else{
            if (a.sort > b.sort) {
              return -1;
            } else if (a.sort < b.sort) {
              return 1;
            }
          }
        }
      );

      let len = plist.length;
      const vnum = this.floatingStripLayout === 'list' ? 4 : 1;
      const len2 = Math.min(len, vnum);

      const sph = len2 * (h + videoGap) / this.listColumn - videoGap + fitPadding + headerMarginBottom + headRect.height + ctrlH;
      let scrollh = len * (h + videoGap) / this.listColumn - videoGap;
      const stripW = w + (this.listColumn - 1) * (w + videoGap)
      this.stripWidth = `${stripW + asBorderSize * 2}px`;
      this.stripHeight = viewportH;
      this.stripTop = `${fitPadding + headerMarginBottom + headRect.height - asBorderSize}px`;
      this.stripLeft = `${fitPadding - asBorderSize}px`;

      if (!resizing) {
        this.stripWrapWidth = stripW + fitPadding * 2;

        if (this.floatingStripLayout === 'single' && this.previousHeightSingle > 0) {
          this.stripWrapHeight = this.previousHeightSingle;
        } else if (this.floatingStripLayout === 'list' && this.previousHeightList > 0) {
          this.stripWrapHeight = this.previousHeightList;
        } else {
          this.stripWrapHeight = sph;
        }
      } 

      this.$refs.video_list_container.style.width = '';
      if (this.floatingStripLayout === 'list') {
        this.$refs.video_list_container.style.height = `${scrollh}px`
      } else {
        this.$refs.video_list_container.style.height = viewportH;
      }
      

      const left = parentRect.width - (stripW + fitPadding * 2) - 20;
      const top = parentRect.height > 700 ? 120 : 60;

      if (!this.floatingStripPositionInited) {
        this.stripWrapTop = top,
        this.stripWrapLeft = left;
        this.stripDragPosition = {
          top: top,
          left: left,
        };
        this.floatingStripPositionInited = true;
      }

      requestAnimationFrame(() => {
        this.checkStripDragPosition();
      });

      let marginV = asBorderSize;
      if (scrollh < sph && this.floatingStripLayout === 'list') {
        marginV = (sph - len * h - (len-1) * videoGap) / 2;
      }
      let idx = 0;
      for (let i=0; i<plist.length; i++) {
        const p = plist[i];
        this.videoItemPosition[p.name] = {
          top: marginV + Math.floor(idx / this.listColumn) * (h + videoGap),
          left: (idx % this.listColumn) * (w + videoGap) + asBorderSize,
        };
        idx++;
      }
      
      if (this.floatingStripLayout === 'list') {
        this.videoListRect = {
          height: `${scrollh}px`,
        };
      } else {
        this.videoListRect = {
          height: viewportH,
        };
      }
      

    },

    checkStripDragPosition() {
      const parentRect = document.querySelector('#desktop').getBoundingClientRect();
      const paneRect = document.querySelector('#pip').getBoundingClientRect();
      const point = {
        x: this.stripDragPosition.left,
        y: this.stripDragPosition.top,
      }
      const bordersize = 6;
      const rect = {
        left: bordersize,
        top: bordersize,
        right: parentRect.width - paneRect.width - bordersize,
        bottom: parentRect.height - paneRect.height - bordersize,
      }
      if (point.x > rect.right) {
        this.stripDragPosition.left = rect.right;
        this.stripWrapLeft = rect.right;
      }
      if (point.y > rect.bottom) {
        this.stripDragPosition.top = rect.bottom;
        this.stripWrapTop = rect.bottom;
      }

    },

    onresizing() {
      if (!this.videoPaused) {
        this.$store.commit('videoPaused', true);
        this.$popper.hideAll();
      }
      this.setLayout(true);
      requestAnimationFrame(() => {
        this.setLayout(true);
      });

      const paneRect = document.querySelector('#pip').getBoundingClientRect();
      if (this.floatingStripLayout === 'single') {
        this.previousHeightSingle = paneRect.height;
      } else {
        this.previousHeightList = paneRect.height;
      }
    },
    onresizestop() {
      this.$store.commit('videoPaused', false);
      this.setLayout(true);
      
      const paneRect = document.querySelector('#pip').getBoundingClientRect();
      if (this.floatingStripLayout === 'single') {
        this.previousHeightSingle = paneRect.height;
      } else {
        this.previousHeightList = paneRect.height;
      }
      
    },
     // ------ >>>>>>>
    floatingStripMousedown(evt) {
      this.$store.commit('disableElementTransition', true);

      evt.stopPropagation();
      this.mouseX = evt.pageX;
      this.mouseY = evt.pageY;
      window.addEventListener("mousemove", this.floatingStripDragging);
      window.addEventListener("mouseup", this.floatingStripStopDrag);

      this.$popper.hideAll();
    },
    floatingStripDragging(evt){
      const px = evt.pageX;
      const py = evt.pageY;
      if (!this.isStripDragging && (Math.abs(px - this.mouseX) > 5 || Math.abs(py - this.mouseY) > 5)) {
        this.isStripDragging = true;
        this.$store.commit('videoPaused', true);
      }
      if (this.isStripDragging) {
        const ox = px - this.mouseX;
        const oy = py - this.mouseY;
        const parentRect = document.querySelector('#desktop').getBoundingClientRect();
        const paneRect = document.querySelector('#pip').getBoundingClientRect();
        const point = {
          x: this.stripDragPosition.left + ox,
          y: this.stripDragPosition.top + oy,
        }
        const rect = {
          left: 0,
          top: 44,
          right: parentRect.width - paneRect.width,
          bottom: parentRect.height - paneRect.height,
        }
        if (this.pointInRect(point, rect)) {
          this.stripDragPosition.left += ox;
          this.stripDragPosition.top += oy
          this.stripWrapTop = this.stripDragPosition.top;
          this.stripWrapLeft = this.stripDragPosition.left;
          this.mouseX = px;
          this.mouseY = py;
        }
        
      }
    },
    floatingStripStopDrag(){
      this.$store.commit('disableElementTransition', false);

      this.isStripDragging = false;
      this.$store.commit('videoPaused', false);
      window.removeEventListener("mousemove", this.floatingStripDragging);
      window.removeEventListener("mouseup", this.floatingStripStopDrag);
    },
    pointInRect(point, rect) {
      return point.x <= rect.right && point.x >= rect.left && point.y <= rect.bottom && point.y >= rect.top;
    },
    // ----- <<<<<<<<

  }
};
</script>

<style lang="scss">
#pip {
  position: absolute;
  display: flex;
  border-radius: 12px;
  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
  

  &.clsed {
    height: 90px !important;
  }

  .video_scrollpane {
    position: absolute;
    user-select: none;
    border-radius: 0;
    pointer-events: auto;
    scroll-behavior: smooth;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE 10+ */
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background: transparent; /* make scrollbar transparent */
    }

    .video_list_container{
      margin-top: -2px;
      .video_item{
        display: inline-flex;
        flex-shrink: 0;
        flex-grow: 0;
      }
    }

    &.vertical {
      overflow-x: hidden;
      overflow-y: auto;

      .video_list_container{
        width: 100%;
      }
    }
  }

  .floating_strip_head {
    margin: 8px;
    width: 100%;
    height: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: auto;

    .aslb {
      margin: 0 10px;
      flex-grow: 1;
      font-weight: 600;
      font-size: 14px;
      user-select: none;
      pointer-events: none;
    }

    .btnround {
      @include flex;
      width: 28px;
      height: 28px;
      box-sizing: border-box;
      border: 1px solid rgba($color: #000000, $alpha: .3);
      border-radius: 14px;
    }

    .btngrp {
      @include flex;
      width: 58px;
      height: 30px;
      border-radius: 15px;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid rgba($color: #000000, $alpha: .3);

      .btn {
        @include flex;
        width: 28px;
        height: 28px;
        pointer-events: auto;
        cursor: default;

        .ico {
          opacity: .7;

          &.on {
            opacity: 1.0;
          }
        }

        &.selected {
          background: rgba($color: #000000, $alpha: .3);
        }
      }
    }
  }

  .controls {

    position: absolute;
    bottom: 0;
    @include flex;
    height: 52px;
    width: 100%;
    margin-bottom: 2px;

    .btn {
      @include flex;
      width: 32px;
      height: 32px;
      border-radius: 16px;
      pointer-events: auto;
      cursor: default;
      text-align: center;
      vertical-align: middle;
      margin: 1px 4px;
      flex-shrink: 0;
      box-sizing: border-box;

      border: 1px solid rgba($color: #000000, $alpha: .3);

      .redsvg {
        path {
          fill: $textColor-error-lightUi;
        }
      }

      &:hover{
        border: 1px solid rgba($color: #000000, $alpha: .5);
        background-color: rgba($color: #000000, $alpha: .07);
      }
      &:active,
      &.active{
        border: 1px solid rgba($color: #000000, $alpha: .9);
        background-color: rgba($color: #000000, $alpha: .2);
      }
      &.hover_splited:hover{
        border: 1px solid rgba($color: #000000, $alpha: .5);
        background-color: transparent;
      }
      &.hover_splited:active{
        border: 1px solid rgba($color: #000000, $alpha: .9);
        background-color: transparent;
      }

      &.off {
        color: #FFF;
        background-color: #ff503c;
      }

      &.btn_splitted {
        padding: 0 !important;

        &:hover{
          background-color: transparent;
        }
        &:active,
        &.active{
          background-color: transparent;
        }
      }

      .lft {
        @include flex;
        height: 100%;
        flex-grow: 1;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        
        &:hover{
          background-color: rgba($color: #000000, $alpha: .07);
        }
        &:active,
        &.active {
          background-color: rgba($color: #000000, $alpha: .2);
        }
      }

      .splitted {
        @include flex;
        position: relative;
        height: 32px;
        width: 20px;
        margin: 0;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;

        .arr {
          margin-right: 6px;
        }

        &:hover{
          background-color: rgba($color: #000000, $alpha: .07);
        }
        &:active,
        &.active {
          background-color: rgba($color: #000000, $alpha: .2);
          
          .arr {
            transform: rotate(180deg);
            transform-origin: 50%;
          }
        }
      }
    }
    
    .ico-with-lb {
      width: auto;
      padding: 0 16px;
    }
    .ico-with-lb .ico {
      @include flex;
      flex-shrink: 0;
      margin-left: 10px;
    }
    .btn_mute {
      width: 58px;
    }
    .btn_video {
      width: 58px;
    }

  }

  .red {
    color: $md-red-50;
  }


  /* ------------------ drak/hybrid ------------------ */
  &.dark,
  &.hybrid {
    color: $text-color-primary-dark-ui;

    .floating_strip_head {

      .btnround {
        border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
      }

      .btngrp {
        border: 1px solid rgba($color: #FFFFFF, $alpha: .3);

        .btn {
          &.selected {
            background: rgba($color: #FFFFFF, $alpha: .3);
          }
        }
      }
    }

    .controls {
      .btn {
        border: 1px solid rgba($color: #FFFFFF, $alpha: .3);

        .redsvg {
          path {
            fill: $textColor-error-darkUi;
          }
        }

        &:hover{
          border: 1px solid rgba($color: #FFFFFF, $alpha: .5);
          background-color: rgba($color: #FFFFFF, $alpha: .07);
        }
        &:active,
        &.active{
          border: 1px solid rgba($color: #FFFFFF, $alpha: .9);
          background-color: rgba($color: #FFFFFF, $alpha: .2);
        }
        &.hover_splited:hover{
          border: 1px solid rgba($color: #FFFFFF, $alpha: .5);
          background-color: transparent;
        }
        &.hover_splited:active, &.hover_splited.active{
          border: 1px solid rgba($color: #FFFFFF, $alpha: .9);
          background-color: transparent;
        }

        &.off {
          background-color: $md-red-60;
        }

        &.btn_splitted {
          &:hover{
            background-color: transparent;
          }
          &:active,
          &.active{
            background-color: transparent;
          }
        }

        .lft {
          &:hover{
            background-color: rgba($color: #FFFFFF, $alpha: .07);
          }
          &:active,
          &.active {
            background-color: rgba($color: #FFFFFF, $alpha: .2);
          }
        }

        .splitted {
          .arr svg path {
            fill: rgba($color: #FFFFFF, $alpha: .95);
          }

          &:hover{
            background-color: rgba($color: #FFFFFF, $alpha: .07);
          }
          &:active,
          &.active {
            background-color: rgba($color: #FFFFFF, $alpha: .2);
          }
        }

        &.btn_x {
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

}

</style>
