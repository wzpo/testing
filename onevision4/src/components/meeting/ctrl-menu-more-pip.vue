<template>
    <div
    id="ctrl_menu_more_pip"
    :class="[theme]"
    >
        <div class='grp' >

          <div class='itm'>
            <wl-icon name="chat-bold" size="16" />
            <span class="lb" >Chat</span>
          </div>

        </div>

        <div class="divider"></div>

        <div class='grp' >

          <div class='itm' @click="openRecorder" >
            <wl-icon name="record-bold" size="16" />
            <span class="lb" >Recorder</span>
          </div>

          <div class='itm'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.99976 1C6.61529 1 5.26191 1.41054 4.11077 2.17971C2.95962 2.94888 2.06242 4.04213 1.5326 5.32122C1.00279 6.6003 0.864165 8.00777 1.13426 9.36563C1.40436 10.7235 2.07104 11.9708 3.05001 12.9497C4.02898 13.9287 5.27626 14.5954 6.63413 14.8655C7.99199 15.1356 9.39946 14.997 10.6785 14.4672C11.9576 13.9373 13.0509 13.0401 13.82 11.889C14.5892 10.7378 14.9998 9.38447 14.9998 8C14.9977 6.14412 14.2595 4.36485 12.9472 3.05255C11.6349 1.74025 9.85564 1.00208 7.99976 1ZM7.99976 14C6.81307 14 5.65303 13.6481 4.66634 12.9888C3.67964 12.3295 2.91061 11.3925 2.45648 10.2961C2.00236 9.19974 1.88354 7.99334 2.11505 6.82946C2.34656 5.66557 2.918 4.59647 3.75712 3.75736C4.59623 2.91824 5.66533 2.3468 6.82922 2.11529C7.9931 1.88378 9.1995 2.0026 10.2959 2.45672C11.3922 2.91085 12.3293 3.67988 12.9886 4.66658C13.6479 5.65327 13.9998 6.81331 13.9998 8C13.998 9.59077 13.3653 11.1159 12.2405 12.2407C11.1156 13.3656 9.59052 13.9983 7.99976 14Z" fill="white" fill-opacity="0.95"/>
            <path d="M7.58472 4.58691C7.24333 4.93069 7.03865 5.38691 7.00884 5.87048C6.97903 6.35405 7.12614 6.83196 7.42272 7.21506L6.04809 8.65576L4.64574 10.062C4.59937 10.1085 4.56261 10.1637 4.53756 10.2243C4.51251 10.285 4.49966 10.3501 4.49975 10.4157C4.49984 10.4814 4.51287 10.5464 4.53809 10.607C4.56331 10.6676 4.60022 10.7227 4.64673 10.769L5.58862 11.708C5.77635 11.8949 6.0305 11.9997 6.29537 11.9995C6.56025 11.9993 6.81424 11.8941 7.00171 11.707L7.70679 11.0019C7.79975 10.909 7.87348 10.7987 7.92375 10.6772C7.97401 10.5558 7.99984 10.4256 7.99975 10.2942C7.99966 10.1628 7.97364 10.0326 7.9232 9.91128C7.87276 9.78991 7.79888 9.67968 7.70579 9.58689L7.10935 8.99229L8.21159 7.83708C8.46029 7.94453 8.72833 7.99996 8.99925 7.99998H9.00071C9.32957 7.99978 9.65331 7.91849 9.94324 7.76329C10.2332 7.6081 10.4804 7.38379 10.6629 7.11025C10.8455 6.83671 10.9577 6.52237 10.9898 6.19508C11.0218 5.86778 10.9727 5.53764 10.8466 5.23388C10.7206 4.93013 10.5216 4.66214 10.2673 4.45366C10.013 4.24517 9.71115 4.10262 9.38858 4.03864C9.06601 3.97466 8.73263 3.99122 8.41798 4.08685C8.10334 4.18248 7.81713 4.35425 7.58472 4.58691ZM6.29468 11L5.70679 10.4141L6.41089 9.70801L6.99976 10.2949L6.29468 11ZM9.70679 6.70703C9.61429 6.80023 9.5042 6.87412 9.38291 6.92441C9.26162 6.9747 9.13155 7.0004 9.00024 7H8.99924C8.83499 6.99983 8.67332 6.95918 8.52851 6.88166C8.38371 6.80413 8.26025 6.69211 8.16904 6.55551C8.07783 6.41891 8.0217 6.26194 8.00559 6.09848C7.98949 5.93502 8.01392 5.77012 8.07672 5.61835C8.13952 5.46657 8.23876 5.33262 8.36565 5.22833C8.49254 5.12404 8.64318 5.05263 8.80424 5.02041C8.9653 4.9882 9.13182 4.99617 9.28907 5.04363C9.44631 5.09109 9.58944 5.17656 9.70578 5.2925L9.70628 5.293C9.79927 5.38576 9.87305 5.49594 9.9234 5.61724C9.97376 5.73855 9.9997 5.86859 9.99975 5.99993C9.99979 6.13127 9.97394 6.26132 9.92367 6.38266C9.8734 6.504 9.79971 6.6142 9.70679 6.70703Z" fill="white" fill-opacity="0.95"/>
            </svg>

            <span class="lb" >Lock meeting</span>
            <md-toggle-switch label="" htmlId="lock-meeting" class="toggle-switch-m" @change="toggleLock" :checked="meetingLocked"></md-toggle-switch>
          </div>

          <div class='itm'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 11.6249H11.875V9.99988C11.875 9.90043 11.8355 9.80505 11.7652 9.73472C11.6948 9.66439 11.5994 9.62488 11.5 9.62488C11.4005 9.62488 11.3051 9.66439 11.2348 9.73472C11.1645 9.80505 11.125 9.90043 11.125 9.99988V11.6249H9.49999C9.40053 11.6249 9.30515 11.6644 9.23482 11.7347C9.1645 11.805 9.12499 11.9004 9.12499 11.9999C9.12499 12.0993 9.1645 12.1947 9.23482 12.265C9.30515 12.3354 9.40053 12.3749 9.49999 12.3749H11.125V13.9999C11.125 14.0993 11.1645 14.1947 11.2348 14.265C11.3051 14.3354 11.4005 14.3749 11.5 14.3749C11.5994 14.3749 11.6948 14.3354 11.7652 14.265C11.8355 14.1947 11.875 14.0993 11.875 13.9999V12.3749H13.5C13.5994 12.3749 13.6948 12.3354 13.7652 12.265C13.8355 12.1947 13.875 12.0993 13.875 11.9999C13.875 11.9004 13.8355 11.805 13.7652 11.7347C13.6948 11.6644 13.5994 11.6249 13.5 11.6249Z" fill="white" fill-opacity="0.95"/>
            <path d="M8.94286 13.9799C6.38475 14.3822 3.49901 13.9403 2.36961 12.975C2.22184 12.8667 2.10055 12.7262 2.01488 12.5643C1.92921 12.4023 1.88138 12.223 1.87499 12.0399C1.87499 9.51112 4.22215 7.37489 6.99999 7.37489C8.18251 7.37477 9.33218 7.76394 10.2715 8.48231C10.3105 8.51267 10.3552 8.53502 10.4028 8.54808C10.4505 8.56113 10.5003 8.56464 10.5494 8.55839C10.5984 8.55214 10.6458 8.53626 10.6886 8.51167C10.7315 8.48708 10.7691 8.45425 10.7993 8.41508C10.8295 8.3759 10.8516 8.33115 10.8644 8.2834C10.8773 8.23565 10.8805 8.18583 10.874 8.13682C10.8675 8.0878 10.8514 8.04055 10.8266 7.99778C10.8018 7.95501 10.7688 7.91756 10.7295 7.88759C10.122 7.42395 9.43268 7.07873 8.69754 6.86995C9.26351 6.50371 9.69587 5.96427 9.93008 5.33213C10.1643 4.7 10.1878 4.00907 9.99711 3.36248C9.80641 2.71588 9.41173 2.1483 8.87197 1.74443C8.3322 1.34056 7.67631 1.12208 7.00218 1.12158C6.32805 1.12109 5.67184 1.33861 5.13148 1.74168C4.59113 2.14475 4.19561 2.71176 4.00396 3.35807C3.81231 4.00438 3.8348 4.69534 4.06809 5.32782C4.30138 5.9603 4.73294 6.50038 5.29837 6.86745C2.91284 7.55855 1.125 9.64757 1.125 12.0399C1.13189 12.3312 1.2034 12.6174 1.33437 12.8778C1.46534 13.1381 1.65249 13.3661 1.88232 13.5453C2.96776 14.473 5.04444 14.8734 7.01219 14.8734C7.69739 14.8753 8.38171 14.8244 9.05907 14.7211C9.10774 14.7134 9.15443 14.6963 9.19647 14.6706C9.23851 14.645 9.27509 14.6113 9.30411 14.5714C9.33313 14.5316 9.35402 14.4865 9.36559 14.4386C9.37717 14.3907 9.3792 14.341 9.37157 14.2924C9.36394 14.2437 9.3468 14.197 9.32112 14.155C9.29545 14.1129 9.26174 14.0763 9.22193 14.0473C9.18213 14.0183 9.13699 13.9974 9.08911 13.9858C9.04122 13.9743 8.99153 13.9722 8.94286 13.9799ZM4.62499 4.24987C4.62499 3.78014 4.76428 3.32096 5.02525 2.93039C5.28622 2.53982 5.65714 2.23541 6.09112 2.05566C6.52509 1.8759 7.00262 1.82887 7.46333 1.92051C7.92403 2.01215 8.34722 2.23834 8.67937 2.57049C9.01152 2.90264 9.23771 3.32583 9.32935 3.78653C9.42099 4.24724 9.37396 4.72477 9.1942 5.15874C9.01444 5.59272 8.71004 5.96364 8.31947 6.22461C7.9289 6.48558 7.46972 6.62487 6.99999 6.62487C6.37032 6.62416 5.76665 6.37371 5.32141 5.92847C4.87616 5.48322 4.62571 4.87954 4.62499 4.24987Z" fill="white" fill-opacity="0.95"/>
            </svg>

            <span class="lb" >Add participants</span>
          </div>

          <div class='itm'>
            <wl-icon name="closed-captions-bold" size="16" />

            <span class="lb" >Closed captions</span>
            <md-toggle-switch label="" htmlId="cc" class="toggle-switch-m" :checked="$store.state.closedCaptionEnabled"></md-toggle-switch>
          </div>

          <div class='itm itm48' >
            <wl-icon name="empty" size="16" />

            <div class="rgt">
              <span class="lb1" >Spoken language</span>
              <span class="lb2" >English</span>
            </div>
            <wl-icon name="arrow-right-bold" size="16" />
          </div>

          <div class='itm itm48' >
            <wl-icon name="empty" size="16" />

            <div class="rgt">
              <span class="lb1" >Caption language</span>
              <span class="lb2" >English</span>
            </div>
            <wl-icon name="arrow-right-bold" size="16" />
          </div>


          <div class='itm'>
            <wl-icon name="media-quality-good-bold" size="16" />
            <span class="lb" >Health Checker</span>
          </div>

          <div class='itm' @click="openInMeetingSettings">
            <wl-icon name="settings-bold" size="16" />
            <span class="lb" >Preferences</span>
          </div>

        </div>
    </div>
