<template>
  <div 
    id="fit"
    ref="fit"
    :class="[
      `dock${!isFitDragging ? dockSide : ''}`, 
      {
        trans: !isFitDragging && fitTransEnabled,
      }
    ]"
    :style="{
      top: !isFitDragging && dockSide === 'B' ? '' : fitTop,
      bottom: !isFitDragging && dockSide === 'B' ? `${stickMarginBottom}px` : '',
      left: !isFitDragging && dockSide === 'R' ? '' : fitLeft,
      right: !isFitDragging && dockSide === 'R' ? '0' : '',
      width: fitOption === 1 && barShrinked ? '44px' : fitOption === 2 && (dockSide === 'L' || dockSide === 'R') ? '44px' : '458px',
    }"
    @mouseover="() => { if(!isFitDragging) clsVisible=true }"
    @mouseout="clsVisible=false"
  >


    <div 
      class="bar" 
      ref="bar" 
      :class="{
        trans: !isFitDragging && barTransEnabled,
        vertical: fitOption === 2 && (dockSide === 'L' || dockSide === 'R')
      }" 
    >

      <div 
        class="bararr arrleft" 
        v-if="dockSide === 'R' && barShrinked && fitOption === 1" 
        @mouseover="expandBar"
      >
        <wl-icon name="arrow-left-filled" size="12" color="white" />
      </div>

      <div 
        class="draghandler"
        @mousedown="draghandlerMousedown"
      >  
        <wl-icon name="format-control-panel-dragger-bold" size="16" color="white-70" class="ico" />
      </div>

      <span class="fitlb" v-if="(!barShrinked && fitOption === 1) || fitOption === 2 && (dockSide === 'T' || dockSide === 'B')" >
        <span class="lb1">You’re sharing</span>
        <span class="lb2" ref="sharename" @click="toggleShare" ><b>{{selfSharingContent}}</b></span>
      </span>

      <div 
        class="sbtn btn" 
        v-tooltip="{
          content: 'Change share content', 
          placement: dockSide === 'L' ? 'right' : dockSide === 'R' ? 'left' : 'bottom',
        }"
        @click="toggleShare"
      >
        <wl-icon name="share-screen-bold" size="16" color="white" />
      </div>

      <div 
        class="sbtn btn" 
        v-tooltip="{
          content: 'More options', 
          placement: dockSide === 'L' ? 'right' : dockSide === 'R' ? 'left' : 'bottom',
        }"
        ref="btn_more"
        @click="showMore"
      >
        <wl-icon name="more-bold" size="16" color="white" />
      </div>

      <div v-if="!barShrinked || fitOption === 2" 
        class="sbtn" 
        :style="{
          width: fitOption === 1 || (dockSide === 'T' || dockSide === 'B') ? '107px' : '',
          height: fitOption === 2 && (dockSide === 'L' || dockSide === 'R') ? '59px' : '',
        }"
      >
        <div 
          class="btn-pause btn" 
          v-tooltip="{
            content: 'Pause sharing', 
            placement: fitOption === 2 && dockSide === 'L' ? 'right' : fitOption === 2 && dockSide === 'R' ? 'left' : 'bottom',
          }"
        >
          <wl-icon name="pause-bold" size="16" color="white" class="ico" />
        </div>
        <div 
          class="btn-stop btn" 
          v-tooltip="{
            content: 'Stop sharing', 
            placement: fitOption === 2 && dockSide === 'L' ? 'right' : fitOption === 2 && dockSide === 'R' ? 'left' : 'bottom',
          }"
          @click="stop"
        >
          <wl-icon name="stop-bold" size="16" color="white" class="ico" />
          <span v-if="fitOption === 1 || (dockSide === 'T' || dockSide === 'B')" class="lb">Stop</span>
        </div>
        
      </div>

      <div 
        class="bararr arrright" 
        v-if="dockSide === 'L' && barShrinked && fitOption === 1" 
        @mouseover="expandBar"
      >
        <wl-icon name="arrow-right-filled" size="12" color="white" />
      </div>
    </div>

    <div class="preivew bottom" 
      v-show="previewAtBottom && !barShrinked"
      :class="{trans: previewTransEnabled}"
      :style="{
        height: previewVisible && !barShrinked ? `${previewImgHeight}px` : '0',
      }"
    >
      <div 
        ref="preview_img2"
        :class="{
          screen1: selfSharingContent === 'Screen 1',
          screen2: selfSharingContent === 'Screen 2',
          ppt: selfSharingContent === 'PowerPoint',
        }"
        class="img" 
        :style="{
          width: previewVisible ? `${previewImgWidth}px` : '450px',
        }"
      ></div>
    </div>

    <div 
      class="cls"
      :class="{
        bottom: previewAtBottom,
        top: !previewAtBottom,
        left: dockSide === 'L',
        right: dockSide === 'R',
      }"
      v-if="previewAtBottom && dockSide === 'T'"
      v-show="!barShrinked && (clsVisible || previewVisible && !isFitDragging)"
      @click="togglePreview" 
    >
      <wl-icon :name="!previewVisible ? 'arrow-down-filled' : 'arrow-up-filled'" size="12" color="white" class="ico" />
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import popShare from "./pop-share.vue";

