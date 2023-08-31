<template>
  <portal
    to="portal-cc"
    :disabled="!ccPanelPopouted"
    id="cc_panel"
    ref="panel"
    :style="{height: height}"
  >
    <div class="cc_panel_wrap" :class="[theme]">
      <panel-header
        :title="title"
        :type="'cc'"
        :floating="ccPanelPopouted"
        :popoutVisible="true"
        @close="close"
        @popout="popout"
      ></panel-header>
      
      <div class="scrollpane" >
        <div class="list">

        </div>
      </div>

    </div>
  </portal>
</template>

<script>

export default {
  props: {
    meetingId: String,
  },
  data() {
    return {
      title: "Captions & Highlights",
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    height() {
      if (this.fixHeight && !this.fullscreen) {
        return "197px";
      } else {
        return "auto";
      }
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId);
    },
    panelVisible() {
      return this.$store.state.panelVisible;
    },
    ccPanelVisible() {
      return this.$store.state.ccPanelVisible;
    },
    ccPanelPopouted() {
      return this.$store.state.ccPanelPopouted;
    },
    fixHeight() {
      return (
        this.$store.state.plistPanelVisible &&
        !this.fullscreen
      );
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    ccMsgList() {
      return this.$store.state.ccMsgList;
    },
    plistPanelVisible() {
      return this.$store.state.plistPanelVisible;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    }
  },
  mounted() {
  },
  watch: {},
  methods: {
    close() {
      this.$store.commit("ccPanelVisible", false);
      setTimeout( () => this.$store.commit("ccPanelPopouted", false), 100);
    },
    popout() {
      //this.$store.commit("ccPanelPopouted", !this.ccPanelPopouted);
    },
    sendmsg() {}
  }
};
</script>


<style lang="scss">
#cc_panel {
  width: 100%;
  font-size: 12px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  border-radius: 6px;
  transform: rotate(0deg);
  overflow: hidden;

}
  .cc_panel_wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .scrollpane {
      flex-shrink: 1;
      flex-grow: 1;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100px;
      scroll-behavior: smooth;
    }
    .list {
      width: 100%;
      padding-bottom: 10px;
    }
    .inputbox {
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }
    .tawrap {
      width: 100%;
    }
    textarea {
      border: none;
      width: 100%;
      margin: 7px 15px 0 15px;
      resize: none;
      cursor: text;
      background-color: transparent;
    }
    textarea:focus {
      outline: none;
      box-shadow: none;
    }


    /* theme ----- dark/hybrid */
    &.hybrid {
      color: $text-color-primary-light-ui;
    }
    &.dark {
      color: $text-color-primary-dark-ui;
    }


    &.dark .inputbox {
      width: 100%;
      border-top: 1px solid $md-gray-80;
    }
    &.dark .inputbox textarea {
      color: $text-color-primary-dark-ui;
    }
    &.dark .selectbox .lb {
      color: $md-gray-50;
    }
  }
  
</style>
