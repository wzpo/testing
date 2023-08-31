<template>
    <div
    id="ctrl-menu-aduio"
    ref="popover"
    :class="[theme]"
    :style="{
      width: !devicePaired ? '320px' : '220px',
    }"
    >

        <div class='grp split-line' v-if="!devicePaired && audioType === 'pc'" >
          <div class='tt '>
            <wl-icon
              name="speaker-bold" 
              :color=" theme === 'dark' ? 'white-70' : 'black-70' "
              size="14"
              class="ico" 
            />
            <span class="lb">Speaker</span>
          </div>
          <div class='itm' @click="selectSpeaker('System default speaker')">
            <wl-icon
              v-if="selectedSpeaker === 'System default speaker'"
              name="check-bold" 
              size="12"
              class="ico blue"
            />
            <span class="lb indent" >System default speaker</span>
          </div>

          <div class='itm' @click="selectSpeaker('Barbara’s Airpods Pro')">
            <wl-icon
              v-if="selectedSpeaker === 'Barbara’s Airpods Pro'"
              name="check-bold" 
              size="12"
              class="ico blue"
            />
            <span class="lb indent" >Barbara’s Airpods Pro</span>
          </div>

          <div class='itm' @click="selectSpeaker('Family room speaker')">
            <wl-icon
              v-if="selectedSpeaker === 'Family room speaker'"
              name="check-bold" 
              size="12"
              class="ico blue"
            />
            <span class="lb indent" >Family room speaker</span>
          </div>

        </div>


        <div class='grp split-line' v-if="!devicePaired && audioType === 'pc'" >
          <div class='tt '>
            <wl-icon
              name="microphone-bold" 
              :color=" theme === 'dark' ? 'white-70' : 'black-70' "
              size="14"
              class="ico" 
            />
            <span class="lb">Microphone</span>
          </div>
          <div class='itm' @click="selectMicrophone('System default microphone')">
            <wl-icon
              v-if="selectedMicrophone === 'System default microphone'"
              name="check-bold" 
              size="12"
              class="ico blue"
            />
            <span class="lb indent" >System default microphone</span>
          </div>

          <div class='itm' @click="selectMicrophone('Internal microphone')">
            <wl-icon
              v-if="selectedMicrophone === 'Internal microphone'"
              name="check-bold" 
              size="12"
              class="ico blue"
            />
            <span class="lb indent" >Internal microphone</span>
          </div>

          <div class='itm ' @click="selectMicrophone('Family room speaker')">
            <wl-icon
              v-if="selectedMicrophone === 'Family room speaker'"
              name="check-bold" 
              size="12"
              class="ico blue"
            />
            <span class="lb indent" >Family room speaker</span>
          </div>

        </div>

        <div class='grp split-line' v-if="!devicePaired && audioType === 'pc'" >
          <div class='tt '>
            <wl-icon
              name="adjust-microphone-bold" 
              :color=" theme === 'dark' ? 'white-70' : 'black-70' "
              size="14"
              class="ico" 
            />
            <span class="lb">Webex smart audio</span>
          </div>

          <div class='itm' ref="itm_smart_audio" @click="showSubmenuSmartAudio">
            <wl-icon 
              :name="smartAudios[selectedSmartAudio].icon" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="12"
              class="ico" 
            />
            <span class="lb indent" >{{smartAudios[selectedSmartAudio].name}}</span>
            <wl-icon
              name="arrow-down-filled" 
              :color=" theme === 'dark' ? 'white-95' : 'black-95' "
              size="12"
            />
          </div>

        </div>

        <div class='grp split-line' v-if="!devicePaired && audioType === 'pc'" >
          <div class='itm' @click="showPopSettings">
            <wl-icon
              name="settings-bold" 
              :color=" theme === 'dark' ? 'white-95' : 'black-95' "
              size="14"
              class="ico" 
            />
            <span class="lb indent" >Settings...</span>
          </div>
        </div>

        <div class='grp' v-if="!devicePaired && audioType && meetingOptionsList.length">
          <div class='tt' style="margin-bottom: -2px; margin-left: 14px;">
            <span v-if="audioType === 'pc'" class="lb">You're using your computer for audio</span> 
            <span v-if="audioType === 'callme'" class="lb">We’re calling you at +1 408-123-4567</span> 
            <span v-if="audioType === 'callin'" class="lb">You’re calling in</span> 
            <span v-if="audioType === 'none'" class="lb">You’re not connected to audio</span> 
          </div>

          <div class='itm ' @click="showPopAudioOptions">
            <svg class="ico" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99479 2.33563C9.91014 1.03156 8.82555 0 7.50011 0C6.35273 0 5.36097 0.779301 5.07889 1.87538C5.01006 2.14281 5.17106 2.4154 5.43849 2.48422C5.70592 2.55305 5.97851 2.39205 6.04733 2.12462C6.21636 1.46784 6.81175 1 7.50011 1C8.32849 1 9.00011 1.6716 9.00011 2.5V7.5L8.99324 7.64446C8.92055 8.4051 8.27978 9 7.50011 9C6.87248 9 6.31783 8.61095 6.09789 8.03423C5.99949 7.77621 5.71055 7.64682 5.45254 7.74522C5.19452 7.84362 5.06513 8.13256 5.16353 8.39057C5.47032 9.19499 6.16764 9.78022 6.99998 9.94972L6.99999 11H6.00011L5.91023 11.0081C5.67698 11.0504 5.50011 11.2545 5.50011 11.5C5.50011 11.7761 5.72397 12 6.00011 12H9.00011L9.08998 11.9919C9.32323 11.9496 9.50011 11.7455 9.50011 11.5C9.50011 11.2239 9.27625 11 9.00011 11H7.99999L8.00053 9.9499C9.14142 9.7181 10.0001 8.70933 10.0001 7.5V2.5L9.99479 2.33563ZM2.85355 3.14645L2.78431 3.08859C2.58944 2.9536 2.32001 2.97288 2.14645 3.14645L2.08859 3.21569C1.9536 3.41056 1.97288 3.67999 2.14645 3.85355L3.294 5H0.5L0.410124 5.00806C0.176875 5.05039 0 5.25454 0 5.5C0 5.77614 0.223858 6 0.5 6H3.292L2.14645 7.14645L2.08859 7.21569C1.9536 7.41056 1.97288 7.67999 2.14645 7.85355C2.34171 8.04882 2.65829 8.04882 2.85355 7.85355L4.86541 5.84129L4.91141 5.78431L4.96221 5.69104L4.98339 5.62815L4.99718 5.55343L5 5.5L4.99481 5.42772L4.98339 5.37186L4.96239 5.3094L4.93325 5.25024L4.89104 5.18834L4.85355 5.14645L2.85355 3.14645Z" fill="#121212"/>
            </svg>
            <span class="lb indent" >Change audio connection...</span>
          </div>
        </div>

        <div class='grp' v-if="devicePaired && meetingOptionsList.length">
          <div class='tt' style="margin-bottom: -2px; margin-left: 14px;">
            <span>You are using {{devicePairedName}}</span> 
          </div>

          <div class='itm ' @click="showPopAudioOptions">
            <wl-icon
              name="handset-bold" 
              :color=" theme === 'dark' ? 'white-95' : 'black-95' "
              size="14"
              class="ico" 
            />
            <span class="lb indent" >Switch audio</span>
          </div>
        </div>
    </div>
