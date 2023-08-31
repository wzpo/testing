<template>
    <div class="pop-scene">
      <topbar-simple class="header" title="Customize layout theme" :buttons="['close']" @close="close" />
      <div class="content" >
        <div class="left" :class="`img${sceneId+1}`">
          <drag-resize
            v-if="sceneLogo"
            class="scenelogo"
            :isActive="true"
            :w="defaultLogo.width"
            :h="defaultLogo.height"
            :x="defaultLogo.left"
            :y="defaultLogo.top"
            :minw="20"
            :minh="20"
            :parentW="defaultLogo.parentWidth"
            :parentH="defaultLogo.parentHeight"
            :isDraggable="true"
            :isResizable="true"
            :aspectRatio="true"
            :parentLimitation="true"
            :showHandle="true"
            @dragstop="updateLogo"
          >
            <div class="img" ></div>
          </drag-resize>
        </div>
        <div class="right">
          <div class="tabs">
            <div class="tab" :class="{active: tab === 0}" @click="tab = 0">
              <span class="lb">Scenes</span>
            </div>
            <div class="tab" :class="{active: tab === 1}" @click="tab = 1">
              <span class="lb">Content</span>
            </div>
          </div>

          <div class="tabc">
            <div v-if="tab === 0" class="tabc0" >

              <div class="itm" :class="{selected: sceneId === 0}" @click="selectItem(0)" >
                <div class="img img1"></div>
                <div class="bot">
                  <div class="lb">Meeting room</div>
                  <wl-icon name="participant-filled" size="16" />
                  <div class="cnt">6</div>
                </div>
                <div class="border" ></div>
              </div>

              <div class="itm" :class="{selected: sceneId === 1}" @click="selectItem(1)" >
                <div class="img img2"></div>
                <div class="bot">
                  <div class="lb">Classroom</div>
                  <wl-icon name="participant-filled" size="16" />
                  <div class="cnt">9</div>
                </div>
                <div class="border" ></div>
              </div>

              <div class="itm" :class="{selected: sceneId === 2}" >
                <div class="img img3"></div>
                <div class="bot">
                  <div class="lb">Kindergarten</div>
                  <wl-icon name="participant-filled" size="16" />
                  <div class="cnt">12</div>
                </div>
              </div>

              <div class="itm" :class="{selected: sceneId === 3}" >
                <div class="img img4"></div>
                <div class="bot">
                  <div class="lb">Studio</div>
                  <wl-icon name="participant-filled" size="16" />
                  <div class="cnt">5</div>
                </div>
              </div>

              <div class="itm" :class="{selected: sceneId === 4}" >
                <div class="img img5"></div>
                <div class="bot">
                  <div class="lb">Coffee bar</div>
                  <wl-icon name="participant-filled" size="16" />
                  <div class="cnt">10</div>
                </div>
              </div>

              <div class="itm" >
                <wl-icon name="upload-bold" size="20" />
                <div class="lb-up">Upload</div>
              </div>

            </div>

            <div v-if="tab === 1" class="tabc1" >
              <div class='itm common-menulist-item'>
                <span class="lb" >Display logo</span>
                <md-toggle-switch label="" htmlId="dislogo" class="toggle-switch-m" :checked="sceneLogo !== null" @change="toggleSceneLogo"></md-toggle-switch>
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
                <span class="lb" >Show all name label</span>
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
            </div>
          </div>
        </div>

      </div>
      <div class="controls" >
        <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="close">Cancel</md-button>
        <md-button class="btn md-button-solid" aria-label="x" :size="32" @click="goLive">Apply</md-button>
      </div>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
  props: [

  ],
  data() {
    return {
      tab: 0,
      sceneId: 0,
      defaultLogo: {left: 12, top: 12, width: 131, height: 106, parentWidth: 632, parentHeight: 404},
    };
  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    scene() {
      return this.$store.state.scene;
    },
    sceneLogo() {
      return this.$store.state.sceneLogo;
    },
    sceneSyncing() {
      return this.$store.state.sceneSyncing;
    },

  },
  mounted() {},
  watch: {

  },
  methods: {
    
    selectItem(id) {
      this.sceneId = id
    },
    setScene(type){
      this.$store.commit("scene", type);
    },
    toggleSceneLogo(){
      this.$store.commit("sceneLogo", this.sceneLogo === null ? this.defaultLogo : null);
    },
    goLive(){
      this.$store.commit("sceneSyncing", true);
      this.close();
    },
    updateLogo(evt){
      let obj = _.cloneDeep(evt);
      obj.parentWidth = this.defaultLogo.parentWidth;
      obj.parentHeight = this.defaultLogo.parentHeight;
      this.$store.commit("sceneLogo", obj);
    },

    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">
.pop-scene {
  width:100%; 
  height: 100%;
  display:flex; 
  flex-direction: column;
  background: #000;

  .header#wintopbar-simple {
    display:flex; 
    height: 48px;

    .titlebar {
      height: 48px;
      .mid .title {
        font-weight: 600;
        font-size: 16px;
      }
    }
  }
  .content {
    flex-grow: 1;
    display:flex; 
    background: linear-gradient(180deg, #262626 0%, #0F0F0F 100%);
    border-top-left-radius: 12px;

    .left {
      position: relative;
      width: 632px;
      height: 404px;
      margin-left: 24px;
      margin-top: 24px;
      border-radius: 8px;
      overflow: hidden;
      background-color: rgba($color: #FFF, $alpha: 0.1);
      background-repeat: no-repeat;
      background-size: cover;

      &.img1 {
        background-image: url(~@/assets/img/scene01.jpg);
      }
      &.img2 {
        background-image: url(~@/assets/img/scene02.jpg);
      }

      .scenelogo {
        pointer-events: auto;

        .img {
          pointer-events: auto;
          position: absolute;
          width: 100%;
          height: 100%;
          background: url(~@/assets/img/temp_stage_theme_logo.svg) no-repeat;
          background-size: contain;
        }
      }
    }

    .right {
      @include flex(column, flex-start, flex-start);
      margin-left: 20px;
      
      .tabs {
        @include flex(row, flex-start);
        margin-bottom: 12px;
        margin-top: 24px;

        .tab {
          @include flex;
          height: 28px;
          padding: 0 16px;
          margin-right: 8px;
          user-select: none;
          border-radius: 14px;

          .lb {
            font-size: 14px;
            font-weight: 600;
            opacity: .7;
          }

          &:hover {
            background: rgba($color: #FFFFFF, $alpha: .1);
            .lb {
              opacity: .95;
            }
          }

          &:active, &.active {
            background: rgba($color: #FFFFFF, $alpha: .2);
            .lb {
              opacity: .95;
            }
          }
        }
      }

      .tabc {
        flex-grow: 1;
      }
      .tabc0 {
        display: grid;
        grid-gap: 4px 4px;
        grid-template-columns: 148px 148px;
        grid-template-rows: 120px 120px 120px;
        justify-items: center;
        align-items: center;

        .itm {
          position: relative;
          @include flex(column);
          width: 140px;
          height: 112px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.12);
          box-sizing: border-box;
          user-select: none;

          &.selected .border {
            display: flex;
          }

          .img {
            flex-shrink: 0;
            width: 132px;
            height: 74px;
            border-radius: 4px;
            background-color: rgba($color: #FFF, $alpha: 0.1);
            margin: 4px;
            background-repeat: no-repeat;
            background-size: cover;
          }

          .img1 {
            background-image: url(~@/assets/img/scene01_thumb.jpg);
          }
          .img2 {
            background-image: url(~@/assets/img/scene02_thumb.jpg);
          }
          .img3 {
            background-image: url(~@/assets/img/scene03_thumb.jpg);
          }
          .img4 {
            background-image: url(~@/assets/img/scene04_thumb.jpg);
          }
          .img5 {
            background-image: url(~@/assets/img/scene05_thumb.jpg);
          }

          .bot {
            @include flex;
            width: 100%;
            padding: 2px 8px 8px;
            font-size: 14px;

            .lb {
              flex-grow: 1;
            }
          }

          .border {
            display: none;
            position: absolute;
            box-sizing: border-box;
            border: 2px solid #64B4FA;
            border-radius: 12px;
            width: 148px;
            height: 120px;
            top: -4px;
            left: -4px;

          }

          .lb-up {
            margin-top: 8px;
            font-size: 14px;
          }

          
        }
      }

      .tabc1 {

        .itm{
          width: 292px;
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
            background: $md-gray-90;
        }
        .itm .lb{
            font-size: 15px;
            pointer-events: none;
        }
        .logo-item {
          width: 269px;
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
            background: url(~@/assets/img/stage-theme-logo-thumb2.svg) no-repeat;
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
              font-size: 12px;
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
      }

    }
  }
  .controls {
    background: #0F0F0F;
    height: 64px;
    @include flex(row, flex-end);
    margin-right: 24px;

    .btn {
      margin-left: 8px;
      .md-button__children {
        font-size: 16px;
        font-weight: normal;
      }
    }
  }


}

</style>
