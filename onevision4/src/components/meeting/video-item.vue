<template>
    <!-- video-pane 如果使用这个invite功能， video-item需要独立出来一个单独的component： invite-placeholder -->
    <!--div v-if="name == 'invite-placeholder'" class='video_item_invite' ref="videoitm" :class="[theme, {
                absolute: absolute,
                trans: transition && !disableElementTransition,
            }]" :style="{
            left: `${left}px`,
            top: `${top}px`,
            zIndex: zIndex,
            borderWidth: isSmallVideo ? '3px' : '4px',
            width: width ? width : '',
            height: height ? height : '',
            opacity: opacity ? opacity : '',
        }">
        <div class="close" >
            <wl-icon name="cancel-bold" size="16" color="white" />
        </div>

        <div class="wrap">
            <div class="tt">Waiting for others to join…</div>

            <md-button class="btn md-button-solid btn-invite" aria-label="x" :size="32" @click="openInvitePanel">
                <wl-icon name="participant-add-bold" size="16" color="black" />
                <span class="label">Invite people</span>
            </md-button>

            <md-button class="btn md-button-outline " aria-label="x" :size="32" >
                <wl-icon name="copy-bold" size="16" color="white" />
                <span class="label">Copy meeting infomation</span>
            </md-button>
        </div> 

    </div-->

    <div class='video_item' ref="videoitm" :class="[theme, {
                absolute: absolute,
                zindex2: justDropped,
                grabbing: isDragging,
                trans: transition && !disableElementTransition && !videoPaused,
            }]" :style="{
            left: `${left}px`,
            top: `${top}px`,
            zIndex: isDragging ? 2 : zIndex,
            borderWidth: isSmallVideo ? '3px' : '4px',
            width: width ? width : '',
            height: height ? height : '',
            opacity: opacity ? opacity : '',
        }" v-show='videoVisible' :data-name='name' :draggable="allowDrag" @dragstart="dragstart" @drag="drag"
                @dragend="dragend" @mousedown="mousedown" @contextmenu.prevent="onContextmenu">
        <div class='video' :class="{aivideo: isAI}" @mouseenter="mouseover" @mouseleave="mouseout">
            <div class="bg"></div>

            <video v-if="!splitVideo && video !== null && !isImage" ref="video" class="signlevideo"
                :class="{ 
                    mirror: selfvideoMirror && me.name === name,
                }" :style="{
                    objectPosition: objectPosition,
                }" :src='videoUrl' :autoplay='!freeze' loop='true' @dblclick="toggleMaximize"></video>

            <fragment v-if="videoList">
                <video v-for="(v, idx) in videoList" :key="`aivd${idx}`" :ref="`video${idx}`" class="signlevideo overlay" 
                    :style="{
                        objectPosition: objectPosition,
                        opacity: 0,
                    }" @dblclick="toggleMaximize"></video>
            </fragment>

            <img v-if="!splitVideo && video !== null && isImage" ref="video" :src='videoUrl' :style="{
                objectPosition: objectPosition,
            }" :draggable="false" @dblclick="toggleMaximize" />

            <div v-if="splitVideo" class="split-video" @dblclick="toggleMaximize">
                <div v-for="(s, idx) in splitVideo" :key="`part${idx}`" class="part" :style="{
                    borderRight: idx < splitVideo.length - 1 ? `2px solid black` : `none`,
                    borderLeft: idx > 0 ? `2px solid black` : `none`,
                }">
                    <video ref="video" :src='videoUrl' class="vd" :style="{
                        objectPosition: s.objectPosition,
                    }" :autoplay='!freeze' loop='true'></video>
                </div>
            </div>

            <div v-if='video === null && avatar !== null || me.name === name && !cameraOn' class="avatar-with-halo" :style='{
                width: avatarHaloSize,
                height: avatarHaloSize,
            }'>
                <div v-show="isActiveSpeaker && isTalking" :style="{opacity: isActiveSpeaker ? 1 : 0}" class='halo' ref="avatarHalo"></div>
                <div class='avatar' :style='{
                    backgroundImage: avatarUrl,
                    width: avatarSize,
                    height: avatarSize,
                }'></div>
            </div>
            <div class="bigname" v-if="video === null && !avatar">
                <div class="lb" :style="{ 'font-size': bigNameFontSize }">
                    {{ name }}
                </div>
                <div class="lb-sub" :style="{ 'font-size': bigNameSubFontSize }" v-if="host">
                    Host
                </div>

                <div class="ico" :class="{ fade: !hudVisible }">
                    <wl-icon v-if="muted2" :name="`microphone-muted-bold`" size="16"
                        :color="theme === 'light' ? 'red-60' : 'red-50'" />
                </div>
            </div>
            <div v-if="!isAI && (showNameLabel || videosNameVisible === 'show' || (ctrlVisible || isActiveSpeaker && videosNameVisible === 'auto')) && (video !== null || avatar !== null) && !isBgVideo && peopleList.length > 1"
                class='lb_name'
                :class="[labelClassName, {
                    fade: !hudVisible && !isActiveSpeaker && (!isSign || me.name == name)
                }]">
                <div class="ico" v-if="muted2"><wl-icon :name="`microphone-muted-bold`" size="16"
                        :color="theme === 'light' ? 'red-60' : 'red-50'" /></div>
                <!--div class="ico" v-if="!muted2 && !isActiveSpeaker" ><wl-icon :name="`microphone-bold`" size="16" color="white" /></div-->
                <div class="ico" v-if="!muted2 && (isActiveSpeaker || isSign)">
                    <wl-icon name="audio-microphone-on-green-bold" size="16" color="green-40" />
                </div>

                <div class='txt'>{{ name }}{{ isSign ? ` (${statusTxt})` : '' }}</div>
                <!--div class='txt tz' v-if="timezone">{{timezone}}</div-->
                <wl-icon v-if="isActiveSpeaker && signalGood" name="signal-100-bold" size="16" color="#3CC29A"
                    class="ico-signal" />
                <wl-icon v-if="isActiveSpeaker && !signalGood" name="signal-50-bold" size="16" color="#FFBE4F"
                    class="ico-signal" v-tooltip="`${name} is having connection issues`" />

                <wl-icon v-if="isSign" name="applause-bold" size="16" class="ico-sign" />
            </div>

            <div v-if="isAI" class="lb_ai">Webex GPT</div>

            <div class="ctrl" ref="ctrl" v-show="!isDragging" :class="{
                smallvideo: isSmallVideo,
                sidebyside1: sidebysideTop,
                fade: !hudVisible,
            }">
                <div v-if="(ctrlVisible || menuVisible) && peopleList.length > 1" class="lft">

                    <div v-if="!isSign && pin && !ctrlVisible && !(videoLayout === 'stage' && activeSpeakerInStage && isActiveSpeaker)"
                        class="btn btn-pin opacity">
                        <wl-icon class="pin" name="pin-bold" size="12" />
                    </div>
                    <div v-if="!isSign && pin && ctrlVisible && !(videoLayout === 'stage' && activeSpeakerInStage && isActiveSpeaker)"
                        class="btn btn-pin" @click="unpin" v-tooltip="'Remove from the stage'">
                        <wl-icon class="unpin" name="pin-muted-bold" size="12" />
                    </div>
                </div>

                <div v-if="ctrlVisible && peopleList.length > 1 && !isSign" class="btn btn-mute"
                    @click="!muted2 ? mute($event) : unmute($event)">
                    <span class="ico">
                        <wl-icon name="audio-microphone-on-green-bold" size="14" v-if="!muted2"
                            :color="theme === 'light' ? 'green-60' : 'green-40'" />
                        <wl-icon name="microphone-muted-bold" size="14" v-if="muted2"
                            :color="theme === 'light' ? 'red-60' : 'red-50'" />
                    </span>

                    <span class="lb" v-if="!isSmallVideo">{{ muted2 ? 'Unmute' : 'Mute' }}</span>
                </div>

                <div v-if="ctrlVisible || menuVisible" class="btn btn-more" ref="btnmore" @click="onBtnmoreClick">
                    <wl-icon name="more-bold" size="12" />
                </div>
            </div>

        </div>

        <div class="reaction-icon" ref="reaction-icon" :style="{
            width: `${reaction_icon_size}px`,
            height: `${reaction_icon_size}px`,
            right: `${reaction_icon_margin}px`,
            bottom: `${reaction_icon_margin * 0.8}px`,
        }"></div>

        <div class='as_border' v-if="asBorderVisible && !isAI"></div>
        <div class='selected_border' v-if="selected"></div>

    </div>

