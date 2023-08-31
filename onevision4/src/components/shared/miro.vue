<template>
    <div 
      class='miro-iframe' 
      :class="[theme]"
    >
        <!--iframe 
          class="frame"
          src="https://miro.com/app/live-embed/o9J_le67dL8=/?moveToViewport=-717,-444,1533,755" 
          frameBorder="0" 
          scrolling="no" 
          allowFullScreen
        ></iframe-->
    </div>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    computed:{
      os() {
        return this.$store.state.os;
      },
      theme() {
        return this.$store.state.theme;
      },
      miroLocation() {
        return this.$store.state.miroLocation;
      },
    },
    mounted(){
      
    },
    watch: {

    },
    methods:{

    }
}
</script>


<style lang="scss">
.miro-iframe {
  display: flex;
  flex-grow: 1;
  background: url(~@/assets/img/miro.png) no-repeat;
  background-size: 1350px 695px;
  background-position: -2px 0;

  .frame {
    display: flex;
    flex-grow: 1;
  }

  /* theme ----- dark/hybrid */

}

</style>
