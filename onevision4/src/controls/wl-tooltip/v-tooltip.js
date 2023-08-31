import Tooltip from './tooltip'
import { addClasses, removeClasses } from './utils'

export let state = {
  enabled: true,
}

const positions = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
]

export const defaultOptions = {
  // Default tooltip placement relative to target element
  defaultPlacement: 'top', // 带 arrow，上面好看点
  // Default CSS classes applied to the tooltip element
  defaultClass: 'vue-tooltip-theme',
  // Default CSS classes applied to the target element of the tooltip
  defaultTargetClass: 'has-tooltip',
  // Is the content HTML by default?
  defaultHtml: true,
  // Default HTML template of the tooltip element
  // It must include `tooltip-arrow` & `tooltip-inner` CSS classes (can be configured, see below)
  // Change if the classes conflict with other libraries (for example bootstrap)
  defaultTemplate: `
    <div class="tooltip" role="tooltip">
      <div class="tooltip-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" x="0px" y="0px" width="26px" height="26px" viewBox="0 0 26 26">
          <defs>
          <g id="Layer1_0_FILL">
          <path class="bg" stroke="none" d="
          M 21.05 2.4
          Q 23.55 0.05 25.8 0
          L 0 0
          Q 2.15 0.05 4.8 2.4 6.4 3.9 8.8 6.95 10.5 9.1 11.4 10 12.2 10.7 12.4 10.8 12.7 11 12.9 11 13.15 11 13.45 10.8 13.85 10.6 14.45 9.95 15.3 9.15 17.05 6.95 19.75 3.6 21.05 2.4 Z"/>
          
          <path class="border" stroke="none" d="
          M 26 2
          L 26 1 25.95 1
          Q 24 1.05 21.75 3.15 20.45 4.3 17.85 7.6 16.05 9.8 15.2 10.65 15.15 10.65 15.15 10.7 14.45 11.4 14 11.65 13.4 12.05 12.9 12 12.45 12.05 11.85 11.65 11.55 11.45 10.75 10.75 10.75 10.7 10.7 10.7 9.75 9.8 8.05 7.6 5.7 4.6 4.15 3.15 1.85 1.1 0 1
          L 0 2
          Q 1.45 2.05 3.45 3.9 4.75 5.1 7.25 8.2 9.5 10.95 10 11.4 10.55 12 11.35 12.5 12.1 13 12.9 13 13.75 13 14.5 12.5 14.95 12.2 15.85 11.4 16.45 10.8 18.6 8.2 20.95 5.3 22.4 3.9 24.45 2 25.95 2
          L 26 2 Z"/>
          
          <path class="bg" stroke="none" d="
          M 26 0
          L 25.8 0
          Q 23.55 0.05 21.05 2.4 19.75 3.6 17.05 6.95 15.3 9.15 14.45 9.95 13.85 10.6 13.45 10.8 13.15 11 12.9 11 12.7 11 12.4 10.8 12.2 10.7 11.4 10 10.5 9.1 8.8 6.95 6.4 3.9 4.8 2.4 2.15 0.05 0 0
          L 0 1
          Q 1.85 1.1 4.15 3.15 5.7 4.6 8.05 7.6 9.75 9.8 10.7 10.7 10.75 10.7 10.75 10.75 11.55 11.45 11.85 11.65 12.45 12.05 12.9 12 13.4 12.05 14 11.65 14.45 11.4 15.15 10.7 15.15 10.65 15.2 10.65 16.05 9.8 17.85 7.6 20.45 4.3 21.75 3.15 24 1.05 25.95 1
          L 26 1 26 0 Z"/>
          </g>
          </defs>
          
          <g transform="matrix( 1, 0, 0, 1, 0,0) ">
          <use xlink:href="#Layer1_0_FILL"/>
          </g>
        </svg>
      </div>
      <div class="tooltip-inner"></div>
    </div>`,
  nativeTemplate: `
    <div class="tooltip native" role="tooltip">
      <div class="tooltip-inner"></div>
    </div>`,
  // Selector used to get the arrow element in the tooltip template
  defaultArrowSelector: '.tooltip-arrow',
  // Selector used to get the inner content element in the tooltip template
  defaultInnerSelector: '.tooltip-inner',
  // Delay (ms)
  defaultDelay: 0,
  // Default events that trigger the tooltip
  defaultTrigger: 'hover focus',
  // Default position offset (px)
  defaultOffset: 0,
  // Default container where the tooltip will be appended
  defaultContainer: 'body',
  defaultBoundariesElement: undefined,
  // Class added when content is loading
  defaultLoadingClass: 'tooltip-loading',
  // Displayed when tooltip content is loading
  defaultLoadingContent: '...',
  // Hide on mouseover tooltip
  autoHide: true,
  // Close tooltip on mousedown on tooltip target?
  defaultHideOnTargetPress: true,
  // Auto destroy tooltip DOM nodes (ms)
  disposeTimeout: 5000,
  
}

