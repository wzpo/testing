<template>
  <div ref='video-pane' 
    id="video-pane"
    :class="['video-pane', theme, videoLayout, 
      {
        fullscreen: fullscreen,
      }
    ]"
  >
    
    <div v-if="devicePaired" class="paired-content" :class="{sharing: deviceInSharing}" id="stage-device-paired-content" >
      <div v-if="!deviceInSharing" class="img" :class="devicePairedImage" > </div>
      <div v-if="!deviceInSharing" class="title">{{devicePairedName}}</div>
      <div v-if="!deviceInSharing" class="name">Control the meeting remotely</div>
      <layout-switch 
        v-if="!deviceInSharing && !deviceConnecting"
        :meetingId="meetingId"
        defaultLabel="Device layout"
        class="btnlayout"
      ></layout-switch>
    </div>
    <div v-if="deviceConnecting" class="device-connecting">
      <div class="idx">
        <span class="spinner16 spinner-animation" ></span>
        <span class="txt" >Connecting...</span>
      </div>
    </div>

    <div v-if="meetingType === 'video-call' && callPeopleVideoOn && currentSharing.length === 0" class="call-pane" >
      <video-item
        class="videoarea"
        :name='meetingCallInfo.people.name'
        :avatar='meetingCallInfo.people.avatar'
        :video='meetingCallInfo.people.video'
        :isBgVideo="true"
        :activeBorder="'hide'"
      />
    </div>

    <div 
      class="stage_area" 
      ref="stage_area"
      :class="[stageTheme, {syncborder: stageSyncing}]"
      :style="{
        zIndex: 0,
        width: (videoLayout === 'stage' || videoLayout === 'stage-sharing') ? stageVideoRect.width : '',
        height: (videoLayout === 'stage' || videoLayout === 'stage-sharing') ? stageVideoRect.height : '',
        marginTop: (videoLayout === 'stage' || videoLayout === 'stage-sharing') ? stageVideoRect.top : '',
        marginLeft: (videoLayout === 'stage' || videoLayout === 'stage-sharing') ? stageVideoRect.left : '',
        opacity: sceneSyncing ? 0 : 1,
      }"
      @mousedown="mousedownhandler"
    >

      <div
        class="stage_video_container"
        ref='stage_video_container'
        v-if="videoLayout === 'stage' || videoLayout === 'stage-sharing'"
        @drop="dropToStage"
        @dragover="dragoverStage"
        @dragleave="dragleaveStage"
        :class="{allowdrop: stageAllowToDrop}"
        :style="{
          width: stageDividedColumnRect.videoColumnWidth ? `${stageDividedColumnRect.videoColumnWidth}px` : '',
          marginLeft: stageDividedColumnRect.leftColumnWidth ? `${stageDividedColumnRect.leftColumnWidth + stageDividedColumnGap + stageDividedColumnMargin}px` : '',
        }"
      >
          <video-item
            v-for='p in stagePeopleList'
            :id="`video-item_${p.name.replace(/ /g, '-')}`"
            :key="`pin${p.name}`"
            :index="p.index"
            :width="`${videoLayout === 'grid' && videoItemPosition[p.name] && videoItemPosition[p.name].width ? videoItemPosition[p.name].width+'px' : stageVideoColumnWidth}`"
            :height="`${videoLayout === 'grid' && videoItemPosition[p.name] && videoItemPosition[p.name].height ? videoItemPosition[p.name].height+'px' : stageVideoRowHeight}`"
            :opacity="dropPinPeople.name === p.name ? '0' : '1'"
            :absolute="true"
            :name='p.name'
            :host='p.host'
            :avatar='p.avatar'
            :video='p.video'
            :audio='p.audio'
            :muted='p.muted'
            :isSign='p.isSign'
            :signLang='p.lang' 
            :statusTxt="p.statusTxt" 
            :sort='p.sort'
            :timezone='p.timezone'
            :reaction='p.reaction'
            :positionLeft='videoItemPosition[p.name] ? videoItemPosition[p.name].left : ""'
            :positionTop='videoItemPosition[p.name] ? videoItemPosition[p.name].top : ""'
            :objectPosition="`${videoItemPosition[p.name] && videoItemPosition[p.name].objectPosition ? videoItemPosition[p.name].objectPosition : 'center 0'}`"
            v-bind:leftempty='videoItemPosition[p.name] ? videoItemPosition[p.name].leftempty : "0"'
            v-bind:rightempty='videoItemPosition[p.name] ? videoItemPosition[p.name].rightempty : "0"'
            :selected="groupselectedVideo.indexOf(p.name) > -1"
            :meetingId="meetingId"
            @dragstart="onVideoDragStart"
            @dragging="onVideoDrag"
            @dragstop="onVideoDragStop"
          />

          <video-item
            v-show="draggingVideoName && dropPinPeople.name"
            :id="`drop-pin-video`"
            :absolute="true"
            :transition="false"
            :name='dropPinPeoplePrepared.name'
            :avatar='dropPinPeoplePrepared.avatar'
            :video='dropPinPeoplePrepared.video'
            :audio='dropPinPeoplePrepared.audio'
            :muted='dropPinPeoplePrepared.muted'
            :style="{
              zIndex: '20',
              pointerEvents: 'none'
            }"
            :meetingId="meetingId"
          />

          <div 
            v-if="stageDividedColumnRect.leftColumnWidth && stageDividedColumnRect.videoColumnWidth"
            v-show="hudVisible || isdragging"
            @mousedown="stageResizeHandlerMousedown" 
            ref="stage_resize_handler" 
            :class="['stage_resize_handler']"
          >
            <!--svg width="10" height="52" viewBox="0 0 10 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="10" width="1" height="52" rx="0.5" fill="#B2B2B2"/>
              <rect x="6" y="10" width="1" height="52" rx="0.5" fill="#B2B2B2"/>
            </svg-->
          </div>
          
      </div>

      <div 
        v-if="location === 'left' && ($store.getters.currentSharingInStage(meetingId) > 0 || stagePeopleList.length > 0) || videoLayout === 'stage' && activeSpeakerInStage"
        class="stage_left_col" 
        @drop="dropToStage"
        @dragover="dragoverStage"
        @dragleave="dragleaveStage"
        :class="{allowdrop: stageAllowToDrop}"
        :style="{
          width: stageDividedColumnRect.leftColumnWidth && ($store.getters.currentSharingInStage(meetingId) == 0 || stagePeopleList.length > 0) ? `${stageDividedColumnRect.leftColumnWidth}px` : '',
          height: stageDividedColumnRect.leftColumnHeight ? `${stageDividedColumnRect.leftColumnHeight}px` : '',
          top: stageDividedColumnRect.leftColumnHeight ? `calc((100% - ${stageDividedColumnRect.leftColumnHeight}px)/2)` : '',
          left: stageDividedColumnRect.leftColumnWidth && $store.getters.currentSharingInStage(meetingId) == 0 && stagePeopleList.length == 0 ? `calc((100% - ${stageDividedColumnRect.leftColumnWidth}px)/2)` : `${stageDividedColumnMargin}px`,
        }"
      >
        <video-item
          v-if="videoLayout === 'stage' && activeSpeakerInStage"
          :name='activeSpeaker.name'
          :avatar='activeSpeaker.avatar'
          :video='activeSpeaker.video'
          :audio='activeSpeaker.audio'
          :muted='activeSpeaker.muted'
          :reaction='activeSpeaker.reaction'
          :isActiveSpeaker="true"
          :activeBorder="'hide'"
          :width="stageDividedColumnRect.leftColumnWidth ? `${stageDividedColumnRect.leftColumnWidth}px` : '100%'"
          :height="stageDividedColumnRect.leftColumnHeight ? `${stageDividedColumnRect.leftColumnHeight}px` : '100%'"
          :meetingId="meetingId"
        />
        <sharing-pane 
          v-if="location === 'left' && $store.getters.currentSharingInStage(meetingId) > 0"
          :currentSharing="currentSharing"
          :pointerEventsDisabled="sharingContentPointerEventsDisabled"
          :meetingId="meetingId"
        ></sharing-pane>
      </div>

      <drag-resize
        v-if="stageThemeLogo"
        class="themelogo"
        :isActive="!stageSyncing && shareStagePanelVisible"
        :w="192"
        :h="62"
        :x="30"
        :y="30"
        :minw="20"
        :minh="20"
        :parentW="9999"
        :parentH="9999"
        :isDraggable="true"
        :isResizable="true"
        :aspectRatio="true"
        :parentLimitation="true"
        :showHandle="true"
      >
        <div class="img" ></div>
      </drag-resize>

      <div v-if="!stageSyncing && shareStagePanelVisible" class="synclabel-preview" >
        <span class="lb">
          You’re customizing the stage
        </span>
      </div>

      <div v-if="stageSyncing" class="synclabel" :class="{clsed: !synclabelVisible}">
        <span class="lb">
          You’re syncing up your stage view for everyone
          <div class="stop" @click="stopSyncStage">Stop</div>
        </span>
        <div class="arrow" @click="toggleSynclabel">
          <wl-icon v-if="synclabelVisible" name="arrow-up-filled" color="white" size="8" />
          <wl-icon v-if="!synclabelVisible" name="arrow-down-filled" color="white" size="8" />
        </div>
      </div>

      <div class="groupselectionlayer" ref="groupselectionlayer" >
        <div 
          class="rect" 
          ref="groupselectionrect"
          :style="{
            left: `${groupselectionRect.left}px`,
            top: `${groupselectionRect.top}px`,
            width: `${groupselectionRect.width}px`,
            height: `${groupselectionRect.height}px`,
            opacity: groupselectionRect.opacity,
          }"
        ></div>
      </div>
      
    </div>

    <div class="self-avatar" v-if="peopleList.length === 1 && !cameraOn">
      <md-avatar :src="$store.state.avatarPath+me.avatar" class="img" ></md-avatar>
    </div>

    <div 
      class="video_scrollpane_wrap"
      ref="video_scrollpane_wrap"
      v-show="videoLayout === 'grid' || filteredPeopleNum() > 0"
      :class="{
        trans: videoScrollpaneAnimated,
        transition: !disableElementTransition,
        stage_max: stageMaximized,
      }"
      :style="{
        width: stripWrapWidth, 
        height: stripWrapHeight, 
        top: stripWrapTop,
        left: stripWrapLeft,
        opacity: sceneSyncing ? 0 : 1,
      }"
    >
      <div 
        class="strip_drag_handler" 
        ref="strip_drag_handler" 
        :class="{
          horizontal: dockSide === 'T' || dockSide === 'B',
          vertical: dockSide === 'L' || dockSide === 'R',
        }"
        v-if="!stageMaximized && (videoLayout === 'stage' || videoLayout === 'stage-sharing')" 
        v-show="videoZoomLevel > -1 && videoStripSize.width > 10"

        style="{pointer-events: none}"

        @mousedown="videopaneMousedown"
      >
        <!--
        <svg v-show="dockSide === 'T' || dockSide === 'B'" width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1 0.500313C1 0.223998 0.77614 0 0.5 0C0.22386 0 0 0.223998 0 0.500313V1.7511C0 2.02741 0.22386 2.25141 0.5 2.25141C0.77614 2.25141 1 2.02741 1 1.7511V0.500313ZM1 5.08314C1 4.80682 0.77614 4.58282 0.5 4.58282C0.22386 4.58282 0 4.80682 0 5.08314V6.33392C0 6.61023 0.22386 6.83423 0.5 6.83423C0.77614 6.83423 1 6.61023 1 6.33392V5.08314ZM0.5 9.16577C0.77614 9.16577 1 9.38977 1 9.66608V10.9169C1 11.1932 0.77614 11.4172 0.5 11.4172C0.22386 11.4172 0 11.1932 0 10.9169V9.66608C0 9.38977 0.22386 9.16577 0.5 9.16577ZM1 14.2489C1 13.9726 0.77614 13.7486 0.5 13.7486C0.22386 13.7486 0 13.9726 0 14.2489V15.4997C0 15.776 0.22386 16 0.5 16C0.77614 16 1 15.776 1 15.4997V14.2489ZM3.5 0C3.77614 0 4 0.223998 4 0.500313V1.7511C4 2.02741 3.77614 2.25141 3.5 2.25141C3.22386 2.25141 3 2.02741 3 1.7511V0.500313C3 0.223998 3.22386 0 3.5 0ZM4 5.08314C4 4.80682 3.77614 4.58282 3.5 4.58282C3.22386 4.58282 3 4.80682 3 5.08314V6.33392C3 6.61023 3.22386 6.83423 3.5 6.83423C3.77614 6.83423 4 6.61023 4 6.33392V5.08314ZM3.5 9.16577C3.77614 9.16577 4 9.38977 4 9.66608V10.9169C4 11.1932 3.77614 11.4172 3.5 11.4172C3.22386 11.4172 3 11.1932 3 10.9169V9.66608C3 9.38977 3.22386 9.16577 3.5 9.16577ZM4 14.2489C4 13.9726 3.77614 13.7486 3.5 13.7486C3.22386 13.7486 3 13.9726 3 14.2489V15.4997C3 15.776 3.22386 16 3.5 16C3.77614 16 4 15.776 4 15.4997V14.2489Z" fill="#707070"/>
        </svg>

        <svg v-show="dockSide === 'L' || dockSide === 'R'" width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4997 1C15.776 1 16 0.77614 16 0.5C16 0.22386 15.776 -9.79126e-09 15.4997 -2.18694e-08L14.2489 -7.6543e-08C13.9726 -8.86209e-08 13.7486 0.22386 13.7486 0.5C13.7486 0.77614 13.9726 1 14.2489 1L15.4997 1ZM10.9169 1C11.1932 1 11.4172 0.77614 11.4172 0.5C11.4172 0.22386 11.1932 -2.10113e-07 10.9169 -2.22191e-07L9.66608 -2.76864e-07C9.38977 -2.88942e-07 9.16577 0.22386 9.16577 0.5C9.16577 0.77614 9.38977 1 9.66608 1L10.9169 1ZM6.83423 0.5C6.83423 0.77614 6.61023 1 6.33392 1L5.0831 1C4.8068 1 4.5828 0.77614 4.5828 0.5C4.5828 0.223859 4.8068 -4.8927e-07 5.0831 -4.77193e-07L6.33392 -4.22518e-07C6.61023 -4.1044e-07 6.83423 0.22386 6.83423 0.5ZM1.7511 0.999999C2.0274 0.999999 2.2514 0.776139 2.2514 0.499999C2.2514 0.223859 2.0274 -6.10762e-07 1.7511 -6.22839e-07L0.5003 -6.77513e-07C0.224 -6.89591e-07 -9.78523e-09 0.223859 -2.18557e-08 0.499999C-3.39262e-08 0.776139 0.224 0.999999 0.5003 0.999999L1.7511 0.999999ZM16 3.5C16 3.77614 15.776 4 15.4997 4L14.2489 4C13.9726 4 13.7486 3.77614 13.7486 3.5C13.7486 3.22386 13.9726 3 14.2489 3L15.4997 3C15.776 3 16 3.22386 16 3.5ZM10.9169 4C11.1932 4 11.4172 3.77614 11.4172 3.5C11.4172 3.22386 11.1932 3 10.9169 3L9.66608 3C9.38977 3 9.16577 3.22386 9.16577 3.5C9.16577 3.77614 9.38977 4 9.66608 4L10.9169 4ZM6.83423 3.5C6.83423 3.77614 6.61023 4 6.33392 4L5.0831 4C4.8068 4 4.5828 3.77614 4.5828 3.5C4.5828 3.22386 4.8068 3 5.0831 3L6.33392 3C6.61023 3 6.83423 3.22386 6.83423 3.5ZM1.7511 4C2.0274 4 2.2514 3.77614 2.2514 3.5C2.2514 3.22386 2.0274 3 1.7511 3L0.5003 3C0.224 3 -1.40919e-07 3.22386 -1.5299e-07 3.5C-1.6506e-07 3.77614 0.224 4 0.5003 4L1.7511 4Z" fill="#707070"/>
        </svg>
        -->
      </div>

      <div 
        v-if="!stageMaximized && (videoLayout === 'stage' || videoLayout === 'stage-sharing')"
        v-show="!isStripDragging && (hudVisible || isdragging)"
        ref="dock_resize_handler" 
        :class="['dock_resize_handler', `dock${dockSide}`]"
        v-tooltip="videoStripSize.height === 0 ? 'Show more participant video thumbnails' : null"
        @mousedown="dockResizeHandlerMousedown" 
        @click="dockResizeHandlerClick" 
      >
        <div class="hidden-line"></div>
      </div>

      <div v-if="stageMaximized" class="floating_strip_head" @mousedown="floatingStripMousedown">
        <div class="btngrp btn">
          <wl-icon name="arrow-down-filled" size="12" />
        </div>
        <div class="btngrp">
          <div class="btn" :class="{selected: floatingStripLayout === 'single'}" @click="floatingStripLayout = 'single'" >
            <wl-icon name="video-layout-single-bold" size="12" :class="{on: floatingStripLayout === 'single'}" />
          </div>
          <div class="btn" :class="{selected: floatingStripLayout === 'list'}" @click="floatingStripLayout = 'list'" >
            <wl-icon name="video-layout-equal-bold" size="12" :class="{on: floatingStripLayout === 'list'}" />
          </div>
        </div>
      </div>

      <div ref='video_scrollpane'
        v-show='
          !devicePaired 
          && (location === "left" 
            && videoLayout !== "single-sharing" 
            || location === "left" 
              && $store.getters.currentSharingInStage(meetingId) > 0  
              && videoAndShareContentSwapped 
            || location === "right"
          )'
        :class="[
          'video_scrollpane',
          ((videoLayout === 'stage' || videoLayout === 'stage-sharing') && ($store.getters.currentSharingInStage(meetingId) === 0 && peopleList.length == 3 || $store.getters.currentSharingInStage(meetingId) > 0 && peopleList.length == 2)) && 'onlyone',
          videoListAlignTop && 'align_top',
          {
            horizontal: dockSide === 'T' || dockSide === 'B',
            vertical: dockSide === 'L' || dockSide === 'R',
            transition: !disableElementTransition,
          },
        ]"
        :style="{
          width: videoLayout === 'grid' ? '100%' : stripWidth, 
          height: (videoLayout === 'stage' || videoLayout === 'stage-sharing') ? stripHeight : '', 
          top: videoLayout === 'grid' ? 'auto' : stripTop,
          left: videoLayout === 'grid' ? '0' : stripLeft,
        }"
        @scroll="onStripScroll"
        >
          <div
            class="video_list_container"
            :class="{
              mask: (videoLayout === 'stage' || videoLayout === 'stage-sharing') && showGradientMask,
            }"
            :style="{
                width: videoListRect && videoListRect.width ? `${videoListRect.width}px` : '',
                height: videoListRect && videoListRect.height ? `${videoListRect.height}px` : '',
              }"
            ref='video_list_container'
            @mouseenter="sharingContentPointerEventsDisabled = true"
            @mouseleave="sharingContentPointerEventsDisabled = false"
          >
              <video-item
                v-for='p in filteredPeopleList'
                :id="`video-item_${p.name.replace(/ /g, '-')}`"
                :key='p.name'
                :index="p.index"
                :width="`${videoItemPosition[p.name] && videoItemPosition[p.name].width ? videoItemPosition[p.name].width : videoColumnWidth}px`"
                :height="`${videoItemPosition[p.name] && videoItemPosition[p.name].height ? videoItemPosition[p.name].height : videoRowHeight}px`"
                :opacity="`${videoStripOpacity}`"
                :absolute="true"
                :name='p.name'
                :isAI='p.isAI'
                :host='p.host'
                :avatar='p.avatar'
                :video='p.video'
                :videoList='p.videoList'
                :audio='p.audio'
                :muted='p.muted'
                :sort='p.sort'
                :reaction='p.reaction'
                :timezone='p.timezone'
                :isActiveSpeaker='p.name === activeSpeakerName'
                :isTalking='p.isTalking'
                :positionLeft='videoItemPosition[p.name] ? videoItemPosition[p.name].left : ""'
                :positionTop='videoItemPosition[p.name] ? videoItemPosition[p.name].top : ""'
                :objectPosition="`${videoItemPosition[p.name] && videoItemPosition[p.name].objectPosition ? videoItemPosition[p.name].objectPosition : 'center 0'}`"
                v-bind:leftempty='videoItemPosition[p.name] ? videoItemPosition[p.name].leftempty : "0"'
                v-bind:rightempty='videoItemPosition[p.name] ? videoItemPosition[p.name].rightempty : "0"'
                :zIndex="videoItemSortIndex === p.sort ? '1' : '0'"
                :meetingId="meetingId"
                :splitVideo="videoLayout === 'grid' && gridViewPeopleFocus && videoItemPosition[p.name] && videoItemPosition[p.name].narrow ? p.splitVideo : null"
                :isSign='p.isSign' 
                :signLang='p.lang' 
                :statusTxt="p.statusTxt" 
                @dragstart="onVideoDragStart"
                @dragging="onVideoDrag"
                @dragstop="onVideoDragStop"
                
              />
              
          </div>
          
      </div><!--video_scrollpane-->

    </div><!--video_scrollpane_wrap-->

    <video-item
      id='maximize_video'
      v-if="maximizeVideoTmp && maximizeVideoVisible"
      :isMaxVideo='true'
      :floatingVideo='false'
      :name='maximizeVideoTmp && maximizeVideoTmp.name'
      :host='maximizeVideoTmp && maximizeVideoTmp.host'
      :avatar='maximizeVideoTmp && maximizeVideoTmp.avatar'
      :video='maximizeVideoTmp && maximizeVideoTmp.video'
      :audio='maximizeVideoTmp && maximizeVideoTmp.audio'
      :muted='maximizeVideoTmp && maximizeVideoTmp.muted'
      :reaction='maximizeVideoTmp.reaction'
      :meetingId="meetingId"
    />

    <div v-show="sceneSyncing" class="scene" ref="scene" >
      <div 
        v-if="sceneLogo" 
        class="logo" 
        :style="{
          left: `${(sceneLogo.left + sceneLogo.width/2) * ((sceneRect.width - 16) / sceneLogo.parentWidth) - sceneLogo.width/2}px`,
          top: `${(sceneLogo.top + sceneLogo.height/2) * (sceneRect.height / sceneLogo.parentHeight) - sceneLogo.height/2}px`,
          width: `${sceneLogo.width}px`,
          height: `${sceneLogo.height}px`,
        }"></div>
    </div>

  </div><!--video-pane-->