export default {
  props: {
    type: {
      type: String,
      default: 'desktop'
    }
  },
  data() {
    return {
      stickMarginBottom: 0,
      clsVisible: true,
      previewVisible: true,
      previewImgWidth: 450,
      previewImgHeight: 0,
      previewImgMargin: 4,
      previewAtBottom: true,
      snapDistance: 40,
      fitTransEnabled: false,
      barTransEnabled: false,
      previewTransEnabled: false,
      isFitDragging: false,
      fitDragPosition: {
        left: 0,
        top: 0,
      },
      dockSide: 'T',
      fitTop: '0',
      fitLeft: '0',
      popShareVisible: false,
      barShrinked: false,
      tmo_barShrink: 0,
      barDisabled: false,
      popmenuMoreVisible: false,
      fitOption: 2,
    };
  },
  computed: {
    userTesting() {
      return this.$store.state.userTesting;
    },
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    selfvideoUpdated() {
      return this.$store.state.selfvideoUpdated;
    },
    selfSharing() {
      return this.$store.state.selfSharing;
    },
    immersiveShare() {
      return this.$store.state.immersiveShare;
    },
    selfSharingContent() {
      return this.$store.state.selfSharingContent;
    },
    screenSnapshotCanvas() {
      return this.$store.state.screenSnapshotCanvas;
    },
    screenSharingPortionRect() {
      return this.$store.state.screenSharingPortionRect;
    },
  },
  mounted() {
    this.stickMarginBottom = this.os === 'win' ? 40 : 0;

    const parentRect = document.querySelector('#desktop').getBoundingClientRect();
    const fitRect = this.$refs.fit.getBoundingClientRect();
    const lft = (parentRect.width - fitRect.width) / 2;
    this.fitLeft = `${lft}px`;
    this.fitDragPosition.left = lft;
    
    requestAnimationFrame(() => {
      this.captureScreen();
    });

    setTimeout(() => {
      this.previewVisible = false;
      this.clsVisible = false;
    }, 3000);
  },
  beforeMount() {
  },
  watch: {
    screenSharingPortionRect() {
      this.$nextTick(() => {
        this.setPortionScreen()
      })
    },
    screenSnapshotCanvas() {
      this.$nextTick(() => {
        this.setPortionScreen()
      })
    },
    selfvideoUpdated(val) {
      if (val > 0) {
        this.captureScreen();
      }
    },
    selfSharing(newVal) {
      if (newVal) {
        if (newVal === 'portion') {
          this.$nextTick(() => {
            this.setPortionScreen()
          });
        } else {
          this.$nextTick(() => {
            this.captureScreen();
          });
        }
        
      }
    },
    dockSide(val) {
      if (val !== 'T') {
        this.previewVisible = false;
      }

      this.$nextTick(() => {
        this.captureScreen();
      });

    },
  },
  methods: {
    togglePreview() {
      const fitRect = this.$refs.fit.getBoundingClientRect();
      this.previewImgWidth = fitRect.width;
      this.previewVisible = !this.previewVisible;
      this.fitTransEnabled = true;
      this.previewTransEnabled = true;
      setTimeout(() => {
        this.fitTransEnabled = false;
        this.previewTransEnabled = false;
      }, 1000);
    },
    captureScreen() {
      // create screen snapshot
      const dsk = document.querySelector("#desktop");
      const rect = dsk.getBoundingClientRect();

      if (this.selfSharing === 'portion') {
        this.setPortionScreen()
      } else {
        if (!this.screenSnapshotCanvas) {
          const opt = {
            scale: this.previewImgWidth / rect.width,
          }
          html2canvas(dsk, opt).then(canvas => {
            this.$store.commit('screenSnapshotCanvas', canvas);
            this.setCaptureScreen()
          });
        } else {
          this.setCaptureScreen()
        }
      }

    },
    setCaptureScreen() {
      const dsk = document.querySelector("#desktop");
      const rect = dsk.getBoundingClientRect();
      this.previewImgHeight = this.previewImgWidth / rect.width * rect.height;

      const canvas = this.screenSnapshotCanvas
      canvas.style.width = `${this.previewImgWidth}px`;
      canvas.style.height = `${this.previewImgHeight - 8}px`

      if (this.previewAtBottom) {
        this.$refs.preview_img2.innerHTML = ''
        this.$refs.preview_img2.appendChild(canvas)
      } else {
        this.$refs.preview_img1.innerHTML = ''
        this.$refs.preview_img1.appendChild(canvas)
      }
    },
    setPortionScreen() {
      const rectPotn = this.screenSharingPortionRect
      const dsk = document.querySelector("#desktop");
      const rect = dsk.getBoundingClientRect();
      this.previewImgHeight = this.previewImgWidth / rectPotn.width * rectPotn.height;

      const canvas = this.screenSnapshotCanvas
      canvas.style.width = `${this.previewImgWidth / rectPotn.width * rect.width}px`;
      canvas.style.height = `${this.previewImgHeight / rectPotn.height * rect.height - 8}px`
      canvas.style.left = `${-this.previewImgWidth / rectPotn.width * rectPotn.left}px`;
      canvas.style.top = `${-this.previewImgHeight / rectPotn.height * rectPotn.top}px`;

      if (this.previewAtBottom) {
        this.$refs.preview_img2.innerHTML = ''
        this.$refs.preview_img2.appendChild(canvas)
      } else {
        this.$refs.preview_img1.innerHTML = ''
        this.$refs.preview_img1.appendChild(canvas)
      }
    },
    stop(){
      if (this.userTesting === 'fit') {
        window.location.reload();
        return;
      }
      this.$store.commit('selfvideoUpdated', 0);
      this.$store.commit('selfvideoBgEffect', null);
      this.$store.commit('selfSharing', null);
      this.$store.commit('sharePortionIsEditing', false);

      // close all panels
      this.$store.commit("plistPanelVisible", false);
      this.$store.commit("plistPanelPopouted", false);
    },

    // dock ------<<<<
    draghandlerMousedown(evt) {
      this.mouseX = evt.pageX;
      this.mouseY = evt.pageY;
      document.addEventListener('mousemove', this.draghandlerMousemove);
      document.addEventListener('mouseup', this.draghandlerMouseup);
      this.fitTransEnabled = false;
    },
    draghandlerMousemove(evt) {
      const px = evt.pageX;
      const py = evt.pageY;
      
      if (!this.isFitDragging && (Math.abs(px - this.mouseX) > 5 || Math.abs(py - this.mouseY) > 5)) {
        this.isFitDragging = true;
        this.clsVisible = false;
        
      }

      if (this.isFitDragging) {
        const ox = px - this.mouseX;
        const oy = py - this.mouseY;
        let newx = this.fitDragPosition.left + ox;
        let newy = this.fitDragPosition.top + oy;
        const parentRect = document.querySelector('#desktop').getBoundingClientRect();
        const fitRect = this.$refs.fit.getBoundingClientRect();

        if (newx < 0) {
          newx = 0;
        } else if (newx > parentRect.width - fitRect.width) {
          newx = parentRect.width - fitRect.width;
        }
        if (newy < 0) {
          newy = 0;
        } else if (newy > parentRect.height - fitRect.height) {
          newy = parentRect.height - fitRect.height;
        }

        this.fitDragPosition.left = newx;
        this.fitDragPosition.top = newy;

        if (this.dockSide === 'T' && newy < this.snapDistance) {
          newy = 0;
        }
        if (this.dockSide === 'B' && newy > parentRect.height - fitRect.height - this.stickMarginBottom - this.snapDistance) {
          newy = parentRect.height - fitRect.height - this.stickMarginBottom;

        }
        if (this.dockSide === 'L' && newx < this.snapDistance) {
          newx = 0;
        }
        if (this.dockSide === 'R' && newx > parentRect.width - fitRect.width - this.snapDistance) {
          newx = parentRect.width - fitRect.width;
        }

        this.fitLeft = `${newx}px`;
        this.fitTop = `${newy}px`;
        this.mouseX = px;
        this.mouseY = py;

        // check dock side
        const obj = {
          T: fitRect.top,
          B: parentRect.height - fitRect.bottom - this.stickMarginBottom,
          L: fitRect.left,
          R: parentRect.width - fitRect.right,
          CX: fitRect.left + fitRect.width / 2,
          CY: fitRect.top + fitRect.height / 2,
        };

        const k = this.getMinKey(obj);
        if (k) {
          this.dockSide = k;
        }
      }

      this.expandBar2();
    },

    getMinKey(obj) {

      let val = 99999;
      let key = '';
      for (let k in obj) {
        if (val > obj[k]) {
          val = obj[k];
          key = k;
        }
      }

      if (val < 60) {
        return key;
      }


      const parentRect = document.querySelector('#desktop').getBoundingClientRect();
      const DIS = parentRect.height / 6;
      const midStrip = [
        parentRect.height/2 - DIS,
        parentRect.height/2 + DIS,
      ];

      if (obj.CY > midStrip[0] && obj.CY < midStrip[1]) {
        if (obj.CX < parentRect.width / 2) {
          return 'L';
        } else {
          return 'R';
        }
      }

      if (obj.CY < DIS * 2) {
        return 'T';
      }
      if (obj.CY > DIS * 2) {
        return 'B';
      }

      
    },

    draghandlerMouseup() {
      document.removeEventListener('mousemove', this.draghandlerMousemove);
      document.removeEventListener('mouseup', this.draghandlerMouseup);
      this.isFitDragging = false;
      this.fitTransEnabled = true;
      this.previewAtBottom = true;
      
      const parentRect = document.querySelector('#desktop').getBoundingClientRect();
      const fitRect = this.$refs.fit.getBoundingClientRect();
      const barRect = this.$refs.bar.getBoundingClientRect();

      if (this.dockSide === 'T') {
        this.fitTop = `0px`;
        this.fitDragPosition.top = 0;
        this.expandBar2();
      } else if (this.dockSide === 'B') {
        const t = parentRect.height - barRect.height;
        this.fitTop = `${t}px`;
        this.fitDragPosition.top = t;
        this.previewAtBottom = false;
        this.expandBar2();
      } else if (this.dockSide === 'L') {
        this.fitLeft = `0px`;
        this.fitDragPosition.left = 0;
        this.shrinkBar2();
      } else if (this.dockSide === 'R') {
        const l = parentRect.width - fitRect.width;
        this.fitLeft = `${l}px`;
        this.fitDragPosition.left = l;
        this.shrinkBar2();
      }

      this.barDisabled = true;
      setTimeout(() => {
        this.barDisabled = false;
      }, 1000);
    },
    shrinkBar() {
      if (this.fitOption === 1) {
        this.tmo_barShrink = setTimeout(() => {
          this.shrinkBar2();
        }, 1500);
      }
    },
    shrinkBar2() {
      this.barShrinked = true;
      this.fitTransEnabled = true;
      clearTimeout(this.tmo_barShrink);
      document.removeEventListener('mousedown', this.onDocMousedown);
    },
    expandBar() {
      if (this.barDisabled) {
        return;
      }
      this.expandBar2();
      if (this.isFitDragging) {
        return;
      }
      document.addEventListener('mousedown', this.onDocMousedown);
      this.$refs.fit.addEventListener('mouseleave', this.onMouseleave);
    },
    expandBar2() {
      this.barShrinked = false;
      clearTimeout(this.tmo_barShrink);
      this.fitTransEnabled = true;
    },

    // dock ------<<<<

    toggleShare() {
      if (!this.popShareVisible) {
        this.$modal.show(
          popShare, 
          {}, // component props
          {
            clickToClose: false,
            frameless: true,
            shadow: true,
            resizable: false,
            draggable: true,
            overlayVisible: true,
            overlayTransparent: 0,
            theme: `${this.theme} ${this.themeColor}`,
            roundedCorner: this.os === 'mac',
            width: 912,
            height: 600,
          }, // modal props
          {
            closed: () => {
              //this.$store.commit("popShareVisible", false);
              this.popShareVisible = false;
            },
          } // modal eventlistener
        );
        //this.$store.commit("popShareVisible", true);
        this.popShareVisible = true;
      }
      
    },

    onMouseleave() {
      this.$refs.fit.removeEventListener('mouseleave', this.onMouseleave);
      
      if (this.isFitDragging || this.popShareVisible) {
        return;
      }
      
      if (this.dockSide === 'L' || this.dockSide === 'R') {
        this.shrinkBar();
      }
      
    },

    onDocMousedown(e) {
      if (!this.$hitTest(this.$refs.fit, e.pageX, e.pageY)) {
        this.shrinkBar2();
      }
      
    },

    showMore() {
      if (!this.popmenuMoreVisible) {
        this.$popper.show(
            {
              template: `
                <div class="popmenu-fit-more" style="width:320px;">
                  <svg width="304" height="124" viewBox="0 0 304 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="4" width="288" height="32" rx="8" fill="black"/>
                    <rect x="8.5" y="4.5" width="287" height="31" rx="7.5" stroke="white" stroke-opacity="0.5"/>
                    <path d="M286.354 16.6464C286.26 16.5527 286.133 16.5 286 16.5C285.868 16.5 285.74 16.5527 285.647 16.6464L280 22.2929L274.353 16.6464C274.259 16.555 274.133 16.5043 274.002 16.5053C273.87 16.5063 273.745 16.5589 273.652 16.6518C273.559 16.7446 273.506 16.8702 273.505 17.0015C273.504 17.1328 273.555 17.2592 273.646 17.3535L279.646 23.3535C279.74 23.4472 279.867 23.4999 280 23.4999C280.133 23.4999 280.26 23.4472 280.353 23.3535L286.353 17.3535C286.447 17.2597 286.5 17.1326 286.5 17C286.5 16.8674 286.447 16.7402 286.354 16.6464Z" fill="white" fill-opacity="0.95"/>
                    <path d="M30.1406 26H28.6875L27.5 22.8594H22.75L21.6328 26H20.1719L24.4688 14.7969H25.8281L30.1406 26ZM27.0703 21.6797L25.3125 16.9062C25.2552 16.75 25.1979 16.5 25.1406 16.1562H25.1094C25.0573 16.474 24.9974 16.724 24.9297 16.9062L23.1875 21.6797H27.0703ZM38.0938 26H36.8125V24.7344H36.7812C36.25 25.7031 35.4271 26.1875 34.3125 26.1875C32.4062 26.1875 31.4531 25.0521 31.4531 22.7812V18H32.7266V22.5781C32.7266 24.2656 33.3724 25.1094 34.6641 25.1094C35.2891 25.1094 35.8021 24.8802 36.2031 24.4219C36.6094 23.9583 36.8125 23.3542 36.8125 22.6094V18H38.0938V26ZM44.3984 25.9219C44.0964 26.0885 43.6979 26.1719 43.2031 26.1719C41.8021 26.1719 41.1016 25.3906 41.1016 23.8281V19.0938H39.7266V18H41.1016V16.0469L42.3828 15.6328V18H44.3984V19.0938H42.3828V23.6016C42.3828 24.138 42.474 24.5208 42.6562 24.75C42.8385 24.9792 43.1406 25.0938 43.5625 25.0938C43.8854 25.0938 44.1641 25.0052 44.3984 24.8281V25.9219ZM49.3281 26.1875C48.1458 26.1875 47.2005 25.8151 46.4922 25.0703C45.7891 24.3203 45.4375 23.3281 45.4375 22.0938C45.4375 20.75 45.8047 19.7005 46.5391 18.9453C47.2734 18.1901 48.2656 17.8125 49.5156 17.8125C50.7083 17.8125 51.638 18.1797 52.3047 18.9141C52.9766 19.6484 53.3125 20.6667 53.3125 21.9688C53.3125 23.2448 52.9505 24.2682 52.2266 25.0391C51.5078 25.8047 50.5417 26.1875 49.3281 26.1875ZM49.4219 18.8906C48.599 18.8906 47.9479 19.1719 47.4688 19.7344C46.9896 20.2917 46.75 21.0625 46.75 22.0469C46.75 22.9948 46.9922 23.7422 47.4766 24.2891C47.9609 24.8359 48.6094 25.1094 49.4219 25.1094C50.25 25.1094 50.8854 24.8411 51.3281 24.3047C51.776 23.7682 52 23.0052 52 22.0156C52 21.0156 51.776 20.2448 51.3281 19.7031C50.8854 19.1615 50.25 18.8906 49.4219 18.8906ZM66.7188 26H65.4375V21.4062C65.4375 20.5208 65.2995 19.8802 65.0234 19.4844C64.7526 19.0885 64.2943 18.8906 63.6484 18.8906C63.1016 18.8906 62.6354 19.1406 62.25 19.6406C61.8698 20.1406 61.6797 20.7396 61.6797 21.4375V26H60.3984V21.25C60.3984 19.6771 59.7917 18.8906 58.5781 18.8906C58.0156 18.8906 57.5521 19.1276 57.1875 19.6016C56.8229 20.0703 56.6406 20.6823 56.6406 21.4375V26H55.3594V18H56.6406V19.2656H56.6719C57.2396 18.2969 58.0677 17.8125 59.1562 17.8125C59.7031 17.8125 60.1797 17.9661 60.5859 18.2734C60.9922 18.5755 61.2708 18.974 61.4219 19.4688C62.0156 18.3646 62.901 17.8125 64.0781 17.8125C65.8385 17.8125 66.7188 18.8984 66.7188 21.0703V26ZM74.8672 26H73.5859V24.75H73.5547C72.9974 25.7083 72.1771 26.1875 71.0938 26.1875C70.2969 26.1875 69.6719 25.9766 69.2188 25.5547C68.7708 25.1328 68.5469 24.5729 68.5469 23.875C68.5469 22.3802 69.4271 21.5104 71.1875 21.2656L73.5859 20.9297C73.5859 19.5703 73.0365 18.8906 71.9375 18.8906C70.974 18.8906 70.1042 19.2188 69.3281 19.875V18.5625C70.1146 18.0625 71.0208 17.8125 72.0469 17.8125C73.9271 17.8125 74.8672 18.8073 74.8672 20.7969V26ZM73.5859 21.9531L71.6562 22.2188C71.0625 22.3021 70.6146 22.4505 70.3125 22.6641C70.0104 22.8724 69.8594 23.2448 69.8594 23.7812C69.8594 24.1719 69.9974 24.4922 70.2734 24.7422C70.5547 24.987 70.9271 25.1094 71.3906 25.1094C72.026 25.1094 72.5495 24.888 72.9609 24.4453C73.3776 23.9974 73.5859 23.4323 73.5859 22.75V21.9531ZM80.9922 25.9219C80.6901 26.0885 80.2917 26.1719 79.7969 26.1719C78.3958 26.1719 77.6953 25.3906 77.6953 23.8281V19.0938H76.3203V18H77.6953V16.0469L78.9766 15.6328V18H80.9922V19.0938H78.9766V23.6016C78.9766 24.138 79.0677 24.5208 79.25 24.75C79.4323 24.9792 79.7344 25.0938 80.1562 25.0938C80.4792 25.0938 80.7578 25.0052 80.9922 24.8281V25.9219ZM83.3594 15.9688C83.1302 15.9688 82.9349 15.8906 82.7734 15.7344C82.612 15.5781 82.5312 15.3802 82.5312 15.1406C82.5312 14.901 82.612 14.7031 82.7734 14.5469C82.9349 14.3854 83.1302 14.3047 83.3594 14.3047C83.5938 14.3047 83.7917 14.3854 83.9531 14.5469C84.1198 14.7031 84.2031 14.901 84.2031 15.1406C84.2031 15.3698 84.1198 15.5651 83.9531 15.7266C83.7917 15.888 83.5938 15.9688 83.3594 15.9688ZM83.9844 26H82.7031V18H83.9844V26ZM92.0312 25.6328C91.4167 26.0026 90.6875 26.1875 89.8438 26.1875C88.7031 26.1875 87.7812 25.8177 87.0781 25.0781C86.3802 24.3333 86.0312 23.3698 86.0312 22.1875C86.0312 20.8698 86.4089 19.8125 87.1641 19.0156C87.9193 18.2135 88.9271 17.8125 90.1875 17.8125C90.8906 17.8125 91.5104 17.9427 92.0469 18.2031V19.5156C91.4531 19.099 90.8177 18.8906 90.1406 18.8906C89.3229 18.8906 88.651 19.1849 88.125 19.7734C87.6042 20.3568 87.3438 21.125 87.3438 22.0781C87.3438 23.0156 87.5885 23.7552 88.0781 24.2969C88.5729 24.8385 89.2344 25.1094 90.0625 25.1094C90.7604 25.1094 91.4167 24.8776 92.0312 24.4141V25.6328ZM99.6953 26H98.4141V24.75H98.3828C97.8255 25.7083 97.0052 26.1875 95.9219 26.1875C95.125 26.1875 94.5 25.9766 94.0469 25.5547C93.599 25.1328 93.375 24.5729 93.375 23.875C93.375 22.3802 94.2552 21.5104 96.0156 21.2656L98.4141 20.9297C98.4141 19.5703 97.8646 18.8906 96.7656 18.8906C95.8021 18.8906 94.9323 19.2188 94.1562 19.875V18.5625C94.9427 18.0625 95.849 17.8125 96.875 17.8125C98.7552 17.8125 99.6953 18.8073 99.6953 20.7969V26ZM98.4141 21.9531L96.4844 22.2188C95.8906 22.3021 95.4427 22.4505 95.1406 22.6641C94.8385 22.8724 94.6875 23.2448 94.6875 23.7812C94.6875 24.1719 94.8255 24.4922 95.1016 24.7422C95.3828 24.987 95.7552 25.1094 96.2188 25.1094C96.8542 25.1094 97.3776 24.888 97.7891 24.4453C98.2057 23.9974 98.4141 23.4323 98.4141 22.75V21.9531ZM103.391 26H102.109V14.1562H103.391V26ZM107.266 26H105.984V14.1562H107.266V26ZM116.227 18L112.547 27.2812C111.891 28.9375 110.969 29.7656 109.781 29.7656C109.448 29.7656 109.169 29.7318 108.945 29.6641V28.5156C109.221 28.6094 109.474 28.6562 109.703 28.6562C110.349 28.6562 110.833 28.2708 111.156 27.5L111.797 25.9844L108.672 18H110.094L112.258 24.1562C112.284 24.2344 112.339 24.4375 112.422 24.7656H112.469C112.495 24.6406 112.547 24.4427 112.625 24.1719L114.898 18H116.227ZM125.344 26.1875C124.161 26.1875 123.216 25.8151 122.508 25.0703C121.805 24.3203 121.453 23.3281 121.453 22.0938C121.453 20.75 121.82 19.7005 122.555 18.9453C123.289 18.1901 124.281 17.8125 125.531 17.8125C126.724 17.8125 127.654 18.1797 128.32 18.9141C128.992 19.6484 129.328 20.6667 129.328 21.9688C129.328 23.2448 128.966 24.2682 128.242 25.0391C127.523 25.8047 126.557 26.1875 125.344 26.1875ZM125.438 18.8906C124.615 18.8906 123.964 19.1719 123.484 19.7344C123.005 20.2917 122.766 21.0625 122.766 22.0469C122.766 22.9948 123.008 23.7422 123.492 24.2891C123.977 24.8359 124.625 25.1094 125.438 25.1094C126.266 25.1094 126.901 24.8411 127.344 24.3047C127.792 23.7682 128.016 23.0052 128.016 22.0156C128.016 21.0156 127.792 20.2448 127.344 19.7031C126.901 19.1615 126.266 18.8906 125.438 18.8906ZM132.688 24.8438H132.656V29.6797H131.375V18H132.656V19.4062H132.688C133.318 18.3438 134.24 17.8125 135.453 17.8125C136.484 17.8125 137.289 18.1719 137.867 18.8906C138.445 19.6042 138.734 20.5625 138.734 21.7656C138.734 23.1042 138.409 24.1771 137.758 24.9844C137.107 25.7865 136.216 26.1875 135.086 26.1875C134.049 26.1875 133.25 25.7396 132.688 24.8438ZM132.656 21.6172V22.7344C132.656 23.3958 132.87 23.9583 133.297 24.4219C133.729 24.8802 134.276 25.1094 134.938 25.1094C135.714 25.1094 136.32 24.8125 136.758 24.2188C137.201 23.625 137.422 22.7995 137.422 21.7422C137.422 20.8516 137.216 20.1536 136.805 19.6484C136.393 19.1432 135.836 18.8906 135.133 18.8906C134.388 18.8906 133.789 19.151 133.336 19.6719C132.883 20.1875 132.656 20.8359 132.656 21.6172ZM144.492 25.9219C144.19 26.0885 143.792 26.1719 143.297 26.1719C141.896 26.1719 141.195 25.3906 141.195 23.8281V19.0938H139.82V18H141.195V16.0469L142.477 15.6328V18H144.492V19.0938H142.477V23.6016C142.477 24.138 142.568 24.5208 142.75 24.75C142.932 24.9792 143.234 25.0938 143.656 25.0938C143.979 25.0938 144.258 25.0052 144.492 24.8281V25.9219ZM146.859 15.9688C146.63 15.9688 146.435 15.8906 146.273 15.7344C146.112 15.5781 146.031 15.3802 146.031 15.1406C146.031 14.901 146.112 14.7031 146.273 14.5469C146.435 14.3854 146.63 14.3047 146.859 14.3047C147.094 14.3047 147.292 14.3854 147.453 14.5469C147.62 14.7031 147.703 14.901 147.703 15.1406C147.703 15.3698 147.62 15.5651 147.453 15.7266C147.292 15.888 147.094 15.9688 146.859 15.9688ZM147.484 26H146.203V18H147.484V26ZM161.438 26H160.156V21.4062C160.156 20.5208 160.018 19.8802 159.742 19.4844C159.471 19.0885 159.013 18.8906 158.367 18.8906C157.82 18.8906 157.354 19.1406 156.969 19.6406C156.589 20.1406 156.398 20.7396 156.398 21.4375V26H155.117V21.25C155.117 19.6771 154.51 18.8906 153.297 18.8906C152.734 18.8906 152.271 19.1276 151.906 19.6016C151.542 20.0703 151.359 20.6823 151.359 21.4375V26H150.078V18H151.359V19.2656H151.391C151.958 18.2969 152.786 17.8125 153.875 17.8125C154.422 17.8125 154.898 17.9661 155.305 18.2734C155.711 18.5755 155.99 18.974 156.141 19.4688C156.734 18.3646 157.62 17.8125 158.797 17.8125C160.557 17.8125 161.438 18.8984 161.438 21.0703V26ZM164.516 15.9688C164.286 15.9688 164.091 15.8906 163.93 15.7344C163.768 15.5781 163.688 15.3802 163.688 15.1406C163.688 14.901 163.768 14.7031 163.93 14.5469C164.091 14.3854 164.286 14.3047 164.516 14.3047C164.75 14.3047 164.948 14.3854 165.109 14.5469C165.276 14.7031 165.359 14.901 165.359 15.1406C165.359 15.3698 165.276 15.5651 165.109 15.7266C164.948 15.888 164.75 15.9688 164.516 15.9688ZM165.141 26H163.859V18H165.141V26ZM173.312 18.3672L168.578 24.9062H173.266V26H166.695V25.6016L171.43 19.0938H167.141V18H173.312V18.3672ZM181.398 22.3203H175.75C175.771 23.2109 176.01 23.8984 176.469 24.3828C176.927 24.8672 177.557 25.1094 178.359 25.1094C179.26 25.1094 180.089 24.8125 180.844 24.2188V25.4219C180.141 25.9323 179.211 26.1875 178.055 26.1875C176.924 26.1875 176.036 25.8255 175.391 25.1016C174.745 24.3724 174.422 23.349 174.422 22.0312C174.422 20.7865 174.773 19.7734 175.477 18.9922C176.185 18.2057 177.062 17.8125 178.109 17.8125C179.156 17.8125 179.966 18.151 180.539 18.8281C181.112 19.5052 181.398 20.4453 181.398 21.6484V22.3203ZM180.086 21.2344C180.081 20.4948 179.901 19.9193 179.547 19.5078C179.198 19.0964 178.711 18.8906 178.086 18.8906C177.482 18.8906 176.969 19.1068 176.547 19.5391C176.125 19.9714 175.865 20.5365 175.766 21.2344H180.086Z" fill="white" fill-opacity="0.95"/>
                    <path d="M40.9453 65.5469V64C41.2786 64.3021 41.6979 64.5469 42.2031 64.7344C42.7135 64.9167 43.1953 65.0078 43.6484 65.0078C45.0911 65.0078 45.8125 64.4479 45.8125 63.3281C45.8125 62.8958 45.6667 62.5078 45.375 62.1641C45.0885 61.8151 44.4479 61.3594 43.4531 60.7969C42.5625 60.2917 41.9245 59.7995 41.5391 59.3203C41.1536 58.8411 40.9609 58.2682 40.9609 57.6016C40.9609 56.7266 41.2865 56.0104 41.9375 55.4531C42.5885 54.8906 43.4479 54.6094 44.5156 54.6094C45.5208 54.6094 46.2552 54.7422 46.7188 55.0078V56.4844C46.125 56.026 45.3698 55.7969 44.4531 55.7969C43.8021 55.7969 43.2865 55.9531 42.9062 56.2656C42.526 56.5781 42.3359 56.9844 42.3359 57.4844C42.3359 57.8958 42.4479 58.2682 42.6719 58.6016C42.901 58.9297 43.5156 59.3698 44.5156 59.9219C45.4844 60.4635 46.1719 60.9844 46.5781 61.4844C46.9844 61.9844 47.1875 62.5469 47.1875 63.1719C47.1875 64.0938 46.8646 64.8281 46.2188 65.375C45.5729 65.9167 44.6562 66.1875 43.4688 66.1875C43.0521 66.1875 42.5885 66.125 42.0781 66C41.5677 65.8698 41.1901 65.7188 40.9453 65.5469ZM55.8906 66H54.6094V61.3906C54.6094 59.724 53.9896 58.8906 52.75 58.8906C52.125 58.8906 51.599 59.1328 51.1719 59.6172C50.7448 60.0964 50.5312 60.7135 50.5312 61.4688V66H49.25V54.1562H50.5312V59.3281H50.5625C51.1771 58.3177 52.0521 57.8125 53.1875 57.8125C54.9896 57.8125 55.8906 58.8984 55.8906 61.0703V66ZM64.0391 66H62.7578V64.75H62.7266C62.1693 65.7083 61.349 66.1875 60.2656 66.1875C59.4688 66.1875 58.8438 65.9766 58.3906 65.5547C57.9427 65.1328 57.7188 64.5729 57.7188 63.875C57.7188 62.3802 58.599 61.5104 60.3594 61.2656L62.7578 60.9297C62.7578 59.5703 62.2083 58.8906 61.1094 58.8906C60.1458 58.8906 59.276 59.2188 58.5 59.875V58.5625C59.2865 58.0625 60.1927 57.8125 61.2188 57.8125C63.099 57.8125 64.0391 58.8073 64.0391 60.7969V66ZM62.7578 61.9531L60.8281 62.2188C60.2344 62.3021 59.7865 62.4505 59.4844 62.6641C59.1823 62.8724 59.0312 63.2448 59.0312 63.7812C59.0312 64.1719 59.1693 64.4922 59.4453 64.7422C59.7266 64.987 60.099 65.1094 60.5625 65.1094C61.1979 65.1094 61.7214 64.888 62.1328 64.4453C62.5495 63.9974 62.7578 63.4323 62.7578 62.75V61.9531ZM70.625 59.2969C70.401 59.125 70.0781 59.0391 69.6562 59.0391C69.1094 59.0391 68.651 59.2969 68.2812 59.8125C67.9167 60.3281 67.7344 61.0312 67.7344 61.9219V66H66.4531V58H67.7344V59.6484H67.7656C67.9479 59.0859 68.2266 58.6484 68.6016 58.3359C68.9766 58.0182 69.3958 57.8594 69.8594 57.8594C70.1927 57.8594 70.4479 57.8958 70.625 57.9688V59.2969ZM78.2266 62.3203H72.5781C72.599 63.2109 72.8385 63.8984 73.2969 64.3828C73.7552 64.8672 74.3854 65.1094 75.1875 65.1094C76.0885 65.1094 76.9167 64.8125 77.6719 64.2188V65.4219C76.9688 65.9323 76.0391 66.1875 74.8828 66.1875C73.7526 66.1875 72.8646 65.8255 72.2188 65.1016C71.5729 64.3724 71.25 63.349 71.25 62.0312C71.25 60.7865 71.6016 59.7734 72.3047 58.9922C73.013 58.2057 73.8906 57.8125 74.9375 57.8125C75.9844 57.8125 76.7943 58.151 77.3672 58.8281C77.9401 59.5052 78.2266 60.4453 78.2266 61.6484V62.3203ZM76.9141 61.2344C76.9089 60.4948 76.7292 59.9193 76.375 59.5078C76.026 59.0964 75.5391 58.8906 74.9141 58.8906C74.3099 58.8906 73.7969 59.1068 73.375 59.5391C72.9531 59.9714 72.6927 60.5365 72.5938 61.2344H76.9141ZM90.0156 65.6328C89.401 66.0026 88.6719 66.1875 87.8281 66.1875C86.6875 66.1875 85.7656 65.8177 85.0625 65.0781C84.3646 64.3333 84.0156 63.3698 84.0156 62.1875C84.0156 60.8698 84.3932 59.8125 85.1484 59.0156C85.9036 58.2135 86.9115 57.8125 88.1719 57.8125C88.875 57.8125 89.4948 57.9427 90.0312 58.2031V59.5156C89.4375 59.099 88.8021 58.8906 88.125 58.8906C87.3073 58.8906 86.6354 59.1849 86.1094 59.7734C85.5885 60.3568 85.3281 61.125 85.3281 62.0781C85.3281 63.0156 85.5729 63.7552 86.0625 64.2969C86.5573 64.8385 87.2188 65.1094 88.0469 65.1094C88.7448 65.1094 89.401 64.8776 90.0156 64.4141V65.6328ZM95.2969 66.1875C94.1146 66.1875 93.1693 65.8151 92.4609 65.0703C91.7578 64.3203 91.4062 63.3281 91.4062 62.0938C91.4062 60.75 91.7734 59.7005 92.5078 58.9453C93.2422 58.1901 94.2344 57.8125 95.4844 57.8125C96.6771 57.8125 97.6068 58.1797 98.2734 58.9141C98.9453 59.6484 99.2812 60.6667 99.2812 61.9688C99.2812 63.2448 98.9193 64.2682 98.1953 65.0391C97.4766 65.8047 96.5104 66.1875 95.2969 66.1875ZM95.3906 58.8906C94.5677 58.8906 93.9167 59.1719 93.4375 59.7344C92.9583 60.2917 92.7188 61.0625 92.7188 62.0469C92.7188 62.9948 92.9609 63.7422 93.4453 64.2891C93.9297 64.8359 94.5781 65.1094 95.3906 65.1094C96.2188 65.1094 96.8542 64.8411 97.2969 64.3047C97.7448 63.7682 97.9688 63.0052 97.9688 62.0156C97.9688 61.0156 97.7448 60.2448 97.2969 59.7031C96.8542 59.1615 96.2188 58.8906 95.3906 58.8906ZM112.688 66H111.406V61.4062C111.406 60.5208 111.268 59.8802 110.992 59.4844C110.721 59.0885 110.263 58.8906 109.617 58.8906C109.07 58.8906 108.604 59.1406 108.219 59.6406C107.839 60.1406 107.648 60.7396 107.648 61.4375V66H106.367V61.25C106.367 59.6771 105.76 58.8906 104.547 58.8906C103.984 58.8906 103.521 59.1276 103.156 59.6016C102.792 60.0703 102.609 60.6823 102.609 61.4375V66H101.328V58H102.609V59.2656H102.641C103.208 58.2969 104.036 57.8125 105.125 57.8125C105.672 57.8125 106.148 57.9661 106.555 58.2734C106.961 58.5755 107.24 58.974 107.391 59.4688C107.984 58.3646 108.87 57.8125 110.047 57.8125C111.807 57.8125 112.688 58.8984 112.688 61.0703V66ZM116.422 64.8438H116.391V69.6797H115.109V58H116.391V59.4062H116.422C117.052 58.3438 117.974 57.8125 119.188 57.8125C120.219 57.8125 121.023 58.1719 121.602 58.8906C122.18 59.6042 122.469 60.5625 122.469 61.7656C122.469 63.1042 122.143 64.1771 121.492 64.9844C120.841 65.7865 119.951 66.1875 118.82 66.1875C117.784 66.1875 116.984 65.7396 116.422 64.8438ZM116.391 61.6172V62.7344C116.391 63.3958 116.604 63.9583 117.031 64.4219C117.464 64.8802 118.01 65.1094 118.672 65.1094C119.448 65.1094 120.055 64.8125 120.492 64.2188C120.935 63.625 121.156 62.7995 121.156 61.7422C121.156 60.8516 120.951 60.1536 120.539 59.6484C120.128 59.1432 119.57 58.8906 118.867 58.8906C118.122 58.8906 117.523 59.151 117.07 59.6719C116.617 60.1875 116.391 60.8359 116.391 61.6172ZM130.984 66H129.703V64.7344H129.672C129.141 65.7031 128.318 66.1875 127.203 66.1875C125.297 66.1875 124.344 65.0521 124.344 62.7812V58H125.617V62.5781C125.617 64.2656 126.263 65.1094 127.555 65.1094C128.18 65.1094 128.693 64.8802 129.094 64.4219C129.5 63.9583 129.703 63.3542 129.703 62.6094V58H130.984V66ZM137.289 65.9219C136.987 66.0885 136.589 66.1719 136.094 66.1719C134.693 66.1719 133.992 65.3906 133.992 63.8281V59.0938H132.617V58H133.992V56.0469L135.273 55.6328V58H137.289V59.0938H135.273V63.6016C135.273 64.138 135.365 64.5208 135.547 64.75C135.729 64.9792 136.031 65.0938 136.453 65.0938C136.776 65.0938 137.055 65.0052 137.289 64.8281V65.9219ZM145.305 62.3203H139.656C139.677 63.2109 139.917 63.8984 140.375 64.3828C140.833 64.8672 141.464 65.1094 142.266 65.1094C143.167 65.1094 143.995 64.8125 144.75 64.2188V65.4219C144.047 65.9323 143.117 66.1875 141.961 66.1875C140.831 66.1875 139.943 65.8255 139.297 65.1016C138.651 64.3724 138.328 63.349 138.328 62.0312C138.328 60.7865 138.68 59.7734 139.383 58.9922C140.091 58.2057 140.969 57.8125 142.016 57.8125C143.062 57.8125 143.872 58.151 144.445 58.8281C145.018 59.5052 145.305 60.4453 145.305 61.6484V62.3203ZM143.992 61.2344C143.987 60.4948 143.807 59.9193 143.453 59.5078C143.104 59.0964 142.617 58.8906 141.992 58.8906C141.388 58.8906 140.875 59.1068 140.453 59.5391C140.031 59.9714 139.771 60.5365 139.672 61.2344H143.992ZM151.422 59.2969C151.198 59.125 150.875 59.0391 150.453 59.0391C149.906 59.0391 149.448 59.2969 149.078 59.8125C148.714 60.3281 148.531 61.0312 148.531 61.9219V66H147.25V58H148.531V59.6484H148.562C148.745 59.0859 149.023 58.6484 149.398 58.3359C149.773 58.0182 150.193 57.8594 150.656 57.8594C150.99 57.8594 151.245 57.8958 151.422 57.9688V59.2969ZM162.93 66H161.648V64.75H161.617C161.06 65.7083 160.24 66.1875 159.156 66.1875C158.359 66.1875 157.734 65.9766 157.281 65.5547C156.833 65.1328 156.609 64.5729 156.609 63.875C156.609 62.3802 157.49 61.5104 159.25 61.2656L161.648 60.9297C161.648 59.5703 161.099 58.8906 160 58.8906C159.036 58.8906 158.167 59.2188 157.391 59.875V58.5625C158.177 58.0625 159.083 57.8125 160.109 57.8125C161.99 57.8125 162.93 58.8073 162.93 60.7969V66ZM161.648 61.9531L159.719 62.2188C159.125 62.3021 158.677 62.4505 158.375 62.6641C158.073 62.8724 157.922 63.2448 157.922 63.7812C157.922 64.1719 158.06 64.4922 158.336 64.7422C158.617 64.987 158.99 65.1094 159.453 65.1094C160.089 65.1094 160.612 64.888 161.023 64.4453C161.44 63.9974 161.648 63.4323 161.648 62.75V61.9531ZM171.812 66H170.531V64.7344H170.5C169.969 65.7031 169.146 66.1875 168.031 66.1875C166.125 66.1875 165.172 65.0521 165.172 62.7812V58H166.445V62.5781C166.445 64.2656 167.091 65.1094 168.383 65.1094C169.008 65.1094 169.521 64.8802 169.922 64.4219C170.328 63.9583 170.531 63.3542 170.531 62.6094V58H171.812V66ZM181.234 66H179.953V64.6406H179.922C179.328 65.6719 178.411 66.1875 177.172 66.1875C176.167 66.1875 175.362 65.8307 174.758 65.1172C174.159 64.3984 173.859 63.4219 173.859 62.1875C173.859 60.8646 174.193 59.8047 174.859 59.0078C175.526 58.2109 176.414 57.8125 177.523 57.8125C178.622 57.8125 179.422 58.2448 179.922 59.1094H179.953V54.1562H181.234V66ZM179.953 62.3828V61.2031C179.953 60.5573 179.74 60.0104 179.312 59.5625C178.885 59.1146 178.344 58.8906 177.688 58.8906C176.906 58.8906 176.292 59.1771 175.844 59.75C175.396 60.3229 175.172 61.1146 175.172 62.125C175.172 63.0469 175.385 63.776 175.812 64.3125C176.245 64.8438 176.823 65.1094 177.547 65.1094C178.26 65.1094 178.839 64.8516 179.281 64.3359C179.729 63.8203 179.953 63.1693 179.953 62.3828ZM184.484 55.9688C184.255 55.9688 184.06 55.8906 183.898 55.7344C183.737 55.5781 183.656 55.3802 183.656 55.1406C183.656 54.901 183.737 54.7031 183.898 54.5469C184.06 54.3854 184.255 54.3047 184.484 54.3047C184.719 54.3047 184.917 54.3854 185.078 54.5469C185.245 54.7031 185.328 54.901 185.328 55.1406C185.328 55.3698 185.245 55.5651 185.078 55.7266C184.917 55.888 184.719 55.9688 184.484 55.9688ZM185.109 66H183.828V58H185.109V66ZM191.047 66.1875C189.865 66.1875 188.919 65.8151 188.211 65.0703C187.508 64.3203 187.156 63.3281 187.156 62.0938C187.156 60.75 187.523 59.7005 188.258 58.9453C188.992 58.1901 189.984 57.8125 191.234 57.8125C192.427 57.8125 193.357 58.1797 194.023 58.9141C194.695 59.6484 195.031 60.6667 195.031 61.9688C195.031 63.2448 194.669 64.2682 193.945 65.0391C193.227 65.8047 192.26 66.1875 191.047 66.1875ZM191.141 58.8906C190.318 58.8906 189.667 59.1719 189.188 59.7344C188.708 60.2917 188.469 61.0625 188.469 62.0469C188.469 62.9948 188.711 63.7422 189.195 64.2891C189.68 64.8359 190.328 65.1094 191.141 65.1094C191.969 65.1094 192.604 64.8411 193.047 64.3047C193.495 63.7682 193.719 63.0052 193.719 62.0156C193.719 61.0156 193.495 60.2448 193.047 59.7031C192.604 59.1615 191.969 58.8906 191.141 58.8906Z" fill="white" fill-opacity="0.95"/>
                    <path d="M22.6365 57.4064C22.5914 57.4541 22.5562 57.5102 22.5328 57.5716C22.5094 57.6329 22.4983 57.6982 22.5002 57.7638C22.5021 57.8295 22.5169 57.8941 22.5437 57.954C22.5706 58.0139 22.609 58.0679 22.6567 58.1129C22.9198 58.3517 23.1306 58.6424 23.2757 58.9667C23.4208 59.2911 23.4972 59.6419 23.5 59.9972C23.4958 60.353 23.4188 60.7042 23.2737 61.0291C23.1286 61.354 22.9186 61.6457 22.6565 61.8864C22.6084 61.9314 22.5697 61.9855 22.5426 62.0455C22.5155 62.1055 22.5006 62.1703 22.4986 62.2361C22.4966 62.3019 22.5076 62.3675 22.531 62.429C22.5544 62.4906 22.5898 62.5469 22.635 62.5947C22.6803 62.6426 22.7345 62.681 22.7947 62.7079C22.8548 62.7347 22.9197 62.7494 22.9855 62.751C23.0513 62.7527 23.1168 62.7414 23.1783 62.7177C23.2397 62.694 23.2959 62.6584 23.3435 62.6129C23.7078 62.282 23.9988 61.8785 24.198 61.4285C24.3971 60.9785 24.5 60.4917 24.5 59.9996C24.5 59.5074 24.3971 59.0207 24.1978 58.5707C23.9986 58.1207 23.7076 57.7173 23.3433 57.3864C23.2469 57.2954 23.1183 57.2463 22.9857 57.2501C22.8532 57.2538 22.7276 57.31 22.6365 57.4064Z" fill="white" fill-opacity="0.95"/>
                    <path d="M20.5374 53.5573C20.402 53.5007 20.253 53.4852 20.1089 53.5129C19.9649 53.5405 19.8321 53.6099 19.7273 53.7125L16.2991 56.9997H14.5C14.1023 57.0001 13.721 57.1583 13.4398 57.4395C13.1586 57.7207 13.0004 58.102 13 58.4997V61.4997C13.0004 61.8973 13.1586 62.2786 13.4398 62.5598C13.721 62.841 14.1023 62.9992 14.5 62.9997H16.2991L19.7195 66.2794C19.8244 66.3843 19.958 66.4557 20.1035 66.4846C20.249 66.5135 20.3998 66.4987 20.5368 66.4419C20.6739 66.3852 20.791 66.2891 20.8734 66.1658C20.9559 66.0425 20.9999 65.8975 21 65.7492V54.2501C21.0002 54.1018 20.9564 53.9567 20.874 53.8334C20.7916 53.71 20.6745 53.6139 20.5374 53.5573ZM20 65.1627L16.8459 62.1388C16.7529 62.0495 16.629 61.9996 16.5 61.9997H14.5C14.3674 61.9995 14.2403 61.9468 14.1466 61.8531C14.0529 61.7593 14.0001 61.6322 14 61.4997V58.4997C14.0001 58.3671 14.0529 58.24 14.1466 58.1462C14.2403 58.0525 14.3674 57.9998 14.5 57.9997H16.5C16.629 57.9997 16.7529 57.9498 16.8459 57.8605L20 54.8361V65.1627Z" fill="white" fill-opacity="0.95"/>
                    <path d="M25.51 56.6359C25.4135 56.5453 25.2849 56.4967 25.1526 56.5008C25.0203 56.5048 24.8949 56.5611 24.8041 56.6574C24.7132 56.7537 24.6643 56.8821 24.6679 57.0144C24.6715 57.1468 24.7275 57.2723 24.8235 57.3634C25.191 57.6972 25.4853 58.1037 25.6878 58.557C25.8903 59.0103 25.9966 59.5007 26 59.9972C25.9943 60.4941 25.887 60.9846 25.6846 61.4385C25.4822 61.8924 25.1891 62.3 24.8232 62.6364C24.7752 62.6814 24.7365 62.7355 24.7094 62.7955C24.6823 62.8555 24.6673 62.9203 24.6653 62.9861C24.6633 63.0519 24.6743 63.1175 24.6978 63.179C24.7212 63.2406 24.7565 63.2969 24.8018 63.3448C24.847 63.3926 24.9013 63.431 24.9614 63.4579C25.0215 63.4847 25.0864 63.4994 25.1522 63.5011C25.2181 63.5027 25.2836 63.4914 25.345 63.4677C25.4064 63.444 25.4626 63.4084 25.5102 63.3629C25.9748 62.9341 26.3466 62.4147 26.6028 61.8367C26.8591 61.2586 26.9942 60.6343 27 60.0021C26.9978 59.3685 26.8643 58.7422 26.6079 58.1628C26.3514 57.5834 25.9776 57.0635 25.51 56.6359Z" fill="white" fill-opacity="0.95"/>
                    <rect x="248" y="49" width="44" height="22" rx="11" fill="#64B4FA"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M281 65C283.761 65 286 62.7614 286 60C286 57.2386 283.761 55 281 55C278.239 55 276 57.2386 276 60C276 62.7614 278.239 65 281 65Z" fill="black" fill-opacity="0.95"/>
                    <rect width="304" height="1" transform="translate(0 83)" fill="white" fill-opacity="0.4"/>
                    <path d="M50.1406 110H48.6875L47.5 106.859H42.75L41.6328 110H40.1719L44.4688 98.7969H45.8281L50.1406 110ZM47.0703 105.68L45.3125 100.906C45.2552 100.75 45.1979 100.5 45.1406 100.156H45.1094C45.0573 100.474 44.9974 100.724 44.9297 100.906L43.1875 105.68H47.0703ZM58.2656 110H56.9844V105.438C56.9844 103.74 56.3646 102.891 55.125 102.891C54.4844 102.891 53.9531 103.133 53.5312 103.617C53.1146 104.096 52.9062 104.703 52.9062 105.438V110H51.625V102H52.9062V103.328H52.9375C53.5417 102.318 54.4167 101.812 55.5625 101.812C56.4375 101.812 57.1068 102.096 57.5703 102.664C58.0339 103.227 58.2656 104.042 58.2656 105.109V110ZM67.3281 110H66.0469V105.438C66.0469 103.74 65.4271 102.891 64.1875 102.891C63.5469 102.891 63.0156 103.133 62.5938 103.617C62.1771 104.096 61.9688 104.703 61.9688 105.438V110H60.6875V102H61.9688V103.328H62C62.6042 102.318 63.4792 101.812 64.625 101.812C65.5 101.812 66.1693 102.096 66.6328 102.664C67.0964 103.227 67.3281 104.042 67.3281 105.109V110ZM73.0938 110.188C71.9115 110.188 70.9661 109.815 70.2578 109.07C69.5547 108.32 69.2031 107.328 69.2031 106.094C69.2031 104.75 69.5703 103.701 70.3047 102.945C71.0391 102.19 72.0312 101.812 73.2812 101.812C74.474 101.812 75.4036 102.18 76.0703 102.914C76.7422 103.648 77.0781 104.667 77.0781 105.969C77.0781 107.245 76.7161 108.268 75.9922 109.039C75.2734 109.805 74.3073 110.188 73.0938 110.188ZM73.1875 102.891C72.3646 102.891 71.7135 103.172 71.2344 103.734C70.7552 104.292 70.5156 105.062 70.5156 106.047C70.5156 106.995 70.7578 107.742 71.2422 108.289C71.7266 108.836 72.375 109.109 73.1875 109.109C74.0156 109.109 74.651 108.841 75.0938 108.305C75.5417 107.768 75.7656 107.005 75.7656 106.016C75.7656 105.016 75.5417 104.245 75.0938 103.703C74.651 103.161 74.0156 102.891 73.1875 102.891ZM82.8359 109.922C82.5339 110.089 82.1354 110.172 81.6406 110.172C80.2396 110.172 79.5391 109.391 79.5391 107.828V103.094H78.1641V102H79.5391V100.047L80.8203 99.6328V102H82.8359V103.094H80.8203V107.602C80.8203 108.138 80.9115 108.521 81.0938 108.75C81.276 108.979 81.5781 109.094 82 109.094C82.3229 109.094 82.6016 109.005 82.8359 108.828V109.922ZM90.2734 110H88.9922V108.75H88.9609C88.4036 109.708 87.5833 110.188 86.5 110.188C85.7031 110.188 85.0781 109.977 84.625 109.555C84.1771 109.133 83.9531 108.573 83.9531 107.875C83.9531 106.38 84.8333 105.51 86.5938 105.266L88.9922 104.93C88.9922 103.57 88.4427 102.891 87.3438 102.891C86.3802 102.891 85.5104 103.219 84.7344 103.875V102.562C85.5208 102.062 86.4271 101.812 87.4531 101.812C89.3333 101.812 90.2734 102.807 90.2734 104.797V110ZM88.9922 105.953L87.0625 106.219C86.4688 106.302 86.0208 106.451 85.7188 106.664C85.4167 106.872 85.2656 107.245 85.2656 107.781C85.2656 108.172 85.4036 108.492 85.6797 108.742C85.9609 108.987 86.3333 109.109 86.7969 109.109C87.4323 109.109 87.9557 108.888 88.3672 108.445C88.7839 107.997 88.9922 107.432 88.9922 106.75V105.953ZM96.3984 109.922C96.0964 110.089 95.6979 110.172 95.2031 110.172C93.8021 110.172 93.1016 109.391 93.1016 107.828V103.094H91.7266V102H93.1016V100.047L94.3828 99.6328V102H96.3984V103.094H94.3828V107.602C94.3828 108.138 94.474 108.521 94.6562 108.75C94.8385 108.979 95.1406 109.094 95.5625 109.094C95.8854 109.094 96.1641 109.005 96.3984 108.828V109.922ZM104.414 106.32H98.7656C98.7865 107.211 99.026 107.898 99.4844 108.383C99.9427 108.867 100.573 109.109 101.375 109.109C102.276 109.109 103.104 108.812 103.859 108.219V109.422C103.156 109.932 102.227 110.188 101.07 110.188C99.9401 110.188 99.0521 109.826 98.4062 109.102C97.7604 108.372 97.4375 107.349 97.4375 106.031C97.4375 104.786 97.7891 103.773 98.4922 102.992C99.2005 102.206 100.078 101.812 101.125 101.812C102.172 101.812 102.982 102.151 103.555 102.828C104.128 103.505 104.414 104.445 104.414 105.648V106.32ZM103.102 105.234C103.096 104.495 102.917 103.919 102.562 103.508C102.214 103.096 101.727 102.891 101.102 102.891C100.497 102.891 99.9844 103.107 99.5625 103.539C99.1406 103.971 98.8802 104.536 98.7812 105.234H103.102Z" fill="white" fill-opacity="0.95"/>
                    <path d="M26.3639 107.157C26.3188 107.11 26.2648 107.071 26.2049 107.044C26.145 107.017 26.0804 107.002 26.0148 107C25.9492 106.999 25.8838 107.01 25.8224 107.033C25.761 107.056 25.7048 107.091 25.6571 107.136C25.1503 107.629 24.5951 108.07 24 108.451C24.1802 107.933 24.3905 107.425 24.6297 106.931C25.2967 105.443 25.9847 103.907 25.0438 103.22C24.0567 102.5 22.6993 103.67 21.2921 104.928C20.6878 105.468 19.2578 106.685 19.0335 106.476C18.7906 106.25 19.9471 104.422 20.6007 103.495C21.9327 101.604 23.1661 99.8023 22.088 98.807C21.9626 98.695 21.8155 98.61 21.6557 98.5575C21.496 98.505 21.3271 98.4861 21.1598 98.502C18.9163 98.631 14.1573 104.055 13.6222 104.673C13.5353 104.773 13.4918 104.904 13.5013 105.036C13.5107 105.168 13.5724 105.291 13.6726 105.378C13.7728 105.465 13.9034 105.509 14.0357 105.499C14.168 105.49 14.2912 105.428 14.378 105.328C16.293 103.117 19.8438 99.5794 21.2171 99.5006C21.3587 99.4923 21.3982 99.5319 21.4121 99.5443C21.836 99.921 20.5625 101.813 19.783 102.919C18.5296 104.698 17.4555 106.227 18.2996 107.156C19.1713 108.114 20.6046 106.883 21.9583 105.674C22.7041 105.007 24.1109 103.821 24.4561 104.03C24.6703 104.159 23.9974 105.898 23.7173 106.523C23.1123 107.873 22.6748 108.849 23.3086 109.349C23.4322 109.451 23.5889 109.505 23.7494 109.5C24.1652 109.5 24.9205 109.205 26.3431 107.864C26.3909 107.819 26.4293 107.765 26.4562 107.705C26.4831 107.645 26.4979 107.581 26.4999 107.515C26.5018 107.449 26.4908 107.384 26.4674 107.323C26.4441 107.261 26.4089 107.205 26.3639 107.157Z" fill="white" fill-opacity="0.95"/>
                  </svg>
                </div>
              `,
              props: [],
              methods: {
  
              }
            },
            {
              parent: this,
            }, // component props
            {
              reference: this.$refs.btn_more,
              closeTrigger: 'mousedown',
              arrowVisible: true,
              roundedCorner: true,
              frameless: false,
              borderRadius: '12px',
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              appendToBody: true,
              theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
              options: {
                placement: this.dockSide === 'T' ? 'bottom' : (this.dockSide === 'B' ? 'top' : (this.dockSide === 'L' ? 'right' : 'left')),
              },
            }, // popper props
            {
              opened: () => {this.popmenuMoreVisible = true},
              closed: () => {this.popmenuMoreVisible = false},
            } // popper eventlistener
          );
      } else {
        this.$popper.hideAll();
      }
    },

  }
};
</script>


