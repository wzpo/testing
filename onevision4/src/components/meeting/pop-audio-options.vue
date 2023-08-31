<template>
	<div id='pop_audio_options' :class="[theme]">
      <div class='title'>
          <span>{{!devicePaired ? 'Audio Connection' : 'Switch Audio Connection'}}</span>
          <div class='close' v-on:click.stop='close'><wl-icon name='cancel-bold' size="12" style="opacity: 0.6" /></div>
      </div>
      <div class="cnned" v-if="!devicePaired">

        <div class="img" :class="audioType"></div>

        <div class='tit'>
          <span v-if="audioType === 'pc'">You are using computer for audio</span> 
          <span v-if="audioType === 'callme'">We’re calling you at +1 408-123-4567</span> 
          <span v-if="audioType === 'callin'">You’re calling in</span> 
          <span v-if="audioType === 'none'">You’re not connected to audio</span> 
          <wl-icon v-if="audioType === 'pc'" name='settings-bold' size="14" class='ico_gear' />
        </div>

        <md-button v-if="audioType !== 'none'" aria-label="Disconnect" color="red" style="margin-bottom: 20px; font-size: 14px;" @click="disconnect">Disconnect</md-button>

      </div>

      <div class='wrap audio_options'>
          <div class='tit' v-if="!devicePaired" >{{audioType !== 'none' ? 'Switch Audio' : 'Audio Options'}}</div>
          <div class='tit paired' v-if="devicePaired" >When you switch to one of the following audio connection options, you'll disconnect from your video system.</div>
          <div class='dlist'>

            <div class='itm' v-if=" audioType !== 'pc' " >
              <wl-icon name='headset-bold' size="20" class="ico" />
              <span class="lb">Use computer for audio <wl-icon name='settings_14' class="arrow" style="margin-left: 5px;" /></span>
              <md-button class="btn" aria-label="x" color="blue-50" size="28" @click="connect('pc')">{{audioType === 'none' || devicePaired ? 'Connect' : 'Switch'}}</md-button>
            </div>

            <div class='itm' v-if=" audioType !== 'callme' " >
              <div class="rw">
                <div class="col">
                  <wl-icon name='incoming-call-legacy-bold' size="20" class="ico" />
                  <span class="lb">Call me at <span class="combobox"><span class="clb">+1 (408) 123-4567</span> <span class="arrow"><wl-icon name='arrow-down-filled' size="12" /></span></span></span>
                  <md-button class="btn" aria-label="x" color="blue-50" size="28" @click="connect('callme')">{{audioType === 'none' || devicePaired ? 'Connect' : 'Switch'}}</md-button>
                </div>

                <div class="checkbox">
                  <wl-icon name='stop-bold' size="16" color="gray-30" style="margin-right: 5px;" />
                  Connect to audio without pressing <b style="margin: 0 4px;">1</b> on my phone
                </div>
              </div>
              
            </div>

            <div class='itm' v-if=" audioType !== 'callin' " >
              <wl-icon name='outgoing-call-legacy-bold' size="20" class="ico" />
              <span class="lb">Call In</span>
              <md-button class="btn" aria-label="x" color="blue-50" size="28" >View</md-button>
            </div>

          </div>

        </div>

    </div>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    computed:{
        theme() {
          return this.$store.state.theme;
        },
        audioConnected(){
            return this.$store.state.audioConnected;
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
    },
    mounted(){

    },
    watch: {

    },
    methods:{
      connect(type){
          this.$store.commit('audioConnected', true);
          this.$store.commit('audioType', type);

          this.$store.commit('devicePaired', false);
          this.$store.commit('devicePairedName', null);

          //this.$store.commit('tipConnectingVisible', true);
          setTimeout(() => {
            //this.$store.commit('tipConnectingVisible', false);
          }, 3000);

          this.close();
      },
      disconnect(){
          this.$store.commit('audioConnected', false);
          this.$store.commit('audioType', 'none');
          this.close();
      },
      close(){
          this.$emit('close'); 
      },
    }

}
</script>

