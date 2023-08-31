<template>
  <div 
    class='peopleitem' 
    :class="[
      theme, {
        h48: external,
        room: room,
        active: moreMenuVisible,
      }]"
    :style="{
      height: height || '',
    }"
    @click="clickHandler"
  >
      <div 
        class='left'
        :style="{
          height: height || '',
        }"
      >
        <div 
          v-if="checkbox"
          class="checkbox" 
          :class="{checked: checked2}"
        >
          <svg v-if="checked2" width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.853657 3.14655C0.658452 2.95123 0.34187 2.95114 0.14655 3.14634C-0.0487691 3.34155 -0.0488619 3.65813 0.146343 3.85345L2.64488 6.35345C2.84012 6.54881 3.15679 6.54886 3.35209 6.35355L8.85209 0.853553C9.04735 0.658291 9.04735 0.341709 8.85209 0.146447C8.65683 -0.0488155 8.34024 -0.0488155 8.14498 0.146447L2.99864 5.29279L0.853657 3.14655Z" fill="black" fill-opacity="0.95"/>
          </svg>
        </div>
        <div 
          class="icon" 
          v-if="icon"
          :style="{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            backgroundColor: iconBgColor,
          }"
        >
          <wl-icon 
            :name="icon" 
            :color="iconColor" 
            :size="20" 
          />
        </div>

        <presence-avatar
          v-if="!icon"
          :title="name"
          :src="avatar !== null ? avatarPath + avatar : ''" 
          :color="'white'"
          :fontWeight="600"
          :backgroundColor="'#545454'"
          :size="iconSize"
          :presence="status" 
          :icon="icon" 
          :theme="theme === 'light' ? 'light' : 'dark'"
          class="avatar" 

          v-tooltip="{
              content: contactCardTemplate ? contactCardTemplate : null, 
              html: true,
              placement: 'left',
              classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
              autoHide: false,
              delay: 200,
          }"
        />

        <div class='headset' v-if="headset">
          <wl-icon name="headset-bold" size="16" />
        </div>

      </div>

      <div class='lb_name' >
        <span class="row1">
          <span class="txt">{{ name }}</span>
          <span class="suffix" v-if="suffix">{{ suffix }}</span>
        </span>
        <span class="row2" v-if="external || activeInfo || me || host || cohost">
          <span class="external" v-if="external && !activeInfo">{{ external }}</span>
          <span class="activeinfo" v-if="activeInfo">{{ activeInfo }}</span>
          <span class="activeinfo" v-if="!host && me">{{ 'Me' }}</span>
          <span class="activeinfo" v-if="host && me">{{ 'Host, me' }}</span>
          <span class="activeinfo" v-if="host && !me">{{ 'Host' }}</span>
          <span class="activeinfo" v-if="cohost && me">{{ 'Cohost, me' }}</span>
          <span class="activeinfo" v-if="cohost && !me">{{ 'Cohost' }}</span>
        </span>
      </div>

      <div class="right">
        <span class="link" v-if="rightLink">{{ rightLink }}</span>

        <div class='btn' :class="{hover: me}" v-if="!room && audio">
          <div ref="btnmore" class="rbt show-on-hover" :class="{active: moreMenuVisible}" @click="toggleMoreMenu">
            <wl-icon name="more-adr-bold" size="16" />
          </div>
        </div>

        <div class='btn' v-if="!room && raisehand">
          <div class="rbt raisehand" >
            <wl-icon name="raise-hand-bold" size="16" />
          </div>
        </div>
<!--
        <div class='btn' :class="{hover: me}" v-if="!room && video">
          <div class="rbt video">
            <wl-icon name="camera-bold" size="16" />
          </div>
        </div>
