<template>
    <div class='spacefilter'>
      <div class="row1" >
        <div class="left" >
          <div class="dropdown" >
            <span class="lb">Messaging</span>
            <!-- Kate: remove this drop down arrow and its associated popover. It's not part of the phase of work Travis will be showing them and needs to be reworked based on other changes anyway.
            <div class="btn-circle" :class="{active: filter1Visible}" ref="filter1" @click="showFilter1">
              <wl-icon name="arrow-down-filled" size="16" class="ico" />
            </div>
            -->
          </div>
        </div>

        <div v-show="!searchInputEvent.focus && !searchInputEvent.input" class='right' >
          <span 
            class="btn-circle btnfilter" 
            :class="{
              active: filter2Visible,
              round: selectedFilterName === null,
            }"
            ref="btnfilter" 
            title="Filter by"
            @click="showFilter2"
          >
            <span v-if="selectedFilterName" class="lb" >{{selectedFilterName}}</span>
            <wl-icon name="filter-bold" size="16" />
          </span>

          <span 
            class="btn-circle btnplus" 
            :class="{
              active: addVisible,
            }"
            ref="addbtn"
            @click="showAdd"
            >
            <wl-icon name="plus-bold" size="16" />
          </span>

        </div>

      </div>
      <div class="row2" >
        <div v-if="isShowTabs" v-show="!searchInputEvent.focus && !searchInputEvent.input" class='spacefilter-tabs' @mouseleave="leaveTab">
          <div v-show="[0, 1, 2, 3].indexOf(selectedFilterId) > -1" class="spacefilter-tab-active-bg"></div>
          <div v-show="[0, 1, 2, 3].indexOf(selectedFilterId) > -1" class="btn spacefilter-tab0" :class="{active: activeTabId === 0}" @mouseover="hoverTab(0)" @click="selectTab(0)" >
            <span class="lb">All</span>
          </div>
          <div v-show="[0, 1, 2, 3].indexOf(selectedFilterId) > -1" class="btn spacefilter-tab1" :class="{active: activeTabId === 1}" @mouseover="hoverTab(1)" @click="selectTab(1)" >
            <span class="lb">Direct</span>
          </div>
          <div v-show="[0, 1, 2, 3].indexOf(selectedFilterId) > -1" class="btn spacefilter-tab2" :class="{active: activeTabId === 2}" @mouseover="hoverTab(2)" @click="selectTab(2)" >
            <span class="lb">Teams</span>
          </div>
          <div v-show="[0, 1, 2, 3].indexOf(selectedFilterId) > -1" class="btn spacefilter-tab3" :class="{active: activeTabId === 3}" @mouseover="hoverTab(3)" @click="selectTab(3)" >
            <span class="lb">Public</span>
          </div>
        </div>

        

        <div v-if="searchInputEvent.focus || searchInputEvent.input" class='spacefilter-tabs searchfilter-tabs'>
          <div class="spacefilter-tab-active-bg searchfilter-tab-active-bg"></div>
          <div class="btn searchfilter-tab0 active" >
            <span class="lb">Messages</span>
          </div>
          <div class="btn searchfilter-tab1" >
            <span class="lb">Files</span>
          </div>
          <div class="btn searchfilter-tab1" >
            <span class="lb">People</span>
          </div>
          <div class="btn searchfilter-tab2" >
            <span class="lb">Spaces</span>
          </div>
        </div>
      </div>

    </div>
</template>

<script>

import popNewDirectMessage from "./pop-new-direct-message.vue";

