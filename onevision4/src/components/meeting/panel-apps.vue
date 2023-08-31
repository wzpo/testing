<template>
  <div
    id="apps_panel"
    ref="panel"
    :class="[{minheight: openedPanelCnt <=2 && !chatPanelVisible}]"
    
  >
    <div v-if="page === 'apps'" class="apps_panel_wrap" :class="[theme]">
      <panel-header
        :title="title"
        :type="'apps'"
        @close="close"
      ></panel-header>

      <div class="search-row">
        <md-input 
          class="md-search-input search" 
          clear
          placeholder="Search Apps"
          @input="handleChange"
        >
          <wl-icon
            class="md-search-input__icon"
            name="search-bold"
            size="16"
            slot="inputBefore"
          />
        </md-input>
      </div>

      
      <div class="tools">

        <!--
        <div class="dis-tab">
          <div class="btn" :class="{active:listtype==='grid'}" @click="listtype = 'grid'" >
            <wl-icon name="view-thumbnail-bold" class="ico" size="12" />
          </div>
          <div class="btn" :class="{active:listtype==='list'}" @click="listtype = 'list'" >
            <wl-icon name="view-list-bold" class="ico" size="12" />
          </div>
        </div>

        <div class="rgt">
          <div class="lb">
            Order by
          </div>
          <div class="btn active" ref="btnrecent" @click="showDropMenu">
            Most recent
            <wl-icon class="ico" name="arrow-down-filled" size="12" />
          </div>
        </div>
        -->

        <div class="tabs ">
          <div class="tab " :class="{active: true}" >
            <span>My Apps</span>
          </div>
          <div class="tab " :class="{active: false}" >
            <span>Discover</span>
          </div>

        </div>

      </div>


      <div class="scrollpane" >
        <div class="list">

          <wl-accordion 
            v-if="inMeetingApps.length > 0"
            :showBottomBorder="false" 
            :defaultCollapsed="false" 
            iconLocation="before-XXX" 
            arrowCollapsed="arrow-up-bold"
            arrowExpanded="arrow-down-bold"
            headerClass="accheader"
          >
            <span slot="header" class="" >
              In meeting
            </span>

            <div :class="['items', 'big-grid']" >

              <div 
                v-for="(itm, idx) in inMeetingApps" 
                :key="`itm-in-${idx}`"
                class="itm" 
                @click="() => {
                  if (itm.func) {
                    thisref[itm.func](itm.params);
                  }
                }"
              >
                <div class="thumbimg" :class="`thumb--${itm.thumb}`"></div>
                <div class="rgt">
                  <div class="lb">{{itm.name}}</div>
                  <div class="des">App name</div>
                </div>
                <div class="cornericon">
                  <wl-icon v-if="itm.icon" :name="itm.icon" size="12" />
                  <div v-if="itm.image" class="img" :class="`ico--${itm.image}`"></div>
                </div>

                <div class="tip" v-if="alreadyOpened === itm.name">Already opened</div>

              </div>

            </div>

          </wl-accordion>

          <wl-accordion 
            v-if="applist.length > 0 && applist[0].length > 0"
            :showBottomBorder="false" 
            :defaultCollapsed="false" 
            iconLocation="before-XXX" 
            arrowCollapsed="arrow-up-bold"
            arrowExpanded="arrow-down-bold"
            headerClass="accheader"
          >
            <span slot="header" class="" >
              Favorites
            </span>

            <div :class="['items', 'grid']" >

              <div 
                v-for="(itm, idx) in applist[0]" 
                :key="`itm-${idx}`"
                class="itm" 
                @click="() => {
                  if (itm.func) {
                    thisref[itm.func](itm.params);
                  }
                }"
              >
                <div class="thumb bg" :class="`ico--${itm.image}`"></div>
                <div class="lb">{{itm.name}}</div>
              </div>

            </div>

          </wl-accordion>

          <wl-accordion 
            v-if="applist.length > 0 && applist[1].length > 0"
            :showBottomBorder="false" 
            :defaultCollapsed="false" 
            iconLocation="before-XXX" 
            arrowCollapsed="arrow-up-bold"
            arrowExpanded="arrow-down-bold"
            headerClass="accheader"
          >
            <span slot="header" class="" >
              Suggestions for you
            </span>

            <div :class="['items', 'list']" >
              <div 
                v-for="(itm, idx) in applist[1]" 
                :key="`itm2-${idx}`"
                class="itm" 
                @click="() => {
                  if (itm.func) {
                    thisref[itm.func](itm.params);
                  }
                }"
              >
                <div class="thumb" :class="`ico--${itm.image}`"></div>
                <div class="rgt">
                  <div class="lb">{{itm.name}}</div>
                  <div class="des">{{itm.des}}</div>
                </div>
              </div>
            </div>

          </wl-accordion>

          


        </div>
      </div>

      

    </div>

    <div v-if="page !== 'apps'" class="apps_panel_wrap" >
      
      <panel-apps-tpl 
        v-if="page === 'tpl'"
        :title="tplTitle"
        :funcBack="() => { goHome(null) }"
        :bottomVisible="true"
        :bottomButtonFunc="() => {}"
      >
        <div class="app-placeholder" >
          <span class="lb">App content</span>
        </div>
      </panel-apps-tpl>



      <panel-apps-tpl 
        v-if="page === 'whiteboard-list'"
        :title="tplTitle"
        :iconImage="'ico--whiteboard'"
        :funcBack="() => { goHome(null) }"
        :funcPopout="() => { popoutWhiteboard() }"
        :bottomVisible="false"
        :bottomButtonFunc="() => {}"
      >
        <div v-if="page === 'whiteboard-list'" class="page page_whiteboard_list" >
          <wl-hot :rect="{x:0,y:105,w:358,h:459}" @click.native="openWhiteboard2" />

        </div>

      </panel-apps-tpl>


      <panel-apps-tpl 
        v-if="page === 'whiteboard-view'"
        :title="tplTitle"
        :iconImage="'ico--whiteboard'"
        :funcBack="() => { goHome({
          name: 'Whiteboard', 
          content: 'whiteboard', 
          thumb: 'whiteboard', 
          func: 'openWhiteboard2', 
          param: {name: 'Whiteboard'},
        }) }"
        :funcPopout="() => { popoutWhiteboard() }"
        :bottomVisible="true"
        :bottomButtonFunc="() => { openTogetherWhiteboard() }"
      >

        <div v-if="page === 'whiteboard-view'" class="page page_whiteboard_view" >
          <div class="wb-tools"></div>
          <wl-hot :rect="{x:333,y:2,w:25,h:29}" @click.native="closeWhiteboard" />
        </div>

      </panel-apps-tpl>



