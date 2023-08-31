<template>
  <div id="controls-wrap" ref="controlwrap"
    :class="[theme, {
      slidedown: !fullscreenControlPinned && !hudVisible,
      disabled: disabled,
    }]"
  >
    <!--div 
      class="clsbg" 
      :class="{
        unpin: !fullscreenControlPinned
      }"
      v-if="fullscreen"
    >
      <div class="clshandle" @click="togglePin">
        <wl-icon
          v-if="!fullscreenControlPinned" 
          name="format-panel-control-up-bold" 
          :color=" theme === 'light' ? 'black-95' : 'white-95' "
          size="12"
          class="icocls"
        />
        <wl-icon
          v-if="fullscreenControlPinned" 
          name="format-panel-control-down-bold" 
          :color=" theme === 'light' ? 'black-95' : 'white-95' "
          size="12"
          class="icocls"
        />
      </div>
    </div-->

    <div class='group_btn group_btn_left'>
      <!--
      <div 
        v-if="meetingType === 'webex'" 
        class="gbtn" 
        :class="{active: popAssistantVisible}"
        ref="btn_assistant"
        @mouseover="delayShowAssistant"
        @mouseout="clearShowAssistantTimeout"
      >
        <div :class="{'ai-off': !assistantEnabled, ai: assistantEnabled}" ></div>
      </div>
      -->
      
      <div 
        class="gbtn" 
        :class="{active: closedCaptionEnabled, nohover: !closedCaptionEnabled}" 
      >
        <div 
          class="lft half"
          v-tooltip="{placement: 'top', content: closedCaptionEnabled ? 'Hide captions' : 'Show captions'}"
          @click="toggleCaption" 
        >
          <wl-icon :name="closedCaptionEnabled ? 'closed-captions-filled' : 'closed-captions-bold'" size="20" />
        </div>
        <div 
          class="rgt half" 
          :class="{active: captionOptionVisible}" 
          ref="btn_caption_option"
          @click="showCaptionOption"
        >
          <wl-icon name="arrow-down-filled" size="12" />
        </div>
        
      </div>

      <div 
        v-if="siEnabled || sliEnabled"
        class="gbtn" 
        :class="{active: siPopperVisible}"
        ref="btn_si"
        v-tooltip="{placement: 'top', content: 'Interpretation'}"
        @mousedown="bringToFront" 
        @click="toggleSi" 
      >
        <wl-icon name="language-bold" size="20" />
      </div>

    </div><!--group_btn_left-->


    <div style="z-index:1;">
      <slot></slot>
    </div>

    <div id="controls-right-buttons" ref="rightctrl" class='group_btn_right abs'>
      <div class='group_btn'>
        <div 
          v-if="meetingType === 'webex'" 
          class="gbtn" 
          ref="btn_act" 
          :class="{active: appsPanelVisible, padding: showLabel}" 
          v-tooltip="{placement: 'top', content: showLabel ? null : 'Apps'}"
          @click="toggleActivity" 
        >
          <wl-icon v-if="!appsPanelVisible" name="apps-bold" size="20" />
          <wl-icon v-if="appsPanelVisible" name="apps-filled" size="20" />

          <span class="tt" v-if="showLabel">Apps</span>
          <!--span class="unread" v-if="unreadNum > 0">{{unreadNum}}</span-->
        </div>

        <div 
          v-if="meetingType === 'webex'" 
          class="gbtn" 
          :class="{active: plistPanelVisible, padding: showLabel}"
          v-tooltip="{placement: 'top', content: showLabel ? null : 'Participants'}"
          @click="togglePlist" 
        >
          <wl-icon v-if="!plistPanelVisible" name="participant-list-bold" size="20" />
          <wl-icon v-if="plistPanelVisible" name="participant-list-filled" size="20" />
          <span class="tt" v-if="showLabel">Participants</span>
        </div>

        <div 
          class="gbtn" 
          :class="{active: chatPanelVisible, padding: showLabel}"
          v-tooltip="{placement: 'top', content: showLabel ? null : 'Chat'}"
          @click="toggleChat" 
        >
          <wl-icon v-if="!chatPanelVisible" name="chat-bold" size="20" />
          <wl-icon v-if="chatPanelVisible" name="chat-filled" size="20" />

          <span class="tt" v-if="showLabel">Chat</span>
          <span class="reddot" v-if="unreadMessages.length > 0"></span>
        </div>

        <div 
          v-if="meetingType === 'webex'" 
          class="gbtn" 
          :class="{active: contentPanelVisible, padding: showLabel}"
          v-tooltip="{placement: 'top', content: showLabel ? null : 'Content'}"
          @click="toggleContent" 
        >
          <wl-icon v-if="!contentPanelVisible" name="file-bold" size="20" />
          <wl-icon v-if="contentPanelVisible" name="file-filled" size="20" />

          <span class="tt" v-if="showLabel">Content</span>
        </div>

        <!--div class="gbtn" >
          <wl-icon name="more-bold" size="20" />
        </div-->

      </div>

    </div><!--group_btn_right-->

  </div>
