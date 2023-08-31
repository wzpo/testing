<template>
    <div id="joinbylink" :class="[theme]">
        <div v-if="os === 'win'" class="win">
            <div v-show="page == 1" class="page page-01">
                <wl-hot :rect="{ x: 322, y: 693, w: 171, h: 48 }" @click.native="goWinPage(2)" />
            </div>
            <div v-show="page == 2" class="page page-02">
                <div class="wbxlogo"></div>
                <div class="spinner spinner48 spinner-animation"></div>
            </div>
            <div v-show="page == 3" class="page page-03">
                <div class="wbxlogo"></div>
                <wl-hot :rect="{ x: 1, y: 732, w: 200, h: 66 }" @click.native="goWinPage(4)" />
            </div>
            <div v-show="page == 4" class="page page-04">
                <div class="wbxlogo"></div>
                <div v-show="installerVisible" class="installer">
                    <div v-if="installer == 1" class="ico ico1"> </div>
                    <div v-if="installer == 2" class="ico ico2"> </div>
                    <div v-if="installer == 3" class="ico ico3"> </div>
                    <div class="rgt">
                        <div class="tt">{{ installerLabel }}</div>
                        <div class="pgbar">
                            <div class="bar" :style="{ width: `${installerPercent}%` }"></div>
                        </div>

                    </div>

                </div>

                <div v-show="eulaVisible" class="eula">
                    <wl-hot :rect="{ x: 66, y: 530, w: 176, h: 36 }"
                        @click.native="() => { eulaVisible = false; openSigninWindow(); }" />
                </div>
            </div>

            <wl-hot :rect="{ x: 0, y: 0, w: 16, h: 16 }"
                @click.native="() => { eulaVisible = false; openSigninWindow(); }" />
        </div>






        <div v-if="os === 'mac'" class="mac">
            <div class="browser">
                <div v-show="page == 1" class="page page-01">
                    <wl-hot :rect="{ x: 322, y: 565, w: 171, h: 46 }" @click.native="goMacPage(2)" />
                </div>
                <div v-show="page == 2" class="page page-02">
                    <wl-hot :rect="{ x: 7, y: 598, w: 193, h: 62 }" @click.native="goMacPage(3)" />
                </div>
                <div v-show="page == 3" class="page page-03">
                    <div class="install">
                        <wl-hot :rect="{ x: 247, y: 256, w: 66, h: 65 }" @dblclick.native="install2Visible = true" />
                    </div>
                    <div v-show="install2Visible" class="install2">
                        <wl-hot :rect="{x:164,y:252,w:110,h:29}"
                            @click.native="() => { install2Visible = false; startInstall(); }" />
                    </div>

                    <div v-show="installerVisible" class="installer">
                        <div v-if="installer == 1" class="ico ico1"> </div>
                        <div v-if="installer == 2" class="ico ico2"> </div>
                        <div v-if="installer == 3" class="ico ico3"> </div>
                        <div class="rgt">
                            <div class="tt">{{ installerLabel }}</div>
                            <div class="pgbar">
                                <div class="bar" :style="{ width: `${installerPercent}%` }"></div>
                            </div>

                        </div>

                    </div>

                    <div v-show="eulaVisible" class="eula">
                        <wl-hot :rect="{ x: 66, y: 530, w: 176, h: 36 }"
                            @click.native="() => { eulaVisible = false; openSigninWindow(); }" />
                    </div>
                </div>


                <wl-hot :rect="{ x: 0, y: 0, w: 16, h: 16 }"
                    @click.native="() => { eulaVisible = false; openSigninWindow(); }" />
            </div>
        </div>

    </div>
</template>

<script>

