<template>
    <div class="handtrack-container" ref="container" :class="{dark:dark}">
        <canvas class="output-canvas" ref="canvas" :width="canvasSize.width" :height="canvasSize.height"></canvas>
        <div class="output-msg" :class="{loaded: ready}"><content-loader v-if="!ready" :scale="2" class="loader" />{{ outputMsg }}</div>
        <div v-if="ready" class="cursor" ref="cursor"></div>
    </div>
</template>

<script>
import * as yoha from '@handtracking.io/yoha';

export default {
    props: {
        dark: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            outputMsg: '',
            cursor: null,
            points: null,
            allowDraw: false,
            ready: false,
            canvasSize: {
                width:0,
                height:0,
            },
            resizeObserver: null,
            DISTANCE_THRESHHOLD: 10, // 两个绘图点之间最小间隔，小于这个数值不会画，避免抖动
        }
    },
    computed: {
        os() {
            return this.$store.state.os;
        },
    },
    mounted() {
        this.run()

        const elem = this.$refs.container;
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
            if (entry.contentRect) {
                this.resizeLayout();
            }
            }
        });
        this.resizeObserver.observe(elem);
    },
    beforeDestroy() {
      const elem = this.$refs.container;
      this.resizeObserver.unobserve(elem);
      this.resizeObserver = null
    },
    watch: {

    },
    methods: {
        resizeLayout() {
            const rect = this.$refs.container.getBoundingClientRect()
            this.canvasSize = {
                width: rect.width,
                height: rect.height,
            }
        },

        setCursorVisibility(visible) {
            if (!visible) {
                this.cursor.style.display = 'none';
            } else {
                this.cursor.style.display = 'block';
            }
        },

        setCursorColor(color) {
            this.cursor.style.backgroundColor = color;
        },

        setCursorPosition(left, top) {
            const rect = this.$refs.container.getBoundingClientRect()
            let x = rect.width * left
            let y = rect.height * top
            
            this.cursor.style.left = x + 'px';
            this.cursor.style.top = y + 'px';

            const canvas = this.$refs.canvas

            if (canvas.getContext && this.allowDraw) {
                const ctx = canvas.getContext('2d');
                // Reset the current path
                if (!this.points) {
                    this.points = [x, y]
                    ctx.lineWidth = 4;
                    ctx.strokeStyle='rgba(255,255,255,1)';
                    ctx.shadowColor='rgba(240,103,126,.5)';
                    ctx.shadowBlur=3;
                    ctx.beginPath();
                } else {
                    if (this.distance(this.points, [x, y]) > this.DISTANCE_THRESHHOLD) {
                        ctx.moveTo(this.points[0], this.points[1]);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        this.points = [x, y]
                    }
                    
                }

            } else {
                this.points = null
            }
        },

        async run() {
            // Download models.
            const modelFiles = await yoha.DownloadMultipleYohaTfjsModelBlobs(
                'https://uxccds.github.io/static/tfjs/yoha/models/box/model.json',
                'https://uxccds.github.io/static/tfjs/yoha/models/lan/model.json',
                (rec, total) => {
                    let per = Math.floor((rec / total) * 100)
                    this.outputMsg = 'Loading ' + per + '%'
                    if (per === 100) {
                        this.ready = true
                        this.outputMsg = 'PINCH to draw'
                    }
                }
            );

            this.cursor = this.$refs.cursor

            // Setup video feed.
            const streamRes = await yoha.CreateMaxFpsMaxResStream();
            if (streamRes.error) {
                // Non-production ready error handling...
                console.error(streamRes.error);
                return;
            }
            const video = yoha.CreateVideoElementFromStream(streamRes.stream);

            const thresholds = yoha.RecommendedHandPoseProbabilityThresholds;

            // run engine.
            // We configure small padding to avoid that users move their hand outside webcam view
            // when trying to move the cursor towards the border of the viewport.
            yoha.StartTfjsWebglEngine({ padding: 0.01 }, video, modelFiles, res => {
                if (res.isHandPresentProb < thresholds.IS_HAND_PRESENT) {
                    this.setCursorVisibility(false);
                    return;
                }
                this.setCursorVisibility(true);

                // Change color depending on gesture.
                if (res.poses.fistProb > thresholds.FIST) {
                    this.setCursorColor('#F2990A')
                    this.allowDraw = false
                    this.outputMsg = 'FIST'
                } else if (res.poses.pinchProb > thresholds.PINCH) {
                    this.setCursorColor('#3CC29A')
                    this.allowDraw = true
                    this.outputMsg = 'Drawing'
                } else {
                    this.setCursorColor('#1170CF')
                    this.allowDraw = false
                    this.outputMsg = 'PINCH to draw'
                }

                // Change cursor position.
                // We only use one coordinate here...
                this.setCursorPosition(...res.coordinates[0]);
            });
        },

        distance (point1, point2){
            return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2))
        },
    }
}
</script>


<style lang="scss">
.handtrack-container {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    

    .output-msg {
        @include flex;
        position: absolute;
        width: 100%;
        height: 100%;
        color: black;
        font-size: 16px;
        font-weight: bold;
        transition: all .3s;
        text-shadow: 0 0 3px #000, 0 0 3px #000;

        &.loaded {
            height: 32px;
            font-size: 12px;
        }
        .loader {
            margin-right: 20px;
        }
    }

    .output-canvas {
        position: absolute;
        background-color: transparent;
    }

    .cursor {
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: red;
        transform: translate(-8px, -8px);
    }

    &.dark {
        .output-msg {
            color: white;
        }
        
    }
}
</style>
