<template>
  <span 
    class="wl-icon" 
    :icon-name="name"
    v-html="icons[name]"
    :style="styleObject"
  ></span>
</template>

<script>

/** EXAMPLE **
<wl-icon 
  name="microphone-muted-bold" 
  color="blue-20"
  size="200"
/>
*/

import icons from '../icons.js'
import colors from '@wzpo/md-ui/src/scss/colors/settings-base.scss'

export default {
  props:{
    name: String,
    size: {
      type: [Number, String],
      default: 32,
    },
    color: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      icons: {},
    }
  },
  computed:{
    theme() {
      return this.$store.state.theme;
    },
    styleObject() {
      return {
        '--size': `${this.size}px`,
        '--color': this.color ? (colors[this.color] ? colors[this.color] : this.color) : (this.theme === 'light' ? colors['black-95'] : colors['white-95']),
      };
    },
  },
  mounted(){
    this.icons = icons
  },
}

</script>


<style lang="scss" scoped>
.wl-icon {
  @include flex;
  position: relative;
  width: var(--size);
  height: var(--size);

  ::v-deep svg {
    position: absolute;
  }
  ::v-deep svg path {
    fill: var(--color);
  }
}

</style>

