<template>
    <div id="status-editor"
      :class="[os, theme]"
    >
      <div id="status-editor-titlebar" class="head">
        <div class="head2">
          <div class="left">
            Webex
          </div>
          <div class='close' @click='close' >
            <wl-icon name="cancel-bold" size="16" />
          </div>
        </div>
  
      </div>
  

  
      <div class="form-wrap">
  
        <div class="grp">
          <md-input 
            class="md-search-input search textinput" 
            htmlId="input1"
            :value="statusString"
            placeholder="What’s your status?"
            @input="onInput"
          >
            <div class="emoji" slot="inputBefore" @click="changeEmoji">
                {{emojiString}}
                <wl-icon
                    v-if="!emojiString"
                    name="emoji-happy-bold" 
                    :color=" theme === 'light' ? 'black-95' : 'white-95' "
                    size="16"
                />
            </div>

            <div v-if="(emojiString || statusString)" slot="inputAfter" @click="clear">
                <wl-icon
                    name="clear-filled" 
                    :color=" theme === 'light' ? 'black-95' : 'white-95' "
                    size="16"
                    style="opacity: .7;"
                />
            </div>

            <span class="text-counter" >{{textCounter}}</span>
          </md-input>
        </div>


        <div class="grp">
            <md-label
                class="md-input__label"
                htmlFor="cb"
                >Clear after</md-label>
            <div class="combobox" :disabled="!statusString" ref="cb" htmlId="cb" @click="showDropdown('cb')" >
                <span class="lb">{{selectedCbItem}}</span>
                <span class="ico">
                <wl-icon v-if="!dropdownVisible" name="arrow-down-filled" size="16" />
                <wl-icon v-if="dropdownVisible" name="arrow-up-filled" size="16" />
                </span>

            </div>
        </div>

        <div class="grp">
            <div class="subtitle">Choose a status</div>
            <div class="split-line"></div>

            <div class="preset common-menulist">
                <div v-for="(itm, i) in presetList"
                    :key="`itm${i}`"
                    class="pitm common-menulist-item"
                    @click="setStatus(itm)"
                >
                    {{`${itm.status} ${itm.emoji}`}}
                </div>
            </div>
            
        </div>

        <div class="btns">
            <md-button class="btn md-button-solid" aria-label="x" :size="32" @click="save">Save</md-button>
            <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="close">Cancel</md-button>
        </div>

  
      </div>
  
  
      
  
    </div>
  </template>
  
  <script>
  import _ from 'lodash'

  export default {
    props: [
    ],
  
    data() {
      return {
        emojiList: [
            '🥗',
            '😁',
            '🍺',
            '🚀',
            '🍎',
            '⛈️',
            '🌝',
        ],
        emojiString: null,
        statusString: '',
        emojiTouched: false,
        maxChars: 75,
        textCounter: null,

        comboboxData: [
            '30 minutes',
            '1 hour',
            '2 hours',
            '12 hours',
            '1 day',
            '7 days',
            'Set a time',
        ],
        selectedCbItem: '1 day',
        dropdownVisible: false,

        presetList: [
            {
                emoji: '🏡',
                status: 'Working from home',
            },
            {
                emoji: '🚀',
                status: 'Traveling for business',
            },
            {
                emoji: '🍽️',
                status: 'Out for lunch',
            },
            {
                emoji: '⌛',
                status: 'Be right back',
            },
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
      globalHeaderStatus() {
        return this.$store.state.globalHeaderStatus;
      },

  
    },
    beforeMount() {
        var sts = this.globalHeaderStatus || {}
        this.setStatus(sts)
    },
    mounted() {
  
    },
    watch: {
  
    },
    methods: {
  
      onInput(evt){
        this.statusString = evt.target.value
        this.textCounter = `${this.statusString.length}/${this.maxChars}`

        if(!this.emojiString && this.statusString && !this.emojiTouched){
            this.emojiString = '💬'
        } else if(this.emojiString && !this.statusString && !this.emojiTouched){
            this.emojiString = null
        }
      },
      clear(){
        this.emojiString = null
        this.statusString = ''
        this.emojiTouched = false
      },

      changeEmoji(){
        this.emojiString = this.emojiList[_.random(0, this.emojiList.length-1)]
        this.emojiTouched = true
      },

      setStatus(sts) {
        this.emojiString = sts.emoji
        this.statusString = sts.status || ''
        this.textCounter = `${this.statusString.length}/${this.maxChars}`
      },

      showDropdown(ref) {
        this.$popper.show(
            {
            template: `
                <div class="common-menulist" style="width:120px;">
                
                <div 
                    v-for="(type, idx) in comboboxData"
                    :key="idx"
                    class='common-menulist-item common-menulist-item-32' 
                    @click="select(type)" 
                    >
                    <span class="lb">{{type}}</span>
                    <svg v-if="selectedCbItem === type" class="suffix" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                    </svg>
                </div>
                
                </div>
            `,
            props: ['comboboxData', 'selectedCbItem', 'onSelect'],
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
            comboboxData: this.comboboxData,
            selectedCbItem: this.selectedCbItem,
            onSelect: () => {
                //this.selectedCbItem = num
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
      
  
      save() {
        this.$store.commit('globalHeaderStatus', {
            emoji: this.emojiString,
            status: this.statusString,
        });
        
        this.close();
      },

  
      close() {
        this.$emit("close");
      },
  
    }
  };
  </script>
  
  <style lang="scss">
  #status-editor {
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
  
    .split-line{
        width: 100%;
        border-bottom: 1px solid #EEE;
    }
  
    .form-wrap {
      @include flex(column);
  
      .grp {
        @include flex(column, flex-start, flex-start);
        margin-bottom: 16px;
        width: 400px;
      }

      .subtitle {
        font-size: 14px;
        opacity: .7;
        padding: 2px 10px;
      }

      .preset {
        background: none;
        width: 100%;
        padding: 0;

        .pitm {

        }
      }
  
      .textinput {
        margin: 16px 0 0 0;
        flex-grow: 1;


        .text-counter {
            position: absolute;
            right: 8px;
            bottom: 4px;
            opacity: .7;
            user-select: none;
        }

        .md-input--overlay {
            height: 32px;
        }

        .md-input__before {
            opacity: .9;
            cursor: default;
            pointer-events: auto;
            font-size: 12px;

            &:hover, &:active {
                opacity: 1;
            }
        }
        .md-input__after {
            height: 32px;
            width: 32px;
        }
  
        .md-input {
          width: 400px;
          height: 62px;
          padding-bottom: 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: normal;
          padding-left: 28px;
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
        font-size: 14px;
        margin-bottom: 4px;
        opacity: .95;
      }

  
      .btns {
        @include flex(row, flex-end);
        width: 100%;
        padding: 0px 20px 16px;
  
        .btn {
          margin-left: 8px;
          font-size: 16px;
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
        margin-right: 4px;
  
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

        &[disabled] {
            pointer-events: none;
            border: none;
            color: rgba(255, 255, 255, 0.4);
            background-color: rgba(255, 255, 255, 0.2);

            .ico {
                svg path {
                    fill: rgba(255, 255, 255, 0.4);
                }
            }
        }
      }
    }
  
    /* ------------------ drak ------------------ */
  
    &.dark {
      color: $text-color-primary-dark-ui;
  
      .split-line{
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      }
  
    }
  
  }
  
  
  </style>
  