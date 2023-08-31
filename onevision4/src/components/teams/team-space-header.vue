<template>
    <div 
      class='space-content-header' 
      :class="[theme]"
      ref="header"
      :style="{
        windowmode: isPopout,
        minHeight: cover !== null ? `${coverMinHeight}px` : `${coverMinHeight - coverMarginBottom}px`,
        maxHeight: cover !== null ? `${coverMaxHeight}px` : `${coverMaxHeight - coverMarginBottom}px`,
      }"
    >
        <span class="row1"
          ref="coverArea"
          :class="{trans: transition}"
          :style="{
            backgroundImage: cover !== null ? coverImage : '',
            marginBottom: cover !== null ? `${coverMarginBottom}px` : '',
            height: coverExpanded ? `125px` : `65px`,
          }"
        >
          <div v-if="cover !== null"
            class="cover"
            :style="{
              backgroundImage: coverImage,
              filter: `blur(${coverBlur}px)`
            }"
          ></div>
          <div class="toplev" 
            :class="{
              singleline: !team && !statusTxt,
            }"
          >
            <div class="title">
              <span class="name">
                {{ spaceName }}
                <svg v-if="isFav" class="fav" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.4609 7.10135C14.5837 7.00504 14.6734 6.87288 14.7173 6.72326C14.7614 6.57363 14.7575 6.41402 14.7063 6.26668C14.6551 6.11935 14.5592 5.99164 14.4318 5.90143C14.3045 5.81116 14.1522 5.76288 13.996 5.76333H10.2872C10.2384 5.76044 10.1915 5.74396 10.1517 5.7157C10.1119 5.68744 10.0809 5.6486 10.0622 5.60357L8.70266 1.74926C8.65173 1.60318 8.55651 1.4766 8.43015 1.38711C8.30384 1.29763 8.15273 1.2497 7.99788 1.25C7.84318 1.25044 7.69243 1.29865 7.56627 1.38803C7.44005 1.47741 7.34468 1.60359 7.2931 1.74926L5.96351 5.59858C5.94712 5.64316 5.91803 5.682 5.87984 5.71041C5.8417 5.73877 5.79607 5.75539 5.74858 5.75834H1.96976C1.81851 5.76278 1.67216 5.81286 1.54993 5.90198C1.42771 5.99109 1.33535 6.11506 1.28497 6.2576C1.23738 6.40118 1.23537 6.55596 1.27921 6.70069C1.32305 6.84548 1.41061 6.97319 1.5299 7.06635L4.419 9.5627C4.46911 9.59969 4.50689 9.65091 4.5274 9.70973C4.54791 9.76849 4.55019 9.8321 4.53396 9.89221L3.27935 13.7964C3.23804 13.9438 3.24297 14.1004 3.29348 14.2449C3.34398 14.3895 3.43764 14.5151 3.56182 14.6049C3.686 14.6946 3.83474 14.7443 3.988 14.747C4.14127 14.7497 4.29169 14.7055 4.419 14.6202L7.85792 12.2737C7.89871 12.2468 7.94655 12.2325 7.99538 12.2325C8.04427 12.2325 8.09205 12.2468 8.13284 12.2737L11.5818 14.6202C11.7039 14.704 11.8484 14.7492 11.9966 14.75C12.1132 14.7492 12.2281 14.7214 12.3321 14.6688C12.4362 14.6162 12.5266 14.5403 12.5964 14.4469C12.6661 14.3536 12.7133 14.2453 12.7341 14.1308C12.7549 14.0161 12.7489 13.8983 12.7164 13.7864L11.4518 9.86719C11.4374 9.81802 11.4388 9.76549 11.4558 9.71712C11.4728 9.66874 11.5046 9.62695 11.5468 9.59764L14.4609 7.10135Z" fill="#F2990A"/>
                </svg>
              </span>
              <div v-if="team || statusTxt" class="team" :style="{color: team && teamColor[theme === 'dark' ? 'dark' : 'light']}">{{ team || statusTxt }}</div>
            </div>

            <div class="btn-cal-add" title="Schedule a meeting">
              <wl-icon name="calendar-add-bold" size="16" class="ico-cal-add" />
            </div>
            <md-button
                v-if="isSpace"
                aria-label="button"
                color="green"
                size="28"
                class="btn-meet"
                @click="meet"
              >Meet</md-button>

            <md-button
                v-if="!isSpace"
                aria-label="button"
                color="blue"
                size="28"
                class="btn-circle"
                title="Share content"
              >
              <wl-icon name="share-screen-bold" size="16" />
            </md-button>
            <md-button
                v-if="!isSpace"
                aria-label="button"
                color="green"
                size="28"
                class="btn-circle"
                ref="audiocall"
                title="Audio call"
                @click="showCallDropdown($event, 'audiocall')"
              >
              <wl-icon name="handset-bold" size="16" />
            </md-button>
            <md-button
                v-if="!isSpace"
                aria-label="button"
                color="green"
                size="28"
                class="btn-circle"
                ref="videocall"
                title="Video call"
                @click="showCallDropdown($event, 'videocall')"
              >
              <wl-icon name="camera-bold" size="16" />
            </md-button>
            
          </div>

          <div v-if="cover !== null" class="cover_resize_handler" @mousedown="coverResizeHandlerMousedown" @click="toggleCover()"></div>
        </span>

        <span class="row2">
          <div class="tabs space-content-header-tabs" @mouseleave="leaveTab">
            <div class="space-content-header-tab-active-bg"></div>
            <div v-show="visibleTabs >= 1" class="tab tabitm space-content-header-tab0" :class="{active: activeTabId === 0}" @mouseover="hoverTab(0)" @click="selectTab(0, 'message')" ><span class="lb">Messages</span></div>
            <div v-show="visibleTabs >= 2" class="tab tabitm space-content-header-tab1" :class="{active: activeTabId === 1}" @mouseover="hoverTab(1)" @click="selectTab(1, 'people')" ><span class="lb">{{isSpace ? `People (${people.length+1})` : `Profile`}}</span></div>
            <div v-show="visibleTabs >= 3" class="tab tabitm space-content-header-tab2" :class="{active: activeTabId === 2}" @mouseover="hoverTab(2)" @click="selectTab(2, 'content')" ><span class="lb">Content</span></div>
            <div v-show="visibleTabs >= 4" class="tab tabitm space-content-header-tab3" :class="{active: activeTabId === 3}" @mouseover="hoverTab(3)" @click="selectTab(3, 'meetings')" ><span class="lb">Meetings</span></div>
            <div v-show="visibleTabs >= 4" class="tab tabitm space-content-header-tab4" @mouseover="hoverTab(4)" @click="addApp" >
              <span class="lb">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.75 5.62488H6.375V2.24988C6.375 2.15042 6.33549 2.05504 6.26517 1.98471C6.19484 1.91439 6.09946 1.87488 6 1.87488C5.90054 1.87488 5.80516 1.91439 5.73484 1.98471C5.66451 2.05504 5.625 2.15042 5.625 2.24988V5.62488H2.25C2.15054 5.62488 2.05516 5.66439 1.98484 5.73471C1.91451 5.80504 1.875 5.90042 1.875 5.99988C1.875 6.09933 1.91451 6.19472 1.98484 6.26504C2.05516 6.33537 2.15054 6.37488 2.25 6.37488H5.625V9.74988C5.625 9.84933 5.66451 9.94472 5.73484 10.015C5.80516 10.0854 5.90054 10.1249 6 10.1249C6.09946 10.1249 6.19484 10.0854 6.26517 10.015C6.33549 9.94472 6.375 9.84933 6.375 9.74988V6.37488H9.75C9.84946 6.37488 9.94484 6.33537 10.0152 6.26504C10.0855 6.19472 10.125 6.09933 10.125 5.99988C10.125 5.90042 10.0855 5.80504 10.0152 5.73471C9.94484 5.66439 9.84946 5.62488 9.75 5.62488Z" fill="white" fill-opacity="0.7"/>
                </svg>
                Apps
              </span>
            </div>
            <div v-show="visibleTabs < 99 && invisibleTabs > 0" class="tab space-content-header-tab-arr" >
              <span class="lb">
                +{{invisibleTabs}}
                <wl-icon name="arrow-down-filled" size="16" class="arr" />
              </span>
            </div>
          </div>
          <div class="icons" ref="tabrowicons">
            <div class="ico" >
              <wl-icon name="pin-list-bold" size="16" />
            </div>
            <div class="ico" >
              <wl-icon name="search-bold" size="16" />
            </div>
            <div class="ico" > 
              <wl-icon name="settings-bold" size="16" />
            </div>
            <!--
            <div class="ico-colored" :class="{active: teamsSidecarName == 'ai-space' && !meetingsSidecarVisible}" @click="toggleSidePanel('ai-space')" >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_4012_409250)">
                <path d="M13.94 7.01235C13.8745 7.01764 13.8108 7.03579 13.7523 7.06575C13.6938 7.09571 13.6418 7.1369 13.5993 7.18696C13.5568 7.23702 13.5245 7.29497 13.5044 7.3575C13.4842 7.42004 13.4766 7.48592 13.482 7.5514C13.494 7.69937 13.5 7.8489 13.5 8C13.4998 8.94853 13.2542 9.88088 12.7873 10.7065C12.3204 11.5322 11.648 12.2231 10.8353 12.7122C10.0226 13.2013 9.09721 13.472 8.14903 13.4979C7.20086 13.5239 6.26208 13.3042 5.42382 12.8603C5.34188 12.8168 5.24942 12.7969 5.15681 12.8029C5.06419 12.8089 4.97507 12.8405 4.89942 12.8943C4.53113 13.1553 4.1133 13.3381 3.67168 13.4315C3.23006 13.5249 2.77399 13.5268 2.33157 13.4373C2.92122 12.9853 3.35692 12.3623 3.57912 11.6533C3.6077 11.5768 3.61708 11.4943 3.60644 11.4133C3.59579 11.3322 3.56546 11.255 3.51807 11.1883C2.93288 10.3656 2.58544 9.39761 2.51382 8.3905C2.44221 7.38339 2.64917 6.376 3.11205 5.4787C3.57493 4.5814 4.27586 3.82882 5.13803 3.30342C6.00021 2.77801 6.99037 2.50005 8.00002 2.5C8.15433 2.5 8.30762 2.50635 8.45852 2.5188C8.52408 2.52496 8.5902 2.51796 8.65302 2.49822C8.71583 2.47849 8.77408 2.44641 8.82433 2.40387C8.87459 2.36132 8.91584 2.30918 8.94567 2.25048C8.97551 2.19178 8.99332 2.12772 8.99807 2.06205C9.00356 1.99662 8.9961 1.93074 8.97612 1.86819C8.95614 1.80564 8.92404 1.74763 8.88164 1.69749C8.83925 1.64735 8.78739 1.60604 8.72903 1.57594C8.67068 1.54584 8.60696 1.52753 8.54152 1.52205C8.36312 1.50735 8.18262 1.5 8.00002 1.5C6.8302 1.50005 5.68206 1.81578 4.67669 2.41389C3.67132 3.012 2.84598 3.87032 2.2877 4.89834C1.72943 5.92635 1.4589 7.08597 1.50465 8.25491C1.55041 9.42384 1.91075 10.5588 2.54767 11.54C2.36036 12.0633 1.99365 12.5032 1.51267 12.7817C1.43597 12.8303 1.36567 12.875 1.30467 12.9201C1.19932 12.9964 1.11604 13.0993 1.0633 13.2182C1.01055 13.3371 0.990222 13.4678 1.00437 13.5971C1.01828 13.7276 1.06594 13.8522 1.14265 13.9586C1.21937 14.0651 1.3225 14.1497 1.44187 14.2041C1.932 14.407 2.4583 14.508 2.98872 14.5009C3.77678 14.5039 4.55022 14.2883 5.22312 13.8781C6.21396 14.3458 7.30692 14.5555 8.40048 14.4878C9.49405 14.42 10.5528 14.077 11.4783 13.4905C12.4038 12.9041 13.1661 12.0933 13.6944 11.1334C14.2227 10.1735 14.4998 9.09566 14.5 8C14.5 7.82157 14.493 7.6449 14.479 7.47C14.4682 7.33784 14.4054 7.21537 14.3043 7.12955C14.2032 7.04373 14.0722 7.00157 13.94 7.01235Z" fill="white" fill-opacity="0.95"/>
                <g clip-path="url(#clip1_4012_409250)">
                <path d="M14.9062 1.75C15.2687 1.75 15.5625 1.45619 15.5625 1.09375C15.5625 0.731313 15.2687 0.4375 14.9062 0.4375C14.5438 0.4375 14.25 0.731313 14.25 1.09375C14.25 1.45619 14.5438 1.75 14.9062 1.75ZM10.3125 3.82812C10.3125 2.80122 11.145 1.96875 12.1719 1.96875C13.1988 1.96875 14.0312 2.80122 14.0312 3.82812C14.0312 4.85503 13.1988 5.6875 12.1719 5.6875C11.145 5.6875 10.3125 4.85503 10.3125 3.82812ZM12.1719 1.09375C10.6617 1.09375 9.4375 2.31797 9.4375 3.82812C9.4375 5.33828 10.6617 6.5625 12.1719 6.5625C13.682 6.5625 14.9062 5.33828 14.9062 3.82812C14.9062 2.31797 13.682 1.09375 12.1719 1.09375Z" fill="url(#paint0_linear_4012_409250)"/>
                </g>
                </g>
                <defs>
                <linearGradient id="paint0_linear_4012_409250" x1="16" y1="0" x2="9" y2="7" gradientUnits="userSpaceOnUse">
                <stop stop-color="#3CC29A"/>
                <stop offset="1" stop-color="#0672EF"/>
                </linearGradient>
                <clipPath id="clip0_4012_409250">
                <rect width="16" height="16" fill="white"/>
                </clipPath>
                <clipPath id="clip1_4012_409250">
                <rect width="7" height="7" fill="white" transform="translate(9)"/>
                </clipPath>
                </defs>
              </svg>
            </div>
            -->
          </div>
        </span>

    </div>
