<template>
  <div v-if="visible" :class="containerClass">
    <transition
      :name="guaranteedOverlayTransition"
      @before-enter="beforeOverlayTransitionEnter"
      @after-enter="afterOverlayTransitionEnter"
      @before-leave="beforeOverlayTransitionLeave"
      @after-leave="afterOverlayTransitionLeave"
    >
      <div
        v-if="visibility.overlay && overlayVisible"
        :class="['wl--overlay', overlayClass]"
        :style="{
          opacity: overlayTransparent,
        }"
        :data-modal="name"
        :aria-expanded="visibility.overlay.toString()"
        @click.self.stop="onOverlayClick"
      >
        <div class="wl--top-right-slot">
          <slot name="top-right" />
        </div>
      </div>
    </transition>
    <transition
      :name="guaranteedModalTransition"
      @before-enter="beforeModalTransitionEnter"
      @after-enter="afterModalTransitionEnter"
      @before-leave="beforeModalTransitionLeave"
      @after-leave="afterModalTransitionLeave"
    >
      <div
        v-if="visibility.modal"
        ref="modal"
        :aria-expanded="visibility.modal.toString()"
        :class="[modalClass, {
          'wl--modal-window': !frameless,
          'wl--modal-rounded': roundedCorner,
          'wl--modal-shadow': shadow,
        }]"
        :style="modalStyle"
        role="dialog"
        aria-modal="true"
      >
        <slot />
        <resizer
          v-if="resizable && !isAutoHeight"
          :min-width="minWidth"
          :min-height="minHeight"
          :max-width="maxWidth"
          :max-height="maxHeight"
          :viewport-height="viewportHeight"
          :viewport-width="viewportWidth"
          :resize-indicator="resizeIndicator"
          :resize-edges="resizeEdges"
          @resize="onModalResize"
        />
      </div>
    </transition>
  </div>
</template>
<script>
import Resizer from './Resizer.vue'
import {
  isInput,
  inRange,
  getTouchEvent,
  blurActiveElement,
  windowWidthWithoutScrollbar,
  stringStylesToObject
} from '../utils'
import { parseNumber, validateNumber } from '../utils/parser'
import ResizeObserver from '../utils/resizeObserver'
import FocusTrap from '../utils/focusTrap'

const defaultTransition = 'wl-transition--default'

const TransitionState = {
  Enter: 'enter',
  Entering: 'entering',
  Leave: 'leave',
  Leaving: 'leavng'
}

