<template>
    <div
      id="pop_breakout"
      :class="[theme]"
      :style="{
        background: `${themeColorList[theme][themeColor]['bg']}`,
      }"
    >
      <div class="wrap">

        <topbar-simple height="48px" title="Breakoust session" :buttons="['close']" :titleStyle="{fontSize: '16px', fontWeight: 'bold', marginLeft: '6px',}" @close="close" />

        <div 
          class="contents"
          :style="{
            background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['app'][0]} 0%, ${themeColorList[theme][themeColor]['app'][1]} 100%)`,
          }"
        >

          <div v-if="!page" class="section content1" >
            
          </div>
          
          <div v-if="page === 'choose-session'" class="section content2" >
            <span>Breakout sessions have started. Choose a session to join.</span>
          </div>


          <div v-if="!page" class="section bot1">

            <div class="botl">
              <div class="button-pill" >
                <wl-icon name="settings-bold" size="20" class="icon" />
                <span class="label">Settings</span>
              </div>

              <div class="button-pill" >
                <wl-icon name="settings-bold" size="20" class="icon" />
                <span class="label">Reset</span>
              </div>
            </div>
            
            <div class="botr">
              <md-button v-if="!breakoutSessionStarted" :size="32" class="btn" aria-label="share" @click='start' >
                Start all sessions
              </md-button>

              <md-button v-if="breakoutSessionStarted" :size="32" class="btn md-button--red" aria-label="share" @click='end' >
                End all sessions
              </md-button>
            </div>
          </div>

          <div v-if="page === 'choose-session'" class="section bot2">

            <md-button :size="32" class="btn" aria-label="share" >
              Manage breakout sessions
            </md-button>

          </div>


        </div>

      </div>
    </div>
</template>

<script>

export default {
  props: [
    'page',
  ],
  data() {
    return {

    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    os() {
      return this.$store.state.os;
    },
    breakoutSessionStarted() {
      return this.$store.state.breakoutSessionStarted;
    },
  },
  mounted() {

  },
  destroyed() {

  },

  watch: {

  },
  methods: {

    start() {
      this.$store.commit("breakoutSessionStarted", true);
      //this.$store.commit('sidePanelIsOpen', true);
      //this.$store.commit('plistPanelVisible', true);
    },
    end() {
      this.$store.commit("breakoutSessionStarted", false);
      this.close()
    },
    close() {
      this.$emit("close");
    },


  }
};
</script>

<style lang="scss">
#pop_breakout {
  width: 100%;
  height: 100%;
  pointer-events: auto;
  user-select: none;
  box-sizing: border-box;
  border: 1px solid rgba($color: #000000, $alpha: .2);

  .wrap {
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;

    .contents {
      @include flex(column, flex-start, center);
      width: 100%;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
    }

    .content1 {
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      width: 680px;
      height: 444px;
      background: url(~@/assets/img/tmp_breakout_1.svg) no-repeat 0 0;
      background-size: contain;
    }

    .content2 {
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      width: 384px;
      height: calc(48px + 384px);
      background: url(~@/assets/img/tmp_breakout_2.svg) no-repeat 0 48px;
      background-size: contain;

      span {
        @include flex(row, flex-start);
        width: 100%;
        height: 36px;
        font-size: 14px;
        padding-left: 8px;
      }
    }

    .section {
      display: flex;
      flex-direction: row;

      &.bot1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 64px;
        flex-shrink: 0;

        .botl {
          @include flex;
          margin-left: 16px;

          .button-pill {
            margin-right: 8px;
          };
        }
        .botr {
          @include flex(row, flex-end);
        }
      }

      &.bot2 {
        @include flex;
        width: 100%;
        height: 64px;
        flex-shrink: 0;
      }

      .btn {
        margin-right: 2px;
        padding: 0 12px;
        font-weight: normal;
        font-size: 16px;

        &.disable {
          pointer-events: none;
          opacity: .2;
        }

        &:last-child {
          margin-right: 20px;
        }
      }
    }
    .column {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0;

      .tt {
        font-size: 12px;
        font-weight: bold;
        margin-top: 15px;
        margin-left: 7px;
      }

      &.column1 {
        flex-shrink: 0;
        width: 210px;

        &.disabled {
          pointer-events: none;
          opacity: .2;
        }
      }
      &.column2 {
        flex-grow: 1;
        flex-grow: 1;
        margin: 0 4px 0 12px;
        height: 100%;
        overflow: hidden;
      }
    }

  }
  .close {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 8px;
    right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    cursor: default;
  }

  .divider_v {
    height: 372px;
    border-right: 1px solid rgba(0,0,0, 0.2);
    width: 1px;
  }


  &.dark {
    color: $text-color-primary-dark-ui;
    border: 1px solid rgba($color: #FFFFFF, $alpha: .2);


    .divider_v {
      border-right: 1px solid rgba(255,255,255, 0.2);
    }

  }
  
}


</style>
