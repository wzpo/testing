<template>
  <div id="pop-contact-create"
    :class="[os, theme]"
  >
    <div id="pop-contact-create-titlebar" class="head">
      <div class="head2">
        <div class="left">
          Webex
        </div>
        <div class='close' @click='close' >
          <wl-icon name="cancel-bold" size="16" />
        </div>
      </div>

    </div>

    <div v-show="step===1" class="des">{{isEdit ? 'Edit a contact' : 'Add a contact'}}</div>

    <div v-show="step===1" class="tools">
      <div class="combobox" ref="cb_type" style="width: 332px; margin-bottom: 8px;" >
        <span class="lb">{{selectedGroup}}</span>
        <span class="ico">
          <wl-icon name="arrow-down-filled" size="16" />
        </span>

      </div>
      
      <md-input 
        class="md-search-input search searchinput" 
        ref="searchinput"
        clear
        placeholder="Name, email or number of new contact"
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
        class='cont-wrap' 
        style="height: 256px;"
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
              @click="addContact(itm)"
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
                

              </div>



            </div>
          </div>
        </div>
      </wl-scrollbar>

    </div>

    <wl-scrollbar 
      v-show="step===2"
      class='cont-wrap add-step2' 
      style="height: 588px;"
      :theme="theme === 'dark' ? 'dark' : 'light'"
      :arrowVisible="$store.state.os==='win'"
      :alwaysVisible="true"
      >
      <div class="scrollcont">

        <div class="avatar">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="72" rx="36" fill="#545454"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.892578 44C4.53041 60.0319 18.8678 72 36.0005 72C53.1332 72 67.4706 60.0319 71.1084 44H0.892578Z" fill="black" fill-opacity="0.4"/>
          <path d="M43.8318 52.1872H41.3994C41.1676 52.1897 40.9381 52.1414 40.7269 52.0457C40.5157 51.9501 40.3281 51.8094 40.177 51.6335L39.542 50.893C39.2961 50.5897 38.9845 50.3461 38.6308 50.1805C38.2771 50.015 37.8905 49.9318 37.5 49.9372H34.5C34.1152 49.9312 33.734 50.0119 33.3846 50.1735C33.0353 50.335 32.7269 50.5732 32.4822 50.8703L31.8054 51.6555C31.6546 51.8256 31.4688 51.9612 31.2607 52.0529C31.0527 52.1447 30.8272 52.1905 30.5999 52.1872H28.1997C27.5716 52.1529 26.9552 52.3679 26.4848 52.7855C26.0143 53.2032 25.7278 53.7897 25.6875 54.4174V63.8232C25.7265 64.4522 26.0123 65.0404 26.4828 65.4597C26.9533 65.8791 27.5704 66.0956 28.1997 66.0622H43.7996C44.4278 66.0967 45.0443 65.8818 45.5149 65.4641C45.9855 65.0465 46.2722 64.4599 46.3125 63.832V54.4174C46.2769 53.7936 45.9962 53.2091 45.5315 52.7914C45.0669 52.3736 44.4559 52.1564 43.8318 52.1872ZM45.1875 63.832C45.1456 64.1606 44.9771 64.46 44.7179 64.6663C44.4588 64.8727 44.1293 64.9699 43.7996 64.9372H28.1997C27.8697 64.9649 27.5417 64.8647 27.2835 64.6573C27.0253 64.45 26.8567 64.1513 26.8125 63.8232V54.4174C26.8544 54.0889 27.0227 53.7896 27.2818 53.5832C27.5408 53.3768 27.8701 53.2796 28.1997 53.3122H30.5999C30.9942 53.3182 31.385 53.2366 31.7439 53.0732C32.1029 52.9098 32.4211 52.6687 32.6756 52.3674L33.3523 51.583C33.4919 51.4152 33.6677 51.2812 33.8665 51.191C34.0652 51.1008 34.2818 51.0568 34.5 51.0622H37.5C37.7235 51.0573 37.9452 51.1036 38.148 51.1976C38.3509 51.2915 38.5296 51.4306 38.6704 51.6042L39.3054 52.3439C39.5602 52.6513 39.8804 52.8978 40.2428 53.0653C40.6051 53.2328 41.0003 53.3172 41.3994 53.3122H43.8318C44.1574 53.2828 44.4815 53.382 44.7349 53.5885C44.9883 53.7951 45.1507 54.0926 45.1875 54.4174V63.832Z" fill="white" fill-opacity="0.95"/>
          <path d="M36 55.1872C35.2954 55.1872 34.6067 55.3961 34.0208 55.7876C33.435 56.179 32.9783 56.7354 32.7087 57.3864C32.4391 58.0374 32.3685 58.7537 32.506 59.4447C32.6434 60.1358 32.9827 60.7705 33.481 61.2688C33.9792 61.767 34.614 62.1063 35.305 62.2438C35.9961 62.3812 36.7124 62.3107 37.3633 62.041C38.0143 61.7714 38.5707 61.3148 38.9621 60.7289C39.3536 60.1431 39.5625 59.4543 39.5625 58.7497C39.5615 57.8052 39.1858 56.8997 38.5179 56.2318C37.85 55.564 36.9445 55.1883 36 55.1872ZM36 61.1872C35.5179 61.1872 35.0467 61.0442 34.6458 60.7764C34.245 60.5086 33.9326 60.1279 33.7481 59.6825C33.5636 59.2371 33.5153 58.747 33.6094 58.2742C33.7034 57.8013 33.9356 57.367 34.2765 57.0261C34.6173 56.6852 35.0517 56.4531 35.5245 56.359C35.9973 56.265 36.4874 56.3133 36.9328 56.4977C37.3782 56.6822 37.7589 56.9947 38.0267 57.3955C38.2946 57.7963 38.4375 58.2676 38.4375 58.7497C38.4368 59.3959 38.1797 60.0155 37.7228 60.4725C37.2658 60.9294 36.6463 61.1865 36 61.1872Z" fill="white" fill-opacity="0.95"/>
          </svg>
        </div>

        <div class="form-wrap">

          <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="input1"
              >First name<span class="required">*</span></md-label>
            <md-input 
              class="md-search-input search textinput" 
              htmlId="input1"
              clear
              :value="name1"
              style="width: 332px;"
              @input="onInput1"
            >
              <wl-icon
                name="cancel-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                slot="clear"
              />
            </md-input>
          </div>

          <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="input2"
              >Last name</md-label>
            <md-input 
              class="md-search-input search textinput" 
              htmlId="input2"
              clear
              :value="name2"
              style="width: 332px;"
              @input="onInput2"
            >
              <wl-icon
                name="cancel-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                slot="clear"
              />
            </md-input>
          </div>

          <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="input22"
              >Display name</md-label>
            <md-input 
              class="md-search-input search textinput" 
              htmlId="input22"
              clear
              style="width: 332px;"
            >
              <wl-icon
                name="cancel-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                slot="clear"
              />
            </md-input>
          </div>

          <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="input222"
              >Contact group</md-label>
              <div class="combobox" style="width: 332px;" >
                <span class="lb">{{selectedGroup}}</span>
                <span class="ico">
                  <wl-icon name="arrow-down-filled" size="16" />
                </span>

              </div>
          </div>

          <div class="grp rw">
            <div class="cl">
              <md-label
                  class="md-input__label"
                  htmlFor="cb"
                >Phone</md-label>
              <div class="combobox" ref="cb" htmlId="cb" style="margin-right: 4px;" @click="showDropdown('cb')" >
                <span class="lb">{{selectedType}}</span>
                <span class="ico">
                  <wl-icon v-if="!dropdownVisible" name="arrow-down-filled" size="16" />
                  <wl-icon v-if="dropdownVisible" name="arrow-up-filled" size="16" />
                </span>

              </div>
            </div>

            <div class="cl">
              <md-label
                  class="md-input__label"
                  htmlFor="input3"
                ></md-label>
              <md-input 
                class="md-search-input search textinput" 
                htmlId="input3"
                clear
                :value="callnumber"
                style="width: 208px;"
                @input="onInput3"
              >
                <wl-icon
                  name="cancel-bold" 
                  :color=" theme === 'light' ? 'black-95' : 'white-95' "
                  size="16"
                  slot="clear"
                />
              </md-input>
            </div>
          </div>
          
          <div style="margin: -8px 0 16px 24px; align-self: flex-start;">
            <md-button class="btn md-button-outline" aria-label="x" :size="28" style="padding: 0 10px;" >
              <wl-icon name="plus-bold" size="16" style="margin-right:4px;" />
              Add another phone number
            </md-button>
          </div>

          <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="input2211"
              >Email</md-label>
            <md-input 
              class="md-search-input search textinput" 
              htmlId="input2211"
              :value="email"
              clear
              style="width: 332px;"
            >
              <wl-icon
                name="cancel-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                slot="clear"
              />
            </md-input>
          </div>

          <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="input2233"
              >Personal Room</md-label>
            <md-input 
              class="md-search-input search textinput" 
              htmlId="input2233"
              clear
              style="width: 332px;"
            >
              <wl-icon
                name="cancel-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                slot="clear"
              />
            </md-input>
          </div>

          <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="input2244"
              >Job title</md-label>
            <md-input 
              class="md-search-input search textinput" 
              htmlId="input2244"
              clear
              style="width: 332px;"
            >
              <wl-icon
                name="cancel-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                slot="clear"
              />
            </md-input>
          </div>

          <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="input2255"
              >Company name</md-label>
            <md-input 
              class="md-search-input search textinput" 
              htmlId="input2255"
              clear
              style="width: 332px;"
            >
              <wl-icon
                name="cancel-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                slot="clear"
              />
            </md-input>
          </div>

        </div>
      </div>

    </wl-scrollbar>

    <div class="btns">
      <md-button class="btn md-button-solid" :disabled="!valid"  aria-label="x" :size="32" @click="save">{{isEdit ? 'Save' : 'Add'}}</md-button>
      <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="close">Cancel</md-button>
    </div>


    

  </div>
