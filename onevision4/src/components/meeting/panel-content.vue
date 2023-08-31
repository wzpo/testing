<template>
    <portal to="portal-content" :disabled="!contentPanelPopouted" id="content_panel" ref="panel"
        :style="{ height: height }">
        <div v-if="page == 'home'" class="content_panel_wrap" :class="[theme]">
            <panel-header :title="title" :type="'cc'" :floating="contentPanelPopouted" :popoutVisible="true" @close="close"
                @popout="popout"></panel-header>

            <div class="top">
                <div class='space-content-tabs' @mouseleave="leaveTab">
                    <div class="space-content-tab-active-bg"></div>
                    <div v-for="(tab, idx) in tabs" :key="`tttt${idx}`" class="btn" :class="[{
                        active: activeTabId === idx,
                    }, `space-content-tab${idx}`]" @mouseover="hoverTab(idx)" @click="selectTab(idx)">
                        <span class="lb">{{ tab }}</span>
                    </div>
                </div>

            </div>

            <wl-scrollbar ref="scrollbar" class='cont-wrap' :theme="theme === 'dark' ? 'dark' : 'light'"
                :arrowVisible="$store.state.os === 'win'">

                <div class="scrollcont">

                    <div v-if="activeTabId === 0" class="tools-files">
                        <md-button class="btn md-button-outline btn-cnc" aria-label="x" :size="28">
                            <wl-icon name="upload-bold" size="16" />
                            <span class="label">Upload file</span>
                        </md-button>
                        <div class="btngroup">
                            <div class="bt" :class="{ active: filesView === 'grid' }" @click="filesView = 'grid'"><wl-icon
                                    class="ico ico1" name="view-thumbnail-bold" size="12" /></div>
                            <div class="bt" :class="{ active: filesView === 'list' }" @click="filesView = 'list'"><wl-icon
                                    class="ico ico2" name="view-list-bold" size="12" /></div>
                        </div>
                    </div>

                    <div v-if="activeTabId === 0" class="listtitle">Added to meeting</div>

                    <div v-if="content !== undefined
                        && content[tabs[activeTabId].toLowerCase()] !== undefined
                        && activeTabId === 0" class="cont-area cont-files-grid">
                        <div v-for="(itm, idx) in content[tabs[activeTabId].toLowerCase()]" :key="`contitm${idx}`"
                            class="itm-file" @click="page = 'view-file'">
                            <span class="thumb">
                                <div class="img" :style="{
                                    backgroundImage: `url(${$store.state.spaceFilePath + itm.thumb})`
                                }"></div>
                                <!--div v-if="itm.onedrive" class="onedrive">OneDrive</div-->
                                <!--div class="ctrl">
                                    <div class="rbtn">
                                        <wl-icon class="ico" name="chat-bold" size="16" color="gray-95" />
                                    </div>
                                    <div class="rbtn">
                                        <wl-icon class="ico" name="download-bold" size="16" color="gray-95" />
                                    </div>
                                </div-->
                            </span>
                            <div class="rgt">
                                <span class="lb">{{ itm.name }}</span>
                                <span class="lb2">
                                    <span class="txt">{{ itm.user }}</span>
                                    <!--
                                    <span class="dot-divider"></span>
                                    <span class="txt">{{ itm.date }}</span>
                                    <wl-icon class="ico" name="check-circle-bold" size="16" color="green-40" />
                                    -->
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeTabId === 1" class="tools-whiteboards">
                        <md-button class="btn md-button-outline btn-new-wb" aria-label="x" :size="28">
                            <wl-icon name="new-whiteboard-bold" size="16" />
                            <span class="label">New whiteboard</span>
                        </md-button>
                        <div class="btngroup">
                            <div class="bt" :class="{ active: filesView === 'grid' }" @click="filesView = 'grid'"><wl-icon
                                    class="ico ico1" name="view-thumbnail-bold" size="12" /></div>
                            <div class="bt" :class="{ active: filesView === 'list' }" @click="filesView = 'list'"><wl-icon
                                    class="ico ico2" name="view-list-bold" size="12" /></div>
                        </div>
                    </div>
                    <div class="cont-area cont-whiteboards"
                        v-if="content !== undefined && content[tabs[activeTabId].toLowerCase()] !== undefined && activeTabId === 1">

                        <div v-for="(itm, idx) in content[tabs[activeTabId].toLowerCase()]" :key="`contitm2${idx}`"
                            class="itm-wb">
                            <span class="thumb">
                                <div class="img" :id="`whiteboardthumbimg${idx}`" :style="{
                                    backgroundImage: itm.thumb ? `url(${$store.state.spaceWhiteboardPath + itm.thumb})` : ``,
                                }">
                                </div>
                                <!--div class="ctrl">
                                    <div class="rbtn">
                                        <wl-icon class="ico" name="chat-bold" size="16" color="gray-95" />
                                    </div>
                                    <div class="rbtn">
                                        <wl-icon class="ico" name="download-bold" size="16" color="gray-95" />
                                    </div>
                                </div-->
                            </span>
                            <div class="sub">
                                <div class="lft">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="32" height="32" rx="16" fill="#066070"/>
                                        <path d="M24.7511 15.9999C24.7559 13.9746 24.0597 12.01 22.7807 10.4396C21.5016 8.86931 19.7185 7.79 17.7341 7.38497C15.7497 6.97993 13.6863 7.27411 11.8942 8.21758C10.102 9.16105 8.6916 10.6957 7.90236 12.5609C7.11312 14.4261 6.9937 16.507 7.56436 18.4502C8.13503 20.3935 9.36062 22.0794 11.0331 23.2217C12.7055 24.364 14.7217 24.8923 16.7394 24.7169C18.7571 24.5416 20.652 23.6734 22.1023 22.2597C22.1142 22.2494 22.1255 22.2397 22.1364 22.2286C22.9646 21.4165 23.6224 20.4472 24.0714 19.3777C24.5203 18.3082 24.7514 17.1598 24.7511 15.9999ZM16.0011 8.49987C17.4133 8.49816 18.7973 8.89569 19.9933 9.64662C21.1893 10.3976 22.1487 11.4713 22.7609 12.744C23.373 14.0167 23.6128 15.4365 23.4528 16.8396C23.2928 18.2427 22.7394 19.5721 21.8564 20.6742C21.0822 19.2868 19.8377 18.2216 18.3474 17.6707C18.9533 17.1848 19.3933 16.5227 19.6068 15.7759C19.8202 15.0291 19.7965 14.2345 19.5389 13.5018C19.2813 12.769 18.8026 12.1343 18.1688 11.6854C17.5351 11.2364 16.7775 10.9953 16.0008 10.9953C15.2241 10.9954 14.4666 11.2366 13.8329 11.6857C13.1992 12.1347 12.7206 12.7695 12.4631 13.5023C12.2056 14.235 12.182 15.0297 12.3956 15.7764C12.6091 16.5232 13.0493 17.1852 13.6553 17.6711C12.1661 18.2245 10.9226 19.29 10.1476 20.6768C9.26404 19.5747 8.71006 18.2453 8.54958 16.842C8.3891 15.4386 8.62866 14.0185 9.24062 12.7455C9.85258 11.4724 10.812 10.3983 12.0082 9.6471C13.2044 8.8959 14.5886 8.49818 16.0011 8.49987ZM13.5011 14.7499C13.5011 14.2554 13.6477 13.7721 13.9224 13.3609C14.1971 12.9498 14.5875 12.6294 15.0444 12.4402C15.5012 12.251 16.0038 12.2014 16.4888 12.2979C16.9737 12.3944 17.4192 12.6325 17.7688 12.9821C18.1185 13.3317 18.3566 13.7772 18.453 14.2621C18.5495 14.7471 18.5 15.2498 18.3108 15.7066C18.1215 16.1634 17.8011 16.5538 17.39 16.8285C16.9789 17.1032 16.4955 17.2499 16.0011 17.2499C15.3382 17.2492 14.7027 16.9856 14.234 16.5169C13.7653 16.0482 13.5017 15.4127 13.5011 14.7499ZM11.0687 21.6357C11.5079 20.6984 12.2051 19.9056 13.0787 19.3502C13.9522 18.7949 14.9659 18.4999 16.0011 18.4999C17.0363 18.4999 18.05 18.7948 18.9235 19.3502C19.7971 19.9056 20.4943 20.6983 20.9336 21.6357C19.5713 22.837 17.8174 23.4999 16.0011 23.4999C14.1848 23.4999 12.431 22.837 11.0687 21.6357Z" fill="#B2F4F7"/>
                                    </svg>
                                </div>
                                <div class="rgt">
                                    <span class="lb">
                                        <div class="txt">{{ itm.name }}</div>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_10157_114584)">
                                            <path d="M12.2252 11.5177C13.046 10.5293 13.4953 9.28499 13.4953 8.00021C13.4953 6.71543 13.046 5.4711 12.2252 4.48271L14.8541 1.85361C14.9015 1.8074 14.9392 1.75224 14.9652 1.69133C14.9911 1.63042 15.0046 1.56497 15.005 1.49877C15.0055 1.43258 14.9927 1.36696 14.9676 1.30573C14.9425 1.24449 14.9054 1.18886 14.8586 1.14205C14.8118 1.09525 14.7562 1.0582 14.6949 1.03306C14.6337 1.00792 14.5681 0.995196 14.5019 0.995616C14.4357 0.996035 14.3702 1.00959 14.3093 1.03551C14.2484 1.06142 14.1933 1.09917 14.147 1.14656L11.5189 3.77471C10.5314 2.95119 9.28635 2.50015 8.00052 2.50015C6.7147 2.50015 5.46961 2.95119 4.4821 3.77471L1.8541 1.14656C1.75994 1.05475 1.63339 1.00374 1.50189 1.00458C1.37038 1.00541 1.24449 1.05802 1.1515 1.15101C1.05851 1.24401 1.0059 1.36989 1.00506 1.5014C1.00423 1.63291 1.05524 1.75945 1.14705 1.85361L3.7758 4.48236C2.95487 5.47079 2.50548 6.71521 2.50548 8.00009C2.50548 9.28497 2.95487 10.5294 3.7758 11.5178L1.14705 14.1466C1.09965 14.1928 1.0619 14.2479 1.03599 14.3088C1.01008 14.3698 0.996523 14.4352 0.996104 14.5014C0.995684 14.5676 1.00841 14.6332 1.03355 14.6944C1.05869 14.7557 1.09573 14.8113 1.14254 14.8581C1.18935 14.9049 1.24498 14.942 1.30622 14.9671C1.36745 14.9922 1.43307 15.005 1.49926 15.0046C1.56545 15.0041 1.63091 14.9906 1.69182 14.9647C1.75273 14.9388 1.80789 14.901 1.8541 14.8536L4.4821 12.2256C5.4696 13.0491 6.71469 13.5001 8.00052 13.5001C9.28636 13.5001 10.5314 13.0491 11.5189 12.2256L14.147 14.8536C14.2412 14.9454 14.3678 14.9964 14.4993 14.9956C14.6308 14.9948 14.7567 14.9422 14.8496 14.8492C14.9426 14.7562 14.9953 14.6303 14.9961 14.4988C14.9969 14.3673 14.9459 14.2407 14.8541 14.1466L12.2252 11.5177ZM11.5152 10.8077L8.7076 8.00011L11.5152 5.19246C12.1507 5.99027 12.4968 6.98009 12.4968 8.00009C12.4968 9.02008 12.1507 10.0099 11.5152 10.8077ZM8.00055 3.50011C9.02158 3.49782 10.0125 3.8456 10.8082 4.48546L8.00055 7.29306L5.1929 4.48536C5.98857 3.84552 6.97953 3.49778 8.00055 3.50011ZM4.48555 5.19231L7.29355 8.00011L4.48555 10.8079C3.85001 10.01 3.50395 9.02013 3.50395 8.00009C3.50395 6.98004 3.85001 5.99017 4.48555 5.19231ZM8.00055 12.5001C6.97953 12.5024 5.98856 12.1547 5.1929 11.5148L8.00055 8.70711L10.8082 11.5148C10.0125 12.1546 9.02158 12.5024 8.00055 12.5001Z" fill="white" fill-opacity="0.95"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_10157_114584">
                                            <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span class="lb2">
                                        <!--
                                    <span class="txt">{{ itm.user }}</span>
                                    <span class="dot-divider"></span>
                                    -->
                                        <span class="txt">{{ itm.date }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--div class="empty"
                        v-if="content === undefined || content[tabs[activeTabId].toLowerCase()] === undefined">
                        <div class="img"></div>
                        <div class="title">{{ tabs[activeTabId] }}</div>
                        <div class="des">{{ emptyword[activeTabId] }}</div>
                    </div-->

                </div>


            </wl-scrollbar>

        </div>

        <div v-if="page == 'view-file'" class="content_panel_wrap" :class="[theme]">
            <panel-header :title="title" :type="'cc'" :floating="contentPanelPopouted" :popoutVisible="true" @close="close"
                @popout="popout"></panel-header>

            <div class="top"  >
                <div class="backbutton" @click="page = 'home'">
                    <wl-icon name="arrow-left-bold" size="16" />
                    <span class="lb">Latest highlight.pdf</span>
                </div>
            </div>

            <wl-scrollbar ref="scrollbar" class='cont-wrap' :theme="theme === 'dark' ? 'dark' : 'light'"
                :arrowVisible="$store.state.os === 'win'">

                <div class="scrollcont">
                    <img src="~@/assets/img/tmp-content-panel-view-file.svg" width="318" style="margin-left: 8px;" />

                </div>


            </wl-scrollbar>

        </div>
    </portal>
</template>
  
<script>

export default {
    props: {
        meetingId: String,
    },
    data() {
        return {
            title: "Content",
            page: 'home',

            activeTabId: 0,
            tabs: [
                'Attachments',
                'Whiteboards',
                'Captions',
                'Highlights',
            ],
            emptyword: [
                'Come here to find all the files shared in this space. To share a file, drag and drop it into the space or attach it in the message pane.',
                `Find your whiteboards saved here. Use a whiteboard to write out and sketch ideas with others. Start a new one with 'New Whiteboard'.`,
                'Captions added to this meeting appear here.',
                'Highlights added to this meeting appear here.',
            ],
            filesView: 'grid', // gird, list

            content: {
                attachments: [
                    {
                        thumb: 'file-01.png',
                        name: 'Latest highlight.pdf',
                        user: 'Webex',
                        date: '18/09/2021',
                        size: '5.6MB',
                        onedrive: true,
                    },

                ],
                whiteboards: [
                    {
                        thumb: 'wb_05.png',
                        name: 'Welcome',
                        user: 'You',
                        date: 'Edited 1 hour',
                    },
                ],


            },
        };
    },
    computed: {
        theme() {
            return this.$store.state.theme;
        },
        height() {
            if (this.fixHeight && !this.fullscreen) {
                return "197px";
            } else {
                return "auto";
            }
        },
        panelVisible() {
            return this.$store.state.panelVisible;
        },
        contentPanelVisible() {
            return this.$store.state.contentPanelVisible;
        },
        contentPanelPopouted() {
            return this.$store.state.contentPanelPopouted;
        },
        fixHeight() {
            return (
                this.$store.state.plistPanelVisible &&
                !this.fullscreen
            );
        },
        peopleList() {
            return this.$store.state.peopleList;
        },
    },
    mounted() {
        this.selectTab(this.activeTabId);
    },
    watch: {},
    methods: {
        close() {
            this.$store.commit("contentPanelVisible", false);
            setTimeout(() => this.$store.commit("contentPanelPopouted", false), 100);
        },
        popout() {
            //this.$store.commit("contentPanelPopouted", !this.contentPanelPopouted);
        },

        hoverTab(id) {
            this.moveTabBg(id);
        },
        leaveTab() {
            this.moveTabBg(this.activeTabId);
        },
        selectTab(id) {
            this.activeTabId = id;
            this.moveTabBg(id);
            this.$refs.scrollbar.scrollToY(0, true);

            this.$nextTick(() => {
                if (this.tabs[id] === 'Whiteboards') {
                    let itemlist = this.content[this.tabs[id].toLowerCase()]
                    for (let i = 0; i < itemlist.length; i++) {
                        let itm = itemlist[i]
                        if (itm.canvaskey) {
                            let canvas = this.$store.state.savedCanvasFromHandtracking[itm.canvaskey]
                            canvas.style.width = `194px`;
                            canvas.style.height = `124px`
                            document.getElementById(`whiteboardthumbimg${i}`).appendChild(canvas)
                        }
                    }
                }
            })
        },
        moveTabBg(id) {
            const rect = document.querySelector(`.space-content-tab${id}`).getBoundingClientRect();
            const rect2 = document.querySelector(`.space-content-tabs`).getBoundingClientRect();
            document.querySelector(`.space-content-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
            document.querySelector(`.space-content-tab-active-bg`).style.width = `${rect.width}px`;
        },

    }
};
</script>
  
  
<style lang="scss">
#content_panel {
    width: 100%;
    font-size: 12px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    border-radius: 6px;
    transform: rotate(0deg);
    overflow: hidden;

}

.content_panel_wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .top {
        position: relative;
        width: calc(100% - 12px);
        height: 28px;
        display: flex;
        align-items: center;
        margin-left: 12px;

        .space-content-tabs {
            position: relative;
            width: 60px;
            height: 100%;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            flex-grow: 1;

            .space-content-tab-active-bg {
                position: absolute;
                height: 28px;
                top: 0;
                left: 0;
                border-radius: 14px;
                transition: all 0.2s ease;
                background-color: rgba($color: #000000, $alpha: .2);
                pointer-events: none;
            }

            .btn {
                height: 28px;
                border-radius: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 10px;
                margin-right: 8px;
                pointer-events: auto;

                .lb {
                    font-size: 14px;
                    opacity: 0.7;
                    transition: all 0.3s ease;
                    pointer-events: none;
                }

                &:hover {
                    .lb {
                        opacity: 0.9;
                    }
                }

                &.active {
                    .lb {
                        opacity: 0.9;
                        font-weight: 600;
                    }
                }
            }
        }

        .backbutton {
            @include flex(row, flex-start);

            .lb {
                font-weight: 600;
                font-size: 14px;
                margin-left: 4px;
                user-select: none;
            }
        }
    }



    .cont-wrap {
        display: flex;
        width: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        overflow: hidden;
        height: 100px;
        margin: 16px 0 4px 0;

        .scrollcont {
            display: flex;
            flex-direction: column;
            padding: 0 12px;
        }
    }

    .empty {
        display: flex;
        flex-direction: column;
        width: 360px;
        margin-top: 50px;

        .img {
            width: 140px;
            height: 140px;
            background: url(~@/assets/img/empty-state-space-content.svg) no-repeat;
            background-size: contain;
            margin-bottom: 48px;
        }

        .title {
            font-weight: 600;
            font-size: 24px;
            opacity: .95;
            line-height: 30px;
            margin-bottom: 5px;
        }

        .des {
            font-size: 15px;
            opacity: .95;
        }
    }

    .listtitle {
        @include flex(row, flex-start);
        height: 32px;
        padding-left: 12px;
        opacity: .7;
        margin-bottom: 2px;
    }

    .tools-files {
        @include flex(row, space-between);
        height: 28px;
        width: 100%;
        margin-bottom: 12px;

        .btn-cnc {
            padding: 0 10px;

            .label {
                font-size: 14px;
                margin-left: 4px;
            }
        }

        .lb {
            opacity: .7;
            font-size: 12px;
            margin-left: 8px;
            margin-right: 18px;
        }
    }

    .cont-files-grid {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        padding: 0 0;
        align-content: center;

        .onedrive {
            @include flex;
            padding: 1px 8px;
            position: absolute;
            width: 76px;
            height: 24px;
            right: 8px;
            top: 8px;
            background: #FFFFFF;
            border: 1px solid #8F8F8F;
            box-sizing: border-box;
            border-radius: 4px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.95);
        }


        .itm-file {
            position: relative;
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 60px;
            padding: 8px;
            border-radius: 12px;

            &:hover {
                background-color: rgba($color: #FFF, $alpha: .07);
            }
            &:active {
                background-color: rgba($color: #FFF, $alpha: .2);
            }

            .thumb {
                position: relative;
                width: 80px;
                height: 44px;
                border-radius: 6px;
                box-sizing: border-box;
                overflow: hidden;

                .img {
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-size: cover;
                }

                .ctrl {
                    opacity: 0;
                    position: absolute;
                    bottom: 0;
                    height: 52px;
                    width: 100%;
                    @include flex;
                    background-color: rgba($color: #000000, $alpha: .9);

                    .rbtn {
                        @include flex;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        margin: 4px;
                        color: rgba($color: #000000, $alpha: .95);
                        background-color: rgba($color: #FFFFFF, $alpha: .95);
                    }
                }

                &:hover {
                    .ctrl {
                        opacity: 1;
                    }
                }
            }

            .rgt {
                @include flex(column, center, flex-start);
                margin-left: 12px;
            }

            .lb {
                font-size: 16px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                opacity: .95;
            }

            .lb2 {
                @include flex(row, flex-start);

                .txt {
                    font-size: 14px;
                    opacity: .7;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .ico {
                    margin-left: 8px;
                }
            }


        }
    }

    .cont-files-list {
        display: flex;
        width: calc(100% - 24px);
        flex-direction: column;
        margin-bottom: 16px;

        .itm-filelst {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            border-radius: 8px;
            transition: all .2s ease;
            background: rgba($color: #000000, $alpha: .11);

            .left {
                @include flex;
                width: 72px;
                height: 50px;
                border-radius: 8px;
                border: 2px solid rgba(255, 255, 255, 0.2);
                box-sizing: border-box;
                overflow: hidden;
                margin-right: 16px;

                .img {
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center;

                    &.fileicon {
                        background-size: 150%;
                    }
                }

            }

            .mid {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                margin: 5px 0;

                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                .lb {
                    font-size: 14px;
                    line-height: 22px;
                }

                .lb2 {
                    @include flex(row, flex-start);
                    font-size: 14px;
                    line-height: 22px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    .onedrive {
                        margin-right: 6px;
                    }

                    .txt {
                        opacity: .7;
                    }
                }

                .ico {
                    margin-left: 8px;
                }
            }

            .right {
                display: flex;
                margin: 10px;

                .ico {
                    @include flex;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    margin: 0 4px;

                    &:hover {
                        background-color: rgba($color: #000000, $alpha: .1);
                    }
                }

                svg path {
                    fill: #000000;
                    fill-opacity: .95;
                }
            }

            &:hover {
                background: rgba($color: #000000, $alpha: 0.2);
            }
        }
    }

    .tools-whiteboards {
        @include flex(row, space-between);
        width: 100%;
        margin-bottom: 12px;

        .btn-new-wb {
            padding: 0 10px;

            .label {
                font-size: 14px;
                margin-left: 4px;
            }
        }
    }

    .cont-whiteboards {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        align-content: center;

        &.nocontent {
            justify-content: center;
        }


        .itm-wb {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 148px;
            transition: all .2s ease;
            padding: 8px;

            .thumb {
                position: relative;
                width: 100%;
                height: 120px;
                border-radius: 8px;
                box-sizing: border-box;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.2);
                margin-bottom: 8px;

                .img {
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-color: white;
                }

                .ctrl {
                    opacity: 0;
                    position: absolute;
                    bottom: 0;
                    height: 52px;
                    width: 100%;
                    @include flex;
                    background-color: rgba($color: #000000, $alpha: .9);

                    .rbtn {
                        @include flex;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        margin: 4px;
                        color: rgba($color: #000000, $alpha: .95);
                        background-color: rgba($color: #FFFFFF, $alpha: .95);
                    }
                }

                &:hover {
                    .ctrl {
                        opacity: 1;
                    }
                }
            }

            .sub {
                @include flex(row, flex-start);

                .lft {
                    @include flex;
                    width: 32px;
                    height: 32px;
                    margin-right: 12px;
                }

                .rgt {
                    @include flex(column, center, flex-start);
                    flex-grow: 1;
                }
            }

            .lb {
                @include flex;
                width: 100%;
                font-size: 16px;
                font-weight: 600;
                line-height: 24px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                .txt {
                    flex-grow: 1;
                }
            }

            .lb2 {
                @include flex(row, flex-start);

                .txt {
                    font-size: 14px;
                    opacity: .7;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .ico {
                    margin-left: 8px;
                }
            }
        }

    }

    .btngroup {
        @include flex;
        height: 28px;
        border-radius: 14px;
        overflow: hidden;
        box-sizing: border-box;
        border: 1px solid rgba($color: #000000, $alpha: 0.2);

        .bt {
            @include flex;
            width: 28px;
            height: 100%;

            .ico {
                opacity: .7;
            }

            .ico1 {
                margin-left: 2px;
            }

            .ico2 {
                margin-right: 2px;
            }

            &:hover {
                background: rgba($color: #000000, $alpha: 0.1);

                .ico {
                    opacity: .95;
                }
            }

            &:active,
            &.active {
                background: rgba($color: #000000, $alpha: 0.2);

                .ico {
                    opacity: .95;
                }
            }
        }
    }

    .dot-divider {
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        margin: 0 8px;
    }




    /* theme ----- dark/hybrid */
    &.hybrid {
        color: $text-color-primary-light-ui;
    }

    &.dark {
        color: $text-color-primary-dark-ui;

        .top {
            .space-content-tabs {
                .space-content-tab-active-bg {
                    background-color: rgba($color: white, $alpha: .2);
                }
            }
        }

        .cont-files-list {

            .itm-filelst {
                background: rgba($color: #FFFFFF, $alpha: .11);

                .right {
                    .ico:hover {
                        background-color: rgba($color: #FFFFFF, $alpha: .1);
                    }

                    svg path {
                        fill: #FFFFFF;
                    }
                }

                &:hover {
                    background: rgba($color: #FFFFFF, $alpha: 0.2);
                }
            }
        }

        .btngroup {
            border: 1px solid rgba($color: #FFFFFF, $alpha: 0.2);

            .bt {
                &:hover {
                    background: rgba($color: #FFFFFF, $alpha: 0.1);
                }

                &:active,
                &.active {
                    background: rgba($color: #FFFFFF, $alpha: 0.2);
                }
            }
        }
    }

}
</style>
  