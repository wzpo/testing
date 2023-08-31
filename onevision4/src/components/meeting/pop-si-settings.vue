<template>
	<div id='pop-si-settings' :class='[theme]'>

        <div class='title'>
            <span class="dragbg"></span>
            <span class="lb">Manage interpretation</span>
            <div class='close' @click.stop='close'>
                <wl-icon name='cancel-bold' size="16" />
            </div>
        </div>
        <div class='wrap'>
            <div class="tabs" >
                <div class="tab" :class="{active: tabid == 0}" @click="tabid=0">
                    <span class="lb">Simultaneous language</span>
                </div>
                <div class="tab" :class="{active: tabid == 1}" @click="tabid=1">
                    <span class="lb">Sign language</span>
                </div>
            </div>
            <div class="cont" :class="`img${tabid}`">

            </div>
            <div class="bottom">
                <md-button size="32" aria-label="x" class="md-button-solid" disabled >Apply</md-button>
                <md-button class="md-button-outline" size="32" aria-label="x" @click="close" >Cancel</md-button>

            </div>
        </div>

    </div>
</template>

<script>

export default {
    data() {
        return {
            tabid: 0,
        }
    },
    computed:{
        theme() {
          return this.$store.state.theme;
        },
        
    },
    mounted(){

    },
    watch: {

    },
    methods:{
      
      close(){
          this.$emit('close')
      },
    }

}
</script>

<style lang="scss">
#pop-si-settings {
    background-color: black;
    border: 1px solid rgba(255, 255, 255, .16);
    pointer-events: auto;
    height: 100%;

    .wrap{
      padding: 16px 20px;
    }

    .title {
      position: relative;
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

        .dragbg {
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .lb{
            font-weight: 600;
            font-size: 16px;
            padding-left: 16px;
            flex-grow: 1;
        }
        .close {
            width: 32px;
            height: 32px;
            pointer-events: auto;
            cursor: default;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 4px;
        }
    }

    .tabs {
        @include flex(row, flex-start);
        
        .tab {
            height: 28px;
            border-radius: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 12px;
            margin-right: 8px;
            pointer-events: auto;

            .lb {
                font-size: 14px;
                opacity: 0.7;
                transition: all 0.3s ease;
                pointer-events: none;
            }

            &:hover {
                background: rgba($color: #FFF, $alpha: 0.1);
                .lb {
                    opacity: 1; 
                }
            }
            &:active, &.active {
                background: rgba($color: #FFF, $alpha: 0.2);
                .lb {
                    opacity: 1; 
                }
            }
        }
    }

    .cont {
      width: 100%;
      height: 460px;
      background-position: center 12px;
      background-repeat: no-repeat;

      &.img0 {
        background-image: url(~@/assets/img/temp_si_setting_tab1.svg);
      }
      &.img1 {
        background-image: url(~@/assets/img/temp_si_setting_tab2.svg);
      }
    }

    .bottom {
        @include flex(row, flex-end);
    }


    /* ------------------ drak ------------------ */

    &.dark {
      color: $text-color-primary-dark-ui;

    }

}
</style>