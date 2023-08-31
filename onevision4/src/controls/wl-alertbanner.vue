<template>
    <div v-if="show" class="alertbanner" :class="[theme, `type-${type}`, {narrow: narrow,}]" :style="{backgroundColor: colors[type].bg}">
        <wl-icon v-if="icon" :name="icon" size="16" :color="colors[type].content" class="ico" />
        <div class="content" v-html="content" :style="{color: colors[type].content}"></div>
        <md-button v-if="button" class="btn md-button-outline" aria-label="x" :size="28" @click="btnhandler">{{ button.label }}</md-button>
        <div v-if="closeButtonVisible" class="btnx" @click="close">
            <wl-icon name="cancel-bold" size="16" :color="colors[type].content" />
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        type: {
            type: String,
            default: 'info',
        },
        icon: {
            type: String,
        },
        content: String,
        show: Boolean,
        narrow: Boolean,
        closeButtonVisible: {
            type: Boolean,
            default: true,
        },
        button: {
            type: Object,
            // {
            //    label: String
            //    func: Function
            // }
        },
    },
    data() {
        return {
            colors: {
                info: {
                    bg: '#0A274A',
                    content: '#64B4FA',
                },
            },
        };
    },
    computed: {
        theme() {
            return this.$store.state.theme;
        },
        styleObject() {
            return {
                '--size': `${this.size}px`,
            };
        },
    },
    mounted() { },
    watch: {},
    methods: {
        btnhandler() {
            if (this.button && this.button.func) {
                this.button.func()
            }
            this.close()
        },
        close() {
            this.$emit('close')
        },
    }
};
</script>
  
<style lang="scss">
.alertbanner {
    position: relative;
    display: flex;
    flex-direction: row;
    pointer-events: auto;
    justify-content: center;
    align-items: center;
    padding: 0 36px;
    border-radius: 16px;
    min-height: 34px;
    font-size: 16px;

    .ico {
        margin-right: 8px;
        min-width: 16px;
    }

    &.narrow {
        padding: 0 4px 0 12px;
        .content {
            flex-grow: 1;
        }
    }

    .btn {
        margin-left: 12px;
        cursor: default;
        color: #fff;
        
        span {
            font-size: 14px;
            font-weight: 600;
            padding: 0 10px;
        }
    }

    .btnx {
        position: absolute;
        @include flex;
        width: 16px;
        height: 16px;
        right: 8px;
        top: 9px;
    }

    &.type-info {
        .label {
        }

        .btn {
        }
    }

    


}</style>
  