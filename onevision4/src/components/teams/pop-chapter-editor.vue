<template>
    <div id="pop-chapter-editor" :class="[os, theme]">
        <topbar-simple class="titlebar" :buttons="['close', 'minimize', 'maximize']" @close="close" />
        <div class="content">
            <div class="tt">Edit Chapter</div>
            <div class="des">You can list chapters by timestamp and title. </div>
            <textarea rows="4" ref="textarea" ></textarea>
            <div class="btns">
                <md-button class="btn md-button-solid" aria-label="x" :size="28" @click="close" >Save</md-button>
                <md-button class="btn md-button-outline" aria-label="x" :size="28" @click="close" >Cancel</md-button>
            </div>
        </div>

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
        this.$refs.textarea.value = 
            '0:00:00 Intro' + '\r\n' + 
            '00:14:00 Show and Share' + '\r\n' + 
            '00:18:00 Stand up' + '\r\n' + 
            '00:26:00 Feedback';
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
#pop-chapter-editor {
    @include flex(column);
    width: 100%;
    pointer-events: auto;
    box-sizing: border-box;
    background: black;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);

    .content {
        @include flex(column, flex-start, flex-start);
        flex-grow: 1;
        width: 100%;
        padding: 12px 40px 40px;

        .tt {
            font-weight: 600;
            font-size: 26px;
            margin-bottom: 10px;
        }
        .des {
            margin-bottom: 8px;
        }
        textarea {
            width: 100%;
            font-size: 16px;
            padding: 12px;
            cursor: text;
            color: rgba($color: white, $alpha: 0.95);
            resize: none;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.11);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 8px;
            margin-bottom: 40px;

            ::placeholder {
                color: rgba($color: white, $alpha: 0.7) !important;
            }

            &:focus {
                outline: 2px solid #279BE8;
                border: 1px solid rgba(255, 255, 255, 0.9);
            }
        }

        .btns {
            width: 100%;
            @include flex(row, flex-end);
            .btn {
                font-size: 14px;
            }
        }
    }

    /* ------------------ drak ------------------ */

    &.dark {
        color: $text-color-primary-dark-ui;

    }

}
</style>
