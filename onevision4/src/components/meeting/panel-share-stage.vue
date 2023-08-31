<template>
 <div class="stage_panel_wrap" :class="[theme]">
    <panel-header
      :title="title"
      :floating="false"
      :backVisible="false"
      @close="close"
    ></panel-header>

    <div class='grp'>
      <div class='itmhead'>Select a background</div>

      <div class="themeitms">
        <div class="list">

          <div class="titm" :class="{selected: stageTheme === null}" @click="setStageTheme(null)">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="stroke" d="M43 22C43 33.598 33.598 43 22 43C10.402 43 1 33.598 1 22C1 10.402 10.402 1 22 1C33.598 1 43 10.402 43 22Z" stroke-width="2"/>
              <line class="stroke" x1="37.7071" y1="7.70711" x2="7.70711" y2="37.7071" stroke-width="2"/>
            </svg>
            <div class="border" ></div>
          </div>


          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid1'}" @click="setStageTheme('stage-theme--solid1')">
            <div class="circle stage-theme--solid1" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid2'}" @click="setStageTheme('stage-theme--solid2')">
            <div class="circle stage-theme--solid2" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid3'}" @click="setStageTheme('stage-theme--solid3')">
            <div class="circle stage-theme--solid3" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid4'}" @click="setStageTheme('stage-theme--solid4')">
            <div class="circle stage-theme--solid4" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid5'}" @click="setStageTheme('stage-theme--solid5')">
            <div class="circle stage-theme--solid5" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid6'}" @click="setStageTheme('stage-theme--solid6')">
            <div class="circle stage-theme--solid6" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid7'}" @click="setStageTheme('stage-theme--solid7')">
            <div class="circle stage-theme--solid7" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid8'}" @click="setStageTheme('stage-theme--solid8')">
            <div class="circle stage-theme--solid8" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid9'}" @click="setStageTheme('stage-theme--solid9')">
            <div class="circle stage-theme--solid9" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--img1'}" @click="setStageTheme('stage-theme--img1')">
            <div class="circle stage-theme--img1" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--img2'}" @click="setStageTheme('stage-theme--img2')">
            <div class="circle stage-theme--img2" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--img3'}" @click="setStageTheme('stage-theme--img3')">
            <div class="circle stage-theme--img3" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid10'}" @click="setStageTheme('stage-theme--solid10')">
            <div class="circle stage-theme--solid10" ></div>
            <div class="border" ></div>
          </div>
          <div class="titm " :class="{selected: stageTheme === 'stage-theme--solid11'}" @click="setStageTheme('stage-theme--solid11')">
            <div class="circle stage-theme--solid11" ></div>
            <div class="border" ></div>
          </div>

          <div class="titm">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="fill" fill-rule="evenodd" clip-rule="evenodd" d="M22 12C21.7239 12 21.5 12.2239 21.5 12.5V21.5H12.5C12.2239 21.5 12 21.7239 12 22C12 22.2761 12.2239 22.5 12.5 22.5H21.5V31.5C21.5 31.7761 21.7239 32 22 32C22.2761 32 22.5 31.7761 22.5 31.5V22.5H31.5C31.7761 22.5 32 22.2761 32 22C32 21.7239 31.7761 21.5 31.5 21.5H22.5V12.5C22.5 12.2239 22.2761 12 22 12Z" />
              <path class="stroke" d="M43.5 22C43.5 33.8741 33.8741 43.5 22 43.5C10.1259 43.5 0.5 33.8741 0.5 22C0.5 10.1259 10.1259 0.5 22 0.5C33.8741 0.5 43.5 10.1259 43.5 22Z" />
            </svg>

          </div>

        </div>

      </div>

      <div class='itmhead'>Content</div>

      <div class='itm common-menulist-item'>
        <span class="lb" >Display logo</span>
        <md-toggle-switch label="" htmlId="dislogo" class="toggle-switch-m" :checked="stageThemeLogo !== null" @change="toggleStageThemeLogo"></md-toggle-switch>
      </div>

      <div class='logo-item'>
        <div class="logo" ></div>
        <div class="txt" >
          <span class="lb1" >
            Webex-by-cisco.png
          </span>
          <span class="lb2" >
            224 KB
          </span>
        </div>
      </div>

      <span class="lb-change" >Change the logo</span>

      <div class='itm common-menulist-item'>
        <span class="lb" >Advanced speaker name label</span>
        <md-toggle-switch label="" htmlId="qqq" class="toggle-switch-m" :checked="false"></md-toggle-switch>
      </div>

      <div class='itm common-menulist-item'>
        <span class="lb" >Active speaker</span>
        <md-toggle-switch label="" htmlId="www" class="toggle-switch-m" :checked="false"></md-toggle-switch>
      </div>

      <div class='itm common-menulist-item'>
        <span class="lb" >Shared content</span>
        <md-toggle-switch label="" htmlId="eee" class="toggle-switch-m" :checked="false"></md-toggle-switch>
      </div>


      <div class='bot'>
        <md-checkbox value="immersive"
          label="Stage only"
          htmlId="stage-only"
          :checked="true"
          class="cb"
        />
        <md-button class="btn md-button--blue" aria-label="x" :size="34" @click="goLive">Go Live!</md-button>
      </div>

    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      title: "Stage",

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
  mounted() {
  },
  watch: {},
  methods: {
    close() {
      this.$store.commit("shareStagePanelVisible", false);
    },
    setStageTheme(type){
      this.$store.commit("stageTheme", type);
    },
    toggleStageThemeLogo(){
      this.$store.commit("stageThemeLogo", this.stageThemeLogo === null ? 'cisco' : null);
    },
    goLive(){
      this.$store.commit("stageSyncing", true);
    },
  }
};
</script>


