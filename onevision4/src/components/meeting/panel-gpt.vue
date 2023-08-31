<template>
    <div class="gpt_panel" ref="gptpanel">
        <div class="gpt_panel_wrap" :class="[theme]">
            <panel-header class="pheader" :title="!meetingId ? title : titleMeeting" :titleStyle="{
                fontSize: '18px',
            }" :type="'ai'" :floating="gptPanelPopouted && !meetingId || inMeetingGptPanelPopouted && meetingId" :popoutVisible="true" :moreVisible="false" @close="close"
                @popout="popoutPopin">
                <div slot="icons" class='cleanup-icon' @click.stop="showCleanupConfirm">
                    <wl-icon name="clean-up-bold" size="16" />
                </div>
            </panel-header>

            <wl-alertbanner v-if="sidecarSettings.global.alert.visible" :show="true" :icon="sidecarSettings.global.alert.icon" :content="sidecarSettings.global.alert.msg"
            :closeButtonVisible="true" :narrow="true" class="aimsgitem-alert" @close="closeAlertbanner" />
            
            <wl-scrollbar ref='scrollpane' class="scrollpane" :alwaysVisible="true"
                :arrowVisible="$store.state.os === 'win'" :theme="theme === 'dark' ? 'dark' : 'light'"
                @scroll="checkAiAnimationVisibility">
                <div class="list" 
                    ref="scrollcontent" 
                    :style="{ 
                        minHeight: scrollContentMinHeight,
                    }">
                    <ai-msg-item v-for="(p, index) in sidecarMsglist" :key="`index${index}`" :uid="Math.random().toString()"
                        :type="p.type" 
                        :commandName="p.commandName" 
                        :time="p.time" 
                        :icon="p.icon" 
                        :title="p.title" 
                        :msg="p.msg" 
                        :msgs="p.msgs" 
                        :activeSpace="p.activeSpace"
                        :header="p.header"
                        :buttons="p.buttons" 
                        :completefunc="p.completefunc" 
                        :upcomingMeeting="p.upcomingMeeting" 
                        :meetingSummary="p.meetingSummary" 
                        :frame="p.frame"
                        @funccalled="msgFuncCalled"
                        @resized="autoLayout"
                        ></ai-msg-item>

                </div>

            </wl-scrollbar>
            <div v-if="!meetingId" class="float-actions-switcher" :style="{ backgroundColor: (gptPanelPopouted && !meetingId || inMeetingGptPanelPopouted && meetingId) ? '#1A1A1A' : themeColorList[theme][themeColor]['app'][1] }">
                <div 
                    class="btnswitcher" 
                    ref="btnswitcher" 
                    :class="{
                        active: switcherMenuVisible,
                        disabled: teamsNav == 'messaging' && !activeSpaceId,
                    }" 
                    @click="showSwitcherMenu"
                >
                    <span class="lb">{{ sidecarSelectedCommandTypeName }}</span>
                    <wl-icon v-if="!switcherMenuVisible && (activeSpaceId || teamsNav != 'messaging')" name="arrow-down-bold" size="16" class="ico" />
                    <wl-icon v-if="switcherMenuVisible && (activeSpaceId || teamsNav != 'messaging')" name="arrow-up-bold" size="16" class="ico" />
                </div>
            </div>
            <div class="float-actions" :style="{ backgroundColor: (gptPanelPopouted && !meetingId || inMeetingGptPanelPopouted && meetingId) ? '#1A1A1A' : themeColorList[theme][themeColor]['app'][1] }">
                <md-button v-for="(btn, idx) in buttonList" :key="`btn${idx}`" class="action-btn" :class="btn.class"
                    aria-label="x" :size="btn.size" :disabled="btn.disabled" @click="() => {
                        if (btn.func) {
                            msgFuncCalled(btn)
                        }
                    }">
                    {{ btn.label }}
                </md-button>
            </div>

            <div class='inputbox' id="space-content-inputbox">
                <textarea class="gptinput" ref="input" :placeholder="`Ask AI anything...`" :value="message"
                    @click="inputClick" @input="autoChangeHeight" @keydown.enter="sendmsg" ></textarea>
                <div class="send" :class="{ disabled: !message }" :disabled="!message" @click="sendmsg">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14.725 7.55265L1.72502 1.05265C1.6373 1.0088 1.53862 0.991692 1.44126 1.00347C1.3439 1.01524 1.25214 1.05537 1.17741 1.11887C1.10267 1.18237 1.04824 1.26644 1.0209 1.36063C0.993559 1.45481 0.994503 1.55495 1.02362 1.6486L3.00112 8L1.02362 14.3515C0.994433 14.4451 0.993442 14.5453 1.02077 14.6395C1.04809 14.7337 1.10253 14.8178 1.17729 14.8813C1.25206 14.9448 1.34385 14.9849 1.44124 14.9966C1.53863 15.0083 1.63732 14.9912 1.72502 14.9472L14.725 8.4472C14.8081 8.40569 14.878 8.34185 14.9268 8.26285C14.9757 8.18385 15.0015 8.09281 15.0015 7.99993C15.0015 7.90705 14.9757 7.816 14.9268 7.737C14.878 7.658 14.8081 7.59417 14.725 7.55265ZM2.32732 2.4721L12.383 7.5H3.89267L2.32732 2.4721ZM3.89267 8.5H12.383L2.32732 13.5278L3.89267 8.5Z"
                            fill="white" fill-opacity="0.4" />
                    </svg>
                </div>
                <svg class="icobefore" width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 7C14.3284 7 15 6.32843 15 5.5C15 4.67157 14.3284 4 13.5 4C12.6716 4 12 4.67157 12 5.5C12 6.32843 12.6716 7 13.5 7ZM3 11.75C3 9.40279 4.90279 7.5 7.25 7.5C9.59721 7.5 11.5 9.40279 11.5 11.75C11.5 14.0972 9.59721 16 7.25 16C4.90279 16 3 14.0972 3 11.75ZM7.25 5.5C3.79822 5.5 1 8.29822 1 11.75C1 15.2018 3.79822 18 7.25 18C10.7018 18 13.5 15.2018 13.5 11.75C13.5 8.29822 10.7018 5.5 7.25 5.5Z" fill="url(#paint0_linear_2_10103)"/>
                    <defs>
                    <linearGradient id="paint0_linear_2_10103" x1="16" y1="3" x2="0" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#3CC29A"/>
                    <stop offset="1" stop-color="#0672EF"/>
                    </linearGradient>
                    </defs>
                </svg>

                <div class="clr-border"></div>

            </div>
        </div>

    </div>
</template>
  
<script>
import popThisPanel from "./panel-gpt.vue";
import dialog from '../shared/dialog.vue';
import contextMenu from '../shared/contextmenu.vue';

export default {
    props: {
        layout: String,
        meetingId: String,
        onloadFuncName: String,
    },
    data() {
        return {
            title: "Webex AI",
            titleMeeting: "Webex meeting AI",
            panelName: 'popout-panel-gpt',

            message: '',
            meetingStarted: false,
            transitionDisabled: true,
            scrollContentMinHeight: '',
            scrollContentPaddingBottom: '',
            resizeObserver: null,
            doNotScrollToEnd: false,
            scrollToHalfEnd: false,
            meetingRecapped: false,
            switcherMenuVisible: false,
            actionTypes: {
                global: 'In entire app',
                messaging: 'In: ',
                contacts: 'In contacts tab',
                calling: 'In Calling tab',
                meetings: 'In Meetings tab',
            },
            actionButtons: {
                global: [
                    {
                        label: 'Catch me up',
                        class: 'md-button-outline',
                        size: 24,
                        func: {
                            name: 'catchMeUp',
                        }
                    },
                ],
                messaging: [
                    {
                        label: 'Recap space',
                        class: 'md-button-outline',
                        size: 24,
                        func: {
                            name: 'recapSpace',
                        }
                    },
                    {
                        label: 'Summarize new messages',
                        class: 'md-button-outline',
                        size: 24,
                        func: {
                            name: 'summarizeNewMessages',
                        }
                    },
                ],
                contacts: [
                   
                ],
                calling: [
                    
                ],
                meetings: [
                    {
                        label: 'Catch up with missed meeting',
                        class: 'md-button-outline',
                        size: 24,
                        func: {
                            name: 'catchUpWithMissedMeeting',
                        }

                    },
                    {
                        label: 'Prepare for next meeting',
                        class: 'md-button-outline',
                        size: 24,
                        func: {
                            name: 'askAiToPrepareMeeting',
                        }
                    },
                ],
                inmeetingRecap: [
                    {
                        label: 'Recap meeting so far',
                        class: 'md-button-outline',
                        size: 24,
                        func: {
                            name: 'recapMeetingSofar',
                        }

                    },
                    {
                        label: 'Was my name mentioned?',
                        class: 'md-button-outline',
                        size: 24,
                        func: {
                            name: 'wasMyNameMentioned',
                        }
                    },
                ],
                inmeeting: [
                    {
                        label: 'Was my name mentioned?',
                        class: 'md-button-outline',
                        size: 24,
                        func: {
                            name: 'wasMyNameMentioned',
                        }

                    },
                    {
                        label: 'View full transcript',
                        class: 'md-button-outline',
                        size: 24,
                    },
                ],
            },
        };
    },
    computed: {
        theme() {
            return this.$store.state.theme;
        },
        themeColor() {
            return this.$store.state.themeColor;
        },
        themeColorList() {
            return this.$store.state.themeColorList;
        },
        panelVisible() {
            return this.$store.state.panelVisible;
        },
        gptPanelPopouted() {
            return this.$store.state.gptPanelPopouted;
        },
        inMeetingGptPanelVisible() {
            return this.$store.state.inMeetingGptPanelVisible;
        },
        inMeetingGptPanelPopouted() {
            return this.$store.state.inMeetingGptPanelPopouted;
        },
        me() {
            return this.$store.getters.me;
        },
        teamsNav() {
            return this.$store.state.teamsNav;
        },
        activeSpaceId() {
            return this.$store.state.activeSpaceId;
        },
        activeSpace() {
            return this.$store.getters.activeSpace;
        },
        teamsSidecarName() {
            return this.$store.state.teamsSidecarName;
        },
        meetingsSidecarVisible() {
            return this.$store.state.meetingsSidecarVisible;
        },
        sidecarGlobalMsgList() {
            return this.$store.state.sidecarGlobalMsgList;
        },
        //sidecarSpaceMsgList() {
        //    return this.$store.state.sidecarSpaceMsgList;
        //},
        sidecarInMeetingMsgList() {
            return this.$store.state.sidecarInMeetingMsgList;
        },
        sidecarSettings() {
            return this.$store.state.sidecarSettings;
        },
        sidecarSelectedCommandType() {
            return this.$store.state.sidecarSelectedCommandType;
        },
        sidecarSelectedCommandTypeName() {
            return this.$store.state.sidecarSelectedCommandTypeName;
        },
        sidecarKeepGlobalCommand() {
            return this.$store.state.sidecarKeepGlobalCommand;
        },
        sidecarMsglist() {
            if (this.meetingId) {
                return this.$store.state.sidecarInMeetingMsgList
            }

            let msglst = this.$store.state.sidecarGlobalMsgList.slice()
            let settings = this.sidecarSettings[this.sidecarSelectedCommandType]

            /*
            let empty = true
            for(let i=0; i<msglst.length; i++){
                let m = msglst[i]
                if(['responding', 'result', 'meeting-summary', 'upcoming-meeting'].indexOf(m.type) > -1){
                    empty = false
                    break
                }
            }
            */
            if (settings && !settings.touched && settings.tip) {
                msglst.push(settings.tip)
                this.autoLayout()
            }

            return msglst

        },
        buttonList() {
            if (this.meetingId) {
                return this.meetingRecapped ? this.actionButtons['inmeeting'] : this.actionButtons['inmeetingRecap']
            }
            if (this.sidecarSelectedCommandType == 'messaging') {
                if (!this.activeSpaceId) {
                    return this.actionButtons['global']
                } else {
                    return this.actionButtons['messaging']
                }
            } else if (this.actionButtons[this.sidecarSelectedCommandType]) {
                return this.actionButtons[this.sidecarSelectedCommandType]
            }
            return []
        },
    },
    beforeMount() {
        this.panelName = this.meetingId ? 'popout-in-meeting-panel-gpt' : 'popout-panel-gpt'
    },
    mounted() {

        window.addEventListener('keydown', this.onKeydown);
        this.$eventBus.$on('teams-resizing', this.onAppResizing);
        this.$eventBus.$on('catch-me-up', this.catchMeUp);

        // watch resize
        const elem = this.$refs.gptpanel;
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
            if ((entry.contentBoxSize || entry.contentRect)) {
                this.doNotScrollToEnd = true
                this.setScrollContentPaddingBottom(); 
            }
            }
        });
        this.resizeObserver.observe(elem);

        this.onAppResizing()
        this.autoLayout()
        this.setCommandType(this.teamsNav)

        if(this.onloadFuncName) {
            this[this.onloadFuncName]()
        }
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.onKeydown);
        this.$eventBus.$off('teams-resizing', this.onAppResizing);
        this.$eventBus.$off('catch-me-up', this.catchMeUp);

        const elem = this.$refs.gptpanel;
        this.resizeObserver.unobserve(elem);
        this.resizeObserver = null;
    },
    

    watch: {
        inMeetingGptPanelVisible(newVal) {
            if(!this.meetingId) {
                return
            }
            let peopleList = this.$store.state.peopleList.slice()
            if (newVal) {
                if (!peopleList.find(
                    people => people.name === 'WebexGPT'
                )) {
                    peopleList.push(this.$store.state.webexGPT)
                    //this.$store.commit('gridViewPeopleFocus', true);
                    this.$store.commit('peopleList', peopleList);
                }

            }

            if (!newVal && this.inMeetingGptPanelPopouted) {
                this.$store.commit('inMeetingGptPanelPopouted', false);
                this.$modal.hide(this.panelName);
            }
        },
        sidecarGlobalMsgList() {
            this.autoLayout()
        },

        sidecarInMeetingMsgList() {
            this.autoLayout()
        },
        activeSpaceId() {
            this.setCommandType(this.teamsNav)
        },
        teamsNav(val) {
            this.setCommandType(val)
        },
    },
    methods: {
        onAppResizing() {
            const rec = this.$refs.scrollpane.$el.getBoundingClientRect()
            this.scrollContentMinHeight = `${rec.height}px`
        },

        close() {
            if (this.gptPanelPopouted && !this.meetingId || this.inMeetingGptPanelPopouted && this.meetingId) {
                this.$modal.hide(this.panelName);
            }
            if (this.meetingId) {
                this.$store.commit('inMeetingGptPanelVisible', false);
                this.$store.commit('sidePanelIsOpen', false);
            } else {
                this.$store.commit('teamsSidecarName', null);
                if (this.$store.state.teamsNav === 'webexgpt') {
                    this.$store.commit('teamsNav', this.$store.state.teamsNavPrev);
                }
            }

            if (this.gptPanelPopouted && !this.meetingId) {
                setTimeout(() => this.$store.commit('gptPanelPopouted', false), 100);
            }else if(this.inMeetingGptPanelPopouted && this.meetingId){
                setTimeout(() => this.$store.commit('inMeetingGptPanelPopouted', false), 100);
            }

        },

        setCommandType(val) {
            let nav = val
            if(this.sidecarKeepGlobalCommand || nav == 'messaging' && !this.activeSpaceId){
                nav = 'global'
            }
            let lst = this.getSwitcherMenu()
            let menuitm = lst.find(
                itm => itm.value === nav
            )

            this.$store.commit('sidecarSelectedCommandType', nav);
            this.$store.commit('sidecarSelectedCommandTypeName', menuitm.label);
        },
        getSwitcherMenu() {
            let lst = []
            lst.push({
                label: this.actionTypes['global'],
                value: 'global',
                checked: this.sidecarSelectedCommandType == 'global',
            })
            if(this.teamsNav == 'messaging' && this.activeSpaceId) {
                lst.push({
                    label: `${this.actionTypes[this.teamsNav]}${this.activeSpace.name}`,
                    value: this.teamsNav,
                    checked: this.sidecarSelectedCommandType == this.teamsNav,
                })
            }else{
                lst.push({
                    label: this.actionTypes[this.teamsNav],
                    value: this.teamsNav,
                    checked: this.sidecarSelectedCommandType == this.teamsNav,
                })
            }
            return lst
        },
        showSwitcherMenu() {
            if(this.teamsNav == 'messaging' && !this.activeSpaceId) {
                return
            }
            if(this.switcherMenuVisible) {
                this.$popper.hide('switchermenu');
                return
            }
            this.$popper.show(
                contextMenu,
                {
                    minWidth: '280px',
                    items: this.getSwitcherMenu(),
                    onSelect: (itm) => { 
                        this.$store.commit('sidecarSelectedCommandType', itm.value);
                        this.$store.commit('sidecarSelectedCommandTypeName', itm.label);
                        this.$store.commit('sidecarKeepGlobalCommand', itm.value == 'global');

                        this.$nextTick(() => {
                            this.autoLayout()
                        })
                    },
                }, // component props
                {
                name: 'switchermenu',
                reference: this.$refs.btnswitcher,
                transitionEnabled: false,
                closeTrigger: 'mousedown',
                arrowVisible: false,
                roundedCorner: true,
                borderRadius: '12px',
                appendToBody: true,
                theme: `${this.theme} ${this.themeColor}`,
                options: {
                    placement: 'top-start', 
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
                opened: () => {this.switcherMenuVisible = true},
                closed: () => {this.switcherMenuVisible = false},
                } // popper eventlistener
            );
        },

        setTouched() {
            let sidecarSettings = this.$deepClone(this.sidecarSettings)
            let settings

            if (this.teamsNav == 'messaging') {
                if (!this.activeSpaceId) {
                   settings = sidecarSettings['global'] 
                } else {
                    settings = sidecarSettings['messaging'] 
                }
            } else if (this.actionButtons[this.teamsNav]) {
                settings = sidecarSettings[this.teamsNav]
            }
            
            if (!settings) {
                settings = {}
            }
            settings.touched = true

            console.log(settings, sidecarSettings)

            this.$store.commit('sidecarSettings', sidecarSettings)
        },

        cleanup() {
            if (this.meetingId) {
                this.$store.commit('sidecarInMeetingMsgList', [])
            }
            this.$store.commit('sidecarGlobalMsgList', [])

        },

        showCleanupConfirm() {
            this.showDialog(
                ``, 
                `Clean up history?`, 
                `The AI history so far will be permanently deleted, are you sure to clean them up?`,
                [
                    {
                        title: 'Clean up',
                        class: 'md-button--red',
                        func: () => {
                            this.cleanup()
                        },
                    },
                    {
                        title: 'Cancel',
                        class: 'md-button-outline',
                    },
                ],
                `#desktop`)
        },

        showDialog(headerTitle, title, message, buttons, parentSelector) {
            var dgwidth = 400
            var dgheight = 188
            var parentel = document.querySelector(parentSelector)
            var rect = parentel.getBoundingClientRect()
            var top = rect.top + (rect.height - dgheight)/2
            var left = rect.left + (rect.width - dgwidth)/2

            this.$modal.show(
            dialog, 
            {
                topbarTitle: headerTitle,
                title: title,
                message: message,
                buttons: buttons,
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
                closed: () => {  }
            } // modal eventlistener
            );
        },

        popoutPopin() {
            if ((!this.meetingId && !this.gptPanelPopouted ) || (this.meetingId && !this.inMeetingGptPanelPopouted )) {
                this.$modal.show(
                    popThisPanel,
                    {
                        layout: 'panel',
                        meetingId: this.meetingId,
                    }, // component props
                    {
                        name: this.panelName,
                        clickToClose: false,
                        frameless: false,
                        shadow: true,
                        resizable: true,
                        draggable: '.pheader',
                        overlayVisible: false,
                        overlayTransparent: 0,
                        theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
                        roundedCorner: true,
                        center: true,
                        minWidth: 300,
                        minHeight: 300,
                        width: 360,
                        height: 600,
                        shiftX: this.meetingId ? 0.90 : 0.95,
                        shiftY: this.meetingId ? 0.4 : 0.3,

                    }, // modal props
                    {
                        closed: () => { },
                    } // modal eventlistener
                );
            } else {
                this.$modal.hide(this.panelName)
                if(!this.meetingId && this.meetingsSidecarVisible) {
                    this.$store.commit('meetingsSidecarVisible', false)
                    this.$store.commit('teamsSidecarName', 'ai-global')
                }
            }

            if (!this.meetingId) {
                this.$store.commit("gptPanelPopouted", !this.gptPanelPopouted)
            } else {
                this.$store.commit("inMeetingGptPanelPopouted", !this.inMeetingGptPanelPopouted)
            }
            

        },




        onKeydown(evt) {
            //console.log('evt.code', evt.code, evt.altKey);
            if (this.layout === 'fullsize') {
                return
            }

            if (evt.code == 'ArrowRight') {
                //
            } else if (evt.code == 'ArrowLeft') {
                //
            }

        },

        msgFuncCalled(obj) {
            if (obj.func && obj.func.name && this[obj.func.name]) {
                this[obj.func.name](obj.func.params)
            }
        },

        tagClickHandler(meetingTitle) {

            let selectedMeeting = {
                title: meetingTitle,
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
                
                windowtitle: 'Meeting recaps',
            }, {})
            
        },

        // callback functions ------start
        closeAlertbanner() {
            let sidecarSettings = this.$deepClone(this.sidecarSettings)
            let settings = sidecarSettings['global'] 
            settings.alert.visible = false
            this.$store.commit('sidecarSettings', sidecarSettings)
        },
        closeAlert() {
            let list
            if (this.teamsSidecarName === 'ai-global') {
                list = this.sidecarGlobalMsgList.slice()
                for (let i = list.length - 1; i >= 0; i--) {
                    if (list[i].type == 'alert') {
                        list.splice(i, 1)
                    }
                }
                this.$store.commit('sidecarGlobalMsgList', list);
                this.doNotScrollToEnd = true
            }
        },

        catchMeUp() {
            const msg = {
                type: 'responding',
                commandName: 'Catch me up',
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
                    `<span style="opacity:0.7; margin-right:4px; ">Reviewing your calendar</span> 📅`,
                    `<span style="opacity:0.7; margin-right:4px; ">Going through messages</span> 💬`,
                    `<span style="opacity:0.7; margin-right:4px; ">Reviewing tasks</span> ✅`,
                    `<span style="opacity:0.7; margin-right:4px; ">Breaking it down</span> ⚖️`,
                    `<span style="opacity:0.7; margin-right:4px; ">Bringing it all together</span> 🤖`,
                ],
                completefunc: {
                    name: 'showCatchMeUpRespondingResult',
                },
                frame: 'colored',
            }

            let list = this.sidecarGlobalMsgList.slice()
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'msg') {
                    list.splice(i, 1)
                }
            }
            list.push(msg)
            
            this.$store.commit('sidecarGlobalMsgList', list);
            this.setTouched()

        },

        showCatchMeUpRespondingResult() {
            let list
            list = this.sidecarGlobalMsgList.slice()
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'responding') {
                    list.splice(i, 1)
                }
            }

            const msg = {
                type: 'result',
                commandName: 'Catch me up',
                time: new Date(),
                header: {
                    title: `Your morning summary`,
                    icons: [
                        {
                            name: 'more-bold',
                            val: 'more',
                            tooltip: 'More',
                            id: `ico${Math.random()}`
                        },
                    ],
                },
                msgs: [
                    {
                        icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5003 5.5C13.6048 5.5 14.5003 4.60457 14.5003 3.5C14.5003 2.39543 13.6048 1.5 12.5003 1.5C11.3957 1.5 10.5003 2.39543 10.5003 3.5C10.5003 4.60457 11.3957 5.5 12.5003 5.5Z" fill="white" fill-opacity="0.95"/>
                    <path d="M14.4106 6.91765C14.3875 6.78811 14.3142 6.67292 14.2066 6.59707C14.0991 6.52122 13.966 6.49083 13.8362 6.51248C13.7063 6.53414 13.5903 6.6061 13.5132 6.71275C13.4361 6.8194 13.4042 6.95215 13.4243 7.0822C13.4747 7.38554 13.5001 7.69251 13.5003 8C13.4999 8.94854 13.2543 9.88087 12.7873 10.7065C12.3204 11.5321 11.6479 12.223 10.8352 12.7121C10.0225 13.2012 9.09711 13.4719 8.14892 13.4979C7.20074 13.524 6.26194 13.3044 5.42362 12.8606C5.34172 12.8169 5.24926 12.797 5.15663 12.8029C5.06401 12.8089 4.97487 12.8405 4.89922 12.8943C4.53087 13.1552 4.11304 13.338 3.67143 13.4314C3.22982 13.5248 2.77377 13.5269 2.33132 13.4375C2.92096 12.9855 3.3568 12.3626 3.57937 11.6538C3.60798 11.5771 3.61737 11.4947 3.60672 11.4135C3.59608 11.3324 3.56573 11.2551 3.51832 11.1884C2.93316 10.3657 2.58574 9.3977 2.51414 8.39059C2.44253 7.38349 2.64951 6.3761 3.11238 5.47881C3.57525 4.58151 4.27616 3.82892 5.13832 3.3035C6.00048 2.77808 6.99063 2.50009 8.00028 2.5C8.30769 2.50002 8.61457 2.52549 8.91777 2.57615C8.98254 2.58698 9.0488 2.58496 9.11277 2.57018C9.17675 2.55541 9.23719 2.52818 9.29065 2.49005C9.3441 2.45191 9.38952 2.40363 9.42431 2.34794C9.45911 2.29225 9.48259 2.23026 9.49342 2.1655C9.50426 2.10074 9.50223 2.03448 9.48746 1.9705C9.47268 1.90652 9.44545 1.84608 9.40732 1.79263C9.36919 1.73917 9.3209 1.69375 9.26521 1.65896C9.20953 1.62417 9.14754 1.60068 9.08278 1.58985C8.72504 1.5301 8.36297 1.50005 8.00028 1.5C6.83051 1.50019 5.68246 1.81602 4.67719 2.41417C3.67192 3.01232 2.84667 3.87063 2.28845 4.89862C1.73023 5.9266 1.45973 7.08616 1.50547 8.25503C1.55121 9.4239 1.91149 10.5588 2.54832 11.54C2.36065 12.0633 1.99375 12.5032 1.51267 12.7817C1.43602 12.8302 1.36572 12.875 1.30467 12.9201C1.19931 12.9965 1.11604 13.0993 1.06329 13.2183C1.01055 13.3372 0.990223 13.468 1.00437 13.5974C1.01833 13.7278 1.06607 13.8524 1.14288 13.9588C1.21969 14.0652 1.32292 14.1497 1.44237 14.2041C1.93232 14.407 2.45849 14.508 2.98877 14.5009C3.77668 14.504 4.55 14.2884 5.22267 13.8781C6.21356 14.3456 7.30651 14.5552 8.40006 14.4874C9.4936 14.4196 10.5523 14.0765 11.4778 13.4902C12.4033 12.9038 13.1657 12.093 13.6941 11.1332C14.2225 10.1734 14.4998 9.09565 14.5003 8C14.5002 7.63737 14.4702 7.27536 14.4106 6.91765Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                    `,
                        txt: `You received 3 important messages:  <ul><li>1 from your manager</li><li>2 from your most active spaces</li></ul>`,
                    },
                    {
                        icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00057 1C6.91287 0.999004 5.8399 1.25149 4.86679 1.73744C3.89368 2.22338 3.0472 2.92942 2.3945 3.79952C1.74181 4.66962 1.30086 5.67986 1.10664 6.75008C0.912418 7.8203 0.970271 8.92106 1.27561 9.96502C1.58094 11.009 2.12536 11.9674 2.86567 12.7643C3.60598 13.5612 4.5218 14.1746 5.5405 14.5559C6.55919 14.9371 7.65271 15.0758 8.73431 14.9608C9.81592 14.8457 10.8558 14.4803 11.7716 13.8933C11.8268 13.8577 11.8744 13.8116 11.9118 13.7576C11.9492 13.7036 11.9756 13.6427 11.9895 13.5785C12.0033 13.5143 12.0044 13.448 11.9927 13.3834C11.9809 13.3188 11.9566 13.2571 11.921 13.2019C11.8854 13.1467 11.8393 13.099 11.7853 13.0617C11.7313 13.0243 11.6704 12.9979 11.6062 12.984C11.542 12.9701 11.4757 12.969 11.4111 12.9808C11.3465 12.9925 11.2848 13.0169 11.2296 13.0525C10.107 13.7689 8.7779 14.0912 7.45187 13.9687C6.12584 13.8462 4.8783 13.2858 3.90594 12.376C2.93359 11.4661 2.29175 10.2584 2.08161 8.94342C1.87147 7.62843 2.10499 6.2809 2.74535 5.11329C3.38572 3.94569 4.39649 3.02443 5.61831 2.49478C6.84013 1.96513 8.20348 1.85722 9.49341 2.18806C10.7833 2.51889 11.9265 3.26966 12.7425 4.32199C13.5586 5.37431 14.0012 6.66832 14.0006 8C14.0006 10 13.1871 10 12.7501 10C12.4347 10.0098 12.1279 9.89643 11.8947 9.68393C11.6614 9.47142 11.5201 9.17647 11.5006 8.86155V5C11.5006 4.86739 11.4479 4.74022 11.3541 4.64645C11.2604 4.55268 11.1332 4.5 11.0006 4.5C10.868 4.5 10.7408 4.55268 10.647 4.64645C10.5532 4.74022 10.5006 4.86739 10.5006 5V5.5568C9.99754 5.04131 9.34772 4.69358 8.63976 4.56105C7.9318 4.42853 7.2002 4.51766 6.54477 4.81629C5.88934 5.11493 5.34202 5.60851 4.97747 6.2297C4.61293 6.85089 4.44893 7.56943 4.50785 8.28727C4.56676 9.00511 4.84572 9.68729 5.30667 10.2407C5.76762 10.7942 6.38809 11.1919 7.08344 11.3797C7.77879 11.5675 8.51514 11.5361 9.19201 11.2899C9.86889 11.0437 10.4533 10.5947 10.8656 10.0041C11.0758 10.3101 11.357 10.5606 11.6853 10.7341C12.0135 10.9075 12.3789 10.9988 12.7502 11C14.2433 11 15.0006 9.99095 15.0006 8C14.9984 6.14415 14.2602 4.36491 12.948 3.05262C11.6357 1.74033 9.85643 1.00215 8.00057 1ZM8.00007 10.5008C7.50562 10.5008 7.02227 10.3541 6.61115 10.0794C6.20002 9.80472 5.87959 9.41428 5.69037 8.95746C5.50115 8.50065 5.45164 7.99798 5.54811 7.51303C5.64457 7.02807 5.88267 6.58262 6.2323 6.23299C6.58194 5.88335 7.02739 5.64525 7.51235 5.54879C7.9973 5.45233 8.49996 5.50183 8.95678 5.69105C9.4136 5.88027 9.80404 6.2007 10.0787 6.61183C10.3534 7.02295 10.5001 7.5063 10.5001 8.00075C10.4993 8.66353 10.2356 9.29893 9.76699 9.76759C9.29834 10.2362 8.66285 10.4999 8.00007 10.5008Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                    `,
                        txt: `You were mentioned in <span class="text-link underline clickfunc" func="gotoSpace" params="FY24 Kickoff Planning" >FY24 Kickoff Planning</span>.`,
                    },
                    {
                        icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.8535 9.64637C13.8071 9.59993 13.752 9.56309 13.6913 9.53795C13.6307 9.51282 13.5657 9.49988 13.5 9.49988C13.4343 9.49988 13.3693 9.51282 13.3087 9.53795C13.248 9.56309 13.1929 9.59993 13.1465 9.64637L11.5 11.2929L9.85349 9.64637C9.75973 9.55261 9.63256 9.49994 9.49997 9.49994C9.36738 9.49994 9.24021 9.55261 9.14645 9.64637C9.0527 9.74012 9.00002 9.86729 9.00002 9.99988C9.00002 10.1325 9.0527 10.2596 9.14645 10.3534L10.793 11.9999L9.14645 13.6464C9.10003 13.6928 9.0632 13.7479 9.03808 13.8086C9.01296 13.8692 9.00002 13.9343 9.00002 13.9999C9.00002 14.0656 9.01296 14.1306 9.03808 14.1912C9.0632 14.2519 9.10003 14.307 9.14645 14.3534C9.19288 14.3999 9.24799 14.4367 9.30865 14.4618C9.36931 14.4869 9.43432 14.4999 9.49997 14.4999C9.56562 14.4999 9.63063 14.4869 9.69129 14.4618C9.75195 14.4367 9.80706 14.3999 9.85349 14.3534L11.5 12.7069L13.1465 14.3534C13.2402 14.4472 13.3674 14.4999 13.5 14.4999C13.6326 14.4999 13.7598 14.4472 13.8535 14.3534C13.9473 14.2597 13.9999 14.1325 13.9999 13.9999C13.9999 13.8673 13.9473 13.7402 13.8535 13.6464L12.207 11.9999L13.8535 10.3534C13.9 10.307 13.9368 10.2519 13.9619 10.1912C13.9871 10.1306 14 10.0655 14 9.99988C14 9.93422 13.9871 9.86921 13.9619 9.80855C13.9368 9.74789 13.9 9.69278 13.8535 9.64637Z" fill="white" fill-opacity="0.95"/>
                    <path d="M11.5 2.49988V1.50037C11.5 1.36776 11.4473 1.24058 11.3536 1.14681C11.2598 1.05304 11.1326 1.00037 11 1.00037C10.8674 1.00037 10.7402 1.05304 10.6464 1.14681C10.5527 1.24058 10.5 1.36776 10.5 1.50037V2.49987H5.5V1.50037C5.5 1.36776 5.44732 1.24058 5.35355 1.14681C5.25979 1.05304 5.13261 1.00037 5 1.00037C4.86739 1.00037 4.74022 1.05304 4.64645 1.14681C4.55268 1.24058 4.5 1.36776 4.5 1.50037V2.49987C3.8372 2.50065 3.20177 2.76429 2.73309 3.23296C2.26442 3.70163 2.00078 4.33706 2 4.99987V11.9999C2.00078 12.6627 2.26442 13.2981 2.73309 13.7668C3.20177 14.2354 3.8372 14.4991 4.5 14.4999H7.5C7.63261 14.4999 7.75979 14.4472 7.85355 14.3534C7.94732 14.2597 8 14.1325 8 13.9999C8 13.8673 7.94732 13.7401 7.85355 13.6463C7.75979 13.5525 7.63261 13.4999 7.5 13.4999H4.5C4.10231 13.4994 3.72103 13.3413 3.43982 13.06C3.15861 12.7788 3.00043 12.3976 3 11.9999V6.50087H13V7.99987C13 8.13247 13.0527 8.25965 13.1464 8.35342C13.2402 8.44719 13.3674 8.49987 13.5 8.49987C13.6326 8.49987 13.7598 8.44719 13.8536 8.35342C13.9473 8.25965 14 8.13247 14 7.99987V4.99987C13.9992 4.33707 13.7356 3.70164 13.2669 3.23297C12.7982 2.7643 12.1628 2.50066 11.5 2.49988ZM13 5.50088H3V4.99988C3.00043 4.60219 3.15861 4.22091 3.43982 3.9397C3.72103 3.65849 4.10231 3.50032 4.5 3.49988H11.5C11.8977 3.50032 12.279 3.65849 12.5602 3.9397C12.8414 4.22091 12.9996 4.60219 13 4.99988V5.50088Z" fill="white" fill-opacity="0.95"/>
                    </svg>            
                    `,
                        txt: `3 meetings occurred while you were offline.`,
                    },
                    {
                        meetings: [
                            {
                                name: 'Executive prep meeting',
                                avatar: 'marketing/m001.png',
                                status: 'inmeeting',
                                statusTxt: '12:00 PM - 13:00 PM',
                                func: () => {
                                    this.tagClickHandler('Executive prep meeting')
                                },
                            },
                            {
                                name: 'Session: Hybrid Work',
                                avatar: 'marketing/m002.png',
                                status: 'inactive',
                                statusTxt: '17:30 PM - 18:00 PM',
                                func: () => {
                                    this.tagClickHandler('Session: Hybrid Work')
                                },
                            },
                            {
                                name: 'Backlog review',
                                avatar: 'marketing/f001.png',
                                status: 'active',
                                statusTxt: '20:00 PM - 21:00 PM',
                                func: () => {
                                    this.tagClickHandler('Backlog review')
                                },
                            },
                        ],
                    },
                ],
                /*
                buttons: [
                    {
                        label: 'Review my day',
                        class: 'md-button-outline',
                        size: 24,
                    },
                    {
                        label: 'Catch me up',
                        class: 'md-button-outline',
                        size: 24,
                    },
                ],
                */
                frame: 'solidgray',
            }
            list.push(msg)

            this.$store.commit('sidecarGlobalMsgList', list);
            this.setTouched()
        },

        summarizeNewMessages() {
            //let spacemsgs = this.$deepClone(this.$store.state.sidecarSpaceMsgList)
            let list = this.sidecarGlobalMsgList.slice()
            const msg = {
                type: 'responding',
                commandName: 'Summarize new messages',
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
                    `<span style="opacity:0.7; margin-right:4px; ">Going through messages</span> 💬`,
                ],
                completefunc: {
                    name: 'showSummarizeNewMessagesRespondingResult',
                },
                frame: 'colored',
            }

            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'msg') {
                    list.splice(i, 1)
                }
            }
            list.push(msg)

            //spacemsgs[this.activeSpaceId] = list
            //this.$store.commit('sidecarSpaceMsgList', spacemsgs);
            this.$store.commit('sidecarGlobalMsgList', list);
            this.setTouched()
        },
        showSummarizeNewMessagesRespondingResult() {
            //let spacemsgs = this.$deepClone(this.$store.state.sidecarSpaceMsgList)
            let list = this.sidecarGlobalMsgList.slice()

            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'responding') {
                    list.splice(i, 1)
                }
            }

            const msg = {
                type: 'result',
                commandName: `Summarize new messages`,
                time: new Date(),
                activeSpace: this.activeSpace,
                header: {
                    title: ``,
                    icons: [
                        {
                            name: 'more-bold',
                            val: 'more',
                            tooltip: 'More',
                            id: `ico${Math.random()}`
                        },
                    ],
                },
                msgs: [
                    {
                        txt: `<ul>
                        <li>Jennifer added Q2 product metrics to the deck</li>
                        <li>Craig mentioned you: Should I add the campaign dashboard?</li>
                        <li>The Kickoff meeting date has changed from 10/2/23 to 10/4/23</li>
                        </ul>`,
                    },

                ],
                /*
                buttons: [
                    {
                        label: 'Recap space',
                        class: 'md-button-outline',
                        size: 24,
                    },
                    {
                        label: 'Catch me up',
                        class: 'md-button-outline',
                        size: 24,
                    },
                ],
                */
                frame: 'solidgray',
            }
            list.push(msg)

            //spacemsgs[this.activeSpaceId] = list
            //this.$store.commit('sidecarSpaceMsgList', spacemsgs);
            this.$store.commit('sidecarGlobalMsgList', list);
            this.setTouched()
        },

        recapSpace() {
            //let spacemsgs = this.$deepClone(this.$store.state.sidecarSpaceMsgList)
            let list = this.sidecarGlobalMsgList.slice()
            const msg = {
                type: 'responding',
                commandName: 'Recap space',
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
                    `<span style="opacity:0.7; margin-right:4px; ">Going through messages</span> 💬`,
                ],
                completefunc: {
                    name: 'showRecapRespondingResult',
                },
                frame: 'colored',
            }

            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'msg') {
                    list.splice(i, 1)
                }
            }
            list.push(msg)

            //spacemsgs[this.activeSpaceId] = list
            //this.$store.commit('sidecarSpaceMsgList', spacemsgs);
            this.$store.commit('sidecarGlobalMsgList', list);
            this.setTouched()
        },

        showRecapRespondingResult() {
            //let spacemsgs = this.$deepClone(this.$store.state.sidecarSpaceMsgList)
            let list = this.sidecarGlobalMsgList.slice()

            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'responding') {
                    list.splice(i, 1)
                }
            }

            const msg = {
                type: 'result',
                commandName: `Recap space`,
                time: new Date(),
                activeSpace: this.activeSpace,
                header: {
                    title: ``,
                    icons: [
                        {
                            name: 'more-bold',
                            val: 'more',
                            tooltip: 'More',
                            id: `ico${Math.random()}`
                        },
                    ],
                },
                msgs: [
                    {
                        txt: `<ul>
                        <li>Jennifer added Q2 product metrics to the deck</li>
                        <li>Craig mentioned you: Should I add the campaign dashboard?</li>
                        <li>The Kickoff meeting date has changed from 10/2/23 to 10/4/23</li>
                        </ul>`,
                    },

                ],
                /*
                buttons: [
                    {
                        label: 'Recap space',
                        class: 'md-button-outline',
                        size: 24,
                    },
                    {
                        label: 'Catch me up',
                        class: 'md-button-outline',
                        size: 24,
                    },
                ],
                */
                frame: 'solidgray',
            }
            list.push(msg)

            //spacemsgs[this.activeSpaceId] = list
            //this.$store.commit('sidecarSpaceMsgList', spacemsgs);
            this.$store.commit('sidecarGlobalMsgList', list);
            this.setTouched()
        },

        askAiToPrepareMeeting() {
            const msg = {
                type: 'responding',
                commandName: 'Prepare for next meeting',
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
            this.setTouched()
            
            this.$store.commit('teamsSidecarName', 'ai-global')
            if (!this.gptPanelPopouted) {
                this.$store.commit('meetingsSidecarVisible', false)
            }
        },

        showPrepareMeetingRespondingResult() {
            let list
            list = this.sidecarGlobalMsgList.slice()
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'responding') {
                    list.splice(i, 1)
                }
            }

            const meetingName = 'Follow-up meeting'

            const msg = {
                type: 'upcoming-meeting',
                //commandName: `Prepare for ${meetingName}`,
                commandName: `Prepare for next meeting`,
                time: new Date(),
                header: {
                    title: `Next upcoming meeting`,
                    icons: [
                        {
                            name: 'more-bold',
                            val: 'more',
                            tooltip: 'More',
                            id: `ico${Math.random()}`
                        },
                    ],
                },
                upcomingMeeting: {
                    title: meetingName,
                    avatar: 'marketing/f006.png',
                    status: 'inmeeting',
                    people: 8,
                    start: this.$makeMeetingTime(0)[0],
                    end: this.$makeMeetingTime(0)[1],
                    icons: ['recurring-bold', 'webex-helix-filled'],
                    accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
                    waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
                },
                buttons: [
                    {
                        label: 'View more detail',
                        class: 'md-button-solid',
                        size: 24,
                        func: {
                            name: 'openMeetingDetailSidecar',
                            params: {meetingName: meetingName},
                        },
                    },
                ],
                frame: 'solidgray',
            }
            list.push(msg)

            this.$store.commit('sidecarGlobalMsgList', list);
            this.setTouched()

            this.scrollToHalfEnd = true
        },

        openMeetingDetailSidecar(params) {
            this.$eventBus.$emit('open-meeting-info-sidecar', params)
        },

        catchUpWithMissedMeeting() {
            const msg = {
                type: 'responding',
                commandName: 'Catch up with missed meeting',
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
                    `<span style="opacity:0.7; margin-right:4px; ">Checking the meeting you missed </span> 📅`,
                ],
                completefunc: {
                    name: 'catchUpWithMissedMeetingRespondingResult',
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
            this.setTouched()
            
            this.$store.commit('teamsSidecarName', 'ai-global')
            if (!this.gptPanelPopouted) {
                this.$store.commit('meetingsSidecarVisible', false)
            }
        },
        catchUpWithMissedMeetingRespondingResult() {
            let list
            list = this.sidecarGlobalMsgList.slice()
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'responding') {
                    list.splice(i, 1)
                }
            }

            const meetingName = 'Session: Hybrid Work'
            const msg = {
                type: 'meeting-summary',
                //commandName: `Catch up with ${meetingName}`,
                commandName: `Catch up with missed meeting`,
                time: new Date(),
                header: {
                    title: `Missed meeting`,
                    icons: [
                        {
                            name: 'more-bold',
                            val: 'more',
                            tooltip: 'More',
                            id: `ico${Math.random()}`
                        },
                    ],
                },
                meetingSummary: {
                    title: meetingName,
                    avatar: 'marketing/m001.png',
                    status: 'presenting',
                    start: '',
                    end: '',
                },
                buttons: [
                    {
                        label: 'View more detail',
                        class: 'md-button-solid',
                        size: 24,
                        func: {
                            name: 'openMeetingDetailSidecar',
                            params: {meetingName: meetingName},
                        },
                    },
                ],
                frame: 'solidgray',
            }
            list.push(msg)

            this.$store.commit('sidecarGlobalMsgList', list);
            this.setTouched()

            this.scrollToHalfEnd = true

        },

        wasMyNameMentioned() {
            const msg = {
                type: 'responding',
                commandName: 'Was my name mentioned?',
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
                    `<span style="opacity:0.7; margin-right:4px; ">Generating what you were mentioned...</span>`,
                ],
                completefunc: {
                    name: 'wasMyNameMentionedRespondingResult',
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

        wasMyNameMentionedRespondingResult() {
            let list
            list = this.sidecarInMeetingMsgList.slice()
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'responding') {
                    list.splice(i, 1)
                }
            }

            const msg = {
                type: 'result',
                commandName: 'Was my name mentioned?',
                time: new Date(),
                header: {
                    title: ``,
                    icons: [
                        {
                            name: 'more-bold',
                            val: 'more',
                            tooltip: 'More',
                            id: `ico${Math.random()}`
                        },
                    ],
                },
                msgs: [
                    {
                        txt: `<span class="team-message-mention-me">"Jessica</span> needs to confirm launch timing."<br><span style="opacity:.7;">By Darren on 08:59 AM</span>`,
                    },

                ],
                frame: 'solidgray',
            }
            list.push(msg)

            this.$store.commit('sidecarInMeetingMsgList', list);

            this.meetingRecapped = true
        },

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

        showRecapMeetingSofarRespondingResult() {
            let list
            list = this.sidecarInMeetingMsgList.slice()
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].type == 'responding') {
                    list.splice(i, 1)
                }
            }

            const msg = {
                type: 'result',
                commandName: 'Recap meeting so far',
                time: new Date(),
                header: {
                    title: ``,
                    icons: [
                        {
                            name: 'more-bold',
                            val: 'more',
                            tooltip: 'More',
                            id: `ico${Math.random()}`
                        },
                    ],
                },
                msgs: [
                    {
                        txt: `Emily shared her findings on transfer learning challenges due to limited labeled data. Team brainstormed strategies for maximizing available data.`,
                    },

                ],
                frame: 'solidgray',
            }
            list.push(msg)

            this.$store.commit('sidecarInMeetingMsgList', list);

            this.meetingRecapped = true
        },

        // callback functions ------end


        sendmsg(e) {
            e.preventDefault();
            this.clearInputText()
            return false;
        },

        scrollToEnd() {
            var sp = this.$refs.scrollpane;
            var lstrect = this.$refs.scrollcontent.getBoundingClientRect();
            sp.scrollToY(lstrect.height - sp.scrollWrapperHeight, this.transitionDisabled);
            this.inputboxDividerVisible = lstrect.height > sp.scrollWrapperHeight;
            this.transitionDisabled = false

            //setTimeout(() => {
            //this.checkAiAnimationVisibility()
            //}, 300)
        },
        scrollDownABit() {
            var sp = this.$refs.scrollpane;
            var lstrect = this.$refs.scrollcontent.getBoundingClientRect();
            sp.scrollToY(lstrect.height - sp.scrollWrapperHeight - 500, this.transitionDisabled);
            this.transitionDisabled = false
        },

        autoLayout() {
            this.$nextTick(() => {
                this.autoChangeHeight()
                if (!this.doNotScrollToEnd) {
                    this.scrollToEnd()
                }
                if(this.scrollToHalfEnd){
                    this.scrollDownABit()
                    this.scrollToHalfEnd = false
                }
                this.doNotScrollToEnd = false
                
            })
        },
        setScrollContentPaddingBottom() {
            this.autoLayout()
        },

        checkAiAnimationVisibility() {
            var sp = this.$refs.scrollpane;
            var y = sp.getScrollOffset().y.split('px')[0]
            if (Number(y) < -128) {
                this.$eventBus.$emit('ai-animation-start')
            } else {
                this.$eventBus.$emit('ai-animation-stop')
            }
        },

        autoChangeHeight() {
            //var elem = this.$refs.input
            //elem.style.height = "1px";
            //elem.style.height = (elem.scrollHeight) + "px";
        },

        inputClick() {

        },

        clearInputText() {

            this.message = ''
            this.autoLayout()
        },

        joinMeeting() {
            this.$eventBus.$emit('open-new-meeting-window', {
                meetingId: 'webex-meeting',
                meetingType: 'webex',
            })
            this.meetingStarted = true

            this.$store.commit('afterGptDemoMeeting', true)
        },

    }
};
</script>
  
  
<style lang="scss">
$paddingleft: 28px;

