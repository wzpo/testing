<template>
    <div class='sharing-section' ref="sharing_section" :class="[theme]">
      <div class="tabs" :class="{fullscreen: fullscreen && !hudVisible}" >
        <div 
          v-for="(itm, idx) in tabs"
          :key="`itm${idx}`"
          :class="[
            'tab',
            `tab_${itm.type}_${idx}`,
            {
              active: activeId === idx && tabs.length > 1,
              hasstopbutton: itm.type === 'collaborating',
            }]"
          @click="selectTab(idx)"
        >
          <div class="sec l">
            <md-avatar v-if="itm.type === 'sharing'" class="avatar" :src="$store.state.avatarPath+$store.getters.people(itm.people).avatar" :name="itm.people" />
            <div v-if="!itm.noicon && !itm.icon && itm.type === 'collaborating'" class="avatar" :class="`ico--${itm.content}`"></div>
            <wl-icon v-if="!itm.noicon && itm.icon && itm.type === 'collaborating'" class="avatar" :name="itm.icon" size="20" />
            <div class="title">
              {{itm.title}}
            </div>
          </div>

          <div class="sec m" v-if="activeId === idx && itm.type === 'sharing' && !isNarrowTab" >
            <svg width="96" height="24" viewBox="0 0 96 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38.2651 17H33.1172V16.0859H35.1738V9.01465L33.0664 9.64307V8.65283L36.2148 7.69434V16.0859H38.2651V17Z" fill="#F7F7F7"/>
              <path d="M42.4229 17.1523C41.5215 17.1523 40.8169 16.7651 40.3091 15.9907C39.8055 15.2163 39.5537 14.097 39.5537 12.6328C39.5537 11.0247 39.8161 9.80811 40.3408 8.98291C40.8698 8.15771 41.6315 7.74512 42.626 7.74512C44.5303 7.74512 45.4824 9.30029 45.4824 12.4106C45.4824 13.951 45.2137 15.1274 44.6763 15.9399C44.1388 16.7482 43.3877 17.1523 42.4229 17.1523ZM42.5688 8.62744C41.2697 8.62744 40.6201 9.94564 40.6201 12.582C40.6201 15.0449 41.257 16.2764 42.5308 16.2764C43.7876 16.2764 44.416 15.0238 44.416 12.5186C44.416 9.92448 43.8003 8.62744 42.5688 8.62744Z" fill="#F7F7F7"/>
              <path d="M49.4307 17.1523C48.5293 17.1523 47.8247 16.7651 47.3169 15.9907C46.8133 15.2163 46.5615 14.097 46.5615 12.6328C46.5615 11.0247 46.8239 9.80811 47.3486 8.98291C47.8776 8.15771 48.6393 7.74512 49.6338 7.74512C51.5381 7.74512 52.4902 9.30029 52.4902 12.4106C52.4902 13.951 52.2215 15.1274 51.6841 15.9399C51.1466 16.7482 50.3955 17.1523 49.4307 17.1523ZM49.5767 8.62744C48.2775 8.62744 47.6279 9.94564 47.6279 12.582C47.6279 15.0449 48.2648 16.2764 49.5386 16.2764C50.7954 16.2764 51.4238 15.0238 51.4238 12.5186C51.4238 9.92448 50.8081 8.62744 49.5767 8.62744Z" fill="#F7F7F7"/>
              <path d="M55.5879 12.4614C54.9616 12.4614 54.4622 12.2562 54.0898 11.8457C53.7174 11.431 53.5312 10.8787 53.5312 10.189C53.5312 9.43571 53.728 8.84326 54.1216 8.41162C54.5151 7.97575 55.0462 7.75781 55.7148 7.75781C56.3623 7.75781 56.8638 7.95882 57.2192 8.36084C57.5789 8.76286 57.7588 9.3278 57.7588 10.0557C57.7588 10.7835 57.5578 11.3675 57.1558 11.8076C56.758 12.2435 56.2354 12.4614 55.5879 12.4614ZM55.6768 8.45605C55.2747 8.45605 54.9574 8.60628 54.7246 8.90674C54.4919 9.20296 54.3755 9.61133 54.3755 10.1318C54.3755 10.6439 54.4897 11.0438 54.7183 11.3315C54.9468 11.6151 55.2578 11.7568 55.6514 11.7568C56.0492 11.7568 56.3602 11.6087 56.5845 11.3125C56.8088 11.0163 56.9209 10.6058 56.9209 10.0811C56.9209 9.56901 56.8088 9.17122 56.5845 8.8877C56.3644 8.59993 56.0618 8.45605 55.6768 8.45605ZM61.6816 7.89746L55.8418 17.0635H54.9341L60.7676 7.89746H61.6816ZM61.0088 17.1396C60.3825 17.1396 59.8831 16.9323 59.5107 16.5176C59.1383 16.1029 58.9521 15.5527 58.9521 14.8672C58.9521 14.1139 59.151 13.5194 59.5488 13.0835C59.9466 12.6434 60.4756 12.4233 61.1357 12.4233C61.779 12.4233 62.2804 12.6265 62.6401 13.0327C62.9998 13.439 63.1797 14.0081 63.1797 14.7402C63.1797 15.4639 62.9787 16.0457 62.5767 16.4858C62.1789 16.9217 61.6562 17.1396 61.0088 17.1396ZM61.0977 13.1406C60.6914 13.1406 60.3719 13.2887 60.1392 13.585C59.9106 13.8812 59.7964 14.2917 59.7964 14.8164C59.7964 15.32 59.9106 15.7157 60.1392 16.0034C60.3677 16.2869 60.6787 16.4287 61.0723 16.4287C61.4701 16.4287 61.7811 16.2806 62.0054 15.9844C62.2297 15.6839 62.3418 15.2734 62.3418 14.7529C62.3418 14.2367 62.2297 13.8389 62.0054 13.5596C61.7853 13.2803 61.4827 13.1406 61.0977 13.1406Z" fill="#F7F7F7"/>
              <path d="M23.5 0V24" stroke="#3B3B3B"/>
              <rect x="8" y="11.5" width="8" height="1" rx="0.5" fill="#F7F7F7"/>
              <path d="M72.5 0V24" stroke="#3B3B3B"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M84 8C83.7239 8 83.5 8.22386 83.5 8.5V11.5H80.5C80.2239 11.5 80 11.7239 80 12C80 12.2761 80.2239 12.5 80.5 12.5H83.5V15.5C83.5 15.7761 83.7239 16 84 16C84.2761 16 84.5 15.7761 84.5 15.5V12.5H87.5C87.7761 12.5 88 12.2761 88 12C88 11.7239 87.7761 11.5 87.5 11.5H84.5V8.5C84.5 8.22386 84.2761 8 84 8Z" fill="#F7F7F7"/>
              <rect x="0.5" y="0.5" width="95" height="23" rx="1.5" stroke="#3B3B3B"/>
            </svg>
          </div>

          <div v-show="activeId === idx || itm.type === 'collaborating'" class="sec r">

            <div class="btn" v-if="itm.type === 'sharing'" :class="{active: annotating}" v-tooltip="'Annotation'" @click="() => { annotating = !annotating}">
              <wl-icon v-if="!annotating" name="annotate-regular" size="16" />
              <wl-icon v-if="annotating" name="annotate-bold" size="16" />
            </div>
            <div class="btn" v-if="itm.type === 'sharing' && itm.content === 'desktop'" v-tooltip="'Remote control'"  >
              <wl-icon name="remote-desktop-control-bold" size="16" />
            </div>
            <div class="btn" v-tooltip="stageMaximized ? 'Back to normal' : 'Maximize'" @click="toggleMax">
              <wl-icon :name="stageMaximized ? 'minimize-bold' : 'maximize-bold'" size="16" />
            </div>
            
            <div v-if="!isMiniTab && itm.type === 'collaborating' && collaboratingSide === 'initiator'" class="btn-stop" :class="{narrow: isNarrowTab}" @click="stopSession(itm.content)">
              <wl-icon class="ico" name="stop-bold" size="16" color="#FC8B98" />
              <span v-if="!isMiniTab" class="lb">{{tabs.length === 1 ? `Close for all` : 'Close'}}</span>
            </div>

            <!--div v-if="!isMiniTab && itm.type === 'collaborating' && collaboratingSide === 'initiator'" class="btn-chat" :class="{narrow: isNarrowTab}" >
              <wl-icon class="ico" name="chat-bold" size="16" />
              <span v-if="!isMiniTab" class="lb">Send link</span>
            </div-->

            <!--div class="divider"> </div-->

            <!--div class="btn" >
              <wl-icon :name="'more-bold'" size="16" />
            </div-->
            
            <!--
            <div class="divider"></div>
            
            <div v-if="meetingType === 'webex'" class="btn" @click="popout(itm)">
              <wl-icon :name="'pop-out-bold'" size="16" />
            </div>

            <div v-if="meetingType === 'webex'" class="divider"></div>

            <div class="btn" v-tooltip="stageMaximized ? 'Back to normal' : 'Maximize'" @click="toggleMax">
              <wl-icon :name="stageMaximized ? 'minimize-bold' : 'maximize-bold'" size="16" />
            </div>
            -->
            
          </div>
        </div>
      </div>

      <div v-if="['miro', 'whiteboard'].indexOf(activeItem.content) === -1" ref="contentwrap" class="content" :class="[activeItem.content]">
        <div 
          ref="sharing_content" 
          class="img" 
          :class="[activeItem.content]" 
          :style="{
            width: pptW,
            height: pptH,
          }"
        ><!--Handtracking v-if="annotating" :dark="theme != 'light'" /--></div>
        <div v-if="annotating" class="annotation-tools">
          <div class="spacer" ></div>
          <div ref="btnsave" class="btn btnsave" v-tooltip="{placement: 'right', content: 'Save'}" @click="saveCanvas">
            <wl-icon name="save-bold" size="16" />
          </div>
        </div>
      </div>

      <div v-if="activeItem.content === 'whiteboard'" ref="content" class="content" :class="[activeItem.content]">
        <whiteboard />
      </div>

      <transition name="fade">
        <div v-if="activeItem.content === 'miro'" ref="content" class="content" :class="[activeItem.content, {disabled: pointerEventsDisabled}]">
          <miro />

          <!--div class="editmask" @click="hideMask" v-if="activeItem.content === 'miro' && collaboratingMaskVisible">
            <svg width="56" height="50" viewBox="0 0 56 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M50.8375 9.44143L48.0879 12.191L43.2367 7.34098L45.9874 4.59137C47.3243 3.25335 49.4995 3.25335 50.8375 4.59137C51.4855 5.2382 51.8416 6.09986 51.8416 7.0164C51.8416 7.93294 51.4855 8.79343 50.8375 9.44143ZM28.0417 32.2363L21.8443 33.5836L23.1916 27.3862L41.5854 8.99125L46.4355 13.8425L28.0417 32.2363ZM52.4886 2.94032C51.4004 1.85098 49.9526 1.25085 48.4126 1.25085C46.8726 1.25085 45.4248 1.85098 44.3367 2.94032L21.2983 25.9775C21.1395 26.1363 21.031 26.3359 20.9831 26.5554L19.1769 34.8626C19.0928 35.2503 19.2119 35.6554 19.4921 35.9356C19.7139 36.1575 20.0117 36.2777 20.3176 36.2777C20.4005 36.2777 20.4834 36.2696 20.5663 36.2509L28.8735 34.4458C29.0918 34.398 29.2926 34.2882 29.4514 34.1306L52.4886 11.0922C53.5779 10.0029 54.1769 8.55629 54.1769 7.01628C54.1769 5.47626 53.5779 4.02849 52.4886 2.94032Z" fill="white"/>
              <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="19" y="1" width="36" height="36">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M50.8375 9.44143L48.0879 12.191L43.2367 7.34098L45.9874 4.59137C47.3243 3.25335 49.4995 3.25335 50.8375 4.59137C51.4855 5.2382 51.8416 6.09986 51.8416 7.0164C51.8416 7.93294 51.4855 8.79343 50.8375 9.44143ZM28.0417 32.2363L21.8443 33.5836L23.1916 27.3862L41.5854 8.99125L46.4355 13.8425L28.0417 32.2363ZM52.4886 2.94032C51.4004 1.85098 49.9526 1.25085 48.4126 1.25085C46.8726 1.25085 45.4248 1.85098 44.3367 2.94032L21.2983 25.9775C21.1395 26.1363 21.031 26.3359 20.9831 26.5554L19.1769 34.8626C19.0928 35.2503 19.2119 35.6554 19.4921 35.9356C19.7139 36.1575 20.0117 36.2777 20.3176 36.2777C20.4005 36.2777 20.4834 36.2696 20.5663 36.2509L28.8735 34.4458C29.0918 34.398 29.2926 34.2882 29.4514 34.1306L52.4886 11.0922C53.5779 10.0029 54.1769 8.55629 54.1769 7.01628C54.1769 5.47626 53.5779 4.02849 52.4886 2.94032Z" fill="white"/>
              </mask>
              <g mask="url(#mask0)">
              </g>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.0118 34.9602C17.739 35.9444 17.2331 36.8414 16.8801 37.4672L16.8456 37.5283C16.6654 37.8471 16.5746 37.9838 16.477 38.0708C16.414 38.127 16.3105 38.1962 16.0302 38.2233C14.9033 38.3324 14.0661 37.6207 13.0896 36.7229L13.0311 36.669C12.6076 36.2791 12.1101 35.821 11.5839 35.5669C11.2894 35.4246 10.9478 35.325 10.5697 35.3452C10.1857 35.3657 9.82715 35.5064 9.49819 35.7441C9.07601 36.0491 8.7709 36.462 8.73239 36.9887C8.69685 37.4748 8.90388 37.895 9.11011 38.2033C9.32182 38.5197 9.60336 38.821 9.86542 39.0863C9.9786 39.2008 10.0849 39.3056 10.1873 39.4066C10.3434 39.5606 10.4905 39.7056 10.6391 39.8626C10.8771 40.1141 11.0437 40.3209 11.1393 40.4942C11.185 40.5769 11.2046 40.635 11.2123 40.6713C11.219 40.7032 11.2161 40.7155 11.2154 40.7183L11.2154 40.7184L11.2153 40.7185C11.2147 40.7213 11.2094 40.7435 11.1743 40.7867C11.1363 40.8334 11.0641 40.9032 10.9328 40.9889C10.7569 41.1035 10.5026 41.2289 10.145 41.3591C9.99277 41.4061 9.84751 41.4543 9.70918 41.5037C9.6382 41.5253 9.56426 41.5469 9.48724 41.5686L9.49174 41.5846C9.09689 41.7378 8.76466 41.9028 8.4931 42.0833C8.04075 42.3839 7.69013 42.7735 7.57365 43.2805C7.45763 43.7856 7.61246 44.2407 7.80844 44.5887C8.00269 44.9336 8.28033 45.2508 8.54337 45.524C8.70605 45.6929 8.89382 45.8752 9.06865 46.0449L9.06874 46.045C9.16786 46.1412 9.26282 46.2334 9.34668 46.3168C9.60247 46.5712 9.7982 46.7846 9.92593 46.972C10.0293 47.1237 10.0488 47.2018 10.0526 47.2245C10.0401 47.2456 10.0046 47.2902 9.91379 47.3571C9.78475 47.452 9.70141 47.4697 9.65133 47.4728C9.5954 47.4763 9.5107 47.4653 9.37763 47.4025C9.07282 47.2585 8.73157 46.958 8.2312 46.5059L8.17473 46.4548C7.28006 45.6456 5.95998 44.4516 4.10066 44.648C3.56733 44.7043 3.14162 44.875 2.79488 45.1895C2.48471 45.4708 2.28493 45.8316 2.12654 46.1176L2.12294 46.1241L2.08766 46.1879C1.77196 46.7594 1.39157 47.4481 0.368164 48.2538L1.30707 49.4464C2.57125 48.4511 3.06929 47.5498 3.41679 46.9208L3.45074 46.8595C3.62815 46.5391 3.71776 46.4016 3.81456 46.3138C3.87714 46.2571 3.98 46.187 4.26004 46.1574C5.38601 46.0385 6.22938 46.7428 7.21364 47.6321L7.27259 47.6854L7.2726 47.6854C7.69952 48.0717 8.20099 48.5253 8.72937 48.7749C9.02514 48.9146 9.36755 49.0112 9.74549 48.9877C10.1293 48.9639 10.4866 48.8201 10.8135 48.5795C11.233 48.2708 11.5345 47.8553 11.5684 47.3282C11.5997 46.8418 11.389 46.4235 11.1801 46.117C10.9656 45.8024 10.6814 45.5036 10.4171 45.2407C10.3029 45.1271 10.1958 45.0233 10.0925 44.9233L10.0924 44.9232C9.93493 44.7705 9.7866 44.6268 9.63665 44.4711C9.39648 44.2217 9.2281 44.0164 9.13097 43.8439C9.08459 43.7615 9.06441 43.7037 9.05644 43.6675C9.04943 43.6356 9.05227 43.6233 9.05292 43.6205L9.05295 43.6204L9.05297 43.6203C9.05361 43.6175 9.05869 43.5952 9.09339 43.5517C9.13101 43.5046 9.20254 43.4342 9.33313 43.3475C9.5194 43.2237 9.79461 43.0869 10.1887 42.9443C10.342 42.8971 10.488 42.8487 10.6267 42.7989C10.6744 42.7843 10.7233 42.7697 10.7736 42.7551L10.7708 42.7457C11.1617 42.5973 11.4914 42.4366 11.7618 42.2603C12.2167 41.9637 12.5707 41.5772 12.6916 41.0711C12.8121 40.5671 12.6612 40.1106 12.4683 39.761C12.277 39.4143 12.0022 39.0947 11.7415 38.8193C11.5803 38.649 11.3942 38.4651 11.2208 38.2938C11.1225 38.1967 11.0283 38.1037 10.9452 38.0195C10.6916 37.7629 10.4977 37.5478 10.3717 37.3593C10.2696 37.2067 10.2508 37.1284 10.2472 37.1056C10.2599 37.0847 10.2958 37.0404 10.3872 36.9743C10.517 36.8805 10.6005 36.8635 10.6506 36.8609C10.7066 36.8579 10.7912 36.8696 10.9237 36.9336C11.2272 37.0802 11.5658 37.3837 12.0623 37.8402L12.1183 37.8917C13.0058 38.7087 14.3155 39.9142 16.1764 39.7341C16.7102 39.6824 17.1374 39.5154 17.4869 39.2039C17.7995 38.9253 18.0024 38.5663 18.1633 38.2817L18.167 38.2753L18.2028 38.2117C18.5235 37.643 18.9098 36.9577 19.9402 36.1609L19.0118 34.9602ZM10.2411 37.1196C10.2406 37.1196 10.2413 37.1163 10.2448 37.1098C10.2434 37.1164 10.2417 37.1197 10.2411 37.1196ZM10.0585 47.2105C10.0591 47.2105 10.0584 47.2138 10.055 47.2204C10.0563 47.2137 10.058 47.2105 10.0585 47.2105Z" fill="white"/>
            </svg>
            <span >Open together opens this file for everyone in the meeting</span>
          </div-->

        </div>
      </transition>


    </div>
