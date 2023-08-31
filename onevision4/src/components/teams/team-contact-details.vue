<template>
    <div 
      class='contact-details'
      :style="{
        background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
        borderTopRightRadius: teamsSidecarName && !gptPanelPopouted || meetingsSidecarVisible ? '12px' : '0',
      }"
    >

        <wl-scrollbar 
          class="contact-details-content" 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
        >

          <div class="empty" v-if="!people">
            <div class="img"></div>
            <div class="title">Contacts</div>
            <div class="btns">
              <md-button class="btn md-button-solid" aria-label="x" :size="32" @click="addContact()" >Add a contact</md-button>
              <md-button class="btn md-button-outline" aria-label="x" :size="32" >Create a group</md-button>
            </div>
            <div class="suggest1">Suggested contacts</div>
            <div class="suggest2">
              <div
                v-for="(p, idx) in $store.getters.peopleList(contactList)"
                :key="`space-list1-item-${idx}`"
                class="itm"
              >
              <presence-avatar
                :title="p.name"
                :src="p.avatar ? avatarPath + p.avatar : ''" 
                :color="'white'"
                :backgroundColor="'#545454'"
                :size="48"
                :presence="p.status" 
                :theme="theme === 'light' ? 'light' : 'dark'"
                class="avatar" 
              />
                <div class="lb">{{p.name.split(' ')[0]}} {{p.name.split(' ')[1].substr(0,1)}}.</div>
              </div>
            </div>
          </div>

          <div class="profile" v-if="people">
            <div class="wp"></div>

            <div class="top">
              <div class="avatar" >
                <presence-avatar
                  :title="selectedPeople.name"
                  :src="selectedPeople.avatar ? avatarPath + selectedPeople.avatar : ''" 
                  :color="'white'"
                  :backgroundColor="'#545454'"
                  :size="88"
                  :presence="selectedPeople.status" 
                  :theme="theme === 'light' ? 'light' : 'dark'"
                />
                
              </div>
              <div class="txt">
                <div class="name">{{selectedPeople.name}}</div>
                <div class="status">{{selectedPeople.statusTxt}}</div>
              </div>
              <div class="btns">
                <div class="btn btn-message">
                  <wl-icon name="chat-bold" size="16" color="white" />
                </div>
                <div class="btn btn-audiocall">
                  <wl-icon name="handset-bold" size="16" color="white" />
                </div>
                <div class="btn btn-videocall">
                  <wl-icon name="camera-bold" size="16" color="white" />
                </div>
              </div>
            </div>
            
            <div class="tools">
              <!--md-button class="btn md-button-outline" aria-label="x" :size="28" @click="addSpeedDial">Add as speed dial</md-button-->
              <md-button class="btn md-button-outline" aria-label="x" :size="28" >Edit contact</md-button>
              <md-button class="btnc md-button-outline" aria-label="x" :size="28" ref="morebtn" @click="showMore">
                <wl-icon name="more-bold" size="16" />
              </md-button>
            </div>
            <div class="title">
              <span class="t">Profile</span>
            </div>

            <div class="bot">
              <div class="col">
                <div class="lb1">Title</div>
                <div class="lb2">ENGINEER.SOFTWARE ENGINEERING</div>

                <div class="lb1">Department</div>
                <div class="lb2">1800263788</div>

                <div class="lb1">Manager</div>
                <div class="lb2">Sherry McKenna</div>
              </div>
              <div class="col">
                <div class="lb1">Phone</div>

                <div 
                  v-for="(itm, idx) in selectedPeople.numbers"
                  :key="`num${idx}`"
                  class="lb2"
                >
                  {{getNumber(itm, 0)}}: 
                  <span class="linkcombo">
                    <span class="link">{{getNumber(itm, 1)}}</span>
                    <div class="btn-circle" v-tooltip="'Copy'">
                      <wl-icon
                        name="copy-bold" 
                        :color=" theme === 'light' ? 'black-95' : 'white-95' "
                        size="16"
                      />
                    </div>
                    <div class="btn-circle" @click="addSpeedDial(itm)" :disabled="numberIsSpeedDial(itm)" v-tooltip="numberIsSpeedDial(itm) ? 'Speed dial already exists' : 'Add to speed dials'" >
                      <wl-icon
                        name="plus-bold" 
                        :color=" theme === 'light' ? 'black-95' : 'white-95' "
                        size="16"
                      />
                    </div>
                  </span>
                </div>

                <div class="lb1">Email</div>
                <div class="lb2"><span class="link">{{selectedPeople.name.toLowerCase().replace(/ /g, '.') + '@acmeinc.com'}}</span></div>

                <div class="lb1">Personal meeting room</div>
                <div class="lb2"><span class="link">cisco.webex.com/meet/{{selectedPeople.name.toLowerCase().replace(/ /g, '')}}</span></div>
              </div>
            </div>

          </div>

        </wl-scrollbar>

    </div>