.gpt_panel {
    flex-grow: 1;
    height: 100%;
    font-size: 12px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    border-radius: 6px;
    transform: rotate(0deg);
    overflow: hidden;
}


.gpt_panel_wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .cleanup-icon {
        display: flex;
        width: 28px;
        height: 100%;
        pointer-events: auto;
        cursor: default;
        justify-content: center;
        align-items: center;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .aimsgitem-alert {
        width: calc(100% - 12px);
        margin-left: 4px !important;
        margin-bottom: 8px !important;
    }

    .scrollpane {
        flex-shrink: 1;
        flex-grow: 1;
        width: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        height: 100px;
        scroll-behavior: smooth;

        .wl-scrollbar__area {
            display: flex;
            justify-content: center;
        }
    }

    .list {
        @include flex(column, flex-end);
        width: 100%;
        padding-right: 16px;
        padding-bottom: 20px;

        .spacer {
            flex-grow: 1;
            margin: 0;
        }

    }

    .float-actions-switcher {
        padding: 8px 0 0 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .btnswitcher {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 24px;
            padding: 0 10px;
            border-radius: 12px;
            pointer-events: auto;
            user-select: none;
            cursor: default;
            
            .lb {
                font-size: 12px;
                font-weight: 600;
                opacity: .7;
            }
            .ico {
                margin-left: 4px;
                opacity: .7; 
            }

            &:hover {
                background-color: rgba($color: #FFF, $alpha: .11);
            }
            &:active, &.active {
                background-color: rgba($color: #FFF, $alpha: .2);
            }

            &.disabled {
                pointer-events: none;
            }
        }
    }
    .float-actions {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 6px;

        .action-btn {
            @include flex;
            min-width: 0 !important;
            padding: 0 10px !important;
            font-weight: normal !important;
            margin: 4px 4px 4px 0 !important;

            .md-button__children {
                word-break: keep-all;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex-grow: 1;
            }

        }
    }

    .inputbox {
        position: relative;
        @include flex;
        width: calc(100% - 12px);
        margin-left: 8px;
        margin-bottom: 4px;
        max-width: 940px;

        .gptinput {
            border: none;
            width: calc(100% - 30px);
            font-size: 14px;
            padding: 6px 15px 4px $paddingleft;
            margin-left: 4px;
            background: transparent;
            cursor: text;
            color: rgba($color: white, $alpha: 0.95);
            resize: none;
            overflow: hidden;
            height: 38px;
            min-height: 38px;

            ::placeholder {
                color: rgba($color: white, $alpha: 0.7) !important;
            }

            &:focus {
                outline: none;
                box-shadow: none;
            }
        }

        .icobefore {
            position: absolute;
            left: 8px;
            top: 8px;
        }

        .send {
            @include flex;
            width: 16px;
            height: 16px;
            margin-right: 12px;

            svg path {
                fill: $md-blue-40;
                fill-opacity: 1.0;
            }

            &.disabled {
                opacity: .4;

                svg path {
                    fill: white;
                }
            }

        }

        .clr-border {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            border-radius: 8px;
            box-sizing: border-box;
            transition: opacity 0.3s ease-out;

            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 8px;
                padding: 1px;
                background: linear-gradient(135deg, rgba($color: #0672EF, $alpha: 0.0) 0%, rgba($color: #0672EF, $alpha: 0.4) 30%, rgba($color: #3CC29A, $alpha: 0.4) 70%, rgba($color: #3CC29A, $alpha: 0.0) 100%);
                -webkit-mask:
                    linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
                mask:
                    linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: destination-out;
                mask-composite: exclude;

                pointer-events: none;
            }
        }



    }

    .gradient-divider-h {
        width: 100%;
        max-width: 940px;
        height: 1px;
        background: linear-gradient(90deg, rgba($color: #FFFFFF, $alpha: 0.0) 0%, rgba($color: #FFFFFF, $alpha: .2) 20%, rgba($color: #FFFFFF, $alpha: .2) 80%, rgba($color: #FFFFFF, $alpha: 0.0) 100%);
    }

    /* theme ----- dark/hybrid */
    &.hybrid {
        color: $text-color-primary-light-ui;
    }

    &.dark {
        color: $text-color-primary-dark-ui;
    }

}
</style>
  