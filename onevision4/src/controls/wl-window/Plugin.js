import Window from './components/Window.vue'
import PluginCore from './PluginCore'

const Plugin = {
  install(Vue, options = {}) {
    if (Vue.prototype.$window) {
      return
    }

    const plugin = new PluginCore(Vue, options)

    Object.defineProperty(Vue.prototype, '$window', {
      get: function() {
        /**
         * The "this" scope is the scope of the component that calls this.$window
         */
        const caller = this
        /**
         * The this.$window can be called only from inside the vue components so this check is not really needed...
         */
        if (caller instanceof Vue) {
          const root = caller.$root

          if (!plugin.context.root) {
            plugin.setDynamicWindowContainer(root, options.parentElementSelector)
          }
        }

        return plugin
      }
    })

    /**
     * Sets custom component name (if provided)
     */
    Vue.component(plugin.context.componentName, Window)
    
  }
}

export default Plugin
