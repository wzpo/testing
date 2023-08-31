<template>
    <SplitGrid 
      direction="column" 
      sizeUnit="fr"
      :snapOffset="0"
      :dragInterval="0"
      :gutterSize="4"
      id='sharing-pane'         
      :class="[os, theme, videoLayout, {
        swapped: videoAndShareContentSwapped,
        transition: !disableElementTransition,
      }]"
      @drag-start="resizeStart"
    >
      <SplitGridArea 
        class="gridarea"
      >
        <sharing-section type="sharing" :tabs="leftTabs" :pointerEventsDisabled="pointerEventsDisabled" :meetingId="meetingId" />
      </SplitGridArea>
      <SplitGridGutter :show="rightTabs.length > 0" class="vsg_gutter_v" />
      <SplitGridArea
        :show="rightTabs.length > 0"
        class="gridarea"
      >
        <sharing-section type="collaborating" :tabs="rightTabs" :pointerEventsDisabled="pointerEventsDisabled" :meetingId="meetingId" />
      </SplitGridArea>

    </SplitGrid>
</template>

<script>
//import popMiro from './pop-miro.vue'
//import popBox from './pop-box.vue'

export default {
  props: {
    meetingId: String,
    currentSharing: {
      type: Array,
      default: () => { return []}
    },
    pointerEventsDisabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      leftTabs: [],
      rightTabs: [],
    };
  },
  computed: {

    collaboratingSide() {
      return this.$store.state.collaboratingSide;
    },
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId)
    },
    filePath() {
      return this.$store.state.filePath;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    stageMaximized() {
      return this.$store.state.stageMaximized;
    },
    videoAndShareContentSwapped() {
      return this.$store.state.videoAndShareContentSwapped;
    },
    selfSharing() {
      return this.$store.state.selfSharing;
    },
    enabledApps() {
      return this.$store.state.enabledApps;
    },
    hudVisible() {
      return this.$store.state.hudVisible;
    },
    disableElementTransition() {
      return this.$store.state.disableElementTransition;
    },
    host() {
      return this.$store.getters.host;
    },
    chatMsgList() {
      return this.$store.state.chatMsgList;
    },
    activeSpeakerName() {
      return this.$store.state.activeSpeakerName;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    
  },
  mounted() {
    this.setTabs(this.currentSharing);
  },
  watch: {
    meetingOptionsList(val, oldVal) {
      var meeting = val.find(
        itm => itm.meetingId === this.meetingId
      )
      var oldmeeting = oldVal.find(
        itm => itm.meetingId === this.meetingId
      )
      if (!oldmeeting || meeting.currentSharing.length !== oldmeeting.currentSharing.length) {
        this.setTabs(meeting.currentSharing);
      }
    },
  },
  methods: {

    setTabs(array) {
      let shareList = array.filter(val => {
        return val.type === 'sharing' && !val.popped
      });
      let appList = array.filter(val => {
        return val.type === 'collaborating' && !val.popped
      });
      let list = shareList.concat(appList);

      if (list.length === 1) {
        this.leftTabs = list.slice();
        this.rightTabs = [];

      } else if (list.length === 2) {
        this.leftTabs = list.slice(0, 1);
        this.rightTabs = list.slice(1, 2);

      } else if (list.length === 3) {
        if (shareList.length < 3) {
          this.leftTabs = shareList.slice();
          this.rightTabs = appList.slice();
        } else {
          this.leftTabs = shareList.slice(0, 2);
          this.rightTabs = shareList.slice(2, 3);
        }

      } else if (list.length > 3) {
        this.leftTabs = shareList.slice();
        this.rightTabs = appList.slice();
        
      }
    },


    toggleMax() {
      this.$store.commit("stageMaximized", !this.stageMaximized);
      this.close();
    },

    resizeStart() {
      
    },


  }
};
</script>

<style lang="scss">
#sharing-pane {
  position: absolute;

  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: auto;

  &.transition {
    transition: all 0.2s ease-out;
  }

  &.swapped {
    width: calc(100% - 8px);
    height: calc(100% - 8px);
  }

  .gridarea {
    height: 100%;
    overflow: hidden;
  }

  .vsg_gutter_v {
    &:hover {
      background-color: rgba($color: #000000, $alpha: .2);
    }
  }

  .fade {
    transition: opacity 0.3s ease-out;
    opacity: 0;
  }

  &.dark,
  &.hybrid {
    color: $text-color-primary-dark-ui;

    .vsg_gutter_v {
      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .2);
      }
    }
    
  }


}


</style>
