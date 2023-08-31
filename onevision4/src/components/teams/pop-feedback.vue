<template>
    <div id="pop-feedback" :class="[os, theme]">
        <topbar-simple class="titlebar" :buttons="['close', 'minimize', 'maximize']" @close="close" />
        <div class="content">
            <div class="tt">Feedback</div>
            <div class="des">{{data.content}} </div>
            <div class="tags">
                <div 
                    v-for="(tag, idx) in data.tags"
                    :key="`k${idx}`"
                    class="tag"
                    :class="{
                        active: selectedTags.indexOf(tag) > -1,
                    }"
                    @click="select(tag)"
                >
                   {{ tag }} 
                </div>
            </div>

            <textarea rows="4" ref="textarea" placeholder="How could it be improved? Tell us more..."></textarea>
            <div class="btns">
                <md-button class="btn md-button-outline" aria-label="x" :size="32" @click="submit" >Submit feedback </md-button>
            </div>
        </div>

    </div>
</template>

<script>
import _ from 'lodash'
export default {
    props: {
        data: Object,
        onSubmit: Function,
    },

    data() {
        return {
            selectedTags: [],
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
        select(tag) {
            if (this.selectedTags.indexOf(tag) > -1) {
                this.selectedTags = _.without(this.selectedTags, tag)
            } else {
                this.selectedTags.push(tag)
            }
            
        },
        submit() {
            if (this.onSubmit) {
                this.onSubmit()
            }
            this.close();
        },
        close() {
            this.$emit("close");
        },

    }
};
</script>

<style lang="scss">
#pop-feedback {
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
        padding: 12px 40px 30px 40px;

        .tt {
            font-weight: 600;
            font-size: 26px;
            margin-bottom: 10px;
        }
        .des {
            margin-bottom: 16px;
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 12px;

            .tag {
                @include flex;
                height: 32px;
                border-radius: 16px;
                box-sizing: border-box;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 0 16px;
                margin-right: 8px;
                margin-bottom: 8px;
                user-select: none;

                &:hover {
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }

                &.active {
                    border: none;
                    background: #1170CF;
                    color: white;
                    font-weight: bold;
                }
            }
        }
        textarea {
            width: 100%;
            font-size: 16px;
            padding: 8px;
            cursor: text;
            color: rgba($color: white, $alpha: 0.95);
            resize: none;
            overflow: hidden;
            background: black;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 8px;
            margin-bottom: 40px;

            ::placeholder {
                color: rgba($color: white, $alpha: 0.4) !important;
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
                padding: 0 12px;
            }
        }
    }

    /* ------------------ drak ------------------ */

    &.dark {
        color: $text-color-primary-dark-ui;

    }

}
</style>
