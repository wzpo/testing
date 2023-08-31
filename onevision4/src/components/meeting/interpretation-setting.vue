<template>
    <div
      id="interpretation-setting"
      :class="[theme]"
      :style="{width: width}"
      @mousedown="mousedown"
      >
      

      <div v-if="siEnabled" class='grp' >
        <div class='itmhead'>Simultaneous interpretation language</div>

        <div 
          class="combobox" 
          :class="{active: false}" 
        >
          <span class="lb">
            Original audio <span>(floor)</span>
          </span>
          <wl-icon 
            name="arrow-down-bold"
            :color=" theme === 'dark' ? 'white-95' : 'black-95' "
            size="16"
          />
        </div>

      </div>

      <div v-if="sliEnabled" class='grp' >
        <div class='itmhead'>Sign language interpretation</div>

        <wl-combobox
          class="combobox" 
          width="296px"
          placement="top"
          :maxRow="3"
          :defaultLabel="signLanguageList[signLanguageIndex].label"
          :datalist="signLanguageList"
          :defaultSelectedIndex="signLanguageIndex"
          @select="selectCombobox"
        />

      </div>

      <div v-if="sliRole == 'host' && this.meetingOptionsList.length > 0" class='divider-b' style="margin-bottom: 8px;" ></div>

      <div v-if="sliRole == 'host' && this.meetingOptionsList.length > 0" class='itm' @click="showSettings">
        <wl-icon 
          name="settings-bold"
          :color=" theme === 'dark' ? 'white-95' : 'black-95' "
          size="16"
        />

        <span class="lb">Manage interpretation</span>

      </div>

      <!--div v-if="siEnabled" class='divider-b' ></div>

      <div v-if="siEnabled" class='grp' >
        <div class='itmhead'>Balance volume</div>
        <div class="sliderrow" >
          <md-slider
            :min="0"
            :max="100"
            :tick="1"
            :value="75"
            :step="1"
            :showTicks="false"
            :showSelection="false"
            class="banlance-slider"
          />

          <div class="sliderlabel">
            <span>
              Original audio
            </span>
            <span>
              Interpreter
            </span>
          </div>
        </div>

      </div-->

    </div>
</template>

<script>

import _ from 'lodash'
import popSiSettings from './pop-si-settings.vue';

