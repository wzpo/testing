<template>
    <div id="menu-video" :class="[theme]">
        <div v-if="menuVideoName !== me.name" class='section' >
          <div class='grp' >

            <div v-if="pinVisible && (!sliEnabled || sliEnabled && signLanguageVideoPosition == 'after-selfvideo')" class='itm' @click="togglePin" >
              <wl-icon class="ico" :name="!pin ? 'pin-bold' : 'pin-muted-bold'" size="16" />
              <span class="lb" >{{!pin ? 'Move to the stage' : 'Remove from the stage'}}</span>
            </div>
            
            <div class='itm'>
              <wl-icon class="ico" name="chat-bold" size="16" />
              <span class="lb" >Chat</span>
            </div>

            <div v-if="peopleList.length > 2" class='itm' >
              <wl-icon class="ico" name="recurring-bold" size="16" />
              <span class="lb" >Reorder</span>
            </div>
            <div class='itm'>
              <wl-icon class="ico" name="contact-card-bold" size="16" />
              <span class="lb" >View People Insights profile</span>
            </div>
            <div v-if="isSign" class='itm' @click="togglePop" >
              <wl-icon class="ico" :name="signLanguageVideoPosition == 'floating' ? 'pop-in-bold' : 'pop-out-bold'" size="16" />
              <span class="lb" >{{signLanguageVideoPosition == 'floating' ? 'Show with others' : 'Pop out window'}}</span>
            </div>

          </div>

        </div>

        <div class='section' v-if="menuVideoName === me.name">
          <div class='grp' >

            <div 
              v-if="meetingType === 'webex' && !selfSharing && selfVideoWithOthers && pinVisible" 
              class='itm' 
              @click="togglePin" 
            >
              <wl-icon class="ico" :name="!pin ? 'pin-bold' : 'pin-muted-bold'" size="16" />
              <span class="lb" >{{!pin ? 'Move to the stage' : 'Remove from the stage'}}</span>
            </div>

            <div class='itm' @click="showPopSettings('vbg')" >
              <svg class="ico" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.25 3.25L2.75 14.75C2.33579 15.1642 1.66421 15.1642 1.25 14.75C0.835787 14.3358 0.835786 13.6642 1.25 13.25L12.75 1.75C13.1642 1.33579 13.8358 1.33579 14.25 1.75C14.6642 2.16421 14.6642 2.83579 14.25 3.25Z" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linejoin="round"/>
              <path d="M0.5 7H2.5" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linecap="round"/>
              <path d="M1.5 6L1.5 8" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linecap="round"/>
              <path d="M5 2H8" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linecap="round"/>
              <line x1="6.5" y1="0.5" x2="6.5" y2="3.5" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linecap="round"/>
              <path d="M11 11.5H15" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linecap="round"/>
              <path d="M13 9.5V13.5" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linecap="round"/>
              </svg>
              <span class="lb" >Change virtual background...</span>
            </div>

            <div class='itm' >
              <svg class="ico" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0.5L8 15.5" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linecap="round"/>
              <path d="M5.5 11.5V4.5L0.5 11.5H5.5Z" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linejoin="round"/>
              <path d="M10.5 11.5V4.5L15.5 11.5H10.5Z" :stroke="theme==='dark' ? 'white' : 'black'" stroke-linejoin="round"/>
              </svg>
              <span class="lb" >Mirror my video</span>
            </div>

            <div v-if="!selfVideoWithOthers" class='itm' @click="toggleAutoHideSelfVideo">
              <wl-icon class="ico" name="video-layout-video-dominant-bold" size="16" />
              <span class="lb" >{{!autoHideSelfVideo ? 'Automatically hide my self view' : 'Always show my self view'}}</span>
            </div>

            <div v-if="selfSharing" class='itm' @click="toggleImmersiveShare">
              <span class="ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :fill="theme === 'dark' ? 'white' : 'black'" fill-rule="evenodd" clip-rule="evenodd" d="M7.06152 15L7.32352 13.95C7.51952 13.17 8.21752 12.625 9.02152 12.625H12.9785C13.7825 12.625 14.4805 13.17 14.6765 13.951L14.9385 15H7.06152ZM10.9995 7C12.2745 7 13.3125 8.037 13.3125 9.313C13.3125 10.588 12.2745 11.625 10.9995 11.625C9.72552 11.625 8.68752 10.588 8.68752 9.313C8.68752 8.037 9.72552 7 10.9995 7ZM15.9765 15.029L15.6455 13.708C15.3695 12.601 14.4465 11.801 13.3395 11.655C13.9405 11.056 14.3125 10.227 14.3125 9.313C14.3125 7.486 12.8265 6 10.9995 6C9.17352 6 7.68752 7.486 7.68752 9.313C7.68752 10.227 8.06052 11.056 8.66152 11.655C7.55452 11.801 6.63152 12.601 6.35352 13.707L6.02252 15.03C5.96452 15.266 6.01752 15.51 6.16652 15.7C6.31552 15.891 6.53952 16 6.78152 16H15.2185C15.4605 16 15.6845 15.891 15.8335 15.7C15.9825 15.51 16.0355 15.266 15.9765 15.029Z" />
                  <path :stroke="theme === 'dark' ? 'white' : 'black'" d="M5 13H2.5C1.39543 13 0.5 12.1046 0.5 11V4.5C0.5 3.39543 1.39543 2.5 2.5 2.5H13.5C14.6046 2.5 15.5 3.39543 15.5 4.5V8" stroke-linecap="round"/>
                </svg>
              </span>
              <span class="lb" >Show me in front of presentation</span>
              <wl-icon
                v-if="immersiveVideoVisible"
                name="check-bold" 
                size="12"
                class="ico blue"
              />
            </div>

            <div class='itm' @click="showPopSettings('video')" >
              <wl-icon class="ico" name="settings-bold" size="16" />
              <span class="lb" >Camera settings...</span>
            </div>
            

            <div v-if="selfViewOption === 2 && meetingType === 'webex' && !selfSharing" class='itm' ref="menu-item-self-view-option" @click="handleSelviewOption" >
              <wl-icon class="ico" name="video-layout-video-dominant-bold" size="16" />
              <span class="lb" >Self-view location</span>
              <wl-icon class="icoarr" :name="'arrow-right-bold'" size="16" />
            </div>

            <div v-if="selfViewOption === 1 && meetingType === 'webex' && !selfSharing" class='itm' ref="menu-item-self-view-option" @click="showPopSettings('selfview')" >
              <wl-icon class="ico" name="video-layout-video-dominant-bold" size="16" />
              <span class="lb" >Self-view...</span>
            </div>
            

          </div>

        </div>

    </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    meetingId: {
      type: String,
      default: 'webex-meeting',
    },
    menuVideoName: null,
    isSign: {
      type: Boolean,
    },
  },
  data() {
    return {
      selfviewSubmenuOptions:[
        'Show my self view in the grid',
        'Show my self view in a floating window',
        'Hide my self view',
      ],
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
    selfSharing() {
      return this.$store.state.selfSharing;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    peopleSI() {
      return this.$store.state.peopleSI;
    },
    maximizeVideo() {
      return this.$store.state.maximizeVideo;
    },
    selfVideoWithOthers() {
      return this.$store.state.selfVideoWithOthers;
    },
    donotShowMySelf() {
      return this.$store.state.donotShowMySelf;
    },
    selfViewOption() {
      return this.$store.state.selfViewOption;
    },
    autoHideSelfVideo() {
      return this.$store.state.autoHideSelfVideo;
    },
    me(){
      return this.$store.getters.me
    },
    videoLayout(){
      return this.$store.getters.videoLayout(this.meetingId);
    },
    meetingType(){
      return this.$store.getters.meetingType(this.meetingId)
    },
    hidePeopleWithoutVideo(){
      return this.$store.state.hidePeopleWithoutVideo;
    },
    videoItemSortIndex(){
      return this.$store.state.videoItemSortIndex;
    },
    videoInStageSortIndex(){
      return this.$store.state.videoInStageSortIndex;
    },
    maxVideoInStage(){
      return this.$store.state.maxVideoInStage;
    },
    activeSpeakerName(){
      return this.$store.state.activeSpeakerName;
    },
    activeSpeakerInStage(){
      return this.$store.state.activeSpeakerInStage;
    },
    pin() {
      if (this.videoLayout === 'grid') {
        return false;
      }
      const p = this.$store.getters.people(this.menuVideoName);
      return p ? p.pin : false;
    },
    activeSpeaker() {
      return this.$store.getters.activeSpeaker;
    },
    pinnedPeopleList() {
      let plst = this.peopleList.filter((p) => {
        return p.pin >= 0;
      })
      return plst;
    },
    stagePeopleList() {
      if (this.pinnedPeopleList.length > 0) {
        return this.pinnedPeopleList;
      } else {
        return [this.activeSpeaker];
      }
    },
    inStage() {
      if (this.videoLayout !== 'stage') {
        return false;
      }
      for (let i = 0; i < this.stagePeopleList.length; i++) {
        const p = this.stagePeopleList[i];
        if (p.name ===  this.menuVideoName) {
          return true;
        }
      }
      return false;
    },
    pinVisible() {
      if (this.peopleList.length < 3) {
        return false;
      }
      if (!this.pin && this.stagePeopleList.length === this.maxVideoInStage) {
        return false;
      }
      if (this.activeSpeaker.name === this.menuVideoName && this.pinnedPeopleList.length === 0 && this.videoLayout === 'stage') {
        return false;
      }
      return true;
    },
    firstVideo() {
      const idx = this.peopleListIdx[this.menuVideoName];
      if (Number(idx) === 0) {
        return true;
      }
      return false;
    },
    peopleListIdx() {
      return this.$store.state.peopleListIdx;
    },
    immersiveShare(){
      return this.$store.state.immersiveShare;
    },
    immersiveVideoVisible(){
      return this.$store.state.immersiveVideoVisible;
    },
    meetingOptionsList(){
      return this.$store.state.meetingOptionsList;
    },
    sliEnabled(){
      return this.$store.state.sliEnabled;
    },
    signLanguageVideoPosition(){
      return this.$store.state.signLanguageVideoPosition;
    },
    signLanguageWindowName(){
      return this.$store.state.signLanguageWindowName;
    },
    
  },
  mounted() {},
  watch: {
  },
  methods: {
    move2front() {
      this.close();
      let sid = this.videoItemSortIndex+1;
      this.$store.commit('videoItemSortIndex', sid);

      let peopleList = this.peopleList;
      peopleList.sort((a, b) => {
          if (a.sort > b.sort) {
            return -1;
          } else if (a.sort < b.sort) {
            return 1;
          }
        }
      );

      let plist = [];
      let maxsid = sid;
      const len = peopleList.length;
      for (let i = 0; i < len; i++) {
          const p = peopleList[i];
          if (p.name === this.menuVideoName) {
            p.sort = maxsid;
          } else {
            sid--;
            p.sort = sid;
          }
          plist.push(p);
      }

      // data saved sort by index
      plist.sort((a, b) => {
          if (a.index > b.index) {
            return 1;
          } else if (a.index < b.index) {
            return -1;
          }
        }
      );

      this.$store.commit('peopleList', plist);
    },

    togglePin(){
      this.close();

      let pid = this.videoInStageSortIndex-1;
      this.$store.commit('videoInStageSortIndex', pid);

      if (!this.pin) {
        if (this.menuVideoName !== this.activeSpeakerName || this.videoLayout === 'stage-sharing') {
          let plist
          let len

          plist = []
          len = this.peopleList.length;
          for (let i = 0; i < len; i++) {
              const p = this.peopleList[i];
              if (p.name === this.menuVideoName) {
                  p.pin = pid;
              }
              plist.push(p);
          }
          this.$store.commit('peopleList', plist);

          ///
          plist = []
          len = this.peopleSI.length;
          for (let i = 0; i < len; i++) {
              const p = this.peopleSI[i];
              if (p.name === this.menuVideoName) {
                  p.pin = pid;
              }
              plist.push(p);
          }
          this.$store.commit('peopleSI', plist);

        } else {
          this.$store.commit("activeSpeakerInStage", true);
        }
        if (this.videoLayout === 'grid') {
          var optlist = _.cloneDeep(this.meetingOptionsList)
          var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
          optlist[idx].videoLayout = 'stage'
          this.$store.commit('meetingOptionsList', optlist)
        }

      } else {
        let plist
        let len

        plist = []
        len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.name === this.menuVideoName) {
                p.pin = undefined;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

        ///
        plist = []
        len = this.peopleSI.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleSI[i];
            if (p.name === this.menuVideoName) {
                p.pin = undefined;
            }
            plist.push(p);
        }
        this.$store.commit('peopleSI', plist);
      }

    },
    toggleMaximize(){
      this.close();
      if (this.maximizeVideo) {
          this.$store.commit('maximizeVideo', null);
      } else {
          this.$store.commit('maximizeVideo', this.$store.getters.people(this.menuVideoName));
      }
    },

    toggleSelfInGrid(){
      this.$store.commit("selfVideoWithOthers", !this.selfVideoWithOthers);
      this.close();
    },
    handleSelviewOption(){
      this.$popper.show(
        {
          template: `
            <div class="sub-menulist" style="width:312px;">
              <div v-for="(itm, idx) in selfviewSubmenuOptions"
                :key="idx"
                class='sub-menulist-item' 
                @click="save(idx)"
              >
                <span class="lb">{{itm}}</span>

                <wl-icon
                  v-if="
                    (!donotShowMySelf && selfVideoWithOthers && idx === 0) ||
                    (!donotShowMySelf && !selfVideoWithOthers && idx === 1) ||
                    (donotShowMySelf && idx === 2)
                  " 
                  name="check-bold" 
                  size="14"
                  color="blue-40"
                  class="ico"
                />

              </div>
            </div>
          `,
          props: ['parentComp', 'os', 'theme', 'selfviewSubmenuOptions', 'donotShowMySelf', 'selfVideoWithOthers'],
          methods: {
            save(idx) {
              if (idx === 0) {
                this.$store.commit('selfVideoWithOthers', true);
                this.$store.commit('donotShowMySelf', false);
              } else if (idx === 1) {
                this.$store.commit('selfVideoWithOthers', false);
                this.$store.commit('donotShowMySelf', false);
              } else if (idx === 2) {
                this.$store.commit('donotShowMySelf', true);
              }

              this.$notify({
                group: 'default',
                text: `Your self-view option has been saved.`,
                data: {
                  icon: `info-circle-bold`,
                  button1Text: this.os=== 'mac' ? `View preferences` : 'View settings',
                  button1Click: () => { this.parentComp.showPopSettings('selfview') },
                  click: () => { },
                },
                duration: 5000,
              });
              
              this.$popper.hideAll();
            },
          }
        },
        {
          parentComp: this,
          os: this.os,
          theme: this.theme,
          selfVideoWithOthers: this.selfVideoWithOthers,
          donotShowMySelf: this.donotShowMySelf,
          selfviewSubmenuOptions: this.selfviewSubmenuOptions,
        }, // component props
        {
          name: 'self-view-submenu',
          reference: this.$refs['menu-item-self-view-option'],
          closeTrigger: 'mousedown',
          arrowVisible: false,
          roundedCorner: true,
          frameless: false,
          borderRadius: '4px',
          appendToBody: true,
          theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
          options: {
            placement: 'right', 
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [30, -13],
                },
              },
            ],
          },
          affiliatedElementSelector: ['.menu-video'],
        }, // popper props
        {
        } // popper eventlistener
      );
      
    },

    toggleAutoHideSelfVideo(){
      this.$store.commit("autoHideSelfVideo", !this.autoHideSelfVideo);
      this.close();
    },

    showPopSettings(type) {
      this.$store.commit("popSettingsType", type);
      this.$store.commit("popSettingsVisible", true);
      this.close();
    },

    toggleImmersiveShare() {
      this.$store.commit("immersiveVideoVisible", !this.immersiveVideoVisible);
      this.close();
    },

    togglePop() {
      if (this.signLanguageVideoPosition == 'floating') {
        this.$store.commit("signLanguageVideoPosition", 'after-selfvideo')
        this.$window.hide(this.signLanguageWindowName)
      } else {
        this.$store.commit("signLanguageVideoPosition", 'floating')
      }

      this.close();
    },
    
    close() {
      this.$emit('close');
    },
  }
};
</script>

