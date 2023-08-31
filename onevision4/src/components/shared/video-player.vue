<template>
    <div class="video-player" ref="videoplayer">
        <div class="video-container" ref="videocontainer">
            <video class="video" ref="video" width="100%" height="100%" preload="auto" poster="" :autoplay="false">
                <source :src="src" type="video/mp4" />
            </video>
        </div>
        <div class="video-controls">
            <div class="row1">
                <div class="playbtn" @click="togglePlay">
                    <wl-icon v-show="!isPlay" name="play-bold" size="20" />
                    <wl-icon v-show="isPlay" name="pause-bold" size="20" />
                </div>
                <div class="progress">
                    <input class="seek styled-slider slider-progress" ref="seek" value="0" min="0" type="range" step="1"
                        @input="skipAhead" />
                </div>
            </div>
            <div class="row2">
                <div class="sec">
                    <span class="time">{{currentTime}} / {{duration}}</span>
                    <span class="btn">
                        <wl-icon name="rewind-10-bold" size="20" />
                    </span>
                    <span class="btn">
                        <wl-icon name="forward-10-bold" size="20" />
                    </span>
                    <span class="btn">
                        1X
                    </span>
                    <span class="btn">
                        <wl-icon name="speaker-bold" size="20" />
                    </span>
                </div>

                <div class="sec">
                    <span class="btn">
                        <wl-icon name="user-bold" size="20" />
                    </span>
                    <span class="btn">
                        <wl-icon name="closed-captions-bold" size="20" />
                    </span>
                    <span class="btn">
                        <wl-icon name="picture-in-picture-bold" size="20" />
                    </span>
                    <span class="btn">
                        <wl-icon name="fullscreen-bold" size="20" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        src: String,
        fromTime: Number,
    },
    data() {
        return {
            player: null,
            video: {},
            isPlay: false,

            lastVolume: 1,

            isSpeedSheet: false,
            isMax: false,
            fullscreen: false,

            currentTime: '',
            duration: '',

        }
    },
    computed: {
        os() {
            return this.$store.state.os;
        },
        theme() {
            return this.$store.state.theme;
        },

    },
    beforeMount() {

    },
    mounted() {
        this.player = this.$refs.videoplayer;
        this.video = this.$refs.video
        const video = this.video
        video.addEventListener('click', this.togglePlay);
        video.addEventListener('play', this.updatePlayButton);
        video.addEventListener('pause', this.updatePlayButton);
        video.addEventListener('ended', this.stop);
        video.addEventListener('timeupdate', this.updateProgress);
        video.addEventListener('canplay', this.updateProgress);

        this.$nextTick(() => {
            let rect = this.$refs.videocontainer.getBoundingClientRect()
            this.video.style.maxWidth = `${rect.width}px`
            this.video.style.maxHeight = `${rect.height}px`
        })

        if(this.fromTime >= 0){
            const seek = this.$refs.seek
            seek.value = video.currentTime = this.fromTime
        }
        this.setSeekbar()


    },
    watch: {
        fromTime(val) {
            const video = this.$refs.video
            const seek = this.$refs.seek
            seek.value = video.currentTime = val
        },
    },
    methods: {
        togglePlay() {
            const video = this.$refs.video
            if (video.paused || video.ended) {
                video.play();
                this.isPlay = true
            }
            else {
                video.pause();
                this.isPlay = false
            }
        },
        stop() {
            const video = this.$refs.video
            video.pause();
            this.isPlay = false
        },
        rewind() {
            const video = this.$refs.video
            let skip = video.currentTime - 10;
            video.currentTime = skip;
            this.$refs.seek.value = skip;
        },
        forward() {
            const video = this.$refs.video
            let skip = video.currentTime + 10;
            video.currentTime = skip;
            this.$refs.seek.value = skip;
        },

        // Function For Time Making
        neatTime(time) {
            let minutes = Math.round((time % 3600) / 60);
            let seconds = Math.round(time % 60);
            minutes = minutes > 9 ? minutes : `0${minutes}`;
            seconds = seconds > 9 ? seconds : `0${seconds}`;
            return `${minutes}:${seconds}`;
        },

        // Function For Makeing Seconds Into Minutes formet
        formatTime(timeInSeconds) {
            const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

            return {
                minutes: result.substr(3, 2),
                seconds: result.substr(6, 2),
            };
        },

        // Updateing Seekbar
        updateProgress() {
            const video = this.$refs.video
            const seek = this.$refs.seek

            seek.value = Math.ceil(video.currentTime);
            this.currentTime = `${this.neatTime(video.currentTime)}`;

            // isMax Is For Set Max For Seekbar Only 1 Time
            if (!this.isMax) {
                const time = this.formatTime(Math.round(video.duration))
                this.duration = `${time.minutes}:${time.seconds}`;
                seek.setAttribute('max', Math.round(video.duration));
                this.isMax = true;
            }

            this.setSeekbar()
        },

        setSeekbar() {
            // css trick slider-progress 显示两种颜色
            for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
                e.style.setProperty('--value', e.value);
                e.style.setProperty('--min', e.min == '' ? '0' : e.min);
                e.style.setProperty('--max', e.max == '' ? '100' : e.max);
                e.addEventListener('input', () => e.style.setProperty('--value', e.value));
            }
        },


        // Function For Skip Video By Seekbar
        skipAhead(event) {
            const video = this.$refs.video
            const seek = this.$refs.seek

            const skipTo = event.target.dataset.seek
                ? event.target.dataset.seek
                : event.target.value;
            video.currentTime = skipTo;
            seek.value = skipTo;
        },

        //Function For Fullscreen
        launchIntoFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        },

        toggleFullscreen() {
            this.fullscreen ? this.exitFullscreen() : this.launchIntoFullscreen(this.player)
            this.fullscreen = !this.fullscreen;
        },


    }
}
</script>