</template>

<script>
import popAudioOptions from './pop-audio-options.vue';

export default {
  data() {
    return {

    };
  },
  computed: {
    smartAudios() {
      return this.$store.state.smartAudios;
    },
    selectedSmartAudio() {
      return this.$store.state.selectedSmartAudio;
    },
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    os() {
      return this.$store.state.os;
    },
    selectedSpeaker(){
        return this.$store.state.selectedSpeaker;
    },
    selectedMicrophone(){
        return this.$store.state.selectedMicrophone;
    },
    audioType(){
        return this.$store.state.audioType;
    },
    meetingOptionsList(){
        return this.$store.state.meetingOptionsList;
    },
    devicePaired(){
        return this.$store.state.devicePaired;
    },
    devicePairedName(){
        return this.$store.state.devicePairedName;
    },

  },
  mounted() {},
  watch: {

  },
  methods: {

    showPopSettings() {
      this.$store.commit("popSettingsType", 'audio');
      this.$store.commit("popSettingsVisible", true);
      this.close();
    },
    selectSpeaker(name) {
      this.$store.commit("selectedSpeaker", name);
      this.close();
    },
    selectMicrophone(name) {
      this.$store.commit("selectedMicrophone", name);
      this.close();
    },
    showSubmenuSmartAudio() {
      this.$popper.show(
        {
          template: `
            <div class="sub-menulist" style="width:312px;">
              <div v-for="(itm, idx) in smartAudios"
                :key="idx"
                class='sub-menulist-item' 
                v-tooltip="{
                  content: smartAudios[idx].tooltip, 
                  html: true,
                  placement: 'bottom',
                  offset: [100, 0],
              }"
                @click="close(idx)"
              >
                <wl-icon 
                  :name="smartAudios[idx].icon" 
                  :color=" theme === 'light' ? 'black-95' : 'white-95' "
                  size="12"
                  class="ico" 
                />
                <span class="lb">{{smartAudios[idx].name}}</span>
                <svg v-if="selectedSmartAudio === idx" class="suffix" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.50261 9.50001C4.36961 9.50001 4.24261 9.44701 4.14861 9.35301L1.14661 6.34601C0.951614 6.15001 0.951614 5.83401 1.14761 5.63901C1.34161 5.44401 1.65861 5.44301 1.85461 5.64001L4.50261 8.29201L10.1446 2.64601C10.3396 2.45101 10.6556 2.45101 10.8516 2.64601C11.0466 2.84101 11.0466 3.15801 10.8516 3.35401L4.85661 9.35401C4.76261 9.44701 4.63561 9.50001 4.50261 9.50001Z" fill="#64B4FA"/>
                </svg>

              </div>
            </div>
          `,
          props: ['parentComp', 'theme', 'smartAudios', 'selectedSmartAudio'],
          methods: {
            close(idx) {
              this.$store.commit('selectedSmartAudio', idx);
              this.$popper.hide('smart-audio-submenu');
            },
          }
        },
        {
          parentComp: this,
          theme: this.theme,
          selectedSmartAudio: this.selectedSmartAudio,
          smartAudios: this.smartAudios,
        }, // component props
        {
          name: 'smart-audio-submenu',
          reference: this.$refs['itm_smart_audio'],
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
                  offset: [0, -33],
                },
              },
            ],
          },
        }, // popper props
        {
        } // popper eventlistener
      );
    },
    showPopAudioOptions() {
      this.close();
      this.$modal.show(
        popAudioOptions, 
        {}, // component props
        {
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          draggable: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          roundedCorner: this.os === 'mac',
          width: 458,
          height: 'auto',
        }, // modal props
        {
        } // modal eventlistener
      );
    },
    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">
