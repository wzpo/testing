<template>
	<div 
    id='pop-in-meeting-settings' 
    :class="[os, theme]"
    :style="{
      background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['app'][0]} 0%, ${themeColorList[theme][themeColor]['app'][1]} 100%)`
    }"
  >
    <div class='title'>
      <span class="lb">Meeting and participant settings</span>
      <div class='close' @click="close"><wl-icon name="cancel-bold" :size="16" /></div>   
    </div>

    <div class="mainbody">
      <div class="tabs" >

        <div class="tab" :class="{selected: true}" >
          <div class="ico">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.498 2.5V1.5C12.498 1.36739 12.4454 1.24021 12.3516 1.14645C12.2578 1.05268 12.1307 1 11.998 1C11.8654 1 11.7383 1.05268 11.6445 1.14645C11.5507 1.24021 11.498 1.36739 11.498 1.5V2.5H6.49805V1.5C6.49805 1.36739 6.44537 1.24021 6.3516 1.14645C6.25783 1.05268 6.13066 1 5.99805 1C5.86544 1 5.73826 1.05268 5.64449 1.14645C5.55073 1.24021 5.49805 1.36739 5.49805 1.5V2.5C4.83524 2.50077 4.1998 2.76441 3.73113 3.23308C3.26245 3.70176 2.99881 4.33719 2.99805 5V12C2.99883 12.6628 3.26247 13.2982 3.73114 13.7669C4.19981 14.2356 4.83525 14.4992 5.49805 14.5H12.498C13.1608 14.4992 13.7963 14.2356 14.265 13.7669C14.7336 13.2982 14.9973 12.6628 14.998 12V5C14.9973 4.3372 14.7336 3.70177 14.265 3.2331C13.7963 2.76442 13.1608 2.50078 12.498 2.5ZM5.49805 3.5H12.498C12.8957 3.50044 13.277 3.65861 13.5582 3.93982C13.8394 4.22103 13.9976 4.60231 13.998 5V5.5H3.99805V5C3.99848 4.60231 4.15666 4.22103 4.43787 3.93982C4.71908 3.65861 5.10036 3.50044 5.49805 3.5ZM12.498 13.5H5.49805C5.10036 13.4996 4.71908 13.3414 4.43787 13.0602C4.15666 12.779 3.99848 12.3977 3.99805 12V6.5H13.998V12C13.9976 12.3977 13.8394 12.779 13.5582 13.0602C13.277 13.3414 12.8957 13.4996 12.498 13.5Z" fill="white" fill-opacity="0.95"/>
            </svg>
          </div>
          Meeting options
        </div>

        <div class="tab" :class="{selected: false}" >
          <div class="ico">
            <wl-icon name="participant-list-bold" size="16" />
          </div>
          Participant privileges
        </div>

      </div>

      <div 
        class="scrollpane" 
        :class="[theme === 'dark' ? 'dark' : 'light']"
        :style="{
          background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`
        }"
      >
        <div class="scrollcontent" >

          <div class="audio" >

            <div class='tit'>Meeting options for all participants</div>

            <div class="rw">
              <md-checkbox value="Turn on video"
              label="Turn on video"
              htmlId="1"
              checked
              />
            </div>

            <div class="rw">
              <md-checkbox value="Send Reactions"
              label="Send Reactions"
              htmlId="2"
              checked
              />
            </div>
            <div class="rw indent">
              <md-checkbox value="Show display name with reactions"
              label="Show display name with reactions"
              htmlId="3"
              disabled
              />
            </div>

            <div class="rw">
              <md-checkbox value="Raise hand"
              label="Raise hand"
              htmlId="4"
              checked
              />
            </div>

            <div class="rw">
              <md-checkbox value="Mute on entry"
              label="Mute on entry"
              htmlId="5"
              />
            </div>

            <div class="rw">
              <md-checkbox value="Entry and exit tone"
              label="Entry and exit tone"
              htmlId="6"
              checked
              />
            </div>

          </div>

          <div class="bottom-btns"> 
            <md-button class="btn md-button-solid " aria-label="x" :size="32" @click="close" >Apply</md-button>
            <md-button class="btn md-button-outline " aria-label="x" :size="32" @click="close" >Cancel</md-button>
          </div>
        </div>
      </div>

    </div><!--mainbody-->

  </div>
</template>

<script>

export default {

    data() {
        return {

        }
    },
    computed:{
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

      audioConnected(){
          return this.$store.state.audioConnected;
      },
      audioType(){
          return this.$store.state.audioType;
      },

    },
    mounted(){

    },
    beforeDestroy() {

    },
    watch: {

    },
    methods:{

      goTab() {
        //
      },

      
      close(){
          this.$emit('close'); 
      },
    }

}
</script>

<style lang="scss">
#pop-in-meeting-settings {
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    user-select: none;
    box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
    height: 100%;

    .title {
      @include flex;
      width: 100%;
      height: 48px;

      .lb{
        font-size: 16px;
        margin: 0 20px;
        flex-grow: 1;
      }
      .close {
        @include flex(row, center, flex-start);
        width: 20px;
        height: 30px;
        pointer-events: auto;
        cursor: default;
        margin-right: 10px;
      }
    }
    
    .mainbody {
      display: flex;
      flex-grow: 1;

      .tabs {
        display: flex;
        flex-direction: column;
        width: 236px;
        margin: 0 8px;

        .tab {
          display: flex;
          align-items: center;
          width: calc(100% - 8px);
          margin-bottom: 8px;
          margin-right: 8px;
          height: 40px;
          font-size: 16px;
          color: $md-gray-100;
          cursor: default;
          border-radius: 8px;

          .ico {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            svg path {
              fill: black;
            }
          }
        }
        .tab.selected {
          color: black;
          background: rgba($color: #000000, $alpha: .1);
        }
      }

      .scrollpane{
        overflow-x: hidden;
        overflow-y: scroll;
        display: flex;
        flex-grow: 1;
        justify-content: center;
        border-radius: 12px 0 0 0;
        padding-top: 16px;
      }
      .scrollcontent{
        position: relative;
        width: 100%;
        margin: 5px 20px;
      }
    }

    .tit{
      font-size: 14px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .rw {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      &.indent {
        margin-left: 24px;
      }
      
    }

    .md-checkbox {
      margin-bottom: 0;

      .md-checkbox__label span {
        font-size: 16px;
      }

      .md-checkbox__input:disabled + .md-checkbox__label:before {
        background: rgba(255, 255, 255, 0.3);
      }
    }


    .bottom-btns {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 44px;
      display: flex;
      justify-content: flex-end;
    }

    &.mac {
      border-radius: 12px;
      overflow: hidden;
      transform: rotate(0deg);
    }

    /* theme ----- dark/hybrid */
    &.dark, &.hybrid {
      color: $text-color-primary-dark-ui;
      border: 1px solid rgba(255,255,255,.16);

      .tabs .tab {
        color: $md-gray-30;

        .ico {
          svg path {
            fill: white;
          }
        }
      }
      .tabs .tab.selected {
        background: rgba($color: #FFFFFF, $alpha: .1);
        color: white;;
      }
    }
    &.hybrid {
      .scrollpane{
        color: $text-color-primary-light-ui;
      }
    }

    
}
</style>