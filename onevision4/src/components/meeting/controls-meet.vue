<template>
    <div
      class="controls-meet"
      :class="[theme, {invisible: devicePaired}]"
      ref="controls"
    >

      <div v-if="!meetingPaused" class="wrap">

        <div
          v-if="audioType === 'none' && !devicePaired"
          v-show="(!visibleButtons || visibleButtons.indexOf('audio') > -1)"
          class="btn btn_audio ico-with-lb"
          v-tooltip="{placement: 'top', content: 'Audio'}"
          @click="showPopAudioOptions"
        >
          <wl-icon
            name="handset-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="16"
            class="ico"
          />
          <span class="lb">Audio</span>
        </div>
        
        <div
          v-if="audioType !== 'none' || devicePaired"
          v-show="(!visibleButtons || visibleButtons.indexOf('mute') > -1)"
          class="btn btn_splitted btn_mute ico-with-lb"
          :class="{
            hover_splited: hoverSplitted,
            active: ctrlMenuAudioVisible,
          }"
          @click="toggleMute"
        >
          <span class="lft" v-tooltip="{
            html: true,
            placement: 'top',
            content: selectedSmartAudio !== 2 ? (muted ? 'Unmute my microphone' : 'Mute my microphone') : (muted ? `You’re muted and can't unmute yourself.` : `Click to mute. You're using <b>Music mode</b> for your <br>microphone. `),
          }">
            <div class="ico ico_audio">

              <svg v-show="!muted" style="margin-top: -1px;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask_audio_wave" mask-type="alpha" maskUnits="userSpaceOnUse" x="7" y="5" width="6" height="9">
                  <path d="M7 5H13V9.90909C13 12.6204 11.6568 14 10 14C8.34315 14 7 12.6204 7 9.90909V5Z" fill="#FF3D67"/>
                </mask>
                <g mask="url(#mask_audio_wave)" y="6" >
                  <rect id="aduioIconRectBackground1" x="7" y="6" width="6" height="1" fill="#3CC29A"/>
                  <rect id="aduioIconRectBackground2" x="7" y="8" width="6" height="9" fill="#3CC29A"/>
                </g>
                <path :fill="theme === 'light' ? '#121212' : '#FFFFFF'" d="M15.0015 17.4997H13.7646C13.0271 17.518 12.308 17.2681 11.7407 16.7964C11.1734 16.3248 10.7964 15.6634 10.6798 14.9349C11.5411 14.7754 12.3195 14.3196 12.8802 13.6466C13.4409 12.9736 13.7486 12.1257 13.7499 11.2498V4.99976C13.7499 4.00519 13.3549 3.05137 12.6516 2.34811C11.9483 1.64484 10.9945 1.24976 9.99994 1.24976C9.00538 1.24976 8.05155 1.64484 7.34829 2.34811C6.64503 3.05137 6.24994 4.00519 6.24994 4.99976V11.2498C6.25148 12.1424 6.57116 13.0052 7.15158 13.6833C7.732 14.3614 8.53515 14.8104 9.41681 14.9497C9.53455 15.9163 9.97516 16.8148 10.6673 17.4998H5.00147C4.8357 17.4998 4.67673 17.5656 4.55952 17.6828C4.44231 17.8 4.37646 17.959 4.37646 18.1248C4.37646 18.2905 4.44231 18.4495 4.55952 18.5667C4.67673 18.6839 4.8357 18.7498 5.00147 18.7498H15.0015C15.1672 18.7498 15.3262 18.6839 15.4434 18.5667C15.5606 18.4495 15.6265 18.2905 15.6265 18.1248C15.6265 17.959 15.5606 17.8 15.4434 17.6828C15.3262 17.5656 15.1672 17.4997 15.0015 17.4997ZM7.49994 11.2497V4.99974C7.49994 4.3367 7.76333 3.70081 8.23217 3.23197C8.70101 2.76313 9.3369 2.49974 9.99994 2.49974C10.663 2.49974 11.2989 2.76313 11.7677 3.23197C12.2365 3.70081 12.4999 4.3367 12.4999 4.99974V11.2497C12.4999 11.9128 12.2365 12.5487 11.7677 13.0175C11.2989 13.4863 10.663 13.7497 9.99994 13.7497C9.3369 13.7497 8.70101 13.4863 8.23217 13.0175C7.76333 12.5487 7.49994 11.9128 7.49994 11.2497Z" fill-opacity="0.95"/>
              </svg>

              <svg v-show="!muted && selectedSmartAudio === 2" class="music_mode_icon" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :stroke="theme === 'light' ? '#121212' : '#FFFFFF'" d="M3.5 0.5V6.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle :fill="theme === 'light' ? '#121212' : '#FFFFFF'" :stroke="theme === 'light' ? '#121212' : '#FFFFFF'"  cx="2.5" cy="6.5" r="1" />
                <path :fill="theme === 'light' ? '#121212' : '#FFFFFF'" d="M6.33288 0.472147L3.5 0V1L6.26712 1.46119C6.38903 1.4815 6.5 1.3875 6.5 1.26391V0.669425C6.5 0.571658 6.42932 0.48822 6.33288 0.472147Z" />
              </svg>


              <svg v-if="muted && selectedSmartAudio !== 2" class="redsvg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0015 17.5002H13.7643C13.0268 17.5184 12.3077 17.2685 11.7405 16.7969C11.1733 16.3252 10.7964 15.6638 10.6797 14.9354C11.0918 14.8582 11.4878 14.7122 11.8512 14.5033L10.9182 13.5702C10.5396 13.7226 10.1293 13.7796 9.72354 13.7361C9.31773 13.6925 8.92886 13.5499 8.59116 13.3207C8.25346 13.0915 7.9773 12.7828 7.78701 12.4217C7.59672 12.0607 7.49813 11.6584 7.49993 11.2502V10.1518L6.24993 8.90168V11.2502C6.25147 12.1428 6.57115 13.0056 7.15157 13.6837C7.73199 14.3619 8.53514 14.8109 9.41681 14.9501C9.53454 15.9167 9.97514 16.8153 10.6672 17.5002H5.00146C4.83569 17.5002 4.67672 17.566 4.55951 17.6833C4.4423 17.8005 4.37645 17.9594 4.37645 18.1252C4.37645 18.291 4.4423 18.4499 4.55951 18.5671C4.67672 18.6844 4.83569 18.7502 5.00146 18.7502H15.0015C15.1672 18.7502 15.3262 18.6844 15.4434 18.5671C15.5606 18.4499 15.6265 18.291 15.6265 18.1252C15.6265 17.9594 15.5606 17.8005 15.4434 17.6833C15.3262 17.566 15.1672 17.5002 15.0015 17.5002Z" />
                <path d="M17.9421 17.0583L13.491 12.6073C13.6621 12.1753 13.75 11.7149 13.7502 11.2502V5.0002C13.749 4.00643 13.3533 3.05381 12.6501 2.35157C11.947 1.64932 10.9938 1.25488 10.0001 1.25488C9.00632 1.25488 8.05319 1.64932 7.35003 2.35157C6.64688 3.05381 6.25121 4.00643 6.24993 5.0002V5.36634L2.94184 2.0583C2.82464 1.9411 2.66569 1.87526 2.49995 1.87526C2.3342 1.87526 2.17524 1.9411 2.05804 2.05829C1.94084 2.17549 1.875 2.33445 1.875 2.50019C1.875 2.66594 1.94084 2.82489 2.05804 2.94209L17.0583 17.9421C17.1164 18.0001 17.1853 18.0462 17.2611 18.0776C17.3369 18.109 17.4182 18.1251 17.5002 18.1251C17.5823 18.1251 17.6636 18.109 17.7394 18.0776C17.8152 18.0462 17.8841 18.0001 17.9421 17.9421C18.0002 17.8841 18.0462 17.8152 18.0776 17.7393C18.109 17.6635 18.1252 17.5823 18.1252 17.5002C18.1252 17.4181 18.109 17.3369 18.0776 17.261C18.0462 17.1852 18.0002 17.1163 17.9421 17.0583ZM12.5003 11.2502C12.498 11.3627 12.4878 11.4749 12.4698 11.586L7.49995 6.61632V5.0002C7.501 4.3378 7.76487 3.70289 8.23362 3.23488C8.70238 2.76686 9.3377 2.50399 10.0001 2.50399C10.6625 2.50399 11.2978 2.76686 11.7666 3.23488C12.2353 3.70289 12.4992 4.3378 12.5003 5.0002V11.2502Z" />
              </svg>

              <svg v-if="muted && selectedSmartAudio === 2" class="redsvg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.8079 14.8167C10.9251 14.9338 11.084 14.9997 11.2498 14.9997C11.4155 14.9997 11.5745 14.9338 11.6917 14.8167C11.8088 14.6995 11.8747 14.5405 11.8747 14.3748C11.8747 14.209 11.8088 14.0501 11.6917 13.9329L10.3656 12.6068C10.5366 12.1748 10.6245 11.7144 10.6248 11.2498V4.99976C10.6248 4.00519 10.2297 3.05137 9.52641 2.34811C8.82315 1.64484 7.86932 1.24976 6.87476 1.24976C5.88019 1.24976 4.92637 1.64484 4.22311 2.34811C3.51984 3.05137 3.12476 4.00519 3.12476 4.99976V5.36597L2.31663 4.55784C2.19943 4.44065 2.04048 4.37481 1.87473 4.37481C1.70899 4.37482 1.55004 4.44066 1.43284 4.55786C1.31565 4.67506 1.24981 4.83402 1.24981 4.99976C1.24982 5.1655 1.31566 5.32445 1.43286 5.44165L10.8079 14.8167ZM4.37476 4.99976C4.37476 4.33671 4.63815 3.70083 5.10699 3.23199C5.57583 2.76315 6.21172 2.49976 6.87476 2.49976C7.5378 2.49976 8.17368 2.76315 8.64252 3.23199C9.11136 3.70083 9.37476 4.33671 9.37476 4.99976V11.2498C9.37253 11.3622 9.36235 11.4744 9.34428 11.5855L4.37476 6.61597V4.99976Z" />
                <path d="M11.8748 17.4998H10.6382C9.90067 17.518 9.18157 17.2681 8.61426 16.7965C8.04694 16.3249 7.66992 15.6636 7.55312 14.9351C7.96599 14.8581 8.36286 14.7118 8.72694 14.5024L7.79406 13.5695C7.41541 13.7221 7.00506 13.7791 6.59916 13.7357C6.19327 13.6922 5.80428 13.5497 5.46647 13.3205C5.12866 13.0913 4.8524 12.7826 4.66202 12.4214C4.47164 12.0603 4.37299 11.658 4.37476 11.2498V10.1502L3.12476 8.90021V11.2498C3.1263 12.1421 3.44579 13.0047 4.02589 13.6827C4.60599 14.3607 5.40874 14.8099 6.29008 14.9495C6.40777 15.9162 6.84842 16.8148 7.54063 17.4998H1.87476C1.709 17.4998 1.55002 17.5656 1.43281 17.6828C1.3156 17.8 1.24976 17.959 1.24976 18.1248C1.24976 18.2905 1.3156 18.4495 1.43281 18.5667C1.55002 18.6839 1.709 18.7498 1.87476 18.7498H11.8748C12.0405 18.7498 12.1995 18.6839 12.3167 18.5667C12.4339 18.4495 12.4998 18.2905 12.4998 18.1248C12.4998 17.959 12.4339 17.8 12.3167 17.6828C12.1995 17.5656 12.0405 17.4998 11.8748 17.4998Z" />
                <path :style="{fill: theme === 'light' ? '#121212' : '#FFFFFF'}" d="M17.4997 6.87476V6.24976C17.4997 5.75247 17.3022 5.27556 16.9505 4.92393C16.5989 4.5723 16.122 4.37476 15.6247 4.37476C15.1274 4.37476 14.6505 4.5723 14.2989 4.92393C13.9472 5.27556 13.7497 5.75247 13.7497 6.24976V6.87476C13.4183 6.87519 13.1006 7.00702 12.8663 7.24135C12.632 7.47567 12.5001 7.79337 12.4997 8.12476V10.6248C12.5001 10.9561 12.632 11.2738 12.8663 11.5082C13.1006 11.7425 13.4183 11.8743 13.7497 11.8748H17.4997C17.8311 11.8743 18.1488 11.7425 18.3831 11.5082C18.6174 11.2738 18.7493 10.9561 18.7497 10.6248V8.12476C18.7493 7.79337 18.6174 7.47567 18.3831 7.24135C18.1488 7.00702 17.8311 6.87519 17.4997 6.87476ZM14.9997 6.24976C14.9997 6.084 15.0655 5.92502 15.1828 5.80781C15.3 5.6906 15.4589 5.62476 15.6247 5.62476C15.7905 5.62476 15.9494 5.6906 16.0666 5.80781C16.1838 5.92502 16.2497 6.084 16.2497 6.24976V6.87476H14.9997V6.24976ZM13.7497 10.6248V8.12476H17.4997L17.5009 10.6248H13.7497Z" />
              </svg>


            </div>
            <span class="lb" >{{muted ? 'Unmute' : 'Mute'}}</span>
          </span>
          <div 
            class="splitted btn_audio2" 
            ref="btn_audio2"
            :class="{active: ctrlMenuAudioVisible}"
            v-if="(audioType === 'pc' || audioType === 'callme' || audioType === 'callin' || devicePaired) " 
            @click="showAudioOptionMenu" 
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
          v-if="!devicePaired || meetingType === 'video-call'"
          v-show="(!visibleButtons || visibleButtons.indexOf('video') > -1)"
          class="btn btn_splitted btn_video ico-with-lb"
          :class="{
            hover_splited: hoverSplitted,
            active: ctrlMenuVideoVisible,
          }"
          @click="toggleVideo"
        >
          <span class="lft" v-tooltip="{placement: 'top', content: !cameraOn ? 'Turn on my video' : 'Turn off my video'}">
            <div class="ico">
              <svg v-if="cameraOn" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :fill="theme === 'light' ? '#121212' : '#FFFFFF'" d="M5.62413 8.74984C6.31448 8.74984 6.87413 8.1902 6.87413 7.49984C6.87413 6.80949 6.31448 6.24984 5.62413 6.24984C4.93377 6.24984 4.37413 6.80949 4.37413 7.49984C4.37413 8.1902 4.93377 8.74984 5.62413 8.74984Z" fill-opacity="0.95"/>
                <path :fill="theme === 'light' ? '#121212' : '#FFFFFF'" d="M18.1555 5.81116C17.9746 5.69835 17.7678 5.63403 17.5548 5.62441C17.3419 5.61479 17.13 5.66019 16.9397 5.75623C16.9207 5.76584 16.9021 5.77644 16.8842 5.78796L15 6.98563V6.25C14.999 5.4215 14.6695 4.62721 14.0836 4.04137C13.4978 3.45553 12.7035 3.12597 11.875 3.125H4.375C3.5465 3.12597 2.75221 3.45553 2.16637 4.04137C1.58053 4.62721 1.25097 5.4215 1.25 6.25V13.75C1.25097 14.5785 1.58053 15.3728 2.16637 15.9586C2.75221 16.5445 3.5465 16.874 4.375 16.875H11.875C12.7035 16.874 13.4978 16.5445 14.0836 15.9586C14.6695 15.3728 14.999 14.5785 15 13.75V13.0131L16.8842 14.2108C16.9018 14.2223 16.9201 14.2327 16.9391 14.2419C17.1296 14.3374 17.3414 14.3826 17.5543 14.3731C17.7672 14.3636 17.9741 14.2999 18.1554 14.1879C18.3367 14.0759 18.4864 13.9194 18.5901 13.7332C18.6939 13.5471 18.7483 13.3375 18.7482 13.1244V6.87436C18.7489 6.66118 18.6948 6.45139 18.591 6.26519C18.4872 6.07898 18.3372 5.92262 18.1555 5.81116ZM13.75 13.75C13.7495 14.2471 13.5517 14.7237 13.2002 15.0752C12.8487 15.4267 12.3721 15.6245 11.875 15.625H4.375C3.87789 15.6245 3.40129 15.4267 3.04978 15.0752C2.69826 14.7237 2.50054 14.2471 2.5 13.75V6.25C2.50054 5.75289 2.69826 5.27629 3.04977 4.92477C3.40129 4.57326 3.87789 4.37554 4.375 4.375H11.875C12.3721 4.37554 12.8487 4.57326 13.2002 4.92477C13.5517 5.27629 13.7495 5.75289 13.75 6.25V13.75ZM15 11.5324V8.46634L17.4982 6.87866L17.4994 13.1207L15 11.5324Z" fill-opacity="0.95"/>
                <rect x="4" y="6" width="3" height="3" rx="1.5" fill="#3CC29A"/>
              </svg>

              <svg v-if="!cameraOn" class="redsvg" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.1578 4.81171C16.9767 4.69915 16.7698 4.63499 16.5569 4.62537C16.3439 4.61576 16.1321 4.661 15.9417 4.75678C15.9224 4.76654 15.9038 4.77692 15.8855 4.78851L14.002 5.98648V5.25055C14.001 4.42205 13.6714 3.62776 13.0856 3.04192C12.4997 2.45608 11.7055 2.12652 10.877 2.12555H3.37695C3.26263 2.12744 3.14851 2.1359 3.03516 2.15088L1.94234 1.05804C1.82514 0.940844 1.66619 0.875001 1.50044 0.875C1.3347 0.874999 1.17574 0.940839 1.05854 1.05804C0.941341 1.17524 0.875498 1.33419 0.875497 1.49994C0.875495 1.66568 0.941336 1.82464 1.05853 1.94184L16.0588 16.9418C16.176 17.059 16.335 17.1249 16.5007 17.1249C16.6665 17.1249 16.8254 17.059 16.9426 16.9418C17.0598 16.8246 17.1257 16.6657 17.1257 16.4999C17.1257 16.3342 17.0598 16.1752 16.9426 16.058L13.9767 13.0922C13.9916 12.9789 14.0001 12.8648 14.002 12.7506V12.0142L15.8855 13.2114C15.9035 13.223 15.9221 13.2334 15.941 13.2431C16.1316 13.3385 16.3434 13.3836 16.5562 13.3741C16.7691 13.3646 16.976 13.3008 17.1573 13.1889C17.3386 13.0769 17.4883 12.9204 17.5921 12.7343C17.6959 12.5482 17.7504 12.3387 17.7504 12.1256V5.87495C17.7512 5.66176 17.6971 5.45197 17.5933 5.26576C17.4895 5.07954 17.3395 4.92318 17.1578 4.81171ZM4.25984 3.37555H10.877C11.3741 3.37609 11.8507 3.57381 12.2022 3.92532C12.5537 4.27684 12.7514 4.75344 12.752 5.25055V11.8674L4.25984 3.37555ZM14.002 10.5332V7.46773L16.5004 5.8786L16.5007 12.1213L14.002 10.5332Z" fill="#FC8B98"/>
                <path d="M10.877 14.6256H3.37695C2.87984 14.625 2.40324 14.4273 2.05173 14.0758C1.70021 13.7243 1.5025 13.2477 1.50195 12.7506V5.25055C1.50408 4.94499 1.58184 4.64471 1.72828 4.37653L0.818016 3.46626C0.45007 3.98853 0.252376 4.61168 0.251953 5.25055V12.7506C0.252926 13.5791 0.582478 14.3733 1.16832 14.9592C1.75416 15.545 2.54845 15.8746 3.37695 15.8756H10.877C11.5159 15.8751 12.139 15.6774 12.6613 15.3094L11.7511 14.3991C11.4829 14.5456 11.1826 14.6234 10.877 14.6256Z" fill="#FC8B98"/>
              </svg>

            </div>
            <span class="lb" >{{!cameraOn ? 'Start video' : 'Stop video'}}</span>
          </span>
          <div 
            class="splitted btn_video2" 
            ref="btn_video2"
            :class="{active: ctrlMenuVideoVisible}"
            v-if="!devicePaired " 
            @click="showVideoOptionMenu" 
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
          v-if="devicePaired"
          v-show="(!visibleButtons || visibleButtons.indexOf('volume') > -1)"
          class="btn btn_volume ico-with-lb"
          ref="btn_volume"
          v-tooltip="{placement: 'top', content: 'Volume'}"
          @click="toggleVolume"
        >
          <wl-icon
            name="speaker-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="16"
            class="ico"
          />
          <span class="lb">Volume</span>
        </div>

        <div
          v-show="(!visibleButtons || visibleButtons.indexOf('share') > -1)"
          class="btn"
          :class="{ 'ico-with-lb': showLabelLev2 }"
          v-tooltip="{placement: 'top', content: 'Share content'}"
          @click="toggleShare"
        >
          <div class="ico">
            <wl-icon
              name="share-screen-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="20"
            /> 
          </div>
          <span v-if="showLabelLev2" class="lb">Share</span>
        </div>
        
        <div
          v-if="meetingType === 'audio-call' || meetingType === 'video-call'"
          v-show="(!visibleButtons || visibleButtons.indexOf('keypad') > -1)"
          class="btn"
          :class="{ 'ico-with-lb': showLabelLev2 }"
          v-tooltip="{placement: 'top', content: 'Keypad'}"
        >
          <div class="ico">
            <wl-icon
              name="dialpad-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="20"
            />
          </div>
          <span v-if="showLabelLev2" class="lb">Keypad</span>
        </div>


        <div
          v-if="ishost && meetingType !== 'audio-call' && meetingType !== 'video-call'"
          v-show="(!visibleButtons || visibleButtons.indexOf('record') > -1)"
          class="btn"
          :class="{
            'ico-with-lb': showLabelLev2,
            active: ctrlPopRecordVisible,
          }"
          ref="btn_record"
          v-tooltip="{placement: 'top', content: 'Record'}"
          @click="toggleRecord"
        >
          <span class="ico" >
            <svg v-if="!recordOn" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5002 1.25012C8.76966 1.25012 7.07794 1.7633 5.63901 2.72476C4.20008 3.68623 3.07857 5.05279 2.4163 6.65164C1.75404 8.2505 1.58076 10.0098 1.91838 11.7072C2.256 13.4045 3.08935 14.9636 4.31306 16.1873C5.53677 17.411 7.09587 18.2444 8.79321 18.582C10.4905 18.9196 12.2499 18.7463 13.8487 18.0841C15.4476 17.4218 16.8141 16.3003 17.7756 14.8614C18.7371 13.4224 19.2502 11.7307 19.2502 10.0001C19.2476 7.68028 18.3249 5.45619 16.6846 3.81581C15.0442 2.17543 12.8201 1.25272 10.5002 1.25012ZM10.5002 17.5001C9.01689 17.5001 7.56684 17.0603 6.33347 16.2361C5.1001 15.412 4.13881 14.2407 3.57115 12.8702C3.00349 11.4998 2.85497 9.9918 3.14436 8.53695C3.43375 7.08209 4.14805 5.74572 5.19695 4.69682C6.24584 3.64793 7.58221 2.93362 9.03707 2.64423C10.4919 2.35484 11.9999 2.50337 13.3704 3.07103C14.7408 3.63868 15.9122 4.59998 16.7363 5.83335C17.5604 7.06671 18.0002 8.51676 18.0002 10.0001C17.9981 11.9886 17.2072 13.895 15.8012 15.301C14.3951 16.7071 12.4887 17.498 10.5002 17.5001Z" :fill="theme === 'light' ? '#000000' : '#FFFFFF'" fill-opacity="0.95"/>
              <path d="M10.5002 6.87512C9.88218 6.87512 9.278 7.0584 8.76409 7.40178C8.25019 7.74516 7.84965 8.23322 7.61312 8.80424C7.3766 9.37526 7.31472 10.0036 7.43529 10.6098C7.55587 11.216 7.8535 11.7728 8.29054 12.2098C8.72758 12.6469 9.2844 12.9445 9.89059 13.0651C10.4968 13.1857 11.1251 13.1238 11.6961 12.8872C12.2672 12.6507 12.7552 12.2502 13.0986 11.7363C13.442 11.2224 13.6252 10.6182 13.6252 10.0001C13.6243 9.17162 13.2947 8.37733 12.7089 7.79149C12.123 7.20565 11.3288 6.8761 10.5002 6.87512ZM10.5002 11.8751C10.1294 11.8751 9.7669 11.7652 9.45855 11.5591C9.15021 11.3531 8.90989 11.0603 8.76797 10.7177C8.62606 10.375 8.58893 9.99804 8.66128 9.63433C8.73362 9.27061 8.9122 8.93652 9.17442 8.6743C9.43665 8.41207 9.77074 8.2335 10.1345 8.16115C10.4982 8.0888 10.8752 8.12593 11.2178 8.26785C11.5604 8.40976 11.8532 8.65009 12.0593 8.95843C12.2653 9.26677 12.3752 9.62928 12.3752 10.0001C12.3747 10.4972 12.177 10.9738 11.8255 11.3253C11.474 11.6769 10.9974 11.8746 10.5002 11.8751Z" :fill="theme === 'light' ? '#000000' : '#FFFFFF'" fill-opacity="0.95"/>
            </svg>

            <svg v-show="recordOn" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5005 1.25012C8.76991 1.25012 7.07818 1.7633 5.63925 2.72476C4.20032 3.68623 3.07881 5.05279 2.41655 6.65164C1.75428 8.2505 1.581 10.0098 1.91862 11.7072C2.25624 13.4045 3.0896 14.9636 4.31331 16.1873C5.53702 17.411 7.09612 18.2444 8.79345 18.582C10.4908 18.9196 12.2501 18.7463 13.849 18.0841C15.4478 17.4218 16.8144 16.3003 17.7759 14.8614C18.7373 13.4224 19.2505 11.7307 19.2505 10.0001C19.2479 7.68028 18.3252 5.45619 16.6848 3.81581C15.0444 2.17543 12.8203 1.25272 10.5005 1.25012ZM10.5005 17.5001C9.01713 17.5001 7.56708 17.0603 6.33372 16.2361C5.10035 15.412 4.13905 14.2407 3.5714 12.8702C3.00374 11.4998 2.85521 9.9918 3.1446 8.53695C3.43399 7.08209 4.1483 5.74572 5.19719 4.69682C6.24609 3.64793 7.58246 2.93362 9.03732 2.64423C10.4922 2.35484 12.0002 2.50337 13.3706 3.07103C14.7411 3.63868 15.9124 4.59998 16.7365 5.83335C17.5606 7.06671 18.0005 8.51676 18.0005 10.0001C17.9983 11.9886 17.2074 13.895 15.8014 15.301C14.3953 16.7071 12.4889 17.498 10.5005 17.5001Z" :fill="theme === 'light' ? '#000000' : '#FFFFFF'" fill-opacity="0.95"/>
              <circle id="recording-red-dot" cx="10.5" cy="10" r="3" fill="#F55868"/>
            </svg>
          </span>
          <span v-if="showLabelLev2" class="lb">Record</span>
        </div>

        <div
          v-if="breakoutSessionEnabled"
          v-show="(!visibleButtons || visibleButtons.indexOf('breakout') > -1)"
          class="btn"
          :class="{ 'ico-with-lb': showLabelLev1 }"
          ref="btn_breakout"
          v-tooltip="{placement: 'top', content: 'Breakout Session'}"
          @click="showBreakout"
        >
          <div class="ico">
            <wl-icon
              name="breakout-session-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="20"
            /> 
          </div>
          <span v-if="showLabelLev1" class="lb">Breakout Session</span>
        </div>

        <div 
          v-if="meetingType === 'webex'"
          v-show="(!visibleButtons || visibleButtons.indexOf('reactions') > -1)"
          class="btn btn-split-icons" 
          
        >
          <div 
            class="lft halfbtn"
            v-tooltip="{placement: 'top', content: 'Raise hand'}" 
          >
            <wl-icon
              name="raise-hand-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="20"
            />
          </div>
          
          <div class="divider"></div>

          <div 
            class="rgt halfbtn" 
            :class="{
              active: popmenuReactionVisible,
            }" 
            ref="btn_reaction" 
            v-tooltip="{placement: 'top', content: 'Reactions'}" 
            @click="toggleReaction" 
          >
            <wl-icon
              name="reactions-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="20"
            />
          </div>
          
        </div>

        <div 
          v-show="(!visibleButtons || visibleButtons.indexOf('more') > -1)"
          id="call-control-button-more"
          class="btn btn_more" 
          ref="btn_more"
          :class="{
            active: popmenuMoreVisible,
          }"
          v-tooltip="{placement: 'top', content: 'More options'}" 
          @click="togglePopmenuMore"
        >
          <wl-icon
            name="more-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="20"
          /> 

        </div>
        <div 
          v-show="(!visibleButtons || visibleButtons.indexOf('leave') > -1)"
          class="btn btn_x" 
          ref="btn_x" 
          v-tooltip="{placement: 'top', content: 'Leave'}" 
          @click="ishost ? togglePopLeave() : leaveMeeting()"
        >
          <wl-icon
            name="cancel-bold" 
            color="white-95"
            size="20"
          /> 
        </div>

      </div><!--wrap-->

      <div v-if="meetingPaused" class="wrap">
        <div
          class="btn ico-with-lb"
        >
          <wl-icon
            name="next-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="16"
            class="ico"
          />
          <span class="lb">Transfer</span>
        </div>

        <md-button color="green" aria-label="resume" size="40" class="mdbtn" @click="resume">
          <wl-icon
            name="play-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="16"
            style="margin-right: 8px"
          />
          Resume
        </md-button>

      </div><!--wrap-->


    </div>