</template>

<script>
import _ from 'lodash';
import popContactCreate from './pop-contact-create.vue';
import popSpeedDialAdd from './pop-speed-dial-add.vue';
import contextMenu from './../shared/contextmenu.vue';

export default {
    props:{
      id: String,
      people: String,
    },
    data() {
        return {
          moreVisible: false,
          moreList: [
          {
            label: 'Edit contact',
          },
          {
            label: 'Remove from contacts',
          },
          {
            label: 'Copy to group',
            sub: true,
          },
          {
            label: 'Move to group',
            sub: true,
          },
          {
            label: 'Hide my availability and status',
          },
          {
            label: 'divider',
          },

        ],

          contactList: [
            'David Liam',
            'Linda Wu',
            'Ruchika Prabhavalkar',
          ],
        }
    },
    computed:{
      theme() {
        const t = this.$store.state.theme;
        return t === 'dark' ? 'dark' : 'light';
      },
      themeColor() {
        return this.$store.state.themeColor;
      },
      themeColorList() {
        return this.$store.state.themeColorList;
      },
      avatarPath() {
        return this.$store.state.avatarPath;
      },
      avatarBgColors() {
        return this.$store.state.avatarBgColors;
      },
      selectedPeople() {
        return this.$store.getters.people(this.people);
      },
      speedDialPeopleList(){
        return this.$store.state.speedDialPeopleList;
      },
      teamsSidecarName() {
        return this.$store.state.teamsSidecarName;
      },
      gptPanelPopouted() {
        return this.$store.state.gptPanelPopouted;
      },
      meetingsSidecarVisible() {
        return this.$store.state.meetingsSidecarVisible;
      },
    },
    mounted(){

    },
    watch: {

    },
    methods:{
      random(l, h) {
        return _.random(l, h);
      },

      getSpeedDialMenuItems(pname) {
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
        return list
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

      getNumber(str, part) {
        return str.split(': ')[part]
      },

      numberIsSpeedDial(num) {
        return this.getSpeedDialNumbers().includes(num);
      },

      getSpeedDialNumbers() {
        var pl = this.speedDialPeopleList.slice();
        var nums = pl.reduce(
          (arr, itm) => {
            arr.push(itm.speeddial);
            return arr;
          },
          []
        );
        return nums;
      },

      showMore(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.moreVisible) {
          this.$popper.show(
            contextMenu,
            {
              items: this.moreList.concat([this.getSpeedDialMenuItems(this.people)]),
              onSelect: (itm) => { 
                let people = {...this.selectedPeople, ...{speeddial:itm.data}};
                if (itm.value === 'add-speed-dial') {
                  this.addSpeedDial(itm.data);
                } else if (itm.value === 'edit-speed-dial') {
                  this.editItem(people);
                } else if (itm.value === 'remove-speed-dial') {
                  this.deleteItem(people);
                }
              },
            }, // component props
            {
              name: 'contextmenu',
              reference: this.$refs.morebtn.$el,
              affiliatedElementSelector: ['[name="contextmenu"]', '[name="contextmenu-level1"]', '[name="contextmenu-level2"]'],
              transitionEnabled: false,
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
              opened: () => {this.moreVisible = true},
              closed: () => {this.moreVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      addContact(name) {
        this.$modal.show(
          popContactCreate,
          {
            peoplename: name,
            onAdd: () => {
              this.selectTab1(1);
            },
          }, // component props
          {
            name: 'contact-create',
            clickToClose: false,
            frameless: false,
            shadow: true,
            resizable: false,
            resizeEdges: ['br', 'b', 'r'],
            draggable: '#pop-contact-create .head',
            roundedCorner: false,
            overlayVisible: true,
            overlayTransparent: 0,
            theme: this.theme,
            width: 374,
            height: 518,
            transition: true,
          }, // modal props
          {} // modal eventlistener
        );

      },

      addSpeedDial(itm) {
        if (this.numberIsSpeedDial(itm)) {
          return;
        }
        var name = this.people
        this.$modal.show(
          popSpeedDialAdd,
          {
            defaultSelectedNumber: itm ? itm : '',
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
    }
}
</script>



<style lang="scss">
.contact-details {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: row;
  user-select: none;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 12px 0 0px 0px;
  color: $text-color-primary-light-ui;

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 1;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;

    .wl-scrollbar__area {
      width: 100%;
    }

    .empty{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      max-width: 360px;
      margin: 0 auto;

      .img {
        width: 248px;
        height: 248px;
        background: url(~@/assets/img/empty-state-space-people.svg) no-repeat;
        background-size: contain;
      }

      .title {
        font-weight: 600;
        font-size: 26px;
        opacity: .95;
        line-height: 30px;
        margin-bottom: 5px;
        margin-top: -20px;
      }
      
      .btns {
        display: flex;
        margin-top: 30px;
        margin-bottom: 68px;

        .btn {
          padding: 0 20px;
          margin: 0 4px;
          font-size: 16px;
        }
      }

      .suggest1 {
        font-size: 16px;
        opacity: .7;
      }
      .suggest2 {
        @include flex;
        margin-top: 28px;

        .itm {
          @include flex(column);
          width: 90px;
          height: 64px;
          margin: 0 8px;

          .lb {
            font-size: 14px;
            opacity: .95;
            margin-top: 2px;
          }
        }
      }
    }

    .profile {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;

      .wp {
        position: absolute;
        width: 100%;
        height: 96px;
        left: 0px;
        top: 0px;
        background: rgba($color: #000000, $alpha: .05);
      }

      .top {
        position: relative;
        display: flex;
        margin: 64px 0 0 24px;

        .avatar {
          position: relative;
          width: 84px;
          height: 84px;
          margin-bottom: 12px;

          .md-avatar {
            width: 84px;
            height: 84px;
          }
        }

        .txt {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          padding: 16px 0 0 24px;

          .name {
            font-size: 20px;
            font-weight: bold;
          }
          .status {
            font-size: 14px;
            opacity: .7;
            margin-top: -4px;
          }
        }

        .btns {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
          margin-right: 24px;
          
          .btn {
            @include flex;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-left: 8px;
            color: white;
          }

          .btn-message {
            background-color: $md-blue-60;
          }
          .btn-audiocall {
            background-color: $md-green-60;
          }
          .btn-videocall {
            background-color: $md-green-60;
          }
        }
      }

      .tools {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 24px;

        .btn {
          padding: 0 10px;
          font-size: 14px;
          margin-left: 8px;
        }
        .btnc {
          width: 28px;
          min-width: 0;
          padding: 0;
          margin-left: 8px;
        }
      }

      .title {
        display: flex;
        align-items: center;
        position: relative;
        padding-bottom: 10px;
        margin: -20px 24px 0 24px;
        pointer-events: none;

        border-bottom: 1px solid rgba($color: #000000, $alpha: .2);

        .t {
          flex-grow: 1;
          opacity: .7;
          margin-bottom: -8px;
        }
        path {
          fill: black;
        }
      }

      .bot {
        position: relative;
        display: flex;
        margin: 0 24px;
        padding-top: 10px;

        .col {
          width: 50%;
        }

        .link {
          color: $text-color-hyperlink-light-ui;
          text-decoration: underline;
        }
        .lb1 {
          font-size: 14px;
          opacity: .7;
          margin-top: 20px;
        }
        .lb2 {
          display: flex;
          align-items: center;
          font-size: 14px;
        }

        .linkcombo {
          display: flex;
          align-items: center;
          margin-left: 4px;
          padding-left: 8px;
          padding-right: 55px;
          border-radius: 8px;

          .btn-circle {
            display: none;
          }

          &:hover {
            background: rgba(255, 255, 255, 0.07);
            padding-right: 0;
            .btn-circle {
              display: flex;
            }
          }
        }

        .btn-circle {
          @include flex;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-left: 4px;

          &[disabled] {
            opacity: .4;
          }
        }
        
      }

    }

  }

}

/* theme ----- dark */

.dark {
  .contact-details {
    color: $text-color-primary-dark-ui;

    &-content {
      .profile {
        .wp {
          background: rgba($color: #FFFFFF, $alpha: .05);
        }
        .title {
          border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: .2);

          path {
            fill: white;
          }
        }
        .bot {
          .link {
            color: $text-color-hyperlink-dark-ui;
          }
        }
      }
    }
  }
}

</style>