</template>

<script>
import _ from 'lodash';

const CALL_NUMBER1 = '+1 408-321-4505'
const CALL_NUMBER2 = '+1 408-322-6590'

export default {
    props:{
      parentRect: { // data comes from Windows.vue, WindowsContainer.vue
        type: DOMRect
      },
      isPopout: Boolean,
      isFav: Boolean,
      spaceName: String,
      isSpace: Boolean,
      team: String,
      teamColor: Object,
      tab: {
        default: 'message',
      },
      spaceSize: {
        type: String,
        default: 'normal',
      },
      statusTxt: {
        type: String,
        default: '',
      },
      cover: {
        type: Number,
        default: null,
      },
      coverExpanded: {
        type: Boolean,
        default: false,
      },
      people: Array,
      content: Object,
    },
    data() {
        return {
          selectorPrefix: '',
          curtab: this.tab,
          activeTabId: 0,
          coverMinHeight: 120,
          coverMaxHeight: 180,
          coverBlur: 3,
          coverResizeDraggingPageY: 0,
          coverHeightHeight: 0,
          coverMarginBottom: 6,
          isdragging: false,
          transition: false,
          visibleTabs: 99,
          invisibleTabs: 0,
          tabWidthArray: [],

          callDropdownVisible: false,
          callDropdownDataList: [
            {
              label: CALL_NUMBER1,
              icon: 'handset-bold',
              callback: (ref) => {
                let pp = this.$store.getters.people(this.spaceName)
                let info = {
                  number: CALL_NUMBER1,
                  people: pp,
                }
                if (ref === 'audiocall') {
                  this.startAudioCall(info)
                } else if (ref === 'videocall') {
                  this.startVideoCall(info)
                }
              }
            },
            {
              label: CALL_NUMBER2,
              icon: 'phone-bold',
              callback: (ref) => {
                let pp = this.$store.getters.people(this.spaceName)
                let info = {
                  number: CALL_NUMBER2,
                  people: pp,
                }
                if (ref === 'audiocall') {
                  this.startAudioCall(info)
                } else if (ref === 'videocall') {
                  this.startVideoCall(info)
                }
              }
            },
            {
              label: 'Call on Webex',
              icon: 'handset-bold',
            },
            {
              label: 'Audio source: Macbook',
            },
          ],
          callDropdownRef: null,
          popCallWidgetVisible: {},
          datalist: [
            {
              name: 'Sarah Robertson',
              avatar: 'marketing/f001.png',
              video: '17.mp4',
              sub: 'Work: +1 888 632 3267',
              status: 'pto',
            },
          ],


        }
    },
    computed:{
      theme() {
        return this.$store.state.theme;
      },
      themeColor() {
        return this.$store.state.themeColor;
      },
      themeColorList() {
        return this.$store.state.themeColorList;
      },
      avatarPath(){
        return this.$store.state.avatarPath;
      },
      avatarBgColors() {
        return this.$store.state.avatarBgColors;
      },
      spaceList() {
        return this.$store.state.spaceList;
      },
      spaceCoverList() {
        return this.$store.state.spaceCoverList;
      },
      coverImage() {
        const t = this.theme === 'dark' ? 'dark' : 'light';
        return `url(${this.$store.state.coverPath}${this.$store.state.spaceCoverList[this.cover][t]})`;
      },
      callingPeopleItems(){
        return this.$store.state.callingPeopleItems;
      },
      callAs() {
        return this.$store.state.callAs;
      },
      teamsSidecarName() {
        return this.$store.state.teamsSidecarName;
      },
      meetingsSidecarVisible() {
        return this.$store.state.meetingsSidecarVisible;
      },
      teamsNav() {
        return this.$store.state.teamsNav;
      },
      teamsNavPrev() {
        return this.$store.state.teamsNavPrev;
      },
    },
    beforeMount() {
      this.selectorPrefix = this.isPopout ? '.windowmode' : ''
    },
    mounted(){
      this.$eventBus.$on('teams-resizing', this.setLayout);

      var selector = `${this.selectorPrefix} .tabs .tabitm`
      let tabs = document.querySelectorAll(selector);
      let len = tabs.length;
      for(let i=0; i<len; i++){
        const tbrect = tabs[i].getBoundingClientRect();
        this.tabWidthArray.push(tbrect.width)
      }
    },
    destroyed() {
      this.$eventBus.$off('teams-resizing', this.setLayout);
    },
    watch: {
      parentRect(){
        this.setLayout()
      },
      spaceName() {
        this.selectTab(0, 'message');
      },
      spaceSize(val) {
        if (val === 'normal') {
          this.$nextTick(() => {
            this.moveTabBg(this.activeTabId);
          })
        } else {
          this.$nextTick(() => {
            this.moveTabBg(0);
          })
        }
      },
    },
    methods:{
      hoverTab(id) {
        if (this.isdragging) {
          return;
        }
        this.moveTabBg(id);
      },
      leaveTab() {
        this.moveTabBg(this.activeTabId);
      },
      moveTabBg(id) {
        const rect = document.querySelector(`${this.selectorPrefix} .space-content-header-tab${id}`).getBoundingClientRect();
        const rect2 = document.querySelector(`${this.selectorPrefix} .space-content-header-tabs`).getBoundingClientRect();
        document.querySelector(`${this.selectorPrefix} .space-content-header-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
        document.querySelector(`${this.selectorPrefix} .space-content-header-tab-active-bg`).style.width = `${rect.width}px`;
      },
      selectTab(id, tab) {
        this.moveTabBg(id);
        this.activeTabId = id;
        this.curtab = tab;
        this.$emit('tabchange', tab);
      },
      addApp() {
      },

      toggleCover(expand) {
        let lst = this.spaceList.slice();
        for (let i=0; i < lst.length; i++) {
          for(let j=0; j < lst[i].length; j++) {
            if (lst[i][j].name === this.spaceName) {
              if (expand === undefined) {
                lst[i][j].coverExpanded = !this.coverExpanded;
              } else {
                lst[i][j].coverExpanded = expand;
              }
              if (lst[i][j].coverExpanded) {
                this.coverBlur = 0;
              } else {
                this.coverBlur = 3;
              }
              break;
            }
          }
        }
        this.transition = true;
        this.$store.commit('spaceList', lst);

        setTimeout(() => {
          this.transition = false;
        }, 1000);
      },

      // ----- cover resize >>>>>>>
      coverResizeHandlerMousedown(evt) {
        evt.stopPropagation();
        this.coverResizeDraggingPageY = evt.pageY;
        const rect = this.$refs.coverArea.getBoundingClientRect();
        this.coverHeightHeight = rect.height;
        
        window.addEventListener("mousemove", this.coverResizeHandlerDragging);
        window.addEventListener("mouseup", this.coverResizeHandlerStopDrag);
      },
      coverResizeHandlerDragging(evt){
        if (!this.isdragging) {
          this.isdragging = true;
        }
        
        let offset = evt.pageY - this.coverResizeDraggingPageY;
        const h = this.coverHeightHeight + offset;
        this.coverBlur = (this.coverMaxHeight - h) / (this.coverMaxHeight - this.coverMinHeight) * 3;
        if (this.coverBlur < 0.5) {
          this.coverBlur = 0;
        }
        this.$refs.coverArea.style.height = `${h}px`

      },
      coverResizeHandlerStopDrag(){
        if (this.isdragging) {
          if (this.coverBlur === 0) {
            this.toggleCover(true);
          } else {
            this.toggleCover(false);
          }
          this.isdragging = false;
        }
        window.removeEventListener("mousemove", this.coverResizeHandlerDragging);
        window.removeEventListener("mouseup", this.coverResizeHandlerStopDrag);
      },
      // ------ cover resize <<<<<<<

      meet() {
        this.$store.commit('meetingTitle', this.spaceName);
        this.$store.commit('interstitialParams', {visible: true, host: true});
      },

      showCallDropdown(e, ref) {
        e.preventDefault();
        e.stopPropagation();

        if (ref !== this.callDropdownRef) {
          this.$popper.hideAll()
          this.callDropdownVisible = false
          this.callDropdownRef = ref
        }

        if (!this.callDropdownVisible) {
          this.$popper.show(
            {
              template: `
                <div class="common-menulist" style="width:280px;">
                  <div v-for="(itm, idx) in datalist"
                    :key="idx"
                    :class="{
                      'common-menulist-item': itm.label!=='divider',
                      'common-menulist-item-48': itm.label!=='divider',
                    }" 
                    @click="close(itm)"
                  >
                    <wl-icon v-if="itm.icon" :name="itm.icon" size="16" style="margin-right: 8px;" />
                    <div class="lb">
                      <div class="line1">{{itm.label}}</div>
                      <div v-if="itm.sub" class="line2">{{itm.sub}}</div>
                    </div>
                    <svg v-if="selected && selected.label === itm.label" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                    </svg>
                  </div>

                  <div class="common-menulist-item common-menulist-item-48" >
                    <div class="lb text-link">
                      Audio preferences
                    </div>
                  </div>
                </div>
              `,
              props: ['datalist', 'selected', 'onSelect'],
              methods: {
                close(itm) {
                  this.$popper.hideAll();
                  this.onSelect(itm);
                },
              }
            },
            {
              datalist: this.callDropdownDataList,
              onSelect: (itm) => {
                if (itm.callback) {
                  itm.callback(ref)
                }
              },
            }, // component props
            {
              reference: this.$refs[ref].$el,
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
              opened: () => {this.callDropdownVisible = true},
              closed: () => {this.callDropdownVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },



      startAudioCall(info) {
        var layout = 'widget';
        var incall = _.cloneDeep(this.callingPeopleItems);
        var ppp = this.$store.getters.people(info.people.name)
        var ppl = _.merge(info.people, ppp)
        ppl.callasIndex = this.callAs.id
        info.people = ppl
        
        var list = incall[layout]
        if (list.length < 2) {
          var i, itm
          for (i=0; i<list.length; i++) {
            itm = list[i];
            if (itm.people.name === info.people.name) {
              return;
            }
          }
          for (i=0; i<list.length; i++) {
            itm = list[i];
            if (!itm.incoming) {
              itm.onhold = true
            }
          }
          list.push(info);
          incall[layout] = list;
          this.$store.commit('callingPeopleItems', incall);
        }

        this.showCallWidget();

      },

      startVideoCall(info) {
        this.$eventBus.$emit('open-new-meeting-window', {
          meetingId: info.people.name,
          meetingType: 'video-call',
          currentSharing: [],
          videoLayout: 'single',
          meetingCallInfo: info,
          callPeopleVideoOn: false,
        }, {
          //
        })
      },

      showCallWidget() {
        var name = 'Sarah Robertson'
        var ppp = this.datalist.find( itm => itm.name === name );
        var peopleName = ppp.name
        var number = ppp.sub

        var layout='widget'
        this.$eventBus.$emit('show-call-widget', layout, {peopleName, number})

      },

      toggleSidePanel(name) {
        if (this.teamsSidecarName !== name || this.meetingsSidecarVisible) {
          this.$store.commit('teamsSidecarName', name)
          if (this.teamsNav === 'webexgpt') {
            this.$store.commit('teamsNav', this.teamsNavPrev);
          }
        } else {
          this.$store.commit('teamsSidecarName', null)
        }
        this.$store.commit('meetingsSidecarVisible', false);

      },
      

      setLayout() {
        const ele = this.$refs.header;
        if (ele) {
          let len = this.tabWidthArray.length;
          const rect = ele.getBoundingClientRect();
          const rectico = this.$refs.tabrowicons.getBoundingClientRect();
          const tabMoreWidthAndMargin = 54 + 4
          const leftRightMargin = 16 + 16
          let leftspace = rect.width - rectico.width - leftRightMargin;
          
          let totalwidth = 0;
          this.visibleTabs = 0;

          for(let i=0; i<len; i++){
            const tbw = this.tabWidthArray[i];
            totalwidth += tbw + 4;
            if (totalwidth < leftspace) {
              this.visibleTabs++;
            }
          }

          if (this.visibleTabs < len) {
            leftspace -= tabMoreWidthAndMargin
            this.visibleTabs = 0;
            totalwidth = 0;

            for(let i=0; i<len; i++){
              const tbw = this.tabWidthArray[i];
              totalwidth += tbw + 4;
              if (totalwidth < leftspace) {
                this.visibleTabs++;
              }
            }
          }

          if (this.visibleTabs === len) {
            this.visibleTabs = len;
          } else if (this.visibleTabs === len - 1) {
            this.visibleTabs = len - 2;
          } 
          
          if (this.visibleTabs === 0) {
            this.visibleTabs = 1;
          }
          this.invisibleTabs = Math.max(len - this.visibleTabs, 0);
        }
      },
    }
}
</script>


<style lang="scss">
.space-content-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;

  .row1 {
    position: relative;
    display: flex;
    
    flex-grow: 1;
    align-items: center;
    overflow: hidden;
    background-repeat: repeat-x;
    background-position: center -10px;

    &.trans {
      transition: all .3s ease;
    }

    .cover {
      position: absolute;
      background-repeat: repeat-x;
      background-position: center left;
      width: calc(100% + 20px);
      height: calc(100% + 20px);
      top: -10px;
      left: -10px;
    }

    .toplev {
      position: relative;
      flex-grow: 1;
      display: flex;
      align-items: center;
      height: 100%;
      margin: 16px 16px 12px 16px;
      border-radius: 12px 0px 0px 0px;
      overflow: hidden;
      
      .title {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 0; /* important for text-overflow: ellipsis */
        width: 0; /* important for text-overflow: ellipsis */
        margin-right: 8px;
        margin-bottom: 10px;

        .name {
          display:inline-block;
          height: 26px;
          font-size: 20px;
          line-height: 22px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          .fav {
            path {
              fill: $md-yellow-40;
              fill-opacity: 1;
            }
          }
        }
        .team {
          display:inline-block;
          height: 20px;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .btn-cal-add {
        @include flex;
        width: 28px;
        height: 28px;
        box-sizing: border-box;
        border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
        border-radius: 50%;
        margin-top: 14px;
        align-self: flex-start;
      }

      .btn-meet {
        min-width: 44px;
        height: 28px;
        font-size: 14px;
        padding: 0 10px;
        margin-top: 14px;
        margin-left: 8px;
        align-self: flex-start;
      }
      .btn-circle {
        min-width: 28px;
        width: 28px;
        height: 28px;
        margin-top: 14px;
        align-self: flex-start;
        margin-left: 8px;
        margin-right: 0;
      }

      &.singleline {
        .left {
          height: auto;
        }
      }
    }

    .cover_resize_handler {
      position: absolute;
      pointer-events: auto;
      width: 100%;
      height: 4px;
      bottom: 0;
      left: 0;
      cursor: row-resize;

    }
  }
  .row2 {
    display: flex;
    align-items: center;
    height: 32px;
    margin-bottom: 4px;
    
    .tabs {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      height: 28px;
      margin: 0 0 12px 16px;
      user-select: none;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;

      .space-content-header-tab-active-bg {
        position: absolute;
        height: 28px;
        width: 88px;
        top: 0;
        left: 0;
        border-radius: 14px;
        transition: all 0.2s ease;
        background-color: rgba(255, 255, 255, 0.2);
        pointer-events: none;
      }

      .tab {
        height: 28px;
        border-radius: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        margin-right: 4px;
        pointer-events: auto;

        .lb {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          opacity: 0.7;
          pointer-events: none;
          white-space: nowrap;

          .arr {
            margin-left: 8px;
            margin-right: -8px;
          }
        }

        &:hover {
          .lb {
            opacity: 0.9;
          }
        }

        &.active {
          .lb {
            opacity: 0.9;
            font-weight: 600;
          }
        }

        svg {
          margin-right: 7px;
          path {
            fill: white;
            fill-opacity: .95;
          }
        }
      }

    }
    .icons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 16px;
      margin-bottom: 12px;
      flex-shrink: 0;

      .ico, .ico-colored {
        @include flex;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        margin-left: 4px;

        &:hover {
          background-color: rgba($color: #FFF, $alpha: .11);
        }
        &:active, &.active {
          background-color: rgba($color: #FFF, $alpha: .2);
        }
      }

      .ico {
        svg {
          path {
            fill: white;
            fill-opacity: .95;
          }
        }
      }

    }
  }


  /* theme ----- light/hybrid */
  &.light, &.hybrid {
    color: $text-color-primary-light-ui;
    .row1 {
      .name {
        .fav {
          path {
            fill: $md-yellow-60;
          }
        }
      }
    }
    .row2 {
      .tabs {
        .space-content-header-tab-active-bg {
          background-color: rgba($color: #000000, $alpha: .1)
        }
        .tab {
          svg {
            path {
              fill: black;
            }
          }
        }
      }
      .icons .ico {
        svg {
          path {
            fill: black;
          }
        }
      }
    }
  }

}

</style>