</template>

<script>
import _ from 'lodash'
import searchResult from './../shared/search-result.vue';
import popContactCreate from './pop-contact-create.vue';

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
      step2peoplename: '',
      name1: '',
      name2: '',
      email: '',
      callnumber: '',
      valid: false,
      people: {},
      selectedGroup: 'Other contacts',
      types: [
        'Work',
        'Mobile',
        'Home',
        'Other',
        'SIP',
      ],
      selectedType: '',
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
    peopleNotJoinedList() {
      return this.$store.state.peopleNotJoinedList;
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
  beforeMount() {
    this.selectedType = this.types[0]
    
    if (this.peoplename) {
      this.step = 2;
      var arr = this.peoplename.split(' ')
      if (this.$isEmail(this.peoplename)) {
        this.email = this.peoplename;
      } else if (!isNaN(this.peoplename.replace(/ +/g, ''))) {
        //this.name1 =  this.peoplename
        this.callnumber = this.peoplename
      } else {
        if (arr && arr[0]) {
          this.name1 = arr[0];
        }
        if (arr && arr[1]) {
          this.name2 = arr[1];
        }
      }
      
      
    }
    if (this.editpeople) {
      this.people = this.editpeople;
      this.nunberBeforeEdit = this.editpeople.speeddial;
      this.selectedNumber = this.editpeople.speeddial;
      
      this.step = 2;
      this.isEdit = true;
    }
  },
  mounted() {

    this.checkValid();

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
            layout: 'contact',
            showInputNumber: true,
            noResultButtons: ['people-add'],
            listItemButtons: [],
            onSelect: this.addContact,
            onCreatePeople: this.createContact,
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

    checkValid() {
      this.valid = this.name1;
    },

    onInput1(evt){
      this.name1 = evt.target.value
      this.checkValid();
    },
    onInput2(evt){
      this.name2 = evt.target.value
    },
   
    onInput3(evt){
      this.callnumber = evt.target.value
    },
    onInputEmail(evt){
      this.email = evt.target.value
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

    
    save() {

      this.people = {
        id: _.random(10000, 99999),
        name: _.trim(`${this.name1} ${this.name2}`),
        avatar: null,
        video: null,
        audio: null,
        speeddial: `${this.selectedType}: ${this.callnumber}`,
        numbers: [
          `${this.selectedType}: ${this.callnumber}`,
        ],
      }

      if (!this.isContact) {
        var contacts = _.cloneDeep(this.contactPeopleList);
        var lst = contacts['other'].slice();
        lst.unshift(this.people.name);
        contacts['other'] = lst;
        this.$store.commit('contactPeopleList', contacts);
      }

      if (!this.$store.getters.people(this.people.name)) {
        var plst2 = this.peopleNotJoinedList.slice();
        plst2.push(this.people);
        this.$store.commit('peopleNotJoinedList', plst2);
      }

      this.close();
    },

    addContact(obj) {

      this.people = _.cloneDeep(obj);
      
      this.close();

      this.showPopCreate(this.people.name);
    },
    createContact(evt) {
      this.close();

      this.showPopCreate(evt.keyword);
    },
    showPopCreate(peoplename) {
      this.close();

      this.$modal.show(
          popContactCreate,
          {
            peoplename: peoplename,
            onAdd: () => {
              this.selectTab1(1);
            },
          }, // component props
          {
            name: 'contact-create2',
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
            height: 698,
            transition: true,
          }, // modal props
          {} // modal eventlistener
        );
    },

    showDropdown(ref) {
      this.$popper.show(
        {
          template: `
            <div class="common-menulist" style="width:120px;">
              
              <div 
                v-for="(type, idx) in types"
                :key="idx"
                class='common-menulist-item common-menulist-item-48' 
                @click="select(type)" 
                >
                <span class="lb">{{type}}</span>
                <svg v-if="selectedType === type" class="suffix" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                </svg>
              </div>
              
            </div>
          `,
          props: ['types', 'selectedType', 'onSelect'],
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
          types: this.types,
          selectedType: this.selectedType,
          onSelect: (num) => {
            this.selectedType = num
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
#pop-contact-create {
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
    margin: 16px 0 16px 20px;
  }

  .tools {
    @include flex(column);
    padding: 0 12px;

    .searchinput {
      width: 332px;
      margin: 0 8px;
      flex-grow: 1;

      .md-input {
        width: 100%;
        height: 32px;
        font-size: 16px;
        font-weight: normal;
        padding-left: 32px;
        color: rgba($color: white, $alpha: 0.95) !important;
        background-color: rgba($color: #FFFFFF, $alpha: .0) !important;
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

  .cont-wrap {
    display: flex;
    width: calc(100% - 4px);
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
    

    .scrollcont {
      display: flex;
      flex-direction: column;
    }
  }

  .search-result-list {
    margin: 16px 0 0 8px;

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

    
    
    
  }
  .btns {
    @include flex(row, flex-end);
    margin: 12px 20px 16px;

    .btn {
      margin-left: 8px;
    }
  }

  .combobox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    height: 32px;
    cursor: default;
    user-select: none;
    padding: 0 0 0 12px;
    border: 1px solid rgba($color: #FFF, $alpha: .5);
    border-radius: 8px;

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

  .avatar {
    @include flex;
    margin: 16px 0;
  }

  .form-wrap {
    @include flex(column);

    .grp {
      @include flex(column);
      margin-bottom: 16px;
      width: 332px;

      .msg {
        width: 100%;
        font-size: 14px;
        opacity: .7;
      }
    }

    .rw {
      @include flex(row, flex-start);
    }
    .cl {
      @include flex(column, flex-start);
    }

    .textinput {
      margin: 0;
      flex-grow: 1;

      .md-input {
        width: 100%;
        height: 32px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: normal;
        padding-left: 10px;
        color: rgba($color: #FFFFFF, $alpha: 0.95) !important;
        background-color: rgba($color: #FFFFFF, $alpha: 0) !important;
        border: 1px solid rgba($color: #FFFFFF, $alpha: .5) !important;

        &::placeholder {
          color: rgba($color: #FFFFFF, $alpha: .7) !important;
        }
        &:hover {
          border-color: rgba($color: #FFFFFF, $alpha: 0.7) !important;
        }
        &:focus {
          border-color: rgba($color: #FFFFFF, $alpha: 0.9) !important;
          box-shadow: 0 0 0 3px $md-blue-50 !important;
        }
      }
    }
    .md-input__label {
      height: 24px;
      font-size: 14px;
      padding-left: 12px;
      margin-bottom: 4px;

      .required {
        color: #FC8B98;
      }
    }


    .btns {
      @include flex(row, flex-end);
      width: 100%;
      padding: 0px 20px 16px;

      .btn {
        margin-left: 8px;
      }
    }

    .combobox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 120px;
      height: 32px;
      cursor: default;
      user-select: none;
      padding: 0 0 0 12px;
      border: 1px solid rgba($color: #FFF, $alpha: .5);
      border-radius: 8px;
      

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
