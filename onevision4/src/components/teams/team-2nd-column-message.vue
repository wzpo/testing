<template>
  <fragment>
    <div v-if="spaceListTabId === 3" class="teams-2nd-messaging-toolbar">
      <md-button class="btn md-button-outline btn-public" aria-label="x" :size="28" @click="showPublicSpaceHomepage" >
        <wl-icon
          name="people-bold" 
          :color=" theme === 'dark' ? 'white-95' : 'black-95' "
          size="16"
          class="ico"
        />
        Explore public spaces
      </md-button>
    </div>
    <wl-scrollbar 
      class="teams-2nd-messaging" 
      :class="[{compact: spaceListCompactView}]"
      :alwaysVisible="false"
      :arrowVisible="$store.state.os==='win'"
      :theme="theme === 'light' ? 'light' : 'dark'"
      ref="scrollbar"
    >
      <div v-if="[0,1,3].indexOf(spaceListTabId) > -1 && !filterResultIsEmpty && !searchInputEvent.focus && !searchInputEvent.input" class="teams-2nd-messaging-list" @mouseleave="leaveItems">
        <div class="spacelist-active-bg" :class="{trans: transEnabled}" ></div>

        <space-people-item
          v-if="!isFTE && spaceListTabId === 0"
          id="obtp-01"
          :name="'Office Hours'"
          :isgroup="true"
          :subline="'Renergize'"
          :avatarBackgroundColor="'#416116'"
          :teamColor="{
              light: '#93C437',
              dark: '#93C437',
            }"
          :compact="spaceListCompactView"
          color="#FFFFFF"
          :obtp="{
            label: 'Now',
          }"
          :buttonsCallback="{
            obtp: () => {
              meet('Office Hours', true)
            }
          }"
          @hover="hoverItem"
        />

        <space-people-item
          v-if="!isFTE && spaceListTabId === 0"
          id="obtp-02"
          :name="'All-Hands'"
          :isgroup="true"
          :subline="'Renergize'"
          :avatarBackgroundColor="'#416116'"
          :teamColor="{
              light: '#93C437',
              dark: '#93C437',
            }"
          :compact="spaceListCompactView"
          color="#FFFFFF"
          :obtp="{
            seconds: '02:40',
            joined: 132,
          }"
          :buttonsCallback="{
            obtp: () => {
              meet('All-Hands', false, true)
            }
          }"
          @hover="hoverItem"
        />

        <space-people-item
          v-if="isFTE"
          :id="`${personalSpace.id}`"
          :name="personalSpace.name"
          :avatar="personalSpace.avatar"
          :avatarText="personalSpace.avatarText"
          :isgroup="personalSpace.isSpace"
          :unread="personalSpace.unread"
          :status="personalSpace.status"
          :subline="personalSpace.team"
          :alertMuted="personalSpace.alertMuted"
          :mention="personalSpace.mention"
          :active="(activeSpaceId === personalSpace.id && !isTwoColumnsMode) || (isTwoColumnsMode && activePopoutSpaceFocusId === personalSpace.id)"
          :avatarBackgroundColor="personalSpace.isSpace ? personalSpace.avatarBackgroundColor : '#545454'"
          :teamColor="personalSpace.teamColor"
          :fontWeight="600"
          :compact="spaceListCompactView"
          color="#FFFFFF"
          @hover="hoverItem"
          @select="selectItem"
          @click.native="clickAndPopoutItem(personalSpace.id)"
          @dblclick.native="clickAndPopoutItem(personalSpace.id, true)"
        />

        <wl-accordion 
          v-for="(grp, idx) in groupNamesFiltered"
          :key="`space-grp-${grp.id}-${idx}`"
          :showBottomBorder="false" 
          :defaultCollapsed="groupCollapsed[grp.name]" 
          iconLocation="before" 
          arrowCollapsed="arrow-right-bold"
          arrowExpanded="arrow-down-bold"
          headerClass="teams-2nd-messaging-list-title"
          @collapse="collapseHandlder(grp.name, $event)"
        >
          <span slot="header" class="teams-2nd-messaging-list-title-header" >
            <div class="l" :class="{bold: groupCollapsed[grp.name] && hasUnread(grp.name)}">
              {{grp.name}}
              <span v-if="groupCollapsed[grp.name]" class="cnt">({{spaceList[idx].length}})</span>
            </div>
            <wl-icon v-if="grp.id === 0" name="favorite-filled" size="14" color="#F2990A" />
            <span class="spacer"></span>
            <wl-icon v-if="groupCollapsed[grp.name] && hasUnread(grp.name)" name="unread-filled" size="14" class="dot" />

          </span>

          <space-people-item
            v-for="(p, idx2) in spaceList[grp.id].filter(
              itm => {
                if (spaceListTabId === 0) {
                  return true
                } else if (spaceListTabId === 1) {
                  // direct
                  return !itm.isSpace
                } else if (spaceListTabId === 3) {
                  // public
                  return  itm.isPublic
                }
              }
            )"
            :key="`space-list1-item-${spaceListTabId}-${idx2}`"
            :id="`${p.id}`"
            :name="p.name"
            :avatar="p.avatar"
            :isgroup="p.isSpace"
            :unread="p.unread"
            :status="p.status"
            :subline="p.team"
            :alertMuted="p.alertMuted"
            :mention="p.mention"
            :active="(activeSpaceId === p.id && !isTwoColumnsMode) || (isTwoColumnsMode && activePopoutSpaceFocusId === p.id)"
            :avatarBackgroundColor="p.isSpace ? p.avatarBackgroundColor : '#545454'"
            :teamColor="p.teamColor"
            :fontWeight="600"
            :compact="spaceListCompactView"
            color="#FFFFFF"
            @hover="hoverItem"
            @select="selectItem"
            @click.native="clickAndPopoutItem(p.id)"
            @dblclick.native="clickAndPopoutItem(p.id, true)"
          />
        </wl-accordion>

      </div>

      <!-- teams >>>>>> -->
      <div v-if="[2].indexOf(spaceListTabId) > -1 && !filterResultIsEmpty && !searchInputEvent.focus && !searchInputEvent.input" class="teams-2nd-messaging-list" >
        <wl-accordion 
          v-for="(grp, idx) in teams"
          :key="`team-grp-${grp}-${idx}`"
          :id="`${grp.name.replace(/ /g, '_')}`"
          ref="teamAccordion"
          :showBottomBorder="false" 
          :defaultCollapsed="true" 
          iconLocation="before" 
          arrowCollapsed="arrow-right-bold"
          arrowExpanded="arrow-down-bold"
          :headerClass="`teams-2nd-messaging-team-title ${activeTeamItem.name === grp.name ? 'active' : ''}`"
          @collapse="selectTeamItem($event, grp)"
        >
          <span slot="header" class="teams-2nd-messaging-team-title-header" >
            <span class="color" :style="{backgroundColor: grp.color}"></span>
            <span class="name" :class="{unread: grp.unread}">{{grp.name}}</span>
          </span>

          <div class="teams-2nd-messaging-team-spacelist">
            <space-people-item
              v-for="(p, idx1) in teamspaces"
              :key="`team-space1-item-${idx1}`"
              :id="`${p.name.replace(/ /g, '_')}`"
              :name="p.name"
              :isgroup="true"
              :unread="p.unread && grp.unread"
              :alertMuted="p.alertMuted"
              :mention="p.mention"
              :avatarBackgroundColor="grp.color2"
              :compact="spaceListCompactView"
              color="#FFFFFF"
              :showHoverStyle="true"
            />


            <wl-accordion 
              :showBottomBorder="false" 
              :defaultCollapsed="false" 
              iconLocation="before" 
              arrowCollapsed="arrow-right-bold"
              arrowExpanded="arrow-down-bold"
              headerClass="teams-2nd-messaging-team-title2"
            >
              <span slot="header" class="teams-2nd-messaging-team-title2-header" >
                <span class="name" >Unjoined space(s)</span>
                <span class="num" >{{teamspaces2.length}}</span>
              </span>

              <space-people-item
                v-for="(p, idx1) in teamspaces2"
                :key="`team-space2-item-${idx1}`"
                :id="`${p.name.replace(/ /g, '_')}`"
                :name="p.name"
                :isgroup="true"
                :unread="p.unread && grp.unread"
                :alertMuted="p.alertMuted"
                :mention="p.mention"
                :avatarBackgroundColor="grp.color2"
                :compact="spaceListCompactView"
                color="#FFFFFF"
                :showHoverStyle="true"
              />

            </wl-accordion>


            <wl-accordion 
              :showBottomBorder="false" 
              :defaultCollapsed="false" 
              iconLocation="before" 
              arrowCollapsed="arrow-right-bold"
              arrowExpanded="arrow-down-bold"
              headerClass="teams-2nd-messaging-team-title2"
            >
              <span slot="header" class="teams-2nd-messaging-team-title2-header" >
                <span class="name" >Archived space(s)</span>
                <span class="num" >{{teamspaces3.length}}</span>
              </span>

              <space-people-item
                v-for="(p, idx1) in teamspaces3"
                :key="`team-space2-item-${idx1}`"
                :id="`${p.name.replace(/ /g, '_')}`"
                :name="p.name"
                :isgroup="true"
                :unread="p.unread && grp.unread"
                :alertMuted="p.alertMuted"
                :mention="p.mention"
                :avatarBackgroundColor="grp.color2"
                :compact="spaceListCompactView"
                color="#FFFFFF"
                :showHoverStyle="true"
              />

            </wl-accordion>

          </div>


        </wl-accordion>
      </div>
      <!-- teams <<<<<< -->

      <div v-show="!filterResultIsEmpty" class="teams-2nd-messaging-scrollbar"></div>

      <div v-if="isFTE" class="empty">
        <div class="img fte"></div>
        <div class="title">All conversations</div>
        <div class="des">Find and manage all your conversations here. Use Spaces for group discussions and Direct messages to chat one-on-one.</div>
      </div>

      <div v-if="filterResultIsEmpty && (!searchInputEvent.focus && !searchInputEvent.input)" class="empty">
        <div class="img"></div>
        <div class="title">{{filterName}}</div>
        <div class="des">{{emptyword[filterId]}}</div>
      </div>

      <div v-if="searchInputEvent.focus && !searchInputEvent.input" class="empty epmty-earch">
        <div class="img"></div>
        <div class="title">What can we help you find?</div>
        <div class="des">You can search here for people, spaces, files and messages. Type what you're looking for and choose where you want us to look.</div>
      </div>

      <div v-if="searchInputEvent.input" class="empty epmty-earch-no">
        <div class="img"></div>
        <div class="des">We can't find any messages that match your search.</div>
      </div>

    </wl-scrollbar>
  </fragment>
