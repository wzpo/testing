<template>
  <div class="teams-header" :class="[os, theme]">
    <div class="teams-header-bg" @mousedown="appHeaderMousedown"></div>
    <div class="headrow">

      <div class="teams-header-l" :class="[os]">
        <window-controls v-if="os === 'mac'" :active="active" @minimize="minimize" />
        <div id="teams-header-l-avatar" class="teams-header-l-avatar" ref="selfavatar" @click="showSelfMenu">
          <presence-avatar :src="$store.state.avatarPath + $store.getters.me.avatar" :size="32" :presence="$store.getters.me.status"
            :theme="theme === 'light' ? 'light' : 'dark'" class="avatar">
          </presence-avatar>
        </div>

        <!--
        <div v-if="teamsNavLayout !== 'calling'" class="teams-header-l-status" :class="{truncate: true}">
          <span v-show="!shrinkTrigger('.teams-header-l-status-lb')" class="teams-header-l-status-lb lb">Working from home 🏡</span>
          <wl-icon v-show="shrinkTrigger('.teams-header-l-status-lb')" class="teams-header-l-status-ico" name="commenting-filled" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="16" />
        </div>

        <div v-if="teamsNavLayout === 'calling'" class="teams-header-l-status" :class="{truncate: false}">
          <wl-icon class="teams-header-l-status-ico" name="commenting-filled" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="16" />
        </div>
        -->
        <div class="btn-circle teams-header-l-status"
          v-tooltip="{ placement: 'bottom', content: globalHeaderStatus.status ? `${globalHeaderStatus.status}<br><span style='opacity:0.7'>Until tomorrow</span>` : 'Set a status' }"
          @click="showStatusEditor">
          {{ globalHeaderStatus.emoji }}
          <wl-icon v-if="!globalHeaderStatus.emoji" name="status-empty"
            :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" />
        </div>


        
        

        <div v-if="teamsNavLayout === 'full' || teamsNavLayout === 'calling'"
          class="teams-header-divider gradient-divider-v"></div>

        <div v-if="teamsNavLayout === 'full' || teamsNavLayout === 'calling'" ref="iconcallas"
          class="teams-header-l-call teams-header-l-modifierchip btn-circle btn-pill" :class="{
            active: callAsMenuVisible,
          }" v-tooltip="{ placement: 'bottom', content: `Call as: ${callAs.label}` }" @click="showCallAs">
          <wl-icon :name="callAs.icon" :color="callAs.color" class="callasico" />
          <span v-show="!shrinkTrigger('.teams-header-l-modifierchip-lb') && !isTwoColumnsMode"
            class="teams-header-l-modifierchip-lb lb">{{ callAs.label }}</span>
        </div>

        <div v-if="teamsNavLayout === 'full' || teamsNavLayout === 'calling'" ref="iconcallqueues"
          class="teams-header-l-call teams-header-l-call1 btn-circle btn-pill" :class="{
            active: callQueueMenuVisible,
          }" @click="showCallQueues">
          <wl-icon name="queue-contact-bold" color="#3CC29A" size="16" />
          <span v-show="!shrinkTrigger('.teams-header-l-call1-lb') && !isTwoColumnsMode"
            class="teams-header-l-call1-lb lb">Available</span>
        </div>

<!--20230629 Yoona Jun 要求去掉 hunt groups 最后一个item 同时最多显示2个 -->
<!--
        <div v-if="teamsNavLayout === 'full' || teamsNavLayout === 'calling'"
          v-show="!shrinkTrigger('.teams-header-l-call2')" ref="iconforwarded"
          class="teams-header-l-call teams-header-l-call2 btn-circle btn-pill" :class="{
            active: phoneSettingsMenuVisible,
          }" @click="showPhoneSettings">
          <wl-icon name="hunt-group-bold" :color="'#3CC29A'" size="16" class="ico" />
          <span v-show="!shrinkTrigger('.teams-header-l-modifierchip-lb') && !isTwoColumnsMode"
            class="teams-header-l-modifierchip-lb lb">On</span>
        </div>

