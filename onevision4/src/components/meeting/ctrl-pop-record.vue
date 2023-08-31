<template>
    <div
      id="ctrl-pop-record"
      ref="popover"
      :class="[theme]"
      :style="{
        background: `${themeColorList[theme][themeColor]['bg']}`,
      }"
    >
      
      <div v-if="headerVisible" class='head'>
        <span class="lb"></span>
        <div class='close' @click="close"><wl-icon name="cancel-bold" :size="16" /></div>   
      </div>
      
      <div class="wrap">

        <div class="ttxt" >
          {{recordOn ? (!recordPaused ? "Recording..." : "Recording paused") : "Start recording"}}
        </div>

        <div class="ttxt2" >
          <span v-if="recordOn" class="ico">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="6" :fill="recordPaused ? '#FC9D03' : '#F55868'" />
            </svg>
          </span>

          {{timestr}}
        </div>

        <div class="btns" >
          <md-button 
            v-if="!recordOn" 
            class="btn md-button--red" 
            aria-label="x" 
            :size="32" 
            :style="{width: '216px'}" 
            v-tooltip="{placement: 'bottom', html: true, content: `<span style='font-size: 16px; '>A transcript will be available <br>after the meeting.</span>`}" 
            @click="toggleRecord" 
          >
            <wl-icon class="ico" name="record-bold" size="16" color="white" />
            Record
          </md-button>

          <md-button v-if="recordOn && !recordPaused" class="btn md-button-outline" aria-label="x" :size="32" @click="pause" >
            <wl-icon class="ico" name="pause-bold" size="16" />
            Pause
          </md-button>

          <md-button v-if="recordOn && recordPaused" class="btn md-button-solid" aria-label="x" :size="32" @click="resume" >
            <wl-icon class="ico" name="play-bold" size="16" color="gray-95" />
            Resume
          </md-button>

          <md-button v-if="recordOn" class="btn md-button-outline" aria-label="x" :size="32" @click="toggleRecord" >
            <wl-icon class="ico" name="stop-bold" size="16" />
            Stop
          </md-button>
        </div>
      </div>

      <div class="bot" :class="{exp}">
        <div class='itm' @click="() => {exp = !exp}">
          <span class="lb" >Recording options</span>
          <wl-icon class="ico" :name="exp ? 'arrow-up-bold' : 'arrow-down-bold'" size="16" />
        </div>

        <div class="combobox" ref="cb_save_opt" @click="showDropdown" >
          <span class="lb">Save to the cloud</span>
          <wl-icon name="arrow-down-bold"  size="16" />
        </div>

        <div class='link text-link underline' >
          Change layout
        </div>

      </div>


    </div>
</template>

<script>

