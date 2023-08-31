<template>
  <div class="teamnav" :class="{expanded: teamsNavExpanded}" ref="navcontainer" >
      <div 
        class="teamnav-grp" 
        ref="itemlisttop" 
        :style="{
          height: `${groupTopHeight}px`,
        }"
      >
        <div
          v-for="(itm, idx) in teamsNavItemsFiltered"
          :key="`navitm-${itm.id}`"
          :id="`navitm-${itm.id}`"
          :class="[
              (itm.id !== 'divider' ? 'teamnav-grp-btn' : 'divider'), 
              {
                'firstcol-nav-nonesortable': !itm.sortable && itm.id !== 'divider',
                active: contextMenuId == itm.id || teamsNav === itm.id,
                disabled: !itm.sortable && isDragging && itm.id !== 'divider',
                noactive: itm.sortable && isDragging && dragItem && itm.id !== dragItem.id || idx === dragIdx,
                minimize: dragItem && itm.id === dragItem.id,
                transparent: dragData && dragData.element && itm.id === dragData.item.id,
              }
            ]" 
          :style="{
            top: `${itm.top}px`,
            backgroundColor: `${itm.bgcolor ? itm.bgcolor : null}`,
          }"
          @mousedown="onMousedown($event, itm, idx)"
          @contextmenu.prevent="onContextmenu($event, itm)"
          @click="itm.id !== 'divider' ? changeNav(itm.id) : null" 
        >
          <div v-if="itm.id !== 'divider'" class="bg"></div>
          <div v-if="itm.id !== 'divider'" class="icon" v-html="itm.icon"></div>
          <span v-if="itm.id !== 'divider'" class="label">{{itm.label}}</span>
          <div v-if="itm.id !== 'divider' && itm.badge && !isFTE" class="badge"><span class="lb">{{itm.badge}}</span></div>
          <div v-if="itm.id !== 'divider' && itm.suffix" class="suffix" v-html="itm.suffix"></div>
          <div v-if="itm.id === 'divider'" class="gradient-divider-h"></div>
        </div>

        <div class="insert-indicator" :style="{top: indicatorTop, opacity: indicatorTop ? 1 : 0}"></div>

        <div 
          id="navitm-more" 
          class="teamnav-grp-btn" 
          :class="{
            active: moreVisible || itemInMoreActive,
          }"
          :style="{top: `${grpTopHeight}px`}"
          @click="toggleMore" 
        >
          <div class="bg"></div>
          <div class="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13.125C12.6213 13.125 13.125 12.6213 13.125 12C13.125 11.3787 12.6213 10.875 12 10.875C11.3787 10.875 10.875 11.3787 10.875 12C10.875 12.6213 11.3787 13.125 12 13.125Z" fill="white" fill-opacity="0.7"/>
              <path d="M6.375 13.125C6.99632 13.125 7.5 12.6213 7.5 12C7.5 11.3787 6.99632 10.875 6.375 10.875C5.75368 10.875 5.25 11.3787 5.25 12C5.25 12.6213 5.75368 13.125 6.375 13.125Z" fill="white" fill-opacity="0.7"/>
              <path d="M17.625 13.125C18.2463 13.125 18.75 12.6213 18.75 12C18.75 11.3787 18.2463 10.875 17.625 10.875C17.0037 10.875 16.5 11.3787 16.5 12C16.5 12.6213 17.0037 13.125 17.625 13.125Z" fill="white" fill-opacity="0.7"/>
            </svg>
          </div>
          <span class="label">More</span>
        </div>

      </div>


      <div class="firstcol-nav-spacer" ref="navspacer"></div>

      <div 
        class="teamnav-grp notrans" 
        :style="{
          height: `${grpBottomHeight}px`,
        }"
        ref="itemlistbot" 
      >

        <!--div 
          class="teamnav-grp-btn green-40" 
          style="top:0" 
        >
          <div class="bg"></div>
          <div class="icon"><wl-icon name="refresh-bold" size="24" class="ico" /></div>
          <span class="label">Update ready</span>
        </div-->

        <div 
          class="teamnav-grp-btn" 
          :class="{
            active: teamsNav === 'settings',
          }" 
          style="top:42px" 
        >
          <div class="bg"></div>
          <div class="icon"><wl-icon name="settings-filled" color="white" size="24" class="ico" /></div>
          <span class="label">Settings</span>
        </div>

        <div 
          id="teamnav-help-button"
          ref="helpbutton"
          class="teamnav-grp-btn" 
          :class="{
            active: teamsNav === 'help' || helpVisible,
          }" 
          style="top:84px" 
          @mouseover="showHelp"
        >
          <div class="bg"></div>
          <div class="icon"><wl-icon name="help-circle-filled" color="white" size="24" class="ico" /></div>
          <span class="label">Help</span>
        </div>

      </div>

      <div v-if="showNavLogo" class="logo">
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_3149_31342)">
          <mask id="mask0_3149_31342" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="8" y="8" width="32" height="16">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.82129 8H39.1788V23.9999H8.82129V8Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_3149_31342)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M39.1788 12.9624C39.1788 12.5984 38.8833 12.3044 38.5203 12.3044C38.1558 12.3044 37.8603 12.5984 37.8603 12.9624V14.3474C37.8603 14.7124 38.1558 15.0074 38.5203 15.0074C38.8833 15.0074 39.1788 14.7124 39.1788 14.3474V12.9624ZM35.5548 11.1444C35.5548 10.7814 35.2598 10.4859 34.8878 10.4859C34.5238 10.4859 34.2293 10.7814 34.2293 11.1444V14.3474C34.2293 14.7124 34.5238 15.0074 34.8878 15.0074C35.2598 15.0074 35.5548 14.7124 35.5548 14.3474V11.1444ZM31.9233 8.65836C31.9233 8.29486 31.6283 7.99986 31.2643 7.99986C30.9003 7.99986 30.6053 8.29486 30.6053 8.65836V15.6629C30.6053 16.0284 30.9003 16.3234 31.2643 16.3234C31.6283 16.3234 31.9233 16.0284 31.9233 15.6629V8.65836ZM28.2908 11.1444C28.2908 10.7814 27.9958 10.4859 27.6318 10.4859C27.2683 10.4859 26.9728 10.7814 26.9728 11.1444V14.3474C26.9728 14.7124 27.2683 15.0074 27.6318 15.0074C27.9958 15.0074 28.2908 14.7124 28.2908 14.3474V11.1444ZM24.6588 12.9624C24.6588 12.5984 24.3638 12.3044 24.0018 12.3044C23.6383 12.3044 23.3413 12.5984 23.3413 12.9624V14.3474C23.3413 14.7124 23.6383 15.0074 24.0018 15.0074C24.3638 15.0074 24.6588 14.7124 24.6588 14.3474V12.9624ZM21.0333 11.1444C21.0333 10.7814 20.7363 10.4859 20.3718 10.4859C20.0083 10.4859 19.7113 10.7814 19.7113 11.1444V14.3474C19.7113 14.7124 20.0083 15.0074 20.3718 15.0074C20.7363 15.0074 21.0333 14.7124 21.0333 14.3474V11.1444ZM17.4028 8.65836C17.4028 8.29486 17.1063 7.99986 16.7423 7.99986C16.3783 7.99986 16.0813 8.29486 16.0813 8.65836V15.6629C16.0813 16.0284 16.3783 16.3234 16.7423 16.3234C17.1063 16.3234 17.4028 16.0284 17.4028 15.6629V8.65836ZM13.7728 11.1444C13.7728 10.7814 13.4758 10.4859 13.1123 10.4859C12.7483 10.4859 12.4513 10.7814 12.4513 11.1444V14.3474C12.4513 14.7124 12.7483 15.0074 13.1123 15.0074C13.4758 15.0074 13.7728 14.7124 13.7728 14.3474V11.1444ZM10.1428 12.9624C10.1428 12.5984 9.84629 12.3044 9.48179 12.3044C9.11829 12.3044 8.82129 12.5984 8.82129 12.9624V14.3474C8.82129 14.7124 9.11829 15.0074 9.48179 15.0074C9.84629 15.0074 10.1428 14.7124 10.1428 14.3474V12.9624ZM23.7868 18.7044C23.7468 18.6934 23.1373 18.5359 22.4893 18.5359C21.2623 18.5359 20.5228 19.1984 20.5228 20.1854C20.5228 21.0584 21.1418 21.4939 21.8833 21.7279C21.9653 21.7559 22.0858 21.7934 22.1673 21.8204C22.4978 21.9239 22.7603 22.0784 22.7603 22.3454C22.7603 22.6444 22.4558 22.8384 21.7933 22.8384C21.2123 22.8384 20.6538 22.6719 20.5368 22.6424V23.8564C20.6023 23.8704 21.2658 23.9999 21.9733 23.9999C22.9923 23.9999 24.1578 23.5554 24.1578 22.2299C24.1578 21.5879 23.7633 20.9949 22.8998 20.7209L22.5328 20.6039C22.3138 20.5349 21.9223 20.4229 21.9223 20.1014C21.9223 19.8479 22.2123 19.6694 22.7463 19.6694C23.2063 19.6694 23.7668 19.8244 23.7868 19.8304V18.7044ZM33.6593 19.8809C34.4478 19.8809 35.0363 20.5024 35.0363 21.2679C35.0363 22.0354 34.4478 22.6569 33.6593 22.6569C32.8693 22.6569 32.2828 22.0354 32.2828 21.2679C32.2828 20.5024 32.8693 19.8809 33.6593 19.8809ZM36.4463 21.2679C36.4463 19.7619 35.2813 18.5379 33.6593 18.5379C32.0368 18.5379 30.8733 19.7619 30.8733 21.2679C30.8733 22.7774 32.0368 23.9999 33.6593 23.9999C35.2813 23.9999 36.4463 22.7774 36.4463 21.2679ZM15.5773 18.7259C15.4518 18.6899 14.9893 18.5379 14.3633 18.5379C12.7433 18.5379 11.5543 19.6934 11.5543 21.2679C11.5543 22.9679 12.8668 23.9999 14.3633 23.9999C14.9583 23.9999 15.4113 23.8594 15.5773 23.8119V22.3964C15.5198 22.4279 15.0848 22.6764 14.4593 22.6764C13.5718 22.6764 12.9998 22.0524 12.9998 21.2679C12.9998 20.4599 13.5968 19.8619 14.4593 19.8619C15.0953 19.8619 15.5238 20.1154 15.5773 20.1424V18.7259ZM29.4713 18.7259C29.3458 18.6899 28.8828 18.5379 28.2578 18.5379C26.6358 18.5379 25.4473 19.6934 25.4473 21.2679C25.4473 22.9679 26.7608 23.9999 28.2578 23.9999C28.8493 23.9999 29.3038 23.8594 29.4713 23.8119V22.3964C29.4133 22.4279 28.9773 22.6764 28.3518 22.6764C27.4658 22.6764 26.8938 22.0524 26.8938 21.2679C26.8938 20.4599 27.4908 19.8619 28.3518 19.8619C28.9883 19.8619 29.4173 20.1154 29.4713 20.1424V18.7259ZM17.4068 23.9069H18.7383V18.6314H17.4068V23.9069Z" fill="#1170CF"/>
          </g>
          </g>
          <defs>
          <clipPath id="clip0_3149_31342">
          <rect width="32" height="16" fill="white" transform="translate(8 8)"/>
          </clipPath>
          </defs>
        </svg>
      </div>

      <div v-if="!isNarrowWindow" class="expandler gradient-divider-v">
        <div class="icobtn" @click="toggleExpand">
          <wl-icon v-if="!teamsNavExpanded" name="arrow-right-filled" color="white" size="12" />
          <wl-icon  v-if="teamsNavExpanded" name="arrow-left-filled" color="white" size="12" />
        </div>
      </div>

  </div>
