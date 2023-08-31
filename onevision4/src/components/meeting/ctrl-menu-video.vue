<template>
    <div
    id="ctrl-menu-video"
    ref="popover"
    :class="[theme]"
    >

        <div class='grp' >
          <div class='tt split-line'>
            <wl-icon
              name="camera-bold" 
              :color=" theme === 'dark' ? 'white-70' : 'black-70' "
              size="14"
              class="ico" 
            />
            <span class="lb">Camera</span>
          </div>
          <div class='itm' @click="selectCamera('LG UltraFine Display Camera')">
            <wl-icon
              v-if="selectedCamera === 'LG UltraFine Display Camera'"
              name="check-bold" 
              size="12"
              class="ico blue"
            />
            <span class="lb indent" >LG UltraFine Display Camera</span>
          </div>

          <div class='itm' :class="{'split-line': meetingOptionsList.length}" @click="selectCamera('FaceTime HD Camera (Built-in)')">
            <wl-icon
              v-if="selectedCamera === 'FaceTime HD Camera (Built-in)'"
              name="check-bold" 
              size="12"
              class="ico blue"
            />
            <span class="lb indent" >FaceTime HD Camera (Built-in)</span>
          </div>

        </div>

        <div v-if="meetingOptionsList.length" class='grp ' >
          <div class='itm ' ref="menu-item-self-view-option"  @click="showPopSettings('video')" >
            <wl-icon
              name="settings-bold" 
              :color=" theme === 'dark' ? 'white-95' : 'black-95' "
              size="14"
              class="ico" 
            />
            <span class="lb indent" >Video settings...</span>
          </div>
        </div>

        <div v-if="meetingOptionsList.length" class='grp split-line' >
          <div class='itm ' @click="showPopSettings('vbg')">
            <wl-icon
              name="video-effect-bold" 
              :color=" theme === 'dark' ? 'white-95' : 'black-95' "
              size="14"
              class="ico" 
            />
            <span class="lb indent" >Change virtual background...</span>
          </div>
        </div>

        <div v-if="meetingOptionsList.length" class='grp' >
          <div class='itm ' ref="menu-item-self-view-option"  @click="handleSelviewOption" >
            <wl-icon
              name="video-layout-video-dominant-bold" 
              :color=" theme === 'dark' ? 'white-95' : 'black-95' "
              size="14"
              class="ico" 
            />
            <span v-if="selfViewOption === 2" class="lb indent" >Self-view location...</span>
            <span v-if="selfViewOption === 1" class="lb indent" >Self-view...</span>
          </div>
        </div>
    </div>
</template>

<script>

export default {
  data() {
    return {
      selfviewSubmenuOptions:[
        'Show my self view in the grid',
        'Show my self view in a floating window',
        'Hide my self view',
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
    selectedCamera(){
        return this.$store.state.selectedCamera;
    },
    meetingOptionsList(){
        return this.$store.state.meetingOptionsList;
    },
    selfVideoWithOthers() {
      return this.$store.state.selfVideoWithOthers;
    },
    donotShowMySelf() {
      return this.$store.state.donotShowMySelf;
    },
    selfViewOption() {
      return this.$store.state.selfViewOption;
    },
    
  },
  mounted() {},
  watch: {

  },
  methods: {

    showPopSettings(type) {
      this.$store.commit("popSettingsType", type);
      this.$store.commit("popSettingsVisible", true);
      this.close();
    },

    selectCamera(name) {
      this.$store.commit("selectedCamera", name);
      this.close();
    },

    handleSelviewOption(){
      this.showPopSettings('selfview')
      this.close();
      
    },
    
    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">
#ctrl-menu-video {
  width: 260px;
  pointer-events: auto;

  margin-top: 10px;
  margin-bottom: 6px;

  .grp .tt{
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

  .itm{
    height: 32px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;

    .bold{
      font-weight: 600;
    }
    .indent{
      margin-left: 12px;
    }
    &:hover{
      background: $md-gray-10;
    }

    .lb{
      font-size: 14px;
      pointer-events: none;
      padding-left: 8px;
      flex-grow: 1;
    }
    .ico{
      margin-right: -12px;
    }

    .icoarr {
      margin-right: -8px;
    }
  
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

    .tt {
      color: $text-color-disabled-light-ui;
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




</style>
