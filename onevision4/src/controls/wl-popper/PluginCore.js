import { createDivInBody } from './utils'
import PoppersContainer from './components/PoppersContainer.vue'

const PluginCore = (Vue, options = {}) => {
  const subscription = new Vue()

  const context = {
    root: null,
    componentName: options.componentName || 'Popper'
  }

  const showDynamicPopper = (
    component,
    componentProps,
    popperProps = {},
    popperEvents
  ) => {
    const container = context.root?.__popperContainer
    const defaults = options.dynamicDefaults || {}

    container?.add(
      component,
      componentProps,
      { ...defaults, ...popperProps },
      popperEvents
    )
  }

  /**
   * Creates a container for poppers in the root Vue component.
   *
   * @param {Vue} parent
   */
  const setDynamicPopperContainer = parent => {
    context.root = parent

    const element = createDivInBody()

    new Vue({
      parent,
      render: h => h(PoppersContainer)
    }).$mount(element)
  }

  const show = (...args) => {
    const [popper] = args

    switch (typeof popper) {
      case 'object':
      case 'function':
        showDynamicPopper(...args)
        break;
    }
  }

  const hide = (name, params) => {
    subscription.$emit('hide', name, false, params)
  }

  const hideAll = () => {
    subscription.$emit('hide-all')
  }

  const update = (name, params) => {
    subscription.$emit('update', name, params)
  }

  const visible = (name) => {
    let result = false
    subscription.$emit('visible', name, param => {
      result = param
    })
    return result
  }

  return {
    context,
    subscription,
    show,
    hide,
    hideAll,
    update,
    visible,
    setDynamicPopperContainer
  }
}

export default PluginCore
