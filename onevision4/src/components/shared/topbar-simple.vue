<template>
  <div class="wintopbar-simple" :class="[os, theme]" @mousedown="appHeaderMousedown">
    <!-- for this.$window dragHandle -->
    <div class="drag-bg"></div>
    <div v-if="os === 'win'" class="titlebar" :style="{height: height}">
      <div class="left">
        <div v-if="logo" class="logo" :class="logo" ></div>
        <div v-if="title" class="title txt" :style="titleStyle" v-html="title"></div>
      </div>

      <div class="right">
        <slot name="right"></slot>
        <window-controls
          :buttons="buttons"
          :dark="theme !== 'light'"
          :active="true"
          @close="close"
        />
      </div>
    </div> <!---win--->


    <div v-if="os === 'mac'" class="titlebar" :style="{height: height}">
      <div class="left">
        <window-controls
          :buttons="buttons"
          :dark="theme !== 'light'"
          :active="true"
          @close="close"
        />
      </div>

      <div class="mid" >
        <div v-if="logo" class="logo" :class="logo"></div>
        <div v-if="title" class="title txt" v-html="title"></div>
      </div>

      <div class="right" >
        <slot name="right"></slot>
      </div>
    </div> <!---mac--->

  </div>
</template>

<script>

export default {
  name: 'TopbarSimple',
  props:{
    height: {
      default: '31px'
    },
    title: {
      default: 'Webex'
    },
    titleStyle: {
      default: ''
    },
    logo: {
      default: ''
    },
    buttons: {
      type: Array,
    },
  },
  data () {
    return {
      
    }
  },
  mounted () {

  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
  },
  watch: {

  },
  methods: {
    appHeaderMousedown(evt) {
      this.$emit('mousedown', evt);
    },

    close(evt) {
      this.$emit('close', evt);
    },
  },
}
</script>

<style lang="scss">
  .wintopbar-simple {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    cursor: default;
    font-size: 12px;
    color: #000000;
    user-select: none;

    .drag-bg {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .titlebar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .left {
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-grow: 1;
    }
    .mid {
      @include flex;
    }
    .logo {
      margin-right: 4px;
      margin-left: 0;
      width: 16px;
      height: 12px;
      background-repeat: no-repeat;
      background-size: 16px 12px;
      background-position: center;

      &.webex {
        background-image: url(~@/assets/icon/webex_logo.svg);
      }
    }
    .title{
      @include flex;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      padding-right: 15px;
    }
    .right {
      flex-shrink: 1;
      max-width: 316px;
      padding-left: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
    .right span {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }


  /* ------ dark/hybrid ------- */
  &.dark, &.hybrid {
    color: $text-color-primary-dark-ui;
  }
  

  &.mac {
    .left {
      width: 30%;
      flex-grow: 1;
    }

    .right {
      width: 30%;
      flex-grow: 1;
    }

  }
}

</style>