<!--

      <div v-if="page === 'miro-list'" class="page page_miro_list" >
        <wl-hot :rect="{x:11,y:52,w:26,h:28}" @click.native="goHome(null)" />
        <wl-hot :rect="{x:299,y:12,w:25,h:29}" @click.native="popoutMiro" />
        <wl-hot :rect="{x:82,y:157,w:265,h:472}" @click.native="openMiro2" />
        <wl-hot :rect="{x:326,y:13,w:27,h:28}" @click.native="close" />
      </div>
      <div v-if="page === 'miro-view'" class="page page_miro_view" >
        <div class="bot"></div>
        <wl-hot :rect="{x:11,y:52,w:26,h:28}" @click.native="goHome({name: openedMiroFileName, image: 'miro', thumb: 'miro', func: 'openMiro2', param: {name: 'Miro'},})" />
        <wl-hot :rect="{x:299,y:12,w:25,h:29}" @click.native="popoutMiro" />
        <wl-hot :rect="{x:326,y:13,w:27,h:28}" @click.native="close" />
        <wl-hot :rect="{x:37,y:593,w:132,h:28}" @click.native="openTogetherMiro" />
      </div>



      <div v-if="page === 'mural'" class="page page_mural" >
        <wl-hot :rect="{x:11,y:52,w:26,h:28}" @click.native="goHome({name: 'Mural', image: 'mural', thumb: 'mural', func: 'openMural', param: {name: 'Mural'},})" />
        <wl-hot :rect="{x:326,y:13,w:27,h:28}" @click.native="close" />
        <div class="bot"></div>
      </div>





      <div v-if="page === 'polling'" class="page page_polling" >
        <wl-hot :rect="{x:11,y:52,w:26,h:28}" @click.native="goHome(null)" />
        <wl-hot :rect="{x:272,y:250,w:39,h:35}" @click.native="startPolling" />
        <wl-hot :rect="{x:326,y:13,w:27,h:28}" @click.native="close" />
      </div>
      <div v-if="page === 'polling2'" class="page page_polling2" >
        <wl-hot :rect="{x:11,y:52,w:26,h:28}" @click.native="goHome({name: 'Slido(Polling and Q&A)', icon: 'poll-bold', thumb: 'polling', func: 'startPolling', param: {name: 'Slido'},})" />
        <wl-hot :rect="{x:61,y:571,w:39,h:35}" @click.native="stopPolling" />
        <wl-hot :rect="{x:326,y:13,w:27,h:28}" @click.native="close" />
      </div>
