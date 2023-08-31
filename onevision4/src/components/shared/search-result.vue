<template>
  <div
    class="search-result" 
    :theme="theme === 'light' ? 'light' : 'dark'"
    :style="{
      width: width,
      height: height,
      maxHeight: maxHeight,
    }"
  >
    <div class="search-result-list" @mouseleave="leaveItems">
      <div class="search-result-active-bg" :class="{trans: transEnabled}" ></div>

      <div 
        v-if="showInputNumber"
        class="itm-call itm-call-num" 
        :class="{active: true}"
        @click="selectItem({
            id: 'c0000',
            name: keyword,
            avatar: null,
            group: 1,
            isNumber: true,
          })"
      >
        <div class="row1" @click="firstRowClick" >
          <span class="left">

            <div class="txt">
              <span v-if="layout !== 'speed-dial' && layout !== 'contact'" class="lb" >
                {{keyword}}
              </span>
              <span v-if="layout === 'speed-dial'" class="lb" >
                Create a speed dial for "<b>{{keyword}}</b>"
              </span>
              <span v-if="layout === 'contact'" class="lb" >
                Create contact "<b>{{keyword}}</b>"
              </span>
            </div>
          </span>

        </div>

        <div class="buttons" >
          <md-button 
            v-if="noResultButtons.includes('call')"
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="startAudioCall($event, {
              number: keyword,
              people: {
                id: 'c0000',
                name: keyword,
                avatar: null,
                group: 1,
                isNumber: true,
              },
            })"
          >
            <wl-icon name="handset-bold" size="16" color="white" />
          </md-button>

          <md-button 
            v-if="noResultButtons.includes('conference-audio-call')"
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="conferenceAudioCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="handset-bold" size="16" color="white" />
          </md-button>

          <md-button 
            v-if="noResultButtons.includes('conference-video-call')"
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="conferenceVideoCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="camera-bold" size="16" color="white" />
          </md-button>

          <md-button 
            v-show="noResultButtons.includes('consult') && (itm.sub || itm.speeddial)"
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
            v-show="noResultButtons.includes('transfer')"
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

          <md-button 
            v-if="noResultButtons.includes('people-add')"
            class="btn white" 
            aria-label="x" 
            :size="28" 
            @click="peopleCreate($event, {
              keyword: keyword,
            })"
          >
            <wl-icon name="participant-add-bold" size="16" color="white" />
          </md-button>

          <!--md-button 
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="startVideoCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="camera-bold" size="16" color="white" />
          </md-button-->

        </div>

      </div>
      
      
      <div v-if="layout !== 'people'" class='section-tit' >
        Recents & People
      </div>
      <div v-if="layout === 'people'" style="height: 8px;" ></div>
      
      <div 
        v-for="(itm, idx) in getlist(1).slice(0, layout !== 'people' ? 3 : 5)"
        :key="`contitm-g1-${idx}`"
        class="itm-call" 
        :class="{active: !showInputNumber && activeItem && itm.id === activeItem.id}"
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

              v-tooltip="false && !itm.isNumber ? {
                content: contactCardTemplate(itm.name), 
                html: true,
                placement: 'right',
                classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                autoHide: false,
                delay: 200,
              } : null"
            />
            
            <div class="txt">
              <span class="lb" >
                <HighlightText :keyword="keyword" :sensitive="false" :overWriteStyle="highlightStyle">{{ itm.name }}</HighlightText>
                <span v-if="itm.num" class="num">({{itm.num}})</span>
              </span>
              <span v-if="itm.sub && layout !== 'people'" class="lb2"><HighlightText :keyword="keyword" :sensitive="false" :overWriteStyle="highlightStyle">{{ itm.sub }}</HighlightText></span>
            </div>
          </span>
          
          <span v-if="layout !== 'people'" class="right" :class="{replaced: listItemButtons.length > 0 || layout === 'speed-dial' && getSpeedDialNames()[itm.name]}">
            <div class="txt">
              <span class="lb">{{itm.date}}</span>
              <span v-if="itm.dur" class="lb2">{{itm.dur}}</span>
            </div>
            
          </span>
          
          <span v-if="layout !== 'people'" class="mid" :class="{replaced: listItemButtons.length > 0 || layout === 'speed-dial' && getSpeedDialNames()[itm.name]}">
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

        <div v-if="layout === 'speed-dial' && getSpeedDialNames()[itm.name]" class="buttons" >
          <span class="lb">{{getSpeedDialNames()[itm.name]}} added</span>
        </div>

        <div v-if="listItemButtons.length > 0" class="buttons" >
          <md-button 
            v-if="listItemButtons.includes('call')"
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="startAudioCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="handset-bold" size="16" color="white" />
          </md-button>

          <md-button 
            v-if="listItemButtons.includes('conference-audio-call')"
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="conferenceAudioCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="handset-bold" size="16" color="white" />
          </md-button>

          <md-button 
            v-if="listItemButtons.includes('conference-video-call')"
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="conferenceVideoCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="camera-bold" size="16" color="white" />
          </md-button>

          <md-button 
            v-show="listItemButtons.includes('consult') && (itm.sub || itm.speeddial)"
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
            v-show="listItemButtons.includes('transfer')"
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


      </div>

      <div v-if="getlist(1).length > 3 && layout !== 'people'" class='section-more text-link' >
        Show more
      </div>

      <div v-if="getlist(1).length === 0" class='section-empty' >
        No results
      </div>





      <div v-if="layout !== 'people'" class='section-tit' >
        Outlook contacts
      </div>

      <div 
        v-for="(itm, idx) in getlist(2).slice(0,3)"
        :key="`contitm-g2-${idx}`"
        class="itm-call" 
        :class="{active: !showInputNumber && activeItem && itm.id === activeItem.id}"
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
              
              :theme="theme === 'light' ? 'light' : 'dark'"
              class="avatar" 

              v-tooltip="false && !itm.isNumber ? {
                content: contactCardTemplate(itm.name), 
                html: true,
                placement: 'right',
                classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                autoHide: false,
                delay: 200,
              } : null"
            />
            
            <div class="txt">
              <span class="lb" >
                <HighlightText :keyword="keyword" :sensitive="false" :overWriteStyle="highlightStyle">{{ itm.name }}</HighlightText>
                <span v-if="itm.num" class="num">({{itm.num}})</span>
              </span>
            </div>
          </span>

        </div>

        <div v-if="layout === 'speed-dial' && getSpeedDialNames()[itm.name]" class="buttons" >
          <span class="lb">{{getSpeedDialNames()[itm.name]}} added</span>
        </div>

        <div v-if="listItemButtons.length > 0" class="buttons" >
          <md-button 
            v-if="listItemButtons.includes('call')"
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="startAudioCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="handset-bold" size="16" color="white" />
          </md-button>

          <md-button 
            v-if="listItemButtons.includes('conference-audio-call')"
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="conferenceAudioCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="handset-bold" size="16" color="white" />
          </md-button>

          <!--md-button 
            class="btn green" 
            color="green"
            aria-label="x" 
            :size="28" 
            @click="startVideoCall($event, {
              number: '+1 888 555 1234',
              people: itm,
            })"
          >
            <wl-icon name="camera-bold" size="16" color="white" />
          </md-button-->

        </div>

      </div>

      <div v-if="getlist(2).length > 3" class='section-more text-link' >
        Show more
      </div>

      <div v-if="getlist(2).length === 0 && layout !== 'people'" class='section-empty' >
        No results
      </div>
      



      <div v-if="layout !== 'people'" class='section-tit' >
        Devices
      </div>
      <div v-if="layout !== 'people'" class='section-empty' >
        No results
      </div>



    </div>

  </div>
