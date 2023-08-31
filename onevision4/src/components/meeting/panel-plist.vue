<template>
  <div class="plist_panel" >

    <div v-if="page=='home'" class="plist_panel_wrap" :class="[theme]">
      <panel-header
        class="pheader"
        :title="title"
        :type="'plist'"
        :floating="plistPanelPopouted"
        :popoutVisible="true"
        @close="close"
        @popout="popout"
      ></panel-header>
      <div v-if="breakoutSessionStarted" class="breakout">
        <div class="top">
          <wl-icon
            name="breakout-session-filled" 
            :color=" theme === 'dark' ? 'white-95' : 'black-95' "
            size="16"
            class="ico"
          />
          Breakout sessions have started.
        </div>
        <div class="bot">
          <md-button class="btn md-button-outline" aria-label="x" :size="28" @click="showBreakout" >
            Choose a session
          </md-button>
        </div>
      </div>
      
      <div class="top">
        <md-button class="btn md-button-outline btn-invite" aria-label="x" :size="28" @click="page='invite'">
          <wl-icon
            name="plus-bold" 
            :color=" theme === 'dark' ? 'white-95' : 'black-95' "
            size="16"
            class="ico"
          />
          Add guest to meeting
        </md-button>

        <div class="spacer"></div>

        <div class="iconbtn">
          <wl-icon
            name="search-bold" 
            :color=" theme === 'dark' ? 'white-95' : 'black-95' "
            size="16"
          />
        </div>
        <div class="iconbtn">
          <wl-icon
            name="unsorted-bold" 
            :color=" theme === 'dark' ? 'white-95' : 'black-95' "
            size="16"
          />
        </div>
      </div>
      
      <wl-scrollbar 
          class="scrollpane" 
          :alwaysVisible="false"
          :arrowVisible="$store.state.os==='win'"
          :theme="theme === 'dark' ? 'dark' : 'light'"
        >
<!--
        <div class="title" v-if="peopleWaiting.length > 0">Waiting to join</div>
        <people-item
            v-for="(p, index) in peopleWaiting"
            :key="`waiting${index}`"
            :type="p.type"
            :name="p.name"
            :avatar="p.avatar"
            height="48px"
            :iconSize="32"
            :suffix="p.guest ? '(Guest)' : null"
            :external="p.external"
            rightLink="Let in"
          />
