<template>
  <div
  class="context-menu"
  :class="[theme]"
  :style="{
    minWidth: minWidth,
  }"
  >
      <div class='grp' >

        <div 
          v-for="(itm, idx) in items"
          :key="idx"
          :class="{
            itm: itm.label!=='divider',
            disabled: itm.disabled,
            active: subvisible === itm.ref,
          }" 
          :ref="itm.ref"
          @click="select($event, itm)" 
        >
          <span v-if="itm.label!=='divider'" class="lb" >
            {{itm.label}}
          </span>

          <wl-icon
            v-if="itm.sub"
            name="arrow-right-bold" 
            :color=" 'white-95' "
            size="16"
          />
          <wl-icon
            v-if="itm.checked"
            name="check-bold" 
            :color=" 'blue-40' "
            size="16"
          />

          <div v-if="itm.label==='divider'" class="divider"></div>
        </div>

      </div>

  </div>
</template>

<script>

import contextMenu from './contextmenu.vue';

export default {
  props: {
    items: Array,
    onSelect: Function,
    minWidth: {
      type: String,
      default: '240px',
    }
  },
  data() {
    return {
      subvisible: false,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    
  },
  mounted() {},
  watch: {

  },
  methods: {
    select(event, itm) {
      if (typeof itm.sub === 'object') {
        this.$popper.hide(`contextmenu-level${itm.level}`);
        this.$popper.show(
          contextMenu,
          {
            items: itm.sub,
            onSelect: (itm) => { 
              if (this.onSelect) {
                this.onSelect(itm);
              }
            },
          }, // component props
          {
            name: `contextmenu-level${itm.level}`,
            reference: event.target,
            affiliatedElementSelector: ['[name="contextmenu"]', '[name="contextmenu-level1"]', '[name="contextmenu-level2"]'],
            transitionEnabled: false,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {
              placement: 'right-start',
              modifiers: [
                {
                  name: 'flip',
                  enabled: true,
                },
                {
                  name: 'offset',
                  options: {
                    offset: [-4, 0],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.subvisible = itm.ref },
            closed: () => { this.subvisible = false },
          } // popper eventlistener
        );
        return
      }
      
      if (itm.callback) {
        itm.callback(itm);
      } else if (this.onSelect) {
        this.onSelect(itm);
      }
      this.close();
    },

    close() {
      this.$emit("close");
      this.$popper.hide('contextmenu');
      this.$popper.hide('contextmenu-level1');
      this.$popper.hide('contextmenu-level2');
    },
  }
};
</script>

<style lang="scss">
.context-menu {
  pointer-events: auto;

  padding: 4px;

  .grp .tt{
    height: 32px;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
  
    font-size: 12px;
    margin-bottom: 3px;
    padding: 0 15px;

    .ico {
      margin-right: 5px;
    }

    .lb{
      opacity: .7;
    }
  }

  .itm{
    height: 32px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 8px 0 12px;
    border-radius: 8px;

    &.disabled {
      opacity: .35;
      pointer-events: none;
    }

    .bold{
      font-weight: 600;
    }
    .indent{
      margin-left: 12px;
    }
    
    .lb{
      flex-grow: 1;
      font-size: 14px;
      pointer-events: none;
    }
    .ico{
      margin-right: -12px;
    }

    &:hover{
      background-color: rgba($color: #000000, $alpha: .07);
    }
    &:active, &.active{
      background-color: rgba($color: #000000, $alpha: .11);
    }

  }
  
  .divider{
    margin: 4px 8px;
    border-bottom: 1px solid #EEE;
  }

  .blue path{
    fill: $md-blue-60;
  }

  /* ------------------ drak ------------------ */

  &.hybrid {
    color: $text-color-primary-light-ui;
  }

  &.dark {
    color: $text-color-primary-dark-ui;

    .tt {
      color: $text-color-disabled-light-ui;
    }
    .divider{
      border-bottom: 1px solid $md-gray-80;
    }
    .itm {
      &:hover{
        background-color: rgba($color: #FFFFFF, $alpha: .07);
      }
      &:active, &.active{
        background-color: rgba($color: #FFFFFF, $alpha: .11);
      }
    }

    .blue path{
      fill: $md-blue-40;
    }
  }

}

</style>