export default {
  props: {
    meetingId: null,
    width: {
      type: String,
      default: '344px',
    },
  },
  data() {
    return {

    };
  },
  computed: {
    siEnabled() {
      return this.$store.state.siEnabled;
    },
    sliEnabled() {
      return this.$store.state.sliEnabled;
    },
    sliRole() {
      return this.$store.state.sliRole;
    },
    sliOption() {
      return this.$store.state.sliOption;
    },
    signLanguage() {
      return this.$store.state.signLanguage;
    },
    signLanguageList() {
      return this.$store.state.signLanguageList;
    },
    signLanguageWindowName() {
      return this.$store.state.signLanguageWindowName;
    },
    peopleSI() {
      return this.$store.state.peopleSI;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    videoLayout(){
      return this.$store.getters.videoLayout(this.meetingId);
    },
    theme() {
      return this.$store.state.theme === 'dark' ? 'dark' : 'light';
    },
    signLanguageIndex() {
      for(var i=0; i<this.signLanguageList.length; i++) {
        if(this.signLanguageList[i].value === this.signLanguage) {
          return i
        }
      }
      return 0
    },
    signLanguagePeople() {
      let p = this.peopleSI.find(p => {
          return p.lang == this.signLanguage
      })
      return p
    },
    videoInStageSortIndex(){
      return this.$store.state.videoInStageSortIndex;
    },
  },
  mounted() {},
  watch: {
    
  },
  methods: {
    mousedown() {
      this.$window.bringToFront(this.signLanguageWindowName)
    },
    selectCombobox(evt) {
      var lang = evt.data.value
      if (lang != 'na') {
        this.$store.commit('signLanguage', lang);

        if (this.sliOption == 2 && lang != '') {

          // pin to stage

          let pid = this.videoInStageSortIndex-1;
          this.$store.commit('videoInStageSortIndex', pid);

          let plist
          let len
          plist = []
          len = this.peopleSI.length;
          for (let i = 0; i < len; i++) {
              const p = this.peopleSI[i];
              if (p.lang === lang) {
                  p.pin = pid;
              }
              plist.push(p);
          }
          this.$store.commit('peopleSI', plist);

          if (this.meetingOptionsList.length > 0 && this.videoLayout === 'grid') {
            var optlist = _.cloneDeep(this.meetingOptionsList)
            var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
            optlist[idx].videoLayout = 'stage'
            this.$store.commit('meetingOptionsList', optlist)
          }
        }

        //this.close()
      }
    },

    showSettings() {

      const width = 500
      const height = 600

      this.$modal.show(
        popSiSettings, 
        {
        }, // component props
        {
          clickToClose: false,
          frameless: true,
          shadow: true,
          resizable: false,
          draggable: '.title .dragbg',
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          roundedCorner: this.os === 'mac',
          width: width,
          height: height,
          shiftY: 0.45,
          transition: true,
          
        }, // window props
        {
          closed: () => {
            
          },
        } // window eventlistener
      );

      this.close()
    },

    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">
#interpretation-setting {
  pointer-events: auto;

  user-select: none;
  padding: 12px;


  .itmhead {
    font-size: 14px;
    color: $md-gray-70;
    padding-left: 12px;
    display: flex;
    align-items: center;
    height: 32px;
  }

  
  .combobox {
    @include flex(row, space-between);
    border: 1px solid rgba($color: #FFF, $alpha: .5);
    padding: 0 8px;
    height: 32px;
    border-radius: 8px;
    box-sizing: border-box;
    margin: 8px 12px;

    .lb {
      @include flex(row, flex-start);
      flex-grow: 1;
      font-size: 16px;
      span {
        opacity: .7;
        margin-left: 4px;
      }
    }

    .ico {
      @include flex;
      flex-shrink: 0;
    }

    &:hover {
      background: rgba($color: #FFF, $alpha: 0.1);
    }
    &:active, &.active {
      background: rgba($color: #FFF, $alpha: 0.2);
    }
  }

  .sliderrow {
    padding: 0 12px;

    .banlance-slider {
      pointer-events: auto;
      cursor: default;
      margin: 0;

      .md-slider__bar {
        left: 0;
        background-color: rgba($color: #FFF, $alpha: 0.2);
      }
      .md-slider__selection {
        background-color: $md-blue-40;
      }
      .md-slider__pointer {
        top: -7px;
        width: 16px;
        height: 16px;
        margin-left: -8px;
        background-color: #000;
        border: 1px solid rgba($color: #FFF, $alpha: 0.5);
        box-shadow: none;
      }
    }

    .sliderlabel {
      @include flex(row, space-between);
      font-size: 16px;
      opacity: .95;
      margin-bottom: 8px;
    }
  }
  
  
  .divider-t {
      border-top: 1px solid #EEE;
  }
  .divider-b {
      border-bottom: 1px solid #EEE;
      margin-top: 12px;

      &.short {
        margin: 0 15px;
      }
  }

  .itm{
    transition: all 0.2s ease-out;
    width: 100%;
    height: 40px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 8px;
    padding: 0 15px;

    .lb{
      font-size: 16px;
      pointer-events: none;
      padding-left: 12px;
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



  /* ------------------ drak ------------------ */

  &.dark {
    color: $text-color-primary-dark-ui;

    .itmhead {
      color: $text-color-disabled-light-ui;
    }
    .divider-t{
      border-top: 1px solid $md-gray-80;
    }
    .divider-b{
      border-bottom: 1px solid $md-gray-80;
    }

  }
  

  
}




</style>
