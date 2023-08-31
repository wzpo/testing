import Popper from './components/Popper.vue'
import PluginCore from './PluginCore'

const Plugin = {
  install(Vue, options = {}) {
    if (Vue.prototype.$popper) {
      return
    }

    const plugin = new PluginCore(Vue, options)

    Object.defineProperty(Vue.prototype, '$popper', {
      get: function() {
        /**
         * The "this" scope is the scope of the component that calls this.$popper
         */
        const caller = this
        /**
         * The this.$popper can be called only from inside the vue components so this check is not really needed...
         */
        if (caller instanceof Vue) {
          const root = caller.$root

          if (!plugin.context.root) {
            plugin.setDynamicPopperContainer(root)
          }
        }

        return plugin
      }
    })

    /**
     * Sets custom component name (if provided)
     */
    Vue.component(plugin.context.componentName, Popper)

  }
}

export default Plugin
