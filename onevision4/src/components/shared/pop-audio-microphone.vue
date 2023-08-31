<template>
  <div 
    class="audio-microphone-dropdown" 
    :style="{width: width}"
    @mousedown="click"
  >
    <div v-if="headerVisible" class="header" @click="close" >
      <span class="ico"><wl-icon name="microphone-bold" size="12" /></span>
      <span class="lb">Microphone</span>
      <wl-icon name="arrow-up-filled" size="8" />
    </div>

    <div 
      v-for="(itm, idx) in $store.state.microphones"
      :key="idx"
      class="item" 
      :class="{active: selectedMicrophone === itm}" 
      @click="selectMicrophone(itm)" 
    >
      <span v-if="iconVisible" class="ico"></span>
      <span class="lb">{{itm}}</span>
      <wl-icon v-if="selectedMicrophone === itm" name="check-bold" size="12" :color="theme === 'dark' ? 'blue-40':'blue-60'" />
    </div>
  </div>
</template>

<script>

export default {
  props: ['width', 'headerVisible', 'iconVisible', ],
  data() {
    return {
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    selectedMicrophone(){
      return this.$store.state.selectedMicrophone;
    },
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    click(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    selectMicrophone(name) {
      this.$store.commit("selectedMicrophone", name);
      this.close();
    },

    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">
.audio-microphone-dropdown {
  width: 296px;
  background-color: $background-primary-lightUi;

  .header {
    display: flex;
    align-items: center;
    height: 32px;
    cursor: default;
    user-select: none;
    padding: 0 15px 0 8px;

    .ico {
      @include flex;
      width: 32px;
      height: 32px;

      svg path {
        fill: black;
      }
    }

    .lb {
      flex-grow: 1;
      opacity: .7;
      font-size: 12px;
    }
  }

  .item {
    display: flex;
    align-items: center;
    height: 32px;
    cursor: default;
    user-select: none;
    padding: 0 12px 0 8px;

    .ico {
      @include flex;
      width: 32px;
      height: 32px;

      svg path {
        fill: black;
      }
    }

    .lb {
      flex-grow: 1;
      font-size: 14px;
    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: .1);
    }
    &:active {
      background-color: rgba($color: #000000, $alpha: .2);
    }
    &.active {
      color: $md-blue-60;
      .ico {
        svg path {
          fill: $md-blue-60;
        }
      }
    }
  }
}

.dark {
  .audio-microphone-dropdown {
    background-color: $background-primary-darkUi;

    .header {
      .ico {
        svg path {
          fill: white;
        }
      }
    }

    .item {
      .ico {
        svg path {
          fill: white;
        }
      }

      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .1);
      }
      &:active {
        background-color: rgba($color: #FFFFFF, $alpha: .2);
      }
      &.active {
        color: $md-blue-40;
        .ico {
          svg path {
            fill: $md-blue-40;
          }
        }
      }
    }
  }
}

</style>
