<template>
  <div id="pop-transfer-call"
    :class="[os, theme]"
  >
    <div id="pop-transfer-call-titlebar" class="head">
      <div class="head2">
        <div class="left">
          {{mode === 'transfer-call' ? 'Transfer call' : 'Add a person' }}
        </div>
        <div class='close' @click='close' >
          <wl-icon name="cancel-bold" size="14" />
        </div>
      </div>

    </div>

    <div class="des">{{mode === 'transfer-call' ? 'Enter who you want to transfer the call to' : 'Call the person you want to add, then merge calls.' }}</div>

    <div class="tools">
      <md-input 
        class="md-search-input search searchinput" 
        ref="searchinput"
        clear
        placeholder="Search or dial"
        :value="searchcontent"
        @focus="onSearchFocus"
        @doneediting="onSearchBlur"
        @input="onSearchInput"
        @change="onSearchInput"
      >
        <wl-icon
          name="search-bold" 
          :color=" theme === 'light' ? 'black-95' : 'white-95' "
          size="16"
          class="md-search-input__icon"
          slot="inputBefore"
        />
        <wl-icon
          name="cancel-bold" 
          :color=" theme === 'light' ? 'black-95' : 'white-95' "
          size="16"
          slot="clear"
        />
      </md-input>

      <div class="btn-circle">
        <wl-icon name="dialpad-bold" size="20" :color=" theme === 'light' ? 'black-95' : 'white-95' " />
      </div>

    </div>

    <div class="search-result-list" >

      <div class='transfer-tabs' @mouseleave="leaveTab1">
        <div class="transfer-tab-active-bg"></div>
        <div 
          v-for="(tab, idx) in leftTabs"
          :key="`ttt2${idx}`"
          class="btn" 
          :class="[{
            active: leftActiveTabId === idx,
          }, `transfer-tab${idx}`]" 
          @mouseover="hoverTab1(idx)" 
          @click="selectTab1(idx)" 
        >
          <span class="lb">
            {{tab.name}}
          </span>
          
        </div>

        <div class="spacer"></div>

      </div>
      
      <wl-scrollbar 
        ref="scrollbar" 
        class='cont-wrap' 
        :theme="theme === 'dark' ? 'dark' : 'light'"
        :arrowVisible="$store.state.os==='win'"
        :alwaysVisible="true"
      >
        <div class="scrollcont">

          <div class="cont-area cont-list">
            <div 
              v-for="(itm, idx) in listdata"
              :key="`contitm-g1-${idx}`"
              class="itm-call" 
              :class="{active: activeItemId === itm.id}"
              @click="selectItem(itm)"
            >
              <div class="row1">
                <span class="left">

                  <presence-avatar
                    :title="itm.name"
                    :src="itm.avatar ? avatarPath + itm.avatar : ''" 
                    :color="'white'"
                    :backgroundColor="'#545454'"
                    :size="32"
                    :presence="itm.status" 
                    :theme="theme === 'light' ? 'light' : 'dark'"
                    class="avatar" 

                    v-tooltip="!itm.isNumber ? {
                      content: contactCardTemplate(itm.name), 
                      html: true,
                      placement: 'right',
                      classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                      autoHide: false,
                      delay: 200,
                    } : null"
                  />
                  
                  <div class="txt">
                    <span class="lb" :class="{red: itm.dir === 'missed'}">
                      {{ itm.name }}
                      <span v-if="itm.num" class="num">({{itm.num}})</span>
                    </span>
                    <span v-if="itm.sub" class="lb2">{{ itm.sub }}</span>
                    <span v-if="itm.speeddial" class="lb2">{{ itm.speeddial }}</span>
                  </div>
                </span>
                
                <span class="right">
                  <div class="txt">
                    <span class="lb">{{itm.date}}</span>
                    <span v-if="itm.dur" class="lb2">{{itm.dur}}</span>
                  </div>
                </span>
                
                <span class="mid" >
                  <span class="rw" >
                    <div v-if="itm.dir === 'out'" class="ico" >
                      <wl-icon name="outgoing-call-legacy-bold" size="12" />
                    </div>
                    <div v-if="itm.dir === 'in'" class="ico" >
                      <wl-icon name="incoming-call-legacy-bold" size="12" />
                    </div>
                  </span>
                </span>

              </div>

              <div v-if="mode === 'transfer-call'" class="buttons" >
                <md-button 
                  v-show="itm.sub || itm.speeddial"
                  class="btn green" 
                  color="green"
                  aria-label="x" 
                  :size="28" 
                  v-tooltip="'Consult first'"
                  @click="showConsultPop($event, itm)"
                >
                  <wl-icon name="people-bold" size="16" color="white" />
                </md-button>

                <md-button 
                  class="btn green" 
                  color="green"
                  aria-label="x" 
                  :size="28" 
                  v-tooltip="'Transfer now'"
                  @click="transfer($event, {
                    number: '+1 888 555 1234',
                    people: itm,
                  })"
                >
                  <wl-icon name="next-bold" size="16" color="white" />
                </md-button>

              </div>

              <div v-if="mode === 'add-person'" class="buttons" >
                <md-button 
                  class="btn green" 
                  color="green"
                  aria-label="x" 
                  :size="28" 
                  v-tooltip="'Audio call'"
                  @click="audioCall($event, {
                    number: '+1 888 555 1234',
                    people: itm,
                  })"
                >
                  <wl-icon name="handset-bold" size="16" color="white" />
                </md-button>

                <md-button 
                  class="btn green" 
                  color="green"
                  aria-label="x" 
                  :size="28" 
                  v-tooltip="'Video call'"
                >
                  <wl-icon name="camera-bold" size="16" color="white" />
                </md-button>

              </div>


            </div>
          </div>
        </div>
      </wl-scrollbar>


    </div>


    

  </div>
