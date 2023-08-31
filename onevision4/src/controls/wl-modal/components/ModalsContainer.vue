<template>
  <div id="modals-container">
    <modal
      v-for="modal in modals"
      :key="modal.id"
      :style="{
        zIndex: modal.zIndex,
      }"
      v-bind="modal.modalAttrs"
      v-on="modal.modalListeners"
      @closed="remove(modal.id)"
      @mousedown.native="bringToFront(modal.id)"
    >
      <component
        :is="modal.component"
        v-bind="modal.componentAttrs"
        v-on="$listeners"
        @close="$modal.hide(modal.modalAttrs.name, $event)"
      />
    </modal>
  </div>
</template>
<script>
import { generateId } from '../utils'

const PREFIX = 'dynamic_modal_'

export default {
  data() {
    return {
      modals: [],
      zIndex: 999,
    }
  },
  computed:{
  },
  created() {
    /**
     * Register ModalContainer so that it was availiable inside the plugin
     */
    this.$root.__modalContainer = this
  },
  mounted() {
    this.$modal.subscription.$on('hide-all', () => {
      this.modals = []
    })
  },
  methods: {
    getZIndex() {
      const idx = this.zIndex;
      this.zIndex = this.zIndex + 1;
      return idx;
    },
    add(component, componentAttrs = {}, modalAttrs = {}, modalListeners = {}) {
      const id = generateId()
      const name = modalAttrs.name || PREFIX + id

      if (this.modals.findIndex(v => v.name === name) === -1) {
        this.modals.push({
          id,
          name,
          zIndex: this.getZIndex(),
          modalAttrs: { ...modalAttrs, name },
          modalListeners,
          component,
          componentAttrs
        })

        this.$nextTick(() => {
          this.$modal.show(name)
        })
      }

    },
    remove(id) {
      const index = this.modals.findIndex(v => v.id === id)
      if (index !== -1) {
        this.modals.splice(index, 1)
      }
    },
    bringToFront(id) {
      const index = this.modals.findIndex(v => v.id === id)
      this.modals[index].zIndex = this.getZIndex()
    },
  }
}
</script>
