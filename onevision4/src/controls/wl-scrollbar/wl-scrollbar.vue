
<template>
  <div
    @click="calculateSize()"
    class="wl-scrollbar__wrapper"
    :class="classes"
    ref="scrollWrapper"
    :style="this.styles"
  >
    <div
      :class="`wl-scrollbar__area ${ this.dragging || this.disableTransition ? ' ' : ' wl-scrollbar-transition'}`"
      ref="scrollArea"
      @wheel="scroll"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="stopDrag"
      :style="{
        marginTop: this.top * -1 +'px',
        marginLeft: this.left * -1 +'px'
      }">

        <slot />

        <vertical-scrollbar
          v-if="ready"
          ref="verticalScrollbar"
          :class="{visible: scrollbarVisible}"
          :alwaysVisible="alwaysVisible"
          :arrowVisible="arrowVisible"
          :backgroundVisible="backgroundVisible"
          :area="{ height: scrollAreaHeight }"
          :wrapper="{ height: scrollWrapperHeight }"
          :scrolling="vMovement"
          :dragging-from-parent="dragging"
          :on-change-position="handleChangePosition"
          :on-dragging="handleScrollbarDragging"
          :on-stop-drag="handleScrollbarStopDrag"
          :theme="theme"
          @heightChanged="handleHeightChange"
        />

    </div>

  </div>

</template>


