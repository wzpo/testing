<template>
  <div class="browser edge" >
    <div class="edge-header"></div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted() {

  },
  watch: {

  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.browser {
  &.edge {
    width: 1111px;
    height: 678px;
    background: url(~@/assets/img/edge-s.png) no-repeat center top;
    background-size: cover;
    box-sizing: border-box;
    pointer-events: auto;

    .edge-header {
      position: absolute;
      width: 100%;
      height: 32px;
    }

    &.sharing_app_border {
      border: 5px solid $md-orange-60;
    }
  }



  @media only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-device-pixel-ratio: 2) {

  }
}
</style>