-->
        <div class='btn' :class="{hover: me}" v-if="!room && audio">
          
          <div class="rbt muted" v-if="muted2 && !hardmuted">
            <wl-icon name="microphone-muted-bold" size="16" />
          </div>

          <div class="rbt unmuted" v-if="!muted2 && !hardmuted" >
            <wl-icon name="audio-microphone-on-green-bold" size="16" />
          </div>

          <div class="rbt hardmuted" v-if="hardmuted" >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.64649 11.8535C8.74024 11.9473 8.86741 11.9999 9 11.9999C9.13259 11.9999 9.25976 11.9473 9.35352 11.8535C9.44727 11.7598 9.49995 11.6326 9.49995 11.5C9.49995 11.3674 9.44727 11.2402 9.35352 11.1465L8.29267 10.0856C8.42949 9.74003 8.49984 9.3717 8.5 9V4C8.5 3.20435 8.18393 2.44129 7.62132 1.87868C7.05871 1.31607 6.29565 1 5.5 1C4.70435 1 3.94129 1.31607 3.37868 1.87868C2.81607 2.44129 2.5 3.20435 2.5 4V4.29297L1.8535 3.64647C1.75974 3.55271 1.63258 3.50004 1.49998 3.50005C1.36739 3.50005 1.24023 3.55273 1.14647 3.64649C1.05271 3.74025 1.00004 3.86741 1.00005 4C1.00005 4.1326 1.05273 4.25976 1.14649 4.35352L8.64649 11.8535ZM3.5 4C3.5 3.46957 3.71071 2.96086 4.08579 2.58579C4.46086 2.21071 4.96957 2 5.5 2C6.03043 2 6.53914 2.21071 6.91421 2.58579C7.28929 2.96086 7.5 3.46957 7.5 4V9C7.49822 9.08999 7.49007 9.17975 7.47562 9.26859L3.5 5.29297V4Z" fill="#FC8B98"/>
            <path d="M9.5 14H8.51075C7.92073 14.0146 7.34545 13.8147 6.8916 13.4374C6.43775 13.0601 6.13613 12.5311 6.0427 11.9483C6.37299 11.8867 6.69048 11.7696 6.98175 11.6021L6.23545 10.8558C5.93252 10.9778 5.60424 11.0235 5.27953 10.9887C4.95481 10.954 4.64362 10.8399 4.37337 10.6566C4.10312 10.4732 3.88211 10.2262 3.72981 9.93736C3.57751 9.64847 3.49859 9.32657 3.5 9V8.12036L2.5 7.12036V9C2.50124 9.71387 2.75683 10.4039 3.22091 10.9464C3.68499 11.4888 4.32719 11.8481 5.03226 11.9598C5.12641 12.7331 5.47893 13.452 6.0327 14H1.5C1.36739 14 1.24021 14.0527 1.14645 14.1464C1.05268 14.2402 1 14.3674 1 14.5C1 14.6326 1.05268 14.7598 1.14645 14.8536C1.24021 14.9473 1.36739 15 1.5 15H9.5C9.63261 15 9.75979 14.9473 9.85355 14.8536C9.94732 14.7598 10 14.6326 10 14.5C10 14.3674 9.94732 14.2402 9.85355 14.1464C9.75979 14.0527 9.63261 14 9.5 14Z" fill="#FC8B98"/>
            <path d="M14 5.5V5C14 4.60218 13.842 4.22064 13.5607 3.93934C13.2794 3.65804 12.8978 3.5 12.5 3.5C12.1022 3.5 11.7206 3.65804 11.4393 3.93934C11.158 4.22064 11 4.60218 11 5V5.5C10.7349 5.50034 10.4807 5.60581 10.2933 5.79327C10.1058 5.98073 10.0003 6.23489 10 6.5V8.5C10.0003 8.76511 10.1058 9.01926 10.2933 9.20673C10.4807 9.39419 10.7349 9.49966 11 9.5H14C14.2651 9.49966 14.5193 9.39419 14.7067 9.20673C14.8942 9.01926 14.9997 8.76511 15 8.5V6.5C14.9997 6.23489 14.8942 5.98073 14.7067 5.79327C14.5193 5.60581 14.2651 5.50034 14 5.5ZM12 5C12 4.86739 12.0527 4.74021 12.1464 4.64645C12.2402 4.55268 12.3674 4.5 12.5 4.5C12.6326 4.5 12.7598 4.55268 12.8536 4.64645C12.9473 4.74021 13 4.86739 13 5V5.5H12V5ZM11 8.5V6.5H14L14.001 8.5H11Z" fill="#F7F7F7"/>
            </svg>
          </div>

        </div>
      </div>

  </div>
</template>

<script>

// import mframe from 'mframe'
import _ from 'lodash';

