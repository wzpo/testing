<template>
    <div class='whiteboard-container' :class="['light']">
        <div class="content">
            <!--Handtracking :dark="false" /-->
        </div>
        <div class="tools"></div>
        <div class="footer">
            <div class="lft">
                <md-button class="btn md-button-outline light btn-circle-32" disabled aria-label="x" :size="32">
                    <wl-icon name="undo-bold" size="16" color="gray-95" />
                </md-button>
                <md-button class="btn md-button-outline light btn-circle-32" disabled aria-label="x" :size="32">
                    <wl-icon name="redo-bold" size="16" color="black" />
                </md-button>
                <md-button class="btn md-button-outline light btn-circle-32" aria-label="x" :size="32">
                    <wl-icon name="download-bold" size="16" color="gray-95" />
                </md-button>
            </div>
            <div class="rgt">
                <div class="map">
                    <md-button class="md-button-solid gray btn-circle-28" aria-label="x" :size="28">
                        <wl-icon name="arrow-circle-up-bold" size="16" color="gray-95" />
                    </md-button>
                    <div class="divider-v"></div>
                    <md-button class="md-button-solid gray btn-circle-28" aria-label="x" :size="28">
                        <wl-icon name="fit-to-width-bold" size="16" color="black" />
                    </md-button>
                    
                    <div class="spacer" ></div>

                    <md-button class="md-button-solid gray btn-circle-28" aria-label="x" :size="28">
                        <wl-icon name="minus-bold" size="16" color="gray-95" />
                    </md-button>
                    <div class="zoomlb">100%</div>
                    <md-button class="md-button-solid gray btn-circle-28" aria-label="x" :size="28">
                        <wl-icon name="plus-bold" size="16" color="gray-95" />
                    </md-button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
//import Handtracking from '../shared/handtracking/handtracking.vue';


export default {
    props: {
        showMap: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {};
    },
    computed: {
        os() {
            return this.$store.state.os;
        },
        theme() {
            return this.$store.state.theme;
        },
    },
    mounted() {
    },
    watch: {},
    methods: {
        close() {
            this.$emit("close");
        },
    },
    //components: { Handtracking }
}
</script>
  
  
<style lang="scss" >
.whiteboard-container {
    position: relative;
    @include flex(column);
    flex-grow: 1;
    width: 100%;
    background-color: rgba($color: #f5f5f5, $alpha: 1.0);

    .footer {
        position: absolute;
        @include flex(row, space-between);
        height: 40px;
        width: 100%;
        bottom: 16px;

        .lft {
            width: 30%;
            height: 100%;
            margin-left: 16px;
            @include flex(row, flex-start);

            .btn {
                margin-right: 8px;
            }
        }

        .rgt {
            width: 30%;
            height: 100%;
            position: relative;
            @include flex(row, flex-end);
            margin-right: 16px;

            .map {
                position: absolute;
                @include flex;
                bottom: 4px;
                right: 0;
                @include flex;
                width: 205px;
                height: 40px;
                box-sizing: border-box;
                border: 1px solid rgba($color: #000000, $alpha: .16);
                border-radius: 8px;
                background-color: white;
                padding: 0 8px;
                filter: drop-shadow(0px 3.06058px 6.12116px rgba(0, 0, 0, 0.16)) drop-shadow(0px 0px 0.765145px rgba(0, 0, 0, 0.16));

                .zoomlb {
                    font-size: 14px;
                    margin: 0 8px;
                }
            }
        }
    }

    .content {
        @include flex;
        position: relative;
        width: 100%;
        height: 100%;
        flex-grow: 1;
    }

    .tools {
        @include flex;
        position: absolute;
        left: 16px;
        top: calc((100% - 260px)/2);
        width: 39px;
        height: 260px;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url(~@/assets/img/whiteboard-tools.svg);
    }

    .btn-circle-32 {
        width: 32px;
        height: 32px;
        min-width: 0;
        background-color: white;
        flex-shrink: 0;
    }
    .btn-circle-28 {
        width: 28px;
        height: 28px;
        min-width: 0;
        background-color: white;
        flex-shrink: 0;
    }

    .divider-v {
        width: 1px;
        height: 24px;
        background-color: rgba($color: #000000, $alpha: .3);
        margin: 0 8px;
    }
    .spacer {
        flex-grow: 1;
    }

   


}
</style>
  