<script>

  import VerticalScrollbar from './vertical-scrollbar.vue';

  export default {

    props: {
      disableScroll: Boolean,
      alwaysVisible: Boolean,
      arrowVisible: Boolean,
      backgroundVisible: {
        type: Boolean,
        default: true
      },
      classes: [String, Array, Object],
      styles: Object,
      speed: {
        type: Number,
        default: 53
      },
      theme: {
        type: String,
        default: 'dark'
      },
      onMaxScroll: Function,
    },

    components: {
      VerticalScrollbar,
    },

    data () {
      return  {
        ready: false,
        top: 0,
        left: 0,
        scrollAreaHeight: null,
        scrollAreaWidth: null,
        scrollWrapperHeight: null,
        scrollWrapperWidth: null,
        vMovement: 0,
        hMovement: 0,
        dragging: false,
        disableTransition: false,
        start: { y: 0, x: 0},
        allowBodyScroll: false,
        hideScrollbarIntervalId: 0,
        scrollbarVisible: false,
      }
    },

    

    methods: {
      scroll(e){
        if (this.disableScroll) {
          return;
        }
        // Make sure the content height is not changed
        this.calculateSize(() => {
          // Set the wheel step
          let num = this.speed

          // DOM events
          let shifted = e.shiftKey
          let scrollY = e.deltaY > 0 ? num : -(num)

          // Next Value
          let nextY = this.top + scrollY

          // Is it Scrollable?
          let canScrollY = this.scrollAreaHeight > this.scrollWrapperHeight

          // Vertical Scrolling
          if(canScrollY && !shifted) this.normalizeVertical(nextY)
        })

        // prevent Default only if scrolled content is not at the top/bottom
        if (!this.allowBodyScroll) {
          e.preventDefault()
          e.stopPropagation()
        }

        this.showScrollbar()
        this.hideScrollbar()

      },

      // DRAG EVENT JUST FOR TOUCH DEVICE~
      startDrag(e){
        this.touchEvent = e

        const evt = e.changedTouches ? e.changedTouches[0] : e

        // Make sure the content height is not changed
        this.calculateSize(() => {
          // Prepare to drag
          this.dragging = true,
          this.start = { y: evt.pageY, x: evt.pageX }
        })
      },

      onDrag(e){
        if(this.dragging){
          e.preventDefault()
          e.stopPropagation()

          // Prevent Click Event When it dragging
          if (this.touchEvent) {
            this.touchEvent.preventDefault()
            this.touchEvent.stopPropagation()
          }

          let evt = e.changedTouches ? e.changedTouches[0] : e

          // Invers the Movement
          let yMovement = this.start.y - evt.clientY

          // Update the last e.client
          this.start = { y: evt.clientY, x: evt.clientX }

          // The next Vertical Value will be
          let nextY = this.top + yMovement

          this.normalizeVertical(nextY)

          this.showScrollbar()
          this.hideScrollbar()

        }
      },

      stopDrag(){
        this.dragging = false
        this.touchEvent = false
      },

      scrollToY(y, disableTransition = false) {
        this.disableTransition = disableTransition
        this.normalizeVertical(y)
        setTimeout(() => {
          this.disableTransition = false
        }, 1000);
      },

      normalizeVertical(next){
        const elementSize = this.getSize()

        // Vertical Scrolling
        const lowerEnd = elementSize.scrollAreaHeight - elementSize.scrollWrapperHeight

        // Max Scroll Down
        const maxBottom = next > lowerEnd
        if(maxBottom) next = lowerEnd

        // Max Scroll Up
        const maxTop = next < 0
        if(maxTop) next = 0


        // Update the Vertical Value if it's needed
        const shouldScroll = this.top !== next
        this.allowBodyScroll = !shouldScroll
        if (shouldScroll) {
          this.top = next,
          this.vMovement = next / elementSize.scrollAreaHeight * 100

          if (this.onMaxScroll && (maxTop || maxBottom)) {
            this.onMaxScroll({ top: maxTop, bottom: maxBottom, right: false, left: false })
          }
        }

        this.$emit('scroll')
      },

      handleChangePosition(movement, orientation){
        // Make sure the content height is not changed
        this.calculateSize(() => {
          // Convert Percentage to Pixel
          let next = movement / 100
          if( orientation == 'vertical' ) this.normalizeVertical( next * this.scrollAreaHeight )
        })
      },

      handleScrollbarDragging(){
        this.dragging = true
      },

      handleScrollbarStopDrag(){
        this.dragging = false
      },

      getSize(){
        // The Elements
        let $scrollArea = this.$refs.scrollArea
        let $scrollWrapper = this.$refs.scrollWrapper

        // Get new Elements Size
        let elementSize = {
          // Scroll Area Height and Width
          scrollAreaHeight: $scrollArea.children[0].clientHeight,
          scrollAreaWidth: $scrollArea.children[0].clientWidth,

          // Scroll Wrapper Height and Width
          scrollWrapperHeight: $scrollWrapper.clientHeight,
          scrollWrapperWidth: $scrollWrapper.clientWidth,
        }
        return elementSize
      },

      calculateSize(cb){
        if(typeof cb !== 'function') cb = null;

        let elementSize = this.getSize()

        if( elementSize.scrollWrapperHeight !== this.scrollWrapperHeight ||
            elementSize.scrollWrapperWidth !== this.scrollWrapperWidth ||
            elementSize.scrollAreaHeight !== this.scrollAreaHeight ||
            elementSize.scrollAreaWidth !== this.scrollAreaWidth )
        {

          // Scroll Area Height and Width
          this.scrollAreaHeight = elementSize.scrollAreaHeight,
          this.scrollAreaWidth = elementSize.scrollAreaWidth,

          // Scroll Wrapper Height and Width
          this.scrollWrapperHeight = elementSize.scrollWrapperHeight,
          this.scrollWrapperWidth = elementSize.scrollWrapperWidth,

          // Make sure The wrapper is Ready, then render the scrollbar
          this.ready = true

          return cb ? cb() : false
        }

        else return cb ? cb() : false
      },


      hideScrollbar(){
        this.hideScrollbarIntervalId = setTimeout( () => {
          this.scrollbarVisible = false;
        }, 700);
      },
      showScrollbar(){
        clearInterval(this.hideScrollbarIntervalId);
        this.scrollbarVisible = true;
      },

      scrollUp(delta = 50) {
        this.$refs.verticalScrollbar.scrollUp(delta)
      },
      scrollDown(delta = 50) {
        this.$refs.verticalScrollbar.scrollDown(delta)
      },

      handleHeightChange(evt) {
        this.$emit('heightChanged', evt)
      },

      //public methods
      update() {
        this.calculateSize()
        this.scrollToY(this.top, true)
        this.showScrollbar()
        this.hideScrollbar()
      },
      getVisible() {
        return {
          verticalScrollbarVisible: this.$refs.verticalScrollbar ? this.$refs.verticalScrollbar.getVisible() : false,
        }
      },
      getScrollOffset() {
        return {
          y: this.$refs.scrollArea.style.marginTop,
          x: this.$refs.scrollArea.style.marginLeft,
        }
      },

    },

    mounted () {
      this.calculateSize()
      
      // Attach The Event for Responsive View~
      window.addEventListener('resize', this.calculateSize)
    },

    beforeDestroy (){
      // Remove Event
      window.removeEventListener('resize', this.calculateSize)
    }

  }

</script>