</template>

<script>

import _ from 'lodash'
import teamSpace from './team-space.vue';

export default {
    props:[
        'name',
    ],
    data() {
        return {
          groupNames: [
            {
              name: 'Favorites',
              id: 0,
            },
            {
              name: 'Admin',
              id: 1,
            },
            {
              name: 'Equipment design',
              id: 2,
            },
            {
              name: 'Other',
              id: 3,
            },
          ],
          groupCollapsed: {
            'Favorites': false,
            'Admin': true,
            'Equipment design': true,
            'Other': false,
          },
          transEnabled: false,
          filterName: null,
          filterId: 0,
          filterResultIsEmpty: false,
          searchInputEvent: {},
          emptyword: [
            '',
            `Find your notifications here. You get a notification for earch new message you receive. You're all caught up for now. Enjoy.`,
            `Find all of your unread messages here. Event if you turn notification off for space. It's peaceful here. Take a moment.`,
            `Find all of your hidden spaces here. Hidden spaces no longer show in your spaces list. Right click a space to hide it.`,
            `Find all of your unread messages here. Event if you turn notification off for space. It's peaceful here. Take a moment.`,
            `Find all of your unread messages here. Event if you turn notification off for space. It's peaceful here. Take a moment.`,
            `Find all of your unread messages here. Event if you turn notification off for space. It's peaceful here. Take a moment.`,
            `Find all of your unread messages here. Event if you turn notification off for space. It's peaceful here. Take a moment.`,
          ],
          teams: [
            {
              name: 'Marketing',
              color: '#F0677E',
              color2: '#A12A3A',
            },
            {
              name: 'Design Department',
              color: '#A87FF0',
              color2: '#643ABD',
              unread: true,
            },
            {
              name: 'Renergise',
              color: '#93C437',
              color2: '#588219',
            },
            {
              name: 'Product Design',
              color: '#30C9B0',
              color2: '#148579',
            },
            {
              name: 'Project Zero',
              color: '#FF9D52',
              color2: '#C74F0E',
              unread: true,
            },
            {
              name: 'Collaboration',
              color: '#F294F1',
              color2: '#C233C4',
            },
            {
              name: 'Hybrid Team',
              color: '#22C7D6',
              color2: '#008094',
              unread: true,
            },
          ],

          teamspaces: [
            {
              name: 'General',
              unread: true,
            },
            {
              name: 'Marketing Copy Writing',
            },
            {
              name: 'Identity Design',
            },
            {
              name: 'Quaterly Budget Reviews',
              unread: true,
            },
            {
              name: 'Financing: Teams',
              alertMuted: true,
            },
          ],

          teamspaces2: [
            {
              name: 'Management',
              unread: true,
            },
            {
              name: 'Marketing',
            },
            {
              name: 'Adhoc Sync',
            },
            {
              name: 'Product Design Reviews',
              unread: true,
            },
            {
              name: 'Renergise',
            },
            {
              name: 'Collaboration',
            },
          ],

          teamspaces3: [
            {
              name: 'Project Zero',
            },
            {
              name: 'Hybrid Team',
            },
          ],

          POPOUT_WIN_PREFIX: 'space-popout-',

        }
    },
    computed:{
      groupNamesFiltered() {
        if (this.isFTE) {
          return []
        }
        return this.groupNames.filter((itm) => {
          if (this.spaceListTabId === 0) {
            return true
          } else if (this.spaceListTabId === 1) {
            // direct
            return this.spaceList[itm.id].filter( p => !p.isSpace ).length > 0
            
          } else if (this.spaceListTabId === 3) {
            // public
            return  this.spaceList[itm.id].filter( p => p.isPublic ).length > 0
          }
        })
      },
      theme() {
        return this.$store.state.theme;
      },
      me() {
        return this.$store.getters.me;
      },
      activeSpaceId() {
        return this.$store.state.activeSpaceId;
      },
      spaceListTabId() {
        return this.$store.state.spaceListTabId;
      },
      spaceListFilter() {
        return this.$store.state.spaceListFilter;
      },
      activeTeamItem() {
        return this.$store.state.activeTeamItem;
      },
      spaceListCompactView() {
        return this.$store.state.spaceListCompactView;
      },
      isTwoColumnsMode() {
        return this.$store.state.isTwoColumnsMode;
      },
      activePopoutSpaceIdList() {
        return this.$store.state.activePopoutSpaceIdList;
      },
      activePopoutSpaceFocusId() {
        return this.$store.state.activePopoutSpaceFocusId;
      },
      spaceList() {
        return this.$store.state.spaceList;
      },
      personalSpace() {
        return this.$store.state.personalSpace;
      },
      popoutSpaceChangedRect() {
        return this.$store.state.popoutSpaceChangedRect;
      },
      isFTE() {
        return this.$store.state.isFTE;
      },

    },
    beforeMount() {

      let grplist = this.spaceList.slice()
      let len = grplist.length
      for(let i=0; i<len; i++){
        let list = grplist[i]
        let l = list.length
        for(let j=0; j<l; j++){
          let itm = list[j]
          itm.id = itm.name.replace(/ /g, '_')
        }
      }
      this.$store.commit('spaceList', grplist);

      // self space
      let ps = this.personalSpace
      let name = `${this.me.name}'s space`
      let spaceid = this.me.name.replace(/ /g, '_')
      ps.name = name
      ps.id = spaceid
      this.$store.commit('personalSpace', ps);
      if (this.isFTE) {
        this.$store.commit('activeSpaceId', spaceid);
      }
    },
    mounted(){
      this.selectItem({id: this.activeSpaceId});
      this.$nextTick(() => {
        document.querySelector('.teams-2nd-messaging').style.height = '100px'; //change from 600px to 100px, for scrollbar + window-resize-min-height purpose
      })

      this.$eventBus.$on('space-filter-changed', (evt) => {
        this.filterResultIsEmpty = evt.isEmpty;
        this.filterId = evt.filterId;
        this.filterName = evt.filterName;
      });

      this.$eventBus.$on('space-search-changed', (evt) => {
        this.searchInputEvent = evt;
      });
      this.$eventBus.$on('teams-resizing', this.onAppResizing);
    },
    destroyed() {
      this.$eventBus.$off('space-filter-changed');
      this.$eventBus.$off('space-search-changed');
      this.$eventBus.$off('teams-resizing', this.onAppResizing);
    },
    watch: {
      spaceListTabId() {
        this.$refs.scrollbar.scrollToY(0, true);
        this.$store.commit('activeTeamItem', {});
      },
      activePopoutSpaceIdList(newList) {
        // 错位排列新弹出的 windows
        const deskrect = document.querySelector(`#desktop`).getBoundingClientRect();
        const rect = document.querySelector(`[name="teams"]`).getBoundingClientRect();
        var poprect = _.cloneDeep(this.popoutSpaceChangedRect)
        const width = poprect ? poprect.width : 780;
        const height = poprect ? poprect.height : 708;
        const diff = 30
        let top, left
        if (!poprect) {
          if (this.isTwoColumnsMode) {
            top = rect.top - diff
            left = rect.right - 90
          } else {
            top = (deskrect.height - height)/2 - 50
            left = (deskrect.width - width)/2 + 100
          }
        } else {
          
          top = poprect.top + diff
          left = poprect.left + diff
          const right = poprect.right + diff
          const bottom = poprect.bottom + diff

          // 检测是否超出 right/bottom
          if (right > deskrect.width || bottom > deskrect.bottom) {
            top = Math.max(poprect.top - 150, 30)
            left = Math.max(poprect.left - 200, 100)
          }

          poprect.top = top
          poprect.left = left

          this.$store.commit('popoutSpaceChangedRect', poprect);
        }
        

        for (let i=0; i<newList.length; i++) {
          let id = newList[i]
          let space = this.$store.getters.findSpace(id);

          this.$window.show(
            teamSpace, 
            {
              isPopout: true,
              id: id,
              spaceName: space.name,
              isSpace: space.isSpace,
              team: space.team,
              teamColor: space.teamColor,
              spaceSize: 'normal',
              coverExpanded: space.coverExpanded,
              statusTxt: space.statusTxt,
              people: space.people,
              content: space.content,
              meetings: space.meetings,
            }, // component props
            {
              name: `${this.POPOUT_WIN_PREFIX}${id}`,
              w: width,
              h: height,
              x: left,
              y: top,
              minw: 320,
              minh: 320,
              isDraggable: true,
              isResizable: true,
              dragHandle: '.space-popout-titlebar',

            }, // window props
            {
              closed: () => {
                let lst = this.activePopoutSpaceIdList.slice()
                let idx = lst.indexOf(id)
                lst.splice(idx, 1);
                this.$store.commit('activePopoutSpaceIdList', lst);
                if (lst.length > 0) {
                  this.$store.commit('activePopoutSpaceFocusId', _.last(lst));
                } else {
                  this.$store.commit('activePopoutSpaceFocusId', null);
                }
              },
              minimize: () => { },
            } // window eventlistener
          );


          
        }
        
        
      },
    },
    methods:{
      onAppResizing() {
        this.$refs.scrollbar.update();
      },
      hasUnread(grp) {
        const obj = this.groupNames.find(o => o.name == grp);
        const idx = obj.id;
        const lst = this.spaceList[idx]
        for (let i=0; i<lst.length; i++) {
          const itm = lst[i]
          if (itm.unread) {
            return true;
          }
        }
        return false;
      },
      hoverItem(e) {
        this.moveItemBg(e.id);
      },
      leaveItems() {
        if (document.querySelector(`.spacelist-active-bg`)) {
          document.querySelector(`.spacelist-active-bg`).style.opacity = '0';
        }
        this.transEnabled = false;
      },
      moveItemBg(id) {
        if (id === this.activeSpaceId) {
          this.leaveItems();
          return;
        }
        const rect = document.getElementById(id).getBoundingClientRect();
        const rect2 = document.querySelector(`.teams-2nd-messaging-list`).getBoundingClientRect();
        const scrollcontent = document.querySelector(`.teams-2nd-messaging .wl-scrollbar__area`);
        document.querySelector(`.spacelist-active-bg`).style.top = `calc(${rect.top - rect2.top}px + ${scrollcontent.style.marginTop})`;
        document.querySelector(`.spacelist-active-bg`).style.opacity = '1';
        
        if (!this.transEnabled) {
          requestAnimationFrame(() => {
            this.transEnabled = true;
          });
        }
      },
      selectItem(e) {
        const id = e.id;
        this.$store.commit('activeSpaceId', id);
        this.$store.commit('publicSpaceHomepageVisible', false);
        document.querySelector(`.spacelist-active-bg`).style.opacity = '0';
      },
      clickAndPopoutItem(id, dbclick) {
        if (!this.isTwoColumnsMode && !dbclick) {
          return
        }
        let lst = this.activePopoutSpaceIdList.slice()
        if (!lst.includes(id)) {
          lst.push(id)
        } else {
          this.$window.bringToFront(`${this.POPOUT_WIN_PREFIX}${id}`)
        }
        this.$store.commit('activePopoutSpaceIdList', lst);
        this.$store.commit('activePopoutSpaceFocusId', id);
      },

      selectTeamItem(evt, grp) {
        this.$store.commit('activeTeamItem', grp);
      },
      
      collapseHandlder(grp, evt) {
        this.groupCollapsed[grp] = evt.collapsed
      },
      showPublicSpaceHomepage() {
        this.$store.commit('publicSpaceHomepageVisible', true);
      },
      meet(title, host, joinLate) {
        this.$store.commit('meetingTitle', title);
        this.$store.commit('interstitialParams', {visible: true, host: host, late: joinLate});
      },
    }
}
</script>


