<template>
    <div class="wl-accordion" :class="[theme]">
        <div class='header' 
          :class="[headerClass, (!collapsed ? headerExpandedClass : ''), {botborder: showBottomBorder}]" 
          @click.stop='toggleCollapse'
        >
          <wl-icon
            :name="arrowCollapsed" class="iconbefore" v-if="iconLocation === 'before' && collapsed"
            size="12"
          />
          <wl-icon
            :name="arrowExpanded" class="iconbefore" v-if="iconLocation === 'before' && !collapsed"
            size="12"
          />
          
          <slot name="header"></slot>
          <span v-if="iconLocation === 'after'" class="spacer"></span>
          <wl-icon
            v-if="iconLocation === 'after'"
            name="arrow-down-filled" 
            size="10"
            :class="{r180: !collapsed}"
          />
        </div>
        <slot v-if="!collapsed"></slot>
    </div>
</template>

<script>


export default {
  props:{
    defaultCollapsed: {
      default: false,
    },
    showBottomBorder: {
      default: true,
    },
    iconLocation: {
      default: 'after',
    },
    headerClass: {
      default: '',
    },
    headerExpandedClass: {
      default: '',
    },
    arrowCollapsed: {
      default: 'arrow-right-filled',
    },
    arrowExpanded: {
      default: 'arrow-down-filled',
    },
  },
  data() {
    return {
        collapsed: this.defaultCollapsed,
    }
  },
  computed:{
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted(){

  },
  watch: {
    collapsed(val) {
      this.$emit('collapse', val)
    },
  },
  methods:{
    toggleCollapse(){
      this.collapsed = !this.collapsed;
      this.$emit('collapse', {collapsed: this.collapsed});
    },
    collapse(){
      this.collapsed = true;
      this.$emit('collapse', {collapsed: this.collapsed});
    },
    expand(){
      this.collapsed = false;
      this.$emit('collapse', {collapsed: this.collapsed});
    },
  }
}
</script>


<style scoped>
.header {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
}
.spacer {
  flex-grow: 1;
}
.botborder {
  border-bottom: 1px solid #F2F4F5;
}
.iconbefore {
  margin-right: 5px;
}
.r180 {
  transform: rotate(180deg);
  transform-origin: 50%;
}

</style>
