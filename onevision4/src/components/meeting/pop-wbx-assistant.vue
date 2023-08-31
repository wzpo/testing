<template>
    <div
      id="pop-wbx-assistant"
      ref="popover"
      :class="[theme]"
    >
      <div class="head">
        <div class="btn" >
          <wl-icon name="info-circle-bold" size="16" />
        </div>
        <div class="btn" @click="close" >
          <wl-icon name="cancel-bold" size="16"  />
        </div>
      </div>
      <div v-if="!assistantEnabled" class="tit">Hi, I’m the Webex Assistant!</div>
      <div v-if="!assistantEnabled" class="des">I can help you capture highlights and use voice commands.</div>
      <div v-if="assistantEnabled" class="des2">Add captions to your meeting, capture meeting heighlights and increase your productivity with voice commonds.</div>
      <md-button v-if="!assistantEnabled" class="btn md-button-solid " aria-label="x" :size="32" @click="toggleAssistant" >Turn on Webex Assistant</md-button>
      <md-button v-if="assistantEnabled" class="btn md-button-outline " aria-label="x" :size="32" @click="toggleCaption" >{{ccPanelVisible ? 'Hide captions and heighlights' : 'View captions and heighlights'}}</md-button>
      <div v-if="assistantEnabled" class="divider"></div>
      <div v-if="assistantEnabled" class="btn_off" @click="toggleAssistant" >Turn off Webex Assistant</div>
    </div>
</template>

<script>

export default {
  data() {
    return {};
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    assistantEnabled() {
      return this.$store.state.assistantEnabled;
    },
    ccPanelVisible() {
      return this.$store.state.ccPanelVisible;
    },
  },
  mounted() {},
  watch: {

  },
  methods: {
    toggleAssistant() {
      if (!this.assistantEnabled) {
        this.$store.commit("closedCaptionEnabled", true);
      }
      this.$store.commit("assistantEnabled", !this.assistantEnabled);
      this.close();
    },
    toggleCaption() {
      if (!this.ccPanelVisible) {
        this.$eventBus.$emit('open-cc');
      } else {
        this.$store.commit("ccPanelVisible", false);
        setTimeout( () => this.$store.commit("ccPanelPopouted", false), 100);
      }
      this.close();
    },
    close() {
      this.$emit("close");
    },

  }
};
</script>

<style lang="scss">
#pop-wbx-assistant {
  @include flex(column, flex-start);
  width: 280px;
  pointer-events: auto;

  .head {
    @include flex(row, flex-end);
    width: 100%;

    .btn {
      width: 16px;
      height: 16px;
      margin: 8px 8px 12px 0;
    }
  }

  .tit {
    font-weight: bold;
    margin-bottom: 12px;
    padding: 0 20px;
  }
  .des {
    font-size: 14px;
    opacity: .7;
    margin-bottom: 20px;
    padding: 0 20px;
  }
  .des2 {
    font-size: 14px;
    opacity: .95;
    margin-bottom: 20px;
    padding: 0 20px;
  }

  .btn {
    width: 240px;
    margin-bottom: 20px;
  }

  .divider {
    width: 100%;
    height: 1px;
    border-top: 1px solid rgba($color: #FFF, $alpha: .2);
    box-sizing: border-box;
  }

  .btn_off {
    @include flex;
    width: 240px;
    height: 32px;
    font-weight: bold;
    user-select: none;
    margin: 8px 0 12px 0;

    color: $md-red-40;

    &:hover{
      color: $md-red-50;
    }
    &:active{
      color: $md-red-60;
    }
  }

  &.dark {
    
  }
}



</style>
