<template>
  <div class="browser edge">
    <div class="browser-header">
      <div class="title">
        <div v-if="browserIcon" class="favico" :class="browserIcon"></div>
        <span class="lb">{{ browserTitle }}</span>
      </div>
      <wl-hot :rect="{ x: 1324, y: 2, w: 38, h: 28 }" @click.native="close" />
    </div>
    <div class="browser-tools">
      <div v-if="icodownloadVisible" class="icodownload" @click="showDownloadHistory">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 1.54688C9.13035 1.54687 7.30269 2.10129 5.74813 3.14001C4.19357 4.17874 2.98194 5.65511 2.26646 7.38245C1.55097 9.10978 1.36377 11.0105 1.72852 12.8442C2.09327 14.6779 2.99359 16.3623 4.31564 17.6844C5.63768 19.0064 7.32206 19.9067 9.15579 20.2715C10.9895 20.6362 12.8902 20.449 14.6176 19.7335C16.3449 19.0181 17.8213 17.8064 18.86 16.2519C19.8987 14.6973 20.4531 12.8697 20.4531 11C20.4503 8.49374 19.4535 6.09094 17.6813 4.31875C15.9091 2.54655 13.5063 1.5497 11 1.54688ZM11 19.4219C9.33432 19.4219 7.70603 18.9279 6.32106 18.0025C4.93609 17.0771 3.85664 15.7618 3.21921 14.2229C2.58177 12.684 2.41499 10.9907 2.73995 9.35697C3.06491 7.72329 3.86702 6.22266 5.04484 5.04484C6.22266 3.86701 7.72329 3.06491 9.35698 2.73995C10.9907 2.41499 12.684 2.58177 14.2229 3.2192C15.7618 3.85663 17.0771 4.93609 18.0025 6.32106C18.9279 7.70603 19.4219 9.33431 19.4219 11C19.4194 13.2329 18.5313 15.3736 16.9524 16.9524C15.3736 18.5313 13.2329 19.4194 11 19.4219Z"
            fill="#0F0F0F" />
          <path
            d="M13.3856 10.6356L11.5156 12.5056V8.25C11.5156 8.11325 11.4613 7.9821 11.3646 7.8854C11.2679 7.7887 11.1368 7.73438 11 7.73438C10.8633 7.73438 10.7321 7.7887 10.6354 7.8854C10.5387 7.9821 10.4844 8.11325 10.4844 8.25V12.5056L8.61438 10.6356C8.567 10.5857 8.5101 10.5457 8.44703 10.5181C8.38396 10.4905 8.316 10.4758 8.24716 10.4749C8.17833 10.474 8.11 10.4869 8.04622 10.5128C7.98244 10.5387 7.9245 10.5771 7.8758 10.6258C7.82711 10.6745 7.78865 10.7324 7.7627 10.7961C7.73676 10.8599 7.72384 10.9282 7.72472 10.9971C7.72559 11.0659 7.74025 11.1339 7.76781 11.197C7.79538 11.26 7.8353 11.317 7.88522 11.3644L10.6352 14.1144C10.7319 14.2111 10.8631 14.2654 10.9998 14.2654C11.1365 14.2654 11.2677 14.2111 11.3644 14.1144L14.1144 11.3644C14.2055 11.2666 14.255 11.1373 14.2527 11.0038C14.2503 10.8702 14.1962 10.7427 14.1017 10.6483C14.0073 10.5538 13.8798 10.4997 13.7462 10.4973C13.6127 10.495 13.4834 10.5445 13.3856 10.6356Z"
            fill="#0F0F0F" />
          <path
            d="M22 5C22 2.79086 20.2091 1 18 1C15.7909 1 14 2.79086 14 5C14 7.20914 15.7909 9 18 9C20.2091 9 22 7.20914 22 5Z"
            fill="#557DA1" />
        </svg>
      </div>
    </div>
    <wl-scrollbar ref="scrollpane" class="scrollpane" :alwaysVisible="false" :arrowVisible="$store.state.os === 'win'"
      :theme="theme === 'dark' ? 'dark' : 'light'">
      <div class="list" ref="scrollcontent">

        <div v-if="isVisible('homepage')" :class="[`page`, `page-${'homepage'}`]">
          <img src="~@/components/onboarding/img/tmp-onboarding-1-001.png" />
          <md-button class="btn md-button-solid2 btn-58 " aria-label="x" style="left:1097px; top:52px;"
            @click="go2Page('signup')">Sign Up, It's Free</md-button>
        </div>

        <div v-if="isVisible('signup')" :class="[`page`, `page-${'signup'}`]">
          <img src="~@/components/onboarding/img/tmp-onboarding-1-002.png" />
          <wl-hot :rect="{ x: 799, y: 380, w: 55, h: 48 }" @click.native="go2Page('google')" />
        </div>

        <div v-if="isVisible('google')" :class="[`page`, `page-${'google'}`]">
          <img src="~@/components/onboarding/img/tmp-onboarding-1-003.png" />
          <wl-hot :rect="{ x: 553, y: 324, w: 298, h: 33 }" @click.native="() => { go2Page('setupaccount'); setupAccound(); }" />
        </div>

        <div v-if="isVisible('setupaccount')" :class="[`page`, `page-${'setupaccount'}`]">
          <img src="~@/components/onboarding/img/tmp-onboarding-1-004.png" />
          <div class="pgbar">
            <div class="bar" :style="{ width: `${setupaccountPercent}%` }"></div>
          </div>
        </div>

        <div v-if="isVisible('download')" :class="[`page`, `page-${'download'}`]">
          <img src="~@/components/onboarding/img/tmp-onboarding-1-005.png" />
          <wl-hot :rect="{ x: 580, y: 616, w: 203, h: 34 }" @click.native="() => { go2Page('downloaded') }" />
        </div>

        <div v-if="isVisible('downloaded')" :class="[`page`, `page-${'downloaded'}`]">
          <img class="bg" src="~@/components/onboarding/img/tmp-onboarding-1-006.png" />
          <img v-if="!installerVisible && !installed" class="downloadbar"
            src="~@/components/onboarding/img/tmp-onboarding-1-downloadbar.svg" />
          <span class="subtxt" :class="{ lower: installerVisible || installed }">
            Download not working? <span class="text-link">Restart download</span> or <span class="text-link">use the web
              app</span> instead.
          </span>
          <wl-hot v-if="!installerVisible && !installed" :rect="{ x: 3, y: 726, w: 167, h: 54 }" @click.native="() => { startInstall() }" />

          <div v-show="installerVisible" class="installer">
            <div v-if="installer == 1" class="ico ico1"> </div>
            <div v-if="installer == 2" class="ico ico2"> </div>
            <div v-if="installer == 3" class="ico ico3"> </div>
            <div class="rgt">
              <div class="tt">{{ installerLabel }}</div>
              <div class="pgbar">
                <div class="bar" :style="{ width: `${installerPercent}%` }"></div>
              </div>

            </div>

          </div>

          <div v-show="eulaVisible" class="eula">
            <wl-hot :rect="{ x: 66, y: 530, w: 176, h: 36 }"
              @click.native="() => { eulaVisible = false; openSigninWindow(); }" />
          </div>

        </div>

        <userhub v-show="isVisible('userhub')" :class="[`page`]" :defaultNav="defaultUserhubNav"
          :settingsHasCalling="settingsHasCalling">
        </userhub>

        <wl-hot :rect="{ x: 0, y: 0, w: 22, h: 22 }" @click.native="openTeams" />
      </div>
    </wl-scrollbar>
  </div>
