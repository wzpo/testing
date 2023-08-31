import { UNSUPPORTED_ARGUMENT_ERROR } from './utils/errors'
import { createDivInBody } from './utils'
import WindowsContainer from './components/WindowsContainer.vue'

const PluginCore = (Vue, options = {}) => {
  const subscription = new Vue()

  const context = {
    root: null,
    componentName: options.componentName || 'Window'
  }

  const showStaticWindow = (name, params) => {
    subscription.$emit('toggle', name, true, params)
  }

  const showDynamicWindow = (
    component,
    componentProps,
    windowProps = {},
    windowEvents
  ) => {
    const container = context.root?.__windowContainer
    const defaults = options.dynamicDefaults || {}

    container?.add(
      component,
      componentProps,
      { ...defaults, ...windowProps },
      windowEvents
    )
  }

  /**
   * Creates a container for windows in the root Vue component.
   *
   * @param {Vue} parent
   */
  const setDynamicWindowContainer = (parent, parentElementSelector) => {
    context.root = parent

    let element
    if (!parentElementSelector) {
      element = createDivInBody()
    } else {
      element = document.createElement('div')
      document.querySelector(parentElementSelector).appendChild(element);
    }

    new Vue({
      parent,
      render: h => h(WindowsContainer)
    }).$mount(element)
  }

  const show = (...args) => {
    const [window] = args

    switch (typeof window) {
      case 'string':
        showStaticWindow(...args)
        break

      case 'object':
      case 'function':
        showDynamicWindow(...args)
        break

      default:
        console.warn(UNSUPPORTED_ARGUMENT_ERROR, window)
    }
  }

  const hide = (name, params) => {
    subscription.$emit('toggle', name, false, params)
  }

  const hideAll = () => {
    subscription.$emit('hide-all')
  }

  const toggle = (name, params) => {
    subscription.$emit('toggle', name, undefined, params)
  }

  const minimize = (name, params) => {
    subscription.$emit('minimize', name, params)
  }
  const normal = (name, params) => {
    subscription.$emit('normal', name, params)
  }
  const maximize = (name, params) => {
    subscription.$emit('maximize', name, params)
  }
  const fullscreen = (name, params) => {
    subscription.$emit('fullscreen', name, params)
  }

  const bringToFront = (idOrName) => {
    subscription.$emit('bring-to-front', idOrName)
  }
  // 查找 window instance
  const get = (name, callback) => {
    subscription.$emit('get', name, instance => {
      callback(instance) 
    })
  }
  const exist = (name, callback) => {
    subscription.$emit('exist', name, instance => {
      callback(instance) 
    })
  }

  return {
    context,
    subscription,
    show,
    hide,
    hideAll,
    toggle,
    minimize,
    normal,
    maximize,
    fullscreen,
    bringToFront,
    get,
    exist,
    setDynamicWindowContainer
  }
}

export default PluginCore