export default {
  props:[
      'type',
      'name',
      'me',
      'host',
      'cohost',
      'avatar',
      'video',
      'audio',
      'muted',
      'room',
      'iconSize',
      'suffix',
      'external',
      'icon',
      'iconColor',
      'iconBgColor',
      'height',
      'activeInfo',
      'rightLink',
      'status',
      'checkbox',
      'checked',
      'hardmuted',
      'raisehand',
      'headset',
  ],
  data() {
    return {
      muted2: this.muted,
      aduioMotion: null,
      moreMenuVisible: false,
      checked2: this.checked,
    }
  },
  computed:{
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    avatarBgColors() {
      return this.$store.state.avatarBgColors;
    },
    activeSpeakerName(){
        return this.$store.state.activeSpeakerName;
    },
    avatarPath(){
      return this.$store.state.avatarPath;
    },
    abbr(){
        let arr = this.name.split(' ');
        return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
    },
    audioIco(){
        if(this.audio == 'mobile'){
            return 'ico_mobile';
        }else if(this.audio == 'pc'){
            return 'ico_headset';
        }else if(this.audio == 'phone'){
            return 'ico_headset';
        }else{
            return '';
        }
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    contactCardTemplate() {
      return this.$store.getters.contactCardTemplate(this.name, true);
    },
  },
  mounted(){
    if(this.name === this.activeSpeakerName) {
      this.playAudioAnimation();
    }
  },
  watch: {
    muted(val) {
      this.muted2 = val;
    },
    checked(val) {
      this.checked2 = val;
    },
    activeSpeakerName(val) {
      if(this.name === val) {
        this.playAudioAnimation();
      } else {
        if (this.aduioMotion) {
          this.aduioMotion.stop();
        }
      }
    },
  },
  methods:{
    clickHandler() {
      if (this.checkbox) {
        this.checked2 = !this.checked2;
        this.$emit('check', {
          name: this.name,
          checked: this.checked2,
        });
      }
    },
    random(l, h) {
      return _.random(l, h);
    },
    playAudioAnimation() {
      /*
      if (this.aduioMotion) {
        this.aduioMotion.stop();
      }

      this.aduioMotion = mframe([{
        dom: document.getElementById('plistaduioIconRectBackground'),
        frames: [
            //2-17（15）
            { attr: {y:'8'} , time:0 },
            { attr: {y:'15.0'} , time:24, tween: 'easeInOut' },
            { attr: {y:'9.0'} , time:42, tween: 'easeInOut' },
            { attr: {y:'11.0'} , time:44, tween: 'easeInOut' },
            { attr: {y:'13.0'} , time:62, tween: 'easeInOut' },
            { attr: {y:'2.0'} , time:86, tween: 'easeInOut' },
            { attr: {y:'8.0'} , time:112, tween: 'easeInOut' },
            { attr: {y:'15.0'} , time:134, tween: 'easeInOut' },
            { attr: {y:'9.0'} , time:158, tween: 'easeInOut' },
            { attr: {y:'11.0'} , time:178, tween: 'easeInOut' },
            { attr: {y:'8.0'} , time:204, tween: 'easeInOut' }
        ]
      }]);
      this.aduioMotion.repeat(Infinity);
      */
    },
    mute() {
        if (this.type === 'room') {
            this.muted2 = true;
        } else {
            let plist = [];
            const len = this.peopleList.length;
            for (let i = 0; i < len; i++) {
                const p = this.peopleList[i];
                if (p.name === this.name) {
                    p.muted = true;
                }
                plist.push(p);
            }
            this.$store.commit('peopleList', plist);
        }
    },
    unmute() {
        if (this.type === 'room') {
            this.muted2 = false;
        } else {
            let plist = [];
            const len = this.peopleList.length;
            for (let i = 0; i < len; i++) {
                const p = this.peopleList[i];
                if (p.name === this.name) {
                    p.muted = false;
                }
                plist.push(p);
            }
            this.$store.commit('peopleList', plist);
        }
        
    },
    toggleMoreMenu() {
      if (!this.moreMenuVisible) {
        this.$popper.show(
          {
            template: `
              <div class="common-menulist" style="width:260px;">
                <div class='common-menulist-item' >
                  <span class="lb">Make presenter</span>
                </div>
                <div class='common-menulist-item' >
                  <span class="lb">Make host</span>
                </div>
                <div class='common-menulist-item' >
                  <span class="lb">Make cohost</span>
                </div>
                <div class='common-menulist-divider' ></div>
                <div class='common-menulist-item' >
                  <span class="lb">Lower all hands</span>
                </div>
                <div class='common-menulist-item' >
                  <span class="lb">Chat</span>
                </div>
                <div class='common-menulist-item' >
                  <span class="lb">Move to lobby</span>
                </div>
                <div class='common-menulist-item' >
                  <span class="lb">Create space</span>
                </div>
                <div class='common-menulist-item' >
                  <span class="lb">Expel</span>
                </div>
              </div>
            `,
            props: [],
            methods: {
              close() {
                this.$popper.hideAll();
              },
            }
          },
          {
          }, // component props
          {
            reference: this.$refs.btnmore,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            frameless: false,
            borderRadius: '12px',
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            appendToBody: true,
            theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
            options: {placement: 'bottom-end'},
          }, // popper props
          {
            opened: () => {this.moreMenuVisible = true},
            closed: () => {this.moreMenuVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
        
    },
  }
}
</script>


<style lang="scss">
.peopleitem {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
  border-radius: 100px;
  transition: opacity 0.2s ease-out;

  &.room {
    padding-left: 43px;
  }

  &:hover {
    background-color: rgba($color: #000000, $alpha: .1);

    .lb_name .row1 .txt{
      opacity: 1;
    }
    .right .btn .rbt.show-on-hover{
      display: flex;
    }
  }
  &:active, &.active {
    background-color: rgba($color: #000000, $alpha: .15);
    
    .right .btn .rbt.show-on-hover{
      display: flex;
    }
  }

  &.h48 {
    height: 48px;
  }

  .left {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    flex-grow: 0;
    margin: 0 8px;

    .checkbox {
      @include flex;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-sizing: border-box;
      border-radius: 2px;
      margin-left: 12px;
      margin-right: 10px;

      &.checked {
        border: none;
        background: #64B4FA;
      }
    }

    .icon {
      @include flex;
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .headset {
      @include flex;
      width: 16px;
      height: 16px;
      margin-left: 8px;
    }
  }

  .right {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 12px;
    text-align: right;

    .link {
    
      font-size: 14px;
      display: flex;
      color: $md-blue-60;
    }

    .btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      .rbt {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.show-on-hover {
          display: none;
        }

        &:hover {
          background: rgba($color: #000000, $alpha: 0.08);
        }
        &:active, &.active {
          background: rgba($color: #000000, $alpha: 0.16);
        }

        &.unmuted {
          svg path {
            fill: $md-green-60;
          }
        }
        &.muted {
          svg path {
            fill: $md-red-60;
          }
        }
      }

    }
  }

  .lb_name {
    flex-grow: 1;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 12px;

    .row1 {
      display: flex;
      font-size: 16px;
      .txt {
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        opacity: .95;
      }
      .suffix {
        margin-left: 3px;
        opacity: .7;
      }
    }
    .row2 {
      display: flex;
      font-size: 14px;
      margin-top: -4px;

      .external {
        color: $md-yellow-60;
      }
      .activeinfo {
        opacity: .7;
      }
    }

    
  }


  /* theme ----- dark/hybrid */
  &.dark,
  &.hybrid {
      &:hover .normal{
          display: none;
      }
      &:hover .hover{
          display: flex;
      }
  }

  &.hybrid {
      color: $text-color-primary-light-ui;
  }

  &.dark {
      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .1);
      }
      &:active, &.active {
        background-color: rgba($color: #FFFFFF, $alpha: .15);
      }

      .lb_name {

        .row2 {
          .external {
            color: $md-yellow-50;
          }
        }
      }
      
      .right {
        .link {
          color: $md-blue-50;
        }
        .btn {
          .rbt {
            &:hover {
              background: rgba($color: #FFFFFF, $alpha: 0.08);
            }
            &:active, &.active {
              background: rgba($color: #FFFFFF, $alpha: 0.16);
            }
            &.unmuted {
              svg path {
                fill: $md-green-40;
              }
            }
            &.muted {
              svg path {
                fill: $md-red-40;
              }
            }
          }
        }
      }
  }
  
}

</style>