</template>

<script>
import mframe from 'mframe'
import _ from 'lodash'
import popSignLanguageVideo from './pop-sign-language-video'

const videoPaneMarginX = 4

export default {
props: [
  'meetingId',
  'location',
],

data() {
  return {
    videoColumnWidth: null,
    videoRowHeight: null,
    videoStripOpacity: 1,
    stageVideoColumnWidth: null,
    stageVideoRowHeight: null,
    videoListRect: null,
    videoItemPosition: {},
    maximizeVideoTmp: null,
    maximizeVideoVisible: false,
    stripWidth: '',
    stripHeight: '',
    stripTop: '0',
    stripLeft: '0',
    stripWrapWidth: '',
    stripWrapHeight: '',
    stripWrapTop: '0',
    stripWrapLeft: '0',
    stripZoomStep: 1.125,
    dockResizeDraggingPageX: 0,
    dockResizeDraggingPageY: 0,
    stageResizeDraggingPageX: 0,
    itv_docktrans: 0,
    isdragging: false,
    videoListAlignTop: false,
    showGradientMask: false,
    stageVideoRect: {
      width: '100%',
      height: '100%',
      top: '0px',
      left: '0px',
    },
    as_muted: false,
    stripPageIndex: 0,
    stripTotalPage: 1,
    draggingVideoName: null,
    reorderingPinVideo: false,
    sharingContentPointerEventsDisabled: false,
    videoDragFromIndex: null,
    videoDropAndInsertAtIndex: null,
    videoInsertLastIndex: 777,
    doNotChangeZoom: false,
    timeout_checkInsertPosition: null,
    // video strip dock
    mouseX: null,
    mouseY: null,
    isStripDragging: false,
    stripDragPosition: {
      left: 0,
      top: 0,
    },
    dockSide: 'T',
    videoScrollpaneAnimated: false,
    floatingStripLayout: 'list',
    resizeObserver: null,
    stageResizeObserver: null,
    stageAllowToDrop: false,
    dropPinPeople: {},
    dropPinPeoplePrepared: {},
    dropPinTweenRect: {},
    stageDividedColumnRect: {},
    stageDividedColumnGap: 4,
    stageDividedColumnMargin: 4,
    floatingStripPositionInited: false,
    synclabelVisible: true,

    groupselectionMouseStartPoint: {},
    groupselectionMouseEndPoint: {},
    groupselectionRect: {},
    groupselectedVideo: [],
    sceneRect: {},

  };
},
computed: {
  os() {
    return this.$store.state.os;
  },
  theme() {
    return this.$store.state.theme;
  },
  hudVisible() {
    return this.$store.state.hudVisible;
  },
  devicePairedName() {
    return this.$store.state.devicePairedName;
  },
  devicePairedImage() {
    return this.$store.state.devicePairedImage;
  },
  disableElementTransition() {
    return this.$store.state.disableElementTransition;
  },
  sidePanelIsOpen() {
    return this.$store.state.sidePanelIsOpen;
  },
  videoLayout() {
    return this.$store.getters.videoLayout(this.meetingId)
  },
  maximizeVideo() {
    return this.$store.state.maximizeVideo;
  },
  hidePeopleWithoutVideo() {
    return this.$store.state.hidePeopleWithoutVideo;
  },
  selfVideoWithOthers() {
    if (this.meetingType !== 'webex') {
      return false
    }
    return this.$store.state.selfVideoWithOthers && !this.donotShowMySelf && (this.cameraOn || this.selfvideoAvatarVisible || this.selfViewOption === 2);
  },
  donotShowMySelf() {
    return this.$store.state.donotShowMySelf;
  },
  selfViewOption() {
    return this.$store.state.selfViewOption;
  },
  selfvideoAvatarVisible() {
    return this.$store.state.selfvideoAvatarVisible;
  },
  selfVideoWithOthers2() {
    const lst = this.peopleList.filter(
      p => {
        return (!p.me || p.me && this.cameraOn) && (!this.hidePeopleWithoutVideo || this.hidePeopleWithoutVideo && p.video)}
    )
    const len = lst.length;

    if (this.videoLayout.indexOf('grid') > -1 && len === 2) {
      //return true;
    }
    if (this.videoLayout.indexOf('stage') > -1 && this.peopleList.length <= 2) {
      //return false;
    }
    if (this.videoLayout.indexOf('stage') > -1 && this.peopleList.length === 3) {
      //return true;
    }
    return this.selfVideoWithOthers;
  },
  activeSpeakerName() {
    return this.$store.state.activeSpeakerName;
  },
  activeSpeakerNameWithVideo() {
    return this.$store.state.activeSpeakerNameWithVideo;
  },
  activeSpeaker() {
    return this.$store.getters.activeSpeaker;
  },
  host() {
    return this.$store.getters.host;
  },
  me() {
    return this.$store.getters.me;
  },
  muted() {
    return this.$store.state.muted;
  },
  fullscreen() {
    return this.$store.state.fullscreen;
  },
  activeSpeakerMoveToFirst() {
    return this.$store.state.activeSpeakerMoveToFirst;
  },
  stageMaximized() {
    return this.$store.state.stageMaximized;
  },
  videoAndShareContentSwapped() {
    return this.$store.state.videoAndShareContentSwapped;
  },
  anyOpenPanel() {
    return this.$store.getters.anyOpenPanel;
  },
  currentSharing() {
    return this.$store.getters.currentSharing(this.meetingId)
  },

  peopleListIdx() {
    return this.$store.state.peopleListIdx;
  },
  peopleListTestMeeting() {
    return this.$store.state.peopleListTestMeeting;
  },
  isFTE() {
    return this.$store.state.isFTE;
  },
  FTE_peopleInvited() {
    return this.$store.state.FTE_peopleInvited;
  },
  inMeetingInvitePlaceholderVisible() {
    return this.$store.state.inMeetingInvitePlaceholderVisible;
  },
  peopleSI() {
    return this.$store.state.peopleSI;
  },
  peopleList() {
    let testplist = this.FTE_peopleInvited ? [this.me].concat(this.peopleListTestMeeting) : [this.me]
    let ppp = this.isFTE ? testplist : this.$store.state.peopleList
    let plst = ppp.slice().filter((p) => {
        return p.room === undefined;
      }
    )
    /* 如果使用这个invite功能， video-item需要独立出来一个单独的component： invite-placeholder
    if (plst.length === 1 && this.inMeetingInvitePlaceholderVisible){
      plst = plst.concat({
        name: 'invite-placeholder',
      })
    }
    */
    return plst;
  },
  peopleNotJoinedList() {
    return this.$store.state.peopleNotJoinedList;
  },
  filteredPeopleList() {
    var asname = this.hidePeopleWithoutVideo ? this.activeSpeakerNameWithVideo : this.activeSpeakerName
    var list = this.peopleList.slice()

    if (this.sliEnabled && this.signLanguage && this.signLanguageVideoPosition == 'after-selfvideo') {
      if(this.selfVideoWithOthers2){
        list.splice(1, 0, this.signLanguagePeople)
      }else{
        list.splice(0, 0, this.signLanguagePeople)
      }
    }

    if (this.meetingType === 'video-call') {
      let callinfo = this.$store.getters.meetingCallInfo(this.meetingId)
      list = [this.me, callinfo.people]
      asname = callinfo.people.name
    }
    
    let plst = list.filter((p) => {
        return (
            this.videoLayout === 'grid' || 
            (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing') &&  (
              p.pin === undefined && p.name !== asname ||
              p.name === asname && !this.activeSpeakerInStage && this.pinnedPeopleList.length > 0
            )) && 
          (!p.me || p.me && this.selfVideoWithOthers2) && 
          (!this.hidePeopleWithoutVideo || this.hidePeopleWithoutVideo && p.video)
      }
    )

    return plst;
  },
  pinnedPeopleList() {
    let plst = []
    plst = this.peopleList.slice().filter((p) => {
        return p.pin >= 0 || this.videoLayout === 'stage-sharing' && this.activeSpeakerInStage && p.name === this.activeSpeakerName;
        //return p.pin >= 0
      }
    )
    //if (this.videoLayout === 'stage' && this.activeSpeakerInStage && plst.length === 1 && plst[0].name === this.activeSpeakerName) {
    //  return [];
    //}
    var names = plst.reduce(
        (arr, itm) => {
          arr.push(itm.name);
          return arr;
        },
        []
      );

    let plst2 = []
    if (this.sliEnabled && this.signLanguage && this.signLanguageVideoPosition == 'after-selfvideo') {
     plst2 = this.$store.state.peopleSI.filter((p) => {
         return p.pin >= 0 && names.indexOf(p.name) == -1
       }
     )
    }

    return plst.concat(plst2);
  },
  stagePeopleList() {
    if (this.pinnedPeopleList.length > 0 || this.videoLayout === 'stage-sharing') {
      return this.pinnedPeopleList;
    } else {
      return [];
    }
  },
  sliEnabled() {
    return this.$store.state.sliEnabled;
  },
  sliOption() {
    return this.$store.state.sliOption;
  },
  signLanguage() {
    return this.$store.state.signLanguage;
  },
  signLanguageVideoPosition() {
    return this.$store.state.signLanguageVideoPosition;
  },
  signLanguageWindowName() {
    return this.$store.state.signLanguageWindowName;
  },
  signLanguagePeople() {
    let p = this.peopleSI.find(p => {
        return p.lang == this.signLanguage
    })
    return p
  },
  videoStripDockSide() {
    var meeting = this.meetingOptionsList.find(
      itm => itm.meetingId === this.meetingId
    );
    return meeting.videoStripDockSide;
  },
  meetingOptionsList() {
    return this.$store.state.meetingOptionsList;
  },
  videoStripSize() {
    return this.$store.state.videoStripSize;
  },
  cameraOn() {
    return this.$store.state.cameraOn;
  },
  devicePaired() {
    return this.$store.state.devicePaired;
  },
  deviceInSharing() {
    return this.$store.state.deviceInSharing;
  },
  deviceConnecting() {
    return this.$store.state.deviceConnecting;
  },
  videoZoomLevel() {
    return this.$store.getters.videoZoomLevel(this.meetingId);
  },
  videoZoomMax() {
    return this.$store.getters.videoZoomMax(this.meetingId);
  },
  doNotAutoChangeZoom() {
    return this.$store.state.doNotAutoChangeZoom;
  },
  videoItemSortIndex() {
    return this.$store.state.videoItemSortIndex;
  },
  windowsSizeChanged() {
    return this.$store.state.windowsSizeChanged;
  },
  videoInStageSortIndex() {
    return this.$store.state.videoInStageSortIndex;
  },
  maxVideoInStage() {
    return this.$store.state.maxVideoInStage;
  },
  activeSpeakerInStage() {
    return this.$store.state.activeSpeakerInStage;
    //return this.$store.state.activeSpeakerInStage || this.sliEnabled;
  },
  fullscreenMargin() {
    return this.$store.getters.fullscreenMargin;
  },
  stageTheme() {
    return this.$store.state.stageTheme;
  },
  stageThemeLogo() {
    return this.$store.state.stageThemeLogo;
  },
  stageSyncing() {
    return this.$store.state.stageSyncing;
  },
  shareStagePanelVisible() {
    return this.$store.state.shareStagePanelVisible;
  },
  gridViewPeopleFocus() {
    return this.$store.state.gridViewPeopleFocus;
  },
  defaultVideoRatios() {
    return this.$store.state.defaultVideoRatios;
  },
  sceneSyncing() {
    return this.$store.state.sceneSyncing;
  },
  scene() {
    return this.$store.state.scene;
  },
  sceneLogo() {
    return this.$store.state.sceneLogo;
  },
  meetingType() {
    return this.$store.getters.meetingType(this.meetingId)
  },
  meetingCallInfo() {
    return this.$store.getters.meetingCallInfo(this.meetingId)
  },
  callPeopleVideoOn() {
    return this.$store.getters.callPeopleVideoOn(this.meetingId)
  },
},
mounted() {
  this.dockSide = this.videoStripDockSide;
  this.resizeLayout();
  this.initResizeWatch();

  if (this.signLanguage && this.videoLayout === 'grid') {
    var optlist = _.cloneDeep(this.meetingOptionsList)
    var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
    optlist[idx].videoLayout = 'stage'
    this.$store.commit('meetingOptionsList', optlist)
  }
},
beforeDestroy() {
  this.removeResizeWatch();
},
watch: {
  signLanguage(val, oldVal) {
    this.swapSignLangPeoplePin(val, oldVal)
    this.setSignLanguageVideo()
  },
  signLanguageVideoPosition() {
    this.setSignLanguageVideo()
  },
  videoAndShareContentSwapped(val){
    if (!val) {

      //

    } else {
      let mode
      if (this.videoLayout === 'stage-sharing') {
        mode = 'stage'
      } else if (this.videoLayout === 'single-sharing') {
        mode = 'single'
      }
      if (mode) {
        var optlist = _.cloneDeep(this.meetingOptionsList)
        var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
        optlist[idx].videoLayout = mode
        this.$store.commit('meetingOptionsList', optlist)
      }

    }
  },
  activeSpeakerName() {
    this.$nextTick(() => {
      this.resizeLayout();
    });
  },
  activeSpeakerNameWithVideo() {
    this.$nextTick(() => {
      this.resizeLayout();
    });
  },
  activeSpeaker(val) {
    this.as_muted = val.muted;
  },
  activeSpeakerInStage(val) {
    const asname = this.hidePeopleWithoutVideo ? this.activeSpeakerNameWithVideo : this.activeSpeakerName
    if (val) {
      let actInStage = false;
      for (let i = 0; i < this.stagePeopleList.length; i++) {
          const p = this.stagePeopleList[i];
          if (p.name === asname) {
              actInStage = true;
          }
      }
      if (!actInStage && this.$store.getters.currentSharingInStage(this.meetingId) > 0) {
        // if activeSpeakerInStage, should auto add active speaker to stage video list when sharing started
        const pid = this.videoInStageSortIndex+100;
        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.name === asname) {
                p.pin = pid;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);
      }
    } else {
      let plist = [];
      const len = this.peopleList.length;
      for (let i = 0; i < len; i++) {
          const p = this.peopleList[i];
          if (p.name === asname) {
              p.pin = undefined;
              p.autopin = false;
          }
          plist.push(p);
      }
      this.$store.commit('peopleList', plist);
    }

    this.$nextTick(() => {
      this.resizeLayout();
    });

    if (val) {
      this.initActiveSpeakerPin()
    }
  },
  stageMaximized() {
    this.floatingStripPositionInited = false;
    this.$store.commit('disableElementTransition', true);
    requestAnimationFrame(() => {
      this.calcStageSize();
    });
  },
  videoLayout(val) {
    this.$store.commit('disableElementTransition', true);
    this.stageViewResizeUnobserve();

    if (val === 'stage') {
      //this.initActiveSpeakerPin();
      this.removeActiveSpeakerPin();
    } else if (val === 'stage-sharing') {
      //this.removeActiveSpeakerAutoPin();

      // pin activespeaker, 这样就可以交换顺序了 TODO
      let plist
      let len

      plist = []
      len = this.peopleList.length;
      for (let i = 0; i < len; i++) {
          const p = this.peopleList[i];
          if (p.name === this.activeSpeakerName) {
              p.pin = this.videoInStageSortIndex + this.pinnedPeopleList.length + 1; // activeSpeake 放上面？
          }
          plist.push(p);
      }
      this.$store.commit('peopleList', plist);
    }

    this.$nextTick(() => {
      this.resizeLayout();
      requestAnimationFrame(() => {
        this.resizeLayout();
      });
    });
  },
  cameraOn() {
    this.$nextTick(() => {
      this.resizeLayout();
    });
  },
  peopleList() {
    if (!this.doNotChangeZoom && !this.doNotAutoChangeZoom) {
      // auto change zoom level
      this.autoChangeZoom();
    }
    this.doNotChangeZoom = false;
    this.$store.commit("doNotAutoChangeZoom", false);

    this.$nextTick(() => {
      this.resizeLayout();
    });

    this.setNoVideoTip();
    if (this.pinnedPeopleList.length === 0 && this.$store.getters.currentSharingInStage(this.meetingId) === 0 ) {
      this.$store.commit("activeSpeakerInStage", true); // TODO 
    }
  },

  hidePeopleWithoutVideo() {
    this.autoChangeZoom();
    this.$nextTick(() => {
      this.resizeLayout();
    });
    this.setNoVideoTip();
    
  },
  selfVideoWithOthers() {
    this.autoChangeZoom();
    this.$nextTick(() => {
      this.resizeLayout();
    });
  },
  donotShowMySelf() {
    this.autoChangeZoom();
    this.$nextTick(() => {
      this.resizeLayout();
    });
  },
  videoZoomLevel() {
    this.$nextTick(() => {
      this.resizeLayout();
    });
  },
  videoStripSize() {
    this.$nextTick(() => {
      this.resizeLayout();
    });
  },
  gridViewPeopleFocus() {
    this.$nextTick(() => {
      this.resizeLayout();
    });
  },

  meetingOptionsList(val, oldVal) {
    var meeting = val.find(
      itm => itm.meetingId === this.meetingId
    )
    var oldmeeting = oldVal.find(
      itm => itm.meetingId === this.meetingId
    )

    if (meeting.videoLayout !== oldmeeting.videoLayout) {
      //this.videoLayoutChanged = true
    }

    if (!oldmeeting || meeting.videoStripDockSide !== oldmeeting.videoStripDockSide) {
      this.dockSide = meeting.videoStripDockSide; 
    }

    if (!oldmeeting || meeting.currentSharing.length !== oldmeeting.currentSharing.length) {
      if (meeting.currentSharing.length > 0) {
        //this.$store.commit("activeSpeakerInStage", false);
      } else {
        if (this.pinnedPeopleList.length === 0) {
          this.$store.commit("activeSpeakerInStage", true);
        }
      }

      /*
      if (val) {
        let actInStage = false;
        for (let i = 0; i < this.stagePeopleList.length; i++) {
            const p = this.stagePeopleList[i];
            if (p.name === this.activeSpeakerName) {
                actInStage = true;
            }
        }
        
        if (this.stagePeopleList.length > 0 && !actInStage && this.activeSpeakerInStage) {
          // if activeSpeakerInStage, should auto add active speaker to stage video list when sharing started
          const pid = this.videoInStageSortIndex+100;
          let plist = [];
          const len = this.peopleList.length;
          for (let i = 0; i < len; i++) {
              const p = this.peopleList[i];
              if (p.name === this.activeSpeakerName) {
                  p.pin = pid;
              }
              plist.push(p);
          }
          this.$store.commit('peopleList', plist);
        }
      }
      */

      this.$nextTick(() => {
        this.resizeLayout();
      });

      this.setNoVideoTip();
      
    }

  },

  maximizeVideo(newVal) {
    if (newVal) {
      this.maximizeVideoTmp = newVal;
      this.maximizeVideoVisible = true;
      this.$nextTick(() => {
        const item = document.querySelector(`#video-item_${this.maximizeVideoTmp.name.replace(/ /g, '-')} .video`); 
        const maxitem = document.getElementById('maximize_video');
        const parentRect = this.$refs['video-pane'].getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        const style1 = {
          left: `${itemRect.left - parentRect.left}px`,
          top: `${itemRect.top - parentRect.top}px`,
          width: `${itemRect.width}px`,
          height: `${itemRect.height}px`,
        };

        const style2 = {
          left: '0px',
          top: '0px',
          width: `${parentRect.width}px`,
          height: `${parentRect.height}px`,
        };

        const trans = mframe([{
            dom: maxitem,
            frames: [
                { css: style1, time:0 },
                { css: style2, time:20, tween: 'easeInOut' }
            ]
        }]);
        trans.play();

      });
      
    } else {

      const item = document.querySelector(`#video-item_${this.maximizeVideoTmp.name.replace(/ /g, '-')} .video`); 
      const maxitem = document.getElementById('maximize_video');
      const parentRect = this.$refs['video-pane'].getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const style1 = {
        left: `${itemRect.left - parentRect.left}px`,
        top: `${itemRect.top - parentRect.top}px`,
        width: `${itemRect.width}px`,
        height: `${itemRect.height}px`,
      };

      const style2 = {
        left: '0px',
        top: '0px',
        width: `${parentRect.width}px`,
        height: `${parentRect.height}px`,
      };

      const trans2 = mframe([{
          dom: maxitem,
          frames: [
              { css: style2, time:0 },
              { css: style1, time:20, tween: 'easeInOut' }
          ]
      }], {
        end: () => {
            this.maximizeVideoVisible = false;
          }
      });
      trans2.play();

    }
  },
  
  dockSide(val, oldVal) {
    if (!this.$refs.strip_drag_handler) {
      return;
    }
    const rectP = this.$refs['video-pane'].getBoundingClientRect();
    const rectD = this.$refs.strip_drag_handler.getBoundingClientRect();
    const cursorPoint = {
      x: this.mouseX - rectP.left,
      y: this.mouseY - rectP.top,
    }
    
    if ((oldVal === 'T' || oldVal === 'B') && (val === 'L' || val === 'R')) {
      this.stripDragPosition = {
        left: cursorPoint.x - this.videoColumnWidth/2,
        top: cursorPoint.y - rectD.width/2,
      };
    } else if ((oldVal === 'L' || oldVal === 'R') && (val === 'T' || val === 'B')) {
      this.stripDragPosition = {
        left: cursorPoint.x - rectD.height/2,
        top: cursorPoint.y - this.videoRowHeight/2,
      };
    }
    this.stripWrapTop = `${this.stripDragPosition.top}px`;
    this.stripWrapLeft = `${this.stripDragPosition.left}px`;

    this.$nextTick(() => {
      this.calcStageSize();
    });
  },
  floatingStripLayout() {
    if (!this.disableElementTransition) {
      this.$store.commit('disableElementTransition', true);
      setTimeout(() => {
        this.$store.commit('disableElementTransition', false);
      }, 500);
    }

    this.$refs.video_scrollpane.scrollTop = 0;
    this.calcStageSize({checkFloatingStripPosition: true});
  },
},
methods: {
  swapSignLangPeoplePin(newl, oldl) {
    let p = this.peopleSI.find(p => {
        return p.lang == oldl
    })
    
    if (p && p.pin >= 0) {
      let pid = p.pin
      let plist
      let len
      plist = []
      len = this.peopleSI.length;
      for (let i = 0; i < len; i++) {
          const p = this.peopleSI[i];
          if (p.lang === oldl) {
              p.pin = undefined
          }else if (p.lang === newl) {
              p.pin = pid;
          }
          plist.push(p);
      }
      this.$store.commit('peopleSI', plist);
    }
  },
  setSignLanguageVideo() {
    if (this.signLanguage && this.signLanguageVideoPosition == 'floating') {
      // on
      this.openSignLangWindow()
      this.$nextTick(() => {
        this.$window.bringToFront(this.signLanguageWindowName)
        this.resizeLayout();
      });
    } else if (this.signLanguage && this.signLanguageVideoPosition == 'after-selfvideo') {
      this.$nextTick(() => {
        this.resizeLayout();
      })
    } else if (!this.signLanguage) {
      // off
      if (this.signLanguageVideoPosition == 'floating') {
        this.$window.hide(this.signLanguageWindowName)
      } else {
        this.$nextTick(() => {
          this.resizeLayout();
        })
      }
    }

  },
  openSignLangWindow(options){
    var opt = options ? options : {}

    const app = document.querySelector(`[name="webex-meeting"]`);
    const appRect = app.getBoundingClientRect();
    const width = 570
    const height = 362
    let x = appRect.right - width + 60
    let y = appRect.bottom - height - 80

    this.$window.show(
      popSignLanguageVideo, 
      {
        meetingId: this.meetingId,
        ...opt
      }, // component props
      {
        name: this.signLanguageWindowName,
        w: width,
        h: height,
        x: x,
        y: y,
        minw: 460,
        minh: 290,
        isDraggable: true,
        isResizable: true,
        aspectRatio: true,
        borderRadius: this.os === 'win' ? '0' : '12px',
        dragHandle: '.drag-bg',
        
      }, // window props
      {
        closed: () => {
          
        },
      } // window eventlistener
    );

  },

  initActiveSpeakerPin(){
    /*
    if (this.videoLayout !== 'stage') {
      return;
    }
    // init active speaker pin index
    const pid = this.videoInStageSortIndex+100;
    let plist = [];
    const len = this.peopleList.length;
    for (let i = 0; i < len; i++) {
        const p = this.peopleList[i];
        if (p.name === this.activeSpeakerName && p.pin === undefined) {
            p.pin = pid;
            p.autopin = true;
        }
        plist.push(p);
    }
    this.$store.commit('peopleList', plist);
    */
  },
  removeActiveSpeakerAutoPin(){
    // remove active speaker auto pin
    /*
    let plist = [];
    const len = this.peopleList.length;
    for (let i = 0; i < len; i++) {
        const p = this.peopleList[i];
        if (p.name === this.activeSpeakerName && p.autopin) {
            p.pin = undefined;
            p.autopin = false;
        }
        plist.push(p);
    }
    this.$store.commit('peopleList', plist);
    */
  },
  removeActiveSpeakerPin(){
    const asname = this.hidePeopleWithoutVideo ? this.activeSpeakerNameWithVideo : this.activeSpeakerName
    // remove active speaker pin
    let plist = [];
    const len = this.peopleList.length;
    for (let i = 0; i < len; i++) {
        const p = this.peopleList[i];
        if (p.name === asname) {
            p.pin = undefined;
        }
        plist.push(p);
    }
    this.$store.commit('peopleList', plist);
  },
  autoChangeZoom() {
    if (this.videoLayout === 'grid') {
      const pnum = this.filteredPeopleNum();
      let lv;
      if (pnum >=2 && pnum <=4) {
        lv = this.videoZoomMax - 1;
      } else if (pnum >=5 && pnum <=9) {
        lv = this.videoZoomMax - 2;
      } else if (pnum >=10 && pnum <=16) {
        lv = this.videoZoomMax - 3;
      } else if (pnum >=17 && pnum <=26) {
        lv = this.videoZoomMax - 4;
      }
      if (lv >= 0) {
        this.$store.commit("videoZoomLevelGrd", lv);
      }
    }
    
  },
  switchTo(mode) {
    if (this.videoLayout != mode) {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      optlist[idx].videoLayout = mode
      this.$store.commit('meetingOptionsList', optlist)
    }
  },

  resizeLayout(param) {
    if (this.$refs['video-pane']) {
      this.sceneRect = this.$refs['video-pane'].getBoundingClientRect();
    }

    if (this.videoLayout !== 'stage-sharing') {
      this.stageDividedColumnRect = {};
    }
    if (this.videoLayout === 'grid') {
      this.calcGridVideoSize();
    } else if (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing') {
      this.calcStageSize(param);
      this.stageViewResizeObserve();
    }
  },

  initResizeWatch() {
    // watch resize
    const elem = this.$refs['video-pane'];
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect) {
          this.resizeLayout();
          this.$store.commit('windowsSizeChanged', this.windowsSizeChanged+1);
        }
      }
    });
    this.resizeObserver.observe(elem);
  },

  removeResizeWatch() {
    const elem = this.$refs['video-pane'];
    if (this.resizeObserver && elem) {
      this.resizeObserver.unobserve(elem);
      this.resizeObserver = null;
    }
  },

  stageViewResizeObserve() {
    // watch resize
    const elem = this.$refs.stage_video_container;
    if (elem) {
      this.stageResizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.contentRect && (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing')) {
            this.calcStageSize();
          }
        }
      });
      this.stageResizeObserver.observe(elem);
    }
  },
  stageViewResizeUnobserve() {
    const elem = this.$refs.stage_video_container;
    if (this.stageResizeObserver && elem) {
      this.stageResizeObserver.unobserve(elem);
      this.stageResizeObserver = null;
    }
  },

  filteredPeopleNum() {
    if (this.meetingType === 'audio-call') {
      return 0
    }
    return this.filteredPeopleList.length;
  },



  ////////// -------->>> people focus layout

  sumField(items, prop){
    return items.reduce((a, b) => a + b[prop], 0);
  },

  centerRowHorizontally(siteDistributionRow, clientAspectRatio, rowCount) {
    const rect = this.$refs.video_scrollpane.getBoundingClientRect();
    let sumAspectRatios = this.sumField(siteDistributionRow, 'currentAspectRatio');
    let maxRowWidth = clientAspectRatio * rowCount;
    return rect.width * (Math.max(0, maxRowWidth - sumAspectRatios) / 2) / maxRowWidth;
  },

  centerSitesVertically(aspectRatioCurrentCrops, clientAspectRatio) {
    const rect = this.$refs.video_scrollpane.getBoundingClientRect();
    return rect.height * (Math.max(0, aspectRatioCurrentCrops - clientAspectRatio) / 2) / aspectRatioCurrentCrops;
  },

  countNonEmptyRows(sites, field) {
    let rowWidths = sites.map(x => this.sumField(x, field));
    let nonEmptyRowsCount = 0;
    for (let i = 0; i < rowWidths.length; i++) {
      if (rowWidths[i] > 0) {
        nonEmptyRowsCount++;
      } 
    }
    return nonEmptyRowsCount;
  },

  getWidestRow(sites, field) {
    return Math.max.apply(null, sites.map(x => this.sumField(x, field)));
  },

  renderSites(siteDistribution) {
    
    const rect = this.$refs.video_scrollpane.getBoundingClientRect();
    let clientAspectRatio = (rect.width - videoPaneMarginX * 2) / rect.height;
    let nonEmptyRowsCount = this.countNonEmptyRows(siteDistribution, 'currentAspectRatio');
    let widestRow = this.getWidestRow(siteDistribution, 'currentAspectRatio');
    let aspectRatioCurrentCrops = widestRow / nonEmptyRowsCount;
    let cropClientFactor = aspectRatioCurrentCrops / clientAspectRatio;
    
    let posX = 0;
    let posY = this.centerSitesVertically(aspectRatioCurrentCrops, clientAspectRatio);
    if (aspectRatioCurrentCrops < clientAspectRatio) {
      cropClientFactor = 1;
    }
    let height = rect.height / (nonEmptyRowsCount * cropClientFactor);
    this.videoItemPosition = {};

    for (let i = 0; i < siteDistribution.length; i++) {
      posX = this.centerRowHorizontally(siteDistribution[i], clientAspectRatio, nonEmptyRowsCount) + videoPaneMarginX;
      for (let j = 0; j < siteDistribution[i].length; j++) {
        let site = siteDistribution[i][j];
        let people = site.people;
        let width = height * site.currentAspectRatio;
        //
        let cropPosY = 0;
        let rto = people.ratio;
        //let full = rto && rto.full ? rto.full : this.defaultVideoRatios[people.isroom ? 'room' : 'single'].full;
        let full = rto && rto.full ? rto.full : this.defaultVideoRatios['single'].full;
        if (rto && rto.offsetY) {
          let osy = rto.offsetY;
          let yIntersection = osy - osy * site.roiAspectRatio / (site.roiAspectRatio - site.fullAspectRatio);
          let yRatio = site.currentAspectRatio * osy / (site.roiAspectRatio - site.fullAspectRatio) + yIntersection;
          if (site.fullAspectRatio < site.currentAspectRatio) {
            cropPosY = height * (site.fullAspectRatio - site.currentAspectRatio) / (2 * site.fullAspectRatio) - height * yRatio * full;
          }
        }

        this.videoItemPosition[people.name] = {
          width: width,
          height: height,
          narrow: width / height < 16 / 10, // 16:9
          left: posX,
          top: posY,
          objectPosition: `center ${cropPosY}px`,
        };
        posX += width;
      }
      posY += height;
    }
  },

  sortWidestToTheLeft(maxWidthSites) {
    return maxWidthSites.map(x => x.sort((a, b) => b.currentAspectRatio - a.currentAspectRatio));
  },

  maximizeHeight(sites, clientAspectRatio) {
    let maxHeightSites = sites;
    //The line below becomes superfluous if empty is trimmed away in the function before. Then you can use length directly
    let nonEmptyRowsCount = this.countNonEmptyRows(maxHeightSites, 'currentAspectRatio');
    let widestRow = this.getWidestRow(maxHeightSites, 'currentAspectRatio');
    let aspectRatioCurrentCrops = widestRow / nonEmptyRowsCount;
    if (aspectRatioCurrentCrops > clientAspectRatio) {
      let unusedArea = 1 - clientAspectRatio / aspectRatioCurrentCrops;
      for (let i = 0; i < sites.length; i++) {
        //if the statement below becomes superfluous if you trim away blank lines in the function before
        if (sites[i].length > 0) {
          let maxCommonAspectRatioChange = Infinity;
          for (let j = 0; j < sites[i].length; j++) {
            maxCommonAspectRatioChange = Math.min(maxCommonAspectRatioChange, sites[i][j].fullAspectRatio / sites[i][j].currentAspectRatio);
          }
          let maxChange = Math.min(unusedArea, maxCommonAspectRatioChange);
          for (let j = 0; j < sites[i].length; j++) {
            sites[i][j].currentAspectRatio = sites[i][j].currentAspectRatio - sites[i][j].currentAspectRatio * maxChange;
          }
        }
      }
    }
    return maxHeightSites;
  },

  justifyMaxRowWidthForEvenEdges(maxRowWidthFromRois, maxRowWidthClient) {
    let maxRowWidth;
    if (maxRowWidthFromRois < maxRowWidthClient && maxRowWidthFromRois > maxRowWidthClient * 0.9) {
      maxRowWidth = maxRowWidthFromRois;
    } else {
      maxRowWidth = Math.max(maxRowWidthFromRois, maxRowWidthClient);
    }
    return maxRowWidth;
  },

  getWidestAspectRatio(site) {
    return (site.roiAspectRatio > site.fullAspectRatio ? site.roiAspectRatio : site.fullAspectRatio);
  },

  getMaxRowWidth(sites, clientAspectRatio) {
    let maxRowWidthFromRois = this.getWidestRow(sites, 'roiAspectRatio');
    let maxRowWidthClient = clientAspectRatio * sites.length;
    return this.justifyMaxRowWidthForEvenEdges(maxRowWidthFromRois, maxRowWidthClient);
  },

  maximizeWidth(evenlyDistributedSites, clientAspectRatio) {
    let maxWidthSites = evenlyDistributedSites;
    let maxRowWidth = this.getMaxRowWidth(maxWidthSites, clientAspectRatio);
    for (let i = 0; i < maxWidthSites.length; i++) {
      let unusedRowSpaceForRois = maxRowWidth - this.sumField(maxWidthSites[i], 'roiAspectRatio');
      let widthCropFactors = maxWidthSites[i].map(x => (this.getWidestAspectRatio(x) - x['roiAspectRatio']) / this.getWidestAspectRatio(x));
      let sumWidthCropFactors = widthCropFactors.reduce((a, b) => a + b, 0);
      for (let j = 0; j < maxWidthSites[i].length; j++) {
        if (sumWidthCropFactors > 0) {
          let maximizedAspectRatio = maxWidthSites[i][j].roiAspectRatio + widthCropFactors[j] / sumWidthCropFactors * unusedRowSpaceForRois;
          maxWidthSites[i][j].currentAspectRatio = Math.min(this.getWidestAspectRatio(maxWidthSites[i][j]), maximizedAspectRatio);
        } else {
          maxWidthSites[i][j].currentAspectRatio = maxWidthSites[i][j].roiAspectRatio;
        }
      }
    }
    return maxWidthSites;
  },

  distributeEvenly(roisOnFewestLines, clientAspectRatio) {
    let evenlyDistributedSites = roisOnFewestLines;
    let maxRowWidth = clientAspectRatio * evenlyDistributedSites.length;
    let unevenDistribution = true;
    if (evenlyDistributedSites.length <= 1) {
      unevenDistribution = false;
    }
    while (unevenDistribution) {
      unevenDistribution = false;
      for (let i = 0; i < evenlyDistributedSites.length - 1; i++) {
        if (evenlyDistributedSites[i].length > 1) {
          let roiSumCurrentRow = this.sumField(evenlyDistributedSites[i], 'roiAspectRatio');
          let roiSumNextRow = this.sumField(evenlyDistributedSites[i + 1], 'roiAspectRatio');
          if (roiSumCurrentRow > roiSumNextRow) {
            let sumWidestAspectRatios = 0;
            for (let j = 0; j < evenlyDistributedSites[i].length; j++) {
              sumWidestAspectRatios += this.getWidestAspectRatio(evenlyDistributedSites[i][j]);
            }
            if (sumWidestAspectRatios > maxRowWidth) {  
              evenlyDistributedSites[i + 1].unshift(evenlyDistributedSites[i].pop());
              evenlyDistributedSites[i + 1].sort((a, b) => b.roiAspectRatio - a.roiAspectRatio);
              unevenDistribution = true;
            }
          }
        }
      }
    }
    //Remove empty rows
    return evenlyDistributedSites;
  },

  setMinimumAspectRatio(sites, rowCount) {
    if (rowCount == 2 && sites.length > 6) {
      sites.map(x => x.roiAspectRatio = Math.max(x.roiAspectRatio, 8/9));
    } else if (rowCount == 3 && sites.length > 12) {
      sites.map(x => x.roiAspectRatio = Math.max(x.roiAspectRatio, (16*3)/(9*5))); 
    } else if (rowCount == 4 && sites.length > 24) {
      sites.map(x => x.roiAspectRatio = Math.max(x.roiAspectRatio, 8/9));
    } else if (rowCount == 5 && sites.length > 48) {
      sites.map(x => x.roiAspectRatio = Math.max(x.roiAspectRatio, (16*4)/(9*6)));
    }
    return sites;
  },

  distributeRoisOnFewestLines(sitesAndAspectRatiosSorted, clientAspectRatio) {
    //console.log("distributeRoisOnFewestLines ", rowCount);
    let rowCount = 1;
    let siteDistribution;
    let distributed = true;
    let allDistributed = false;
    while (!allDistributed) {
      //console.log("Updated rowCount: " + rowCount);
      let maxRowWidth = clientAspectRatio * rowCount;
      //console.log("maxRowWidth: " + maxRowWidth);
      let rowWidths = new Array(rowCount).fill(0);
      siteDistribution = [];

      for (let i = 0; i < sitesAndAspectRatiosSorted.length; i++) {
        distributed = false;
        for (let j = 0; j < rowCount; j++) {
          //sitesAndAspectRatiosSorted = this.setMinimumAspectRatio(sitesAndAspectRatiosSorted, rowCount);
          let rowWidth = rowWidths[j] + sitesAndAspectRatiosSorted[i].roiAspectRatio;

          if (rowWidth <= maxRowWidth) {
            rowWidths[j] = rowWidth;
            if (siteDistribution.length <= j) {
              siteDistribution.push([sitesAndAspectRatiosSorted[i]]);
            } else {
              siteDistribution[j].push(sitesAndAspectRatiosSorted[i]);
            }
            if (siteDistribution.length < rowWidths.length) {
              siteDistribution.push([]);
            }
            distributed = true;
            //console.log("distributed: ", rowWidth, maxRowWidth);
            break;
          }
        }
        if (!distributed) {
          rowCount++;
          break;
        }
      }
      if (distributed) {
        allDistributed = true; 
      }
    }
    return siteDistribution;
  },

  calcAspectRatios() {
    let plist = this.filteredPeopleList.slice();
    let sitesAndAspectRatios = [];
    const ratios = this.defaultVideoRatios;
    for (let i = 0; i < plist.length; i++) {
      const p = plist[i]
      //let roiAspectRatio = p.ratio && p.ratio.roi ? p.ratio.roi : ratios[p.isroom ? 'room' : 'single'].roi;
      let roiAspectRatio = p.ratio && p.ratio.roi ? p.ratio.roi : ratios['single'].roi;
      //let fullAspectRatio = p.ratio && p.ratio.full ? p.ratio.full : ratios[p.isroom ? 'room' : 'single'].full;
      let fullAspectRatio = p.ratio && p.ratio.full ? p.ratio.full : ratios['single'].full;
      sitesAndAspectRatios.push({people: plist[i], fullAspectRatio: fullAspectRatio, roiAspectRatio: roiAspectRatio, currentAspectRatio: 0});
    }
    sitesAndAspectRatios.sort((a, b) => b.roiAspectRatio - a.roiAspectRatio);
    return sitesAndAspectRatios;
  },

  distributeSites() {
    const rect = this.$refs.video_scrollpane.getBoundingClientRect();
    let clientAspectRatio = (rect.width - videoPaneMarginX * 2) / rect.height;
    let sitesAndAspectRatiosSorted = this.calcAspectRatios();
    let roisOnFewestLines = this.distributeRoisOnFewestLines(sitesAndAspectRatiosSorted, clientAspectRatio);
    let evenlyDistributedSites = this.distributeEvenly(roisOnFewestLines, clientAspectRatio);
    let maxWidthSites = this.maximizeWidth(evenlyDistributedSites, clientAspectRatio);
    let maxHeightSites = this.maximizeHeight(maxWidthSites, clientAspectRatio);
    let sortedRows = this.sortWidestToTheLeft(maxHeightSites);
    return sortedRows;
  },

  ////////// --------<<< people focus layout


  calcGridVideoSize() {
    if (!this.$refs['video-pane'] || !this.$refs.video_scrollpane) {
      return;
    }

    const rect = this.$refs.video_scrollpane.getBoundingClientRect();

    if (!rect.width) {
      return;
    }

    this.stripWrapWidth = `100%`;
    this.stripWrapHeight = `100%`;
    this.stripWrapTop = `0`;
    this.stripWrapLeft = `0`;
    this.stripDragPosition = {
      top: 0,
      left: 0,
    };

    if (this.gridViewPeopleFocus) {
      this.videoListAlignTop = true;
      this.videoListRect = {};
      this.renderSites(this.distributeSites());
    } else {
      const column = this.videoZoomMax - this.videoZoomLevel + 1;

      let plist = this.filteredPeopleList.slice();
      const len = this.draggingVideoName && this.videoDropAndInsertAtIndex === null ? plist.length-1 : plist.length;
      const gap = 0;//4;
      let w, h;
      let marginH = 8; // leave space for active speaker glow border
      const viewportw = rect.width - marginH * 2;

      let activeSpeakerMoveToFirst = false;
      this.$store.commit("activeSpeakerMoveToFirst", false);
      if (len === 1 || column === 1) {
        w = viewportw;
        h = w / 16 * 9;

        activeSpeakerMoveToFirst = true;
        this.$store.commit("activeSpeakerMoveToFirst", true);
      } else if (len === 2) {
        w = (viewportw - gap)/2;
        h = w / 16 * 9;

      } else if (len <= 4 || column === 2) {

        w = (viewportw - gap)/2;
        h = w / 16 * 9;
        if (h * 2 + gap > rect.height) {
          h = (rect.height - gap) /2;
          w = h / 9 * 16;
          marginH = (viewportw - w * 2 - gap)/2;
        }
        
      } else if (len <= 6 || column === 3) {
        w = (viewportw - gap * (column - 1))/column;
        h = w / 16 * 9;

      } else if (len <= 8 || column === 4) {
        w = (viewportw - gap * (column - 1))/column;
        h = w / 16 * 9;

      } else if (column === 5) {

        w = (viewportw - gap * (column - 1))/column;
        h = w / 16 * 9;

      } else if (column === 6) {

        w = (viewportw - gap * (column - 1))/column;
        h = w / 16 * 9;
      }
      this.videoColumnWidth = w;
      this.videoRowHeight = h;
      this.videoStripOpacity = 1;

      const asname = this.hidePeopleWithoutVideo ? this.activeSpeakerNameWithVideo : this.activeSpeakerName
      plist.sort((a, b) => {
          if(activeSpeakerMoveToFirst){
            if (a.name === asname) {
              return -1;
            } else if (b.name === asname) {
              return 1;
            }
          }else{
            if (a.sort > b.sort) {
              return -1;
            } else if (a.sort < b.sort) {
              return 1;
            }
          }
        }
      );

      let idx = 0;
      this.videoItemPosition = {};
      for (let i=0; i<plist.length; i++) {
        const p = plist[i];
        if (this.draggingVideoName !== p.name) {
          if (this.videoDropAndInsertAtIndex === p.index) {
            idx++;
          }
          const lastrow = Math.floor(idx / column) === Math.ceil(len / column) - 1;
          const lastrownum = len % column;
          const lastrowMarginH = lastrownum > 0 ? (viewportw - lastrownum * w - (lastrownum-1) * gap) / 2 : 0;
          this.peopleListIdx[p.name] = idx;
          this.videoItemPosition[p.name] = {
            left: !lastrow ? 
              idx % column * (w + gap) + marginH: 
              idx % column * (w + gap) + marginH + lastrowMarginH,
            top: Math.floor(idx / column) * (h + gap),
            leftempty: idx % column === 0 ? 1 : 0,
            rightempty: idx % column === column - 1 || i === plist.length-1 ? 1 : 0,
          };
          idx++;
        } else {
          this.videoItemPosition[p.name] = {
            left: -0.00099,
            top: -0.00099,
          };
        }
      }
      this.$store.commit('peopleListIdx', this.peopleListIdx);
      
      this.videoListRect = {
        height: Math.ceil(len / column) * (h + gap),
      };

      this.$nextTick(() => {
        const rectVL = this.$refs.video_list_container.getBoundingClientRect();
        this.videoListAlignTop = rectVL.height > rect.height;
      });
    }

    
    
  },

  checkStripDragPosition() {
    const parentRect = this.$refs['video-pane'].getBoundingClientRect();
    const paneRect = this.$refs['video_scrollpane_wrap'].getBoundingClientRect();
    const point = {
      x: this.stripDragPosition.left,
      y: this.stripDragPosition.top,
    }
    const rect = {
      left: 0,
      top: 44,
      right: parentRect.width - paneRect.width,
      bottom: parentRect.height - paneRect.height,
    }
    if (point.x > rect.right) {
      this.stripDragPosition.left = rect.right;
      this.stripWrapLeft = `${rect.right}px`;
    }
    if (point.y > rect.bottom) {
      this.stripDragPosition.top = rect.bottom;
      this.stripWrapTop = `${rect.bottom}px`;
    }

  },

  calcStageSize(param) {
    if (!this.$refs['video-pane']) {
      return;
    }
    const parentRect = this.$refs['video-pane'].getBoundingClientRect();
    this.showGradientMask = false;

    const zoom = this.videoZoomLevel;
    const dockStageGap = 0;
    const videoGap = 0;//4;
    const layoutControlSpace = 40;
    const margin = this.fullscreenMargin;
    const floatingMargin = 0;
    let zoomMax, column, stgrect
    this.videoItemPosition = {};

    if (this.dockSide === 'T' || this.dockSide === 'B') {
      zoomMax = 0
    } else if (this.dockSide === 'L' || this.dockSide === 'R') {
      if (this.videoStripSize.width > 160 * 3) {
        zoomMax = 2
      } else if (this.videoStripSize.width > 160 * 2) {
        zoomMax = 1
      } else {
        zoomMax = 0
      }
    }

    if (zoomMax === 0) {
      column = 1
    } else if (zoomMax === 1){
      if (zoom === 0) {
        column = 2
      } else if (zoom === 1) {
        column = 1
      }
    } else if (zoomMax === 2){
      if (zoom === 0) {
        column = 3
      } else if (zoom === 1) {
        column = 2
      } else if (zoom === 2) {
        column = 1
      }
    }

    let w = 0; //Math.ceil(160 + zoom * 2);
    let h = 0; //Math.ceil(w / 16 * 9);

    if (this.dockSide === 'T' || this.dockSide === 'B') {
      h = this.videoStripSize.height;
      w = Math.ceil(h / 9 * 16);
    } else if (this.dockSide === 'L' || this.dockSide === 'R') {
      w = this.videoStripSize.width / column;
      h = Math.ceil(w / 16 * 9);
    }

    //w = Math.max(w, 0); // 150 | < 160, make sure we can minimize dock to zero width
    //h = Math.max(h, 84); // 84 | 90

    this.videoColumnWidth = w;
    this.videoRowHeight = h;
    this.videoStripOpacity = Math.min(w / 160, 1);

    const activeSpeakerMoveToFirst = this.stageMaximized && this.floatingStripLayout === 'single';
    this.$store.commit("activeSpeakerMoveToFirst", activeSpeakerMoveToFirst);
    let plist = this.filteredPeopleList.slice();
    const asname = this.hidePeopleWithoutVideo ? this.activeSpeakerNameWithVideo : this.activeSpeakerName
    plist.sort((a, b) => {
        if(activeSpeakerMoveToFirst){
          if (a.name === asname) {
            return -1;
          } else if (b.name === asname) {
            return 1;
          }
        }else{
          if (a.sort > b.sort) {
            return -1;
          } else if (a.sort < b.sort) {
            return 1;
          }
        }
      }
    );

    let len = this.draggingVideoName && this.videoDropAndInsertAtIndex === null ? plist.length-1 : plist.length;
    const vnum = this.floatingStripLayout === 'list' ? 4 : 1;
    const len2 = Math.min(len, vnum);

    // in share max layout
    if (this.stageMaximized) {
      const fshRect = document.querySelector('.floating_strip_head').getBoundingClientRect();
      const sph = len2 * (h + videoGap) - videoGap + floatingMargin * 3 + fshRect.height;
      let scrollh = len * (h + videoGap) - videoGap;
      this.stripWidth = `${w}px`;
      this.stripHeight = `${len2 * (h + videoGap) - videoGap}px`;
      this.stripTop = `${floatingMargin * 2 + fshRect.height}px`;
      this.stripLeft = `${floatingMargin}px`;

      this.stripWrapWidth = `${w + floatingMargin * 2}px`;
      this.stripWrapHeight = `${sph}px`;

      this.$refs.video_list_container.style.width = '';
      this.$refs.video_list_container.style.height = `${scrollh}px`

      const left = this.dockSide === 'L' ? 20 : parentRect.width - (w + floatingMargin * 2) - 20;
      const top = (parentRect.height - sph - 10)/2;
      //if (!this.isStripDragging && (!param || !param.checkFloatingStripPosition)) {
      if (!this.floatingStripPositionInited) {
        this.stripWrapTop = `${top}px`,
        this.stripWrapLeft = `${left}px`;
        this.stripDragPosition = {
          top: top,
          left: left,
        };
        this.floatingStripPositionInited = true;
      }

      if (param && param.checkFloatingStripPosition) {
        setTimeout(() => {
          this.checkStripDragPosition();
        }, 50);
      }

      this.stageVideoRect = {
        width: `calc(100% - ${margin * 2}px)`,
        height: `calc(100% - ${margin}px)`,
        top: `${margin}px`,
        left: `${margin}px`,
      };

      let marginV = 0;
      if (scrollh < sph) {
        marginV = (sph - len * h - (len-1) * videoGap) / 2;
      }
      let idx = 0;
      for (let i=0; i<plist.length; i++) {
        const p = plist[i];
        if (this.draggingVideoName !== p.name) {
          if (this.videoDropAndInsertAtIndex === p.index) {
            idx++;
          }
          this.peopleListIdx[p.name] = idx;
          this.videoItemPosition[p.name] = {
            top: marginV + idx * (h + videoGap),
            left: 0,
          };
          idx++;
        } else {
          this.videoItemPosition[p.name] = {
            left: -0.00099,
            top: -0.00099,
          };
        }
      }
      this.$store.commit('peopleListIdx', this.peopleListIdx);
      
      this.videoListRect = {
        height: scrollh,
      };


      /////////////

      if (this.videoLayout === 'stage-sharing' && (this.stagePeopleList.length > 0 || this.activeSpeakerInStage) || this.videoLayout === 'stage' && this.activeSpeakerInStage && this.stagePeopleList.length > 0) {
        if(this.stageDividedColumnRect.leftColumnWidth === undefined) {
          this.stageDividedColumnRect.leftColumnWidth = 
            this.stageDividedColumnRect.videoColumnWidth = 
              (parentRect.width - this.stageDividedColumnGap - this.stageDividedColumnMargin * 2) / 2;
        } else {
          let stagew;
          stagew = parentRect.width - this.stageDividedColumnGap - this.stageDividedColumnMargin * 2;
          const sw = this.stageDividedColumnRect.leftColumnWidth;
          const vw = this.stageDividedColumnRect.videoColumnWidth;
          this.stageDividedColumnRect.leftColumnWidth = stagew * (sw / (sw + vw));
          this.stageDividedColumnRect.videoColumnWidth = stagew * (vw / (sw + vw));
        }
        stgrect = this.$refs.stage_area.getBoundingClientRect();
        if(this.videoLayout === 'stage-sharing') {
          this.stageDividedColumnRect.leftColumnHeight = stgrect.height;
        } else {
          this.stageDividedColumnRect.leftColumnHeight = Math.min(this.stageDividedColumnRect.leftColumnWidth / 16 * 9, stgrect.height);
        }
      } else {
        this.stageDividedColumnRect = {};
      }

    }
    // in share max <<<<

    // dock strip >>>>>>

    if (!this.stageMaximized) {
      const dragHandlerRect = document.querySelector('.strip_drag_handler').getBoundingClientRect();
      const dragHandlerWidth = dragHandlerRect.width;
      const dragHandlerHeight = dragHandlerRect.height;

      if (this.videoLayout === 'stage-sharing' && (this.stagePeopleList.length > 0 || this.activeSpeakerInStage) || this.videoLayout === 'stage' && this.activeSpeakerInStage && this.stagePeopleList.length > 0) {

        if(isNaN(this.stageDividedColumnRect.leftColumnWidth)) {

          if (this.dockSide === 'T' || this.dockSide === 'B') {
            this.stageDividedColumnRect.leftColumnWidth = 
              this.stageDividedColumnRect.videoColumnWidth = 
                (parentRect.width - this.stageDividedColumnGap - this.stageDividedColumnMargin * 2) / 2;
          } else {
            this.stageDividedColumnRect.leftColumnWidth = 
              this.stageDividedColumnRect.videoColumnWidth = 
                (parentRect.width - this.stageDividedColumnGap - this.stageDividedColumnMargin * 2 - w * column - margin) / 2;
          }

        } else {
          let stagew;
          if (this.dockSide === 'T' || this.dockSide === 'B') {
            stagew = parentRect.width - this.stageDividedColumnGap - this.stageDividedColumnMargin * 2
          } else {
            if (this.videoZoomLevel >= 0) {
              stagew = parentRect.width - this.stageDividedColumnGap - this.stageDividedColumnMargin * 2 - w * column - margin;
            } else {
              stagew = parentRect.width - this.stageDividedColumnGap - this.stageDividedColumnMargin * 2
            }
          }
          const sw = this.stageDividedColumnRect.leftColumnWidth;
          const vw = this.stageDividedColumnRect.videoColumnWidth;
          this.stageDividedColumnRect.leftColumnWidth = stagew * (sw / (sw + vw));
          this.stageDividedColumnRect.videoColumnWidth = stagew * (vw / (sw + vw));
        }
        
        // first time videoLayout changed TODO
        if (this.stagePeopleList.length > 1 && this.sliEnabled) {
            let totalw = this.stageDividedColumnRect.leftColumnWidth + this.stageDividedColumnRect.videoColumnWidth
            let rightw = parentRect.height / 2.7 / 9 * 16
            let leftw = totalw - rightw
            this.stageDividedColumnRect.leftColumnWidth = leftw
            this.stageDividedColumnRect.videoColumnWidth = rightw
          }

        //
        

        stgrect = this.$refs.stage_area.getBoundingClientRect();
        if(this.videoLayout === 'stage-sharing') {
          this.stageDividedColumnRect.leftColumnHeight = stgrect.height;
        } else {
          this.stageDividedColumnRect.leftColumnHeight = Math.min(this.stageDividedColumnRect.leftColumnWidth / 16 * 9, stgrect.height);
        }

      } else {
        this.stageDividedColumnRect = {};

        stgrect = this.$refs.stage_area.getBoundingClientRect();
        // 只有active speaker， 没有左右分屏显示时，video显示方式为 contain，而不是cover
        this.stageDividedColumnRect.leftColumnWidth = stgrect.width;
        
        if(this.videoLayout === 'stage-sharing') {
          this.stageDividedColumnRect.leftColumnHeight = stgrect.height;
        } else {
          this.stageDividedColumnRect.leftColumnHeight = Math.min(this.stageDividedColumnRect.leftColumnWidth / 16 * 9, stgrect.height);
        }
        if(this.stageDividedColumnRect.leftColumnWidth / this.stageDividedColumnRect.leftColumnHeight > 16 / 9) {
          this.stageDividedColumnRect.leftColumnWidth = this.stageDividedColumnRect.leftColumnHeight / 9 * 16
        }
      }

      if (this.dockSide === 'T' || this.dockSide === 'B') {
        const spw = parentRect.width - dragHandlerWidth - margin * 2;
        let scrollw = len * (w + videoGap) - videoGap;
        this.stripWidth = `${spw}px`;
        this.stripHeight = this.videoZoomLevel >= 0 ? `${h}px` : '0';
        this.stripTop = `0px`;
        this.stripLeft = `${dragHandlerWidth}px`;

        this.stripWrapWidth = `${spw + dragHandlerWidth}px`;
        this.stripWrapHeight = this.videoZoomLevel >= 0 ? `${h}px` : '0';

        this.$refs.video_list_container.style.width = `${scrollw}px`;
        this.$refs.video_list_container.style.height = '';

        this.stripTotalPage = Math.ceil(scrollw / spw);

        let top;
        if (this.videoZoomLevel >= 0) {
          top = this.dockSide === 'T' ? margin : (parentRect.height - h);
        } else {
          top = this.dockSide === 'T' ? -7 : parentRect.height + 7;
        }
        if (!this.isStripDragging) {
          this.stripWrapTop = `${top}px`,
          this.stripWrapLeft = `${margin}px`;
          this.stripDragPosition = {
            top: top,
            left: margin,
          };
        }

        if (this.filteredPeopleNum() > 0 && this.videoZoomLevel >= 0) {
          this.stageVideoRect = {
            width: `calc(100% - ${margin * 2}px)`,
            height: `calc(100% - ${h + dockStageGap + margin}px)`,
            top: this.dockSide === 'T' ? `${h + dockStageGap + margin}px` : `${margin}px`,
            left: `${margin}px`,
          };
        } else {
          this.stageVideoRect = {
            width: `calc(100% - ${margin * 2}px)`,
            height: `calc(100% - ${margin}px)`,
            top: `${margin}px`,
            left: `${margin}px`,
          };
        }

        let marginH = 0;
        if (scrollw < spw) {
          marginH = (spw - len * w - (len-1) * videoGap) / 2;
        }
        let idx = 0;
        
        for (let i=0; i<plist.length; i++) {
          const p = plist[i];
          if (this.draggingVideoName !== p.name) {
            if (this.videoDropAndInsertAtIndex === p.index) {
              idx++;
            }
            this.peopleListIdx[p.name] = idx;
            this.videoItemPosition[p.name] = {
              left: marginH + idx * (w + videoGap),
              top: 0,
            };
            idx++;
          } else {
            this.videoItemPosition[p.name] = {
              left: -0.00099,
              top: -0.00099,
            };
          }
        }
        if (this.draggingVideoName === null) {
          this.$store.commit('peopleListIdx', this.peopleListIdx);
        }
        
        this.videoListRect = {
          width: scrollw,
        };

      } else if (this.dockSide === 'L' || this.dockSide === 'R') {
        const sph = this.dockSide === 'L' ? (parentRect.height - dragHandlerHeight - margin) : (parentRect.height - dragHandlerHeight - margin - layoutControlSpace);
        let scrollh = Math.ceil(len / column) * (h + videoGap) - videoGap;
        this.stripWidth = this.videoZoomLevel >= 0 ? `${w * column}px` : '0';
        this.stripHeight = `${sph}px`;
        this.stripTop = `${dragHandlerHeight}px`;
        this.stripLeft = `0px`;

        this.stripWrapWidth = this.videoZoomLevel >= 0 ? `${w * column}px` : '0';
        this.stripWrapHeight = `${sph + dragHandlerHeight}px`;

        this.$refs.video_list_container.style.width = '';
        this.$refs.video_list_container.style.height = `${scrollh}px`

        this.stripTotalPage = Math.ceil(scrollh / sph);
        
        let left;
        if (this.videoZoomLevel >= 0) {
          left = this.dockSide === 'L' ? margin : parentRect.width - w * column - margin;
        } else {
          left = this.dockSide === 'L' ? -5 : parentRect.width + 5;
        }
        
        if (!this.isStripDragging) {
          this.stripWrapTop = `${margin}px`,
          this.stripWrapLeft = `${left}px`;
          this.stripDragPosition = {
            top: `${margin}px`,
            left: left,
          };
        }

        if (this.filteredPeopleNum() > 0 && this.videoZoomLevel >= 0) {
          this.stageVideoRect = {
            width: `calc(100% - ${w * column + dockStageGap + margin * 2}px)`,
            height: `calc(100% - ${margin}px)`,
            top: `${margin}px`,
            left: this.dockSide === 'L' ? `${w * column + dockStageGap + margin}px` : `${margin}px`,
          };
        } else {
          this.stageVideoRect = {
            width: `calc(100% - ${margin * 2}px)`,
            height: `calc(100% - ${margin}px)`,
            top: `${margin}px`,
            left: `${margin}px`,
          };
        }

        let marginV = 0;
        if (scrollh < sph) {
          //marginV = (sph - len * h - (len-1) * videoGap) / 2;
        }


        let idx = 0;

        /*
        for (let i=0; i<plist.length; i++) {
          const p = plist[i];
          if (this.draggingVideoName !== p.name) {
            if (this.videoDropAndInsertAtIndex === p.index) {
              idx++;
            }
            this.peopleListIdx[p.name] = idx;
            this.videoItemPosition[p.name] = {
              top: marginV + idx * (h + videoGap),
              left: 0,
            };
            idx++;
          } else {
            this.videoItemPosition[p.name] = {
              left: -0.00099,
              top: -0.00099,
            };
          }
        }
        */
       
        for (let i=0; i<plist.length; i++) {
          const p = plist[i];
          if (this.draggingVideoName !== p.name) {
            if (this.videoDropAndInsertAtIndex === p.index) {
              idx++;
            }
            const lastrow = Math.floor(idx / column) === Math.ceil(len / column) - 1;
            const lastrownum = len % column;
            const lastrowMarginH = lastrownum > 0 ? (this.videoStripSize.width - lastrownum * w - (lastrownum-1) * videoGap) / 2 : 0;
            this.peopleListIdx[p.name] = idx;
            this.videoItemPosition[p.name] = {
              left: !lastrow ? 
                idx % column * (w + videoGap) + marginV: 
                idx % column * (w + videoGap) + marginV + lastrowMarginH,
              top: Math.floor(idx / column) * (h + videoGap),
              leftempty: idx % column === 0 ? 1 : 0,
              rightempty: idx % column === column - 1 || i === plist.length-1 ? 1 : 0,
            };
            idx++;
          } else {
            this.videoItemPosition[p.name] = {
              left: -0.00099,
              top: -0.00099,
            };
          }
        }


        if (this.draggingVideoName === null) {
          this.$store.commit('peopleListIdx', this.peopleListIdx);
        }
        
        this.videoListRect = {
          height: scrollh,
        };

      }
    }
    // dock strip <<<<<<<<

    // move to stage >>>>>>>>
    if (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing') {
      let stageplist = this.stagePeopleList.slice();
      //let column = 1, row = 1;
      let row = 1;
      let rect;
      if (this.stageDividedColumnRect.videoColumnWidth) {
        rect = {
          width: this.stageDividedColumnRect.videoColumnWidth,
          height: this.$refs.stage_video_container.getBoundingClientRect().height,
        };
      } else {
        rect = this.$refs.stage_video_container.getBoundingClientRect();
      }
      const lstlen = this.reorderingPinVideo && this.draggingVideoName && this.videoDropAndInsertAtIndex === null ? stageplist.length-1 : stageplist.length;
      let marginX = 0;
      let marginY = 0;

      if (lstlen === 1) {
        column = lstlen;
        row = 1;
      } else if (lstlen === 2) {
        column = lstlen;
        row = 1;
        if (rect.height > (rect.width/16*9) * 1.5) {
          column = 1;
          row = 2;
        }
      } else if (lstlen <= 4) {
        column = 2;
        row = 2;
        if (lstlen === 3 && rect.width > (rect.height/9*16) * 2.5) {
          column = 3;
          row = 1;
        } else if (lstlen === 3 && rect.height > (rect.width/16*9) * 3) {
          column = 1;
          row = 3;
        } else if (lstlen === 4 && rect.width > (rect.height/9*16) * 3.5) {
          column = 4;
          row = 1;
        } else if (lstlen === 4 && rect.height > (rect.width/16*9) * 4) {
          column = 1;
          row = 4;
        }
      } else if (lstlen <= 6) {
        column = 3;
        row = 2;
      } else if (lstlen <= 9) {
        column = 3;
        row = 3;
        if (lstlen <= 8 && rect.width > (((rect.height - videoGap)/2)/9*16) * 3.5) {
          column = 4;
          row = 2;
        } else if (lstlen === 9 && rect.width > (((rect.height - videoGap)/2)/9*16) * 4.5) {
          column = 5;
          row = 2;
        }
      }

      w = (rect.width - videoGap * (column - 1))/column;
      h = w / 16 * 9;
      if (h * row + videoGap * (row - 1) > rect.height) {
        h = (rect.height - videoGap * (row - 1)) /row;
        w = h / 9 * 16;
      }
      if (lstlen === 2 && rect.width / rect.height > 1.0) {
        column = lstlen;
        row = 1;
        w = (rect.width - videoGap * (column - 1))/column;
        h = this.stageDividedColumnRect.leftColumnHeight;
      }
      this.stageVideoColumnWidth = `${w}px`;
      this.stageVideoRowHeight = `${h}px`;
      marginX = (rect.width - w * column - videoGap * (column - 1))/2;
      marginY = (rect.height - h * row - videoGap * (row - 1))/2;

      stageplist.sort((a, b) => {
          if (a.pin > b.pin) {
            return -1;
          } else if (a.pin < b.pin) {
            return 1;
          } else {
            return 0;
          }
        }
      );


      let idx = 0;
      for (let i=0; i<lstlen; i++) {
        const p = stageplist[i];
        if (this.draggingVideoName !== p.name || !this.reorderingPinVideo) {
          if (this.videoDropAndInsertAtIndex === p.index) {
            idx++;
          }
          this.peopleListIdx[p.name] = idx;
          const lastrow = Math.floor(idx / column) === Math.ceil(lstlen / column) - 1;
          const rem = lstlen % column;
          const diffcol = rem < column && rem > 0 ? column - rem : 0;
          const lastrowMarginH = (diffcol * w + diffcol * videoGap) / 2;
          this.videoItemPosition[p.name] = {
            left: !lastrow ? 
              idx % column * (w + videoGap) + marginX: 
              idx % column * (w + videoGap) + marginX + lastrowMarginH,
            top: Math.floor(idx / column) * (h + videoGap) + marginY,
            leftempty: idx % column === 0 ? 1 : 0,
            rightempty: idx % column === column - 1 || i === stageplist.length-1 ? 1 : 0,
          };

          // drag from strip to stage and pin
          // animate from drop XY W H to videoItemPosition
          if (!this.reorderingPinVideo && !this.dropPinPeople.name && this.draggingVideoName === p.name) {
            this.dropPinPeople = p;
            let style1left = this.stagePeopleList.length === 1 && this.stageDividedColumnRect.videoColumnWidth ? this.dropPinTweenRect.left - this.stageDividedColumnRect.videoColumnWidth : this.dropPinTweenRect.left
            const style1 = {
              left: `${style1left}px`,
              top: `${this.dropPinTweenRect.top}px`,
              width: `${this.dropPinTweenRect.width}px`,
              height: `${this.dropPinTweenRect.height}px`,
            };
            const style2 = {
              left: `${this.videoItemPosition[this.draggingVideoName].left}px`,
              top: `${this.videoItemPosition[this.draggingVideoName].top}px`,
              width: this.stageVideoColumnWidth,
              height: this.stageVideoRowHeight,
            };

            const trans = mframe([{
                dom: document.getElementById('drop-pin-video'),
                frames: [
                    { css: style1, time: 0 },
                    { css: style2, time: 10, tween: 'easeInOut' }
                ]
            }], {
              end: () => {
                this.draggingVideoName = null;
                this.dropPinPeople = {};
                this.dropPinPeoplePrepared = {};
              }
            });
            trans.play();
          }
          
          idx++;
        } else {
          this.videoItemPosition[p.name] = {
            left: -0.00099,
            top: -0.00099,
          };

        }
      }
      if (this.draggingVideoName === null) {
        this.$store.commit('peopleListIdx', this.peopleListIdx);
      }

    }
    // move to stage <<<<<<<<

  }, // calcStageSize end

  scrollLeft() {
    const lstrect2 = this.$refs.video_scrollpane.getBoundingClientRect();
    const lstw2 = lstrect2.width;

    if (this.stripPageIndex > 0) {
      this.stripPageIndex--;
      this.stripPageIndex = Math.max(this.stripPageIndex, 0);
    }
    this.$refs.video_scrollpane.scrollTo(lstw2 * this.stripPageIndex, 0);
  },

  scrollRight() {
    const lstrect = this.$refs.video_list_container.getBoundingClientRect();
    const lstw = lstrect.width;

    const lstrect2 = this.$refs.video_scrollpane.getBoundingClientRect();
    const lstw2 = lstrect2.width;

    if (this.stripPageIndex < this.stripTotalPage-1) {
      this.stripPageIndex++;
      this.stripPageIndex = Math.min(this.stripPageIndex, this.stripTotalPage-1);
    }

    this.$refs.video_scrollpane.scrollTo(Math.min(lstw2 * this.stripPageIndex, lstw), 0);
  },

  onStripScroll(e) {
    const lstrect2 = this.$refs.video_scrollpane.getBoundingClientRect();
    const lstw2 = lstrect2.width;

    this.stripPageIndex = Math.ceil(e.target.scrollLeft/lstw2);
  },

  noVideoNum() {
    const lst = this.peopleList.filter(
      p => { return !p.me && !p.video }
    )
    return lst.length;
  },

  setNoVideoTip() {
    const len = this.noVideoNum();
    this.noVideoTip = `Non-video participants: `;
    this.noVideoTip2 = `${len} hidden`;
  },


  // ----- dock resize >>>>>>>
  dockResizeHandlerMousedown(evt) {
    evt.stopPropagation();
    this.dockResizeDraggingPageX = evt.pageX;
    this.dockResizeDraggingPageY = evt.pageY;
    window.addEventListener("mousemove", this.dockResizeHandlerDragging);
    window.addEventListener("mouseup", this.dockResizeHandlerStopDrag);
  },
  dockResizeHandlerDragging(evt){
    this.$store.commit('disableElementTransition', true);
    if (!this.isdragging) {
      this.isdragging = true;
      this.$store.commit('videoPaused', true);
    }
    
    if (this.videoStripDockSide === 'T') {
      let offset = evt.pageY - this.dockResizeDraggingPageY;
      let height = this.videoStripSize.height + offset;
      if (offset < 0 && height < 90) {
        height = 0;
        this.$store.commit('disableElementTransition', false);
      } else if (offset > 0 && height < 90) {
        height = 90;
        this.$store.commit('disableElementTransition', false);
      }
      const width = this.videoStripSize.width;
      this.$store.commit("videoStripSize", {width, height});
      this.dockResizeDraggingPageY = evt.pageY;

    } else if (this.videoStripDockSide === 'B') {
      let offset = this.dockResizeDraggingPageY - evt.pageY;
      let height = this.videoStripSize.height + offset;
      if (offset < 0 && height < 90) {
        height = 90;
        this.$store.commit('disableElementTransition', false);
      } else if (offset > 0 && height < 90) {
        height = 90;
        this.$store.commit('disableElementTransition', false);
      }
      const width = this.videoStripSize.width;
      this.$store.commit("videoStripSize", {width, height});
      this.dockResizeDraggingPageY = evt.pageY;
      
    } else if (this.videoStripDockSide === 'L') {
      let offset = evt.pageX - this.dockResizeDraggingPageX;
      let width = this.videoStripSize.width + offset;
      if (offset < 0 && width < 160) {
        width = 160;
        this.$store.commit('disableElementTransition', false);
      } else if (offset > 0 && width < 160 ) {
        width = 160;
        this.$store.commit('disableElementTransition', false);
      }
      const height = this.videoStripSize.height;
      this.$store.commit("videoStripSize", {width, height});
      this.dockResizeDraggingPageX = evt.pageX;

    } else if (this.videoStripDockSide === 'R') {
      let offset = this.dockResizeDraggingPageX - evt.pageX;
      let width = this.videoStripSize.width + offset;
      const height = this.videoStripSize.height;
      if (offset < 0 && width < 160) {
        // width = 160;
        // width = 2; // hide side-by-side video strip
        clearInterval(this.itv_docktrans);
        this.itv_docktrans = setInterval(() => {
          if (width - 20 > 2) {
            width = width - 20;
          } else {
            width = 2;
            clearInterval(this.itv_docktrans);
            this.$store.commit('disableElementTransition', false);
          }
          this.$store.commit("videoStripSize", {width, height});
          this.$forceUpdate();
        }, 0);

      } else if (offset > 0 && width < 160 ) {
        // width = 160;
        clearInterval(this.itv_docktrans);
        this.itv_docktrans = setInterval(() => {
          if (width < 160 - 20) {
            width = width + 20;
          } else {
            width = 160;
            clearInterval(this.itv_docktrans);
            this.$store.commit('disableElementTransition', false);
          }
          this.$store.commit("videoStripSize", {width, height});
          this.$forceUpdate();
        }, 0);
        
      } else {
        this.$store.commit("videoStripSize", {width, height});
      }

      this.dockResizeDraggingPageX = evt.pageX;
      
    }
  },
  dockResizeHandlerStopDrag(){
    this.isdragging = false;
    this.$store.commit('videoPaused', false);
    window.removeEventListener("mousemove", this.dockResizeHandlerDragging);
    window.removeEventListener("mouseup", this.dockResizeHandlerStopDrag);
  },
  dockResizeHandlerClick() {
    if (this.videoStripDockSide === 'T' && this.videoStripSize.height === 0) {
      const width = this.videoStripSize.width;
      this.$store.commit("videoStripSize", {width, height: 90});
    }
  },
  // ------ dock resize <<<<<<<


  // ----- stage (sharing content | videos) resize >>>>>>>
  stageResizeHandlerMousedown(evt) {
    evt.stopPropagation();
    this.stageResizeDraggingPageX = evt.pageX;
    window.addEventListener("mousemove", this.stageResizeHandlerDragging);
    window.addEventListener("mouseup", this.stageResizeHandlerStopDrag);
  },
  stageResizeHandlerDragging(evt){
    this.$store.commit('disableElementTransition', true);
    if (!this.isdragging) {
      this.isdragging = true;
      this.$store.commit('videoPaused', true);
    }
    
    let offset = evt.pageX - this.stageResizeDraggingPageX;
    const rto = (this.stageDividedColumnRect.leftColumnWidth + offset) / (this.stageDividedColumnRect.videoColumnWidth - offset);
    
    //if (rto > 0.488 && rto < 2.05) {
    if (rto > 0.3 && rto < 5) {
      this.stageDividedColumnRect.leftColumnWidth += offset;
      this.stageDividedColumnRect.videoColumnWidth -= offset;
      this.stageResizeDraggingPageX = evt.pageX;
      this.$forceUpdate();
    }
  },
  stageResizeHandlerStopDrag(){
    this.isdragging = false;
    this.$store.commit('videoPaused', false);
    window.removeEventListener("mousemove", this.stageResizeHandlerDragging);
    window.removeEventListener("mouseup", this.stageResizeHandlerStopDrag);
  },
  // ----- stage (sharing content | videos) resize <<<<<<<<


  // ------ >>>>>>>
  floatingStripMousedown(evt) {
    this.videoScrollpaneAnimated = false;
    this.$store.commit('disableElementTransition', true);

    evt.stopPropagation();
    this.mouseX = evt.pageX;
    this.mouseY = evt.pageY;
    window.addEventListener("mousemove", this.floatingStripDragging);
    window.addEventListener("mouseup", this.floatingStripStopDrag);
  },
  floatingStripDragging(evt){
    const px = evt.pageX;
    const py = evt.pageY;
    if (!this.isStripDragging && (Math.abs(px - this.mouseX) > 5 || Math.abs(py - this.mouseY) > 5)) {
      this.isStripDragging = true;
      this.$store.commit('videoPaused', true);
    }
    if (this.isStripDragging) {
      const ox = px - this.mouseX;
      const oy = py - this.mouseY;
      const parentRect = this.$refs['video-pane'].getBoundingClientRect();
      const paneRect = this.$refs['video_scrollpane_wrap'].getBoundingClientRect();
      const point = {
        x: this.stripDragPosition.left + ox,
        y: this.stripDragPosition.top + oy,
      }
      const rect = {
        left: 0,
        top: 44,
        right: parentRect.width - paneRect.width,
        bottom: parentRect.height - paneRect.height,
      }
      if (this.pointInRect(point, rect)) {
        this.stripDragPosition.left += ox;
        this.stripDragPosition.top += oy
        this.stripWrapTop = `${this.stripDragPosition.top}px`;
        this.stripWrapLeft = `${this.stripDragPosition.left}px`;
        this.mouseX = px;
        this.mouseY = py;
      }
      
    }
  },
  floatingStripStopDrag(){
    this.videoScrollpaneAnimated = true;
    this.$store.commit('disableElementTransition', false);

    this.isStripDragging = false;
    this.$store.commit('videoPaused', false);
    window.removeEventListener("mousemove", this.floatingStripDragging);
    window.removeEventListener("mouseup", this.floatingStripStopDrag);
  },
  // ----- <<<<<<<<

  toggleFullscreen() {
    this.$store.commit("fullscreen", !this.fullscreen);
  },
  swapVideoAndShareContent() {
    this.$store.commit("videoAndShareContentSwapped", !this.videoAndShareContentSwapped);
  },

  // video drag to sort ------>>>
  pointInRect(point, rect) {
    return point.x <= rect.right && point.x >= rect.left && point.y <= rect.bottom && point.y >= rect.top;
  },
  rectInRect(smallRect, bigRect) {
    return smallRect.right <= bigRect.right && smallRect.left >= bigRect.left && smallRect.bottom <= bigRect.bottom && smallRect.top >= bigRect.top;
  },
  

  getVideoInsertPosition(videoRect) {

    const center = {
      x: videoRect.left + videoRect.width/2,
      y: videoRect.top + videoRect.height/2,
    };
    let plist;
    if (!this.reorderingPinVideo) {
      plist = this.filteredPeopleList;
      plist.sort((a, b) => {
          if (a.sort > b.sort) {
            return -1;
          } else if (a.sort < b.sort) {
            return 1;
          }
        }
      );
    } else {
      plist = this.stagePeopleList;
      plist.sort((a, b) => {
          if (a.pin > b.pin) {
            return -1;
          } else if (a.pin < b.pin) {
            return 1;
          }
        }
      );
    }
    
    let insertAtIndex = undefined;
    
    const threshold = 20;
    const container = !this.reorderingPinVideo || this.videoLayout === 'grid' ? this.$refs.video_list_container : this.$refs.stage_video_container;
    const lstrect = container.getBoundingClientRect();

    for (let i=0; i<plist.length; i++) {
      const p = plist[i];
      if (this.draggingVideoName !== p.name) {
        const itm = document.getElementById(`video-item_${p.name.replace(/ /g, '-')}`);
        const rc = itm.getBoundingClientRect();
        const left = rc.left - lstrect.left;
        const right = rc.right - lstrect.left;
        const top = rc.top - lstrect.top;
        const bottom = rc.bottom - lstrect.top;
        const leftempty = itm.getAttribute('leftempty');
        const rightempty = itm.getAttribute('rightempty');

        let droprect1 = {
          left: left - threshold,
          right: left + rc.width/2,
          top: top,
          bottom: bottom,
        };
        let droprect2 = {
          left: left + rc.width/2,
          right: right + threshold,
          top: top,
          bottom: bottom,
        };

        let droprect1y = {
          left: left,
          right: right,
          top: top - threshold,
          bottom: top + rc.height/2,
        };
        let droprect2y = {
          left: left,
          right: right,
          top: top + rc.height/2,
          bottom: bottom + threshold,
        };

        if (Number(leftempty) === 1) {
          droprect1 = {
            left: -9999,
            right: left + rc.width/2,
            top: top,
            bottom: bottom,
          };
          droprect1y = {
            left: left,
            right: right,
            top: -9999,
            bottom: top + rc.height/2,
          };
        }
        if (Number(rightempty) === 1) {
          droprect2 = {
            left: left + rc.width/2,
            right: 9999,
            top: top,
            bottom: bottom,
          };
          droprect2y = {
            left: left,
            right: right,
            top: top + rc.height/2,
            bottom: 9990,
          };
        }
        
        if (this.pointInRect(center, droprect1) || this.pointInRect(center, droprect1y)) {
          insertAtIndex = p.index;
        } else if (this.pointInRect(center, droprect2) || this.pointInRect(center, droprect2y)) {
          if (i < plist.length-1) {
            insertAtIndex = plist[i+1].index;
          } else {
            insertAtIndex = this.videoInsertLastIndex; // last place
          }
        }

        
      }
    }


    return insertAtIndex !== undefined ? insertAtIndex : this.videoDropAndInsertAtIndex;
  },

  onVideoDragStart(evt) {
    const {inStage} = evt;
    this.reorderingPinVideo = inStage;
    if (inStage || this.stagePeopleList.length === this.maxVideoInStage) {
      this.stageAllowToDrop = false;
    }
    this.$store.commit('videoPaused', true);
  },
  
  onVideoDrag(evt) {

    const {index, name, rect} = evt;
    // ----------->>>>>>>> drag video drop area
    let div;
    if (!document.getElementById('video-drop-target')) {
      const container = !this.reorderingPinVideo || this.videoLayout === 'grid' ? this.$refs.video_list_container : this.$refs.stage_video_container;
      div = document.createElement('div');
      div.setAttribute('id', 'video-drop-target');
      container.appendChild(div);
      div.ondrop = (ev) => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
        ev.dataTransfer.effectAllowed = 'move';
      };
      div.ondragover = (ev) => {
        ev.preventDefault();
      };
      //div.ondrop = (ev) => {
      //  ev.preventDefault();
      //};
    } else {
      div = document.getElementById('video-drop-target');
    }
    div.style.position='absolute';
    div.style.zIndex='30';
    div.style.width=`${rect.width}px`;
    div.style.height=`${rect.height}px`;
    div.style.left=`${rect.left}px`;
    div.style.top=`${rect.top}px`;
    // div.style.border='1px solid #FF0000';
    // -----------<<<<<<<<< drag video drop area

    if (this.videoDropAndInsertAtIndex === null) {
      this.videoDropAndInsertAtIndex = this.videoDragFromIndex = index;
      this.$store.commit('videoDropAndInsertAtIndex', index);
    }
    this.draggingVideoName = name;
    clearTimeout(this.timeout_checkInsertPosition);
    this.timeout_checkInsertPosition = setTimeout(() => {
      this.checkInsertPosition(rect);
    }, 100); // delay for check


  },
  checkInsertPosition(rect) {
    const idx = this.getVideoInsertPosition(rect);
    if (idx !== this.videoDropAndInsertAtIndex) {
      this.videoDropAndInsertAtIndex = idx;
      this.$store.commit('videoDropAndInsertAtIndex', idx);
      if (this.videoLayout === 'grid') {
        this.calcGridVideoSize();
      } else if (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing') {
        this.calcStageSize();
      }
    }
  },
  onVideoDragStop() {

    clearTimeout(this.timeout_checkInsertPosition);
    const targetElem = document.getElementById('video-drop-target');
    if (targetElem) {
      const container = !this.reorderingPinVideo || this.videoLayout === 'grid' ? this.$refs.video_list_container : this.$refs.stage_video_container;
      container.removeChild(targetElem);
    }

    // reorder
    if (this.videoDropAndInsertAtIndex !== this.videoDragFromIndex) {
      let plist = [];
      let peopleList = this.peopleList;
      const len = peopleList.length;
      const draggingPeople = this.$store.getters.people(this.draggingVideoName);

      if (!this.reorderingPinVideo) {
        // grid / filmstrip
        peopleList.sort((a, b) => {
            if (a.sort > b.sort) {
              return -1;
            } else if (a.sort < b.sort) {
              return 1;
            }
          }
        );

        let sid = this.videoItemSortIndex+1;
        this.$store.commit('videoItemSortIndex', sid);
        for (let i = 0; i < len; i++) {
            const p = peopleList[i];
            if (this.videoDropAndInsertAtIndex === p.index) {
              draggingPeople.sort = sid;
              plist.push(draggingPeople);
              sid--;
            }
            if (p.name !== this.draggingVideoName) {
              p.sort = sid
              plist.push(p);
              sid--;
            }
        }
        if (this.videoDropAndInsertAtIndex === this.videoInsertLastIndex) {
          draggingPeople.sort = sid;
          plist.push(draggingPeople);
        }
      } else {
        // in stage
        peopleList.sort((a, b) => {
            if (a.pin > b.pin || b.pin === undefined) {
              return -1;
            } else if (a.pin < b.pin || a.pin === undefined) {
              return 1;
            }
          }
        );

        let pid = this.videoInStageSortIndex-1;
        for (let i = 0; i < len; i++) {
            const p = peopleList[i];
            if (p.pin !== undefined) {
              if (this.videoDropAndInsertAtIndex === p.index) {
                draggingPeople.pin = pid;
                plist.push(draggingPeople);
                pid--;
              }
              if (p.name !== this.draggingVideoName) {
                p.pin = pid
                plist.push(p);
                pid--;
              }
            } else {
              plist.push(p);
            }
        }
        if (this.videoDropAndInsertAtIndex === this.videoInsertLastIndex) {
          draggingPeople.pin = pid;
          plist.push(draggingPeople);
          pid--;
        }
        
        this.$store.commit('videoInStageSortIndex', pid);
      }
      

      // data saved sort by index
      plist.sort((a, b) => {
          if (a.index > b.index) {
            return 1;
          } else if (a.index < b.index) {
            return -1;
          }
        }
      );

      this.doNotChangeZoom = true;
      this.$store.commit('peopleList', plist);

    } else {
      const itm = document.getElementById(`video-item_${this.draggingVideoName.replace(/ /g, '-')}`);
      itm.style.left = `${this.videoItemPosition[this.draggingVideoName].left}px`;
      itm.style.top = `${this.videoItemPosition[this.draggingVideoName].top}px`;
    }

    this.draggingVideoName = null;
    this.videoDragFromIndex = null;
    this.videoDropAndInsertAtIndex = null;
    this.$store.commit('videoDropAndInsertAtIndex', null);
    
    if (this.videoDropAndInsertAtIndex !== this.videoDragFromIndex) {
      if (this.videoLayout === 'grid') {
        this.calcGridVideoSize();
      } else if (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing') {
        this.calcStageSize();
      }
    }

    this.$store.commit('videoPaused', false);

  },
  // video drag to sort ------<<<<

  // drop to pin stage ------>>>>>>
  dragoverStage(){
    /*
    if (this.reorderingPinVideo || this.stagePeopleList.length === this.maxVideoInStage) {
      return;
    }
    evt.preventDefault();
    this.stageAllowToDrop = true;

    // 
    let list = this.filteredPeopleList.slice();
    const lstlen = list.length;
    for (let i=0; i<lstlen; i++) {
        const p = list[i];
        if (this.draggingVideoName === p.name && this.dropPinPeoplePrepared.name !== p.name) {
          this.dropPinPeoplePrepared = p; // preload video before drop, avoid video loading time gap
          break;
        }
    }

    */
  },
  dragleaveStage(){
    /*
    if (this.reorderingPinVideo) {
      return;
    }
    this.stageAllowToDrop = false;

    */
  },
  dropToStage(){
    /*
    if (this.reorderingPinVideo || this.stagePeopleList.length === this.maxVideoInStage) {
      return;
    }
    evt.preventDefault();
    
    // drag to stage and pin to stage
    if (this.videoLayout === 'stage' || this.videoLayout === 'stage-sharing') {
      const targetElem = document.getElementById('video-drop-target');
      const targetRect = targetElem.getBoundingClientRect();
      const stageRect = this.$refs.stage_video_container.getBoundingClientRect();
      this.dropPinTweenRect = {
        name: this.draggingVideoName,
        left: targetRect.left - stageRect.left,
        top: targetRect.top - stageRect.top,
        right: targetRect.left - targetRect.width,
        bottom: targetRect.top - targetRect.height,
        width: targetRect.width,
        height: targetRect.height,
      };

      if (this.videoLayout === 'stage' && this.draggingVideoName !== this.activeSpeakerName || this.videoLayout === 'stage-sharing') {
        const pid = this.videoInStageSortIndex-1;
        this.$store.commit('videoInStageSortIndex', pid);
        let plist = [];
        const len = this.peopleList.length;
        for (let i = 0; i < len; i++) {
            const p = this.peopleList[i];
            if (p.name === this.draggingVideoName) {
                p.pin = pid;
            }
            plist.push(p);
        }
        this.$store.commit('peopleList', plist);
      } else {
        this.$store.commit("activeSpeakerInStage", true);
        this.draggingVideoName = null;
      }

      this.videoDragFromIndex = null;
      this.videoDropAndInsertAtIndex = null;
      this.$store.commit('videoDropAndInsertAtIndex', null);
      //
      const container = this.$refs.video_list_container;
      container.removeChild(targetElem);
    }
    this.stageAllowToDrop = false;

    */
  },
  // drop to pin stage ------<<<<<<


  // dock strip ------<<<<
  videopaneMousedown(evt) {
    this.mouseX = evt.pageX;
    this.mouseY = evt.pageY;
    document.addEventListener('mousemove', this.videopaneMousemove);
    document.addEventListener('mouseup', this.videopaneMouseup);
  },
  videopaneMousemove(evt) {
    const px = evt.pageX;
    const py = evt.pageY;
    if (!this.isStripDragging && (Math.abs(px - this.mouseX) > 5 || Math.abs(py - this.mouseY) > 5)) {
      this.isStripDragging = true;
      this.$store.commit('videoPaused', true);
    }
    if (this.isStripDragging) {
      const ox = px - this.mouseX;
      const oy = py - this.mouseY;
      this.stripDragPosition.left += ox;
      this.stripDragPosition.top += oy
      this.stripWrapTop = `${this.stripDragPosition.top}px`;
      this.stripWrapLeft = `${this.stripDragPosition.left}px`;
      this.mouseX = px;
      this.mouseY = py;
      // check dock side
      const point = {
        x: px,
        y: py,
      };
      const parentRect = this.$refs['video-pane'].getBoundingClientRect();
      const vh = this.videoRowHeight;
      const reactT = {
        left: parentRect.left,
        right: parentRect.right,
        top: parentRect.top,
        bottom: parentRect.top + vh,
      };
      const reactL = {
        left: parentRect.left,
        right: parentRect.left + parentRect.width/2,
        top: parentRect.top + vh,
        bottom: parentRect.bottom - vh,
      };
      const reactB = {
        left: parentRect.left,
        right: parentRect.right,
        top: parentRect.bottom - vh,
        bottom: parentRect.bottom,
      };
      const reactR = {
        left: parentRect.right - parentRect.width/2,
        right: parentRect.right,
        top: parentRect.top + vh,
        bottom: parentRect.bottom - vh,
      };
      if (this.pointInRect(point, reactT)) {
        this.dockSide = 'T';
      } else if (this.pointInRect(point, reactB)) {
        this.dockSide = 'B';
      } else if (this.pointInRect(point, reactL)) {
        this.dockSide = 'L';
      } else if (this.pointInRect(point, reactR)) {
        this.dockSide = 'R';
      }
    }
  },
  videopaneMouseup() {
    document.removeEventListener('mousemove', this.videopaneMousemove);
    document.removeEventListener('mouseup', this.videopaneMouseup);
    this.isStripDragging = false;
    if (this.dockSide !== this.videoStripDockSide) {
      var optlist = _.cloneDeep(this.meetingOptionsList)
      var idx = _.findIndex(optlist, o => { return o.meetingId == this.meetingId });
      optlist[idx].videoStripDockSide = this.dockSide
      this.$store.commit('meetingOptionsList', optlist)
    }
    this.videoScrollpaneAnimated = true;
    setTimeout(() => {
      this.videoScrollpaneAnimated = false;
      this.$store.commit('videoPaused', false);
    }, 500);
    this.calcStageSize();
  },
  // dock strip ------<<<<

  stopSyncStage() {
    this.$store.commit('stageSyncing', false);
  },
  toggleSynclabel() {
    this.synclabelVisible = !this.synclabelVisible;
  },

  // --------------------------------
  // group selection ------>>>>>>>>>>
  mousedownhandler() {
    /*
    this.groupselectionMouseStartPoint = {
      x: evt.x, 
      y: evt.y,
    };
    const rect = this.$refs.groupselectionlayer.getBoundingClientRect();
    this.groupselectionRect = {
      left: evt.x - rect.left,
      top: evt.y - rect.top,
      width: 0,
      height: 0,
      opacity: 1,
    };

    document.addEventListener('mousemove', this.mousemovehandler);
    document.addEventListener('mouseup', this.mouseuphandler);

    this.$store.commit('videoPaused', true);

    */
  },
  mousemovehandler() {
    /*

    this.groupselectionMouseEndPoint = {
      x: evt.x, 
      y: evt.y,
    };
    const rect = this.$refs.groupselectionlayer.getBoundingClientRect();
    if (this.groupselectionMouseEndPoint.x > this.groupselectionMouseStartPoint.x) {
      this.groupselectionRect.width = this.groupselectionMouseEndPoint.x - this.groupselectionMouseStartPoint.x;
    } else {
      this.groupselectionRect.left = evt.x - rect.left,
      this.groupselectionRect.width = this.groupselectionMouseStartPoint.x - this.groupselectionMouseEndPoint.x;
    }
    if (this.groupselectionMouseEndPoint.y > this.groupselectionMouseStartPoint.y) {
      this.groupselectionRect.height = this.groupselectionMouseEndPoint.y - this.groupselectionMouseStartPoint.y;
    } else {
      this.groupselectionRect.top = evt.y - rect.top,
      this.groupselectionRect.height = this.groupselectionMouseStartPoint.y - this.groupselectionMouseEndPoint.y;
    }

    requestAnimationFrame(() => {
      const selrect = this.$refs.groupselectionrect.getBoundingClientRect();
      this.groupselectedVideo = []

      for(let i=0; i < this.stagePeopleList.length; i++) {
        const p = this.stagePeopleList[i];
        const id = `#video-item_${p.name.replace(/ /g, '-')}`;
        const videoel = document.querySelector(id);
        const videorect = videoel.getBoundingClientRect();
        const selected = this.$intersecting(selrect, videorect);
        if (selected) {
          this.groupselectedVideo.push(p.name);
        }
        
      }
    });

    */

  },
  mouseuphandler() {
    /*
    this.groupselectionRect = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      opacity: 0,
    };

    document.removeEventListener('mousemove', this.mousemovehandler);
    document.removeEventListener('mouseup', this.mouseuphandler);
    this.$store.commit('videoPaused', false);

    */
  }
  // group selection ------<<<<<<<<<<
  // --------------------------------

}
};
</script>

