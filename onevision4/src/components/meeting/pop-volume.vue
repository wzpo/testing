<template>
    <div
      id="pop_volume"
      ref="popover"
      :class="[theme]"
    >

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
  },
  mounted() {},
  watch: {

  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
#pop_volume {
  transition: all 0.2s ease-out;
  position: absolute;
  width: 220px;
  height: 80px;
  transform: rotate(0deg);
  transform: translate(-50%, -100%);
  pointer-events: auto;
  background: url(~@/assets/img/ctrl-volume.svg) no-repeat center;

  &.dark {
    background: url(~@/assets/img/ctrl-volume-dark.svg) no-repeat center;
  }
}



</style>
