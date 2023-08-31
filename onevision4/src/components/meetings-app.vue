<template>
  <div 
    ref="meetings-app"
    :name="meetingId"
    :class="['meetings-app', os, theme, {
      transition: !disableElementTransition,
      minimized: windowMinimized,
      fullscreen: fullscreen || windowsSize === 'max',
      }
    ]"
    :style="{
      background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['app'][0]} 0%, ${themeColorList[theme][themeColor]['app'][1]} 100%)`,
    }"

  >
    
    <lobby v-if="lobbyVisible" :meetingId="meetingId" />
    
    <topbar 
      v-show="!lobbyVisible" 
      class="topbar" 
      :class="{fullscreen: fullscreen && !hudVisible}" 
      height="44px" 
      :meetingId="meetingId"
      :menuVisible="meetingType === 'webex'"
      :title="meetingType === 'audio-call' || meetingType === 'video-call' ? 'Webex Calls' : null"
      :defaultWindowsSize="windowsSize"
      @close="endmeeting" 
      @mousedown="appHeaderMousedown"
      @windowsSizeChanged="windowsSizeChanged"
    ></topbar>


    <SplitGrid 
      v-show="!lobbyVisible" 
      class="maincon" 
      direction="column" 
      :columnMinSizes="{ 0: leftColumnMinWidth, 2: rightPanelMinWidth }"
      :snapOffset="0"
      :dragInterval="0"
      :gutterSize="8"
      @drag-start="resizeRightColumnStart"
      @drag-end="resizeRightColumnEnd"
    >
      <SplitGridArea 
        id="maincon-L" 
      >
            <video-pane v-if="!meetingPaused && (meetingType === 'webex' || meetingType === 'video-call' || currentSharing.length > 0)" :meetingId="meetingId" location="left"></video-pane>
            
            <div v-if="meetingPaused || (meetingType === 'audio-call' || meetingType === 'video-call' && !callPeopleVideoOn) && currentSharing.length === 0" class="call-pane" >
              <presence-avatar
                :title="meetingCallInfo.people.name"
                :src="$store.state.avatarPath + meetingCallInfo.people.avatar" 
                :size="124"
                :presence="meetingPaused ? 'onhold' : null" 
                :theme="theme === 'light' ? 'light' : 'dark'"
              />
              <div class="name">{{meetingCallInfo.people.name}}</div>
              <div class="number">
                <wl-icon name="company-bold" size="16" />
                <span class="lb">{{meetingCallInfo.number}}</span>
              </div>
            </div>

            <div v-if="meetingType !== 'webex' && (meetingPaused || currentSharing.length === 0)" class="top-controls" >
              <div
                v-if="meetingPaused"
                class="btn ico-with-lb"
              >
                <wl-icon
                  name="call-merge-bold" 
                  :color=" theme === 'light' ? 'black-95' : 'white-95' "
                  size="16"
                  class="ico"
                />
                <span class="lb">Merge call windows</span>
              </div>

              <div
                class="btn"
              >
                <wl-icon
                  name="fullscreen-bold" 
                  :color=" theme === 'light' ? 'black-95' : 'white-95' "
                  size="16"
                  class="ico"
                />
              </div>

            </div>

          
            <self-video 
              v-if="!manuallyHideSelfVideo && !meetingPaused && meetingType !== 'audio-call' && (cameraOn || selfvideoAvatarVisible && selfViewOption === 1) && !devicePaired && !selfVideoWithOthers2 && !donotShowMySelf && selfSharing === null"
              :meetingId="meetingId"
              ></self-video>

            <reaction-stack style="z-index:10;" :meetingId="meetingId" ></reaction-stack>
            <!--reaction-combo style="z-index:11;" :meetingId="meetingId" ></reaction-combo-->

      </SplitGridArea><!-- end maincon-L -->

      <SplitGridGutter :render="sidePanelIsOpen && !stageMaximized" class="vsg_gutter_v" />

      <SplitGridArea 
        id="maincon-R" 
        sizeUnit="px" 
        :sizeValue="rightColumnWidth || rightPanelDefaultWidth" 
        :show="sidePanelIsOpen && !stageMaximized" 
        :style="{
          background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`
        }"
      >
        <div
          id="side_column_panels"
          ref="side_column_panels"
        >
          <div class="content">
            <panel-plist v-if="plistPanelVisible && !plistPanelPopouted" class="rpanel" :meetingId="meetingId" ></panel-plist>
            <panel-chat v-if="chatPanelVisible && !chatPanelPopouted" class="rpanel" :meetingId="meetingId" ></panel-chat>
            <panel-apps v-if="appsPanelVisible && !appsPanelPopouted" class="rpanel" :meetingId="meetingId" ></panel-apps>
            <panel-cc v-if="ccPanelVisible && !ccPanelPopouted" class="rpanel" :meetingId="meetingId" ></panel-cc>
            <panel-share-stage v-if="shareStagePanelVisible" class="rpanel" :meetingId="meetingId" ></panel-share-stage>
            <panel-gpt v-if="inMeetingGptPanelVisible && !inMeetingGptPanelPopouted" class="rpanel" :meetingId="meetingId" ></panel-gpt>
            <panel-content v-if="contentPanelVisible" class="rpanel" :meetingId="meetingId" ></panel-content>
          </div>
        </div><!--side_column_panels-->

      </SplitGridArea><!-- end maincon-R -->
    </SplitGrid><!--end maincon-->


    <div v-show="!lobbyVisible && meetingType !== 'audio-call'" id='controls-placeholder' :class="{fullscreen: fullscreen && !hudVisible}">
      <!-- controls placeholder -->
    </div><!--controls-placeholder-->

    <controls
      v-show="!lobbyVisible && meetingType !== 'audio-call'" 
      :meetingId="meetingId"
      :donotShowLabel="me.isSign"
      @openpanel="openPanel"
      class="controls"
      :class="{fadeXXX: !hudVisible && fullscreen}"
    >
      <controls-meet
        id="main-controls-meet"
        location="mainapp"
        :meetingId="meetingId" 
        :visibleButtons="me.isSign ? ['mute', 'video', 'more', 'leave'] : null"
        @closemeeting="close"
        @leave="postMeetingVisible = true"
      ></controls-meet>
    </controls>

    <controls-device v-if="!lobbyVisible && devicePaired" :meetingId="meetingId" />

    <notification-container />

    <div class="post-meeting" v-if="postMeetingVisible">
      <div class="post-meeting-content"></div>

      <div class="side" ref="plist_bubble_chain">
        <md-avatar 
          :title="'+ 4'"
          :size="40"
          class="ava" 
        />
        <md-avatar 
          v-for="(p, idx) in this.peopleList.slice(2, 5)"
          :key="`p${idx}`"
          :title="p.name"
          :src="p.avatar ? $store.state.avatarPath + p.avatar : ''" 
          :size="40"
          class="ava" 
        />
      </div>
    </div>

    <div v-if="meetingWindowOverlayVisible" class="overlaybackground"></div>

    <div v-if="ftePulseBorderVisible" class="fte-pulse-border" ref="fte-pulse-border"></div>

  </div>
