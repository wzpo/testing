<template>
  <transition :name="transition" :css="transitionEnabled" @after-leave="close" >
    <div
      v-show="popperVisible"
      ref="popper"
      :name="name"
      :class="['wl--popper', rootClass, theme, {'popper-with-arrow': arrowVisible}]"
    >
      <div 
        class="wl--popper-wrap" 
        :class="{
          'wl--popper-window': !frameless,
          'wl--popper-rounded': roundedCorner,
          'wl--popper-shadow': shadow,
        }" 
        :style="{
          borderRadius: roundedCorner ? borderRadius : '',
          backgroundColor: backgroundColor ? backgroundColor : '',
        }" 
      >
        <slot>{{ content }}</slot>
      </div>
    </div>
  </transition>
</template>

<script>
  import { createPopper } from '@popperjs/core';

  function on(element, event, handler) {
    if (element && event && handler) {
      document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
    }
  }

  function off(element, event, handler) {
    if (element && event) {
      document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler)
    }
  }

  export default {
    name: 'WlPopper',
    props: {
      name: {
        required: true,
        type: String
      },
      reference: { // trigger element eg: this.$refs.button
        required: true,
      },
      closeTrigger: {
        type: [String, Array],
        default: 'mouseout',
      },
      affiliatedElementSelector: {
        type: [String, Array],
      },
      delayMouseout: {
        type: Number,
        default: 100,
      },
      content: String,
      boundariesSelector: String,
      appendToBody: {
        type: Boolean,
        default: false
      },
      arrowVisible: {
        type: Boolean,
        default: true
      },
      options: {
        type: Object,
        default() {
          return {};
        }
      },
      rootClass: {
        type: String,
        default: ''
      },
      frameless: {
        type: Boolean,
        default: false
      },
      shadow: {
        type: Boolean,
        default: true
      },
      roundedCorner: {
        type: Boolean,
        default: false
      },
      borderRadius: {
        type: String,
        default: '4px'
      },
      backgroundColor: {
        type: String
      },
      theme: {
        type: String,
        default: ''
      },
      transition: {
        type: String,
        default: 'wl-popper-transition-',
      },
      transitionEnabled: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        popperVisible: false,
        referenceElm: null,
        popperjs: null,
        currentPlacement: '',
        popperOptions: {
          placement: 'bottom',
          modifiers: [
            {
              name: 'arrow',
              options: {
                  element: '[data-popper-arrow]',
              },
            },
          ],
          computeStyle: {
            gpuAcceleration: false
          }
        }
      };
    },

    watch: {
      options(value) {
        if (value) {
          this.popperOptions = Object.assign(this.popperOptions, this.options);
        }
      },
    },

    created() {
      this.appendedArrow = false;
      this.appendedToBody = false;
      this.popperOptions = Object.assign(this.popperOptions, this.options);
    },

    beforeMount() {
      this.$popper.subscription.$on('hide', this.hide);
      this.$popper.subscription.$on('update', this.updatePopper)
    },

    mounted() {
      this.referenceElm = this.reference;
      this.popper = this.$refs.popper;

      if (this.closeTrigger === 'mousedown' || this.closeTrigger.indexOf('mousedown') > -1 ) {
        on(document, 'mousedown', this.handleDocumentMousedown);
      }
      if (this.closeTrigger === 'mouseout' || this.closeTrigger.indexOf('mouseout') > -1 ) {
        on(this.referenceElm, 'mouseover', this.onMouseover);
        on(this.popper, 'mouseover', this.onMouseover);
        on(this.referenceElm, 'mouseout', this.onMouseout);
        on(this.popper, 'mouseout', this.onMouseout);
      }
      if (this.closeTrigger === 'blur' || this.closeTrigger.indexOf('blur') > -1 ) {
        on(this.referenceElm, 'blur', this.onMouseout);
        on(this.popper, 'blur', this.onMouseout);
      }

      this.show();
    },

    beforeDestroy() {
      this.$popper.subscription.$off('hide', this.hide)
      this.$popper.subscription.$off('update', this.updatePopper)
    },

    destroyed() {
      this.close();
    },


    methods: {
      show() {
        this.popperVisible = true
        this.$emit('opened', this);
        this.updatePopper();
      },

      hide(name) {
        if (this.name === name) {
          this.popperVisible = false
          if (!this.transitionEnabled) {
            this.close();
          }
        }
      },

      close() {
        if (this.popperjs) {
          this.popperjs.destroy();
          this.popperjs = null;
        }

        /*
        if (this.appendedToBody) {
          this.appendedToBody = false;
          if (this.popper.parentElement && document.body.contains(this.popper.parentElement)) {
            document.body.removeChild(this.popper.parentElement);
            this.popper.parentElement.destroy();
          }
        }
        */
       
        off(this.referenceElm, 'mouseup', this.close);
        off(this.referenceElm, 'blur', this.close);
        off(this.referenceElm, 'mouseover', this.onMouseover);
        off(this.referenceElm, 'mouseout', this.onMouseout);
        off(document, 'mousedown', this.handleDocumentMousedown);
        off(this.popper, 'mouseover', this.onMouseover);
        off(this.popper, 'mouseout', this.onMouseout);
        off(this.popper, 'blur', this.onMouseout);

        this.$emit('closed', this);
      },

      createPopper() {
        this.$nextTick(() => {
          if (this.arrowVisible) {
            this.appendArrow(this.popper);
          }

          if (this.appendToBody && !this.appendedToBody) {
            this.appendedToBody = true;
            document.body.appendChild(this.popper.parentElement);
          }

          if (this.popperjs && this.popperjs.destroy) {
            this.popperjs.destroy();
          }

          if (this.boundariesSelector) {
            const boundariesElement = document.querySelector(this.boundariesSelector);

            if (boundariesElement) {
              if (this.popperOptions.modifiers === undefined) {
                this.popperOptions.modifiers = [];
              }
              this.popperOptions.modifiers.push(
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: boundariesElement,
                  },
                }
              )
            }
          }

          this.popperOptions.onFirstUpdate = () => {
            this.$nextTick(this.updatePopper);
          };

          this.popperjs = createPopper(this.referenceElm, this.popper, this.popperOptions);
          this.$emit('created', this);
        });
      },

      appendArrow(element) {
        if (this.appendedArrow) {
          return;
        }

        this.appendedArrow = true;

        const arrow = document.createElement('div');
        arrow.setAttribute('data-popper-arrow', '');
        arrow.className = 'popper-arrow';
        arrow.innerHTML = `
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
        </svg>`
        element.appendChild(arrow);
      },

      updatePopper() {
        this.popperjs ? this.popperjs.update() : this.createPopper();
      },

      onMouseover() {
        clearTimeout(this._timer);
      },
      onMouseout() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.popperVisible = false
          if (!this.transitionEnabled) {
            this.close();
          }
        }, this.delayMouseout);
      },

      handleDocumentMousedown(e) {
        if (!this.$el || !this.referenceElm ||
          this.elementContains(this.$el, e.target) ||
          this.elementContains(this.referenceElm, e.target) ||
          !this.popper || this.elementContains(this.popper, e.target)
        ) {
          return;
        }

        if (this.affiliatedElementSelector) {
          if (typeof this.affiliatedElementSelector  === 'string') {
            const el = document.querySelector(this.affiliatedElementSelector);
            if (el && this.elementContains(el, e.target)) {
              this.$emit('affiliatedMousedown', this);
              return;
            }
          } else {
            for (let i=0; i < this.affiliatedElementSelector.length; i++) {
              const nm = this.affiliatedElementSelector[i];
              const el = document.querySelector(nm);
              if (el && this.elementContains(el, e.target)) {
                this.$emit('affiliatedMousedown', this);
                return;
              }
            }
          }
          
        }
        this.popperVisible = false
        if (!this.transitionEnabled) {
          this.close();
        }
        
      },

      elementContains(elm, otherElm) {
        if (typeof elm.contains === 'function') {
          return elm.contains(otherElm);
        }

        return false;
      },

    },
  }