-->
        <div class="scrollcontent">
          <wl-accordion 
            :showBottomBorder="false" 
            :defaultCollapsed="false" 
            iconLocation="before" 
            arrowCollapsed="arrow-up-bold"
            arrowExpanded="arrow-down-bold"
            headerClass="accheader"
          >
            <div slot="header" class="title">
              <span class="l">
                In the meeting
              </span>
              <span class="r">
                <wl-icon
                  name="external-user-bold" 
                  :color=" theme === 'dark' ? 'yellow-40' : 'yellow-60' "
                  size="16"
                />
              </span>
            </div>

            <people-item
              v-for="(p, index) in plistGroupByRoom"
              :key="`in${index}`"
              :type="p.type"
              :name="p.name"
              :me="p.me"
              :host="p.host"
              :avatar="p.avatar"
              :video="p.video || p.type === 'room'"
              :icon="p.type === 'room' ? 'generic-device-video-regular' : null"
              iconColor="white"
              :iconBgColor=" theme === 'dark' ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.5)' "
              :audio="p.audio"
              :muted="p.muted"
              :room="p.room"
              height="48px"
              :iconSize="32"
              :suffix="p.guest ? '(Guest)' : null"
              :external="p.external"
              :status="p.status === 'presenting' ? 'presenting' : null"
            />

          </wl-accordion>
          
          <wl-accordion 
            v-if="siEnabled || sliEnabled"
            :showBottomBorder="false" 
            :defaultCollapsed="false" 
            iconLocation="before" 
            arrowCollapsed="arrow-up-bold"
            arrowExpanded="arrow-down-bold"
            headerClass="accheader"
          >
            <div slot="header" class="title">
              <span class="l">
                Interpreter
              </span>
            </div>

            <people-item
              v-for="(p, index) in peopleSI2"
              :key="`si${index}`"
              :name="p.name"
              :avatar="p.avatar"
              :audio="p.audio"
              :muted="p.muted"
              height="48px"
              :iconSize="32"
              :activeInfo="p.statusTxt"
            />

          </wl-accordion>

          <wl-accordion 
            v-if="peopleNotJoinedList.length > 0"
            :showBottomBorder="false" 
            :defaultCollapsed="false" 
            iconLocation="before" 
            arrowCollapsed="arrow-up-bold"
            arrowExpanded="arrow-down-bold"
            headerClass="accheader"
          >
            <div slot="header" class="title" >
              <span class="l">
                Not in the meeting
              </span>
            </div>

            <people-item
              v-for="(p, index) in peopleNotJoinedList"
              :key="`not${index}`"
              :type="p.type"
              :name="p.name"
              :avatar="p.avatar"
              height="48px"
              :iconSize="32"
              :suffix="p.guest ? '(Guest)' : null"
              :activeInfo="p.statusTxt"
              :status="p.status"
            />

          </wl-accordion>
        </div>
      </wl-scrollbar>
      <div class="bottom_btns">
        <md-button class="btn md-button-solid2" aria-label="x" :size="28" >
          Mute all
        </md-button>
        <md-button class="btn md-button-solid2" aria-label="x" :size="28" >
          Unmute all
        </md-button>
        <md-button class="btn md-button-solid2 btn-round" aria-label="x" :size="28" >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z" fill="white" fill-opacity="0.95"/>
            <path d="M4.25 8.75C4.66421 8.75 5 8.41421 5 8C5 7.58579 4.66421 7.25 4.25 7.25C3.83579 7.25 3.5 7.58579 3.5 8C3.5 8.41421 3.83579 8.75 4.25 8.75Z" fill="white" fill-opacity="0.95"/>
            <path d="M11.75 8.75C12.1642 8.75 12.5 8.41421 12.5 8C12.5 7.58579 12.1642 7.25 11.75 7.25C11.3358 7.25 11 7.58579 11 8C11 8.41421 11.3358 8.75 11.75 8.75Z" fill="white" fill-opacity="0.95"/>
          </svg>
        </md-button>
      </div>
    </div>



    <div v-if="page=='invite'" class="plist_panel_wrap invite_page" :class="[theme]">
      <panel-header
        class="pheader"
        :title="'Invite people'"
        :type="'plist'"
        :floating="plistPanelPopouted"
        :popoutVisible="true"
        @close="close"
        @popout="popout"
      ></panel-header>

      <div class="top">
        
        <div class="iconbtn" style="margin-right: 8px;" @click="page='home'">
          <wl-icon
            name="arrow-left-bold" 
            :color=" theme === 'dark' ? 'white-95' : 'black-95' "
            size="16"
          />
        </div>

        <md-input 
          ref="searchinput"
          class="search md-search-input" 
          inputClassName=""
          clear
          placeholder="Search by name or email address"
        >
          <wl-icon
            class="md-search-input__icon"
            name="search-bold"
            size="12"
            slot="inputBefore"
          />
        </md-input>
        
      </div>

      <div v-if="isFTE && !FTE_peopleInvited" class="plist">
        <people-item
            v-for="(p, index) in peopleListTestMeeting"
            :key="`pt${index}`"
            :type="p.type"
            :name="p.name"
            :avatar="p.avatar"
            height="48px"
            :iconSize="32"
            :suffix="p.guest ? '(Guest)' : null"
            :activeInfo="p.statusTxt"
            :status="p.status"
          />
      </div>

      <div class="btns">
        <md-button class="btn md-button-solid btn-invite" aria-label="x" :size="32" @click="inviteTestPeople">
            <span class="label">Invite</span>
        </md-button>
      </div>

      
    </div>

  </div>
</template>

<script>
import popThisPanel from "./panel-plist.vue";
import popBreakout from "./pop-breakout.vue";

