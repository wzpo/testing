<template>
	<div 
    id='pop-settings' 
    :class="[os, theme]"
    :style="{
      background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['app'][0]} 0%, ${themeColorList[theme][themeColor]['app'][1]} 100%)`
    }"
  >
    <div id="pop-settings-titlebar" class='title'>
      <span class="lb">Settings</span>
      <div class='close' @click="close"><wl-icon name="cancel-bold" :size="16" /></div>   
    </div>

    <div class="mainbody">
      <div class="tabs" >
        

        <div 
          v-for="(itm, idx) in tabs"
          :key="`itm${idx}`"
          class="tab" 
          :class="{selected: popSettingsType === itm.label.toLowerCase()}" @click="goTab(itm.label.toLowerCase())" >
          <div class="ico">
            <wl-icon :name="itm.icon" size="16" />
          </div>
          <span class="lb">{{itm.label}}</span>
          <div v-if="itm.sub" class="arr">
            <wl-icon name="arrow-right-bold" size="16" />
          </div>
        </div>
        
      </div>

      <div 
        class="contentarea" 
        :class="[theme === 'dark' ? 'dark' : 'light']"
        :style="{
          background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`
        }"
      >
        <wl-scrollbar 
          v-if="popSettingsType !== 'calling'"
          class="scrollview" 
          :alwaysVisible="false"
          :arrowVisible="$store.state.os==='win'"
          :theme="theme === 'dark' ? 'dark' : 'light'"
          ref="scrollbar"
        >
          <div class="scrollbody">

          
          <!------------ audio ------------>

          <div v-if="popSettingsType === 'audio'" class="audio" >

            <div class='tit'>Ringers and alerts</div>
            <div class="rw select">
              <wl-combobox
                defaultLabel="System default speaker"
                width="100%"
                :datalist="[
                  {
                    label: 'System default speaker',
                    value: 'System default speaker',
                  },
                  {
                    label: `Barbara’s Airpods Pro`,
                    value: `Barbara’s Airpods Pro`,
                  },
                  {
                    label: 'Family room speaker',
                    value: 'Family room speaker',
                  },
                ]"
                :defaultSelectedIndex="0"
                style="margin-bottom: 8px;"
              />

            </div>

            <div class="mgt30"></div>
            
            <div class='tit'>Speaker</div>
            <div class="rw select">
              
              <wl-combobox
                defaultLabel="System default speaker"
                width="100%"
                :datalist="[
                  {
                    label: 'System default speaker',
                    value: 'System default speaker',
                  },
                  {
                    label: `Barbara’s Airpods Pro`,
                    value: `Barbara’s Airpods Pro`,
                  },
                  {
                    label: 'Family room speaker',
                    value: 'Family room speaker',
                  },
                ]"
                :defaultSelectedIndex="0"
                style="margin-bottom: 8px;"
              />

              <md-button class="btn" :class="{'md-button--dark': theme === 'dark'}" aria-label="Test" style="width:100px; margin-left: 10px;">Test</md-button>
            </div>

            <div class="rw">
              <div class="lb">Output level</div>
              <svg width="242" height="8" viewBox="0 0 242 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="64" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="96" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="144" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="192" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect x="176" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect x="224" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect x="80" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="112" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="32" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="16" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="48" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="128" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="160" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="208" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect x="240" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
              </svg>

            </div>

            <div class="rw mgn">
              <div class="lb">Volume</div>
              <svg width="242" height="20" viewBox="0 0 242 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="8" width="242" height="2" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect y="8" width="162" height="2" rx="1" fill="#00A0D1"/>
                <g filter="url(#filter0_d)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M161 17C165.418 17 169 13.4183 169 9C169 4.58172 165.418 1 161 1C156.582 1 153 4.58172 153 9C153 13.4183 156.582 17 161 17Z" fill="white"/>
                </g>
                <defs>
                <filter id="filter0_d" x="151" y="0" width="20" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset dy="1"/>
                <feGaussianBlur stdDeviation="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
                </defs>
              </svg>

            </div>

            <div class="mgt30"></div>

            <div class='tit'>Microphone</div>
            <div class="rw select">
              <wl-combobox
                defaultLabel="System default microphone"
                width="100%"
                :datalist="[
                  {
                    label: 'System default microphone',
                    value: 'System default microphone',
                  },
                  {
                    label: `Internal microphone`,
                    value: `Internal microphone`,
                  },
                  {
                    label: 'Family room speaker',
                    value: 'Family room speaker',
                  },
                ]"
                :defaultSelectedIndex="0"
                style="margin-bottom: 8px;"
              />

              <md-button class="btn" :class="{'md-button--dark': theme === 'dark'}" aria-label="Test" style="width:100px; margin-left: 10px;">Test</md-button>
            </div>

            <div class="rw">
              <div class="lb">Input level</div>
              <svg width="242" height="8" viewBox="0 0 242 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="64" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="96" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="144" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="192" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect x="176" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect x="224" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect x="80" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="112" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="32" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="16" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="48" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="128" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="160" width="2" height="8" rx="1" fill="#00A0D1"/>
                <rect x="208" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect x="240" width="2" height="8" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
              </svg>

            </div>

            <div class="rw">
              <div class="lb">Volume</div>
              <svg width="242" height="20" viewBox="0 0 242 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="8" width="242" height="2" rx="1" :fill="theme === 'dark' ? '#949494' : '#D2D2D2'"/>
                <rect y="8" width="162" height="2" rx="1" fill="#00A0D1"/>
                <g filter="url(#filter0_d)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M161 17C165.418 17 169 13.4183 169 9C169 4.58172 165.418 1 161 1C156.582 1 153 4.58172 153 9C153 13.4183 156.582 17 161 17Z" fill="white"/>
                </g>
                <defs>
                <filter id="filter0_d" x="151" y="0" width="20" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset dy="1"/>
                <feGaussianBlur stdDeviation="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
                </defs>
              </svg>

            </div>

            <div class="rw">
              <md-checkbox value="Automatically adjust volume"
              label="Automatically adjust volume"
              htmlId="vol"
              checked
              />

            </div>

          </div>


          <!------------ video ------------>
          <div v-show="popSettingsType === 'video' || popSettingsType === 'selfview'" class="video" style="max-width: 470px;" >

            <div class='tit tit2' v-if="audioType !== 'callme' && audioType !== 'callin'">Camera</div>
 
            <div class="rw">
              <div id='setting_preview_video' ref="setting_preview_video">
                <video v-if="popSettingsType === 'video' || popSettingsType === 'selfview'" id="setting_preview_camera" :class="{mirror: selfvideoMirror}" autoplay="true"></video>
                <!--div class="lb-preview">Preview</div-->
                
                <div class="ico-rotate" >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.80473 0.195263C7.54439 -0.0650875 7.12228 -0.0650875 6.86193 0.195263C6.60157 0.455612 6.60157 0.877721 6.86193 1.13807L7.72839 2.00452C3.43585 2.14773 0 5.67263 0 10C0 10.3682 0.298477 10.6667 0.666667 10.6667C1.03486 10.6667 1.33333 10.3682 1.33333 10C1.33333 6.41257 4.16689 3.48696 7.718 3.33919L6.86193 4.19527C6.60157 4.45561 6.60157 4.87772 6.86193 5.13807C7.12228 5.39843 7.54439 5.39843 7.80473 5.13807L9.80473 3.13807C10.0651 2.87772 10.0651 2.45561 9.80473 2.19527L7.80473 0.195263Z" fill="white" fill-opacity="0.95"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.33333 6.66667C4.22876 6.66667 3.33333 7.56209 3.33333 8.66667V14C3.33333 15.1045 4.22876 16 5.33333 16H14C15.1045 16 16 15.1045 16 14V8.66667C16 7.56209 15.1045 6.66667 14 6.66667H5.33333ZM4.66667 8.66667C4.66667 8.29848 4.96515 8 5.33333 8H14C14.3681 8 14.6667 8.29848 14.6667 8.66667V14C14.6667 14.3681 14.3681 14.6667 14 14.6667H5.33333C4.96515 14.6667 4.66667 14.3681 4.66667 14V8.66667Z" fill="white" fill-opacity="0.95"/>
                  </svg>
                </div>

              </div>

            </div>

            <div class="rw select" style="max-width: 424px; margin-top: 16px;">
              <wl-combobox
                defaultLabel="LG UltraFine Display Camera"
                width="100%"
                :datalist="[
                  {
                    label: 'LG UltraFine Display Camera',
                    value: 'LG UltraFine Display Camera',
                  },
                  {
                    label: 'Internal camera',
                    value: 'Internal camera',
                  },
                  {
                    label: 'Logitech webcam',
                    value: 'Logitech webcam',
                  },
                ]"
                :defaultSelectedIndex="0"
              />
              
            </div>


            <div class="rw" style="max-width: 424px; margin-top: 16px;">
              <md-checkbox value="Mirror my video"
                label="Mirror my video"
                htmlId="mirror"
                :checked="selfvideoMirror"
                @change="toggleMirror"
              />
            </div>

            <div class="rw" style="max-width: 424px;">
              <md-checkbox value="Enable hardware acceleration"
                label="Enable hardware acceleration"
                htmlId="zf"
                :checked="false"
              />
            </div>

            <div class="rw" style="max-width: 424px;">
              <div class="lft">
                <md-checkbox value="Adjust camera brightness"
                  label="Adjust camera brightness"
                  htmlId="acb"
                  :checked="false"
                />
              </div>

              <wl-combobox
                defaultLabel="Automatic"
                :datalist="[]"
                :defaultSelectedIndex="0"
                style="flex-grow: 1"
              />

            </div>

            <div class="rw" style="max-width: 424px;">
              <div class="lft">
                <span class="lb">Camera resolution</span>
                <wl-icon class="ico" name="info-circle-bold" size="16" />
              </div>

              <wl-combobox
                defaultLabel="720p"
                :datalist="[]"
                :defaultSelectedIndex="0"
                style="flex-grow: 1"
              />
            </div>


            <div class='tit tit2' style="margin-top: 24px; margin-bottom: 8px;" >Self view</div>
            <div class="rw selfview" style="margin-bottom: 12px; ">
              <md-radio-group name="self-view-select" :value="selfViewRadioValue" class="radiogrp" @change="onSelfviewChange">
                <md-radio
                  value="0"
                  label="Show with others"
                  htmlId="selfviewRadio1"
                  class="itm"
                >
                </md-radio>
                
                <md-radio
                  value="1"
                  label="Show in floating window"
                  htmlId="selfviewRadio2"
                  class="itm"
                >
                </md-radio>

                <md-radio
                  value="2"
                  label="Hide"
                  htmlId="selfviewRadio3"
                  class="itm"
                >
                </md-radio>

              </md-radio-group>

              <div class="grpthumb">

                <svg v-if="selfViewRadioValue === '0'" width="128" height="88" viewBox="0 0 128 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2738_3849)">
                  <rect width="127.286" height="88" rx="7.85714" fill="white" fill-opacity="0.04"/>
                  <rect x="6.17457" y="6.17435" width="35.1461" height="22.7974" rx="3.32463" stroke="white" stroke-opacity="0.4" stroke-width="0.949893"/>
                  <path d="M21.1942 25.0715V17.1557C21.1942 16.5541 20.6876 16.1109 20.086 16.2058C19.611 16.3008 19.2944 16.7124 19.2944 17.1874C19.2944 19.6888 21.4791 22.5068 24.8988 22.5385C26.7036 22.5701 28.1601 21.1136 28.1601 19.3405V14.9393C28.1601 13.5461 27.0202 12.4063 25.627 12.4063C23.4106 12.4063 23.4106 14.9393 21.1942 14.9393M25.627 15.8892C25.627 15.8892 25.9436 16.8391 26.2603 17.789C26.5769 18.7389 25.9436 18.7389 25.627 18.7389H25.3104M24.0439 11.1397C21.8274 11.1397 21.8274 13.6728 19.611 13.6728" stroke="white" stroke-width="0.949893" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="5.70004" y="32.2965" width="36.096" height="22.7974" rx="3.79957" fill="white" fill-opacity="0.08"/>
                  <rect x="5.70004" y="57.9435" width="36.096" height="23.7473" rx="3.79957" fill="white" fill-opacity="0.08"/>
                  <rect x="44.6458" y="5.69955" width="37.0458" height="23.7473" rx="3.79957" fill="white" fill-opacity="0.08"/>
                  <rect x="44.6458" y="32.2965" width="37.0458" height="22.7974" rx="3.79957" fill="white" fill-opacity="0.08"/>
                  <rect x="84.5414" y="32.2965" width="36.096" height="22.7974" rx="3.79957" fill="white" fill-opacity="0.08"/>
                  <rect x="84.5414" y="5.69955" width="36.096" height="23.7473" rx="3.79957" fill="white" fill-opacity="0.08"/>
                  <rect x="44.6458" y="57.9435" width="37.0458" height="23.7473" rx="3.79957" fill="white" fill-opacity="0.08"/>
                  <rect x="84.5414" y="57.9435" width="36.096" height="23.7473" rx="3.79957" fill="white" fill-opacity="0.08"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_2738_3849">
                  <rect width="127.286" height="88" rx="7.85714" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>

                <svg v-if="selfViewRadioValue === '1'" width="128" height="88" viewBox="0 0 128 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="127.29" height="88" rx="8" fill="white" fill-opacity="0.04"/>
                  <rect x="75.5" y="54.5" width="45" height="27" rx="3.5" stroke="white" stroke-opacity="0.4"/>
                  <path d="M103.283 66.4C103.283 66.4 104.016 68.6667 104.283 69.4C104.616 70.4 103.949 70.7333 103.283 70.7333H102.616M92.2828 66.0667C94.6161 66.0667 95.9495 64.7333 97.2828 63.4C98.6161 62.0667 99.9495 60.7333 102.283 60.7333C104.683 60.7333 106.616 62.6667 106.616 65.0667V71.7333C106.616 74.4667 104.449 76.7 101.716 76.7333C96.4495 76.8 92.1161 71.9333 91.9828 69.2333C91.9495 68.5333 92.4828 67.8333 93.1828 67.7667C93.9828 67.7 94.6495 68.3 94.6495 69.1V79.4333M100.949 58.7333C98.6161 58.7333 97.2828 60.0667 95.9495 61.4C94.6161 62.7333 93.2828 64.0667 90.9495 64.0667M99.6161 56.7333C97.2828 56.7333 95.9495 58.0667 94.6161 59.4C93.2828 60.7333 91.9495 62.0667 89.6161 62.0667" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M99.9495 67.7333C100.318 67.7333 100.616 67.4348 100.616 67.0667C100.616 66.6985 100.318 66.4 99.9495 66.4C99.5814 66.4 99.2829 66.6985 99.2829 67.0667C99.2829 67.4348 99.5814 67.7333 99.9495 67.7333Z" fill="white"/>
                </svg>

                <svg v-if="selfViewRadioValue === '2'" width="128" height="88" viewBox="0 0 128 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="127.29" height="88" rx="8" fill="white" fill-opacity="0.04"/>
                  <rect x="5.02461" y="32.0833" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                  <rect x="5.02461" y="58.6667" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                  <rect x="45.2215" y="5.5" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                  <rect x="5.02461" y="5.5" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                  <rect x="45.2215" y="32.0833" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                  <rect x="85.4183" y="32.0833" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                  <rect x="85.4183" y="5.5" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                  <rect x="45.2215" y="58.6667" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                  <rect x="85.4183" y="58.6667" width="36.8471" height="23.8333" rx="4" fill="white" fill-opacity="0.08"/>
                </svg>


              </div>
            </div>

            <div class="divider"></div>

            <div v-if="selfViewOption === 1" class="rw" style="margin-bottom: 24px; margin-top: -6px; ">
              <md-checkbox value="Show my self view only when my video is on"
              label="Show my self view only when my video is on"
              htmlId="avatar-off"
              :checked="!avatarVisibleCameraOff"
              :disabled="selfViewRadioValue === '2'"
              @change="toggleAvatarVisible"
              />

            </div>

            <div class="rw">
              <span class="link">Advanced video settings</span>
            </div>


          </div>


          <!------------ background ------------>
          <div v-show="popSettingsType === 'vbg'" class="video" style="max-width: 470px;" >

            <div class='tit tit2'>Virtual background</div>

            <div class="rw">
              <div id='setting_preview_video' ref="setting_preview_video">
                <video v-if="popSettingsType === 'vbg'" id="setting_preview_camera" :class="{mirror: selfvideoMirror}" autoplay="true"></video>
                <div class="lb-preview">Preview</div>
              </div>

            </div>

            <wl-scrollbar 
              class="virtualbg" 
              :alwaysVisible="true"
              :arrowVisible="$store.state.os==='win'"
              :theme="theme === 'dark' ? 'dark' : 'light'"
            >

              <div class="secvbg">
                <div class="vbgpanel">
                  <div class="list">

                    <div class="itm ">
                      <div class="selected"></div>
                      <wl-icon class="ico" name="blocked-bold" size="20" />
                      <span class="lb">None</span>
                    </div>

                    <div class="itm">
                      <wl-icon class="ico" name="video-blur-bold" size="20" />
                      <span class="lb">Blur</span>
                    </div>

                    

                    <div class="itm img1"></div>
                    <div class="itm img2"></div>
                    <div class="itm img3"></div>
                    <div class="itm img4"></div>
                    <div class="itm img5"></div>
                    <div class="itm img6"></div>
                    <div class="itm img7"></div>
                    <div class="itm img8">
                      <wl-icon name="camera-presence-filled" size="16" class="vd" />
                    </div>
                    <div class="itm img9">
                      <wl-icon name="camera-presence-filled" size="16" class="vd" />
                    </div>

                    <div class="itm">
                      <wl-icon class="ico" name="plus-bold" size="20" />
                    </div>

                  </div>

                </div>
              </div>
            </wl-scrollbar>

            <!--div class="vbgbtn">
              <md-button class="btn md-button-solid " aria-label="x" :size="32" disabled >Apply</md-button>
            </div-->


          </div>


          <!------------ appearance ------------>
          <div v-if="popSettingsType === 'appearance'" class="appearance" >
            <!-- big img -->
          </div>


          <!------------ layout ------------>
          <div v-if="popSettingsType === 'layout'" class="layout" >
            <div class='tit tit2' >Layout</div>