export function getOptions (options) {
  const result = {
    placement: typeof options.placement !== 'undefined' ? options.placement : directive.options.defaultPlacement,
    delay: typeof options.delay !== 'undefined' ? options.delay : directive.options.defaultDelay,
    html: typeof options.html !== 'undefined' ? options.html : directive.options.defaultHtml,
    template: typeof options.template !== 'undefined' ? options.template : options.native ? directive.options.nativeTemplate : directive.options.defaultTemplate,
    arrowSelector: typeof options.arrowSelector !== 'undefined' ? options.arrowSelector : directive.options.defaultArrowSelector,
    innerSelector: typeof options.innerSelector !== 'undefined' ? options.innerSelector : directive.options.defaultInnerSelector,
    trigger: typeof options.trigger !== 'undefined' ? options.trigger : directive.options.defaultTrigger,
    offset: typeof options.offset !== 'undefined' ? options.offset : directive.options.defaultOffset,
    container: typeof options.container !== 'undefined' ? options.container : directive.options.defaultContainer,
    boundariesElement: typeof options.boundariesElement !== 'undefined' ? options.boundariesElement : directive.options.defaultBoundariesElement,
    autoHide: typeof options.autoHide !== 'undefined' ? options.autoHide : directive.options.autoHide,
    hideOnTargetPress: typeof options.hideOnTargetPress !== 'undefined' ? options.hideOnTargetPress : directive.options.defaultHideOnTargetPress,
    loadingClass: typeof options.loadingClass !== 'undefined' ? options.loadingClass : directive.options.defaultLoadingClass,
    loadingContent: typeof options.loadingContent !== 'undefined' ? options.loadingContent : directive.options.defaultLoadingContent,
  }

  if (result.offset) {
    const typeofOffset = typeof result.offset
    let offset = result.offset

    // One value -> switch
    if (typeofOffset === 'number' || (typeofOffset === 'string' && offset.indexOf(',') === -1)) {
      offset = [0, Number(offset)]
    }

    // not working...... 2021.6.8
    result.modifiers = [
      {
        name: 'offset',
        options: {
          offset: offset,
        },
      }
    ];

  }

  if (result.trigger && result.trigger.indexOf('click') !== -1) {
    result.hideOnTargetPress = false
  }

  return result
}

export function getPlacement (value, modifiers) {
  var placement = value.placement
  for (var i = 0; i < positions.length; i++) {
    var pos = positions[i]
    if (modifiers[pos]) {
      placement = pos
    }
  }
  
  return placement
}

export function getContent (value) {
  const type = typeof value
  if (type === 'string') {
    return value
  } else if (value && type === 'object') {
    return value.content
  } else {
    return false
  }
}

export function createTooltip (el, value, modifiers = {}) {
  const content = getContent(value)
  let classes = typeof value.classes !== 'undefined' ? value.classes : directive.options.defaultClass
  let opts = {
    title: content,
    ...getOptions({
      ...value,
      placement: getPlacement(value, modifiers),
    }),
  }

  const tooltip = el._tooltip = new Tooltip(el, opts)
  tooltip.setClasses(classes)
  tooltip._vueEl = el

  // Class on target
  const targetClasses = typeof value.targetClasses !== 'undefined' ? value.targetClasses : directive.options.defaultTargetClass
  el._tooltipTargetClasses = targetClasses
  addClasses(el, targetClasses)

  return tooltip
}

export function destroyTooltip (el) {
  if (el._tooltip) {
    el._tooltip.dispose()
    delete el._tooltip
    delete el._tooltipOldShow
  }

  if (el._tooltipTargetClasses) {
    removeClasses(el, el._tooltipTargetClasses)
    delete el._tooltipTargetClasses
  }
}

export function bind (el, { value, modifiers }) {
  const content = getContent(value)
  if (!content || !state.enabled) {
    destroyTooltip(el)
  } else {
    let tooltip
    if (el._tooltip) {
      tooltip = el._tooltip
      // Content
      tooltip.setContent(content)
      // Options
      let opts = {
        ...value,
        placement: getPlacement(value, modifiers),
      }
      tooltip.setOptions(opts)
    } else {
      tooltip = createTooltip(el, value, modifiers)
    }

    // Manual show
    if (typeof value.show !== 'undefined' && value.show !== el._tooltipOldShow) {
      el._tooltipOldShow = value.show
      value.show ? tooltip.show() : tooltip.hide()
    }
  }
}

export const directive = {
  options: defaultOptions,
  bind,
  update: bind,
  unbind (el) {
    destroyTooltip(el)
  },
}

export default directive
