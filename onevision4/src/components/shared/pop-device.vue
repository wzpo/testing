<template>
    <div class='dropdown_device' ref="dropdown_device">
      <div class='head'>
        <div class='backbtn'
        @click='closeSearchDevice'
        ></div>
        Connect to a device
      </div>
      <div class='page_main'>

        <md-input 
          ref="searchinput"
          class="search md-search-input" 
          inputClassName=""
          clear
          shape="pill"
          placeholder="Search Room or device name"
        >
          <wl-icon
            class="md-search-input__icon"
            name="search-bold"
            size="12"
            slot="inputBefore"
          />
        </md-input>

        <div class='tit' v-if='devicePaired'>
          <div class='lb'>Current device</div>
        </div>
        <div class='dlist' v-if='devicePaired'>
          <div class='itm menuitm'>
            <div class='thumb thumb4' ><div class="img"></div></div>
            <span class="lb">{{devicePairedName}}</span>
            <span class="lb_disconnect" @click='disconnectDevice'>Disconnect</span>
          </div>
        </div>

        <div class='tit' v-if='!devicePaired'>
          <div class='lb'>Personal Device</div>
        </div>
        <div class='dlist' v-if='!devicePaired'>
          <div class='itm menuitm' @click="selectDevice(`${me.name.split(' ')[0]}'s Personal Device`)">
            <div class='thumb thumb4' ><div class="img"></div></div>
            <span class="lb">{{`${me.name.split(' ')[0]}'s Personal Device`}}</span>
          </div>
        </div>

        <div class='tit'>
          <div class='tabs'>
            <div class='tab active'>
              <div class='lb'>Nearby devices</div>
            </div>
            <div class='tab'>
              <div class='lb'>Recents</div>
            </div>
          </div>
        </div>
        
        <div class='dlist'>

          <div class='itm menuitm' @click='selectDevice("Toyshop")' v-if="devicePairedName !== 'Toyshop'">
            <div class='thumb thumb1' ><div class="img"></div></div>
            <span class="lb">Toyshop</span>
            <wl-icon name="location-bold" size="16" class="ico" />
          </div>
          
          <div class='itm menuitm' @click='selectDevice("Hummingbird")' v-if="devicePairedName !== 'Hummingbird'">
            <div class='thumb thumb2' ><div class="img"></div></div>
            <span class="lb">Hummingbird</span>
          </div>

          <div class='itm menuitm' @click='selectDevice("K420 - Deep Mind")' v-if="devicePairedName !== 'K420 - Deep Mind'">
            <div class='thumb thumb4'><div class="img"></div></div>
            <span class="lb">K420 - Deep Mind
              
            </span>
          </div>

          <div class='itm menuitm' @click='selectDevice("Queenshead")' v-if="devicePairedName !== 'Queenshead'">
            <div class='thumb thumb3'><div class="img"></div></div>
            <span class="lb">Queenshead</span>
          </div>

          <div class='itm menuitm' @click='selectDevice("Trilian 02-06")' v-if="devicePairedName !== 'Trilian 02-06'">
            <div class='thumb thumb1'><div class="img"></div></div>
            <span class="lb">Trilian 02-06
              
            </span>
          </div>

        </div>
        
      </div>

      <div class='page_search' style='display:none;'>
        <div class='box con_flex_column'>
          <div class='uiinput pill'
          >videoaddress@cisco.com</div>
        </div>
        <div class='dlist'>
          <div class='itm menuitm' @click='selectDevice("videoaddress@cisco.com", true)'>
            <div class='thumb thumb5' ><div class="img"></div></div>
            <span class="lb">videoaddress@cisco.com</span>
          </div>
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
      //$('.dropdown_device .head .backbtn').show();
    },
    closeSearchDevice(){
      //$('.page_main').show();
      //$('.page_search').hide();
      //$('.dropdown_device .head .backbtn').hide();
    },

    selectDevice(name, videoaddress=false) {
      this.isVideoAddress = videoaddress;
      this.$store.commit('devicePaired', true);
      this.$store.commit('devicePairedName', name);
      this.closeSearchDevice();

      this.close();
    },
    disconnectDevice() {
      this.$store.commit('devicePaired', false);
      this.$store.commit('devicePairedName', null);

      this.close();

    },

    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">

.dropdown_device {
  width:280px;
  border-radius: 8px;
  overflow: hidden;
  transform: rotate(0deg);
  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255,255,255,.16);
  padding-bottom: 10px;

  .head{
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 5px;
  }
  .backbtn{
    position: absolute;
    width:40px;
    height: 40px;
    pointer-events: auto;
    cursor: default;
    transform: rotate(90deg);
    transform-origin: 50%;

    display: none;
  }

  .search {
    margin: 0 12px !important;

    .md-input__before {
      color: rgba($color: black, $alpha: 0.95);
      fill: rgba($color: black, $alpha: 0.95);
    }
    .md-input__after {
      width: 28px;
    }
    .md-input {
      height: 28px;
      width: 256px;
      background-color: transparent;
      border-color: rgba($color: black, $alpha: 0.5);
      font-size: 12px;
      padding-left: 30px;

      &::placeholder {
        color: rgba($color: black, $alpha: 0.95) !important;
      }
      &:hover {
        background-color: rgba($color: black, $alpha: 0.07) !important;
        border-color: rgba($color: black, $alpha: 0.7) !important;
      }
      &:focus {
        background-color: rgba($color: black, $alpha: 0.1) !important;
        border-color: rgba($color: black, $alpha: 0.9) !important;
        box-shadow: 0 0 0 3px $md-blue-50 !important;
      }
    }
  }

  .tit{
    display: flex;
    height: 40px;
    padding-left: 12px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .15);
    margin-bottom: 10px;
    box-sizing: border-box;
    user-select: none;

    .lb {
      font-size: 12px;
      line-height: 46px;
      opacity: .7;
    }
  }

  .tabs {
    display: flex;
    margin-bottom: -1px;

    .tab {
      font-size: 12px;
      height: 100%;
      margin-right: 20px;
      box-sizing: border-box;

      &.active{
        border-bottom: 2px solid black;

        .lb {
          opacity: 1.0;
        }
      }
    }
  }

  .itm{
    position: relative;
    display: flex;
    flex-direction: row;
    pointer-events: auto;
    cursor:default;
    height: 48px;;
    align-items: center;
  }
  .itm .thumb{
    @include flex;
    width: 54px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid rgba($color: #000000, $alpha: .15);
    margin-left: 10px;
    margin-right: 10px;
    pointer-events: none;
    flex-shrink: 0;

    .img {
      width: 34px;
      height: 22px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .itm .lb{
    text-align: left;
    pointer-events: none;
    flex-grow: 1;
    line-height: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
  .thumb1 .img{
    background-image: url(~@/assets/img/temp_paired_device1.png);
  }
  .thumb2 .img{
    background-image: url(~@/assets/img/temp_paired_device2.png);
  }
  .thumb3 .img{
    background-image: url(~@/assets/img/temp_paired_device4.png);
  }
  .thumb4 .img{
    background-image: url(~@/assets/img/temp_paired_device4.png);
  }
  .thumb5 .img{
    background-image: url(~@/assets/img/temp_paired_device5.png);
  }


  /* theme ----- dark */

}

.dark {
  .dropdown_device {
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
          color: rgba($color: white, $alpha: 0.95) !important;
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

    .tit{
      border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: .15);
    }

    .tabs {
      .tab {
        &.active{
          border-bottom: 2px solid white;
        }
      }
    }

    .itm .thumb{
      border: 1px solid rgba($color: #FFFFFF, $alpha: .15);
    }
  }

}

</style>