<style lang="scss">
  .teams-2nd-messaging-toolbar {
    @include flex(row, flex-start);
    margin: 6px 0 0 16px;
    height: 40px;

    .btn-public {
      padding: 0 10px !important;

      .ico {
        margin-right: 4px;
      }
    }
  }
.teams-2nd-messaging {
  flex-shrink: 1;
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 600px;
  scroll-behavior: smooth;

  &-list {
    margin-left: 8px;
    margin-right: 20px;

    .spacelist-active-bg {
      position: absolute;
      height: 48px;
      width: calc(100% - 8px - 20px);
      top: 0;
      left: 8px;
      border-radius: 24px;
      transition: opacity 0.2s ease;
      background-color: rgba($color: #000000, $alpha: 0.07);
      opacity: 0;
      pointer-events: none;

      &.trans {
        transition: all 0.2s ease;
      }
    }
    
    &-title {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 32px;
      font-size: 14px;
      padding: 2px 0 0 12px;

      &-header {
        display: flex;
        align-items: center;
        flex-grow: 1;

        .l {
          margin-right: 4px;
          opacity: 0.95;

          &.bold {
            font-weight: bold;
          }
        }

        .spacer {
          flex-grow: 1;
        }

        .dot {
          margin-right: 12px;
          path {
            fill: $md-blue-60;
          }
        }
      }
    }
  }

  &-team {
    margin-left: 8px;
    margin-right: 20px;
    
    &-title {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 32px;
      font-size: 14px;
      padding: 2px 0 0 12px;
      border-radius: 8px;

      &:hover {
        background: rgba(255, 255, 255, 0.07);
      }

      &:active, &.active {
        background: rgba(255, 255, 255, 0.2);
      }

      &-header {
        display: flex;
        align-items: center;
        flex-grow: 1;

        .color {
          margin: 0 8px 0 4px;
          width: 6px;
          height: 22px;
          border-radius: 4px;
        }
        .name {
          flex-grow: 1;
          font-size: 14px;
          opacity: .95;

          &.unread {
            font-weight: bold;
          }
        }

      }
    }

    &-title2 {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 32px;
      padding: 2px 0 0 14px;

      &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-grow: 1;

        .name {
          flex-grow: 1;
          font-size: 14px;
          opacity: .95;
          margin-left: 2px;
        }
        .num {
          font-size: 14px;
          opacity: .7;
          margin-right: 16px;
        }

      }
    }

    &-spacelist {
      margin-left: 24px;
    }
  }

  &-scrollbar {
    position: absolute;
    right: 0;
    top: 0;
    flex-shrink: 0;
    flex-grow: 0;
    width: 20px;
    padding-left: 4px;
  }

  .empty{
    display: flex;
    flex-direction: column;
    width: 70%;
    max-width: 300px;
    margin: 30% auto;

    .img {
      width: 112px;
      height: 120px;
      background-image: url(~@/assets/img/empty-state-space-filter.svg);
      background-repeat: no-repeat;
      background-size: contain;

      &.fte {
        width: 192px;
        height: 192px;
        background-image: url(~@/assets/img/message-send-320.svg);
      }
    }

    .title {
      font-weight: 600;
      font-size: 16px;
      opacity: .95;
      line-height: 30px;
      margin-bottom: 5px;
      opacity: .95;
    }
    .des {
      font-size: 14px;
      opacity: .7;
    }

    &.epmty-earch {
      .img {
        background-image: url(~@/assets/img/empty-state-space-search.svg);
      }
    }

    &.epmty-earch-no {
      .img {
        background-image: url(~@/assets/img/empty-state-space-search-no.svg);
      }
    }

  }

  &.compact {
    .spacelist-active-bg {
      height: 32px;
      width: calc(100% - 20px);
      border-radius: 16px;
    }
  }

}

/* theme ----- dark/hybrid */
.dark, .hybrid {
  .teams-2nd-messaging {

    &-list {
      .spacelist-active-bg {
        background-color: rgba(255, 255, 255, 0.07);
      }
      &-title {
        &-header {
          .dot {
            path {
              fill: $md-blue-40;
            }
          }
        }
      }
    }

  }
}
</style>
