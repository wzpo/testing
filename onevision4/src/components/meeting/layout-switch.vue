<template>
    <div id="btn_view_switch"
      class='btn_view_switch'
      ref="btn_view_switch"
      :class="[theme, {
        mini: mini && !layoutControlExpanded && !menuVideoLayoutVisible,
        bg: showBackground,
        active: menuVideoLayoutVisible,
      }]"
      :style="styleObject"
      @click='openLayoutMenu'
      @mouseover="() => {layoutControlExpanded = true}"
      @mouseleave="() => {layoutControlExpanded = false}"
    >
        <wl-icon class="ico" v-if="videoLayout === 'grid'" name="video-layout-equal-bold" size="14" />
        <wl-icon class="ico" v-if="videoLayout === 'stage-sharing' && (videoStripDockSide === 'T' || videoStripDockSide === 'B')" name="video-layout-stack-bold" size="14" />
        <wl-icon class="ico" v-if="videoLayout === 'stage-sharing' && (videoStripDockSide === 'L' || videoStripDockSide === 'R')" name="layout-side-by-side-vertical-bold" size="14" />
        <wl-icon class="ico " v-if="videoLayout === 'stage' && (videoStripDockSide === 'T' || videoStripDockSide === 'B')" name="video-layout-stack-bold" size="14" />
        <wl-icon class="ico" v-if="videoLayout === 'stage' && (videoStripDockSide === 'L' || videoStripDockSide === 'R')" name="layout-side-by-side-vertical-bold" size="14" />

        <span class="lb" v-if="!mini || layoutControlExpanded || menuVideoLayoutVisible">{{defaultLabel}}</span>

    </div>
</template>

<script>
import menuVideoLayout from './menu-video-layout.vue';

export default {
  props:{
    meetingId: null,
    defaultLabel: {
      type: String,
      default: 'Layout',
    },
    mini: {
      type: Boolean,
      default: false,
    },
    showBackground: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      layoutControlExpanded: false,
      menuVideoLayoutVisible: false,
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
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    videoStripDockSide() {
      var meeting = this.meetingOptionsList.find(
        itm => itm.meetingId === this.meetingId
      );
      return meeting.videoStripDockSide;
    },
  },
  mounted(){

  },
  watch: {

  },
  methods:{
    openLayoutMenu() {
      if (!this.menuVideoLayoutVisible) {
        this.$popper.show(
          menuVideoLayout, 
          {
            meetingId: this.meetingId,
          }, // component props
          {
            name: 'video-layout-menu',
            reference: this.$refs.btn_view_switch,
            affiliatedElementSelector: ['#menu-video-layout-theme'],
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {placement: 'bottom-end'},
          }, // popper props
          {
            opened: () => {this.menuVideoLayoutVisible = true},
            closed: () => {
              setTimeout(() => {
                this.menuVideoLayoutVisible = false
              }, 300)
            },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
  }
}
</script>


<style lang="scss">
.btn_view_switch {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  padding: 0 10px;
  flex-shrink: 0;

  pointer-events: auto;
  cursor: default;
  user-select: none;

  height: 24px;
  border-radius: 12px;

  border: 1px solid rgba($color: #000000, $alpha: .5);

  &.small {
    height: 28px;
    border-radius: 14px;
  }

  &.bg {
    /*background-color: var(--item-back-color);*/
  }

  &:hover {
    background-color: var(--item-back-hover);
    border: 1px solid rgba($color: #000000, $alpha: .7);
  }

  &:active,
  &.active {
    background-color: var(--item-back-active);
    border: 1px solid rgba($color: #000000, $alpha: .9);
  }

  &.mini {
    height: 28px;
    width: 28px;
  }

  .ico.r180 {
    transform: rotate(180deg);
    transform-origin: 50%;
  }

  .lb {
    margin-left: 6px;
  }

  &.dark,
  &.hybrid {
    border: 1px solid rgba($color: #FFFFFF, $alpha: .5);

    &:hover {
      border: 1px solid rgba($color: #FFFFFF, $alpha: .7);
    }

    &:active,
    &.active {
      border: 1px solid rgba($color: #FFFFFF, $alpha: .9);
    }
  }

}


</style>
