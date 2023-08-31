<template>
    <div
    id="ctrl_menu_reaction"
    :class="[theme]"
    >

        <!--
        <div class="grp">
          <md-button class="btn-raise-hand md-button-outline" aria-label="x" :size="48" >
            <span class="ico"></span>
            <span class="lb">Raise hand</span>
          </md-button>
        </div>

        <div class="divider" style="margin: 0 8px;"></div>
        -->

        <audio ref="soundfx-celebrate" :src="`${$store.state.reactionPath}sound/celebrate.m4a`" preload="auto" ></audio>
        <audio ref="soundfx-clap" :src="`${$store.state.reactionPath}sound/clap.m4a`" preload="auto" ></audio>
        <audio ref="soundfx-fire" :src="`${$store.state.reactionPath}sound/fire.m4a`" preload="auto" ></audio>
        <audio ref="soundfx-haha" :src="`${$store.state.reactionPath}sound/haha.m4a`" preload="auto" ></audio>
        <audio ref="soundfx-wow" :src="`${$store.state.reactionPath}sound/wow.m4a`" preload="auto" ></audio>

        <div class='grp' >

            <div class='reactions-grid1'>

              <div class='gitm ' @click="playReaction('thumb-up')" >
                <div class="circle">
                  <div class="ico reaction--thumb-up" ref="thumb-up"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('clap')" >
                <div class="circle">
                  <div class="ico reaction--clap" ref="clap"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('thank-you')" >
                <div class="circle">
                  <div class="ico reaction--thank-you" ref="thank-you"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('thumb-down')" >
                <div class="circle">
                  <div class="ico reaction--thumb-down" ref="thumb-down"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('smile')" >
                <div class="circle">
                  <div class="ico reaction--smile" ref="smile"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('haha')" >
                <div class="circle">
                  <div class="ico reaction--haha" ref="haha"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('wow')" >
                <div class="circle">
                  <div class="ico reaction--wow" ref="wow"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('sad')" >
                <div class="circle">
                  <div class="ico reaction--sad" ref="sad"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('celebrate')" >
                <div class="circle">
                  <div class="ico reaction--celebrate" ref="celebrate"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('love')" >
                <div class="circle">
                  <div class="ico reaction--love" ref="love"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('slow-down')" >
                <div class="circle">
                  <div class="ico reaction--slow-down" ref="slow-down"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('speed-up')" >
                <div class="circle">
                  <div class="ico reaction--speed-up" ref="speed-up"></div>
                </div>
              </div>

              <div class='gitm ' @click="playReaction('fire')" >
                <div class="circle">
                  <div class="ico reaction--fire" ref="fire"></div>
                </div>
              </div>



            </div>

          </div>

          <div class='divider'></div>

          <div class='toggle_sec'>
            <span class="lb">Recognize hand gestures</span>
            <md-toggle-switch
              class="toggle-switch-m"
              :checked="gestureRecognitionOn"
              label=""
              htmlId="testToggleSwitch2"
              @change="() => {$store.commit('gestureRecognitionOn', !gestureRecognitionOn)}"
            />
          </div>


    </div>
</template>

<script>

export default {
  data() {
    return {

    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    os() {
      return this.$store.state.os;
    },
    me() {
      return this.$store.getters.me;
    },
    peopleList(){
      return this.$store.state.peopleList;
    },
    reactionRaiseHand() {
      return this.$store.state.reactionRaiseHand;
    },
    statusBeRightBack() {
      return this.$store.state.statusBeRightBack;
    },
    statusNoisyBackground() {
      return this.$store.state.statusNoisyBackground;
    },
    reactionList() {
      return this.$store.state.reactionList;
    },
    gestureRecognitionOn() {
      return this.$store.state.gestureRecognitionOn;
    },

  },
  mounted() {},
  watch: {

  },
  methods: {

    setReaction(name) {
      this.reactionList.push({
        animationName: name,
        attendeeName: this.me.name,
        uuid: Math.random(), //
      })
      this.$store.commit('reactionList', this.reactionList);
    },

    playReaction(id) {

      // set reaction
      let plist = this.peopleList.slice();
      const len = plist.length;
      for (let i = 0; i < len; i++) {
          const p = plist[i];
          if (p.name === this.me.name) {
              p.reaction = id + '?' + Math.random();
          }
      }
      this.$store.commit("doNotAutoChangeZoom", true);
      this.$store.commit("peopleList", plist);

      if (id) {
        this.setReaction(id);
      }

      if (this.$refs['soundfx-' + id]) {
        this.$refs['soundfx-' + id].currentTime = 0;
        this.$refs['soundfx-' + id].play();
      }

      //this.close();
    },

    close() {
      this.$emit("close");
    },

  }
};
</script>

<style lang="scss">
#ctrl_menu_reaction {
  width: 280px;
  pointer-events: auto;

  margin-top: 8px;
  margin-bottom: 8px;

  .grp {
    @include flex(column);
    margin: 0 8px 8px 8px;

    .tt{
      width: 100%;
      margin: 8px 0 3px 22px;
      display: flex;
      align-items: center;

      .lb{
        flex-grow: 1;
        opacity: .7;
        font-size: 14px;
      }
    }
  }

  .reactions-grid1 {
    display: grid;
    grid-row-gap: 16px;
    grid-column-gap: 20px;
    grid-template-columns: 40px 40px 40px 40px;
    grid-template-rows: 40px 40px;
    margin-top: 15px;
    margin-bottom: 10px;

    .gitm {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .circlebg {
        background-color: $md-gray-05;
      }

      .circle {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .ico {
          transition: all 0.2s ease-out;
          width: 40px;
          height: 40px;
          background-position: center;
          background-repeat: no-repeat;
        }
      }

      &:hover {
        .ico {
          transform: scale(1.2);
        }
      }

      &.selected {
        &:hover {
          .ico {
            transform: scale(1);
          }
        }
      }
      &.selected1 {
        .circle {
          background-color: $md-blue-05;
        }
      }
      &.selected2 {
        .circle {
          background-color: $md-green-05;
        }
      }
      &.selected3 {
        .circle {
          background-color: $md-red-10;
        }
      }
      &.selected4 {
        .circle {
          background-color: $md-yellow-05;
        }
      }
      &.selected5 {
        .circle {
          background-color: $md-olive-10;
        }
      }
    }
  }

  .btn-raise-hand {
    width: 240px;
    height: 48px;
    border-radius: 24px;
    margin: 6px 0;

    .ico {
      margin-right: 8px;
      width: 24px;
      height: 24px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url(~@/assets/reaction/svg-icon/raise-hand.svg);
    }

    .lb {
      font-weight: normal;
      font-size: 16px;
    }
  }

  .toggle_sec {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin-top: 4px;
    margin-bottom: 12px;
    
    .lb {
      font-size: 16px;
      margin-right: 16px;
      user-select: none;
    }

    .md-toggle-switch__label {
      margin: 0;
    }
  }

  .divider{
    margin-top: 4px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .2);
  }
  

  /* ------------------ drak ------------------ */

  &.hybrid {
    color: $text-color-primary-light-ui;
  }

  &.dark {
    color: $text-color-primary-dark-ui;

    .divider{
      border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: .2);
    }
  }
  

}
</style>