</template>

<script>

import HighlightText from 'vue-highlight-text';
// import mframe from 'mframe'
import _ from 'lodash';

export default {
  components: {
    HighlightText,
  },
  props:{

    keyword: {
      type: String,
      default: '',
    },
    showInputNumber: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: 'auto',
    },
    maxHeight: {
      type: String,
      default: '999px',
    },
    layout: {
      type: String,
      default: '', // simple, widget, speed-dial, contact, transfer-call, people
    },
    noResultButtons: {
      type: Array,
      default: () => ['call'],
    },
    listItemButtons: {
      type: Array,
      default: () => ['call'],
    },
    onSelect: {
      type: Function,
    },
    onCall: {
      type: Function,
    },
    onCreatePeople: {
      type: Function,
    },
    onConsult: {
      type: Function,
    },
    onTransfer: {
      type: Function,
    },
    onConferenceAudioCall: {
      type: Function,
    },

  },
  data() {
      return {
        activeItem: {},
        activeItemNavId: -1,
        transEnabled: false,
        highlightStyle: {
          color: this.theme === 'light' ? 'black' : 'white',
          fontWeight: 'bold',
        },

        datalist: [
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
            dir: 'out',
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

          
        ],
        
      }
  },
  computed:{
    theme() {
      return this.$store.state.theme;
    },
    avatarPath(){
      return this.$store.state.avatarPath;
    },
    avatarBgColors() {
      return this.$store.state.avatarBgColors;
    },
    callingPeopleItems() {
      return this.$store.state.callingPeopleItems;
    },
    speedDialPeopleList() {
      return this.$store.state.speedDialPeopleList;
    },
    contactPeopleList() {
      return this.$store.state.contactPeopleList;
    },
    callAs() {
      return this.$store.state.callAs;
    },

  },
  beforeMount() {
    var contacts = this.contactPeopleList['other'].slice(0,2);

    _.forEach(this.datalist, (value) => {
      let pp = value
      let people = this.$store.getters.people(pp.name)
      if (people) {
        pp.numbers = people.numbers
        pp.status = people.status
      }
    });

    _.forEach(contacts, (value) => {
      let people = this.$store.getters.people(value)
      if (!this.inList(people.name)) {
        let pp = _.cloneDeep(people)
        // remove from outlook contacts list if he is added to webex contact
        let idx = _.findIndex(this.datalist, p => p.name == pp.name);
        if (idx >= 0) {
          this.datalist[idx].group = 1
        } else {
          pp.group = 1
          pp.id = _.random(999, 9999);
          this.datalist.unshift(pp)
        }
      }
      
    });

    if (this.layout !== 'transfer-call') {
      this.activeItemNavId = 0
      if (this.getlist(1).length > 0 ) {
        this.activeItem = this.getlist(1)[0];
      } else if (this.getlist(2).length > 0 ) {
        this.activeItem = this.getlist(2)[0];
      }
    }
    
  },
  mounted(){
    window.addEventListener('keydown', this.onKeydown);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown);
  },

  watch: {

  },
  methods:{
    random(l, h) {
      return _.random(l, h);
    },
    inList(name) {
      var exist = false
      _.forEach(this.datalist, (value) => {
        let pp = value
        if (pp.group === 1 && pp.name === name) {
          exist = true
        }
      });
      return exist
    },
    getlist(group) {
      if (this.layout === 'people' && group !== 1) {
        return []
      }
      return this.datalist.filter(itm => itm.group == group && (itm.name.toLowerCase().indexOf(this.keyword.toLowerCase()) >= 0 || itm.sub && itm.sub.toLowerCase().indexOf(this.keyword.toLowerCase()) >= 0))
    },
    contactCardTemplate(name) {
      return this.$store.getters.contactCardTemplate(name, false);
    },

    hoverItem(e) {
      this.moveItemBg(e.id);
    },
    leaveItems() {
      document.querySelector(`.search-result-active-bg`).style.opacity = '0';
      this.transEnabled = false;
    },
    moveItemBg(id) {
      if (id === this.activeItem.id) {
        this.leaveItems();
        return;
      }
      const rect = document.getElementById(id).getBoundingClientRect();
      const rect2 = document.querySelector(`.search-result-list`).getBoundingClientRect();
      const scrollcontent = document.querySelector(`.search-result .wl-scrollbar__area`);
      document.querySelector(`.search-result-active-bg`).style.top = `calc(${rect.top - rect2.top}px + ${scrollcontent.style.marginTop})`;
      document.querySelector(`.search-result-active-bg`).style.opacity = '1';
      
      if (!this.transEnabled) {
        requestAnimationFrame(() => {
          this.transEnabled = true;
        });
      }
    },
    selectItem(itm) {
      this.$emit('select', itm);
      if (this.onSelect) {
          this.onSelect(itm);
          this.$emit('close');
        }
    },

    stopPropagation(e) {
      e.stopPropagation();
    },

    startAudioCall(e, info) {
      e.stopPropagation();

      var layout = 'widget';
      var incall = _.cloneDeep(this.callingPeopleItems);
      var ppp = this.$store.getters.people(info.people.name)
      var ppl = _.merge(info.people, ppp)
      ppl.callasIndex = this.callAs.id
      info.people = ppl
      
      var list = incall[layout]
      if (list.length < 2) {
        var i, itm
        for (i=0; i<list.length; i++) {
          itm = list[i];
          if (itm.people.name === info.people.name) {
            return;
          }
        }
        for (i=0; i<list.length; i++) {
          itm = list[i];
          if (!itm.incoming) {
            itm.onhold = true
          }
        }
        list.push(info);
        incall[layout] = list;
        this.$store.commit('callingPeopleItems', incall);

        if (this.onCall && this.layout === 'simple') {
          this.onCall(this.layout);
        }
      }

      this.$emit('close');
    },

    firstRowClick(e) {
      if (this.layout === 'speed-dial' || this.layout === 'contact') {
        this.peopleCreate(e, {keyword: this.keyword})
      }
    },

    peopleCreate(e, info) {
      e.stopPropagation();
      if (this.onCreatePeople) {
        this.onCreatePeople(info);
      }

      this.$emit('close');
    },

    getSpeedDialNames() {
      var pl = this.speedDialPeopleList.slice();
      var nums = pl.reduce(
        (obj, itm) => {
          if (!obj[itm.name]) {
            obj[itm.name] = 1
          } else {
            obj[itm.name]++
          }
          return obj;
        },
        {}
      );
      return nums;
    },

    onKeydown(evt) {
      // console.log('evt.code', evt.code, evt.altKey);
      const list = this.getlist(1).slice(0,3).concat(this.getlist(2).slice(0,3));
      if (list.length > 0) {
        if (evt.code == 'ArrowDown') {
          if (this.activeItemNavId < list.length - 1) {
            this.activeItemNavId++;
          } else {
            this.activeItemNavId = 0;
          }
          
        } else if (evt.code == 'ArrowUp') {
          if (this.activeItemNavId > 0) {
            this.activeItemNavId--;
          } else {
            this.activeItemNavId = list.length - 1;
          }
        }

        this.activeItem = list[this.activeItemNavId];
      }

    },


    showConsultPop(evt, item) {
      this.activeItem = item;
      let onClose = () => {
        this.activeItem = {}
      }
      this.onConsult(evt, item, onClose);
    },
    transfer(evt, item) {
      this.onTransfer(evt, item);
      this.$emit('close');
    },
    conferenceAudioCall(evt, item) {
      this.onConferenceAudioCall(evt, item);
      this.$emit('close');
    },
    conferenceVideoCall() {

    },

  }
}
</script>