-->



    </div>

  </div>
</template>

<script>
import _ from 'lodash';

export default {
  props: [
    'meetingId',
  ],
  data() {
    return {
      title: "Apps",
      recentDropdownVisible: false,
      linkDropdownVisible: false,
      page: 'apps',
      tplTitle: '',
      miroPage: '',
      whiteboardPage: '',
      listtype: 'grid',
      alreadyOpened: '',
      thisref: this,

      apps: [
        [
          {
            name: 'Miro',
            image: 'miro',
            func: 'openAppTpl',
            params: {name: 'Miro'},
          },
          {
            name: 'Hoylu',
            image: 'hoylu',
            func: 'openAppTpl',
            params: {name: 'Hoylu'},
          },
          {
            name: 'Huddl',
            image: 'huddl',
            func: 'openAppTpl',
            params: {name: 'Huddl'},
          },

        ],
        [
          {
            name: 'Slido',
            image: 'slido',
            des: 'Live polling and questions',
            func: 'openAppTpl',
            params: {name: 'Slido'},
          },
          {
            name: 'Whiteboard',
            image: 'whiteboard',
            des: 'Real time whiteboards from Webex',
            func: 'openWhiteboardList',
            params: {name: 'Whiteboard'},
          },
          {
            name: 'Mural',
            image: 'mural',
            des: 'Online collaborative whiteboard',
            func: 'openAppTpl',
            params: {name: 'Mural'},
          },
          {
            name: 'Thrive Reset',
            image: 'thrivereset',
            des: 'Take a breath and reset with everyone',
            func: 'openAppTpl',
            params: {name: 'Thrive Reset'},
          },
          {
            name: 'Smartsheet',
            image: 'smartsheet',
            des: 'Sheets and dashboards in real-time',
            func: 'openAppTpl',
            params: {name: 'Smartsheet'},
          },
          /*
          {
            name: 'Workboard',
            image: 'workboard',
          },
          {
            name: 'Cloverhound',
            image: 'cloverhound',
          },
          {
            name: 'CoScreen',
            image: 'coscreen',
          },
          */
        ],
      ],
      filteredApps: [],
      openedMiroFileName: 'Logo Brainstroming..',
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId);
    },
    panelVisible() {
      return this.$store.state.panelVisible;
    },
    chatPanelVisible() {
      return this.$store.state.chatPanelVisible;
    },
    appsPanelVisible() {
      return this.$store.state.appsPanelVisible;
    },

    fullscreen() {
      return this.$store.state.fullscreen;
    },
    openedPanelCnt() {
      return this.$store.getters.openedPanelCnt;
    },
    enabledApps() {
      return this.$store.state.enabledApps;
    },
    unreadApps() {
      return this.$store.state.unreadApps;
    },
    defaultOpenAppPanel() {
      return this.$store.state.defaultOpenAppPanel;
    },
    inMeetingApps() {
      return this.$store.state.inMeetingApps;
    },
    me() {
      return this.$store.getters.me;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    currentSharing() {
      return this.$store.getters.currentSharing(this.meetingId)
    },
    applist() {
      let names = [];
      for(let i=0; i<this.inMeetingApps.length; i++) {
        names.push(this.inMeetingApps[i].name);
      }
      
      let list = [];
      for(let i=0; i<this.filteredApps.length; i++) {
        list[i] = [];
        for (let j=0; j<this.filteredApps[i].length; j++) {
          const name = this.filteredApps[i][j].name
          if (names.indexOf(name) === -1) {
            list[i].push(this.filteredApps[i][j]);
          }
        }
      }
      return list;
    },
  },
  mounted() {
    this.filteredApps = this.apps;

    const appPanel = this.defaultOpenAppPanel
    if (appPanel && appPanel.page) {
      this.page = appPanel.page;
      this.tplTitle = appPanel.name

      this.$store.commit("defaultOpenAppPanel", null);
    }
  },
  watch: {

  },
  methods: {
    openAppTpl(params) {
      this.page = 'tpl'
      if (params) {
        this.tplTitle = params.name
      }
    },

    goHome(app) {
      if (app) {
        let found = false;
        let inapps = this.inMeetingApps.slice();
        for(let i=0; i<inapps.length; i++) {
          if (inapps[i].name === app.name) {
            inapps[i] = app;
            found = true;
          }
        }
        if (!found) {
          inapps.push(app);
          this.$store.commit("inMeetingApps", inapps);
        }
      }
      this.page = 'apps'
    },

    removeInMeetingApp(appname) {
      let inapps = this.inMeetingApps.slice();
      for(let i=inapps.length-1; i>=0; i--) {
        if (inapps[i].name === appname) {
          inapps.splice(i, 1);
        }
      }
      this.$store.commit("inMeetingApps", inapps);
    },


    


    openWhiteboardList(params) {
      this.page = 'whiteboard-list'
      if (params) {
        this.tplTitle = params.name
      }
    },
    openWhiteboard2() {

      let lst = this.currentSharing.slice();
      let whiteboardOpened = false;
      for (let i = 0; i < lst.length; i++) {
        if (lst[i].title === 'Whiteboard') {
          whiteboardOpened = true;
          break;
        }
      }
      if (whiteboardOpened) {
        this.alreadyOpened = 'Whiteboard'

        setTimeout(() => {
          this.alreadyOpened = ''
        }, 3000);
      } else {
        this.page = 'whiteboard-view'
      }
    },
    closeWhiteboard() {
      this.removeInMeetingApp('Whiteboard');
      this.openWhiteboardList()
    },
    popoutWhiteboard() {
      /*

      this.whiteboardPage = this.page
      this.page = 'apps';

      this.$modal.show(
        {
          template: `
            <div class="popout-apps-whiteboard" :class="{img1: parent.whiteboardPage === 'whiteboard-list', img2: parent.whiteboardPage === 'whiteboard-view',}">
              <wl-hot v-if="parent.whiteboardPage === 'whiteboard-list'" :rect="{x:177,y:158,w:538,h:379}" @click.native="openView" />
              <wl-hot :rect="{x:684,y:8,w:29,h:27}" @click.native="close" />
              <wl-hot :rect="{x:648,y:8,w:31,h:27}" @click.native="popin" />
              <wl-hot :rect="{x:450,y:34,w:116,h:27}" @click.native="openTogetherWhiteboard" />
            </div>
          `,
          props: ['parent'],
          data() {
            return {
            };
          },
          methods: {
            openView() {
              this.parent.whiteboardPage = 'whiteboard-view';
            },
            popin() {
              this.parent.popinWhiteboard();
              this.close();
            },
            openTogetherWhiteboard() {
              this.parent.openTogetherWhiteboard();
              this.close();
            },
            close() {
              this.$emit('close');
            },
          }
        },
        {
          parent: this,
        }, // component props
        {
          name: 'box-dialog',
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: true,
          roundedCorner: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          width: 720,
          height: 540,
          shiftX: 0.8,
          shiftY: 0.2,
        }, // modal props
        {} // modal eventlistener
      );
      */
    },
    popinWhiteboard() {
      this.page = this.whiteboardPage
    },
    openTogetherWhiteboard() {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      var meeting = optlist[idx]


      this.goHome({
        name: 'Whiteboard', 
        //icon: 'whiteboard-filled', 
        content: 'whiteboard', 
        thumb: 'whiteboard', 
        func: 'openWhiteboard2', 
        param: {name: 'Whiteboard'},
      });

      // start sharing
      this.$store.commit('collaboratingSide', 'initiator');

      let lst = meeting.currentSharing.slice();
      let whiteboardOpened = false;
      for (let i = 0; i < lst.length; i++) {
        if (lst[i].title === 'Whiteboard') {
          whiteboardOpened = true;
          break;
        }
      }
      var changed = false
      if (!whiteboardOpened) {
        lst.push({
          title: `Whiteboard`,
          people: this.me.name,
          content: 'whiteboard',
          type: 'collaborating',
        });

        optlist[idx].currentSharing = lst
        changed = true
      }
      if (meeting.videoLayout !== 'stage-sharing') {
        optlist[idx].videoLayout = 'stage-sharing'
        changed = true
      }
      if (changed) {
        this.$store.commit('meetingOptionsList', optlist);
      }
      
      this.$store.commit('appsPanelVisible', false);
    },


    /*
    openPolling() {
      this.page = 'polling'
    },
    startPolling() {
      this.page = 'polling2'
    },
    stopPolling() {
      this.removeInMeetingApp('Slido(Polling and Q&A)');
      this.page = 'polling'
    },


    openMiro(){
      this.page = 'miro-list'
    },
    openMural(){
      this.page = 'mural'
    },
    openMiro2(){
      let lst = this.currentSharing.slice();
      let miroOpened = false;
      for (let i = 0; i < lst.length; i++) {
        if (lst[i].title === 'Miro') {
          miroOpened = true;
          break;
        }
      }
      if (miroOpened) {
        this.alreadyOpened = 'Logo Brainstroming..'

        setTimeout(() => {
          this.alreadyOpened = ''
        }, 3000);
      } else {
        this.page = 'miro-view'
      }
    },

    popoutMiro() {
      this.miroPage = this.page
      this.page = 'apps';

      this.$modal.show(
        {
          template: `
            <div class="popout-apps-miro" :class="{img1: parent.miroPage === 'miro-list', img2: parent.miroPage === 'miro-view',}">
              <wl-hot v-if="parent.miroPage === 'miro-list'" :rect="{x:177,y:158,w:538,h:379}" @click.native="openView" />
              <wl-hot :rect="{x:684,y:8,w:29,h:27}" @click.native="close" />
              <wl-hot :rect="{x:648,y:8,w:31,h:27}" @click.native="popin" />
              <wl-hot :rect="{x:450,y:34,w:116,h:27}" @click.native="openTogetherMiro" />
            </div>
          `,
          props: ['parent'],
          data() {
            return {
            };
          },
          methods: {
            openView() {
              this.parent.miroPage = 'miro-view';
            },
            popin() {
              this.parent.popinMiro();
              this.close();
            },
            openTogetherMiro() {
              this.parent.openTogetherMiro();
              this.close();
            },
            close() {
              this.$emit('close');
            },
          }
        },
        {
          parent: this,
        }, // component props
        {
          name: 'box-dialog',
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: true,
          roundedCorner: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          width: 720,
          height: 540,
          shiftX: 0.8,
          shiftY: 0.2,
        }, // modal props
        {} // modal eventlistener
      );
    },

    popinMiro() {
      this.page = this.miroPage
    },

    openTogetherMiro() {
      this.goHome({name: this.openedMiroFileName, image: 'miro', thumb: 'miro', func: 'openMiro2', param: {name: 'Miro'},});

      // start sharing
      this.$store.commit('collaboratingSide', 'initiator');

      let lst = this.currentSharing.slice();
      let miroOpened = false;
      for (let i = 0; i < lst.length; i++) {
        if (lst[i].title === 'Miro') {
          miroOpened = true;
          break;
        }
      }
      if (!miroOpened) {
        lst.push({
          title: `Miro`,
          people: this.me.name,
          content: 'miro',
          type: 'collaborating',
        });

        this.$store.commit('currentSharingXXX', lst);
      }
      if (this.videoLayout !== 'stage-sharing') {
        this.$store.commit('videoLayoutXXXXX', 'stage-sharing');
      }

      this.$store.commit('appsPanelVisible', false);

      
    },
    */


    handleChange(e) {
      const keyword = e.target.value.toLowerCase()
      this.filteredApps = [];
      for(let i=0; i<this.apps.length; i++) {
        this.filteredApps[i] = [];
        for (let j=0; j<this.apps[i].length; j++) {
          const name = this.apps[i][j].name.toLowerCase()
          if (name.indexOf(keyword) > -1) {
            this.filteredApps[i].push(this.apps[i][j]);
          }
        }
      }

      if (!keyword) {
        this.filteredApps = this.apps;
      }
      
    },
    close() {
      this.$store.commit("appsPanelVisible", false);
    },


    /*
    showDropMenu(){
      if (!this.recentDropdownVisible) {
        this.$popper.show(
          {
            template: `
              <div class="panel-apps-dropdown" style="width:131px;">
                <div class="itm" @click="close">
                  Moust recent
                  <wl-icon class="ck" name="check_10" />
                </div>
                <div class="itm" @click="close">
                  Alphabetical
                </div>
              </div>
            `,
            props: [],
            methods: {
              close() {
                this.$popper.hideAll();
              },
            }
          },
          {
          }, // component props
          {
            reference: this.$refs.btnrecent,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: false,
            frameless: false,
            borderRadius: '0px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {placement: 'bottom'},
          }, // popper props
          {
            opened: () => {this.recentDropdownVisible = true},
            closed: () => {this.recentDropdownVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

    linkClick() {
      if (!this.linkDropdownVisible) {
        this.$popper.show(
          {
            template: `
              <div class="panel-apps-dropdown" style="width:170px;">
                <div v-if="done === 0" class="itm" @click="close1">
                  Copy link
                </div>
                <div v-if="done === 0" class="itm" @click="close2">
                  Send link to meeting chat
                </div>
                <div v-if="done === 1" class="itm center" >
                  Copied!
                </div>
                <div v-if="done === 2" class="itm center" >
                  Sent to chat!
                </div>

              </div>
            `,
            props: [],
            data() {
              return {
                done: 0,
              };
            },
            methods: {
              close1() {
                this.done = 1;
                setTimeout(() => {
                  this.close();
                }, 1500);
              },
              close2() {
                this.done = 2
                setTimeout(() => {
                  this.close();
                }, 1500);
              },
              close() {
                this.$popper.hideAll();
              },
            }
          },
          {
          }, // component props
          {
            reference: this.$refs.btnlink.$el,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: false,
            frameless: false,
            borderRadius: '0px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {placement: 'top'},
          }, // popper props
          {
            opened: () => {this.linkDropdownVisible = true},
            closed: () => {this.linkDropdownVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    */


  }
};
</script>