</template>

<script>
import menuVideo from './menu-video.vue';
import coachmark from '../shared/coachmark.vue'
import lottie from 'lottie-web'

//import mframe from 'mframe';
import _ from 'lodash';

export default {
    props: {
        meetingId: null,
        zIndex: null,
        index: null,
        width: null,
        height: null,
        opacity: null,
        transition: {
            type: Boolean,
            default: false,
        },
        freeze: {
            type: Boolean,
            default: false,
        },
        absolute: {
            type: Boolean,
            default: false,
        },
        isActiveSpeaker: {
            type: Boolean,
            default: false,
        },
        isBgVideo: {
            type: Boolean,
            default: false,
        },
        isMaxVideo: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
        },
        isAI: {
            type: Boolean,
            default: false,
        },
        host: {
            type: Boolean,
            default: false,
        },
        avatar: {
            type: String,
        },
        video: {
            type: String,
        },
        videoList: {
            type: Array,
        },
        audio: {
            type: String,
        },
        muted: {
            type: Boolean,
            default: false,
        },
        sort: {
            type: Number,
        },
        timezone: {
            type: String,
        },
        sidebysideTop: {
            type: Boolean,
            default: false,
        },
        showNameLabel: {
            type: Boolean,
            default: false,
        },
        parentWidth: {
            type: Number,
        },
        parentHeight: {
            type: Number,
        },
        parentScaleX: {
            type: Number,
            default: 1,
        },
        parentScaleY: {
            type: Number,
            default: 1,
        },
        positionLeft: null,
        positionTop: null,
        objectPosition: null,
        activeBorder: {
            type: String, // show, hide
            default: null,
        },
        reaction: null,
        selected: {
            type: Boolean,
            default: false,
        },
        isTalking: {
            type: Boolean,
            default: false,
        },
        isSign: { // 手语翻译
            type: Boolean,
            default: false,
        },
        signLang: null,
        splitVideo: null,
        statusTxt: null,
    },
    data() {
        return {
            isSmallVideo: true,
            menuVisible: false,
            smallSize: false,
            ctrlVisible: false,
            muted2: this.muted,
            labelClassName: '',
            bigNameFontSize: '0px',
            bigNameSubFontSize: '0px',
            iconSize: 12,
            avatarSize: '100px',
            avatarHaloSize: '140px',
            mouseX: null,
            mouseY: null,
            left: this.positionLeft,
            top: this.positionTop,
            prevleft: this.positionLeft,
            prevtop: this.positionTop,
            isDragging: false,
            prevDragPosition: {},
            justDropped: false,
            resizeObserver: null,
            itv_enableTransition: null,
            reaction_remove_itv: null,

            anim: null,
            reactionSent: false,
            reaction_icon_size: 50,
            reaction_icon_margin: 10,
            haloTrans: null,
            signalGood: true,
            tmo_activeSpeaker: null,
        }
    },
    mounted() {
        if (this.name === this.me.name && this.cameraOn) {
            this.initCam();
        }
        this.initResizeWatch();
        this.setHalo();
        this.checkSignal();

        this.$eventBus.$on('ai-talk', this.setAIVideo)


        let loadVideo = i => {
            let el = this.$refs[`video${i}`][0]
            let vd = this.videoList[i]
            el.volume = 0
            el.src = `${this.$store.state.videoPath}${vd.file}`

            if (i < this.videoList.length - 1) {
                setTimeout(() => {
                    loadVideo(i + 1)
                }, (i * 2 + 1) * 1000)
            }

        }
        if (this.videoList) {
            loadVideo(0)
        }

        /*
        if (this.isFTE && this.name === 'invite-placeholder') {
            this.showCoachmark({
                name: 'invite-button-coachmark',
                closable: false,
                icon: null,
                title: `Add people to your meeting`,
                content: `Don't want to bother others? Add virtual attendees to see how Webex Meetings work.`,
                subtext: null,
                reference: document.querySelector('.btn-invite'),
                placement: `bottom`,
                closeTrigger: `mousedown`,
                button: {
                    label: 'Add virtual attendees',
                    func: () => {
                        this.inviteTestPeople()
                    }
                },
            })
        }
        */

    },
    beforeDestroy() {
        const elem = this.$refs.videoitm;
        this.resizeObserver.unobserve(elem);
        this.resizeObserver = null;

        this.$eventBus.$off('ai-talk', this.setAIVideo)
    },
    computed: {
        theme() {
            return this.$store.state.theme;
        },
        themeColor() {
            return this.$store.state.themeColor;
        },
        reactionAnimations() {
            return this.$store.state.reactionAnimations;
        },
        selfvideoMirror() {
            return this.$store.state.selfvideoMirror;
        },
        allowDrag() {
            return !this.videoPaused &&
                !this.isBgVideo && 
                !this.isMaxVideo &&
                (!this.inStage || this.inStage && this.stagePeopleList.length > 0) &&
                (this.videoLayout === 'grid' || this.videoZoomLevel >= 0) &&
                !this.selfSharing

        },
        selfSharing() {
            return this.$store.state.selfSharing;
        },
        selfVideoWithOthers() {
            return this.$store.state.selfVideoWithOthers
        },
        hidePeopleWithoutVideo() {
            return this.$store.state.hidePeopleWithoutVideo
        },
        cameraOn() {
            return this.$store.state.cameraOn
        },
        me() {
            return this.$store.getters.me
        },
        sliEnabled() {
            return this.$store.state.sliEnabled;
        },
        signLanguage() {
            return this.$store.state.signLanguage;
        },
        signLanguageVideoPosition() {
            return this.$store.state.signLanguageVideoPosition;
        },


        peopleList() {
            return this.$store.state.peopleList;
        },
        peopleSI() {
            return this.$store.state.peopleSI;
        },
        pinnedPeopleList() {
            let plst = []
            plst = this.peopleList.slice().filter((p) => {
                return p.pin >= 0 || this.videoLayout === 'stage-sharing' && this.activeSpeakerInStage && p.name === this.activeSpeakerName;
                //return p.pin >= 0
            }
            )
            //if (this.videoLayout === 'stage' && this.activeSpeakerInStage && plst.length === 1 && plst[0].name === this.activeSpeakerName) {
            //  return [];
            //}
            var names = plst.reduce(
                (arr, itm) => {
                arr.push(itm.name);
                return arr;
                },
                []
            );

            let plst2 = []
            if (this.sliEnabled && this.signLanguage && this.signLanguageVideoPosition == 'after-selfvideo') {
                    plst2 = this.$store.state.peopleSI.filter((p) => {
                        return p.pin >= 0 && names.indexOf(p.name) == -1
                    }
                )
            }

            return plst.concat(plst2);
        },
        stagePeopleList() {
            if (this.pinnedPeopleList.length > 0 || this.videoLayout === 'stage-sharing') {
                return this.pinnedPeopleList;
            } else {
                return [this.activeSpeaker];
            }
        },
        inStage() {
            for (let i = 0; i < this.stagePeopleList.length; i++) {
                if (this.stagePeopleList[i].name === this.name) {
                    return true;
                }
            }
            return false;
        },
        pin() {
            return this.name && this.$store.getters.people(this.name).pin && (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing');
        },
        activeSpeaker() {
            return this.$store.getters.activeSpeaker;
        },
        maximizeVideo() {
            return this.$store.state.maximizeVideo;
        },
        menuVideoVisible() {
            return this.$store.state.menuVideoVisible;
        },
        videoVisible() {
            return !(this.panelVisible && this.activeSpeakerName != this.name)
        },
        videoLayout() {
            return this.$store.getters.videoLayout(this.meetingId)
        },
        videoZoomLevel() {
            return this.$store.getters.videoZoomLevel(this.meetingId);
        },
        activeSpeakerName() {
            return this.$store.state.activeSpeakerName;
        },
        lockedPeopleName() {
            return this.$store.state.lockedPeopleName;
        },
        backgroundColor() {
            return this.showWave || this.showWaveStop ? 'rgba(0,0,0,0)' : '#EBEBEC';
        },
        avatarUrl() {
            if (this.avatar !== null) {
                return 'url(' + this.$store.state.avatarPath + this.avatar + ')';
            } else {
                return 'none';
            }
        },
        abbr() {
            let arr = this.name.split(' ');
            return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
        },
        videoUrl() {
            return !this.$store.state.dev && this.video && this.video !== 'camera' ? this.$store.state.videoPath + this.video : '';
        },
        isImage() {
            return this.video && this.video.indexOf('.mp4') === -1 && this.video !== 'camera'
        },

        panelVisible() {
            return this.$store.state.panelVisible;
        },
        audioIco() {
            if (this.audio == 'mobile') {
                return 'icon-phone-iph_12';
            } else if (this.audio == 'pc') {
                return 'icon-headset_12';
            } else if (this.audio == 'phone') {
                return 'icon-handset_12';
            } else {
                return '';
            }
        },
        hudVisible() {
            return this.$store.state.hudVisible;
        },
        fullscreen() {
            return this.$store.state.fullscreen;
        },
        windowsSizeChanged() {
            return this.$store.state.windowsSizeChanged;
        },
        windowMinimized() {
            return this.$store.state.windowMinimized;
        },
        videoItemSortIndex() {
            return this.$store.state.videoItemSortIndex;
        },
        videoDropAndInsertAtIndex() {
            return this.$store.state.videoDropAndInsertAtIndex;
        },
        activeSpeakerMoveToFirst() {
            return this.$store.state.activeSpeakerMoveToFirst;
        },
        disableElementTransition() {
            return this.$store.state.disableElementTransition;
        },
        videoPaused() {
            return this.$store.state.videoPaused;
        },
        videosNameVisible() {
            return this.$store.state.videosNameVisible;
        },
        activeSpeakerInStage() {
            return this.$store.state.activeSpeakerInStage;
        },
        isFTE() {
            return this.$store.state.isFTE;
        },

        rect() {
            return {
                left: Math.round(this.left),
                top: Math.round(this.top),
                width: Math.round(this.width),
                height: Math.round(this.height)
            }
        },
        asBorderVisible() {
            if (this.activeBorder === 'show') {
                return true;
            } else if (this.activeBorder === 'hide') {
                return false;
            }

            return this.activeSpeakerName === this.name &&
                (this.videoLayout !== 'stage' || (this.videoLayout === 'stage' && this.stagePeopleList.length > 1) || this.pinnedPeopleList.length > 0 && !this.activeSpeaker.pin) &&
                !this.activeSpeakerMoveToFirst &&
                !this.isBgVideo &&
                !this.maximizeVideo &&
                this.peopleList.length > 2
        }
    },
    watch: {

        reaction(newVal) {

            clearTimeout(this.reaction_remove_itv);

            if (this.anim) {
                this.anim.destroy();
            }

            if (newVal) {
                const reactionId = newVal.split('?')[0];
                this.setEmojiSize();

                this.anim = lottie.loadAnimation({
                    container: this.$refs['reaction-icon'],
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    animationData: this.reactionAnimations[reactionId].default,
                });

                // set reaction
                this.reaction_remove_itv = setTimeout(() => {
                    let plist = [];
                    const len = this.peopleList.length;
                    for (let i = 0; i < len; i++) {
                        const p = this.peopleList[i];
                        if (p.name === this.name) {
                            p.reaction = null;
                        }
                        plist.push(p);
                    }
                    this.$store.commit("doNotAutoChangeZoom", true);
                    this.$store.commit("peopleList", plist);

                }, 8000);
            }
        },

        name(val) {
            if (val === this.me.name) {
                this.initCam();
            } else {
                const video = this.$refs.video;
                if (video) {
                    video.srcObject = undefined;
                }
            }
        },
        cameraOn(val) {
            if (val && this.name === this.me.name) {
                this.initCam();
            }
            this.setHalo();
        },
        videoPaused(val) {
            if (this.video && this.$refs.video && !this.isImage) {
                if (Array.isArray(this.$refs.video)) {
                    if (val) {
                        this.$refs.video.forEach(element => {
                            element.pause();
                        });
                    } else {
                        this.$refs.video.forEach(element => {
                            element.play();
                        });
                    }
                } else {
                    if (val) {
                        this.$refs.video.pause();
                    } else {
                        this.$refs.video.play();
                    }
                }

            }
        },
        positionLeft(val) {
            if (!this.isDragging) {
                if (this.justDropped) {
                    setTimeout(() => {
                        this.left = val;
                        this.prevleft = val;
                        setTimeout(() => {
                            this.justDropped = false;
                        }, 200);
                    }, 1);
                } else {
                    this.left = val;
                    this.prevleft = val;
                }
            }
        },
        positionTop(val) {
            if (!this.isDragging) {
                if (this.justDropped) {
                    setTimeout(() => {
                        this.top = val;
                        this.prevtop = val;
                        setTimeout(() => {
                            this.justDropped = false;
                        }, 200);
                    }, 1);
                } else {
                    this.top = val;
                    this.prevtop = val;
                }
            }
        },
        muted(val) {
            this.muted2 = val;
        },
        menuVideoVisible(newVal) {
            if (!newVal) {
                this.ctrlVisible = false;
            }
        },
        disableElementTransition(newVal) {
            if (newVal) {
                clearTimeout(this.itv_enableTransition);
                this.itv_enableTransition = setTimeout(() => {
                    this.$store.commit('disableElementTransition', false);
                }, 1500);
            }
        },
    },
    methods: {
        setAIVideo(param) {
            if (this.videoList) {
                var id = param.id

                for (let i = 0; i < this.videoList.length; i++) {
                    let itm = this.videoList[i]
                    let vd = this.$refs[`video${i}`][0]

                    if (id !== i + 1) {
                        vd.style.opacity = 0
                        vd.pause()
                    } else {
                        vd.style.opacity = 1
                        vd.currentTime = 0
                        vd.volume = 1
                        vd.play()

                        this.setActiveSpeaker('WebexGPT')

                        clearTimeout(this.tmo_activeSpeaker)
                        this.tmo_activeSpeaker = setTimeout(() => {
                            vd.style.opacity = 0
                            vd.pause()

                            this.setActiveSpeaker(this.me.name)

                        }, itm.duration * 1000 + 300)
                    }
                }
            }
        },
        setActiveSpeaker(name) {
            const pp = this.$store.getters.people(name);
            this.$store.commit('activeSpeakerName', pp.name);
            if (pp.video) {
                this.$store.commit('activeSpeakerNameWithVideo', pp.name);
            }
        },
        initCam() {
            if (this.$store.state.dev) {
                return;
            }
            const constraints = { audio: false, video: { width: 1280, height: 720 } };
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((mediaStream) => {
                    const video = this.$refs.video;
                    video.srcObject = mediaStream;
                    video.onloadedmetadata = () => {
                        video.play();
                    };
                })
                .catch(function (err) {
                    console.log(err.name + ': ' + err.message);
                });
        },
        initResizeWatch() {
            // watch resize
            const elem = this.$refs.videoitm;
            this.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    if (entry.contentRect) {
                        this.calcElementSize();
                    }
                }
            });
            this.resizeObserver.observe(elem);
        },
        setHalo() {
            /*
            if (this.video === null && this.avatar !== null || this.me.name === this.name && !this.cameraOn) {
                this.$nextTick(() => {
                    const last0 = _.random(50, 500);
                    const last1 = _.random(300, 600);
                    const last2 = _.random(500, 3600);
                    this.haloTrans = mframe([{
                        dom: this.$refs.avatarHalo,
                        frames: [
                            { css: { opacity: '0.0' }, time: 0 },
                            { css: { opacity: '0.0' }, time: last0 },
                            { css: { opacity: '1.0' }, time: last0 + 30 },
                            { css: { opacity: '1.0' }, time: last0 + last1 },
                            { css: { opacity: '0.0' }, time: last0 + last1 + 30 },
                            { css: { opacity: '0.0' }, time: last0 + last1 + last2 },
                        ]
                    }], {
                    });
                    this.haloTrans.repeat(Infinity);
                });

            } else {
                if (this.haloTrans !== null) {
                    this.haloTrans.stop()
                }
            }
            */

        },

        mute(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            let plist = [];
            const len = this.peopleList.length;
            for (let i = 0; i < len; i++) {
                const p = this.peopleList[i];
                if (p.name === this.name) {
                    p.muted = true;
                }
                plist.push(p);
            }
            this.$store.commit('peopleList', plist);

            if (this.name === this.me.name) {
                this.$store.commit('muted', true);
            }
        },
        unmute(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            let plist = [];
            const len = this.peopleList.length;
            for (let i = 0; i < len; i++) {
                const p = this.peopleList[i];
                if (p.name === this.name) {
                    p.muted = false;
                }
                plist.push(p);
            }
            this.$store.commit('peopleList', plist);

            if (this.name === this.me.name) {
                this.$store.commit('muted', false);
            }

        },
        mouseover() {
            if (this.isBgVideo) {
                return;
            }
            this.ctrlVisible = !this.isDragging;
        },
        mouseout() {
            if (this.ctrlVisible && !this.menuVideoVisible) {
                this.ctrlVisible = false;
            }
        },

        unpin() {
            let plist = [];
            const len = this.peopleList.length;
            for (let i = 0; i < len; i++) {
                const p = this.peopleList[i];
                if (p.name === this.name) {
                    p.pin = undefined;
                    p.autopin = false;
                    //.........???
                    if (this.name === this.activeSpeakerName) {
                        this.$store.commit("activeSpeakerInStage", false);
                    }
                }
                plist.push(p);
            }
            this.$store.commit('peopleList', plist);
        },
        unpinActiveSpeaker() {
            // this.unpin()
            this.$store.commit("activeSpeakerInStage", false);
        },

        toggleMaximize() {
            if (this.maximizeVideo) {
                this.$store.commit('maximizeVideo', null);
            } else {
                this.$store.commit('maximizeVideo', this.$store.getters.people(this.name));
            }
        },

        calcElementSize() {

            if (this.$refs.videoitm) {
                const videoitm = this.$refs.videoitm.getBoundingClientRect();

                const size = Math.max(Math.min(videoitm.height / 100 * 15, 80), 15); // max 80, min 15
                const size2 = Math.max(Math.min(videoitm.height / 100 * 8, 44), 12);
                this.bigNameFontSize = `${size}px`;
                this.bigNameSubFontSize = `${size2}px`;

                const avasize = videoitm.height / 2;
                this.avatarSize = `${avasize}px`;
                this.avatarHaloSize = `${avasize * 1.7}px`;

                if (videoitm.width >= 1200) {
                    this.labelClassName = 'lb_1200';
                    this.iconSize = 16;
                } else if (videoitm.width >= 600) {
                    this.labelClassName = 'lb_600';
                    this.iconSize = 14;
                } else if (videoitm.width >= 400) {
                    this.labelClassName = 'lb_400';
                    this.iconSize = 12;
                } else if (videoitm.width >= 200) {
                    this.labelClassName = 'lb_200';
                    this.iconSize = 12;
                } else {
                    this.labelClassName = 'lb_small';
                    this.iconSize = 12;
                }
                this.smallSize = videoitm.width < 200;

                if (this.$refs.video) {
                    if (!Array.isArray(this.$refs.video)) {
                        if (videoitm.width / videoitm.height > 1.6) {
                            if (!this.isAI) {
                                this.$refs.video.style.width = '100%'
                                this.$refs.video.style.height = 'auto'
                            } else {
                                this.$refs.video.style.width ='auto'
                                this.$refs.video.style.height = 'calc(100% - 60px)'
                                this.$refs.video.style.marginTop = '13px'
                            }
                            
                        } else {
                            if (!this.isAI) {
                                this.$refs.video.style.width = 'auto'
                                this.$refs.video.style.height = '100%'
                            } else {
                                this.$refs.video.style.width = 'auto'
                                this.$refs.video.style.height = 'calc(100% - 60px)'
                                this.$refs.video.style.marginTop = '13px'
                            }
                            
                        }
                    }

                }

                if (this.videoList) {
                    for (let i = 0; i < this.videoList.length; i++) {
                        let vd = this.$refs[`video${i}`][0]

                        if (videoitm.width / videoitm.height > 1.6) {
                            if (!this.isAI) {
                                vd.style.width = '100%'
                                vd.style.height = 'auto'
                            } else {
                                vd.style.width ='auto'
                                vd.style.height = 'calc(100% - 60px)'
                                vd.style.marginTop = '13px'
                            }
                        } else {
                            if (!this.isAI) {
                                vd.style.width = 'auto'
                                vd.style.height = '100%'
                            } else {
                                vd.style.width = 'auto'
                                vd.style.height = 'calc(100% - 60px)'
                                vd.style.marginTop = '13px'
                            }
                            
                        }
                    }
                }

                this.isSmallVideo = videoitm.width < 320;
            }
        },
        setEmojiSize() {
            const videoitm = this.$refs.videoitm.getBoundingClientRect();
            this.reaction_icon_size = videoitm.height / 1.5;
            this.reaction_icon_margin = videoitm.height / 22;
        },

        mousedown(evt) {
            //evt.stopPropagation();
            this.mouseX = evt.pageX;
            this.mouseY = evt.pageY;
        },
        dragstart(evt) {
            if (!this.allowDrag) {
                return;
            }
            if (!this.isDragging) {
                this.isDragging = true;
            }
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'

            requestAnimationFrame(() => {
                this.$refs.videoitm.style.transition = 'none';
                this.$refs.videoitm.style.transform = 'translateX(-9999px)';
            });
            this.$emit('dragstart', { inStage: this.inStage });
        },
        drag(evt) {
            const vrc = this.$refs.videoitm.getBoundingClientRect();
            const left = this.prevleft + (evt.pageX - this.mouseX);
            const top = this.prevtop + (evt.pageY - this.mouseY);
            const rect = { left: left, top: top, width: vrc.width, height: vrc.height };
            if (rect.left !== this.prevDragPosition.left && rect.top !== this.prevDragPosition.top) {
                this.prevDragPosition = rect;
                this.$emit('dragging', { index: this.index, name: this.name, rect: rect });
            }
        },
        dragend(evt) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            this.justDropped = true;
            if (this.$refs.videoitm) {
                this.$refs.videoitm.style.transform = '';
                if (this.index !== this.videoDropAndInsertAtIndex) {
                    this.left = this.prevDragPosition.left;
                    this.top = this.prevDragPosition.top;
                }
                requestAnimationFrame(() => {
                    if (this.$refs.videoitm) {
                        this.$refs.videoitm.style.transition = '';
                    }
                });
            }
            this.isDragging = false;
            this.$emit('dragstop');
        },
        onContextmenu(evt) {
            const rectBtn = this.$refs.btnmore.getBoundingClientRect();
            const popperOffsets = {
                x: evt.pageX - rectBtn.left,
                y: evt.pageY - rectBtn.bottom,
            };

            this.$popper.hideAll();
            this.showMenu({
                placement: 'bottom-start',
                modifiers: [
                    {
                        name: 'flip',
                        enabled: false,
                    },
                    {
                        name: 'offset',
                        options: {
                            offset: [popperOffsets.x, popperOffsets.y],
                        },
                    },
                ],
            });
        },
        
        onBtnmoreClick() {
            this.showMenu({
                placement: 'bottom-start',
                modifiers: [
                    {
                        name: 'flip',
                        enabled: true,
                    },
                ],
            });
        },
        showMenu(options) {
            if (!this.menuVisible) {
                this.$popper.show(
                    menuVideo,
                    {
                        meetingId: this.meetingId,
                        theme: this.theme,
                        menuVideoName: this.name,
                        isSign: this.isSign,
                    }, // component props
                    {
                        reference: this.$refs.btnmore,
                        closeTrigger: 'mousedown',
                        arrowVisible: false,
                        roundedCorner: true,
                        appendToBody: true,
                        theme: `${this.theme} ${this.themeColor}`,
                        options,
                        affiliatedElementSelector: ['.sub-menulist'],
                    }, // popper props
                    {
                        opened: () => { this.menuVisible = true },
                        closed: () => { this.menuVisible = false },
                    } // popper eventlistener
                );
            } else {
                this.$popper.hideAll();
            }
        },
        checkSignal() {
            setInterval(() => {
                this.signalGood = !this.signalGood;
            }, _.random(3000, 10000));
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

        openInvitePanel() {
            this.$store.commit('sidePanelIsOpen', true)
            this.$store.commit('plistPanelVisible', true)
            this.$store.commit('plistPanelPage', 'invite')
            this.$popper.hideAll()
        },
        inviteTestPeople() {
            this.$store.commit("FTE_peopleInvited", true)
            this.$popper.hideAll()
        },
    }
}
</script>

