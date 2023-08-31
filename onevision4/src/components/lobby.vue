<template>
    <div
      id="lobby"
      :class="[theme]"
      :style="{
        background: `${themeColorList[theme][themeColor]['bg']}`,
      }"
    >
      <topbar-simple logo="webex" />
      <div class="content">
        <div class="backimg" ></div>
        <div class="center" >
          <md-avatar :src="$store.state.avatarPath+host.avatar" class="avatar" :size="88" ></md-avatar>
          <div class="title" >{{`${host.name}’s Personal Room`}}</div>
          <div class="des" >Thank you for waiting. We’ll start the meeting when the host joins. <br>Do you want to let the host know you're waiting?</div>
          <md-button class="btn md-button-solid" aria-label="x" :size="32" @click="notify" >
            Notify Host
          </md-button>
        </div>
      </div>
      <controls-meet 
        :visibleButtons="['mute', 'video', 'leave']"
        :meetingId="meetingId" 
        class="bot" 
      />

    </div>
</template>

<script>

export default {
  props: {
    meetingId: String,
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
    host() {
      return this.$store.getters.host;
    },
  },
  mounted() {

  },
  destroyed() {

  },

  watch: {

  },
  methods: {
    notify() {
      this.$store.commit('lobbyVisible', false);
    },

  }
};
</script>

<style lang="scss">
#lobby {
  @include flex(column, flex-start, flex-start);
  width: 100%;
  height: 100%;
  pointer-events: auto;
  user-select: none;
  box-sizing: border-box;

  .content {
    position: relative;
    @include flex(column);
    flex-grow: 1;
    width: calc(100% - 16px);
    margin: 0 8px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    overflow: hidden;
    transform: rotate(0deg);

    .backimg {
      position: absolute;
      width: 100%;
      height: 33%;
      top: 0;
      background: url(~@/assets/img/tmp_lobby_backimg.png) no-repeat top center;
      background-size: cover;
    }
    .center {
      @include flex(column);
      .avatar {
        margin-bottom: 28px;
      }
      .title {
        @include flex;
        font-weight: 600;
        font-size: 26px;
        opacity: .95;
        margin-bottom: 20px;
      }
      .des {
        @include flex;
        text-align: center;
        font-size: 16px;
        line-height: 24px;
        opacity: .95;
        margin-bottom: 28px;
      }
      .btn {
        padding: 0 12px;
      }
    }
  }

  .bot {
    height: 64px;
    width: 100%;
    @include flex;
    flex-grow: 0;
    flex-shrink: 0;
  }

  &.dark {
    color: $text-color-primary-dark-ui;
  }
  
}


</style>
