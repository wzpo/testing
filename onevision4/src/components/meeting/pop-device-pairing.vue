<template>
	<div id='pop_device_pairing' :class='[theme, {pairedHeight:devicePaired}]'>
    <div class='title'>
        <span>Connect to a Device</span> <wl-icon name='help-circle-bold' size="12" />
        <div class='backbtn' v-show='videoAddressView' v-on:click='closeSearchDevice'><wl-icon name='arrow-left-filled' size="12" /></div>
        <div class='close' v-on:click.stop='close'><wl-icon name='cancel-bold' size="8" style="opacity: 0.6" /></div>
    </div>
    <div v-if='!devicePaired'>
      <div class='wrap device_menu'>
          <div class='nearby_device' v-show='!videoAddressView'>
            <div class='tit'>Nearby Devices</div>
            <div class='dlist'>
              <div class='itm menuitm' @click='selectDevice("SHN7-17-APR5")'>
                  <div class='thumb thumb4' ></div>
                  <span class="lb">SHN7-17-APR5</span>
                  <!--div class='btn_call uibutton green s24' v-on:click='selectDevice("Queenshead")'>Call</div-->
                </div>
            </div>
          </div>

          <div class='box' v-show='videoAddressView'>
            <div class='uiinput pill'
            ></div>
          </div>

          <div class='tit'><span>{{videoAddressView ? 'Recent Devices' : 'Saved Devices'}}</span>
            <wl-icon name='settings-bold' size="14" class='ico_gear' />
          </div>
          <div class='dlist'>

            <div class='itm menuitm' @click='selectDevice("Design Studio")'>
              <div class='thumb' ></div>
              <span class="lb">Design Studio</span>
              <!--div class='btn_call uibutton green s24' v-on:click='selectDevice("Design Studio")'>Call</div-->
            </div>

            <div class='itm menuitm'>
              <div class='thumb' @click='selectDevice("Toyshop")'></div>
              <span class="lb">Toyshop</span>
              <!--div class='btn_call uibutton green s24' v-on:click='selectDevice("Toyshop")'>Call</div-->
            </div>

          </div>

          <div class='sec_search' v-show='!videoAddressView'>
            <div class='uiinput pill' v-on:click='searchDevice'>Enter a video address</div>
          </div>
          <div class='call_vs' v-show='!videoAddressView'>Call in from a video system</div>

        </div>
      </div>
      <div v-if='devicePaired' class='paired'>
        <div class='thumb'></div>
        <div class='name'>{{devicePairedName}}</div>
        <md-button aria-label="b" class="uibutton" :class="{'md-button--dark': theme === 'dark'}" v-on:click='selectDifferentDevice'>Use a Different Device</md-button>
        <md-button aria-label="b" class="uibutton" color="red" v-on:click='disconnectDevice'>Disconnect</md-button>
      </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            videoAddressView: false,
        }
    },
    computed:{
        theme() {
          return this.$store.state.theme;
        },
        audioType(){
            return this.$store.state.audioType;
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
    },
    mounted(){

    },
    watch: {

    },
    methods:{
      selectDevice(name) {
        this.$store.commit('devicePaired', true);
        this.$store.commit('devicePairedName', name);

        this.$store.commit('audioConnected', false);
        this.$store.commit('audioType', 'none');

        this.close();
      },
      selectDifferentDevice() {
        this.$store.commit('devicePaired', false);
      },
      disconnectDevice() {
        this.$store.commit('devicePaired', false);
        this.$store.commit('devicePairedName', null);
        this.close();
      },
      searchDevice() {
        this.videoAddressView = true;
      },
      closeSearchDevice() {
        this.videoAddressView = false;
      },
      close(){
          this.$emit('close');
      },
    }

}
</script>

