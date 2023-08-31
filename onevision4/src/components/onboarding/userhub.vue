<template>
    <div class="my-webex-meetings" >
        <img class="rest-icon" alt="" /><img class="rest-icon1" alt="" src="~@/components/onboarding/img/userhub/rest.svg" />
        <div class="number-badge">
            <div class="number">
                <div class="badge-text">4</div>
            </div>
        </div>

        <div class="top-bar-end2end">
            <div class="logo-wbx">
                <div class="logo-white-parent">
                    <img class="logo-white-icon" alt="" src="~@/components/onboarding/img/userhub/logowhite.svg" />
                    <div class="user-hub">User Hub</div>
                </div>
                <div class="initial-36-parent">
                    <div class="initial-36">
                        <img class="icn-icon" alt="" src="~@/components/onboarding/img/userhub/icn.svg" />
                        <div class="as">BG</div>
                    </div>
                    <div class="cart-parent">
                        <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/cart.svg" />
                        <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/icnsplit.svg" />
                        <img class="frame-child" ref="notificon" alt="" src="~@/components/onboarding/img/userhub/group-626423.svg" @click="showNotificationSidecar" />
                        <span v-if="unreadNum > 0" class="badge">{{ unreadNum }}</span>
                    </div>
                </div>
            </div>
        </div><!--top bar-->

        <div class="nav-left-smb-b">
            <div class="frame-parent">
                <div class="frame-wrapper">
                    <div class="frame-wrapper">
                        <div class="tab-active-parent">
                            <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Profile'}" @click="goNav('Profile')" >
                                <div class="people-circle-parent">
                                    <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/peoplecircle1.svg" />
                                    <div class="home">Profile</div>
                                </div>
                            </div>
                            <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Settings'}" @click="goNav('Settings')" >
                                <div class="people-circle-parent">
                                    <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/settings.svg" />
                                    <div class="home">Settings</div>
                                </div>
                            </div>
                            <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Meetings'}"  >
                                <div class="people-circle-parent">
                                    <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/meetings.svg" />
                                    <div class="home">Meetings</div>
                                </div>
                            </div>
                            <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Webinars'}" @click="goNav('Webinars')" >
                                <div class="people-circle-parent">
                                    <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/webinar.svg" />
                                    <div class="home">Webinars</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nav-header-parent">
                    <div class="nav-header"><b class="personal">ADMIN</b></div>
                    <div class="tab-active-group">
                        <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Setup Guide'}" @click="goNav('Setup Guide')" >
                            <div class="people-circle-parent">
                                <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/checkcircle.svg" />
                                <div class="home">Setup Guide</div>
                            </div>
                            <div v-if="guideStep < 3" class="number-badge1">
                                <div class="number">
                                    <div class="badge-text">{{ 3 - guideStep }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Users'}" @click="goNav('Users')" >
                            <div class="people-circle-parent">
                                <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/participantlist.svg" />
                                <div class="home">Users</div>
                            </div>
                        </div>
                        <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Services'}" @click="goNav('Services')" >
                            <div class="people-circle-parent">
                                <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/servicesettings.svg" />
                                <div class="home">Services</div>
                            </div>
                        </div>
                        <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Devices'}" @click="goNav('Devices')" >
                            <div class="people-circle-parent">
                                <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/deskphone.svg" />
                                <div class="home">Devices</div>
                            </div>
                        </div>
                        <div class="tab-inactive" :class="{'tab-active1': leftNav === 'Billing'}" @click="goNav('Billing')" >
                            <div class="people-circle-parent">
                                <img class="frame-item" alt="" src="~@/components/onboarding/img/userhub/frame-6264122.svg" />
                                <div class="home">Billing</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-inactive-parent">
                <div class="tab-inactive" @click="upgradeVisible = true">
                    <div class="frame-div">
                        <div class="whats-new-parent">
                            <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/whatsnew.svg" />
                            <div class="home">Upgrade</div>
                        </div>
                        <div class="text-badge">
                            <div class="number">
                                <div class="badge-text">50% OFF</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-inactive">
                    <div class="people-circle-parent">
                        <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/contentdownload.svg" />
                        <div class="home">Download</div>
                    </div>
                </div>
                <div class="tab-inactive">
                    <div class="people-circle-parent">
                        <img class="cart-icon" alt="" src="~@/components/onboarding/img/userhub/helpcircle.svg" />
                        <div class="home">Help</div>
                    </div>
                </div>
            </div>

        </div><!--left nav-->

        <div class="content">
            <div v-if="leftNav === 'Setup Guide'" class="page_setup_guide">
                <div class="tt">Welcome to Webex, Barbara!</div>
                <div class="tt2">Let’s get your account all up and running. Here’s what we still need to set up.</div>
                <div class="stepwrap">
                    <div class="t1">Your next steps</div>
                    <div class="bargrp">
                        <div class="bar">
                            <div class="bar1" :style="{width: `${34 * guideStep}%`}"></div>
                        </div>
                        <div class="lbbar">
                            <b>1 of 3</b> complete
                        </div>
                    </div>

                    <div class="cards">
                        <div class="cardlist" :style="{transform: `translateX(${-200 * cardlistPage}px)`}">
                            <div class="card card1">
                                <img src="~@/components/onboarding/img/userhub/step-img-1.svg" />
                                <div class="bot">
                                    <div class="t">Create a Webex account</div>
                                    <div class="st">Great start. Let’s get you up and running.</div>
                                    <div class="btns">
                                        <div class="lft"></div>
                                        <div class="rgt">
                                            <div class="green">
                                                <wl-icon name="check-circle-filled" size="15" color="#1D805F" class="ico"/>
                                                Complete
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card card2">
                                <img v-if="guideStep === 1" src="~@/components/onboarding/img/userhub/step-img-2.svg" />
                                <img v-if="guideStep >= 2" src="~@/components/onboarding/img/userhub/step-img-2b.svg" />
                                <div class="bot">
                                    <div class="t">Download Webex apps</div>
                                    <div class="st">Install Webex on desktop and mobile.</div>

                                    <div v-if="guideStep === 1" class="btns">
                                        <div class="lft">
                                            
                                        </div>
                                        <div class="rgt">
                                            <md-button class="btn md-button-outline btn-30" @click="downloadAppVisible=true">
                                                Start
                                            </md-button>
                                            
                                        </div>
                                    </div>

                                    <div v-if="guideStep >= 2" class="btns">
                                        <div class="lft">
                                            <md-button class="btn md-button-outline btn-30" >Review</md-button>
                                        </div>
                                        <div class="rgt">
                                            <div class="green">
                                                <wl-icon name="check-circle-filled" size="15" color="#1D805F" class="ico"/>
                                                Complete
                                            </div>
                                            
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="card card3" :class="{disabled: guideStep < 2}">
                                <img v-if="guideStep <= 2" src="~@/components/onboarding/img/userhub/step-img-3.svg" />
                                <img v-if="guideStep > 2" src="~@/components/onboarding/img/userhub/step-img-3b.svg" />
                                <div class="bot">
                                    <div class="t">Learn more about the Webex Suite</div>
                                    <div class="st">Explore the other services included with your account.</div>

                                    <div v-if="guideStep <= 2" class="btns">
                                        <div class="lft">
                                            
                                        </div>
                                        <div class="rgt">
                                            <md-button class="btn btn-30" :disabled="guideStep < 2" :class="{'md-button-solid gray': guideStep < 2, 'md-button-outline': guideStep >= 2}" @click="webexSuiteVisible = true">
                                                <fragment v-if="guideStep >= 2">Start</fragment>
                                                <wl-icon v-if="guideStep < 2" name="secure-lock-filled" size="15" />
                                            </md-button>
                                            
                                        </div>
                                    </div>

                                    <div v-if="guideStep >= 3" class="btns">
                                        <div class="lft">
                                            <md-button class="btn md-button-outline btn-30" >Review</md-button>
                                        </div>
                                        <div class="rgt">
                                            <div class="green">
                                                <wl-icon name="check-circle-filled" size="15" color="#1D805F" class="ico"/>
                                                Complete
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card card4" :class="{disabled: guideStep < 3}" :style="{opacity: noInsterest ? 0 : 1}">
                                <img src="~@/components/onboarding/img/userhub/step-img-4.svg" />
                                <div class="bot">
                                    <div class="t">Upgrade your account</div>
                                    <div class="st">Get a special discount if you upgrade. </div>
                                    <div v-if="guideStep >= 3" class="btns">
                                        <div class="lft">
                                            <div class="gray" style="cursor: pointer;" @click="doNotInsterest">
                                                Not interested
                                            </div>
                                        </div>
                                        <div class="rgt">
                                            <md-button class="btn md-button-solid2 btn-30" @click="upgradeVisible = true" >Upgrate</md-button>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                </div>

                <div v-if="!noInsterest && cardlistPage == 1" class="arrbtn arrleft" @click="setCardlistPage(0)" >
                    <wl-icon name="arrow-left-bold" size="16" color="black"/>
                </div>
                <div v-if="!noInsterest && cardlistPage == 0" class="arrbtn arrright" @click="setCardlistPage(1)" >
                    <wl-icon name="arrow-right-bold" size="16" color="black"/>
                </div>

            </div>


            <div v-if="leftNav === 'Profile'" class="">
                <img src="~@/components/onboarding/img/userhub/page-profile.svg" />
            </div>
            <div v-if="leftNav === 'Settings'" class="">
                <img v-if="!settingsHasCalling" src="~@/components/onboarding/img/userhub/page-settings.svg" />
                <img v-if="settingsHasCalling" src="~@/components/onboarding/img/userhub/page-settings-calling.svg" />
            </div>
            <div v-if="leftNav === 'Meetings'" class="">

            </div>
            <div v-if="leftNav === 'Webinars'" class="">
                <img src="~@/components/onboarding/img/userhub/page-webinars.svg" />
            </div>
            <div v-if="leftNav === 'Users'" class="">
                <img src="~@/components/onboarding/img/userhub/page-users.svg" />
            </div>
            <div v-if="leftNav === 'Services'" class="">
                <img v-if="servicesTab==1" src="~@/components/onboarding/img/userhub/page-services-t1.svg" />
                <img v-if="servicesTab==2" src="~@/components/onboarding/img/userhub/page-services-t2.svg" />
                
                <wl-hot :rect="{x:-3,y:11,w:100,h:41}" @click.native="servicesTab = 1" />
                <wl-hot :rect="{x:112,y:12,w:80,h:41}" @click.native="servicesTab = 2"/>
            </div>
            <div v-if="leftNav === 'Devices'" class="">
                <img src="~@/components/onboarding/img/userhub/page-devices.svg" />
            </div>
            <div v-if="leftNav === 'Billing'" class="">
                <img src="~@/components/onboarding/img/userhub/page-billing.svg" />
            </div>

        </div><!--content-->

        <div v-if="preparingAccountVisible" class="modal modalbg">
            <div class="preparing-account" >
                <div class="cont">
                    <img src="~@/components/onboarding/img/userhub/preparing-account.svg" />
                    <div class="spinner48 spinner-animation"></div>
                </div>
                
                <wl-hot :rect="{x:1043,y:23,w:33,h:33}" />

            </div>
        </div><!--modal-->

        <div v-show="accountActivatedVisible" class="modal modalbg">
            <div class="account-activated" >
                <div class="cont">
                    <img src="~@/components/onboarding/img/userhub/account-activated.svg" />
                </div>
                
                <wl-hot :rect="{x:567,y:664,w:77,h:33}" @click.native="accountActivatedVisible = false" />

            </div>
        </div><!--modal-->

        <div v-show="downloadAppVisible" class="modal modalbg">
            <div class="download-app" >
                <div class="cont">
                    <img src="~@/components/onboarding/img/userhub/download-app.svg" />
                </div>

                <wl-hot ref="downloadSelect" :rect="{x:1179,y:372,w:31,h:31}" @click.native="showDownloadSelect" />
                <wl-hot :rect="{x:1049,y:372,w:131,h:31}" @click.native="downloadHistoryVisible = true" />
                <wl-hot :rect="{x:1162,y:694,w:57,h:31}" @click.native="() => {downloadAppVisible = false; guideStep = 2; }" />
                
            </div>
        </div><!--modal-->

        <div v-if="downloadHistoryVisible" ref="downloadprogress" class="download-progress">
            <div class="tt">Download</div>
            <div class="tt2">
                <div class="l">Webex</div>
                <div v-if="downloadPercent == 100" class="r" @click="openTeams">Open file</div>
            </div>
            <div v-if="downloadPercent < 100" class="bar">
                <div class="bar2" :style="{width: `${downloadPercent}%`}"></div>
            </div>
        </div><!--modal-->

        <div v-show="upgradeVisible" class="modal modalbg">
            <div class="upgrade" >
                <div class="cont">
                    <img src="~@/components/onboarding/img/userhub/upgrade.svg" />
                </div>
                
                <wl-hot :rect="{x:1067,y:73,w:31,h:31}" @click.native="upgradeVisible = false"/>

            </div>
        </div><!--modal-->


        <div v-show="webexSuiteVisible" class="modal modalbg">
            <div class="webex-suite" >
                <div v-show="webexSuiteTab === 1" class="">
                    <img src="~@/components/onboarding/img/userhub/webex-suite-t1.svg" />
                </div>
                <div v-show="webexSuiteTab === 2" class="">
                    <img src="~@/components/onboarding/img/userhub/webex-suite-t2.svg" />
                </div>
                <div v-show="webexSuiteTab === 3" class="">
                    <img src="~@/components/onboarding/img/userhub/webex-suite-t3.svg" />
                </div>
                <div v-show="webexSuiteTab === 4" class="">
                    <img src="~@/components/onboarding/img/userhub/webex-suite-t4.svg" />
                </div>
                <div v-show="webexSuiteTab === 5" class="">
                    <img src="~@/components/onboarding/img/userhub/webex-suite-t5.svg" />
                </div>

                <wl-hot :rect="{x:1043,y:23,w:33,h:33}" @click.native="() => {webexSuiteVisible = false; guideStep = 3; setCardlistPage(1); }" />

                <wl-hot :rect="{x:63,y:138,w:486,h:95}" @click.native="webexSuiteTab = 1" />
                <wl-hot :rect="{x:63,y:233,w:486,h:95}" @click.native="webexSuiteTab = 2" />
                <wl-hot :rect="{x:63,y:328,w:486,h:95}" @click.native="webexSuiteTab = 3" />
                <wl-hot :rect="{x:63,y:422,w:486,h:95}" @click.native="webexSuiteTab = 4" />
                <wl-hot :rect="{x:63,y:517,w:486,h:95}" @click.native="webexSuiteTab = 5" />
            </div>
        </div><!--modal-->

        <div v-show="sidecarVisible" class="modal modalbg" @click="sidecarVisible = false">
            <div class="notification-sidecar" @click="(e) => {e.stopPropagation(); e.preventDefault();}">
                <div class="tt">
                    <div class="lb">Notifications</div>
                    <div class="x" @click="sidecarVisible=false">
                        <wl-icon name="cancel-bold" size="18" color="white" />
                    </div>
                </div>
                <img v-if="unreadNotification1" class="itm" src="~@/components/onboarding/img/userhub/sidecar-item1.svg" @click="() => {goNav('Profile'); unreadNum--; sidecarVisible = false; unreadNotification1 = false;}" />
                <img v-if="unreadNotification2" class="itm" src="~@/components/onboarding/img/userhub/sidecar-item2.svg" @click="() => {goNav('Billing'); unreadNum--; sidecarVisible = false; unreadNotification2 = false;}" />

            </div>
        </div><!--modal-->

    </div>
</template>
  
<script>

export default {
    props: {
        defaultNav: {
            type: String,
            default: 'Setup Guide',
        },
        settingsHasCalling: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            leftNav: '',
            servicesTab: 1,
            webexSuiteTab: 1,

            webexSuiteVisible: false,
            upgradeVisible: false,
            accountActivatedVisible: false,
            preparingAccountVisible: false,
            downloadAppVisible: false,
            downloadHistoryVisible: false,
            noInsterest: false,
            sidecarVisible: false,
            downloadPercent: 0,
            unreadNum: 0,
            unreadNotification1: false,
            unreadNotification2: false,

            guideStep: 1,
            cardlistPage: 0,
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
    },
    mounted() {
        this.leftNav = this.defaultNav ? this.defaultNav : 'Setup Guide'
        this.$eventBus.$on('prepare-account', this.prepareAccount)
        this.$eventBus.$on('show-download-history', this.showDownloadHistory)
        document.addEventListener('mousedown', this.mousedown)
        
    },
    beforeDestroy() {
        this.$eventBus.$off('prepare-account', this.prepareAccount)
        this.$eventBus.$off('show-download-history', this.showDownloadHistory)
        document.removeEventListener('mousedown', this.mousedown)
    },
    watch: {
        downloadHistoryVisible(val) {
            if (val) {
                this.startDownload()
            }
        },
    },
    methods: {
        mousedown(e) {
            if (this.downloadPercent == 100 && this.$refs.downloadprogress && !this.$hitTest(this.$refs.downloadprogress, e.pageX, e.pageY)) {
                this.downloadHistoryVisible = false
            }
        },
        prepareAccount() {
            this.preparingAccountVisible = true
            setTimeout(() => {
                this.preparingAccountVisible = false
                this.accountActivatedVisible = true
            }, 3000)
        },
        showDownloadHistory() {
            this.downloadHistoryVisible = !this.downloadHistoryVisible
        },
        showDownloadSelect() {
            this.$popper.show(
            {
              template: `
                <div class="common-menulist" style="width:288px;">
                  <div class='common-menulist-item common-menulist-item-44'  >
                    <span class="lb" >Windows (64 bit)</span>
                    <svg class="suffix" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#FFF"/>
                    </svg>
                  </div>
                  <div class='common-menulist-item common-menulist-item-44' >
                    <span class="lb" >Windows (32 bit)</span>
                  </div>
                  <div class='common-menulist-item common-menulist-item-44' >
                    <span class="lb" >macOS (Intel chip)</span>
                  </div>
                  <div class='common-menulist-item common-menulist-item-44' >
                    <span class="lb" >macOS (Apple silicon chip)</span>
                  </div>
                  <div class='common-menulist-item common-menulist-item-44' >
                    <span class="lb" >Linux (.DEB)</span>
                  </div>
                  <div class='common-menulist-item common-menulist-item-44' >
                    <span class="lb" >Linux (.RPM)</span>
                  </div>
                </div>
              `,
              props: [],
              methods: {

              }
            },
            {
            }, // component props
            {
              reference: this.$refs.downloadSelect.$el,
              name: 'download-select',
              arrowVisible: false,
              roundedCorner: false,
              frameless: true,
              shadow: false,
              appendToBody: true,
              theme: `${this.theme} ${this.themeColor}`,
              closeTrigger: 'mousedown',
              options: {
                placement: 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-130, 0],
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
        startDownload() {
            if (this.downloadPercent == 0) {
                this.$eventBus.$emit('download-icon-visible', true)

                let itv = setInterval(() => {
                    this.downloadPercent++

                    if (this.downloadPercent == 100) {
                        clearInterval(itv)
                    }
                }, 0)
            } 
            
        },
        setCardlistPage(p) {
            this.cardlistPage = p
        },
        doNotInsterest() {
            this.noInsterest = true
            this.setCardlistPage(0)
            this.unreadNum = 2
            this.unreadNotification1 = true
            this.unreadNotification2 = true


            this.$popper.show(
            {
              template: `
                <div class="popper-coachmark-notification" style="width:328px; height:200px;">
                    <wl-hot :rect="{x:279,y:30,w:22,h:22}" @click.native="close" />
                    <wl-hot :rect="{x:28,y:124,w:54,h:26}" @click.native="close" />
                </div>
              `,
              props: [],
              methods: {
                close() {
                    this.$popper.hideAll()
                },
              }
            },
            {
            }, // component props
            {
              reference: this.$refs.notificon,
              name: 'notify',
              arrowVisible: false,
              roundedCorner: false,
              frameless: true,
              shadow: false,
              appendToBody: true,
              theme: `${this.theme} ${this.themeColor}`,
              closeTrigger: 'mousedown',
              options: {
                placement: 'bottom',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -15],
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
        goNav(nav) {
            this.leftNav = nav
        },
        showNotificationSidecar() {
            this.sidecarVisible = true
        },
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
        
    },
};
</script>
  
<style lang="scss">
.my-webex-meetings {
    background: rgb(24,24,24);

    img {
        -webkit-user-drag: none;
    }

    .rest-icon,
    .rest-icon1 {
        position: absolute;
        border-radius: 18.97px;
        width: 34.15px;
        height: 34.15px;
    }

    .rest-icon {
        top: calc(50% + 32.83px);
        left: 244.74px;
        opacity: 0;
    }

    .rest-icon1 {
        top: calc(50% + 33.77px);
        left: 1318.57px;
    }

    .badge-text {
        position: relative;
        line-height: 100%;
        pointer-events: none;
    }

    .number,
    .number-badge {
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .number {
        display: flex;
    }

    .number-badge {
        position: absolute;
        top: 22.77px;
        left: 1182.92px;
        border-radius: 94.86px;
        background-color: #d4371c;
        display: none;
        padding: 3.7944445610046387px 5.691666603088379px;
    }

    .bg-icon,
    .logo-white-icon {
        position: absolute;
        max-width: 100%;
        overflow: hidden;
    }

    .bg-icon {
        width: 100%;
        top: calc(50% - 41.48px);
        right: 0;
        left: 0;
        height: 83.48px;
    }

    .logo-white-icon {
        height: 58.37%;
        width: 35.2%;
        top: 10%;
        right: 62.97%;
        bottom: 31.63%;
        left: 1.84%;
        max-height: 100%;
    }

    .user-hub {
        position: absolute;
        top: 6px;
        left: 107.19px;
        line-height: 100%;
    }

    .logo-white-parent {
        position: absolute;
        height: calc(100% - 45.53px);
        top: 22.77px;
        bottom: 22.77px;
        left: 15.18px;
        width: 258.02px;
    }

    .icn-icon {
        height: 100%;
        width: 100%;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        max-width: 100%;
        overflow: hidden;
        max-height: 100%;
    }

    .as,
    .icn-icon,
    .initial-36 {
        position: absolute;
    }

    .as {
        height: 42.86%;
        width: 64.29%;
        top: 28.57%;
        left: 17.86%;
        line-height: 100%;
        font-weight: 300;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .initial-36 {
        top: calc(50% - 18.97px);
        right: 0;
        width: 37.94px;
        height: 37.94px;
    }

    .cart-icon,
    .frame-child {
        position: relative;
        flex-shrink: 0;
    }

    .cart-icon {
        width: 22.77px;
        height: 22.77px;
        overflow: hidden;
    }

    .frame-child {
        width: 36.05px;
        height: 36.05px;
    }

    .cart-parent {
        position: absolute;
        top: 0.95px;
        left: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 30.36px;

        .badge {
            @include flex;
            position: absolute;
            width: 19px;
            height: 19px;
            background: #1170CF;
            border-radius: 50%;
            top: -4px;
            right: -3px;
        }
    }

    .initial-36-parent {
        position: absolute;
        height: calc(100% - 45.53px);
        top: 22.77px;
        right: 30.36px;
        bottom: 22.77px;
        width: 225.77px;
        font-size: 13.28px;
        color: #fff;
    }

    .logo-wbx,
    .top-bar-end2end {
        position: absolute;
        left: 0;
        height: 84px;
    }

    .logo-wbx {
        width: 100%;
        top: calc(50% - 41.48px);
        border: none;
    }

    .top-bar-end2end {
        top: 0;
        width: 1366px;
        text-align: center;
        font-size: 21.82px;
        color: rgba(255, 255, 255, 0.95);
    }

    .home {
        position: relative;
        line-height: 20.87px;
        font-weight: 500;
    }

    .people-circle-parent {
        position: absolute;
        top: 7.59px;
        left: 11.38px;
        width: 166.96px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 11.38px;
    }

    .tab-active {
        background-color: #c9c9c9;
        display: none;
        color: #000;
    }

    .tab-active,
    .tab-inactive {
        position: relative;
        border-radius: 94.86px;
        width: 189.72px;
        height: 37.94px;
        flex-shrink: 0;
        user-select: none;

        img {
            opacity: .7;
        }

        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
            img {
                opacity: 1;
            }
        }
        &:active {
            background-color: rgba(255, 255, 255, 0.3);
            img {
                opacity: 1;
            }
        }
    }

    .tab-active-parent {
        gap: 7.59px;
    }

    .frame-wrapper,
    .tab-active-parent {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .personal {
        position: absolute;
        top: 7.59px;
        left: 11.38px;
        line-height: 100%;
        display: inline-block;
        width: 166.96px;
    }

    .nav-header {
        position: relative;
        width: 189.72px;
        height: 26.56px;
        flex-shrink: 0;
    }

    .number-badge1 {
        position: absolute;
        top: 9.49px;
        left: 159.37px;
        border-radius: 94.86px;
        background-color: #1170cf;
        display: flex;
        flex-direction: row;
        padding: 3.7944445610046387px 5.691666603088379px;
        align-items: flex-start;
        justify-content: flex-start;
        font-size: 11.38px;
        color: #fff;
    }

    .frame-item,
    .tab-active1 {
        position: relative;
        flex-shrink: 0;
    }

    .tab-active1 {
        border-radius: 94.86px;
        background-color: rgba(255, 255, 255, 0.2);
        width: 189.72px;
        height: 37.94px;
        color: rgba(255, 255, 255, 0.95);

        img {
            opacity: 1;
        }
    }

    .frame-item {
        width: 22.77px;
        height: 22.77px;
    }

    .tab-active-group {
        gap: 1.9px;
        font-size: 13.28px;
        color: rgba(255, 255, 255, 0.7);
    }

    .frame-parent,
    .nav-header-parent,
    .tab-active-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .nav-header-parent {
        gap: 3.79px;
        font-size: 11.38px;
        color: rgba(255, 255, 255, 0.95);
    }

    .frame-parent {
        position: absolute;
        top: 9.49px;
        left: 11.38px;
        gap: 22.77px;
    }

    .text-badge,
    .whats-new-parent {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .whats-new-parent {
        gap: 11.38px;
    }

    .text-badge {
        border-radius: 3.79px;
        background-color: #1170cf;
        height: 18.97px;
        padding: 3.7944445610046387px 7.588889122009277px;
        box-sizing: border-box;
        opacity: 0;
        font-size: 11.38px;
        color: #fff;
    }

    .frame-div,
    .tab-inactive-parent {
        position: absolute;
        left: 11.38px;
        display: flex;
    }

    .frame-div {
        top: 7.59px;
        width: 166.96px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .tab-inactive-parent {
        bottom: 11.67px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 3.79px;
    }

    .nav-left-smb-b {
        position: absolute;
        top: 83.1px;
        left: 0;
        width: 231px;
        height: 698px;
        overflow: hidden;
        font-size: 13.28px;
        color: rgba(255, 255, 255, 0.7);
    }


    .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;

        position: absolute;
        width: 1134.54px;
        height: 909.72px;
        left: 231.46px;
        top: 83.48px;

        border-radius: 11.3833px 0px 0px 0px;
        overflow: hidden;
    }

    .modal {
        @include flex;
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        

        &.modalbg {
            background-color: rgba($color: #000000, $alpha: .6);
            pointer-events: all;
        }

        .preparing-account {
            position: relative;

            .cont {
                @include flex;
                width: 100%;
                height: 100%;

                img {
                    margin-top: 45px;
                }
            }
            .spinner48 {
                position: absolute;
                width: 48px;
                height: 48px;
                top: calc((100% - 48px)/2 + 80px);
                left: calc((100% - 48px)/2);
            }
        }

        .account-activated {
            position: relative;

            .cont {
                @include flex;
                width: 100%;
                height: 100%;

                img {
                    margin-top: 4px;
                }
            }
        }
        .upgrade {
            position: relative;

            .cont {
                @include flex;
                width: 100%;
                height: 100%;

                img {
                    margin-top: 45px;
                }
            }
        }

        .webex-suite {
            position: relative;
            width: 1120px;
            height: 661px;

        }

    }

    .download-progress {
        position: absolute;
        top: 2px;
        right: 2px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 12px;

        width: 349px;
        background: #FFFFFF;
        border: 1px solid #E6E6E6;
        border-radius: 8px;

        color: rgba($color: #000000, $alpha: .95);
        user-select: none;

        .tt {
            width: 100%;
            font-weight: 700;
            font-size: 12px;
            border-bottom: 1px solid #EDEDED;
            padding-bottom: 10px;
            margin-top: -4px;
        }

        .tt2 {
            @include flex;
            margin-top: 10px;
            margin-bottom: 2px;
            width: 100%;

            .l {
                font-size: 12px;
                flex-grow: 1;
            }
            .r {
                font-size: 10px;
                text-decoration-line: underline;
                color: #557DA2;
                cursor: pointer;
            }
        }

        .bar {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;
            width: 325px;
            height: 6px;
            background: #E6E6E6;
            border-radius: 3px;
            overflow: hidden;

            .bar2 {
                position: absolute;
                background: #557DA1;
                border-radius: 4px;
                height: 100%;
                width: 0%;
            }
        }
    }

    .notification-sidecar {
        position: absolute;
        right: 0;
        top: 84px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 30px 22px 0px 30px;
        width: 384px;
        height: 919px;
        background: #262626;
        box-shadow: inset 0.948611px 0.948611px 0px rgba(0, 0, 0, 0.16);
        border-radius: 12px 0px;
        user-select: none;
        transition: all .3s ease-in-out;

        .tt {
            @include flex;
            width: 100%;
            margin-bottom: 22px;

            .lb {
                flex-grow: 1;
                font-size: 15px;
                font-weight: 600;
            }
            .x {
                @include flex;
                width: 20px;
                height: 20px;
            }
        }

        .itm {
            margin-bottom: 12px;
            cursor: pointer;
        }
    }

}


.page_setup_guide {
    position: relative;
    @include flex(column, flex-start, flex-start);
    flex-grow: 1;
    width: 100%;
    background: linear-gradient(180deg, #262626 0%, #0F0F0F 100%);

    .tt {
        font-weight: 700;
        font-size: 30px;
        margin: 12px 0 2px 30px;
        opacity: .95;
    }
    .tt2 {
        font-weight: 400;
        font-size: 15.1778px;
        opacity: .7;
        margin: 0 0 34px 30px;
    }
    .stepwrap {
        background-color: rgba($color: #FFF, $alpha: 0.02);
        border-radius: 12px;
        margin: 0 30px;
        width: calc(100% - 60px);

        .t1 {
            font-size: 18px;
            font-weight: 600;
            margin: 20px 20px 6px 20px;
        }
        .bargrp {
            @include flex;
            margin: 0 20px 24px 20px;
            height: 16px;

            .bar {
                position: relative;
                width: 915px;
                height: 16px;
                border-radius: 8px;
                background: #3B3B3B;
                overflow: hidden;

                .bar1 {
                    position: absolute;
                    height: 16px;
                    background: #1D805F;
                    transition: all 0.5s;
                    border-radius: 8px;
                }
            }

            .lbbar {
                @include flex(row, flex-end);
                flex-grow: 1;
                color: rgba(255, 255, 255, 0.7);
                font-size: 13px;

                b {
                    margin-right: 3px;
                }
            }
        }

        .cards {
            position: relative;
            overflow: hidden;
            margin: 0 20px;

            .cardlist {
                position: relative;
                display: flex;
                flex-wrap: nowrap;
                transition: all .3s ease-in-out;
                
                .card {
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding: 0px;
                    isolation: isolate;
                    width: 284.58px;
                    height: 462.05px;
                    background: #000000;
                    border: 0.948611px solid #3B3B3B;
                    border-radius: 11.3833px;
                    flex: none;
                    order: 0;
                    align-self: stretch;
                    flex-grow: 0;
                    overflow: hidden;
                    margin-right: 32px;
                    transition: all .3s ease-in-out;

                    &.disabled {
                        img, .bot {
                            opacity: .3;
                        }
                        
                    }

                    .bot {
                        @include flex(column, flex-start, flex-start);
                        flex-grow: 1;
                        margin: 22px;
                        
                        .t {
                            margin: 0 22px 0 0;
                            font-weight: 700;
                            font-size: 18px;
                            opacity: .95;
                        }
                        .st {
                            font-size: 13px;
                            opacity: .7;
                            margin: 0 0 2px 0;
                            flex-grow: 1;
                        }
                        .btns {
                            @include flex(row, space-between);
                            width: 100%;

                            .lft {
                                @include flex(row, flex-start);

                                .gray {
                                    @include flex;
                                    font-size: 13px;
                                    padding: 0 10px;
                                    opacity: .7;

                                }
                                
                            }
                            .rgt {
                                @include flex(row, flex-end);

                                .green {
                                    @include flex;
                                    font-size: 13px;
                                    color: #1D805F;
                                    padding: 0 10px;

                                    .ico {
                                        margin-right: 4px;
                                    }
                                }
                            }
                            .btn-30 {
                                height: 30px;
                                font-size: 13px;
                                line-height: 0;
                                padding: 0 24px;
                            }
                        }
                    }

                }
            }

            
        }
        
    }

    .arrbtn {
        position: absolute;
        @include flex;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.95);

        &:hover {
            background: rgba(255, 255, 255, 1);
        }
        
        &.arrleft {
            left: 33px;
            top: 350px;
        }
        &.arrright {
            right: 35px;
            top: 350px;
        }
    }

}


.popper-coachmark-notification {
    background-image: url(~@/components/onboarding/img/userhub/coachmark-notification.svg);
    background-repeat: no-repeat;
}

</style>
  