#ctrl-menu-aduio {
  width: 320px;
  pointer-events: auto;

  margin-top: 10px;
  margin-bottom: 6px;

  .grp {
    margin-bottom: 4px;
    .tt{
      height: 32px;
      user-select: none;
      display: flex;
      flex-direction: row;
      align-items: center;
    
      font-size: 12px;
      margin-bottom: 3px;
      padding: 0 15px;

      .ico {
        margin-right: 5px;
      }

      .lb{
        opacity: .7;
      }
    }
  }

  .itm{
    height: 32px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
  
  }
  .itm .bold{
    font-weight: 600;
  }
  .itm .indent{
      margin-left: 12px;
  }
  .itm:hover{
      background: $md-gray-10;
  }

  .itm .lb{
    flex-grow: 1;
    font-size: 14px;
    pointer-events: none;
    padding-left: 8px;
  }
  .itm .ico{
      margin-right: -12px;
  }
  .split-line{
      border-bottom: 1px solid #EEE;
  }

  .blue path{
    fill: $md-blue-60;
  }


  /* ------------------ drak ------------------ */
  &.hybrid {
    color: $text-color-primary-light-ui;
  }

  &.dark {
    color: $text-color-primary-dark-ui;

    .itm {
      svg {
        fill: $text-color-primary-dark-ui; 
      }
    }

    .split-line{
      border-bottom: 1px solid $md-gray-80;
    }
    .itm:hover{
        background: $md-gray-90;
    }

    .blue path{
      fill: $md-blue-40;
    }
  }
  
}


.sub-menulist {
  background-color: rgba($color: #000000, $alpha: 0.05);

  &-item {
    height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
    padding-left: 12px;

    .lb {
      flex-grow: 1;
      font-size: 14px;
    }

    .ico {
      margin: 0 8px 0 -1px;
    }

    .suffix {
      margin-right: 12px;

      path {
        fill: $md-blue-60;
      }
    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: .05);
    }
    &:active {
      background-color: rgba($color: #000000, $alpha: .11);
    }
  }
}

.dark {
  .sub-menulist {
    background-color: rgba($color: #000000, $alpha: 0.5);

    &-item {

      .suffix {
        path {
          fill: $md-blue-40;
        }
      }
      
      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .05);
      }
      &:active {
        background-color: rgba($color: #FFFFFF, $alpha: .11);
      }
    }
  }
}

</style>
