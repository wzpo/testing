<template>
  <div id="teams-app" :class="[os, theme]" :style="{
    background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['app'][0]} 0%, ${themeColorList[theme][themeColor]['app'][1]} 100%)`
  }">
    <!--signin v-if="signinVisible && !dev" @signin="signIn" /-->

    <teams-header :active="active" @minimize="onMinimize" />
    <wl-alertbanner :show="teamsAlertbanner.visible" :icon="teamsAlertbanner.icon" :content="teamsAlertbanner.content"
      :button="teamsAlertbanner.button" :closeButtonVisible="teamsAlertbanner.closeButtonVisible" :narrow="twoColumnsMode"
      class="alertbanner" @close="closeAlertbanner" />
    <div v-if="!signinVisible || dev" class="teams-middle">
      <div class="teams-middle-nav">
        <team-nav />
      </div>

      <SplitGrid class="teams-middle-content" direction="column" sizeUnit="px" :snapOffset="0" :dragInterval="0"
        :gutterSize="4" :columnMinSizes="{ 2: 344 }">
        <SplitGridArea class="teams-middle-content-l" :transition="transition" :strictMode="false">
          <SplitGrid v-if="teamsNav === 'messaging'" class="teams-middle-split" direction="column" sizeUnit="px"
            :snapOffset="0" :dragInterval="0" :gutterSize="4" :columnMinSizes="{ 0: secondColumnMinWidth, 2: 450, 3: sidecarMinWidth }"
            @drag="onResizingColumn">
            <SplitGridArea class="teams-middle-midcol" sizeUnit="px" :sizeValue="secondColumnWidth"
              :transition="transition" :strictMode="false" :style="{
                background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`
              }">
              <team-2nd-column-message-header />
              <team-2nd-column-message />

            </SplitGridArea>

            <SplitGridGutter :show="!twoColumnsMode" class="vsg_gutter_v" :transition="transition" />

            <SplitGridArea :show="!twoColumnsMode" class="teams-content-column teams-middle-space">

              <team-space
                v-if="activeSpaceId && ([0, 1].indexOf(spaceListTabId) > -1 || spaceListTabId === 3 && !publicSpaceHomepageVisible)"
                :id="activeSpaceId" 
                :spaceName="activeSpace.name" 
                :isSpace="activeSpace.isSpace"
                :isFav="activeSpace.isFav"
                :isPersonal="activeSpace.isPersonal" 
                :team="activeSpace.team" 
                :teamColor="activeSpace.teamColor"
                :spaceSize="spaceSize" 
                :cover="activeSpace.cover" 
                :coverExpanded="activeSpace.coverExpanded"
                :statusTxt="activeSpace.statusTxt" 
                :people="activeSpace.people" 
                :content="activeSpace.content"
                :meetings="activeSpace.meetings" 
                :seenby="activeSpace.seenby" 
                :newRepliesButtonVisible="activeSpace.newRepliesButtonVisible" 
                :scrollY="activeSpace.scrollY" 
                :newRepliesScrollY="activeSpace.newRepliesScrollY" 
                />

              <team-spcae-public-home v-if="activeSpaceId && spaceListTabId === 3 && publicSpaceHomepageVisible" />

              <team-teams v-if="activeSpaceId && [2].indexOf(spaceListTabId) > -1" />

              <team-empty v-if="!activeSpaceId" />

            </SplitGridArea>

          </SplitGrid>

          <team-calling v-if="teamsNav === 'calling'" />
          <team-meetings v-if="teamsNav === 'meetings'" :collapsed="meetingButtonsCollapsed" />
          <panel-gpt v-if="teamsNav === 'webexgpt'" :meetingId="null" layout="fullsize" />

          <SplitGrid v-if="teamsNav === 'contacts'" class="teams-middle-split" direction="column" sizeUnit="px"
            :snapOffset="0" :dragInterval="0" :gutterSize="4" :columnMinSizes="{ 0: secondColumnMinWidth, 2: 350 }"
            @drag="onResizingColumn">
            <SplitGridArea class="teams-middle-midcol" sizeUnit="px" :sizeValue="secondColumnWidth"
              :transition="transition" :strictMode="false" :style="{
                background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`
              }">
              <team-2nd-column-contacts-header />
              <team-2nd-column-contacts @onchange="(e) => { activeContactItem = e }" />
            </SplitGridArea>

            <SplitGridGutter :show="!twoColumnsMode" class="vsg_gutter_v" :transition="transition" />

            <SplitGridArea :show="!twoColumnsMode" class="teams-content-column teams-middle-contacts"
              id="teams-middle-contacts">
              <team-contact-details :people="activeContactItem.name" />
            </SplitGridArea>
          </SplitGrid>

          <miro v-if="teamsNav === 'miro'" />

        </SplitGridArea>

        <SplitGridGutter :show="(teamsSidecarName != null && !gptPanelPopouted) || meetingsSidecarVisible && (teamsSidecarName != null || selectedMeeting && teamsNav == 'meetings')"
          class="vsg_gutter_v sidecar-slider" :transition="transition" />

        <SplitGridArea :show="(teamsSidecarName != null && !gptPanelPopouted) || meetingsSidecarVisible && (teamsSidecarName != null || selectedMeeting && teamsNav == 'meetings')"
          class="teams-middle-content-r sidecar" sizeUnit="px" :sizeValue="sidecarMinWidth" :transition="transition"
          :strictMode="false">

          <panel-gpt v-if="teamsSidecarName && !gptPanelPopouted && !meetingsSidecarVisible" :meetingId="null" :onloadFuncName="gptPanelOnloadFuncName"></panel-gpt>

          <team-meeting-details 
            v-if="meetingsSidecarVisible && selectedMeeting && teamsNav == 'meetings'"
            :selectedMeeting="selectedMeeting"
            :jumpto="selectedMeetingJumpto"
            :onClose="closeDetailsSidecar"
            :onPopout="() => {popoutMeetingDetails(selectedMeeting)}"
          />

        </SplitGridArea>
        
      </SplitGrid>

    </div>

    <div v-if="teamWindowOverlayRect" class="overlaybackground"
      :class="{ clipmask: teamWindowOverlayRect && teamWindowOverlayRect.clipmask }"
      :style="teamWindowOverlayRect ? teamWindowOverlayRect.clipmask : ''"></div>


  </div>
</template>

<script>
import _ from 'lodash';
import popCallWidget from './teams/pop-call-widget.vue';
import dialog from './shared/dialog.vue';
import coachmark from './shared/coachmark.vue'

export default {
  props: {
    active: { // data comes from Windows.vue, WindowsContainer.vue
      type: Boolean,
      default: true,
    },
    parentRect: { // data comes from Windows.vue, WindowsContainer.vue
      type: DOMRect
    },
    meetingButtonsCollapsed: {
      type: Boolean,
    },
  },
  data() {
    return {
      appRect: null,
      appSizeLastValue: {},
      secondColumnMinWidth: 280,
      secondColumnDefaultWidth: 356,
      secondColumnWidth: 320,
      secondColumnWidthLastValue: 0,
      sidecarMinWidth: 360,
      twoColumnsMode: false,
      spaceSize: 'normal',
      activeContactItem: {},
      activeCallingItem: {},
      callingfilter: 0,

      animation: {
        duration: 300, // 数值为0或者很小时，SplitGridArea的sizeValue改变后，grid宽度不会改变，有时间去查查源代码。不用animation也可以避免这个bug
        easing: "easeInOutQuint"
      },
      transition: {
        name: "slide-to-left",
        duration: 0
      },
      popCallWidgetVisible: {},
      widgetAutoOpened: false,
      callCounter: 1, //skip me

      dockSideX: null,
      dockSideY: null,
      widgetInDockingArea: true,
      widgetPrevW: null,
      widgetPrevH: null,
      prevWidgetTop: null,
      prevWidgetLeft: null,
      widget: null,
      widgetModal: null,
      widgetNode: null,
      widgetMinimized: false,
      gptPanelOnloadFuncName: null,
      testMeetingTitle: 'Session: Hybrid Work',

    };
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
    avatarPath() {
      return this.$store.state.avatarPath;
    },
    avatarBgColors() {
      return this.$store.state.avatarBgColors;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    systemBarVisible() {
      return this.$store.state.systemBarVisible;
    },
    meetingTitle() {
      return this.$store.state.meetingTitle;
    },
    breakpoints() {
      return this.$store.state.breakpoints;
    },
    teamsNav() {
      return this.$store.state.teamsNav;
    },

    spaceListTabId() {
      return this.$store.state.spaceListTabId;
    },
    publicSpaceHomepageVisible() {
      return this.$store.state.publicSpaceHomepageVisible;
    },

    activeSpace() {
      return this.$store.getters.activeSpace;
    },
    activeSpaceId() {
      return this.$store.state.activeSpaceId;
    },
    signinVisible() {
      return this.$store.state.signinVisible;
    },
    teamsWindowMinimized() {
      return this.$store.state.teamsWindowMinimized;
    },
    activeContactId() {
      return this.$store.state.activeContactId;
    },
    secondColumnWidthByHand() {
      return this.$store.state.secondColumnWidthByHand;
    },
    callingPeopleItems() {
      return this.$store.state.callingPeopleItems;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    meetingsSidecarVisible() {
      return this.$store.state.meetingsSidecarVisible;
    },
    teamsSidecarName() {
      return this.$store.state.teamsSidecarName;
    },
    selectedMeeting() {
      return this.$store.state.selectedMeeting;
    },
    selectedMeetingJumpto() {
      return this.$store.state.selectedMeetingJumpto;
    },
    sidecarGlobalMsgList() {
      return this.$store.state.sidecarGlobalMsgList;
    },
    gptPanelPopouted() {
      return this.$store.state.gptPanelPopouted;
    },
    teamWindowOverlayRect() {
      return this.$store.state.teamWindowOverlayRect;
    },
    teamsAlertbanner() {
      return this.$store.state.teamsAlertbanner;
    },
    callAs() {
      return this.$store.state.callAs;
    },
    callWidgetMinHeight() {
      return this.$store.state.callWidgetMinHeight;
    },
    aiEnabled() {
      return this.$store.state.aiEnabled;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    peopleNotJoinedList() {
      return this.$store.state.peopleNotJoinedList;
    },
    peopleWaiting() {
      return this.$store.state.peopleWaiting;
    },

  },
  mounted() {
    this.$eventBus.$on('incoming-call-toast', (peopleName, number, layout) => {
      this.showIncomingCallToast(peopleName, number, layout)
    });
    this.$eventBus.$on('show-call-widget', (layout) => {
      //params
      this.showCallWidget(layout)
    });
    window.addEventListener('keydown', this.onKeydown);
    requestAnimationFrame(() => {
      this.appRect = this.parentRect
    })

    if(this.aiEnabled) {
      this.showCatchMeUpToast(
        'Your morning summary', 
        'AI has summarized the valuable messages and meetings you may have missed last night.', 
        {
          label: 'Catch me up',
          func: () => {
            this.catchMeUp()
          }
        }
      )
      /*
      requestAnimationFrame(() => {
          this.showCoachmark({
              name: 'ai-coachmark',
              closable: true,
              maxWidth: '308px',
              title: `Webex AI`,
              content: `Never miss a beat - elevate your efficiency with AI-powered summaries and insights.`,
              subtext: null,
              reference: document.querySelector('.teams-header-r-ai .ai'),
              placement: `bottom`,
              closeTrigger: 'mousedown',
              buttonJustifyContent: 'flex-start',
              button: {
                  label: 'Try it',
                  func: () => {
                    //this.catchMeUp()
                    this.openSidecar()
                  },
                },
            })
        })
        */
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  watch: {
    teamsSidecarName() {
      this.$nextTick(() => {
        this.onResizing()
      })
    },
    parentRect(val) {
      this.appRect = val
      this.onResizing()
    },
    teamsNav(val) {
      if (val === 'contacts') {
        if (!this.activeContactId) {
          this.activeContactItem = {};
        } else {
          this.activeContactItem = this.$store.getters.people(`${this.activeContactId.replace(/_/g, ' ')}`)
        }
      }

      if (val !== 'calling') {
        var layout = 'widget'
        if (this.popCallWidgetVisible[layout] && this.callingPeopleItems[layout].length == 0) {
          this.$modal.hide(`call-popout-${layout}`)
        }
      }
    },

    teamsWindowMinimized(val) {
      var layout = 'widget'
      if (val) {
        if (this.teamsNav === 'calling' && !this.popCallWidgetVisible[layout]) {
          //this.showCallWidget(layout, true)
        }
      } else if (this.popCallWidgetVisible[layout]) {
        if (this.widgetAutoOpened) {
          //this.$modal.hide(`call-popout-${layout}`)
        } else {
          this.cancelDock()
          if (this.widgetModal && this.widgetNode && this.widgetMinimized) {
            //this.restoreWidget(this.widgetModal, this.widgetNode)
            this.widget.restore()
          }
        }
      }
    },

  },
  methods: {
    signIn() {
      this.$store.commit('signinVisible', false);
    },

    onResizing() {
      let appRect = this.appRect
      this.$popper.hideAll();
      let sidecarWidth = 0
      if (this.teamsSidecarName) {
        const srect = document.querySelector('.sidecar').getBoundingClientRect()
        const srect2 = document.querySelector('.sidecar-slider').getBoundingClientRect()
        sidecarWidth = srect.width + srect2.width
      }

      var shrink = 0;
      const width = appRect.width - sidecarWidth;
      if (width >= 1060 && width < 1100) {
        shrink = 1;
      } else if (width >= 960 && width < 1060) {
        shrink = 2;
      } else if (width >= 870 && width < 960) {
        shrink = 3;
      } else if (width >= 750 && width < 870) {
        shrink = 4;
      } else if (width >= 670 && width < 750) {
        shrink = 5;
      } else if (width >= 600 && width < 670) {
        shrink = 6;
      } else if (width >= 520 && width < 600) {
        shrink = 7;
      } else if (width >= 450 && width < 520) {
        shrink = 8;
      } else if (width >= 400 && width < 550) {
        shrink = 9;
      }

      const breakpoints = { width: width, height: appRect.height, shrink: shrink };
      this.$eventBus.$emit('teams-resizing', breakpoints);
      this.$store.commit('breakpoints', breakpoints);

      this.appSizeLastValue = {
        width: appRect.width,
        height: appRect.height,
        widthDiff: this.appSizeLastValue.width ? appRect.width - this.appSizeLastValue.width : 0,
        heightDiff: this.appSizeLastValue.height ? appRect.height - this.appSizeLastValue.height : 0,
      }

      this.checkSpaceWidth();
      this.checkTwoColumnsMode();
    },

    onResizingColumn() {
      const rectCol2 = document.querySelector('.teams-middle-midcol').getBoundingClientRect();
      var col2w = rectCol2.width;
      this.secondColumnWidth = col2w;
      this.$store.commit('secondColumnWidthByHand', col2w);
      //
      this.checkSpaceWidth();
      this.$eventBus.$emit('teams-resizing', this.breakpoints);
    },
    checkSpaceWidth() {
      if (document.querySelector('.teams-content-column')) {
        const spaceRect = document.querySelector('.teams-content-column').getBoundingClientRect();
        const spacewidth = spaceRect.width;

        if (spacewidth <= 540) {
          this.spaceSize = 'medium';
        } else {
          this.spaceSize = 'normal';
        }
      }

    },

    checkTwoColumnsMode() {
      this.twoColumnsMode = this.breakpoints.width < 660
      this.$store.commit('isTwoColumnsMode', this.twoColumnsMode);

      if (this.twoColumnsMode) {
        if (this.secondColumnWidthLastValue === 0) {
          this.secondColumnWidthLastValue = this.secondColumnWidth
        }
        var rectmid = document.querySelector('.teams-middle').getBoundingClientRect();
        var rectnav = document.querySelector('.teams-middle-nav').getBoundingClientRect();
        this.secondColumnWidth = rectmid.width - rectnav.width
      } else if (this.secondColumnWidthLastValue > 0) {
        this.secondColumnWidth = this.secondColumnWidthLastValue
        this.secondColumnWidthLastValue = 0
      }

      //

      if (document.querySelector('.teams-content-column')) {
        const spaceRect = document.querySelector('.teams-content-column').getBoundingClientRect();
        const spacewidth = spaceRect.width;

        const rectCol2 = document.querySelector('.teams-middle-midcol').getBoundingClientRect();
        var col2w = rectCol2.width;
        let newWidth;
        let expandToWidth = this.secondColumnWidthByHand ? this.secondColumnWidthByHand : this.secondColumnDefaultWidth
        if (spacewidth <= 500 && col2w > this.secondColumnMinWidth && this.appSizeLastValue.widthDiff < 0) {
          // compress column 2 width to secondColumnMinWidth
          newWidth = this.secondColumnWidth + this.appSizeLastValue.widthDiff
          this.secondColumnWidth = Math.max(newWidth, this.secondColumnMinWidth)
        } else if (spacewidth > 500 && col2w < expandToWidth && this.appSizeLastValue.widthDiff > 0) {
          // extend column width
          newWidth = this.secondColumnWidth + this.appSizeLastValue.widthDiff
          this.secondColumnWidth = Math.min(newWidth, expandToWidth)
        }
      }
    },


    onMinimize() {
      this.$emit('minimize', { rect: this.parentRect });
      this.$store.commit('teamsWindowMinimized', true);
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

    openSidecar() {
      this.$store.commit('teamsSidecarName', 'ai-global')
      this.$store.commit('meetingsSidecarVisible', false);
    },
    catchMeUp() {
      if(this.teamsSidecarName) {
        this.$eventBus.$emit('catch-me-up')
      } else {
        this.gptPanelOnloadFuncName = 'catchMeUp'
        this.$store.commit('teamsSidecarName', 'ai-global')
        this.$store.commit('meetingsSidecarVisible', false);

        setTimeout(() => {
          this.gptPanelOnloadFuncName = null
        }, 1000)
      }
      
    },

    showIncomingMeetingToast(meetingName, subline) {
      this.$modal.show(
        {
          template: `
                  <div class="popout-toast-incoming-call" >
                      <div class="topbar">
                      <div class="tit">Meeting reminder</div>
                      <div class="close" @click="close" >
                          <wl-icon name="cancel-bold" size="16" color="white" />
                      </div>
                      </div>
                      <div class="content">
                      <div class="toastcontent-l">
                          <div class="icon" style="background-color: #932099;">
                              F
                          </div>

                      </div>
                      <div class="toastcontent-r">
                          <div class="toastcontent-line1">
                          {{meetingName}}
                          </div>
                          <div class="toastcontent-line2 opacity70">
                          {{subline}}
                          </div>
                          <div class="toastcontent-line3 green">
                          In 5 minutes
                          </div>
                          <div class="toastcontent-line4">
                          
                          <md-button 
                              class="btn md-button-outline" 
                              aria-label="x" 
                              :size="32" 
                              @click="prepare"
                          >
                              <svg style="margin-right:4px;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13.5 4C14.3284 4 15 3.32843 15 2.5C15 1.67157 14.3284 1 13.5 1C12.6716 1 12 1.67157 12 2.5C12 3.32843 12.6716 4 13.5 4ZM3 8.75C3 6.40279 4.90279 4.5 7.25 4.5C9.59721 4.5 11.5 6.40279 11.5 8.75C11.5 11.0972 9.59721 13 7.25 13C4.90279 13 3 11.0972 3 8.75ZM7.25 2.5C3.79822 2.5 1 5.29822 1 8.75C1 12.2018 3.79822 15 7.25 15C10.7018 15 13.5 12.2018 13.5 8.75C13.5 5.29822 10.7018 2.5 7.25 2.5Z" fill="url(#paint0_linear_4142_29556)"/>
                                  <defs>
                                  <linearGradient id="paint0_linear_4142_29556" x1="16" y1="0" x2="0" y2="16" gradientUnits="userSpaceOnUse">
                                  <stop stop-color="#3CC29A"/>
                                  <stop offset="1" stop-color="#0672EF"/>
                                  </linearGradient>
                                  </defs>
                              </svg>

                              %Prepare%
                          </md-button>

                          <md-button 
                              class="btn md-button-outline" 
                              aria-label="x" 
                              :size="32" 
                              @click="close"
                          >
                              Snooze
                          </md-button>
                          </div>
                      </div>
                      </div>
                  </div>
                  `,
          props: ['parent', 'meetingName', 'theme', 'subline'],
          data() {
            return {
            };
          },
          methods: {
            callback() {
              this.parent.joinMeeting()
              this.close();
            },
            prepare() {
              this.parent.askAiToPrepareMeeting()
              this.close();
            },
            close() {
              this.$emit('close');
            },
          }
        },
        {
          parent: this,
          theme: this.theme,
          meetingName: meetingName,
          subline: subline,
        }, // component props
        {
          name: 'toast-device-sharing',
          clickToClose: false,
          transition: true,
          modalTransition: 'toast-transition--modal',
          frameless: true,
          shadow: false,
          resizable: false,
          draggable: false,
          roundedCorner: false,
          overlayVisible: false,
          overlayTransparent: 0,
          theme: this.theme,
          width: 332,
          height: 176,
          center: false,
          bottom: 65,
          right: 8,
        }, // modal props
        {} // modal eventlistener
      );
    },

    /**
     * 
     * @param {*} peopleName
     * @param {*} number eg 'Work: +1 888 555 2454'
     */
    showIncomingCallToast(peopleName, number, layout) {

      let ppl = this.$store.getters.people(peopleName)

      this.$modal.show(
        {
          template: `
            <div class="popout-toast-incoming-call" >
              <div class="topbar">
                <wl-icon name="alert-mute-bold" size="16" color="white" />
                <div class="close" @click="close" >
                  <wl-icon name="cancel-bold" size="16" color="white" />
                </div>
              </div>
              <div class="content">
                <div class="toastcontent-l">
                  <presence-avatar
                    :title="info.people.name"
                    :src="info.people.avatar ? avatarPath + info.people.avatar : ''" 
                    type="group" 
                    :color="'white'"
                    :size="32"
                    :presence="'call'" 
                    :theme="theme === 'light' ? 'light' : 'dark'"
                    class="avatar" 
                  />

                </div>
                <div class="toastcontent-r">
                  <div class="toastcontent-line1 green">
                    Incoming call
                  </div>
                  <div class="toastcontent-line2 semibold">
                    {{info.people.name}}
                  </div>
                  <div class="toastcontent-line3">
                    {{info.number}}
                  </div>
                  <div class="toastcontent-line4">
                    <md-button 
                      class="btn" 
                      color="red"
                      aria-label="x" 
                      :size="32" 
                      @click="close"
                    >
                      Decline
                    </md-button>

                    <md-button 
                      class="btn" 
                      color="green"
                      aria-label="x" 
                      :size="32" 
                      @click="startAudioCall"
                    >
                      {{ incallNumber > 0 ? 'Hold & Answer' : 'Answer'}}
                    </md-button>
                  </div>
                </div>
              </div>
            </div>
          `,
          props: ['parent', 'info', 'avatarPath', 'avatarBgColors', 'theme', 'incallNumber'],
          data() {
            return {
            };
          },
          methods: {
            startAudioCall() {
              let info = {
                number: number.split(': ')[1],
                people: ppl,
              }
              this.parent.startAudioCall(info);
              this.close();
            },
            close() {
              this.$emit('close');
            },
          }
        },
        {
          parent: this,
          info: {
            number: number,
            people: ppl,
          },
          theme: this.theme,
          avatarPath: this.avatarPath,
          avatarBgColors: this.avatarBgColors,
          incallNumber: this.callingPeopleItems[layout].length,
        }, // component props
        {
          name: 'toast-device-sharing',
          clickToClose: false,
          transition: true,
          modalTransition: 'toast-transition--modal',
          frameless: true,
          shadow: false,
          resizable: false,
          draggable: false,
          roundedCorner: false,
          overlayVisible: false,
          overlayTransparent: 0,
          theme: this.theme,
          width: 332,
          height: 176,
          center: false,
          bottom: 65,
          right: 8,
        }, // modal props
        {} // modal eventlistener
      );
    },

    showMeetingSummaryReadyToast(meetingName, subline) {
      this.$modal.show(
        {
          template: `
                  <div class="popout-toast-incoming-call" >
                      <div class="topbar">
                      <div class="tit">Following meeting’s summary is ready</div>
                      <div class="close" @click="close" >
                          <wl-icon name="cancel-bold" size="16" color="white" />
                      </div>
                      </div>
                      <div class="content">
                      <div class="toastcontent-l">
                          <div class="icon" style="background-color: #545454;">
                              <wl-icon name="meetings-presence-bold" size="16" color="white" />
                          </div>

                      </div>
                      <div class="toastcontent-r">
                          <div class="toastcontent-line1">
                          {{meetingName}}
                          </div>
                          <div class="toastcontent-line2 ">
                          {{subline}}
                          </div>
                          <div class="toastcontent-line3 opacity70">
                            Tue 21/1 12:00 PM - 13:00 PM
                          </div>
                          <div class="toastcontent-line4">

                          <md-button 
                              class="btn" 
                              aria-label="x" 
                              :size="32" 
                              @click="viewrecap"
                          >
                            View meeting recap
                          </md-button>
                          </div>
                      </div>
                      </div>
                  </div>
                  `,
          props: ['parent', 'meetingName', 'theme', 'subline'],
          data() {
            return {
            };
          },
          methods: {
            callback() {
              this.parent.joinMeeting()
              this.close();
            },
            viewrecap() {
              this.parent.findAndPopoutMeetingDetails('Session: Hybrid Work')
              this.close();
            },
            close() {
              this.$emit('close');
            },
          }
        },
        {
          parent: this,
          theme: this.theme,
          meetingName: meetingName,
          subline: subline,
        }, // component props
        {
          name: 'toast-device-sharing',
          clickToClose: false,
          transition: true,
          modalTransition: 'toast-transition--modal',
          frameless: true,
          shadow: false,
          resizable: false,
          draggable: false,
          roundedCorner: false,
          overlayVisible: false,
          overlayTransparent: 0,
          theme: this.theme,
          width: 332,
          height: 176,
          center: false,
          bottom: 65,
          right: 8,
        }, // modal props
        {} // modal eventlistener
      );
    },

    showCatchMeUpToast(title, content, button) {
      this.$modal.show(
        {
          template: `
                  <div class="popout-toast-incoming-call" >
                      <div class="topbar" style="height: 60px;">
                        <div class="tit" style="margin-left:16px;">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.875 11C23.9105 11 24.75 10.1605 24.75 9.125C24.75 8.08947 23.9105 7.25 22.875 7.25C21.8395 7.25 21 8.08947 21 9.125C21 10.1605 21.8395 11 22.875 11ZM9.75 16.9375C9.75 14.0035 12.1285 11.625 15.0625 11.625C17.9965 11.625 20.375 14.0035 20.375 16.9375C20.375 19.8715 17.9965 22.25 15.0625 22.25C12.1285 22.25 9.75 19.8715 9.75 16.9375ZM15.0625 9.125C10.7478 9.125 7.25 12.6228 7.25 16.9375C7.25 21.2522 10.7478 24.75 15.0625 24.75C19.3772 24.75 22.875 21.2522 22.875 16.9375C22.875 12.6228 19.3772 9.125 15.0625 9.125Z" fill="url(#paint0_linear_1_282060)"/>
                            <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="white" stroke-opacity="0.2"/>
                            <defs>
                            <linearGradient id="paint0_linear_1_282060" x1="9.92174" y1="22.2942" x2="22.0783" y2="9.70578" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#08599C"/>
                            <stop offset="0.5156" stop-color="#22C7D6"/>
                            <stop offset="1" stop-color="#27A17A"/>
                            </linearGradient>
                            </defs>
                          </svg>
                          <span class="lb" style="margin-left: 12px; font-size:16px; font-weight:normal;">Webex AI</span>
                        </div>
                        <div class="close" @click="close" >
                            <wl-icon name="cancel-bold" size="16" color="white" />
                        </div>
                      </div>
                      <div class="content" style="padding:0 16px 12px 16px;">
                      <div class="toastcontent-r">
                          <div class="toastcontent-line1 opacity70">
                          {{title}}
                          </div>
                          <div class="toastcontent-line2 ">
                          {{subline}}
                          </div>
                          <div class="toastcontent-line4">

                          <md-button 
                              class="btn md-button-outline" 
                              aria-label="x" 
                              :size="32" 
                              @click="callback"
                          >
                            {{button.label}}
                          </md-button>
                          </div>
                      </div>
                      </div>
                  </div>
                  `,
          props: ['parent', 'title', 'theme', 'subline', 'button'],
          data() {
            return {
            };
          },
          methods: {
            callback() {
              this.button.func()
              this.close();
            },
            close() {
              this.$emit('close');
            },
          }
        },
        {
          parent: this,
          theme: this.theme,
          title: title,
          subline: content,
          button: button,
        }, // component props
        {
          name: 'toast-catch-me-up',
          clickToClose: false,
          transition: true,
          modalTransition: 'toast-transition--modal',
          frameless: true,
          shadow: false,
          resizable: false,
          draggable: false,
          roundedCorner: false,
          overlayVisible: false,
          overlayTransparent: 0,
          theme: this.theme,
          width: 332,
          height: 176,
          center: false,
          bottom: 65,
          right: 8,
        }, // modal props
        {} // modal eventlistener
      );
    },

    findAndPopoutMeetingDetails() {

      let selectedMeeting = {
          title: this.testMeetingTitle,
          organizer: 'David Liam',
          inmeeting: false,
          people: 8,
          start: this.$makeMeetingTime(-1)[0],
          end: this.$makeMeetingTime(-1)[1],
          position: {
              left: '0',
              width: '50%',
          },
          avatarBackgroundColor: ['#61B391', '#60C0A2'],
          team: 'The Design Group',
          icons: ['recurring-bold'],
          accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
          waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
          tags: [
              '3 Recordings',
              'Meeting notes',
              'Action items',
          ],
        }
      
      this.$eventBus.$emit('open-meeting-info-window', {
            meetingInfo: selectedMeeting,
            jumpto: null,
            windowtitle: 'Meeting recaps',
        }, {})
    },

    startAudioCall(info, layout = 'widget') {
      var incall = _.cloneDeep(this.callingPeopleItems);
      var ppp = this.$store.getters.people(info.people.name)
      var ppl = _.merge(info.people, ppp)
      ppl.callasIndex = this.callAs.id
      info.people = ppl

      var list = incall[layout]
      if (list.length < 2) {
        var i, itm
        for (i = 0; i < list.length; i++) {
          itm = list[i];
          if (itm.people.name === info.people.name) {
            return;
          }
        }
        for (i = 0; i < list.length; i++) {
          itm = list[i];
          if (!itm.incoming) {
            itm.onhold = true
          }
        }
        list.push(info);
        incall[layout] = list;
        this.$store.commit('callingPeopleItems', incall);
      }

      this.showCallWidget(layout);

    },

    onKeydown(evt) {
      console.log('evt.code', evt.code, evt.altKey);

      if (evt.code == 'KeyS' && evt.altKey) {
          this.showMeetingSummaryReadyToast('Session: Hybrid Work', 'David Liam')
        }

      if (this.teamsNav === 'calling' && evt.code == 'KeyC') {
        let layout = 'widget'

        var plist = this.peopleList.concat(this.peopleNotJoinedList)
        if(this.callCounter >= plist.length-1) {
          return
        }
        
        let ppl = plist[this.callCounter]
        while(ppl.isroom) {
          this.callCounter++
          ppl = plist[this.callCounter]
        }
        this.callCounter++

        if (!this.popCallWidgetVisible[layout]) {
          this.showIncomingCallToast(ppl.name, ppl.numbers[0], layout);
        } else {
          let incall = _.cloneDeep(this.callingPeopleItems);
          var list = incall[layout]
          list.unshift({
            number: ppl.numbers[0].split(': ')[1],
            people: ppl,
            incoming: true,
          })
          incall[layout] = list
          this.$store.commit('callingPeopleItems', incall);
        }
        
      }

    },


    showCallWidget(layout = 'widget', autoOpen = false) {
      if (!this.popCallWidgetVisible[layout]) {
        var width = layout === 'simple' ? 400 : 446;
        var offset = 88;
        const rect = document.querySelector('#teams-app').getBoundingClientRect();
        const deskrect = document.querySelector('#desktop').getBoundingClientRect();
        const top = this.prevWidgetTop !== null ? this.prevWidgetTop : (rect.top + offset)
        const left = this.prevWidgetLeft !== null ? this.prevWidgetLeft : (deskrect.left + deskrect.width - width)

        let viewport = {}
        if(this.os == 'win') {
          const wintask = document.querySelector('#taskbar').getBoundingClientRect();
          viewport = {
            height: deskrect.height - wintask.height,
            top: 0,
          }
        }else{
          const macmenu = document.querySelector('#menubar').getBoundingClientRect();
          viewport = {
            height: deskrect.height - macmenu.height,
            top: macmenu.height,
          }
        }

        this.prevWidgetTop = top
        this.prevWidgetLeft = left

        this.$modal.show(
          popCallWidget,
          {
            layout: layout,
            onResume: () => {
              if (this.meetingOptionsList.length === 0) {
                //
              } else {
                // pause calls in meeting window
                let optlist = _.cloneDeep(this.meetingOptionsList)
                for (let i = 0; i < optlist.length; i++) {
                  optlist[i].meetingPaused = true
                }
                this.$store.commit('meetingOptionsList', optlist);
              }
            },
            onMount: (modal, widgetNode, widget) => {
              this.widget = widget
              this.widgetModal = modal
              this.widgetNode = widgetNode

              setTimeout(() => {
                var wgtrect = this.widgetNode.getBoundingClientRect()
                this.widgetPrevW = wgtrect.width
                this.widgetPrevH = wgtrect.height
              }, 500)
            },
            onMinimize: this.minimizeWidget,
            onRestore: this.restoreWidget,
            onResize: this.resizeWidget,
          }, // component props
          {
            name: `call-popout-${layout}`,
            clickToClose: false,
            frameless: true,
            shadow: false,
            resizable: false,
            draggable: '#pop-call-widget-titlebar',
            viewport: viewport,
            overlayVisible: false,
            overlayTransparent: 0,
            theme: `${this.theme} ${this.themeColor}`,
            roundedCorner: false,
            width: width,
            minWidth: width,
            height: 'auto',
            center: false,
            top: top,
            left: left,
            transition: false,
            modalTransition: 'scale-transition-',
          }, // modal props
          {
            opened: params => {
              //if (this.teamsWindowMinimized) {
              this.checkWidgetDockSide(params.el)
              this.dockWidget(params.modal, params.el, false)
              //}
            },
            closed: () => {
              this.popCallWidgetVisible[layout] = false;
            },
            dragging: params => {
              //if (this.teamsWindowMinimized) {
              this.checkWidgetDockSide(params.el, true)
              //}
            },
            dragstoped: params => {
              //if (this.teamsWindowMinimized) {
              this.dockWidget(params.modal, params.el, true)
              //}
            },

          } // modal eventlistener
        );
        this.popCallWidgetVisible[layout] = true;
        this.widgetAutoOpened = autoOpen;
      }

    },

    minimizeWidget() {
      this.widgetMinimized = true

      var deskrect = document.querySelector('#desktop').getBoundingClientRect()
      var wgtrect = this.widgetNode.getBoundingClientRect()

      var top = wgtrect.top
      var left = wgtrect.left

      var size = 60
      var width = size
      var height = size
      var autoHeight = false

      if (this.dockSideX === 'L') {
        left = 0
      } else if (this.dockSideX === 'R') {
        left = deskrect.width - size
      } else {
        left = wgtrect.left + wgtrect.width / 2 - size / 2
      }

      if (this.dockSideY === 'T') {
        top = 0
      } else if (this.dockSideY === 'B') {
        top = deskrect.height - size
      }

      this.widgetModal.setRect({
        width,
        height,
        autoHeight,
        top: top,
        left: left,
      })

    },

    cancelDock() {
      var wdg = document.querySelector('#pop-call-widget')
      wdg.style.borderTopLeftRadius = ''
      wdg.style.borderTopRightRadius = ''
      wdg.style.borderBottomLeftRadius = ''
      wdg.style.borderBottomRightRadius = ''
    },

    restoreWidget() {
      const size = 60
      this.widgetMinimized = false
      var wgtrect = this.widgetNode.getBoundingClientRect()

      var top = wgtrect.top
      var left = wgtrect.left - this.widgetPrevW / 2 + size / 2

      var width = this.widgetPrevW
      var height = this.widgetPrevH
      var autoHeight = true

      this.widgetModal.setRect({
        width,
        height,
        autoHeight,
        top: top,
        left: left,
      })

      if (this.widget) {
        this.widget.updateMinimize()
      }

    },

    checkWidgetDockSide(el, dragging) {
      const snapwidth = 30
      var deskrect = document.querySelector('#desktop').getBoundingClientRect()
      var wdgrect = el.getBoundingClientRect()
      var wdg = el.querySelector('#pop-call-widget')

      wdg.style.borderTopLeftRadius = ''
      wdg.style.borderTopRightRadius = ''
      wdg.style.borderBottomLeftRadius = ''
      wdg.style.borderBottomRightRadius = ''
      this.dockSideX = null
      this.dockSideY = null

      if (wdgrect.left <= snapwidth) {
        wdg.style.borderTopLeftRadius = '0'
        wdg.style.borderBottomLeftRadius = '0'
        this.dockSideX = 'L'
      } else if (wdgrect.right >= deskrect.width - snapwidth) {
        wdg.style.borderTopRightRadius = '0'
        wdg.style.borderBottomRightRadius = '0'
        this.dockSideX = 'R'
      }
      if (wdgrect.top <= snapwidth) {
        wdg.style.borderTopLeftRadius = '0'
        wdg.style.borderTopRightRadius = '0'
        this.dockSideY = 'T'
      }
      // else if (wdgrect.bottom >= deskrect.height - snapwidth) {
      //  wdg.style.borderBottomLeftRadius = '0'
      //  wdg.style.borderBottomRightRadius = '0'
      //  this.dockSideY = 'B'
      //}

      if (!this.dockSideX && !this.dockSideY) {
        this.widgetInDockingArea = false
      }

      if (!this.widgetInDockingArea && dragging && !this.widgetMinimized) {
        el.style.transition = 'opacity .3s ease-in-out, transform .3s ease-in-out'

        if (this.dockSideX || this.dockSideY) {
          if (this.dockSideX == 'R') {
            el.style.transformOrigin = 'top right'
          } else if (this.dockSideX == 'L') {
            el.style.transformOrigin = 'top left'
          } else {
            el.style.transformOrigin = 'top center'
          }
          el.style.opacity = '0.5'
          el.style.transform = 'scale(0.5)'
        } else {
          el.style.opacity = '1.0'
          el.style.transform = 'scale(1)'
        }
      }

    },
    dockWidget(modal, el, dragging) {
      var deskrect = document.querySelector('#desktop').getBoundingClientRect()
      var wdgrect = el.getBoundingClientRect()
      var wdg = el.querySelector('#pop-call-widget')

      wdg.style.borderTopLeftRadius = ''
      wdg.style.borderTopRightRadius = ''
      wdg.style.borderBottomLeftRadius = ''
      wdg.style.borderBottomRightRadius = ''

      if (dragging) {
        el.style.transition = ''
        el.style.opacity = '1.0'
        el.style.transform = 'scale(1)'
      }

      var top = wdgrect.top
      var left = wdgrect.left

      if (this.dockSideX === 'L') {
        left = 0
        wdg.style.borderTopLeftRadius = '0'
        wdg.style.borderBottomLeftRadius = '0'
      } else if (this.dockSideX === 'R') {
        left = deskrect.width - wdgrect.width
        wdg.style.borderTopRightRadius = '0'
        wdg.style.borderBottomRightRadius = '0'
      }

      if (this.dockSideY === 'T') {
        top = 0
        wdg.style.borderTopLeftRadius = '0'
        wdg.style.borderTopRightRadius = '0'
      }
      //else if (this.dockSideY === 'B') {
      //  top = deskrect.height - wdgrect.height
      //}

      this.prevWidgetTop = top
      this.prevWidgetLeft = left

      modal.setRect({
        top: top,
        left: left,
      })

      if (!this.widgetInDockingArea && dragging && (this.dockSideX || this.dockSideY)) {
        this.widgetInDockingArea = true
        this.widget.minimize()
      } 
      if(this.dockSideX || this.dockSideY){
        this.widget.setDockSide(this.dockSideX ? this.dockSideX : this.dockSideY)
      }else{
        this.widget.setDockSide(null)
      }
    },

    resizeWidget(resizer, offset) {
      var wgtrect = this.widgetNode.getBoundingClientRect()
      var top = wgtrect.top
      var left = wgtrect.left
      var width =  wgtrect.width
      var height = wgtrect.height
      var autoHeight = false

      const deskrect = document.querySelector('#desktop').getBoundingClientRect();

      let viewport = {}
      if(this.os == 'win') {
        const wintask = document.querySelector('#taskbar').getBoundingClientRect();
        viewport = {
          height: deskrect.height - wintask.height,
          top: 0,
        }
      }else{
        const macmenu = document.querySelector('#menubar').getBoundingClientRect();
        viewport = {
          height: deskrect.height - macmenu.height,
          top: macmenu.height,
        }
      }

      if (resizer == 'B') {
        if(top + (height + offset) > viewport.height) {
          return
        }
        height = height + offset
      }else if (resizer == 'T') {
        if(top + offset < viewport.top) {
          return
        }else if (height - offset < this.callWidgetMinHeight) {
          height = this.callWidgetMinHeight
        } else {
          height = height - offset
          top = top + offset
        }
      }

      height = Math.max(Math.min(viewport.height, height), this.callWidgetMinHeight)
      this.widgetPrevH = height

      this.widgetModal.setRect({
        width,
        height,
        autoHeight,
        top: top,
        left: left,
      })

      this.$store.commit('callWidgetResized', {height: height})

    },






    showAudioCallShareWindow() {
      var layout = 'widget';
      var incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[layout]
      if (list.length > 1) {
        var info = list[1]

        let shareList = [{
          title: `Viewing ${info.people.name}'s shared content`,
          people: info.people.name,
          content: 'ppt',
          type: 'sharing',
        }]

        this.$eventBus.$emit('open-new-meeting-window', {
          meetingId: info.people.name,
          meetingType: 'audio-call',
          currentSharing: shareList,
          videoLayout: 'stage-sharing',
          meetingCallInfo: info,
          callPeopleVideoOn: true,
        }, {
          offset: [-162, 0],
        })

        setTimeout(() => {
          this.$notify({
            group: 'default',
            text: `<b>${info.people.name}</b> started to share screen`,
            data: {
              people: info.people.name,
              closeable: true,
              click: () => { },
            },
          });
        }, 1000)

      }

    },

    showSwitchToVideoCallDialog(callinfo, location, parentSelector) {
      var dgwidth = 400
      var dgheight = 170
      var parentel = document.querySelector(parentSelector)
      var rect = parentel.getBoundingClientRect()
      var top = rect.top + (rect.height - dgheight) / 2
      var left = rect.left + (rect.width - dgwidth) / 2

      this.$modal.show(
        dialog,
        {
          title: `${callinfo.people.name} has switched to a video call.`,
          message: `Do you want to switch to a video call?.`,
          buttons: [
            {
              title: 'Switch to video call',
              class: 'md-button-solid2',
              func: () => {
                this.switchToVideoCall(callinfo, location)
              },
            },
            {
              title: 'No',
              class: 'md-button-outline',
              func: () => { },
            },
          ],
        }, // component props
        {
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          draggable: '.dialog .topbar',
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          roundedCorner: this.os === 'mac',
          width: dgwidth,
          height: 'auto',
          center: false,
          top: top,
          left: left,
          transition: true,
        }, // modal props
        {
          closed: () => { }
        } // modal eventlistener
      );
    },

    switchToVideoCall(callinfo, location) {

      if (location === 'meeting') {
        let layout = 'widget'
        let incall = _.cloneDeep(this.callingPeopleItems);
        let list = incall[layout]
        let info = list[list.length - 1]
        list = _.take(list, list.length - 1)
        incall[layout] = list;
        this.$store.commit('callingPeopleItems', incall);

        let optlist = _.cloneDeep(this.meetingOptionsList)
        let idx = _.findIndex(optlist, o => { return o.meetingId == info.people.name });
        optlist[idx].meetingType = 'video-call'
        this.$store.commit('meetingOptionsList', optlist);

        this.$window.get(info.people.name, window => {
          let parentrect = window.$el.parentNode.getBoundingClientRect()
          let obj = window.$el.getBoundingClientRect()
          let clientW = parentrect.width
          let clientH = parentrect.height

          /* drag-resize 中:
          * right 是窗口距离parent右边的距离
          * bottom 是窗口距离parent底部的距离
          */
          let rect = {
            top: obj.top,
            bottom: clientH - obj.bottom,
            left: obj.left,
            right: clientW - obj.right,
            height: obj.height,
            width: obj.width,
          }

          let newH = 672
          if (rect.height < newH) {
            rect.top = rect.bottom = Math.floor((clientH - newH) / 2)
          }

          window.setRect(rect)
        })


      } else if (location === 'widget') {
        let layout = 'widget'
        let incall = _.cloneDeep(this.callingPeopleItems);
        let list = incall[layout]
        let info = list[0]
        incall[layout] = [];
        this.$store.commit('callingPeopleItems', incall);

        let widget = document.querySelector('#pop-call-widget')
        let rect = widget.getBoundingClientRect()

        this.$store.commit('cameraOn', true);
        this.$store.commit('manuallyHideSelfVideo', true);
        this.$eventBus.$emit('open-new-meeting-window', {
          meetingId: info.people.name,
          meetingType: 'video-call',
          currentSharing: [],
          videoLayout: 'single',
          meetingCallInfo: info,
          callPeopleVideoOn: true,
        }, {
          offset: [-100, 20],
          transition: {
            from: {
              left: rect.left,
              top: rect.top,
              scale: 0.5,
              opacity: 0,
            },

          },
        })
      }


    },



    removePxFromNumberValue(val) {
      if (val.indexOf('px') > -1) {
        return Number(val.split('px')[0])
      }
      return val
    },

    closeAlertbanner() {
      let opt = {
        visible: false,
      }
      this.$store.commit('teamsAlertbanner', opt);
    },

    /*
    askAiToPrepareMeeting() {
      const msg = {
          type: 'responding',
          icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.875 11C23.9105 11 24.75 10.1605 24.75 9.125C24.75 8.08947 23.9105 7.25 22.875 7.25C21.8395 7.25 21 8.08947 21 9.125C21 10.1605 21.8395 11 22.875 11ZM9.75 16.9375C9.75 14.0035 12.1285 11.625 15.0625 11.625C17.9965 11.625 20.375 14.0035 20.375 16.9375C20.375 19.8715 17.9965 22.25 15.0625 22.25C12.1285 22.25 9.75 19.8715 9.75 16.9375ZM15.0625 9.125C10.7478 9.125 7.25 12.6228 7.25 16.9375C7.25 21.2522 10.7478 24.75 15.0625 24.75C19.3772 24.75 22.875 21.2522 22.875 16.9375C22.875 12.6228 19.3772 9.125 15.0625 9.125Z" fill="url(#paint0_linear_4049_18949)"/>
              <defs>
              <linearGradient id="paint0_linear_4049_18949" x1="26" y1="6" x2="6" y2="26" gradientUnits="userSpaceOnUse">
              <stop stop-color="#3CC29A"/>
              <stop offset="1" stop-color="#0672EF"/>
              </linearGradient>
              </defs>
              </svg>
              `,
          
          msgs: [
              `<span style="opacity:0.7; margin-right:4px; ">Checking the upcoming meeting </span> 📅`,
          ],
          completefunc: {
              name: 'showPrepareMeetingRespondingResult',
          },
          frame: 'colored',
      }

      let list = this.sidecarGlobalMsgList.slice()
      for(let i=list.length-1; i>=0; i--){
          if(list[i].type == 'msg'){
              list.splice(i, 1)
          }
      }
      list.push(msg)

      this.$store.commit('sidecarGlobalMsgList', list);
      
      this.$store.commit('teamsSidecarName', 'ai-global')
      this.closeDetailsSidecar()
    },
    */

    popoutMeetingDetails(meeting, jumpto) {
      this.closeDetailsSidecar()
      this.$eventBus.$emit('open-meeting-info-window', {
            meetingInfo: meeting,
            jumpto: jumpto,
            windowtitle: 'Meeting recaps',
        }, {})
    },

    closeDetailsSidecar() {
      this.$store.commit('meetingsSidecarVisible', false);
    },


  },
};
</script>