</template>

<script>

import popWbxAssistant from './pop-wbx-assistant.vue';
import popCaptionOption from './pop-caption-option.vue';
import popSiSettings from "./interpretation-setting.vue";
import popSiSettingsSign from "./interpretation-setting-sign.vue";
import coachmark from '../shared/coachmark.vue'

export default {
  props: {
    meetingId: {
      type: String,
    },
    donotShowLabel: {
      type: Boolean,
    },
  },
  data() {
    return {
      ccBubbleVisible: false,
      siPopperVisible: false,
      showLabel: true,
      disabled: false,
      isopen: true,
      hoverItv: 0,
      popAssistantVisible: false,
      captionOptionVisible: false,
      tmo_showAssistant: null,
    };
  },
  computed: {
    windowsSizeChanged(){
      return this.$store.state.windowsSizeChanged
    },
    host(){
      return this.$store.getters.host
    },
    me(){
      return this.$store.getters.me
    },
    unreadMessages(){
      return this.$store.getters.unreadMessages;
    },
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    siEnabled() {
      return this.$store.state.siEnabled;
    },
    sliEnabled() {
      return this.$store.state.sliEnabled;
    },
    signLanguageWindowName() {
      return this.$store.state.signLanguageWindowName;
    },
    sliRole() {
      return this.$store.state.sliRole;
    },
    hudVisible() {
      return this.$store.state.hudVisible;
    },
    allControlsLabelVisible() {
      return this.$store.state.allControlsLabelVisible;
    },
    sidePanelIsOpen() {
      return this.$store.state.sidePanelIsOpen;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    stageMaximized() {
      return this.$store.state.stageMaximized;
    },
    fullscreenControlPinned() {
      return this.$store.state.fullscreenControlPinned;
    },
    anyOpenPanel() {
      return this.$store.getters.plistPanelVisible;
    },
    plistPanelVisible() {
      return this.$store.state.plistPanelVisible;
    },
    chatPanelVisible() {
      return this.$store.state.chatPanelVisible;
    },
    contentPanelVisible() {
      return this.$store.state.contentPanelVisible;
    },
    appsPanelVisible() {
      return this.$store.state.appsPanelVisible;
    },
    ccPanelPopouted() {
      return this.$store.state.ccPanelPopouted;
    },
    inMeetingGptPanelVisible() {
      return this.$store.state.inMeetingGptPanelVisible;
    },
    inMeetingGptPanelPopouted() {
      return this.$store.state.inMeetingGptPanelPopouted;
    },

    plistPanelPopouted() {
      return this.$store.state.plistPanelPopouted;
    },
    chatPanelPopouted() {
      return this.$store.state.chatPanelPopouted;
    },
    contentPanelPopouted() {
      return this.$store.state.contentPanelPopouted;
    },
    appsPanelPopouted() {
      return this.$store.state.appsPanelPopouted;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    assistantEnabled() {
      return this.$store.state.assistantEnabled;
    },
    closedCaptionEnabled() {
      return this.$store.state.closedCaptionEnabled;
    },
    breakoutSessionEnabled() {
      return this.$store.state.breakoutSessionEnabled;
    },
    chatMsgList() {
      return this.$store.state.chatMsgList;
    },
    meetingType() {
      return this.$store.getters.meetingType(this.meetingId)
    },
    unreadApps() {
      return this.$store.state.unreadApps;
    },
    unreadNum() {
      let n = 0
      for(var k in this.unreadApps) {
        n += this.unreadApps[k]
      }
      return n
    },
  },
  mounted() {
    this.checkCollision();

    this.$eventBus.$on('open-cc', () => {
      this.openCC();
    });
    this.$eventBus.$on('close-all-panels', () => {
      this.hideAllPanels();
    });

    if (this.sliEnabled && this.sliRole !== 'sli') {
      const content = {
        'host': `Interpretation has started. You can manage interpretation settings here.`,
        'hhuser': `Sign language Interpretation has started. You can view the interpretation from here.`,
      }
      requestAnimationFrame(() => {
        this.showCoachmark({
            name: 'sign-language-coachmark',
            closable: false,
            icon: '',
            title: ``,
            content: content[this.sliRole],
            subtext: null,
            reference: this.$refs.btn_si,
            placement: `top`,
            button: null,
            theme: 'dark',
          })
      })
    }
  },
  destroyed() {
    this.$eventBus.$off('open-cc');
    this.$eventBus.$off('close-all-panels');
  },
  watch: {
    chatPanelVisible(val) {
      if(val){
        const lst = this.chatMsgList.map(msg => {
          msg.unread = false
          return msg
        })
        this.$store.commit("chatMsgList", lst);
      }
    },
    windowsSizeChanged() {
      requestAnimationFrame(() => {
        this.checkCollision();
      });
    },
    breakoutSessionEnabled() {
      requestAnimationFrame(() => {
        this.checkCollision();
      });
    },
    fullscreen(newVal) {
      if (newVal) {
        if (this.plistPanelVisible) {
          this.$store.commit("plistPanelPopouted", true);
        }
        if (this.chatPanelVisible) {
          this.$store.commit("chatPanelPopouted", true);
        }
        if (this.contentPanelVisible) {
          this.$store.commit("contentPanelPopouted", true);
        }
        if (this.appsPanelVisible) {
          this.$store.commit("appsPanelPopouted", true);
        }
        this.$store.commit('fullscreenControlPinned', false);
        // this.slideDown();

      } else {
        if (this.plistPanelVisible) {
          this.$store.commit("plistPanelPopouted", false);
        }
        if (this.chatPanelVisible) {
          this.$store.commit("chatPanelPopouted", false);
        }
        if (this.contentPanelVisible) {
          this.$store.commit("contentPanelPopouted", false);
        }
        if (this.appsPanelVisible) {
          this.$store.commit("appsPanelPopouted", false);
        }
        this.$store.commit('fullscreenControlPinned', true);
      }

      let cnt = 0;
      let itv = setInterval(() => {
        cnt++;
        this.checkCollision();
        if (cnt > 5) {
          clearInterval(itv);
          }
      }, 20)
    },
  },
  methods: {

    mouseover() {
      this.isopen = true;
      clearTimeout(this.hoverItv);
    },
    mouseleave() {
      this.hoverItv = setTimeout(() => {this.slideDown()}, 300);
    },
    slideDown() {
      this.isopen = false;
    },

    togglePin() {
      if (this.fullscreenControlPinned) {
        this.disabled = true;
        this.slideDown();
        setTimeout(() => {
          this.disabled = false;
        }, 1000);
      }
      this.$store.commit('fullscreenControlPinned', !this.fullscreenControlPinned);
    },
    delayShowAssistant() {
      this.tmo_showAssistant = setTimeout(() => {
        this.showAssistant()
      }, 500)
    },
    clearShowAssistantTimeout() {
      clearTimeout(this.tmo_showAssistant)
    },
    showAssistant() {
      if (!this.popAssistantVisible) {
        this.$popper.show(
          popWbxAssistant, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_assistant,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            options: {placement: 'top'},
          }, // popper props
          {
            opened: () => {this.popAssistantVisible = true},
            closed: () => {this.popAssistantVisible = false},
          } // popper eventlistener
        );
      }
    },

    toggleCaption() {
      this.$store.commit('closedCaptionEnabled', !this.closedCaptionEnabled);
    },
    showCaptionOption() {
      if (!this.captionOptionVisible) {
        this.$popper.show(
          popCaptionOption, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_caption_option,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            options: {
              placement: 'top-start', 
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [-40, 4],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => {this.captionOptionVisible = true},
            closed: () => {this.captionOptionVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    toggleActivity() {

      if (!this.appsPanelVisible) {
        this.openApps();
      } else {
        this.$store.commit('appsPanelVisible', false);
      }
    },
    togglePlist() {
      if (!this.plistPanelVisible) {
        this.openPlist();
      } else {
        this.$store.commit('plistPanelVisible', false);

      }
    },
    toggleChat() {
      if (!this.chatPanelVisible) {
        this.openChat();
      } else {
        this.$store.commit('chatPanelVisible', false);
      }
    },
    toggleContent() {
      if (!this.contentPanelVisible) {
        this.openContent();
      } else {
        this.$store.commit('contentPanelVisible', false);
      }
    },
    hideAllPanels(){
      if (!this.plistPanelPopouted) {
        this.$store.commit('plistPanelVisible', false);
      }
      if (!this.chatPanelPopouted) {
        this.$store.commit('chatPanelVisible', false);
      }
      if (!this.contentPanelPopouted) {
        this.$store.commit('contentPanelVisible', false);
      }
      if (!this.appsPanelPopouted) {
        this.$store.commit('appsPanelVisible', false);
      }
      if (!this.ccPanelPopouted) {
        this.$store.commit('ccPanelVisible', false);
      }
      if (!this.inMeetingGptPanelPopouted) {
        this.$store.commit('inMeetingGptPanelVisible', false);
      }

      this.$store.commit('shareStagePanelVisible', false);

    },
    openApps() {
      this.hideAllPanels();

      this.$store.commit('appsPanelVisible', true);
      this.$emit('openpanel', 'apps');
      if (this.stageMaximized) {
        this.$store.commit('appsPanelPopouted', true);
      }
    },
    openPlist() {
      this.hideAllPanels();

      this.$store.commit('plistPanelVisible', true);
      this.$emit('openpanel', 'plist');
      if (this.stageMaximized) {
        this.$store.commit('plistPanelPopouted', true);
      }
    },
    openChat() {
      this.hideAllPanels();

      this.$store.commit('chatPanelVisible', true);
      this.$emit('openpanel', 'chat');
      if (this.stageMaximized) {
        this.$store.commit('chatPanelPopouted', true);
      }
    },
    openContent() {
      this.hideAllPanels();

      this.$store.commit('contentPanelVisible', true);
      this.$emit('openpanel', 'content');
      if (this.stageMaximized) {
        this.$store.commit('contentPanelPopouted', true);
      }
    },

    openCC() {
      this.hideAllPanels();

      this.$store.commit('ccPanelVisible', true);
      this.$emit('openpanel', 'cc');
      if (this.stageMaximized) {
        this.$store.commit('ccPanelPopouted', true);
      }
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
            theme: `${opt.theme} webex`,
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

    bringToFront() {
      this.$popper.hide('sign-language-coachmark');
      requestAnimationFrame(() => {
        this.$window.bringToFront(this.signLanguageWindowName)
      })
    },
    toggleSi() {
      if (!this.siPopperVisible) {
        let comp = this.sliRole !== 'sli' ? popSiSettings : popSiSettingsSign
        this.$popper.show(
          comp,
          {
            meetingId: this.meetingId,
            width: this.sliRole !== 'sli' ? '340px' : '280px',
          }, // component props
          {
            reference: this.$refs.btn_si,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            options: {
              placement: 'top', 
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 4],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => {this.siPopperVisible = true},
            closed: () => {this.siPopperVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    
    checkCollision() {
      if (this.donotShowLabel) {
        this.showLabel = false
        return
      }
      //const wrapRect = this.$refs.controlwrap.getBoundingClientRect();
      //const leaveRect = document.querySelector('#main-controls-meet .btn_x').getBoundingClientRect();

      //if (this.allControlsLabelVisible && (wrapRect.right - leaveRect.right > 80 + 130 + 80 + 50)) {
      //  this.showLabel = true;
      //} else {
        this.showLabel = false;
      //}
    },
  }
};
</script>

<style lang="scss">
#controls-wrap {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  user-select: none;
  transition: all 0.2s ease-out;

  &.disabled {
    pointer-events: none;
  }

  .abs {
    position: absolute;
  }


  .group_btn_left {
    position: absolute;
    left: 0;
    margin-left: 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .gbtn {
      @include flex;

      &:not(:last-of-type) {
        margin-right: 8px;
      }

      .lft {
        @include flex(row, flex-end);
        width: 40px;
        height: 40px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        padding-right: 4px;
      }
      .rgt {
        @include flex(row, flex-start);
        width: 28px;
        height: 40px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        padding-left: 4px;
      }

      .half:hover{
        background-color: rgba($color: #FFF, $alpha: .07);
      }
      .half:active,
      .half.active {
        background-color: rgba($color: #FFF, $alpha: .2);
      }
    }

    .ai-off {
      height: 24px;
      width: 24px;
      background: url(~@/assets/img/ai-bot-off.svg) no-repeat center;
      background-size: 24px 24px;
    }
    .ai {
      height: 24px;
      width: 24px;
      background: url(~@/assets/img/ai-bot.svg) no-repeat center;
      background-size: 24px 24px;
    }
  }


  .group_btn_right {
    right: 0;
    margin-right: 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .gbtn:not(:first-of-type) {
      margin-left: 8px;
    }

  }
  .group_btn {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
    min-width: 40px;
    overflow: hidden;
    box-sizing: border-box;

    .gbtn{
      position: relative;
      height: 100%;
      min-width: 40px;
      border-radius: 20px;
      display: flex;
      flex-direction: row;
      cursor: default;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;

      &:hover{
        background-color: rgba($color: #000000, $alpha: .07);
      }
      &:active,
      &.active{
        background-color: rgba($color: #000000, $alpha: .2);
      }

      &.nohover:hover, &.nohover:active{
        background-color: transparent !important;
      }

      .tt{
        font-size: 15px;
        font-weight: 600;
        margin-left: 6px;
      }
      .unread {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        margin-left: 10px;
        color: #FFF;
        font-size: 12px;
        background: $md-red-60;
      }
      .reddot {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $md-red-60;
      }

      svg path {
        fill: black;
      }
    }

    .padding {
      padding: 10px;
    }
    
  }
  

  .clsbg {
    position: absolute;
    background-color: rgba($color: $md-gray-10, $alpha: 1);
    left: 0px;
    width: 100%;
    height: 100%;

    .clshandle {
      position: absolute;
      background-color: rgba($color: $md-gray-10, $alpha: 1);
      width: 96px;
      height: 16px;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      left: calc((100% + 5px - 96px) / 2);
      top: -16px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: default;
    }

    &:hover {
      opacity: 1;
    }

    &.unpin {
      background-color: rgba($color: white, $alpha: .6);

      .clshandle {
        background-color: rgba($color: white, $alpha: .6);
      }
    }
  }
  
  &.slidedown {
    margin-bottom: -60px;

    .clsbg {
      opacity: 1;
    }
  }
  &:hover {
    margin-bottom: 0px;

    .clsbg{
      opacity: 1;
    }
  }


  /* ------------------ drak/hybrid ------------------ */
  &.dark,
  &.hybrid {
    .group_btn .gbtn {

      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .07);
      }
      &:active,
      &.active {
        background-color: rgba($color: #FFFFFF, $alpha: .2);
      }

      svg path {
        fill: white;
      }
    }

    .clsbg {
      background-color: rgba($color: $md-gray-95, $alpha: .9);
    }
    .clsbg .clshandle {
      background-color: rgba($color: $md-gray-95, $alpha: .9);
    }

  }

  
  
}


</style>
