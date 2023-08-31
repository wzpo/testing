<template>
	<div id='interpretation-setting-sign' :class='[theme]'>

        <div class='title'>
            <span class="lb">Interpretation</span>
            <div class='close' @click.stop='close'>
                <wl-icon name='cancel-bold' size="16" />
            </div>
        </div>
        <div class='wrap'>
            <div class="line1">
                <wl-icon name="unread-filled" size="12" color="#27A17A" class="ico" />
                Your language channel
            </div>
            <div class="line2">
                {{me.lang}}
            </div>
            <div class="line3">
                <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="handtonext">Hand off to next</md-button>
            </div>
            
            <div class='divider-b' ></div>

            <div class='itm' >
                <wl-icon 
                name="arrow-right-bold"
                :color=" theme === 'dark' ? 'white-95' : 'black-95' "
                size="12"
                />
                <span class="lb">Other controls</span>

            </div>
        </div>

    </div>
</template>

<script>
import dialog from '../shared/dialog.vue';

export default {
    data() {
        return {

        }
    },
    computed:{
        theme() {
          return this.$store.state.theme;
        },
        me() {
          return this.$store.getters.me;
        },
        
    },
    mounted(){

    },
    watch: {

    },
    methods:{
        showDialog(title, message, buttons, parentSelector) {
            var dgwidth = 400
            var dgheight = 188
            var parentel = document.querySelector(parentSelector)
            var rect = parentel.getBoundingClientRect()
            var top = rect.top + (rect.height - dgheight)/2
            var left = rect.left + (rect.width - dgwidth)/2

            this.$modal.show(
            dialog, 
            {
                topbarTitle: 'Webex',
                title: title,
                message: message,
                buttons: buttons,
            }, // component props
            {
                clickToClose: false,
                frameless: false,
                shadow: true,
                resizable: false,
                draggable: '.dialog .topbar',
                overlayVisible: true,
                overlayTransparent: 0,
                theme: this.theme,
                roundedCorner: this.os === 'mac',
                width: dgwidth,
                height: 'auto',
                center: false,
                top: top,
                left: left,
                transition: true,
            }, // modal props
            {
                closed: () => {  }
            } // modal eventlistener
            );
        },
      
        handtonext(){
            this.showDialog(
                `Hand off to next Sign language interpreter`, 
                `Do you want to hand off the interpretation to the next Sign language interpreter? `,
                [
                {
                    title: 'Send request',
                    class: 'md-button-solid2',
                    func: () => {
                        
                    },
                },
                {
                    title: 'Cancel',
                    class: 'md-button-outline',
                    func: () => { },
                },
                ],
                `#desktop`)
                
            this.close()
        },

        close(){
            this.$emit('close')
        },

    }

}
</script>

<style lang="scss">
#interpretation-setting-sign {
    background-color: black;
    border: 1px solid rgba(255, 255, 255, .16);
    pointer-events: auto;
    width: 280px;
    height: 100%;

    .wrap{
        @include flex(column);
        padding: 8px;
      
        .line1 {
            @include flex;
            font-size: 14px;
            margin: 8px 0 16px 0;

            .ico {
                margin-right: 8px;
            }
        }

        .line2 {
            @include flex;
            height: 40px;
            width: 240px;
            background: #1C1C1C;
            border-radius: 100px;
            margin-bottom: 20px;
            
        }
        .line3{
            .btn {
                width: 240px;
                font-size: 16px;
            }
        }
    }

    .title {
      position: relative;
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

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

    .divider-b {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        margin-top: 12px;
        margin-bottom: 8px;
        width: 100%;
    }

    .itm{
        transition: all 0.2s ease-out;
        width: 100%;
        height: 32px;
        cursor: default;
        user-select: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 8px;
        padding: 0 15px;

        .lb{
            font-size: 12px;
            font-weight: 600;
            pointer-events: none;
            padding-left: 12px;
            flex-grow: 1;
            opacity: .95;
        }

        &:hover {
        background: rgba($color: #FFFFFF, $alpha: 0.1);
        }
        &:active {
        background: rgba($color: #FFFFFF, $alpha: 0.2);
        }
    }


    /* ------------------ drak ------------------ */

    &.dark {
      color: $text-color-primary-dark-ui;

    }

}
</style>