</template>

<script>

import _ from 'lodash';
//import Handtracking from '../shared/handtracking/handtracking.vue';
import html2canvas from 'html2canvas';

export default {
  components: { 
    //Handtracking
   },
  props:{
    meetingId: String,
    tabs: Array,
    pointerEventsDisabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      activeId: 0,
      activeItem: {},
      resizeObserver: null,
      isNarrowTab: false,
      isMiniTab: false,
      annotating: false,
      pptW: '',
      pptH: '',
    }
  },
  computed:{
    theme() {
      return this.$store.state.theme;
    },
    stageMaximized() {
      return this.$store.state.stageMaximized;
    },
    collaboratingSide() {
      return this.$store.state.collaboratingSide;
    },
    collaboratingMaskVisible() {
      return this.$store.state.collaboratingMaskVisible;
    },
    hudVisible() {
      return this.$store.state.hudVisible;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    spaceMsgList() {
      return this.$store.state.spaceMsgList;
    },
    spaceList() {
      return this.$store.state.spaceList;
    },
    activeSpaceId() {
      return this.$store.state.activeSpaceId;
    },
    meetingTitle() {
      return this.$store.state.meetingTitle;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    meetingType() {
      return this.$store.getters.meetingType(this.meetingId)
    },
  },
  mounted(){
    this.selectTab(0);
    //
    this.initResizeWatch();
  },
  beforeDestroy() {
    const elem = this.$refs.sharing_section;
    this.resizeObserver.unobserve(elem);
    this.resizeObserver = null;
    },
  watch: {
    tabs(newVal) {
      if (newVal.length > 0) {
        this.selectTab(newVal.length - 1);
      }
      requestAnimationFrame(() => {
        this.checkContentSize();
      })
    },

  },
  methods:{
    selectTab(idx) {
      this.activeId = idx;
      if (this.tabs.length > 0) {
        this.activeItem = this.tabs[this.activeId];
      }
    },

    toggleMax(){
      this.$emit('toggleMax')
    },
    hideMask() {
      this.$store.commit("collaboratingMaskVisible", false);
      if (this.collaboratingSide === 'initiator') {
        setTimeout(() => {
          this.showFteTip1();
        }, 500);
      }
    },

    showFteTip1() {
      this.$popper.show(
        {
          template: `
            <div class="fte-tip-sharing-apps">
              <div class="tt">
                Stop app session
              </div>
              <div class="des" >
                Click here to stop the app session
              </div>
              <div class="btn" @click="close">
                Ok
              </div>
            </div>
          `,
          props: ['parent'],
          methods: {
            close() {
              this.$popper.hideAll();
              requestAnimationFrame(() => {
                //this.parent.showFteTip2();
              });
            },
          }
        },
        {
          parent: this,
        }, // component props
        {
          reference: document.querySelector('.btn-stop'),
          closeTrigger: 'mousedown',
          arrowVisible: true,
          roundedCorner: true,
          frameless: false,
          borderRadius: '4px',
          appendToBody: true,
          theme: 'blue',
          options: {placement: 'top'},
        }, // popper props
        {
        } // popper eventlistener
      );
    },

    showFteTip2() {
      this.$popper.show(
        {
          template: `
            <div class="fte-tip-sharing-apps">
              <div class="tt">
                Share your view
              </div>
              <div class="des" >
                Quickly share your app view to others in the meeting
              </div>
              <div class="btn" @click="close">
                Ok
              </div>
            </div>
          `,
          props: ['parent'],
          methods: {
            close() {
              this.$popper.hideAll();
            },
          }
        },
        {
          parent: this,
        }, // component props
        {
          //reference: this.$refs.btnshare.$el,
          reference: this.$refs.btnmore,
          closeTrigger: 'mousedown',
          arrowVisible: true,
          roundedCorner: true,
          frameless: false,
          borderRadius: '4px',
          appendToBody: true,
          theme: 'blue',
          options: {placement: 'top'},
        }, // popper props
        {
        } // popper eventlistener
      );
    },

    popout(itm) {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      var meeting = optlist[idx]
      let lst = meeting.currentSharing.slice();
      for (let i = lst.length-1; i >=0; i--) {
        if (lst[i].content === itm.content) {
          lst[i].popped = true;
          break;
        }
      }

      optlist[idx].currentSharing = lst
      this.$store.commit('meetingOptionsList', optlist);

      //////

      let tpl = ``;
      let width = 376;
      let height = 256;
      let shiftX = _.random(5, 9) * 0.1;
      let shiftY = _.random(2, 5) * 0.1;

      tpl = `
        <div class="popout-sharing popout-sharing-${itm.content}">
          <div class="head">
            <div class="sec l">
              <md-avatar v-if="'${itm.type}' === 'sharing'" class="avatar" :src="$store.state.avatarPath+$store.getters.people('${itm.people}').avatar" name="${itm.people}" />
              <div v-if="${itm.icon === undefined} && '${itm.type}' === 'collaborating'" class="avatar ico--${itm.content}" ></div>
              <wl-icon v-if="${itm.icon !== undefined} && '${itm.type}' === 'collaborating'" class="avatar" :name="'${itm.icon}'" size="20" />
              <div class="title">
                ${itm.title}
              </div>
            </div>

            <div class="sec r">

              <div class="btn" v-if="'${itm.type}' === 'sharing'" >
                <wl-icon name="annotate-bold" size="16" />
              </div>
              <div class="btn" v-if="'${itm.type}' === 'sharing'" >
                <wl-icon name="remote-desktop-control-bold" size="16" />
              </div>


              <div class="btn-stop" v-if="'${itm.type}' === 'collaborating' && '${this.collaboratingSide}' === 'initiator'" @click="stopSession('${itm.content}')">
                <wl-icon class="ico" name="stop-bold" size="16" color="#FC8B98" />
                <span class="lb">Close ${itm.content}</span>
              </div>

              <div class="divider"></div>
              
              <div class="btn" @click="popin" >
                <wl-icon name="pop-in-bold" size="16" />
              </div>
              <div class="btn" @click="close" >
                <wl-icon name="cancel-bold" size="16" />
              </div>
            </div>

          </div>

          <div v-if="['miro', 'whiteboard'].indexOf('${itm.content}') === -1 " class="popcontent ${itm.content}" ></div>
          <miro v-if="'${itm.content}' === 'miro'" class="popcontent ${itm.content}"/>
          <whiteboard v-if="'${itm.content}' === 'whiteboard'" class="popcontent ${itm.content}"/>

        </div>
      `

      this.$modal.show(
        {
          template: tpl,
          props: ['parent'],
          data() {
            return {
            };
          },
          methods: {
            popin() {
              this.parent.popin(itm);
              this.$emit('close');
            },
            stopSession(name) {
              this.parent.stopSession(name);
              this.$emit('close');
            },
            close() {
             this.parent.closeApp(itm.content);
              this.$emit('close');
            },
          }
        },
        {
          parent: this,
        }, // component props
        {
          name: `box-dialog-${itm.content}`,
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: true,
          resizeEdges: ['br', 'b', 'r'],
          draggable: true,
          roundedCorner: true,
          overlayVisible: false,
          overlayTransparent: 0,
          theme: this.theme,
          width: width,
          height: height,
          shiftX: shiftX,
          shiftY: shiftY,
        }, // modal props
        {} // modal eventlistener
      );
    },

    popin(itm) {
      //this.$store.commit('collaboratingMaskVisible', false);

      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      var meeting = optlist[idx]

      //
      let lst = meeting.currentSharing.slice();
      for (let i = lst.length-1; i >=0; i--) {
        if (lst[i].content === itm.content) {
          lst[i].popped = false;
          break;
        }
      }

      if (meeting.videoLayout !== 'stage-sharing') {
        optlist[idx].videoLayout = 'stage-sharing'
      }

      optlist[idx].currentSharing = lst
      this.$store.commit('meetingOptionsList', optlist);
    },

    stopSession(name) {
      this.closeApp(name);
      if (name === 'miro') {
        //this.$store.commit('defaultOpenAppPanel', {page: 'miro-view', name: 'Miro'});
      } else if (name === 'whiteboard') {
        //this.$store.commit('defaultOpenAppPanel', {page: 'whiteboard-view', name: 'Whiteboard'});
        //this.$store.commit('appsPanelVisible', true);
      } else {
        //this.$store.commit('defaultOpenAppPanel', {page: 'apps'});
      }

    },

    closeApp(name) {
      if (this.collaboratingSide === 'initiator') {
        this.$store.commit('collaboratingSide', '');
      }
      
      //

      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      var meeting = optlist[idx]

      let lst = meeting.currentSharing.slice();
      for (let i = lst.length-1; i >=0; i--) {
        if (lst[i].content === name) {
          lst.splice(i, 1);
          break;
        }
      }

      optlist[idx].videoLayout = 'grid'
      optlist[idx].currentSharing = lst
      this.$store.commit('meetingOptionsList', optlist);

    },

    initResizeWatch() {
      // watch resize
      const elem = this.$refs.sharing_section;
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if ((entry.contentBoxSize || entry.contentRect)) {
            this.checkContentSize();
          }
        }
      });
      this.resizeObserver.observe(elem);
      this.checkContentSize();
    },

    checkContentSize() {
      if(this.tabs.length > 0) {
        const rect = document.querySelector(`.tab_${this.tabs[0].type}_0`).getBoundingClientRect();
        this.isNarrowTab = rect.width < 450
        this.isMiniTab = rect.width < 270
      }

      if (this.$refs.contentwrap) {
        const rect = this.$refs.contentwrap.getBoundingClientRect()
        if (rect.width / rect.height > 16 / 9) {
          this.pptH = `100%`
          this.pptW = ``
        } else {
          this.pptH = ``
          this.pptW = `100%`
        }
      }

    },


    saveCanvas() {
      // create screen snapshot
      const content = this.$refs.sharing_content;
      //const rect = content.getBoundingClientRect();
      const filename =  `Notes from ${this.meetingTitle} meeting`;
      let canvasList = this.$store.state.savedCanvasFromHandtracking

      const opt = {
        scale: 1,
      }
      html2canvas(content, opt).then(canvas => {
        let key = `cv${_.random(1, 999)}`
        canvasList[key] = canvas

        // save to whiteboard
        var spaces = _.cloneDeep(this.spaceList);

        for(let i = 0; i<spaces.length; i++) {
          for(let j = 0; j<spaces[i].length; j++) {
            let sp = spaces[i][j]
            if (sp.name.replace(/ /g, '_') == this.activeSpaceId) {
              if (!spaces[i][j].content) {
                spaces[i][j].content = {}
              }
              if (!spaces[i][j].content.whiteboards) {
                spaces[i][j].content.whiteboards = []
              }
              spaces[i][j].content.whiteboards.unshift({
                  canvaskey: key,
                  name: filename,
                  user: 'You',
                  date: '2 minutes ago',
                })
              this.$store.commit('spaceList', spaces);
              break;
            }
          }
        }

        // save to space messages
        var msgs = _.cloneDeep(this.spaceMsgList);
        var lst = msgs[this.activeSpaceId] || []
        lst.push({
          type: 'msg',
          name: 'You',
          time: '2 minutes ago',
          msg: filename,
          attachment: {
            type: 'canvas',
            canvaskey: key,
            title: null,
          },
        })
        msgs[this.activeSpaceId] = lst
        this.$store.commit('spaceMsgList', msgs);

        this.$store.commit('savedCanvasFromHandtracking', canvasList);


        
        this.$popper.show(
            {
              template: `<div class="tooltip" data-popper-placement="right" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">Saved to the space</div></div>`,
              props: [],
              methods: {
              }
            },
            {
            }, // component props
            {
              reference: this.$refs.btnsave,
              closeTrigger: 'mousedown',
              arrowVisible: false,
              frameless: true,
              appendToBody: true,
              theme: `dark`,
              options: {placement: 'right'},
            }, // popper props
            {
              opened: () => {
                setTimeout(() => {
                  this.$popper.hideAll();
                }, 3000)
              },
              closed: () => {},
            } // popper eventlistener
          );

      });
    },

    
  }
}
</script>