<style lang="scss">
.video-pane {

position: absolute;
pointer-events: none;
user-select: none;
height: 100%;
width: 100%;

.call-pane {
  position: relative;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  @include flex(column);

  .videoarea {
    width: 100%;
    flex-grow: 1;
  }

}

.device-connecting {
  position: absolute;
  z-index: 11;
  @include flex;
  width: 100%;
  height: 100%;
  max-height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);

  .idx {
    @include flex;
    height: 32px;
    padding: 0 12px 0 8px;
    background: #262626;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.16);
    border-radius: 16px;

    .txt {
      margin-left: 6px;
      font-size: 14px;
    }
  }
}

.paired-content {
  position: absolute;
  display: flex;
  flex-shrink: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 790px;
  height: 530px;
  max-height: 530px;
  left: calc((100% - 790px) / 2);
  top: calc((100% + 60px - 36px - 530px) / 2);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding-bottom: 120px;

  &.sharing {
    width: 100%;
    height: 100%;
    max-height: 100%;
    left: 0;
    top: 0;
    background-image: url(~@/assets/img/device-share-content.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    padding-bottom: 0;
    border-radius: 0;
  }

  .btnlayout {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 32px;
    border-radius: 16px;
  }

  .img {
    width:300px;
    height: 130px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-bottom: 20px;
  }
  .title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 4px;
  }
  .name {
    font-size: 13px;
    opacity: .7;
  }
}