<style lang="scss">
.video_item_invite {
    position: absolute;
    @include flex(column);
    pointer-events: auto;
    border-radius: 8px;
    transform: rotate(0);
    box-sizing: border-box;
    border-style: solid;
    border-color: rgba($color: #000000, $alpha: 0.0);

    .wrap {
        @include flex(column);
        background: rgba(255, 255, 255, 0.11);
        width: 100%;
        height: 100%;
        flex-grow: 1;
        overflow: hidden;
        border-radius: 8px;
        transform: rotate(0);
    }

    .close {
        position: absolute;
        width: 16px;
        height: 16px;
        top: 8px;
        right: 10px;
    }

    .tt {
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 16px;
    }
    .btn {
        width: 232px;
        margin-bottom: 8px;

        .label {
            font-size: 16px;
            font-weight: 600;
            margin-left: 4px;
        }
    }
}

.video_item {
    display: flex;
    justify-content: center;
    pointer-events: auto;
    border-radius: 8px;
    transform: rotate(0);
    box-sizing: border-box;
    border-style: solid;
    border-color: rgba($color: #000000, $alpha: 0.0);

    &.grabbing,
    &:active {
        cursor: grabbing;
    }

    &::after {
        opacity: .6;
        content: "";
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 9px;
        padding: 1px;
        background: linear-gradient(to right, rgba($color: #000000, $alpha: 0.1) 0%, rgba($color: #000000, $alpha: 0.1) 100%);
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

    &.trans {
        transition: left 0.2s ease-out, top 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
    }

    &.absolute {
        position: absolute;
    }

    &.zindex2 {
        z-index: 2 !important;
    }

    .video {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 8px;
        transform: rotate(0);
        display: flex;
        justify-content: center;

        &.aivideo {
            width: 82%; /* trick: width equal with height */
            height: 80%;
            top: 10%;
            border: 4px solid rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            overflow: hidden;

            .bg {
                background-color: #000 !important;
            }
        }

        .bg {
            position: absolute;
            background-color: $md-gray-20;
            width: 100%;
            height: 100%;
        }

        .signlevideo {
            position: absolute;
            transform: scale(1, 1);
            width: 100%;
            height: auto;

            &.mirror {
                transform: scale(-1, 1);
            }

            &.overlay {
                transition: opacity 0.2s ease-out;
            }
        }

        img {
            position: absolute;
            width: 100%;
            height: auto;
            object-fit: cover;
        }

        .split-video {
            @include flex;
            width: 100%;
            height: 100%;

            .part {
                position: relative;
                flex-grow: 1;
                height: 100%;
                overflow: hidden;

                .vd {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                }
            }
        }
    }


    .as_border {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        //box-shadow: 0 0 0 4px rgba($color: $md-blue-40, $alpha: .4), 0 0 0 2px $md-blue-40 inset;
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
            padding: 2px;
            background: linear-gradient(to right, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
            -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
            mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;

            animation-name: glow-animation-before;
            animation-duration: 16s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
            pointer-events: none;
        }

        &::after {
            opacity: .6;
            content: "";
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border-radius: 12px;
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

            animation-name: glow-animation-after;
            animation-duration: 16s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
            pointer-events: none;
        }
    }

    .selected_border {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        border-radius: 8px;
        box-sizing: border-box;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 8px;
            padding: 1px;
            background: black;
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

    @keyframes glow-animation-before {
        0% {
            background: linear-gradient(0deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        5% {
            background: linear-gradient(18deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        10% {
            background: linear-gradient(36deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        15% {
            background: linear-gradient(54deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        20% {
            background: linear-gradient(72deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        25% {
            background: linear-gradient(90deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        30% {
            background: linear-gradient(108deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        35% {
            background: linear-gradient(126deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        40% {
            background: linear-gradient(144deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        45% {
            background: linear-gradient(162deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        50% {
            background: linear-gradient(180deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        55% {
            background: linear-gradient(198deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        60% {
            background: linear-gradient(216deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        65% {
            background: linear-gradient(234deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        70% {
            background: linear-gradient(252deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        75% {
            background: linear-gradient(270deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        80% {
            background: linear-gradient(288deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        85% {
            background: linear-gradient(306deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        90% {
            background: linear-gradient(324deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        95% {
            background: linear-gradient(342deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        100% {
            background: linear-gradient(360deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
    }

    @keyframes glow-animation-after {
        0% {
            opacity: .6;
            background: linear-gradient(0deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        5% {
            opacity: .3;
            background: linear-gradient(18deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        10% {
            opacity: .0;
            background: linear-gradient(36deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        15% {
            opacity: .3;
            background: linear-gradient(54deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        20% {
            opacity: .6;
            background: linear-gradient(72deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        25% {
            opacity: .3;
            background: linear-gradient(90deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        30% {
            opacity: .0;
            background: linear-gradient(108deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        35% {
            opacity: .3;
            background: linear-gradient(126deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        40% {
            opacity: .6;
            background: linear-gradient(144deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        45% {
            opacity: .3;
            background: linear-gradient(162deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        50% {
            opacity: 0;
            background: linear-gradient(180deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        55% {
            opacity: .3;
            background: linear-gradient(198deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        60% {
            opacity: .6;
            background: linear-gradient(216deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        65% {
            opacity: .3;
            background: linear-gradient(234deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        70% {
            opacity: .0;
            background: linear-gradient(252deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        75% {
            opacity: .3;
            background: linear-gradient(270deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        80% {
            opacity: .6;
            background: linear-gradient(288deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        85% {
            opacity: .3;
            background: linear-gradient(306deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        90% {
            opacity: .0;
            background: linear-gradient(324deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        95% {
            opacity: .3;
            background: linear-gradient(342deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }

        100% {
            opacity: .6;
            background: linear-gradient(360deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
    }



    .ico_host {
        position: absolute;
        width: 8px;
        height: 8px;
        top: 3px;
        right: 3px;
        /*background: url(~@/assets/icon/ico_plist_wbx_ball.svg) no-repeat center;*/
        background-size: contain;
    }



    .lb_name {
        position: absolute;
        height: 24px;
        left: 4px;
        bottom: 4px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        user-select: none;
        padding-right: 4px;

        background-color: rgba(0, 0, 0, 0.54);
        border-radius: 4px;

        .txt {
            font-size: 12px;
            font-weight: 600;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: white;
            margin-left: 4px;

            &.tz {
                margin-left: 12px;
            }
        }

        .ico {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 14px;
            margin-left: 4px;
            color: white;
        }

        .ico-signal {
            margin-left: 4px;
            pointer-events: auto;
        }
        .ico-sign {
            margin-left: 4px;
            pointer-events: auto;
            transform: scaleX(-1);
        }

        /*
        &.lb_small {
            font-size: 12px;
            height: 20px;
        }
        &.lb_200 {
            font-size: 14px;
            height: 24px;
        }
        &.lb_400 {
            font-size: 16px;
            height: 28px;
        }
        &.lb_600 {
            font-size: 18px;
            height: 32px;
        }
        &.lb_1200 {
            font-size: 20px;
            height: 36px;
        }
        */
    }

    .lb_ai {
        position: absolute;
        width: 100%;
        bottom: 4px;
        @include flex;
        user-select: none;
        text-align: center;
        font-weight: 600;
        font-size: 24px;
        color: white;

    }

    .bigname {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

        .lb {
            width: 84%;
            color: $md-gray-100;
            text-align: center;
            margin-top: 20%;

            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .lb-sub {
            color: $text-color-secondary-light-ui;
            margin-top: -2%;
        }

        &.abbr .lb {
            font-weight: 200;
        }

        .ico {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 14px;
            margin: 0 6px;
        }
    }

    video.grid2 {
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
    }

    .avatar-with-halo {
        position: absolute;
        top: calc(50% - 2%);
        left: 50%;
        transform: translate(-50%, -50%);

        .halo {
            opacity: 0;
            position: absolute;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            top: 50%;
            left: 50%;
            background-image: url(~@/assets/img/active-speaker-halo-animation.png);
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            transition: opacity .3;
        }

        .avatar {
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 50%;
            overflow: hidden;
            background-size: cover;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            background-color: #ededed;
        }
    }

    .ctrl {
        position: absolute;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        top: 10px;
        user-select: none;

        .lft {
            flex-grow: 1;

            .btn-pin {
                margin-left: 12px;

                &.opacity {
                    background-color: rgba($color: white, $alpha: 0.48);
                }
            }
        }

        .btn {
            width: 32px;
            height: 32px;
            border-radius: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: $md-gray-05;
            border: 1px solid rgba($color: #000000, $alpha: .3);
        }

        .btn.off {
            color: #FFF;
            background-color: $md-red-50;
        }

        .btn-mute {
            width: auto;
            margin-right: 6px;
        }
        .btn-popout {
            margin-right: 6px;
        }

        .btn-mute .ico {
            width: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .btn-more {
            margin-right: 12px;
        }

        &.smallvideo {
            height: 28px;
            top: 4px;
            padding: 0;
            justify-content: flex-end;

            .btn {
                width: 28px;
                height: 28px;
            }

            .btn-mute {
                margin-right: 4px;
            }

            .btn-more {
                margin-right: 4px;
            }

            .btn-pin {
                margin-left: 4px;
            }
        }

        &.sidebyside1 {
            height: 28px;
            top: 19px;
            right: 86px;
            padding: 0;
            justify-content: flex-end;
        }

        .lb {
            font-size: 12px;
            margin: 0 10px 0 -5px;
        }

    }


    .fade {
        transition: opacity 0.3s ease-out;
        opacity: 0;
    }

    .reaction-icon {
        position: absolute;
        transform-origin: center;

        display: flex;
        justify-content: center;
        align-items: center;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
    }


    /* ------------------ drak/hybrid ------------------ */

    &.dark,
    &.hybrid {
        .video .bg {
            background-color: $md-gray-90;
        }

        .video .bgsts {
            background-color: $md-gray-90;
        }

        .avatar {
            background-color: #ededed;
        }

        .ctrl {
            .btn {
                background-color: $md-gray-95;
                border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
            }

            .btn.off {
                background-color: $md-red-60;
            }

            .lft .opacity {
                background-color: rgba($color: black, $alpha: 0.28);
            }
        }

        .bigname {
            .lb {
                color: white;
            }

            .lb-sub {
                color: $text-color-secondary-dark-ui;
            }
        }

        .selected_border {
            &::before {
                background: white;
            }
        }
    }

}</style>
