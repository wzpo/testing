<template>
    <div class='right-panel-header' :class="[theme]">
      <div v-if="backVisible" class='back' @click.stop='back'>
        <wl-icon name="arrow-left-filled" size="16" />
        Back
      </div>
        <div class='header-title' :style="titleStyle">{{ title }}</div>
        <slot name="icons"></slot>
        <div v-if="popoutVisible" class='popout' @click.stop='popout' >
          <wl-icon :name="!floating ? 'pop-out-bold' : 'pop-in-bold'" size="16" />
        </div>
        <div v-if="moreVisible" class='more' >
          <wl-icon :name="'more-bold'" size="16" />
        </div>
        <div class='close' @click.stop='close' >
          <wl-icon name="cancel-bold" size="16" />
        </div>
    </div>
</template>

<script>


export default {
  props:[
    'title',
    'titleStyle',
    'type',
    'floating',
    'backVisible',
    'popoutVisible',
    'moreVisible',
  ],
  data() {
    return {
    }
  },
  computed:{
    theme() {
      return this.$store.state.theme;
    },
    fullscreen(){
      return this.$store.state.fullscreen;
    },
    selfSharing(){
      return this.$store.state.selfSharing;
    },
  },
  mounted(){

  },
  watch: {

  },
  methods:{
    close(){
      this.$emit('close')
    },
    popout(){
      this.$emit('popout')
    },
    collapse(){
      this.$emit('collapse')
    },
    back(){
      this.$emit('back')
    },
  }
}
</script>


<style lang="scss">
.right-panel-header {
  position: relative;
  width: 100%;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 6px;
  user-select: none;
  pointer-events: auto;

  .back  {
    height: 26px;
    pointer-events: auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    font-weight: 600;
    margin-left: 4px;
    font-size: 12px;

    .ico {
      margin-right: 4px;
    }
  }


  .cls {
    width: 26px;
    height: 26px;
    pointer-events: auto;
    cursor: default;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .header-title {
    width: 100%;
    height: 100%;
    line-height: 48px;
    font-size: 15px;
    flex-grow: 1;
    flex-shrink: 1;
    font-weight: 600;
    margin-left: 12px;
  }
  .close,
  .popout,
  .more {
    display: flex;
    width: 28px;
    height: 100%;
    pointer-events: auto;
    cursor: default;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
  }
  .close {
    margin-right: 5px;
  }


  /* theme ----- dark/hybrid */
  &.hybrid{
    color: $text-color-primary-light-ui;
  }

}

</style>
