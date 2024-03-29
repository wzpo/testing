<template>
<div
  class="vue-notification-group"
  :style="styles"
>
  <component
    :is="'CssGroup'"
    :name="animationName"
    @enter="enter"
    @leave="leave"
    @after-leave="clean"
  >
    <div
      v-for="item in active"
      class="vue-notification-wrapper"
      :style="notifyWrapperStyle(item)"
      :key="item.id"
      :data-id="item.id"
      @mouseenter="pauseTimeout"
      @mouseleave="resumeTimeout"
    >
      <slot
        name="body"
        :class="[classes]"
        :item="item"
        :close="() => destroy(item)"
      >
        <!-- Default slot template -->
        <div
          :class="notifyClass(item)"
          @click="destroyIfNecessary(item)"
        >
          <div
            v-if="item.title"
            class="notification-title"
            v-html="item.title"
          >
          </div>
          <div
            class="notification-content"
            v-html="item.text"
          >
          </div>
        </div>
      </slot>
    </div>
  </component>
</div>
</template>
<script>
import plugin                         from './index'
import { events }                     from './events'
import { Id, listToDirection, Timer } from './util'
import defaults                       from './defaults'
import CssGroup                       from './CssGroup.vue'
import parseNumericValue              from './parser'

const STATE = {
  IDLE: 0,
  DESTROYED: 2
}

const Component = {
  name: 'Notifications',
  components: {
    CssGroup
  },
  props: {
    group: {
      type: String,
      default: ''
    },

    width: {
      type: [Number, String],
      default: 300
    },

    margin: {
      type: [Number, String],
      default: 0
    },

    reverse: {
      type: Boolean,
      default: false
    },

    fixed: {
      type: Boolean,
      default: true
    },

    position: {
      type: [String, Array],
      default: () => {
        return defaults.position
      }
    },

    classes: {
      type: String,
      default: 'vue-notification'
    },

    animation: {
      type: Object,
      default () {
        return defaults.velocityAnimation
      }
    },

    animationName: {
      type: String,
      default: defaults.cssAnimation
    },

    speed: {
      type: Number,
      default: 300
    },

    duration: {
      type: Number,
      default: 3000
    },

    delay: {
      type: Number,
      default: 0
    },

    max: {
      type: Number,
      default: Infinity
    },

    ignoreDuplicates: {
      type: Boolean,
      default: false
    },

    closeOnClick: {
      type: Boolean,
      default: true
    },

    pauseOnHover: {
      type: Boolean,
      default: false
    }

  },
  data () {
    return {
      list: [],
      velocity: plugin.params.velocity,
      timerControl: ""
    }
  },
  mounted () {
    events.$on('add', this.addItem);
    events.$on('close', this.closeItem);
  },
  computed: {
    actualWidth () {
      return parseNumericValue(this.width)
    },

    styles () {
      const { x, y } = listToDirection(this.position)
      const width = this.actualWidth.value
      const suffix = this.actualWidth.type

      let styles = {
        position: this.fixed ? 'fixed' : 'absolute',
        width: width + suffix,
        [y]: '0px',
        marginTop: y === 'top' ? `${this.margin}px` : '',
        marginBottom: y === 'bottom' ? `${this.margin}px` : '',
      }

      if (x === 'center') {
        styles['left'] = `calc(50% - ${width/2}${suffix})`
      } else {
        styles[x] = '0px'
      }

      return styles
    },

    active () {
      return this.list.filter(v => v.state !== STATE.DESTROYED)
    },

    botToTop () {
      // eslint-disable-next-line no-prototype-builtins
      return this.styles.hasOwnProperty('bottom')
    },
  },
  methods: {
    destroyIfNecessary (item) {
      this.$emit('click', item)
      if (this.closeOnClick) {
        this.destroy(item)
      }
    },
    pauseTimeout () {
      if (this.pauseOnHover) {
        this.timerControl.pause();
      }
    },
    resumeTimeout () {
      if (this.pauseOnHover) {
        this.timerControl.resume();
      }
    },
    addItem (event) {
      event.group = event.group || ''

      if (this.group !== event.group) {
        return
      }

      if (event.clean || event.clear) {
        this.destroyAll()
        return
      }

      const duration = typeof event.duration === 'number'
        ? event.duration
        : this.duration

      const speed = typeof event.speed === 'number'
        ? event.speed
        : this.speed

      const ignoreDuplicates = typeof event.ignoreDuplicates === 'boolean'
        ? event.ignoreDuplicates
        : this.ignoreDuplicates

      let { title, text, type, data, id } = event

      const item = {
        id: id || Id(),
        title,
        text,
        type,
        state: STATE.IDLE,
        speed,
        length: duration + 2 * speed,
        data
      }

      if (duration >= 0) {
        this.timerControl = new Timer(()=> this.destroy(item), item.length, item);
      }

      let direction = this.reverse
        ? !this.botToTop
        : this.botToTop

      let indexToDestroy = -1

      const isDuplicate = this.active.some(item => {
        return item.title === event.title && item.text === event.text
      });

      const canAdd = ignoreDuplicates ? !isDuplicate : true;

      if (!canAdd) return;

      if (direction) {
        this.list.push(item)

        if (this.active.length > this.max) {
          indexToDestroy = 0
        }
      } else {
        this.list.unshift(item)

        if (this.active.length > this.max) {
          indexToDestroy = this.active.length - 1
        }
      }

      if (indexToDestroy !== -1) {
        this.destroy(this.active[indexToDestroy])
      }
    },

    closeItem (id) {
      this.destroyById(id)
    },

    notifyClass (item) {
      return [
        'vue-notification-template',
        this.classes,
        item.type
      ]
    },

    notifyWrapperStyle (item) {
      return this.isVA
        ? null
        : { transition: `all ${item.speed}ms` }
    },

    destroy (item) {
      clearTimeout(item.timer)
      item.state = STATE.DESTROYED

      if (!this.isVA) {
        this.clean()
      }

      this.$emit('destroy', item)
    },

    destroyById (id) {
      const item = this.list.find(v => v.id === id)

      if (item) {
        this.destroy(item)
      }
    },

    destroyAll () {
      this.active.forEach(this.destroy)
    },

    getAnimation (index, el) {
      const animation = this.animation[index]

      return typeof animation === 'function'
        ? animation.call(this, el)
        : animation
    },

    enter ({ el, complete }) {
      const animation = this.getAnimation('enter', el)

      this.velocity(el, animation, {
        duration: this.speed,
        complete
      })
    },

    leave ({ el, complete }) {
      let animation = this.getAnimation('leave', el)

      this.velocity(el, animation, {
        duration: this.speed,
        complete
      })
    },

    clean () {
      this.list = this.list.filter(v => v.state !== STATE.DESTROYED)
    }
  }
}

export default Component
</script>
<style>
.vue-notification-group {
  display: block;
  z-index: 5000;
}

.vue-notification-wrapper {
  display: block;
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}

.notification-title {
  font-weight: 600;
}

.vue-notification-template {
  display: block;	
  box-sizing: border-box;	
  background: white;	
  text-align: left;	
}

.vue-notification {
  display: block;
  box-sizing: border-box;  
  text-align: left;
  font-size: 12px;
  padding: 10px;
  margin: 0 5px 5px;

  color: white;
  background: #000;
}

.vn-fade-enter-active, .vn-fade-leave-active, .vn-fade-move  {
  transition: all .5s;
}

.vn-fade-enter, .vn-fade-leave-to {
  opacity: 0;
}

</style>
