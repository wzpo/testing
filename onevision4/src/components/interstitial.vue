<template>
	<div
    id="interstitial"
    class='con'
    :class="[os, theme]"
    :style="{
      background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['app'][0]} 0%, ${themeColorList[theme][themeColor]['app'][1]} 100%)`,
    }"
  >
    <topbar class="topbar" :buttons="['minimize', 'close']" type="simple" title="Get ready to join" @close="close" @mousedown="topbarMousedown">
      <div slot="right" class="interstitial-header-r">
        <!--div class="interstitial-header-r-name interstitial-header-r-btn" ref="username" @click="showSignDropdown">{{me.name}}</div-->
        <!--div class="interstitial-header-r-divd">|</div-->
        <div v-if="!devicePaired" class="interstitial-header-r-device interstitial-header-r-btn" :class="{active: deviceDropdownVisible, prd: devicePaired}" ref="devicebtn" @click="showDeviceDropdown">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 2.50018H3.5C2.8372 2.50096 2.20176 2.7646 1.73309 3.23328C1.26442 3.70195 1.00078 4.33738 1 5.00018V11.0002C1.00078 11.663 1.26442 12.2984 1.73309 12.7671C2.20176 13.2358 2.8372 13.4994 3.5 13.5002H12.5C13.1628 13.4994 13.7982 13.2358 14.2669 12.7671C14.7356 12.2984 14.9992 11.663 15 11.0002V5.00018C14.9992 4.33738 14.7356 3.70195 14.2669 3.23328C13.7982 2.7646 13.1628 2.50096 12.5 2.50018ZM14 11.0002C13.9996 11.3979 13.8414 11.7792 13.5602 12.0604C13.279 12.3416 12.8977 12.4997 12.5 12.5002H3.5C3.10231 12.4997 2.72103 12.3416 2.43982 12.0604C2.15861 11.7792 2.00043 11.3979 2 11.0002V5.00018C2.00043 4.60249 2.15861 4.22121 2.43982 3.94C2.72103 3.65879 3.10231 3.50062 3.5 3.50018H12.5C12.8977 3.50062 13.279 3.65879 13.5602 3.94C13.8414 4.22121 13.9996 4.60249 14 5.00018V11.0002Z" fill="white" fill-opacity="0.95"/>
            <path d="M8 7.30878C7.60585 7.30769 7.2154 7.38481 6.85127 7.53568C6.48713 7.68655 6.15655 7.90816 5.87866 8.18768C5.83224 8.23411 5.79541 8.28922 5.77029 8.34988C5.74516 8.41053 5.73223 8.47554 5.73223 8.5412C5.73223 8.60685 5.74516 8.67186 5.77029 8.73252C5.79541 8.79318 5.83224 8.84829 5.87866 8.89471C5.92508 8.94114 5.9802 8.97796 6.04085 9.00309C6.10151 9.02821 6.16652 9.04114 6.23218 9.04114C6.29783 9.04114 6.36284 9.02821 6.4235 9.00309C6.48415 8.97796 6.53927 8.94114 6.58569 8.89471C6.96665 8.53085 7.47319 8.32782 8 8.32782C8.52681 8.32782 9.03335 8.53085 9.41431 8.89471C9.50807 8.98847 9.63523 9.04114 9.76782 9.04114C9.90042 9.04114 10.0276 8.98847 10.1213 8.89471C10.2151 8.80095 10.2678 8.67379 10.2678 8.5412C10.2678 8.4086 10.2151 8.28144 10.1213 8.18768C9.84345 7.90816 9.51287 7.68655 9.14873 7.53568C8.7846 7.38481 8.39415 7.30769 8 7.30878Z" fill="white" fill-opacity="0.95"/>
            <path d="M7.99996 10.7052C8.41417 10.7052 8.74995 10.3694 8.74995 9.9552C8.74995 9.54099 8.41417 9.2052 7.99996 9.2052C7.58574 9.2052 7.24996 9.54099 7.24996 9.9552C7.24996 10.3694 7.58574 10.7052 7.99996 10.7052Z" fill="white" fill-opacity="0.95"/>
            <path d="M8 5.30682C7.34298 5.30526 6.69217 5.43405 6.08527 5.68574C5.47837 5.93744 4.92743 6.30704 4.46436 6.77313C4.41793 6.81956 4.38111 6.87467 4.35598 6.93533C4.33086 6.99598 4.31792 7.06099 4.31792 7.12665C4.31792 7.1923 4.33086 7.25731 4.35598 7.31797C4.38111 7.37863 4.41793 7.43374 4.46436 7.48016C4.51078 7.52659 4.56589 7.56341 4.62655 7.58854C4.68721 7.61366 4.75222 7.62659 4.81787 7.62659C4.88352 7.62659 4.94854 7.61366 5.00919 7.58854C5.06985 7.56341 5.12496 7.52659 5.17139 7.48016C5.54255 7.10822 5.98343 6.81313 6.46878 6.61179C6.95413 6.41045 7.47443 6.30682 7.99989 6.30682C8.52534 6.30682 9.04564 6.41045 9.53099 6.61179C10.0163 6.81313 10.4572 7.10822 10.8284 7.48016C10.9223 7.57326 11.0492 7.62536 11.1815 7.62508C11.3137 7.62479 11.4404 7.57214 11.5339 7.47864C11.6274 7.38515 11.68 7.25842 11.6803 7.1262C11.6806 6.99398 11.6285 6.86703 11.5354 6.77313C11.0724 6.30702 10.5215 5.93742 9.91463 5.68572C9.30777 5.43402 8.65699 5.30523 8 5.30682Z" fill="white" fill-opacity="0.95"/>
          </svg>
          <span class="interstitial-header-r-device-lb">{{devicePaired ? devicePairedName : "Connect to a device"}}</span>
        </div>
      </div>
    </topbar>
    <div class='top' ref="top_area">
      <div class="mid">
        <div class='title'>{{ meetingTitle }}</div>
        <div class='time'>10:00 AM - 11:00 AM</div>
      </div>
      <div v-if="peopleList.length > 2" class="side" ref="plist_bubble_chain" @mouseover="showPlist">
        <md-avatar 
          :title="'+ 4'"
          :size="32"
          class="ava plus"
        />
        <md-avatar 
          v-for="(p, idx) in inMeetingPeople"
          :key="`p${idx}`"
          :title="p.name"
          :src="p.avatar ? avatarPath + p.avatar : ''" 
          :size="32"
          class="ava" 
        />
      </div>
    </div>

    <div 
      class='cam_area'
      ref="cam_area"
    >
      <video id="camera_interstital" :class="{mirror: selfvideoMirror}" autoplay="true" v-show="interstitialCamOn && !devicePaired" ></video>
      <div class="paired"
        v-if='devicePaired'
        >
          <div class="tit" ref="devicepaired" @click="showPairedDropdown">
            <span class="lb">{{devicePairedName}}</span>
            <wl-icon
              :name="pairedDropdownVisible ? 'arrow-up-bold' : 'arrow-down-bold'" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
              class="ico"
            />
          </div>
          <div class='thumb' :class="devicePairedImage"></div>
          <!--
          <div class='vol'>
            <div class="ico">
              <wl-icon
                name="speaker-turn-down-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                class="ico"
              />
            </div>
            <md-slider
              :min="0"
              :max="100"
              :tick="1"
              :value="50"
              :step="1"
              :showTicks="false"
              :showSelection="true"
              class="vol-slider"
            />
            <div class="ico">
              <wl-icon
                name="speaker-turn-up-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                class="ico"
              />
            </div>
          </div>
          -->

          <svg width="280" height="48" viewBox="0 0 280 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="280" height="48" rx="24" fill="white" fill-opacity="0.07"/>
            <path d="M32.125 23.5309H27.125C27.0006 23.5309 26.8814 23.5803 26.7935 23.6682C26.7056 23.7561 26.6562 23.8753 26.6562 23.9996C26.6562 24.1239 26.7056 24.2432 26.7935 24.3311C26.8814 24.419 27.0006 24.4684 27.125 24.4684H32.125C32.2493 24.4684 32.3685 24.419 32.4564 24.3311C32.5443 24.2432 32.5937 24.1239 32.5937 23.9996C32.5937 23.8753 32.5443 23.7561 32.4564 23.6682C32.3685 23.5803 32.2493 23.5309 32.125 23.5309Z" fill="white" fill-opacity="0.95"/>
            <path d="M24.6121 16.0913C24.471 16.0315 24.3153 16.015 24.1648 16.0439C24.0143 16.0728 23.8757 16.1458 23.7668 16.2536L19.4364 20.4059H17.125C16.6693 20.4063 16.2324 20.5876 15.9101 20.9098C15.5879 21.232 15.4067 21.6689 15.4062 22.1246V25.8746C15.4067 26.3303 15.5879 26.7672 15.9101 27.0895C16.2324 27.4117 16.6693 27.5929 17.125 27.5934H19.4364L23.7601 31.7389C23.8693 31.8482 24.0085 31.9227 24.1601 31.9529C24.3117 31.9831 24.4688 31.9677 24.6116 31.9085C24.7544 31.8494 24.8764 31.7492 24.9622 31.6207C25.0481 31.4922 25.0938 31.3411 25.0937 31.1865V16.8127C25.094 16.6583 25.0483 16.5073 24.9626 16.3788C24.8769 16.2504 24.7549 16.1503 24.6121 16.0913ZM24.1562 30.8203L19.9497 26.7865C19.8623 26.7028 19.746 26.656 19.625 26.6559H17.125C16.9178 26.6557 16.7192 26.5733 16.5727 26.4268C16.4263 26.2804 16.3439 26.0818 16.3437 25.8746V22.1246C16.3439 21.9175 16.4263 21.7189 16.5727 21.5724C16.7192 21.4259 16.9178 21.3436 17.125 21.3434H19.625C19.746 21.3432 19.8623 21.2965 19.9497 21.2127L24.1562 17.1789V30.8203Z" fill="white" fill-opacity="0.95"/>
            <path d="M264.124 23.531H262.094V21.4998C262.094 21.3755 262.045 21.2562 261.957 21.1683C261.869 21.0804 261.75 21.031 261.625 21.031C261.501 21.031 261.382 21.0804 261.294 21.1683C261.206 21.2562 261.157 21.3755 261.157 21.4998V23.531H259.124C259 23.531 258.88 23.5804 258.793 23.6683C258.705 23.7562 258.655 23.8755 258.655 23.9998C258.655 24.1241 258.705 24.2433 258.793 24.3312C258.88 24.4191 259 24.4685 259.124 24.4685H261.157V26.4998C261.157 26.6241 261.206 26.7433 261.294 26.8312C261.382 26.9191 261.501 26.9685 261.625 26.9685C261.75 26.9685 261.869 26.9191 261.957 26.8312C262.045 26.7433 262.094 26.6241 262.094 26.4998V24.4685H264.124C264.248 24.4685 264.368 24.4191 264.456 24.3312C264.543 24.2433 264.593 24.1241 264.593 23.9998C264.593 23.8755 264.543 23.7562 264.456 23.6683C264.368 23.5804 264.248 23.531 264.124 23.531Z" fill="white" fill-opacity="0.95"/>
            <path d="M256.612 16.0915C256.471 16.0317 256.315 16.0152 256.165 16.0442C256.014 16.0731 255.876 16.146 255.767 16.2538L251.437 20.406H249.125C248.67 20.4065 248.233 20.5877 247.91 20.91C247.588 21.2322 247.407 21.6691 247.407 22.1248V25.8748C247.407 26.3305 247.588 26.7674 247.91 27.0896C248.233 27.4118 248.67 27.5931 249.125 27.5935H251.437L255.76 31.7384C255.869 31.8479 256.008 31.9225 256.16 31.9528C256.311 31.9831 256.469 31.9677 256.611 31.9087C256.754 31.8496 256.876 31.7494 256.962 31.6209C257.048 31.4924 257.094 31.3413 257.094 31.1867V16.8129C257.094 16.6584 257.049 16.5073 256.963 16.3788C256.877 16.2503 256.755 16.1503 256.612 16.0915ZM256.157 30.8205L251.95 26.7866C251.863 26.7029 251.746 26.6561 251.625 26.656H249.125C248.918 26.6558 248.72 26.5735 248.573 26.427C248.427 26.2805 248.344 26.0819 248.344 25.8748V22.1248C248.344 21.9176 248.427 21.719 248.573 21.5726C248.72 21.4261 248.918 21.3437 249.125 21.3435H251.625C251.746 21.3434 251.863 21.2966 251.95 21.2129L256.157 17.1791L256.157 30.8205Z" fill="white" fill-opacity="0.95"/>
            <rect x="48" y="23" width="184" height="2" rx="1" fill="white" fill-opacity="0.2"/>
            <rect x="48" y="23" width="92" height="2" rx="1" fill="#64B4FA"/>
            <g filter="url(#filter0_dd_3041_173235)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M140 32C144.418 32 148 28.4183 148 24C148 19.5817 144.418 16 140 16C135.582 16 132 19.5817 132 24C132 28.4183 135.582 32 140 32Z" fill="black"/>
            <path d="M147.5 24C147.5 28.1421 144.142 31.5 140 31.5C135.858 31.5 132.5 28.1421 132.5 24C132.5 19.8579 135.858 16.5 140 16.5C144.142 16.5 147.5 19.8579 147.5 24Z" stroke="white" stroke-opacity="0.4"/>
            </g>
            <defs>
            <filter id="filter0_dd_3041_173235" x="128" y="14" width="24" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3041_173235"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_3041_173235" result="effect2_dropShadow_3041_173235"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3041_173235" result="shape"/>
            </filter>
            </defs>
          </svg>

          <md-button class="btn md-button-outline-red btn-disconnect" aria-label="x" :size="32" @click="disconnectDevice">Disconnect</md-button>
          
      </div>
      <md-avatar id="avatar_interstital" style="width:124px; height:124px;" :title="me.name" :src="avatarPath + me.avatar" v-if="!devicePaired && !interstitialCamOn" />
      <div v-if="sliRole == 'sli'" class="sli-tip" :class="{ontop: interstitialCamOn}">
        {{ !interstitialCamOn ? `You're an American Sign Language interpreter for this meeting. Please turn on your video to continue.` : `You're an American Sign Language interpreter for this meeting` }}
      </div>

      <div class='videotop' v-if="!devicePaired && interstitialCamOn">

        <span class="previewlb">Preview</span>
        
      </div>


    </div>

    

    <div class="controls" ref="controls">

      <div
        v-if="audioType !== 'none'" 
        class="btn btn_splitted ico-with-lb btn_mute"
        @click="toggleMute"
        :class="{
          hover_splited: hoverSplitted,
          active: ctrlMenuAudioVisible,
        }"
      >
        <span class="lft" :style="{marginRight: devicePaired ? '10px' : '0'}" v-tooltip="!devicePaired ? (muted ? 'Unmute my microphone' : 'Mute my microphone') : (muted ? 'Unmute device' : 'Mute device')">
          <div class="ico ico_audio">

            <svg v-show="!muted" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask_audio_wave" mask-type="alpha" maskUnits="userSpaceOnUse" x="7" y="5" width="6" height="9">
                <path d="M7 5H13V9.90909C13 12.6204 11.6568 14 10 14C8.34315 14 7 12.6204 7 9.90909V5Z" fill="#FF3D67"/>
              </mask>
              <g mask="url(#mask_audio_wave)" y="6" >
                <rect id="aduioIconRectBackground1" x="7" y="6" width="6" height="1" fill="#3CC29A"/>
                <rect id="aduioIconRectBackground2" x="7" y="8" width="6" height="9" fill="#3CC29A"/>
              </g>
              <path :fill="theme === 'light' ? '#121212' : '#FFFFFF'" d="M15.0015 17.4997H13.7646C13.0271 17.518 12.308 17.2681 11.7407 16.7964C11.1734 16.3248 10.7964 15.6634 10.6798 14.9349C11.5411 14.7754 12.3195 14.3196 12.8802 13.6466C13.4409 12.9736 13.7486 12.1257 13.7499 11.2498V4.99976C13.7499 4.00519 13.3549 3.05137 12.6516 2.34811C11.9483 1.64484 10.9945 1.24976 9.99994 1.24976C9.00538 1.24976 8.05155 1.64484 7.34829 2.34811C6.64503 3.05137 6.24994 4.00519 6.24994 4.99976V11.2498C6.25148 12.1424 6.57116 13.0052 7.15158 13.6833C7.732 14.3614 8.53515 14.8104 9.41681 14.9497C9.53455 15.9163 9.97516 16.8148 10.6673 17.4998H5.00147C4.8357 17.4998 4.67673 17.5656 4.55952 17.6828C4.44231 17.8 4.37646 17.959 4.37646 18.1248C4.37646 18.2905 4.44231 18.4495 4.55952 18.5667C4.67673 18.6839 4.8357 18.7498 5.00147 18.7498H15.0015C15.1672 18.7498 15.3262 18.6839 15.4434 18.5667C15.5606 18.4495 15.6265 18.2905 15.6265 18.1248C15.6265 17.959 15.5606 17.8 15.4434 17.6828C15.3262 17.5656 15.1672 17.4997 15.0015 17.4997ZM7.49994 11.2497V4.99974C7.49994 4.3367 7.76333 3.70081 8.23217 3.23197C8.70101 2.76313 9.3369 2.49974 9.99994 2.49974C10.663 2.49974 11.2989 2.76313 11.7677 3.23197C12.2365 3.70081 12.4999 4.3367 12.4999 4.99974V11.2497C12.4999 11.9128 12.2365 12.5487 11.7677 13.0175C11.2989 13.4863 10.663 13.7497 9.99994 13.7497C9.3369 13.7497 8.70101 13.4863 8.23217 13.0175C7.76333 12.5487 7.49994 11.9128 7.49994 11.2497Z" fill-opacity="0.95"/>
            </svg>

            <svg v-if="muted" class="redsvg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0015 17.5002H13.7643C13.0268 17.5184 12.3077 17.2685 11.7405 16.7969C11.1733 16.3252 10.7964 15.6638 10.6797 14.9354C11.0918 14.8582 11.4878 14.7122 11.8512 14.5033L10.9182 13.5702C10.5396 13.7226 10.1293 13.7796 9.72354 13.7361C9.31773 13.6925 8.92886 13.5499 8.59116 13.3207C8.25346 13.0915 7.9773 12.7828 7.78701 12.4217C7.59672 12.0607 7.49813 11.6584 7.49993 11.2502V10.1518L6.24993 8.90168V11.2502C6.25147 12.1428 6.57115 13.0056 7.15157 13.6837C7.73199 14.3619 8.53514 14.8109 9.41681 14.9501C9.53454 15.9167 9.97514 16.8153 10.6672 17.5002H5.00146C4.83569 17.5002 4.67672 17.566 4.55951 17.6833C4.4423 17.8005 4.37645 17.9594 4.37645 18.1252C4.37645 18.291 4.4423 18.4499 4.55951 18.5671C4.67672 18.6844 4.83569 18.7502 5.00146 18.7502H15.0015C15.1672 18.7502 15.3262 18.6844 15.4434 18.5671C15.5606 18.4499 15.6265 18.291 15.6265 18.1252C15.6265 17.9594 15.5606 17.8005 15.4434 17.6833C15.3262 17.566 15.1672 17.5002 15.0015 17.5002Z" />
              <path d="M17.9421 17.0583L13.491 12.6073C13.6621 12.1753 13.75 11.7149 13.7502 11.2502V5.0002C13.749 4.00643 13.3533 3.05381 12.6501 2.35157C11.947 1.64932 10.9938 1.25488 10.0001 1.25488C9.00632 1.25488 8.05319 1.64932 7.35003 2.35157C6.64688 3.05381 6.25121 4.00643 6.24993 5.0002V5.36634L2.94184 2.0583C2.82464 1.9411 2.66569 1.87526 2.49995 1.87526C2.3342 1.87526 2.17524 1.9411 2.05804 2.05829C1.94084 2.17549 1.875 2.33445 1.875 2.50019C1.875 2.66594 1.94084 2.82489 2.05804 2.94209L17.0583 17.9421C17.1164 18.0001 17.1853 18.0462 17.2611 18.0776C17.3369 18.109 17.4182 18.1251 17.5002 18.1251C17.5823 18.1251 17.6636 18.109 17.7394 18.0776C17.8152 18.0462 17.8841 18.0001 17.9421 17.9421C18.0002 17.8841 18.0462 17.8152 18.0776 17.7393C18.109 17.6635 18.1252 17.5823 18.1252 17.5002C18.1252 17.4181 18.109 17.3369 18.0776 17.261C18.0462 17.1852 18.0002 17.1163 17.9421 17.0583ZM12.5003 11.2502C12.498 11.3627 12.4878 11.4749 12.4698 11.586L7.49995 6.61632V5.0002C7.501 4.3378 7.76487 3.70289 8.23362 3.23488C8.70238 2.76686 9.3377 2.50399 10.0001 2.50399C10.6625 2.50399 11.2978 2.76686 11.7666 3.23488C12.2353 3.70289 12.4992 4.3378 12.5003 5.0002V11.2502Z" />
            </svg>

          </div>
          <span class="lb" >{{muted ? 'Unmute' : 'Mute'}}</span>
        </span>

        <div 
          class="splitted btn_audio2" 
          ref="btn_audio2"
          :class="{active: ctrlMenuAudioVisible}"
          v-if="!devicePaired" 
          @click="showAudioVideoSettings($event, 'audio', 'btn_audio2')" 
          @mouseenter="_ => hoverSplitted = true"
          @mouseleave="_ => hoverSplitted = false"
        >
          <wl-icon
              name="arrow-down-filled" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="12"
              class="arr"
            />
        </div>
      </div>


      <div
        v-if="audioType === 'none'" 
        ref="btn_audio_none"
        class="btn ico-with-lb"
        @click="showAudioVideoSettings($event, 'audio', 'btn_audio_none', true)" 
      >
        <div class="ico ico_audio">
          <wl-icon name="join-audio-bold" size="20" />
        </div>
        <span class="lb" >Audio options</span>
      </div>


      <div
        class="btn btn_splitted ico-with-lb btn_video"
        @click="toggleVideo"
        :class="{
          hover_splited: hoverSplitted,
          active: ctrlMenuVideoVisible,
        }"
        v-show="!devicePaired"
      >
        <span class="lft" v-tooltip="!interstitialCamOn ? 'Start my video' : 'Stop my video'">

          <div class="ico">
            <svg v-if="interstitialCamOn" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :fill="theme === 'light' ? '#121212' : '#FFFFFF'" d="M5.62413 8.74984C6.31448 8.74984 6.87413 8.1902 6.87413 7.49984C6.87413 6.80949 6.31448 6.24984 5.62413 6.24984C4.93377 6.24984 4.37413 6.80949 4.37413 7.49984C4.37413 8.1902 4.93377 8.74984 5.62413 8.74984Z" fill-opacity="0.95"/>
              <path :fill="theme === 'light' ? '#121212' : '#FFFFFF'" d="M18.1555 5.81116C17.9746 5.69835 17.7678 5.63403 17.5548 5.62441C17.3419 5.61479 17.13 5.66019 16.9397 5.75623C16.9207 5.76584 16.9021 5.77644 16.8842 5.78796L15 6.98563V6.25C14.999 5.4215 14.6695 4.62721 14.0836 4.04137C13.4978 3.45553 12.7035 3.12597 11.875 3.125H4.375C3.5465 3.12597 2.75221 3.45553 2.16637 4.04137C1.58053 4.62721 1.25097 5.4215 1.25 6.25V13.75C1.25097 14.5785 1.58053 15.3728 2.16637 15.9586C2.75221 16.5445 3.5465 16.874 4.375 16.875H11.875C12.7035 16.874 13.4978 16.5445 14.0836 15.9586C14.6695 15.3728 14.999 14.5785 15 13.75V13.0131L16.8842 14.2108C16.9018 14.2223 16.9201 14.2327 16.9391 14.2419C17.1296 14.3374 17.3414 14.3826 17.5543 14.3731C17.7672 14.3636 17.9741 14.2999 18.1554 14.1879C18.3367 14.0759 18.4864 13.9194 18.5901 13.7332C18.6939 13.5471 18.7483 13.3375 18.7482 13.1244V6.87436C18.7489 6.66118 18.6948 6.45139 18.591 6.26519C18.4872 6.07898 18.3372 5.92262 18.1555 5.81116ZM13.75 13.75C13.7495 14.2471 13.5517 14.7237 13.2002 15.0752C12.8487 15.4267 12.3721 15.6245 11.875 15.625H4.375C3.87789 15.6245 3.40129 15.4267 3.04978 15.0752C2.69826 14.7237 2.50054 14.2471 2.5 13.75V6.25C2.50054 5.75289 2.69826 5.27629 3.04977 4.92477C3.40129 4.57326 3.87789 4.37554 4.375 4.375H11.875C12.3721 4.37554 12.8487 4.57326 13.2002 4.92477C13.5517 5.27629 13.7495 5.75289 13.75 6.25V13.75ZM15 11.5324V8.46634L17.4982 6.87866L17.4994 13.1207L15 11.5324Z" fill-opacity="0.95"/>
              <rect x="4" y="6" width="3" height="3" rx="1.5" fill="#3CC29A"/>
            </svg>

            <svg v-if="!interstitialCamOn" class="redsvg" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.1578 4.81171C16.9767 4.69915 16.7698 4.63499 16.5569 4.62537C16.3439 4.61576 16.1321 4.661 15.9417 4.75678C15.9224 4.76654 15.9038 4.77692 15.8855 4.78851L14.002 5.98648V5.25055C14.001 4.42205 13.6714 3.62776 13.0856 3.04192C12.4997 2.45608 11.7055 2.12652 10.877 2.12555H3.37695C3.26263 2.12744 3.14851 2.1359 3.03516 2.15088L1.94234 1.05804C1.82514 0.940844 1.66619 0.875001 1.50044 0.875C1.3347 0.874999 1.17574 0.940839 1.05854 1.05804C0.941341 1.17524 0.875498 1.33419 0.875497 1.49994C0.875495 1.66568 0.941336 1.82464 1.05853 1.94184L16.0588 16.9418C16.176 17.059 16.335 17.1249 16.5007 17.1249C16.6665 17.1249 16.8254 17.059 16.9426 16.9418C17.0598 16.8246 17.1257 16.6657 17.1257 16.4999C17.1257 16.3342 17.0598 16.1752 16.9426 16.058L13.9767 13.0922C13.9916 12.9789 14.0001 12.8648 14.002 12.7506V12.0142L15.8855 13.2114C15.9035 13.223 15.9221 13.2334 15.941 13.2431C16.1316 13.3385 16.3434 13.3836 16.5562 13.3741C16.7691 13.3646 16.976 13.3008 17.1573 13.1889C17.3386 13.0769 17.4883 12.9204 17.5921 12.7343C17.6959 12.5482 17.7504 12.3387 17.7504 12.1256V5.87495C17.7512 5.66176 17.6971 5.45197 17.5933 5.26576C17.4895 5.07954 17.3395 4.92318 17.1578 4.81171ZM4.25984 3.37555H10.877C11.3741 3.37609 11.8507 3.57381 12.2022 3.92532C12.5537 4.27684 12.7514 4.75344 12.752 5.25055V11.8674L4.25984 3.37555ZM14.002 10.5332V7.46773L16.5004 5.8786L16.5007 12.1213L14.002 10.5332Z" fill="#FC8B98"/>
              <path d="M10.877 14.6256H3.37695C2.87984 14.625 2.40324 14.4273 2.05173 14.0758C1.70021 13.7243 1.5025 13.2477 1.50195 12.7506V5.25055C1.50408 4.94499 1.58184 4.64471 1.72828 4.37653L0.818016 3.46626C0.45007 3.98853 0.252376 4.61168 0.251953 5.25055V12.7506C0.252926 13.5791 0.582478 14.3733 1.16832 14.9592C1.75416 15.545 2.54845 15.8746 3.37695 15.8756H10.877C11.5159 15.8751 12.139 15.6774 12.6613 15.3094L11.7511 14.3991C11.4829 14.5456 11.1826 14.6234 10.877 14.6256Z" fill="#FC8B98"/>
            </svg>

          </div>
          
          <span class="lb" >{{!interstitialCamOn ? 'Start video' : 'Stop video'}}</span>

        </span>
        <div 
          class="splitted btn_video2" 
          ref="btn_video2"
          :class="{active: ctrlMenuVideoVisible}"
          v-if="!devicePaired " 
          @click="showAudioVideoSettings($event, 'video', 'btn_video2')" 
          @mouseenter="_ => hoverSplitted = true"
          @mouseleave="_ => hoverSplitted = false"
        >
          <wl-icon
            name="arrow-down-filled" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="12"
            class="arr"
          />
        </div>
      </div>

      <div
        v-if="(siEnabled || sliEnabled) && sliRole !== 'sli'" 
        class="btn"
        :class="{active: popSiSettingsVisible}"
        @click="toggleSiSettings" 
      >
        <div class="ico ico_language">
          <wl-icon name="language-bold" size="20" />
        </div>
      </div>

      <div class="spacer"></div>
      <span class="txtbefore">Ready?</span>
      <div class="btn-join" @click="joinMeeting" >
        <div class="bg" ref="animatedButton"></div>
        <div class="lb">{{ host ? 'Start meeting' : 'Join meeting'}}</div>
      </div>
      <!--md-button 
        aria-label="Join" 
        color="green" 
        size="40" 
        class="btn-join reminder" 
        @click="joinMeeting" 
      >{{ host ? 'Start meeting' : 'Join meeting'}}</md-button-->
    </div>

    <tip-message 
      :label='notification'
      :show='showNotification' 
      :style='{bottom:"212px"}'
    ></tip-message>
    
	</div>
</template>

<script>
import mframe from 'mframe'
import popPlist from './shared/pop-plist.vue'
import popDevice from './shared/pop-device.vue'
import popPairedDevice from './shared/pop-device-paired.vue'
import popAVsettings from "./shared/pop-audio-video-settings.vue";
import popSiSettings from "./meeting/interpretation-setting.vue";
import lottie from 'lottie-web'
import * as animatedButton from '../assets/json/join-button-animated-01-nocopy.json';
import coachmark from './shared/coachmark.vue'
import dialog from './shared/dialog.vue';

export default {
  props: {
    host: {
      type: Boolean,
    }
  },
  data() {
    return {
      name:'Cisco Webex Meetings',

      audio_option_label:'Use Computer for audio',
      callmenumber:'Call me at ',
      isVideoAddress:false,
      currentSettingVisible:false,
      notification: null,
      showNotification: false,
      itv_notification: 0,
      hoverSplitted: false,
      popPlistVisible: false,
      inMeetingPeople: [],
      ctrlMenuAudioVisible: false,
      ctrlMenuVideoVisible: false,
      interstitialAudioOptionVisible: false,
      signDropdownVisible: false,
      deviceDropdownVisible: false,
      pairedDropdownVisible: false,
      joinReminderVisible: false,
      showReminderIntervalId: 0,
      siSettingPopperName: 'popper-si-setting',
      meetingId: 'webex-meeting',
      popSiSettingsVisible: false,
    }
  },
  computed:{
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
      peopleList(){
        return this.$store.state.peopleList;
      },
      systemBarVisible(){
        return this.$store.state.systemBarVisible;
      },
      fullscreen(){
        return this.$store.state.fullscreen;
      },
      interstitialCamOn(){
        return this.$store.state.interstitialCamOn;
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
      meetingTitle(){
          return this.$store.state.meetingTitle;
      },        
      muted(){
          return this.$store.state.muted;
      },
      devicePaired(){
          return this.$store.state.devicePaired;
      },
      devicePairedName(){
          return this.$store.state.devicePairedName;
      },
      devicePairedImage(){
          return this.$store.state.devicePairedImage;
      },
      avatarPath(){
          return this.$store.state.avatarPath;
      },
      me(){
          return this.$store.getters.me;
      },
      selfvideoMirror() {
        return this.$store.state.selfvideoMirror;
      },
      interstitialParams() {
        return this.$store.state.interstitialParams;
      },
      siEnabled() {
        return this.$store.state.siEnabled;
      },
      sliEnabled() {
        return this.$store.state.sliEnabled;
      },
      sliRole() {
        return this.$store.state.sliRole;
      },
      isFTE() {
        return this.$store.state.isFTE;
      },
    },
    mounted() {
      this.initCam();
      this.setCamSize();

      window.addEventListener('mousedown', this.onMouseDown);

      /*
      this.notification = 'Microphone is ' + (this.muted ? 'off' : 'on') + ', camera is ' + (this.interstitialCamOn ? 'on' : 'off');
      this.showNotification = true;
      clearTimeout(this.itv_notification);
      this.itv_notification = setTimeout(() => {
        this.showNotification = false;
      }, 3000);
      */

      if(this.host) {
        let lst = this.peopleList.slice();
        for (let i=0;i <lst.length; i++) {
          if (lst[i].host) {
            lst[i].host = false;
            break;
          }
        }
        lst[0].host = true;
        this.$store.commit('peopleList', lst);
      } else {
        let lst = this.peopleList.slice();
        for (let i=0;i <lst.length; i++) {
          if (lst[i].name == 'Adrian Delamico') {
            lst[i].host = true;
            break;
          }
        }
        lst[0].host = false;
        this.$store.commit('peopleList', lst);
      }
      

      this.setReminderVisible();
      document.querySelector('#interstitial').addEventListener('mousedown', this.checkShowReminder);

      this.playAudioAnimation();
      this.inMeetingPeople = this.peopleList.slice(3, 6);

      if (this.sliRole == 'hhuser') {
        this.toggleMute()
      }else if (this.sliRole == 'sli') {
        this.toggleVideo()
      }

      requestAnimationFrame(() => {
        if (this.sliRole !== 'hhuser' && this.sliRole !== 'sli') {
          if (!this.siEnabled) {
            this.showAudioVideoSettings(null, 'audio', 'btn_audio2');
          } else {
            this.showSiSettings();
          }
        }
        
      })

      lottie.loadAnimation({
          container: this.$refs['animatedButton'],
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animatedButton.default,
      });

      if (this.isFTE) {
        requestAnimationFrame(() => {
          this.showCoachmark({
              name: 'join-button-coachmark',
              closable: false,
              icon: 'enter-room-bold',
              title: `Join the meeting`,
              content: `You're in the preview screen, and can set up your audio and video. When you're ready, click the Join meeting button.`,
              subtext: null,
              reference: document.querySelector('.btn-join'),
              placement: `top`,
              button: null,
            })
        })
      }


    },
    beforeUnmount() {
      document.querySelector('#interstitial').removeEventListener('mousedown', this.checkShowReminder);
    },
    watch: {
      interstitialParams(newVal) {
        if(!newVal || !newVal.visible) {
          this.$emit('close')
        }
      },
      audioType(newVal) {
        if(newVal == 'pc'){
            this.audio_option_label = 'Use Computer for audio';
            this.marquee_paused = false;
        }else if(newVal == 'callme'){
            this.audio_option_label = '';
            this.marquee_paused = true;
        }else if(newVal == 'callin'){
            this.audio_option_label = 'Call in';
            this.marquee_paused = true;
        }else if(newVal == 'none'){
            this.audio_option_label = "Don't connect to audio";
            this.marquee_paused = true;
        }
      },
    },
    methods: {
      checkShowReminder(){
        clearTimeout(this.showReminderIntervalId);
        this.setReminderVisible();
      },
      setReminderVisible(){
        this.showReminderIntervalId = setTimeout( () => {
          this.joinReminderVisible = true;
          this.showJoinReminder();
        }, 20000);
      },
      
      showJoinReminder() {
        if (!this.interstitialParams || !this.interstitialParams.visible || this.isFTE) {
          return;
        }

        this.showCoachmark({
            name: 'join-button-coachmark',
            closable: true,
            icon: null,
            title: `You're not in the meeting yet.`,
            content: `When you're ready, select <b>Join meeting</b> below.`,
            subtext: null,
            reference: document.querySelector('.btn-join'),
            placement: `top`,
            button: null,
          })
      },

      playAudioAnimation() {
        const aduioMotion = mframe([{
          dom: document.getElementById('aduioIconRectBackground1'),
          frames: [
              { attr: {y:'6'} , time:0 },
              { attr: {y:'12.0'} , time:24, tween: 'easeInOut' },
              { attr: {y:'9.0'} , time:42, tween: 'easeInOut' },
              { attr: {y:'8.0'} , time:44, tween: 'easeInOut' },
              { attr: {y:'10.0'} , time:62, tween: 'easeInOut' },
              { attr: {y:'12.0'} , time:86, tween: 'easeInOut' },
              { attr: {y:'9.0'} , time:112, tween: 'easeInOut' },
              { attr: {y:'7.0'} , time:134, tween: 'easeInOut' },
              { attr: {y:'10.0'} , time:158, tween: 'easeInOut' },
              { attr: {y:'9.0'} , time:178, tween: 'easeInOut' },
              { attr: {y:'6.0'} , time:204, tween: 'easeInOut' }
          ]
        }]);
        aduioMotion.repeat(Infinity);

        const aduioMotion2 = mframe([{
          dom: document.getElementById('aduioIconRectBackground2'),
          frames: [
              { attr: {y:'8'} , time:0 },
              { attr: {y:'14.0'} , time:24, tween: 'easeInOut' },
              { attr: {y:'11.0'} , time:42, tween: 'easeInOut' },
              { attr: {y:'10.0'} , time:44, tween: 'easeInOut' },
              { attr: {y:'12.0'} , time:62, tween: 'easeInOut' },
              { attr: {y:'14.0'} , time:86, tween: 'easeInOut' },
              { attr: {y:'11.0'} , time:112, tween: 'easeInOut' },
              { attr: {y:'9.0'} , time:134, tween: 'easeInOut' },
              { attr: {y:'12.0'} , time:158, tween: 'easeInOut' },
              { attr: {y:'11.0'} , time:178, tween: 'easeInOut' },
              { attr: {y:'8.0'} , time:204, tween: 'easeInOut' }
          ]
        }]);
        aduioMotion2.repeat(Infinity);
      },
      initCam() {
        const selfViewVideo = document.getElementById('camera_interstital');
        // Prefer camera resolution nearest to 1280x720.
        const constraints = { audio: false, video: { width: 1280, height: 720 } };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function(mediaStream) {
            const video = selfViewVideo;
            video.srcObject = mediaStream;
            video.onloadedmetadata = function() {
              video.play();
            };
          })
          .catch(function(err) {
            console.log(err.name + ': ' + err.message);
          });
      },
      setCamSize() {
        /*
        const rect = this.$refs.cam_area.getBoundingClientRect();
        const h = `${rect.height / 9 * 16}px`;
        this.$refs.top_area.style.width = h;
        this.$refs.cam_area.style.width = h;
        this.$refs.controls.style.width = h;
        */
      },
      joinMeeting() {
        if (this.sliEnabled && this.sliRole == 'sli' && !this.interstitialCamOn) {
          this.showDialog(
            `Start video to join meeting`, 
            `As a Sign Language Interpreter, please turn on your video to join meeting.`,
            [
              {
                  title: 'Turn on video',
                  class: 'md-button-solid2',
                  func: () => {
                    this.toggleVideo()
                  },
              },
              {
                  title: 'Cancel',
                  class: 'md-button-outline',
                  func: () => { },
              },
            ],
            `#interstitial`)
          return
        }
        this.$popper.hideAll();
        this.$popper.hide(this.siSettingPopperName);

        this.$store.commit('cameraOn', this.interstitialCamOn);

        this.$eventBus.$emit('open-new-meeting-window', {
          meetingId: this.meetingId,
          meetingType: 'webex',
          defaultVideoLayout: this.sliEnabled && this.sliRole == 'sli' ? 'stage' : null,
        })
        this.$store.commit('interstitialParams', {visible: false});

        if (this.devicePaired) {
          this.$store.commit('deviceConnecting', true);
        }

        if (this.sliEnabled && this.sliRole == 'sli') {
          setTimeout(() => {
            this.$notify({
              group: 'default',
              text: `Interpretation has started. Attendees in the American Sign Language Channel can watch your interpretation.`,
              data: {
                icon: 'language-bold',
                closeable: true,
                button1Text: 'Got it',
                click: () => { },
              },
            });
          }, 1000)
        }
      },
      disconnectDevice() {
        this.$store.commit('devicePaired', false);
        this.$store.commit('devicePairedName', null);
      },
      close() {
        this.$popper.hideAll();
        this.$store.commit('interstitialParams', {visible: false});
      },
      topbarMousedown() {
        this.$popper.hideAll();
      },
      
      toggleVideo() {
        const camon = !this.interstitialCamOn;
        this.$store.commit('interstitialCamOn', camon);
        this.$store.commit('cameraOn', camon);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.video = camon ? 'camera' : null;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

        if(this.interstitialCamOn){
          this.notification = 'Your video is on';
        }else{
          this.notification = 'Your video is off';
        }
        this.showNotification = true;
        clearTimeout(this.itv_notification);
        this.itv_notification = setTimeout(() => {
          this.showNotification = false;
        }, 3000);

      },
      toggleMute() {
        const mut = this.muted;
        this.$store.commit('muted', !mut);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.muted = !mut;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

        if(mut){
          this.notification = `Your ${!this.devicePaired ? 'microphone' : 'device'} is on`;
        }else{
          this.notification = `Your ${!this.devicePaired ? 'microphone' : 'device'} is off`;
        }
        this.showNotification = true;
        clearTimeout(this.itv_notification);
        this.itv_notification = setTimeout(() => {
          this.showNotification = false;
        }, 3000);

      },
      showAudioOption() {
         this.interstitialAudioOptionVisible = true;
      },
      showAvSetting() {
        this.$store.commit("popSettingsType", 'audio');
        this.$store.commit("popSettingsVisible", true);
      },
      showPopChangeBg() {
        this.$store.commit("popSettingsType", 'video');
        this.$store.commit("popSettingsVisible", true);
      },

      showPlist(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.popPlistVisible) {
          this.$popper.show(
            popPlist, 
            {
              
            }, // component props
            {
              reference: this.$refs.plist_bubble_chain,
              closeTrigger: 'mouseout',
              arrowVisible: true,
              roundedCorner: true,
              borderRadius: '12px',
              appendToBody: true,
              theme: `${this.theme} ${this.themeColor}`,
              options: {placement: 'bottom'},
            }, // popper props
            {
              opened: () => {this.popPlistVisible = true},
              closed: () => {this.popPlistVisible = false},
            } // popper eventlistener
          );
        }
      },
      toggleMirror() {
        this.$store.commit('selfvideoMirror', !this.selfvideoMirror);
      },

      showSignDropdown() {
        if (!this.signDropdownVisible) {
          this.$popper.show(
            {
              template: `
                <div class="interstitial-dropdown-sign" style="width:125px;">
                  <div class="txt">You are currently signed in to cisco.webex.com</div>
                  <md-button class="btn md-button-outline btn-back" aria-label="x" :size="28" @click="close">Sign out</md-button>
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
              reference: this.$refs.username,
              closeTrigger: 'mousedown',
              arrowVisible: false,
              roundedCorner: true,
              frameless: true,
              borderRadius: '12px',
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              appendToBody: true,
              theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
              options: {placement: 'bottom'},
            }, // popper props
            {
              opened: () => {this.signDropdownVisible = true},
              closed: () => {this.signDropdownVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      showDeviceDropdown() {
        if (!this.deviceDropdownVisible) {
          this.$popper.show(
            popDevice,
            {
            }, // component props
            {
              reference: this.$refs.devicebtn,
              closeTrigger: 'mousedown',
              arrowVisible: true,
              roundedCorner: true,
              borderRadius: '12px',
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              appendToBody: true,
              theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
              options: {placement: 'bottom'},
            }, // popper props
            {
              opened: () => {this.deviceDropdownVisible = true},
              closed: () => {this.deviceDropdownVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      showPairedDropdown() {
        if (!this.pairedDropdownVisible) {
          this.$popper.show(
            popPairedDevice,
            {
            }, // component props
            {
              reference: this.$refs.devicepaired,
              closeTrigger: 'mousedown',
              arrowVisible: false,
              roundedCorner: true,
              borderRadius: '12px',
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              appendToBody: true,
              theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
              options: {
                placement: 'bottom',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 4],
                    },
                  },
                ],
              },
            }, // popper props
            {
              opened: () => {this.pairedDropdownVisible = true},
              closed: () => {this.pairedDropdownVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      showAudioVideoSettings(e, type, ref, defaultExpand) {
        if (e) {
          e.stopPropagation();
        }
        if (type !== 'audio') {
          this.$popper.hide('fte-audio');
        }
        
        this.$store.commit('audioVideoSettingPage', type);

        if (type === 'video' && this.ctrlMenuAudioVisible) {
          this.ctrlMenuAudioVisible = false;
          this.ctrlMenuVideoVisible = true;
          return;
        }
        else if (type === 'audio' && this.ctrlMenuVideoVisible) {
          this.ctrlMenuAudioVisible = true;
          this.ctrlMenuVideoVisible = false;
          return;
        }

        const rect1 = this.$refs[ref].getBoundingClientRect();
        const rect2 = this.$refs.controls.getBoundingClientRect();
        const left = rect1.left - rect2.left - 4;
        const top = rect1.top - rect2.top + 4;

        if (type === 'audio' && !this.ctrlMenuAudioVisible || type === 'video' && !this.ctrlMenuVideoVisible) {
          this.$popper.show(
            popAVsettings, 
            {
              defaultExpand: defaultExpand,
            }, // component props
            {
              reference: this.$refs[ref],
              closeTrigger: 'mousedown',
              arrowVisible: false,
              roundedCorner: true,
              borderRadius: '12px',
              frameless: true,
              shadow: false,
              appendToBody: false,
              theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
              affiliatedElementSelector: ['.btn_audio2', '.btn_video2', '.interstitial-popper-audio-fte', '.interstitial-popper-reminder'],
              rootClass: "interstitial-pop-transition",
              options: {
                placement: 'top-start', 
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-left, top],
                    },
                  },
                ],
              },
            }, // popper props
            {
              opened: () => {
                if (type === 'audio') {
                  this.ctrlMenuAudioVisible = true;
                } else if (type === 'video') {
                  this.ctrlMenuVideoVisible = true;
                }
              },
              closed: () => {
                this.ctrlMenuAudioVisible = false;
                this.ctrlMenuVideoVisible = false;
              },
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      toggleSiSettings() {
        if (!this.popSiSettingsVisible) {
          this.showSiSettings()
        }else{
          this.$popper.hide(this.siSettingPopperName)
        }
      },

      showSiSettings() {
        
        const ref = 'btn_audio2'
        const rect1 = this.$refs[ref].getBoundingClientRect();
        const rect2 = this.$refs.controls.getBoundingClientRect();
        const left = rect1.left - rect2.left - 8;
        const top = rect1.top - rect2.top + 8;

        this.$popper.show(
          popSiSettings, 
          {
            meetingId: this.meetingId,
            width: '340px',
          }, // component props
          {
            name: this.siSettingPopperName,
            reference: this.$refs[ref],
            closeTrigger: 'none',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            frameless: false,
            shadow: true,
            appendToBody: false,
            manuallyHide: true,
            theme: `${this.theme === 'dark' ? 'dark' : 'light'} ${this.themeColor}`,
            options: {
              placement: 'top-start', 
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [-left, top],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => {
              this.popSiSettingsVisible = true
            },
            closed: () => {
              this.popSiSettingsVisible = false
            },
          } // popper eventlistener
        );

      },

      showCoachmark(opt) {
        this.$popper.show(
            coachmark,
            {
              ...opt
            }, // component props
            {
              reference: opt.reference,
              name: opt.name || 'fte-coachmark',
              arrowVisible: true,
              roundedCorner: true,
              borderRadius: '8px',
              frameless: false,
              shadow: true,
              appendToBody: false,
              theme: `light webex`,
              closeTrigger: opt.closeTrigger,
              options: {
                placement: opt.placement,
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 0],
                    },
                  },
                ],
              },
            }, // popper props
            {
              opened: () => { },
              closed: () => { },
            } // popper eventlistener
          );
      },

      showDialog(title, message, buttons, parentSelector) {
        var dgwidth = 400
        var dgheight = 188
        var parentel = document.querySelector(parentSelector)
        var rect = parentel.getBoundingClientRect()
        var top = rect.top + (rect.height - dgheight)/2
        var left = rect.left + (rect.width - dgwidth)/2

        this.$modal.show(
          dialog, 
          {
            topbarTitle: 'Webex',
            title: title,
            message: message,
            buttons: buttons,
          }, // component props
          {
            clickToClose: false,
            frameless: false,
            shadow: true,
            resizable: false,
            draggable: '.dialog .topbar',
            overlayVisible: true,
            overlayTransparent: 0,
            theme: this.theme,
            roundedCorner: this.os === 'mac',
            width: dgwidth,
            height: 'auto',
            center: false,
            top: top,
            left: left,
            transition: true,
          }, // modal props
          {
            closed: () => {  }
          } // modal eventlistener
        );
      },


      
    },
    
}
</script>

<style lang="scss">

#interstitial{
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  overflow: hidden;
  position: absolute;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  .top {
    height: 68px;
    width: calc(100% - 40px);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .side {
      height: 40px;
      width: 136px;
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      align-items: center;

      .ava {
        margin-left: -8px;
        pointer-events: none;
      
        .md-avatar__img {
          border: 1px solid $md-gray-10;
        }
        .md-avatar__letter {
          color: white;
          background-color: $md-gray-80;
          border: 1px solid $md-gray-10;
        }
      }

      .plus {
        .md-avatar__letter {
          font-size: 14px; 
          color: #000; 
          background-color: rgba(255, 255, 255, 0.95) !important;
        }
      }
    }
    .mid {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .title {
        font-size: 20px;
      }
      .time {
        font-size: 14px;
        opacity: 0.7;
        font-weight: normal;
        margin-top: -5px;
      }
    }
  }

  .cam_area {
    width: calc(100% - 40px);
    flex-grow: 1;
    border-radius: 12px;
    overflow: hidden;
    transform: rotate(0deg);
    background: rgba($color: #000000, $alpha: 0.07);
  }
  /*
  .cam_area .msk {
    position: absolute;
    width: 100%;
    height: 46px;
    background: rgba($color: #FFFFFF, $alpha: 0.7);
    backdrop-filter: blur(16px);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    overflow: hidden;
  }
  */

  #camera_interstital {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1, 1);
    width: 101%;
    height: auto;

    &.mirror {
      transform: translate(-50%, -50%) scale(-1, 1);
    }
  }
  #avatar_interstital {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .sli-tip {
    position: absolute;
    width: 458px;
    top: calc(50% + 105px);
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 24px;

    &.ontop {
      @include flex;
      height: 24px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
      padding: 0 10px;
      width: auto;
      top: 20px;
    }
  }

  .topbar {
    width: 100%;
  }

  .videotop {
    position: absolute;
    width: 100%;
    height: 100%;
    @include flex;
    top: 0;
    left: 0;

    .previewlb {
      position: absolute;
      right: 16px;
      bottom: 16px;
      font-weight: bold;
      font-size: 40px;
      line-height: 53px;
      opacity: 0.4;
    }
    
  }
  

  .preview_lb{
    position: absolute;
    width: 100%;
    height: calc(100% - 60px);

    font-style: normal;
    font-weight: bold;
    font-size: 50px;
    line-height: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    opacity: 0.6;
    pointer-events: none;
  }

  .controls {
    position: relative;
    width: calc(100% - 40px);
    height: 74px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    padding-bottom: 4px;
    font-size: 16px;

    .spacer {
      flex-grow: 1;
    }
    .txtbefore {
      margin-right: 153px;
    }

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      pointer-events: auto;
      cursor: default;
      text-align: center;
      vertical-align: middle;
      margin: 1px 4px;
      flex-shrink: 0;
      box-sizing: border-box;

      border: 1px solid rgba($color: #000000, $alpha: .3);

      .redsvg {
        path {
          fill: $textColor-error-lightUi;
        }
      }

      &:hover{
        border: 1px solid rgba($color: #000000, $alpha: .5);
        background-color: rgba($color: #000000, $alpha: .07);
      }
      &:active,
      &.active{
        background-color: rgba($color: #000000, $alpha: .2);
      }
      &.hover_splited:hover{
        background-color: transparent;
      }
      &.hover_splited:active{
        border: 1px solid rgba($color: #000000, $alpha: .9);
        background-color: transparent;
      }

      &.off {
        color: #FFF;
        background-color: #ff503c;
      }

      &.btn_splitted {
        padding: 0 !important;

        &:hover{
          background-color: transparent;
        }
        &:active,
        &.active{
          background-color: transparent;
        }
      }

      .lft {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 0 10px 0 16px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;

        .ico {
          @include flex;
          width: 20px;
          height: 20px;
        }
        
        &:hover{
          background-color: rgba($color: #000000, $alpha: .07);
        }
        &:active,
        &.active {
          background-color: rgba($color: #000000, $alpha: .2);
        }
      }

      .splitted {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 38px;
        width: 27px;
        margin: 0;
        border-top-right-radius: 19px;
        border-bottom-right-radius: 19px;

        .arr {
          margin-right: 6px;

          svg path {
            fill: rgba($color: #000000, $alpha: .95);
          }
        }

        &:hover{
          background-color: rgba($color: #000000, $alpha: .07);
        }
        &:active,
        &.active {
          background-color: rgba($color: #000000, $alpha: .2);
          
          .arr {
            transform: rotate(180deg);
            transform-origin: 50%;
          }
        }
      }
      
      .ico {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &.btn_x {
        border: none;
        background: $md-red-60;

        &:hover{
          border: none;
          background: $md-red-70;
        }
        &:active{
          border: none;
          background: $md-red-80;
        }
      }
    }

    .btn-join {
      @include flex;
      position: absolute;
      right: 0px;
      transform-origin: 50% 50%;
      padding: 0 16px;
      margin: 1px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
      height: 40px;
      width: 146px;

      .bg {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      .lb {
        @include flex;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      /** find button solid color element: <path fill="rgb(29,128,95) = $md-green-60" */
      &:hover {
        .bg svg > g > g:nth-child(2) path {
          fill: $md-green-70;
        }
      }
      &:active {
        .bg svg > g > g:nth-child(2) path {
          fill: $md-green-80;
        }
      }

      span {
        line-height: 18px;
        font-size: 15px;
      }

      &.reminder {
        animation-name: pulse;
        animation-duration: 1.8s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.6, 0.2, 0.2, 0.6);

        &::after {
          opacity: .4;
          content: "";
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border-radius: 28px; 
          padding: 6px; 
          background: linear-gradient(to right, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
          -webkit-mask:
              linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0);
          mask:
              linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude; 

          animation-name: pulse-border;
          animation-duration: 1.8s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          pointer-events: none;
        }
      }


    }

    @keyframes pulse {
      0% { transform: scale(1.0); }
      50% { transform: scale(1.08); }
      100% { transform: scale(1.0); }
    }
    @keyframes pulse-border {
      0% { opacity: 0; }
      50% { opacity: .4; }
      100% { opacity: 0; }
    }
    
    .ico-with-lb {
      width: auto;
      padding: 0 16px;
    }
    .ico-with-lb .ico {
      @include flex;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .btn_mute .lb {
      width: 57px;
      margin-left: -5px;
      margin-right: -5px;
    }
    .btn_video .lb {
      width: 84px;
      margin-right: -6px;
    }

  }

  .con{
    position: absolute; 
    top: 0px; 
    left: 0px; 
    display: block; 
    width: 100%; 
    height: 100%;
  }


  .ico_audio {
    position: relative;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
  }
  .ico_audio svg{
    position: absolute;
    top: 0px;
    left: 0px;
  }


  .paired {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width:100%;
    height: 100%;
    pointer-events: auto;
    justify-content: center;

    .tit {
      @include flex;
      margin-bottom: 40px;

      .lb {
        font-size: 16px;
        margin-right: 6px;
      }
    }

    .thumb{
      width: 280px;
      height: 124px;
      background-position: center;
      background-repeat: no-repeat;
      align-self: center;
      margin-bottom: 12px;
      background-size: contain;
      margin-bottom: 40px;
    }

    .vol {
      @include flex;
      margin: 8px 0 15px 0;

      .ico {
        @include flex;
        width: 44px;
        height: 44px;
      }

      .vol-slider {
        cursor: default;
        margin: 0;
        width: 150px;

        .md-slider__bar {
          left: 0;
        }
      }
      
    }

    .btn-disconnect {
      font-size: 16px;
      font-weight: 600;
      margin-top: 20px;

      border: solid 1px rgba($color: #000000, $alpha: 0.0);
      padding: 0 12px;

      &:hover {
        background: rgba($color: #FFFFFF, $alpha: 0.07);
      }
      &:active {
        background: rgba($color: #FFFFFF, $alpha: 0.2);
      }
    }

  }


  .settings {
    position: relative;
    height: 40px;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
  }

  .settings .itm {
    transition: top 0.5s linear;
    position: absolute;
    display: flex;
    align-items: center;
    overflow:hidden;
  }
  .settings .itm .lb{
    pointer-events: none;
    margin-left: 6px;
    text-align: left;
    font-size: 14px;
  }


  .current_setting {
    position: absolute;
    bottom: 65px;
    right: 10px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    background: #222222;
    border-radius: 4px;
    padding: 5px 10px;
    color: #FFF;
    box-shadow: 0px 4px 12px rgba(0,0,0,0.16);
  }
  .current_setting .itm{
    display: flex;
    align-items: center;
    margin: 2px 0;
  }
  .current_setting .itm .ico{
    margin-right: 6px;
  }

  .blue {
    color: #00A9D3;
  }


  &.mac {
    border-radius: 12px;
    overflow: hidden;
  }



  /* ------ dark/hybrid ------- */
  &.dark,
  &.hybrid  {

    .top {
      .side {
        .ava {
          .md-avatar__img {
            border: 1px solid $md-gray-90;
          }
          .md-avatar__letter {
            background-color: $md-gray-80;
            border: 1px solid $md-gray-90;
          }
        }
      }
    }

    .controls {
      .btn {
        border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
        box-sizing: border-box;

        .redsvg {
          path {
            fill: $textColor-error-darkUi;
          }
        }

        &:hover{
          border: 1px solid rgba($color: #FFFFFF, $alpha: .5);
          background-color: rgba($color: #FFFFFF, $alpha: .07);
        }
        &:active,
        &.active{
          background-color: rgba($color: #FFFFFF, $alpha: .2);
        }
        &.hover_splited:hover{
          border: 1px solid rgba($color: #FFFFFF, $alpha: .5);
          background-color: transparent;
        }
        &.hover_splited:active, &.hover_splited.active{
          background-color: transparent;
        }

        &.off {
          background-color: $md-red-60;
        }

        &.btn_splitted {
          &:hover{
            background-color: transparent;
          }
          &:active,
          &.active{
            background-color: transparent;
          }
        }

        .lft {
          &:hover{
            background-color: rgba($color: #FFFFFF, $alpha: .07);
          }
          &:active,
          &.active {
            background-color: rgba($color: #FFFFFF, $alpha: .2);
          }
        }

        .splitted {
          .arr svg path {
            fill: rgba($color: #FFFFFF, $alpha: .95);
          }

          &:hover{
            background-color: rgba($color: #FFFFFF, $alpha: .07);
          }
          &:active,
          &.active {
            background-color: rgba($color: #FFFFFF, $alpha: .2);
          }
        }

        &.btn_x {
          border: none;
          background: $md-red-60;

          &:hover{
            border: none;
            background: $md-red-70;
          }
          &:active{
            border: none;
            background: $md-red-80;
          }
        }

      }
    }

    .cam_area {
      background: rgba($color: #FFFFFF, $alpha: 0.07);
    }

  }

  &.dark {

    .section_pairing .device_menu{
      background: $md-gray-95;
    }
    .section_pairing .device_menu .tit{
      color:$md-gray-40;
      border-bottom: 1px solid $md-gray-80;
    }
    .section_pairing .device_menu .menuitm:hover{
      background-color: $md-gray-90;
    }
    .section_pairing .device_menu .itm .thumb{
      border: 1px solid $md-gray-80;
      background-color:$md-gray-90;
    }
    .device_menu .itm .lb_disconnect{
      color: $md-red-50;
    }
    .section_pairing .sec_search{
      border-top: 1px solid $md-gray-80;
    }
    .uiinput.pill {
      background-color: $md-gray-80;
    }
  }


  &.hybrid {

    .section_pairing .device_menu{
      background-color: white;
      color: $md-gray-100;
    }
  }

  
}

.interstitial-header-r {
  display: flex;
  align-items: center;
  pointer-events: auto;

  &-divd {
    opacity: .2;
    margin: 0 5px;
  }
  &-device {
    overflow:hidden;
    margin: 0 16px 0 0;
    white-space:nowrap;
    
    svg path {
      fill: black;
      fill-opacity: .95;
    }

    &.prd {
      svg path {
        fill: $md-blue-60;
        fill-opacity: 1;
      }
    }

    &-lb {
      margin-left: 6px;
      opacity: 0.95;
    }
  }
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    border-radius: 14px;
    padding: 0 10px;

    &:hover {
      background-color: rgba($color: black, $alpha: 0.07);
    }
    &:active, &.active {
      background-color: rgba($color: black, $alpha: 0.1);
    }

    &.prd {
      color: $md-blue-40;
    }
  }
  
}

.interstitial-dropdown-sign {
  width: 188px !important;
  height: 102px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  overflow: hidden;
  transform: rotate(0deg);

  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255,255,255,.16);
  color: $text-color-primary-light-ui;

  .txt {
    font-size: 12px;
    opacity: .7;
    margin-bottom: 10px;
  }
  .btn {
    font-size: 12px !important;
  }
}


.dark, .hybrid {
  .interstitial-header-r {
    &-device {
      svg path {
        fill: white;
      }
      &.prd {
        svg path {
          fill: $md-blue-40;
          fill-opacity: 1;
        }
      }
    }
    &-btn {
      &:hover {
        background-color: rgba($color: white, $alpha: 0.07);
      }
      &:active {
        background-color: rgba($color: white, $alpha: 0.1);
      }
    }
    
  }
}

.dark {
  .interstitial-dropdown-sign {
    color: $text-color-primary-dark-ui;
  }
}

.interstitial-pop-transition {
  transition: height .3s;
}

</style>