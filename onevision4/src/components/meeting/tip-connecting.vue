<template>
  <div class="tip-connecting" :class="[theme]" v-if="show">
    <div class="wrap">
      <div class="lft">
        <div class="spinner"><md-spinner :size="48" color="green" /></div>
        <div class="ico">
          <wl-icon name="headset-bold" size="16" color="white" v-if="type === 'pc' || type === 'callme'" />
        </div>
        
      </div>
      <div class="mid" >
        <div class="line1">{{line1}}</div>
        <div class="line2" v-if="line2">{{line2}}</div>
      </div>
      <div class="rgt">
        <div class="btn">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    line1: String,
    line2: String,
    type: String,
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted() {},
  watch: {},
  methods: {
    
    
  }
};
</script>

<style lang="scss">
.tip-connecting {
  position: absolute;
  width: 100%;
  height: 80px;
  top: calc((100% - 80px)/2);
  display: flex;
  justify-content: center;
  flex-direction: row;
  pointer-events: none;
  user-select: none;

  .wrap {
    position: relative;
    height: 80px;
    display: flex;
    flex-direction: row;
    pointer-events: auto;
    justify-content: center;
    align-items: center;
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.16);
    border-radius: 40px;
    color: $text-color-primary-light-ui;
  }

  .lft {
    position: relative;
    width: 48px;
    height: 48px;
    margin: 16px;
  }
  .lft .spinner{
    position: absolute;
    width: 48px;
    height: 48px;
    top: -2px;
    left: -2px;
  }
  .lft .ico{
    position: absolute;
    top: 4px;
    left: 4px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: $md-green-50;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .mid {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  
  }
  .mid .line1 {
    font-size: 16px;
  }
  .mid .line2 {
    font-size: 12px;
    margin-top: -2px;
  }

  .rgt .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: $md-red-60;
    margin: 10px;
    padding: 10px;
  }

  /* ------------------ drak ------------------ */

  &.dark .wrap {
    background: $md-gray-95;
    color: $text-color-primary-dark-ui;
  }
}



</style>
