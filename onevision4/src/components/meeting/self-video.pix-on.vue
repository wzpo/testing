<template>
  <drag-resize
    :isActive="true"
    :preventActiveBehavior="true"
    :w="videoW"
    :h="videoH"
    :maxw="videoMaxW"
    :maxh="videoMaxH"
    :minw="160"
    :minh="90"
    :x="viewx"
    :y="viewy"
    :parentW="parentW"
    :parentH="parentH"
    :isDraggable="false"
    :isResizable="preloadImmersiveVideo || peopleList.length > 1"
    :aspectRatio="true"
    :parentLimitation="true"
    :showHandle="preloadImmersiveVideo && (ctrlVisible || dragging || resizing)"
    @stickover="mouseover"
    @stickout="mouseout"
    @resizing="onresizing"
    @resizestop="onresizestop"
  
    class="dragwrap self_video_dragwrap"
    ref="self_video_dragwrap"
    :class="{
      shadow: !preloadImmersiveVideo,
      full: peopleList.length === 1,
      fade: autoHideSelfVideo && !hudVisible,
    }"
  >
    <div id='self_video' 
      ref="self_video" 
      :class="[theme, {immersive: preloadImmersiveVideo}]"
      @mouseenter="mouseover" 
      @mouseleave="mouseout"
      @mousedown="mousedown"
    >
      <div v-if="!cameraOn" class='avatar'
        :style='{
          backgroundImage: avatarUrl,
          width: avatarSize,
          height: avatarSize,
        }'
      ></div>
      <video v-show="cameraOn" id="camera" :class="{mirror: selfvideoMirror, hide: selfvideoBgEffect==='transparent'}" :width="videoW" :height="videoH" autoplay="true" ></video>
      <canvas v-show="cameraOn" id="cameracanvas" v-if="selfvideoBgEffect!==null" :class="{mirror: selfvideoMirror}" :width="videoW" :height="videoH"></canvas>
      <div class="ctrl" v-if="ctrlVisible || menuVisible">
        <div></div> <!--place holder-->
        <div ref="btnmore" class="btn btn-more" @click="showMenu" >
          <wl-icon name="more-bold" size="12" />
        </div>
      </div>
    </div>
  </drag-resize>
  </template>
  
  <script>
  import menuVideo from './menu-video.vue';
  import * as tf from '@tensorflow/tfjs';
  import '@tensorflow/tfjs-backend-webgl';
  import * as bodyPix from '@tensorflow-models/body-pix';
  
  export default {
    props: [
      'meetingId',
    ],
    data() {
      return {
        viewx: null,
        viewy: null,
        minimized: false,
        ctrlVisible: false,
        menuVisible: false,
        dragging: false,
        resizing: false,
        videoW: 240,
        videoH: 135,
        videoMaxW: 6400,
        videoMaxH: 3600,
        bodyPixNet: null,
        parentW: 9999,
        parentH: 9999,
        mouseX: 0,
        mouseY: 0,
        stripDragPosition: {
          left: 0,
          top: 0,
        },
        avatarSize: '68px',
      };
    },
    computed: {
      os() {
        return this.$store.state.os;
      },
      theme() {
        return this.$store.state.theme;
      },
      themeColor() {
        return this.$store.state.themeColor;
      },
      systemBarVisible() {
        return this.$store.state.systemBarVisible;
      },
      cameraOn() {
        return this.$store.state.cameraOn;
      },
      peopleList() {
        return this.$store.state.peopleList;
      },
      me(){
        return this.$store.getters.me
      },
      sidePanelIsOpen(){
        return this.$store.state.sidePanelIsOpen;
      },
      fullscreen(){
        return this.$store.state.fullscreen;
      },
      windowsSizeChanged(){
        return this.$store.state.windowsSizeChanged;
      },
      selfSharing(){
        return this.$store.state.selfSharing;
      },
      immersiveShare(){
        return this.$store.state.immersiveShare;
      },
      selfvideoBgEffect(){
        return this.$store.state.selfvideoBgEffect;
      },
      selfvideoMirror(){
        return this.$store.state.selfvideoMirror;
      },
      selfvideoUpdated(){
        return this.$store.state.selfvideoUpdated;
      },
      autoHideSelfVideo(){
        return this.$store.state.autoHideSelfVideo;
      },
      hudVisible() {
        return this.$store.state.hudVisible;
      },
      popShareVisible(){
        return this.$store.state.popShareVisible;
      },
      preloadImmersiveVideo(){
        return this.$store.state.selfSharing && this.$store.state.immersiveShare || this.$store.state.popShareVisible;
      },
      avatarUrl(){
        const avatar = this.me.avatar;
        if(avatar !== null){
            return 'url('+this.$store.state.avatarPath+avatar+')';
        }else{
            return 'none';
        }
      },
    },
    beforeMount() {
      if (this.preloadImmersiveVideo) {
        this.setPosition();
      }
    },
    mounted() {
      if (this.cameraOn) {
        this.initCam();
      }
      requestAnimationFrame(() => {
        this.setPosition();
        this.initResizeWatch()
      });
    },
    beforeDestroy() {
      const elem = this.$refs.self_video;
      this.resizeObserver.unobserve(elem);
      this.resizeObserver = null;
  
    },
    watch: {
      
      cameraOn(val) {
        if (val) {
          this.initCam();
        }
      },
      windowsSizeChanged() {
        requestAnimationFrame(() => {
          this.setPosition();
        });
      },
  
      selfvideoBgEffect(val) {
        if (val !== null && this.cameraOn) {
          this.loadBodyPix();
        }
      },
    },
    methods: {
      setPosition(reset = false) {
        var parentSelector = `.meetings-app[name='${this.meetingId}']`
  
        const rect0 = document.querySelector(this.preloadImmersiveVideo ? '#desktop' : `${parentSelector} #maincon-L`).getBoundingClientRect();
        this.parentW = rect0.width;
        this.parentH = rect0.height;
  
        if (!this.preloadImmersiveVideo && document.querySelector(`${parentSelector} .video-pane`) && document.querySelector(`${parentSelector} .self_video_dragwrap`)) {
          
          const rect = document.querySelector(`${parentSelector} .video-pane`).getBoundingClientRect();
          const rcsv = document.querySelector(`${parentSelector} .self_video_dragwrap`).getBoundingClientRect();
          const ox = rect.left - rect0.left;
          const oy = rect.top - rect0.top;
          if (this.viewx === null || reset) {
            this.viewx = ox + rect.width - rcsv.width - 10;
          }
          if (this.viewy === null || reset) {
            this.viewy = oy + rect.height - rcsv.height - 10;
          }
          if (this.viewx > ox + rect.width - rcsv.width) {
            this.viewx = ox + rect.width - rcsv.width - 10;
          }
          if (this.viewy > oy + rect.height - rcsv.height) {
            this.viewy = oy + rect.height - rcsv.height - 10;
          }
        } else if (this.preloadImmersiveVideo) {
          const rect = document.getElementById('desktop').getBoundingClientRect();
          
          if (rect.width / rect.height > 16 / 10) {
            this.videoH = rect.height / 2.2;
            this.videoW = this.videoH / 9 * 16;
          } else {
            this.videoW = rect.width / 2.2;
            this.videoH = this.videoW / 16 * 9;
          }
          
          if (this.viewx === null) {
            this.viewx = rect.width - this.videoW - 4;
          }
          if (this.viewy === null) {
            if (this.systemBarVisible && this.os === 'win') {
              this.viewy = rect.height - this.videoH - 40 - 2;
            } else {
               this.viewy = rect.height - this.videoH - 4;
            }
          }
        }
        this.stripDragPosition = {
          left: this.viewx,
          top: this.viewy,
        };
  
      },
  
      onresizing() {
        this.resizing = true;
      },
      onresizestop() {
        this.resizing = false;
      },
      mousedown(evt) {
        this.$popper.hideAll();
  
        evt.stopPropagation();
        this.mouseX = evt.pageX;
        this.mouseY = evt.pageY;
        window.addEventListener("mousemove", this.videoDragging);
        window.addEventListener("mouseup", this.videoStopDrag);
      },
      videoDragging(evt){
        const px = evt.pageX;
        const py = evt.pageY;
        if (!this.dragging) {
          this.dragging = true;
          const video = document.getElementById('camera');
          video.pause();
        }
        
        if (this.dragging) {
          const ox = px - this.mouseX;
          const oy = py - this.mouseY;
          this.stripDragPosition.left += ox;
          this.stripDragPosition.top += oy
          this.viewx = this.stripDragPosition.left;
          this.viewy = this.stripDragPosition.top;
          this.mouseX = px;
          this.mouseY = py;
        }
  
      },
      videoStopDrag(){
        this.dragging = false;
        const video = document.getElementById('camera');
        video.play();
  
        window.removeEventListener("mousemove", this.videoDragging);
        window.removeEventListener("mouseup", this.videoStopDrag);
      },
      
      initCam() {
        const constraints = { audio: false, video: { width: this.videoW, height: this.videoH } };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((mediaStream) => {
              const video = document.getElementById('camera');
              video.srcObject = mediaStream;
              video.onloadedmetadata = () => {
                  video.play();
                  if (this.preloadImmersiveVideo) {
                    tf.setBackend('webgl').then(() => this.loadBodyPix());
                  }
              };
          })
          .catch(function(err) {
              console.log(err.name + ': ' + err.message);
          });
      },
  
      mouseover(){
        this.ctrlVisible = true;
      },
      mouseout(){
        if(this.ctrlVisible && !this.menuVideoVisible){
          this.ctrlVisible = false;
        }
      },
  
      loadBodyPix() {
        if (this.bodyPixNet) {
          this.performBodyPix();
          return;
        }
  
        const cfg = {
            architecture: 'ResNet50',
            outputStride: 16,
            quantBytes: 2,
        };
  
        bodyPix.load(cfg)
          .then(net => {
            this.bodyPixNet = net;
            this.performBodyPix();
          })
          .catch(err => console.log(err))
      },
  
      async performBodyPix() {
        if (this.selfvideoBgEffect === null) {
          return;
        }
        const net = this.bodyPixNet;
        const video = document.getElementById('camera');
        const canvas = document.getElementById('cameracanvas');
        const flipHorizontal = this.selfvideoMirror;
  
        const opt = {
          flipHorizontal: flipHorizontal,
          internalResolution: 'medium',
          segmentationThreshold: 0.7,
        };
        const segmentation = await net.segmentPerson(video, opt);
        
        if (canvas && this.selfvideoBgEffect === 'transparent') {
  
          // Convert the segmentation into a mask to darken the background.
          const foregroundColor = {r: 0, g: 0, b: 0, a: 255};
          const backgroundColor = {r: 0, g: 0, b: 0, a: 0};
          const maskImageData = bodyPix.toMask(
              segmentation, foregroundColor, backgroundColor);
  
          const ctx = canvas.getContext('2d');
          ctx.filter = 'blur(4px)';
          ctx.putImageData(maskImageData, 0, 0);
          ctx.drawImage(canvas, 0, 0, this.videoW, this.videoH);
          ctx.filter = 'blur(0px)';
          ctx.globalCompositeOperation='source-in';
          ctx.drawImage(video, 0, 0, this.videoW, this.videoH);
  
        } else if (this.selfvideoBgEffect === 'blur') {
          const backgroundBlurAmount = 6;
          const edgeBlurAmount = 1;
          bodyPix.drawBokehEffect(
            canvas, video, segmentation, backgroundBlurAmount,
            edgeBlurAmount, flipHorizontal);
        }
  
        if (this.selfvideoUpdated === 0) {
          this.$store.commit('selfvideoUpdated', 1);
        }
  
        requestAnimationFrame(() => {this.performBodyPix(net)});
  
      },
  
      showMenu() {
        if (!this.menuVisible) {
          this.$popper.show(
            menuVideo,
            {
              meetingId: this.meetingId,
              theme: this.theme,
              menuVideoName: this.me.name,
             }, // component props
            {
              reference: this.$refs.btnmore,
              closeTrigger: 'mousedown',
              arrowVisible: false,
              roundedCorner: true,
              borderRadius: '12px',
              appendToBody: true,
              theme: `${this.theme} ${this.themeColor}`,
              boundariesSelector: '.meetings-app',
              options: {placement: 'bottom-end'},
              affiliatedElementSelector: ['.sub-menulist'],
            }, // popper props
            {
              opened: () => {this.menuVisible = true},
              closed: () => {this.menuVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },
  
      initResizeWatch() {
        // watch resize
        const elem = this.$refs.self_video;
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.contentRect) {
                    this.calcElementSize();
                }
            }
        });
        this.resizeObserver.observe(elem);
      },
  
      calcElementSize() { 
        if (this.$refs.self_video) {
          const videoitm = this.$refs.self_video.getBoundingClientRect();
          const avasize = videoitm.height / 2;
          this.avatarSize = `${avasize}px`;
        }
      },
    },
  };
  </script>
  
  <style lang="scss">
  .dragwrap {
    pointer-events: auto;
    z-index: 11 !important;
  
    &.shadow {
      box-shadow: 0px 12px 36px rgba(0, 0, 0, 0.5), 0px 0px 1px rgba(0, 0, 0, 0.12);
    }
  
    #self_video {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: 4px;
      overflow: hidden;
      transform: rotate(0deg);
      background-color: #000;
      pointer-events: auto;
  
      &.immersive {
        background-color: transparent;
        .ctrl .btn {
          background-color: #DEDEDE;
        }
      }
  
      .avatar {
        @include flex;
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        overflow: hidden;
        background-size: cover;
        transform:translate(-50%,-50%);
      }
  
      #self_video:hover #camera {
        opacity: .76;
      }
  
      #camera {
        position: absolute;
        transform: scale(1.01, 1.01);
        width: auto;
        height: 100%;
  
        &.mirror {
          transform: scale(-1.01, 1.01);
        }
        &.hide {
          opacity: 0;
        }
      }
  
      #cameracanvas {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
  
        &.mirror {
          transform: scale(-1, 1);
        }
      }
  
      .full {
        width: 100% !important;
        height: 100% !important;
        top: 0 !important;
        left: 0 !important;
        pointer-events: none !important;
      }
      .full #self_video {
        box-shadow: none !important;
        pointer-events: auto !important;
      }
      .full #camera {
        height: auto;
        width: 100%;
      }
  
      .ctrl {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 6px;
        position: absolute;
        top: 6px;
        height: 28px;
        width: 100%;
  
        .btn{
          height: 28px;
          width: 28px;
          background-color: $md-gray-05;
          border: 1px solid rgba($color: #000000, $alpha: .3);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
  
          &:hover,
          &:active{
            background-color: $md-gray-10;
          }
        }
      }
  
      .btn-min .ico{
        transform: scale(-1, 1);
      }
  
      .wrap {
        width: 180px;
        margin-top: 6px;
        margin-bottom: 6px;
      }
  
      .itm{
        height: 32px;
        cursor: default;
        user-select: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 15px;
      
      }
      .itm:hover{
          background: #E5FBFF;
      }
      .itm .lb{
          font-size: 14px;
          pointer-events: none;
          padding-left: 8px;
      }
  
      .fade {
        transition: opacity 0.3s ease-out;
        opacity: 0;
      }
  
      /* ------------------ drak/hybrid ------------------ */
  
      &.dark,
      &.hybrid {
        color: $text-color-primary-dark-ui;
        
        #self_video.immersive .ctrl .btn{
          background-color: $md-gray-70;
        }
          
        .ctrl .btn {
          background-color: $md-gray-95;
          border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
  
          &.off {
            background-color: $md-red-60;
          }
        }
      }
  
    }
  }
  
  </style>
  