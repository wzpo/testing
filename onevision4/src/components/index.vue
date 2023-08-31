<template>
  <div class="os-ui-root" @contextmenu.prevent="onContextmenu">
    <div id="desktop" :class="[os, theme]" v-if="!coverVisible || dev">

      <div id="screen1">
        
        <div v-if="os === 'win' && systemBarVisible" id="taskbar" >
          <div class="time" v-html="taskbarTime"></div>
          <div id="taskbar-item-webex" class="wbx tskitem" :class="{active: !selfSharing}" @click="toggleTeamsWindow">
            <div class="highlight"></div>
            <div class="badge">1</div>
          </div>
          <div v-if="browserIsOpen" class="edge tskitem" :class="{active: selfSharing}"></div>
        </div>

        <div 
          id="menubar" 
          v-if="os === 'mac' && systemBarVisible"
        >
          <svg class="apple-logo" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_1100_79508)">
            <path d="M12.861 4.55483C13.3623 3.95654 13.71 3.13997 13.71 2.31531C13.71 2.20212 13.7019 2.08893 13.6776 2C12.8772 2.03234 11.907 2.5336 11.3249 3.21273C10.8722 3.73017 10.4517 4.55483 10.4517 5.37948C10.4517 5.50884 10.4679 5.63012 10.4841 5.67054C10.5326 5.67863 10.6134 5.6948 10.6943 5.6948C11.4219 5.6948 12.3274 5.2097 12.861 4.55483ZM13.4351 5.86458C12.2223 5.86458 11.2441 6.6003 10.6134 6.6003C9.9424 6.6003 9.06923 5.91309 8.01819 5.91309C6.02122 5.91309 4 7.56241 4 10.667C4 12.6074 4.74381 14.6529 5.67357 15.9707C6.46589 17.0864 7.16119 18 8.15563 18C9.15008 18 9.58666 17.3451 10.8075 17.3451C12.0606 17.3451 12.3355 17.9838 13.4351 17.9838C14.5184 17.9838 15.238 16.9894 15.9171 16.0111C16.6852 14.8873 17.0005 13.7959 17.0167 13.7393C16.952 13.7231 14.8742 12.8742 14.8742 10.5053C14.8742 8.45174 16.5073 7.53007 16.5963 7.4573C15.5291 5.91309 13.8878 5.86458 13.4351 5.86458Z" fill="white"/>
            </g>
            <defs>
            <filter id="filter0_d_1100_79508" x="0" y="0" width="21.0166" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1100_79508"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1100_79508" result="shape"/>
            </filter>
            </defs>
          </svg>

          <span class="appname">{{appName}}</span>
          <span class="appmenu" v-html="appMenu"></span>

          <span class="macbar-right"></span>
        </div>

        <drag-resize
          v-if="selfSharing || sharePortionIsEditing" 
          id="ppt" 
          :w="1200"
          :h="726"
          :x="286"
          :y="130"
          :parentW="9999"
          :parentH="9999"
          :isDraggable="true"
          dragHandle=".ppt-header"
          :isResizable="false"
          :aspectRatio="false"
          :parentLimitation="true"
          :showHandle="false"
          :borderIsHandle="true"
          :class="{
            sharing_app_border: selfSharingContent === 'Microsoft Powerpoint',
          }"
          @activated="setActiveWindow('ppt')"
          @dragstop="updateSnapshot"
        >
          <div class="ppt-header"></div>
        </drag-resize>

        <drag-resize
          v-if="selfSharing || sharePortionIsEditing" 
          id="edge" 
          :w="1111"
          :h="678"
          :x="111"
          :y="50"
          :parentW="9999"
          :parentH="9999"
          :isDraggable="true"
          dragHandle=".edge-header"
          :isResizable="false"
          :aspectRatio="false"
          :parentLimitation="true"
          :showHandle="false"
          :borderIsHandle="true"
          :class="{
            sharing_app_border: selfSharingContent === 'Microsoft Edge',
          }"
          @activated="setActiveWindow('edge')"
          @dragstop="updateSnapshot"
        >
          <div class="edge-header"></div>
        </drag-resize>

      </div>

      <!--div id="powerpoint" v-if="selfSharing || popShareVisible" :style="{opacity: selfSharing && selfSharingContent === 'PowerPoint' ? 1 : 0}"></div-->
      <!--div id="desktop2" v-if="selfSharing || popShareVisible" :style="{opacity: selfSharing && selfSharingContent === 'Screen 2' ? 1 : 0}"></div-->
      
<!--
      <div v-if="!userTesting" class="theme-control">
        <div class="optrow">
          <div 
            v-for="(t, idx) in themes"
            :key="`theme-${idx}`"
            class="tb" 
            :class="{active: theme === t}" 
            @click="changeTheme(t)" 
          >{{capitalize(t)}}</div>
        </div>

        <div class="optrow">
          <div 
            v-for="(c, idx) in colors"
            :key="`color-${idx}`"
            class="tb" 
            :class="{active: themeColor === c}" 
            @click="changeColor(c)" 
          >{{capitalize(c)}}</div>
        </div>
      </div>
-->

      

<!--
      <div v-if="!userTesting" class="top-left-control" >
        <div class="tlb">Self view:</div>
        
        <div 
          class="tb" 
          :class="{active: selfViewOption === 2}" 
          @click="changeSelfviewOption(2)" 
        >Option A</div>

        <div 
          class="tb" 
          :class="{active: selfViewOption === 1}" 
          @click="changeSelfviewOption(1)" 
        >Option B</div>

      </div>
-->
<!--
      <div v-if="!userTesting" class="top-left-control" >
        <div class="tlb"></div>
        
        <div 
          class="tb" 
          :class="{active: peopleList.length === 12}" 
          @click="changePeopleNumber(12)" 
        >9 participants</div>

        <div 
          class="tb" 
          :class="{active: peopleList.length === 2}" 
          @click="changePeopleNumber(2)" 
        >2 participants</div>
        

        <div class="reaction-ctrl" @click="toggleReaction">
          <div class="toggle" :class="{on: autoPlayReactions}">
            <div class="dot"></div>
          </div>
          <div class="lb">
            Reactions
          </div>
        </div>

      </div>
-->

      <div v-if="!devicePaired && meetingOptionsList.length" class="options-control" >
        <div class="optrow">
          <div 
            class="tb" 
            @click="shareAdd(defaultWebexMeetingId)" 
          >Share +1</div>
          <div 
            class="tb" 
            @click="shareRemove(defaultWebexMeetingId)" 
          >Share -1</div>
<!--
          <div 
            class="tb" 
            @click="appAdd(defaultWebexMeetingId)" 
          >App +1</div>
          <div 
            class="tb" 
            @click="appRemove(defaultWebexMeetingId)" 
          >App -1</div>
-->
        </div>

      </div>


      <div id="windows-container-root"></div>

<!--
      <cc-box v-if="meetingOptionsList.length && closedCaptionEnabled && !sharePortionIsEditing"></cc-box>