</template>

<script>
//import mframe from 'mframe'
import _ from 'lodash';
import popLeave from "./meeting/pop-leave.vue";
import coachmark from './shared/coachmark.vue'

export default {
  name: 'MainClient',
  props: {
    meetingId: {
      type: String,
    },
    active: { // data comes from Windows.vue, WindowsContainer.vue
      type: Boolean,
      default: true,
    },
    parentRect: { // data comes from Windows.vue, WindowsContainer.vue
      type: DOMRect
    },
    defaultWidth: {
      type: Number,
    },
    defaultVideoLayout: {
      type: String,
    },
  },
  data () {
    return {

      prevVideoLayout: null,
      draggableValue: {},
      
      hideHudIntervalId: 0,

      noVideoTip: '',
      noVideoTip2: '',

      videoPaneHeight: '284px',

      /**
       * Vue Split Grid properties
       */
      animation: {
        duration: 500,
        easing: "easeInOutQuint"
      },
      transition: {
        name: "slide-to-left",
        duration: 200
      },
      rightColumnWidth: null,
      rightColumnWidthRatio: null,
      
      postMeetingVisible: false,
      windowsSize: 'normal',

      ftePulseBorderVisible: false,

    }
  },

  computed: {
    userTesting() {
      return this.$store.state.userTesting;
    },
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
    windowsWidth(){
      return this.$store.state.windowsWidth;
    },
    windowsHeight(){
      return this.$store.state.windowsHeight;
    },
    systemBarVisible() {
      return this.$store.state.systemBarVisible;
    },
    leftColumnMinWidth(){
      return this.$store.state.leftColumnMinWidth;
    },
    windowMinimized(){
      return this.$store.state.windowMinimized;
    },
    prevMeetingWindowsRect(){
      return this.$store.state.prevMeetingWindowsRect;
    },
    lobbyVisible() {
      return this.$store.state.lobbyVisible;
    },
    hudVisible() {
      return this.$store.state.hudVisible;
    },
    meetingWindowOverlayVisible() {
      return this.$store.state.meetingWindowOverlayVisible;
    },
    recordOn() {
      return this.$store.state.recordOn;
    },
    recordPaused() {
      return this.$store.state.recordPaused;
    },
    recordTimerObj() {
      return this.$store.state.recordTimerObj;
    },
    meetingLocked() {
      return this.$store.state.meetingLocked;
    },
    audioType() {
      return this.$store.state.audioType;
    },
    sidePanelIsOpen() {
      return this.$store.state.sidePanelIsOpen;
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId)
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    maximizeVideo() {
      return this.$store.state.maximizeVideo;
    },
    hidePeopleWithoutVideo() {
      return this.$store.state.hidePeopleWithoutVideo;
    },
    donotShowMySelf() {
      return this.$store.state.donotShowMySelf;
    },
    selfViewOption() {
      return this.$store.state.selfViewOption;
    },
    selfvideoAvatarVisible() {
      return this.$store.state.selfvideoAvatarVisible;
    },
    selfVideoWithOthers() {
      if (this.meetingType !== 'webex') {
        return false
      }
      return this.$store.state.selfVideoWithOthers;
    },
    selfVideoWithOthers2() {
      const lst = this.peopleList.filter(
        p => {
          return (!p.me || p.me && this.cameraOn) && (!this.hidePeopleWithoutVideo || this.hidePeopleWithoutVideo && p.video)}
      )
      const len = lst.length;

      if (this.videoLayout.indexOf('grid') > -1 && len === 2) {
        //return true;
      }
      if (this.videoLayout.indexOf('stage') > -1 && this.peopleList.length <= 2) {
        //return false;
      }
      if (this.videoLayout.indexOf('stage') > -1 && this.peopleList.length === 3) {
        //return true;
      }
      return this.selfVideoWithOthers;
    },
    activeSpeakerName() {
      return this.$store.state.activeSpeakerName;
    },
    activeSpeaker() {
      return this.$store.getters.activeSpeaker;
    },
    host() {
      return this.$store.getters.host;
    },
    me() {
      return this.$store.getters.me;
    },
    muted() {
      return this.$store.state.muted;
    },
    fullscreenMargin() {
      return this.$store.getters.fullscreenMargin;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    stageMaximized() {
      return this.$store.state.stageMaximized;
    },
    videoAndShareContentSwapped() {
      return this.$store.state.videoAndShareContentSwapped;
    },
    fullscreenControlPinned() {
      return this.$store.state.fullscreenControlPinned;
    },
    
    currentSharing() {
      return this.$store.getters.currentSharing(this.meetingId)
    },
    selfSharing() {
      return this.$store.state.selfSharing;
    },

    peopleList() {
      return this.$store.state.peopleList;
    },
    peopleNotJoinedList() {
      return this.$store.state.peopleNotJoinedList;
    },

    rightPanelOpenStack() {
      return this.$store.state.rightPanelOpenStack;
    },

    plistPanelVisible() {
      return this.$store.state.plistPanelVisible;
    },
    plistPanelPopouted() {
      return this.$store.state.plistPanelPopouted;
    },

    chatPanelVisible() {
      return this.$store.state.chatPanelVisible;
    },
    chatPanelPopouted() {
      return this.$store.state.chatPanelPopouted;
    },

    appsPanelVisible() {
      return this.$store.state.appsPanelVisible;
    },
    appsPanelPopouted() {
      return this.$store.state.appsPanelPopouted;
    },

    inMeetingGptPanelVisible() {
      return this.$store.state.inMeetingGptPanelVisible;
    },
    inMeetingGptPanelPopouted() {
      return this.$store.state.inMeetingGptPanelPopouted;
    },

    contentPanelVisible() {
      return this.$store.state.contentPanelVisible;
    },
    contentPanelPopouted() {
      return this.$store.state.contentPanelPopouted;
    },

    ccPanelVisible() {
      return this.$store.state.ccPanelVisible;
    },
    ccPanelPopouted() {
      return this.$store.state.ccPanelPopouted;
    },

    shareStagePanelVisible() {
      return this.$store.state.shareStagePanelVisible;
    },

    anyOpenPanel() {
      return this.$store.getters.anyOpenPanel;
    },
    anyPopoutPanel() {
      return this.$store.getters.anyPopoutPanel;
    },
    allPanelsPopouted() {
      return this.$store.getters.allPanelsPopouted;
    },
    cameraOn() {
      return this.$store.state.cameraOn;
    },
    manuallyHideSelfVideo() {
      return this.$store.state.manuallyHideSelfVideo;
    },
    closedCaptionEnabled() {
      return this.$store.state.closedCaptionEnabled;
    },
    devicePaired() {
      return this.$store.state.devicePaired;
    },
    devicePairedName() {
      return this.$store.state.devicePairedName;
    },
    rightPanelDefaultWidth() {
      return this.$store.state.rightPanelDefaultWidth;
    },
    rightPanelMinWidth() {
      return this.$store.state.rightPanelMinWidth;
    },
    disableElementTransition() {
      return this.$store.state.disableElementTransition;
    },
    videoPaused() {
      return this.$store.state.videoPaused;
    },
    meetingType() {
      return this.$store.getters.meetingType(this.meetingId)
    },
    meetingCallInfo() {
      return this.$store.getters.meetingCallInfo(this.meetingId)
    },
    meetingPaused() {
      return this.$store.getters.meetingPaused(this.meetingId)
    },
    callPeopleVideoOn() {
      return this.$store.getters.callPeopleVideoOn(this.meetingId)
    },
    deviceInSharing() {
      return this.$store.state.deviceInSharing;
    },
    sharePortionIsEditing() {
      return this.$store.state.sharePortionIsEditing;
    },
    FTE_peopleInvited() {
      return this.$store.state.FTE_peopleInvited;
    },
    isFTE() {
      return this.$store.state.isFTE;
    },
    showJoinLateInMeetingNotificationByAI() {
      return this.$store.state.showJoinLateInMeetingNotificationByAI;
    },
    sidecarInMeetingMsgList() {
      return this.$store.state.sidecarInMeetingMsgList;
    },


  },
  beforeMount() {

  },
  mounted () {

    this.hideHud();
    this.$refs['meetings-app'].addEventListener('mousemove', this.checkHideHud);
    this.$refs['meetings-app'].addEventListener('mousedown', this.checkHideHud);

    // init peopleList index
    let plist = [];

    if (this.meetingType === 'webex') {
      window.addEventListener('keydown', this.onKeydown);

      let peopleList = this.peopleList;
      const len = peopleList.length;
      for (let i = 0; i < len; i++) {
          const p = peopleList[i];
          p.index = i;
          plist.push(p);
      }
      this.$store.commit('peopleList', plist);

    }

    //if (!this.$store.state.aiEnabled) {
      this.randomChangeActiveSpeaker();
    //} else {
    //  const pp = this.me
    //  this.$store.commit('activeSpeakerName', pp.name);
    //  if (pp.video) {
    //    this.$store.commit('activeSpeakerNameWithVideo', pp.name);
    //  }
    //}

    if(this.isFTE) {
      this.showFTE(1)
    }

    if(this.showJoinLateInMeetingNotificationByAI) {
      setTimeout(() => {
          this.$notify({
            group: 'default',
            duration: 9000,
            text: `Recap what you have missed so far.`,
            data: {
              iconhtml: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.25 10C25.4926 10 26.5 8.99264 26.5 7.75C26.5 6.50736 25.4926 5.5 24.25 5.5C23.0074 5.5 22 6.50736 22 7.75C22 8.99264 23.0074 10 24.25 10ZM8.5 17.125C8.5 13.6042 11.3542 10.75 14.875 10.75C18.3958 10.75 21.25 13.6042 21.25 17.125C21.25 20.6458 18.3958 23.5 14.875 23.5C11.3542 23.5 8.5 20.6458 8.5 17.125ZM14.875 7.75C9.69733 7.75 5.5 11.9473 5.5 17.125C5.5 22.3027 9.69733 26.5 14.875 26.5C20.0527 26.5 24.25 22.3027 24.25 17.125C24.25 11.9473 20.0527 7.75 14.875 7.75Z" fill="url(#paint0_linear_175_26361)"/>
                <defs>
                <linearGradient id="paint0_linear_175_26361" x1="28" y1="4" x2="4" y2="28" gradientUnits="userSpaceOnUse">
                <stop stop-color="#3CC29A"/>
                <stop offset="1" stop-color="#0672EF"/>
                </linearGradient>
                </defs>
                </svg>
                `,
              closeable: true,
              button1Text: 'View',
              button1Click: () => {
                this.recapMeetingSofar()
                this.$store.commit("inMeetingGptPanelVisible", true);

              },
            },
          });
        }, 1000)
    }

    if(this.defaultVideoLayout) {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      optlist[idx].videoLayout = this.defaultVideoLayout
      this.$store.commit('meetingOptionsList', optlist)
    }

  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
    this.$refs['meetings-app'].removeEventListener('mousemove', this.checkHideHud);
    this.$refs['meetings-app'].removeEventListener('mousedown', this.checkHideHud);

  },

  watch: {
    FTE_peopleInvited(val) {
      if (val) {
        // show FTE, freeze U
        /*
        setTimeout(() => {
          this.showFTE(1)
        }, 800)
        */
      }
    },
    fullscreen(newVal) {
      this.$emit('fullscreen', {active: newVal})
       
    },
    videoLayout() {
      if (!this.anyOpenPanel) {
        this.closeSidePanel();
      }
    },

    plistPanelVisible(newVal) {
      if (!newVal && (!this.anyOpenPanel && !this.anyPopoutPanel)) {
        this.closeSidePanel();
      }

      let arr = [];//this.rightPanelOpenStack;
      if (newVal) {
        arr.push('plist');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'plist';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },

    chatPanelVisible(newVal) {
      if (!newVal && (!this.anyOpenPanel && !this.anyPopoutPanel)) {
        this.closeSidePanel();
      }

      let arr = [];//this.rightPanelOpenStack;
      if (newVal) {
        arr.push('chat');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'chat';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },

    contentPanelVisible(newVal) {
      if (!newVal && (!this.anyOpenPanel && !this.anyPopoutPanel)) {
        this.closeSidePanel();
      }

      let arr = [];//this.rightPanelOpenStack;
      if (newVal) {
        arr.push('content');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'content';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },

    ccPanelVisible(newVal) {
      if (!newVal && (!this.anyOpenPanel && !this.anyPopoutPanel)) {
        this.closeSidePanel();
      }else if(!this.ccPanelPopouted){
        this.openSidePanel()
      }

      let arr = [];//this.rightPanelOpenStack;
      if (newVal) {
        arr.push('cc');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'cc';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },

    appsPanelVisible(newVal) {
      if (!newVal && (!this.anyOpenPanel && !this.anyPopoutPanel)) {
        this.closeSidePanel();
      }else if(!this.appsPanelPopouted){
        this.openSidePanel()
      }

      let arr = [];//this.rightPanelOpenStack;
      if (newVal) {
        arr.push('apps');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'apps';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },
    
    inMeetingGptPanelVisible(newVal) {
      if (!newVal && (!this.anyOpenPanel && !this.anyPopoutPanel)) {
        this.closeSidePanel();
      }else if(!this.inMeetingGptPanelPopouted){
        this.openSidePanel()
      }

      let arr = [];//this.rightPanelOpenStack;
      if (newVal) {
        arr.push('gpt');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'gpt';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },

    shareStagePanelVisible(newVal) {
      if (!newVal && (!this.anyOpenPanel && !this.anyPopoutPanel)) {
        this.closeSidePanel();
      }
    },

    plistPanelPopouted(newVal) {
      if (newVal && this.allPanelsPopouted) {
        this.closeSidePanel();
      } else if (this.plistPanelVisible) {
        this.hideAllPanels('plist');
        this.openSidePanel();
      }

      let arr = [];//this.rightPanelOpenStack;
      if (!newVal) {
        arr.push('plist');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'plist';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },
    
    chatPanelPopouted(newVal) {
      if (newVal && this.allPanelsPopouted) {
        this.closeSidePanel();
      } else if (this.chatPanelVisible) {
        this.hideAllPanels('chat');
        this.openSidePanel();
      }

      let arr = [];//this.rightPanelOpenStack;
      if (!newVal) {
        arr.push('chat');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'chat';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },

    appsPanelPopouted(newVal) {
      if (newVal && this.allPanelsPopouted) {
        this.closeSidePanel();
      } else if (this.appsPanelVisible) {
        this.hideAllPanels('apps');
        this.openSidePanel();
      }

      let arr = [];//this.rightPanelOpenStack;
      if (!newVal) {
        arr.push('apps');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'apps';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },

    inMeetingGptPanelPopouted(newVal) {
      if (newVal && this.allPanelsPopouted) {
        this.closeSidePanel();
      } else if (this.inMeetingGptPanelVisible) {
        this.hideAllPanels('gpt');
        this.openSidePanel();
      }

      let arr = [];//this.rightPanelOpenStack;
      if (!newVal) {
        arr.push('gpt');
        this.$store.commit('rightPanelOpenStack', arr);
      } else {
        _.remove(arr, function(n) {
          return n == 'apps';
        });
        this.$store.commit('rightPanelOpenStack', arr);
      }
    },

    recordOn(newVal) {
      if (newVal) {
        this.startRecordTimer()
      } else {
        this.stopRecordTimer()
      }
    },

    recordPaused(newVal) {
      if (newVal) {
        this.pauseRecordTimer()
      } else {
        this.resumeRecordTimer()
      }
    },
   

  },
  methods: {
    recapMeetingSofar() {
        const msg = {
          type: 'responding',
          commandName: 'Recap meeting so far',
          time: new Date(),
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.5 4C14.3284 4 15 3.32843 15 2.5C15 1.67157 14.3284 1 13.5 1C12.6716 1 12 1.67157 12 2.5C12 3.32843 12.6716 4 13.5 4ZM3 8.75C3 6.40279 4.90279 4.5 7.25 4.5C9.59721 4.5 11.5 6.40279 11.5 8.75C11.5 11.0972 9.59721 13 7.25 13C4.90279 13 3 11.0972 3 8.75ZM7.25 2.5C3.79822 2.5 1 5.29822 1 8.75C1 12.2018 3.79822 15 7.25 15C10.7018 15 13.5 12.2018 13.5 8.75C13.5 5.29822 10.7018 2.5 7.25 2.5Z" fill="url(#paint0_linear_22_14645)"/>
<defs>
<linearGradient id="paint0_linear_22_14645" x1="16" y1="0" x2="0" y2="16" gradientUnits="userSpaceOnUse">
<stop stop-color="#3CC29A"/>
<stop offset="1" stop-color="#0672EF"/>
</linearGradient>
</defs>
</svg>
`,
                
          msgs: [
              `<span style="opacity:0.7; margin-right:4px; ">Generating what you have missed so far...</span>`,
          ],
          completefunc: {
              name: 'showRecapMeetingSofarRespondingResult',
          },
          frame: 'colored',
        }

        let list0 = this.$store.state.sidecarInMeetingMsgList.slice()
        let list
        if (list0.length === 0) {
          list = this.$store.state.sidecarInMeetingDefaultMsgList.slice()
          for(let i=list.length-1; i>=0; i--){
            if(list[i].type == 'msg'){
              list.splice(i, 1)
            }
          }
        } else {
          list = list0
        }
        list.push(msg)

        this.$store.commit('sidecarInMeetingMsgList', list);
    },
    windowsSizeChanged(size) {
      const macTopbarH = this.os !== 'mac' ? 0 : 22
      const systemBarH  = this.os !== 'mac' ? 40 : 0
      this.windowsSize = size

      this.$window.get(this.meetingId, window => {
          let rect
          if (size === 'normal') {
            rect = this.prevMeetingWindowsRect

            this.$emit('normal', { from: 'meetings-app' });

          } else if (size === 'max'){
            let parentrect = window.$el.parentNode.getBoundingClientRect()
            let prevRect = _.cloneDeep(window.getRect())
            this.$store.commit("prevMeetingWindowsRect", prevRect)
            
            /* drag-resize 中:
            * right 是窗口距离parent右边的距离
            * bottom 是窗口距离parent底部的距离
            */
            rect = {
              top: macTopbarH,
              bottom: systemBarH,//sysem bar height
              left: 0,
              right: 0,
              height: parentrect.height - macTopbarH - systemBarH,
              width: parentrect.width,
            }

            this.$emit('maximize', { from: 'meetings-app' });
          }

          window.setRect(rect)

        })
    },

    appHeaderMousedown() {
      this.$popper.hideAll();
    },


    resizeRightColumnStart() {
      this.$store.commit("videoPaused", true);
      this.$store.commit('disableElementTransition', true);
    },
    resizeRightColumnEnd() {
      this.$store.commit("videoPaused", false);
    },
    noVideoNum() {
      const lst = this.peopleList.filter(
        p => { return !p.me && !p.video }
      )
      return lst.length;
    },

    openPanel(type) {
      if(type === 'plist' && !this.plistPanelPopouted){
        this.openSidePanel()
      } else if(type === 'chat' && !this.chatPanelPopouted){
        this.openSidePanel()
      } else if(type === 'trans' && !this.transPanelPopouted){
        this.openSidePanel()
      } else if(type === 'apps' && !this.appsPanelPopouted){
        this.openSidePanel()
      } else if(type === 'poll' && !this.pollPanelPopouted){
        this.openSidePanel()
      } else if(type === 'content' && !this.contentPanelPopouted){
        this.openSidePanel()
      }
    },
    hideAllPanels(except){
      if (except!== 'plist' && !this.plistPanelPopouted) {
        this.$store.commit("plistPanelVisible", false);
      }
      if (except!== 'chat' && !this.chatPanelPopouted) {
        this.$store.commit("chatPanelVisible", false);
      }
      if (except!== 'apps' && !this.appsPanelPopouted) {
        this.$store.commit("appsPanelVisible", false);
      }
      if (except!== 'gpt' && !this.inMeetingGptPanelPopouted) {
        this.$store.commit("inMeetingGptPanelVisible", false);
      }
      if (except!== 'cc' && !this.ccPanelPopouted) {
        this.$store.commit("ccPanelVisible", false);
      }
      if (except!== 'content' && !this.contentPanelPopouted) {
        this.$store.commit("contentPanelVisible", false);
      }

      this.$store.commit("shareStagePanelVisible", false);

    },

    openSidePanel() {
      this.$store.commit('sidePanelIsOpen', true);

      if (!this.anyOpenPanel) {
        this.$store.commit('plistPanelVisible', true);
      }
    },

    closeSidePanel() {
      this.$store.commit('sidePanelIsOpen', false);
    },

    showAllParticipants() {
      this.$store.commit('hidePeopleWithoutVideo', false);
    },

    onKeydown(evt) {
      console.log('evt.code', evt.code);

       if (evt.code == 'Escape') {
        if (this.sharePortionIsEditing) {
          this.$store.commit("sharePortionIsEditing", false);
          this.$eventBus.$emit('show-share-dialog');
        }

      } 

      if (evt.code == 'KeyS' && evt.altKey) {

        if (this.deviceInSharing) {
          this.$store.commit('deviceInSharing', false);
        } else {
          this.$store.commit('deviceInSharing', true);
        }

      } else if (evt.code == 'KeyA' && evt.altKey) {

        if (this.userTesting === 'selfview') {
          let itv = setInterval(() => {
            if (this.peopleNotJoinedList.length > 0) {
              let p1 = this.peopleList.slice();
              let p2 = this.peopleNotJoinedList.slice();
              const p = p2.shift();
              p.sort = null;
              p.index = p1.length;
              p1.push(p);
              this.$store.commit('peopleNotJoinedList',p2);
              this.$store.commit('peopleList', p1);
            } else {
              clearInterval(itv)
            }
          }, _.random(100, 300));
          return;
        }

        if (this.peopleNotJoinedList.length > 0) {
          
          let p1 = this.peopleList.slice();
          let p2 = this.peopleNotJoinedList.slice();
          const p = p2.shift();
          p.sort = null;
          p.index = p1.length;
          p1.push(p);
          this.$store.commit('peopleNotJoinedList',p2);
          this.$store.commit('peopleList', p1);
        }
        
      } else if (evt.code == 'KeyR' && evt.altKey) {
        if (this.peopleList.length > 2) {
          let p1 = this.peopleList.slice();
          let p2 = this.peopleNotJoinedList.slice();
          const p = p1.pop();
          p.sort = null;
          p.index = null;
          p2.unshift(p);
          this.$store.commit('peopleNotJoinedList', p2);
          this.$store.commit('peopleList', p1);
        }
        
      }


    },

    setColumnSize() {
      if (this.rightColumnWidthRatio) {
        this.rightColumnWidth = this.$refs['meetings-app'].getBoundingClientRect().width * this.rightColumnWidthRatio;
      }
    },

    stopSharing() {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      optlist[idx].currentSharing = []
      this.$store.commit('meetingOptionsList', optlist);
    },

    toggleFullscreen() {
      this.$store.commit("fullscreen", !this.fullscreen);
    },

    checkHideHud(e){
      this.showHud(e);
      this.hideHud(e);
    },
    hideHud(e){
      this.hideHudIntervalId = setTimeout( () => {
        this.hideHud2(e);
      }, 3000);
    },
    hideHud2(e){
      if (e) {
        for(var i= 0; i<document.querySelectorAll('.hudelem').length; i ++){
          if (this.$hitTest(document.querySelectorAll('.hudelem')[i], e.pageX, e.pageY)) {
            return;
          }
        }
      }

      this.$store.commit('hudVisible', false);
    },
    showHud( ){
      clearInterval(this.hideHudIntervalId);
      this.$store.commit('hudVisible', true);
    },

    close() {
      this.hideAllPanels()
      this.closeSidePanel()
      this.$emit('close')
    },

    endmeeting() {
      if(this.meetingType === 'audio-call' || this.meetingType === 'video-call') {
        this.close()
        return
      }

      this.$modal.show(
        popLeave, 
        {
          meetingId: this.meetingId,
          ishost: this.host.name == this.me.name,
          onEnd: () => {
            this.close()
          },
        }, // component props
        {
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          draggable: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
          roundedCorner: this.os === 'mac',
          width: 400,
          height: 182,
          shiftX: 0.527,
          shiftY: 0.45,
        }, // modal props
        {
          closed: () => {
          },
        } // modal eventlistener
      );
    },

    randomChangeActiveSpeaker() {
      const plst = this.peopleList.filter(
        p => {
          return !p.room
        }
      )

      const rpp = plst[_.random(0, plst.length-1)]
      if (rpp.muted || this.videoPaused || this.me.name === rpp.name && this.me.isSign) {
        setTimeout(() => {
          this.randomChangeActiveSpeaker();
        }, 3000)
        return
      }
      let oldas = this.$store.getters.people(this.activeSpeakerName)
      let oldpin = oldas.pin

      this.$store.commit('activeSpeakerName', rpp.name);
      if (rpp.video) {
        this.$store.commit('activeSpeakerNameWithVideo', rpp.name);
      }

      // 如果当前activeSpeaker被pin了，那就交换pin给新的AS TODO
      if (!isNaN(oldpin)) {
        var lists = {
          peopleList: this.peopleList, 
        };
        _.forEach(lists, (value, key) => {
          let list = value
          let plist = [];
          const len = list.length;
          for (let i = 0; i < len; i++) {
              const p = list[i];
              if(p.name == oldas.name) {
                p.pin = undefined
              } else if (p.name == rpp.name) {
                p.pin = oldpin
              }
              plist.push(p);
          }
          this.$store.commit(key, plist);
        });
      }

      setTimeout(() => {
        this.randomChangeActiveSpeaker();
      }, _.random(9000, 18000));
    },


    startRecordTimer(){
      if (this.recordTimerObj.intervalId === 0) {
        const intervalId = setInterval(() => {
          this.$store.commit("recordTimerObj", {value: this.countTime(), intervalId: this.recordTimerObj.intervalId});
        }, 1000);
        
        this.$store.commit("recordTimerObj", {value: this.recordTimerObj.value, intervalId: intervalId});
      }
    },
    pauseRecordTimer(){
      clearInterval(this.recordTimerObj.intervalId);
      this.$store.commit("recordTimerObj", {value: this.recordTimerObj.value, intervalId: 0});
    },
    resumeRecordTimer(){
      this.startRecordTimer()
    },
    stopRecordTimer(){
      clearInterval(this.recordTimerObj.intervalId);
      this.$store.commit("recordTimerObj", {value: 0, intervalId: 0});
    },
    countTime(){
      return this.recordTimerObj.value + 1;
    },



    showCoachmark(opt) {
      this.$popper.show(
          coachmark,
          {
            ...opt
          }, // component props
          {
            reference: opt.reference,
            name: opt.name || 'fte-coachmark',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '8px',
            frameless: false,
            shadow: true,
            appendToBody: false,
            theme: `light webex`,
            closeTrigger: opt.closeTrigger,
            options: {
              placement: opt.placement,
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { },
            closed: () => { },
          } // popper eventlistener
        );
    },

    showFTE(step){
      this.ftePulseBorderVisible = true
      this.$store.commit("meetingWindowOverlayVisible", true);

      // id btn_view_switch
      // id controls-right-buttons
      this.$nextTick(() => {
        const el = this.$refs['fte-pulse-border']

        const overlay = document.querySelector('.overlaybackground')
        overlay.style.opacity = 0

        this.$window.get(this.meetingId, window => {
            const rectwin = window.$el.getBoundingClientRect()
            const btn1 = document.getElementById('btn_view_switch')
            const btn2 = document.getElementById('controls-right-buttons')
            const rect1 = btn1.getBoundingClientRect()
            const rect2 = btn2.getBoundingClientRect()

            if (step == 1) {
              el.style.width = `${rect1.width}px`
              el.style.height = `${rect1.height}px`
              el.style.top = `${rect1.top - rectwin.top - 1}px`
              el.style.left = `${rect1.left - rectwin.left - 1}px`

              this.showCoachmark({
                  name: 'inmeeting-coachmark-1',
                  closable: false,
                  icon: null,
                  title: `Change the layout`,
                  content: `Customize the video layout as you like.`,
                  subtext: `1 of 2`,
                  reference: btn1,
                  placement: `bottom`,
                  closeTrigger: '',
                  button: {
                    label: 'Next',
                    func: () => {
                      this.showFTE(2)
                    },
                  },
                })
                
            } else {
              const padding = 4
              el.style.width = `${rect2.width + padding * 2}px`
              el.style.height = `${rect2.height}px`
              el.style.top = `${rect2.top - rectwin.top}px`
              el.style.left = `${rect2.left - rectwin.left - padding}px`

              this.showCoachmark({
                  name: 'inmeeting-coachmark-2',
                  closable: false,
                  icon: null,
                  title: `Side panels`,
                  content: `Explore the rich features and contents through the panels.`,
                  subtext: `2 of 2`,
                  reference: btn2,
                  placement: `top`,
                  closeTrigger: '',
                  button: {
                    label: 'Done',
                    func: () => {
                      this.ftePulseBorderVisible = false
                      this.$store.commit("meetingWindowOverlayVisible", false)
                    },
                  },
                })
            }
          })

        
      })

    },
    

  },

}
</script>

<style lang="scss">

.meetings-app {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  &.disabled {
    pointer-events: none;
  }

  .fte-pulse-border {
    position: absolute;
    transform-origin: 50% 50%;
    box-sizing: border-box;

    &::after {
      opacity: .5;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 28px; 
      padding: 4px; 
      background: linear-gradient(to right, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
      -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
      mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude; 

      animation-name: pulse-border;
      animation-duration: 1.8s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      pointer-events: none;
    }

    @keyframes pulse-border {
      0% { opacity: 0; }
      50% { opacity: .5; }
      100% { opacity: 0; }
    }

  }

  .topbar {
    flex-grow: 0;
    flex-shrink: 0;
    transition: all 0.2s ease-out;

    &.fullscreen {
      margin-top: -44px;

      .speaking-bubble {
        margin-top: 88px;

      }
    }
  }



  .maincon {
    position: relative;
    flex-grow: 1;
    width: 100%;
    margin: 0;

    #maincon-L {
      position: relative;
      grid-template-rows: 1fr !important;
      display: flex;
      flex-direction: column;
    }
    #maincon-R {
      position: relative;
      display: flex;
      flex-direction: column;
      border-radius: 12px 0px 0px 0px;
    }
  }
  

  #controls-placeholder {
    position: relative;
    flex: none;
    height: 60px;
    transition: all 0.2s ease-out;
  }
  .controls {
    bottom: 0px;
    z-index: 9;
  }
  .controls.fullscreen {
    height: 0 !important;
  }

  

  .icoset_left {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    align-items: center;
  }

  .icoset_right {
    position: absolute;
    top: 8px;
    right: 10px;
    height: 32px;
    text-align: right;
    display: flex;
    flex-direction: row;
    align-items: center;
    pointer-events: auto;

    .btn {
      margin-left: 8px;
    }

    .btnfull {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;

      pointer-events: auto;
      cursor: default;
      user-select: none;

      width: 32px;
      height: 32px;
      border-radius: 16px;

      margin: 10px 10px 0 0;

      border: 1px solid rgba($color: #000000, $alpha: .3);
      background-color: var(--item-back-color);

      &:hover {
        background-color: var(--item-back-hover);
        border: 1px solid rgba($color: #000000, $alpha: .5);
      }

      &:active {
        background-color: var(--item-back-active);
        border: 1px solid rgba($color: #000000, $alpha: .9);
      }

      svg path {
        fill: #000000;
      }

    }
  }


  #floating_stuff {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
  }
  #hud {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 8;
  }


  .hideme {
    opacity: 0;
  }


  

  .self-avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $md-gray-20;
    border-radius: 4px;
    margin-top: 2px;
  }
  .self-avatar .img {
    width: 200px;
    height: 200px;
    border-radius: 100px;
  }



  #controls-placeholder.fullscreen {
    height: 0 !important;
  }


  #side_column_panels {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    pointer-events: none;

    .content{
      flex-grow: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      pointer-events: none;
    }

    .rpanel{
      margin-bottom: 8px;
    }
    .rpanel:last-child {
      margin-bottom: 0;
    }
  }


  &.fullscreen {
    .maincon {
      width: 100%;
      margin: 0;
    }
  }

  .fade {
    transition: opacity 0.3s ease-out;
    opacity: 0;
  }

  &.minimized {
    
    transform-origin: 50% 50%;
    transform: scale(0.001);
    opacity: 0;
    top: 400px !important;
    left: -150px !important;
  }

  .no-video-tip {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 0 15px;
    font-size: 14px;
    background-color: #000;
    border: 1px solid rgba($color: #FFF, $alpha: .2);
    border-radius: 4px;
    pointer-events: auto;
    user-select: none;

    .tip1,
    .ico {
      margin-right: 5px;
    }

    .lb-show {
      color: $md-blue-40;
      cursor: default;
      margin-left: 10px;
      display: none;
    }

    &:hover .tip2 {
      display: none;
    }
    &:hover .lb-show {
      display: flex;
    }
  }


  .vsg_gutter {
    background-color: transparent !important;
  }
  .vsg_gutter_h {
    /*background: url(~@/assets/img/splitter-light-h.svg) no-repeat center;*/
  }
  .vsg_gutter_v {
    /*background: url(~@/assets/img/splitter-light-v.svg) no-repeat center;*/
  }


  .post-meeting {
    position: absolute;
    top: 31px;
    left: 0;
    width: 100%;
    height: calc(100% - 31px);
    /*background: url(~@/assets/img/temp_post_meeting_bg.png) no-repeat center;*/
    background-size: cover;
    z-index: 88;

    &-content {
      width: 1020px;
      height: 621px;
      margin: 20px;
      /*background: url(~@/assets/img/temp_post_meeting.png) no-repeat 0 0;*/
      background-size: 1020px 621px;
    }

    .side {
      position: absolute;
      top: 20px;
      right: 20px;
      height: 40px;
      width: 136px;
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      align-items: center;

      .ava {
        margin-left: -8px;
        pointer-events: none;
      
        .md-avatar__img {
          border: 1px solid $md-gray-10;
        }
        .md-avatar__letter {
          color: white;
          background-color: $md-gray-80;
          border: 1px solid $md-gray-10;
        }
      }
    }
  }

  .overlaybackground {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #121212, $alpha: 0.4);
    z-index: 999;
  }

  &.mac {
    border-radius: 12px;
    overflow: hidden;
  }

  .call-pane {
    position: relative;
    width: 100%;
    flex-grow: 1;
    @include flex(column);

    .name {
      font-size: 26px;
      opacity: .95;
      margin-top: 12px;
    }
    .number {
      @include flex;

      svg path {
        fill: #000000;
        fill-opacity: .7;
      }

      .lb {
        margin-left: 8px;
        opacity: .7;
      }
    }

    .videoarea {
      width: 100%;
      flex-grow: 1;
    }

  }

  .top-controls {
    @include flex(row, flex-end);
    position: absolute;
    top: 16px;
    right: 16px;

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

      border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
      box-sizing: border-box;

      &:hover{
        border: 1px solid rgba($color: #FFFFFF, $alpha: .5);
        background-color: rgba($color: #FFFFFF, $alpha: .07);
      }
      &:active,
      &.active{
        background-color: rgba($color: #FFFFFF, $alpha: .2);
      }

      .ico {
        @include flex;
      }

      &.ico-with-lb {
        width: auto;
        padding: 0 16px;

        .ico {
          @include flex;
          margin-right: 8px;
          flex-shrink: 0;
        }
      }
      .lb {
        height: 32px;
        line-height: 32px;
        user-select: none;
        font-size: 15px;
      
      }
    }
  }


  /* ------------------ drak/hybrid ------------------ */

  &.dark,
  &.hybrid {

    .self-avatar {
      background-color: $md-gray-90;
    }

    .call-pane {
      .number {
        svg path {
          fill: #FFFFFF;
        }
      }
    }

    .icoset_right {
      .btnfull {
        border: 1px solid rgba($color: #FFFFFF, $alpha: .3);

        svg path {
          fill: #FFFFFF;
        }
      }
    }
  }

  
}

</style>