<style lang="scss">
$appw: 1200px;
$apph: 720px;

#fit {

  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  user-select: none;
  
  background-color: $md-orange-60;
  border-radius: 4px;

  &.trans {
    transition: all .2s;
  }

  &.dockT {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  &.dockB {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  &.dockL {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &.dockR {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .bar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;

    &.trans {
      transition: all .2s;
    }

    &.vertical {
      flex-direction: column;
      width: 44px;
      height: auto;

      .sbtn {
        flex-direction: column;
        margin-right: 0;
        margin-bottom: 8px;
      }

      .draghandler {
        margin-bottom: 8px;
        padding-top: 8px;
        .ico {
          flex-shrink: 0;
          transform: rotate(90deg);
          transform-origin: 50%;
        }
      }

      .btn-pause {
        width: 28px;
        height: 28px;
        margin-top: 2px;
      }
      .btn-stop {
        width: 28px;
        height: 28px;
        margin-bottom: 2px;
      }
      
    }

    .bararr {
      display: flex;
      width: 16px;
      height: 100%;
      align-items: center;
      justify-content: center;

      &.arrright {
        margin-left: 0;
      }
      &.arrleft {
        margin-left: 2px;
      }
    }
    
    .draghandler {
      width: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;
      flex-shrink: 0;
    }

    .fitlb {
      display: flex;
      align-items: center;
      flex-grow: 1;
      margin-right: 15px;
      font-size: 15px;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .lb2 {
        display: flex;
        align-items: center;
        margin-left: 4px;

        b {
          text-decoration: underline;
        }
        .ico {
          margin-left: 4px;
        }
      }
      
    }
    .sbtn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 14px;
      margin-right: 8px;
      font-size: 12px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .btn {
      &:hover {
        background-color: rgba(255, 255, 255, 0.11);
      }
      &:active {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    .btn-pause {
      @include flex;
      flex-shrink: 0;
      width: 32px;
      height: 28px;
      border-right: 1px solid rgba(255, 255, 255, 0.3);
    }
    .btn-stop {
      @include flex;
      flex-grow: 1;

      .lb {
        @include flex;
        font-size: 16px;
        margin-left: 6px;
      }
    }
  }
  .preivew {
    width: calc(100% - 4px - 4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    &.trans {
      transition: all .2s;

      .img {
        transition: all .2s;
      }
    }

    &.bottom .img {
      margin-bottom: 4px;
    }
    &.top .img {
      margin-top: 4px;
    }

    .img {
      width: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      transform: translate3d(0,0,0); /** hide overflow canvas */

      canvas {
        position: absolute;
      }

      &.screen1 {
        background: url(~@/assets/img/sharing_thumb_screen1.png) no-repeat center top;
        background-size: cover;
      }
      &.screen2 {
        background: url(~@/assets/img/sharing_thumb_screen2.png) no-repeat center top;
        background-size: cover;
      }
      &.ppt {
        /*background: url(~@/assets/img/temp_ppt.png) no-repeat center top;*/
        background-size: cover;
      }
    }
  }
  .cls {
    position: absolute;
    left: 0;
    display: flex;
    justify-content:center;
    height: 16px;
    width: 100%;
    
    background-color: $md-orange-60;

    &:hover {
      background-color: $md-orange-70;
    }

    &.bottom {
      bottom: -12px;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;

      &.left {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 12px;
      }
      &.right {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 0;
      }
    }
    &.top {
      top: -12px;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;

      .ico {
        transform: rotate(180deg);
        transform-origin: 50%;
      }
    }
  }

}


.popmenu-fit-more {
  @include flex;
  padding: 12px 8px 8px;
}

</style>