.video_scrollpane {
  position: absolute;
  pointer-events: none;
  user-select: none;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
}

.video_scrollpane_wrap {
  position: absolute;
  pointer-events: auto;

  &.trans {
    transition: left 0.2s ease-out, top 0.2s ease-out;
  }

  .dock_resize_handler {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;

    .hidden-line {
      position: absolute;
      opacity: 0;

      &:hover {
        background: $md-blue-40;
        opacity: 1;
      }
    }

    &.dockT {
      width: 100%;
      height: 10px;
      bottom: -7px;
      cursor: row-resize;

      .hidden-line {
        width: 100%;
        height: 2px;
        left: 0;
      }
    }
    &.dockB {
      width: 100%;
      height: 10px;
      top: -9px;
      cursor: row-resize;

      .hidden-line {
        width: 100%;
        height: 2px;
        left: 0;
      }
    }
    &.dockL {
      width: 10px;
      height: 100%;
      right: -9px;
      cursor:col-resize;

      .hidden-line {
        height: 100%;
        width: 2px;
        top: 0;
      }
    }
    &.dockR {
      width: 10px;
      height: 100%;
      left: -9px;
      cursor:col-resize;

      .hidden-line {
        height: 100%;
        width: 2px;
        top: 0;
      }
    }

  }

  .strip_drag_handler {
    cursor: move;
    display: flex;
    align-items: center;

    &.horizontal {
      width: 13px;
      height: 100%;
    }
    &.vertical {
      flex-direction: column;
      width: 100%;
      height: 13px;
    }
  }
}