<style lang="scss">
#teams-app {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  transform-origin: 0 0;

  .vsg_gutter_v {
    background: transparent;
  }

  .alertbanner {
    margin: 2px 4px 8px 4px;
  }

  .teams-middle {
    display: flex;
    flex-grow: 1;
    overflow: hidden;

    &-content {
      flex-grow: 1;
      flex-shrink: 1;
    }

    &-nav {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      flex-shrink: 0;
    }

    &-split {
      height: 100%;
    }

    &-midcol {
      display: flex;
      flex-direction: column;
      border-radius: 12px 12px 0 0;
    }

    &-space {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .sidepanel {
      width: 344px;
      min-width: 344px;
    }

  }

  &.mac {
    border-radius: 12px;
    overflow: hidden;
  }



  /* theme ----- dark/hybrid */
  &.dark,
  &.hybrid {
    border: 1px solid rgba(255, 255, 255, .16);
  }


  .overlaybackground {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #121212, $alpha: .4);
    z-index: 999;

    &.clipmask {
      padding: var(--top) var(--right) var(--bottom) var(--left);
      mask:
        linear-gradient(black, black) content-box,
        linear-gradient(black, black);
      mask-composite: exclude;
    }
  }



}


.slide-to-left-enter-active,
.slide-to-left-leave-active {
  transition: opacity 0.2s, transform 0.2s ease;
}

