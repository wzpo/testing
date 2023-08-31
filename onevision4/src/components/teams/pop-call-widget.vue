<template>
  <div id="pop-call-widget"
    :class="[os, theme]"
    :style="{
      minHeight: !minimized ? '102px' : '60px',
      maxHeight: `${maxHeight}px`,
      height: !dialpadVisible && !minimized && callWidgetResized ? `${callWidgetResized.height}px` : ``,
    }"
    ref="widget"
  >
    <fragment v-if="!minimized">
      <div id="pop-call-widget-titlebar" class="head calheight" >
        <div v-if="layout === 'simple'" class="head1">
          <div class="logo"></div>
          Webex Calls
        </div>

        <div v-if="layout === 'widget'" class="head2">
          <div class="left">
            <div v-if="teamsWindowMinimized" class="logo" @click="bringBackWindow"></div>

            <div class="itm-modifierchip btn-circle btn-pill" :class="{
            active: callAsMenuVisible,
          }" ref="iconcallas" @click="showCallAs" @mousedown="mousedown" >
              <wl-icon :name="callAs.icon" :color="callAs.color" />
              <span class="lb">{{callAs.label}}</span>
            </div>

            <div class="itm-call btn-circle btn-pill" :class="{
            active: callQueueMenuVisible,
          }" ref="iconcallqueues" @click="showCallQueues" @mousedown="mousedown" >
              <wl-icon name="queue-contact-bold" color="#3CC29A" size="16" />
              <span class="lb">Available</span>
            </div>
          </div>
          <div class="spacer" ></div>
          <div class='btn-circle btn-c2' :class="{
            active: phoneSettingsMenuVisible,
          }" ref="iconforwarded" @click='showPhoneSettings' @mousedown="mousedown" >
            <wl-icon name="settings-bold" size="20" />
          </div>

          <div v-if="!minimized" class="btn-circle btn-c2 close" @click="minimize" @mousedown="minibtnMousedown" @mouseup="stopPP" >
            <wl-icon v-if="!dockSide" name="minus-bold" size="20" />
            <wl-icon v-if="dockSide == 'R'" name="arrow-circle-right-bold" size="20" />
            <wl-icon v-if="dockSide == 'L'" name="arrow-circle-left-bold" size="20" />
            <wl-icon v-if="dockSide == 'T'" name="arrow-circle-up-bold" size="20" />
          </div>

        </div>

      </div>

      <wl-alertbanner 
        :show="alertbanner.visible" 
        :icon="alertbanner.icon" 
        :content="alertbanner.content" 
        :button="alertbanner.button" 
        :narrow="true" 
        :closeButtonVisible="false" 
        class="alertbanner calheight" 
        @close="() => { alertbanner = {} }"
      />

      <div v-if="layout === 'widget'" class="tools calheight" >
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

        <md-button v-show="searchcontent" class="btn md-button-outline btn-cancel" aria-label="x" :size="40" @click="clearInput" >
          Cancel
        </md-button>

        <div v-show="!searchcontent" class="btn-circle" :class="{active: dialpadVisible}" @click="dialpadVisible = !dialpadVisible">
          <wl-icon name="dialpad-bold" size="20" :color=" theme === 'light' ? 'black-95' : 'white-95' " />
        </div>

        <div v-show="!searchcontent" class="btn-circle" @click="bringBackWindow({navto: 'recents'})">
          <wl-icon name="recents-presence-bold" size="20" :color=" theme === 'light' ? 'black-95' : 'white-95' " />
        </div>

        <div v-show="!searchcontent" class="btn-circle" @click="bringBackWindow({navto: 'voicemail'})">
          <wl-icon name="voicemail-bold" size="20" :color=" theme === 'light' ? 'black-95' : 'white-95' " />
          <div class="badge">2</div>
        </div>

      </div>

      <div v-if="dialpadVisible" class="dialpad" >
        <div class="keybuttons" >
          <div class="num" @mousedown="dialpadPress($event, 1)" >
            <div class="t1">1</div>
            <div class="t2"></div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 2)" >
            <div class="t1">2</div>
            <div class="t2">ABC</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 3)" >
            <div class="t1">3</div>
            <div class="t2">DEF</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 4)" >
            <div class="t1">4</div>
            <div class="t2">GHI</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 5)" >
            <div class="t1">5</div>
            <div class="t2">JKL</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 6)" >
            <div class="t1">6</div>
            <div class="t2">MNO</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 7)" >
            <div class="t1">7</div>
            <div class="t2">PRS</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 8)" >
            <div class="t1">8</div>
            <div class="t2">TUV</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 9)" >
            <div class="t1">9</div>
            <div class="t2">WXYZ</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, '*')" >
            <div class="t1" style="font-size: 40px; margin-top: 12px; ">*</div>
            <div class="t2"></div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, 0)" >
            <div class="t1">0</div>
            <div class="t2">+</div>
          </div>
          <div class="num" @mousedown="dialpadPress($event, '#')" >
            <div class="t1">#</div>
            <div class="t2"></div>
          </div>

        </div>
      </div>
      
      <call-item-group 
          v-for="(itm, idx) in callingPeopleItemsByGroup"
          v-show="!dialpadVisible" 
          :key="`incall-item-${idx}`"
          :ref="`callitemgroup`"
          :groupIndex="idx"
          :groupData="itm"
          :layout="layout"
          :collapsed="callWidgetGroupCollapsed[itm.callAs.id]"
          :scrollpaneHeight="callWidgetGroupScrollpaneHeight[idx]"
          :resizerVisible="idx > 0"
          @collapsed="collapseChanged"
          @resize="scrollpaneResize"
          @resume="resumeHanlder"
          @transfer="transfer"
          @conference="transfer"
        />

      <!---

      <div v-if="!currentIsTransfered() && callingPeopleItems[layout].length > 0 && anyActiveCalls" v-show="!dialpadVisible" class="options" >
        <div class="row">
          
          <div class="item">
            <div class="btnr">
              <wl-icon name="dialpad-bold" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="20" />
            </div>
            <div class="lb">Keypad</div>
          </div>

          <div class="item">
            <div class="btnr">
              <wl-icon name="pause-bold" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="20" />
            </div>
            <div class="lb">Hold</div>
          </div>

          <div class="item">
            <div class="btnr" :class="{active: popTransferVisible}" @click="transfer" >
              <wl-icon name="next-bold" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="20" />
            </div>
            <div class="lb">Transfer</div>
          </div>

        </div>
        <div class="row">
        
          <div v-if="callingPeopleItems[layout].length > 1 && layout === 'widget'" class="item">
            <div class="btnr">
              <wl-icon name="call-merge-bold" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="20" />
            </div>
            <div class="lb">Merge</div>
          </div>

          <div class="item">
            <div class="btnr">
              <wl-icon name="parked-bold" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="20" />
            </div>
            <div class="lb">Park</div>
          </div>

          <div class="item">
            <div class="btnr">
              <wl-icon name="participant-add-bold" :color=" theme === 'light' ? 'black-95' : 'white-95' " size="20" />
            </div>
            <div class="lb">Add</div>
          </div>

        </div>
      </div>

      <div v-if="!currentIsTransfered() && callingPeopleItems[layout].length > 0 && anyActiveCalls" v-show="!dialpadVisible" class="controls">
          
        <md-button class="btn md-button-outline" aria-label="x" :size="32" >
          <wl-icon v-if="muted" name="microphone-muted-bold" :color=" theme === 'light' ? 'red-60' : 'red-40' " size="16" class="ico" />

          <svg v-show="!muted" class="ico" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0012 14H11.0115C10.4215 14.0146 9.84622 13.8147 9.39243 13.4374C8.93864 13.06 8.63713 12.5309 8.54386 11.9481C9.23297 11.8206 9.85576 11.456 10.3044 10.9176C10.753 10.3792 10.9992 9.70082 11.0002 9V4C11.0002 3.20435 10.6842 2.44129 10.1216 1.87868C9.55896 1.31607 8.79589 1 8.00025 1C7.2046 1 6.44153 1.31607 5.87893 1.87868C5.31632 2.44129 5.00025 3.20435 5.00025 4V9C5.00149 9.71404 5.25721 10.4043 5.7215 10.9468C6.18579 11.4892 6.82824 11.8485 7.53353 11.96C7.62772 12.7332 7.98019 13.452 8.53387 14H4.00122C3.86861 14 3.74144 14.0527 3.64767 14.1464C3.5539 14.2402 3.50122 14.3674 3.50122 14.5C3.50122 14.6326 3.5539 14.7598 3.64767 14.8536C3.74144 14.9473 3.86861 15 4.00122 15H12.0012C12.1338 15 12.261 14.9473 12.3548 14.8536C12.4485 14.7598 12.5012 14.6326 12.5012 14.5C12.5012 14.3674 12.4485 14.2402 12.3548 14.1464C12.261 14.0527 12.1338 14 12.0012 14ZM6.00025 7.494V6.5H10.0002V7.494H6.00025ZM8.00025 2C8.53052 2.00053 9.03892 2.21141 9.41387 2.58637C9.78883 2.96133 9.99972 3.46973 10.0002 4V5.5H6.00025V4C6.00078 3.46973 6.21166 2.96133 6.58662 2.58637C6.96157 2.21141 7.46997 2.00053 8.00025 2Z" fill="white" fill-opacity="0.95"/>
            <path d="M6 7.5H10V9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9V7.5Z" fill="#3CC29A"/>
            <rect x="6" y="5.5" width="4" height="1" fill="#3CC29A"/>
          </svg>

          <span class="lb">{{muted ? 'Unmute' : 'Mute'}}</span>

          <div id="call-widget-audio-options" class="btnarr">
            <wl-icon name="arrow-down-bold" size="10" />
          </div>
        </md-button>

        <md-button id="btn-widget-video-call" class="btn md-button-outline" aria-label="x" :size="32" @click="switchToVideoCall">
          <wl-icon name="camera-muted-bold" size="16" class="ico" />
          <span class="lb">Video call</span>
        </md-button>

        <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="32" v-tooltip="'Share content'" >
          <wl-icon
              name="share-screen-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
            /> 
        </md-button>

        <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="32" v-tooltip="'More'" >
          <wl-icon
              name="more-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
            /> 
        </md-button>

        <md-button class="btn md-button--red btn-circle" aria-label="x" :size="32" @click='endcall' >
          <wl-icon
              name="cancel-bold" 
              color="white-95"
              size="16"
            /> 
        </md-button>

      </div>
      -->
      
      <!--wrap-->

      <span class="vertical-spacer" ref="verticalspacer"></span>

      <div class="bottomoptions calheight" >
        <div class="btn" >
          <wl-icon name="headset-bold" size="16" class="ico" />
          <span class="lb" >
            Jabra Evolve 770
          </span>
        </div>

        <div class="btn" >
          <wl-icon name="device-connection-bold" size="16" class="ico" />
          <span class="lb" >
            Connect
          </span>
        </div>

        <div class="spacer" ></div>

        <span class="togglelb" >
          Privacy
        </span>
        <md-toggle-switch class="toggle-switch-m" htmlId="pv" label="" :checked="privacy" @change="() => { privacy = !privacy }"></md-toggle-switch>
      </div>

      <div class="resizer">
        <div class="resizertop" @mousedown="mousedownTop" ></div>
        <div class="resizerbottom" @mousedown="mousedownBottom" ></div>
      </div>
    </fragment>

    <fragment v-if="minimized">
      <div class="minimized" @mouseover="minimizedMouseover" @mouseleave="minimizedMouseleave" @mousedown="minimizedMousedown">
        <wl-icon name="handset-filled" size="32" :color=" theme === 'light' ? 'black-95' : 'white-95' " class="ico" />
        <div class="logo"></div>
        <div class="badge">2</div>
      </div>
    </fragment>
    
    

  </div>