-->
<!--20230629 Yoona Jun 要求去掉 hunt groups 最后一个item -->

      </div>

      <div class="header-spacer" style="flex-grow: 0.43;"></div>

      <div v-if="!isTwoColumnsMode && teamsNavLayout !== 'calling'" class="teams-header-m">

        <div v-show="!shrinkTrigger('.navarrows')" class="navarrows">
          <div class="btn-circle">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.0002 7.00019C13.0727 7.00064 12.1546 7.18621 11.2997 7.54603C10.4448 7.90585 9.67038 8.43268 9.02171 9.09565V7.50115C9.02171 7.36854 8.96904 7.24136 8.87527 7.1476C8.7815 7.05383 8.65432 7.00115 8.52171 7.00115C8.38911 7.00115 8.26193 7.05383 8.16816 7.1476C8.07439 7.24136 8.02171 7.36854 8.02171 7.50115V10.5011C8.02168 10.5668 8.03458 10.6319 8.0597 10.6925C8.08481 10.7532 8.12164 10.8083 8.16808 10.8548C8.21451 10.9012 8.26965 10.9381 8.33033 10.9632C8.39101 10.9883 8.45604 11.0012 8.52171 11.0012H11.5217C11.6543 11.0012 11.7815 10.9485 11.8753 10.8547C11.969 10.7609 12.0217 10.6338 12.0217 10.5011C12.0217 10.3685 11.969 10.2414 11.8753 10.1476C11.7815 10.0538 11.6543 10.0011 11.5217 10.0011H9.5361C10.4723 8.95961 11.7437 8.27884 13.1296 8.07707C14.5155 7.87529 15.9282 8.16525 17.1226 8.8966C18.3169 9.62794 19.2174 10.7545 19.6677 12.0806C20.1179 13.4067 20.0895 14.8486 19.5874 16.156C19.0853 17.4633 18.1412 18.5536 16.919 19.2373C15.6968 19.9211 14.2737 20.1552 12.8969 19.8991C11.52 19.6429 10.2764 18.9126 9.38187 17.835C8.48738 16.7574 7.99853 15.4006 8.00021 14.0001C8.00021 13.8675 7.94754 13.7404 7.85377 13.6466C7.76 13.5528 7.63282 13.5001 7.50021 13.5001C7.36761 13.5001 7.24043 13.5528 7.14666 13.6466C7.05289 13.7404 7.00021 13.8675 7.00021 14.0001C7.00021 15.3846 7.41076 16.738 8.17993 17.8891C8.9491 19.0403 10.0423 19.9375 11.3214 20.4673C12.6005 20.9971 14.008 21.1357 15.3658 20.8656C16.7237 20.5956 17.971 19.9289 18.95 18.9499C19.9289 17.9709 20.5956 16.7236 20.8657 15.3658C21.1358 14.0079 20.9972 12.6004 20.4674 11.3214C19.9376 10.0423 19.0403 8.94903 17.8892 8.17986C16.7381 7.41069 15.3847 7.00019 14.0002 7.00019Z"
                fill="white" fill-opacity="0.95" />
              <path d="M14 11V15L16 17" stroke="white" stroke-opacity="0.95" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <!--div v-show="!shrinkTrigger('.navarrows')"  class="navarrows">
          <div class="btn-circle">
            <wl-icon
              name="arrow-left-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
            />
          </div>
          <div class="btn-circle" disabled >
            <wl-icon
              name="arrow-right-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
            />
          </div>
        </div-->

        <md-input v-show="!shrinkTrigger('.teams-header-m-search')" ref="searchinput"
          class="teams-header-m-search md-search-input" inputClassName="" clear shape="pill"
          placeholder="Search, meet, and call" @focus="onSearchFocus" @doneediting="onSearchBlur" @input="onSearchInput"
          @change="onSearchInput">
          <wl-icon name="search-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16"
            class="md-search-input__icon" slot="inputBefore" />
          <wl-icon name="cancel-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" slot="clear" />
        </md-input>

        <div v-show="shrinkTrigger('.teams-header-m-search')" class="btn-circle teams-header-m-searchico">
          <wl-icon name="search-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" />
        </div>

        <div v-show="!shrinkTrigger('.teams-header-m-add')" class="btn-circle teams-header-m-add" :class="{
          active: addVisible,
        }" ref="addbtn" @click="showAdd">
          <wl-icon name="plus-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" />
        </div>

        <!--div v-show="!shrinkTrigger('.teams-header-m-alert')" class="btn-circle teams-header-m-alert" >
          <wl-icon 
            name="alert-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="16"
          />
        </div-->

      </div>

      <div class="header-spacer"></div>

      <div class="teams-header-r">

        <div v-if="teamsNavLayout === 'calling'" class="teams-header-r-icolb teams-header-r-search">
          <wl-icon name="search-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" />
          <span v-show="!shrinkTrigger('.teams-header-r-search-lb')" class="teams-header-r-search-lb lb">Search</span>
        </div>



        <div v-show="!isTwoColumnsMode" class="teams-header-r-icolb teams-header-r-device">
          <wl-icon name="device-connection-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" />
          <span v-show="!shrinkTrigger('.teams-header-r-device-lb')" class="teams-header-r-device-lb lb">Device</span>
        </div>

        <div v-if="$store.state.aiEnabled && teamsNavLayout !== 'calling'" class="teams-header-r-ai" :class="{active: teamsSidecarName === 'ai-global' && !meetingsSidecarVisible}"
          @click="toggleSidePanel('ai-global')">
          <div class="ai" >
            <img src="~@/assets/img/ai-bot.svg" class="aiicon" />
          </div>
          <!--div class="ai">
            <video ref="aianimation" src="~@/assets/video/ai-talk-animation.mp4" loop="true"
              class="aianimation"></video>
          </div-->
        </div>

        <!--div v-if="teamsNavLayout !== 'calling'" class="teams-header-r-waffle" >
          <wl-icon 
            name="waffle-menu-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="16"
          />
        </div-->



        <window-controls v-if="os === 'win'" :active="active" :dark="true" class="teams-header-r-winctrl"
          @minimize="minimize" />

      </div>
    </div>

    <div v-if="isTwoColumnsMode && teamsNavLayout !== 'calling'" class="headrow headrow2">

      <div class="navarrows">
        <div class="btn-circle">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.0002 7.00019C13.0727 7.00064 12.1546 7.18621 11.2997 7.54603C10.4448 7.90585 9.67038 8.43268 9.02171 9.09565V7.50115C9.02171 7.36854 8.96904 7.24136 8.87527 7.1476C8.7815 7.05383 8.65432 7.00115 8.52171 7.00115C8.38911 7.00115 8.26193 7.05383 8.16816 7.1476C8.07439 7.24136 8.02171 7.36854 8.02171 7.50115V10.5011C8.02168 10.5668 8.03458 10.6319 8.0597 10.6925C8.08481 10.7532 8.12164 10.8083 8.16808 10.8548C8.21451 10.9012 8.26965 10.9381 8.33033 10.9632C8.39101 10.9883 8.45604 11.0012 8.52171 11.0012H11.5217C11.6543 11.0012 11.7815 10.9485 11.8753 10.8547C11.969 10.7609 12.0217 10.6338 12.0217 10.5011C12.0217 10.3685 11.969 10.2414 11.8753 10.1476C11.7815 10.0538 11.6543 10.0011 11.5217 10.0011H9.5361C10.4723 8.95961 11.7437 8.27884 13.1296 8.07707C14.5155 7.87529 15.9282 8.16525 17.1226 8.8966C18.3169 9.62794 19.2174 10.7545 19.6677 12.0806C20.1179 13.4067 20.0895 14.8486 19.5874 16.156C19.0853 17.4633 18.1412 18.5536 16.919 19.2373C15.6968 19.9211 14.2737 20.1552 12.8969 19.8991C11.52 19.6429 10.2764 18.9126 9.38187 17.835C8.48738 16.7574 7.99853 15.4006 8.00021 14.0001C8.00021 13.8675 7.94754 13.7404 7.85377 13.6466C7.76 13.5528 7.63282 13.5001 7.50021 13.5001C7.36761 13.5001 7.24043 13.5528 7.14666 13.6466C7.05289 13.7404 7.00021 13.8675 7.00021 14.0001C7.00021 15.3846 7.41076 16.738 8.17993 17.8891C8.9491 19.0403 10.0423 19.9375 11.3214 20.4673C12.6005 20.9971 14.008 21.1357 15.3658 20.8656C16.7237 20.5956 17.971 19.9289 18.95 18.9499C19.9289 17.9709 20.5956 16.7236 20.8657 15.3658C21.1358 14.0079 20.9972 12.6004 20.4674 11.3214C19.9376 10.0423 19.0403 8.94903 17.8892 8.17986C16.7381 7.41069 15.3847 7.00019 14.0002 7.00019Z"
              fill="white" fill-opacity="0.95" />
            <path d="M14 11V15L16 17" stroke="white" stroke-opacity="0.95" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!--div class="navarrows">
        <div class="btn-circle">
          <wl-icon
            name="arrow-left-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="16"
          />
        </div>
        <div class="btn-circle" disabled >
          <wl-icon
            name="arrow-right-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="16"
          />
        </div>
      </div-->

      <md-input ref="searchinput" class="teams-header-m-search md-search-input flex-grow" inputClassName="" clear
        shape="pill" placeholder="Search, meet, and call" @focus="onSearchFocus" @doneediting="onSearchBlur"
        @input="onSearchInput" @change="onSearchInput">
        <wl-icon name="search-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16"
          class="md-search-input__icon" slot="inputBefore" />
        <wl-icon name="cancel-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" slot="clear" />
      </md-input>

      <div class="btn-circle teams-header-m-add" :class="{
        active: addVisible,
      }" ref="addbtn" @click="showAdd">
        <wl-icon name="plus-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" />
      </div>

      <div class="teams-header-r-icolb teams-header-r-device">
        <wl-icon name="device-connection-bold" :color="theme === 'light' ? 'black-95' : 'white-95'" size="16" />
      </div>

    </div>
  </div>
