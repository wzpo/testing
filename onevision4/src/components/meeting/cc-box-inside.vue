<template>
  <div 
    class="cc-box-inside" 
    :class="[
      ccPanelDisplay,
      {keepvisible: this.ccPanelAttached && this.ccPanelDisplay === 'panel'}
    ]"
  >
    <div class="topbar">

      <div class="ico">
        <wl-icon name="more-bold" size="16" color="white" />
      </div>
      <!--
      <div class="ico" v-if="ccPanelDisplay === 'fixed'" @click="popout">
        <wl-icon name="pop-out-bold" size="16" color="white" />
      </div>
      <div class="ico" v-if="ccPanelDisplay === 'floated'" @click="popin">
        <wl-icon name="pop-in-bold" size="16" color="white" />
      </div>
      -->
      <div class="ico" @click="close">
        <wl-icon name="cancel-bold" size="16" color="white" />
      </div>
      
    </div>
    <div class="textbox" >
      <span>
        I'm not sure that all of us have seen the latest specs, can you send them to all of us again?
        I'd like us to decide on the colors by tomorrow. 
      </span>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      boxLeft: 0,
      boxTop: 0,
      boxWidth: 800,
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
  },
  mounted(){

  },

  watch: {},
  methods: {
    popout() {
      this.$store.commit('ccPanelDisplay', 'floated');
    },
    popin() {
      this.$store.commit('ccPanelDisplay', 'fixed');
    },
    close() {
      this.$store.commit('closedCaptionEnabled', false);
    },
  }
};
</script>

<style lang="scss">
.cc-box-inside {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  justify-content: center;
  align-items: center;

  &.fixed {
    height: 80px;
    margin-top: 20px;
    margin-left: 12px;
    width: calc(100% - 24px);
    border-radius: 8px;

    &:hover {
      background: #1A1A1A;
    }
  }

  &.floated {
    .topbar {
      position: relative;
    }
    .textbox {
      padding: 0 28px 24px 28px;
      margin-top: -8px;
    }
  }

  &:hover, &.keepvisible {
    .topbar {
      opacity: 1;
    } 
  }

  .topbar {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 32px;
    top: 0;
    opacity: 0;
    padding: 4px 4px 0;

    .ico {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      cursor: default;
    }
  }

  .textbox {
    flex-grow: 1;
    @include flex;
    padding: 12px 80px;

    span {
      font-size: 18px;
      line-height: 24px;
    }
  
  }

  /* ------------------ drak ------------------ */

}



</style>
