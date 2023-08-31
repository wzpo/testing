<template>
    <div 
        class="call-item-group"
        :style="{
            minHeight: minHeight,
        }"
    >
        <div class="header" @click="setCollapse(!clsed)">
            <div class="lev" :style="{ backgroundColor: groupData.list.length > 0 ? '#EC6400' : '#27A17A' }"></div>
            <wl-icon v-if="!clsed" name="arrow-down-bold" size="16" class="clsico" />
            <wl-icon v-if="clsed" name="arrow-right-bold" size="16" class="clsico" />
            <!--div class="callas">{{ `L${groupData.callAs.id+1}: ${groupData.callAs.label} (${groupData.callAs.sub})` }}</div-->
            <div class="callas">{{ `${groupData.callAs.label} (${groupData.callAs.sub})` }}</div>
            <div class="icoset">
                <wl-icon name="recents-presence-bold" size="16" />
                <span class="lb">{{ groupData.callAs.recents }}</span>
            </div>
            <div class="icoset">
                <wl-icon name="voicemail-bold" size="16" />
                <span class="lb">{{ groupData.callAs.viocemail }}</span>
            </div>

            <div v-if="resizerVisible" class="split-resizer" @mousedown="resizerMousedown" @click="stopPP" ></div>
        </div>

        <wl-scrollbar 
            v-show="!clsed && groupData.list.length > 0" 
            ref="scrollbar" 
            classes='scrollbar' 
            :theme="theme === 'dark' ? 'dark' : 'light'" 
            :arrowVisible="$store.state.os === 'win'" 
            :alwaysVisible="true"
            :backgroundVisible="false"
            >
            <div class="scrollcont" ref="scrollcont">
                <call-item 
                    v-for="(itm, idx) in groupData.list" 
                    :key="`item-${idx}`" 
                    :info="itm" 
                    :layout="layout"
                    @resume="resumeHanlder" 
                    @transfer="transfer" 
                    @conference="transfer" 
                />
            </div>

        </wl-scrollbar>

    </div>
</template>

<script>
import _ from 'lodash';

export default {
    props: {
        groupIndex: {
            type: Number,
        },
        groupData: {// callAs:{}, list:[]
            type: Object,
        },
        layout: {
            type: String,
            default: '',
        },
        scrollpaneHeight: {
            type: Number,
        },
        collapsed: {
            type: Boolean,
        },
        resizerVisible: {
            type: Boolean,
        },
        onResize: {
            type: Function,
        },
    },
    data() {
        return {
            clsed: false,
            resizeObserver: null,
            resizeDraggingPageY: null,
        }
    },
    computed: {
        os() {
            return this.$store.state.os;
        },
        theme() {
            return this.$store.state.theme;
        },
        themeColorList() {
            return this.$store.state.themeColorList;
        },
        themeColor() {
            return this.$store.state.themeColor;
        },
        callingPeopleItems() {
            return this.$store.state.callingPeopleItems;
        },
        callWidgetGroupCollapsed() {
            return this.$store.state.callWidgetGroupCollapsed;
        },
        callWidgetGroupScrollpaneResized() {
            return this.$store.state.callWidgetGroupScrollpaneResized;
        },
        callWidgetGroupScrollpaneHeight() {
            return this.$store.state.callWidgetGroupScrollpaneHeight;
        },
        minHeight() {
            return this.scrollpaneHeight ? (!this.clsed && this.groupData.list.length > 0 ? `${this.scrollpaneHeight + 40}px` : `40px`) : ''
        },
    },
    mounted() {
        this.clsed = this.groupData.list.length == 0 ? true : this.collapsed

        const elem = this.$el
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.contentRect) {
                    this.updateLayout()
                }
            }
        });
        this.resizeObserver.observe(elem);
    },
    beforeDestroy() {
        const elem = this.$el
        this.resizeObserver.unobserve(elem);
    },
    updated() {

    },
    watch: {
        groupData(val, oldval) {
            if (val.list.length == 0) {
                this.setCollapse(true)
            } else if (this.clsed && val.list.length != oldval.list.length) {
                this.setCollapse(false)
            } else {
                this.$nextTick(() => {
                    this.updateLayout()
                })
            }

            if (val.list.length == 0 && oldval.list.length > 0) {
                let resizedArray = this.callWidgetGroupScrollpaneResized.slice()
                let heightArray = this.callWidgetGroupScrollpaneHeight.slice()
                resizedArray[this.groupIndex] = 0
                heightArray[this.groupIndex] = 0
                this.$store.commit('callWidgetGroupScrollpaneResized', resizedArray)
                this.$store.commit('callWidgetGroupScrollpaneHeight', heightArray)
            }
        },
    },
    methods: {
        setCollapse(val) {
            this.clsed = val
            let clsobj = _.cloneDeep(this.callWidgetGroupCollapsed)
            clsobj[this.groupData.callAs.id]
            this.$store.commit('callWidgetGroupCollapsed', clsobj)
            this.$nextTick(() => {
                this.$emit('collapsed')
            })
        },
        updateLayout() {
            this.$refs.scrollbar.update()
        },
        stopPP(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        },

        // ----- resize >>>>>>>
        resizerMousedown(evt) {
            evt.stopPropagation();
            this.resizeDraggingPageY = evt.pageY;
            window.addEventListener("mousemove", this.resizeHandlerDragging);
            window.addEventListener("mouseup", this.resizeHandlerStopDrag);
        },
        resizeHandlerDragging(evt){
            let offset = evt.pageY - this.resizeDraggingPageY;
            this.resizeDraggingPageY = evt.pageY;
            this.$emit('resize', offset, this.groupIndex)
        },
        resizeHandlerStopDrag(){
            window.removeEventListener("mousemove", this.resizeHandlerDragging);
            window.removeEventListener("mouseup", this.resizeHandlerStopDrag);
        },

        // ----- resize <<<<<<<





        resumeHanlder() {
            if (this.onResume) {
                this.onResume();
            }
        },
        transfer(info, mode) {
            this.$emit('transfer', info, mode);
        },

        // public method
        getCollapsed() {
            return this.clsed
        },
        getScrollbarVisible() {
            const obj = this.$refs.scrollbar.getVisible()
            return obj.verticalScrollbarVisible
        }


    }
}
</script>
  
  
<style lang="scss">
.call-item-group {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    min-height: 40px;

    .divider {
        position: absolute;
        bottom: -6px;
    }

    .header {
        @include flex;
        position: relative;
        height: 40px;
        margin: 0 16px 0 12px;
        padding-bottom: 8px;
        flex-shrink: 0;

        .lev {
            height: 16px;
            width: 6px;
            border-radius: 3px;
        }

        .clsico {
            width: 16px;
            height: 16px;
            margin: 0 8px 0 4px;
            opacity: .7;
        }

        .callas {
            flex-grow: 1;
            opacity: .7;
        }

        .icoset {
            @include flex;
            opacity: .7;
            margin-left: 8px;

            .lb {
                margin-left: 4px;
                font-size: 14px;
            }
        }

        .split-resizer {
            position: absolute;
            width: 100%;
            height: 4px;
            top: 0;
            cursor: row-resize;
            pointer-events: auto;
        }
    }

    .scrollbar {
        display: flex;
        width: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        overflow: hidden;
        margin: 0;

        .scrollcont {
            display: flex;
            flex-direction: column;
        }
    }



}

/* theme ----- dark/hybrid */
.dark,
.hybrid {}
</style>
  