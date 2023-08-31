<template>
    <div 
      class="recording-reel"
      ref="container"
      :class="[theme]"
    >
        <div 
            class="imglist"
            :style="{
                width: `${imgwidth}px`,
                height: `${imgheight}px`,
            }"
        >
            <div class="imgs"
                :style="{
                    height: `${imgheight}px`,
                    marginLeft: `-${imgindex * imgwidth}px`,
                }"
                 @click="play"
            >
                <div v-for="(itm, idx) in datalist" 
                    :key="`k${idx}`"
                    class="img"
                    :style="{
                        backgroundImage: `url(${$store.state.recordingPath}${itm.img})`, 
                        width: `${imgwidth}px`,
                        height: `${imgheight}px`,
                    }"
                ></div>
            </div>

            <div v-if="datalist" class="dots" >
                <div v-for="(itm, idx) in datalist" 
                    :key="`d${idx}`"
                    class="dot"
                    :class="{
                        active: idx == imgindex,
                    }"
                    @click="goId(idx)"
                ></div>
            </div>

            <div v-if="datalist" class="arrbtn btn-l" :disabled="imgindex == 0" @click="previous" >
                <wl-icon name="arrow-left-bold" size="16" />
            </div>
            <div v-if="datalist" class="arrbtn btn-r" :disabled="imgindex == datalist.length-1" @click="next" >
                <wl-icon name="arrow-right-bold" size="16" />
            </div>
            <div v-if="datalist" class="playbtn" @click="play" >
                <wl-icon name="play-bold" size="18" color="black" />
            </div>

        </div>
        <div v-if="datalist" class="textinfo">
            <div class="line1">
                {{ selectedMeeting.title}} {{` `}} {{ datalist[imgindex].name }}
            </div>
            <div class="line2">
                {{ datalist[imgindex].date }}
                <wl-icon name="dot-divider" size="4" class="divd" />
                {{ datalist[imgindex].time }}
                <wl-icon name="dot-divider" size="4" class="divd" />
                {{ datalist[imgindex].dur }}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        selectedMeeting: {
            type: Object,
        },
        datalist: {
            type: Array,
        },
    },
    data() {
        return {
            imgindex: 0,
            imgwidth: 0,
            imgheight: 0,
            resizeObserver: null,
        }
    },
    computed:{
      os() {
        return this.$store.state.os;
      },
      theme() {
        return this.$store.state.theme;
      },

    },
    mounted(){
      this.setImgSize()

      const elem = this.$refs.container;
      this.resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
              if (entry.contentRect) {
                  if (elem) {
                    this.setImgSize()
                  } else {
                    this.resizeObserver.unobserve(elem);
                  }
              }
          }
      });
      this.resizeObserver.observe(elem);

    },
    beforeDestroy() {
        const elem = this.$refs.container;
        this.resizeObserver.unobserve(elem);
    },
    watch: {
        imgindex(val) {
            this.$emit('change', this.datalist[val])
        }
        
    },
    methods:{
        setImgSize() {
            if (this.cooldown) {
                return
            }
            this.cooldown = true
            let re = this.$refs.container.getBoundingClientRect()
            let wid = re.width
            this.imgwidth = wid
            this.imgheight = Math.floor(wid / 1.5)
            setTimeout(() => {
                this.cooldown = false
            }, 300)
        },
        previous() {
            if (this.imgindex > 0) {
                this.imgindex--
            }
        },
        next() {
            if (this.imgindex < this.datalist.length - 1) {
                this.imgindex++
            }
        },
        goId(id) {
            this.imgindex = id
        },
        play() {
            this.$emit('play')
        },
    }
}
</script>


<style lang="scss">
.recording-reel {
  display: flex(column);
  width: 100%;

  .imglist {
    position: relative;
    display: flex;
    overflow: hidden;
    border-radius: 8px;

    .imgs {
        position: relative;
        display: flex;
        transition: margin .3s;
    }

    .img {
        background-size: cover;
        background-position: ce;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .dots {
        @include flex;
        position: absolute;
        height: 8px;
        width: 100%;
        bottom: 8px;

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 0 4px;
            background: rgba(255, 255, 255, 0.2);

            &.active {
                background: #64B4FA;
            }
        }
    }

    .arrbtn {
        position: absolute;
        @include flex;
        width: 28px;
        height: 28px;
        border-radius: 50%;

        &:hover {
            background: rgba(0,0,0, 0.1);
        }
        &:active {
            background: rgba(0,0,0, 0.2);
        }

        &.btn-l {
            left: 4px;
            top: calc((100% - 28px)/2);
        }
        &.btn-r {
            right: 4px;
            top: calc((100% - 28px)/2);
        }

        &[disabled] {
            opacity: .4;
        }
    }

    .playbtn {
        position: absolute;
        @include flex;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        top: calc((100% - 40px)/2);
        left: calc((100% - 40px)/2);
        background: white;
    }
  }

  .textinfo {
    margin-top: 8px;

    .line1 {
        font-size: 16px;
    }
    .line2 {
        @include flex(row, flex-start);
        font-size: 12px;
        opacity: .7;

        .divd {
            margin: 0 4px;
        }
    }
  }

  /* theme ----- dark/hybrid */

}

</style>