-->

      <div 
        v-if="sharePortionIsEditing" 
        id="portion-layer" 
        ref="portionlayer" 
        :style="{
          pointerEvents: !selfSharing ? 'auto' : 'none'
        }"
        @mouseenter="mousemovehandler"
        @mousemove="mousemovehandler"
        @mousedown="mousedownhandler"
      >
        <div v-if="!selfSharing" class="portionmodal" :style="portionStyleObject" ></div>

        <div 
          v-if="!portionRectCreated || previewAppSelected" 
          class="portionselectionlayer" 
          ref="portionselectionlayer" 
        >
          <div 
            class="rect" 
            :class="{
              preview: previewAppSelected,
              selection: !portionRectCreated && !previewAppSelected,
            }"
            :style="{
              left: `${portionSelectionRect.left}px`,
              top: `${portionSelectionRect.top}px`,
              width: `${portionSelectionRect.width}px`,
              height: `${portionSelectionRect.height}px`,
              opacity: portionSelectionRect.opacity,
            }"
          >
            <div 
              class="coordlabel" 
              :style="{
                top: portionSelectionRect.top > 30 ? '-30px' : '4px',
                left: portionSelectionRect.right + portionSelectionRect.width < 430 && rectInvalid ? 'auto' : '0',
                right: portionSelectionRect.right + portionSelectionRect.width < 430 && rectInvalid ? '0' : 'auto',
              }" >
              {{`${Math.round(portionSelectionRect.width)}x${Math.round(portionSelectionRect.height)}px`}} {{rectInvalid ? ', the width and height of the should be larger than 80px.' : ''}}
            </div>
            
          </div>
        </div>

        <drag-resize
          v-if="portionRectCreated" 
          id="portioneditlayer" 
          ref="portioneditlayer"
          :w="portionSelectionRect.width"
          :h="portionSelectionRect.height"
          :x="portionSelectionRect.left"
          :y="portionSelectionRect.top"
          :minw="80"
          :minh="80"
          :isDraggable="true"
          :isResizable="true"
          :aspectRatio="false"
          :parentLimitation="true"
          :showHandle="true"
          :borderIsHandle="false"
          :isActive="true"
          :class="{
            sharingborder: selfSharing && !portionSelectionIsResizing && !portionSelectionIsDragging,
            editingborder: selfSharing && (portionSelectionIsResizing || portionSelectionIsDragging),
          }"
          @resizing="onPortionResizing"
          @resizestop="onPortionResizeStop"
          @dragging="onPortionDragging"
          @dragstop="onPortionDragStop"
        >
          <div 
            v-if="!selfSharing" 
            class="coordlabel" 
            :style="{
              top: portionSelectionRect.top > 30 ? '-30px' : '4px',
              left: portionSelectionRect.right + portionSelectionRect.width < 430 && rectInvalid ? 'auto' : '0',
              right: portionSelectionRect.right + portionSelectionRect.width < 430 && rectInvalid ? '0' : 'auto',
            }" >
            {{`${Math.round(portionSelectionRect.width)}x${Math.round(portionSelectionRect.height)}px`}} {{rectInvalid ? ', the width and height of the should be larger than 80px.' : ''}}
          </div>
          <div 
            v-show="!selfSharing && portionShareBtnVisible" 
            class="btns" 
            :style="{
              bottom: portionSelectionRect.bottom > 52 ? '-52px' : '8px',
              left: portionSelectionRect.left < 90 ? '0' : 'auto',
              right: portionSelectionRect.left < 90 ? 'auto' : '0',
            }" >
            <md-button class="btn md-button-solid" aria-label="x" :size="28" @click="sharePortionSelection">Share</md-button>
            <md-button class="btn md-button-outline" aria-label="x" :size="28" @click="closePortionSelection">Cancel</md-button>
          </div>
        </drag-resize>

        <div 
          v-show="!portionRectCreated || portionSelectionIsResizing" 
          class="magnifier" 
          ref="magnifier" 
          :style="{
            left: `${magnifierInfo.left}px`,
            top: `${magnifierInfo.top}px`,
          }"
        >
          <div class="top" >
            <div 
              class="img" 
              ref="magnifierimg" 
              :style="{
                left: `${magnifierInfo.imgleft}px`,
                top: `${magnifierInfo.imgtop}px`,
              }"
            ></div>
            <svg class="cross" width="101" height="89" viewBox="0 0 101 89" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="44" width="101" height="1" fill="#3CC29A"/>
              <rect x="50" width="1" height="89" fill="#3CC29A"/>
            </svg>
          </div>
          <div class="bot" >
            {{`X,Y: (${Math.round(magnifierInfo.x)},${Math.round(magnifierInfo.y)})`}}
          </div>
        </div>

        <div v-if="!selfSharing" class="infolayer">
          <div class="tip">
            <span>Select portion of the screen to share</span>
          </div>
        </div>
        
      </div>

      <div id='popover'>
        <self-video v-if="(selfSharing && immersiveShare) || popShareVisible" v-show="selfSharing && (cameraOn || selfvideoAvatarVisible && selfViewOption === 1) && immersiveShare && immersiveVideoVisible && !donotShowMySelf"></self-video>
      </div>

    </div>

    <div class="sharing_border" :class="{green: screenSelected}" v-if="screenSelected === '1' || selfSharing === 'screen'"></div>
    <div class="screen_number" v-if="screenSelected === '1'">
      {{screenSelected}}
    </div>
    <pip v-if="selfSharing" style="z-index: 123456789999;"></pip>
    <fit v-if="selfSharing" :type="sharingApp || 'desktop'" style="z-index: 123456789998;"></fit>


    <div 
      v-if="coverVisible && !dev && !userTesting && invalidBrowserSize" 
      class="invalidsize flash" 
      :class="invalidBrowserSizeDirection"
    >

    </div>
    <div v-if="coverVisible && !dev && !userTesting" id="prototype-cover-page" >
      <div class="alert" v-if="invalidBrowser">
        This testing prototype may not work properly on your browser. Please use
        <a href="https://www.google.com/chrome" target="_blank" class="link">Google Chrome</a>.
      </div>
      <div v-if="invalidBrowserSize" class="alert" v-html="invalidBrowserSize"></div>
      

      <div class="wrap">

        <div class="top">
          <div class="title-wbx">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.984977 5.44832L5.57164 0.793319C5.6026 0.762327 5.63936 0.737741 5.67983 0.720966C5.7203 0.704191 5.76367 0.695557 5.80748 0.695557C5.85128 0.695557 5.89466 0.704191 5.93512 0.720966C5.97559 0.737741 6.01235 0.762327 6.04331 0.793319L6.98998 1.73165C7.02097 1.76261 7.04556 1.79937 7.06233 1.83984C7.0791 1.88031 7.08774 1.92368 7.08774 1.96749C7.08774 2.01129 7.0791 2.05467 7.06233 2.09513C7.04556 2.1356 7.02097 2.17236 6.98998 2.20332L3.33331 5.91999L6.89498 9.57499C6.92597 9.60594 6.95055 9.64271 6.96733 9.68317C6.9841 9.72364 6.99274 9.76701 6.99274 9.81082C6.99274 9.85462 6.9841 9.898 6.96733 9.93847C6.95055 9.97893 6.92597 10.0157 6.89498 10.0467L5.94331 10.9833C5.91235 11.0143 5.87559 11.0389 5.83512 11.0557C5.79466 11.0724 5.75128 11.0811 5.70748 11.0811C5.66367 11.0811 5.6203 11.0724 5.57983 11.0557C5.53936 11.0389 5.5026 11.0143 5.47164 10.9833L0.98331 6.38499C0.860376 6.26 0.79162 6.09162 0.791932 5.91631C0.792244 5.741 0.861598 5.57287 0.984977 5.44832Z" fill="white"/>
            </svg>
            <span>WebexPrototype</span>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.69666 0.518232L4.98456 0.863323C5.19921 0.920839 5.27778 1.05692 5.22026 1.27157L1.95008 13.476C1.89257 13.6907 1.75648 13.7693 1.54183 13.7117L0.253934 13.3667C0.0392838 13.3091 -0.0392837 13.1731 0.0182316 12.9584L3.28841 0.753934C3.34593 0.539284 3.48201 0.460716 3.69666 0.518232Z" fill="white"/>
              <path d="M11.7863 7.6411L7.2013 12.2894C7.17034 12.3204 7.13358 12.345 7.09311 12.3618C7.05265 12.3786 7.00927 12.3872 6.96547 12.3872C6.92166 12.3872 6.87829 12.3786 6.83782 12.3618C6.79735 12.345 6.76059 12.3204 6.72963 12.2894L5.7863 11.3528C5.75531 11.3218 5.73072 11.285 5.71395 11.2446C5.69717 11.2041 5.68854 11.1607 5.68854 11.1169C5.68854 11.0731 5.69717 11.0297 5.71395 10.9893C5.73072 10.9488 5.75531 10.9121 5.7863 10.8811L9.45297 7.16276L5.87797 3.5061C5.81588 3.44364 5.78104 3.35916 5.78104 3.2711C5.78104 3.18303 5.81588 3.09855 5.87797 3.0361L6.82797 2.09776C6.85892 2.06677 6.89569 2.04218 6.93615 2.02541C6.97662 2.00863 7.01999 2 7.0638 2C7.1076 2 7.15098 2.00863 7.19145 2.02541C7.23191 2.04218 7.26868 2.06677 7.29963 2.09776L11.7863 6.6961C11.8485 6.75804 11.8979 6.83167 11.9316 6.91276C11.9653 6.99384 11.9827 7.08079 11.9827 7.1686C11.9827 7.2564 11.9653 7.34335 11.9316 7.42444C11.8979 7.50552 11.8485 7.57915 11.7863 7.6411Z" fill="white"/>
            </svg>
          </div>
        </div>

        <div class="middle">
          <div class="title">
            <div class="line1">{{prototypeType}}</div>
            <div class="line2">{{prototypeName}}</div>
          </div>

          <div class="username">
            <input
              label=""
              htmlId="username"
              placeholder="Enter your name"
              :value="selfname"
              inputClassName="md-input--dark"
              class="username-input"
              @input="changeSelfNameHandler"
            />
            <div class="label">Your name</div>
            <md-avatar 
              v-if="selfavatarVisible"
              :title="me.name" 
              :src="$store.state.avatarPath + me.avatar" 
              :size="32" 
              class="avatar"/>
          </div>
          <!--
          <div class="optionitem dark">
            <span class="lb" >Show lobby</span>
            <md-toggle-switch label="" htmlId="lobby" class="toggle-switch-m" :checked="lobbyOn" @change="toggleLobby"></md-toggle-switch>
          </div>

          <div class="optionitem dark">
            <span class="lb" >Simultaneous interpretation</span>
            <md-toggle-switch label="" htmlId="si" class="toggle-switch-m" :checked="siOn" @change="toggleSI"></md-toggle-switch>
          </div>
          -->
          <div class="optionitem dark">
            <span class="lb" >Run prototype in full screen</span>
            <md-toggle-switch label="" htmlId="fullscreen" class="toggle-switch-m" :checked="windowsMode === 'fullscreen'" @change="toggleFullscreen"></md-toggle-switch>
          </div>
          
          <div class="buttons">

            <div v-if="!go2page || (go2page === 'full' || go2page === '1stcolumn')" class="btngrp" >
              <md-button
                aria-label="button"
                class="btn md-button--blue"
                @click="start({
                  os: 'win', 
                  theme: 'dark', 
                  role: 'attendee', 
                  teamsNavLayout: 'full', 
                  teamsNav: 'messaging', 
                  showNavLogo: false,
                })"
              >
                <span class="lb">Enterprise full workload</span>
                <div v-if="!go2page" class="spacer"></div>
              </md-button>
              <div v-if="!go2page" class="btnico" v-tooltip="'Copy link'" @click="copylink($event, 'full')"><wl-icon name="link-bold" size="16" /></div>
            </div>

            <div v-if="!go2page || go2page === 'calling'" class="btngrp" >
              <md-button
                aria-label="button"
                class="btn md-button--blue"
                @click="start({
                  os: 'win', 
                  theme: 'dark', 
                  role: 'attendee', 
                  teamsNavLayout: 'calling', 
                  teamsNav: 'calling', 
                })"
              >
                <span class="lb">Calling only</span>
                <div v-if="!go2page" class="spacer"></div>
              </md-button>
              <div v-if="!go2page" class="btnico" v-tooltip="'Copy link'" @click="copylink($event, 'calling')"><wl-icon name="link-bold" size="16" /></div>
            </div>



            <div v-if="go2page && go2page.toUpperCase() === 'AI'" class="btngrp" >
              <md-button
                aria-label="button"
                class="btn md-button--blue"
                @click="start({
                  os: 'win', 
                  theme: 'dark', 
                  role: 'attendee', 
                  teamsNavLayout: 'full', 
                  teamsNav: 'messaging', 
                  showNavLogo: false,
                  inMeeting: false,
                })"
              >
                <span class="lb">Start</span>
              </md-button>
            </div>

            <div v-if="go2page === 'sli'" class="btngrp" >
              <md-button
                aria-label="button"
                class="btn md-button--blue"
                @click="start({
                  os: 'mac', 
                  theme: 'dark', 
                  role: 'attendee', 
                  teamsNavLayout: 'full', 
                  teamsNav: 'messaging', 
                  showNavLogo: false,
                  inMeeting: false,
                  sliOption: 2,
                  sliRole: 'host',
                })"
              >
                <span class="lb">Host</span>
              </md-button>
            </div>

            <div v-if="go2page === 'sli'" class="btngrp" >
              <md-button
                aria-label="button"
                class="btn md-button--blue"
                @click="start({
                  os: 'mac', 
                  theme: 'dark', 
                  role: 'attendee', 
                  teamsNavLayout: 'full', 
                  teamsNav: 'messaging', 
                  showNavLogo: false,
                  inMeeting: false,
                  sliOption: 2,
                  sliRole: 'hhuser',
                })"
              >
                <span class="lb">Hard of hearing user</span>
              </md-button>
            </div>

            <div v-if="go2page === 'sli'" class="btngrp" >
              <md-button
                aria-label="button"
                class="btn md-button--blue"
                @click="start({
                  os: 'mac', 
                  theme: 'dark', 
                  role: 'attendee', 
                  teamsNavLayout: 'full', 
                  teamsNav: 'messaging', 
                  showNavLogo: false,
                  inMeeting: false,
                  sliOption: 2,
                  sliRole: 'sli',
                })"
              >
                <span class="lb">Sign Language Interpreter</span>
              </md-button>
            </div>




          </div>


          <div class="instruction">
            <!--
            <div>
              * Press
              <b>Alt+A</b> (Win) /
              <b>Option+A</b> (Mac) to add participants.
            </div>

            <div>
              * Press
              <b>Alt+R</b> (Win) /
              <b>Option+R</b> (Mac) to remove participants.
            </div>

            <div>
              * Press
              <b>Alt+S</b> (Win) /
              <b>Option+S</b> (Mac) to start sharing.
            </div>
            -->
          </div>

        </div><!--middle-->

        <div class="bottom">
          <span class="lb">Author: Lin Wang &lt;linwa3@cisco.com&gt;</span>
          <wl-icon name="dot-divider" size="4" class="dot-divider" />
          <span class="lb">Build Time: {{buildTime}}</span>
          <wl-icon name="dot-divider" size="4" class="dot-divider" />
          <span class="lb">Data Classification: Cisco Confidential</span>
        </div>
      </div>

      <tip-message 
        :label="notification"
        :show="showNotification" 
        class="notification"
      ></tip-message>
    </div>

    <div class="preload">
      <div class="logo-animated"></div>
    </div>

    

  </div>
</template>

<script>

