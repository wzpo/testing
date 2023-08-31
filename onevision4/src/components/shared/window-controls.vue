<template>
    <div 
      class='window-controls' 
      :class="[theme, {deactive: !active}]"
    >
        
        <div class="buttons windows" v-if="os === 'win'" :class="{dark: dark || theme !== 'light'}" >
          <div v-if="!buttons || buttons.indexOf('minimize') > -1" class="winttbtn minimize" @click="minimize">
            <svg width="10" height="1" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect class="winico" width="10" height="1"/>
            </svg>
          </div>

          <div v-if="!buttons || buttons.indexOf('maximize') > -1" class="winttbtn maximize" @click="toggleSize">
            <svg v-if="windowsSize === 'max'" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="winico" d="M8 8H10V0H2V2H0V10H8V8ZM9 7H8V2H3V1H9V7ZM7 3V9H1V3H7Z"/>
            </svg>
            <svg v-if="windowsSize === 'normal'" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="winico" fill-rule="evenodd" clip-rule="evenodd" d="M10 0H0V10H10V0ZM9 1H1V9H9V1Z"/>
            </svg>
          </div>

          <div v-if="!buttons || buttons.indexOf('close') > -1" class="winttbtn x" @click="close">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="winico" fill-rule="evenodd" clip-rule="evenodd" d="M5.207 4.5L8.853 0.853C9.049 0.658 9.049 0.342 8.853 0.147C8.658 -0.049 8.342 -0.049 8.147 0.147L4.5 3.793L0.853 0.147C0.658 -0.049 0.342 -0.049 0.147 0.147C-0.049 0.342 -0.049 0.658 0.147 0.853L3.793 4.5L0.147 8.146C-0.049 8.342 -0.049 8.658 0.147 8.853C0.244 8.951 0.372 9 0.5 9C0.628 9 0.756 8.951 0.853 8.853L4.5 5.207L8.147 8.853C8.244 8.951 8.372 9 8.5 9C8.628 9 8.756 8.951 8.853 8.853C9.049 8.658 9.049 8.342 8.853 8.146L5.207 4.5Z" fill="#444444"/>
            </svg>
          </div>
        </div>
        
        <div class="buttons mac" v-if="os === 'mac'">
          <svg v-if="!buttons || buttons.indexOf('close') > -1" @click="close" class="maclight" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z" fill="#FF5E51"/>
            <path d="M11.75 6C11.75 9.17564 9.17564 11.75 6 11.75C2.82436 11.75 0.25 9.17564 0.25 6C0.25 2.82436 2.82436 0.25 6 0.25C9.17564 0.25 11.75 2.82436 11.75 6Z" stroke="black" stroke-opacity="0.1" stroke-width="0.5"/>
          </svg>

          <svg v-if="!buttons || buttons.indexOf('minimize') > -1" @click="minimize" class="maclight" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z" fill="#FFBF06"/>
            <path d="M11.75 6C11.75 9.17564 9.17564 11.75 6 11.75C2.82436 11.75 0.25 9.17564 0.25 6C0.25 2.82436 2.82436 0.25 6 0.25C9.17564 0.25 11.75 2.82436 11.75 6Z" stroke="black" stroke-opacity="0.1" stroke-width="0.5"/>
          </svg>

          <svg v-if="!buttons || buttons.indexOf('maximize') > -1" @click="toggleSize" class="maclight" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z" fill="#17CE36"/>
            <path d="M11.75 6C11.75 9.17564 9.17564 11.75 6 11.75C2.82436 11.75 0.25 9.17564 0.25 6C0.25 2.82436 2.82436 0.25 6 0.25C9.17564 0.25 11.75 2.82436 11.75 6Z" stroke="black" stroke-opacity="0.1" stroke-width="0.5"/>
          </svg>
        </div>

    </div>
</template>

<script>

export default {
    props:{
      active: {
        default: true,
      },
      dark: {
        default: true,
      },
      buttons: {
        default: null,
      },
      windowsSize: {
        default: 'normal',
      },
    },
    data() {
        return {

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

    },
    methods:{
      close() {
        this.$emit('close');
      },
      minimize() {
        this.$emit('minimize');
      },
      toggleSize() {
        this.$emit('toggleSize');
      },
    }
}
</script>


<style lang="scss">
.window-controls {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;

  .buttons {
    display: flex;
    align-items: center;
    pointer-events: auto;
  }

  .windows {
    .winico {
      fill: #444;
    }
  }

  .windows.dark {
    .winico {
      fill: #FFF;
    }
  }

  .winttbtn {
    width: 40px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    pointer-events: auto;
  }

  .maclight {
    margin-right: 8px;
    cursor: default;
  }

  &.deactive {
    .windows {
      .winico {
        opacity: .3;
      }
    }

    .maclight {
      filter: grayscale(100%);
      opacity: .3;
    }
  }

  /* theme ----- dark/hybrid */

}

</style>
