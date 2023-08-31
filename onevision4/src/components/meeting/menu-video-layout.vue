<template>
    <div
    id="menu-video-layout"
    ref="popover"
    :class="[theme]"
    >
      <div class='grp' >
        <div class='itmhead'>Layout</div>

        <div class="cols">
          <div class='colitm ' :class="{active: videoLayout === 'grid' && !sceneSyncing}" v-if="$store.getters.currentSharingInStage(meetingId) === 0" @click="switchTo('grid')">
            <wl-icon class="ico" name="video-layout-equal-bold" size="28" v-if="videoLayout !== 'grid'" />
            <wl-icon class="fill" name="video-layout-equal-filled" size="28" v-if="videoLayout === 'grid'" />

            <span class="lb" >Grid</span>
          </div>

          <div class='colitm ' :class="{active: videoLayout !== 'grid' && videoStripDockSide === 'T' && !sceneSyncing}" @click="() => {switchTo($store.getters.currentSharingInStage(meetingId) > 0 ? 'stage-sharing' : 'stage', 'T');}">
            <wl-icon class="ico" name="video-layout-stack-bold" size="28" v-if="videoLayout === 'grid' || videoStripDockSide !== 'T'" />
            <wl-icon class="fill" name="video-layout-stack-filled" size="28" v-if="videoLayout !== 'grid' && videoStripDockSide === 'T'" />

            <span class="lb" >Stack</span>
          </div>
          
          <div class='colitm ' :class="{active: videoLayout !== 'grid' && videoStripDockSide === 'R' && !sceneSyncing}" @click="() => {switchTo($store.getters.currentSharingInStage(meetingId) > 0 ? 'stage-sharing' : 'stage', 'R');}">
            <wl-icon class="ico" name="layout-side-by-side-vertical-bold" size="28" v-if="videoLayout === 'grid' || videoStripDockSide !== 'R'" />
            <wl-icon class="fill" name="layout-side-by-side-vertical-filled" size="28" v-if="videoLayout !== 'grid' && videoStripDockSide === 'R'" />

            <span class="lb" >Side by side</span>
          </div>
        </div>


        <div class='itm common-menulist-item' @click="openScene">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.3228 32.9168V35.1006L18.3574 36.066C18.256 36.1679 18.2564 36.3328 18.3583 36.4342C18.4599 36.5353 18.6241 36.5353 18.7257 36.4342L19.7674 35.3926C19.8162 35.3437 19.8436 35.2775 19.8437 35.2084V32.9168C19.844 32.6005 20.1003 32.3442 20.4166 32.3438H21.6666C21.9829 32.3442 22.2392 32.6005 22.2395 32.9168V35.2084C22.2395 35.2775 22.267 35.3437 22.3158 35.3926L23.2712 36.348C23.5358 36.6119 23.964 36.6119 24.2286 36.348L26.8507 33.7259C26.8995 33.677 26.927 33.6108 26.927 33.5418V27.9168C26.9279 27.1405 27.557 26.5114 28.3332 26.5105H30.8332C31.6095 26.5114 32.2386 27.1405 32.2395 27.9168V32.9168C32.2395 33.5208 32.7292 34.0105 33.3332 34.0105C33.9373 34.0105 34.427 33.5208 34.427 32.9168V30.4168C34.427 30.1004 34.6835 29.8438 34.9999 29.8438C35.3163 29.8438 35.5728 30.1004 35.5728 30.4168V34.7918C35.5728 34.8608 35.6003 34.927 35.6491 34.9759L37.1074 36.4342C37.2094 36.5357 37.3742 36.5353 37.4757 36.4333C37.5768 36.3318 37.5768 36.1676 37.4757 36.066L36.0937 34.6839V30.4168C36.0937 29.8127 35.604 29.323 34.9999 29.323C34.3958 29.323 33.9062 29.8127 33.9062 30.4168V32.9168C33.9062 33.2332 33.6496 33.4897 33.3332 33.4897C33.0168 33.4897 32.7603 33.2332 32.7603 32.9168V27.9168C32.7591 26.853 31.897 25.9909 30.8332 25.9897H28.3332C27.2694 25.9909 26.4073 26.853 26.4062 27.9168V33.4339L23.8604 35.9797C23.7994 36.0407 23.7005 36.0407 23.6395 35.9798C23.6395 35.9797 23.6395 35.9797 23.6394 35.9797L22.7603 35.1006V32.9168C22.7596 32.313 22.2703 31.8237 21.6666 31.823H20.4166C19.8128 31.8237 19.3236 32.313 19.3228 32.9168Z" fill="url(#paint0_linear_1096_81086)" stroke="url(#paint1_linear_1096_81086)" stroke-width="0.5"/>
            <path d="M31.6667 13.5938C34.5719 13.5938 36.9271 11.2386 36.9271 8.33338C36.9271 5.42814 34.5719 3.07297 31.6667 3.07297C28.7614 3.07297 26.4062 5.42814 26.4062 8.33338C26.4095 11.2373 28.7628 13.5905 31.6667 13.5938ZM31.6667 3.5938C34.2843 3.5938 36.4062 5.71578 36.4062 8.33338C36.4062 10.951 34.2843 13.073 31.6667 13.073C29.0491 13.073 26.9271 10.951 26.9271 8.33338C26.9301 5.71704 29.0503 3.59682 31.6667 3.5938Z" fill="url(#paint2_linear_1096_81086)" stroke="url(#paint3_linear_1096_81086)" stroke-width="0.5"/>
            <path d="M39.1666 37.6564H16.6666C15.4303 37.655 14.4284 36.6531 14.427 35.4168V29.1668C14.4274 28.8505 14.6837 28.5942 15 28.5939H15.4166C18.0905 28.5909 20.2574 26.424 20.2604 23.7501V18.3334C20.2604 17.2691 19.3976 16.4064 18.3333 16.4064C17.269 16.4064 16.4062 17.2691 16.4062 18.3334V23.7501C16.4056 24.2964 15.9629 24.7391 15.4166 24.7397H14.427V13.1251C14.427 11.6006 13.1912 10.3647 11.6666 10.3647C10.1421 10.3647 8.90621 11.6006 8.90621 13.1251V20.4168C8.90621 20.9633 8.46316 21.4064 7.91663 21.4064C7.37009 21.4064 6.92704 20.9633 6.92704 20.4168V18.3334C6.92704 17.2691 6.06426 16.4064 4.99996 16.4064C3.93566 16.4064 3.07288 17.2691 3.07288 18.3334V20.4168C3.07587 23.0907 5.24274 25.2575 7.91663 25.2605H8.33329C8.64957 25.2608 8.90589 25.5172 8.90621 25.8334V35.4168C8.90483 36.6531 7.90294 37.655 6.66663 37.6564H0.833293C0.689468 37.6564 0.572876 37.7729 0.572876 37.9168C0.572876 38.0606 0.689468 38.1772 0.833293 38.1772H6.66663C8.19042 38.1754 9.42526 36.9406 9.42704 35.4168V25.8334C9.42631 25.2297 8.93705 24.7404 8.33329 24.7397H7.91663C5.53027 24.737 3.59643 22.8031 3.59371 20.4168V18.3334C3.59371 17.5568 4.22331 16.9272 4.99996 16.9272C5.77661 16.9272 6.40621 17.5568 6.40621 18.3334V20.4168C6.40621 21.2509 7.08245 21.9272 7.91663 21.9272C8.7508 21.9272 9.42704 21.2509 9.42704 20.4168V13.1251C9.42704 11.8882 10.4297 10.8855 11.6666 10.8855C12.9035 10.8855 13.9062 11.8882 13.9062 13.1251V24.7397H13.3333C12.9169 24.7382 12.5361 24.9746 12.3527 25.3484C12.1596 25.7625 12.2365 26.2968 12.5147 26.6002C12.725 26.8296 13.0558 26.9221 13.3361 26.9268C13.9392 26.9262 14.4276 26.437 14.427 25.8339C14.427 25.8338 14.427 25.8336 14.427 25.8334V25.2605H15.4166C16.2504 25.2596 16.9262 24.5839 16.927 23.7501V18.3334C16.927 17.5568 17.5566 16.9272 18.3333 16.9272C19.1099 16.9272 19.7395 17.5568 19.7395 18.3334V23.7501C19.7368 26.1365 17.803 28.0703 15.4166 28.073H15C14.3962 28.0738 13.9069 28.563 13.9062 29.1668V35.4168C13.908 36.9406 15.1428 38.1754 16.6666 38.1772H39.1666C39.3104 38.1772 39.427 38.0606 39.427 37.9168C39.427 37.7729 39.3104 37.6564 39.1666 37.6564ZM13.9062 25.8334C13.907 26.0517 13.783 26.2513 13.587 26.3474C13.3179 26.5022 12.9742 26.4096 12.8194 26.1405C12.7195 25.967 12.7195 25.7533 12.8194 25.5797C12.9154 25.3837 13.115 25.2597 13.3333 25.2605H13.9062V25.8334Z" fill="url(#paint4_linear_1096_81086)" stroke="url(#paint5_linear_1096_81086)" stroke-width="0.5"/>
            <defs>
            <linearGradient id="paint0_linear_1096_81086" x1="27.9166" y1="25.9897" x2="27.9166" y2="36.5459" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3CC29A"/>
            <stop offset="1" stop-color="#93C437"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1096_81086" x1="27.9166" y1="25.9897" x2="27.9166" y2="36.5459" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3CC29A"/>
            <stop offset="1" stop-color="#93C437"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1096_81086" x1="31.6667" y1="3.07297" x2="31.6667" y2="13.5938" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3CC29A"/>
            <stop offset="1" stop-color="#93C437"/>
            </linearGradient>
            <linearGradient id="paint3_linear_1096_81086" x1="31.6667" y1="3.07297" x2="31.6667" y2="13.5938" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3CC29A"/>
            <stop offset="1" stop-color="#93C437"/>
            </linearGradient>
            <linearGradient id="paint4_linear_1096_81086" x1="20" y1="10.3647" x2="20" y2="38.1772" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3CC29A"/>
            <stop offset="1" stop-color="#93C437"/>
            </linearGradient>
            <linearGradient id="paint5_linear_1096_81086" x1="20" y1="10.3647" x2="20" y2="38.1772" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3CC29A"/>
            <stop offset="1" stop-color="#93C437"/>
            </linearGradient>
            </defs>
          </svg>

          <span class="lb" style="margin-left:10px;">Scene</span>
          <wl-icon class="ico" name="arrow-right-filled" size="16" />
        </div>

      </div>

      
      <div v-if="videoLayout === 'grid'" class='divider-b' style="margin-bottom: 12px;"></div>
      <div v-if="videoLayout === 'grid'" class='grp' >
        <div class='itmhead'>Grid Size</div>

        <video-zoom-slider :meetingId="meetingId"/>

      </div>


      <div class='divider-b' ></div>

      <div class='grp' >
        <div class='itmhead'>Options</div>

        <div class='itm common-menulist-item'>
          <span class="lb" >Full-screen view</span>
          <md-toggle-switch label="" htmlId="fsv" class="toggle-switch-m" :checked="fullscreen" @change="toggleFullscreen"></md-toggle-switch>
        </div>

        <div class='itm common-menulist-item'>
          <span class="lb" >People focus</span>
          <md-toggle-switch label="" htmlId="adply" class="toggle-switch-m" :checked="gridViewPeopleFocus" @change="toggleGridViewPeopleFocus"></md-toggle-switch>
        </div>
        <div class='itm common-menulist-item'>
          <span class="lb" >Hide participants without video</span>
          <md-toggle-switch label="" htmlId="spwv" class="toggle-switch-m" :checked="hidePeopleWithoutVideo" @change="toggleShowVideoOnly"></md-toggle-switch>
        </div>

        <!--div class='itm common-menulist-item disabled'>
          <span class="lb" >Lock attendee view on stage only</span>
          <md-toggle-switch label="" htmlId="cccc32434" class="toggle-switch-m" :checked="false" ></md-toggle-switch>
        </div-->

        <div class='itm common-menulist-item'>
          <span class="lb" >Automatically hide names</span>
          <md-toggle-switch label="" htmlId="ahn" class="toggle-switch-m" :checked="videosNameVisible === 'auto'" @change="toggleAutoNames"></md-toggle-switch>
        </div>
        <!--
        <div class='itm common-menulist-item'>
          <span class="lb" >Names in videos</span>
          <wl-icon class="ico" name="arrow-right-filled" size="16" />
        </div>
        -->

        <!--div class='divider-b short' v-if="videoLayout !== 'grid'"></div-->

        <!--
        <div class='itmhead' v-if="videoLayout !== 'grid'">
          Stage
          <div class="ico" @click="showGuideLayout" v-tooltip="{ content: 'Stage is a special area. Let\'s try to customize <br>your stage! Click to learn more.'}" >
            <wl-icon name="info-circle-bold" size="12" />
          </div>
        </div>
        -->

        <!--div class='itm common-menulist-item' v-if="videoLayout !== 'grid'">
          <span class="lb" >Sync my stage for everyone</span>
          <md-toggle-switch label="" htmlId="smswm" class="toggle-switch-m" :checked="stageSyncing" @change="toggleSyncStage" ></md-toggle-switch>
        </div-->

        <!--div class='itm common-menulist-item' v-if="videoLayout !== 'grid'">
          <span class="lb" >Maximize stage</span>
          <md-toggle-switch label="" htmlId="ms" class="toggle-switch-m" :checked="stageMaximized" @change="toggleMax"></md-toggle-switch>
        </div-->

        <div class='itm common-menulist-item' v-if="videoLayout !== 'grid' && ($store.getters.currentSharingInStage(meetingId) > 0 || $store.getters.currentSharingInStage(meetingId) === 0 && (stagePeopleList.length > 0 || !activeSpeakerInStage))">
          <span class="lb" >Show active speaker in stage</span>
          <md-toggle-switch label="" htmlId="sasis" class="toggle-switch-m" :checked="activeSpeakerInStage" @change="toggleActiveSpeakerInStage" ></md-toggle-switch>
        </div>

      </div>

      <div class='divider-b' ></div>

      <div class='grp' >
        <div class='itmhead'>Advanced</div>

        <div class='itm common-menulist-item' ref="menu_item_share_stage" @click="openShareStage">
          <span class="lb" >Share my stage</span>
          <wl-icon class="ico" name="arrow-right-filled" size="16" />
        </div>

      </div>


    </div>
</template>

<script>

import _ from 'lodash';
import popscene from './pop-scene.vue';

export default {
  props: [
    'meetingId',
  ],
  data() {
    return {
      menuNameVisible: false,
      menuThemeVisible: false,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme === 'dark' ? 'dark' : 'light';
    },
    themeColor() {
      return this.$store.state.themeColor;
    },

    me(){
      return this.$store.getters.me
    },
    videoLayout(){
      return this.$store.getters.videoLayout(this.meetingId)
    },
    gridViewPeopleFocus(){
      return this.$store.state.gridViewPeopleFocus;
    },
    hidePeopleWithoutVideo(){
      return this.$store.state.hidePeopleWithoutVideo;
    },
    videoAndShareContentSwapped(){
      return this.$store.state.videoAndShareContentSwapped;
    },
    fullscreen(){
      return this.$store.state.fullscreen;
    },
    maximizeVideo(){
      return this.$store.state.maximizeVideo;
    },
    meetingOptionsList(){
      return this.$store.state.meetingOptionsList;
    },
    videoStripDockSide(){
      var meeting = this.meetingOptionsList.find(
        itm => itm.meetingId === this.meetingId
      );
      return meeting.videoStripDockSide;
    },
    activeSpeakerInStage(){
      return this.$store.state.activeSpeakerInStage;
    },
    stageSyncing(){
      return this.$store.state.stageSyncing;
    },
    sceneSyncing(){
      return this.$store.state.sceneSyncing;
    },
    stageMaximized(){
      return this.$store.state.stageMaximized;
    },
    videosNameVisible(){
      return this.$store.state.videosNameVisible;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    pinnedPeopleList() {
      let plst = this.peopleList.slice().filter((p) => {
          //return p.pin >= 0 || this.videoLayout === 'stage' && this.activeSpeakerInStage && p.name === this.activeSpeakerName;
          return p.pin >= 0;
        }
      )
      //if (this.videoLayout === 'stage' && this.activeSpeakerInStage && plst.length === 1 && plst[0].name === this.activeSpeakerName) {
      //  return [];
      //}
      return plst;
    },
    stagePeopleList() {
      if (this.pinnedPeopleList.length > 0 || this.videoLayout === 'stage-sharing') {
        return this.pinnedPeopleList;
      } else {
        return [];
      }
    },
    
  },
  mounted() {},
  watch: {

  },
  methods: {

    openShareStage() {
      this.$eventBus.$emit('close-all-panels');

      this.$store.commit("shareStagePanelVisible", true);
      this.$store.commit('sidePanelIsOpen', true);

      if (this.videoLayout !== 'stage-sharing') {
        var optlist = _.cloneDeep(this.meetingOptionsList)
        var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
        optlist[idx].videoLayout = 'stage'
        this.$store.commit('meetingOptionsList', optlist)
      }


      this.close();
    },

    openScene() {
      this.$modal.show(
        popscene, 
        {}, // component props
        {
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          draggable: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          roundedCorner: true,
          styles: {cornerRadius: '12px'},
          width: 996,
          height: 570,
        }, // modal props
        {
          closed: () => {}
        } // modal eventlistener
      );
      this.close();
    },

    showGuideLayout() {
      /*
      this.$modal.show(
        guideLayout, 
        {}, // component props
        {
          clickToClose: true,
          frameless: false,
          shadow: true,
          resizable: false,
          draggable: false,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          roundedCorner: true,
          styles: {cornerRadius: '12px'},
          width: 712,
          height: 494,
        }, // modal props
        {
          closed: () => { this.$store.commit("meetingWindowOverlayVisible", false); }
        } // modal eventlistener
      );
      this.$store.commit("meetingWindowOverlayVisible", true);
      this.close();
      */
    },

    toggleGridViewPeopleFocus(){
      this.$store.commit("gridViewPeopleFocus", !this.gridViewPeopleFocus);
      //this.close();
    },
    toggleShowVideoOnly(){
      this.$store.commit("hidePeopleWithoutVideo", !this.hidePeopleWithoutVideo);
      //this.close();
    },
    toggleAutoNames(){
      this.$store.commit("videosNameVisible", this.videosNameVisible === 'auto' ? 'show' : 'auto');
      //this.close();
    },
    
    toggleActiveSpeakerInStage(){
      this.$store.commit("activeSpeakerInStage", !this.activeSpeakerInStage);
      //this.close();
    },
    switchTo(name, side){
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      optlist[idx].videoLayout = name
      if(side) {
        optlist[idx].videoStripDockSide = side
      }
      this.$store.commit('meetingOptionsList', optlist)

      this.$store.commit("sceneSyncing", false);
      this.close();
    },

    toggleSyncStage() {
      this.$store.commit("stageSyncing", !this.stageSyncing);
      //this.close();
    },
    toggleFullscreen() {
      this.$store.commit('disableElementTransition', true);
      this.$store.commit("fullscreen", !this.fullscreen);
      this.close();
    },
    toggleMax() {
      this.$store.commit("stageMaximized", !this.stageMaximized);
      this.close();
    },
    closeSub() {
      if (this.menuThemeVisible) {
        this.$popper.hide('sub-menu-theme')
      }
    },
    close() {
      //this.$emit("close");
      this.$popper.hideAll();
    },
  }
};
</script>

<style lang="scss">
#menu-video-layout {
  color: $text-color-primary-light-ui;
  
  width: 344px;
  pointer-events: auto;

  margin-top: 6px;
  margin-bottom: 22px;
  user-select: none;

  .cols {
    display: flex;

    .colitm {
      font-size: 16px;
      width: 96px;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-radius: 6px;
      margin: 6px 0 15px 15px;

      .fill path {
        fill: $md-gray-100;
      }

      .lb {
        margin-top: 7px;
      }

      &:hover {
        background-color: $md-gray-05;
      }

      &.active {
        font-weight: 600;
        color: $md-blue-60;
        background-color: $md-gray-05;
        .fill path {
          fill: $md-blue-60;
        }
      }
    }
  }

  .itmhead {
    font-size: 14px;
    color: $md-gray-70;
    padding-left: 15px;
    display: flex;
    align-items: center;
    height: 32px;

    .ico {
      margin-left: 5px;
    }
  }

  .itm{
    height: 40px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    border-radius: 0;

    .bold{
      font-weight: 600;
    }
    .indent{
        margin-left: 12px;
    }
    &:hover,
    &.active {
        background: $md-gray-10;
    }
    &.disabled{
        pointer-events: none;
        opacity: .3;
    }

    .lb{
        font-size: 16px;
        pointer-events: none;
        flex-grow: 1;
    }
    .lb .sub{
        font-size: 14px;
        color: $md-gray-60;
    }
  }
  
  .divider-t {
      border-top: 1px solid #EEE;
  }
  .divider-b {
      border-bottom: 1px solid #EEE;
      margin-top: 12px;

      &.short {
        margin: 0 15px;
      }
  }



  /* ------------------ drak ------------------ */

  &.dark {
    color: $text-color-primary-dark-ui;

    .itmhead {
      color: $text-color-disabled-light-ui;
    }
    .divider-t{
      border-top: 1px solid $md-gray-80;
    }
    .divider-b{
      border-bottom: 1px solid $md-gray-80;
    }
    .itm:hover,
    .itm.active {
      background: $md-gray-90;
    }
    .tt {
      color: $text-color-disabled-light-ui;
    }
    .cols {
      .colitm {
        .fill path {
          fill: $md-gray-05;
        }
        &:hover {
          background-color: $md-gray-90;
        }
        &.active {
          &.active {
            color: $md-blue-40;
            background-color: $md-gray-90;
            .fill path {
              fill: $md-blue-40;
            }
          }
        }
      }
    }
  }
  

  
}




</style>