/* ---- grid ---- */
&.grid{
  .video_scrollpane_wrap {
    height: 100%;
    width: 100%;
  }

  .video_scrollpane {
    height: 100%;
    width: calc(100% - 10px);
    bottom: 0;
    left: 5px;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    overflow-x: hidden;
    overflow-y: auto;
    pointer-events: auto;

    &.align_top {
      align-content: flex-start;
      align-items: flex-start;
    }

    .video_list_container{
      position: relative;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
      margin: 0;
      flex-shrink: 0;

    }
  }
  
}

/* ---- stage / stage-sharing ---- */
&.stage,
&.stage-sharing{

  .stage_area {
    position: relative;
    overflow: hidden;
    transform: rotate(0deg);
    background-size: cover;
    background-repeat: no-repeat;
    box-sizing: border-box;
    border-radius: 10px;

    &.syncborder {
      border: 2px solid $md-orange-60;
      box-shadow:0 0 0 2px rgba(255,255,255,.6) inset;
    }

    .groupselectionlayer {
      position: absolute;
      left: -100px;

      .rect {
        position: absolute;
        width: 0;
        height: 0;
        box-sizing: border-box;
        border: 1px dotted rgba($color: black, $alpha: 1.0);
      }
    }

    .synclabel-preview {
      position: absolute;
      top: -2px;
      left: 0;
      width: 100%;
      height: 24px;
      display: flex;
      justify-content: center;
      
      .lb {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.24);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        padding: 0 10px;
        color: #ffffff;
        font-size: 12px;
        pointer-events: auto;
        user-select: none;
      }
    }

    .synclabel {
      position: absolute;
      top: -2px;
      left: 0;
      width: 100%;
      height: 32px;
      pointer-events: none;
      display: flex;
      justify-content: center;
      transition: all .2s;

      &:hover {
        .arrow {
          display: flex;
        }
      }

      &.clsed {
        top: -32px;
      }

      .arrow {
        position: absolute;
        @include flex;
        display: none;
        color: white;
        width: 56px;
        height: 12px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: $md-orange-60;
        top: 32px;
        pointer-events: auto;
      }

      .lb {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $md-orange-60;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        padding: 0 10px;
        color: #ffffff;
        font-size: 12px;
        pointer-events: auto;
        user-select: none;

        .stop {
          @include flex;
          width: 48px;
          height: 24px;
          background: $md-orange-60;
          margin-left: 10px;
          pointer-events: auto;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          box-sizing: border-box;

          &:hover {
            background: $md-orange-70;
          }
          &:active {
            background: $md-orange-80;
          }

        }
      }
    }

    .themelogo {
      pointer-events: auto;

      .img {
        pointer-events: auto;
        position: absolute;
        width: 100%;
        height: 100%;
        background: url(~@/assets/img/webex-logo-with-text.svg) no-repeat;
        background-size: contain;
      }
    }

    .stage_left_col {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .stage_video_container {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 6px;
      pointer-events: auto;

      &.allowdrop {
        background-color: rgba($color: white, $alpha: 0.1);
      }

      .video_item{
        display: inline-flex;
        flex-shrink: 0;
        flex-grow: 0;
        overflow: hidden;
        transform: rotate(0deg);
      }

      .stage_resize_handler {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: auto;
        width: 10px;
        height: 52px;
        top: calc((100% - 52px)/2);
        left: -6px;
        cursor:col-resize;
      }
    }
  }

  .video_scrollpane_wrap {
    position: absolute;
    display: flex;

    .video_scrollpane {
      border-radius: 0;
      pointer-events: auto;
      scroll-behavior: smooth;

      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none;  /* IE 10+ */
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent; /* make scrollbar transparent */
      }

      .video_list_container{
        .video_item{
          display: inline-flex;
          flex-shrink: 0;
          flex-grow: 0;
          overflow: hidden;
          transform: rotate(0deg);
        }
      }

      &.horizontal {
        overflow-x: auto;
        overflow-y: hidden;

        .video_list_container{
          height: 100%;
        }
      }
      &.vertical {
        overflow-x: hidden;
        overflow-y: auto;

        .video_list_container{
          width: 100%;
        }
      }
    }

    &.stage_max {

      background-color: $md-gray-10;
      border-radius: 7px;
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.14);

      .floating_strip_head {
        margin: 8px;
        width: 100%;
        height: 24px;
        display: flex;
        justify-content: space-between;
        pointer-events: auto;

        .btngrp {
          background-color: $md-gray-20;
          width: 48px;
          height: 24px;
          border-radius: 12px;
          display: flex;

          &.btn {
            width: 24px;
            justify-content: center;
            align-items: center;
          }

          .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 22px;
            height: 22px;
            border-radius: 11px;
            margin: 1px;
            pointer-events: auto;
            cursor: default;
            color: $md-gray-100;

            path {
              fill: black;
            }

            .on {
              color: $md-blue-50;

              path {
                fill: $md-blue-50;
              }
            }

            &.selected {
              background: white;
            }
          }
        }
      }
    
    }
  }

}