</template>

<script>

import _ from 'lodash';
import statusEditor from './status-editor.vue'
import selfmenu from './self-menu.vue'
import popNewDirectMessage from "./pop-new-direct-message.vue";
import freesignup from './../onboarding/freesignup';
import PopperPhoneSettings from './popper-phone-settings.vue';
import PopperCallQueues from './popper-call-queues.vue';
import PopperCallAs from './popper-call-as.vue';

export default {
  props: {
    active: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      shrinkElements: [],
      hideableElementsAll: [
        {
          selector: '.teams-header-r-device-lb',
        },
        {
          selector: '.teams-header-r-search-lb',
        },
        {
          selector: '.teams-header-l-modifierchip-lb',
        },
        {
          selector: '.teams-header-m-search',
          minwidth: 150,
          replacedwidth: 32,
        },
        {
          selector: '.navarrows',
        },
        /*
        {
          selector: '.teams-header-l-status-lb',
          minwidth: 90,
          replacedwidth: 16,
        },
        */
        {
          selector: '.teams-header-l-call2',
        },
        {
          selector: '.teams-header-l-call1',
        },

        {
          selector: '.teams-header-m-add',
        },
        /*
        {
          selector: '.teams-header-m-alert',
        },
        */

      ],
      hideableElements: [],

      selfMenuVisible: false,

      callAsMenuVisible: false,

      queueList: [
        {
          label: 'SalesWestCoast',
          sub: '(999)888-7094',
          on: true,
          enabled: true,
        },
        {
          label: 'SalesNorthCoast',
          sub: '(999)888-7091',
          on: false,
          enabled: true,
        },
        {
          label: 'SalesEastCoast',
          sub: '(999)888-7093',
          on: true,
          enabled: true,
        },
        {
          label: 'SalesSouthCoast',
          sub: '(999)888-7092',
          on: false,
          enabled: false,
        },
        {
          label: 'SalesGlobal',
          sub: '+21 123450054',
          on: true,
          enabled: false,
        },
        {
          label: 'SalesWestCoast',
          sub: '(999)888-7094',
          on: true,
          enabled: true,
        },
        {
          label: 'SalesNorthCoast',
          sub: '(999)888-7091',
          on: false,
          enabled: true,
        },
        {
          label: 'SalesEastCoast',
          sub: '(999)888-7093',
          on: true,
          enabled: true,
        },
        {
          label: 'SalesSouthCoast',
          sub: '(999)888-7092',
          on: false,
          enabled: false,
        },
      ],
      callQueueMenuVisible: false,

      phoneSettingsMenuVisible: false,

      addVisible: false,
      addList: [
        {
          label: 'New direct message',
          icon: 'chat-group-bold',
        },
        {
          label: 'New space',
          icon: 'chat-bold',
        },
        {
          label: 'Make a call',
          icon: 'dialpad-bold',
        },
        {
          label: 'Schedule a meeting',
          icon: 'calendar-add-bold',
        },
        {
          label: 'Start a meeting',
          icon: 'camera-bold',
        },

      ],
    }
  },
  computed: {
    dev() {
      return this.$store.state.dev;
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
    teamsNavLayout() {
      return this.$store.state.teamsNavLayout;
    },
    isTwoColumnsMode() {
      return this.$store.state.isTwoColumnsMode;
    },
    globalHeaderStatus() {
      return this.$store.state.globalHeaderStatus;
    },
    meetingsSidecarVisible() {
      return this.$store.state.meetingsSidecarVisible;
    },
    teamsSidecarName() {
      return this.$store.state.teamsSidecarName;
    },
    teamsNav() {
      return this.$store.state.teamsNav;
    },
    teamsNavPrev() {
      return this.$store.state.teamsNavPrev;
    },
    callAs() {
      return this.$store.state.callAs;
    },
    callAsList() {
      return this.$store.state.callAsList;
    },
    me() {
      return this.$store.getters.me;
    },
  },
  beforeMount() {
    
  },
  mounted() {
    this.hideableElements = this.hideableElementsAll.filter(
      itm => {
        var el = document.querySelector(itm.selector);
        return el !== null
      }
    );

    this.$eventBus.$on('teams-resizing', this.onAppResizing);

    if (this.$store.state.aiEnabled && this.$refs.aianimation) {
      //this.toggleSidePanel('ai')

      this.$refs.aianimation.currentTime = 3
      this.$eventBus.$on('ai-animation-start', this.playAiAnimation);
      this.$eventBus.$on('ai-animation-stop', this.stopAiAnimation);
    }

  },
  beforeDestroy() {
    this.$eventBus.$off('teams-resizing', this.onAppResizing);
    if (this.$store.state.aiEnabled) {
      this.$eventBus.$off('ai-animation-start', this.playAiAnimation);
      this.$eventBus.$off('ai-animation-stop', this.stopAiAnimation);
    }
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
    onAppResizing() {
      // shrink and hide elements
      //
      const minSpace = 4;
      const bounceSaftyGap = 4;
      var i, len, el, itm, widthAvaiable;

      var spacers = document.querySelectorAll('.header-spacer');
      len = spacers.length;
      widthAvaiable = 0;
      for (i = 0; i < len; i++) {
        el = spacers[i];
        widthAvaiable += el.getBoundingClientRect().width;
      }

      var elements = this.hideableElements;

      len = this.shrinkElements.length
      var selectors = this.shrinkElements.reduce((arr, val) => {
        arr.push(val.selector)
        return arr;
      }, []);

      if (widthAvaiable < minSpace) {
        var nextid = len
        if (elements.length > nextid) {
          itm = elements[nextid];
          el = document.querySelector(itm.selector);
          var width = el.getBoundingClientRect().width
          var obj = {
            selector: itm.selector,
            width: width,
            minwidth: itm.minwidth,
            replacedwidth: itm.replacedwidth,
          }
          if (!selectors.includes(itm.selector) && (!itm.minwidth || itm.minwidth >= width)) {
            this.shrinkElements.push(obj);
          }

        }

      } else {
        // show 
        if (len > 0) {
          itm = _.last(this.shrinkElements)
          var replacedwidth = itm.replacedwidth ? itm.replacedwidth : 0;
          if (widthAvaiable - minSpace + replacedwidth - bounceSaftyGap > itm.width) {
            this.shrinkElements.pop();
          }
        }
      }

      this.$forceUpdate();

    },

    shrinkTrigger(selector) {
      for (var i = this.shrinkElements.length - 1; i >= 0; i--) {
        var ele = this.shrinkElements[i];
        if (ele.selector === selector) {
          return true;
        }
      }
      return false
    },

    appHeaderMousedown() {
      this.$popper.hideAll();
      //document.getElementById("app").focus();
    },

    onSearchFocus() {
      this.$eventBus.$emit('space-search-changed', {
        focus: true,
        input: this.$refs.searchinput.currentValue,
      });
    },
    onSearchBlur() {
      this.$eventBus.$emit('space-search-changed', {
        focus: false,
        input: this.$refs.searchinput.currentValue,
      });
    },
    onSearchInput() {
      this.$eventBus.$emit('space-search-changed', {
        focus: true,
        input: this.$refs.searchinput.currentValue,
      });
    },

    minimize() {
      this.$emit('minimize');
    },

    showSelfMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.selfMenuVisible) {
        this.$popper.show(
          selfmenu,
          {
            onSelect: (itm) => {
              if (itm.label == 'Settings') {
                this.$store.commit('popSettingsType', 'calling')
                this.$store.commit('popSettingsVisible', true)
              } else if (itm.label == 'Manage account') {
                this.openUserPortal()
              }
            },
          }, // component props
          {
            reference: this.$refs.selfavatar,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            options: {
              placement: 'bottom',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.selfMenuVisible = true },
            closed: () => { this.selfMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

    openUserPortal(){

        const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
        const width = 1366
        const height = 860
        let x = (desktopRect.width - width)/2;
        let y = this.os === 'win' ? 
          (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

        this.$window.show(
          freesignup, 
          {
            defaultPage: 'userhub',
            defaultUserhubNav: 'Profile',
            settingsHasCalling: true,
          }, // component props
          {
            name: 'freesignup',
            w: width,
            h: height,
            x: x,
            y: y,
            isDraggable: true,
            isResizable: false,
            border: false,
            dragHandle: '.browser-header',
            
          }, // window props
          {
            closed: () => { },
          } // window eventlistener
        );
      },

    showStatusEditor() {
      this.$modal.show(
        statusEditor,
        {}, // component props
        {
          clickToClose: false,
          frameless: true,
          shadow: true,
          resizable: false,
          draggable: '#status-editor-titlebar',
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          roundedCorner: this.os === 'mac',
          width: 440,
          height: 468,
          shiftY: 0.45,
          transition: true,
        }, // modal props
        {
          closed: () => { this.$store.commit("popSettingsVisible", false); }
        } // modal eventlistener
      );
    },


    showCallAs(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.callAsMenuVisible) {
        this.$popper.show(
          PopperCallAs,
          {
            callAsList: this.callAsList,
            selected: this.callAs,
          }, // component props
          {
            reference: this.$refs.iconcallas,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            options: {
              placement: 'bottom',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.callAsMenuVisible = true },
            closed: () => { this.callAsMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

    showCallQueues(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.callQueueMenuVisible) {
        this.$popper.show(
          PopperCallQueues,
          {
            queueList: this.queueList,
          }, // component props
          {
            reference: this.$refs.iconcallqueues,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            options: {
              placement: 'bottom',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.callQueueMenuVisible = true },
            closed: () => { this.callQueueMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },


    showPhoneSettings(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.phoneSettingsMenuVisible) {
        this.$popper.show(
          PopperPhoneSettings,
          {

          }, // component props
          {
            reference: this.$refs.iconforwarded,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            options: {
              placement: 'bottom',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.phoneSettingsMenuVisible = true },
            closed: () => { this.phoneSettingsMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

    showAdd(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.addVisible) {
        this.$popper.show(
          {
            template: `
              <div class="common-menulist" style="width:220px;">
                <div v-for="(itm, idx) in addList"
                  :key="idx"
                  :class="{
                    'common-menulist-item': itm.type!=='divider',
                    'divider': itm.type==='divider',
                  }" 
                  @click="close(itm)"
                >
                  <wl-icon v-if="itm.type!=='divider'" :name="itm.icon" size="16" style="margin-right: 8px;" />
                  <div v-if="itm.type!=='divider'" class="lb">
                    <div class="line1">
                      {{itm.label}}
                    </div>
                  </div>

                  <div v-if="itm.type==='divider'" style="border-top:1px solid rgba(255,255,255,.2); margin: 4px 4px;"></div>
                </div>

              </div>
            `,
            props: ['parentRef', 'addList', 'onSelect'],
            methods: {
              close(itm) {
                this.$popper.hideAll();
                this.onSelect(itm);
              },
            }
          },
          {
            parentRef: this,
            addList: this.addList,
            onSelect: (itm) => {
              if (itm.label === 'New direct message') {
                this.showNewDirectMessage()
              }
            },
          }, // component props
          {
            reference: this.$refs.addbtn,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            options: {
              placement: 'bottom',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.addVisible = true },
            closed: () => { this.addVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

    showNewDirectMessage() {
      this.$modal.show(
        popNewDirectMessage,
        {
          peoplename: name,

        }, // component props
        {
          name: 'new-direct-message',
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: '#pop-new-direct-message .head',
          roundedCorner: false,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          width: 780,
          height: 708,
          transition: true,
        }, // modal props
        {} // modal eventlistener
      );
    },


    toggleSidePanel(name) {
      if (this.teamsSidecarName !== name || this.meetingsSidecarVisible) {
        this.$store.commit('teamsSidecarName', name)
        if (name === 'ai-global' && this.teamsNav === 'webexgpt') {
          this.$store.commit('teamsNav', this.teamsNavPrev);
        }
      } else {
        this.$store.commit('teamsSidecarName', null)
      }
      this.$store.commit('meetingsSidecarVisible', false);

    },

  }
}
</script>


<style lang="scss">
.teams-header {
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;
  font-size: 12px;

  background: rgb(26, 26, 26);
  /** need for mix-blend-mode */

  .headrow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;

    &.headrow2 {
      margin: 0 8px;
    }
  }

  .header-spacer {
    flex-shrink: 1;
    flex-grow: 1;
  }


  .spacer-margin16 {
    max-width: 16px;
  }

  .spacer-margin12 {
    max-width: 12px;
  }

  .navarrows {
    @include flex;
  }

  &-divider {
    height: 24px;
    margin: 0 4px;
  }

  &-bg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  &-l {
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    padding-left: 20px;
    user-select: none;
    margin-right: 4px;

    &.win {
      padding-left: 10px;
    }

    &-avatar {
      position: relative;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin-left: 6px;
    }

    &-status {
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 28px;
      height: 28px;
      margin: 0 2px 0 4px !important;
      font-size: 12px;

      &.truncate {
        flex-shrink: 1;

        .lb {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      &-lb {
        display: block;

        opacity: 0.9;
        font-size: 14px;
        line-height: 28px;
        border-radius: 14px;
        padding: 0;

        &:hover {
          background-color: rgba($color: black, $alpha: 0.07);
        }

        &:active {
          background-color: rgba($color: black, $alpha: 0.1);
        }
      }

    }

    &-call {
      @include flex;
      flex-shrink: 0;
      margin: 0 8px;

      .lb {
        margin-left: 4px;
        font-size: 14px;
        opacity: .95;
      }

      .callasico {
        width:22px; 
        svg {
          width:22px; 
          height:14px;
        }
      }
    }

  }

  &-m {
    display: flex;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 1;

    &-search {
      flex-shrink: 1;
      flex-grow: 1;
      margin-bottom: 0 !important;
      margin-right: 2px;
      max-width: 500px;

      .md-input__before {
        color: rgba($color: black, $alpha: 0.95);
        fill: rgba($color: black, $alpha: 0.95);
        margin-left: 8px;
      }

      .md-input__after {
        width: 28px;
      }

      .md-input {
        height: 28px;
        width: 100%;
        flex-grow: 1;
        background-color: transparent;
        border-color: rgba($color: black, $alpha: 0.5);
        font-size: 14px;
        padding-left: 38px;

        &::placeholder {
          color: rgba($color: black, $alpha: 0.7) !important;
        }

        &:placeholder-shown {
          text-overflow: ellipsis;
        }

        &:hover {
          background-color: rgba($color: black, $alpha: 0.07) !important;
          border-color: rgba($color: black, $alpha: 0.7) !important;
        }

        &:focus {
          background-color: rgba($color: black, $alpha: 0.1) !important;
          border-color: rgba($color: black, $alpha: 0.9) !important;
          box-shadow: 0 0 0 3px $md-blue-50 !important;
        }
      }
    }

    &-alert {
      margin: 0 4px;
      @include flex;
      width: 28px;
      height: 28px;
      flex-shrink: 0;
    }
  }

  &-r {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select: none;

    &-icolb {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      padding: 0 6px;
      margin: 0 4px 0 4px;
      border-radius: 14px;
      white-space: nowrap;
      flex-shrink: 0;

      svg path {
        fill: black;
        fill-opacity: .95;
      }

      .lb {
        margin-left: 4px;
        opacity: 0.9;
        font-size: 14px;
      }

      &:hover {
        background-color: rgba($color: black, $alpha: 0.07);
      }

      &:active {
        background-color: rgba($color: black, $alpha: 0.1);
      }

    }

    &-ai {
      position: relative;
      @include flex;
      margin: 0 8px 0 4px;
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

    &-waffle {
      margin: 0 8px 0 4px;
      @include flex;
      width: 28px;
      height: 28px;
      pointer-events: auto;

    }

    &-winctrl {
      display: flex;
      align-items: center;
    }
  }

  .btn-circle {
    width: 28px;
    min-width: 28px;
    height: 28px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 2px;
    z-index: 10;
    box-sizing: border-box;

    &-bordered {
      border: 1px solid rgba($color: black, $alpha: .3);

      &:hover {
        border: 1px solid rgba($color: black, $alpha: .4);
      }

      &:active,
      &.active {
        border: 1px solid rgba($color: black, $alpha: .4);
      }
    }

    &.btn-pill {
      width: auto;
      padding: 0 8px;
      min-width: 28px;

      .ico {
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }

    &[disabled] {
      pointer-events: none;
      opacity: .4;
    }

    &:hover {
      background-color: rgba($color: black, $alpha: 0.07);
    }

    &:active,
    &.active {
      background-color: rgba($color: black, $alpha: 0.1);
    }
  }

  /* theme ----- dark/hybrid */
  &.dark,
  &.hybrid {

    .teams-header-l {

      &-status {
        &-lb {
          &:hover {
            background-color: rgba($color: white, $alpha: 0.07);
          }

          &:active {
            background-color: rgba($color: white, $alpha: 0.1);
          }
        }

      }


    }

    .teams-header-m {

      &-search {
        .md-input__before {
          color: rgba($color: white, $alpha: 0.95);
          fill: rgba($color: white, $alpha: 0.95);
        }

        .md-input {
          color: rgba($color: white, $alpha: 0.95);
          background-color: rgba($color: white, $alpha: 0.1);
          border-color: rgba($color: white, $alpha: 0.0);

          &::placeholder {
            color: rgba($color: white, $alpha: 0.7) !important;
          }

          &:hover {
            background-color: rgba($color: white, $alpha: 0.05);
            border-color: rgba($color: white, $alpha: 0.3) !important;
          }

          &:focus {
            background-color: rgba($color: white, $alpha: 0.1);
            border-color: rgba($color: white, $alpha: 0.3) !important;
            box-shadow: 0 0 0 3px $md-blue-40 !important;
          }

        }
      }
    }

    .teams-header-r {
      &-icolb {

        svg path {
          fill: white;
        }

        &:hover {
          background-color: rgba($color: white, $alpha: 0.07);
        }

        &:active {
          background-color: rgba($color: white, $alpha: 0.1);
        }
      }

    }

    .btn-circle {
      &-bordered {
        border: 1px solid rgba($color: white, $alpha: .3);

        &:hover {
          border: 1px solid rgba($color: white, $alpha: .4);
        }

        &:active,
        &.active {
          border: 1px solid rgba($color: white, $alpha: .4);
        }
      }

      &:hover {
        background-color: rgba($color: white, $alpha: 0.07);
      }

      &:active,
      &.active {
        background-color: rgba($color: white, $alpha: 0.1);
      }

    }



  }
}
</style>
