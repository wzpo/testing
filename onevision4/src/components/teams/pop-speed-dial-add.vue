<template>
  <div id="pop-speed-dial-add"
    :class="[os, theme]"
  >
    <div id="pop-speed-dial-add-titlebar" class="head">
      <div class="head2">
        <div class="left">
          Webex
        </div>
        <div class='close' @click='close' >
          <wl-icon name="cancel-bold" size="16" />
        </div>
      </div>

    </div>

    <div class="des">{{isEdit ? 'Edit a speed dial' : 'Add a speed dial'}}</div>

    <div v-show="step===1" class="tools">
      <md-input 
        class="md-search-input search searchinput" 
        ref="searchinput"
        clear
        placeholder="Enter a name or number"
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
    </div>

    <div v-show="step===1" class="search-result-list">

      <div class='section-tit' >
        Suggested
      </div>
      
      <wl-scrollbar 
        ref="scrollbar" 
        class='cont-wrap' 
        :theme="theme === 'dark' ? 'dark' : 'light'"
        :arrowVisible="$store.state.os==='win'"
        :alwaysVisible="true"
      >
        <div class="scrollcont">

          <div class="cont-area cont-list">
            <div 
              v-for="(itm, idx) in $store.getters.peopleList(sdPeopleList)"
              :key="`contitm-g1-${idx}`"
              class="itm-call" 
              @click="addSpeedDial(itm)"
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

                    v-tooltip="!itm.isNumber ? {
                      content: contactCardTemplate(itm.name), 
                      html: true,
                      placement: 'right',
                      classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                      autoHide: false,
                      delay: 200,
                    } : null"
                  />
                  
                  <div class="txt">
                    <span class="lb">
                      {{ itm.name }}
                      <span v-if="itm.num" class="num">({{itm.num}})</span>
                    </span>
                  </div>
                </span>

                <span v-if="getSpeedDialNames()[itm.name]" class="right">
                  {{getSpeedDialNames()[itm.name]}} added
                </span>
                

              </div>



            </div>
          </div>
        </div>
      </wl-scrollbar>

    </div>

    <div v-show="step===2" class="add-step2">

      <div class="content">
        <md-avatar 
          :title="people.name"
          :src="people.avatar ? avatarPath + people.avatar : ''" 
          class="avatar" 
        />
        <div class="name">{{people.name}}</div>
        <div class="cblb">Phone</div>
        <div class="combobox" ref="cb_contact" @click="showDropdown('cb_contact')" >
          <span class="lb">{{selectedNumber}}</span>
          <span class="ico">
            <wl-icon v-if="!dropdownVisible" name="arrow-down-filled" size="16" />
            <wl-icon v-if="dropdownVisible" name="arrow-up-filled" size="16" />
          </span>

        </div>

        <div v-if="!isEdit && !isContact" class="info">
          Adding {{people.name}} to your speed dials will also add them to your contacts.
        </div>
      </div>

      <div class="btns">
        <md-button class="btn md-button-solid" :disabled="!validate()"  aria-label="x" :size="32" @click="addSpeedDial2">{{isEdit ? 'Save' : 'Add'}}</md-button>
        <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="close">Cancel</md-button>
      </div>

    </div>


    

  </div>
</template>

<script>
import _ from 'lodash'
import searchResult from './../shared/search-result.vue';
import popSpeedDialCreate from './pop-speed-dial-create.vue';

