<template>
  <drag-resize
    v-bind="$attrs"
    :id="id"
    :name="name"
    ref="window"
    :class="[classNameList, {
      'wl--window-border': windowSize === 'normal' && !fullscreenRect && border,
    }]"
    :style="{
      borderRadius: borderRadius,
    }"
    :activeStyleObject="windowSize === 'normal' ? activeStyleObject : {}"
    :deactiveStyleObject="windowSize === 'normal' ? deactiveStyleObject : {}"
    :isActive="isActive"
    :preventActiveBehavior="preventActiveBehavior"
    :w="fullscreenRect ? fullscreenRect.w : w"
    :h="fullscreenRect ? fullscreenRect.h : h"
    :minw="minw"
    :minh="minh"
    :maxw="maxw"
    :maxh="maxh"
    :x="fullscreenRect ? fullscreenRect.x : x"
    :y="fullscreenRect ? fullscreenRect.y : y"
    :parentW="parentW"
    :parentH="parentH"
    :isDraggable="!fullscreenRect && isDraggable"
    :isResizable="!fullscreenRect && isResizable"
    :aspectRatio="aspectRatio"
    :parentLimitation="parentLimitation"
    :showHandle="showHandle"
    :borderIsHandle="borderIsHandle"
    :parentScaleX="parentScaleX"
    :parentScaleY="parentScaleY"
    :snapToGrid="snapToGrid"
    :gridX="gridX"
    :gridY="gridY"
    :dragHandle="dragHandle"
    :dragCancel="dragCancel"
    :sticks="sticks"
    :axis="axis"
    @dragging="onDragging"
    @dragstop="onDragstop"
    @resizing="onResizing"
    @resizestop="onResizeStop"
    @activated="onActivated"
    @deactivated="onDeactivated"
  >
    <slot :active="active" :parentRect="rect" />
  </drag-resize>
</template>
<script>