</template>

<script>
import teamNavMoreMenu from "./team-nav-more.vue";
import menuNavItem from './menu-nav-item.vue';
import _ from 'lodash';
import mframe from 'mframe'

export default {
  props:[
    'name',
  ],
  data() {
    return {
      ITEM_HEIGHT: 40,
      ITEM_WIDTH: 40,
      ITEM_WIDTH_EXP: 192,
      ITEM_GAP: 2,
      ITEM_DIVIDER: 9,
      grpTopHeight: 0,
      grpBottomHeight: 0,

      moreVisible: false,
      tmoHoverMore: null,
      contextMenuId: null,

      dragData: null,
      dragItem: null,
      isDragging: false,
      insertAt: null,
      indicatorTop: null,
      dragIdx: null,

      shrinkElements: [],
      hideableElements: [],

      POPPER_MORE_NAME: 'popper-nav-more',

      helpVisible: false,
      helpList: [
        {
          label: 'Check for updates',
          icon: 'refresh-bold',
        },
        {
          label: 'Keyboard shortcuts',
          icon: 'keyboard-bold',
        },
        {
          label: 'App walkthrough',
          icon: 'next-bold',
        },
        {
          label: 'Help Center',
          icon: 'help-circle-bold',
        },
        {
          label: `What's new`,
          icon: 'announcement-bold',
        },
        {
          label: 'Join test meeting',
          icon: 'enter-room-bold',
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
    teamsNavLayout() {
      return this.$store.state.teamsNavLayout;
    },
    teamsNav() {
      return this.$store.state.teamsNav;
    },
    teamsNavPrev() {
      return this.$store.state.teamsNavPrev;
    },
    teamsNavItemIsReordering() {
      return this.$store.state.teamsNavItemIsReordering;
    },
    teamsNavVisibleNum() {
      return this.$store.state.teamsNavVisibleNum;
    },
    teamsNavItems() {
      return this.$store.state.teamsNavItems;
    },
    teamsNavItemsFiltered() {
      var cnt = 0;
      var top = 0;
      const itemH = this.ITEM_HEIGHT
      const itemGap = this.ITEM_GAP
      var items = this.teamsNavItems.filter(
          itm => {
            var valid = false;
            if (itm.layouts.indexOf(this.teamsNavLayout) >= 0 && itm.sortable && !itm.inmore) {
              cnt++;
            }
            if (itm.layouts.indexOf(this.teamsNavLayout) >= 0 && !itm.inmore && cnt <= this.teamsNavVisibleNum) {
              itm.top = top
              var skip = this.dragItem && itm.id === this.dragItem.id
              if (!skip) {
                if (itm.id !== 'divider') {
                  top += itemH + itemGap
                } else {
                  top += this.ITEM_DIVIDER + itemGap
                }
              }

              this.grpTopHeight = top;
              valid = true;
            }
            return valid
          }
        );
        
      return items;
    },
    groupTopHeight() {
      return this.teamsNavItemsInMore.length > 0 ? (this.grpTopHeight + this.ITEM_HEIGHT + this.ITEM_GAP) : this.grpTopHeight
    },
    teamsNavItemsInMore() {
      var cnt = 0;
      var items = this.teamsNavItems.filter(
          itm => {
            var valid = false;
            if (itm.layouts.indexOf(this.teamsNavLayout) >= 0 && itm.sortable && !itm.inmore && (!this.dragItem || itm.id !== this.dragItem.id)) {
              cnt++;
            }
            if (itm.layouts.indexOf(this.teamsNavLayout) >= 0 && itm.sortable && (!this.dragItem || itm.id !== this.dragItem.id) && (itm.inmore || cnt > this.teamsNavVisibleNum)) {
              valid = true;
            }
            return valid
          }
        );

      return items;
    },
    
    teamsNavExpanded() {
      return this.$store.state.teamsNavExpanded && !this.isNarrowWindow;
    },
    showNavLogo() {
      return this.$store.state.showNavLogo;
    },
    isNarrowWindow() {
      return this.breakpoints.width < 960;
    },
    breakpoints() {
      return this.$store.state.breakpoints;
    },
    
    itemInMoreActive() {
      var sortableitems = this.teamsNavItemsFiltered.reduce(
        (arr, itm) => {
          arr.push(itm.id);
          return arr;
        },
        []
      );
      sortableitems = sortableitems.concat(['settings', 'help']);
      return !sortableitems.includes(this.teamsNav);
    },

    teamsSidecarName() {
      return this.$store.state.teamsSidecarName;
    },
    isFTE() {
      return this.$store.state.isFTE;
    },


  },
  mounted(){
    this.grpBottomHeight = this.ITEM_HEIGHT * 3 + this.ITEM_GAP,

    this.$eventBus.$on('ondragstart', this.ondragstart);
    this.$eventBus.$on('ondragging', this.ondragging);
    this.$eventBus.$on('ondragstop', this.ondragstop);
    this.$eventBus.$on('ondragmotionend', this.ondragmotionend);
    this.$eventBus.$on('teams-resizing', this.onAppResizing);
  },
  destroyed() {
    this.$eventBus.$off('ondragstart', this.ondragstart);
    this.$eventBus.$off('ondragging', this.ondragging);
    this.$eventBus.$off('ondragstop', this.ondragstop);
    this.$eventBus.$off('ondragmotionend', this.ondragmotionend);
    //this.$eventBus.$off('teams-resizing', this.onAppResizing);
  },

  watch: {
    teamsNavItems() {
      this.$nextTick(() => {
        this.setVisibleNavItems();
      });
    },
    teamsNavItemsFiltered(val) {
      if (this.dragData && this.dragData.element && !this.dragData.mframe && !this.isDragging) {
        let item = val.find(
          itm => itm.id === this.dragData.item.id
        );
        if (item) {
          // drop to nav column
          const fromtop = this.dragData.element.style.top
          const fromleft = this.dragData.element.style.left

          let fromwidth = this.dragData.element.style.width
          let width = !this.teamsNavExpanded ? this.ITEM_WIDTH : this.ITEM_WIDTH_EXP

          const lstrect = this.$refs.navcontainer.getBoundingClientRect();
          const top = `${lstrect.top + item.top}px`;
          const left = `${lstrect.left + (lstrect.width - width)/2}px`

          this.dragData.mframe = mframe([{
              dom: this.dragData.element,
              frames: [
                  { css: {top: fromtop, left: fromleft, width: fromwidth}, time: 0 },
                  { css: {top: top, left: left, width: width}, time: 10, tween: 'easeInOut' }
              ]
          }], {
            end: () => {
              this.dragData.element.remove();
              this.dragData = null
              this.$eventBus.$emit('ondragmotionend');
            }
          });
          this.dragData.mframe.play();

          // fade bg
          const mf = mframe([{
              dom: this.dragData.elementbg,
              frames: [
                  { css: {opacity: 1}, time: 0 },
                  { css: {opacity: 0}, time: 10, tween: 'easeInOut' }
              ]
          }]);
          mf.play();

        } else if (this.dragData && this.dragData.from === 'nav') {
          // drop to more menu
          // do it in team-nav-more.vue
        }

      }
    },
  },
  methods:{

    random(l, h) {
      return _.random(l, h);
    },
    cloneDeep(obj) {
      return _.cloneDeep(obj);
    },

    onAppResizing() {
      this.setVisibleNavItems();
    },

    setVisibleNavItems() {
      // shrink and hide elements
      const ctrect = this.$refs.navcontainer.getBoundingClientRect();
      const botrect = this.$refs.itemlistbot.getBoundingClientRect();

      const fixeditems = document.querySelectorAll('.firstcol-nav-nonesortable');
      const fixednum = fixeditems.length
      
      const maxtoph = ctrect.height - botrect.height
      let numofitems = Math.floor((maxtoph - this.ITEM_DIVIDER - this.ITEM_GAP - fixednum * (this.ITEM_HEIGHT + this.ITEM_GAP)) / (this.ITEM_HEIGHT + this.ITEM_GAP))
      // 减去 More
      numofitems -= 1;

      if (this.teamsNavVisibleNum !== numofitems) {
        this.$store.commit('teamsNavVisibleNum', numofitems);

        this.$nextTick(() => {
          if (this.moreVisible) {
            // adjust more menu vertical position
            this.showMore();
          }
        });
      }

    },

    changeNav(nav) {
      switch (nav){
        case 'contacts':
          this.$store.commit('activeContactId', null)
          break;
        case 'webexgpt':
          this.$store.commit('teamsSidecarName', null)
          break;
      }
      if (this.teamsNav !== nav && this.teamsNavPrev !== this.teamsNav) {
        this.$store.commit('teamsNavPrev', this.teamsNav);
      }
      this.$store.commit('teamsNav', nav);
      this.$popper.hideAll()
    },
    toggleExpand() {
      this.$store.commit('teamsNavExpanded', !this.teamsNavExpanded);
    },
    toggleMore(){
      if(this.moreVisible) {
        this.$popper.hide(this.POPPER_MORE_NAME);
      } else {
        this.showMore();
      }
    },
    showMore() {
      this.$popper.hide(this.POPPER_MORE_NAME);
      
      this.$popper.show(
        teamNavMoreMenu, 
        {
          name: this.POPPER_MORE_NAME,
          data: this.dragData,
        }, // component props
        {
          name: this.POPPER_MORE_NAME,
          reference: document.getElementById('navitm-more'),
          affiliatedElementSelector: ['.menu-nav-item'],
          closeTrigger: 'mousedown',
          arrowVisible: true,
          roundedCorner: true,
          borderRadius: '12px',
          appendToBody: true,
          theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
          options: {
            placement: 'right',
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
          opened: () => {this.moreVisible = true},
          closed: () => {this.moreVisible = false},
        } // popper eventlistener
      );

    },

    // -----------------------------------
    // ------------- DRAG >>>>>>>>>>>>>>>>
    // -----------------------------------
    onMousedown(evt, item, idx) {
      if (evt.which !== 1) {
        // 只允许鼠标左键点击
        return
      }
      if (!item.sortable || item.id === 'divider') {
        return
      }

      this.dragData = {
        x: evt.pageX,
        y: evt.pageY,
        offsetX: evt.offsetX,
        offsetY: evt.offsetY,
        item: item,
        idx: idx,
        from: 'nav',
      }
      document.addEventListener('mousemove', this.documentMousemoveHandler);
      document.addEventListener('mouseup', this.documentMouseupHandler);
    },
    documentMousemoveHandler(evt) {
      const p = {
        x: evt.pageX,
        y: evt.pageY,
      }
      if (!this.isDragging && Math.sqrt(Math.pow(p.x - this.dragData.x, 2) + Math.pow(p.y - this.dragData.y, 2)) > 3) {
        this.dragstart(evt);
      }
      if (this.isDragging) {
        this.drag(evt, this.dragData.item, this.dragData.idx);
      }
    },
    documentMouseupHandler(evt) {
      if(!this.isDragging){
        this.dragData = null
      } else {
        this.dragend(evt);
      }

      document.removeEventListener('mousemove', this.documentMousemoveHandler);
      document.removeEventListener('mouseup', this.documentMouseupHandler);
    },

    // ------------

    dragstart(evt) {
      this.$store.commit('teamsNavItemIsReordering', true);
      this.$eventBus.$emit('ondragstart', this.dragData);

      //
      const container =  document.getElementById('desktop');
      const div = document.createElement('div');
      div.className = 'teamnav-grp-btn active notrans shad';

      const bg = document.createElement('div');
      const icon = document.createElement('icon');
      const label = document.createElement('label');
      
      bg.className = 'bg';
      icon.className = 'icon';
      icon.innerHTML = this.dragData.item.icon
      label.className = 'label';
      label.innerHTML = this.dragData.item.label

      div.appendChild(bg);
      div.appendChild(icon);
      div.appendChild(label);

      if (this.dragData.item.badge) {
        const badge = document.createElement('badge');
        badge.className = 'badge';
        badge.innerHTML = `<span class="lb">${this.dragData.item.badge}</span>`
        div.appendChild(badge);
      }
      if (this.dragData.item.suffix) {
        const suffix = document.createElement('suffix');
        suffix.className = 'suffix';
        suffix.innerHTML = this.dragData.item.suffix
        div.appendChild(suffix);
      }

      let width = this.ITEM_WIDTH
      if (this.teamsNavExpanded) {
        width = this.ITEM_WIDTH_EXP
      }
      
      div.style.width = `${width}px`
      div.style.zIndex = `999999`
      container.appendChild(div);
      
      this.dragData.element = div;
      this.dragData.elementbg = bg;

      this.setTargetPosition(evt)
    },
    drag(evt, itm, idx) {
      if (this.dragItem) {
        this.$eventBus.$emit('ondragging', evt, this.dragItem, this.dragIdx);
      } else {
        this.$eventBus.$emit('ondragging', evt, itm, idx);
      }

      this.setTargetPosition(evt)
    },
    dragend(evt) {
      this.$store.commit('teamsNavItemIsReordering', false);
      this.$eventBus.$emit('ondragstop', evt);
    },
    setTargetPosition(evt) {
      const left = evt.pageX - this.dragData.offsetX
      const top = evt.pageY - this.dragData.offsetY
      this.dragData.element.style.left = `${left}px`
      this.dragData.element.style.top = `${top}px`
    },


    // ----------- listeners ------------

    ondragstart(data) {
      if (!this.dragData) {
        this.dragData = data
      }
      this.isDragging = true
    },
    ondragging(evt, item, idx) {
      if (!this.dragItem) {
        this.dragItem = item
        this.dragIdx = idx
      }
      //
      const lstrect = this.$refs.itemlisttop.getBoundingClientRect();
      const p = {
        x: evt.pageX,
        y: evt.pageY,
      }
      if (p.x === 0 && p.y === 0) {
        return // 不处理拖动最后一刻X和Y都为0的情形
      }
      var filteredList = this.teamsNavItemsFiltered.slice();
      var sortableitems = filteredList.filter(m => m.sortable);
      filteredList.push(
        {
          id: 'more',
          inmore: false,
          sortable: false,
        }
      )
      var iidx;
      const len = filteredList.length;
      for(var i=0; i<len; i++){
        var itm = filteredList[i];
        if ((itm.sortable || itm.id === 'more') && itm.id !== this.dragItem.id) {
          const elem = document.getElementById(`navitm-${itm.id}`);
          if (elem) {
            const obj = elem.getBoundingClientRect();
            var rect = {
              width: obj.width,
              height: obj.height,
              left: obj.left,
              top: obj.top,
              right: obj.right,
              bottom: obj.bottom,
            };
            var rect1 = _.cloneDeep(rect);
            var rect2 = _.cloneDeep(rect);

            rect1.height = rect.height/2;
            rect1.bottom = rect.bottom - rect.height/2;

            rect2.height = rect.height/2;
            rect2.top = rect.top + rect.height/2;

            if (itm.id !== 'more') {
              if (this.$pointInRect(p, rect1)) {
                iidx = {
                  id: itm.id,
                  loc: 'before',
                }
                this.indicatorTop = `${rect1.top - lstrect.top}px`
                break;
              } else if (this.$pointInRect(p, rect2)) {
                iidx = {
                  id: itm.id,
                  loc:'after',
                }
                this.indicatorTop = `${rect2.bottom - lstrect.top}px`
                break;
              }
            } else if (itm.id === 'more' && sortableitems.length === 0) {
              if (this.$pointInRect(p, rect)) {
                iidx = {
                  id: 'first-sortable',
                  loc: 'before',
                }
                this.indicatorTop = `${rect.top - lstrect.top}px`
              }
            }

            
          }
          
        }
      }

      if (!iidx) {
        this.indicatorTop = null;
      }

      this.insertAt = iidx;

      // hover and open more
      /*
      const morerect = document.getElementById(`navitm-more`).getBoundingClientRect();
      if (this.$pointInRect(p, morerect)) {
        if (!this.tmoHoverMore) {
          this.tmoHoverMore = setTimeout(() => {
            this.showMore();
          }, 500);
        }
        
      } else {
        clearTimeout(this.tmoHoverMore);
        this.tmoHoverMore = null;
      }
      */
      if (!this.moreVisible && !this.tmoHoverMore && document.getElementById('navitm-more')) {
        this.tmoHoverMore = setTimeout(() => {
          this.showMore();
        }, 300);
      }
      
    },
    ondragstop(evt) {

      if(this.dragItem && this.insertAt) {

        // sort
        var list = this.teamsNavItems.slice();
        var i, itm;
        for(i=list.length-1; i>=0; i--) {
          itm = list[i];
          if (this.dragItem.id === itm.id) {
            list.splice(i, 1);
          }
        }
        for(i=list.length-1; i>=0; i--) {
          itm = list[i];
          var idx = -1;
          if (this.insertAt.id === itm.id) {
            if(this.insertAt.loc === 'before') {
              idx = i;
            }else if(this.insertAt.loc === 'after') {
              idx = i+1;
            }

            if (idx >= 0) {
              this.dragItem.inmore = itm.inmore
              if (list[idx] && list[idx].id === 'more') {
                this.dragItem.inmore = true;
              }
              list.splice(idx, 0, this.dragItem);
            }
          }
        }

        if (this.insertAt.id === 'first-sortable') {
          for(i=0; i<list.length; i++) {
            itm = list[i];
            if (itm.id === 'divider') {
              this.dragItem.inmore = false
              list.splice(i+1, 0, this.dragItem);
            }
          }
        }

        this.$store.commit('teamsNavItems', list);
        
      } 
      
      const popmore = document.querySelector(`[name="${this.POPPER_MORE_NAME}"]`)
      if(this.moreVisible && this.dragData.from === 'nav' && !this.$hitTest(popmore, evt.pageX, evt.pageY)){
        // 没有拖拽到 popper 上就关闭 popper
        this.$popper.hideAll();
      }

      this.isDragging = false
      this.dragItem = null
      this.indicatorTop = null;

      clearTimeout(this.tmoHoverMore);
      this.tmoHoverMore = null;

      document.addEventListener('mousemove', this.docmousemovehandler);

    },

    ondragmotionend() {
      this.dragData = null
    },

    docmousemovehandler() {
      this.dragIdx = null;
      document.removeEventListener('mousemove', this.docmousemovehandler);
    },

    // -----------------------------------
    // ------------- DRAG <<<<<<<<<<<<<<<<
    // -----------------------------------
    
    




    onContextmenu(evt, item) {
      if (!item.sortable) {
        return;
      }

      var sortableitems = this.teamsNavItems.reduce(
          (arr, itm) => {
            if (itm.sortable && itm.inmore === item.inmore) {
              arr.push(itm.id);
              return arr;
            }
            return arr;
          },
          []
        );

      const rectBtn = evt.target.getBoundingClientRect();
      const popperOffsets = {
          x: evt.pageX - rectBtn.left,
          y: evt.pageY - rectBtn.bottom,
      };
      const POPPER = 'contextmenu'
      this.$popper.hide(POPPER);
      this.$popper.show(
          menuNavItem,
          {
            isfirst: sortableitems.indexOf(item.id) === 0,
            islast: sortableitems.indexOf(item.id) === sortableitems.length - 1,
            item: item,
          }, // component props
          {
            name: POPPER,
            reference: evt.target,
            transitionEnabled: false,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {
              placement: 'bottom-start',
              modifiers: [
                {
                  name: 'flip',
                  enabled: true,
                },
                {
                  name: 'offset',
                  options: {
                    offset: [popperOffsets.x, popperOffsets.y],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.contextMenuId = item.id },
            closed: () => { this.contextMenuId = null },
          } // popper eventlistener
        );

    },

    showHelp(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.helpVisible) {
        this.$popper.show(
          {
            template: `
              <div class="common-menulist" style="width:220px;">
                <div v-for="(itm, idx) in helpList"
                  :key="idx"
                  :class="{
                    'common-menulist-item': itm.type!=='divider',
                    'divider': itm.type==='divider',
                  }" 
                  @click="close(itm)"
                >
                  <wl-icon v-if="itm.type!=='divider'" :name="itm.icon" size="16" style="margin-right: 8px;" />
                  <div v-if="itm.type!=='divider'" class="lb">
                    <div class="line1">
                      {{itm.label}}
                    </div>
                  </div>

                  <div v-if="itm.type==='divider'" style="border-top:1px solid rgba(255,255,255,.2); margin: 4px 4px;"></div>
                </div>

              </div>
            `,
            props: ['parentRef', 'helpList', 'onSelect'],
            methods: {
              close(itm) {
                this.$popper.hideAll();
                this.onSelect(itm);
              },
            }
          },
          {
            parentRef: this,
            helpList: this.helpList,
            onSelect: () => {

            },
          }, // component props
          {
            reference: this.$refs.helpbutton,
            closeTrigger: 'mouseout',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            options: {
              placement: 'right',
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
            opened: () => { this.helpVisible = true },
            closed: () => { this.helpVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

  }
}
</script>


<style lang="scss">
$margintop: 8px;

.teamnav {
  position: relative;
  width: 64px;;
  height: calc(100% - $margintop * 2);
  margin-top: $margintop;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all .2s ease;
  user-select: none;

  .firstcol-nav-spacer {
    flex-grow: 1;
  }

  &.expanded {
    width: 216px;

    .teamnav-grp-btn, .divider, .insert-indicator {
      width: 192px;
    }
    .badge {
      top: 11px;
      right: 12px;
    }
    .suffix {
      display: flex;
    }
  }

  &:hover {
    .expandler {
      opacity: 1.0;
    }
  }

  .divider {
    position: absolute;
    @include flex;
    width: 40px;
    height: 9px;
    transition: all .2s ease;
  }

  &-grp {
    position: relative;
    transition: all .2s ease;
    transform-origin: 50% 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    flex-grow: 0;

    &.notrans {
      transition: none !important;
    }

    &:hover {
      opacity: 1;
    }

  }

  .logo {
    @include flex(row, flex-start);
    width: 100%;
    padding: 0 8px;
  }

  .expandler {
    position: absolute;
    height: 100%;
    width: 1px;
    right: 0;
    opacity: 0;
    transition: all .2s ease;

    .icobtn {
      position: absolute;
      @include flex;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      background: rgb(0, 0, 0);
      border: 1px solid rgba($color: #FFFFFF, $alpha: 0.4);
      border-radius: 50%;
      transform-origin: 50%;
      top: 50%;
      left: -10px;
      z-index: 99;

      &:hover {
        border: 1px solid rgba($color: #FFFFFF, $alpha: 0.7);
      }
      &:active {
        border: 1px solid rgba($color: #FFFFFF, $alpha: 1.0);
      }
    }
  }

  .insert-indicator{
    opacity: 0;
    position: absolute;
    height: 1px;
    width: 40px;
    box-sizing: border-box;
    border-bottom: 1px solid #64B4FA;
    pointer-events: none;
  }


}


.teamnav-grp-btn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  transition: all .2s ease;
  transition-property: top, width, height;
  flex-shrink: 0;
  transform: translate(0, 0); /* remove drag image background */

  &.green-40 {
    color: $md-green-40;

    .ico path {
      fill: $md-green-40 !important;
      fill-opacity: 1;
    }
    .label {
      opacity: 1;
    }
  }

  &.notrans {
    transition: none !important;
  }
  &.shad {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1), 0px 0px 1px rgba(0, 0, 0, 0.1);
  }
  &.minimize {
    height: 0;
    opacity: 0;
  }
  &.transparent {
    opacity: 0;
  }
  &.disabled {
    pointer-events: none;
    opacity: .5;
  }
  &.noactive {
    .bg {
      opacity: 0 !important;
    }
    .label {
      opacity: .7 !important;
    }
  }

  .bg {
    position: absolute;
    opacity: 0.0;
    height: 40px;
    min-width: 100%;
    top: 50%;
    left: 50%;
    border-radius: 20px;
    transform-origin: 50%;
    transform: translate(-50%, -50%);
    transition: all .2s ease;
    background: rgba(0, 0, 0, 0.3);
    pointer-events: none;

    &.opacity {
      opacity: 1 !important;
    }
  }

  .icon {
    @include flex;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    pointer-events: none;
  }

  .label {
    font-size: 14px;
    opacity: .7;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
    white-space: nowrap;
    pointer-events: none;
  }

  .badge {
    @include flex;
    position: absolute;
    height: 18px;
    min-width: 18px;
    background: #1170CF;
    border-radius: 9px;
    top: 2px;
    right: -4px;
    padding: 0 4px;
    transition: all .2s ease;
    pointer-events: none;

    .lb {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.95);
      margin-top: 1px;
    }
  }

  .suffix {
    @include flex;
    display: none;
    position: absolute;
    height: 18px;
    width: 18px;
    top: 11px;
    right: 12px;
    transition: all .2s ease;
    pointer-events: none;
  }

  .ico path {
    transition: all .2s ease;
    fill: black;
    fill-opacity: 0.7;
  }

  .icoimg {
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    &.miro {
      background-image: url(~@/assets/img/temp_ico_miro.png);
    }
    &.salesforce {
      background-image: url(~@/assets/img/temp_ico_sf.png);
    }
    &.webexgpt {
      background-image: url(~@/assets/img/ai-bot-gpt.svg);
      mix-blend-mode: screen;
    }
  }

  &:hover {
    .bg {
      opacity: .5;
    }

    .ico path {
      fill-opacity: 1;
    }

    .label {
      opacity: .95;
    }
  }

  &:active {
    .bg {
      opacity: 0.7;
    }
    .label {
      opacity: .95;
    }
  }

  &.active {
    .bg {
      opacity: 0.8;
    }
    .label {
      opacity: .95;
    }

    .ico path {
      fill-opacity: 1;
    }

    &:hover {
      .bg {
        opacity: 1.0;
      }
    }
    &:active {
      .bg {
        opacity: 0.8;
      }
    }
  }

}

/* theme ----- dark/hybrid */
.dark, .hybrid {

  .teamnav-grp-btn {
    .bg {
      background: rgba(255, 255, 255, 0.3);
    }

    .ico path {
      fill: white;
    }
  }
}


</style>