</template>

<script>
import _ from 'lodash'
import mframe from 'mframe'
import popAudioOptions from './pop-audio-options.vue';
import popShare from "./pop-share.vue";
import popBreakout from "./pop-breakout.vue";
import ctrlMenuMore from "./ctrl-menu-more.vue";
import ctrlMenuAudio from "./ctrl-menu-audio.vue";
import ctrlMenuVideo from "./ctrl-menu-video.vue";
import ctrlMenuReaction from "./ctrl-menu-reaction.vue";
import ctrlPopRecord from "./ctrl-pop-record.vue";

export default {
  props: {
    meetingId: String,
    location: {
      type: String,
      default: null,
    },
    visibleButtons: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      hoverSplitted: false,
      popmenuMoreVisible: false,
      popmenuLeaveVisible: false,
      ctrlMenuAudioVisible: false,
      ctrlMenuVideoVisible: false,
      popVolumeVisible: false,
      popmenuReactionVisible: false,
      ctrlPopRecordVisible: false,
      recordingMotion: null,
      showLabelLev1: true,
      showLabelLev2: true,
    };
  },
  computed: {
    windowMinimized(){
      return this.$store.state.windowMinimized
    },
    host(){
      return this.$store.getters.host
    },
    me(){
      return this.$store.getters.me
    },
    ishost(){
      return this.$store.getters.me.name == this.$store.getters.host.name
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    recordOn() {
      return this.$store.state.recordOn;
    },
    breakoutSessionEnabled() {
      return this.$store.state.breakoutSessionEnabled;
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
    os() {
      return this.$store.state.os;
    },

    sidePanelIsOpen() {
      return this.$store.state.sidePanelIsOpen;
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId);
    },
    audioConnected() {
      return this.$store.state.audioConnected;
    },
    videoConnected() {
      return this.$store.state.videoConnected;
    },
    muted() {
      return this.$store.state.muted;
    },
    cameraOn() {
      return this.$store.state.cameraOn;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },

    popShareVisible() {
      return this.$store.state.popShareVisible;
    },
    devicePaired() {
      return this.$store.state.devicePaired;
    },
    audioType() {
      return this.$store.state.audioType;
    },
    meetingTitle() {
      return this.$store.state.meetingTitle;
    },
    activeSpeakerName() {
      return this.$store.state.activeSpeakerName;
    },
    plistPanelVisible() {
      return this.$store.state.plistPanelVisible;
    },
    chatPanelVisible() {
      return this.$store.state.chatPanelVisible;
    },
    appsPanelVisible() {
      return this.$store.state.appsPanelVisible;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    callingPeopleItems() {
      return this.$store.state.callingPeopleItems;
    },
    meetingType() {
      return this.$store.getters.meetingType(this.meetingId)
    },
    meetingPaused() {
      return this.$store.getters.meetingPaused(this.meetingId)
    },
    selectedSmartAudio() {
      return this.$store.state.selectedSmartAudio;
    },
    windowsSizeChanged() {
      return this.$store.state.windowsSizeChanged;
    },
    
  },
  mounted() {

    this.playAudioAnimation();
    this.playRecordingAnimation();

    this.$eventBus.$on('show-share-dialog', () => {
      this.toggleShare({tab: 2});
    });

  },
  beforeDestroy() {
    this.$eventBus.$off('show-share-dialog');
  },
  watch: {
    recordOn(val) {
      if (val) {
        this.playRecordingAnimation();
      } else if (this.recordingMotion) {
        this.recordingMotion.stop();
      }
    },
    windowsSizeChanged() {
      requestAnimationFrame(() => {
        this.checkCollision();
      });
    },
    breakoutSessionEnabled(newVal) {
      if (newVal) {
        this.showBreakout()
      }
      requestAnimationFrame(() => {
        this.checkCollision();
      });
    },
  },
  methods: {
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
    playRecordingAnimation() {
      if (!this.recordOn) {
        return;
      }
      if (this.recordingMotion) {
        this.recordingMotion.stop();
      }
      this.recordingMotion = mframe([{
          dom: document.getElementById('recording-red-dot'),
          frames: [
              { attr: {fill:'#F55868', r: '4'} , time:0 },
              { attr: {fill:'#F7644A', r: '5.4'} , time:60, tween: 'easeInOut' },
              { attr: {fill:'#F55868', r: '4.0'} , time:120, tween: 'easeInOut' }
          ]
      }]);
      this.recordingMotion.repeat(Infinity);
    },
    
    toggleVolume() {
      if (!this.popVolumeVisible) {
        //this.$popper.show
      } else {
        this.$popper.hideAll();
      }
    },
    toggleShare(opts) {
      if (!this.popShareVisible) {
        this.$modal.show(
          popShare, 
          {
            defaultTab: opts && opts.tab ? opts.tab : 0,
          }, // component props
          {
            clickToClose: false,
            frameless: true,
            shadow: true,
            resizable: true,
            draggable: true,
            overlayVisible: true,
            overlayTransparent: 0,
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            roundedCorner: this.os === 'mac',
            width: 888,
            height: 600,


          }, // modal props
          {
            closed: () => {
              this.$store.commit("popShareVisible", false);
            },
          } // modal eventlistener
        );
        this.$store.commit("popShareVisible", true);
      }
      
    },

    showBreakout() {
      this.$modal.show(
        popBreakout, 
        {}, // component props
        {
          clickToClose: false,
          frameless: true,
          shadow: true,
          resizable: true,
          draggable: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
          roundedCorner: this.os === 'mac',
          width: 720,
          height: 560,

        }, // modal props
        {
          closed: () => { },
        } // modal eventlistener
      );
    },

    toggleRecord() {
      if (!this.ctrlPopRecordVisible) {
        this.$popper.show(
          ctrlPopRecord, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_record,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            affiliatedElementSelector: ['.pop-save-opt-menu'],
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            options: {
              placement: 'top',
            },
          }, // popper props
          {
            opened: () => {this.ctrlPopRecordVisible = true},
            closed: () => {this.ctrlPopRecordVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    toggleReaction() {

      if (!this.popmenuReactionVisible) {
        this.$popper.show(
          ctrlMenuReaction, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_reaction,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            options: {
              placement: 'top',
            },
          }, // popper props
          {
            opened: () => {this.popmenuReactionVisible = true},
            closed: () => {this.popmenuReactionVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    togglePopmenuMore() {
      if (!this.popmenuMoreVisible) {
        this.$popper.show(
          ctrlMenuMore, 
          {
            meetingId: this.meetingId,
          }, // component props
          {
            reference: this.$refs.btn_more,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            options: {
              placement: 'top',
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
    toggleMute() {
      if (this.muted) {
        this.$store.commit('muted', false);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.muted = false;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

      } else {
        this.$store.commit('muted', true);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.muted = true;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

      }
    },
    toggleVideo() {
      if (this.cameraOn) {
        this.$store.commit('cameraOn', false);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.video = null;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);

      } else {
        this.$store.commit('videoConnected', true);
        this.$store.commit('cameraOn', true);

        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.me) {
                p.video = 'camera';
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);
      }
    },

    togglePopLeave() {
      if(this.meetingType !== 'webex') {
        this.$emit("closemeeting");
        return;
      }

      if (!this.popmenuLeaveVisible) {
        this.$popper.show(
            {
              template: `
                <div class="common-menulist" style="width:260px;">
                  <div class='common-menulist-item common-menulist-item-48' style="border-radius: 6px;" @click="leaveMeeting" >
                    <wl-icon name='exit-room-bold' size='18' />
                    <span class="lb" style="margin-left:6px;" >Leave meeting</span>
                  </div>
                  <div class='common-menulist-item common-menulist-item-48' style="border-radius: 6px;" @click="leaveMeeting" >
                  <wl-icon name='cancel-bold' size='18' />
                    <span class="lb" style="margin-left:6px;" >End meeting for all</span>
                  </div>
                </div>
              `,
              props: ['parent'],
              methods: {
                leaveMeeting() {
                  this.parent.leaveMeeting();
                  this.close();
                },
                close() {
                  this.$popper.hideAll();
                },
              }
            },
            {
              parent: this,
            }, // component props
            {
              reference: this.$refs.btn_x,
              closeTrigger: 'mousedown',
              arrowVisible: true,
              roundedCorner: true,
              frameless: false,
              borderRadius: '12px',
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              appendToBody: true,
              theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
              options: {placement: 'top'},
            }, // popper props
            {
              opened: () => {this.popmenuLeaveVisible = true},
              closed: () => {this.popmenuLeaveVisible = false},
            } // popper eventlistener
          );
      } else {
        this.$popper.hideAll();
      }
    },

    leaveMeeting() {
      this.$emit("closemeeting");
      // this.$emit("leave");
    },

    showAudioOptionMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.ctrlMenuAudioVisible) {
        this.$popper.show(
          ctrlMenuAudio, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_audio2,
            affiliatedElementSelector: ['.sub-menulist', '.sub-menulist-item'],
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            options: {
              placement: 'top-end',
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
            opened: () => {this.ctrlMenuAudioVisible = true},
            closed: () => {this.ctrlMenuAudioVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    showVideoOptionMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.ctrlMenuVideoVisible) {
        this.$popper.show(
          ctrlMenuVideo, 
          {
            
          }, // component props
          {
            reference: this.$refs.btn_video2,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
            options: {
              placement: 'top-end',
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
            opened: () => {this.ctrlMenuVideoVisible = true},
            closed: () => {this.ctrlMenuVideoVisible = false},
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },
    showPopAudioOptions() {
      this.$modal.show(
        popAudioOptions, 
        {}, // component props
        {
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          draggable: true,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: `${this.theme} ${this.themeColor}`,
          roundedCorner: this.os === 'mac',
          width: 458,
          height: 'auto',
        }, // modal props
        {
        } // modal eventlistener
      );
    },



    checkCollision() {
      if (this.location === 'mainapp') {
        const ctrlRect = this.$refs.controls.getBoundingClientRect();
        const rightRect = document.querySelector('#controls-right-buttons').getBoundingClientRect();
        
        if (this.showLabelLev1) {
          if (ctrlRect.right + 20 > rightRect.left) {
            this.showLabelLev1 = false;
          }
        } else {
          if (this.showLabelLev2) {
            if (ctrlRect.right + 100 < rightRect.left) {
              this.showLabelLev1 = true;
            } else if (ctrlRect.right + 20 > rightRect.left) {
              this.showLabelLev2 = false;
            }
          } else {
            if (ctrlRect.right + 100 < rightRect.left) {
              this.showLabelLev2 = true;
            }
          }
          
        }

        this.$store.commit("allControlsLabelVisible", this.showLabelLev1 && this.showLabelLev2)

      }
      
    },

    resume() {
      var layout = 'widget'
      var incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[layout]
      if (list.length < 2) {
        var i, itm
        for (i = 0; i < list.length; i++) {
          itm = list[i];
          if (!itm.incoming) {
            itm.onhold = true
          }
        }
        incall[layout] = list;
        this.$store.commit('callingPeopleItems', incall);
      }

      //
      let optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      optlist[idx].meetingPaused = false
      this.$store.commit('meetingOptionsList', optlist);
    },

  }
};
</script>

<style lang="scss">

  .controls-meet {

    user-select: none;

    flex-grow: 1;
    flex-shrink: 0;
    height: 54px;
    text-align: center;
    pointer-events: none;
    display: flex;
    flex-direction: column;

    &.invisible {
      opacity: 0;
      pointer-events: none;
    }
    &.width {
      width: 700px;
    }


    .wrap {
      @include flex;
      flex-grow: 1;
    }

    .mdbtn {
      pointer-events: auto;
    }

    .btn {
      @include flex;
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
      box-sizing: border-box;

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
        border: 1px solid rgba($color: #000000, $alpha: .5);
        background-color: transparent;
      }
      &.hover_splited:active{
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

      .lft, .rgt {
        @include flex;
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
      .rgt {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }
      .halfbtn {
        padding: 0 8px;
      }

      .splitted {
        @include flex;
        position: relative;
        height: 38px;
        width: 27px;
        margin: 0;
        border-top-right-radius: 19px;
        border-bottom-right-radius: 19px;

        .arr {
          margin-right: 6px;
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
        @include flex;
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
    
    .ico-with-lb {
      width: auto;
      padding: 0 16px;
    }
    .ico-with-lb .ico {
      @include flex;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .lb {
      height: 40px;
      line-height: 40px;
      user-select: none;
      font-size: 15px;
    
    }
    .btn_mute .lb {
      width: 57px;
      margin-left: -5px;
      margin-right: -5px;
    }
    .btn_video .lb {
      width: 79px;
      margin-right: -6px;
    }

    .ico_audio {
      @include flex;
      position: relative;
      width: 20px;
      height: 20px;

      .music_mode_icon {
        position: absolute;
        top: 13px;
        left: 16px;
      }
    }
    .btn-split-icons {
      width: 77px;
      
      .divider {
        width: 1px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.4);
        margin: 0 1px;
      }
    }


    /* ------------------ drak/hybrid ------------------ */

    &.dark,
    &.hybrid {

      .btn {
        border: 1px solid rgba($color: #FFFFFF, $alpha: .3);

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

        .lft, .rgt {
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
  }
</style>