import validateBrowser from "../utils/validateBrowser";
import getQueryString from '../utils/getQueryString';
import moment from 'moment';
import popSettings from './shared/pop-settings.vue';
import _ from 'lodash'
import capitalize from 'lodash/capitalize'
import cloneDeep from 'lodash/cloneDeep'
import random from 'lodash/random'
import forEach from 'lodash/forEach'
import html2canvas from 'html2canvas';
import mframe from 'mframe';

import browser from './browser';
import teamsapp from './teams-app';
import interstitial from './interstitial';
import meetingsapp from './meetings-app';
import recordingplayer from './teams/recording-player';
import teammeetingdetails from './teams/team-meeting-details.vue'

/*
import joinfromwebexcom from './onboarding/joinfromwebexcom';
import joinbylink from './onboarding/joinbylink';
import freesignup from './onboarding/freesignup';
import signin from './signin';
*/


export default {
  name: "Index",
  data() {
    return {
      defaultWebexMeetingId: 'webex-meeting',
      go2page: null,
      invalidBrowser: false,
      invalidBrowserSize: false,
      invalidBrowserSizeDirection: '',
      coverVisible: true,
      selfname: '',
      edgeHeight: 768,
      windowsMode: 'windows',
      taskbarTime: '',

      zindex: 5,
      portionSelectionMouseStartPoint: {},
      portionSelectionMouseEndPoint: {},
      portionSelectionRect:{
        left: 5000,
        top: 5000,
        right: 5000,
        bottom: 5000,
      },
      magnifierInfo: {
        left: 0,
        top: 0,
        x:0,
        y:0,
      },
      magnifierRatio: 8,
      portionMouseDown: false,
      previewAppSelected: false,
      portionRectCreated: false,
      selectedPortionAppElement: null,
      portionShareBtnVisible: true,
      portionSelectionIsResizing: false,
      portionSelectionIsDragging: false,

      notification: '',
      showNotification: false,

      selfavatarVisible: false,

      defaultPeopleList: [],


      // teams-app ###
      TEAMS_WINDOW_NAME: 'teams',
      teamsWindowWidth: 1200,
      teamsWindowLastPosition: {},
      teamsWindowHeight: 720,
      TEAMS_MIN_HEIGHT: 670,

      MEETINGS_DEFAULT_WIDTH: 1280,
      MEETINGS_DEFAULT_HEIGHT: 720,

      MEETINGS_CALL_WIDTH: 796,
      MEETINGS_CALL_HEIGHT: 530,

    };
  },
  beforeMount() {
    this.defaultPeopleList = _.cloneDeep(this.peopleList)
  },
  mounted() {
    document.title = `${this.prototypeName}`

    this.initResizeWatch();

    if (!validateBrowser()) {
      this.invalidBrowser = true;
    }

    const ut = getQueryString('ut');
    if (ut) {
      this.$store.commit('userTesting', ut);
    }
    const gotopage = getQueryString('go');
    if (gotopage) {
      this.go2page = gotopage;
    }

    const dev = getQueryString('dev');
    if (dev) {
      this.$store.commit('dev', dev);
    }

    const theme = getQueryString('theme');
    if (['light', 'hybrid', 'dark'].indexOf(theme) > -1) {
      this.$store.commit('theme', theme);
    }

    const os = getQueryString('os');
    if (['mac', 'win'].indexOf(os) > -1) {
      this.$store.commit('os', os);
    }

    const lsname = localStorage.getItem('selfname');
    if (lsname) {
      this.setSelfName(lsname);
    } else {
      this.setSelfName(this.me.name);
    }

    this.startTimer();

    // create phone numbers for peopleList
    var lists = {
      peopleList: this.peopleList, 
      peopleNotJoinedList: this.peopleNotJoinedList, 
      peopleWaiting: this.peopleWaiting,
    };

    forEach(lists, (value, key) => {
      let list = value
      let plist = [];
      const len = list.length;
      for (let i = 0; i < len; i++) {
          const p = list[i];
          if(!p.isroom) {
            p.numbers = [
              `Work: +1 ${random(111, 999)}-${random(111, 999)}-${random(1111, 9999)}`,
              `Mobile: +1 ${random(111, 999)}-${random(111, 999)}-${random(1111, 9999)}`,
            ];
            p.callasIndex = i % 3
          }
          plist.push(p);
      }
      this.$store.commit(key, plist);
    });

    // AI
    if (this.go2page && this.go2page.toUpperCase() === 'AI') {
      let ptname = 'Sidecar and AI'
      document.title = ptname
      this.$store.commit('prototypeName', ptname);
      this.$store.commit('aiEnabled', true);
      this.$store.commit('activeSpaceId', null);
    }

    // 手语
    if (this.go2page === 'sli') {
      let ptname = 'Sign Language Interpretation video position'
      document.title = ptname
      this.$store.commit('prototypeName', ptname);
      this.$store.commit('activeSpeakerInStage', true);
      this.$store.commit('siEnabled', true);
      this.$store.commit('sliEnabled', true);
    }

    window.addEventListener('keydown', this.onKeydown);


    this.$eventBus.$on('open-new-meeting-window', (options, windowParams) => {
      this.openMeeting(options, windowParams)
    });
    this.$eventBus.$on('open-team-window', (options, windowParams) => {
      this.openTeams(options, windowParams)
    });
    this.$eventBus.$on('open-signin-window', (options, windowParams) => {
      this.openSignin(options, windowParams)
    });
    this.$eventBus.$on('open-recording-player-window', (options, windowParams) => {
      this.openRrecordingPlayer(options, windowParams)
    });
    this.$eventBus.$on('open-meeting-info-window', (options, windowParams) => {
      this.openMeetingInfo(options, windowParams)
    });

    

  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  computed: {
    localhost() {
      return window.location.hostname === 'localhost'
    },
    buildTime() {
      // console.log("APP_VERSION: " + process.env.APP_VERSION);
      let timestamp = process.env.BUILD_TIME;
      if (!isNaN(timestamp)) {
        return moment(Number(timestamp)).format();
      } else {
        return '-';
      }
    },
    userTesting() {
      return this.$store.state.userTesting;
    },
    prototypeType() {
      return this.$store.state.prototypeType;
    },
    prototypeName() {
      return this.$store.state.prototypeName;
    },
    autoPlayReactions() {
      return this.$store.state.autoPlayReactions;
    },
    dev() {
      return this.$store.state.dev;
    },
    participantType() {
      return this.$store.state.participantType;
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
    themes() {
      return Object.keys(this.themeColorList);
    },
    colors() {
      return Object.keys(this.themeColorList['dark']);
    },
    portionStyleObject() {
      return {
        '--portion-rect-padding-left': `${this.portionSelectionRect.left}px`,
        '--portion-rect-padding-right': `${this.portionSelectionRect.right}px`,
        '--portion-rect-padding-top': `${this.portionSelectionRect.top}px`,
        '--portion-rect-padding-bottom': `${this.portionSelectionRect.bottom}px`,
      };
    },
    systemBarVisible() {
      return this.$store.state.systemBarVisible;
    },
    windowMinimized() {
      return this.$store.state.windowMinimized;
    },

    hidePeopleWithoutVideo() {
      return this.$store.state.hidePeopleWithoutVideo;
    },
    activeSpeaker() {
      return this.$store.getters.activeSpeaker;
    },
    activeSpeakerName() {
      return this.$store.state.activeSpeakerName;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    peopleNotJoinedList() {
      return this.$store.state.peopleNotJoinedList;
    },
    peopleWaiting() {
      return this.$store.state.peopleWaiting;
    },
    peopleSI() {
      return this.$store.state.peopleSI;
    },
    me(){
      return this.$store.getters.me
    },
    selfSharing() {
      return this.$store.state.selfSharing;
    },
    sharePortionIsEditing() {
      return this.$store.state.sharePortionIsEditing;
    },
    screenSnapshotCanvas() {
      return this.$store.state.screenSnapshotCanvas;
    },
    screenSharingPortionRect() {
      return this.$store.state.screenSharingPortionRect;
    },
    sharingApp() {
      return this.$store.state.sharingApp;
    },
    screenSelected() {
      return this.$store.state.screenSelected;
    },
    miroLocation() {
      return this.$store.state.miroLocation;
    },
    immersiveShare() {
      return this.$store.state.immersiveShare;
    },
    immersiveVideoVisible() {
      return this.$store.state.immersiveVideoVisible;
    },
    selfViewOption() {
      return this.$store.state.selfViewOption;
    },
    donotShowMySelf() {
      return this.$store.state.donotShowMySelf;
    },
    cameraOn() {
      return this.$store.state.cameraOn;
    },
    selfvideoAvatarVisible() {
      return this.$store.state.selfvideoAvatarVisible;
    },
    popShareVisible() {
      return this.$store.state.popShareVisible;
    },
    interstitialParams() {
      return this.$store.state.interstitialParams;
    },
    browserIsOpen() {
      return this.$store.state.browserIsOpen;
    },
    browserVisible() {
      return this.$store.state.browserVisible;
    },

    teamsWindowMinimized() {
      return this.$store.state.teamsWindowMinimized;
    },

    devicePaired() {
      return this.$store.state.devicePaired;
    },

    fullscreen() {
      return this.$store.state.fullscreen;
    },
    videoAndShareContentSwapped() {
      return this.$store.state.videoAndShareContentSwapped;
    },
    selfSharingContent() {
      return this.$store.state.selfSharingContent;
    },
    popSettingsVisible() {
      return this.$store.state.popSettingsVisible;
    },
    callAs() {
      return this.$store.state.callAs;
    },
    callAsList() {
      return this.$store.state.callAsList;
    },

    appName () {
      if (this.interstitialParams && this.interstitialParams.visible || this.meetingOptionsList.length) {
        return 'Webex';
      } else if (this.browserVisible) {
        return 'Chrome';
      }
      return 'Finder';
    },
    appMenu () {
      if (!this.interstitialParams || !this.interstitialParams.visible && this.meetingOptionsList.length === 0) {
        return `
          <div class="itm">File</div>
          <div class="itm">Edit</div>
          <div class="itm">Format</div>
          <div class="itm">View</div>
          <div class="itm">History</div>
          <div class="itm">Conversation</div>
          <div class="itm">Window</div>
          <div class="itm">Help</div>
        `;
      } else if (this.interstitialParams && this.interstitialParams.visible || this.meetingOptionsList.length) {
        return `
          <div class="itm">File</div>
          <div class="itm">Edit</div>
          <div class="itm">Share</div>
          <div class="itm">View</div>
          <div class="itm">Audio</div>
          <div class="itm">Participant</div>
          <div class="itm">Meeting</div>
          <div class="itm">Window</div>
          <div class="itm">Help</div>
        `;
      } else if (this.browserVisible) {
        return `
          <div class="itm">File</div>
          <div class="itm">Edit</div>
          <div class="itm">View</div>
          <div class="itm">History</div>
          <div class="itm">Bookmarks</div>
          <div class="itm">People</div>
          <div class="itm">Window</div>
          <div class="itm">Help</div>
        `;
      }
      return '';
    },

    rectInvalid() {
      return Math.round(this.portionSelectionRect.width) <= 80 || Math.round(this.portionSelectionRect.height) <= 80;
    },
    closedCaptionEnabled() {
      return this.$store.state.closedCaptionEnabled;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    videoInStageSortIndex() {
      return this.$store.state.videoInStageSortIndex;
    },
    

  },
  watch: {
    interstitialParams(newVal) {
      if(newVal && newVal.visible) {
        this.openInterstitial(newVal)
      }
    },
    teamsWindowMinimized(newVal) {
      this.toggleTeamsWindowMinimized(newVal)
    },
    popSettingsVisible(newVal) {
      if (newVal) {
        this.$modal.show(
          popSettings, 
          {}, // component props
          {
            clickToClose: false,
            frameless: true,
            shadow: true,
            resizable: false,
            draggable: '#pop-settings-titlebar',
            overlayVisible: true,
            overlayTransparent: 0,
            theme: this.theme,
            roundedCorner: this.os === 'mac',
            width: 788,
            height: 680,
            shiftY: 0.45,
            transition: true,
          }, // modal props
          {
            closed: () => { this.$store.commit("popSettingsVisible", false); }
          } // modal eventlistener
        );
      }
      
    },

    selfSharing(val) {
      if (val) {
        const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
        this.edgeHeight = Math.min(768, desktopRect.height - 70);
        this.edgeX = (desktopRect.width - 1111)/2;
      }
    },

    meetingOptionsList(val, oldVal) {
      let optionsList = val.slice()
      for(var i=0; i<val.length; i++){
        var meeting = val[i]
        var oldmeeting = oldVal[i]
        var instage = meeting.currentSharing.filter(itm => !itm.popped).length
        var oldinstage = oldmeeting ? oldmeeting.currentSharing.filter(itm => !itm.popped).length : 0
        if (instage !== oldinstage) {
          if (instage === 0) {
            if (meeting.videoLayout === 'stage-sharing') {
              optionsList[i].videoLayout = 'stage'
              this.$store.commit('meetingOptionsList', optionsList);
            }
          } else {
            if (meeting.videoLayout === 'stage') {
              optionsList[i].videoLayout = 'stage-sharing'
              this.$store.commit('meetingOptionsList', optionsList);
            }
          }
        }
      }
    },

    sharePortionIsEditing(newVal) {
      if (newVal) {
        
        this.portionRectCreated = false
        this.portionSelectionRect = {
          left: 5000,
          top: 5000,
          right: 5000,
          bottom: 5000,
        }

        this.createDefaultPortionRect()

        setTimeout(() => {
          this.captureScreen()
          this.setMagnifier()
        }, 500)
        
      } else {
        //
      }
    },

  },
  methods: {
    initResizeWatch() {
      // watch resize
      const cover = document.getElementById('prototype-cover-page');
      const elem = document.body;
      let resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
              if (entry.contentRect) {
                  if (cover) {
                    const rect = cover.getBoundingClientRect();
                    if (rect.width > entry.contentRect.width && rect.height > entry.contentRect.height) {
                      this.invalidBrowserSize = 'Please increase the size of your browser window to have a better experience.'
                      this.invalidBrowserSizeDirection = ''
                    } else if (rect.width > entry.contentRect.width) {
                      this.invalidBrowserSize ='Please increase the&nbsp;<b>width</b>&nbsp;of your browser window to have a better experience.'
                      this.invalidBrowserSizeDirection = 'h'
                    } else if (rect.height > entry.contentRect.height) {
                      this.invalidBrowserSize ='Please increase the&nbsp;<b>height</b>&nbsp;of your browser window to have a better experience.'
                      this.invalidBrowserSizeDirection = 'v'
                    } else {
                      this.invalidBrowserSize = false
                    }
                    
                  } else {
                    resizeObserver.unobserve(elem);
                  }
              }
          }
      });
      resizeObserver.observe(elem);
    },
    startTimer() {
      setInterval(() => {
        this.taskbarTime = `${moment().format('LT')}<br>${moment().format('L')}`
      }, 1000);
    },
    changeSelfNameHandler(e){
      this.setSelfName(e.target.value);
    },

    setSelfName(name){
      let plist = [];
      let defaultplist = _.cloneDeep(this.defaultPeopleList);

      const len = defaultplist.length;
      for (let i = 0; i < len; i++) {
          const p = defaultplist[i];
          if (p.me) {
              p.name = name || this.me.name;
              this.selfname = name;
              localStorage.setItem('selfname', name);
              if (name.toLowerCase().indexOf('amit') > -1) {
                p.avatar = 'cisco-amit.png'
                this.selfavatarVisible = true
              } else if (name.toLowerCase().indexOf('jeetu') > -1) {
                p.avatar = 'cisco-jeetu.png'
                this.selfavatarVisible = true
              } else if (name.toLowerCase().indexOf('javed') > -1) {
                p.avatar = 'cisco-javed.png'
                this.selfavatarVisible = true
              } else if (name.toLowerCase().indexOf('anurag') > -1) {
                p.avatar = 'cisco-anurag.png'
                this.selfavatarVisible = true
              } else if (name.toLowerCase().indexOf('travis') > -1) {
                p.avatar = 'cisco-travis.png'
                this.selfavatarVisible = true
              } else if (name.toLowerCase().indexOf('wen jiang') > -1) {
                p.avatar = 'cisco-wen.png'
                this.selfavatarVisible = true
              } else {
                this.selfavatarVisible = false
              }
          }

          
          plist.push(p);
      }

      if (name.toLowerCase().indexOf('javed') > -1) {
        //javed 测试时，peoplelist里的javed换成amit，close video
        for(let j=0; j<len; j++) {
          const p2 = plist[j];
          if(p2.name === 'Javed Khan' && !p2.me) {
            plist[j].name = 'Amit Barave'
            plist[j].avatar = 'cisco-amit.png'
            plist[j].video = null
          }
        }
      }
      if (name.toLowerCase().indexOf('anurag') > -1) {
        //anurag 测试时，peoplelist里的javed换成amit，close video
        for(let j=0; j<len; j++) {
          const p2 = plist[j];
          if(p2.name === 'Anurag Dhingra' && !p2.me) {
            plist[j].name = 'Amit Barave'
            plist[j].avatar = 'cisco-amit.png'
            plist[j].video = null
          }
        }
      }
      if (name.toLowerCase().indexOf('wen') > -1) {
        //anurag 测试时，peoplelist里的javed换成amit，close video
        for(let j=0; j<len; j++) {
          const p2 = plist[j];
          if(p2.name === 'Wen Jiang' && !p2.me) {
            plist[j].name = 'Amit Barave'
            plist[j].avatar = 'cisco-amit.png'
            plist[j].video = null
          }
        }
      }
      if (name.toLowerCase().indexOf('travis') > -1) {
        //anurag 测试时，peoplelist里的javed换成amit，close video
        for(let j=0; j<len; j++) {
          const p2 = plist[j];
          if(p2.name === 'Travis Isaacs' && !p2.me) {
            plist[j].name = 'Amit Barave'
            plist[j].avatar = 'cisco-amit.png'
            plist[j].video = null
          }
        }
      }

      this.$store.commit('peopleList', plist);
      
      //
      var callaslst = this.callAsList.slice()
      //callaslst[0].label = name
      //this.$store.commit('callAsList', callaslst);
      this.$store.commit('callAs', callaslst[0]);
    },

    start(params) {

      this.$store.commit('os', params.os);
      this.$store.commit('theme', params.theme);
      this.$store.commit('teamsNavLayout', params.teamsNavLayout);
      this.$store.commit('teamsNav', params.teamsNav);

      if (params.teamsNavExpanded) {
        this.$store.commit('teamsNavExpanded', params.teamsNavExpanded);
      }
      if (params.showNavLogo !== undefined) {
        this.$store.commit('showNavLogo', params.showNavLogo);
      }
      if (params.sliOption !== undefined) {
        this.$store.commit('sliOption', params.sliOption)

        if (params.sliOption == 2) {
          this.$store.commit('signLanguageVideoPosition', 'after-selfvideo')
        }
      }
      if (params.sliRole !== undefined) {
        this.$store.commit('sliRole', params.sliRole)
      }
      
      if (params.role === 'host') {
        let lst = this.peopleNotJoinedList.slice();
        for (let i=0;i <lst.length; i++) {
          if (lst[i].host) {
            lst[i].host = false;
            break;
          }
        }
        this.$store.commit('peopleNotJoinedList', lst);

        lst = this.peopleList.slice();
        for (let i=0;i <lst.length; i++) {
          if (lst[i].host) {
            lst[i].host = false;
            break;
          }
        }
        lst[0].host = true;
        this.$store.commit('peopleList', lst);

      } else { // attendee
        //const p = this.peopleNotJoinedList.splice(0);
        //const lst = this.peopleList.concat(p);
        this.$store.commit('selfVideoWithOthers', true);
        //this.$store.commit('peopleNotJoinedList', this.peopleNotJoinedList);
        //this.$store.commit('peopleList', lst);

      }

      if (this.windowsMode === 'fullscreen') {
        this.enterFullscreen();
      }

      this.coverVisible = false;





      if (params.flow === 'Free user journey Signup from webex.com') {
        this.$nextTick(() => {
          // wait #windows-container-root created
          this.openJoinFromWebexCom(params.returnusers);
        })
        return
      }
      if (params.flow === 'fte: by link') {
        this.$nextTick(() => {
          // wait #windows-container-root created
          this.openJoinByLink(params.returnusers);
        })
        return
      }
      if (params.flow === 'online: free sign up') {
        this.$nextTick(() => {
          // wait #windows-container-root created
          this.openFreeSignup();
        })
        return
      }
      if (params.flow === 'jabber migration') {
        this.$nextTick(() => {
          // wait #windows-container-root created
          this.openTeams({
            isFTE: true,
          });
        })
        return
      }
      

      if (params.sliRole) {
        if (params.sliRole === 'sli') {
          
          var lists = {
            peopleList: this.peopleList, 
            peopleSI: this.peopleSI,
          };
          
          let pid = this.videoInStageSortIndex-1;
          this.$store.commit('videoInStageSortIndex', pid);

          forEach(lists, (value, key) => {
            let list = value
            let plist = [];
            const len = list.length;
            for (let i = 0; i < len; i++) {
                const p = list[i];
                if(p.me) {
                  // 自己是 isSign
                  p.statusTxt = 'American Sign Language - 1'
                  p.lang = 'American Sign Language'
                  p.isSign = true
                } else if(p.lang == 'American Sign Language') {
                  // 另外一个Sign改成next
                  p.statusTxt = 'American Sign Language - 2'
                } else if (p.isHardHearing) {
                  // 听障人士 pin to stage
                  p.pin = pid;
                  p.muted = true
                }
                plist.push(p);
            }
            this.$store.commit(key, plist);
          });

        }
        this.$nextTick(() => {
          this.$store.commit('interstitialParams', {visible: true, host: true});
        })
        
        return
      }



      if (params.inMeeting) {
        this.$nextTick(() => {
          // wait #windows-container-root created
          this.openMeeting({
            meetingId: this.defaultWebexMeetingId,
            meetingType: 'webex',
          });
        })
      } else {
        this.$nextTick(() => {
          // wait #windows-container-root created
          if(this.browserIsOpen) {
            this.openBrowser();
          }
          this.openTeams();
        })
      }
      
      
    },

    /*
    openJoinFromWebexCom() {
      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = 1280
      const height = this.os == 'win' ? 798 : 740
      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      this.$window.show(
        joinfromwebexcom, 
        {

        }, // component props
        {
          name: 'joinfromwebexcom',
          w: width,
          h: height,
          x: x,
          y: y,
          isDraggable: false,
          isResizable: false,
          border: false,
          
        }, // window props
        {
          closed: () => { },
        } // window eventlistener
      );
    },

    openJoinByLink(returnusers) {
      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = 1280
      const height = this.os == 'win' ? 798 : 740
      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      this.$window.show(
        joinbylink, 
        {
          returnusers: returnusers,
        }, // component props
        {
          name: 'joinbylink',
          w: width,
          h: height,
          x: x,
          y: y,
          isDraggable: false,
          isResizable: false,
          border: false,
          
        }, // window props
        {
          closed: () => { },
        } // window eventlistener
      );
    },

    openFreeSignup() {
      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = 1366
      const height = 860
      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      this.$window.show(
        freesignup, 
        {}, // component props
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
    */

    openBrowser() {
      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = 1113
      const height = 680
      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      this.$window.show(
        browser, 
        {}, // component props
        {
          name: 'browser',
          w: width,
          h: height,
          x: x,
          y: y,
          isDraggable: true,
          isResizable: false,
          borderRadius: this.os === 'win' ? '0' : '12px',
          dragHandle: '.edge-header',
          
        }, // window props
        {
          closed: () => { },
        } // window eventlistener
      );
    },

    openRrecordingPlayer(options, windowParams) {
      var opt = options ? options : {}

      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = 1024
      const height = 672

      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      if (windowParams && windowParams.offset) {
        x += windowParams.offset[0]
        y += windowParams.offset[1]
      }

      this.$window.hide('recording-player')

      this.$window.show(
        recordingplayer,
        {
          meetingInfo: opt.meetingInfo,
          smartChapter: opt.smartChapter,
        }, // component props
        {
          name: 'recording-player',
          w: width,
          h: height,
          x: x,
          y: y,
          minw: 600,
          minh: 400,
          isActive: true,
          isDraggable: true,
          isResizable: true,
          borderRadius: this.os === 'win' ? '0' : '12px',
          dragHandle: '.recording-player .recording-player-titlebar .drag-bg',

        }, // window props
        {
          closed: () => { },
          minimize: (rect) => {
            this.toggleTeamsWindowMinimized(true, rect)
          },
        } // window eventlistener
      );

    },

    openMeetingInfo(options, windowParams) {
      var opt = options ? options : {}

      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = 880
      const height = 600

      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      if (windowParams && windowParams.offset) {
        x += windowParams.offset[0]
        y += windowParams.offset[1]
      }

      this.$window.hide('popout-meeting-details')

      this.$window.show(
        teammeetingdetails, 
        {
          selectedMeeting: opt.meetingInfo,
          jumpto: opt.jumpto,
          layout: 'window',
          ...opt,
        }, // component props
        {
          name: `popout-meeting-details`,
          w: width,
          h: height,
          x: x,
          y: y,
          minw: 320,
          minh: 320,
          isDraggable: true,
          isResizable: true,
          borderRadius: this.os === 'win' ? '0' : '12px',
          dragHandle: '.popout-meeting-details-titlebar .drag-bg',

        }, // window props
        {
          closed: () => {
          },
          minimize: () => { },
        } // window eventlistener
      );

    },
/*
    openSignin(options) {
      var opt = options ? options : {}

      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = 1200;//this.MEETINGS_DEFAULT_WIDTH
      const height = this.MEETINGS_DEFAULT_HEIGHT
      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      this.$window.show(
        signin, 
        {
          defaultPage: opt.defaultPage,
          gotoAfterSignIn: opt.gotoAfterSignIn,
          closeAfterSignIn: opt.closeAfterSignIn,
          teamsOption: opt.teamsOption,
        }, // component props
        {
          name: 'signin',
          w: width,
          h: height,
          x: x,
          y: y,
          isDraggable: true,
          isResizable: false,
          dragHandle: '.topbar',
          
        }, // window props
        {
          closed: () => { },
        } // window eventlistener
      );
    },
*/
    openTeams(options, windowParams) {

      var opt = options ? options : {}
      if (opt &&opt.teamsNav) {
        this.$store.commit('teamsNav', opt.teamsNav);
      }
      if (opt.teamsNavExpanded !== undefined) {
        this.$store.commit('teamsNavExpanded', opt.teamsNavExpanded);
      }
      if (opt.isFTE !== undefined) {
        this.$store.commit('isFTE', opt.isFTE);
      }
      if (opt.calendarMeetingsConnected !== undefined) {
        this.$store.commit('calendarMeetingsConnected', opt.calendarMeetingsConnected);
      }

      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = this.teamsWindowWidth
      const height = this.teamsNav !== 'calling' ? this.teamsWindowHeight : (this.teamsWindowHeight < this.TEAMS_MIN_HEIGHT ? this.TEAMS_MIN_HEIGHT : this.teamsWindowHeight)
      
      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      if (windowParams && windowParams.offset) {
        x += windowParams.offset[0]
        y += windowParams.offset[1]
      }

      this.$window.show(
        teamsapp,
        {
          meetingButtonsCollapsed: opt.meetingButtonsCollapsed,
        }, // component props
        {
          name: this.TEAMS_WINDOW_NAME,
          w: width,
          h: height,
          x: x,
          y: y,
          minw: 480,
          minh: this.teamsNav !== 'calling' ? 410 : this.TEAMS_MIN_HEIGHT,
          isActive: true,
          isDraggable: true,
          isResizable: true,
          borderRadius: this.os === 'win' ? '0' : '12px',
          dragHandle: '.teams-header .teams-header-bg',

        }, // window props
        {
          closed: () => { },
          minimize: (rect) => {
            this.toggleTeamsWindowMinimized(true, rect)
          },
        } // window eventlistener
      );

    },

    openInterstitial(params) {
      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = 788
      const height = 597
      
      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)
      
      this.$store.commit('showJoinLateInMeetingNotificationByAI', params.late ? true : false); // 迟到进入会议

      this.$window.show(
        interstitial,
        {
          host: params.host,
        }, // component props
        {
          name: 'interstitial',
          w: width,
          h: height,
          x: x,
          y: y,
          minw: width,
          minh: height,
          isActive: true,
          isDraggable: true,
          isResizable: false,
          borderRadius: this.os === 'win' ? '0' : '12px',
          dragHandle: '#interstitial .topbar',

        }, // window props
        {
          closed: () => { 
            this.$store.commit('interstitialParams', {visible: false});
          },
        } // window eventlistener
      );
    },

    openMeeting(options, windowParams) {

      var opt = options
      if (!opt.videoLayout) {
        opt.videoLayout =  'grid'
      }
      if (!opt.videoStripDockSide) {
        opt.videoStripDockSide =  'T'
      }
      if (!opt.currentSharing) {
        opt.currentSharing =  []
      }

      const desktopRect = document.querySelector('#desktop').getBoundingClientRect();
      const width = opt.meetingType === 'webex' ? this.MEETINGS_DEFAULT_WIDTH : this.MEETINGS_CALL_WIDTH
      const height = opt.meetingType === 'webex' ? this.MEETINGS_DEFAULT_HEIGHT : this.MEETINGS_CALL_HEIGHT

      let x = (desktopRect.width - width)/2;
      let y = this.os === 'win' ? 
        (desktopRect.height - height - (this.systemBarVisible ? 40 : 0))/2 : (desktopRect.height - height - (this.systemBarVisible ? 22 : 0))/2 + (this.systemBarVisible ? 22 : 0)

      if (windowParams && windowParams.offset) {
        x += windowParams.offset[0]
        y += windowParams.offset[1]
      }

      let optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == opt.meetingId });
      if (idx === -1) {
        optlist.push(opt)
      }
      this.$store.commit('meetingOptionsList', optlist);

      this.$window.show(
        meetingsapp,
        {
          ...opt,
        }, // component props
        {
          name: opt.meetingId,
          w: width,
          h: height,
          x: x,
          y: y,
          minw: this.MEETINGS_CALL_WIDTH,
          minh: this.MEETINGS_CALL_HEIGHT,
          isActive: true,
          isDraggable: true,
          isResizable: true,
          borderRadius: this.os === 'win' ? '0' : '12px',
          dragHandle: '.meetings-app .topbar',
          parentSelector: '#desktop',

        }, // window props
        {
          closed: () => { 
            let optlist = _.cloneDeep(this.meetingOptionsList)
            _.remove(optlist, n => {
              return n.meetingId === opt.meetingId;
            })
            this.$store.commit('meetingOptionsList', optlist)
          },
          fullscreen: () => { 
            //
          },
          resizing: () => {
            this.$store.commit('disableElementTransition', true);
            this.$store.commit('videoPaused', true);
          },
          resizestop: () => {
            this.$store.commit('disableElementTransition', false);
            this.$store.commit('videoPaused', false);
          },
          aftermount: () => {
            if (windowParams && windowParams.transition) {
              let from = windowParams.transition.from
              this.$window.get(opt.meetingId, window => {
                let elem = window.$el

                const trans = mframe([{
                    dom: elem,
                    frames: [
                        { css: {
                          left: `${from.left}px`, 
                          top: `${from.top}px`,
                          transform: `scale(${from.scale})`,
                          opacity: from.opacity,
                          }, time: 0 },
                        { css: {
                          left: `${x}px`, 
                          top: `${y}px`,
                          transform: `scale(1.0)`,
                          opacity: '1.0',
                          }, time: 20, tween: 'easeInOut' }
                    ]
                }], {
                  end: () => {
                    setTimeout(() => {
                      this.$store.commit('manuallyHideSelfVideo', false);
                    }, 100)
                  }
                });
                trans.play();
                
              })
            }
            

          },
        } // window eventlistener
      );
    },

    toggleTeamsWindowMinimized(minimized) {
      const taskicon = document.querySelector('#taskbar-item-webex');
      const app = document.querySelector(`[name="${this.TEAMS_WINDOW_NAME}"]`);
      const apprect = app.getBoundingClientRect();

      const iconrect = taskicon.getBoundingClientRect();

      if (minimized) {
        this.teamsWindowLastPosition = {
          width: apprect.left,
          height: apprect.height,
          left: apprect.left,
          top: apprect.top,
        }

        const trans = mframe([{
            dom: app,
            frames: [
                { css: {
                  left: `${apprect.left}px`, 
                  top: `${apprect.top}px`,
                  transform: `scale(1.0)`,
                  opacity: '1.0',
                  }, time: 0 },
                { css: {
                  left: `${iconrect.left + iconrect.width/2 - apprect.width/2}px`, 
                  top: `${iconrect.top + iconrect.height/2 - apprect.height/2}px`,
                  transform: `scale(0.0)`,
                  opacity: '0.0',
                  }, time: 16, tween: 'easeInOut' }
            ]
        }]);
        trans.play();
      } else {
        const trans = mframe([{
            dom: app,
            frames: [
                { css: {
                  left: `${iconrect.left + iconrect.width/2 - this.teamsWindowLastPosition.width/2}px`, 
                  top: `${iconrect.top + iconrect.height/2 - this.teamsWindowLastPosition.height/2}px`,
                  transform: `scale(0.0)`,
                  opacity: '0.0',
                  }, time: 0 },
                { css: {
                  left: `${this.teamsWindowLastPosition.left}px`, 
                  top: `${this.teamsWindowLastPosition.top}px`,
                  transform: `scale(1.0)`,
                  opacity: '1.0',
                  }, time: 16, tween: 'easeInOut' }
            ]
          }], {
            end: () => {
              this.$window.bringToFront(this.TEAMS_WINDOW_NAME)
            }
          });
        trans.play();
      }
    },

    copylink(event, param) {
      event.stopPropagation();
      event.preventDefault();
      navigator.clipboard.writeText(`${window.location}?go=${param}`);

      this.notification = 'Copied to clipboard';
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 2000)
    },

    toggleFullscreen() {
      this.windowsMode = this.windowsMode === 'windows' ? 'fullscreen' : 'windows'
    },
    toggleLobby() {
      this.lobbyOn = !this.lobbyOn
    },

    enterFullscreen() {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },

    switchSide(type) {
      this.$store.commit('participantType', type)
    },

    onKeydown(evt) {
      // console.log('evt.code', evt.code, evt.altKey);

      if (evt.code == 'KeyT' && evt.altKey) {

        // Alt + T
        if (this.theme === 'light') {
          this.$store.commit('theme', 'dark');
        } else {
          this.$store.commit('theme', 'light');
        }
      }

    },

    capitalize(str) {
      return capitalize(str);
    },
    changeTheme(theme) {
      this.$store.commit('theme',theme);
    },
    changeColor(color) {
      this.$store.commit('themeColor',color);
    },
    changeSelfviewOption(opt) {
      this.$store.commit('selfViewOption',opt);
    },

    toggleReaction() {
      this.$store.commit('autoPlayReactions', !this.autoPlayReactions);
    },

    changePeopleNumber(number) {
      let p1 = this.peopleList.slice();
      let p2 = this.peopleNotJoinedList.slice();
      
      const p = p1.concat(p2);
      let plst1 = p.slice(0, number);
      let plst2 = p.slice(number);

      this.$store.commit('peopleList', plst1);
      this.$store.commit('peopleNotJoinedList',plst2);

    },


    shareAdd(meetingId) {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == meetingId });
      var meeting = optlist[idx]
      var currentSharing = meeting.currentSharing

      let shareList = currentSharing.filter(val => {
        return val.type === 'sharing'
      });
      if (shareList.length >= 3) {
        return;
      }
      let lst = currentSharing.slice();
      if (shareList.length === 0) {
        let p = this.$store.getters.people('Anurag Dhingra')
        lst.push({
          title: p ? `Anurag's Powerpoint` : `Giacomo's Powerpoint`,
          people: p ? 'Anurag Dhingra' : 'Giacomo Edwards',
          content: 'ppt',
          type: 'sharing',
        });
      } else if (shareList.length === 1) {
        lst.push({
          title: `Emma's Browser`,
          people: 'Emma Hirst',
          content: 'browser1',
          type: 'sharing',
        });
      } else if (shareList.length === 2) {
        lst.push({
          title: `Adrian's Browser`,
          people: 'Adrian Delamico',
          content: 'browser2',
          type: 'sharing',
        });
      }

      optlist[idx].currentSharing = lst
      if (meeting.videoLayout !== 'stage-sharing') {
        optlist[idx].videoLayout = 'stage-sharing'
      }

      this.$store.commit('meetingOptionsList', optlist);
      
    },
    shareRemove(meetingId) {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == meetingId });
      var meeting = optlist[idx]
      var currentSharing = meeting.currentSharing

      let shareList = currentSharing.filter(val => {
        return val.type === 'sharing'
      });
      if (shareList.length === 0) {
        return;
      }
      

      let lst = currentSharing.slice();
      for (let i = lst.length-1; i >=0; i--) {
        if (lst[i].type === 'sharing') {
          lst.splice(i, 1);
          break;
        }
      }

      optlist[idx].currentSharing = lst
      this.$store.commit('meetingOptionsList', optlist);

    },



    appAdd(meetingId) {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == meetingId });
      var meeting = optlist[idx]
      var currentSharing = meeting.currentSharing

      let appList = currentSharing.filter(val => {
        return val.type === 'collaborating'
      });
      if (appList.length >= 2) {
        return;
      }
      let lst = currentSharing.slice();
      let miroOpened = false;
      for (let i = 0; i < lst.length; i++) {
        if (lst[i].title === 'Miro') {
          miroOpened = true;
          break;
        }
      }
      if (appList.length === 0 || !miroOpened) {
        lst.push({
          title: `Miro`,
          people: this.me.name,
          content: 'miro',
          type: 'collaborating',
        });

        //this.$store.commit("collaboratingMaskVisible", true);
        this.$store.commit('collaboratingSide', 'initiator');

      } else {
        
        lst.push({
          title: `Mural`,
          people: 'Giacomo Edwards',
          content: 'mural',
          type: 'collaborating',
        });

        this.$notify({
          group: 'default',
          text: `<b>Giacomo Edwards</b> opened a file from the Mural app in this meeting`,
          data: {
            people: 'Giacomo Edwards',
            iconhtml: `<div class="ico--mural" style="position: absolute; width: 20px; height: 20px; bottom: -5px; right: -5px; background-repeat: no-repeat; background-size: contain; " ></div>`,
            click: () => { },
          },
        });
      }

      if (meeting.videoLayout !== 'stage-sharing') {
        optlist[idx].videoLayout = 'stage-sharing'
      }
      optlist[idx].currentSharing = lst
      this.$store.commit('meetingOptionsList', optlist);
      
    },
    appRemove(meetingId) {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == meetingId });
      var meeting = optlist[idx]
      var currentSharing = meeting.currentSharing

      let appList = currentSharing.filter(val => {
        return val.type === 'collaborating'
      });
      if (appList.length === 0) {
        return;
      }

      let lst = currentSharing.slice();
      for (let i = lst.length-1; i >=0; i--) {
        if (lst[i].type === 'collaborating') {
          lst.splice(i, 1);
          break;
        }
      }

      optlist[idx].currentSharing = lst
      this.$store.commit('meetingOptionsList', optlist);

    },

    setActiveWindow(id) {
      const ele = document.getElementById(id);
      ele.style.zIndex = this.zindex;
      this.zindex++;

      this.updateSnapshot(true)
    },


    // --------------------------------
    // portion selection ------>>>>>>>>>>

    updateSnapshot() {
      this.captureScreen(true)
    },

    captureScreen(forceUpdate) {
      if (this.screenSnapshotCanvas === null || forceUpdate) {
        console.log('capture screen...');
        // create screen snapshot
        const dsk = document.querySelector("#screen1");
        const opt = {
          scale: 1,
        };

        html2canvas(dsk, opt).then(canvas => {
          this.$store.commit('screenSnapshotCanvas', canvas);
          console.log('screen snapshot ready!');
        });
      }
    },

    setMagnifier() {
      if (!this.$refs.magnifierimg || !this.screenSnapshotCanvas) {
        setTimeout(() => {
          this.setMagnifier();
        }, 50);
        return;
      }
      const dsk = document.querySelector("#screen1");
      const rect = dsk.getBoundingClientRect();
      const scale = this.magnifierRatio
      let canvas = this.screenSnapshotCanvas
      canvas.style.width = `${rect.width * scale}px`;
      canvas.style.height = `${rect.height * scale}px`;
      this.$refs.magnifierimg.innerHTML = '';
      this.$refs.magnifierimg.appendChild(canvas);

    },

    mousemovehandler(evt) {
      const rectScreen = this.$refs.portionlayer.getBoundingClientRect();

      if (!this.portionRectCreated || this.portionSelectionIsResizing) {

        const rectMag = this.$refs.magnifier.getBoundingClientRect()
        const osx = -rectMag.width
        const osy = 16
        this.magnifierInfo.x = evt.x
        this.magnifierInfo.y = evt.y
        this.magnifierInfo.left = evt.x + osx
        this.magnifierInfo.top = evt.y + osy
        this.magnifierInfo.imgleft = -evt.x * this.magnifierRatio + 50
        this.magnifierInfo.imgtop = -evt.y * this.magnifierRatio + 44
        if (evt.x < rectMag.width) {
          this.magnifierInfo.left = evt.x + 16
        }
        if (evt.y > rectScreen.height - rectMag.height) {
          this.magnifierInfo.top = evt.y - rectMag.height - 8
        }
      }


      if (this.portionRectCreated || this.portionMouseDown) {
        return;
      }

      // hit and find app
      const edge = document.getElementById('ppt')
      const ppt = document.getElementById('edge')

      const edgeHit = this.$hitTest(edge, evt.pageX, evt.pageY)
      const pptHit = this.$hitTest(ppt, evt.pageX, evt.pageY)

      let hoverPortionAppElement = null
      if (edgeHit && !pptHit) {
        hoverPortionAppElement = edge
      } else if (!edgeHit && pptHit) {
        hoverPortionAppElement = ppt
      } else if (edgeHit && pptHit) {
        if (Number(edge.style.zIndex) > Number(ppt.style.zIndex)) {
          hoverPortionAppElement = edge
        } else {
          hoverPortionAppElement = ppt
        }
      }

      if (hoverPortionAppElement) {
        const rectApp = hoverPortionAppElement.getBoundingClientRect();
        const rectScreen = this.$refs.portionlayer.getBoundingClientRect();
        this.portionSelectionRect.left = rectApp.x
        this.portionSelectionRect.top = rectApp.y
        this.portionSelectionRect.width = rectApp.width
        this.portionSelectionRect.height = rectApp.height
        this.portionSelectionRect.right = rectScreen.width - this.portionSelectionRect.left - this.portionSelectionRect.width
        this.portionSelectionRect.bottom = rectScreen.height - this.portionSelectionRect.top - this.portionSelectionRect.height
        
      } else {
        this.portionSelectionRect = {
          left: 5000,
          top: 5000,
          right: 5000,
          bottom: 5000,
        }
      }

      this.previewAppSelected = hoverPortionAppElement !== null

    },

    createDefaultPortionRect() {
      // Size: 800x450px, Position: in the middle of the screen
      const defaultW = 800
      const defaultH = 450
      const screenRect = document.querySelector('#desktop').getBoundingClientRect();
      const left = Math.round((screenRect.width - defaultW) / 2)
      const top = Math.round((screenRect.height - defaultH) / 2)

      this.portionSelectionRect = {
        left: left, 
        top: top,
        right: screenRect.width - defaultW - left,
        bottom: screenRect.height - defaultH - top,
        width: defaultW,
        height: defaultH,
        opacity: 1,
      };

      this.portionRectCreated = true

    },

    mousedownhandler(evt) {
      this.portionMouseDown = true
      this.previewAppSelected = false

      if (this.portionRectCreated) {
        return;
      }

      // hit and find app
      const edge = document.getElementById('ppt')
      const ppt = document.getElementById('edge')

      const edgeHit = this.$hitTest(edge, evt.pageX, evt.pageY)
      const pptHit = this.$hitTest(ppt, evt.pageX, evt.pageY)
      this.selectedPortionAppElement = null
      if (edgeHit && !pptHit) {
        this.selectedPortionAppElement = edge
      } else if (!edgeHit && pptHit) {
        this.selectedPortionAppElement = ppt
      } else if (edgeHit && pptHit) {
        if (Number(edge.style.zIndex) > Number(ppt.style.zIndex)) {
          this.selectedPortionAppElement = edge
        } else {
          this.selectedPortionAppElement = ppt
        }
      }
      
      ///////
      this.portionSelectionMouseStartPoint = {
        x: evt.x, 
        y: evt.y,
      };
      const rect = this.$refs.portionlayer.getBoundingClientRect();
      this.portionSelectionRect = {
        left: evt.x,
        top: evt.y,
        right: rect.width - evt.x,
        bottom: rect.height - evt.y,
        width: 0,
        height: 0,
        opacity: 1,
      };

      document.addEventListener('mousemove', this.docmousemovehandler);
      document.addEventListener('mouseup', this.docmouseuphandler);

    },
    docmousemovehandler(evt) {

      this.portionSelectionMouseEndPoint = {
        x: evt.x, 
        y: evt.y,
      };
      const rectScreen = this.$refs.portionlayer.getBoundingClientRect();
      const rect = this.$refs.portionselectionlayer.getBoundingClientRect();
      if (this.portionSelectionMouseEndPoint.x > this.portionSelectionMouseStartPoint.x) {
        this.portionSelectionRect.width = this.portionSelectionMouseEndPoint.x - this.portionSelectionMouseStartPoint.x;
        this.portionSelectionRect.right = rectScreen.width - this.portionSelectionMouseEndPoint.x;
      } else {
        this.portionSelectionRect.left = evt.x,
        this.portionSelectionRect.width = this.portionSelectionMouseStartPoint.x - this.portionSelectionMouseEndPoint.x;
        this.portionSelectionRect.right = rectScreen.width - this.portionSelectionMouseStartPoint.x;
      }

      if (this.portionSelectionMouseEndPoint.y > this.portionSelectionMouseStartPoint.y) {
        this.portionSelectionRect.height = this.portionSelectionMouseEndPoint.y - this.portionSelectionMouseStartPoint.y;
        this.portionSelectionRect.bottom = rectScreen.height - this.portionSelectionMouseEndPoint.y;
      } else {
        this.portionSelectionRect.top = evt.y - rect.top,
        this.portionSelectionRect.height = this.portionSelectionMouseStartPoint.y - this.portionSelectionMouseEndPoint.y;
        this.portionSelectionRect.bottom = rectScreen.height - this.portionSelectionMouseStartPoint.y;
      }

      if ((this.portionSelectionMouseEndPoint.x - this.portionSelectionMouseStartPoint.x) * (this.portionSelectionMouseEndPoint.y - this.portionSelectionMouseStartPoint.y) > 0) {
        this.changeCursor('nwse-resize')
      } else {
        this.changeCursor('nesw-resize')
      }

    },

    docmouseuphandler(evt) {
      this.portionMouseDown = false
      const rectScreen = this.$refs.portionlayer.getBoundingClientRect();
      this.portionSelectionRect.width = Math.max(this.portionSelectionRect.width, 80)
      this.portionSelectionRect.height = Math.max(this.portionSelectionRect.height, 80)

      if (this.selectedPortionAppElement && this.portionSelectionMouseStartPoint.x === evt.x && this.portionSelectionMouseStartPoint.y === evt.y) {
        const rectApp = this.selectedPortionAppElement.getBoundingClientRect();
        this.portionSelectionRect.left = rectApp.x
        this.portionSelectionRect.top = rectApp.y
        this.portionSelectionRect.width = rectApp.width
        this.portionSelectionRect.height = rectApp.height
      }

      this.portionSelectionRect.right = rectScreen.width - this.portionSelectionRect.left - this.portionSelectionRect.width
      this.portionSelectionRect.bottom = rectScreen.height - this.portionSelectionRect.top - this.portionSelectionRect.height

      document.removeEventListener('mousemove', this.docmousemovehandler);
      document.removeEventListener('mouseup', this.docmouseuphandler);

      this.changeCursor('')

      this.portionRectCreated = true

    },

    changeCursor(name) {
      const body = document.querySelector('body')
      body.style.cursor = name
    },

    setPortionMaskRect(rect, updatePortion) {
      const rectScreen = this.$refs.portionlayer.getBoundingClientRect();

      this.portionSelectionRect.width = rect.width
      this.portionSelectionRect.height = rect.height
      this.portionSelectionRect.left = rect.left
      this.portionSelectionRect.top = rect.top
      this.portionSelectionRect.right = rectScreen.width - rect.left - rect.width
      this.portionSelectionRect.bottom = rectScreen.height - rect.top - rect.height

      if (updatePortion) {
        this.$store.commit("screenSharingPortionRect", cloneDeep(this.portionSelectionRect));
      }
    },

    onPortionResizing(rect){
      this.setPortionMaskRect(rect)
      this.portionShareBtnVisible = false
      this.portionSelectionIsResizing = true
    },
    onPortionResizeStop(rect){
      this.setPortionMaskRect(rect, true)
      this.portionShareBtnVisible = true
      this.portionSelectionIsResizing = false
    },
    onPortionDragging(rect){
      this.setPortionMaskRect(rect)
      this.portionShareBtnVisible = false
      this.portionSelectionIsDragging = true
    },
    onPortionDragStop(rect){
      this.setPortionMaskRect(rect, true)
      this.portionShareBtnVisible = true
      this.portionSelectionIsDragging = false
    },

    onContextmenu() {
      this.closePortionSelection()
    },

    closePortionSelection(){
      if (this.sharePortionIsEditing) {
        this.$store.commit("sharePortionIsEditing", false);
        this.$eventBus.$emit('show-share-dialog');
        this.resetPortionConfig();
      }
    },

    resetPortionConfig() {
      document.removeEventListener('mousemove', this.docmousemovehandler);
      document.removeEventListener('mouseup', this.docmouseuphandler);
      this.portionMouseDown = false;
    },

    sharePortionSelection(){
      this.$store.commit('selfSharing', 'portion');
      this.$store.commit('selfSharingContent', 'Portion of screen');
      
      this.resetPortionConfig()
    },

    // portion selection ------<<<<<<<<<<
    // --------------------------------

    toggleTeamsWindow(){
      this.$store.commit('teamsWindowMinimized', !this.teamsWindowMinimized);
    },


  }
};
</script>