export default {
    props: {
        returnusers: {
            type: Boolean,
        }
    },
    data() {
        return {
            page: 1,
            installer: 1,
            installerVisible: false,
            installerPercent: 1,
            installerLabel: '',
            itv: null,
            eulaVisible: false,
            install2Visible: false,
        };
    },
    computed: {
        theme() {
            return this.$store.state.theme;
        },
        os() {
            return this.$store.state.os;
        },
    },
    mounted() {
    },
    destroyed() {

    },

    watch: {

    },
    methods: {
        goWinPage(p) {

            if (!this.returnusers && p == 2) {
                setTimeout(() => {
                    this.goWinPage(3)
                }, 1000)
            } else if (this.returnusers && p == 2) {
                this.$eventBus.$emit('open-signin-window');
                return
            }

            if (p == 4) {
                this.startInstall()
            }

            this.page = p

        },

        goMacPage(p) {
            this.page = p
        },

        startInstall() {
            this.installerVisible = true
            this.installerPercent = 1
            this.installerLabel = 'Downloading Webex...'
            this.itv = setInterval(() => {
                if (this.installerPercent < 100) {
                    this.installerPercent++
                } else if (this.installerPercent == 100 && this.installer < 3) {
                    this.installerPercent = 0
                    this.installer++
                    if (this.installer == 2) {
                        this.installerLabel = 'Installing Webex...'
                    } else if (this.installer == 3) {
                        this.installerLabel = 'Opening Webex...'
                    }
                } else {
                    clearInterval(this.itv)
                    this.installerVisible = false
                    //this.eulaVisible = true
                    this.openSigninWindow()
                }
            }, 20)
        },

        openSigninWindow() {
            this.$eventBus.$emit('open-signin-window', {
                defaultPage: 'page-guest-name-email',
            });
        },
    }
};
</script>