export default {
  name: 'WlModal',
  props: {
    name: {
      required: true,
      type: String
    },
    resizable: {
      type: Boolean,
      default: false
    },
    resizeEdges: {
      default: () => ['r', 'br', 'b', 'bl', 'l', 'tl', 't', 'tr'],
      validator: val =>
        ['r', 'br', 'b', 'bl', 'l', 'tl', 't', 'tr'].filter(
          value => val.indexOf(value) !== -1
        ).length === val.length,
      type: Array
    },
    centerResize: {
      type: Boolean,
      default: false
    },
    resizeIndicator: {
      type: Boolean,
      default: false
    },
    adaptive: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: [Boolean, String],
      default: false
    },
    viewport: {
      type: Object, 
      /*
      {
        top:
        left:
        height:
        width:
      }
      */
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    focusTrap: {
      type: Boolean,
      default: false
    },
    reset: {
      type: Boolean,
      default: false
    },
    transition: {
      type: Boolean,
      default: false
    },
    overlayTransition: {
      type: String,
      default: 'wl-transition--overlay'
    },
    modalTransition: {
      type: String,
      default: 'wl-transition--modal'
    },
    clickToClose: {
      type: Boolean,
      default: true
    },
    frameless: {
      type: Boolean,
      default: false
    },
    roundedCorner: {
      type: Boolean,
      default: true
    },
    overlayVisible: {
      type: Boolean,
      default: true
    },
    overlayTransparent: {
      type: Number,
      default: 0.2
    },
    shadow: {
      type: Boolean,
      default: true
    },
    overlayClass: {
      type: String,
      default: ''
    },
    classes: {
      type: [String, Array],
      default: () => []
    },
    styles: {
      type: [String, Array, Object]
    },
    minWidth: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0
      }
    },
    minHeight: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0
      }
    },
    maxWidth: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER
    },
    maxHeight: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER
    },
    width: {
      type: [Number, String],
      default: 600,
      validator: validateNumber
    },
    height: {
      type: [Number, String],
      default: 300,
      validator(value) {
        return value === 'auto' || validateNumber(value)
      }
    },
    shiftX: {
      type: Number,
      default: 0.5,
      validator(value) {
        return value >= 0 && value <= 1
      }
    },
    shiftY: {
      type: Number,
      default: 0.5,
      validator(value) {
        return value >= 0 && value <= 1
      }
    },
    center: {
      type: Boolean,
      default: true
    },
    left: {
      type: Number,
      default: null
    },
    top: {
      type: Number,
      default: null
    },
    right: { // 使用 right 时不要用 draggable，不然没法定位
      type: Number,
      default: null
    },
    bottom: { // 使用 bottom 时不要用 draggable，不然没法定位
      type: Number,
      default: null
    },
    theme: {
      type: String,
      default: ''
    },
  },
  components: {
    Resizer
  },
  data() {
    return {
      visible: false,

      visibility: {
        modal: false,
        overlay: false
      },

      overlayTransitionState: null,
      modalTransitionState: null,

      shiftLeft: 0,
      shiftTop: 0,

      modal: {
        width: 0,
        widthType: 'px',
        height: 0,
        heightType: 'px',
        renderedHeight: 0
      },

      viewportHeight: 0,
      viewportWidth: 0,
      resizeObserver: null,
    }
  },
  created() {
    this.setInitialSize()
  },
  /**
   * Sets global listeners
   */
  beforeMount() {
    this.$modal.subscription.$on('toggle', this.onToggle)

    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('orientationchange', this.onWindowResize)

    this.onWindowResize()
    /**
     * Making sure that autoHeight is enabled when using "scrollable"
     */
    if (this.scrollable && !this.isAutoHeight) {
      console.warn(
        `Modal "${this.name}" has scrollable flag set to true ` +
          `but height is not "auto" (${this.height})`
      )
    }

    if (this.clickToClose) {
      window.addEventListener('keyup', this.onEscapeKeyUp)
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(entries => {
      if (entries.length > 0) {
        const [entry] = entries
        this.modal.renderedHeight = entry.contentRect.height
        this.ensureShiftInWindowBounds()
      }
    })

    this.$focusTrap = new FocusTrap()
  },
  /**
   * Removes global listeners
   */
  beforeDestroy() {
    this.$modal.subscription.$off('toggle', this.onToggle)

    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('orientationchange', this.onWindowResize)

    if (this.clickToClose) {
      window.removeEventListener('keyup', this.onEscapeKeyUp)
    }
    /**
     * Removes blocked scroll
     */
    document.body.classList.remove('wl--block-scroll')


  },
  computed: {
    /**
     *  Because modal state is based on transitions - we need to make sure
     * that there is always a transition for overlay/modal
     **/
    guaranteedOverlayTransition() {
      return this.transition ? this.overlayTransition || defaultTransition : ''
    },

    guaranteedModalTransition() {
      return this.transition ? this.modalTransition || defaultTransition : ''
    },

    /**
     * Returns true if height is set to "auto"
     */
    isAutoHeight() {
      return this.modal.heightType === 'auto'
    },
    /**
     * Calculates and returns modal position based on the
     * pivots, window size and modal size
     */
    position() {
      const {
        viewport,
        viewportHeight,
        viewportWidth,
        shiftLeft,
        shiftTop,
        shiftX,
        shiftY,
        trueModalWidth,
        trueModalHeight
      } = this

      const maxLeft = viewportWidth - trueModalWidth
      const maxTop = Math.max(viewportHeight - trueModalHeight, 0)

      const left = this.center ? shiftLeft + shiftX * maxLeft : shiftLeft + this.left
      const top = this.center ? shiftTop + shiftY * maxTop : shiftTop + this.top

      const boundLeft = viewport && viewport.left ? viewport.left : 0
      const boundTop = viewport && viewport.top ? viewport.top : 0

      return {
        left: parseInt(Math.max(inRange(0, maxLeft, left), boundLeft)),
        top:
          !trueModalHeight && this.isAutoHeight
            ? undefined
            : parseInt(Math.max(inRange(0, maxTop, top), boundTop))
      }
    },
    /**
     * Returns pixel width (if set with %) and makes sure that modal size
     * fits the window
     */
    trueModalWidth() {
      const { viewportWidth, modal, adaptive, minWidth, maxWidth } = this

      const value =
        modal.widthType === '%'
          ? (viewportWidth / 100) * modal.width
          : modal.width

      if (adaptive) {
        const max = Math.max(minWidth, Math.min(viewportWidth, maxWidth))
        return inRange(minWidth, max, value)
      }

      return value
    },
    /**
     * Returns pixel height (if set with %) and makes sure that modal size
     * fits the window.
     *
     * Returns modal.renderedHeight if height set as "auto"
     */
    trueModalHeight() {
      const {
        viewportHeight,
        modal,
        isAutoHeight,
        adaptive,
        minHeight,
        maxHeight
      } = this

      const value =
        modal.heightType === '%'
          ? (viewportHeight / 100) * modal.height
          : modal.height

      if (isAutoHeight) {
        // use renderedHeight when height 'auto'
        return this.modal.renderedHeight
      }

      if (adaptive) {
        const max = Math.max(minHeight, Math.min(viewportHeight, maxHeight))

        return inRange(minHeight, max, value)
      }

      return value
    },

    /**
     * Returns the height of the modal when in 'auto' mode, making sure the
     * modal fits the viewport if 'adaptive' is also true
     */
    autoHeight() {
      return this.adaptive && this.modal.renderedHeight >= this.viewportHeight
        ? Math.max(this.minHeight, this.viewportHeight) + 'px'
        : 'auto'
    },

    containerClass() {
      return [
        'wl--container',
        this.theme,
        this.scrollable && this.isAutoHeight && 'scrollable'
      ]
    },

    /**
     * Returns class list for modal itself
     */
    modalClass() {
      return ['wl--modal', this.classes]
    },

    stylesProp() {
      return typeof this.styles === 'string'
        ? stringStylesToObject(this.styles)
        : this.styles
    },
    /**
     * CSS styles for position and size of the modal
     */
    modalStyle() {
      return [
        this.stylesProp,
        {
          position: this.center ? 'relative' : 'absolute',
          top: this.center ? `${this.position.top}px` : (this.top !== null && this.position.top !== null ? `${this.position.top}px` : 'auto'),
          bottom: this.center ? `${this.position.bottom}px` : (this.bottom !== null ? `${this.bottom}px` : 'auto'),
          left: this.center ? `${this.position.left}px` : (this.left !== null && this.position.left !== null ? `${this.position.left}px` : 'auto'),
          right: this.center ? `${this.position.right}px` : (this.right !== null ? `${this.right}px` : 'auto'),
          width: this.trueModalWidth + 'px',
          height: this.isAutoHeight
            ? this.autoHeight
            : this.trueModalHeight + 'px'
        }
      ]
    },

    isComponentReadyToBeDestroyed() {
      return (
        this.overlayTransitionState === TransitionState.Leave &&
        this.modalTransitionState === TransitionState.Leave
      )
    }
  },

  watch: {
    isComponentReadyToBeDestroyed(isReady) {
      if (isReady) {
        this.visible = false
      }
    },

  },

  methods: {
    startTransitionEnter() {
      this.visibility.overlay = true
      this.visibility.modal = true
    },

    startTransitionLeave() {
      this.visibility.overlay = false
      this.visibility.modal = false
    },

    beforeOverlayTransitionEnter() {
      this.overlayTransitionState = TransitionState.Entering
    },

    afterOverlayTransitionEnter() {
      this.overlayTransitionState = TransitionState.Enter
    },

    beforeOverlayTransitionLeave() {
      this.overlayTransitionState = TransitionState.Leaving
    },

    afterOverlayTransitionLeave() {
      this.overlayTransitionState = TransitionState.Leave
    },

    beforeModalTransitionEnter() {
      this.modalTransitionState = TransitionState.Entering

      this.$nextTick(() => {
        this.resizeObserver.observe(this.$refs.modal)
      })
    },

    afterModalTransitionEnter() {
      /* Setup resize ovserver */
      this.modalTransitionState = TransitionState.Enter

      if (this.draggable) {
        this.addDraggableListeners()
      }

      if (this.focusTrap) {
        this.$focusTrap.enable(this.$refs.modal)
      }

      const event = this.createModalEvent({
        state: 'opened',
        modal: this, 
        el: this.$refs.modal,
      })

      this.$emit('opened', event)
    },

    beforeModalTransitionLeave() {
      this.modalTransitionState = TransitionState.Leaving
      this.resizeObserver.unobserve(this.$refs.modal)

      if (this.$focusTrap.enabled()) {
        this.$focusTrap.disable()
      }
    },

    afterModalTransitionLeave() {
      this.modalTransitionState = TransitionState.Leave

      const event = this.createModalEvent({
        state: 'closed'
      })

      this.$emit('closed', event)
    },

    onToggle(name, state, params) {
      if (this.name === name) {
        const nextState = typeof state === 'undefined' ? !this.visible : state

        this.toggle(nextState, params)
      }
    },
    /**
     * Initializes modal's size & position,
     * if "reset" flag is set to true - this function will be called
     * every time "beforeOpen" is triggered
     */
    setInitialSize() {
      const width = parseNumber(this.width)
      const height = parseNumber(this.height)

      this.modal.width = width.value
      this.modal.widthType = width.type
      this.modal.height = height.value
      this.modal.heightType = height.type
    },

    onEscapeKeyUp(event) {
      if (event.which === 27 && this.visible) {
        this.$modal.hide(this.name)
      }
    },

    onWindowResize() {
      const { viewport } = this
      this.viewportWidth = viewport && viewport.width ? viewport.width : windowWidthWithoutScrollbar()
      this.viewportHeight = viewport && viewport.height ? viewport.height : window.innerHeight

      this.ensureShiftInWindowBounds()
    },
    /**
     * Generates event object
     */
    createModalEvent(properties = {}) {
      return {
        name: this.name,
        ref: this.$refs.modal || null,
        ...properties
      }
    },
    /**
     * Event handler which is triggered on modal resize
     */
    onModalResize(event) {
      this.modal.widthType = 'px'
      this.modal.width = event.size.width

      this.modal.heightType = 'px'
      this.modal.height = event.size.height
      //Handle Shifting
      if (!this.centerResize) {
        this.shiftLeft = this.getResizedShiftLeft(event)
        this.shiftTop = this.getResizedShiftTop(event)
      }

      const { size } = this.modal

      this.$emit(
        'resize',
        this.createModalEvent({
          size
        })
      )
    },

    /**
     * When centerResize is set to false, the modal has to be shifted so the position of the modal stays fixed.
     * This method shifts the modal in the x direction.
     */
    getResizedShiftLeft(event) {

      let result = this.shiftLeft

      switch (event.direction) {
        case 'vue-modal-topRight':
        case 'vue-modal-bottomRight':
        case 'vue-modal-right':
          result = result + 0.5 * event.dimGrowth.width
          break
        case 'vue-modal-bottomLeft':
        case 'vue-modal-topLeft':
        case 'vue-modal-left':
          result = result - 0.5 * event.dimGrowth.width
          break
        case 'vue-modal-top':
        case 'vue-modal-bottom':
          break
        default:
          console.error('Could not Find Resize Direction In ShiftLeft')
      }

      return result
    },
    /**
     * When centerResize is set to false, the modal has to be shifted so the position of the modal stays fixed.
     * This method shifts the modal in the y direction.
     */
    getResizedShiftTop(event) {

      let result = this.shiftTop

      switch (event.direction) {
        case 'vue-modal-bottom':
        case 'vue-modal-bottomRight':
        case 'vue-modal-bottomLeft':
          result = result + 0.5 * event.dimGrowth.height
          break
        case 'vue-modal-top':
        case 'vue-modal-topRight':
        case 'vue-modal-topLeft':
          result = result - 0.5 * event.dimGrowth.height
          break
        case 'vue-modal-left':
        case 'vue-modal-right':
          break
        default:
          console.error('Could not Find Resize Direction In ShiftTop')
      }
      return result
    },
    open(params) {
      if (this.reset) {
        this.setInitialSize()

        this.shiftLeft = 0
        this.shiftTop = 0
      }

      if (this.scrollable) {
        document.body.classList.add('wl--block-scroll')
      }

      let cancelEvent = false

      const cancel = () => {
        cancelEvent = true
      }

      const event = this.createModalEvent({
        cancel,
        state: 'before-open',
        params
      })

      this.$emit('before-open', event)

      if (cancelEvent) {
        if (this.scrollable) {
          document.body.classList.remove('wl--block-scroll')
        }

        return
      }
      /**
       * Need to unfocus previously focused element, otherwise
       * all keypress events (ESC press, for example) will trigger on that element.
       */
      blurActiveElement()

      this.visible = true
      /* Making sure that entering tranition uses "enter" sequance instead of "appear" */
      this.$nextTick(() => {
        this.startTransitionEnter()
      })
    },

    close(params) {
      if (this.scrollable) {
        document.body.classList.remove('wl--block-scroll')
      }

      let cancelEvent = false

      const cancel = () => {
        cancelEvent = true
      }

      const event = this.createModalEvent({
        cancel,
        state: 'before-close',
        params
      })

      this.$emit('before-close', event)

      if (cancelEvent) {
        return
      }

      this.startTransitionLeave()
    },

    toggle(isOpening, params) {
      const { visible } = this

      if (visible === isOpening) {
        return
      }

      if (isOpening) {
        this.open(params)
      } else {
        this.close(params)
      }
    },

    getDraggableElement() {
      if (this.draggable === true) {
        return this.$refs.modal
      }

      if (typeof this.draggable === 'string') {
        return this.$refs.modal.querySelector(this.draggable)
      }

      return null
    },

    /**
     * Event handler that is triggered when background overlay is clicked
     */
    onOverlayClick() {
      if (this.clickToClose) {
        this.toggle(false)
      }
    },

    addDraggableListeners() {
      const dragger = this.getDraggableElement()

      if (dragger) {
        let startX = 0
        let startY = 0
        let initialShiftLeft = 0
        let initialShiftTop = 0
        let osx = 0, osy = 0

        const handleDraggableMousedown = event => {
          let target = event.target
          
          if (isInput(target)) {
            return
          }

          let { clientX, clientY } = getTouchEvent(event)

          document.addEventListener('mousemove', handleDraggableMousemove)
          document.addEventListener('touchmove', handleDraggableMousemove)

          document.addEventListener('mouseup', handleDraggableMouseup)
          document.addEventListener('touchend', handleDraggableMouseup)

          startX = clientX
          startY = clientY

          initialShiftLeft = this.shiftLeft
          initialShiftTop = this.shiftTop

        }

        const handleDraggableMousemove = event => {
          let { clientX, clientY } = getTouchEvent(event)
          event.preventDefault()

          osx = clientX - startX
          osy = clientY - startY

          this.shiftLeft = initialShiftLeft + osx
          this.shiftTop = initialShiftTop + osy

          this.$emit('dragging', {modal: this, el: this.$refs.modal});

          
        }

        const handleDraggableMouseup = event => {
          this.ensureShiftInWindowBounds()

          document.removeEventListener('mousemove', handleDraggableMousemove)
          document.removeEventListener('touchmove', handleDraggableMousemove)

          document.removeEventListener('mouseup', handleDraggableMouseup)
          document.removeEventListener('touchend', handleDraggableMouseup)

          event.preventDefault()

          this.$emit('dragstoped', {modal: this, el: this.$refs.modal});
        }

        dragger.addEventListener('mousedown', handleDraggableMousedown)
        dragger.addEventListener('touchstart', handleDraggableMousedown)
      }
    },

    ensureShiftInWindowBounds() {
      const {
        viewportHeight,
        viewportWidth,
        shiftLeft,
        shiftTop,
        shiftX,
        shiftY,
        trueModalWidth,
        trueModalHeight
      } = this

      const maxLeft = viewportWidth - trueModalWidth
      const maxTop = Math.max(viewportHeight - trueModalHeight, 0)

      let left = this.center ? shiftLeft + shiftX * maxLeft : shiftLeft + this.left
      let top = this.center ? shiftTop + shiftY * maxTop : shiftTop + this.top

      this.shiftLeft -= left - inRange(0, maxLeft, left)
      this.shiftTop -= top - inRange(0, maxTop, top)
    },

    // public methods
    setRect(rect) {
      if (rect.width) {
        this.modal.width = rect.width
        this.modal.widthType = 'px'
      }
      if (rect.height) {
        this.modal.height = rect.height
        this.modal.heightType = !rect.autoHeight ? 'px' : 'auto'
      }
      if (!isNaN(rect.left)) {
        this.shiftLeft = rect.left - this.left
      }
      if (!isNaN(rect.top)) {
        this.shiftTop = rect.top - this.top
      }

      this.ensureShiftInWindowBounds()
    },
  }
}
</script>