<style lang="scss">
$option-row-width: 360px;

.os-ui-root {
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;

.invalidsize {
    position: absolute;
    top: 0;
    left: auto;
    width: 100%;
    height: 100%;
    max-width: 1440px;
    max-height: 810px;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 99999;

    &:before {
      content: " ";
      position: absolute;
      box-sizing: border-box;
      z-index: -1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 2px solid #1A1A1A;
    }

    &.h {
      border-top: none !important;
      border-bottom: none !important;

      &:before {
        border-top: none !important;
        border-bottom: none !important;
        top: 3px;
        bottom: 3px;
      }
    }
    &.v {
      border-left: none !important;
      border-right: none !important;

      &:before {
        border-left: none !important;
        border-right: none !important;
        left: 3px;
        right: 3px;
      }
    }

    &.flash {
      animation: flash 1.2s linear infinite;
    }
  }
  
  @keyframes flash {
    0% { border: 4px solid rgba($color: $md-blue-40, $alpha: 1.0); }
    50% { border: 4px solid rgba($color: $md-blue-80, $alpha: 1.0); }
    100% { border: 4px solid rgba($color: $md-blue-40, $alpha: 1.0); }
  }

  #prototype-cover-page {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 1440px;
    width: 1440px;
    min-height: 810px;
    height: 810px;
    background-color: $md-gray-95;
    color: #fff;
    box-sizing: border-box;
    border: 2px solid $md-blue-40;

    .wrap {
      @include flex(column, flex-start, flex-start);
      flex-grow: 1;

      .top {
        display: flex;
        margin: 16px 20px;

        .title-wbx {
          display: flex;
          align-items: center;

          span {
            margin: 0 2px;
            font-family: Consolas, Liberation Mono, monospace;
            font-size: 16px;
            opacity: .9;
          }

          svg path{
            fill-opacity: .32;
          }
        }
      }

      .middle {
        width: 100%;
        @include flex(column);
        flex-grow: 1;

        .title {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
          opacity: .95;
          max-width: 80%;
          
          .line1 {
            font-size: 36px;
            margin-bottom: -20px;
          }
          .line2 {
            font-size: 80px;
            line-height: 100px;
            font-weight: 700;
          }
        }

        .username {
          position: relative;
          width: $option-row-width;

          .username-input {
            position: relative;
            width: 100%;
            height: 48px;
            margin: 0;
            color: #fff;
            font-weight: 600;
            background-color: transparent;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid rgba($color: #FFF, $alpha: .2);
            padding-left: 96px;

            &:focus {
              outline: none !important;
              box-shadow: none;
              border-bottom: 1px solid $md-blue-40;
            }
          }

          .label {
            position: absolute;
            @include flex(row, flex-start);
            height: 48px;
            top: 0;
            opacity: .95;
          }

          .avatar {
            position: absolute;
            right: 6px;
            top: 8px;
          }
        }

        .optionitem {
          width: $option-row-width;
          height: 48px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba($color: #FFF, $alpha: .2);

          .lb {
            flex-grow: 1;
            opacity: .95;
          }
        }

        .buttons {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 28px;
          margin-bottom: 100px;

          .btngrp {
            @include flex;
            position: relative;
            width: $option-row-width;
            margin: 4px 0;
          }

          .btn {
            position: relative;
            padding: 4px 10px;
            width: $option-row-width;
            border-radius: 4px;
            min-height: 36px;
            height: auto;
            text-align: left;
            

            .spacer {
              flex-grow: 1;
            }
          }

          .btnico {
            position: absolute;
            @include flex;
            right: 0;
            top: 0;
            width: 36px;
            height: 36px;
            border-radius: 0 4px 4px 0;
            box-sizing: border-box;

            &:hover {
              background-color: $md-blue-50;
            }
            &:active {
              background-color: $md-blue-60;
            }
          }
        }

        .buttongroup {
          @include flex(column);
          width: $option-row-width;
          border-radius: 4px;
          overflow: hidden;
          box-sizing: border-box;
          background-color: rgba($color: $md-blue-60, $alpha: .2);
          margin-bottom: 6px;

          .tt {
            @include flex(row, flex-start);
            width: 100%;
            font-size: 16px;
            height: 36px;
            padding-left: 12px;
          }

          .btnitms {
            @include flex;
            width: 100%;

            .itm {
              @include flex;
              flex-grow: 1;
              flex-shrink: 1;
              border-radius: 4px;
            }
          }
        }
        
        .instruction {
          margin-top: 12px;
          opacity: .8;
          margin-bottom: 50px;
          
        }
      }

      .bottom {
        width: 100%;
        padding: 16px 20px;
        @include flex;

        .lb {
          display: flex;
          font-size: 14px;
          opacity: .7;
        }
      }

    }

    .alert {
      @include flex;
      
      height: 48px;
      background-color: $md-orange-40;
      font-size: 18px;
      color: #000;
      margin: 2px;

      .link {
        margin-left: 4px;
        color: #000;
        font-weight: 600;
      }
    }

    .dot-divider {
      margin: 0 12px;
    }

    .md-button.md-button--blue {
      font-weight: 600;
      color: rgba($color: #000000, $alpha: 0.95);
      background-color: $md-blue-40;

      &:hover {
        background-color: $md-blue-50;
      }
      &:active {
        background-color: $md-blue-60;
      }
    }


    .notification {
      width: 200px;
      left: calc((100% - 200px) / 2);
      bottom: 100px;
      text-align: center;

      .wrap {
        align-items: center;
      }
    }

  }
}
#edge {
  position: absolute;
  z-index: 3;
  left: calc(50% - 1111px / 2);
  top: 24px;
  width: 1111px;
  height: 678px;
  background: url(~@/assets/img/edge-s.png) no-repeat center top;
  background-size: cover;
  box-sizing: border-box;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.32), 0px 0px 1px rgba(0, 0, 0, 0.14);
  pointer-events: auto;

  .edge-header {
    position: absolute;
    width: 100%;
    height: 32px;
  }

  &.sharing_app_border {
    border: 5px solid $md-orange-60;
  }
}
#ppt {
  position: absolute;
  z-index: 2;
  left: calc(50% - 1200px / 2);
  top: 24px;
  width: 1200px;
  height: 726px;
  background: url(~@/assets/img/temp_ppt.png) no-repeat center top;
  background-size: cover;
  box-sizing: border-box;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.32), 0px 0px 1px rgba(0, 0, 0, 0.14);
  pointer-events: auto;

  .ppt-header {
    position: absolute;
    width: 100%;
    height: 32px;
  }

  &.sharing_app_border {
    border: 5px solid $md-orange-60;
  }
}
/*
#powerpoint {
  position: absolute;
  left: calc(50% - 600px + 40px);
  top: calc(50% - 363px - 40px);
  width: 1200px;
  height: 726px;
  background: url(~@/assets/img/temp_ppt.png) no-repeat center top;
  background-size: cover;
  box-sizing: border-box;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.32), 0px 0px 1px rgba(0, 0, 0, 0.14);
  pointer-events: none;

}

#desktop2 {
  position: absolute;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background: url(~@/assets/img/background-win.jpg) no-repeat center top;
  background-size: cover;
  pointer-events: none;
}
*/
#desktop {
  position: absolute;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;

  #windows-container-root {
    width: 100%;
    height: 100%;
  }

  #screen1 {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  #taskbar {
    position: absolute;
    bottom: 0px;
    left: 0px;
    display: block;
    width: 100%;
    height: 40px;
    background-color: rgba($color: #222222, $alpha: 0.88);
    background-image: url(~@/assets/img/desktop_taskbar.svg), url(~@/assets/img/desktop_taskbar2.svg);
    background-repeat: no-repeat, no-repeat;
    background-position: left top, right top;
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    user-select: none;

    .time {
      position: absolute;
      top: 3px;
      right: 60px;
      font-size: 12px;
      line-height: 16px;
      font-weight: 400;
      text-align: center;
    }

    .tskitem {
      position: relative;
      pointer-events: auto;

      .highlight {
        position: absolute;
        height: 2px;
        width: 80%;
        left: 10%;
        bottom: 0%;
        background: #07C1F5;
      }

      .badge {
        position: absolute;
        bottom: 6px;
        right: 4px;
        @include flex;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        color: white;
        background-color: #1170CF;
        font-size: 12px;
        font-weight: 600;
      }

      &.active {
        background-color: rgba($color: #FFFFFF, $alpha: .2);

        .highlight {
          left: 0;
          width: 100%;
        }
      }
    }
  }
  #taskbar .wbx {
    position: absolute;
    top: 0px;
    left: 439px;
    display: block;
    width: 58px;
    height: 40px;
    background-image: url(~@/assets/img/team-logo.svg);
    background-repeat: no-repeat;
    background-position: center;
  }
  #taskbar .edge {
    position: absolute;
    top: 0px;
    left: calc(439px + 58px);
    display: block;
    width: 58px;
    height: 40px;

    background-image: url(~@/assets/img/edge-logo.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 28px 28px;
  }
  #menubar {
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 22px;
    background-color: rgba($color: #AEAEB2, $alpha: 0.2);
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.24), 0px 1px 0px rgba(0, 0, 0, 0.16);
    backdrop-filter: blur(65px);
    user-select: none;

    .apple-logo {
      margin-left: 16px;
    }

    .appname {
      display: flex;
      font-size: 14px;
      font-weight: bold;
      margin-left: 16px;
      margin-right: 20px;
    }
    .appmenu {
      display: flex;
      flex-grow: 1;
      font-size: 14px;
      .itm {
        margin-right: 20px;
      }
    }

    .macbar-right {
      width: 322px;
      height: 24px;
      background-image: url(~@/assets/img/mac-menubar-right-dark.svg);
      background-repeat: no-repeat;
      background-position: center right;
      margin-right: 12px;
    }
  }


  #popover {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999999;
  }

  .shadow {
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.4);
  }


  .popout-chat .scrollpane {
    height: 230px;
  }

  &.win {
    #screen1 {
      background: url(~@/assets/img/background-win.jpg) no-repeat center top;
      background-size: cover;
    }

    .options-control {
      top: -10px;
    }
  }
  &.mac {
    #screen1 {
      background: url(~@/assets/img/mac-wallpaper-light.jpg) no-repeat center;
      background-size: cover;
    }

    &.dark, &.hybrid{
      #screen1 {
        background: url(~@/assets/img/mac-wallpaper-dark.jpg) no-repeat center;
        background-size: cover;
      }

      #menubar {
        color: #FFF;
        box-shadow: 0px 0px 16px rgba($color: #0f1119, $alpha: 0.3), 0px 1px 0px rgba($color: #0f1119, $alpha: 0.2);
      }
    }
  }

  .fade {
    transition: opacity 0.3s ease-out;
    opacity: 0;
  }

  .miroiframe {
    position: absolute;
    height: 0;
    overflow: hidden;
  }

}

