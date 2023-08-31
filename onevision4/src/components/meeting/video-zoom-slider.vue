<template>
    <div 
      class="video-zoom-slider" 
      :class="[theme]"
      :style="styleObject"
      @mousedown="(e) => {e.preventDefault(); e.stopPropagation();}"
    >
      <!--
      <svg @click="zoomOut" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 9.5C11 9.776 10.776 10 10.5 10H9.795L9.721 9.704C9.521 8.904 8.908 8.304 8.145 8.09C8.672 7.55 9 6.813 9 6C9 4.346 7.654 3 6 3C4.346 3 3 4.346 3 6C3 6.813 3.328 7.55 3.855 8.09C3.092 8.304 2.479 8.904 2.279 9.704L2.205 10H1.5C1.224 10 1 9.776 1 9.5V2.5C1 2.224 1.224 2 1.5 2H10.5C10.776 2 11 2.224 11 2.5V9.5ZM4.461 9H7.539C8.113 9 8.612 9.39 8.751 9.946L8.765 10H3.235L3.249 9.946C3.388 9.39 3.887 9 4.461 9ZM6 8C4.897 8 4 7.103 4 6C4 4.897 4.897 4 6 4C7.103 4 8 4.897 8 6C8 7.103 7.103 8 6 8ZM10.5 1H1.5C0.672 1 0 1.672 0 2.5V9.5C0 10.328 0.672 11 1.5 11H10.5C11.328 11 12 10.328 12 9.5V2.5C12 1.672 11.328 1 10.5 1Z" fill="#121212"/>
      </svg>
      -->
      <div class="bico" @click="zoomOut">
        <wl-icon name="zoom-out-bold" size="16" />
      </div>
      
      <md-slider
        :min="0"
        :max="max"
        :tick="1"
        :value="value"
        :step="1"
        :showTicks="false"
        :showSelection="true"
        @change="setVideoZoom"
        class="zoom-slider"
        :style="{width: `${sliderWidth}px`}"
      />

      <div class="bico" @click="zoomIn">
        <wl-icon name="zoom-in-bold" size="16" />
      </div>
      <!--
      <svg @click="zoomIn" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15 12C15 12.551 14.551 13 14 13H13.401C12.926 11.861 11.85 11.085 10.6 11.015C11.45 10.281 12 9.209 12 8C12 5.794 10.206 4 8 4C5.794 4 4 5.794 4 8C4 9.209 4.55 10.281 5.4 11.015C4.15 11.085 3.074 11.861 2.599 13H2C1.449 13 1 12.551 1 12V4C1 3.449 1.449 3 2 3H14C14.551 3 15 3.449 15 4V12ZM10.418 12C11.182 12 11.853 12.396 12.262 13H3.738C4.147 12.396 4.818 12 5.582 12H10.418ZM8 11C6.346 11 5 9.654 5 8C5 6.346 6.346 5 8 5C9.654 5 11 6.346 11 8C11 9.654 9.654 11 8 11ZM14 2H2C0.895 2 0 2.895 0 4V12C0 13.105 0.895 14 2 14H14C15.105 14 16 13.105 16 12V4C16 2.895 15.105 2 14 2Z" fill="#121212"/>
      </svg>
      -->

    </div>
</template>

<script>


export default {
  props:{
    meetingId: null,
    mini: {
      type: Boolean,
      default: false,
    },
    showBackground: {
      type: Boolean,
      default: true,
    },
    bigIcon: {
      type: Boolean,
      default: false,
    },
    sliderWidth: {
      type: Number,
      default: 256,
    },
  },
  data() {
    return {
        value: 0,
        max: 0,
    }
  },
  computed:{
    theme() {
      let t = this.$store.state.theme;
      return t === 'light' ? 'light' : 'dark';
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    itembgColor() {
      return this.themeColorList[this.theme][this.themeColor]['itembg'];
    },
    styleObject() {
      return {
        '--item-back-color': this.themeColorList[this.theme][this.themeColor]['app'][1],
        '--item-back-hover': this.itembgColor.hover,
        '--item-back-active': this.itembgColor.active,
      };
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId)
    },
    videoZoomLevel() {
      return this.$store.getters.videoZoomLevel(this.meetingId);
    },
    videoZoomMax() {
      return this.$store.getters.videoZoomMax(this.meetingId);
    },
    videoStripDockSide() {
      var meeting = this.meetingOptionsList.find(
        itm => itm.meetingId === this.meetingId
      );
      return meeting.videoStripDockSide;
    },
    videoStripSize() {
      return this.$store.state.videoStripSize;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
  },
  mounted(){
    this.value = this.videoZoomLevel;
    this.max = this.videoZoomMax;
  },
  watch: {
    videoLayout() {
      this.value = this.videoZoomLevel;
      this.max = this.videoZoomMax;
    },
    videoZoomLevel() {
      this.value = this.videoZoomLevel;
    },
    meetingOptionsList(val, oldVal) {
      var meeting = val.find(
        itm => itm.meetingId === this.meetingId
      )
      var oldmeeting = oldVal.find(
        itm => itm.meetingId === this.meetingId
      )
      if (!oldmeeting || meeting.videoStripDockSide !== oldmeeting.videoStripDockSide) {
        this.value = this.videoZoomLevel;
        this.max = this.videoZoomMax;
      }
    },
    videoStripSize() {
      this.value = this.videoZoomLevel;
      this.max = this.videoZoomMax;
    },
  },
  methods:{
    setVideoZoom(val) {
      if (this.videoLayout === 'grid') {
        this.$store.commit("videoZoomLevelGrd", val);
      } else if (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing') {
        this.$store.commit("videoZoomLevelStage", val);
      }
    },
    zoomIn() {
      let lv = this.videoZoomLevel;
      if (lv < this.videoZoomMax) {
        lv++;
      }
      this.setVideoZoom(lv);
    },
    zoomOut() {
      let lv = this.videoZoomLevel;
      if (lv > 0) {
        lv--;
      }
      this.setVideoZoom(lv);
    },
  }
}
</script>


<style lang="scss">
  .video-zoom-slider {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 8px;
    height: 32px;
    flex-shrink: 0;


    .bico {
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: auto;
      cursor: default;

      svg path {
        fill: black;
      }
    }
    
    .zoom-slider {
      pointer-events: auto;
      cursor: default;
      margin: 2px 12px 0 12px;

      .md-slider__bar {
        left: 0;
        background-color: $md-gray-40;
      }
      .md-slider__selection {
        background-color: $md-blue-60;
      }
      .md-slider__pointer {
        top: -7px;
        width: 16px;
        height: 16px;
        margin-left: -8px;
        background-color: #FFF;
        border: 1px solid rgba($color: #000, $alpha: 0.7);
        box-shadow: none;
      }
    }


    &.dark,
    &.hybrid {


      .bico {
        svg path {
          fill: white;
        }
      }
      .zoom-slider {
        .md-slider__bar {
          background-color: rgba($color: #FFF, $alpha: 0.4);
        }
        .md-slider__selection {
          background-color: $md-blue-40;
        }
        .md-slider__pointer {
          background-color: #000;
          border: 1px solid rgba($color: #FFF, $alpha: 0.7);
        }
      }

    }

  }

</style>
