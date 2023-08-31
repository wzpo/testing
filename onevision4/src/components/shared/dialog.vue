<template>
    <div class="dialog" :class="[theme]" :style="{
        background: `${themeColorList[theme][themeColor]['bg']}`,
    }">
        <div class="wrap">
            <topbar-simple :title="topbarTitle" :buttons="['close']" :titleStyle="{ marginLeft: '10px', }" class="topbar" @close="close" />

            <div class="ptitle">{{title}}</div>
            <div class="pcont">{{message}}</div>
            <div class="btns">
                <md-button 
                    v-for="(btn, idx) in buttons"
                    :key="`btn${idx}`"
                    class="btn" 
                    :class="btn.class"
                    aria-label="x" 
                    :size="32" 
                    @click="() => {
                        if (btn.func) {
                            btn.func()
                        }
                        close()
                    }"
                >
                    {{btn.title}}
                </md-button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        topbarTitle: {
            type: String,
            default: '',
        },
        title: {
            type: String,
        },
        message: {
            type: String,
        },
        buttons: {
            type: Array,
            default: () => {
                return [
                    {
                        title: 'Yes',
                        class: 'md-button-solid2',
                        func: () => { },
                    },
                    {
                        title: 'No',
                        class: 'md-button-outline',
                        func: () => { },
                    },
                ]
            }
        },
    },

    data() {
        return {

        };
    },
    computed: {
        theme() {
            return this.$store.state.theme;
        },
        themeColor() {
            return this.$store.state.themeColor;
        },
        themeColorList() {
            return this.$store.state.themeColorList;
        },
        os() {
            return this.$store.state.os;
        },
    },
    mounted() {

    },
    destroyed() {

    },
    methods: {
        close() {
            this.$emit("close");
        },

    }
};
</script>

<style lang="scss" scoped>
.dialog {
    width: 100%;
    pointer-events: auto;
    user-select: none;
    box-sizing: border-box;
    border: 1px solid rgba($color: #FFFFFF, $alpha: .2);

    .wrap {
        text-align: center;
        display: flex;
        flex-direction: column;

        .ptitle {
            width: 100%;
            font-weight: bold;
            padding: 10px 20px;
            text-align: left;
            font-size: 15px;
        }

        .pcont {
            width: 100%;
            padding: 0 20px;
            line-height: 20px;
            text-align: left;
            font-size: 14px;
        }

        .btns {
            @include flex(row, flex-end);
            margin: 20px 0;
            padding: 0 20px;

            .btn {
                min-width: 0;
                padding: 0 16px;
                margin-left: 8px;
                font-weight: 600;
            }
        }
    }

    &.dark {
        color: $text-color-primary-dark-ui;
    }

}
</style>