export default {
  props: {
    headerVisible: {
      type: Boolean,
    }
  },
  data() {
    return {
      exp: false,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    os() {
      return this.$store.state.os;
    },
    recordOn() {
      return this.$store.state.recordOn;
    },
    recordPaused() {
      return this.$store.state.recordPaused;
    },
    timestr() {
      const sec = this.$store.state.recordTimerObj.value;
      var h = Math.floor(sec / 3600);
      var m = Math.floor(sec / 60);
      var s = sec % 60
      return this.formatNum(h) + ':' + this.formatNum(m) + ':' + this.formatNum(s);
    },
  },
  mounted() {

  },
  destroyed() {

  },

  watch: {

  },
  methods: {
    toggleRecord() {
      if (this.recordOn) {
        this.$store.commit("recordPaused", false);
      }
      this.$store.commit("recordOn", !this.recordOn);
    },
    pause() {
      this.$store.commit("recordPaused", true);
    },
    resume() {
      this.$store.commit("recordPaused", false);
    },
    close() {
      this.$emit("close");
    },
    formatNum(n){
      if(n < 10){
        return ('0' + n);
      }else{
        return n;
      }
    },

    showDropdown() {
      if (this.dropdownVisible) {
        this.$popper.hide('pop-save-opt-menu');
        return;
      }
      this.$popper.show(
        {
          template: `
            <div class="pop-save-opt-menu">
              
              <div class="menuitm" @click="closepopper">
                <span class="lb">Save to the cloud</span>
                <wl-icon class="ico blue" name="check-bold" size="16" />
              </div>

              <div class="menuitm" @click="closepopper">
                <span class="lb">Save to my computer</span>
              </div>

            </div>
          `,
          props: ['theme'],
          methods: {
            closepopper() {
              this.$popper.hide('pop-save-opt-menu');
            },
          }
        },
        {
          theme: this.theme,
        }, // component props
        {
          reference: this.$refs['cb_save_opt'],
          name: 'pop-save-opt-menu',
          closeTrigger: 'mousedown',
          arrowVisible: false,
          roundedCorner: true,
          borderRadius: '12px',
          appendToBody: true,
          theme: `${this.theme} ${this.themeColor}`,
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
          opened: () => { this.dropdownVisible = true },
          closed: () => { this.dropdownVisible = false },
        } // popper eventlistener
      );
    },

  }
};
</script>

<style lang="scss">
#ctrl-pop-record {
  @include flex(column);
  width: 280px;
  pointer-events: auto;
  user-select: none;
  box-sizing: border-box;

  .head {
    @include flex(row, flex-end);
    width: 100%;
    height: 32px;
    flex-shrink: 0;
    margin-bottom: -8px;

    .close {
      @include flex(row, center, flex-start);
      width: 20px;
      height: 20px;
      pointer-events: auto;
      cursor: default;
      margin: 8px 8px 0;
    }
  }

  .wrap {
    @include flex(column);
    width: calc(100% - 24px);
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    margin: 12px 12px 0 12px;

    .ttxt {
      @include flex;
      margin-top: 28px;
      margin-bottom: 24px;

      svg {
        margin-right: 8px;
      }
    }

    .ttxt2 {
      @include flex;
      font-weight: 600;
      font-size: 26px;
      margin-top: -8px;
      margin-bottom: 24px;

      .ico {
        @include flex;
        margin-right: 8px;
      }
    }

    .btns {
      @include flex;
      margin-top: 8px;
      margin-bottom: 28px;

      .btn {
        margin: 0 4px;
        min-width: 104px;
        font-size: 16px;

        .ico {
          margin-right: 6px;
        }
      }
    }
  }

  .bot {
    @include flex(column, flex-start, flex-start);
    flex-shrink: 0;
    transition: all 0.2s ease-out;
    width: calc(100% - 24px);
    height: 32px;
    overflow: hidden;
    margin: 12px 12px;

    .itm {
      height: 32px;
      border-radius: 16px;
    }

    &.exp {
      height: 120px;
    }

    .combobox {
      width: 100%;
      display: flex;
      align-items: center;
      height: 32px;
      cursor: default;
      user-select: none;
      border: 1px solid rgba($color: #FFF, $alpha: .5);
      box-sizing: border-box;
      border-radius: 8px;
      padding: 0 12px 0 12px;
      margin: 12px 0;

      .lb {
        flex-grow: 1;
        font-size: 16px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        padding-right: 10px;
      }

      &:hover {
        background-color: rgba($color: #FFF, $alpha: .1);
      }
      &:active {
        background-color: rgba($color: #FFF, $alpha: .2);
      }
    }

    .link {
      padding-left: 12px;
    }

  }

  .itm {
    @include flex;
    transition: all 0.2s ease-out;
    flex-shrink: 0;
    width: 100%;
    height: 40px;
    cursor: default;
    user-select: none;
    border-radius: 8px;
    padding: 0 12px;

    .prefix {
      margin-right: 12px;
    }

    .lb{
      font-size: 14px;
      pointer-events: none;
      flex-grow: 1;
      opacity: .95;
    }

    &:hover {
      background: rgba($color: #FFFFFF, $alpha: 0.1);
    }
    &:active {
      background: rgba($color: #FFFFFF, $alpha: 0.2);
    }
  }

  &.dark {
    color: $text-color-primary-dark-ui;
  }
  
}

.pop-save-opt-menu {
  padding: 8px 0;
  width: 256px;

  .menuitm {
    border-radius: 8px;
    margin: 0 8px;
    height:40px; 
    justify-content: space-between; 
    padding-right: 12px;

    .lb {
      font-size: 16px;
    }

    .blue path{
      fill: $md-blue-40;
    }
  }
}


</style>
