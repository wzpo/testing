<template>
    <drag-resize 
      :class="['wl-hot', {disabled: !localhost}]"
      ref="hot"
      :isActive="true"
      :preventActiveBehavior="true"
      :w="rect.w"
      :h="rect.h"
      :x="rect.x"
      :y="rect.y"
      :minw="10"
      :minh="10"
      :isDraggable="localhost"
      :isResizable="localhost"
      :aspectRatio="false"
      :parentLimitation="false"
      :showHandle="false"
      :borderIsHandle="true"
      @contextmenu.native.prevent="onContextmenu"
    ></drag-resize>
</template>


<script>
export default {
  props:{
      rect: {
        default: () => {
          return {
            x: 10,
            y: 10,
            w: 100,
            h: 28,
          }
        },
      },
  },
  data() {
    return {
      localhost: false,
    }
  },
  computed:{

  },
  mounted(){
    this.localhost = window.location.hostname === 'localhost'
  },
  watch: {

  },
  methods:{
    onContextmenu() {
      const hot = this.$refs.hot
      this.$copyText(
        `{x:${hot.left},y:${hot.top},w:${hot.width},h:${hot.height}}`
      );
    }
  }
}
</script>


<style lang="scss" scoped>
.wl-hot {
  position: absolute;
  background-color: rgba($color: #FF0000, $alpha: .3);
  cursor: pointer;

  &.disabled {
    background-color: transparent;
  }
}


</style>
