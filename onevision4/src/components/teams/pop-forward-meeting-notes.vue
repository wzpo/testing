<template>
    <div id="pop-forward-meeting-notes" :class="[os, theme]">
        <topbar-simple class="recording-player-titlebar" :buttons="['close', 'minimize', 'maximize']" @close="close" />
        <wl-hot :rect="{x:619,y:287,w:65,h:34}" @click.native="close" />

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
#pop-forward-meeting-notes {
    @include flex(column, flex-start, flex-start);
    width: 100%;
    height: 400px;
    pointer-events: auto;
    background-image: url(~@/assets/img/temp_forward_meeting_notes.svg);
    background-size: 685px 312px;
    background-repeat: no-repeat;
    background-position: 20px 50px;
    background-color: black;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);

    /* ------------------ drak ------------------ */

    &.dark {
        color: $text-color-primary-dark-ui;

    }

}
</style>
