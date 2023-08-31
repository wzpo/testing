<template>
    <div class='dropdown_device_paired' ref="dropdown_device_paired">

      <div class='page_main'>

        <div class='autocnt' >
          <div class="lb" >Automatically connect this device</div>
          <md-toggle-switch class="toggle-switch-m" label="" htmlId="aacb" :checked="true" />
        </div>
        <div class="divider" style="margin: 0 2px;"></div>

        <div class="scrollpane">
          <div class='tit' v-if="devicePairedName !== `${me.name.split(' ')[0]}'s Personal Device`">
            <div class='lb'>Personal devices</div>
          </div>
          <div class='dlist' v-if="devicePairedName !== `${me.name.split(' ')[0]}'s Personal Device`">
            <div class='itm menuitm' @click="selectDevice(`${me.name.split(' ')[0]}'s Personal Device`, 'device-board-55')">
              <div class='thumb' ><div class="img device-board-55"></div></div>
              <span class="lb">{{`${me.name.split(' ')[0]}'s Personal Device`}}</span>
            </div>
          </div>

          <div v-if="devicePairedName !== `${me.name.split(' ')[0]}'s Personal Device`" class="divider" style="margin-bottom: 10px;"></div>

          <div class='tit' >
            <div class='lb'>Nearby devices</div>
          </div>
          
          <div class='dlist'>

            <div class='itm menuitm' @click='selectDevice("Toyshop", "device-deskpro")' v-if="devicePairedName !== 'Toyshop'">
              <div class='thumb' ><div class="img device-deskpro" ></div></div>
              <span class="lb">Toyshop</span>
              <wl-icon name="location-bold" size="16" class="ico" />
            </div>
            
            <div class='itm menuitm' @click='selectDevice("Hummingbird", "device-dx80")' v-if="devicePairedName !== 'Hummingbird'">
              <div class='thumb' ><div class="img device-dx80"></div></div>
              <span class="lb">Hummingbird</span>
            </div>

            <div class='itm menuitm' @click='selectDevice("K420 - Deep Mind", "device-room-kit")' v-if="devicePairedName !== 'K420 - Deep Mind'">
              <div class='thumb'><div class="img device-room-kit"></div></div>
              <span class="lb">K420 - Deep Mind
                
              </span>
            </div>

          </div>
        </div>

        <div class='searchbtn' >
          <md-button class="btn md-button-outline btn-s" aria-label="x" :size="32" >Search for a device</md-button>
        </div>
        
      </div>


    </div>
</template>

<script>

export default {
  props: [],
  data() {
    return {
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    filePath() {
      return this.$store.state.filePath;
    },
    devicePaired(){
      return this.$store.state.devicePaired;
    },
    devicePairedName(){
      return this.$store.state.devicePairedName;
    },
    devicePairedImage(){
      return this.$store.state.devicePairedImage;
    },
    me(){
      return this.$store.getters.me;
    },
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    searchDevice(){
      //$('.page_main').hide();
      //$('.page_search').show();
      //$('.dropdown_device_paired .head .backbtn').show();
    },
    closeSearchDevice(){
      //$('.page_main').show();
      //$('.page_search').hide();
      //$('.dropdown_device_paired .head .backbtn').hide();
    },

    selectDevice(name, device, videoaddress=false) {
      this.isVideoAddress = videoaddress;
      this.$store.commit('devicePaired', true);
      this.$store.commit('devicePairedName', name);
      this.$store.commit('devicePairedImage', device);
      this.closeSearchDevice();

      this.close();
    },
    disconnectDevice() {
      this.$store.commit('devicePaired', false);
      this.$store.commit('devicePairedName', null);
      this.$store.commit('devicePairedImage', null);

      this.close();

    },

    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">

.dropdown_device_paired {
  width:360px;
  overflow: hidden;
  padding-bottom: 10px;

  .head{
    height: 48px;
    font-size: 16px;
    line-height: 48px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .autocnt {
    @include flex;
    height: 40px;
    padding: 0 20px;
    margin: 16px 0 12px 0;
    
    .lb {
      flex-grow: 1;
      font-size: 16px;
      line-height: 24px;
    }
  }

  .scrollpane {
    width: 100%;
    max-height: 190px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .tit{
    display: flex;
    align-items: center;
    height: 32px;
    padding-left: 20px;
    box-sizing: border-box;
    user-select: none;

    .lb {
      font-size: 14px;
      opacity: .7;
    }
  }

  .itm{
    position: relative;
    display: flex;
    flex-direction: row;
    pointer-events: auto;
    cursor:default;
    height: 48px;;
    margin: 0 8px;
    align-items: center;
    border-radius: 8px;

    &:hover {
      background-color: rgba($color: #000000, $alpha: .07);
    }
  }
  .itm .thumb{
    @include flex;
    width: 54px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid rgba($color: #000000, $alpha: .15);
    margin-left: 10px;
    pointer-events: none;
    flex-shrink: 0;

    .img {
      width: 34px;
      height: 22px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .itm .lb{
    text-align: left;
    pointer-events: none;
    flex-grow: 1;
    font-size: 16px;
    line-height: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: .95;
  }
  .itm .lb2{
    font-size: 10px;
    opacity: .6;
    margin-top: -2px;
    line-height: 12px;
  }
  .itm .ico {
    margin-right: 10px;
  }
  .itm .lb_disconnect{
    text-align: right;
    color: $md-red-50;
    cursor: default;
    margin-right: 10px;
    padding-bottom: 1px;
    font-size: 12px;
  }


  .searchbtn {
    @include flex;
    height: 56px;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: -8px;

    .btn-s {
      width: 280px;

      .md-button__children {
        font-size: 16px;
      }
    }
  }

  .divider {
    border-bottom: solid 1px rgba(255, 255, 255, 0.2);
    margin: 2px 16px;
  }


  /* theme ----- dark */

}

.dark {
  .dropdown_device_paired {
    .search {
      .md-input__before {
        color: rgba($color: white, $alpha: 0.95);
        fill: rgba($color: white, $alpha: 0.95);
      }
      .md-input {
        color: rgba($color: white, $alpha: 0.95);
        background-color: transparent;
        border-color: rgba($color: white, $alpha: 0.2);

        &::placeholder {
          color: rgba($color: white, $alpha: 0.7) !important;
        }
        &:hover {
          background-color: rgba($color: white, $alpha: 0.05);
          border-color: rgba($color: white, $alpha: 0.3) !important;
        }
        &:focus {
          background-color: rgba($color: white, $alpha: 0.1);
          border-color: rgba($color: white, $alpha: 0.3) !important;
          box-shadow: 0 0 0 3px $md-blue-40 !important;
        }

      }
    }

    .tabs {
      .tab {
        &.active{
          
        }
      }
    }

    .itm{
      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .07);
      }
      .thumb {
        border: 1px solid rgba($color: #FFFFFF, $alpha: .15);
      }
    }
  }

}

</style>