</template>

<script>

import searchResult from './../shared/search-result.vue';
import transferCall from './pop-transfer-call.vue';
import PopperPhoneSettings from './popper-phone-settings.vue';
import PopperCallQueues from './popper-call-queues.vue';
import PopperCallAs from './popper-call-as.vue';
import coachmark from './../shared/coachmark.vue'
import _ from 'lodash';

const grpHeaderH = 40
const listIncomingHeight = 92 // incoming call item height
const listOnholdHeight = 68 // onhold call item height
const listIncallHeight = 132 // active call item height

export default {
  props: {
    layout: {
      type: String,
    },
    onMount: {
      type: Function,
    },
    onResume: {
      type: Function,
    },
    onMinimize: {
      type: Function,
    },
    onRestore: {
      type: Function,
    },
    onResize: {
      type: Function,
    },
  },

  data() {
    return {
      alertbanner: {},
      privacy: false,
      muted: false,
      focus: false,
      dialpadVisible: false,
      popTransferVisible: false,
      searchcontent: '',
      minimized: false,
      hoverActionDisabled: false,
      dockSide: null,
      mouseXY: {
        x: null,
        y: null,
      },
      maxHeight: 9999,

      callAsMenuVisible: false,

      queueList: [
        {
          label: 'SalesWestCoast',
          sub: '(999)888-7094',
          on: true,
          enabled: true,
        },
        {
          label: 'SalesNorthCoast',
          sub: '(999)888-7091',
          on: false,
          enabled: true,
        },
        {
          label: 'SalesEastCoast',
          sub: '(999)888-7093',
          on: true,
          enabled: true,
        },
        {
          label: 'SalesSouthCoast',
          sub: '(999)888-7092',
          on: false,
          enabled: false,
        },
        {
          label: 'SalesGlobal',
          sub: '+21 123450054',
          on: true,
          enabled: false,
        },
        {
          label: 'SalesWestCoast',
          sub: '(999)888-7094',
          on: true,
          enabled: true,
        },
        {
          label: 'SalesNorthCoast',
          sub: '(999)888-7091',
          on: false,
          enabled: true,
        },
        {
          label: 'SalesEastCoast',
          sub: '(999)888-7093',
          on: true,
          enabled: true,
        },
        {
          label: 'SalesSouthCoast',
          sub: '(999)888-7092',
          on: false,
          enabled: false,
        },
      ],
      callQueueMenuVisible: false,
      phoneSettingsMenuVisible: false,
      resizing: false,
      resizer: null,
      resizeDraggingPageY: null,
      resizeObserver: null,
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
    teamsWindowMinimized() {
      return this.$store.state.teamsWindowMinimized;
    },
    teamsNavLayout() {
      return this.$store.state.teamsNavLayout;
    },
    teamsNav() {
      return this.$store.state.teamsNav;
    },
    avatarPath() {
      return this.$store.state.avatarPath;
    },
    me(){
      return this.$store.getters.me;
    },
    callWidgetResized(){
      return this.$store.state.callWidgetResized;
    },
    callWidgetMinHeight(){
      return this.$store.state.callWidgetMinHeight;
    },
    callWidgetGroupScrollpaneHeight(){
      return this.$store.state.callWidgetGroupScrollpaneHeight;
    },
    callWidgetGroupScrollpaneResized(){
      return this.$store.state.callWidgetGroupScrollpaneResized;
    },
    callWidgetGroupCollapsed(){
      return this.$store.state.callWidgetGroupCollapsed;
    },
    callingPeopleItems(){
      return this.$store.state.callingPeopleItems;
    },
    callingPeopleItemsByGroup(){
      let caslst = this.callAsList
      let grouplst = []
      for(let i=0; i<caslst.length; i++) {
        let cas = caslst[i]
        grouplst.push({
          callAs: cas,
          list: [],
        })
      }

      let incall = this.$store.state.callingPeopleItems
      let list = incall[this.layout]
      for (let i=0; i<list.length; i++) {
        let itm = list[i];
        for(let j=0; j<grouplst.length; j++) {
          let grp = grouplst[j]
          if(grp.callAs.id == itm.people.callasIndex) {
            grouplst[j].list.push(itm)
          }
        }
      }

      let empty = []
      for(let j=grouplst.length-1; j>=0; j--) {
        let grp = grouplst[j]
        if(grp.list.length == 0) {
          let delarr = grouplst.splice(j, 1)
          empty = delarr.concat(empty)
        } else {
          
          // sort, top->bottom: onhold -> incoming -> active call
          /*
          grp.list.sort((a, b) => {
              if (a.onhold && !b.onhold) {
                return -1;
              } else if (!a.onhold && b.onhold) {
                return 1;
              } else if (!a.onhold && !b.onhold) {
                if (a.incoming && !b.incoming) {
                  return -1;
                } else if (!a.incoming && b.incoming) {
                  return 1;
                }
              }
            }
          )
          */
        }
      }
      empty.splice(empty.length-1, 1)
      grouplst = grouplst.concat(empty)

      return grouplst;
    },
    anyActiveCalls() {
      var incall = this.$store.state.callingPeopleItems
      var list = incall[this.layout]
      var i, itm, cnt = 0
      for (i=0; i<list.length; i++) {
        itm = list[i];
        if (!itm.onhold && !itm.incoming) {
          cnt++
          break;
        }
      }

      return cnt > 0
    },

    isFTE(){
      return this.$store.state.isFTE;
    },
    callAs(){
      return this.$store.state.callAs;
    },
    callAsList(){
      return this.$store.state.callAsList;
    },
    
  },
  beforeMount() {
    
  },
  mounted() {
    this.onMount(this.$parent, this.$el.parentNode, this) // Modal instance
    this.calcHeight()

    const elem = this.$el
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect) {
          this.updateScrollpaneSize({skipMultiRowCheck: this.resizing})
        }
      }
    });
    this.resizeObserver.observe(elem);
    
    setTimeout(() => {
      // wait for onMount in teams-app.vue to ready
      this.initMousemove()
    }, 1200)

  },
  beforeDestroy() {
    const elem = this.$el
    this.resizeObserver.unobserve(elem);
  },
  watch: {
    searchcontent(newVal) {
      if (newVal) {
        const popername = 'widget-search-result'
        this.$popper.hide(popername);
        this.$popper.show (
          searchResult,
          {
            width: '316px',
            keyword: this.searchcontent,
            layout: this.layout,
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
    callingPeopleItems(val) {
      this.clearInput();
      this.dialpadVisible = false;

      var incall = _.cloneDeep(val);
      if (this.layout === 'simple' && incall[this.layout].length === 0) {
        this.close();
      }

      if (this.minimized) {
        this.restore()
      }

      this.$nextTick(() => {
        this.calcHeight()

        requestAnimationFrame(() => {
          this.updateScrollpaneSize({autoShrink: true})
        })
      })
    },
  },
  methods: {
    calcHeight() {
      if(this.minimized) {
        return
      }
      // calc max height
      const deskrect = document.getElementById('desktop').getBoundingClientRect()
      let contentHeight = 0
      if(this.os == 'win') {
        const taskrect = document.getElementById('taskbar').getBoundingClientRect()
        contentHeight = deskrect.height - taskrect.height
      }else {
        const menurect = document.getElementById('menubar').getBoundingClientRect()
        contentHeight = deskrect.height - menurect.height
      }
      this.maxHeight = contentHeight

      // calc min height
      let minHeight = 0
      let elems = document.querySelectorAll('.calheight')
      for(let i=0; i<elems.length; i++){
        let h = elems[i].getBoundingClientRect().height
        minHeight += h
      }

      let grps = this.callingPeopleItemsByGroup
      const callitemgroups = this.$refs.callitemgroup
      const grplen = grps.length
      for(let i=0; i<grplen; i++){
        let grp = grps[i]
        minHeight += grpHeaderH

        let grpcomp = callitemgroups[i]
        if(!grpcomp.getCollapsed()) {
          if (grp.list.length >= 1) {
            if (grp.list.length == 1 && !grp.list[0].incoming && !grp.list[0].onhold) {
              minHeight += listIncallHeight
            }else if (grp.list.length == 1 && grp.list[0].onhold) {
              minHeight += listOnholdHeight
            }else{
              minHeight += listIncomingHeight
            }
          }
        }
      }

      minHeight += 2 // border thickness
      this.$store.commit('callWidgetMinHeight', minHeight)

      var wgtrect = this.$el.parentNode.getBoundingClientRect()
      if (wgtrect.height < minHeight) {
        var height = minHeight
        var autoHeight = this.callWidgetResized ? false : true
        this.$parent.setRect({
          height,
          autoHeight,
        })
        this.$store.commit('callWidgetResized', {height: height})
      }
      
    },
    updateScrollpaneSize(opt) {
      if(this.minimized) {
        return
      }
      let {
        skipMultiRowCheck,
        autoShrink,
      } = opt || {}

      let resizedHeighs = this.callWidgetGroupScrollpaneResized
      if(resizedHeighs.length > 0) {
        skipMultiRowCheck = true
      }

      let heightArray = []
      let availableHeight = this.$el.getBoundingClientRect().height
      availableHeight -= 2 //border thickness
      let elems = document.querySelectorAll('.calheight')
      for(let i=0; i<elems.length; i++){
        let h = elems[i].getBoundingClientRect().height
        availableHeight -= h
      }

      let grps = this.callingPeopleItemsByGroup
      const callitemgroups = this.$refs.callitemgroup
      const grplen = grps.length
      availableHeight -= grpHeaderH * grplen

      heightArray = _.fill(Array(grplen), -1);

      let fixedHcnt = 0
      for(let i=0; i<grplen; i++){
        let grp = grps[i]
        let grpcomp = callitemgroups[i]
        if(grpcomp.getCollapsed()) {
          heightArray[i] = 0
          fixedHcnt++
        }else{
          if (grp.list.length == 1) {
            if (!grp.list[0].incoming && !grp.list[0].onhold) {
              heightArray[i] = listIncallHeight
              availableHeight -= listIncallHeight
              fixedHcnt++
            }else if (grp.list[0].onhold) {
              heightArray[i] = listOnholdHeight
              availableHeight -= listOnholdHeight
              fixedHcnt++
            }else if (grp.list[0].incoming) {
              heightArray[i] = listIncomingHeight
              availableHeight -= listIncomingHeight
              fixedHcnt++
            }
          }else if (grp.list.length == 0) {
            heightArray[i] = 0
            fixedHcnt++
          } else {
            if(!skipMultiRowCheck && !grpcomp.getScrollbarVisible()) {
              const screct = grpcomp.$refs.scrollbar.$el.getBoundingClientRect()
              const corect = grpcomp.$refs.scrollcont.getBoundingClientRect()
              const sch = Math.min(screct.height, corect.height)
              heightArray[i] = sch
              availableHeight -= sch
              fixedHcnt++
            }
          }
        }
      }
      if (grplen - fixedHcnt > 0) {
        let h = Math.ceil(availableHeight / (grplen - fixedHcnt))
        if (h < listIncomingHeight) {
          this.updateScrollpaneSize({skipMultiRowCheck: true})
          return
        }
        for(let i=0; i<grplen; i++){
          if(heightArray[i] < 0){
            heightArray[i] = h
          }
        }
        availableHeight = 0
      }

      if(resizedHeighs.length > 0) {
        let resizedTotal = resizedHeighs.reduce(
          (sum, itm) => {
              return sum + itm
            },
          0
        )
        let totalh = heightArray.reduce(
          (sum, itm) => {
              return sum + itm
            },
          0
        )
        let numMinH = 0
        let minHArr = []
        for(let i=0; i<grplen; i++){
          let rto = resizedHeighs[i] / resizedTotal
          let hh = totalh * rto
          if (hh < listIncomingHeight) {
            numMinH++
            minHArr.push(i)
          }
          heightArray[i] = hh
        }
        if (numMinH > 0) {
          let availableResizedT = resizedTotal
          for(let i=0; i<numMinH; i++){
            let idx = minHArr[i]
            heightArray[idx] = listIncomingHeight
            availableResizedT -= resizedHeighs[idx]
          }
          let availableH = totalh - numMinH * listIncomingHeight

          for(let i=0; i<grplen; i++){
            if (minHArr.indexOf(i) == -1) {
              let rto = resizedHeighs[i] / availableResizedT
              let hh = availableH * rto
              heightArray[i] = hh
            }
          }
        }
      }

      this.$store.commit('callWidgetGroupScrollpaneHeight', heightArray)
      if(resizedHeighs.length > 0 && resizedHeighs.length != heightArray) {
        this.$store.commit('callWidgetGroupScrollpaneResized', heightArray)
      }
      
      if (autoShrink && availableHeight > 0) {
        var height = this.callWidgetMinHeight
        var autoHeight = true
        this.$parent.setRect({
          height,
          autoHeight,
        })
        console.log('autoShrink',height)
        this.$store.commit('callWidgetResized', null)
      }

    },
    scrollpaneResize(offset, groudIndex) {
      let heightArray = this.callWidgetGroupScrollpaneHeight.slice()
      if(heightArray[groudIndex-1] + offset > listIncomingHeight && heightArray[groudIndex] - offset > listIncomingHeight) {
        heightArray[groudIndex-1] += offset
        heightArray[groudIndex] -= offset

        this.$store.commit('callWidgetGroupScrollpaneHeight', heightArray)
        this.$store.commit('callWidgetGroupScrollpaneResized', heightArray)
      }
      
    },
    collapseChanged() {
      this.calcHeight()
      this.$nextTick(() => {
        this.updateScrollpaneSize({skipMultiRowCheck: true})
      })
    },


    // ----- resize >>>>>>>
    mousedownTop(evt) {
      evt.stopPropagation();
      this.resizer = 'T'
      this.resizeDraggingPageY = evt.pageY;
      window.addEventListener("mousemove", this.resizeHandlerDragging);
      window.addEventListener("mouseup", this.resizeHandlerStopDrag);
    },
    mousedownBottom(evt) {
      evt.stopPropagation();
      this.resizer = 'B'
      this.resizeDraggingPageY = evt.pageY;
      window.addEventListener("mousemove", this.resizeHandlerDragging);
      window.addEventListener("mouseup", this.resizeHandlerStopDrag);
    },
    resizeHandlerDragging(evt){
      this.resizing = true;
      let offset = evt.pageY - this.resizeDraggingPageY;
      this.resizeDraggingPageY = evt.pageY;
      this.onResize(this.resizer, offset)
    },
    resizeHandlerStopDrag(){
      this.resizing = false;
      window.removeEventListener("mousemove", this.resizeHandlerDragging);
      window.removeEventListener("mouseup", this.resizeHandlerStopDrag);
    },

    // ----- resize <<<<<<<


    transfer(info, mode) {
      if (this.popTransferVisible) {
        return
      }

      let rect = document.querySelector('#pop-call-widget').getBoundingClientRect()

      this.$modal.show(
        transferCall,
        {
          mode: mode,
          layout: this.layout,
          transferInfo: info,

          onTransfer: () => {

            setTimeout(() => {
              var layout = this.layout
              var incall = _.cloneDeep(this.callingPeopleItems);
              var list = incall[layout]
              var i, itm
              for (i=0; i<list.length; i++) {
                itm = list[i];
                if (itm.transferred) {
                  list.splice(i, 1);
                  break;
                }
              }
              incall[layout] = list;
              this.$store.commit('callingPeopleItems', incall);
            }, 5000)

          },

          onAudioCall: () => {
            // TODO 

          },
        }, // component props
        {
          name: 'transfer-call',
          clickToClose: false,
          frameless: true,
          shadow: false,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: true,
          roundedCorner: false,
          overlayVisible: false,
          overlayTransparent: 0,
          theme: this.theme,
          width: 400,
          height: 486,
          transition: true,
          center: false,
          top: rect.top + 50,
          left: rect.left - 20,
        }, // modal props
        {
          closed: () => {
            this.popTransferVisible = false;
          }
        } // modal eventlistener
      );
      this.popTransferVisible = true;
    },


    currentIsTransfered(){
      var incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[this.layout]
      if (list.length > 0) {
        var itm = list[list.length-1];
        if ( itm.transferred ) {
          return true
        }
      }
      
      return false;
    },
    endcall() {
      var incall
      if (this.callingPeopleItems[this.layout].length > 1) {
        incall = _.cloneDeep(this.callingPeopleItems);
        var list = incall[this.layout]
        list.pop();
        var i, itm
        for (i=0; i<list.length; i++) {
          itm = list[i];
          itm.onhold = false;
        }
        this.$store.commit('callingPeopleItems', incall);
        return;
      }

      incall = _.cloneDeep(this.callingPeopleItems);
      incall[this.layout] = []
      this.$store.commit('callingPeopleItems', incall);

      if (this.layout === 'simple') {
        this.close();
      }
      
    },
    close() {
      var incall = _.cloneDeep(this.callingPeopleItems);
      incall[this.layout] = []
      this.$store.commit('callingPeopleItems', incall);
      this.$emit("close");
    },
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
    bringBackWindow(opt) {
      this.$store.commit('teamsWindowMinimized', false);
      this.$store.commit('teamsNavTo', {nav: 'calling', tab: opt.navto});
    },
    dialpadPress(e, num) {
      e.preventDefault();
      this.$refs.searchinput.input.focus();
      this.searchcontent += `${num}`;
    },
    resumeHanlder() {
      if(this.onResume) {
        this.onResume();
      }
    },

    // public 
    updateMinimize(val) {
      this.minimized = val
    },
    setDockSide(val) {
      this.dockSide = val
    },

    mousedown(e) {
      e.stopPropagation()
      this.$popper.hideAll()
    },
    stopPP(e) {
      e.stopPropagation()
    },
    minibtnMousedown(e) {
      e.stopPropagation()
      this.$popper.hideAll()
    },
    minimize(e) {
      if(e) {
        this.hoverActionDisabled = true
        setTimeout(() => {
          if (!this.$hitTest(this.$refs.widget, e.pageX, e.pageY)) {
            this.hoverActionDisabled = false
          }
        }, 300)
      }
      this.minimized = true
      this.minimize2()
    },
    minimize2() {
      this.onMinimize(this.$parent, this.$el.parentNode, this) // Modal instance
    },

    minimizedMouseover() {
      this.restore()
    },
    minimizedMouseleave() {
      this.hoverActionDisabled = false
    },

    minimizedMousedown(e) {
      this.mouseXY = {
        x: e.clientX,
        y: e.clientY,
      }
      document.addEventListener('mouseup', this.minimizedMouseup);
    },
    minimizedMouseup(e) {
      if (Math.abs(this.mouseXY.x - e.clientX) < 3 && Math.abs(this.mouseXY.y - e.clientY) < 3) {
        this.hoverActionDisabled = false
        this.restore()
      }

      document.removeEventListener('mouseup', this.minimizedMouseup);
    },

    restore() {
      if(!this.hoverActionDisabled) {
        this.minimized = false
        this.onRestore(this.$parent, this.$el.parentNode, this)
      }
      this.initMousemove()
    },

    initMousemove() {
      if(!this.hoverActionDisabled) {
        document.addEventListener('mousemove', this.mousemove)
      }
    },

    mousemove(e) {
      if (!this.resizing && !this.$hitTest(this.$refs.widget, e.pageX, e.pageY)) {
        this.minimize()
        document.removeEventListener('mousemove', this.mousemove)
      }
    },

    switchToVideoCall() {
      this.$popper.hideAll()

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
        callPeopleVideoOn: false,
      }, {
        offset: [100, 20],
        transition: {
          from: {
            left: rect.left,
            top: rect.top,
            scale: 0.5,
            opacity: 0,
          },
          
        },
      })


      if(this.isFTE) {
        setTimeout(() => {
          this.showCoachmark({
            name: 'settings-coachmark',
            closable: true,
            icon: null,
            title: 'Phone settings moved here',
            content: `In a video call you can access your phone features like hold, transfer, park, conference here in the more menu`,
            reference: document.getElementById('call-control-button-more'),
            closeTrigger: '',
            placement: `top`,
            button: {
              label: `Done`,
              func: () => {

              },
            },
          })
        }, 500)
      }
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
              modifiers: opt.modifiers || [],
            },
          }, // popper props
          {
            opened: () => { },
            closed: () => { },
          } // popper eventlistener
        );
    },



    showCallAs(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.callAsMenuVisible) {
        this.$popper.show(
          PopperCallAs,
          {
            callAsList: this.callAsList,
            selected: this.callAs,
          }, // component props
          {
            reference: this.$refs.iconcallas,
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
            opened: () => { this.callAsMenuVisible = true },
            closed: () => { this.callAsMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

    showCallQueues(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.callQueueMenuVisible) {
        this.$popper.show(
          PopperCallQueues,
          {
            queueList: this.queueList,
          }, // component props
          {
            reference: this.$refs.iconcallqueues,
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
            opened: () => { this.callQueueMenuVisible = true },
            closed: () => { this.callQueueMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },


    showPhoneSettings(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.phoneSettingsMenuVisible) {
        this.$popper.show(
          PopperPhoneSettings,
          {
            onForwardcallsChange: evt => {
              if (evt.data) {
                this.alertbanner = {
                  visible: true,
                  icon: 'call-forward-settings-bold',
                  content: `Calls forwarded to: ${evt.data.label}`,
                  button: {
                    label: 'Turn off',
                  },
                }
              }
              
            },
          }, // component props
          {
            reference: this.$refs.iconforwarded,
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
            opened: () => { this.phoneSettingsMenuVisible = true },
            closed: () => { this.phoneSettingsMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },


    togglePrivacy() {
      this.privacy = !this.privacy
    },

  }
};
</script>

<style lang="scss">
#pop-call-widget {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  pointer-events: auto;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
  user-select: none;

  .spacer {
    flex-grow: 1;
  }

  .head {
    width: 100%;
    flex-shrink: 0;

    .head1 {
      height: 28px;
      display: flex;
      align-items: center;
      padding-left: 8px;
      font-size: 12px;
      flex-shrink: 0;
    }
    .head2 {
      @include flex(row, space-between);
      height: 48px;
      display: flex;
      align-items: center;
      padding-left: 0;
      font-size: 14px;
      flex-shrink: 0;

      .logo {
        margin: 0 4px 0 12px;
        width: 21px;
        height: 17px;
        background-size: 21px 17px;
      }

      .left {
        @include flex;
      }

      .btn-circle {
        width: 28px;
        min-width: 28px;
        height: 28px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 2px;
        z-index: 10;
        box-sizing: border-box;

        &.btn-c2 {
          width: 40px;
          height: 40px;
          border-radius: 20px;
        }

        .lb {
          margin-left: 4px;
          font-size: 14px;
          opacity: .95;
        }

        &.btn-pill {
          width: auto;
          padding: 0 8px;
          min-width: 28px;

          .ico {
            &:first-child {
              margin-left: 0;
            }
            &:last-child {
              margin-right: 0;
            }
          }
        }

        &[disabled] {
          pointer-events: none;
          opacity: .4;
        }

        &:hover {
          background-color: rgba($color: #FFF, $alpha: 0.07);
        }

        &:active,
        &.active {
          background-color: rgba($color: #FFF, $alpha: 0.1);
        }
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

  .alertbanner {
    margin: 0 8px;
    flex-shrink: 0;
  }

  .tools {
    @include flex;
    height: 64px;
    padding: 0 12px;
    flex-shrink: 0;

    .searchinput {
      margin: 0;
      flex-grow: 1;

      .md-input {
        width: 100%;
        height: 32px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: normal;
        padding-left: 32px;
        color: rgba($color: white, $alpha: 0.95) !important;
        background-color: black !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;

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
        width: 40px;
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
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      box-sizing: border-box;
      border: 1px solid rgba($color: #FFF, $alpha: 0);

      &:hover{
        border: 1px solid rgba($color: #FFF, $alpha: .3);
        background-color: rgba($color: #FFF, $alpha: .07);
      }
      &:active,
      &.active{
        border: 1px solid rgba($color: #FFF, $alpha: .7);
        background-color: rgba($color: #FFF, $alpha: .2);
      }

      .badge {
        top: -6px;
        right: -8px;
      }

    }

    .btn-cancel {
      margin-left: 8px;
    }
  }

  .dialpad {
    @include flex;

    .keybuttons {
      align-self: center;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 240px;
      user-select: none;
      margin: 16px 0 16px 0;

      .num {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        margin: 4px 8px;

        &:hover {
          background-color: rgba($color: #FFFFFF, $alpha: .07);
        }
        &:active {
          background-color: rgba($color: #FFFFFF, $alpha: .2);
        }

        .t1 {
          font-size: 26px;
          line-height: 24px;
        }
        .t2 {
          font-size: 14px;
          opacity: .7;
          height: 24px;
        }
      }

    }
  }

/*
  .options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px;

    height: 218px;
    margin: 0 8px;

    background: linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%);
    border-radius: 8px;

    .row {
      @include flex;
    }

    .item {
      @include flex(column);
      margin: 12px;
      width: 48px;

      .btnr {
        @include flex;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 4px;

        &:hover {
          background: rgba($color: #FFF, $alpha: 0.07);
        }
        &:active, &.active {
          background: rgba($color: #FFF, $alpha: 0.11);
        }
      }
      .lb {
        font-size: 14px;
        opacity: .7;
      }
    }
  }

  .controls {
    @include flex;
    height: 50px;

    .btn {
      margin: 0 4px;
      padding: 0 12px;

      .lb {
        flex-grow: 1;
      }

      .ico {
        margin-right: 8px;
      }

      .btnarr {
        @include flex;
        width: 22px;
        height: 32px;
        margin-left: 8px;
        margin-right: -12px;
      }
    }

    .btn-circle {
      padding: 0;
      width: 32px;
      min-width: 32px;
    }
    
  }
*/

  .minimized {
    position: relative;
    @include flex;
    flex-grow: 1;

    .ico {
      margin-left: -8px;
    }

    .logo {
      position: absolute;
      top: 12px;
      right: 10px;
      width: 21px;
      height: 17px;
      background-size: 21px 17px;
    }
    .badge {
      position: absolute;
      top: 2px;
      right: -2px;
    }
  }

  .split-line{
      border-bottom: 1px solid #EEE;
  }

  .logo {
    margin-right: 4px;
    margin-left: 0;
    width: 16px;
    height: 12px;
    background-image: url(~@/assets/icon/webex_logo.svg);
    background-repeat: no-repeat;
    background-size: 16px 12px;
    background-position: center;
  }

  .badge {
    position: absolute;
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
    pointer-events: none;
  }

  .vertical-spacer {
    flex-grow: 1;
  }

  .bottomoptions {
    @include flex;
    height: 48px;
    width: 100%;
    padding: 0 10px;
    font-size: 14px;
    flex-shrink: 0;

    .btn {
      @include flex;
      height: 28px;
      padding: 0 10px;
      margin-right: 4px;

      .ico {
        margin-right: 4px;
      }

      .lb {
        opacity: .95;
      }
    }

    .spacer {
      flex-grow: 1;
    }

    .togglelb {
      margin-right: 8px;
    }

  }

  .resizer {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;

    .resizertop {
      position: absolute;
      width: 100%;
      height: 4px;
      top: 0;
      cursor: ns-resize;
      pointer-events: auto;
    }
    .resizerbottom {
      position: absolute;
      width: 100%;
      height: 4px;
      bottom: 0;
      cursor: ns-resize;
      pointer-events: auto;
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
