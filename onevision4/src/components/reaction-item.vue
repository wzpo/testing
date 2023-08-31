<template>
    <div class="reaction-item" :class="[theme]">
      
      <div
        v-show="name"
        class="name"
        >
          {{ name }}
      </div>
      
      <div ref="elanimation" class="anim" :class="`reaction-play--${animationName}`"></div>

    </div>
</template>

<script>

export default {
  props: [
    'animationName',
    'name',
    'classid',
  ],
  data() {
    return {
      anim: null,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted() {
  },
  destroyed() {
  },
  watch: {
  },
  methods: {

  }
};
</script>

<style lang="scss">
.reaction-item {
  position: absolute;
  height: 28px;
  pointer-events: none;
  display: flex;
  align-items: center;

  .name {
    display: flex;
    align-items: center;
    height: 24px;
    margin-left: -24px;
    padding-left: 65px;
    padding-right: 15px;
    font-size: 12px;
    background: white;
    border-radius: 12px;
    mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80.0%);
  }

  .anim {
    position: absolute;
    width: 24px;
    height: 24px;
    left: 10px;
    filter: drop-shadow(1px 1px 0px rgba(18, 18, 18, 0.16));

    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  /* ------------------ drak/hybrid ------------------ */

  &.dark,
  &.hybrid {
    .name{
      background-color: rgba($color: #292929, $alpha: 0.6);
    }
  }

}

</style>
