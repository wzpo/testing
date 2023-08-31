<template>
    <div id="pop-chapter-share" :class="[os, theme]">
        <wl-hot :rect="{x:463,y:2,w:46,h:44}" @click.native="close" />
        <wl-hot :rect="{x:243,y:323,w:122,h:34}" @click.native="close" />

    </div>
</template>

<script>

export default {
    props: [

    ],

    data() {
        return {

        };
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
    watch: {

    },
    methods: {

        close() {
            this.$emit("close");
        },

    }
};
</script>

<style lang="scss">
#pop-chapter-share {
    @include flex(column);
    width: 100%;
    height: 376px;
    pointer-events: auto;
    box-sizing: border-box;
    background-image: url(~@/assets/img/temp_chapter_share.svg);
    background-size: 512px 376px;

    /* ------------------ drak ------------------ */

    &.dark {
        color: $text-color-primary-dark-ui;

    }

}
</style>
