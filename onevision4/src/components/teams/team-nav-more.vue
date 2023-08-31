<template>
  <div
  id="team-nav-more"
  :class="[theme]"
  >
    <wl-scrollbar 
      class="cont-wrap"
      ref="scrollarea"
      :class="{visible: scrollvisible}"
      :theme="theme === 'dark' ? 'dark' : 'light'"
      :arrowVisible="$store.state.os==='win'"
      :alwaysVisible="true"
      @heightChanged="handleHeightChange"
    >
      <div 
        class='scrollcont' 
        ref="itemlist" 
        :style="{
          height: `${menuItemsHeight}px`,
          marginRight: `${scrollvisible ? 20 : 8}px`,
        }"
      >
        <div
          v-for="(itm, idx) in teamsNavItemsFiltered"
          :key="`navitm-${itm.id}`"
          :id="`navitm-${itm.id}`"
          :class="[
              (itm.id !== 'divider-in-more' && itm.id !== 'fte-in-more' ? 'teamnav-more-btn' : ''), 
              (itm.id === 'divider-in-more' ? 'divider absolute' : ''), 
              (itm.id === 'fte-in-more' ? 'fte' : ''), 
              {
                active: contextMenuId == itm.id || teamsNav === itm.id,
                disabled: !itm.sortable && isDragging && itm.id !== 'divider-in-more' && itm.id !== 'fte-in-more',
                noactive: itm.sortable && isDragging && dragItem && itm.id !== dragItem.id || idx === dragIdx,
                minimize: dragItem && itm.id === dragItem.id,
                transparent: dragData && dragData.element && itm.id === dragData.item.id,
              }
            ]"
          :style="{
            top: `${itm.top}px`
          }"
          @mousedown="onMousedown($event, itm, idx)"
          @contextmenu.prevent="onContextmenu($event, itm)"
          @click="itm.id !== 'divider-in-more' && itm.id !== 'fte-in-more' ? changeNav(itm.id) : null" 
        >
          <div v-if="itm.id !== 'divider-in-more' && itm.id !== 'fte-in-more'" class="bg"></div>
          <div v-if="itm.id !== 'divider-in-more' && itm.id !== 'fte-in-more'" class="icon" v-html="itm.icon"></div>
          <span v-if="itm.id !== 'divider-in-more' && itm.id !== 'fte-in-more'" class="label">{{itm.label}}</span>
          <div v-if="itm.id !== 'divider-in-more' && itm.id !== 'fte-in-more' && itm.badge" class="badge"><span class="lb">{{itm.badge}}</span></div>
          <div v-if="itm.id !== 'divider-in-more' && itm.id !== 'fte-in-more' && itm.suffix" class="suffix" v-html="itm.suffix"></div>
          <div v-if="itm.id === 'divider-in-more'" class="line"></div>
          <div v-if="itm.id === 'fte-in-more'" class="lb">To unpin a tab from the sidebar, drag and drop it here.</div>
        </div>

        <div class="insert-indicator" :style="{top: indicatorTop, opacity: indicatorTop ? 1 : 0}"></div>

      </div>
    </wl-scrollbar>
    <div class="divider marginv" ><div class="line" ></div></div>
    <div class="btn-manage" >Manage sidebar</div>
  </div>
</template>

<script>
import menuNavItem from './menu-nav-item.vue';
import _ from 'lodash';
import mframe from 'mframe'