export default {
  props: [
    'peoplename',
    'editpeople',
    'defaultSelectedNumber',
    'onAdd',
  ],

  data() {
    return {
      isEdit: false,
      nunberBeforeEdit: null,
      step: 1,
      people: {},
      selectedNumber: '',
      searchcontent: '',
      activeItem: {},
      activeItemNavId: 0,
      dropdownVisible: false,
      highlightStyle: {
        color: this.theme === 'light' ? 'black' : 'white',
        fontWeight: 'bold',
      },
      sdPeopleList: [
        'David Liam',
        'Emma Hirst',
        'Sarah Robertson',
        'Benjamin Vitali',
        'Benoit Lapointe',
        'Ruchika Prabhavalkar',
        'Dheeraj Bhasin',
        'Peter Hogan',
        'James Weston',
        'Marc Brown',
      ],

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
    avatarBgColors() {
      return this.$store.state.avatarBgColors;
    },
    avatarPath() {
      return this.$store.state.avatarPath;
    },
    me(){
      return this.$store.getters.me;
    },
    speedDialPeopleList(){
      return this.$store.state.speedDialPeopleList;
    },
    contactPeopleList(){
      return this.$store.state.contactPeopleList;
    },
    isContact(){
      var found = false;
      _.forEach(this.contactPeopleList, (value) => {
        if (!found && value.includes(this.people.name)) {
          found = true
        }
      });
      return found;
    },

  },
  mounted() {
    if (this.peoplename) {
      this.people = this.$store.getters.people(this.peoplename);
      if (this.defaultSelectedNumber) {
        this.selectedNumber = this.defaultSelectedNumber
      } else {
        if (!this.getSpeedDialNumbers().includes(this.people.numbers[0])) {
          this.selectedNumber = this.people.numbers[0];
        } else if (!this.getSpeedDialNumbers().includes(this.people.numbers[1])) {
          this.selectedNumber = this.people.numbers[1];
        }
      }

      this.step = 2;
    }
    if (this.editpeople) {
      this.people = this.editpeople;
      this.nunberBeforeEdit = this.editpeople.speeddial;
      this.selectedNumber = this.editpeople.speeddial;
      this.step = 2;
      this.isEdit = true;
    }

  },
  watch: {
    searchcontent(newVal) {
      if (newVal) {
        const popername = 'calling-search-result'
        this.$popper.hide(popername);
        this.$popper.show (
          searchResult,
          {
            width: `${this.$refs.searchinput.$el.getBoundingClientRect().width}px`,
            keyword: this.searchcontent,
            layout: 'speed-dial',
            showInputNumber: true,
            noResultButtons: ['people-add'],
            listItemButtons: [],
            onSelect: this.addSpeedDial,
            onCreatePeople: this.createSpeedDial,
            //onCall: this.showCallWidget,
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

  },
  methods: {
    validate() {
      return this.selectedNumber && !this.getSpeedDialNumbers().includes(this.selectedNumber);
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

    addSpeedDial(obj) {
      if (!obj.numbers) {
        console.log('如何处理这种只有号码的情况....');
        return;
      }
      if (this.speedDialPeopleList.length === 20) {
        return
      }
      if(!this.selectedNumber) {
        if(!this.getSpeedDialNumbers().includes(obj.numbers[0])) {
          this.selectedNumber = obj.numbers[0];
        }else if(!this.getSpeedDialNumbers().includes(obj.numbers[1])) {
          this.selectedNumber = obj.numbers[1];
        }
      }
      this.people = _.cloneDeep(obj);
      this.step = 2;
    },
    addSpeedDial2() {
      var pl = this.speedDialPeopleList.slice();
      if (this.isEdit) {
        for(var i=0; i<pl.length; i++){
          if (pl[i].name === this.people.name && pl[i].speeddial === this.nunberBeforeEdit) {
            pl[i].speeddial = this.selectedNumber
            break
          }
        }
        this.$store.commit('speedDialPeopleList', pl);
        this.close();
        return
      }
      this.people = _.cloneDeep(this.people);
      this.people.id = _.random(10000, 99999)
      this.people.speeddial = this.selectedNumber
      pl.push(this.people);
      this.$store.commit('speedDialPeopleList', pl);
      console.log(pl)

      // 
      if (!this.isContact) {
        var contacts = _.cloneDeep(this.contactPeopleList);
        var lst = contacts['other'].slice();
        lst.unshift(this.people.name);
        contacts['other'] = lst;
        this.$store.commit('contactPeopleList', contacts);
      }

      if (this.onAdd) {
        this.onAdd();
      }
      this.close();
    },
    createSpeedDial(obj) {
      this.$modal.show(
        popSpeedDialCreate,
        {
          name: obj.keyword
        }, // component props
        {
          name: 'speeddial-create-people',
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: '#pop-speed-dial-create .head',
          roundedCorner: false,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          width: 400,
          height: 506,
          transition: true,
        }, // modal props
        {} // modal eventlistener
      );

      this.close();
    },

    showDropdown(ref) {
      this.$popper.show(
        {
          template: `
            <div class="common-menulist" style="width:360px;">
              <div class='common-menulist-item common-menulist-item-48' :class="{disabled: inuseNumbers.includes(numbers[0])}" @click="select(numbers[0])" >
                <span class="lb">{{numbers[0]}}</span>
                <svg v-if="selectedNumber === numbers[0] && !inuseNumbers.includes(numbers[0])" class="suffix" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                </svg>
                <span v-if="inuseNumbers.includes(numbers[0])" class="suffix inuse">In use</span>
              </div>
              <div class='common-menulist-item common-menulist-item-48' :class="{disabled: inuseNumbers.includes(numbers[1])}" @click="select(numbers[1])" >
                <span class="lb">{{numbers[1]}}</span>
                <svg v-if="selectedNumber === numbers[1] && !inuseNumbers.includes(numbers[1])" class="suffix" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                </svg>
                <span v-if="inuseNumbers.includes(numbers[1])" class="suffix inuse">In use</span>
              </div>
              <div class='common-menulist-item common-menulist-item-48' >
                <span class="lb">Call on Webex</span>
              </div>
            </div>
          `,
          props: ['numbers', 'selectedNumber', 'inuseNumbers', 'onSelect'],
          methods: {
            select(num) {
              this.onSelect(num);
              this.close();
            },
            close() {
              this.$popper.hideAll();
            },
          }
        },
        {
          numbers: this.people.numbers,
          selectedNumber: this.selectedNumber,
          inuseNumbers: this.getSpeedDialNumbers(),
          onSelect: (num) => {
            this.selectedNumber = num
          },
        }, // component props
        {
          reference: this.$refs[ref],
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
          opened: () => {this.dropdownVisible = true},
          closed: () => {this.dropdownVisible = false},
        } // popper eventlistener
      );
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

    contactCardTemplate(name) {
      return this.$store.getters.contactCardTemplate(name, false);
    },

    stopPropagation(e) {
      e.stopPropagation();
    },

    close() {
      this.$emit("close");
    },

  }
};
</script>

<style lang="scss">
#pop-speed-dial-add {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: auto;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
  user-select: none;

  .head {
    width: 100%;

    .head2 {
      @include flex(row, space-between);
      height: 32px;
      display: flex;
      align-items: center;
      padding-left: 0;
      

      .left {
        @include flex(row, flex-start);
        font-size: 12px;
        flex-grow: 1;
        margin-left: 12px;
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

  .des {
    @include flex(flex, flex-start);
    opacity: .95;
    font-size: 16px;
    font-weight: 700;
    margin: 16px 0 0 20px;
  }

  .tools {
    @include flex;
    height: 58px;
    padding: 0 12px;

    .searchinput {
      margin: 0 8px;
      flex-grow: 1;

      .md-input {
        width: 100%;
        height: 32px;
        font-size: 16px;
        font-weight: normal;
        padding-left: 32px;
        color: rgba($color: white, $alpha: 0.95) !important;
        background-color: rgba($color: #FFFFFF, $alpha: .1) !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;
        border-radius: 8px;

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
        width: 32px;
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
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      box-sizing: border-box;
      border: 1px solid rgba($color: #FFF, $alpha: .3);

      &:hover{
        border: 1px solid rgba($color: #FFF, $alpha: .5);
        background-color: rgba($color: #FFF, $alpha: .07);
      }
      &:active,
      &.active{
        border: 1px solid rgba($color: #FFF, $alpha: .9);
        background-color: rgba($color: #FFF, $alpha: .2);
      }

    }

    .btn-cancel {
      margin-left: 8px;
    }
  }

  .split-line{
      border-bottom: 1px solid #EEE;
  }

  .search-result-list {
    margin: 0 8px;

    .speed-dial-add-active-bg {
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

    .cont-wrap {
      display: flex;
      width: calc(100% - 4px);
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      height: 190px;

      .scrollcont {
        display: flex;
        flex-direction: column;
      }
    }


    .cont-list {
      display: flex;
      flex-direction: column;
      width: calc(100% - 8px - 20px);
      margin-left: 8px;
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


      .right {
        display: none;
        align-items: center;
        justify-content: flex-end;
        margin-right: 16px;
        font-size: 14px;
        opacity: .7;

      }

      .red {
        color: $textColor-error-darkUi;
        svg path{
          fill: $textColor-error-darkUi;
          fill-opacity: 1;
        }
      }

      &.active {
        height: auto;
        overflow: visible;
      }

      &:hover {
        background: rgba($color: #FFF, $alpha: 0.07);
      }
      &:active, &.active {
        background: rgba($color: #FFF, $alpha: 0.11);
      }
      &:hover, &:active, &.active {
        .left {
          mask: linear-gradient(to right, rgba($color: #FFF, $alpha: 1.0) 80%, rgba($color: #FFF, $alpha: 0.0) 90%);
          mask-repeat: no-repeat;
        }
        .buttons {
          display: flex;
        }
        .right {
          display: flex;
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
      }
    }



  }


  .add-step2 {
    margin-top: 16px;

    .content {
      width: 100%;
      @include flex(column);

      .avatar {
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
      }
      .name {
        font-size: 14px;
      }

      .info {
        opacity: .7;
        font-size: 14px;
        margin: 20px 20px 0 20px;
      }
    }

    .btns {
      @include flex(row, flex-end);
      margin: 20px 20px 16px;

      .btn {
        margin-left: 8px;
      }
    }
    .cblb {
      width: 340px;
      font-size: 14px;
      margin-top: 8px;
    }
    .combobox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 360px;
      height: 32px;
      cursor: default;
      user-select: none;
      padding: 0 0 0 12px;
      border: 1px solid rgba($color: #FFF, $alpha: .5);
      border-radius: 8px;
      margin-top: 4px;

      .ico {
        @include flex;
        width: 32px;
        height: 32px;

        svg path {
          fill: #FFF;
        }
      }

      .lb {
        flex-grow: 1;
        font-size: 16px;
      }

      &:hover {
        background-color: rgba($color: #FFF, $alpha: .1);
      }
      &:active {
        background-color: rgba($color: #FFF, $alpha: .2);
      }
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

.common-menulist-item {
  &.disabled {
    pointer-events: none;

    .lb {
      opacity: .4;
    }
    .inuse {
      font-size: 14px;
      text-align: right;
    }
  }
}

</style>