</template>

<script>

import popInMeetingSettings from './pop-inmeeting-settings.vue'
import ctrlPopRecord from "./ctrl-pop-record.vue";

export default {
  data() {
    return {
      settingMenuType: '',
      copiedVisible: false,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    os() {
      return this.$store.state.os;
    },
    audioConnected() {
      return this.$store.state.audioConnected;
    },
    audioType() {
      return this.$store.state.audioType;
    },
    meetingLocked() {
      return this.$store.state.meetingLocked;
    },
    devicePaired() {
      return this.$store.state.devicePaired;
    },
    devicePairedName() {
      return this.$store.state.devicePairedName;
    },
    streamingIsOn() {
      return this.$store.state.streamingIsOn;
    },

  },
  mounted() {},
  watch: {

  },
  methods: {

    toggleLock(evt) {
      this.$store.commit("meetingLocked", evt.target.checked);
    },

    openInMeetingSettings() {
      this.close();
      this.$modal.show(
        popInMeetingSettings, 
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
          width: 660,
          height: 400,
        }, // modal props
        {
        } // modal eventlistener
      );
    },

    openRecorder() {
      this.close();
      this.$modal.show(
        ctrlPopRecord, 
        {
          headerVisible: true,
        }, // component props
        {
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          draggable: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          roundedCorner: this.os === 'mac',
          width: 280,
        }, // modal props
        {
        } // modal eventlistener
      );
    },

    close() {
      this.$emit("close");
    },

  }
};
</script>