export default {
  props:[
    'name',
    'data', // dragData from team-nav.vue
  ],
  data() {
    return {
      ITEM_HEIGHT: 40,
      ITEM_DIVIDER: 9,
      ITEM_FTE: 60,
      menuItemsHeight: 0,

      contextMenuId: null,

      dragData: this.data,
      dragItem: this.data ? this.data.item : null,
      isDragging: this.data !== null,
      insertAt: null,
      indicatorTop: null,
      dragIdx: null,

      autoScrolling: null,
      scrollvisible: false,

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
    teamsNavLayout() {
      return this.$store.state.teamsNavLayout;
    },
    teamsNav() {
      return this.$store.state.teamsNav;
    },
    teamsNavItemIsReordering() {
      return this.$store.state.teamsNavItemIsReordering;
    },
    teamsNavVisibleNum() {
      let diff = this.teamsNavItemIsReordering ? 1 : 0
      return this.$store.state.teamsNavVisibleNum - diff;
    },
    teamsNavItems() {
      return this.$store.state.teamsNavItems;
    },
    teamsNavItemsFiltered() {
      var cntInNav = 0;
      var idx = 0;
      var items = this.teamsNavItems.filter(
          itm => {
            var valid = false;
            let visibleNum = this.teamsNavVisibleNum
            
            if (itm.layouts.indexOf(this.teamsNavLayout) >= 0 && itm.sortable && !itm.inmore && (!this.dragItem || this.dragItem && itm.id !== this.dragItem.id)) {
              cntInNav++;
            }
            if (itm.layouts.indexOf(this.teamsNavLayout) >= 0 && itm.sortable && (!this.dragItem || itm.id !== this.dragItem.id) && (itm.inmore || cntInNav > visibleNum)) {
              valid = true;
            }
            if (!itm.inmore && cntInNav > visibleNum && (!this.dragItem || itm.id !== this.dragItem.id)) {
              idx++;
            }
            return valid
          }
        );
      const divider = {
          id: 'divider-in-more',
          sortable: false,
          inmore: true,
        };
      const fte = {
          id: 'fte-in-more',
          sortable: false,
          inmore: true,
        };
      if (idx > 0) {
        items.splice(idx, 0, divider, fte);
      } else {
        items.splice(idx, 0, fte);
      }
      this.setItemPosition(items);

      return items;
    },


  },
  mounted() {
    this.$eventBus.$on('ondragstart', this.ondragstart);
    this.$eventBus.$on('ondragging', this.ondragging);
    this.$eventBus.$on('ondragstop', this.ondragstop);
    this.$eventBus.$on('ondragmotionend', this.ondragmotionend);
    this.$nextTick(() => {
      this.updateScrollbar()
    });
  },
  destroyed() {
    this.$eventBus.$off('ondragstart', this.ondragstart);
    this.$eventBus.$off('ondragging', this.ondragging);
    this.$eventBus.$off('ondragstop', this.ondragstop);
    this.$eventBus.$off('ondragmotionend', this.ondragmotionend);
  },
  watch: {
    teamsNavItemsFiltered(val) {
      if (val.length === 0 && !this.isDragging) {
        this.$popper.hide(this.name)
      }

      if (this.dragData && this.dragData.element && !this.dragData.mframe && !this.isDragging) {
        let item = val.find(
          itm => itm.id === this.dragData.item.id
        );

        if (item) {
          // drop to more menu
          const lstrect = this.$refs.itemlist.getBoundingClientRect();
          const fromtop = this.dragData.element.style.top
          const fromleft = this.dragData.element.style.left

          let fromwidth = this.dragData.element.style.width
          let width = `${lstrect.width}px`
          
          const top = `${lstrect.top + item.top}px`;
          const left = `${lstrect.left}px`

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

        } else if (this.dragData && this.dragData.from === 'more') {
          // drop to nav conlumn
          // do it in team-nav.vue
        }

      }

      setTimeout(() => {
        this.updateScrollbar()
      },100)
    },
  },
  methods: {
    updateScrollbar() {
      if (this.$refs.scrollarea) {
        this.$refs.scrollarea.update()
      }
    },
    random(l, h) {
      return _.random(l, h);
    },

    changeNav(nav) {
      this.$store.commit('teamsNav', nav);
      this.close();
    },

    close() {
      this.$emit("close");
    },

    setItemPosition(items) {
      var top = 0;
      var len = items.length
      for(var i=0; i<len; i++) {
        let itm = items[i]
        itm.top = top
        var skip = this.dragItem && itm.id === this.dragItem.id
        if (!skip) {
          if (itm.id === 'divider-in-more') {
            top += this.ITEM_DIVIDER
          } else if (itm.id === 'fte-in-more') {
            top += this.ITEM_FTE
            if (i < len-1) {
              top += 4 // FTE margin-bottom 4px
            }
          } else {
            top += this.ITEM_HEIGHT
          }
        }
      }
      this.menuItemsHeight = top;
    },

    isOverflowed(id) {
      var cnt = 0;
      var overflowed = false;
      _.forEach(
        this.teamsNavItems,
        itm => {
          if (itm.layouts.indexOf(this.teamsNavLayout) >= 0 && itm.sortable && !itm.inmore) {
            cnt++;
          }
          if (cnt > this.teamsNavVisibleNum && itm.id === id) {
            overflowed = true;
          }
        }
      );

      return overflowed;
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
        from: 'more',
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
      this.$eventBus.$emit('ondragstart', this.dragData);

      //
      const lstrect = this.$refs.itemlist.getBoundingClientRect();
      const container =  document.getElementById('desktop');
      const div = document.createElement('div');
      div.className = 'teamnav-more-btn active notrans shad';
      div.style.width = `${lstrect.width}px`
      div.style.position = `absolute`

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
      this.$eventBus.$emit('ondragstop', evt);
    },
    setTargetPosition(evt) {
      const left = evt.pageX - this.dragData.offsetX
      const top = evt.pageY - this.dragData.offsetY
      this.dragData.element.style.left = `${left}px`
      this.dragData.element.style.top = `${top}px`
    },


    // ----------- listeners ------------

    ondragstart() {
      this.isDragging = true

      if (this.teamsNavItemsFiltered.length <= 2) {
        // 调整 layout
        let itvid = setInterval(() => {
          this.$popper.update(this.name)
        }, 0)

        setTimeout(() => {
          clearInterval(itvid)
        }, 300)
      }
      
      
    },
    ondragging(evt, item, idx) {
      if (!this.dragItem) {
        this.dragItem = item
        this.dragIdx = idx
      }
      //
      const lstrect = this.$refs.itemlist.getBoundingClientRect();
      const p = {
        x: evt.pageX,
        y: evt.pageY,
      }
      if (p.x === 0 && p.y === 0) {
        return // 不处理拖动最后一刻X和Y都为0的情形
      }
      var inmoreitems = this.teamsNavItemsFiltered.filter(m => m.inmore && m.sortable);
      var iidx;
      const len = this.teamsNavItemsFiltered.length;
      for(var i=0; i<len; i++){
        var itm = this.teamsNavItemsFiltered[i];
        if ((itm.sortable || itm.id === 'fte-in-more') && itm.id !== this.dragItem.id) {
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

            if (itm.id !== 'fte-in-more') {
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
                  loc: 'after',
                }
                this.indicatorTop = `${rect2.bottom - lstrect.top}px`
                break;
              }
            } else if (itm.id === 'fte-in-more') {
              rect.top = obj.top + obj.height/2
              if (inmoreitems.length === 0) {
                rect.bottom = obj.bottom + obj.height/2
              }
              if (this.$pointInRect(p, rect)) {
                iidx = {
                  id: 'first-inmore',
                  loc: 'after',
                }
                this.indicatorTop = `${obj.bottom - lstrect.top}px`
              }
            }
            
          }
          
        }
      }

      if (!iidx) {
        this.indicatorTop = null;
      }

      this.insertAt = iidx;

      // 在 scrollarea 顶部/底部时自动滚动
      var scrollrect = this.$refs.scrollarea.$el.getBoundingClientRect()
      const h = 20
      var recttop = {
        width: scrollrect.width,
        height: h,
        left: scrollrect.left,
        top: scrollrect.top,
        right: scrollrect.right,
        bottom: scrollrect.top + h,
      };
      var rectbot = {
        width: scrollrect.width,
        height: h,
        left: scrollrect.left,
        top: scrollrect.bottom - h,
        right: scrollrect.right,
        bottom: scrollrect.bottom,
      };

      if (this.$pointInRect(p, recttop)) {
        this.scrollUp()
      } else if (this.$pointInRect(p, rectbot)) {
        this.scrollDown();
      } else if (this.autoScrolling) {
        clearInterval(this.autoScrolling)
        this.autoScrolling = null
      }

    },
    scrollUp() {
      if (this.autoScrolling) {
        return
      }
      this.autoScrolling = setInterval(() => {
        this.$refs.scrollarea.scrollUp(10);
      }, 200)
    },
    scrollDown() {
      if (this.autoScrolling) {
        return
      }
      this.autoScrolling = setInterval(() => {
        this.$refs.scrollarea.scrollDown(10);
      }, 200)
    },
    ondragstop() {
      if (this.autoScrolling) {
        clearInterval(this.autoScrolling)
        this.autoScrolling = null
      }

      if(this.dragItem && this.insertAt) {
        // sort
        var list = this.teamsNavItems.filter(
          itm => itm.layouts.indexOf(this.teamsNavLayout) >= 0
        );

        var i, itm;
        for(i=list.length-1; i>=0; i--) {
          itm = list[i];
          if (this.dragItem.id === itm.id) {
            list.splice(i, 1);
          }
        }
        for(i=list.length-1; i>=0; i--) {
          itm = list[i];
          let idx = -1;
          if (this.insertAt.id === itm.id) {
            if(this.insertAt.loc === 'before') {
              idx = i;
            }else if(this.insertAt.loc === 'after') {
              idx = i+1;
            }
            if (idx >= 0) {
              this.dragItem.inmore = itm.inmore
              list.splice(idx, 0, this.dragItem);
            }
          }
        }

        if (this.insertAt.id === 'first-inmore') {
          let idx = -1;
          for(i=0; i<list.length; i++) {
            itm = list[i];
            if (itm.inmore) {
              idx = i
              break
            }
          }
          this.dragItem.inmore = true
          if (idx > -1) {
            list.splice(idx, 0, this.dragItem);
          } else {
            list.push(this.dragItem);
          }
        }

        this.$store.commit('teamsNavItems', list);
        
      }
      this.isDragging = false
      this.dragItem = null
      this.indicatorTop = null;


      // 调整 layout
      let itvid = setInterval(() => {
        this.$popper.update(this.name)
      }, 0)

      setTimeout(() => {
        clearInterval(itvid)
      }, 300)


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

    handleHeightChange(evt) {
      this.scrollvisible = evt.height < 100
    },
    

    onContextmenu(evt, item) {
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

      this.$popper.show(
          menuNavItem,
          {
            isfirst: sortableitems.indexOf(item.id) === 0,
            islast: sortableitems.indexOf(item.id) === sortableitems.length - 1,
            item: item,
            shouldAdjustPosition: () => {
              let itvid = setInterval(() => {
                this.$popper.update(this.name)
              }, 0)

              setTimeout(() => {
                clearInterval(itvid)
              }, 300)
            },
          }, // component props
          {
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
                  enabled: false,
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

  }
};
</script>

<style lang="scss">
  #team-nav-more {
    display: flex;
    flex-direction: column;
    width: 296px;
    min-height: 40px; /** only 1 item  */
    pointer-events: auto;
    margin: 8px 0;
    transition: all .2s ease;

    .cont-wrap {
      max-height: 354px;
      width: 100%;
      display: flex;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;

      &.visible {
        width: calc(100% - 4px);
        margin-right: 4px;
      }

      .scrollcont {
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 0 8px;
        margin-bottom: 1px;
        transition: all .2s ease;
      }
    }

    .divider{
      @include flex;
      width: 100%;
      height: 9px;
      transition: all .2s ease;

      &.absolute {
        position: absolute;
      }
      &.marginv {
        margin: 0 8px;
        width: calc(100% - 16px);
      }

      .line {
        width: 100%;
        border-bottom: 1px solid rgba($color: #FFF, $alpha: .4);
      }
    }
    .fte{
      @include flex;
      position: absolute;
      width: 100%;
      height: 60px;
      padding: 0 10px;
      transition: all .2s ease;
      background: rgba(255, 255, 255, 0.11);
      border-radius: 8px;
      user-select: none;

      .lb {
        font-size: 14px;
        line-height: 22px;
        opacity: .7;
      }
    }

    .insert-indicator{
      opacity: 0;
      position: absolute;
      height: 1px;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #64B4FA;
      pointer-events: none;
    }

    .btn-manage {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      border-radius: 20px;
      transition: all .2s ease;
      background: rgba(255, 255, 255, 0.0);
      user-select: none;
      font-size: 14px;
      font-weight: 600;
      margin: 4px 8px 0 8px;

      &:hover {
        background: rgba(255, 255, 255, 0.11);
      }

      &:active {
        background: rgba(255, 255, 255, 0.2);
      }
    }


    /* ------------------ drak ------------------ */

    &.hybrid {
      color: $text-color-primary-light-ui;
    }
    &.dark {
      color: $text-color-primary-dark-ui;
    }

  }

  .teamnav-more-btn {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 40px;
    border-radius: 20px;
    transition: all .2s ease;
    transition-property: top, width, height;
    flex-shrink: 0;
    user-select: none;
    transform: translate(0, 0); /* remove drag image background */

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

    .bg {
      position: absolute;
      opacity: 0.0;
      height: 40px;
      border-radius: 20px;
      min-width: 100%;
      top: 50%;
      left: 50%;
      transform-origin: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.3);
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
      top: 11px;
      right: 12px;
      padding: 0 4px;
      transition: all 0.3s ease;
      pointer-events: none;

      .lb {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.95);
        margin-top: 1px;
      }
    }

    .suffix {
      @include flex;
      position: absolute;
      height: 18px;
      width: 18px;
      top: 11px;
      right: 12px;
      transition: all .2s ease;
      pointer-events: none;
    }

    .ico path {
      transition: all 0.3s ease;
      fill: white;
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

</style>
