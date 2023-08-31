<template>
  <div id="windows-container">
    <window
      v-for="window in windows"
      :key="window.id"
      :ref="window.name"
      :style="{
        zIndex: window.zIndex,
      }"
      :isActive="window.active"
      v-bind="window.windowAttrs"
      v-on="window.windowListeners"
      @closed="remove(window.id)"
      @mousedown.native="bringToFront(window.id)"
      @activated="setActive(window, true)"
      @deactivated="setActive(window, false)"
    >
      <template v-slot:default="slotProps" > 
        <component
            :is="window.component"
            v-bind="window.componentAttrs"
            v-on="$listeners"
            :active="slotProps.active"
            :parentRect="slotProps.parentRect"
            @close="$window.hide(window.windowAttrs.name, $event)"
            @minimize="$window.minimize(window.windowAttrs.name, $event)"
            @normal="$window.normal(window.windowAttrs.name, $event)"
            @maximize="$window.maximize(window.windowAttrs.name, $event)"
            @fullscreen="$window.fullscreen(window.windowAttrs.name, $event)"
          />
      </template>
    </window>
  </div>
</template>
<script>
import { generateId } from '../utils'

const PREFIX = 'dynamic_window_'

export default {
  data() {
    return {
      windows: [],
      zIndex: 199,
      activeWindowZIndex: 0,
    }
  },
  computed:{
  },
  created() {
    this.activeWindowZIndex = this.zIndex
    /**
     * Register WindowContainer so that it was availiable inside the plugin
     */
    this.$root.__windowContainer = this
  },
  beforeMount() {
    this.$window.subscription.$on('bring-to-front', this.bringToFront)
    this.$window.subscription.$on('get', this.getWindow)
    this.$window.subscription.$on('exist', this.exist)
  },
  mounted() {
    this.$window.subscription.$on('hide-all', () => {
      this.windows = []
    })
  },
  beforeDestroy() {
    this.$window.subscription.$off('bring-to-front', this.bringToFront)
  },
  methods: {
    getZIndex() {
      const idx = this.zIndex;
      this.activeWindowZIndex = idx
      this.zIndex = this.zIndex + 1;
      return idx;
    },
    add(component, componentAttrs = {}, windowAttrs = {}, windowListeners = {}) {
      const id = generateId()
      const name = windowAttrs.name || PREFIX + id

      if (this.windows.findIndex(v => v.name === name) === -1) {
        const idx = this.getZIndex()
        this.windows.push({
          id,
          name,
          active: this.activeWindowZIndex === idx,
          zIndex: idx,
          windowAttrs: { ...windowAttrs, name },
          windowListeners,
          component,
          componentAttrs
        })

        this.$nextTick(() => {
          this.$window.show(name)
        })
      }

    },
    remove(id) {
      const index = this.windows.findIndex(v => v.id === id)
      if (index !== -1) {
        this.windows.splice(index, 1)
      }
    },
    setActive(window, active) {
      window.active = active
    },
    bringToFront(idOrName) {
      let index = this.windows.findIndex(v => v.id === idOrName || v.name === idOrName)
      if (index >= 0) {
        this.windows[index].zIndex = this.getZIndex()
        this.windows[index].active = true
      }
    },
    // 查找 window instance
    getWindow(idOrName, callback) {
      let window = this.windows.find(v => v.id === idOrName || v.name === idOrName)
      if (this.$refs[window.name]){
        callback(this.$refs[window.name][0])
      } else {
        callback(null)
      }
    },
    // 查找 window 是否存在
    exist(idOrName, callback) {
      let window = this.windows.find(v => v.id === idOrName || v.name === idOrName)
      callback(window != undefined)
    },
  }
}
</script>

<style lang="scss">
#windows-container {
  width: 100%;
  height: 100%;
}
</style>