<style lang="scss">
.wl--block-scroll {
  overflow: hidden;
  width: 100vw;
}

.wl--container {
  position: fixed;
  box-sizing: border-box;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;

  pointer-events: none;
}
.wl--overlay {
  position: fixed;
  box-sizing: border-box;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 1);
  pointer-events: auto;
}

.wl--container.scrollable {
  height: 100%;
  min-height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.wl--modal {
  position: relative;
  box-sizing: border-box;
  pointer-events: auto;
}

.wl--modal-window {
  background-color: white;
}

.wl--modal-rounded {
  border-radius: 4px;
}

.wl--modal-shadow {
  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0px 0px 1px rgba(0, 0, 0, 0.05);
}

.wl--container.scrollable .wl--modal {
  margin-bottom: 2px;
}

.wl--top-right-slot {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
}

.wl-transition--overlay-enter-active,
.wl-transition--overlay-leave-active {
  transition: all 50ms;
}

.wl-transition--overlay-enter,
.wl-transition--overlay-leave-active {
  opacity: 0;
}

.wl-transition--modal-enter-active,
.wl-transition--modal-leave-active {
  transition: all 250ms ease-in-out;
}

.wl-transition--modal-enter,
.wl-transition--modal-leave-active {
  opacity: 0;
  transform: translateY(-30px);
}

.wl-transition--default-enter-active,
.wl-transition--default-leave-active {
  transition: all 2ms;
}

.wl-transition--default-enter,
.wl-transition--default-leave-active {
  opacity: 0;
}

/* ------------------ drak ------------------ */

.dark {
  color: $text-color-primary-dark-ui;

  .wl--modal-window {
    background-color: $md-gray-95;
  }
}
</style>