<style lang="scss">
.video-player {
    @include flex(column);
    color: white;
    width: 100%;
    user-select: none;
    flex-grow: 1;

    .video-container {
        @include flex;
        width: 100%;
        flex-grow: 1;
    }

    .video-controls {
        @include flex(column);
        width: 100%;
        margin-top: 16px;

        .row1 {
            @include flex;
            width: 100%;

            .playbtn {
                @include flex;
                width: 20px;
                height: 20px;
                margin-right: 12px;
            }

            .progress {
                @include flex;
                flex-grow: 1;
                cursor: pointer;
                width: 100%;
                margin: auto;
                border-radius: 2px;
            }

            .seek {
                cursor: pointer;
                width: 100%;
            }

            /*generated with Input range slider CSS style generator (version 20211225)
            https://toughengineer.github.io/demo/slider-styler*/
            input[type=range].styled-slider {
                height: 2px;
                -webkit-appearance: none;
            }

            /*progress support*/
            input[type=range].styled-slider.slider-progress {
                --range: calc(var(--max) - var(--min));
                --ratio: calc((var(--value) - var(--min)) / var(--range));
                --sx: calc(0.5 * 16px + var(--ratio) * (100% - 16px));
            }

            input[type=range].styled-slider:focus {
                outline: none;
            }

            /*webkit*/
            input[type=range].styled-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 16px;
                background: #262626;
                margin-top: calc(2px * 0.5 - 16px * 0.5);
                border: 1px solid rgba(255, 255, 255, 0.4);
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.18);
                box-sizing: border-box;
            }

            input[type=range].styled-slider::-webkit-slider-runnable-track {
                height: 2px;
                border: none;
                background: #333;
                box-shadow: none;
            }

            input[type=range].styled-slider::-webkit-slider-thumb:hover {
                background: #262626;
            }

            input[type=range].styled-slider:hover::-webkit-slider-runnable-track {
                background: #333;
            }

            input[type=range].styled-slider::-webkit-slider-thumb:active {
                background: #262626;
            }

            input[type=range].styled-slider:active::-webkit-slider-runnable-track {
                background: #333;
            }

            input[type=range].styled-slider.slider-progress::-webkit-slider-runnable-track {
                background: linear-gradient(#64B4FA, #64B4FA) 0/var(--sx) 100% no-repeat, #333;
            }

            input[type=range].styled-slider.slider-progress:hover::-webkit-slider-runnable-track {
                background: linear-gradient(#64B4FA, #64B4FA) 0/var(--sx) 100% no-repeat, #333;
            }

            input[type=range].styled-slider.slider-progress:active::-webkit-slider-runnable-track {
                background: linear-gradient(#64B4FA, #64B4FA) 0/var(--sx) 100% no-repeat, #333;
            }

            /*mozilla*/
            input[type=range].styled-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 16px;
                background: #262626;
                border: 1px solid rgba(255, 255, 255, 0.4);
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.18);
                box-sizing: border-box;
            }

            input[type=range].styled-slider::-moz-range-track {
                height: 2px;
                border: none;
                border-radius: 2px;
                background: #333;
                box-shadow: none;
            }

            input[type=range].styled-slider::-moz-range-thumb:hover {
                background: #262626;
            }

            input[type=range].styled-slider:hover::-moz-range-track {
                background: #333;
            }

            input[type=range].styled-slider::-moz-range-thumb:active {
                background: #262626;
            }

            input[type=range].styled-slider:active::-moz-range-track {
                background: #333;
            }

            input[type=range].styled-slider.slider-progress::-moz-range-track {
                background: linear-gradient(#64B4FA, #64B4FA) 0/var(--sx) 100% no-repeat, #333;
            }

            input[type=range].styled-slider.slider-progress:hover::-moz-range-track {
                background: linear-gradient(#64B4FA, #64B4FA) 0/var(--sx) 100% no-repeat, #333;
            }

            input[type=range].styled-slider.slider-progress:active::-moz-range-track {
                background: linear-gradient(#64B4FA, #64B4FA) 0/var(--sx) 100% no-repeat, #333;
            }

            /*ms*/
            input[type=range].styled-slider::-ms-fill-upper {
                background: transparent;
                border-color: transparent;
            }

            input[type=range].styled-slider::-ms-fill-lower {
                background: transparent;
                border-color: transparent;
            }

            input[type=range].styled-slider::-ms-thumb {
                width: 16px;
                height: 16px;
                border-radius: 16px;
                background: #262626;
                margin-top: 0;
                border: 1px solid rgba(255, 255, 255, 0.4);
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.18);
                box-sizing: border-box;
            }

            input[type=range].styled-slider::-ms-track {
                height: 2px;
                border-radius: 2px;
                background: #333;
                border: none;
                box-shadow: none;
                box-sizing: border-box;
            }

            input[type=range].styled-slider::-ms-thumb:hover {
                background: #262626;
            }

            input[type=range].styled-slider:hover::-ms-track {
                background: #333;
            }

            input[type=range].styled-slider::-ms-thumb:active {
                background: #262626;
            }

            input[type=range].styled-slider:active::-ms-track {
                background: #333;
            }

            input[type=range].styled-slider.slider-progress::-ms-fill-lower {
                height: 2px;
                border-radius: 2px 0 0 2px;
                margin: -undefined 0 -undefined -undefined;
                background: #64B4FA;
                border: none;
                border-right-width: 0;
            }

            input[type=range].styled-slider.slider-progress:hover::-ms-fill-lower {
                background: #64B4FA;
            }

            input[type=range].styled-slider.slider-progress:active::-ms-fill-lower {
                background: #64B4FA;
            }

        }

        .row2 {
            @include flex(row, space-between);
            width: 100%;
            height: 40px;
            margin-top: 4px;

            .sec {
                @include flex;

                .time {
                    margin-right: 8px;
                }
                .btn {
                    @include flex;
                    height: 40px;
                    width: 40px;
                    margin-right: 8px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }
    }

}
</style>
