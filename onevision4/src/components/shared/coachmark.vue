<template>
    <div class="coachmark" :style="{maxWidth: maxWidth}" >
        <div v-if="closable" class="close" @click="close">
            <wl-icon name="cancel-bold" size="16" :color="theme == 'light' ? 'black' : 'white'" />
        </div>
        <div v-if="title" class="title">
            <wl-icon v-if="icon" :name="icon" size="20" :color="iconColor" class="ico" />
            {{title}}
        </div>
        <div class="content" v-html="content"></div>
        <div v-if="button || subtext" class="bottom" :style="{justifyContent: buttonJustifyContent}">
            <md-button 
                v-if="button"
                class="btn "
                :class="[theme, buttonClass]" 
                aria-label="x" 
                :size="28" 
                @click="() => {
                    if (button.func) {
                        button.func()
                    }
                    close()
                }"
            >
                {{button.label}}
            </md-button>

            <div v-if="subtext" class="subtext">{{ subtext }}</div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        theme: {
            type: String,
            default: 'light', //light, dark
        },
        closable: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: String,
        },
        iconColor: {
            type: String,
            default: 'black',
        },
        maxWidth: {
            type: String,
            default: '308px',
        },
        title: {
            type: String,
        },
        content: {
            type: String,
        },
        subtext: {
            type: String,
        },
        buttonJustifyContent: {
            type: String,
            default: 'space-between',
        },
        buttonClass: {
            type: String,
            default: 'md-button-solid',
        },
        button: {
            type: Object,
            default: () => {
                return {
                    label: 'Yes',
                    func: () => { },
                }
            }
        },
    },

    data() {
        return {

        };
    },
    computed: {
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
.coachmark {
    position: relative;
    width: 100%;
    pointer-events: auto;
    user-select: none;
    box-sizing: border-box;
    padding: 12px;

    .title {
        @include flex(row, flex-start);
        width: 100%;
        font-weight: bold;
        padding: 0 20px 8px 0;
        text-align: left;
        font-weight: 700;
        font-size: 16px;

        .ico {
            margin-right: 8px;
        }
    }

    .close {
        @include flex;
        position: absolute;
        width: 16px;
        height: 16px;
        top: 12px;
        right: 12px;
    }

    .content {
        width: 100%;
        line-height: 24px;
        text-align: left;
        font-size: 16px;
    }

    .bottom {
        display: flex;
        align-items: center;
        margin-top: 16px;

        .btn {
            min-width: 0;
            padding: 0 10px;
            font-weight: 600;
        }

        .subtext {
            font-size: 14px;
            text-align: right;
            color: rgba(0, 0, 0, 0.6);
        }
    }

}
</style>
