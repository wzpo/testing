<template>
    <div class='pop-audio-video-settings'>
      <div class="section_audio" :class="{fadeout: audioVideoSettingPage !== 'audio'}" >
        <div class="audio_options expandable_options" :class="{expanded: audioOptionsExpanded}" @click="toggleAudioOptions">
          <div class="items" :style="{marginTop: !audioOptionsExpanded ? audioOptionsMargin : '0',}">
            <div class='itm itm_pc ico_pc' :class='{selected: audioType=="pc"}' @click='selectItem("pc")'>
              <div class="ico"><wl-icon name="headset-bold" size="18" /></div>
              <span class="lb">Use computer audio</span>
            </div>
            
            <div class='itm itm_callme ico_callme exp' :class='{selected: audioType=="callme"}' @click='selectItem("callme")'>
              <div class="ico"><wl-icon name="incoming-call-legacy-bold" size="18" /></div>
              <span class="lb">Call me at +1 408-123-4567</span>
            </div>

            <div class='itm itm_callin ico_callin' :class='{selected: audioType=="callin"}' @click='selectItem("callin")'>
              <div class="ico"><wl-icon name="outgoing-call-legacy-bold" size="18" /></div>
              <span class="lb">Call In</span>
            </div>

            <div class='itm itm_none ico_none' :class='{selected: audioType=="none"}' @click='selectItem("none")'>
              <div class="ico"><wl-icon name="speaker-disconnected-bold" size="18" /></div>
              <span class="lb">Don't connect audio</span>
            </div>
          </div>
          <div class="arrs">
            <wl-icon class="up" name="arrow-up-filled"  size="10" />
            <wl-icon class="down" name="arrow-down-filled"  size="10" />
          </div>
        </div>

        <div v-if="audioType !== 'none'" class="divider"></div>

        <div v-if="audioType === 'pc'" class="audio_settings">
          <div class="group_head">
            <div class="lb">Speaker and microphone</div>
            <div class="test" @click="changePage('test')">Test</div>
          </div>

          <div class="combobox" ref="cb_speaker" @click="showDropdownSpeaker('cb_speaker', {width: '296px', headerVisible: true, iconVisible: true, offset: -32})" >
            <span class="ico"><wl-icon name="speaker-bold"  size="16" /></span>
            <span class="lb">{{selectedSpeaker}}</span>
            <wl-icon name="arrow-down-filled" size="10" />
          </div>

          <div class="combobox" ref="cb_microphone" @click="showDropdownMicrophone('cb_microphone', {width: '296px', headerVisible: true, iconVisible: true, offset: -32})" >
            <span class="ico"><wl-icon name="microphone-bold"  size="16" /></span>
            <span class="lb">{{selectedMicrophone}}</span>
            <wl-icon name="arrow-down-filled"  size="10" />
          </div>

          <div class="divider"></div>

          <div class="group_head">
            <div class="lb">Optimize audio</div>
          </div>

          <div class="combobox" ref="cb_optimize" @click="showDropdownOptimize" >
            <span class="ico">

              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.64713 11.2941C5.45224 11.2941 5.29419 11.1362 5.29419 10.9412V0.352941C5.29419 0.158047 5.45224 0 5.64713 0C5.84202 0 6.00007 0.158047 6.00007 0.352941V10.9412C6.00007 11.1362 5.84202 11.2941 5.64713 11.2941Z" fill="white" fill-opacity="0.95"/>
                <path d="M10.5882 12.0001H9.89978L9.5595 11.1018H8.07176L7.74467 12.0001H7.05884L8.47535 8.4707H9.18229L10.5882 12.0001ZM9.39331 10.6243L8.86839 9.21646C8.85256 9.17051 8.83585 9.09668 8.81827 8.99495H8.80772C8.79189 9.08847 8.7743 9.16231 8.75496 9.21646L8.23531 10.6243H9.39331Z" fill="white" fill-opacity="0.95"/>
                <path d="M7.41178 7.76459C7.21671 7.76459 7.05884 7.60672 7.05884 7.41165V3.88224C7.05884 3.68734 7.21671 3.5293 7.41178 3.5293C7.60685 3.5293 7.76472 3.68734 7.76472 3.88224V7.41165C7.76472 7.60672 7.60685 7.76459 7.41178 7.76459Z" fill="white" fill-opacity="0.95"/>
                <path d="M2.11759 8.11793C1.9227 8.11793 1.76465 7.96006 1.76465 7.76499V3.5297C1.76465 3.3348 1.9227 3.17676 2.11759 3.17676C2.31248 3.17676 2.47053 3.3348 2.47053 3.5297V7.76499C2.47053 7.96006 2.31248 8.11793 2.11759 8.11793Z" fill="white" fill-opacity="0.95"/>
                <path d="M3.88224 9.52935C3.68734 9.52935 3.5293 9.37148 3.5293 9.17641V2.11759C3.5293 1.9227 3.68734 1.76465 3.88224 1.76465C4.07713 1.76465 4.23518 1.9227 4.23518 2.11759V9.17641C4.23518 9.37148 4.07713 9.52935 3.88224 9.52935Z" fill="white" fill-opacity="0.95"/>
                <path d="M9.17643 6.70603C8.98136 6.70603 8.82349 6.54816 8.82349 6.35308V4.94132C8.82349 4.74643 8.98136 4.58838 9.17643 4.58838C9.3715 4.58838 9.52937 4.74643 9.52937 4.94132V6.35308C9.52937 6.54816 9.3715 6.70603 9.17643 6.70603Z" fill="white" fill-opacity="0.95"/>
                <path d="M0.352941 6.66174C0.158047 6.66174 0 6.50387 0 6.30879V4.98527C0 4.79037 0.158047 4.63232 0.352941 4.63232C0.547835 4.63232 0.705882 4.79037 0.705882 4.98527V6.30879C0.705882 6.50387 0.547835 6.66174 0.352941 6.66174Z" fill="white" fill-opacity="0.95"/>
              </svg>

            </span>
            <span class="lb">For me</span>
            <wl-icon name="arrow-down-filled"  size="10" />
          </div>

        </div>
        <div v-if="audioType === 'callme' || audioType === 'callin'" class="no_settings">
          Your call in information will be available after you join meeting.
        </div>

      </div><!--section_audio-->


      <div class="section_test" :class="{fadeout: audioVideoSettingPage !== 'test'}" >
        <div class="title">
          <div class="before_test" v-show="[0, 1, 2].indexOf(testResult) > -1" >
            <wl-icon v-show="testResult === 0" name="speaker-bold" size="18" />
            <wl-icon v-show="[1, 2].indexOf(testResult) > -1" name="microphone-bold" size="18" />
            <div v-show="testResult === 0" class="lb">Testing speaker</div>
            <div v-show="[1, 2].indexOf(testResult) > -1" class="lb">Testing microphone</div>
          </div>
          <div class="in_test" v-show="[3, 4].indexOf(testResult) > -1" >
            <div class="lb">Speaker and microphone</div>
          </div>
          <div class="close" @click="changePage('audio')">
            <wl-icon name="cancel-bold" size="16" />
          </div>
        </div>

        <div class="select" v-show="[0].indexOf(testResult) > -1">
          <div class="combobox md-select-style-frame" ref="cb_speaker2" @click="showDropdownSpeaker('cb_speaker2', {width: '272px', headerVisible: false, iconVisible: false, offset: 0})" >
            <span class="lb">{{selectedSpeaker}}</span>
            <wl-icon name="arrow-down-filled" size="16" />
          </div>
        </div>

        <div class="select md-select-style-frame" v-show="[1, 2].indexOf(testResult) > -1">
          <div class="combobox" ref="cb_microphone2" @click="showDropdownMicrophone('cb_microphone2', {width: '272px', headerVisible: false, iconVisible: false, offset: 0})" >
            <span class="lb">{{selectedMicrophone}}</span>
            <wl-icon name="arrow-down-filled" size="16" />
          </div>
        </div>

        <div class="voice_visualization" v-show="[0, 1, 2].indexOf(testResult) > -1" >
          <svg v-show="[0, 1].indexOf(testResult) > -1" width="268" height="12" viewBox="0 0 268 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12C3.10457 12 4 11.1046 4 10V2C4 0.895431 3.10457 0 2 0ZM14 0C12.8954 0 12 0.895431 12 2V10C12 11.1046 12.8954 12 14 12C15.1046 12 16 11.1046 16 10V2C16 0.895431 15.1046 0 14 0ZM24 2C24 0.895431 24.8954 0 26 0C27.1046 0 28 0.895431 28 2V10C28 11.1046 27.1046 12 26 12C24.8954 12 24 11.1046 24 10V2ZM38 0C36.8954 0 36 0.895431 36 2V10C36 11.1046 36.8954 12 38 12C39.1046 12 40 11.1046 40 10V2C40 0.895431 39.1046 0 38 0ZM48 2C48 0.895431 48.8954 0 50 0C51.1046 0 52 0.895431 52 2V10C52 11.1046 51.1046 12 50 12C48.8954 12 48 11.1046 48 10V2ZM62 0C60.8954 0 60 0.895431 60 2V10C60 11.1046 60.8954 12 62 12C63.1046 12 64 11.1046 64 10V2C64 0.895431 63.1046 0 62 0ZM72 2C72 0.895431 72.8954 0 74 0C75.1046 0 76 0.895431 76 2V10C76 11.1046 75.1046 12 74 12C72.8954 12 72 11.1046 72 10V2ZM86 0C84.8954 0 84 0.895431 84 2V10C84 11.1046 84.8954 12 86 12C87.1046 12 88 11.1046 88 10V2C88 0.895431 87.1046 0 86 0ZM96 2C96 0.895431 96.8954 0 98 0C99.1046 0 100 0.895431 100 2V10C100 11.1046 99.1046 12 98 12C96.8954 12 96 11.1046 96 10V2ZM110 0C108.895 0 108 0.895431 108 2V10C108 11.1046 108.895 12 110 12C111.105 12 112 11.1046 112 10V2C112 0.895431 111.105 0 110 0ZM120 2C120 0.895431 120.895 0 122 0C123.105 0 124 0.895431 124 2V10C124 11.1046 123.105 12 122 12C120.895 12 120 11.1046 120 10V2ZM134 0C132.895 0 132 0.895431 132 2V10C132 11.1046 132.895 12 134 12C135.105 12 136 11.1046 136 10V2C136 0.895431 135.105 0 134 0ZM144 2C144 0.895431 144.895 0 146 0C147.105 0 148 0.895431 148 2V10C148 11.1046 147.105 12 146 12C144.895 12 144 11.1046 144 10V2ZM158 0C156.895 0 156 0.895431 156 2V10C156 11.1046 156.895 12 158 12C159.105 12 160 11.1046 160 10V2C160 0.895431 159.105 0 158 0ZM168 2C168 0.895431 168.895 0 170 0C171.105 0 172 0.895431 172 2V10C172 11.1046 171.105 12 170 12C168.895 12 168 11.1046 168 10V2ZM182 0C180.895 0 180 0.895431 180 2V10C180 11.1046 180.895 12 182 12C183.105 12 184 11.1046 184 10V2C184 0.895431 183.105 0 182 0ZM192 2C192 0.895431 192.895 0 194 0C195.105 0 196 0.895431 196 2V10C196 11.1046 195.105 12 194 12C192.895 12 192 11.1046 192 10V2ZM206 0C204.895 0 204 0.895431 204 2V10C204 11.1046 204.895 12 206 12C207.105 12 208 11.1046 208 10V2C208 0.895431 207.105 0 206 0Z" fill="url(#paint0_linear)"/>
            <rect class="base" x="216" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="228" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="240" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="252" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="264" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <defs>
              <linearGradient id="paint0_linear" x1="-6.78002e-07" y1="5.99995" x2="410.647" y2="5.99996" gradientUnits="userSpaceOnUse">
                <stop stop-color="#3CC29A"/>
                <stop offset="1" stop-color="#64B4FA"/>
              </linearGradient>
            </defs>
          </svg>

          <svg v-show="[2].indexOf(testResult) > -1" width="268" height="12" viewBox="0 0 268 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="base" fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12C3.10457 12 4 11.1046 4 10V2C4 0.895431 3.10457 0 2 0ZM14 0C12.8954 0 12 0.895431 12 2V10C12 11.1046 12.8954 12 14 12C15.1046 12 16 11.1046 16 10V2C16 0.895431 15.1046 0 14 0ZM24 2C24 0.895431 24.8954 0 26 0C27.1046 0 28 0.895431 28 2V10C28 11.1046 27.1046 12 26 12C24.8954 12 24 11.1046 24 10V2ZM38 0C36.8954 0 36 0.895431 36 2V10C36 11.1046 36.8954 12 38 12C39.1046 12 40 11.1046 40 10V2C40 0.895431 39.1046 0 38 0ZM48 2C48 0.895431 48.8954 0 50 0C51.1046 0 52 0.895431 52 2V10C52 11.1046 51.1046 12 50 12C48.8954 12 48 11.1046 48 10V2ZM62 0C60.8954 0 60 0.895431 60 2V10C60 11.1046 60.8954 12 62 12C63.1046 12 64 11.1046 64 10V2C64 0.895431 63.1046 0 62 0ZM72 2C72 0.895431 72.8954 0 74 0C75.1046 0 76 0.895431 76 2V10C76 11.1046 75.1046 12 74 12C72.8954 12 72 11.1046 72 10V2ZM86 0C84.8954 0 84 0.895431 84 2V10C84 11.1046 84.8954 12 86 12C87.1046 12 88 11.1046 88 10V2C88 0.895431 87.1046 0 86 0ZM96 2C96 0.895431 96.8954 0 98 0C99.1046 0 100 0.895431 100 2V10C100 11.1046 99.1046 12 98 12C96.8954 12 96 11.1046 96 10V2ZM110 0C108.895 0 108 0.895431 108 2V10C108 11.1046 108.895 12 110 12C111.105 12 112 11.1046 112 10V2C112 0.895431 111.105 0 110 0ZM120 2C120 0.895431 120.895 0 122 0C123.105 0 124 0.895431 124 2V10C124 11.1046 123.105 12 122 12C120.895 12 120 11.1046 120 10V2ZM134 0C132.895 0 132 0.895431 132 2V10C132 11.1046 132.895 12 134 12C135.105 12 136 11.1046 136 10V2C136 0.895431 135.105 0 134 0ZM144 2C144 0.895431 144.895 0 146 0C147.105 0 148 0.895431 148 2V10C148 11.1046 147.105 12 146 12C144.895 12 144 11.1046 144 10V2ZM158 0C156.895 0 156 0.895431 156 2V10C156 11.1046 156.895 12 158 12C159.105 12 160 11.1046 160 10V2C160 0.895431 159.105 0 158 0ZM168 2C168 0.895431 168.895 0 170 0C171.105 0 172 0.895431 172 2V10C172 11.1046 171.105 12 170 12C168.895 12 168 11.1046 168 10V2ZM182 0C180.895 0 180 0.895431 180 2V10C180 11.1046 180.895 12 182 12C183.105 12 184 11.1046 184 10V2C184 0.895431 183.105 0 182 0ZM192 2C192 0.895431 192.895 0 194 0C195.105 0 196 0.895431 196 2V10C196 11.1046 195.105 12 194 12C192.895 12 192 11.1046 192 10V2ZM206 0C204.895 0 204 0.895431 204 2V10C204 11.1046 204.895 12 206 12C207.105 12 208 11.1046 208 10V2C208 0.895431 207.105 0 206 0Z" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="216" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="228" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="240" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="252" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
            <rect class="base" x="264" width="4" height="12" rx="2" fill="white" fill-opacity="0.2"/>
          </svg>

        </div>

        <div class="items" v-show="[3, 4].indexOf(testResult) > -1" >
          <div class="rw">
            <wl-icon name="speaker-bold" size="16" />
            <div class="lb" :class="{failed: speakerBad}" >{{selectedSpeaker}}</div>
          </div>
          <div class="rw">
            <wl-icon name="microphone-bold" size="16" />
            <div class="lb" :class="{failed: micBad}" >{{selectedMicrophone}}</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="info">
          {{testResult === 0 ? 'Do you hear a ringtone?' : [1, 2].indexOf(testResult) > -1 ? 'Speak and pause, do you hear a replay?' : testResult === 3 ? 'Speaker and microphone are good 👍' : 'All your devices have been tested.'}}
        </div>

        <div class="btns">
          <md-button class="btn md-button-solid btn-yes" aria-label="x" :size="28" @click="goTest('good')">{{[0, 1, 2].indexOf(testResult) > -1 ? 'Yes' : testResult === 3 ? 'Use computer audio' : 'Use call in to connect to audio'}}</md-button>
          <md-button v-if="[0, 1, 2].indexOf(testResult) > -1" class="btn md-button-outline btn-no" aria-label="x" :size="28" @click="goTest('bad')">No</md-button>
        </div>

      </div><!--section_test-->


      <div class="section_video" :class="{fadeout: audioVideoSettingPage !== 'video'}" >
        <div class="video_options expandable_options" :class="{expanded: videoOptionsExpanded}" >
          <div class="items" :style="{marginTop: !videoOptionsExpanded ? videoOptionsMargin : '0',}">

            <div class='itm' :class='{selected: true}' >
              <div class="ico"><wl-icon name="camera-bold" size="18" /></div>
              <span class="lb">{{selectedCamera}}</span>
            </div>

          </div>
          <div class="arrs">
            <wl-icon class="up" name="arrow-up-filled"  size="10" />
            <wl-icon class="down" name="arrow-down-filled" size="10" />
          </div>
        </div>

        <div class="divider"></div>

        <div class="tabs">
          <div class="tab" :class="{active: selectedVideoTabId === 0}" >Virtual background</div>
          <div class="tab" :class="{active: selectedVideoTabId === 1}" >Visual effects</div>
        </div>

        <div class="list">

          <div class="itm border">
            <div class="selected"></div>
            <span>None</span>
          </div>

          <div class="itm border">
            <span>Blur</span>
          </div>

          <div class="itm img1"></div>
          <div class="itm img2"></div>
          <div class="itm img3"></div>
          <div class="itm img4"></div>
          <div class="itm img5"></div>
          <div class="itm img6"></div>
          <div class="itm img7"></div>
          <div class="itm img8"></div>
          <div class="itm img9"></div>

          <div class="itm border">
            <wl-icon class="ico" name="plus-bold"  size="18" />
          </div>

        </div>

        <div class="divider" ></div>

        <div class="others">
          <md-checkbox value="Automatically adjust camera brightness"
            label="Automatically adjust camera brightness"
            htmlId="vol"
            checked
            />
          
          <md-checkbox value="Mirror my video"
            label="Mirror my video"
            htmlId="mirror"
            :checked="selfvideoMirror"
            @change="toggleMirror"
          />
        </div>


      </div><!--section_video-->

    </div>