</script>

<style lang="scss">
.wl--popper {
  width: auto;
  display: inline-block;
  position: absolute;
  z-index: 200000;
  color: $text-color-primary-light-ui;
  
  .wl--popper-wrap {
    
    &.wl--popper-window {
      background-color: white;
    }

    &.wl--popper-rounded {
      border-radius: 4px;
      overflow: hidden;
      transform: rotate(0deg);
    }

    &.wl--popper-shadow {
      -moz-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 4px 12px rgba(0, 0, 0, 0.15);
      -webkit-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 4px 12px rgba(0, 0, 0, 0.15);
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &.popper-with-arrow {

    .popper-arrow {
      position: absolute;
      display: flex;
      width: 26px;
      height: 26px;
      pointer-events: none;
      z-index: 1;

      .bg {
        fill: #FFFFFF;
      }
      .border {
        fill: #FFFFFF;
      }
    }
    
    &[data-popper-placement^="top"] {
      padding-bottom: 14px;

      .popper-arrow {
        bottom: -10px;
      }
    }
    &[data-popper-placement^="bottom"] {
      padding-top: 14px;

      .popper-arrow {
        top: -10px;
        svg {
          transform: rotate(180deg);
        }
      }
    }
    &[data-popper-placement^="right"] {
      padding-left: 14px;

      .popper-arrow {
        left: -10px;
        svg {
          transform: rotate(90deg);
        }
      }
    }
    &[data-popper-placement^="left"] {
      padding-right: 14px;

      .popper-arrow {
        right: -10px;
        svg {
          transform: rotate(270deg);
        }
      }
    }
  }

  
  /** -----------  */


  &.light {
    .wl--popper-wrap {
      color: rgba($color: #000000, $alpha: .95);
      /*box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.14);*/
    }

    &.webex {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
      }
      .popper-arrow {
        .bg {
          fill: #FFFFFF;
        }
        .border {
          fill: rgba(0, 0, 0, 0.2);
        }
      }
    }

    &.blue {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #EBEFFC;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
      }
      .popper-arrow {
        .bg {
          fill: #EBEFFC;
        }
        .border {
          fill: rgba(0, 0, 0, 0.2);
        }
      }
    }

    &.green {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #E6F2F1;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
      }
      .popper-arrow {
        .bg {
          fill: #E6F2F1;
        }
        .border {
          fill: rgba(0, 0, 0, 0.2);
        }
      }
    }

    &.brown {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #F5EFE4;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
      }
      .popper-arrow {
        .bg {
          fill: #F5EFE4;
        }
        .border {
          fill: rgba(0, 0, 0, 0.2);
        }
      }
    }

    &.pink {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #FCEBF5;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
      }
      .popper-arrow {
        .bg {
          fill: #FCEBF5;
        }
        .border {
          fill: rgba(0, 0, 0, 0.2);
        }
      }
    }

    &.purple {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #F4EBFF;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        border: 1px solid rgba(0, 0, 0, 0.2);
      }
      .popper-arrow {
        .bg {
          fill: #F4EBFF;
        }
        .border {
          fill: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  &.dark,
  &.hybrid {
    .wl--popper-wrap {
      color: rgba($color: #FFFFFF, $alpha: .95);
      /*box-shadow: 0 0 0 1px rgba(38, 38, 38, 1), 0px 8px 16px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.14);*/
    }

    &.webex {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #000000;
          border: 1px solid rgba(87, 87, 87, 1.0);
        }
      }
      .popper-arrow {
        .bg {
          fill: #000000;
        }
        .border {
          fill: rgba(87, 87, 87, 1.0);
        }
      }
    }

    &.blue {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #13182B;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      }
      .popper-arrow {
        .bg {
          fill: #13182B;
        }
        .border {
          fill: rgba(255, 255, 255, 0.3);
        }
      }
    }

    &.green {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #001C18;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      }
      .popper-arrow {
        .bg {
          fill: #001C18;
        }
        .border {
          fill: rgba(255, 255, 255, 0.3);
        }
      }
    }

    &.brown {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #1F1402;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      }
      .popper-arrow {
        .bg {
          fill: #1F1402;
        }
        .border {
          fill: rgba(255, 255, 255, 0.3);
        }
      }
    }

    &.pink {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #310E22;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      }
      .popper-arrow {
        .bg {
          fill: #310E22;
        }
        .border {
          fill: rgba(255, 255, 255, 0.3);
        }
      }
    }

    &.purple {
      .wl--popper-wrap {
        &.wl--popper-window {
          background-color: #231237;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      }
      .popper-arrow {
        .bg {
          fill: #231237;
        }
        .border {
          fill: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  /* ------------------ blue theme ------------------ */
/*
  &.blue {
    color: white;

    .wl--popper-wrap {
      &.wl--popper-window {
        background-color: #08599C;
      }
    }

    &[data-popper-placement^="top"] .popper-arrow {
      background: url(../assets/arrow_down_blue.svg) no-repeat top center;
    }
    &[data-popper-placement^="bottom"] .popper-arrow {
      background: url(../assets/arrow_up_blue.svg) no-repeat bottom center;
    }
    &[data-popper-placement^="right"] .popper-arrow  {
      background: url(../assets/arrow_left_blue.svg) no-repeat center right;
    }
    &[data-popper-placement^="left"] .popper-arrow {
      background: url(../assets/arrow_right_blue.svg) no-repeat center left;
    }
  }
*/
}

.wl-popper-transition--enter-active {
  transition: opacity 100ms ease-in-out;
}
.wl-popper-transition--leave-active {
  transition: opacity 300ms ease-in-out;
}

.wl-popper-transition--enter,
.wl-popper-transition--leave-to {
  opacity: 0;
}

</style>
