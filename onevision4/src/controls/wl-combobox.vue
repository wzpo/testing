<template>
  <div 
    class="wl-combobox" 
    ref="combobox" 
    :class="[theme, display, `${display}-${height}`, {active: dropdownVisible}]" 
    :style="{width: display=='default' ? width : ''}" 
    @mousedown="toggleDropdown"
  >
    <slot name="before"></slot>
    <span class="label">{{ display=='default' ? label : defaultLabel }}</span>
    <wl-icon v-if="display=='default'" name="arrow-down-bold" size="16" class="arrow" />
  </div>
</template>

<script>


export default {
  props:{
    name: {
      type: String,
      default: 'default-combobox',
    },
    display: {
      type: String,
      default: 'default', // button
    },
    defaultLabel: {
      type: String,
      default: '',
    },
    defaultSelectedIndex: {
      type: Number,
      default: -1,
    },
    datalist: {
      type: Array,
      default: () => { return [] }, // {label, value}
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: 'auto',
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    maxRow: {
      type: Number,
      default: 10,
    },

  },
  data() {
    return {
      selectedIndex: this.defaultSelectedIndex,
      label: this.defaultLabel,
      dropdownVisible: false,
    }
  },
  computed:{
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted(){

  },
  watch: {
    defaultSelectedIndex(newVal) {
      this.select(newVal, false);
    },
  },
  methods:{
    select(index, manually){
      this.selectedIndex = index
      const data = this.datalist[index]
      this.label = data.label
      this.$emit('select', {index, data, manually})
    },

    toggleDropdown(evt){
      evt.stopPropagation();
      evt.preventDefault();
      
      const itemHeight = 40
      const padding = 16

      if (this.dropdownVisible) {
        this.$popper.hide(this.name);
      } else if (this.datalist.length > 0) {
        const width = this.width
        this.$popper.show(
          {
            template: `
            <div class="wl-combobox-dropdown" :style="{width: width}" >
              <wl-scrollbar class="scrollbar" :theme="theme === 'dark' ? 'dark' : 'light'" :arrowVisible="os === 'win'" :style="{height: height}">
                <div class="scrollcont">
                  <div v-for="(itm, idx) in datalist"
                    :key="idx"
                    class='wl-combobox-dropdown-item' 
                    @mousedown="mousedown"
                    @click="click($event, idx)"
                  >
                    <span class="lb">
                      <span class="lb1">{{itm.label}}</span>
                      <span v-if="itm.sub" class="lb2">{{itm.sub}}</span>
                    </span>

                    <wl-icon
                      v-if="idx === selectedIndex" 
                      name="check-bold" 
                      size="16"
                      color="blue-40"
                      class="check"
                    />

                  </div>
                </div>
              </wl-scrollbar>
            </div>
            `,
            props: ['parentComp', 'name', 'width', 'height', 'os', 'theme', 'datalist', 'selectedIndex'],
            methods: {
              mousedown(evt) {
                evt.stopPropagation()
              },
              click(evt, idx) {
                evt.stopPropagation()
                this.parentComp.select(idx, true);
                this.$popper.hide(this.name);
              },
            }
          },
          {
            parentComp: this,
            name: this.name,
            width: width,
            height: `${itemHeight * this.maxRow + padding}px`,
            theme: this.theme,
            os: this.os,
            selectedIndex: this.selectedIndex,
            datalist: this.datalist,
          }, // component props
          {
            name: this.name,
            reference: this.$refs.combobox,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            frameless: true,
            borderRadius: '8px',
            appendToBody: true,
            theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
            options: {
              placement: this.placement, 
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            },
            affiliatedElementSelector: ['.menu-video'],
          }, // popper props
          {
            opened: () => {
              this.dropdownVisible = true
            },
            closed: () => {
              this.dropdownVisible = false
            },
          } // popper eventlistener
        );
      }
    },

  }
}
</script>


<style lang="scss">
.wl-combobox {
  display: flex;
  align-items: center;
  height: 32px;
  cursor: default;
  user-select: none;
  padding: 0 12px 0 12px;
  margin: 0;
  background: #000000;
  border: 1px solid rgba($color: #FFF, $alpha: 0.5);
  box-sizing: border-box;
  border-radius: 8px;
  pointer-events: auto;

  &.button {
    padding: 0 10px 0 10px;
    
    &-24 {
      height: 24px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .label {
      padding-right: 0;
    }
  }

  .label {
    @include flex(row, flex-start);
    flex-grow: 1;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    padding-right: 10px;
  }

  &:hover {
    background: rgba($color: #FFF, $alpha: 0.07);
  }
  &:active, &.active {
    background: rgba($color: #FFF, $alpha: 0.11);
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.4);
    border-width: 0;
    background: rgba($color: #FFF, $alpha: 0.11);

    .arrow {
      opacity: .4;
    }
  }

}

.wl-combobox-dropdown {
  background: #000000;
  border: 1px solid rgba($color: #FFF, $alpha: 0.5);
  box-sizing: border-box;
  border-radius: 8px;

  .scrollbar {
    
  }
  .scrollcont {
    padding: 8px;
  }

  &-item {
    min-height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
    border-radius: 8px;
    padding: 4px 4px 6px 12px;

    .lb {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      
      .lb1 {
        font-size: 16px;
      }
      .lb2 {
        font-size: 14px;
        opacity: .7;
        line-height: 18px;
      }
    }

    .check {
      margin: 0 8px;
      flex-shrink: 0;

      path {
        fill: $md-blue-40;
      }
    }

    &:hover {
      background-color: rgba($color: #FFFFFF, $alpha: .07);
    }
    &:active {
      background-color: rgba($color: #FFFFFF, $alpha: .11);
    }
    &:focus {
      background-color: #1170CF;
    }
  }
}

</style>
