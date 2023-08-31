<template>
  <drag-resize 
    id="cc-black-box"
    class="cc-box"
    :class="[theme, ccPanelDisplay, {dettached: !ccPanelAttached || dettaching}]"

    :isActive="true"
    :preventActiveBehavior="true"
    :w="boxWidth"
    :h="boxHeight"
    :minw="800"
    :minh="80"
    :maxw="9999"
    :maxh="120"
    :x="boxLeft"
    :y="boxTop"
    :z="20"
    :parentW="9999"
    :parentH="9999"
    :isDraggable="ccPanelDisplay !== 'fixed'"
    :isResizable="ccPanelDisplay !== 'fixed'"
    :aspectRatio="false"
    :parentLimitation="false"
    :showHandle="false"
    :borderIsHandle="true"

    @dragging="dragging"
    @dragstop="dragstop"
  >
    <cc-box-inside></cc-box-inside>
  </drag-resize>
</template>

<script>
export default {

  data() {
    return {
      boxLeft: 0,
      boxTop: 0,
      boxWidth: 800,
      dettaching: false,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    ccPanelDisplay() {
      return this.$store.state.ccPanelDisplay;
    },
    ccPanelAttached() {
      return this.$store.state.ccPanelAttached;
    },
    boxHeight() {
      return this.ccPanelDisplay === 'panel' && !this.ccPanelAttached || this.ccPanelDisplay === 'floated' ? 104 : 80;
    },
    anyOpenPanel() {
      return this.$store.getters.anyOpenPanel;
    },
  },
  mounted(){
    this.$eventBus.$on('meeting-resizing', () => {
      if (this.ccPanelDisplay === 'panel' && this.ccPanelAttached) {
        this.snapCCBox2MeetingWindow();
      }
    });
    this.$eventBus.$on('meeting-dragging', () => {
      if (this.ccPanelDisplay === 'panel' && this.ccPanelAttached) {
        this.snapCCBox2MeetingWindow();
      }
    });
    
    this.setPosition()

  },
  beforeDestroy() {
    this.$eventBus.$off('meeting-resizing');
    this.$eventBus.$off('meeting-dragging');
  },
  watch: {
    ccPanelDisplay() {
      this.setPosition()
    },
    anyOpenPanel() {
      requestAnimationFrame(() => {
        this.setPosition()
      })
    },
  },
  methods: {
    setPosition() {
      requestAnimationFrame(() => {
        if (this.ccPanelDisplay === 'panel') {
          this.snapCCBox2MeetingWindow();
        }
      })

      if (this.ccPanelDisplay === 'floated') {
        const appRect = document.getElementById('maincon-L').getBoundingClientRect();
        this.boxWidth = Math.min(appRect.width * 0.8, 800);
        this.boxLeft = appRect.left + (appRect.width - this.boxWidth) / 2 + Math.random() * 0.00001; // force update
        this.boxTop = appRect.top + (appRect.height - this.boxHeight - 20) + Math.random() * 0.00001; /// force update
      }
    },
    snapCCBox2MeetingWindow() {
      const appRect = document.getElementById('meetings-app').getBoundingClientRect();
      this.boxWidth = appRect.width + Math.random() * 0.00001; // force update
      this.boxLeft = appRect.left + Math.random() * 0.00001; // force update
      this.boxTop = (appRect.bottom + 2) + Math.random() * 0.00001; /// force update
    },

    dragging() {
      if (this.ccPanelDisplay === 'panel') {
        if(!this.ccPanelAttached) {
          // attacth to meeting window
          const appRect = document.getElementById('meetings-app').getBoundingClientRect();
          const ccRect = document.getElementById('cc-black-box').getBoundingClientRect();

          const ox = (ccRect.left + ccRect.right) / 2;
          
          if (Math.abs(ccRect.top - appRect.bottom) < 20 && ox > appRect.left && ox < appRect.right) {
            this.$eventBus.$emit('force-stop-dragging');
            this.snapCCBox2MeetingWindow();
            this.$store.commit('ccPanelAttached', true);
          }
        } else {
          this.dettaching = true;
          this.boxWidth = 800 + Math.random() * 0.00001; // force update
        }
      }
      
    },
    dragstop() {
      if (this.ccPanelDisplay === 'panel') {
        this.dettaching = false;

        if (this.ccPanelAttached) {
          requestAnimationFrame(() => {
            const appRect = document.getElementById('meetings-app').getBoundingClientRect();
            const ccRect = document.getElementById('cc-black-box').getBoundingClientRect();
            this.boxLeft = ccRect.left + (appRect.width - ccRect.width)/2 + Math.random() * 0.00001; // force update
          })

          this.$store.commit('ccPanelAttached', false);
        }
      }

    },
    
  }
};
</script>

<style lang="scss">
.cc-box {
  display: flex;
  user-select: none;
  background: #1A1A1A;
  cursor: grab;

  &:active{
    cursor: grabbing;
  }

  &.floated {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.14);
  }

  &.panel {
    box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);

    &.dettached {
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.14);
    }
  }

  /* ------------------ drak ------------------ */

}



</style>