<style lang="scss">
.stage_panel_wrap {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  pointer-events: auto;

  .itmhead {
    font-size: 14px;
    color: $md-gray-70;
    padding-left: 15px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    height: 24px;
  }

  .grp {
    display: flex;
    flex-direction: column;
    margin-left: 4px;
    flex-grow: 1;
  }

  .itm{
    height: 40px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
    padding-right: 24px;
    justify-content: space-between;
  
  }
  .itm:hover{
      background: $md-gray-10;
  }
  .itm .lb{
      font-size: 16px;
      pointer-events: none;
  }
  .logo-item {
    width: 314px;
    height: 52px;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.11);
    border-radius: 6px;
    margin-left: 16px;

    .logo {
      width: 52px;
      height: 44px;
      margin-left: 4px;
      background: url(~@/assets/img/stage-theme-logo-thumb.svg) no-repeat;
    }

    .txt {
      @include flex(column, flex-start, flex-start);
      padding-left: 8px;

      .lb1 {
        font-size: 16px;
        line-height: 20px;
        opacity: .95;
      }
      .lb2 {
        font-size: 14px;
        line-height: 16px;
        opacity: .7;
      }
    }
    
  }

  .lb-change {
    @include flex(row, flex-end);
    width: 100%;
    font-size: 14px;
    line-height: 22px;
    text-decoration-line: underline;
    color: #64B4FA;
    padding: 4px 24px 4px 0;
  }

  .bot {
    @include flex(row, space-between, flex-end);
    flex-grow: 1;
    margin: 0 24px 12px 12px;

    .cb {
      @include flex;
      height: 34px;
      margin: 0;
    }
    .btn {
      height: 34px;
      .md-button__children {
        font-size: 16px;
      }
    }

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
      grid-gap: 6px 6px;
      grid-template-columns: 48px 48px 48px 48px 48px 48px;
      grid-template-rows: 48px 48px 48px;
      justify-items: center;
      align-items: center;

      .titm{
        position: relative;
        flex-shrink: 0;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        cursor: default;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;

        .border {
          display: none;
          position: absolute;
          height: 48px;
          width: 48px;
          border-radius: 50%;
          box-sizing: border-box;
          border: 2px solid $md-blue-50;
        }

        svg {
          .fill {
            fill: $md-gray-100;
          }
          .stroke {
            stroke: $md-gray-100;
          }
        }

        &.selected {
          .border {
            display: flex;
          }
        }

        .circle {
          height: 40px;
          width: 40px;
          border-radius: 50%;
          overflow: hidden;
          background-size: cover;
        }

        
      }
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
