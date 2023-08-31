<template>
	<div id='pop-streaming' v-show='popStreamingVisible' :class='[theme, {startview:!streamingIsOn, stopview:streamingIsOn}]'>
      <div v-if='!streamingIsOn'>
        <div class='title'>
          <span>Start Live Streaming</span>
          <div class='close' @click.stop='close'><wl-icon name='cancel-bold' size="12" /></div>
        </div>
        <div class='wrap'>
          <div class="cont" style="margin-bottom: 25px;">Where do you want to stream your meeting?</div>
          <div class="pill" @click="start">
            <svg class="ico" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.0069 0H0.993103C0.444628 0 0 0.444628 0 0.993103V17.0069C0 17.5554 0.444628 18 0.993103 18H9.62069V11.039H7.27759V8.31414H9.62069V6.30931C9.62069 3.98483 11.0421 2.71862 13.1152 2.71862C13.8138 2.7171 14.512 2.75232 15.2069 2.82414V5.25414H13.7793C12.6497 5.25414 12.4293 5.78793 12.4293 6.57621V8.31103H15.1293L14.7786 11.0359H12.4138V18H17.0069C17.5554 18 18 17.5554 18 17.0069V0.993103C18 0.444628 17.5554 0 17.0069 0Z" fill="#4267B2"/>
            </svg>
            Facebook Live
          </div>
          <div class="pill" @click="start">
            <svg class="ico" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :fill="theme === 'dark' ? 'white' : 'black'" fill-rule="evenodd" clip-rule="evenodd" d="M2.51937 7.44823H3.48909V6.01266H0.00317383V7.44823H1.00775V11.7613H0.041202L0.0255625 12.9677H3.51148L3.52712 11.7613H2.51937V7.44823ZM9.59895 7.87921C9.59895 6.19647 7.85599 6.01266 7.85599 6.01266H3.99613V7.44823H5.00071L5.0256 11.5418H4.05589V12.9774H7.84603C7.84603 12.9774 9.62384 12.8284 9.62384 11.0379C9.62384 10.0714 8.59437 9.57147 8.59437 9.57147C8.59437 9.57147 9.59895 8.98203 9.59895 7.87921ZM6.51233 11.7613H8.00177V10.3257H6.51233V11.7613ZM8.00177 8.88379H6.51233V7.44823H8.00177V8.88379ZM16.9669 7.44823L16.9657 11.5683L16.9669 11.7644L17.9703 11.5714V13.007H15.4509L15.4521 9.06443L13.9963 13.007H13.9615L12.4732 9.0771L12.472 13.0038H9.99068V11.5683H10.9604L10.9616 7.44823H9.95705V6.01266H12.7965L13.9659 9.3021L15.132 6.01266H17.9366V7.44823H16.9669Z" />
            </svg>
            IBM Video Streaming
          </div>
          <div class="divider"></div>
          <div class="cont" style="margin-bottom: 10px;">Choose this option if you have a streaming link from another streaming service. </div>
          <div class="pill">
            <wl-icon class="ico" name="streaming-bold" size="16" />
            Other streaming services
          </div>
        </div>
      </div>

      <div v-if='streamingIsOn'>
        <div class='title'>
          <span>Stop Live Streaming</span>
          <div class='close' @click.stop='close'><wl-icon name='cancel-bold' size="12" /></div>
        </div>
        <div class='wrap'>
          <div class="cont">Don you want to stop streaming the meeting to <b>IBM Cloud Video</b>?</div>
          <div class="bottom">
            <md-button size="32" aria-label="x" color="red" @click="stop" >Stop</md-button>
            <md-button size="32" aria-label="x" @click="close" :class="{'md-button--dark': theme === 'dark'}" >Continue Streaming</md-button>

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
        popStreamingVisible(){
            return this.$store.state.popStreamingVisible;
        },
        streamingIsOn(){
            return this.$store.state.streamingIsOn;
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
      
      close(){
          this.$store.commit('popStreamingVisible', false); 
      },
      start(){
          this.close(); 
          this.$store.commit('streamingIsOn', true); 
      },
      stop(){
          this.close(); 
          this.$store.commit('streamingIsOn', false); 
      },
    }

}
</script>

<style lang="scss">
#pop-streaming {
    position: absolute;
    
    background-color: #FFF;
    pointer-events: auto;
    border-radius: 4px;
    
    box-shadow: 0px 0px 1px rgba(0,0,0,0.2), 0px 4px 12px rgba(0,0,0,0.15);
  
    font-size: 14px;

    .wrap{
      overflow: hidden;
      padding: 20px 30px;
    }

    .title {
      position: relative;
      height: 50px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title span{
        font-weight: 600;
        text-align: center;
        font-size: 16px;
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

    .cont {
      color: $text-color-secondary-light-ui;
    }

    &.startview {
      width: 400px;
      height: 460px;
      
      left: calc((100% - 400px)/2);
      top: calc((100% - 460px)/2);

      .pill {
        width: 336px;
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 36px;
        margin-bottom: 10px;
        border: 1px solid $md-gray-20;
        border-radius: 16px;
        cursor: default;
      }
      .pill .ico{
        margin-right: 10px;
      }
      .divider{
        margin: 30px 0 30px 0;
        height: 1px;
        background: $md-gray-20;
      }
    }

    &.stopview {
      width: 352px;
      height: 204px;
      
      left: calc((100% - 352px)/2);
      top: calc((100% - 204px)/2);

      .title {
        width: auto;
        justify-content: flex-start;
        padding-left: 30px;
      }

      .bottom {
        display: flex;
        justify-content: flex-end;
        margin-top: 30px;
      }
      .bottom button {
        font-size: 14px;
        line-height: 14px;
      }
    }

    /* ------------------ drak ------------------ */

    &.dark {
      background: $md-gray-95;
      color: $text-color-primary-dark-ui;

      .cont {
        color: $text-color-primary-dark-ui;
      }

      &.startview {

        .pill {
          border: 1px solid $md-gray-30;
        }
        .divider{
          background: $md-gray-70;
        }
      }

    }

}
</style>