<style lang="scss">
#menu-video {
  pointer-events: auto;

  margin-top: 6px;
  margin-bottom: 6px;

  .section {
    width: 100%;
  }

  .itm{
    height: 32px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
  

    .bold{
      font-weight: 600;
    }
    .indent{
      margin-left: 12px;
    }
    &:hover{
      background: $md-gray-10;
    }
    &.disabled{
      color: $md-gray-40;
      pointer-events: none;
    }

    .lb{
      flex-grow: 1;
      font-size: 14px;
      pointer-events: none;
      padding-left: 8px;
      margin-right: 10px;
    }
    .lb .sub{
      font-size: 12px;
      color: $md-gray-60;
    }

    .ico.r180 {
      transform: rotate(180deg);
      transform-origin: 50%;
    }
  }

  .divider-t{
      border-top: 1px solid #EEE;
  }

  .blue path{
    fill: $md-blue-60;
  }



  /* ------------------ drak ------------------ */
  &.hybrid {
    color: $text-color-primary-light-ui;
  }

  &.dark {
    color: $text-color-primary-dark-ui;

    .divider-t{
      border-top: 1px solid $md-gray-80;
    }
    .itm:hover{
      background: $md-gray-90;
    }
    .itm.disabled{
        color: $text-color-disabled-dark-ui;
    }

    .blue path{
      fill: $md-blue-40;
    }
  }
  
}



.sub-menulist {
  background-color: rgba($color: #000000, $alpha: 0.05);

  &-item {
    height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
    padding-left: 12px;

    .lb {
      flex-grow: 1;
      font-size: 14px;
    }

    .ico {
      margin-right: 12px;

      path {
        fill: $md-blue-60;
      }
    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: .07);
    }
    &:active {
      background-color: rgba($color: #000000, $alpha: .2);
    }
  }
}

.dark {
  .sub-menulist {
    background-color: rgba($color: #000000, $alpha: 0.5);

    &-item {

      .ico {
        path {
          fill: $md-blue-40;
        }
      }
      
      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .07);
      }
      &:active {
        background-color: rgba($color: #FFFFFF, $alpha: .2);
      }
    }
  }
}



</style>
