<template>
    <div
    id="menu-video-layout-theme"
    :class="[theme]"
    >
        <div class='grp'>
          <div class='itmhead'>Select a background</div>

          <div class="themeitms">
            <div class="list">

              <div class="titm" :class="{selected: stageTheme === null}" @click="setStageTheme(null)">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="stroke" d="M43 22C43 33.598 33.598 43 22 43C10.402 43 1 33.598 1 22C1 10.402 10.402 1 22 1C33.598 1 43 10.402 43 22Z" stroke-width="2"/>
                  <line class="stroke" x1="37.7071" y1="7.70711" x2="7.70711" y2="37.7071" stroke-width="2"/>
                </svg>

              </div>


              <div class="titm " :class="{selected: stageTheme === 'solid1'}" @click="setStageTheme('solid1')">
                <div class="circle solid1" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'solid2'}" @click="setStageTheme('solid2')">
                <div class="circle solid2" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'solid3'}" @click="setStageTheme('solid3')">
                <div class="circle solid3" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'solid4'}" @click="setStageTheme('solid4')">
                <div class="circle solid4" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'solid5'}" @click="setStageTheme('solid5')">
                <div class="circle solid5" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'solid6'}" @click="setStageTheme('solid6')">
                <div class="circle solid6" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'solid7'}" @click="setStageTheme('solid7')">
                <div class="circle solid7" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'img1'}" @click="setStageTheme('img1')">
                <div class="circle img1" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'img2'}" @click="setStageTheme('img2')">
                <div class="circle img2" ></div>
              </div>

              <div class="titm " :class="{selected: stageTheme === 'img3'}" @click="setStageTheme('img3')">
                <div class="circle img3" ></div>
              </div>

              <div class="titm">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="fill" fill-rule="evenodd" clip-rule="evenodd" d="M22 12C21.7239 12 21.5 12.2239 21.5 12.5V21.5H12.5C12.2239 21.5 12 21.7239 12 22C12 22.2761 12.2239 22.5 12.5 22.5H21.5V31.5C21.5 31.7761 21.7239 32 22 32C22.2761 32 22.5 31.7761 22.5 31.5V22.5H31.5C31.7761 22.5 32 22.2761 32 22C32 21.7239 31.7761 21.5 31.5 21.5H22.5V12.5C22.5 12.2239 22.2761 12 22 12Z" />
                  <path class="stroke" d="M43.5 22C43.5 33.8741 33.8741 43.5 22 43.5C10.1259 43.5 0.5 33.8741 0.5 22C0.5 10.1259 10.1259 0.5 22 0.5C33.8741 0.5 43.5 10.1259 43.5 22Z" />
                </svg>

              </div>

            </div>

          </div>

          <div class='divider-b short'></div>

          <div class='itmhead'>Logo</div>

          <div class='itm common-menulist-item'>
            <span class="lb" >Display logo</span>
            <md-toggle-switch label="" htmlId="dislogo" class="toggle-switch-m" :checked="stageThemeLogo !== null" @change="toggleStageThemeLogo"></md-toggle-switch>
          </div>

          <!--div class='itm common-menulist-item' v-if="stageThemeLogo !== null"-->
          <div class='itm common-menulist-item'>
            <span class="lb" >Change logo...</span>
          </div>

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
    stageTheme(){
        return this.$store.state.stageTheme;
    },
    stageThemeLogo(){
        return this.$store.state.stageThemeLogo;
    },
    
  },
  mounted() {},
  watch: {

  },
  methods: {

    setStageTheme(type){
      this.$store.commit("stageTheme", type);
      //this.close();
    },
    toggleStageThemeLogo(){
      this.$store.commit("stageThemeLogo", this.stageThemeLogo === null ? 'cisco' : null);
      //this.close();
    },
    
    close() {
      //this.$popper.hideAll();
      this.$popper.hide('sub-menu-theme')
    },
  }
};
</script>

<style lang="scss">
#menu-video-layout-theme {
  width: 324px;
  pointer-events: auto;

  margin-top: 5px;
  margin-bottom: 5px;

  .itmhead {
    font-size: 14px;
    color: $md-gray-70;
    padding-left: 15px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    height: 24px;
  }

  .itm{
    height: 40px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
  
  }
  .itm:hover{
      background: $md-gray-10;
  }
  .itm .lb{
      font-size: 16px;
      pointer-events: none;
  }
  .divider-b {
      border-bottom: 1px solid #EEE;

      &.short {
        margin: 0 15px;
      }
  }

  .themeitms {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 15px;

    .list{
      width: 100%;
      display: grid;
      grid-gap: 10px 10px;
      grid-template-columns: 50px 50px 50px 50px 50px;
      grid-template-rows: 50px 50px 50px;
      justify-items: center;
      align-items: center;

      .titm{
        height: 50px;
        width: 50px;
        border-radius: 50%;
        cursor: default;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;

        svg {
          .fill {
            fill: $md-gray-100;
          }
          .stroke {
            stroke: $md-gray-100;
          }
        }

        &.selected {
          border: 2px solid $md-violet-50;
        }

        .circle {
          height: 44px;
          width: 44px;
          border-radius: 50%;
          overflow: hidden;
          background-size: cover;
        }

        .solid1 {
          background-color: $md-gray-80;
        }
        .solid2 {
          background-color: $md-gray-40;
        }
        .solid3 {
          background-color: $md-gray-10;
        }
        .solid4 {
          background-color: $md-blue-70;
        }
        .solid5 {
          background-color: $md-blue-50;
        }
        .solid6 {
          background-color: $md-yellow-10;
        }
        .solid7 {
          background-color: $md-green-05;
        }
      }
    }
    
    .list .img1{
      background-image: url(~@/assets/img/temp_stage_theme_s_img1.png);
    }
    .list .img2{
      background-image: url(~@/assets/img/temp_stage_theme_s_img2.png);
    }
    .list .img3{
      background-image: url(~@/assets/img/temp_stage_theme_s_img3.png);
    }

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
    .divider-b{
      border-bottom: 1px solid $md-gray-80;
    }
    .itm:hover{
        background: $md-gray-90;
    }

    .itmhead {
      color: $text-color-disabled-light-ui;
    }

    .themeitms {
      .list{
        .titm {
          svg {
            .fill {
              fill: $md-gray-05;
            }
            .stroke {
              stroke: $md-gray-05;
            }
          }
        }
      }
      
    }
  }
  
}

</style>
