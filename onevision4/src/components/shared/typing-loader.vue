<template>
    <div class="typing-loader" :class="[theme]">
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    computed: {
        theme() {
            return this.$store.state.theme;
        },
    },
    mounted() {

    },
    watch: {

    },
    methods: {

    }
}
</script>


<style lang="scss">
.typing-loader {
    $animationTime: 0.8s;
    $dotSize: 8px;

    @include flex(row, flex-start);

    span {
        display: inline-block;
        vertical-align: middle;
        width: $dotSize;
        height: $dotSize;
        margin-right: 2px;
        background: black;
        border-radius: $dotSize;
        animation: loader $animationTime infinite alternate;
    }

    span:nth-of-type(2) {
        opacity: 0;
        animation-delay: 0.2s;
    }

    span:nth-of-type(3) {
        opacity: 0;
        animation-delay: 0.6s;
    }

    @keyframes loader {
        0% {
            opacity: 0.9;
            transform: scale(0.5);
        }

        100% {
            opacity: 0.1;
            transform: scale(1);
        }
    }

    &.dark {
        span {
            background: white;
        }
    }
}
</style>