</template>

<script>


import popAudioSpeaker from "./pop-audio-speaker.vue";
import popAudioMicrophone from "./pop-audio-microphone.vue";
import popAudioOptimize from "./pop-audio-optimize.vue";

export default {
  props: [],
  data() {
    return {
      audioOptionsExpanded: false,
      videoOptionsExpanded: false,
      audioOptionsMargin: 0,
      videoOptionsMargin: 0,
      audioTypes: ['pc', 'callme', 'callin', 'none'],
      selectedVideoTabId: 0,
      testResult: 0,
      speakerBad: false,
      micBad: false,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    me(){
      return this.$store.getters.me;
    },
    selectedSpeaker(){
      return this.$store.state.selectedSpeaker;
    },
    selectedMicrophone(){
      return this.$store.state.selectedMicrophone;
    },
    selectedCamera(){
      return this.$store.state.selectedCamera;
    },
    audioType(){
      return this.$store.state.audioType;
    },
    audioVideoSettingPage(){
      return this.$store.state.audioVideoSettingPage;
    },
    selfvideoMirror() {
      return this.$store.state.selfvideoMirror;
    },
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    toggleAudioOptions(){
      this.audioOptionsExpanded = !this.audioOptionsExpanded;
    },
    selectItem(type){
      this.$store.commit('audioType', type);
      this.audioOptionsMargin = `-${this.audioTypes.indexOf(type) * (48 + 10)}px`;
    },
    close() {
      this.$emit("close");
    },

    showDropdownSpeaker(ref, opt) {
      this.$popper.show(
        popAudioSpeaker,
        {
          width: opt.width,
          headerVisible: opt.headerVisible,
        }, // component props
        {
          reference: this.$refs[ref],
          closeTrigger: 'mousedown',
          arrowVisible: false,
          roundedCorner: true,
          frameless: false,
          borderRadius: '8px',
          appendToBody: false,
          theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
          options: {
                placement: 'bottom', 
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, opt.offset],
                    },
                  },
                ],
              },
        }, // popper props
        {
        } // popper eventlistener
      );
    },
    showDropdownMicrophone(ref, opt) {
      this.$popper.show(
        popAudioMicrophone,
        {
          width: opt.width,
          headerVisible: opt.headerVisible,
        }, // component props
        {
          reference: this.$refs[ref],
          closeTrigger: 'mousedown',
          arrowVisible: false,
          roundedCorner: true,
          frameless: false,
          borderRadius: '8px',
          appendToBody: false,
          theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
          options: {
                placement: 'bottom', 
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, opt.offset],
                    },
                  },
                ],
              },
        }, // popper props
        {
        } // popper eventlistener
      );
    },
    showDropdownOptimize() {
      this.$popper.show(
        popAudioOptimize,
        {
        }, // component props
        {
          reference: this.$refs.cb_optimize,
          closeTrigger: 'mousedown',
          arrowVisible: false,
          roundedCorner: true,
          frameless: false,
          borderRadius: '8px',
          appendToBody: false,
          theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
          options: {
                placement: 'bottom', 
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -32],
                    },
                  },
                ],
              },
        }, // popper props
        {
        } // popper eventlistener
      );
    },
    toggleMirror(evt) {
      this.$store.commit('selfvideoMirror', evt.checked);
    },
    selectSpeaker(selected) {
      this.$store.commit("selectedSpeaker", selected[0].value);
    },
    selectMicrophone(selected) {
      this.$store.commit("selectedMicrophone", selected[0].value);
    },
    changePage(page) {
      if (page === 'test') {
        this.testResult = 0
        this.speakerBad = false
        this.micBad = false
      }
      this.$store.commit("audioVideoSettingPage", page);
    },
    goTest(type) {
      if (type === 'good') {
        if (this.testResult === 0) {
          this.testResult = 1;
        } else if (this.testResult === 1) {
          this.testResult = 3;
        } else if (this.testResult === 2) {
          this.testResult = 4;
        } else if (this.testResult === 3) {
          this.selectItem('pc');
          this.$store.commit("audioVideoSettingPage", 'audio');
        } else if (this.testResult === 4) {
          this.selectItem('callin');
          this.$store.commit("audioVideoSettingPage", 'audio');
        }
      } else {
        if (this.testResult === 0) {
          this.testResult = 2;
          this.speakerBad = true;
        } else if (this.testResult === 1 || this.testResult === 2) {
          this.testResult = 4;
          this.micBad = true;
        }
      }
    },
  }
};
</script>