<style lang="scss">
#ctrl_menu_more_pip {
  width: 280px;
  pointer-events: auto;

  margin-top: 8px;
  margin-bottom: 8px;

  .grp {
    margin: 0 8px 8px 8px;
  }
  .grp .tt{
    margin: 8px 0 3px 14px;
    display: flex;
    align-items: center;
  }
  .grp .tt .lb{
    flex-grow: 1;
    opacity: .7;
    font-weight: 600;
    font-size: 14px;
  }

  .itm{
    transition: all 0.2s ease-out;
    width: 100%;
    height: 40px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 8px;
    padding: 0 15px;

    &.itm48 {
      height: 48px;
    }

    svg path {
      fill: black;
    }

    .lb{
      font-size: 16px;
      pointer-events: none;
      margin-left: 12px;
      flex-grow: 1;
      opacity: .95;
    }

    .rgt {
      @include flex(column, flex-start, flex-start);
      flex-grow: 1;
      margin-left: 12px;

      .lb1 {
        font-size: 14px;
        opacity: .7;
        line-height: 22px;
      }
      .lb2 {
        opacity: .95;
        line-height: 24px;
        margin-top: -2px;
      }
    }

    &:hover {
      background: rgba($color: #000000, $alpha: 0.1);
    }
    &:active {
      background: rgba($color: #000000, $alpha: 0.2);
    }
  }
  
  .copied {
    margin: 0;
  }

  .divider{
    margin: 0 0 4px 0;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .2);
  }
  

  /* ------------------ drak ------------------ */

  &.hybrid {
    color: $text-color-primary-light-ui;
  }

  &.dark {
    color: $text-color-primary-dark-ui;

    .tt {
      color: $text-color-disabled-light-ui;
    }

    .itm {
      svg path {
        fill: white;
      }
      
      &:hover {
        background: rgba($color: #FFFFFF, $alpha: 0.1);
      }
      &:active {
        background: rgba($color: #FFFFFF, $alpha: 0.2);
      }
    }


    .divider{
      border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: .2);
    }
  }
  

}
</style>