<style lang="scss">
.search-result {
  flex-shrink: 1;
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  margin-bottom: 16px;
  user-select: none;

  &-list {
    margin: 0 8px;

    .search-result-active-bg {
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
        transition: all 0.3s ease;
      }
    }
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

    &.itm-call-num {
      height: 40px;
      border-radius: 20px;
      margin-top: 8px;

      .row1 {
        height: 40px;
      }
    }

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

    &.active {
      height: auto;
      overflow: visible;
    }

    &:hover {
      background: rgba($color: #000000, $alpha: 0.07);
    }
    &:active, &.active {
      background: rgba($color: #000000, $alpha: 0.11);
    }
    &:hover, &:active, &.active {
      .left {
        mask: linear-gradient(to right, rgba($color: #000000, $alpha: 1.0) 80%, rgba($color: #000000, $alpha: 0.0) 90%);
        mask-repeat: no-repeat;
      }
      .buttons {
        display: flex;
      }
      .replaced {
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

      .lb {
        font-size: 14px;
        opacity: .7;
      }

      .white {
        background: rgba($color: #FFF, $alpha: .95);

        svg path {
          fill: #000;
        }

        &:hover {
          background: rgba($color: #FFF, $alpha: .8);
        }
        &:active {
          background: rgba($color: #FFF, $alpha: .7);
        }
      }
    }
  }



}

/* theme ----- dark/hybrid */
.dark, .hybrid {
  .search-result {

    &-list {
      .search-result-active-bg {
        background-color: rgba(255, 255, 255, 0.07);
      }
    }

    .itm-call {

      .right {
        .btn {
          &.md-button-solid {
            svg path {
              fill: #000000;
            }
          }
          &.md-button-outline {
            svg path {
              fill: #FFFFFF;
            }
          }
        }
      }

      &:hover {
        background: rgba($color: #FFFFFF, $alpha: 0.07);
      }
      &:active, &.active {
        background: rgba($color: #FFFFFF, $alpha: 0.11);
      }
    }

  }
}
</style>