<style lang="scss">

.pop-audio-video-settings {
  width:320px;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: rotate(0deg);
  transition: all .2s;
  background-color: rgba($color: #FFFFFF, $alpha: .8);
  backdrop-filter: blur(16px);

  .fadeout {
    transition: all .3s;
    position: absolute;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    overflow: hidden;
  }
  
  .section_audio {
    transition: all .2s;

    .no_settings {
      font-size: 14px;
      opacity: .7;
    }
  }

  .section_test {
    display: flex;
    flex-direction: column;
    padding: 0 12px 10px 12px;

    .title {
      position: relative;
      display: flex;
      align-items: center;
      height: 32px;
      user-select: none;
      margin-bottom: 10px;

      .before_test {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;

        .lb {
          margin-left: 8px;
        }
      }
      .in_test {
        font-size: 12px;
        opacity: .7;
      }

      .close {
        position: absolute;
        @include flex;
        width: 16px;
        height: 16px;
        top: -2px;
        right: -14px;
      }
    }

    .select {
      .md-select-style-frame {
        border: 1px solid rgba($color: #000000, $alpha: .2);
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0 12px 0 8px;
      }
    }

    .items {
      display: flex;
      flex-direction: column;
      margin: -6px 0 10px 16px;
      margin-bottom: 10px;

      .rw {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: normal;

        .lb {
          margin-left: 8px;
        }

        .failed {
          text-decoration: line-through;
        }
      }
    }

    .voice_visualization {
      margin-top: 4px;

      .base {
        fill: black;
      }
    }

    .info {
      font-size: 14px;
      font-weight: 600;
      margin: 10px 0;
    }

    .btns {
      display: flex;
      align-items: center;

      .btn {
        font-size: 12px;
        margin-right: 4px;
        transition: all .5s;

        span {
          transition: all .5s;
        }
      }
    }
  }

  .section_video {
    .tabs {
      display: flex;
      margin: 0 8px;
      user-select: none;

      .tab {
        @include flex;
        height: 28px;
        border-radius: 14px;
        padding: 0 16px;
        margin-right: 6px;
        font-size: 12px;
        font-weight: 600;

        &:hover {
          background: rgba($color: #000000, $alpha: .05);
        }
        &:active, &.active {
          background: rgba($color: #000000, $alpha: .1);
        }
      }
    }

    .list{
      display: grid;
      grid-gap: 8px 8px;
      grid-template-columns: 64px 64px 64px 64px;
      grid-template-rows: 36px 36px;
      justify-items: center;
      align-items: center;
      margin: 15px 0 18px 9px;

      .itm {
        position:relative;
        width: 64px;
        height: 36px;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat;
        background-size: cover;
        box-sizing: border-box;
        font-size: 12px;
        user-select: none;

        &.border {
          border: 1px solid rgba($color: #000000, $alpha: .2);
        }

        .selected{
          position: absolute;
          border: 2px solid $md-blue-60;
          width: 70px;
          height: 42px;
          border-radius: 4px;
          box-sizing: border-box;
          
          z-index: 0;
        }

        &.img1{
          background-image: url(~@/assets/img/vbg1.png);
        }
        &.img2{
          background-image: url(~@/assets/img/vbg2.png);
        }
        &.img3{
          background-image: url(~@/assets/img/vbg3.png);
        }
        &.img4{
          background-image: url(~@/assets/img/vbg4.png);
        }
        &.img5{
          background-image: url(~@/assets/img/vbg5.png);
        }
        &.img6{
          background-image: url(~@/assets/img/vbg6.png);
        }
        &.img7{
          background-image: url(~@/assets/img/vbg7.png);
        }
        &.img8{
          background-image: url(~@/assets/img/vbg8.png);
        }
        &.img9{
          background-image: url(~@/assets/img/vbg9.png);
        }
      }
    }

    .others {
      margin: 15px 0 10px 6px;
    }
  }

  .expandable_options {
    position: relative;
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    height: 48px;
    transition: all .2s;

    .items {
      display: flex;
      flex-direction: column;
      width: 100%;

      .itm{
        height: 48px;
        width: 100%;
        display: flex;
        align-items: center;
        cursor: default;
        margin-bottom: 10px;
        flex-shrink: 0;

        &:last-child {
          margin-bottom: 0;
        }

        .ico{
          @include flex;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin: 0 12px 0 8px;
          background-color: rgba($color: #000000, $alpha: .07);
        }
        .lb{
          font-size: 14px;
          user-select: none;
        }

        &.selected{
          .lb {
            font-weight: 600;
          }
          .ico{
            path {
              fill: white;
            }
            background-color: rgba($color: #000000, $alpha: 1);
          }
        }
      }
    }

    .arrs {
      position: absolute;
      @include flex;
      flex-direction: column;
      width: 32px;
      height: 32px;
      right: 8px;
      top: 8px;

    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: .11);
    }
    &.expanded {
      height: 222px;
      background-color: rgba($color: #000000, $alpha: .11);

      .items .itm:hover {
        background-color: rgba($color: #000000, $alpha: .1);
      }
    }
    
  }

  .divider {
    border-bottom: 1px solid rgba($color: #000000, $alpha: .2);
    margin: 8px 0;
  }

  .group_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    user-select: none;
    padding: 0 15px 0 10px;

    .lb {
      font-size: 12px;
      opacity: .7;
    }
    .test {
      font-size: 14px;
      text-decoration: underline;
      color: $text-color-hyperlink-light-ui;
      cursor: pointer;
    }
  }

  .combobox {
    display: flex;
    align-items: center;
    height: 32px;
    cursor: default;
    user-select: none;
    border-radius: 8px;
    padding: 0 15px 0 8px;

    .ico {
      @include flex;
      width: 32px;
      height: 32px;


      svg path {
        fill: black;
      }
    }

    .lb {
      flex-grow: 1;
      font-size: 14px;
      overflow:hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
      padding-right: 10px;
    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: .1);
    }
    &:active {
      background-color: rgba($color: #000000, $alpha: .2);
    }
  }

}

.dark {
  .pop-audio-video-settings {
    background-color: rgba($color: #000000, $alpha: .8);

    .section_test {
      .select {
        .md-select-style-frame {
          border: 1px solid rgba($color: #FFFFFF, $alpha: .2);
        }
      }
      .voice_visualization {
        .base {
          fill: white;
        }
      }
    }

    .section_video {
      .tabs {
        .tab {
          &:hover {
            background: rgba($color: #FFFFFF, $alpha: .05);
          }
          &:active, &.active {
            background: rgba($color: #FFFFFF, $alpha: .1);
          }
        }
      }
      
      .list{

        .itm {
          &.border {
            border: 1px solid rgba($color: #FFFFFF, $alpha: .2);
          }
          .selected{
            border: 2px solid $md-blue-40;
          }
        }
      }
    }

    .expandable_options {
      .items .itm{
        .ico{
          background-color: rgba($color: #FFFFFF, $alpha: .07);
        }
        &.selected{
          .ico{
            path {
              fill: black;
            }
            background-color: rgba($color: #FFFFFF, $alpha: 1);
          }
        }
      }
      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .11);
      }
      &.expanded {
        background-color: rgba($color: #FFFFFF, $alpha: .11);
        .items .itm:hover {
          background-color: rgba($color: #FFFFFF, $alpha: .1);
        }
      }
    }

    .divider {
      border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: .2);
    }

    .group_head {
      .test {
        color: $text-color-hyperlink-dark-ui;
      }
    }
    .combobox {
      .ico {
        svg path {
          fill: white;
        }
      }

      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .1);
      }
      &:active {
        background-color: rgba($color: #FFFFFF, $alpha: .2);
      }
    }
  }

}


</style>