</template>

<script>
import _ from 'lodash';
import searchResult from './../shared/search-result.vue';

export default {
  props: {
    mode: {
      type: String,
      default: 'transfer-call', // add people
    },
    layout: String,
    transferInfo: Object,
    onTransfer: Function,
    onAudioCall: Function,
  },

  data() {
    return {
      searchcontent: '',

      activeItemId: null,

      leftActiveTabId: 0,
      leftTabs: [
          {
            name: 'Recents',
          },
          {
            name: 'Speed dials',
          },
        ],

      listdataRecents: [
        
        {
          id: 'c06',
          name: 'Benoit Lapointe',
          status: 'inactive',
          group: 1,
          sub: 'SIP: isabbren@abccompany.com',
          dir: 'out',
          date: '28/12',
          dur: '08:21',
        },
        {
          id: 'c07',
          name: 'Ruchika Prabhavalkar',
          avatar: null,
          status: 'inactive',
          group: 1,
          sub: 'Mobile: +1 888 555 7864',
          dir: 'in',
          date: '24/12',
          dur: '11:23',
        },
        {
          id: 'c08',
          name: 'Dheeraj Bhasin',
          avatar: null,
          status: 'inmeeting',
          group: 1,
          sub: 'Work: +1 888 555 2346',
          dir: 'out',
          date: '11/12',
          dur: '09:12',
          num: 3,
        },
        {
          id: 'c09',
          name: 'Peter Hogan',
          avatar: null,
          status: 'active',
          group: 1,
          sub: 'Work: +1 888 555 2454',
          dir: 'out',
          date: '08/12',
          dur: '11:00',
        },
        {
          id: 'c10',
          name: 'James Weston',
          avatar: null,
          group: 2,
          sub: 'Work: +1 888 555 2454',
          dir: 'out',
          date: '02/12',
          dur: '08:45',
        },
        {
          id: 'c11',
          name: '9 10086',
          avatar: null,
          group: 2,
          dir: 'in',
          date: '30/11',
          dur: '15:33',
          isNumber: true,
        },
        {
          id: 'c12',
          name: 'Marc Brown',
          avatar: null,
          status: 'inactive',
          group: 2,
          sub: 'Work: +1 888 555 2454',
          dir: 'in',
          date: '30/11',
          dur: '13:40',
        },

        {
          id: 'c13',
          name: '9 10086',
          avatar: null,
          group: 2,
          dir: 'in',
          date: '20/11',
          dur: '11:00',
          isNumber: true,
        },
        {
          id: 'c01',
          name: 'David Liam',
          avatar: 'marketing/m001.png',
          status: 'active',
          group: 1,
          sub: 'Work: +1 888 555 2454',
          dir: 'out',
          date: '2/1',
          dur: '12:00',
        },
        {
          id: 'c02',
          name: 'Emma Hirst',
          avatar: '7.png',
          status: 'dnd',
          group: 1,
          sub: 'Work: +1 888 555 1234',
          dir: 'in',
          date: '2/1',
          dur: '08:23',
        },
        {
          id: 'c03',
          name: 'Sarah Robertson',
          avatar: 'marketing/f001.png',
          status: 'active',
          group: 1,
          sub: 'Call on Webex',
          dir: 'missed',
          date: '1/1',
          dur: '14:11',
        },
        {
          id: 'c04',
          name: 'Benjamin Vitali',
          avatar: null,
          status: 'inactive',
          group: 1,
          sub: 'Mobile: +1 888 555 4756',
          dir: 'out',
          date: '31/12',
          dur: '09:14',
        },
        {
          id: 'c05',
          name: '9 10086',
          avatar: null,
          group: 1,
          dir: 'out',
          date: '30/12',
          dur: '15:33',
          isNumber: true,
        },

        
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
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    avatarBgColors() {
      return this.$store.state.avatarBgColors;
    },
    avatarPath() {
      return this.$store.state.avatarPath;
    },
    me(){
      return this.$store.getters.me;
    },
    callingPeopleItems(){
      return this.$store.state.callingPeopleItems;
    },
    speedDialPeopleList(){
      return this.$store.state.speedDialPeopleList;
    },
    listdata(){
      var list = [];
      if (this.leftActiveTabId === 0) {
        list = this.listdataRecents;
      } else {
        list = this.$store.state.speedDialPeopleList;
      }

      var incall = _.cloneDeep(this.callingPeopleItems);
      var incalllist = incall[this.layout]
      var calling = incalllist[incalllist.length-1];
      var callingName
      if (calling && !calling.onhold) {
        callingName = calling.people.name
      }

      return list.filter(itm => itm.name !== callingName)
      
    },
    
  },
  beforeMount() {
    _.forEach(this.listdataRecents, (value) => {
      let pp = value
      let people = this.$store.getters.people(pp.name)
      if (people) {
        pp.numbers = people.numbers
        pp.status = people.status
      }
    });
  },
  mounted() {

  },
  watch: {
    searchcontent(newVal) {
      if (newVal) {
        const popername = 'calling-search-result'
        this.$popper.hide(popername);
        this.$popper.show (
          searchResult,
          {
            mode: this.mode,
            width: `${this.$refs.searchinput.$el.getBoundingClientRect().width}px`,
            keyword: this.searchcontent,
            layout: 'transfer-call',
            showInputNumber: true,
            noResultButtons: this.mode == 'transfer-call' ? ['transfer'] : ['conference-audio-call'],
            listItemButtons: this.mode == 'transfer-call' ? ['consult', 'transfer'] : ['conference-audio-call', 'conference-video-call'],
            onTransfer: this.transfer,
            onConsult: this.showConsultPop,
            onConferenceAudioCall: this.audioCall,
          }, // component props
          {
            name: popername,
            reference: this.$refs.searchinput.$el,
            transitionEnabled: false,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            frameless: false,
            borderRadius: '12px',
            appendToBody: false,
            theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
            options: {
              placement: 'bottom', 
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
            closed: () => {
            },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
  },
  methods: {
    onSearchFocus() {
      this.focus = true;
    },
    onSearchBlur() {
      this.focus = false;
    },
    onSearchInput(){
      const val = this.$refs.searchinput.currentValue;
      this.searchcontent = val;
    },
    clearInput() {
      this.searchcontent = '';
    },

    contactCardTemplate(name) {
      return this.$store.getters.contactCardTemplate(name, false);
    },

    hoverTab1(id) {
      this.moveTabBg1(id);
    },
    leaveTab1() {
      this.moveTabBg1(this.leftActiveTabId);
    },
    selectTab1(id) {
      this.leftActiveTabId = id;
      this.moveTabBg1(id);
      this.$refs.scrollbar.scrollToY(0, true);
    },
    moveTabBg1(id) {
      const rect = document.querySelector(`.transfer-tab${id}`).getBoundingClientRect();
      const rect2 = document.querySelector(`.transfer-tabs`).getBoundingClientRect();
      document.querySelector(`.transfer-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
      document.querySelector(`.transfer-tab-active-bg`).style.width = `${rect.width}px`;
    },
    
    selectItem(itm) {
      this.$emit('select', itm);
    },

    stopPropagation(e) {
      e.stopPropagation();
    },
    
    showConsultPop() {

    },
    /*
    showConsultPop(evt, item, onCloseCallback) {

      if (!item.numbers && item.sub) {
        item.numbers = [
            `Work: +1 ${_.random(111, 999)}-${_.random(111, 999)}-${_.random(1111, 9999)}`,
            `Mobile: +1 ${_.random(111, 999)}-${_.random(111, 999)}-${_.random(1111, 9999)}`,
          ];
      }
      if (this.activeItemId === item.id) {
        this.activeItemId = null;
        this.$popper.hideAll();
        return;
      }
      this.$popper.show(
        {
          template: `
            <div class="common-menulist" style="width:280px;">
              
              <div 
                v-for="(itm, idx) in numbers"
                :key="idx"
                class='common-menulist-item common-menulist-item-48' 
                @click="select" 
              >
                
                <svg v-if="itm.split(': ')[0] === 'Work'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 12.5H13.999V4.03613C13.9981 3.63473 13.8405 3.24956 13.5597 2.96264C13.279 2.67572 12.8974 2.50972 12.4961 2.5H6.99803C6.59752 2.50971 6.21662 2.6754 5.93645 2.96177C5.65628 3.24814 5.49898 3.63257 5.49803 4.0332V4.5H3.49976C3.10206 4.50043 2.72078 4.65861 2.43957 4.93982C2.15836 5.22103 2.00019 5.60231 1.99975 6V12.5H1.5C1.36739 12.5 1.24021 12.5527 1.14645 12.6464C1.05268 12.7402 1 12.8674 1 13C1 13.1326 1.05268 13.2598 1.14645 13.3536C1.24021 13.4473 1.36739 13.5 1.5 13.5H14.5C14.6326 13.5 14.7598 13.4473 14.8536 13.3536C14.9473 13.2598 15 13.1326 15 13C15 12.8674 14.9473 12.7402 14.8536 12.6464C14.7598 12.5527 14.6326 12.5 14.5 12.5ZM2.99976 6C2.99989 5.86743 3.05261 5.74033 3.14635 5.64659C3.24009 5.55285 3.36719 5.50013 3.49976 5.5H5.49803V12.5H2.99976V6ZM6.5 12.5V5C6.5 4.99658 6.49811 4.99377 6.49804 4.99036V4.0332C6.49722 3.89719 6.54863 3.76605 6.64166 3.66684C6.7347 3.56763 6.86226 3.50791 6.99804 3.5H12.4961C12.6326 3.50795 12.7609 3.568 12.8545 3.66775C12.9481 3.7675 12.9998 3.89936 12.999 4.03613V12.5H6.5Z" fill="white" fill-opacity="0.95"/>
                  <path d="M4.24994 7.00463C4.45705 7.00463 4.62494 6.83674 4.62494 6.62963C4.62494 6.42253 4.45705 6.25464 4.24994 6.25464C4.04283 6.25464 3.87494 6.42253 3.87494 6.62963C3.87494 6.83674 4.04283 7.00463 4.24994 7.00463Z" fill="white" fill-opacity="0.95"/>
                  <path d="M4.24997 8.74988C4.45708 8.74988 4.62497 8.58198 4.62497 8.37488C4.62497 8.16777 4.45708 7.99988 4.24997 7.99988C4.04286 7.99988 3.87497 8.16777 3.87497 8.37488C3.87497 8.58198 4.04286 8.74988 4.24997 8.74988Z" fill="white" fill-opacity="0.95"/>
                  <path d="M4.24997 10.3749C4.45708 10.3749 4.62497 10.207 4.62497 9.99988C4.62497 9.79277 4.45708 9.62488 4.24997 9.62488C4.04286 9.62488 3.87497 9.79277 3.87497 9.99988C3.87497 10.207 4.04286 10.3749 4.24997 10.3749Z" fill="white" fill-opacity="0.95"/>
                  <path d="M8.00003 5.37512C8.20714 5.37512 8.37503 5.20723 8.37503 5.00012C8.37503 4.79301 8.20714 4.62512 8.00003 4.62512C7.79292 4.62512 7.62503 4.79301 7.62503 5.00012C7.62503 5.20723 7.79292 5.37512 8.00003 5.37512Z" fill="white" fill-opacity="0.95"/>
                  <path d="M9.74856 5.37512C9.95567 5.37512 10.1236 5.20723 10.1236 5.00012C10.1236 4.79301 9.95567 4.62512 9.74856 4.62512C9.54146 4.62512 9.37356 4.79301 9.37356 5.00012C9.37356 5.20723 9.54146 5.37512 9.74856 5.37512Z" fill="white" fill-opacity="0.95"/>
                  <path d="M9.74856 6.99988C9.95567 6.99988 10.1236 6.83198 10.1236 6.62488C10.1236 6.41777 9.95567 6.24987 9.74856 6.24987C9.54146 6.24987 9.37356 6.41777 9.37356 6.62488C9.37356 6.83198 9.54146 6.99988 9.74856 6.99988Z" fill="white" fill-opacity="0.95"/>
                  <path d="M9.74856 8.74988C9.95567 8.74988 10.1236 8.58198 10.1236 8.37488C10.1236 8.16777 9.95567 7.99988 9.74856 7.99988C9.54146 7.99988 9.37356 8.16777 9.37356 8.37488C9.37356 8.58198 9.54146 8.74988 9.74856 8.74988Z" fill="white" fill-opacity="0.95"/>
                  <path d="M11.5 5.37512C11.7071 5.37512 11.875 5.20723 11.875 5.00012C11.875 4.79301 11.7071 4.62512 11.5 4.62512C11.2929 4.62512 11.125 4.79301 11.125 5.00012C11.125 5.20723 11.2929 5.37512 11.5 5.37512Z" fill="white" fill-opacity="0.95"/>
                  <path d="M11.5 6.99988C11.7071 6.99988 11.875 6.83198 11.875 6.62488C11.875 6.41777 11.7071 6.24987 11.5 6.24987C11.2929 6.24987 11.125 6.41777 11.125 6.62488C11.125 6.83198 11.2929 6.99988 11.5 6.99988Z" fill="white" fill-opacity="0.95"/>
                  <path d="M11.5 8.74988C11.7071 8.74988 11.875 8.58198 11.875 8.37488C11.875 8.16777 11.7071 7.99988 11.5 7.99988C11.2929 7.99988 11.125 8.16777 11.125 8.37488C11.125 8.58198 11.2929 8.74988 11.5 8.74988Z" fill="white" fill-opacity="0.95"/>
                  <path d="M8.00003 6.99988C8.20714 6.99988 8.37503 6.83198 8.37503 6.62488C8.37503 6.41777 8.20714 6.24987 8.00003 6.24987C7.79292 6.24987 7.62503 6.41777 7.62503 6.62488C7.62503 6.83198 7.79292 6.99988 8.00003 6.99988Z" fill="white" fill-opacity="0.95"/>
                  <path d="M8.00003 8.74988C8.20714 8.74988 8.37503 8.58198 8.37503 8.37488C8.37503 8.16777 8.20714 7.99988 8.00003 7.99988C7.79292 7.99988 7.62503 8.16777 7.62503 8.37488C7.62503 8.58198 7.79292 8.74988 8.00003 8.74988Z" fill="white" fill-opacity="0.95"/>
                  <path d="M8.00003 10.3749C8.20714 10.3749 8.37503 10.207 8.37503 9.99988C8.37503 9.79277 8.20714 9.62488 8.00003 9.62488C7.79292 9.62488 7.62503 9.79277 7.62503 9.99988C7.62503 10.207 7.79292 10.3749 8.00003 10.3749Z" fill="white" fill-opacity="0.95"/>
                  <path d="M9.74856 10.3749C9.95567 10.3749 10.1236 10.207 10.1236 9.99988C10.1236 9.79277 9.95567 9.62488 9.74856 9.62488C9.54146 9.62488 9.37356 9.79277 9.37356 9.99988C9.37356 10.207 9.54146 10.3749 9.74856 10.3749Z" fill="white" fill-opacity="0.95"/>
                  <path d="M11.5 10.3749C11.7071 10.3749 11.875 10.207 11.875 9.99988C11.875 9.79277 11.7071 9.62488 11.5 9.62488C11.2929 9.62488 11.125 9.79277 11.125 9.99988C11.125 10.207 11.2929 10.3749 11.5 10.3749Z" fill="white" fill-opacity="0.95"/>
                </svg>

                <svg v-if="itm.split(': ')[0] === 'Mobile'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 12.5H7.5C7.36739 12.5 7.24021 12.5527 7.14645 12.6464C7.05268 12.7402 7 12.8674 7 13C7 13.1326 7.05268 13.2598 7.14645 13.3536C7.24021 13.4473 7.36739 13.5 7.5 13.5H8.5C8.63261 13.5 8.75979 13.4473 8.85355 13.3536C8.94732 13.2598 9 13.1326 9 13C9 12.8674 8.94732 12.7402 8.85355 12.6464C8.75979 12.5527 8.63261 12.5 8.5 12.5Z" fill="white" fill-opacity="0.95"/>
                  <path d="M10.5 1H5.5C4.8372 1.00078 4.20176 1.26442 3.73309 1.73309C3.26442 2.20176 3.00078 2.8372 3 3.5V12.5C3.00078 13.1628 3.26442 13.7982 3.73309 14.2669C4.20176 14.7356 4.8372 14.9992 5.5 15H10.5C11.1628 14.9992 11.7982 14.7356 12.2669 14.2669C12.7356 13.7982 12.9992 13.1628 13 12.5V3.5C12.9992 2.8372 12.7356 2.20177 12.2669 1.73309C11.7982 1.26442 11.1628 1.00078 10.5 1ZM5.5 2H10.5C10.8977 2.00043 11.279 2.15861 11.5602 2.43982C11.8414 2.72103 11.9996 3.10231 12 3.5V11H4V3.5C4.00043 3.10231 4.15861 2.72103 4.43982 2.43982C4.72103 2.15861 5.10231 2.00043 5.5 2ZM10.5 14H5.5C5.10231 13.9996 4.72103 13.8414 4.43982 13.5602C4.15861 13.279 4.00043 12.8977 4 12.5V12H12V12.5C11.9996 12.8977 11.8414 13.279 11.5602 13.5602C11.279 13.8414 10.8977 13.9996 10.5 14Z" fill="white" fill-opacity="0.95"/>
                </svg>

                <span class="lb" style="margin-left: 8px;">
                  <div class="line1">{{itm}}</div>
                  <div class="line2" style="opacity: .7; font-size: 14px; margin-top: -4px;">{{itm.split(': ')[0]}}</div>
                </span>
              </div>
              
            </div>
          `,
          props: ['numbers', 'onSelect'],
          methods: {
            select(evt) {
              this.onSelect(evt);
              this.close();
            },
            close() {
              this.$popper.hideAll();
            },
          }
        },
        {
          numbers: item.numbers,
          onSelect: (evt) => {
            this.transfer(evt);
          },
        }, // component props
        {
          reference: evt.currentTarget,
          closeTrigger: 'mousedown',
          arrowVisible: true,
          roundedCorner: true,
          frameless: false,
          borderRadius: '12px',
          appendToBody: false,
          theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
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
          opened: () => {this.activeItemId = item.id},
          closed: () => {
            this.activeItemId = null
            if (onCloseCallback) {
              onCloseCallback();
            }
          },
        } // popper eventlistener
      );
    },
    */

    transfer(event, info) {
      event.stopPropagation();
      var incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[this.layout]

      var i, itm
      for (i=0; i<list.length; i++) {
        itm = list[i];
        if (itm.people.name === this.transferInfo.people.name) {
          itm.transferred = info;
          break;
        }
      }

      incall[this.layout] = list;
      this.$store.commit('callingPeopleItems', incall);

      this.onTransfer();
      this.close();
    },

    audioCall(event, info) {
      event.stopPropagation();
      var incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[this.layout]

      var i, itm
      for (i=0; i<list.length; i++) {
        itm = list[i];
        if (itm.people.name === this.transferInfo.people.name) {
          itm.conference = info;
          break;
        }
      }

      incall[this.layout] = list;
      this.$store.commit('callingPeopleItems', incall);

      this.onAudioCall();
      this.close();
    },

    close() {
      this.$emit("close");
    },

  }
};
</script>

<style lang="scss">
#pop-transfer-call {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-height: 480px;
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: auto;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
  user-select: none;

  .head {
    width: 100%;

    .head2 {
      @include flex(row, space-between);
      height: 48px;
      display: flex;
      align-items: center;
      padding-left: 0;
      

      .left {
        @include flex(row, flex-start);
        font-size: 16px;
        font-weight: 600;
        flex-grow: 1;
        margin-left: 20px;
      }

      .close {
        width: 28px;
        height: 28px;
        @include flex;
        pointer-events: auto;
        cursor: default;
        margin-right: 6px;
      }
    }

  }

  .des {
    @include flex(row, flex-start);
    opacity: .7;
    font-size: 14px;
    margin-bottom: 16px;
    margin-left: 20px;
  }

  .tools {
    @include flex;
    height: 64px;
    padding: 0 20px;

    .searchinput {
      margin: 0;
      flex-grow: 1;

      .md-input {
        width: 100%;
        height: 32px;
        font-size: 16px;
        font-weight: normal;
        padding-left: 32px;
        color: rgba($color: white, $alpha: 0.95) !important;
        background-color: rgba($color: #FFFFFF, $alpha: .1) !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;
        border-radius: 8px;

        &::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        &:hover {
          border-color: rgba($color: white, $alpha: 0.7) !important;
        }
        &:focus {
          border-color: rgba($color: white, $alpha: 0.9) !important;
          box-shadow: 0 0 0 3px $md-blue-50 !important;
        }

      }

      .md-input__before {
        width: 32px;
      }

      .md-input__after {
        @include flex;
        span {
          @include flex;
          svg path {
            fill: rgba($color: white, $alpha: 0.7);
          }
          
        }
      }
    }

    .btn-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      box-sizing: border-box;
      border: 1px solid rgba($color: #FFF, $alpha: .3);

      &:hover{
        border: 1px solid rgba($color: #FFF, $alpha: .5);
        background-color: rgba($color: #FFF, $alpha: .07);
      }
      &:active,
      &.active{
        border: 1px solid rgba($color: #FFF, $alpha: .9);
        background-color: rgba($color: #FFF, $alpha: .2);
      }

    }

    .btn-cancel {
      margin-left: 8px;
    }
  }

  .split-line{
      border-bottom: 1px solid #EEE;
  }

  .transfer-tabs {
      position: relative;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin: 20px 20px 10px 20px;

      .transfer-tab-active-bg {
        position: absolute;
        height: 28px;
        top: 0;
        left: 0;
        border-radius: 14px;
        transition: all 0.3s ease;
        background-color: rgba($color: #FFFFFF, $alpha: .2);
        pointer-events: none;
      }

      .btn {
        height: 28px;
        border-radius: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 12px;
        margin-right: 8px;
        pointer-events: auto;

        .lb {
          font-weight: 600;
          font-size: 14px;
          opacity: 0.7;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        &:hover {
          .lb {
            opacity: 0.9;
          }
        }

        &.active {
          .lb {
            opacity: 0.9;

          }
        }
      }

      .badge {
        height: 18px;
        min-width: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $md-blue-60;
        border-radius: 9px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.95);
        margin-right: 4px;
      }

      .btn-circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .disabled {
          opacity: .4;
        }

        &:hover {
          background-color: rgba($color: white, $alpha: 0.07);
        }
        &:active {
          background-color: rgba($color: white, $alpha: 0.1);
        }
      }

    }

  .search-result-list {
    margin: 0;

    .cont-wrap {
      display: flex;
      width: calc(100% - 4px);
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      height: 310px;

      .scrollcont {
        display: flex;
        flex-direction: column;
      }
    }


    .cont-list {
      display: flex;
      flex-direction: column;
      width: calc(100% - 16px - 20px);
      margin-left: 16px;
    }


    .section-tit {
      display: flex;
      align-items: center;
      height: 32px;
      font-size: 14px;
      padding-left: 16px;
      opacity: .7;

    }
    .section-more {
      display: flex;
      align-items: center;
      height: 36px;
      font-size: 14px;
      padding-left: 16px;
      text-decoration: underline;
    }
    .section-empty {
      display: flex;
      align-items: center;
      height: 32px;
      font-size: 14px;
      padding-left: 50px;
      opacity: .7;
    }


    .itm-call {
      position: relative;
      display: flex;
      flex-direction: column;

      border-radius: 25px;
      transition: all .2s ease;
      height: 50px;
      overflow: hidden;
      user-select: none;

      .row1 {
        display: flex;
        align-items: center;
        height: 50px;
        flex-shrink: 0;
      }

      .left {
        display: flex;
        align-items: center;
        flex-grow: 1;
        margin-left: 10px;
        margin-right: 16px;
        overflow:hidden;

        .avatar {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }

        .txt {
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;

          .lb{
            font-size: 16px;
            line-height: 24px;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;

            &.unread {
              font-weight: bold;
            }

            &.num {
              margin-left: 4px;
            }
          }
          .lb2{
            font-size: 14px;
            line-height: 22px;
            opacity: .7;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            margin-top: -2px;
          }
        }
      }
      .mid {
        display: flex;
        align-items: center;
        width: 12px;
        flex-shrink: 0;
        margin-right: 16px;


        .rw {
          display: flex;
          align-items: center;
        }

        .ico {
          display: flex;
          align-items: center;
          margin-right: 6px;
        }

        svg {
          display: flex;
          align-items: center;
        }
      }

      .right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 8px;
        
        .txt {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;

          .lb{
            font-size: 14px;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
          }
          .lb2{
            font-size: 14px;
            opacity: .7;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            margin-top: -2px;
          }
        }

      }

      .red {
        color: $textColor-error-darkUi;
        svg path{
          fill: $textColor-error-darkUi;
          fill-opacity: 1;
        }
      }

      &:hover {
        background: rgba($color: #FFF, $alpha: 0.07);
      }
      &:active, &.active {
        background: rgba($color: #FFF, $alpha: 0.11);
      }
      &:hover, &:active, &.active {
        .left {
          mask: linear-gradient(to right, rgba($color: #FFF, $alpha: 1.0) 80%, rgba($color: #FFF, $alpha: 0.0) 90%);
          mask-repeat: no-repeat;
        }
        .buttons {
          display: flex;
        }
        .right, .mid {
          display: none;
        }
      }

      .buttons {
        display: none;
        position: absolute;
        top: 0;
        right: 12px;
        height: 100%;
        justify-content: flex-end;
        align-items: center;
        flex-shrink: 0;

        .btn {
          @include flex;
          min-width: 28px;
          width: 28px;
          height: 28px;
        }
      }
    }



  }

  /* ------------------ drak ------------------ */

  &.dark {
    color: $text-color-primary-dark-ui;

    .split-line{
      border-bottom: 1px solid $md-gray-80;
    }

  }

}


</style>