<style lang="scss">
.sharing-section {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tabs {
    display: flex;
    overflow: hidden;

    &.fullscreen {
      height: 0;
      transition: all 0.2s ease-out;
    }

    .tab {
      position: relative;
      width: 100px;
      height: 36px;
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      padding-bottom: 1px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;

      &.active {
        background-color: rgba($color: #FFF, $alpha: 0.07);
      }

      .sec {
        display: flex;
        align-items: center;

        &.l {
          margin-left: 8px;
          justify-content: flex-start;
          flex-grow: 1;
          flex-shrink: 1;
          overflow:hidden;
          width: calc(50% - 50px);
        }
        &.m {
          @include flex;
          flex-grow: 1;
          flex-shrink: 0;
          overflow:hidden;
          width: 100px;
        }
        &.r {
          margin-right: 4px;
          flex-grow: 1;
          flex-shrink: 0;
          justify-content: flex-end;
          width: calc(50% - 50px);
        }

        .avatar {
          width: 20px;
          height: 20px;
          margin-right: 4px;
          flex-shrink: 0;
          overflow: hidden;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }

        .title {
          font-size: 14px;
          font-weight: 600;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          margin-right: 8px;
        }

        .btn {
          flex-shrink: 0;
          font-size: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: auto;
          cursor: default;

          &.active {

          }
        }

        .divider {
          height: 12px;
          border-right: 1px solid rgba($color: #FFFFFF, $alpha: .3);
          margin: 0 4px;
        }

        .btn-stop {
          @include flex;
          height: 28px;
          margin-right: 12px;
          border: 1px solid #FF9580;
          color: #FF9580;
          border-radius: 14px;
          padding: 0 8px;
          box-sizing: border-box;

          &.narrow {
            width: 22px;
            padding: 0;
            .lb {
              display: none;
            }
          }

          .lb {
            margin-left: 4px;
            font-size: 14px;
          }
        }

        .btn-chat {
          @include flex;
          height: 22px;
          margin-right: 12px;

          &.narrow {
            width: 22px;
            padding: 0;
            .lb {
              display: none;
            }
          }

          .lb {
            margin-left: 4px;
            font-size: 14px;
          }
        }

      }
    }
  }

  .content {
    flex-grow: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    &.disabled {
      pointer-events: none;
    }

    .img {
      aspect-ratio: 16 / 9;

      border-radius: 8px;
      overflow: hidden;

      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;

      &.tl {
        background-position: 0 0;
        background-size: cover;
      }

      &.ppt {
        background-image: url(~@/assets/img/sharing_doc.png);
      }
      &.browser1 {
        background-image: url(~@/assets/img/temp_browser1.png);
      }
      &.browser2 {
        background-image: url(~@/assets/img/temp_browser2.png);
      }
      &.miro {
        background-image: url(~@/assets/img/temp_miro.png);
      }
      &.mural {
        background-image: url(~@/assets/img/temp_mural.svg);
      }
    }

    .editmask {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba($color: #333, $alpha: 0.8);
      color: white;
      font-size: 14px;

      span {
        font-weight: bold;
        margin-top: 10px;
        text-align: center;
      }
    }
  }


  /* theme ----- dark/hybrid */


}

.annotation-tools {
    @include flex(column);
    position: absolute;
    width: 52px;
    height: 300px;
    left: 16px;
    top: calc((100% - 300px)/2);
    background-image: url(~@/assets/img/annotation-tools.svg);
    background-position: 0 0;
    background-repeat: no-repeat;
    padding-bottom: 16px;

    .spacer {
      flex-grow: 1
    }

    .btn {
      @include flex;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      flex-shrink: 0;

      &:hover {
        background-color: rgba($color: #fff, $alpha: .12);
      }
      &:active {
        background-color: rgba($color: #fff, $alpha: .2);
      }
    }
  }

.fte-tip-sharing-apps {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding: 15px;
  max-width: 310px;
  user-select: none;

  .tt {
    font-weight: 600;
  }
  .btn {
    @include flex;
    width: 50px;
    padding: 0 15px;
    height: 24px;
    
    border: 1px solid white;
    border-radius: 12px;
    margin-top: 10px;
    cursor: pointer;
  }
}

.popout-sharing {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  user-select: none;

  .head {
    position: relative;
    width: 100%;
    height: 40px;
    flex-grow: 0;
    display: flex;
    justify-content: space-between;

    .sec {
      display: flex;
      align-items: center;

      &.l {
        margin-left: 8px;
        justify-content: flex-start;
        flex-grow: 1;
        flex-shrink: 1;
      }
      &.r {
        margin-right: 4px;
        flex-grow: 1;
        flex-shrink: 1;
        justify-content: flex-end;
      }

      .avatar {
        width: 20px;
        height: 20px;
        margin-right: 4px;
        flex-shrink: 0;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }

      .title {
        font-size: 14px;
        font-weight: 600;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        margin-right: 8px;
      }

      .btn {
        flex-shrink: 0;
        font-size: 12px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: auto;
        cursor: default;
      }

      .divider {
        height: 12px;
        border-right: 1px solid rgba($color: #FFFFFF, $alpha: .3);
        margin: 0 4px;
      }

      .btn-stop {
        @include flex;
        height: 22px;
        margin-right: 12px;
        border: 1px solid #FF9580;
        color: #FF9580;
        border-radius: 11px;
        padding: 0 8px;

        .lb {
          margin-left: 4px;
          font-size: 14px;
        }
      }

      .btn-chat {
        @include flex;
        height: 22px;
        margin-right: 12px;

        .lb {
          margin-left: 4px;
          font-size: 14px;
        }
      }

    }
  }

  .popcontent {
    flex-grow: 1;
    position: relative;
    display: flex;

    width: calc(100% - 16px);
    margin: 0 8px 8px;
    flex-grow: 1;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 8px;
    overflow: hidden;
    transform: rotate(0deg);

    &.tl {
      background-position: 0 0;
      background-size: cover;
    }

    &.ppt {
      background-image: url(~@/assets/img/sharing_doc.png);
    }
    &.browser1 {
      background-image: url(~@/assets/img/temp_browser1.png);
    }
    &.browser2 {
      background-image: url(~@/assets/img/temp_browser2.png);
    }
    &.miro {
      background-image: url(~@/assets/img/temp_miro.png);
    }
    &.mural {
      background-image: url(~@/assets/img/temp_mural.svg);
    }

  }
}


.popout-stop-session {
  position: relative;
  width: 400px;
  height: 237px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: cover;

}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.0s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