<!--
            <div v-if="selfViewOption === 2" class='tit' >Self-view location</div>
            <div v-if="selfViewOption === 1" class='tit' >Self-view</div>
            
            <div class="rw " style="margin-bottom: 12px">
              <md-radio-group name="self-view-select" :value="selfViewRadioValue" class="radiogrp" @change="onSelfviewChange">
                <md-radio
                  value="0"
                  label="Show in grid"
                  htmlId="selfviewRadio1"
                  class="itm"
                >
                  <svg width="90" height="60" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_20909_254177)">
                    <rect width="90" height="60" rx="5.21739" fill="white" fill-opacity="0.04"/>
                    <rect x="5" y="5" width="38" height="24" rx="3" fill="white" fill-opacity="0.24"/>
                    <path d="M21.5539 23.6609V16.1609C21.5539 15.5909 21.0739 15.1709 20.5039 15.2609C20.0539 15.3509 19.7539 15.7409 19.7539 16.1909C19.7539 18.5609 21.8239 21.2309 25.0639 21.2609C26.7739 21.2909 28.1539 19.9109 28.1539 18.2309V14.0609C28.1539 12.7409 27.0739 11.6609 25.7539 11.6609C23.6539 11.6609 23.6539 14.0609 21.5539 14.0609M25.7539 14.9609C25.7539 14.9609 26.0539 15.8609 26.3539 16.7609C26.6539 17.6609 26.0539 17.6609 25.7539 17.6609H25.4539M24.2539 10.4609C22.1539 10.4609 22.1539 12.8609 20.0539 12.8609" stroke="white" stroke-width="0.652174" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="47" y="5" width="38" height="24" rx="3" fill="white" fill-opacity="0.08"/>
                    <rect x="47" y="32" width="38" height="24" rx="3" fill="white" fill-opacity="0.08"/>
                    <rect x="5" y="32" width="38" height="24" rx="3" fill="white" fill-opacity="0.08"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_20909_254177">
                    <rect width="90" height="60" rx="5.21739" fill="white"/>
                    </clipPath>
                    </defs>
                  </svg>
                </md-radio>
                
                <md-radio
                  value="1"
                  :label="selfViewOption === 2 ? 'Show in floating window (video only)' : 'Show in floating window'"
                  htmlId="selfviewRadio2"
                  class="itm"
                >
                  <svg width="90" height="60" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_20909_254186)">
                    <rect width="90" height="60" rx="5.21739" fill="white" fill-opacity="0.04"/>
                    <rect x="54" y="36" width="32" height="20" rx="3" fill="white" fill-opacity="0.24"/>
                    <path d="M67.8266 51.9189V45.2522C67.8266 44.7455 67.3999 44.3722 66.8932 44.4522C66.4932 44.5322 66.2266 44.8789 66.2266 45.2789C66.2266 47.3855 68.0666 49.7589 70.9466 49.7855C72.4666 49.8122 73.6932 48.5855 73.6932 47.0922V43.3855C73.6932 42.2122 72.7332 41.2522 71.5599 41.2522C69.6932 41.2522 69.6932 43.3855 67.8266 43.3855M71.5599 44.1855C71.5599 44.1855 71.8266 44.9855 72.0932 45.7855C72.3599 46.5855 71.8266 46.5855 71.5599 46.5855H71.2932M70.2266 40.1855C68.3599 40.1855 68.3599 42.3189 66.4932 42.3189" stroke="white" stroke-width="0.652174" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_20909_254186">
                    <rect width="90" height="60" rx="5.21739" fill="white"/>
                    </clipPath>
                    </defs>
                  </svg>
                </md-radio>

                <md-radio
                  value="2"
                  label="Hide self view"
                  htmlId="selfviewRadio3"
                  class="itm"
                >
                  <svg width="90" height="60" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="90" height="60" rx="5.21739" fill="white" fill-opacity="0.04"/>
                    <rect x="3.91016" y="30.9043" width="38.5554" height="24.0971" rx="3.85554" fill="white" fill-opacity="0.08"/>
                    <rect x="3.91016" y="4" width="38.5554" height="24.0971" rx="3.85554" fill="white" fill-opacity="0.08"/>
                    <rect x="46.3203" y="4" width="38.5554" height="24.0971" rx="3.85554" fill="white" fill-opacity="0.08"/>
                    <rect x="46.3203" y="30.9043" width="38.5554" height="24.0971" rx="3.85554" fill="white" fill-opacity="0.08"/>
                  </svg>
                </md-radio>

              </md-radio-group>
            </div>

            <div v-if="selfViewOption === 1" class="rw" style="margin-bottom: 12px; margin-top: -6px; ">
              <md-checkbox value="Don't show my avatar when the camera is off"
              label="Don't show my avatar when the camera is off"
              htmlId="avatar-off"
              :checked="!avatarVisibleCameraOff"
              @change="toggleAvatarVisible"
              />

            </div>
