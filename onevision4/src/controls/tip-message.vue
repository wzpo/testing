<template>
  <div class="tip-message" :class="[theme]" v-if="show">
    <div class="wrap"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    >
      <div class="label" v-html="label"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    show: Boolean,
    transcript: Boolean,
  },
  data() {
    return {
      hover: false,
      moreMenuVisible: false,
      moreMenuData: [
        {
          name: 'Font Size',
          icon: 'icon-arrow-right_8',
        },
        {
          name: 'Open Transcript Panel',
          onClick: this.showTranscriptPanel
        }
      ],
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    notification() {
      return this.$store.state.notification;
    }
  },
  mounted() {},
  watch: {},
  methods: {
    mouseover() {
      if (!this.hover) {
        this.hover = true;
      }
    },
    mouseleave() {
      if (!this.moreMenuVisible) {
        this.hover = false;
      }
    },
    mouseleavePopmenu() {
      this.moreMenuVisible = false;
    },
    toggleMoreMenu() {
      this.moreMenuVisible = !this.moreMenuVisible;
    },
    close() {
      this.hover = false;
      this.moreMenuVisible = false;
      this.$store.commit('closedCaptionEnabled', false);
    },
    showTranscriptPanel() {
      this.hover = false;
      this.moreMenuVisible = false;
      this.$store.commit('appsPanelVisible', true);
      this.$emit("openppanel", 'apps');
    },
  }
};
</script>

<style lang="scss">
.tip-message {
  position: absolute;
  width: 628px;
  left: calc((100% - 628px) / 2);
  justify-content: center;
  display: flex;
  flex-direction: row;

  .wrap {
    position: relative;
    display: flex;
    flex-direction: row;
    background: rgba(0, 0, 0, 0.72);
    border-radius: 6px;
    pointer-events: auto;
    justify-content: center;
    align-items: center;
    padding: 0 25px;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 4px 12px rgba(0, 0, 0, 0.15);
  }
  .label {
    line-height: 20px;
    font-size: 14px;
    color: #fff;
    padding: 12px 0;
  
  }
  .btns {
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
  }
  .btn {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #383C40;
    margin-left: 6px;
    cursor: default;
    color: #fff;
  }
  .btn:hover,
  .btn:active{
    background: #222;
  }
}
</style>