export default {
    props:[
       'name',
    ],
    data() {
      return {
        activeTabId: 0,

        selectedFilterId: 0,
        selectedFilterName: null,
        searchInputEvent: {},


        filter1Visible: false,
        filter1List: [
          {
            label: 'Notifications',
            badge: 4,
            type: 'filter',
          },
          {
            label: 'Unread',
            badge: 5,
            type: 'filter',
          },
          {
            label: 'Hidden',
            badge: 1,
            type: 'filter',
          },
          {
            label: 'Drafts',
            badge: 0,
            type: 'filter',
          },

          {
            type: 'divider',
            hidden: 'isShowTabs'
          },
          {
            label: 'Direct',
            type: 'tab',
            id: 1,
            hidden: 'isShowTabs'
          },
          {
            label: 'Teams',
            type: 'tab',
            id: 2,
            hidden: 'isShowTabs'
          },
          {
            label: 'Public',
            type: 'tab',
            id: 3,
            hidden: 'isShowTabs'
          },

          {
            type: 'divider',
          },

          {
            label: 'Show tabs',
            type: 'toggle',
            var: 'isShowTabs',
          },
        ],
        filter1selected: null,
        isShowTabs: true,

        filter2Visible: false,
        filter2List: [
          {
            label: '@mentions to me',
            badge: 0,
            type: 'filter',
          },
          {
            label: '@mentions to all',
            badge: 0,
            type: 'filter',
          },
          {
            label: 'Threads',
            badge: 0,
            type: 'filter',
          },
          {
            label: 'Flags',
            badge: 10,
            type: 'filter',
          },

        ],
        filter2selected: null,


        addVisible: false,
        addList: [
          {
            label: 'New direct message',
            icon: 'chat-group-bold',
          },
          {
            label: 'New space',
            icon: 'chat-bold',
          },
          {
            label: 'New group',
            icon: 'list-menu-bold',
          },
          {
            type: 'divider',
          },
          {
            label: 'Explore public spaces',
            icon: 'people-bold',
          },
          {
            label: 'New team',
            icon: 'webex-teams-new-bold',
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
    },

    mounted(){
      this.selectTab(this.activeTabId);

      this.$eventBus.$on('space-search-changed', (evt) => {
        this.searchInputEvent = evt;
        this.$nextTick(() => {
          this.moveSearchTabBg(0);
        })
      });

    },
    destroyed() {
      this.$eventBus.$off('space-search-changed');
    },
    watch: {

    },
    methods:{
      hoverTab(id) {
        this.moveTabBg(id);
      },
      leaveTab() {
        this.moveTabBg(this.activeTabId);
      },
      selectTab(id) {
        this.activeTabId = id;
        if (this.isShowTabs) {
          this.moveTabBg(id);
        }
        this.$store.commit('spaceListTabId', id);
        this.$store.commit('publicSpaceHomepageVisible', true);
      },
      moveTabBg(id) {
        const rect = document.querySelector(`.spacefilter-tab${id}`).getBoundingClientRect();
        const rect2 = document.querySelector(`.spacefilter-tabs`).getBoundingClientRect();
        document.querySelector(`.spacefilter-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
        document.querySelector(`.spacefilter-tab-active-bg`).style.width = `${rect.width}px`;
      },
      moveSearchTabBg(id) {
        if (this.searchInputEvent.focus) {
          const rect = document.querySelector(`.searchfilter-tab${id}`).getBoundingClientRect();
          const rect2 = document.querySelector(`.searchfilter-tabs`).getBoundingClientRect();
          document.querySelector(`.searchfilter-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
          document.querySelector(`.searchfilter-tab-active-bg`).style.width = `${rect.width}px`;
        } 
      },

      setFilter1(itm) {
        this.filter1selected = itm
        this.$store.commit('spaceListFilter', itm);
      },

      showFilter1(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.filter1Visible) {
          this.$popper.show(
            {
              template: `
                <div class="common-menulist" style="width:280px;">
                  <div v-for="(itm, idx) in filter1List.filter(val => !parentRef[val.hidden])"
                    :key="idx"
                    :class="{
                      'common-menulist-item': itm.type!=='divider',
                      'divider': itm.type==='divider',
                    }" 
                    @click="close(itm)"
                  >
                    <div v-if="itm.type!=='divider'" class="lb">
                      <div class="line1">
                        {{itm.label}}
                        <span v-if="itm.badge > 0">&nbsp;({{itm.badge}})</span>
                        </div>
                      <div v-if="itm.sub" class="line2">{{itm.sub}}</div>
                    </div>
                    <svg 
                      v-if="(filter1selected && filter1selected.label === itm.label) ||
                      (itm.type === 'tab' && activeTabId === itm.id) ||
                      (itm.type==='toggle' && parentRef[itm.var])"
                      style="margin-right: 12px;" 
                      width="14" 
                      height="9" 
                      viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                    </svg>

                    <div v-if="itm.type==='divider'" style="border-top:1px solid rgba(255,255,255,.2); margin: 4px 4px;"></div>
                  </div>

                </div>
              `,
              props: ['parentRef', 'filter1List', 'filter1selected', 'activeTabId', 'onSelect'],
              methods: {
                close(itm) {
                  this.$popper.hideAll();
                  this.onSelect(itm);
                },
              }
            },
            {
              parentRef: this,
              filter1List: this.filter1List,
              filter1selected: this.filter1selected,
              activeTabId: this.activeTabId,
              onSelect: (itm) => {
                if(itm.type==='filter'){
                  if (this.filter1selected !== itm) {
                    this.filter1selected = itm
                    if (!this.isShowTabs) {
                      this.selectTab(0);
                    }
                  } else {
                    this.filter1selected = null
                  }
                } else if(itm.type==='tab'){
                  if (this.activeTabId !== itm.id) {
                    this.selectTab(itm.id);
                    if (!this.isShowTabs) {
                      this.filter1selected = null
                    }
                  } else {
                    this.selectTab(0);
                  }
                } else if(itm.type==='toggle'){
                  this[itm.var] = !this[itm.var]
                }
              },
            }, // component props
            {
              reference: this.$refs.filter1,
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
              opened: () => {this.filter1Visible = true},
              closed: () => {this.filter1Visible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      showFilter2(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.filter2Visible) {
          this.$popper.show(
            {
              template: `
                <div class="common-menulist" style="width:280px;">
                  <div v-for="(itm, idx) in filter2List.filter(val => !parentRef[val.hidden])"
                    :key="idx"
                    :class="{
                      'common-menulist-item': itm.type!=='divider',
                      'divider': itm.type==='divider',
                    }" 
                    @click="close(itm)"
                  >
                    <div v-if="itm.type!=='divider'" class="lb">
                      <div class="line1">
                        {{itm.label}}
                        <span v-if="itm.badge > 0">&nbsp;({{itm.badge}})</span>
                      </div>
                      <div v-if="itm.sub" class="line2">{{itm.sub}}</div>
                    </div>
                    <svg 
                      v-if="(filter2selected && filter2selected.label === itm.label) ||
                      (itm.type==='toggle' && parentRef[itm.var])"
                      style="margin-right: 12px;" 
                      width="14" 
                      height="9" 
                      viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                    </svg>

                    <div v-if="itm.type==='divider'" style="border-top:1px solid rgba(255,255,255,.2); margin: 4px 4px;"></div>
                  </div>

                </div>
              `,
              props: ['parentRef', 'filter2List', 'filter2selected', 'onSelect'],
              methods: {
                close(itm) {
                  this.$popper.hideAll();
                  this.onSelect(itm);
                },
              }
            },
            {
              parentRef: this,
              filter2List: this.filter2List,
              filter2selected: this.filter2selected,
              onSelect: (itm) => {
                if(itm.type==='filter'){
                  if (this.filter2selected !== itm) {
                    this.filter2selected = itm
                  } else {
                    this.filter2selected = null
                  }
                } else if(itm.type==='toggle'){
                  this[itm.var] = !this[itm.var]
                }
              },
            }, // component props
            {
              reference: this.$refs.btnfilter,
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
              opened: () => {this.filter2Visible = true},
              closed: () => {this.filter2Visible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      showAdd(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.addVisible) {
          this.$popper.show(
            {
              template: `
                <div class="common-menulist" style="width:220px;">
                  <div v-for="(itm, idx) in addList"
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
              props: ['parentRef', 'addList', 'onSelect'],
              methods: {
                close(itm) {
                  this.$popper.hideAll();
                  this.onSelect(itm);
                },
              }
            },
            {
              parentRef: this,
              addList: this.addList,
              onSelect: (itm) => {
                if (itm.label === 'New direct message') {
                    this.showNewDirectMessage()
                }
              },
            }, // component props
            {
              reference: this.$refs.addbtn,
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
              opened: () => {this.addVisible = true},
              closed: () => {this.addVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      changeFilter(idx, name) {
        this.selectedFilterId = idx;
        if (idx !== 0) {
          this.selectedFilterName = name;
        } else {
          this.selectedFilterName = null
        }
        this.$eventBus.$emit('space-filter-changed', {
          isEmpty: idx !== 0,
          filterId: idx,
          filterName: name,
        });
      },

      showNewDirectMessage() {
        this.$modal.show(
          popNewDirectMessage,
          {
            peoplename: name,

          }, // component props
          {
            name: 'new-direct-message',
            clickToClose: false,
            frameless: false,
            shadow: true,
            resizable: false,
            resizeEdges: ['br', 'b', 'r'],
            draggable: '#pop-new-direct-message .head',
            roundedCorner: false,
            overlayVisible: true,
            overlayTransparent: 0,
            theme: this.theme,
            width: 780,
            height: 708,
            transition: true,
          }, // modal props
          {} // modal eventlistener
        );
      },

    }
}
</script>


<style lang="scss">
.spacefilter {
  @include flex(column);
  width: calc(100% - 32px);
  user-select: none;
  margin: 16px 16px 4px 16px;
  box-sizing: border-box;

  .row1 {
    @include flex;
    width: 100%;
    margin-bottom: 8px;

    .left {
      @include flex(row, space-between);
      flex-grow: 1;

      .dropdown {
        @include flex;

        .lb {
          font-size: 20px;
          opacity: .95;
          margin-right: 4px;
        }
      }
    }
  }
  .row2 {
    @include flex;
    width: 100%;
  }

  .spacefilter-tabs {
    position: relative;
    width: 48px;
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    flex-grow: 1;

    .spacefilter-tab-active-bg {
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: 14px;
      transition: all 0.2s ease;
      background-color: rgba($color: #000000, $alpha: .2);
    }

    .btn {
      height: 28px;
      border-radius: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 8px;

      .lb {
        padding: 0 10px;
        font-size: 14px;
        opacity: 0.7;
        transition: all 0.3s ease;
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
    }
  }

  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btnfilter {
      padding: 0 10px;

      &.round {
        width: 28px;
        padding: 0;
      }

      .lb {
        margin-right: 8px;
        font-size: 12px;
      }

    }

    .btnplus {
      margin-left: 4px;
    }
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
      background-color: rgba($color: black, $alpha: 0.07);
    }
    &:active, &.active {
      background-color: rgba($color: black, $alpha: 0.1);
    }
  }

}

/* theme ----- dark/hybrid */

.dark, .hybrid {
  .spacefilter {

    .spacefilter-tabs {

      .spacefilter-tab-active-bg {
        background-color: rgba($color: white, $alpha: .2);
      }
    }
  }

  .btn-circle {
    &:hover {
      background-color: rgba($color: white, $alpha: 0.07);
    }
    &:active, &.active {
      background-color: rgba($color: white, $alpha: 0.1);
    }
  }
}

</style>
