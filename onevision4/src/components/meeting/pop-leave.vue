<template>
    <div
      id="pop-leave"
      ref="popover"
      :class="[theme]"
      :style="{
        background: `${themeColorList[theme][themeColor]['bg']}`,
      }"
    >
      <div v-if="meetingType === 'webex'" class="wrap">
        <topbar-simple :buttons="['close']" :titleStyle="{marginLeft: '10px',}" @close="close" />

        <div class="ptitle" >Leave meeting</div>
        <div class="pcont" >Do you want to leave meeting without ending it or end this meeting for all?</div>
        <div class="btns" >
          <md-button v-if="ishost" class="btn md-button--red" aria-label="x" :size="32" @click="end" >
            End meeting
          </md-button>
          <md-button class="btn md-button-solid2" aria-label="x" :size="32" @click="leave" >
            Leave meeting
          </md-button>
          <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="close" > 
            Cancel
          </md-button>
        </div>
      </div>

      <div v-if="meetingType !== 'webex'" class="wrap">
        <topbar-simple :buttons="['close']" :titleStyle="{marginLeft: '10px',}" @close="close" />

        <div class="ptitle" >Leave meeting</div>
        <div class="pcont" >Do you want to leave meeting?</div>
        <div class="btns" >
          <md-button class="btn md-button--red" aria-label="x" :size="32" @click="leave" >
            Yes
          </md-button>
          <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="close" > 
            Cancel
          </md-button>
        </div>
      </div>

    </div>
</template>

<script>

export default {
  props: {
    ishost: Boolean,
    meetingId: String,
    onEnd: {
      type: Function,
    },
  },
  data() {
    return {

    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    os() {
      return this.$store.state.os;
    },
    me() {
      return this.$store.getters.me;
    },
    meetingType() {
      return this.$store.getters.meetingType(this.meetingId)
    },
    meetingCallInfo() {
      return this.$store.getters.meetingCallInfo(this.meetingId)
    },
  },
  mounted() {

  },
  destroyed() {

  },

  watch: {

  },
  methods: {
    end() {
      this.onEnd();
      this.close();
    },
    leave() {
      this.onEnd();
      this.close();
    },
    close() {
      this.$emit("close");
    },

  }
};
</script>

<style lang="scss">
#pop-leave {
  width: 100%;
  height: 100%;
  pointer-events: auto;
  user-select: none;
  box-sizing: border-box;

  .wrap {
    text-align: center;
    display: flex;
    flex-direction: column;

    .ptitle {
      width: 100%;
      font-weight: bold;
      padding: 10px 20px;
      text-align: left;
      font-size: 15px;
    }
    .pcont {
      width: 100%;
      padding: 0 20px;
      line-height: 20px;
      text-align: left;
      font-size: 14px;
    }
    .btns {
      @include flex(row, flex-end);
      margin-top: 20px;
      padding: 0 20px;

      .btn {
        padding: 0 16px;
      }
    }
  }

  &.dark {
    color: $text-color-primary-dark-ui;
  }
  
}


</style>
