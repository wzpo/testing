<template>
  <portal
    to="portal-agenda"
    :disabled="!agendaPanelPopouted"
    id="agenda_panel"
    ref="panel"
    :class="[{minheight: openedPanelCnt <=2 && !chatPanelVisible}]"
    
  >
    <div class="agenda_panel_wrap" :class="[theme]">
      <panel-header
        :title="''"
        :type="'agenda'"
        :floating="agendaPanelPopouted"
        :backVisible="!agendaPanelPopouted"
        @close="close"
        @popout="popout"
        @back="back"
      ></panel-header>

      <div class="ph" />

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
      title: "Agenda",

    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId);
    },
    panelVisible() {
      return this.$store.state.panelVisible;
    },
    chatPanelVisible() {
      return this.$store.state.chatPanelVisible;
    },
    agendaPanelVisible() {
      return this.$store.state.agendaPanelVisible;
    },
    agendaPanelPopouted() {
      return this.$store.state.agendaPanelPopouted;
    },

    fullscreen() {
      return this.$store.state.fullscreen;
    },
    openedPanelCnt() {
      return this.$store.getters.openedPanelCnt;
    },
  },
  mounted() {
  },
  watch: {},
  methods: {
    close() {
      this.$store.commit("agendaPanelVisible", false);
      setTimeout( () => this.$store.commit("agendaPanelPopouted", false), 100);
    },
    back() {
      this.close();
      this.$store.commit("appsPanelVisible", true);
    },
    popout() {
      this.$store.commit("agendaPanelPopouted", !this.agendaPanelPopouted);
    },
  }
};
</script>


<style lang="scss">
#agenda_panel {
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
  .agenda_panel_wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .minheight{
      min-height: 250px;
    }

    .ph {
      flex-shrink: 1;
      flex-grow: 1;
      width: 320px;
      background: url(~@/assets/img/temp_panel_agenda.png) no-repeat;
      background-size: 320px 566px;
    }

    .scrollpane {
      margin: 0 10px;
      overflow-y: scroll;
      overflow-x: hidden;
      display: flex;
      flex-grow: 1;
    }
    .list {
      width: 100%;
      padding-bottom: 10px;

    }

    /* theme ----- dark/hybrid */
    &.hybrid {
      color: $text-color-primary-light-ui;
    }
    &.dark {
      color: $text-color-primary-dark-ui;
    }
  }
  

</style>