<style lang="scss">
#apps_panel {
  width: 100%;
  font-size: 14px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  overflow: hidden;
}

.apps_panel_wrap {
  position:relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .minheight{
    min-height: 250px;
  }

  .search-row {
    margin: 8px 12px 0 12px;

    .search {
      margin-bottom: 0;
      .md-input__before {
        color: rgba($color: white, $alpha: 0.95);
        fill: rgba($color: white, $alpha: 0.95);
      }
      .md-input {
        height: 28px;
        font-size: 14px;
        padding-left: 30px;
        color: rgba($color: white, $alpha: 0.95) !important;
        background: rgba($color: #000000, $alpha: .5) !important;
        border-color: rgba($color: white, $alpha: 0.5) !important;
        border-radius: 8px !important;

        &::placeholder {
          color: rgba($color: white, $alpha: 0.7) !important;
        }
        &:hover {
          border-color: rgba($color: white, $alpha: 0.7) !important;
        }
        &:focus {
          border-color: rgba($color: white, $alpha: 0.9) !important;
          box-shadow: 0 0 0 3px $md-blue-50 !important;
        }
      }

    }
  }
  

  .tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 12px 12px;
    user-select: none;

    .lft {
      flex-grow: 1;
      margin-right: 8px;
    }
    .dis-tab {
      display: flex;
      width: 56px;
      height: 28px;
      border-radius: 14px;
      border: 1px solid rgba($color: #FFFFFF, $alpha: .2);
      overflow: hidden;

      .btn {
        @include flex;
        width: 27px;
        height: 27px;
        .ico {
          opacity: .7;
        }

        &.active {
          background-color: rgba($color: #FFFFFF, $alpha: .2);
          .ico {
            opacity: 1;
          }
        }

      }
    }
    .rgt {
      @include flex(row, flex-end);

      .lb {
        font-size: 14px;
        opacity: .7;
        margin-right: 8px;
      }
      .btn {
        @include flex;
        height: 28px;
        padding: 0 12px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-sizing: border-box;
        border-radius: 8px;
        font-size: 14px;

        &.active {
          opacity: 1;
        }
        .ico {
          margin-left: 8px;
        }
      }
    }



    .tabs {
      position: relative;
      display: flex;
      user-select: none;
      flex-grow: 1;

      .tab {
        height: 28px;
        border-radius: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        margin-right: 8px;
        pointer-events: auto;
        font-size: 14px;
        opacity: 0.7;

        &:hover {
          opacity: .95;
          background-color: rgba(255, 255, 255, 0.07);
        }

        &:active, &.active {
          opacity: .95;
          background-color: rgba(255, 255, 255, 0.2);
        }

      }
    }

  }

  .scrollpane {
    margin: 0 10px;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-shrink: 1;
    flex-grow: 1;
    width: 100%;
    height: 100px;

    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE 10+ */
    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }
  }
  .list {
    width: 100%;
    padding-bottom: 10px;

    .accheader {
      height: 32px;
      display: flex;
      align-items: center;
      font-size: 14px;
      opacity: .7;
      margin: 4px 12px 0 12px;

      .icon {
        margin-left: 5px;
      }

    }

    .items {
      display: flex;
      
      .itm {
        position: relative;
        display: flex;
        
        &:active, &.active {
          background: rgba(255, 255, 255, 0.07);
          border-radius: 6px;
        }
        &.hand {
          cursor: pointer;
        }
        

        .lb {
          user-select: none;
        }

        .thumb {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          
          background-size: contain;
          background-repeat: no-repeat;

          .unread {
            position: absolute;
            top: -4px;
            right: -4px;
          }

        }

      }

      &.big-grid {
        flex-wrap: wrap;
        padding: 12px 0 0 0;

        .itm {
          position: relative;
          flex-direction: row;
          align-items: center;
          width: 100%;
          height: 60px;
          padding-left: 6px;
          max-width: 336px;
          margin-bottom: 12px;
          user-select: none;

          .thumbimg {
            width: 70px;
            height: 40px;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.07);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
            margin: 0 16px;
          }

          .tip {
            @include flex;
            position: absolute;
            background: #292929;
            border: 1px solid #3B3B3B;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.16);
            border-radius: 4px;
            height: 36px;
            font-size: 14px;
            padding: 0 12px;
            bottom: 0;
          }

          .rgt {
            flex-grow: 1;

            .lb {
              font-size: 16px;
              opacity: .95;
            }
            .des {
              font-size: 14px;
              margin-top: -4px;
              opacity: .7;
            }
          }

          .cornericon {
            @include flex;
            position: absolute;
            left: 10px;
            top: 0;
            width: 30px;
            height: 30px;
            background: #0F0F0F;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-sizing: border-box;
            border-radius: 50%;

            .img {
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: contain;
            }
          }
        }
      }

      &.grid {
        flex-wrap: wrap;
        align-items: center;
        padding: 12px 0 0 12px;

        .itm {
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          margin-right: 12px;
          width: 96px;
          height: 92px;
          border-radius: 8px;
          background-color: rgba($color: #FFF, $alpha: .05);

          .lb {
            font-size: 14px;
            text-align: center;
            margin-top: 8px;
            margin-bottom: -4px;
          }

          .thumb {
            width: 36px;
            height: 36px;
          }
        }
      }

      &.list {
        flex-wrap: wrap;
        padding: 12px 0 0 0;

        .itm {
          flex-direction: row;
          align-items: center;
          width: 100%;
          height: 50px;
          padding-left: 6px;
          max-width: 336px;
          margin-bottom: 12px;
          user-select: none;

          .thumb {
            width: 32px;
            height: 32px;
            margin: 0 12px;
          }

          .rgt {
            flex-grow: 1;

            .lb {
              font-size: 16px;
              opacity: .95;
            }
            .des {
              font-size: 14px;
              opacity: .7;
              margin-top: -4px;
            }
          }
        }
      }
      
    }


  }


  .app-placeholder {
    @include flex;
    width: 100%;
    flex-grow: 1;
    font-size: 20px;
    background: linear-gradient(180deg, #F55868 0%, #875AE0 100%);
  }


  .page {
    position: relative;
    flex-grow: 1;
    width: 100%;

    background-repeat: no-repeat;


    &.page_whiteboard_list {
      background-image: url(~@/assets/img/tmp_apps_panel_whiteboard_1.svg);
    }

    &.page_whiteboard_view {
      background-image: url(~@/assets/img/tmp_apps_panel_whiteboard_2.svg);

      .wb-tools {
        @include flex(row, center, flex-start);
        position: absolute;
        width: 100%;
        height: 40px;
        bottom: 20px;
        background-image: url(~@/assets/img/tmp_apps_panel_whiteboard_tools.svg);
        background-repeat: no-repeat;
        background-position: center;
      }

    }


    /*
    &.page_miro_list {
      background-image: url(~@/assets/img/tmp_apps_panel_miro_1.svg);
    }
    &.page_miro_view {
      background-image: url(~@/assets/img/tmp_apps_panel_miro_2.svg);

      .bot {
        @include flex(row, center, flex-start);
        position: absolute;
        width: 100%;
        height: 48px;
        bottom: 0;
        background-image: url(~@/assets/img/tmp_apps_panel_miro_2-2.svg);
        background-repeat: no-repeat;
        background-size: contain;
        background-color: #0F0F0F;
      }
    }


    &.page_polling {
      background-image: url(~@/assets/img/tmp_apps_panel_polling_1.svg);
    }
    &.page_polling2 {
      background-image: url(~@/assets/img/tmp_apps_panel_polling_2.svg);
    }
    */


  }



  /* theme ----- dark/hybrid */
  &.hybrid {
    color: $text-color-primary-light-ui;
  }
  &.dark {
    color: $text-color-primary-dark-ui;
  }
}

/*
.panel-apps-dropdown {
  display: flex;
  flex-direction: column;
  
  box-sizing: border-box;
  user-select: none;

  .itm {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding: 0 10px;
    height: 28px;

    &.center {
      justify-content: center;
    }

    &:hover {
      background: rgba($color: #FFFFFF, $alpha: .1);
    }
    &:active {
      background: rgba($color: #FFFFFF, $alpha: .2);
    }
  }
}
*/

/*
.popout-apps-miro {
  position: relative;
  width: 720px;
  height: 540px;
  background-repeat: no-repeat;
  background-position: 0 0;
  
  &.img1 {
    background-image: url(~@/assets/img/tmp_apps_panel_miro_popout1.svg);
  }
  &.img2 {
    background-image: url(~@/assets/img/tmp_apps_panel_miro_popout2.svg);
  }

  .miro_wrap {
    display: flex;
    position: absolute;
    width: 744px;
    height: 499px;
    top: 46px;
    left: 16px;
  }
}

.popout-apps-whiteboard {
  position: relative;
  width: 720px;
  height: 540px;
  background-repeat: no-repeat;
  background-position: center;
  
  &.img1 {
  }
  &.img2 {
    background-image: url(~@/assets/img/tmp_apps_large_whiteboard.svg);
  }

  .header {
    display: flex;
    position: absolute;
    width: 744px;
    height: 499px;
    top: 46px;
    left: 16px;
  }
  .tools {
    display: flex;
    position: absolute;
    width: 744px;
    height: 499px;
    top: 46px;
    left: 16px;
  }
}
*/

</style>
