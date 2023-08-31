
<template>
  <div
    v-if="getVisible()"
    class="wl-scrollbar__scrollbar-vertical"
    :class="[{
      keepvisible: alwaysVisible,
      dragging: dragging,
      padding: !arrowVisible,
    }, theme]"
    :style="{
      background: backgroundVisible ? '' : 'none',
    }"
  >

    <div v-if="arrowVisible" class="arrow arrow-up" :class="{disabled: arrowUpDisabled}" @click="scrollUp()" >
      <wl-icon
        name="arrow-up-filled" 
        size="8"
      />
    </div>
    <div ref="container" class="track" @click="jump" >
      <div
        :class="'scrollbar' + ( dragging || draggingFromParent ? '' : ' wl-scrollbar-transition')"
        ref="scrollbar"
        @touchstart="startDrag"
        @mousedown="startDrag "
        :style="{
          height: `${height}%`,
          top: `${scrolling}%`,
        }">
      </div>
    </div>
    <div v-if="arrowVisible" class="arrow arrow-down" :class="{disabled: arrowDownDisabled}" @click="scrollDown()" >
      <wl-icon
        name="arrow-down-filled" 
        size="8"
      />
    </div>

  </div>
</template>

<script>

  export default {

    props: {
      alwaysVisible: Boolean,
      arrowVisible: Boolean,
      backgroundVisible: Boolean,
      draggingFromParent: Boolean,
      scrolling: Number,
      wrapper: Object,
      area: Object,
      theme: String,
      onChangePosition: Function,
      onDragging: Function,
      onStopDrag: Function,
    },

    data () {
      return  {
        arrowUpDisabled: false,
        arrowDownDisabled: false,
        margin: '4px',
        height: 0,
        dragging: false,
        start: 0
      }
    },


    watch: {
      'wrapper.height' () {
        this.calculateSize(this)
      },

      'area.height' () {
        this.calculateSize(this)
      },

      height (newVal) {
        this.$emit('heightChanged', {height: newVal})
      },
      scrolling () {

      },

    },

    methods: {

      startDrag(e){

        e.preventDefault()
        e.stopPropagation()

        e = e.changedTouches ? e.changedTouches[0] : e

        // Prepare to drag
        this.dragging = true,
        this.start = e.clientY
      },

      onDrag(e){

        if(this.dragging){

          // Make The Parent being in the Dragging State
          this.onDragging()

          e.preventDefault()
          e.stopPropagation()

          e = e.changedTouches ? e.changedTouches[0] : e

          let yMovement = e.clientY - this.start
          let yMovementPercentage = yMovement / this.wrapper.height * 100

          // Update the last e.clientY
          this.start = e.clientY

          // The next Vertical Value will be
          let next = this.scrolling + yMovementPercentage

          // Tell the parent to change the position
          this.changePosition(next, 'vertical')

        }

      },

      stopDrag(){
        if(this.dragging){
          // Parent Should Change the Dragging State
          this.onStopDrag()
          this.dragging = false
        }
      },

      jump(e){

        let isContainer = e.target === this.$refs.container

        if(isContainer){

          // Get the Element Position
          let position = this.$refs.scrollbar.getBoundingClientRect()

          // Calculate the vertical Movement
          let yMovement = e.clientY - position.top
          let centerize = this.height / 2
          let yMovementPercentage = yMovement / this.wrapper.height * 100 - centerize

          // Update the last e.clientY
          this.start = e.clientY

          // The next Vertical Value will be
          let next = this.scrolling + yMovementPercentage

          // Tell the parent to change the position
          this.changePosition(next, 'vertical')

        }
      },

      scrollUp(delta = 50) {
        // Calculate the vertical Movement
        let yMovement = -delta
        let yMovementPercentage = yMovement / this.wrapper.height * 100

        // The next Vertical Value will be
        let next = this.scrolling + yMovementPercentage

        // Tell the parent to change the position
        this.changePosition(next, 'vertical')
      },
      scrollDown(delta = 50) {
        // Calculate the vertical Movement
        let yMovement = delta
        let yMovementPercentage = yMovement / this.wrapper.height * 100

        // The next Vertical Value will be
        let next = this.scrolling + yMovementPercentage

        // Tell the parent to change the position
        this.changePosition(next, 'vertical')
      },

      checkArrow(next) {
        if (next <= 0) {
          this.arrowUpDisabled = true
        } else {
          this.arrowUpDisabled = false
        }
        if (next >= 100 - this.height) {
          this.arrowDownDisabled = true
        } else {
          this.arrowDownDisabled = false
        }
      },

      changePosition(next, direction){
        // this.checkArrow(next)
        this.onChangePosition(next, direction)
      },

      calculateSize(source){
        // Scrollbar Height
        this.height = source.wrapper.height / source.area.height * 100
      },

      getSize(){
        // The Elements
        let $scrollArea = this.$refs.container.parentElement
        let $scrollWrapper = $scrollArea.parentElement

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

      // public method
      getVisible() {
        return this.height < 100
      }


    },

    mounted() {
      this.calculateSize(this)

      // Put the Listener
      document.addEventListener("mousemove", this.onDrag)
      document.addEventListener("touchmove", this.onDrag)
      document.addEventListener("mouseup", this.stopDrag)
      document.addEventListener("touchend", this.stopDrag)
    },

    beforeDestroy() {
      // Remove the Listener
      document.removeEventListener("mousemove", this.onDrag)
      document.removeEventListener("touchmove", this.onDrag)
      document.removeEventListener("mouseup", this.stopDrag)
      document.removeEventListener("touchend", this.stopDrag)
    },

  }

</script>