.sharing_border {
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 5px solid $md-orange-60;
  pointer-events: none;

  &.green {
    border: 6px solid $md-green-40;
  }
}
.screen_number {
  @include flex;
  position: absolute;
  width: 120px;
  height: 120px;
  left: 2.22%;
  top: 3.95%;
  /* black-alpha / 60 */
  background: rgba(0, 0, 0, 0.6);
  /* Elevation/elevation-3 */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.14);
  border-radius: 12px;
  font-size: 64px;
  color: white;
}

.playerctrls {
  position: absolute;
  top: 10px;
  left: 10px;

  .selected {
    pointer-events: none;
    background: rgba($color: #fff, $alpha: 0.1);
    color: rgba($color: #fff, $alpha: 0.6)
  }
}

.theme-control {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  margin: 10px;
  pointer-events: none;

  .optrow {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 4px;

    .tb {
      @include flex;
      font-size: 12px;
      color: rgba($color: white, $alpha: 0.7);
      padding: 0 10px;
      border-radius: 10px;
      user-select: none;
      cursor: pointer;
      pointer-events: auto;

      &.active {
        color: white;
        background: rgba($color: #000000, $alpha: 0.1);
      }
    }
  }
}

.top-left-control {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  margin: 2px 10px;
  user-select: none;
  cursor: pointer;

  .reaction-ctrl {
    display: flex;
    align-items: center;
    margin-left: 30px;

    .toggle {
      position: relative;
      display: flex;
      width: 32px;
      height: 16px;
      border: 1px solid white;
      border-radius: 8px;
      box-sizing: border-box;
      transition: all .3s;

      .dot {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        top: 2px;
        left: 2px;
        background: white;
        transition: all .3s;
      }

      &.on {
        background-color: white;
        .dot {
          background: black;
          left: 19px;
        }
      }
    }
  }

  

  .lb {
    margin-left: 8px;
    font-size: 12px;
    color: white;
  }

  .tlb {
    margin-right: 8px;
    font-size: 12px;
    color: white;
  }
  .tb {
    @include flex;
    font-size: 12px;
    color: rgba($color: white, $alpha: 0.7);
    padding: 0 10px;
    border-radius: 10px;
    user-select: none;
    cursor: pointer;
    pointer-events: auto;

    &.active {
      color: white;
      background: rgba($color: #000000, $alpha: 0.1);
    }
  }


}

.options-control {
  position: absolute;
  top: 20px;
  right: 0;
  display: flex;
  flex-direction: column;
  margin: 10px;
  pointer-events: none;

  .optrow {
    display: flex;
    margin-bottom: 4px;

    .tt {
      font-size: 12px;
      font-weight: bold;
      margin-right: 10px;
      color: white;
    }

    .tb {
      @include flex;
      font-size: 12px;
      color: rgba($color: white, $alpha: 0.7);
      padding: 0 10px;
      border-radius: 10px;
      user-select: none;
      cursor: pointer;
      pointer-events: auto;

      &.active {
        color: white;
        background: rgba($color: #000000, $alpha: 0.1);
      }
    }
  }
}

.preload {
  position: absolute;
  user-select: none;
  pointer-events: none;
  opacity: 0;
  /*
  .logo-animated {
    background-image: url('~@/assets/img/webex-logo-animated.webp');
  }
  */
}

#portion-layer {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .portionmodal {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: .5);
    pointer-events: none;

    padding-left: var(--portion-rect-padding-left);
    padding-right: var(--portion-rect-padding-right);
    padding-top: var(--portion-rect-padding-top);
    padding-bottom: var(--portion-rect-padding-bottom);
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude; 

  }

  .portionselectionlayer {
    position: absolute;
    pointer-events: none;

    .rect {
      position: absolute;
      width: 0;
      height: 0;
      box-sizing: border-box;
      
      &.preview {
        box-shadow: 0 0 0 2px white;
        outline: 2px dashed #707070;
      }
      &.selection {
        border: 2px solid #3CC29A;
      }
    }


  }

  .magnifier {
    box-sizing: border-box;
    position: absolute;
    width: 103px;
    height: 114px;
    background: #3B3B3B;
    border: 1px solid rgba(255, 255, 255, 0.95);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.16);
    z-index: 999999;

    .top {
      position: relative;
      height: 89px;
      width: 100%;
      overflow: hidden;

      .img {
        position: absolute;

        canvas {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      }
      .cross {
        position: absolute;
      }
    }
    .bot {
      @include flex;
      box-sizing: border-box;
      height: 25px;
      border-top: 1px solid rgba(255, 255, 255, 0.95);
      font-size: 14px;
      padding-bottom: 1px;
    }

  }

  #portioneditlayer {
    cursor: move;
    pointer-events: auto;

    &.active.border:before{
      outline: 2px solid #3CC29A;
    }

    .handler {
      border: 2px solid #3CC29A;
      box-shadow: none;
    }

    &.sharingborder {
      &.active.border:before{
        outline: 2px solid $md-orange-60;
      }

      .handler {
        border: 2px solid $md-orange-60;
        box-shadow: none;
      }
    }
    &.editingborder {
      &.active.border:before{
        box-shadow: 0 0 0 2px white;
        outline: 2px dashed #707070;
      }

      .handler {
        display: none
      }
    }
  }

  .coordlabel {
    @include flex;
    position: absolute;
    top: -30px;
    border-radius: 4px;
    background: #000;
    padding: 0 8px;
    font-size: 14px;
    white-space: nowrap;
  }

  .btns {
    @include flex;
    position: absolute;
    bottom: -52px;
    right: 0;
    height: 44px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: #000;
    padding: 0 10px;

    .btn {
      font-size: 14px;
      font-weight: normal;
    }
  }

  .infolayer {
    @include flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999998;

    .tip {
      @include flex;
      height: 46px;
      background: #1A1A1A;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.16);
      border-radius: 8px;
      padding: 0 16px;

      span {
        font-weight: 600;
        font-size: 20px;
      }
    }
  }

  

}

</style>