</template>
  
<script>

import userhub from './userhub';

export default {
  components: {
    userhub,
  },
  props: {
    defaultPage: {
      type: String,
      default: 'homepage',
    },
    defaultUserhubNav: {
      type: String,
    },
    settingsHasCalling: {
      type: Boolean,
    },
  },
  data() {
    return {
      browserTitle: 'Video Conferencing, Cloud Call',
      browserIcon: 'webex',
      currentPage: null,
      icodownloadVisible: false,
      installer: 1,
      installerVisible: false,
      installerPercent: 1,
      installerLabel: '',
      itv: null,
      installed: false,
      eulaVisible: false,
      setupaccountPercent: 1,
    };
  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted() {
    this.currentPage = this.defaultPage
    this.$eventBus.$on('download-icon-visible', this.setDownloadIcon)
  },
  beforeDestroy() {
    this.$eventBus.$off('download-icon-visible', this.setDownloadIcon)
  },
  watch: {

  },
  methods: {
    openTeams() {
      this.downloadHistoryVisible = false

      this.$eventBus.$emit('open-team-window', {
        teamsNav: 'meetings',
        teamsNavExpanded: true,
        meetingButtonsCollapsed: false,
        isFTE: true,
        calendarMeetingsConnected: false,
      }, {

      });
    },

    isVisible(page) {
      return this.currentPage === page
    },
    setDownloadIcon(v) {
      this.icodownloadVisible = v
    },
    showDownloadHistory() {
      this.$eventBus.$emit('show-download-history')
    },
    go2Page(page, title, icon) {
      console.log(page)
      this.currentPage = page
      if (title) {
        this.browserTitle = title
      }
      if (title) {
        this.browserIcon = icon
      }

      if (page === 'userhub') {
        this.$eventBus.$emit('prepare-account')
      }
    },
    close() {
      this.$emit('close')
    },


    setupAccound() {
      this.setupaccountPercent = 1
      this.itv = setInterval(() => {
        if (this.setupaccountPercent < 100) {
          this.setupaccountPercent++
        } else {
          clearInterval(this.itv)
          this.go2Page('download')
        }
      }, 20)
    },

    startInstall() {
      this.installerVisible = true
      this.installerPercent = 1
      this.installerLabel = 'Downloading Webex...'
      this.itv = setInterval(() => {
        if (this.installerPercent < 100) {
          this.installerPercent++
        } else if (this.installerPercent == 100 && this.installer < 3) {
          this.installerPercent = 0
          this.installer++
          if (this.installer == 2) {
            this.installerLabel = 'Installing Webex...'
          } else if (this.installer == 3) {
            this.installerLabel = 'Opening Webex...'
          }
        } else {
          clearInterval(this.itv)
          this.installerVisible = false
          this.eulaVisible = true
          this.installed = true
        }
      }, 20)
    },

    openSigninWindow() {
        this.$eventBus.$emit('open-signin-window', {
          defaultPage: 'page-signing-in',
          gotoAfterSignIn: 'teams',
          closeAfterSignIn: true,
          teamsOption: {
            teamsNav: 'meetings',
            teamsNavExpanded: true,
            meetingButtonsCollapsed: true,
            isFTE: true,
            calendarMeetingsConnected: false,
          },
        });
    },
    
  },
};
</script>
  
<style lang="scss" scoped>
.browser {

  &.edge {
    width: 1366px;
    height: 860px;
    background: url(~@/components/onboarding/img/browser-edge-1366x860@x2.png) no-repeat 0 0;
    background-size: 1366px 860px;
    box-sizing: border-box;
    pointer-events: auto;

    .browser-header {
      position: absolute;
      width: 100%;
      height: 32px;
      user-select: none;

      .title {
        @include flex(row, flex-start);
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 180px;
        height: 30px;
        padding-left: 10px;
        color: black;
        flex-shrink: 1;

        .favico {
          @include flex;
          width: 16px;
          height: 16px;
          margin-right: 8px;
          flex-shrink: 0;

          &.webex {
            background: url(~@/assets/icon/webex_logo.svg) no-repeat center center;
            background-size: contain;
          }
        }

        .lb {
          @include flex(row, flex-start);
          font-size: 12px;
        }
      }


    }

    .browser-tools {
      position: absolute;
      width: 100%;
      height: 48px;
      top: 32px;

      .icodownload {
        position: absolute;
        @include flex;
        width: 22px;
        height: 22px;
        right: 185px;
        top: 12px;
      }
    }

    .scrollpane {
      position: absolute;
      width: 1364px;
      height: 782px;
      left: 01px;
      top: 78px;
      overflow-x: hidden;

      .list {
        @include flex;
        position: relative;
        width: 100%;

        .page {
          position: relative;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 0 0;
          min-height: 782px;
          width: 100%;

          img {
            position: relative;
            width: 1366px;
            object-fit: cover;
          }

          .btn {
            position: absolute;
          }
        }

        .page-homepage {
          .btn-58 {
            position: absolute;
            height: 58px;
            width: 180px;
            border-radius: 29px;
            font-size: 16px;
          }
        }

        .page-setupaccount {

          .pgbar {
            position: absolute;
            top: 410px;
            left: 500px;
            width: 360px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;

            .bar {
              position: absolute;
              height: 4px;
              border-radius: 2px;
              background: #9E9EA2;
            }
          }
        }

        .page-downloaded {

          .downloadbar {
            position: absolute;
            bottom: 0;
            left: 0
          }

          .subtxt {
            @include flex;
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 80px;
            font-size: 14px;

            &.lower {
              bottom: 30px;
            }

            .text-link {
              margin: 0 4px;
            }
          }
        }

        .installer {
          @include flex;
          padding-top: 28px;
          position: absolute;
          width: 500px;
          height: 180px;
          left: calc((100% - 500px)/2);
          top: calc((100% - 126px)/2);
          background-image: url(~@/components/onboarding/img/joinbylink-win-installer.svg);
          background-position: 0 0;
          background-repeat: no-repeat;

          .ico {
            width: 72px;
            height: 72px;
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: 72px 72px;
            margin-right: 12px;
          }

          .ico1 {
            background-image: url(~@/components/onboarding/img/joinbylink-ico-01-72.gif);
          }

          .ico2 {
            background-image: url(~@/components/onboarding/img/joinbylink-ico-02-72.gif);
          }

          .ico3 {
            background-image: url(~@/components/onboarding/img/joinbylink-ico-03-72.gif);
          }

          .rgt {
            @include flex(column, flex-start, flex-start);

            .tt {
              font-weight: 700;
              font-size: 16px;
              margin-bottom: 12px;
            }

            .pgbar {
              position: relative;
              width: 280px;
              height: 4px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 2px;

              .bar {
                position: absolute;
                height: 4px;
                border-radius: 2px;
                background: #64B4FA;
              }
            }
          }
        }

        .eula {
          @include flex;
          position: absolute;
          width: 500px;
          height: 660px;
          left: calc((100% - 500px)/2);
          top: calc((100% - 620px)/2);
          background-image: url(~@/components/onboarding/img/joinbylink-win-EULA.png);
          background-position: 0 0;
          background-repeat: no-repeat;
          background-size: calc(996px/2) calc(1304px/2);
        }
      }
    }

    &.sharing_app_border {
      border: 5px solid $md-orange-60;
    }
  }



  @media only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-device-pixel-ratio: 2) {}
}</style>
  