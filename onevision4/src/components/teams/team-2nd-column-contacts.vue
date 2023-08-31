<template>
  <wl-scrollbar 
    class="teams-2nd-contacts" 
    :alwaysVisible="false"
    :arrowVisible="$store.state.os==='win'"
    :theme="theme === 'light' ? 'light' : 'dark'"
  >
    <div class="teams-2nd-contacts-list" :class="{disabled: disabled}" @mouseleave="leaveItems">
      <div class="contact-list-active-bg" :class="{trans: transEnabled}" ></div>

      <wl-accordion 
        :showBottomBorder="false" 
        :defaultCollapsed="false" 
        iconLocation="before" 
        headerClass="teams-2nd-contacts-list-accordion"
        @collapse="onCollapse"
      >
        <span slot="header" class="teams-2nd-contacts-list-accordion-header" >
          <div class="l">Top Contacts</div>
          <div class="r">{{contactPeopleList['top'].length}}</div>
        </span>

        <space-people-item
          v-for="(p, idx) in $store.getters.peopleList(contactPeopleList['top'])"
          :key="`space-list1-item-${idx}`"
          :id="`${p.name.replace(/ /g, '_')}`"
          itemtype="people"
          :name="p.name"
          :avatar="p.avatar"
          :isgroup="false"
          :status="p.status"
          :subline="p.statusTxt"
          :active="activeContactId === `${p.name.replace(/ /g, '_')}` || contextMenuId === p.name.replace(/ /g, '_')"
          :buttons="[/*'message', 'audiocall', 'videocall'*/]"
          :avatarBackgroundColor="'#545454'"
          color="#FFFFFF"
          @hover="hoverItem"
          @select="selectItem"
          @contextmenu.native.prevent="onContextmenu($event, p)"
        />
      </wl-accordion>

      <wl-accordion 
        :showBottomBorder="false" 
        :defaultCollapsed="false" 
        iconLocation="before" 
        headerClass="teams-2nd-contacts-list-accordion"
        style="margin-top: 2px;"
        @collapse="onCollapse"
      >
        <span slot="header" class="teams-2nd-contacts-list-accordion-header" >
          <div class="l">Other Contacts</div>
          <div class="r">{{contactPeopleList['other'].length}}</div>
        </span>

        <space-people-item
          v-for="(p, idx) in $store.getters.peopleList(contactPeopleList['other'])"
          :key="`space-list2-item-${idx}`"
          :id="`${p.name.replace(/ /g, '_')}`"
          itemtype="people"
          :name="p.name"
          :avatar="p.avatar"
          :isgroup="false"
          :status="p.status"
          :subline="p.statusTxt"
          :active="activeContactId === `${p.name.replace(/ /g, '_')}` || contextMenuId === p.name.replace(/ /g, '_')"
          :buttons="[/*'message', 'audiocall', 'videocall'*/]"
          :avatarBackgroundColor="'#545454'"
          color="#FFFFFF"
          @hover="hoverItem"
          @select="selectItem"
          @contextmenu.native.prevent="onContextmenu($event, p)"
        />
      </wl-accordion>
      
    </div>

    <div class="teams-2nd-messaging-scrollbar"></div>

  </wl-scrollbar>
</template>

<script>
import _ from 'lodash';
import contextMenu from './../shared/contextmenu.vue';
import popSpeedDialAdd from './pop-speed-dial-add.vue';