.slide-to-left-enter,
.slide-to-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}





/** TEAMS COMMON */

.gradient-divider-h {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba($color: #FFFFFF, $alpha: 0.0) 0%, rgba($color: #FFFFFF, $alpha: .2) 20%, rgba($color: #FFFFFF, $alpha: .2) 80%, rgba($color: #FFFFFF, $alpha: 0.0) 100%);
}

.gradient-divider-v {
  width: 1px;
  height: 100%;
  background: linear-gradient(0deg, rgba($color: #FFFFFF, $alpha: 0.0) 0%, rgba($color: #FFFFFF, $alpha: .2) 20%, rgba($color: #FFFFFF, $alpha: .2) 80%, rgba($color: #FFFFFF, $alpha: 0.0) 100%);
}




.popout-toast-incoming-call {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
  background: #000000;

  .topbar {
    @include flex(row, flex-end);
    height: 32px;

    .tit {
      @include flex(row, flex-start);
      font-size: 12px;
      font-weight: 600;
      flex-grow: 1;
      margin-left: 16px;
    }

    .close {
      @include flex;
      height: 32px;
      width: 32px;
      margin: 0 4px 0 12px;
    }
  }

  .content {
    display: flex;
    flex-grow: 1;
    padding: 8px 16px 12px 16px;
  }

  .toastcontent-l {
    position: relative;
    display: flex;
    justify-content: center;
    margin: 4px 12px 0 0;

    .icon {
      @include flex;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #545454;
    }

    .avatar {
      width: 32px;
      height: 32px;
    }
  }

  .toastcontent-r {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;

    .defaultxt {
      font-size: 14px;
      line-height: 18px;
    }

    .green {
      color: $md-green-40;
      opacity: 1 !important;
    }

    .semibold {
      font-weight: 600;
    }

    .opacity70 {
      opacity: .7;
    }

    .toastcontent-line1 {
      display: flex;
      align-items: center;
      font-size: 14px;
    }

    .toastcontent-line2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 10px;
      font-size: 14px;
    }

    .toastcontent-line3 {
      opacity: .7;
      font-size: 14px;
    }

    .toastcontent-line4 {
      display: flex;
      flex-grow: 1;
      justify-content: flex-end;
      margin: 20px 0 0 0;

      .btn {
        margin-left: 10px;
        padding: 0 10px;
      }

      .btn-circle {
        min-width: 0;
        padding: 0 !important;
      }
    }
  }


}


.toast-transition--modal-enter-active,
.toast-transition--modal-leave-active {
  transition: all 400ms;
}

.toast-transition--modal-enter,
.toast-transition--modal-leave-active {
  opacity: 0;
  transform: translateX(500px);
}
</style>