export default {
  name: 'WlWindow',
  props: {
    name: {
      required: true,
      type: String
    },
    id: {
      type: String
    },
    classNameList: {
      type: Array
    },
    showHandle: {
      type: Boolean, default: false
    },
    borderIsHandle: {
      type: Boolean, default: true
    },
    parentScaleX: {
      type: Number, default: 1,
    },
    parentScaleY: {
      type: Number, default: 1,
    },
    isActive: {
      type: Boolean, default: false
    },
    preventActiveBehavior: {
      type: Boolean, default: false
    },
    isDraggable: {
      type: Boolean, default: true
    },
    isResizable: {
      type: Boolean, default: true
    },
    aspectRatio: {
      type: Boolean, default: false
    },
    parentLimitation: {
      type: Boolean, default: false
    },
    snapToGrid: {
      type: Boolean, default: false
    },
    gridX: {
      type: Number,
      default: 50,
      validator: function (val) {
        return val > 0
      }
    },
    gridY: {
      type: Number,
      default: 50,
      validator: function (val) {
        return val > 0
      }
    },
    parentSelector: {
      type: String,
    },
    parentW: {
      type: Number,
      default: 0,
      validator: function (val) {
        return val >= 0
      }
    },
    parentH: {
      type: Number,
      default: 0,
      validator: function (val) {
        return val >= 0
      }
    },
    w: {
      type: Number,
      default: 100,
      validator: function (val) {
        return val > 0
      }
    },
    h: {
      type: Number,
      default: 100,
      validator: function (val) {
        return val > 0
      }
    },
    minw: {
      type: Number,
      default: 50,
      validator: function (val) {
        return val > 0
      }
    },
    minh: {
      type: Number,
      default: 50,
      validator: function (val) {
        return val > 0
      }
    },
    maxw: {
      type: Number,
      default: 9999,
      validator: function (val) {
        return val > 0
      }
    },
    maxh: {
      type: Number,
      default: 9999,
      validator: function (val) {
        return val > 0
      }
    },
    x: {
      type: Number,
      default: 0,
      validator: function (val) {
        return typeof val === 'number'
      }
    },
    y: {
      type: Number,
      default: 0,
      validator: function (val) {
        return typeof val === 'number'
      }
    },
    z: {
      type: [String, Number],
      default: 'auto',
      validator: function (val) {
          let valid = (typeof val === 'string') ? val === 'auto' : val >= 0;
        return valid
      }
    },
    dragHandle: {
      type: String,
      default: null
    },
    dragCancel: {
      type: String,
      default: null
    },
    sticks: {
      type: Array,
      default: function () {
        return ['tm', 'mr', 'bm', 'ml', 'tl', 'tr', 'br', 'bl']
      }
    },
    axis: {
      type: String,
      default: 'both',
      validator: function (val) {
        return ['x', 'y', 'both', 'none'].indexOf(val) !== -1
      }
    },


    shadow: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    borderRadius: {
      type: String,
      default: '0'
    },


    dragging: {
      type: Function,
    },
    dragstop: {
      type: Function,
    },
    resizing: {
      type: Function,
    },
    resizestop: {
      type: Function,
    },
    activated: {
      type: Function,
    },
    deactivated: {
      type: Function,
    },
    minimize: {
      type: Function,
    },
    normal: {
      type: Function,
    },
    maximize: {
      type: Function,
    },
    fullscreen: {
      type: Function,
    },
    aftermount: {
      type: Function,
    },

  },

  data() {
    return {
      active: true,
      rect: null,
      activeStyleObject: {
        'box-shadow': '0px 24px 48px rgba(0, 0, 0, 0.5), 0px 0px 1px rgba(0, 0, 0, 0.2)',
      },
      deactiveStyleObject: {
        'cursor' : 'default',
        'box-shadow': '0px 18px 32px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12)',
      },
      fullscreenRect: null,
      windowSize: 'normal',
    }
  },
  created() {
    this.active = this.isActive
  },

  beforeMount() {
    this.$window.subscription.$on('toggle', this.onToggle)
    this.$window.subscription.$on('minimize', this.onMinimize)
    this.$window.subscription.$on('normal', this.onNormal)
    this.$window.subscription.$on('maximize', this.onMaximize)
    this.$window.subscription.$on('fullscreen', this.onFullscreen)
  },
  mounted() {
    this.$emit('aftermount');
    if (this.aftermount) {
      this.aftermount()
    }

    this.$nextTick(() => {
      this.rect = document.querySelector(`[name="${this.name}"]`).getBoundingClientRect();
    })
  },
  /**
   * Removes global listeners
   */
  beforeDestroy() {
    this.$window.subscription.$off('toggle', this.onToggle)
    this.$window.subscription.$off('minimize', this.onMinimize)
    this.$window.subscription.$off('normal', this.onNormal)
    this.$window.subscription.$off('maximize', this.onMaximize)
    this.$window.subscription.$off('fullscreen', this.onFullscreen)
  },
  computed: {

  },

  watch: {

  },

  methods: {
    createWindowEvent(properties = {}) {
      return {
        name: this.name,
        ref: this.$refs.window || null,
        ...properties
      }
    },

    onToggle(name, state, params) {
      if (this.name === name) {
        if (state) {
          const event = this.createWindowEvent({
            state: 'opened',
            params: params,
          })

          this.$emit('opened', event)
        } else {
          const event = this.createWindowEvent({
            state: 'closed',
            params: params,
          })

          this.$emit('closed', event)
        }
      }
    },
    
    onMinimize(name, params){
      if (this.name === name) {
        const event = this.createWindowEvent({
          state: 'minimize',
          params: params,
        })
        this.$emit('minimize', event);
        if (this.minimize) {
          this.minimize(params)
        }

        this.windowSize = 'min'
      }
      
    },
    onNormal(name, params){
      if (this.name === name) {
        const event = this.createWindowEvent({
          state: 'normal',
          params: params,
        })
        this.$emit('normal', event);
        if (this.normal) {
          this.normal(params)
        }

        this.windowSize = 'normal'
      }
      
    },
    onMaximize(name, params){
      if (this.name === name) {
        const event = this.createWindowEvent({
          state: 'maximize',
          params: params,
        })
        this.$emit('maximize', event);
        if (this.maximize) {
          this.maximize(params)
        }

        this.windowSize = 'max'
      }
      
    },
    onFullscreen(name, params){
      if (this.name === name) {
        const event = this.createWindowEvent({
          state: 'fullscreen',
          params: params,
        })
        this.$emit('fullscreen', event);
        if (this.fullscreen) {
          this.fullscreen(params)
        }

        if (this.parentSelector) {
          if (params.active) {
            var prect = document.querySelector(this.parentSelector).getBoundingClientRect();
            this.fullscreenRect = {
              x: 0,
              y: 0,
              w: prect.width,
              h: prect.height,
            }
          } else {
            this.fullscreenRect = null
          }
          
        } else {
          console.warn('parentSelector needed to define fullscreen rect')
        }

        this.windowSize = 'fullscreen'
        
      }
      
    },


    onDragging(evt){
      this.rect = document.querySelector(`[name="${this.name}"]`).getBoundingClientRect();
      
      this.$emit('dragging', evt);
      if (this.dragging) {
        this.dragging(evt)
      }
    },
    onDragstop(evt){
      this.$emit('dragstop', evt);
      if (this.dragstop) {
        this.dragstop(evt)
      }
    },
    onResizing(evt){
      this.rect = document.querySelector(`[name="${this.name}"]`).getBoundingClientRect();

      this.$emit('resizing', evt);
      if (this.resizing) {
        this.resizing(evt)
      }
    },
    onResizeStop(evt){
      this.$emit('resizestop', evt);
      if (this.resizestop) {
        this.resizestop(evt)
      }
    },
    onActivated(evt){
      this.active = true
      this.$emit('activated', evt);
      if (this.activated) {
        this.activated(evt)
      }
    },
    onDeactivated(evt){
      this.active = false
      this.$emit('deactivated', evt);
      if (this.deactivated) {
        this.deactivated(evt)
      }
    },
    
    close() {
      const event = this.createWindowEvent({
        state: 'closed'
      })
      this.$emit('closed', event)
    },

    // public method
    /**
     * 
     * @param {*} rect {top, bottom, left, right}
     * right 是窗口距离parent右边的距离
     * bottom 是窗口距离parent底部的距离
     */
    setRect(rect) {
      this.$refs.window.setRect(rect)
    },
    getRect() {
      return this.$refs.window.getRect()
    },

  }
}
</script>

<style lang="scss">
  .wl--window-border {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
</style>