export default {
  props:[
      'name',
  ],
  data() {
      return {
        disabled: false,
        transEnabled: false,
        contextMenuId: null,
        contextMenuItems: [],
      }
  },
  computed:{
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    teamsNav() {
      return this.$store.state.teamsNav;
    },
    activeContactId() {
      return this.$store.state.activeContactId;
    },
    avatarBgColors() {
      return this.$store.state.avatarBgColors;
    },
    contactPeopleList() {
      return this.$store.state.contactPeopleList;
    },
    speedDialPeopleList() {
      return this.$store.state.speedDialPeopleList;
    },

  },
  beforeMount() {
    this.$eventBus.$on('ondragstart', this.disableHover);
    this.$eventBus.$on('ondragstop', this.enableHover);
  },
  beforeDestroy() {
    this.$eventBus.$off('ondragstart', this.disableHover);
    this.$eventBus.$off('ondragstop', this.enableHover);
  },
  mounted(){
    this.$nextTick(() => {
      document.querySelector('.teams-2nd-contacts').style.height = '100px'; //change from 600px to 100px, for scrollbar + window-resize-min-height purpose
    })
  },
  watch: {

  },
  methods:{
    random(l, h) {
      return _.random(l, h);
    },
    getSpeedDialMenuItems(pname) {
      const lst1 = [
          {
            label: 'Copy to group',
            sub: true,
          },
          {
            label: 'Move to group',
            sub: true,
          },
        ]
      const lst2 = [
          {
            label: 'Hide my availability and status',
          },
          {
            label: 'Remove from contacts',
          },
          {
            label: 'View profile',
          },
        ]

      let spdnum = this.getPeopleSpeedDialNumbers(pname)
      let list = [];
      if(spdnum.length === 0){
        list = {
            label: 'Add to speed dial',
            value: 'add-speed-dial',
          }
      } else {
        list = {
            label: 'Manage speed dials',
            ref: 'managespeeddials',
            level: 1,
            sub: [
              {
                label: 'Add new speed dial',
                value: 'add-speed-dial',
                disabled: spdnum.length >= 2,
              },
            ],
          }
        for(let i=0; i<spdnum.length; i++){
          list.sub.push({
            label: spdnum[i],
            ref: spdnum[i].replace(/[^0-9a-z]+/gi,''),
            level: 2,
            sub: [
              {
                label: 'Edit speed dial',
                value: 'edit-speed-dial',
                data: spdnum[i],
              },
              {
                label: 'Remove from speed dials',
                value: 'remove-speed-dial',
                data: spdnum[i],
              },
            ],
          })
        }
        if (spdnum.length >= 2) {
          list.sub.push({
            label: 'Call on Webex',
            ref: 'callonwebex',
            level: 2,
            sub: [
              {
                label: 'Edit speed dial',
              },
              {
                label: 'Remove from speed dials',
              },
            ],
          })
        }
      }
      return lst1.concat(list,lst2);
    },
    getPeopleSpeedDialNumbers(pname) {
      var pl = this.speedDialPeopleList.slice();
      var nums = pl.reduce(
        (arr, itm) => {
          if (itm.name === pname) {
            arr.push(itm.speeddial);
          }
          return arr;
        },
        []
      );
      return nums;
    },

    disableHover() {
      this.disabled = true
    },
    enableHover() {
      document.addEventListener('mousemove', this.docmousemovehandler);
    },
    docmousemovehandler() {
      this.disabled = false
      document.removeEventListener('mousemove', this.docmousemovehandler);
    },

    hoverItem(e) {
      this.moveItemBg(e.id);
    },
    leaveItems() {
      document.querySelector(`.contact-list-active-bg`).style.opacity = '0';
      this.transEnabled = false;
    },
    moveItemBg(id) {
      if (id === this.activeContactId) {
        this.leaveItems();
        return;
      }
      const rect = document.getElementById(id).getBoundingClientRect();
      const rect2 = document.querySelector(`.teams-2nd-contacts-list`).getBoundingClientRect();
      const scrollcontent = document.querySelector(`.teams-2nd-contacts .wl-scrollbar__area`);
      document.querySelector(`.contact-list-active-bg`).style.top = `calc(${rect.top - rect2.top}px + ${scrollcontent.style.marginTop})`;
      document.querySelector(`.contact-list-active-bg`).style.opacity = '1';
      
      if (!this.transEnabled) {
        requestAnimationFrame(() => {
          this.transEnabled = true;
        });
      }
    },
    selectItem(e) {
      const id = e.id;
      const name = e.name;
      this.$store.commit('activeContactId', id);
      this.$emit('onchange', {id, name});
      document.querySelector(`.contact-list-active-bg`).style.opacity = '0';
    },


    onCollapse() {
      this.leaveItems();
    },

    addSpeedDial(name) {
      this.$modal.show(
        popSpeedDialAdd,
        {
          peoplename: name,

        }, // component props
        {
          name: 'speeddial-add-people',
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: '#pop-speed-dial-add .head',
          roundedCorner: false,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          width: 400,
          height: 360,
          transition: true,
        }, // modal props
        {} // modal eventlistener
      );

    },

    deleteItem(people) {
      const sd = this.speedDialPeopleList.slice();
      for(var i=sd.length-1; i>=0; i--){
        if (sd[i].speeddial === people.speeddial) {
          sd.splice(i, 1);
          this.$store.commit('speedDialPeopleList', sd)
          break;
        }
      }
    },
    editItem(people) {
      this.$modal.show(
        popSpeedDialAdd,
        {
          editpeople: people,
        }, // component props
        {
          name: 'speeddial-add-people',
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: '#pop-speed-dial-add .head',
          roundedCorner: false,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          width: 400,
          height: 360,
          transition: true,
        }, // modal props
        {} // modal eventlistener
      );
    },

    onContextmenu(evt, item) {
      const rectBtn = evt.target.getBoundingClientRect();
      const popperOffsets = {
          x: evt.pageX - rectBtn.left,
          y: evt.pageY - rectBtn.bottom,
      };

      this.$popper.hide('contextmenu');
      this.$popper.show(
          contextMenu,
          {
            items: this.getSpeedDialMenuItems(item.name),
            onSelect: (itm) => { 
              let people = {...item, ...{speeddial:itm.data}};
              if (itm.value === 'add-speed-dial') {
                this.addSpeedDial(item.name);
              } else if (itm.value === 'edit-speed-dial') {
                this.editItem(people);
              } else if (itm.value === 'remove-speed-dial') {
                this.deleteItem(people);
              }
            },

          }, // component props
          {
            name: 'contextmenu',
            reference: evt.target,
            affiliatedElementSelector: ['[name="contextmenu"]', '[name="contextmenu-level1"]', '[name="contextmenu-level2"]'],
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
            opened: () => { this.contextMenuId = item.name.replace(/ /g, '_') },
            closed: () => { this.contextMenuId = null },
          } // popper eventlistener
        );

    },
  }
}
</script>


<style lang="scss">
.teams-2nd-contacts {
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

    &.disabled {
      pointer-events: none;
    }

    .contact-list-active-bg {
      position: absolute;
      height: 48px;
      width: calc(100% - 20px);
      top: 0;
      left: 0;
      border-radius: 24px;
      transition: opacity 0.2s ease;
      background-color: rgba($color: #000000, $alpha: 0.07);
      opacity: 0;
      pointer-events: none;

      &.trans {
        transition: all 0.1s ease;
      }
    }

    &-accordion {
      height: 28px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      margin-left: 14px;

      &-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;

        .r {
          opacity: .7;
        }
      }
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


}

/* theme ----- dark/hybrid */
.dark, .hybrid {
  .teams-2nd-contacts {

    &-list {

      .contact-list-active-bg {
        background-color: rgba(255, 255, 255, 0.07);
      }
    }

  }
}
</style>