-->
            <div class="rw">
              <div class='tit' >Maximum number of videos to show in grid view</div>
            </div>
            <wl-combobox
              defaultLabel="25"
              :datalist="[]"
              :defaultSelectedIndex="0"
              width="320px"
              style="margin-bottom: 20px"
            />

            <div class="rw">
              <div class='tit' >Name labels</div>
            </div>
            <wl-combobox
              defaultLabel="Show all names"
              :datalist="[]"
              :defaultSelectedIndex="0"
              width="320px"
              style="margin-bottom: 16px"
            />

            <div class="rw" style="margin-bottom: 8px">
              <md-radio-group name="media-quality" value="0" style="width: 430px;">
                <md-radio
                    value="0"
                    label="Show the media quality status for other participants only when there are issues"
                    htmlId="mqRadio1"
                  />
                
                <md-radio
                    value="1"
                    label="Always show the media quality status for other participants"
                    htmlId="mqRadio2"
                  />

              </md-radio-group>
            </div>


            <div class="rw">
              <div class='tit' >Control bar</div>
            </div>
            <wl-combobox
              defaultLabel="Always show the control bar"
              :datalist="[]"
              :defaultSelectedIndex="0"
              width="320px"
              style="margin-bottom: 20px"
            />

            <div class="spacer"></div>

            
          </div>
          
          <!------------ calling ------------>
          

          </div>
        </wl-scrollbar>

        <div v-if="popSettingsType === 'calling'" class="calling" >
          <div class='ph'>
            <wl-hot :rect="{x:34,y:468,w:141,h:20}"
                @click.native="() => { openUserPortal() }" />
          </div>
        </div>

        <!--div class="bottom-btns"> 
          <md-button class="btn md-button-solid " aria-label="x" :size="32" @click="save" >Save</md-button>
          <md-button class="btn md-button-outline " aria-label="x" :size="32" @click="close" >Cancel</md-button>
        </div-->
        <div v-if="popSettingsType === 'vbg'" class="bottom-btns"> 
          <md-button class="btn md-button-solid " aria-label="x" :size="32" disabled>Apply</md-button>
          <md-button class="btn md-button-outline " aria-label="x" :size="32" @click="close" >Cancel</md-button>
        </div>
      </div>

    </div><!--mainbody-->

  </div>
