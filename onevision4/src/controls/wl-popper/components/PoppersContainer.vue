<template>
  <div id="poppers-container">
    <popper
      v-for="popper in poppers"
      :key="popper.id"
      v-bind="popper.popperAttrs"
      v-on="popper.popperListeners"
      @closed="remove(popper.id)"
    >
      <component
        :is="popper.component"
        v-bind="popper.componentAttrs"
        v-on="$listeners"
        @close="$popper.hide(popper.popperAttrs.name, $event)"
        @update="$popper.update(popper.popperAttrs.name, $event)"
      />
    </popper>
  </div>
</template>
<script>
import { generateId } from '../utils'

const PREFIX = 'dynamic_popper_'

export default {
  data() {
    return {
      poppers: []
    }
  },
  created() {
    /**
     * Register PopperContainer so that it was availiable inside the plugin
     */
    this.$root.__popperContainer = this
  },
  mounted() {
    this.$popper.subscription.$on('hide-all', () => {
      //this.poppers = [] // 这种方法没有 transition 动画
      let len = this.poppers.length
      for(let i=len-1; i>=0; i--) {
        let name = this.poppers[i].name
        this.$popper.subscription.$emit('hide', name)
      }
      
    })

    this.$popper.subscription.$on('visible', (name, callback) => {
      let len = this.poppers.length
      for(let i=len-1; i>=0; i--) {
        if(this.poppers[i].name === name) {
          callback(true)
          return
        }
      }
      callback(false)
    })
  },
  methods: {
    add(component, componentAttrs = {}, popperAttrs = {}, popperListeners = {}) {
      const id = generateId()
      const name = popperAttrs.name || PREFIX + id

      if (this.poppers.findIndex(v => v.name === name) === -1) {
        this.poppers.push({
          name,
          id,
          popperAttrs: { ...popperAttrs, name },
          popperListeners,
          component,
          componentAttrs
        })

        this.$nextTick(() => {
          this.$popper.show(name)
        })
      }

      
    },
    remove(id) {
      const index = this.poppers.findIndex(v => v.id === id)
      if (index !== -1) {
        this.poppers.splice(index, 1)
      }
    }
  }
}
</script>