<style lang="scss">
#pop_device_pairing {
    width: 100%;
    height: 100%;
    pointer-events: auto;
    overflow: hidden;
  

    .wrap{
      overflow: hidden;
    }
    .title {
      position: relative;
      height: 50px;
      width: 100%;
      background: rgba(0,0,0,0.04);
      border-bottom: 1px solid rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      overflow: hidden;
    }
    .title span{
        font-weight: 600;
        text-align: center;
        font-size: 16px;
        margin-right: 5px;
    }
    .title .close {
        position: absolute;
        width: 16px;
        height: 16px;
        top: 8px;
        right: 8px;
        pointer-events: auto;
        cursor: default;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ico_gear {
      margin-right: 20px;
    }

    .backbtn{
      position: absolute;
      left: 0;
      top: 6px;
      width:40px;
      height: 40px;
      pointer-events: auto;
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .device_menu .close{
      position: absolute;
      width: 16px;
      height: 16px;
      top: 12px;
      right: 12px;

      pointer-events: auto;
      cursor: default;
    }
    .device_menu .tit{
      color:#6A6B6C;
      height: 40px;
      font-size: 12px;
      line-height: 46px;
      padding-left: 20px;
      text-align: left;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .device_menu .itm{
      display: flex;
      flex-direction: row;
      pointer-events: auto;
      cursor:default;
      height: 48px;;
      align-items: center;
    }
    .device_menu .itm:hover .btn_call{
      display: block;
    }
    .device_menu .itm .btn_call{
      padding: 0 14px;
      position: absolute;
      right: 20px;
      display: none;
    }
    .device_menu .itm .thumb{
      width: 62px;
      height: 38px;
      border-radius: 3px;
      border: 1px solid rgba(0,0,0,0.1);
      background-position: center;
      background-repeat: no-repeat;
      background-color:#FFF;
      margin-left: 10px;
      margin-right: 10px;
      pointer-events: none;

    }
    .device_menu .itm .lb{
      text-align: left;
      pointer-events: none;
    }
    .device_menu .itm .lb_disconnect{
      text-align: right;
      color: #F5483F;
      cursor: default;
      position: absolute;
      right: 12px;
      top: 15px;
    }
    .device_menu .ico_help{
      position: absolute;
      width: 20px;
      height: 20px;
      right: 10px;
      top: 8px;

    }

    .sec_search{
      height: 56px;
      border-top: 1px solid rgba(0,0,0,0.08);
      justify-content: center;
      margin-top: 10px;
      pointer-events: auto;
    }

    .sec_search,
    .box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sec_search .uiinput,
    .box .uiinput{
      align-self: center;
      width: 312px;
      height: 32px;
      line-height: 32px;
      border-radius: 16px;
      pointer-events: auto;
      cursor: default;
      text-align: center;
      background-color: rgba(41, 41, 41, .12);
      font-size: 14px;
    }

    .box .uiinput{
      margin-top: 20px;
      
      background-position: 12px center;
      background-repeat: no-repeat;
    }

    .page_search .box{
      height: 56px;
      padding: 0 10px;
      margin-bottom: 10px;
      justify-content: center;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .call_vs{
      text-align: center;
      color: #049FD9;
      font-size: 14px;
    }

    .pairedHeight{
      height: 378px;
    }
    .paired{
      text-align: center;
        display: flex;
        flex-direction: column;
        padding-top: 60px;
    }
    .paired .thumb{
      width: 114px;
      height: 72px;
      background-position: center;
      background-repeat: no-repeat;
      align-self: center;
      margin-bottom: 12px;
      background-size: contain;
    }
    .paired .name{
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 60px;
    }
    .paired .uibutton{
      margin: 0 0 10px 0;
      width: 250px;
      align-self: center;
    }


    /* ------------------ drak ------------------ */

    &.dark {
      color: $text-color-primary-dark-ui;
    }

    &.dark .title {
      background: $md-gray-80;
      border-bottom: 1px solid $md-gray-70;
    }
    &.dark .device_menu .tit{
      color:$text-color-secondary-dark-ui;
      border-bottom: 1px solid $md-gray-80;
    }
    &.dark .device_menu .itm .thumb{
      background-color: $md-gray-90;
    }

    &.dark .sec_search{
      border-top: 1px solid $md-gray-80;
    }

    &.dark .sec_search .uiinput,
    &.dark .box .uiinput{
      background-color: $md-gray-80;
    }

    &.dark .page_search .box{
      border-bottom: 1px solid $md-gray-80;
    }
}
</style>