</template>

<script>

import freesignup from './../onboarding/freesignup';

export default {

    data() {
        return {
          vbgExpand: false,
          selfViewValue: this.selfViewRadioValue,
          avatarVisibleCameraOff: false,

          tabs: [
            {
              label: 'Developer',
              icon: 'text-code-block-bold',
            },
            {
              label: 'General',
              icon: 'settings-bold',
            },
            {
              label: 'Audio',
              icon: 'speaker-bold',
            },
            {
              label: 'Video',
              icon: 'camera-bold',
              sub: [
                {
                  label: 'Background'
                },
              ],
            },
            {
              label: 'Sharing content',
              icon: 'content-share-bold',
            },
            {
              label: 'Notification',
              icon: 'alert-bold',
              sub: [
                {
                  label: 'Meetings'
                },
                {
                  label: 'Calls'
                },
              ],
            },
            {
              label: 'Appearance',
              icon: 'appearance-bold',
            },
            //{
            //  label: 'Accessibility',
            //  icon: 'XXXXX',
            //},
            {
              label: 'Keyboard shortcuts',
              icon: 'keyboard-bold',
            },
            {
              label: 'Privacy',
              icon: 'private-circle-bold',
            },
            {
              label: 'Intergrations',
              icon: 'cloud-bold',
            },
            {
              label: 'Phone service',
              icon: 'dialpad-bold',
            },
            {
              label: 'Messaging',
              icon: 'chat-bold',
            },
            {
              label: 'Meetings',
              icon: 'webex-meetings-bold',
              sub: [
                {
                  label: 'Join options'
                },
                {
                  label: 'Layout'
                },
              ],
            },
            {
              label: 'Calling',
              icon: 'webex-meetings-bold',
            },
            {
              label: 'Devices',
              icon: 'multipled-devices-bold',
              sub: [
                {
                  label: 'Accessories'
                },
              ],
            },
          ],
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

      selfViewOption(){
          return this.$store.state.selfViewOption;
      },
      popSettingsType(){
          return this.$store.state.popSettingsType;
      },
      audioConnected(){
          return this.$store.state.audioConnected;
      },
      audioType(){
          return this.$store.state.audioType;
      },
      devicePaired(){
          return this.$store.state.devicePaired;
      },
      devicePairedName(){
          return this.$store.state.devicePairedName;
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
      selfvideoMirror() {
        return this.$store.state.selfvideoMirror;
      },
      selfVideoWithOthers() {
        return this.$store.state.selfVideoWithOthers;
      },
      donotShowMySelf() {
        return this.$store.state.donotShowMySelf;
      },
      selfvideoAvatarVisible() {
        return this.$store.state.selfvideoAvatarVisible;
      },
      selfViewRadioValue() {
        if (this.donotShowMySelf) {
          return '2'
        } else if (this.selfVideoWithOthers) {
          return '0'
        } else {
          return '1'
        }
      },
    },
    beforeMount() {
      this.avatarVisibleCameraOff = this.selfvideoAvatarVisible
    },
    mounted(){
      if (this.popSettingsType === 'selfview') {
        this.$refs.scrollbar.scrollToY(270, true);
      }
      this.initCam();
    },
    beforeDestroy() {
      this.stopCam();
    },
    watch: {
      popSettingsType(newVal) {
        this.$refs.scrollbar.scrollToY(0, true);
        if (newVal === 'video' || newVal === 'selfview' || newVal === 'vbg') {
          this.initCam();
          requestAnimationFrame(() => {
            this.initCam();
          })
        }
      },
    },
    methods:{
      initCam() {
        const selfViewVideo = document.getElementById('setting_preview_camera');
        const constraints = { audio: false, video: { width: 362, height: 223 } };
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

      stopCam() {
        const selfViewVideo = document.getElementById('setting_preview_camera');
        if (selfViewVideo) {
          selfViewVideo.pause();
        }
        
      },
      goTab(name) {
        this.$store.commit('popSettingsType', name); 
      },

      selectSpeaker(selected) {
        this.$store.commit("selectedSpeaker",selected[0].value);
      },
      selectMicrophone(selected) {
        this.$store.commit("selectedMicrophone", selected[0].value);
      },
      selectCamera(selected) {
        this.$store.commit("selectedCamera", selected[0].value);
      },
      toggleMirror(evt) {
        this.$store.commit('selfvideoMirror', evt.checked);
      },
      toggleAvatarVisible(evt) {
        this.avatarVisibleCameraOff = !evt.checked
        this.$store.commit('selfvideoAvatarVisible', this.avatarVisibleCameraOff);
      },
      onSelfviewChange(e){
        this.selfViewValue = e

        this.save()
      },
      save(){
        if (this.selfViewValue == 0) {
          this.$store.commit('selfVideoWithOthers', true);
          this.$store.commit('donotShowMySelf', false);
        } else if (this.selfViewValue == 1) {
          this.$store.commit('selfVideoWithOthers', false);
          this.$store.commit('donotShowMySelf', false);
        } else if (this.selfViewValue == 2) {
          this.$store.commit('donotShowMySelf', true);
        }
        this.$store.commit('selfvideoAvatarVisible', this.avatarVisibleCameraOff);
        //this.$emit('close'); 
      },
      close(){
        this.$emit('close'); 
      },


      openUserPortal(){
        this.close()

        const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
        const width = 1366
        const height = 860
        let x = (desktopRect.width - width)/2;
        let y = this.os === 'win' ? 
          (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

        this.$window.show(
          freesignup, 
          {
            defaultPage: 'userhub',
            defaultUserhubNav: 'Settings',
            settingsHasCalling: true,
          }, // component props
          {
            name: 'freesignup',
            w: width,
            h: height,
            x: x,
            y: y,
            isDraggable: true,
            isResizable: false,
            border: false,
            dragHandle: '.browser-header',
            
          }, // window props
          {
            closed: () => { },
          } // window eventlistener
        );
      },

      
    }

}
</script>

<style lang="scss">
#pop-settings {
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    user-select: none;
    box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
    height: 680px;
    overflow: hidden;

    .title {
      @include flex;
      width: 100%;
      height: 32px;
      flex-shrink: 0;

      .lb{
        margin: 0 16px;
        flex-grow: 1;
        font-size: 14px;
      }
      .close {
        @include flex;
        width: 20px;
        height: 30px;
        pointer-events: auto;
        cursor: default;
        margin-right: 10px;
      }
    }
    
    .mainbody {
      display: flex;
      height: 100%;

      .tabs {
        display: flex;
        flex-direction: column;
        width: 252px;
        margin: 0 4px;

        .tab {
          display: flex;
          align-items: center;
          width: calc(100% - 20px);
          margin-right: 20px;
          height: 40px;
          color: $md-gray-100;
          cursor: default;
          border-radius: 8px;

          .ico {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            svg path {
              fill: black;
            }
          }

          .lb {
            flex-grow: 1;
          }
          .arr {
            @include flex;
            width: 32px;
            height: 32px;

          }
        }
        .tab.selected {
          color: black;
          background: rgba($color: #000000, $alpha: .11);
        }
      }

      .contentarea{
        overflow: hidden;
        display: flex;
        flex-grow: 1;
        justify-content: center;
        border-radius: 12px 0 0 0;
      }

    }
    .mgt30 {
      margin-bottom: 30px;
    }
    .tit{
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .tit2{
      font-size: 20px;
      font-weight: normal;
    }

    .rw {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      justify-content: space-between;

      .lb {
        text-align: right;
        margin-right: 8px;
      }

      .lft {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        width: 220px;
        margin: 6px 12px 6px 0;

        .md-checkbox {
          margin: 0;
        }
      }
    }

/*
    .radiogrp {
      @include flex(column, flex-start);
      width: 100%;
      margin-top: 8px;
      margin-right: 20px;

      .itm {
        @include flex(row, flex-start);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-sizing: border-box;
        border-radius: 8px;
        width: 100%;
        height: 78px;
        margin-bottom: 8px;

        .md-radio__label {
          margin-left: 20px;
          flex-grow: 1;
        }

        svg {
          margin-right: 8px;
        }
      }
    }
*/

    .selfview {
      justify-content: flex-start;
    }
    .radiogrp {
      @include flex(column, space-between, flex-start);
      margin-top: 0;
      height: 88px;

      .itm {
        @include flex(column, flex-start, flex-start);
        margin-bottom: 0;
        box-sizing: border-box;
        width: 230px;

        .md-radio__label {
          flex-grow: 1;
        }
      }
    }

    .grpthumb {
      width: 130px;
      height: 88px;
    }

    .divider{
      margin: 16px 0 20px 0;
      border-bottom: 1px solid rgba($color: #FFF, $alpha: .2);
    }

    .link {
      color: $text-color-hyperlink-dark-ui;
      text-decoration: underline;
    }

    .mgn {
      margin-bottom: 20px;
    }
    .select .btn {
      height: 32px; 
      line-height: 14px;
    }

    #setting_preview_video {
      position: relative;
      width: 424px;
      height: 238px;
      overflow: hidden;
      border-radius: 8px;

      .ico-rotate {
        @include flex;
        position: absolute;
        width: 32px;
        height: 32px;
        top: 8px;
        right: 8px;
        box-sizing: border-box;
        background: #0F0F0F;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
      }
    }
    #setting_preview_camera {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: auto;
      transform: translate(-50%, -50%) scale(1, 1);

      &.mirror {
        transform: translate(-50%, -50%) scale(-1, 1);
      }
    }
    .lb-preview {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 0;
      width: 100%;
      height: 32px;
      background: rgba(0,0,0,0.4);
      color: #FFF;
      font-size: 14px

    }

    .scrollview {
      max-height: calc(630px - 4px);
      width: calc(100% - 4px);
      margin-top: 16px;
      margin-right: 4px;

      .scrollbody {
        margin: 4px 20px 20px 20px;
        padding-bottom: 20px;
      }
    }

    .virtualbg {
      @include flex(column, flex-start, flex-start);
      width: calc(424px + 16px + 16px);
      height: 210px;
      margin-top: 16px;
      margin-left: -8px;

      .tit2{
        @include flex;
        width: 100%;
        height: 32px;

        .lb {
          flex-grow: 1;
          margin-left: 10px;
        }

        .ico {
          margin-right: 8px;
        }


      }

      .vbgpanel {
        width: 424px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 20px;
        margin-bottom: 20px;

        .list{
          display: grid;
          grid-gap: 16px 20px;
          grid-template-columns: 90px 90px 90px 90px;
          grid-template-rows: 51px 51px;
          justify-items: center;
          align-items: center;
          margin: 16px 8px 0 0;
          padding-bottom: 12px;

          .itm {
            position:relative;
            width: 90px;
            height: 51px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-repeat: no-repeat;
            background-size: cover;
            background-color: #3B3B3B;
            box-sizing: border-box;
            user-select: none;

            .lb {
              font-size: 12px;
              height: 12px;
              line-height: 12px;
              margin-top: 1px;
            }

            &.border {
              border: 1px solid rgba($color: #000000, $alpha: .2);
            }

            .selected{
              position: absolute;
              border: 2px solid $md-blue-40;
              width: 98px;
              height: 59px;
              border-radius: 8px;
              box-sizing: border-box;
              
              z-index: 0;
            }

            .vd {
              position: absolute;
              left: 4px;
              bottom: 4px;
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

        .btns{
          width: 100%;
          display: flex;
          justify-content: flex-end;
          margin: 10px 0 15px 0;

          .dark {
            color: rgba(255,255,255,0.3); 
            background: rgba(255,255,255,0.05);
          }
          
        }

        
      }
    }
    .vbgbtn {
      margin-top: 8px;
      width: 100%;
      @include flex(row, flex-end);
    }


    .calling {
      position: relative;
      @include flex;
      flex-grow: 1;
      height: 100%;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-image: url(~@/assets/img/tmp-settings-calling.png);
      background-size: cover;

      
    }

    .appearance {
      @include flex;
      flex-grow: 1;
      height: 632px;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-image: url(~@/assets/img/tmp_settings_appearance.svg);
    }

    .bottom-btns {
      position: absolute;
      bottom: 0;
      right: 20px;
      width: 100%;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    &.mac {
      border-radius: 12px;
      overflow: hidden;
      transform: rotate(0deg);
    }

    /* theme ----- dark/hybrid */
    &.dark, &.hybrid {
      color: $text-color-primary-dark-ui;
      border: 1px solid rgba(255,255,255,.16);

      .tabs .tab {
        color: $md-gray-30;

        .ico {
          svg path {
            fill: white;
          }
        }
      }
      .tabs .tab.selected {
        background: rgba($color: #FFFFFF, $alpha: .11);
        color: white;;
      }
    }
    &.hybrid {
      .contentarea{
        color: $text-color-primary-light-ui;
      }
    }

    &.dark {

    }
    
}



</style>