<style lang="scss">
#joinbylink {
    @include flex(column, flex-start, flex-start);
    width: 100%;
    height: 100%;
    pointer-events: auto;
    user-select: none;
    box-sizing: border-box;



    .win {
        position: absolute;
        width: 100%;
        height: 100%;

        .page {
            position: absolute;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size: 1280px 798px;
        }

        .page-01 {
            background-image: url(~@/components/onboarding/img/joinbylink-win-01.png);
        }

        .page-02 {
            background-image: url(~@/components/onboarding/img/joinbylink-win-02.png);

            .spinner {
                position: absolute;
                left: calc((100% - 48px)/2);
                top: calc((100% - 48px)/2);
            }
        }

        .page-03 {
            background-image: url(~@/components/onboarding/img/joinbylink-win-03.png);
        }

        .page-04 {
            background-image: url(~@/components/onboarding/img/joinbylink-win-04.png);

            .installer {
                @include flex;
                padding-top: 28px;
                position: absolute;
                width: 500px;
                height: 180px;
                left: calc((100% - 500px)/2);
                top: calc((100% - 126px)/2);
                background-image: url(~@/components/onboarding/img/joinbylink-win-installer.svg);
                background-position: 0 0;
                background-repeat: no-repeat;

                .ico {
                    width: 72px;
                    height: 72px;
                    background-position: 0 0;
                    background-repeat: no-repeat;
                    background-size: 72px 72px;
                    margin-right: 12px;
                }

                .ico1 {
                    background-image: url(~@/components/onboarding/img/joinbylink-ico-01-72.gif);
                }

                .ico2 {
                    background-image: url(~@/components/onboarding/img/joinbylink-ico-02-72.gif);
                }

                .ico3 {
                    background-image: url(~@/components/onboarding/img/joinbylink-ico-03-72.gif);
                }

                .rgt {
                    @include flex(column, flex-start, flex-start);

                    .tt {
                        font-weight: 700;
                        font-size: 16px;
                        margin-bottom: 12px;
                    }

                    .pgbar {
                        position: relative;
                        width: 280px;
                        height: 4px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 2px;

                        .bar {
                            position: absolute;
                            height: 4px;
                            border-radius: 2px;
                            background: #64B4FA;
                        }
                    }
                }
            }

            .eula {
                @include flex;
                position: absolute;
                width: 500px;
                height: 660px;
                left: calc((100% - 500px)/2);
                top: calc((100% - 620px)/2);
                background-image: url(~@/components/onboarding/img/joinbylink-win-EULA.png);
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: calc(996px/2) calc(1304px/2);
            }
        }
    }

    .mac {
        position: absolute;
        width: 100%;
        height: 100%;

        .browser {
            position: absolute;
            width: 1280px;
            height: 740px;
            left: calc((100% - 1280px)/2);
            top: calc((100% - 740px)/2);
            background-repeat: no-repeat;
            background-size: 1280px 740px;
            background-image: url(~@/components/onboarding/img/joinbylink-mac-browser.png);
        }

        .page {
            position: absolute;
            width: 1280px;
            height: 660px;
            top: 80px;
            background-repeat: no-repeat;
            background-size: 1280px 660px;

            .wbxlogo {
                position: absolute;
                left: 24px;
                top: 20px;
                width: 72px;
                height: 28px;
                background: url(~@/assets/img/webex-by-cisco-logo-black.svg) no-repeat;
                background-size: contain;
            }
        }

        .page-01 {
            background-image: url(~@/components/onboarding/img/joinbylink-mac-01.png);
        }

        .page-02 {
            background-image: url(~@/components/onboarding/img/joinbylink-mac-02.png);

            .spinner {
                position: absolute;
                left: calc((100% - 48px)/2);
                top: calc((100% - 48px)/2);
            }
        }

        .page-03 {
            background-image: url(~@/components/onboarding/img/joinbylink-mac-03.png);

            .install {
                @include flex;
                padding-top: 28px;
                position: absolute;
                width: 560px;
                height: 504px;
                left: calc((100% - 560px)/2);
                top: calc((100% - 504px)/2);
                background-image: url(~@/components/onboarding/img/joinbylink-mac-04.png);
                background-size: 560px 504px;
                background-position: 0 0;
                background-repeat: no-repeat;
            }

            .install2 {
                @include flex;
                padding-top: 28px;
                position: absolute;
                width: 319px;
                height: 352px;
                left: calc((100% - 319px)/2);
                top: calc((100% - 352px)/2);
                background-image: url(~@/components/onboarding/img/joinbylink-mac-05.png);
                background-size: 319px 352px;
                background-position: 0 0;
                background-repeat: no-repeat;
            }

            .installer {
                @include flex;
                padding-top: 8px;
                position: absolute;
                width: 500px;
                height: 180px;
                left: calc((100% - 500px)/2);
                top: calc((100% - 126px)/2);
                background-image: url(~@/components/onboarding/img/joinbylink-mac-installer.svg);
                background-position: 0 0;
                background-repeat: no-repeat;

                .ico {
                    width: 72px;
                    height: 72px;
                    background-position: 0 0;
                    background-repeat: no-repeat;
                    background-size: 72px 72px;
                    margin-right: 12px;
                    margin-left: -36px;
                    mix-blend-mode: lighten;
                }

                .ico1 {
                    background-image: url(~@/components/onboarding/img/joinbylink-ico-01-72.gif);
                }

                .ico2 {
                    background-image: url(~@/components/onboarding/img/joinbylink-ico-02-72.gif);
                }

                .ico3 {
                    background-image: url(~@/components/onboarding/img/joinbylink-ico-03-72.gif);
                }

                .rgt {
                    @include flex(column, flex-start, flex-start);

                    .tt {
                        font-weight: 700;
                        font-size: 16px;
                        margin-bottom: 12px;
                    }

                    .pgbar {
                        position: relative;
                        width: 280px;
                        height: 4px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 2px;

                        .bar {
                            position: absolute;
                            height: 4px;
                            border-radius: 2px;
                            background: #64B4FA;
                        }
                    }
                }
            }

            .eula {
                @include flex;
                position: absolute;
                width: 500px;
                height: 654px;
                left: calc((100% - 500px)/2);
                top: calc((100% - 680px)/2);
                background-image: url(~@/components/onboarding/img/joinbylink-mac-EULA.png);
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: 500px 654px;
            }
        }

    }

    &.dark {
        color: $text-color-primary-dark-ui;
    }

}</style>
