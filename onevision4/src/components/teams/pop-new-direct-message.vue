<template>
    <div id="pop-new-direct-message"
      :class="[os, theme]"
      :style="{
        background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`
      }"
    >
      <div id="pop-new-direct-message-titlebar" class="head">
        <div class="head2">
          <div class="left">
            Webex
          </div>
          <div class='close' @click='close' >
            <wl-icon name="cancel-bold" size="16" />
          </div>
        </div>
  
      </div>
  
      <div class="title">Send a direct message</div>
      <div class="des">Start a conversation between you and one other person.</div>
  
      <md-input 
        class="md-search-input search searchinput" 
        ref="searchinput"
        clear
        shape="pill"
        placeholder="Search for a person by name or email"
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

      <div class="pic"></div>

      <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="close">Close</md-button>

      <div class="divider"></div>
      <div class="info text-link">Send messages to a person who uses another instant messaging app, such as Cisco Jabber or Skype for Business.</div>

  
    </div>
  </template>
  
  <script>
  import _ from 'lodash'
  import searchResult from './../shared/search-result.vue';
  
  export default {
    props: [
      'peoplename',
      'editpeople',
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
        if (!this.getSpeedDialNumbers().includes(this.people.numbers[0])) {
          this.selectedNumber = this.people.numbers[0];
        } else if (!this.getSpeedDialNumbers().includes(this.people.numbers[1])) {
          this.selectedNumber = this.people.numbers[1];
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
          const popername = 'people-search-result'
          this.$popper.hide(popername);
          this.$popper.show (
            searchResult,
            {
              width: `${this.$refs.searchinput.$el.getBoundingClientRect().width}px`,
              keyword: this.searchcontent,
              layout: 'people',
              listItemButtons: [],
              onSelect: this.gotoPeopleSpace,
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
  
      gotoPeopleSpace(obj) {
        console.log(obj)
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
  #pop-new-direct-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
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

    .title {
      @include flex;
      font-weight: 600;
      font-size: 26px;
      margin-top: 64px;
      opacity: .95;
    }
  
    .des {
      @include flex;
      opacity: .7;
      font-size: 14px;
    }

    .searchinput {
      width: 480px;
      margin-top: 12px;
      margin-bottom: 0;

      .md-input {
        width: 100%;
        height: 32px;
        font-size: 16px;
        font-weight: normal;
        padding-left: 32px;
        color: rgba($color: white, $alpha: 0.95) !important;
        background-color: #000 !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;

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

    .pic {
      width: 192px;
      height: 192px;
      background: url(~@/assets/img/empty-state-wolf-call-192.svg);
      margin: 75px 0 60px 0;
    }

    .btn {
      font-size: 16px;
    }

  
    .divider{
      width: 732px;
      border-bottom: 1px solid #EEE;
      margin-top: 64px;
    }

    .info {
      @include flex;
      font-size: 14px;
      margin-top: 16px;
    }
  

  
    /* ------------------ drak ------------------ */
  
    &.dark {
      color: $text-color-primary-dark-ui;
  
      .divider{
        border-bottom: 1px solid $md-gray-80;
      }
  
    }
  
  }

  
  </style>
  