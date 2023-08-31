<template>
      <div 
        class="empty " 
        :class="[theme]"
        :style="{
          background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
          borderTopRightRadius: teamsSidecarName && !gptPanelPopouted || meetingsSidecarVisible ? '12px' : '0',
        }"
      >

        <div class="logo">

        </div>
  
      </div>

  </template>
  
  <script>
  
  export default {
      props:[

      ],
      data() {
          return {

          }
      },
      computed:{
        theme() {
          return this.$store.state.theme;
        },
        themeColor() {
          return this.$store.state.themeColor;
        },
        themeColorList() {
          return this.$store.state.themeColorList;
        },
        me() {
          return this.$store.getters.me;
        },
        teamsSidecarName() {
          return this.$store.state.teamsSidecarName;
        },
        gptPanelPopouted() {
          return this.$store.state.gptPanelPopouted;
        },
        meetingsSidecarVisible() {
          return this.$store.state.meetingsSidecarVisible;
        },
      },
      mounted(){

        
      },
      destroyed() {

      },
      watch: {
  
      },
      methods:{
  
      }
  }
  </script>
  
  
  <style lang="scss">
  
  .empty {
    @include flex;
    width: 100%;
    height: 100%;
    border-radius: 12px 0 0px 0px;

    .logo {
        @include flex;
        width: 128px;
        height: 128px;
        background: url(~@/assets/img/webex-logo.svg) no-repeat;
    }
    
  }

  </style>
  