<style lang="scss">
#pop_audio_options {
    width: 100%;
    pointer-events: auto;

  

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

    .cnned {
      display: flex;
      flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .cnned .img{
      width: 100px;
      height: 65px;
      margin: 40px 0 20px 0;
    }
    .cnned .img.pc {
      background: url(~@/assets/img/audio-pc.svg) no-repeat center;
    }
    .cnned .img.callme {
      background: url(~@/assets/img/audio-callme.svg) no-repeat center;
    }
    .cnned .img.callin {
      background: url(~@/assets/img/audio-callin.svg) no-repeat center;
    }
    .cnned .img.none {
      background: url(~@/assets/img/audio-none.svg) no-repeat center;
    }

    .cnned .tit{
      font-weight: 600;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .ico_gear {
      margin-left: 5px;
    }

    .audio_options .close{
      position: absolute;
      width: 16px;
      height: 16px;
      top: 12px;
      right: 12px;

      pointer-events: auto;
      cursor: default;
    }
    .audio_options .tit{
      color:#6A6B6C;
      height: 40px;
      font-size: 12px;
      padding-left: 20px;
      text-align: left;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .audio_options .tit.paired{
      margin: 25px 20px 10px 20px;
      border: none;
    }
    .audio_options .dlist{
      margin: 0 20px 20px 20px;
    }
    .audio_options .itm{
      display: flex;
      flex-direction: row;
      pointer-events: auto;
      cursor:default;
      min-height: 56px;
      align-items: center;
      border-radius: 4px;
      padding: 10px 0;
    }
    .audio_options .itm .lb{
      flex-grow: 1;
      display: flex;
      text-align: left;
      pointer-events: none;
      align-items: center;
    }
    .audio_options .itm .btn{
      display: none;
      font-size: 14px;
      line-height: 14px;
      height: 26px;
      margin-right: 12px;
      text-align: center;
    }
    .audio_options .itm:hover{
      background: rgba(4,159,217,.08);
    }
    .audio_options .itm:hover .btn{
      display: block;
    }
    .audio_options .itm .ico{
      margin: 0 10px 0 20px;
    }
    .audio_options .itm .col{
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .audio_options .itm .rw{
      display: flex;
      flex-direction: column;
      width: 100%;
      
    }
    .audio_options .itm .combobox{
      margin: 0 0 0 15px;
      border: 1px solid rgba(0,0,0,0.1);
      background: rgba(0,0,0,0.04);
      border-radius: 4px;
      font-size: 14px;
      width: 180px;
      height: 32px;
      display: flex;
      align-items: center;
    }
    .audio_options .itm .combobox .clb{
      flex-grow: 1;
      margin-left: 5px;
    }
    .audio_options .itm .combobox .arrow{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      width: 32px;
      margin: 0 0 0 3px;
      border-left: 1px solid rgba(0,0,0,0.1);
    }

    .audio_options .itm .checkbox{
      display: flex;
      align-items: center;
      font-size: 12px;
      margin: 3px 0 0 46px;
    }


    /* ------------------ drak ------------------ */

    &.dark {
      color: $text-color-primary-dark-ui;
    }
    &.dark .title {
        background: $md-gray-80;
        border-bottom: 1px solid $md-gray-70;
    }

    &.dark .audio_options .tit{
      color:$text-color-secondary-dark-ui;
      border-bottom: 1px solid $md-gray-80;
    }
    &.dark .audio_options .itm:hover{
      background: $md-gray-90;
    }
    &.dark .audio_options .itm .combobox{
      border: 1px solid $md-gray-80;
      background: transparent;
    }
    &.dark .audio_options .itm .combobox .arrow{
      border-left: 1px solid $md-gray-80;
    }
    &.dark .cnned .img.pc {
      background: url(~@/assets/img/audio-pc-dark.svg) no-repeat center;
    }
    &.dark .cnned .img.callme {
      background: url(~@/assets/img/audio-callme-dark.svg) no-repeat center;
    }
    &.dark .cnned .img.callin {
      background: url(~@/assets/img/audio-callin-dark.svg) no-repeat center;
    }
    &.dark .cnned .img.none {
      background: url(~@/assets/img/audio-none-dark.svg) no-repeat center;
    }
}


</style>