.transition {
  transition: all 0.2s ease-out;
}


#maximize_video {
  position: absolute;
  z-index: 3;
}

.scene {
  position: absolute;
  z-index: 10;
  width: calc(100% - 16px);
  height: 100%;
  top: 0;
  left: 8px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(~@/assets/img/scene02_apply.jpg);
  border-radius: 10px;
  overflow: hidden;

  .logo {
    position: absolute;
    background: url(~@/assets/img/temp_stage_theme_logo.svg) no-repeat;
    background-size: contain;
  }
}

&.dark,
&.hybrid {
  color: $text-color-primary-dark-ui;

  .video_scrollpane_wrap {
    &.stage_max {
      background-color: $md-gray-95;
      .floating_strip_head {
        .btngrp {
          background-color: $md-gray-80;
          .btn {
            color: $text-color-primary-dark-ui;
            path {
              fill: white;
            }
            .on {
              color: $md-blue-40;
              path {
                fill: $md-blue-40;
              }
            }
            &.selected {
              background: $md-gray-70;
            }
          }
        }
      }
    }
  }
  
  .lb_active_speaker .lb {
    background: rgba($color: $md-gray-100, $alpha: 0.8);
  }

  &.stage,
  &.stage-sharing{
    .stage_area {
      .groupselectionlayer {
        .rect {
          border: 1px dotted rgba($color: #FFFFFF, $alpha: 1.0);
        }
      }
    }
  }
  
}


}


</style>