export default {
  data() {
    return {
      panelName: 'popout-panel-plist',
      page: 'home',
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    title() {
      return 'Participants (' + this.peopleList.length + ')';
    },
    siEnabled() {
      return this.$store.state.siEnabled;
    },
    sliEnabled() {
      return this.$store.state.sliEnabled;
    },
    breakoutSessionStarted() {
      return this.$store.state.breakoutSessionStarted;
    },
    panelVisible() {
      return this.$store.state.panelVisible;
    },
    plistPanelVisible() {
      return this.$store.state.plistPanelVisible;
    },
    plistPanelPage() {
      return this.$store.state.plistPanelPage;
    },
    plistPanelPopouted() {
      return this.$store.state.plistPanelPopouted;
    },
    peopleSI() {
      return this.$store.state.peopleSI;
    },
    peopleSI2() {
      let plst = []
      if (this.siEnabled && this.sliEnabled) {
        return this.peopleSI
      }else if (this.siEnabled && !this.sliEnabled) {
        plst = this.peopleSI.filter((p) => {
            return !p.isSign
          }
        )
      }else if (!this.siEnabled && this.sliEnabled) {
        plst = this.peopleSI.filter((p) => {
            return p.isSign
          }
        )
      }
      return plst
    },
    peopleListTestMeeting() {
      return this.$store.state.peopleListTestMeeting;
    },
    isFTE() {
      return this.$store.state.isFTE;
    },
    FTE_peopleInvited() {
      return this.$store.state.FTE_peopleInvited;
    },
    peopleList() {
      let plst = this.$store.state.peopleList.slice().filter((p) => {
          return !p.isroom;
        }
      )
      plst.sort(function(a,b){
        if (a.me) return -1;
        else if (b.me) return 1;
        else if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        });
      return plst;
    },
    peopleWaiting() {
      let plst = this.$store.state.peopleWaiting.slice();
      plst.sort(function(a,b){
        if (a.name < b.name) return -1;  
        else if (a.name > b.name) return 1;  
        });
      return plst;
    },
    peopleNotJoinedList() {
      let plst = this.$store.state.peopleNotJoinedList.slice();
      plst.sort(function(a,b){
        if (a.name < b.name) return -1;  
        else if (a.name > b.name) return 1;  
        });
      return plst;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    plistGroupByRoom() {
      let rooms = [];
      let plist = [];
      const len = this.peopleList.length;
      for (let i = 0; i < len; i++) {
        const p = this.peopleList[i];
        if (p.room) {
          if (rooms.indexOf(p.room) === -1) {
            rooms.push(p.room);
            plist.push({ type: "room", name: p.room, audio: 'device' });
            for (let j = 0; j < len; j++) {
              const p2 = this.peopleList[j];
              if (p2.room === p.room) {
                plist.push(p2);
              }
            }
          }
        } else {
          plist.push(p);
        }
      }
      return plist;
    },

  },
  beforeMount() {
    this.page = this.plistPanelPage || 'home'
    this.$store.commit('plistPanelPage', null)
  },
  mounted() {

  },
  watch: {
    plistPanelVisible(newVal) {
      if (!newVal && this.plistPanelPopouted) {
        this.$store.commit('plistPanelPopouted', false);
        this.$modal.hide(this.panelName);
      }
    }
  },
  methods: {
    close() {
      if (this.plistPanelPopouted) {
        this.$modal.hide(this.panelName);
      }
      this.$store.commit("plistPanelVisible", false);
      setTimeout( () => this.$store.commit("plistPanelPopouted", false), 100);
    },
    popout() {
      if (!this.plistPanelPopouted) {
        this.$modal.show(
          popThisPanel, 
          {
            
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
            height: 500,
            shiftX: 0.95,
            shiftY: 0.3,

          }, // modal props
          {
            closed: () => { },
          } // modal eventlistener
        );
      } else {
        this.$modal.hide(this.panelName);
      }
      this.$store.commit("plistPanelPopouted", !this.plistPanelPopouted);
    },
    showBreakout() {
      this.$modal.show(
        popBreakout, 
        {
          page: 'choose-session'
        }, // component props
        {
          clickToClose: false,
          frameless: true,
          shadow: true,
          resizable: true,
          draggable: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
          roundedCorner: this.os === 'mac',
          width: 400,
          height: 560,

        }, // modal props
        {
          closed: () => { },
        } // modal eventlistener
      );
    },

    inviteTestPeople() {
      this.$store.commit("FTE_peopleInvited", true)
      this.close()
    },
  }
};
</script>


<style lang="scss">
.plist_panel {
  width: 100%;
  height: 100%;
  font-size: 14px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  border-radius: 6px;
  transform: rotate(0deg);
  overflow: hidden;

}

.plist_panel_wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .md-button-solid2 {
      background: rgba($color: #000000, $alpha: .0);
      color: rgba($color: #000000, $alpha: .95);

      &:hover {
        background: rgba($color: #000000, $alpha: .07);
      }
      &:active {
        background: rgba($color: #000000, $alpha: .2);
      }
    }

    &.invite_page {

      .top {
        height: 44px;
      }
      .plist {
        display: flex;
        flex-direction: column;
        margin: 8px 4px 16px 4px;
      }
      
      .btns {
        @include flex;
        width: 100%;
      }
    }

    .top {
      display: flex;
      align-items: center;
      margin-right: 10px;

      .btn-invite {
        flex-shrink: 1;
        margin: 10px 0 10px 12px;
        font-size: 14px;
        padding-right: 12px;

        .ico {
          margin: 0 8px;
        }
      }

      .spacer {
        flex-grow: 1;
      }
      .iconbtn {
        @include flex;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-left: 4px;

        &:hover {
          background: rgba($color: #000000, $alpha: .07);
        }
        &:active {
          background: rgba($color: #000000, $alpha: .2);
        }
      }

      .search {
        margin: 0;
        flex-grow: 1;

        .md-input__before {
          color: rgba($color: white, $alpha: 0.95);
          fill: rgba($color: white, $alpha: 0.95);
        }
        .md-input__after {
          width: 28px;
        }
        .md-input {
          height: 30px;
          color: rgba($color: white, $alpha: 0.95);
          background-color: black;
          border-color: rgba($color: white, $alpha: 0.5);
          border-radius: 8px;
          font-size: 14px;
          padding-left: 30px;
          flex-grow: 1;

          &::placeholder {
            color: rgba($color: white, $alpha: 0.7) !important;
          }
          &:hover {
            background-color: black;
            border-color: rgba($color: white, $alpha: 0.3) !important;
          }
          &:focus {
            background-color: black;
            border-color: rgba($color: white, $alpha: 0.3) !important;
            box-shadow: 0 0 0 3px $md-blue-40 !important;
          }
        }
      }
    }


    .bottom_btns {
      width: calc(100% - 12px * 2);
      margin: 0 12px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .btn {
        flex-grow: 1;
        font-size: 14px !important;
      }

      .btn-round {
        padding: 0;
        width: 28px !important;
        min-width: 0;
        flex-grow: 0;

        svg path {
          fill: black;
        }
      }
    }

    .accheader {
      width: calc(100% - 8px);
      display: flex;
      align-items: center;
      font-size: 14px;
      margin: 12px 12px 0 8px;

      .icon {
        margin-left: 4px;
      }
    }

    .title {
      @include flex(row, space-between);
      flex-grow: 1;
      height: 32px;
      padding-left: 4px;

      span {
        @include flex;
      }

      .l {
        opacity: .7;
        font-size: 14px;
        font-weight: 600;
      }
      .r {
        width: 32px;
        margin-right: 10px;
      }
    }

    .pheader {
      flex-grow: 0;
      width: 100%;
    }
    .breakout {
      @include flex(column);
      background: #3B3B3B;
      border-radius: 8px; 
      margin: 0 20px 8px 20px;

      .top {
        @include flex(row, flex-start);
        width: 100%;
        padding: 8px 12px;

        .ico {
          margin-left: 4px;
          margin-right: 8px;
        }
      }
      .bot {
        @include flex(row, flex-end);
        width: 100%;
        padding: 0 12px 8px;

        .btn {
          font-size: 14px;
          padding: 0 12px;
        }
      }
    }
    .scrollpane {
      flex-shrink: 1;
      flex-grow: 1;
      width: 100%;
      overflow: hidden;
      height: 100px;
      padding: 0 4px;
    }
    .list {
      width: 100%;
    }

    /* theme ----- dark/hybrid */
    &.hybrid {
      color: $text-color-primary-light-ui;
    }

    &.dark {
      color: $text-color-primary-dark-ui;

      .md-button-solid2 {
        color: rgba($color: #FFFFFF, $alpha: .95);
        background: rgba($color: #FFFFFF, $alpha: .0);

        &:hover {
          background: rgba($color: #FFFFFF, $alpha: .07);
        }
        &:active {
          background: rgba($color: #FFFFFF, $alpha: .2);
        }
      }

      .top {
        .iconbtn {
          &:hover {
            background: rgba($color: #FFFFFF, $alpha: .07);
          }
          &:active {
            background: rgba($color: #FFFFFF, $alpha: .2);
          }
        }
      }

      .bottom_btns {
        .btn-round {
          svg path {
            fill: white;
          }
        }
      }

    }
    
}
  
</style>
