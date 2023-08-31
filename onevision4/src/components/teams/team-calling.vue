<template>
  <div 
    class="team-calling" 
    :class="[
      os, theme,
      {onecolumn: onecolumn, }
      ]"
  >
  
    <div 
      class="teams-2nd-calling" 
      :style="{
        width: !onecolumn ? columnwidth : 'auto',
        background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
      }"
      
    >
      <div class="teams-2nd-calling-title">
        Calling
        <div class="no" >
          My number: +1 456 566 1200
        </div>
      </div>
      <div class="teams-2nd-calling-line2">
        <!--md-button class="btn-widget md-button-outline" aria-label="x" :size="24" @click="showCallWidget('widget')" > 
          Call Widget
        </md-button-->
      </div>
      
      <div class='teams-2nd-calling-dialgrp'>
        <div class="searchrow">
          <div class='left' >
            <md-input 
              class="md-search-input search searchinput" 
              ref="searchinput"
              clear
              shape="pill"
              placeholder="Search to dial"
              :value="searchcontent"
              @focus="onSearchFocus"
              @doneediting="onSearchBlur"
              @input="onSearchInput"
              @change="onSearchInput"
            >
              <wl-icon
                name="cancel-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
                slot="clear"
              />
            </md-input>
          </div>

          <div class='right' >
            <span 
              class="btnc btndialpad" 
              :class="{
                active: dialpadVisible,
              }"
              ref="btndialpad" 
              title="Show dialpad view" 
              @click="toggleDialpad"
            >
              <wl-icon name="dialpad-bold" size="16" color="white" />
            </span>

            <span 
              class="btnc btnretrieve" 
              ref="btnretrieve" 
              title="Park retrieve" 
            >
              <wl-icon name="retrieve-call-bold" size="16" color="white" />
            </span>
          </div>
        </div>

        <div class='teams-2nd-calling-tabs' @mouseleave="leaveTab1">
          <div class="teams-2nd-calling-tab-active-bg"></div>
          <div 
            v-for="(tab, idx) in leftTabs"
            :key="`ttt2${idx}`"
            class="btn" 
            :class="[{
              active: leftActiveTabId === idx,
            }, `teams-2nd-calling-tab${idx}`]" 
            @mouseover="hoverTab1(idx)" 
            @click="selectTab1(idx)" 
          >
            <span class="lb">
              {{tab.name}}
            </span>
            
          </div>

          <div class="spacer"></div>
<!--
          <div v-show="leftActiveTabId === 1" class="btn-circle ico-plus" v-tooltip="'Add a speed dial'" @click="addSpeedDial()">
            <wl-icon
              name="plus-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
            />
          </div>
-->
        </div>


        <div v-if="onecolumn && !dialpadVisible" class="forwardtorow" >
          <div class="forwardto" ref="btnforwardcalls" :class="{active: forwardCallsToMenuVisible}" @click="showForwardCalls" >
            <wl-icon name="call-forward-settings-bold" size="16" color="white" />
            <span class="lb">Forward to: {{forwardCallsTo.sub || forwardCallsTo.label}}</span>
            <wl-icon name="arrow-down-bold" size="16" color="white" />
          </div>
        </div>


        <wl-accordion 
          v-if="onecolumn && !dialpadVisible"
          iconLocation="before" 
          :showBottomBorder="false" 
          :defaultCollapsed="false" 
          arrowCollapsed="arrow-right-bold"
          arrowExpanded="arrow-down-bold"
          headerClass="teams-2nd-calling-speeddial-accheader"
          @collapse=" val => { speeddialCollapsed = val}"
        >
          <span slot="header" class="" >
            {{`Speed dial (${speedDialPeopleList.length})`}}
          </span>

        </wl-accordion>


        <wl-scrollbar 
          v-if="(!onecolumn && leftActiveTabId === 1) || (!speeddialCollapsed && onecolumn && !dialpadVisible)" 
          class="teams-2nd-calling-speeddial"
          ref="scrollbarsd" 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
          :alwaysVisible="true"
        >

        <div class="scrollcont" >

          <div v-if="speedDialPeopleList.length === 0" class="teams-2nd-calling-speeddial-empty" >
            <div class="img"></div>
            <div class="title">Speed dials</div>
            <div class="des">Add people to your speed dial</div>
            <md-button class="btn md-button-solid" aria-label="x" :size="32" style="margin-top: 20px;" @click="addSpeedDial()" >Add a speed dial</md-button>
          </div>

          <div v-if="speedDialPeopleList.length > 0" class="teams-2nd-calling-speeddial-list" >

            <div
              v-for="(p, idx) in speedDialPeopleList"
              :key="`spd-list-item-${idx}`"
              :id="`spd-list-item-${p.id}`"
              class="listitm"
              :class="{
                active: p.name && moremenuOpened[p.id] || contextMenuId === p.id,
                noactive: isDragging && dragItem && p.id !== dragItem.id || (!isDragging && idx === dragIdx),
                placeholder: dragItem && p.id === dragItem.id,
              }"
              
              @contextmenu.prevent="onSpeedDialContextmenu($event, p)"

              :draggable="speedDialPeopleList.length > 1"
              @mousedown="speedDialItemMousedown"
              @dragstart="speedDialItemDragstart($event, p)"
              @drag="speedDialItemDrag($event, p, idx)"
              @dragend="speedDialItemDragend"
            >
              <presence-avatar
                v-if="!dragItem || p.id !== dragItem.id"
                :title="p.name"
                :src="p.avatar !== null ? avatarPath + p.avatar : ''" 
                :color="'white'"
                :fontWeight="600"
                :backgroundColor="'#545454'"
                :size="48"
                :presence="p.status" 
                :theme="theme === 'light' ? 'light' : 'dark'"
                class="avatar dragavatar" 
                v-tooltip="!isDragging ? {
                  content: contactCardTemplate(p.name), 
                  html: true,
                  placement: 'right',
                  classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                  autoHide: false,
                  delay: 1000,
                } : null"
              />
              <div v-if="!dragItem || p.id !== dragItem.id" class="bg dragarea" :title="p.name" @click="stopPropagation"></div>
              <div v-if="!dragItem || p.id !== dragItem.id" class="name">{{$shortName(p.name)}}</div>
              <div v-if="!dragItem || p.id !== dragItem.id" class="type">{{p.speeddial.split(': ')[0]}}</div>

              <div 
                v-if="!dragItem || p.id !== dragItem.id" 
                class="btnmore " 
                :class="[`btnmore_${p.id}`, {
                  active: p.name && moremenuOpened[p.id] || contextMenuId === p.id,
                }]" 
                @click="showMore(p)"
              >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z" fill="white" fill-opacity="0.95"/>
                    <path d="M4.25 8.75C4.66421 8.75 5 8.41421 5 8C5 7.58579 4.66421 7.25 4.25 7.25C3.83579 7.25 3.5 7.58579 3.5 8C3.5 8.41421 3.83579 8.75 4.25 8.75Z" fill="white" fill-opacity="0.95"/>
                    <path d="M11.75 8.75C12.1642 8.75 12.5 8.41421 12.5 8C12.5 7.58579 12.1642 7.25 11.75 7.25C11.3358 7.25 11 7.58579 11 8C11 8.41421 11.3358 8.75 11.75 8.75Z" fill="white" fill-opacity="0.95"/>
                  </svg>
              </div>

              <div v-if="!dragItem || p.id !== dragItem.id" class="ctrl">
                <div class="btn btn-green" 
                @click="startAudioCall({
                    number: p.speeddial.split(': ')[1].replace(/-/g, ' '),
                    people: p,
                  })">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.4484 10.8817L12.9572 9.38846C12.7842 9.21567 12.5788 9.07867 12.3528 8.9853C12.1269 8.89192 11.8847 8.844 11.6402 8.84428C11.3957 8.84455 11.1536 8.89301 10.9278 8.98689C10.7021 9.08077 10.497 9.21823 10.3244 9.39141C10.3244 9.39141 9.68034 10.0471 9.40789 10.3223C8.42591 10.2879 7.49359 9.88202 6.79926 9.18678C6.10492 8.49153 5.7003 7.55868 5.66714 6.57666C5.94109 6.30386 6.59634 5.65896 6.59929 5.65601C6.94824 5.30668 7.14424 4.83311 7.14424 4.33936C7.14424 3.8456 6.94824 3.37204 6.59929 3.02271L5.10809 1.52951C4.75283 1.18967 4.28015 1 3.78852 1C3.29689 1 2.82421 1.18967 2.46894 1.52951L1.67154 2.32746C0.595541 3.40501 0.341491 7.17756 4.57439 11.4166C6.84879 13.694 8.85514 14.529 10.1383 14.8283C10.6031 14.9394 11.079 14.9971 11.5568 15.0004C12.3162 15.0537 13.0668 14.8108 13.651 14.3227L14.4484 13.525C14.7982 13.1741 14.9946 12.6988 14.9946 12.2033C14.9946 11.7079 14.7982 11.2326 14.4484 10.8817ZM13.7414 12.8167L12.944 13.615C12.6169 13.9426 11.6706 14.1577 10.3649 13.8531C9.20914 13.5831 7.38884 12.819 5.28144 10.7088C1.51874 6.94046 1.67839 3.73651 2.37859 3.03541L3.17594 2.23746C3.34089 2.07981 3.56027 1.99184 3.78844 1.99184C4.01661 1.99184 4.23599 2.07981 4.40094 2.23746L5.89214 3.73066C6.05298 3.89164 6.14358 4.10973 6.14413 4.3373C6.14468 4.56486 6.05515 4.7834 5.89509 4.94516C5.89509 4.94516 5.08009 5.74696 4.88384 5.94451C4.80279 6.04053 4.74184 6.15184 4.7046 6.27185C4.66736 6.39186 4.65459 6.51812 4.66704 6.64316C4.73085 7.86462 5.23777 9.02093 6.09284 9.89551C7.39654 11.2014 9.53719 11.6111 10.0386 11.1071C10.2354 10.91 11.0336 10.0971 11.0342 10.0965C11.1956 9.93538 11.4142 9.8449 11.6422 9.8449C11.8701 9.8449 12.0888 9.93538 12.2501 10.0965L13.7413 11.5896C13.9036 11.7526 13.9947 11.9732 13.9948 12.2032C13.9948 12.4332 13.9037 12.6538 13.7414 12.8168V12.8167Z" fill="white" fill-opacity="0.95"/>
                  </svg>
                </div>
              <!--
                <div class="btn btn-outline md-button-outline" :class="`btnmore_${p.name.replace(/ /g, '_')}`" @click="showMore(p)" >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z" fill="white" fill-opacity="0.95"/>
                    <path d="M4.25 8.75C4.66421 8.75 5 8.41421 5 8C5 7.58579 4.66421 7.25 4.25 7.25C3.83579 7.25 3.5 7.58579 3.5 8C3.5 8.41421 3.83579 8.75 4.25 8.75Z" fill="white" fill-opacity="0.95"/>
                    <path d="M11.75 8.75C12.1642 8.75 12.5 8.41421 12.5 8C12.5 7.58579 12.1642 7.25 11.75 7.25C11.3358 7.25 11 7.58579 11 8C11 8.41421 11.3358 8.75 11.75 8.75Z" fill="white" fill-opacity="0.95"/>
                  </svg>
                </div>
              -->
              </div>
            </div>

            <div v-if="speedDialPeopleList.length < maxSpeedDials" class="listitm noactive" >
              <div class="btn-add" @click="addSpeedDial()" >
                <wl-icon
                  name="plus-bold" 
                  :color=" theme === 'light' ? 'black-95' : 'white-95' "
                  size="28"
                />
              </div>
              <div class="add-label" >
                Add
              </div>
            </div>

            <div v-if="speedDialPeopleList.length < 2" class="invisibleitem" ></div><!-- 只有一个speed dial和add button时，通过这个变成三个item，左对齐 -->

          </div>


          </div>
        </wl-scrollbar>
        <div v-if="speedDialPeopleList.length === maxSpeedDials && ((!onecolumn && leftActiveTabId === 1) || (!speeddialCollapsed && onecolumn && !dialpadVisible))" class="max-speed-dials">Maximum speed dials reached (20/20)</div>


        <wl-scrollbar 
          v-if="leftActiveTabId === 0 && !onecolumn || dialpadVisible" 
          class="teams-2nd-calling-dialpad"
          ref="scrollbarpad" 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
        >
          <div class="scrollcont" >
            <div class="dialpad" >
              <div class="num" @mousedown="dialpadPress($event, 1)" >
                <div class="t1">1</div>
                <div class="t2"></div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 2)" >
                <div class="t1">2</div>
                <div class="t2">ABC</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 3)" >
                <div class="t1">3</div>
                <div class="t2">DEF</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 4)" >
                <div class="t1">4</div>
                <div class="t2">GHI</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 5)" >
                <div class="t1">5</div>
                <div class="t2">JKL</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 6)" >
                <div class="t1">6</div>
                <div class="t2">MNO</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 7)" >
                <div class="t1">7</div>
                <div class="t2">PRS</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 8)" >
                <div class="t1">8</div>
                <div class="t2">TUV</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 9)" >
                <div class="t1">9</div>
                <div class="t2">WXYZ</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, '*')" >
                <div class="t1" style="font-size: 40px; margin-top: 12px; ">*</div>
                <div class="t2"></div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, 0)" >
                <div class="t1">0</div>
                <div class="t2">+</div>
              </div>
              <div class="num" @mousedown="dialpadPress($event, '#')" >
                <div class="t1">#</div>
                <div class="t2"></div>
              </div>

              <div class="btns">
                <div class="btn" @click="startAudioCall({
                    number: searchcontent,
                    people: {
                      id: 'c0000',
                      name: searchcontent,
                      avatar: null,
                      group: 1,
                      isNumber: true,
                    },
                  })">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.2847 19.0429L22.6751 16.4298C22.3723 16.1274 22.0129 15.8877 21.6175 15.7243C21.222 15.5609 20.7982 15.477 20.3703 15.4775C19.9424 15.478 19.5188 15.5628 19.1237 15.7271C18.7286 15.8914 18.3698 16.1319 18.0677 16.435C18.0677 16.435 16.9406 17.5823 16.4638 18.064C14.7453 18.0038 13.1138 17.2935 11.8987 16.0769C10.6836 14.8602 9.97553 13.2277 9.9175 11.5091C10.3969 11.0317 11.5436 9.90317 11.5488 9.89801C12.1594 9.28668 12.5024 8.45795 12.5024 7.59387C12.5024 6.7298 12.1594 5.90106 11.5488 5.28974L8.93916 2.67664C8.31744 2.08193 7.49026 1.75 6.6299 1.75C5.76955 1.75 4.94236 2.08193 4.32065 2.67664L2.9252 4.07305C1.0422 5.95876 0.597609 12.5607 8.00518 19.979C11.9854 23.9644 15.4965 25.4258 17.7421 25.9494C18.5554 26.1439 19.3882 26.245 20.2244 26.2506C21.5534 26.3439 22.8669 25.9189 23.8893 25.0647L25.2847 23.6688C25.8968 23.0546 26.2405 22.2229 26.2405 21.3558C26.2405 20.4888 25.8968 19.657 25.2847 19.0429V19.0429ZM24.0474 22.4291L22.6521 23.8263C22.0796 24.3995 20.4235 24.776 18.1386 24.2429C16.116 23.7704 12.9305 22.4333 9.24252 18.7404C2.6578 12.1458 2.93718 6.53889 4.16253 5.31196L5.5579 3.91555C5.84656 3.63967 6.23048 3.48571 6.62977 3.48571C7.02907 3.48571 7.41298 3.63967 7.70165 3.91555L10.3112 6.52865C10.5927 6.81037 10.7513 7.19203 10.7522 7.59027C10.7532 7.98851 10.5965 8.37094 10.3164 8.65402C10.3164 8.65402 8.89016 10.0572 8.54672 10.4029C8.40488 10.5709 8.29822 10.7657 8.23305 10.9757C8.16788 11.1857 8.14553 11.4067 8.16732 11.6255C8.27899 13.7631 9.16609 15.7866 10.6625 17.3171C12.9439 19.6025 16.6901 20.3194 17.5676 19.4373C17.912 19.0925 19.3089 17.6698 19.3099 17.6688C19.5922 17.3869 19.9748 17.2286 20.3738 17.2286C20.7727 17.2286 21.1554 17.3869 21.4377 17.6688L24.0473 20.2818C24.3313 20.567 24.4908 20.9531 24.4908 21.3556C24.4909 21.7581 24.3314 22.1442 24.0474 22.4294V22.4291Z" fill="white" fill-opacity="0.95"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </wl-scrollbar>

        <div v-if="!onecolumn || onecolumn && dialpadVisible" class="forwardtorow" >
          <div class="forwardto" ref="btnforwardcalls" :class="{active: forwardCallsToMenuVisible}" @click="showForwardCalls" >
            <wl-icon name="call-forward-settings-bold" size="16" color="white" />
            <span class="lb">Forward to: {{forwardCallsTo.sub || forwardCallsTo.label}}</span>
            <wl-icon name="arrow-down-bold" size="16" color="white" />
          </div>
        </div>
        
      </div>

      
    </div>
    







    <div v-show="!dialpadVisible" class='calling-details' :style="{
      background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
      borderTopRightRadius: teamsSidecarName && !gptPanelPopouted || meetingsSidecarVisible ? '12px' : '0',
    }">
        <div class="top">
          <div class='space-content-tabs' @mouseleave="leaveTab">
            <div class="space-content-tab-active-bg"></div>
            <div 
              v-for="(tab, idx) in tabs"
              :key="`tttt${idx}`"
              class="btn" 
              :class="[{
                active: activeTabId === idx,
              }, `space-content-tab${idx}`]" 
              @mouseover="hoverTab(idx)" 
              @click="selectTab(idx)" 
            >
              <div v-if="!isFTE && tab.unread > 0" class="badge">{{tab.unread}}</div>
              <span class="lb">
                {{tab.name}}
              </span>
              
            </div>
          </div>

          <div class="btn-circle" ref="iconfilter" @click="showFilter">
            <wl-icon
              name="filter-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
            />
          </div>

        </div>

        <wl-scrollbar 
          v-if="datalist.length > 0" 
          ref="scrollbar" 
          class='cont-wrap' 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
          :alwaysVisible="true"
        >
          <div class="scrollcont">

            <div class="cont-area cont-list">
              <div 
                v-for="(itm, idx) in datalist.filter(itm => activeTabId === 0 && itm.type === 1 || activeTabId === 1 && itm.type === 2)"
                :key="`contitm${idx}`"
                class="itm-call" 
                :class="{
                  active: activeItemName === itm.name || contextMenuId === itm.name.replace(/ /g, '_'),
                  exp: itm.exp, 
                  grow: shrink >= 2,
                }"
                @click="toggleItem(itm)"
                @contextmenu.prevent="onCallItemContextmenu($event, itm)"
              >
                
                <div class="row1">
                  <span class="left" :class="{gradientmask: shrink > 4 && itm.type !== 2, gradientmask3btn: shrink > 4 && itm.type === 2}">
                    <div class="ico">

                      <svg v-if="itm.unread" class="unread" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 11.2499C8.8995 11.2499 11.25 8.89937 11.25 5.99988C11.25 3.10038 8.8995 0.749878 6 0.749878C3.10051 0.749878 0.75 3.10038 0.75 5.99988C0.75 8.89937 3.10051 11.2499 6 11.2499Z" fill="#64B4FA"/>
                      </svg>

                      <span v-show="!itm.unread" :class="{red: itm.dir === 'missed'}">
                        <wl-icon v-if="itm.dir === 'out'" name="outgoing-call-legacy-bold" size="16" />
                        <!--<wl-icon v-if="itm.dir === 'in' || itm.dir === 'missed'" name="incoming-call-legacy-bold" size="16" />-->
                      </span>

                      <span v-show="!itm.unread && itm.type === 2" >
                        <wl-icon v-if="!itm.exp" name="arrow-right-filled" size="12" />
                        <wl-icon v-if="itm.exp" name="arrow-down-filled" size="12" />
                      </span>

                    </div>
                    
                    <presence-avatar
                      :title="itm.name"
                      :src="itm.avatar !== null ? avatarPath + itm.avatar : ''" 
                      :color="'white'"
                      :fontWeight="600"
                      :backgroundColor="'#545454'"
                      :size="32"
                      :presence="itm.status" 
                      :theme="theme === 'light' ? 'light' : 'dark'"
                      class="avatar" 

                      v-tooltip="{
                        content: contactCardTemplate(itm.name), 
                        html: true,
                        placement: 'right',
                        classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                        autoHide: false,
                        delay: 1000,
                      }"
                    />

                    <div class="txt">
                      <span class="lb" :class="{red: itm.dir === 'missed', bold: itm.dir === 'missed', unread: itm.unread}">{{itm.name}}</span>
                      <span class="lb2">
                        <span v-if="itm.lev" class="lev" :style="{color: levColors[itm.lev]}">
                          {{itm.lev}}
                        </span>
                        <span v-if="itm.type === 1" class="tt">
                          {{itm.sub}}
                        </span>
                        <span v-if="itm.type === 2 && !itm.exp" class="tt">
                          {{itm.info.transcription}}
                        </span>
                        
                      </span>
                    </div>
                  </span>

                  <span v-show="shrink < 2" class="mid" >
                    <span v-if="itm.type === 1" class="rw" >
                      <span class="lb">{{itm.date}}</span>
                    </span>

                    <span v-if="itm.type === 2" class="rw" >
                      <div class="ico" >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.5 6.00012C9.96973 6.00065 9.46133 6.21154 9.08637 6.58649C8.71141 6.96145 8.50053 7.46985 8.5 8.00012C8.50199 8.35228 8.598 8.69751 8.77811 9.00012H7.22189C7.402 8.69751 7.49801 8.35228 7.5 8.00012C7.5 7.60456 7.3827 7.21788 7.16294 6.88898C6.94318 6.56008 6.63082 6.30374 6.26537 6.15236C5.89991 6.00099 5.49778 5.96138 5.10982 6.03855C4.72186 6.11572 4.36549 6.3062 4.08579 6.58591C3.80608 6.86561 3.6156 7.22198 3.53843 7.60994C3.46126 7.9979 3.50087 8.40004 3.65224 8.76549C3.80362 9.13094 4.05996 9.4433 4.38886 9.66306C4.71776 9.88282 5.10444 10.0001 5.5 10.0001H10.5C11.0304 10.0001 11.5391 9.78941 11.9142 9.41434C12.2893 9.03926 12.5 8.53056 12.5 8.00012C12.5 7.46969 12.2893 6.96098 11.9142 6.58591C11.5391 6.21084 11.0304 6.00012 10.5 6.00012ZM4.5 8.00012C4.5 7.80234 4.55865 7.609 4.66853 7.44455C4.77841 7.2801 4.93459 7.15193 5.11732 7.07624C5.30004 7.00056 5.50111 6.98075 5.69509 7.01934C5.88907 7.05792 6.06725 7.15316 6.20711 7.29302C6.34696 7.43287 6.4422 7.61105 6.48079 7.80503C6.51937 7.99901 6.49957 8.20008 6.42388 8.38281C6.34819 8.56553 6.22002 8.72171 6.05557 8.83159C5.89112 8.94147 5.69778 9.00012 5.5 9.00012C5.23489 8.99978 4.98073 8.89431 4.79327 8.70685C4.60581 8.51939 4.50034 8.26523 4.5 8.00012ZM10.5 9.00012C10.3022 9.00012 10.1089 8.94147 9.94443 8.83159C9.77998 8.72171 9.65181 8.56553 9.57612 8.38281C9.50043 8.20008 9.48063 7.99901 9.51921 7.80503C9.5578 7.61105 9.65304 7.43287 9.79289 7.29302C9.93274 7.15316 10.1109 7.05792 10.3049 7.01934C10.4989 6.98075 10.7 7.00056 10.8827 7.07624C11.0654 7.15193 11.2216 7.2801 11.3315 7.44455C11.4414 7.609 11.5 7.80234 11.5 8.00012C11.4997 8.26523 11.3942 8.51939 11.2067 8.70685C11.0193 8.89431 10.7651 8.99978 10.5 9.00012Z" fill="white" fill-opacity="0.95"/>
                          <path d="M12.5 3.00012H3.5C2.8372 3.0009 2.20176 3.26454 1.73309 3.73321C1.26442 4.20189 1.00078 4.83732 1 5.50012V10.5001C1.00078 11.1629 1.26442 11.7984 1.73309 12.267C2.20177 12.7357 2.8372 12.9993 3.5 13.0001H12.5C13.1628 12.9993 13.7982 12.7357 14.2669 12.267C14.7356 11.7984 14.9992 11.1629 15 10.5001V5.50012C14.9992 4.83732 14.7356 4.20189 14.2669 3.73322C13.7982 3.26454 13.1628 3.0009 12.5 3.00012ZM14 10.5001C13.9996 10.8978 13.8414 11.2791 13.5602 11.5603C13.279 11.8415 12.8977 11.9997 12.5 12.0001H3.5C3.10231 11.9997 2.72103 11.8415 2.43982 11.5603C2.15861 11.2791 2.00043 10.8978 2 10.5001V5.50012C2.00043 5.10243 2.15861 4.72115 2.43982 4.43994C2.72103 4.15873 3.10231 4.00056 3.5 4.00012H12.5C12.8977 4.00056 13.279 4.15873 13.5602 4.43994C13.8414 4.72115 13.9996 5.10243 14 5.50012V10.5001Z" fill="white" fill-opacity="0.95"/>
                        </svg>
                      </div>

                      <span class="lb2" style="margin-right: 8px;">{{voicemailPlayData[itm.name] && voicemailPlayData[itm.name].time || '00:00'}}</span>
                      <md-slider
                        :min="0"
                        :max="100"
                        :tick="1"
                        :value="voicemailPlayData[itm.name] && voicemailPlayData[itm.name].val || 5"
                        :step="1"
                        :showTicks="false"
                        :showSelection="true"
                        class="slider"
                        @click="stopPropagation"
                      />
                      <span class="lb2" style="margin-left: 8px;">00:12</span>
                    </span>
                    
                  </span>

                  <span v-show="shrink < 5" class="right">
                    <div v-if="itm.type === 1" class="txt">
                      <span class="lb">{{itm.dur}}</span>
                    </div>

                    <div v-if="itm.type === 2" class="txt">
                      <span class="lb">{{itm.date}}</span>
                    </div>

                  </span>

                  <div class="buttons" >
                    <md-button 
                      v-if="itm.type === 2"
                      class="btn md-button-solid " 
                      aria-label="x" 
                      :size="32" 
                      @click="playVoicemail($event, itm)"
                    >
                      <svg v-if="!itm.playing" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.99097 13.9984C3.59443 13.9967 3.21473 13.8379 2.93494 13.5569C2.65516 13.2759 2.49807 12.8955 2.49805 12.4989V3.50088C2.49801 3.24518 2.56335 2.99371 2.68787 2.77038C2.81239 2.54705 2.99194 2.35926 3.20946 2.22485C3.42699 2.09045 3.67527 2.0139 3.93072 2.00247C4.18616 1.99105 4.44029 2.04512 4.66895 2.15957L12.6851 6.66396C12.9321 6.79027 13.1393 6.98261 13.2836 7.21961C13.4279 7.4566 13.5036 7.72897 13.5024 8.00643C13.5012 8.2839 13.4231 8.55559 13.2767 8.79131C13.1304 9.02704 12.9215 9.21756 12.6733 9.3417L4.69019 13.8295C4.47346 13.9395 4.23402 13.9974 3.99097 13.9984ZM4.00513 2.99648C3.90957 2.99801 3.81623 3.02552 3.73513 3.07607C3.66218 3.12026 3.60197 3.18265 3.56041 3.25712C3.51885 3.33159 3.49736 3.41559 3.49806 3.50088V12.4989C3.49808 12.5842 3.51988 12.668 3.56141 12.7425C3.60293 12.8169 3.6628 12.8795 3.73532 12.9243C3.80785 12.9692 3.89063 12.9947 3.97579 12.9985C4.06096 13.0023 4.14569 12.9843 4.22194 12.9462L12.2046 8.4584C12.2932 8.41891 12.3685 8.35459 12.4214 8.27323C12.4742 8.19186 12.5024 8.09692 12.5025 7.9999C12.5036 7.90681 12.4782 7.81532 12.4292 7.73612C12.3803 7.65692 12.3098 7.59328 12.2261 7.55263L12.2046 7.5414L4.20044 3.04287C4.13984 3.0124 4.07296 2.99651 4.00513 2.99648Z" fill="black" fill-opacity="0.95"/>
                      </svg>
                      <svg v-if="itm.playing" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 2C4.46974 2.00056 3.96136 2.21146 3.58641 2.58641C3.21146 2.96136 3.00056 3.46974 3 4V12C3 12.5304 3.21071 13.0391 3.58579 13.4142C3.96086 13.7893 4.46957 14 5 14C5.53043 14 6.03914 13.7893 6.41421 13.4142C6.78929 13.0391 7 12.5304 7 12V4C6.99944 3.46974 6.78854 2.96136 6.41359 2.58641C6.03864 2.21146 5.53026 2.00056 5 2ZM6 12C6 12.2652 5.89464 12.5196 5.70711 12.7071C5.51957 12.8946 5.26522 13 5 13C4.73478 13 4.48043 12.8946 4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12V4C4 3.73478 4.10536 3.48043 4.29289 3.29289C4.48043 3.10536 4.73478 3 5 3C5.26522 3 5.51957 3.10536 5.70711 3.29289C5.89464 3.48043 6 3.73478 6 4V12Z" fill="black" fill-opacity="0.95"/>
                        <path d="M10.9998 2C10.4695 2.00056 9.96111 2.21146 9.58616 2.58641C9.21121 2.96136 9.00032 3.46974 8.99976 4V12C8.99976 12.5304 9.21047 13.0391 9.58554 13.4142C9.96061 13.7893 10.4693 14 10.9998 14C11.5302 14 12.0389 13.7893 12.414 13.4142C12.789 13.0391 12.9998 12.5304 12.9998 12V4C12.9992 3.46974 12.7883 2.96136 12.4133 2.58641C12.0384 2.21146 11.53 2.00056 10.9998 2ZM11.9998 12C11.9998 12.2652 11.8944 12.5196 11.7069 12.7071C11.5193 12.8946 11.265 13 10.9998 13C10.7345 13 10.4802 12.8946 10.2926 12.7071C10.1051 12.5196 9.99976 12.2652 9.99976 12V4C9.99976 3.73478 10.1051 3.48043 10.2926 3.29289C10.4802 3.10536 10.7345 3 10.9998 3C11.265 3 11.5193 3.10536 11.7069 3.29289C11.8944 3.48043 11.9998 3.73478 11.9998 4V12Z" fill="black" fill-opacity="0.95"/>
                      </svg>

                    </md-button>

                    <md-button 
                      class="btn green" 
                      color="green"
                      aria-label="x" 
                      :size="32" 
                      @click="startAudioCall({
                        number: '+1 888 555 1234',
                        people: itm,
                      })"
                      
                    >
                      <wl-icon name="handset-bold" size="16" color="white" />
                    </md-button>

                    <md-button 
                      class="btn green" 
                      color="green"
                      aria-label="x" 
                      :size="32" 
                      @click="startVideoCall({
                        number: 'Work: +1 888 555 1234',
                        people: itm,
                      })"
                    >
                      <wl-icon name="camera-bold" size="16" color="white" />
                    </md-button>

                    <md-button 
                    v-if="itm.type === 1"
                      class="btn blue" 
                      color="blue"
                      aria-label="x" 
                      :size="32" 
                    >
                      <wl-icon name="chat-bold" size="16" color="white" />
                    </md-button>

                    <md-button 
                    v-if="itm.type === 1"
                      class="btn md-button-outline " 
                      aria-label="x"
                      :size="32"
                      @click="showMoreMenu($event, itm)"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z" fill="white" fill-opacity="0.95"/>
                        <path d="M4.25 8.75C4.66421 8.75 5 8.41421 5 8C5 7.58579 4.66421 7.25 4.25 7.25C3.83579 7.25 3.5 7.58579 3.5 8C3.5 8.41421 3.83579 8.75 4.25 8.75Z" fill="white" fill-opacity="0.95"/>
                        <path d="M11.75 8.75C12.1642 8.75 12.5 8.41421 12.5 8C12.5 7.58579 12.1642 7.25 11.75 7.25C11.3358 7.25 11 7.58579 11 8C11 8.41421 11.3358 8.75 11.75 8.75Z" fill="white" fill-opacity="0.95"/>
                      </svg>
                    </md-button>
                  </div>
                </div>

                <div v-if="itm.multi" class="row2" >
                  <div 
                    class="subitm"
                    v-for="(subitm, idx2) in itm.multi"
                    :key="`subitm${idx2}`"
                  >
                    

                    <span v-show="shrink < 3" class="subitm-l" :class="{red: subitm.dir === 'missed'}">
                      <span class="rw" >

                        <div class="ico" >
                          <svg v-if="subitm.dir === 'out'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.4997 1.00024H10.4997C10.3671 1.00024 10.2399 1.05292 10.1461 1.14669C10.0523 1.24046 9.99966 1.36764 9.99966 1.50024C9.99966 1.63285 10.0523 1.76003 10.1461 1.8538C10.2399 1.94757 10.3671 2.00024 10.4997 2.00024H13.2914L9.14615 6.14674C9.09972 6.19317 9.0629 6.24828 9.03778 6.30894C9.01265 6.3696 8.99972 6.43461 8.99972 6.50026C8.99972 6.56592 9.01266 6.63093 9.03778 6.69158C9.06291 6.75224 9.09974 6.80735 9.14616 6.85377C9.19259 6.9002 9.2477 6.93702 9.30836 6.96215C9.36901 6.98727 9.43403 7.0002 9.49968 7.0002C9.56533 7.0002 9.63034 6.98726 9.691 6.96214C9.75166 6.93701 9.80677 6.90018 9.85319 6.85376L13.9997 2.70605V5.50024C13.9997 5.63285 14.0524 5.76003 14.1461 5.8538C14.2399 5.94757 14.3671 6.00024 14.4997 6.00024C14.6323 6.00024 14.7595 5.94757 14.8532 5.8538C14.947 5.76003 14.9997 5.63285 14.9997 5.50024V1.50024C14.9997 1.43458 14.9868 1.36955 14.9617 1.30888C14.9365 1.2482 14.8997 1.19308 14.8533 1.14664C14.8068 1.10021 14.7517 1.06338 14.691 1.03826C14.6304 1.01314 14.5653 1.00022 14.4997 1.00024Z" fill="white" fill-opacity="0.95"/>
                            <path d="M12.1055 9.75779C11.9421 9.59469 11.7482 9.46537 11.5348 9.37724C11.3214 9.28911 11.0927 9.24389 10.8618 9.24416C10.631 9.24444 10.4024 9.2902 10.1892 9.37883C9.97604 9.46747 9.78241 9.59724 9.6194 9.76073C9.6194 9.76073 9.04099 10.3502 8.78353 10.6099C7.89266 10.5731 7.04826 10.2024 6.41819 9.57152C5.78813 8.94062 5.41855 8.09573 5.38292 7.2048C5.64281 6.94701 6.23099 6.36783 6.23392 6.36489C6.56332 6.035 6.74834 5.58786 6.74834 5.12166C6.74834 4.65547 6.56332 4.20833 6.23392 3.87843L4.85676 2.49943C4.52122 2.17872 4.07494 1.99975 3.61078 1.99975C3.14662 1.99975 2.70034 2.17872 2.3648 2.49943L1.6286 3.23664C0.624692 4.2414 0.380912 7.7517 4.30914 11.6851C6.80892 14.1887 9.13772 14.9998 10.7596 14.9998C11.4779 15.05 12.1884 14.8247 12.7465 14.3697L13.4827 13.6325C13.8133 13.3015 13.999 12.8528 13.999 12.3849C13.999 11.917 13.8133 11.4683 13.4827 11.1373L12.1055 9.75779ZM12.7753 12.9242L12.0391 13.6428C11.3996 14.2816 8.47137 14.4176 5.01652 10.9582C1.56119 7.4983 1.697 4.5848 2.33599 3.94496L3.07219 3.22375C3.14285 3.15289 3.22679 3.09667 3.31922 3.05831C3.41164 3.01995 3.51072 3.0002 3.61079 3.0002C3.71086 3.0002 3.80994 3.01995 3.90237 3.05831C3.99479 3.09667 4.07874 3.15289 4.14939 3.22375L5.52654 4.58675C5.66774 4.7282 5.74729 4.91973 5.74784 5.11959C5.74839 5.31945 5.66989 5.51142 5.52947 5.65364C5.52947 5.65364 4.77666 6.39473 4.59397 6.57768C3.94228 7.23218 4.82797 9.39581 5.71172 10.2807C6.29247 10.8462 7.00768 11.2544 7.7899 11.467C8.24521 11.5917 9.06104 11.7487 9.41034 11.3995C9.59207 11.2175 10.3297 10.4666 10.3297 10.4661C10.4715 10.3247 10.6637 10.2453 10.8639 10.2453C11.0642 10.2453 11.2563 10.3247 11.3981 10.4661L12.7753 11.8456C12.9182 11.9887 12.9985 12.1826 12.9985 12.3849C12.9985 12.5872 12.9182 12.7811 12.7753 12.9242Z" fill="white" fill-opacity="0.95"/>
                          </svg>

                          <!--
                            <svg v-if="subitm.dir === 'in' || subitm.dir === 'missed'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.8532 1.14636C14.8068 1.09992 14.7517 1.06308 14.691 1.03795C14.6304 1.01281 14.5653 0.999878 14.4997 0.999878C14.434 0.999878 14.369 1.01281 14.3083 1.03795C14.2477 1.06308 14.1926 1.09992 14.1462 1.14636L9.99969 5.29163V2.49988C9.99969 2.36727 9.94701 2.24009 9.85325 2.14633C9.75948 2.05256 9.6323 1.99988 9.49969 1.99988C9.36708 1.99988 9.23991 2.05256 9.14614 2.14633C9.05237 2.24009 8.99969 2.36727 8.99969 2.49988V6.49988C8.99965 6.56555 9.01256 6.63059 9.03768 6.69127C9.06279 6.75195 9.09962 6.80708 9.14606 6.85352C9.19249 6.89995 9.24763 6.93678 9.30831 6.9619C9.36899 6.98701 9.43402 6.99992 9.49969 6.99988H13.4997C13.6323 6.99988 13.7595 6.9472 13.8532 6.85343C13.947 6.75967 13.9997 6.63249 13.9997 6.49988C13.9997 6.36727 13.947 6.2401 13.8532 6.14633C13.7595 6.05256 13.6323 5.99988 13.4997 5.99988H10.7055L14.8532 1.85339C14.8996 1.80698 14.9365 1.75187 14.9616 1.69121C14.9867 1.63055 14.9997 1.56554 14.9997 1.49988C14.9997 1.43422 14.9867 1.36921 14.9616 1.30855C14.9365 1.24789 14.8996 1.19278 14.8532 1.14636Z" fill="white" fill-opacity="0.95"/>
                            <path d="M12.1055 9.75775C11.9421 9.59464 11.7482 9.46533 11.5348 9.3772C11.3214 9.28907 11.0927 9.24385 10.8618 9.24412C10.631 9.24439 10.4024 9.29016 10.1892 9.37879C9.97604 9.46742 9.78241 9.59719 9.6194 9.76069C9.6194 9.76069 9.04099 10.3501 8.78353 10.6099C7.89266 10.5731 7.04826 10.2024 6.41819 9.57147C5.78813 8.94058 5.41855 8.09568 5.38292 7.20476C5.64281 6.94697 6.23099 6.36778 6.23392 6.36485C6.56332 6.03496 6.74834 5.58782 6.74834 5.12162C6.74834 4.65542 6.56332 4.20829 6.23392 3.87839L4.85676 2.49939C4.52122 2.17868 4.07494 1.9997 3.61078 1.9997C3.14662 1.9997 2.70034 2.17868 2.3648 2.49939L1.6286 3.23659C0.624692 4.24136 0.380912 7.75166 4.30914 11.6851C6.80892 14.1887 9.13772 14.9997 10.7596 14.9997C11.4779 15.0499 12.1884 14.8246 12.7465 14.3697L13.4827 13.6325C13.8133 13.3015 13.999 12.8527 13.999 12.3849C13.999 11.917 13.8133 11.4683 13.4827 11.1372L12.1055 9.75775ZM12.7753 12.9242L12.0391 13.6428C11.3996 14.2816 8.47137 14.4176 5.01652 10.9582C1.56119 7.49826 1.697 4.58476 2.33599 3.94492L3.07219 3.22371C3.14285 3.15285 3.22679 3.09663 3.31922 3.05827C3.41164 3.01991 3.51072 3.00016 3.61079 3.00016C3.71086 3.00016 3.80994 3.01991 3.90237 3.05827C3.99479 3.09663 4.07874 3.15285 4.14939 3.22371L5.52654 4.58671C5.66774 4.72815 5.74729 4.91969 5.74784 5.11955C5.74839 5.31941 5.66989 5.51138 5.52947 5.6536C5.52947 5.6536 4.77666 6.39469 4.59397 6.57764C3.94228 7.23214 4.82797 9.39577 5.71172 10.2807C6.29247 10.8462 7.00768 11.2544 7.7899 11.4669C8.24521 11.5917 9.06104 11.7487 9.41034 11.3994C9.59207 11.2174 10.3297 10.4666 10.3297 10.4661C10.4715 10.3246 10.6637 10.2452 10.8639 10.2452C11.0642 10.2452 11.2563 10.3246 11.3981 10.4661L12.7753 11.8455C12.9182 11.9886 12.9985 12.1826 12.9985 12.3849C12.9985 12.5871 12.9182 12.7811 12.7753 12.9242Z" fill="white" fill-opacity="0.95"/>
                          </svg>
                          -->
                        </div>

                        <span v-if="subitm.lev" class="lev" :style="{color: levColors[subitm.lev]}">
                          {{subitm.lev}}
                        </span>

                        <span class="lb">{{subitm.dir === 'out' ? 'Outgoing call' : subitm.dir === 'missed' ? 'Missed call' : 'Incoming call'}}</span>
                      </span>
                    </span>

                    <span class="subitm-m">{{subitm.date}}</span>

                    <span class="subitm-r" :class="{grow: shrink >= 3}">{{subitm.dur}}</span>

                  </div>
                </div>

                <div v-if="itm.type===2" class="row2" :class="{exp: itm.exp, shrink: shrink >= 3}" >
                  <div class="headtt">
                    <span class="lft">{{itm.date}}</span>
                    <span class="rgt">
                      <div class="btnc">
                        <wl-icon name="phone-reply-bold" size="16" />
                      </div>
                      <div class="btnc">
                        <wl-icon name="phone-reply-all-bold" size="16" />
                      </div>
                      <div class="btnc">
                        <wl-icon name="enter-bold" size="16" />
                      </div>
                      <div class="btnc">
                        <wl-icon name="email-read-bold" size="16" />
                      </div>
                      <div class="btnc">
                        <wl-icon name="delete-bold" size="16" />
                      </div>
                    </span>
                  </div>
                  <div class="subitm subitm2">
                    <span class="subitm-l">Number:</span>
                    <span class="subitm-m" >{{itm.info.number}}</span>
                  </div>
                  <div class="subitm subitm2">
                    <span class="subitm-l">Subject:</span>
                    <span class="subitm-m" >{{itm.info.subject}}</span>
                  </div>
                  <div class="subitm subitm2">
                    <span class="subitm-l">To:</span>
                    <span class="subitm-m" >{{itm.info.to}}</span>
                  </div>
                  <div class="subitm subitm2">
                    <span class="subitm-l">Category:</span>
                    <span class="subitm-m" >
                      <div class="tag">
                        <svg class="ico red" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.00009 0.75C4.96174 0.75 3.94671 1.05791 3.08335 1.63478C2.21999 2.21166 1.54709 3.0316 1.14973 3.99091C0.752366 4.95022 0.648399 6.00582 0.850971 7.02422C1.05354 8.04262 1.55356 8.97808 2.28778 9.71231C3.02201 10.4465 3.95747 10.9466 4.97587 11.1491C5.99427 11.3517 7.04987 11.2477 8.00918 10.8504C8.96849 10.453 9.78843 9.7801 10.3653 8.91674C10.9422 8.05339 11.2501 7.03835 11.2501 6C11.2485 4.60809 10.6949 3.27364 9.71068 2.28941C8.72645 1.30519 7.392 0.751562 6.00009 0.75ZM6.00009 10.5C5.11008 10.5 4.24005 10.2361 3.50003 9.74161C2.76001 9.24715 2.18323 8.54434 1.84264 7.72208C1.50204 6.89981 1.41293 5.99501 1.58656 5.12209C1.76019 4.24918 2.18878 3.44736 2.81811 2.81802C3.44745 2.18868 4.24927 1.7601 5.12219 1.58647C5.9951 1.41283 6.8999 1.50195 7.72217 1.84254C8.54444 2.18314 9.24724 2.75991 9.74171 3.49993C10.2362 4.23996 10.5001 5.10998 10.5001 6C10.4988 7.19307 10.0243 8.33691 9.18064 9.18054C8.33701 10.0242 7.19317 10.4987 6.00009 10.5Z" fill="#FC8B98"/>
                          <path d="M6 8.62499C6.25889 8.62499 6.46875 8.41513 6.46875 8.15624C6.46875 7.89736 6.25889 7.68749 6 7.68749C5.74112 7.68749 5.53125 7.89736 5.53125 8.15624C5.53125 8.41513 5.74112 8.62499 6 8.62499Z" fill="#FC8B98"/>
                          <path d="M6.00009 7.125C6.04935 7.12503 6.09812 7.11535 6.14363 7.09651C6.18914 7.07768 6.23049 7.05006 6.26532 7.01523C6.30015 6.9804 6.32777 6.93905 6.34661 6.89354C6.36544 6.84803 6.37512 6.79925 6.37509 6.75V4.125C6.37509 4.02554 6.33559 3.93016 6.26526 3.85984C6.19493 3.78951 6.09955 3.75 6.00009 3.75C5.90064 3.75 5.80525 3.78951 5.73493 3.85984C5.6646 3.93016 5.62509 4.02554 5.62509 4.125V6.75C5.62507 6.79925 5.63475 6.84803 5.65358 6.89354C5.67242 6.93905 5.70004 6.9804 5.73487 7.01523C5.76969 7.05006 5.81104 7.07768 5.85655 7.09651C5.90206 7.11535 5.95084 7.12503 6.00009 7.125Z" fill="#FC8B98"/>
                        </svg>
                        Urgent 
                        <span class="divid">·</span>
                      </div>
                      
                      <div class="tag">
                        <svg class="ico" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.62515 4.5H8.25053V3.17029C8.25053 1.7904 7.283 0.75 6.00015 0.75C4.71768 0.75 3.7509 1.7904 3.7509 3.17029V4.5H3.37515C2.97745 4.50039 2.59614 4.65855 2.31492 4.93977C2.0337 5.22099 1.87554 5.6023 1.87515 6V9.75C1.87555 10.1477 2.03371 10.529 2.31493 10.8102C2.59615 11.0914 2.97745 11.2496 3.37515 11.25H8.62515C9.02286 11.2496 9.40416 11.0914 9.68537 10.8102C9.96659 10.529 10.1248 10.1477 10.1252 9.75V6C10.1248 5.6023 9.96659 5.221 9.68537 4.93978C9.40416 4.65856 9.02286 4.5004 8.62515 4.5ZM4.5009 3.17029C4.5009 2.20239 5.13152 1.5 6.00015 1.5C6.86954 1.5 7.50053 2.20237 7.50053 3.17029V4.5H4.5009V3.17029ZM9.37515 9.75C9.37489 9.94883 9.29579 10.1394 9.1552 10.28C9.0146 10.4206 8.82399 10.4997 8.62515 10.5H3.37515C3.17632 10.4997 2.9857 10.4206 2.84511 10.28C2.70451 10.1394 2.62541 9.94883 2.62515 9.75V6C2.62541 5.80117 2.70451 5.61055 2.84511 5.46995C2.9857 5.32936 3.17632 5.25026 3.37515 5.25H8.62515C8.82399 5.25026 9.0146 5.32936 9.1552 5.46995C9.29579 5.61055 9.37489 5.80117 9.37515 6V9.75Z" fill="white" fill-opacity="0.95"/>
                        </svg>
                        Secure 
                        <span class="divid">·</span>
                      </div>
                      
                      <div class="tag">
                        <svg class="ico" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.41046 1.83705C9.18466 1.6103 8.91616 1.43055 8.62048 1.30816C8.32481 1.18578 8.00781 1.1232 7.68781 1.12403H7.68634C7.21836 1.12426 6.76034 1.25929 6.36708 1.51297C5.97381 1.76665 5.66195 2.12825 5.46878 2.5545C5.27561 2.98076 5.20931 3.45364 5.27781 3.91658C5.34631 4.37953 5.54672 4.81294 5.85506 5.16499L2.26972 8.73939C2.23478 8.77425 2.20705 8.81566 2.18814 8.86125C2.16922 8.90684 2.15948 8.95571 2.15948 9.00507C2.15948 9.05443 2.16922 9.10331 2.18814 9.1489C2.20705 9.19449 2.23478 9.2359 2.26972 9.27076L3.56722 10.5628C3.76821 10.7628 4.04029 10.875 4.32385 10.8748C4.60742 10.8746 4.87933 10.762 5.08004 10.5617L6.06111 9.58057C6.1607 9.48105 6.23969 9.36287 6.29354 9.23278C6.34739 9.10269 6.37506 8.96326 6.37496 8.82247C6.37486 8.68168 6.34699 8.54229 6.29294 8.41228C6.2389 8.28227 6.15975 8.1642 6.06002 8.06482L5.03378 7.04266L6.43245 5.64831C6.94225 5.95559 7.54692 6.06559 8.13228 5.95754C8.71764 5.84948 9.24318 5.53085 9.60968 5.06181C9.97618 4.59276 10.1583 4.00577 10.1216 3.41165C10.0849 2.81753 9.83191 2.25741 9.41046 1.83705ZM5.62494 8.82325C5.62505 8.86539 5.61679 8.90712 5.60063 8.94604C5.58447 8.98495 5.56074 9.02027 5.53082 9.04993L4.54974 10.0314C4.48961 10.0914 4.40816 10.125 4.32324 10.125C4.23831 10.125 4.15686 10.0914 4.09674 10.0314L3.06586 9.00489L4.50286 7.57263L5.53045 8.59619C5.56043 8.62591 5.58422 8.66128 5.60044 8.70026C5.61666 8.73923 5.62499 8.78104 5.62494 8.82325ZM8.88202 4.75428C8.6859 4.95054 8.44441 5.09541 8.17893 5.17606C7.91346 5.25672 7.63219 5.27067 7.36004 5.21668C7.08789 5.16269 6.83325 5.04242 6.61867 4.86653C6.40409 4.69064 6.23619 4.46456 6.12984 4.20829C6.02349 3.95203 5.98197 3.67349 6.00896 3.39735C6.03594 3.12121 6.1306 2.85599 6.28456 2.62516C6.43851 2.39434 6.647 2.20503 6.89157 2.07402C7.13615 1.943 7.40925 1.87431 7.68671 1.87403H7.68781C7.90932 1.87345 8.12875 1.91678 8.33341 2.00151C8.53808 2.08624 8.72392 2.2107 8.88019 2.36769C9.19687 2.68388 9.37496 3.11329 9.37531 3.5608C9.37565 4.0083 9.19821 4.43761 8.88202 4.75428Z" fill="white" fill-opacity="0.95"/>
                        </svg>
                      Private
                      </div>
                      
                    </span>
                    <span class="subitm-r"></span>
                  </div>
                </div>

              </div>
            </div>


          </div>
          

        </wl-scrollbar>


        <div v-if="datalist.length == 0" class="cont-list-empty">

          <svg width="193" height="192" viewBox="0 0 193 192" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M159.004 58.5L168.004 49.5C169.704 47.8 172.304 47.8 174.004 49.5C175.704 51.2 175.704 53.8 174.004 55.5L167.004 62.5L175.004 70.5C177.204 72.7 177.204 76.3 175.004 78.5C172.804 80.7 169.204 80.7 167.004 78.5L159.004 70.5L151.004 76.1C150.004 76.8 149.904 78.3001 150.704 79.2001L151.004 79.5001C152.104 80.6001 152.104 82.4001 151.004 83.5001C149.904 84.6001 148.104 84.6001 147.004 83.5001L140.004 76.5C138.904 75.4 138.904 73.6 140.004 72.5C141.104 71.4 142.904 71.4 144.004 72.5L144.304 72.8C145.204 73.7 146.604 73.6 147.404 72.5L153.004 64.5L145.004 56.5C142.804 54.3 142.804 50.7 145.004 48.5C147.204 46.3 150.804 46.3 153.004 48.5L156.704 52.2001M60.6035 174.3C60.6035 161 49.9035 150.3 36.6035 150.3C36.6035 137 25.9035 126.3 12.6035 126.3M180.604 130.3C180.604 121.5 173.404 114.3 164.604 114.3C164.604 105.5 157.404 98.3 148.604 98.3M116.604 66.3C116.604 57.5 109.404 50.3 100.604 50.3C100.604 41.5 93.4035 34.3 84.6035 34.3M137.204 85.8L98.7035 124.3C90.7035 132.3 94.7035 141.3 101.704 141.3C110.704 141.3 112.704 126.3 97.7035 126.3C88.7035 126.3 75.7035 119.3 65.7035 109.3C58.5035 102.1 53.5035 93.5 50.3035 84.5C48.5035 79.3 49.8035 73.6001 53.7035 69.7001L61.1035 62.3C68.2035 55.2 68.2035 43.6 61.1035 36.5L48.1035 23.5C41.0035 16.4 29.4035 16.4 22.3035 23.5L18.1035 27.7C14.7035 31.1 12.8035 35.8001 12.7035 40.7001C12.5035 72 24.3035 103.2 48.1035 126.9C71.0035 149.8 100.904 161.6 130.904 162.3C135.804 162.4 140.504 160.4 144.004 156.9L149.804 151.1C156.904 144 156.904 132.4 149.804 125.3L135.704 111.2" stroke="url(#paint0_linear_9711_495692)" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_9711_495692" x1="96.6035" y1="18.175" x2="96.6035" y2="174.3" gradientUnits="userSpaceOnUse">
            <stop stop-color="#93C437"/>
            <stop offset="1" stop-color="#279BE8"/>
            </linearGradient>
            </defs>
          </svg>

          <span class="lb">View all your call history and voicemails here</span>
          <md-button ref="btntestcall" class="btn-try md-button-solid" aria-label="x" :size="40" @click="tryTestCall" > 
            Try a test call
          </md-button>

        </div>

    </div>
    
  </div>
</template>

<script>

import popSpeedDialAdd from './pop-speed-dial-add.vue';
import searchResult from './../shared/search-result.vue';
import contextMenu from './../shared/contextmenu.vue';
import _ from 'lodash';
import coachmark from '../shared/coachmark.vue'

export default {
  props:[
      'filterId',
  ],
  data() {
    return {
      mouseTarget: null,
      dragItem: null,
      isDragging: false,
      dragIdx: null,
      prevInsertAt: -1,

      shrink: 0,
      onecolumn: false,
      columnwidth: '',
      dialpadVisible: false,
      speeddialCollapsed: false,
      
      searchcontent: '',
      activeItemName: null,
      maxSpeedDials: 20,

      moremenuOpened: [],

      highlightStyle: {
        light: {
          color: '#000000',
          fontWeight: 'bold',
        },
        dark: {
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
      },

      row1Style: {
        light: {
          color: 'rgba(0, 0, 0, .95)',
          opacity: 1,
        },
        dark: {
          color: 'rgba(255, 255, 255, .95)',
          opacity: 1,
        },
      },
      row2Style: {
        light: {
          color: 'rgba(0, 0, 0, .7)',
          opacity: 1,
        },
        dark: {
          color: 'rgba(255, 255, 255, .7)',
          opacity: 1,
        },
      },

      leftActiveTabId: 0,
      leftTabs: [
          {
            name: 'Dialpad',
          },
          {
            name: 'Speed dials',
          },
        ],




      activeTabId: 0,
      tabs: [
          {
            name: 'Recents',
            unread: 0,
          },
          {
            name: 'Voicemail',
            unread: 2,
          },
        ],
      datalist: [],

      voicemailPlayData: {},
      
      contextMenuId: null,
      contextMenuItems: {
        '1': [
          {
            label: 'Create a new contact',
          },
          {
            label: 'Send email',
          },
          {
            label: 'Block',
          },
          {
            label: 'Delete',
          },
          //{
          //  label: 'divider',
          //},

        ],
        '2': [
          {
            label: 'Play voice message',
          },
          {
            label: 'Audio call',
          },
          {
            label: 'Video call',
          },
          {
            label: 'Delete',
          },
          {
            label: 'Mark as unread',
          },
          {
            label: 'divider',
          },
          
        ]
      },

      filterItemList: [
        {
          label: 'All',
          iconVisible: false,
        },
        {
          label: 'Missed',
          iconVisible: false,
        },
        {
          label: 'divider',
        },
        {
          label: 'Austen Jones',
          icon: 'modifier-chip-L1',
          color: '#30C9B0',
          iconVisible: true,
        },
        {
          label: 'Break Room',
          icon: 'modifier-chip-L2',
          color: '#5EBFF7',
          iconVisible: true,
        },
        {
          label: 'Conference room',
          icon: 'modifier-chip-L3',
          color: '#FF9D52',
          iconVisible: true,
        },
      ],
      filterItem: {
        label: 'All',
      },
      filterItemMenuVisible: false,

      levColors: {
        L1: '#30C9B0',
        L2: '#5EBFF7',
        L3: '#FF9D52',
      },

      forwardCallsTo: {label: 'None'},
      forwardCallsToItemList: [
        {
          label: 'None',
        },
        {
          label: 'Home',
          sub: '+1 456 566 7897',
        },
        {
          label: 'Mobile',
          sub: '+1 456 566 1200',
        },
        {
          label: 'Business',
          sub: '+1 456 566 1200',
        },
      ],
      forwardCallsToMenuVisible: false,

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
    avatarPath(){
      return this.$store.state.avatarPath;
    },
    avatarBgColors() {
      return this.$store.state.avatarBgColors;
    },
    breakpoints() {
      return this.$store.state.breakpoints;
    },
    callingPeopleItems() {
      return this.$store.state.callingPeopleItems;
    },
    anyActiveCalls() {
      var incall = this.$store.state.callingPeopleItems
      var list = incall['widget']
      var i, itm, cnt = 0
      for (i=0; i<list.length; i++) {
        itm = list[i];
        if (!itm.onhold) {
          cnt++
          break;
        }
      }
      return cnt > 0
    },
    speedDialPeopleList() {
      return this.$store.state.speedDialPeopleList;
    },
    teamsNav() {
      return this.$store.state.teamsNav;
    },
    teamsNavTo() {
      return this.$store.state.teamsNavTo;
    },
    teamsNavPageConfig() {
      return this.$store.state.teamsNavPageConfig;
    },
    meetingOptionsList() {
      return this.$store.state.meetingOptionsList;
    },
    isFTE() {
      return this.$store.state.isFTE;
    },
    callAs() {
      return this.$store.state.callAs;
    },
    teamsSidecarName() {
      return this.$store.state.teamsSidecarName;
    },
    gptPanelPopouted() {
      return this.$store.state.gptPanelPopouted;
    },
    meetingsSidecarVisible() {
      return this.$store.state.meetingsSidecarVisible;
    },
  },
  beforeMount() {
    
    this.datalist = this.isFTE ? [] : [
          {
            name: 'David Liam',
            avatar: 'marketing/m001.png',
            video: '19.mp4',
            type: 1,
            sub: 'Work: +1 888 555 2454',
            dir: 'out',
            date: '01:11 PM',
            dur: '1h 3m 31s',
            status: 'presenting',
            lev: 'L2',
          },
          {
            name: 'Emma Hirst',
            avatar: '7.png',
            video: '7.mp4',
            type: 1,
            sub: 'Work: +1 888 555 1234',
            dir: 'in',
            date: '08:23 AM',
            dur: '4m 52s',
            status: 'dnd',
            lev: 'L3',
          },
          {
            name: 'Sarah Robertson',
            avatar: 'marketing/f001.png',
            video: '17.mp4',
            type: 1,
            //sub: 'Call on Webex',
            sub: 'Work: +1 888 632 3267',
            dir: 'missed',
            date: 'Yesterday, 02:11 PM',
            status: 'pto',
            multi: [
              {
                dur: '1m 29s',
                dir: 'in',
                date: 'Yesterday, 02:11 PM',
                lev: 'L3',
              },
              {
                dur: '--',
                dir: 'missed',
                date: 'Yesterday, 02:10 PM',
                lev: 'L3',
              },
              {
                dur: '5m 34s',
                dir: 'out',
                date: 'Yesterday, 01:18 PM',
                lev: 'L3',
              },
            ],
          },
          {
            name: 'Benjamin Vitali',
            avatar: null,
            video: '18.mp4',
            type: 1,
            sub: 'Mobile: +1 888 555 4756',
            dir: 'out',
            date: 'Yesterday, 11:24 AM',
            dur: '4m 52s',
            status: 'active',
            lev: 'L1',
          },
          {
            name: 'Benoit Lapointe',
            avatar: null,
            type: 1,
            sub: 'SIP: isabbren@abccompany.com',
            dir: 'out',
            date: 'Yesterday, 01:11 AM',
            dur: '4m 52s',
            status: 'active',
            lev: 'L2',
          },
          {
            name: 'Ruchika Prabhavalkar',
            avatar: null,
            type: 1,
            sub: 'Mobile: +1 888 555 7864',
            date: '11/07, 08:20 AM',
            dur: '4m 52s',
            status: 'active',
            multi: [
              {
                dur: '4m 52s',
                dir: 'in',
                date: '11/07, 08:20 AM',
                lev: 'L1',
              },
              {
                dur: '--',
                dir: 'missed',
                date: '11/02, 10:03 AM',
                lev: 'L1',
              },
              {
                dur: '5m 34s',
                dir: 'in',
                date: '11/01, 11:30 AM',
                lev: 'L1',
              },
            ],
          },
          {
            name: 'Gaurav Bacchan',
            avatar: null,
            type: 2,
            sub: 'Design review meeting',
            date: '11/08, 02:34 PM',
            unread: true,
            info: {
              to: 'Brandon Burke',
              transcription: `This is Gaurav from XDi, I wanted to let you know that the Webex calling received the people's choice award. This award is chosen by the UX award community as the overall favorite, based on the highest average vote by popular vote, and receives a crystal award. Congratulation! `,
              category: 'Urgent',
              number: 'Work: +1 888 555 4756',
              subject: '12.6 feature demo&review',
            },
            status: 'inactive',
          },
          {
            name: 'Dheeraj Bhasin',
            avatar: null,
            type: 1,
            sub: 'Work: +1 888 555 2346',
            dir: 'missed',
            date: '11/07, 08:23 AM',
            status: 'active',
            lev: 'L1',
          },
          
          {
            name: 'Marissa Reena',
            avatar: null,
            type: 2,
            date: '11/07, 08:00 AM',
            info: {
              to: 'Alison Cassidy',
              transcription: `How are you? I wanted to let you know that the Webex calling received the people's choice award. This award is chosen by the UX award community as the overall favorite, based on the highest average vote by popular vote, and receives a crystal award. Congratulation! `,
              category: 'Secure',
              number: 'Work: +1 888 555 4756',
              subject: '12.6 feature demo&review',
            },
            status: 'inactive',
          },
          {
            name: 'Julia Cyrus',
            avatar: null,
            type: 2,
            date: '11/07, 07:23 AM',
            unread: true,
            info: {
              to: 'Alison Cassidy, Eric Thomas, Brandon Burke, Cody Sutton, Myrtie Berry, Russell Gonzalez, Jeff Klein',
              transcription: `Hey, I wanted to let you know that the Webex calling received the people's choice award. This award is chosen by the UX award community as the overall favorite, based on the highest average vote by popular vote, and receives a crystal award. Congratulation! `,
              category: 'Private',
              number: 'Work: +1 888 555 4756',
              subject: '12.6 feature demo&review',
            },
            status: 'inactive',
          },
          {
            name: 'Peter Hogan',
            avatar: null,
            type: 1,
            sub: 'Work: +1 888 555 2454',
            dir: 'out',
            date: '11/05, 07:23 AM',
            dur: '4m 52s',
            status: 'inactive',
            lev: 'L2',
          },
          {
            name: 'James Weston',
            avatar: null,
            type: 1,
            sub: 'Work: +1 888 555 2454',
            dir: 'out',
            date: '11/04, 07:23 AM',
            dur: '4m 52s',
            lev: 'L3',
          },
          {
            name: 'Marc Brown',
            avatar: null,
            type: 1,
            sub: 'Work: +1 888 555 2454',
            dir: 'out',
            date: '11/01, 07:23 AM',
            dur: '4m 52s',
            status: 'inmeeting',
            lev: 'L1',
          },
          
        ];

      for(var i=0; i<this.datalist.length; i++) {
        var itm = this.datalist[i]
        var p = this.$store.getters.people(itm.name);
        itm.avatar = p.avatar
        itm.status = p.status
        itm.numbers = p.numbers
      }
  },
  
  mounted() {
    this.selectTab(this.activeTabId);

    if (this.teamsNavPageConfig[this.teamsNav]) {
      var conf = this.teamsNavPageConfig[this.teamsNav];
      this.leftActiveTabId = conf.leftActiveTabId ? conf.leftActiveTabId : 0;
    } 
    this.selectTab1(this.leftActiveTabId);

    this.onAppResizing(this.breakpoints);
    
    this.$eventBus.$on('teams-resizing', this.onAppResizing);


    if (this.isFTE) {
      setTimeout(() => {
        this.showCoachmarkStep1()
        
      }, 800)
    }

    requestAnimationFrame(() => {
      this.showCallWidget('widget');
    })
    
  },
  beforeDestroy() {
    this.$eventBus.$off('teams-resizing', this.onAppResizing);
  },
  watch: {
    callingPeopleItems() {
      this.clearInput();

      var incall = this.$store.state.callingPeopleItems
      var list = incall['widget']
      var i, itm, cnt = 0
      for (i=0; i<list.length; i++) {
        itm = list[i];
        if (!itm.onhold) {
          cnt++
          break;
        }
      }
      if (cnt === 0) {
        this.$store.commit('teamWindowOverlayRect', null)
        this.$popper.hideAll()
      }
    },
    meetingOptionsList(newVal, oldVal) {
      if (newVal.length == 0 && oldVal.length > 0) {
        this.$store.commit('teamWindowOverlayRect', null)

        if (this.isFTE) {
          this.$popper.hideAll()

          this.datalist = [
            {
              name: 'Test Caller',
              avatar: 'avatar-nobody.svg',
              speeddial: `Work: +1 571 127 0102`,
              sub: 'Work: +1 571 127 0102',
              type: 1,
              dir: 'out',
              date: '01:11 PM',
              dur: '1h 3m 31s',
            }
          ]
        }
      }
    },

    searchcontent(newVal) {
      if (newVal) {
        const popername = 'calling-search-result'
        this.$popper.hide(popername);
        this.$popper.show (
          searchResult,
          {
            width: `${this.$refs.searchinput.$el.getBoundingClientRect().width}px`,
            keyword: this.searchcontent,
            layout: 'widget',
            showInputNumber: true,
            onCall: this.showCallWidget,
          }, // component props
          {
            name: popername,
            reference: this.$refs.searchinput.$el,
            transitionEnabled: false,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            frameless: false,
            borderRadius: '12px',
            appendToBody: false,
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
            closed: () => {
            },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

    teamsNavTo(opt) {
      const tab = opt.tab;
      if (tab === 'recents') {
        this.selectTab(0);
      } else if (tab === 'voicemail') {
        this.selectTab(1);
      }
      setTimeout(() => {
        this.leaveTab();
      },500);
    },
  },
  methods: {
    random(l, h) {
      return _.random(l, h);
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
              modifiers: opt.modifiers || [],
            },
          }, // popper props
          {
            opened: () => { },
            closed: () => { },
          } // popper eventlistener
        );
    },

    showCoachmarkStep1() {
      this.showCoachmark({
          name: 'start-making-calls-coachmark',
          closable: true,
          icon: null,
          title: 'Start making calls here!',
          content: `You can dial a number or call someone you know from here.`,
          subtext: '1 of 3',
          reference: this.$refs.searchinput.$el,
          closeTrigger: '',
          placement: `right`,
          button: {
            label: `Next`,
            func: () => {
              this.showCoachmarkStep2()
            },
          },
        })
    },
    showCoachmarkStep2() {
      this.showCoachmark({
          name: 'access-phone-settings-coachmark',
          closable: true,
          icon: null,
          title: 'Access your phone settings here',
          content: `Manage and see your current phone status and settings like call forwarding.`,
          subtext: '2 of 3',
          reference: document.getElementById('teams-header-l-avatar'),
          closeTrigger: '',
          placement: `bottom`,
          button: {
            label: `Next`,
            func: () => {
              this.showCoachmarkStep3()
            },
          },
        })
    },
    showCoachmarkStep3() {
      this.showCoachmark({
          name: 'try-test-call-coachmark',
          closable: true,
          icon: null,
          title: 'Try a test call',
          content: `We'll create a fake call and walk you through how calling works in Webex 😉.`,
          subtext: '3 of 3',
          reference: this.$refs.btntestcall.$el,
          closeTrigger: '',
          placement: `bottom`,
          button: {
            label: `Done`,
            func: () => {
              
            },
          },
        })
    },

    tryTestCall() {
      this.$popper.hideAll()

      this.$store.commit('teamWindowOverlayRect', {
          clipmask: null,
        })
        
      const p = {
        name: 'Test Caller',
        avatar: 'avatar-nobody.svg',
        speeddial: `Work: +1 571 127 0102`,
        sub: 'Work: +1 571 127 0102',
      }
      this.startAudioCall({
            number: p.speeddial,
            people: p,
          })
      
      setTimeout(() => {
        this.showCoachmark({
          name: 'test-call-coachmark-1',
          closable: true,
          icon: null,
          title: 'Manage mic and speakers here',
          content: `Quickly change your mic and speaker inputs here`,
          subtext: '1 of 3',
          reference: document.getElementById('call-widget-audio-options'),
          closeTrigger: '',
          placement: `bottom`,
          button: {
            label: `Next`,
            func: () => {
              this.showCoachmarkCallStep2()
            },
          },
        })
        
      }, 800)    
    },

    showCoachmarkCallStep2() {
      this.showCoachmark({
          name: 'test-call-coachmark-2',
          closable: true,
          icon: null,
          title: 'Easily turn on video',
          content: `Click here to switch to a video call experience. `,
          subtext: '2 of 3',
          reference: document.getElementById('btn-widget-video-call'),
          closeTrigger: '',
          placement: `bottom`,
          button: {
            label: `Next`,
            func: () => {
              this.showCoachmarkCallStep3()
            },
          },
        })
    },

    showCoachmarkCallStep3() {
      this.showCoachmark({
          name: 'test-call-coachmark-3',
          closable: true,
          icon: null,
          title: 'Remove background noise for the caller',
          content: `Hear something in the callers background. Click here to turn on or off noise removal to minimize distractions`,
          subtext: '3 of 3',
          reference: document.getElementById('btn-remove-noise'),
          closeTrigger: '',
          placement: `top`,
          button: {
            label: `Done`,
            func: () => {
              //
            },
          },
        })
    },











    getSpeedDialMenuItems(pname) {
      let spdnum = this.getPeopleSpeedDialNumbers(pname)
      let list = [];
      if(spdnum.length === 0){
        list = {
            label: 'Add to speed dial',
            value: 'add-speed-dial',
          }
      } else {
        list = {
            label: 'Manage speed dials',
            ref: 'managespeeddials',
            level: 1,
            sub: [
              {
                label: 'Add new speed dial',
                value: 'add-speed-dial',
                disabled: spdnum.length >= 2,
              },
            ],
          }
        for(let i=0; i<spdnum.length; i++){
          list.sub.push({
            label: spdnum[i],
            ref: spdnum[i].replace(/[^0-9a-z]+/gi,''),
            level: 2,
            sub: [
              {
                label: 'Edit speed dial',
                value: 'edit-speed-dial',
                data: spdnum[i],
              },
              {
                label: 'Remove from speed dials',
                value: 'remove-speed-dial',
                data: spdnum[i],
              },
            ],
          })
        }
        if (spdnum.length >= 2) {
          list.sub.push({
            label: 'Call on Webex',
            ref: 'callonwebex',
            level: 2,
            sub: [
              {
                label: 'Edit speed dial',
              },
              {
                label: 'Remove from speed dials',
              },
            ],
          })
        }
      }
      return list
    },
    getPeopleSpeedDialNumbers(pname) {
      var pl = this.speedDialPeopleList.slice();
      var nums = pl.reduce(
        (arr, itm) => {
          if (itm.name === pname) {
            arr.push(itm.speeddial);
          }
          return arr;
        },
        []
      );
      return nums;
    },
    
    onSearchFocus() {
      this.focus = true;
    },
    onSearchBlur() {
      this.focus = false;
    },
    onSearchInput(){
      const val = this.$refs.searchinput.currentValue;
      this.searchcontent = val;
    },
    clearInput() {
      this.searchcontent = '';
    },
    
    showIncomingCallToast() {
      var layout = 'widget'
      var info = this.callingPeopleItems[layout][0];
      var ppp = info && info.people.name !== 'Sarah Robertson' ? this.datalist[2] : this.datalist[4]

      var peopleName = ppp.name
      var number = ppp.sub
      this.$eventBus.$emit('incoming-call-toast', peopleName, number, layout)
    },

    onAppResizing(obj) {
      this.shrink = obj.shrink;
      const prevsts = this.onecolumn;
      this.onecolumn = obj.width < 600;

      if (prevsts && !this.onecolumn) {
        requestAnimationFrame(() => {
          this.selectTab1(0);
        });
      }

      const w1 = 870;
      const w2 = 750;
      if (obj.width > w1) {
        this.columnwidth = '356px';
      } else if (obj.width < w2){
        this.columnwidth = '290px';
      }else {
        var maxw = 356;
        var minw = 290;
        this.columnwidth = `${minw + (maxw - minw) * ((obj.width - w2)/(w1 - w2))}px`;
      }

      if (this.onecolumn) {
        this.leftActiveTabId = 0;

        var config = _.cloneDeep(this.teamsNavPageConfig);
        if (!config[this.teamsNav]) {
          config[this.teamsNav] = {}
        }
        config[this.teamsNav].leftActiveTabId = this.leftActiveTabId;
        this.$store.commit('teamsNavPageConfig',  config)
        

        this.dialpadVisible = false;
      }

      if (this.$refs.scrollbar) {
        this.$refs.scrollbar.update();
      }
      if (this.$refs.scrollbarsd) {
        this.$refs.scrollbarsd.update();
      }
      if (this.$refs.scrollbarpad) {
        this.$refs.scrollbarpad.update();
      }
    },
    toggleDialpad() {
      this.dialpadVisible = !this.dialpadVisible;
      this.$refs.searchinput.input.focus();
    },
    dialpadPress(e, num) {
      e.preventDefault();
      this.$refs.searchinput.input.focus();
      this.searchcontent += `${num}`;
    },








    dragover(evt) {
      evt.preventDefault();
    },
    
    speedDialItemMousedown(e) {
      this.mouseTarget = e.target;
    },
    speedDialItemDragstart(evt, item) {
      const dragarea = document.querySelector(`#spd-list-item-${item.id} .dragarea`);
      const dragavatar = document.querySelector(`#spd-list-item-${item.id} .dragavatar`);
      if (dragarea.contains(this.mouseTarget) || dragavatar.contains(this.mouseTarget)) {
        this.isDragging = true

        document.addEventListener('dragover', this.dragover);

      } else {
        evt.preventDefault();
      }
    },
    speedDialItemDrag(evt, item, idx) {
      if (!this.dragItem) {
        this.dragItem = _.cloneDeep(item)
        this.dragIdx = idx
      }
      //
      //const itemW = 102
      //const itemH = 108
      
      /*
      const p = {
        x: evt.pageX - itemW/2,
        y: evt.pageY + itemH/2,
      }
      */
      const p = {
        x: evt.pageX,
        y: evt.pageY,
      }

      if (p.x === 0 && p.y === 0) {
        return // 不处理拖动最后一刻X和Y都为0的情形
      }
      
      var plist = this.speedDialPeopleList.slice();
      var itm, i, len, insertAt;
      var placeholderIdx;
      len = plist.length;
      for( i=len-1; i>=0; i--){
        itm = plist[i];
        if (itm.id === this.dragItem.id) {
          placeholderIdx = i
          break;
        }
      }

      for(i=0; i<len; i++){
        itm = plist[i];
        if (itm.id !== this.dragItem.id) {
          const elem = document.getElementById(`spd-list-item-${itm.id}`);
          if (elem) {
            const obj = elem.getBoundingClientRect();
            var rect = {
              width: obj.width,
              height: obj.height,
              left: obj.left,
              top: obj.top,
              right: obj.right,
              bottom: obj.bottom,
            };
            var rect1 = _.cloneDeep(rect);
            var rect2 = _.cloneDeep(rect);

            // left half
            rect1.width = rect.width/2;
            rect1.right = rect.right - rect.width/2;

            // right half
            rect2.width = rect.width/2;
            rect2.left = rect.left + rect.width/2;

            if (this.$pointInRect(p, rect1)) {
              insertAt = i
              break;
            } else if (this.$pointInRect(p, rect2)) {
              insertAt = i+1
              break;
            }
          }
        }
      }

      

      if (insertAt >= 0 && this.prevInsertAt !== insertAt) {
        if (insertAt <= placeholderIdx) {
          placeholderIdx++
        }
        plist.splice(insertAt, 0, this.dragItem);
        plist.splice(placeholderIdx, 1);

        this.$store.commit('speedDialPeopleList', plist);
        this.prevInsertAt = insertAt
      }
      
    },
    speedDialItemDragend() {
      this.isDragging = false
      this.dragItem = null
      this.prevInsertAt = -1;

      document.addEventListener('mousemove', this.docmousemovehandler);

      document.removeEventListener('dragover', this.dragover);
    },

    docmousemovehandler() {
      this.dragIdx = null;
      document.removeEventListener('mousemove', this.docmousemovehandler);
    },


    showMore(people) {
      let menu = {};
      const namekey = people.id;
      this.$popper.show(
        contextMenu,
        {
          items: [
            {
              label: 'Edit',
              callback: () => {
                this.editItem(people)
              },
            },
            {
              label: 'Remove from speed dial',
              callback: () => {
                this.deleteItem(people)
              },
            },
            {
              label: 'View profile',
              callback: () => {
                this.$store.commit('activeContactId', `${people.name.replace(/ /g, '_')}`);
                this.$store.commit('teamsNav', 'contacts');
              },
            },
          ],

        }, // component props
        {
          name: 'contextmenu',
          reference: document.querySelector(`.btnmore_${namekey}`),
          closeTrigger: 'mousedown',
          arrowVisible: true,
          roundedCorner: true,
          borderRadius: '12px',
          appendToBody: true,
          theme: `${this.theme} ${this.themeColor}`,
          options: {
            placement: 'bottom',
          },
        }, // popper props
        {
          opened: () => {
            menu[namekey] = true;
            this.moremenuOpened = menu;
          },
          closed: () => {
            menu[namekey] = false;
            this.moremenuOpened = menu;

          },
        } // popper eventlistener
      );
    },

    onSpeedDialContextmenu(evt, item) {
      const rectBtn = evt.target.getBoundingClientRect();
      const popperOffsets = {
          x: evt.pageX - rectBtn.left,
          y: evt.pageY - rectBtn.bottom,
      };
      this.$popper.hide('contextmenu');
      this.$popper.show(
          contextMenu,
          {
            items: [
              {
                label: 'Edit',
                callback: () => {
                  this.editItem(item)
                },
              },
              {
                label: 'Remove from speed dial',
                callback: () => {
                  this.deleteItem(item)
                },
              },
              {
                label: 'View profile',
                callback: () => {
                  this.$store.commit('activeContactId', `${item.name.replace(/ /g, '_')}`);
                  this.$store.commit('teamsNav', 'contacts');
                },
              },
            ],

          }, // component props
          {
            name: 'contextmenu',
            reference: evt.target,
            transitionEnabled: false,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {
              placement: 'bottom-start',
              modifiers: [
                {
                  name: 'flip',
                  enabled: true,
                },
                {
                  name: 'offset',
                  options: {
                    offset: [popperOffsets.x, popperOffsets.y],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.contextMenuId = item.id },
            closed: () => { this.contextMenuId = null },
          } // popper eventlistener
        );

    },

    showMoreMenu(evt, item) {
      evt.stopPropagation();

      if (this.activeItemName === item.name) {
        this.activeItemName = null;
        this.$popper.hideAll();
        return;
      }
      
      this.$popper.hide('contextmenu');
      this.$popper.show(
        contextMenu,
        {
          items: this.contextMenuItems[item.type], //this.contextMenuItems[item.type].concat([this.getSpeedDialMenuItems(item.name)]),
          onSelect: (itm) => { 
            let people = {...item, ...{speeddial:itm.data}};
            if (itm.value === 'add-speed-dial') {
              this.addSpeedDial(item.name);
            } else if (itm.value === 'edit-speed-dial') {
              this.editItem(people);
            } else if (itm.value === 'remove-speed-dial') {
              this.deleteItem(people);
            }
          },
        }, // component props
        {
          name: 'contextmenu',
          reference: evt.currentTarget,
          affiliatedElementSelector: ['[name="contextmenu"]', '[name="contextmenu-level1"]', '[name="contextmenu-level2"]'],
          transitionEnabled: false,
          closeTrigger: 'mousedown',
          arrowVisible: true,
          roundedCorner: true,
          borderRadius: '12px',
          appendToBody: true,
          theme: `${this.theme} ${this.themeColor}`,
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
          opened: () => {this.activeItemName = item.name},
          closed: () => {this.activeItemName = null},
        } // popper eventlistener
      );
    },

    onCallItemContextmenu(evt, item) {
      const rectBtn = evt.target.getBoundingClientRect();
      const popperOffsets = {
          x: evt.pageX - rectBtn.left,
          y: evt.pageY - rectBtn.bottom,
      };

      this.$popper.hide('contextmenu');
      this.$popper.show(
          contextMenu,
          {
            items: this.contextMenuItems[item.type].concat([this.getSpeedDialMenuItems(item.name)]),
            onSelect: (itm) => { 
              let people = {...item, ...{speeddial:itm.data}};
              if (itm.value === 'add-speed-dial') {
                this.addSpeedDial(item.name);
              } else if (itm.value === 'edit-speed-dial') {
                this.editItem(people);
              } else if (itm.value === 'remove-speed-dial') {
                this.deleteItem(people);
              }
            },
          }, // component props
          {
            name: 'contextmenu',
            reference: evt.target,
            affiliatedElementSelector: ['[name="contextmenu"]', '[name="contextmenu-level1"]', '[name="contextmenu-level2"]'],
            transitionEnabled: false,
            closeTrigger: 'mousedown',
            arrowVisible: false,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            options: {
              placement: 'bottom-start',
              modifiers: [
                {
                  name: 'flip',
                  enabled: true,
                },
                {
                  name: 'offset',
                  options: {
                    offset: [popperOffsets.x, popperOffsets.y],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.contextMenuId = item.name.replace(/ /g, '_') },
            closed: () => { this.contextMenuId = null },
          } // popper eventlistener
        );

    },

    
    deleteItem(people) {
      const sd = this.speedDialPeopleList.slice();
      for(var i=sd.length-1; i>=0; i--){
        if (sd[i].speeddial === people.speeddial) {
          sd.splice(i, 1);
          this.$store.commit('speedDialPeopleList', sd)
          break;
        }
      }
    },
    editItem(people) {
      this.$modal.show(
        popSpeedDialAdd,
        {
          editpeople: people,
        }, // component props
        {
          name: 'speeddial-add-people',
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: '#pop-speed-dial-add .head',
          roundedCorner: false,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          width: 400,
          height: 360,
          transition: true,
        }, // modal props
        {} // modal eventlistener
      );
    },
    addSpeedDial(name) {
      this.$modal.show(
        popSpeedDialAdd,
        {
          peoplename: name,
          onAdd: () => {
            this.selectTab1(1);
          },
        }, // component props
        {
          name: 'speeddial-add-people',
          clickToClose: false,
          frameless: false,
          shadow: true,
          resizable: false,
          resizeEdges: ['br', 'b', 'r'],
          draggable: '#pop-speed-dial-add .head',
          roundedCorner: false,
          overlayVisible: true,
          overlayTransparent: 0,
          theme: this.theme,
          width: 400,
          height: 360,
          transition: true,
        }, // modal props
        {} // modal eventlistener
      );

    },
    startAudioCall(info) {
      var layout = 'widget';
      var incall = _.cloneDeep(this.callingPeopleItems);
      var ppp = this.$store.getters.people(info.people.name)
      var ppl = _.merge(info.people, ppp)
      ppl.callasIndex = this.callAs.id
      info.people = ppl
      
      var list = incall[layout]
      if (list.length < 2) {
        var i, itm
        for (i=0; i<list.length; i++) {
          itm = list[i];
          if (itm.people.name === info.people.name) {
            return;
          }
        }
        for (i=0; i<list.length; i++) {
          itm = list[i];
          if (!itm.incoming) {
            itm.onhold = true
          }
        }
        list.push(info);
        incall[layout] = list;
        this.$store.commit('callingPeopleItems', incall);
      }

      this.showCallWidget(layout);

    },


    hoverTab1(id) {
      this.moveTabBg1(id);
    },
    leaveTab1() {
      this.moveTabBg1(this.leftActiveTabId);
    },
    selectTab1(id) {
      this.leftActiveTabId = id;
      this.moveTabBg1(id);

      var config = _.cloneDeep(this.teamsNavPageConfig);
      if (!config[this.teamsNav]) {
        config[this.teamsNav] = {}
      }
      config[this.teamsNav].leftActiveTabId = this.leftActiveTabId;
      this.$store.commit('teamsNavPageConfig',  config)

    },
    moveTabBg1(id) {
      const rect = document.querySelector(`.teams-2nd-calling-tab${id}`).getBoundingClientRect();
      const rect2 = document.querySelector(`.teams-2nd-calling-tabs`).getBoundingClientRect();
      document.querySelector(`.teams-2nd-calling-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
      document.querySelector(`.teams-2nd-calling-tab-active-bg`).style.width = `${rect.width}px`;
    },




    hoverTab(id) {
      this.moveTabBg(id);
    },
    leaveTab() {
      this.moveTabBg(this.activeTabId);
    },
    selectTab(id) {
      this.activeTabId = id;
      this.moveTabBg(id);
      if(this.$refs.scrollbar){
        this.$refs.scrollbar.scrollToY(0, true);
      }
    },
    moveTabBg(id) {
      const rect = document.querySelector(`.space-content-tab${id}`).getBoundingClientRect();
      const rect2 = document.querySelector(`.space-content-tabs`).getBoundingClientRect();
      document.querySelector(`.space-content-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
      document.querySelector(`.space-content-tab-active-bg`).style.width = `${rect.width}px`;
    },


    contactCardTemplate(name) {
      return this.$store.getters.contactCardTemplate(name, false);
    },
    toggleItem(item) {
      const content = this.datalist.slice();
      for(let i=0; i<content.length; i++) {
        let m = content[i];
        if (m.name === item.name ){
          if (m.multi !== undefined || m.type === 2) {
            if (!m.exp) {
              content[i].exp = true;
            } else {
              content[i].exp = false;
            }
          }
          this.datalist = content;
          break;
        }
      }
    },
    playVoicemail(e, item) {
      e.stopPropagation();

      const content = this.datalist.slice();
      for(let i=0; i<content.length; i++) {
        let m = content[i];
        if (m.name === item.name ){
          content[i].unread = false;
          content[i].playing = !content[i].playing;
          this.datalist = content;

          //
          let vd = _.cloneDeep(this.voicemailPlayData);
          if (vd[m.name] === undefined) {
            vd[m.name] = {
              val: 5,
              time: '00:00',
            };
          }
          this.voicemailPlayData = vd;
          this.playVoicemail2(m.name);
          break;
        }
      }
    },
    stopVoicemail(name) {
      const content = this.datalist.slice();
      for(let i=0; i<content.length; i++) {
        let m = content[i];
        if (m.name === name ){
          content[i].playing = false;
          this.datalist = content;
          break;
        }
      }
    },
    playVoicemail2(name) {
      let vd = _.cloneDeep(this.voicemailPlayData);
      const total = 12;
      setTimeout(() => {
        if (vd[name].val < 95) {
          vd[name].val += 1;
          const val = vd[name].val;
          let sec = Math.round((val - 5)/(95 - 5) * total);
          if (sec < 10) {
            sec = `0${sec}`;
          }
          vd[name].time = `00:${sec}`;
          
          this.playVoicemail2(name);
        } else {
          vd[name] = {
            val: 5,
            time: '00:00',
          };
          this.stopVoicemail(name);
        }
        this.voicemailPlayData = vd;
        
      }, 0);
    },


    stopPropagation(e) {
      e.stopPropagation();
    },

    showCallWidget(layout='widget', people) {
      let name = 'Sarah Robertson'
      let ppp = people ? people : this.$store.getters.people(name)
      var peopleName = ppp.name
      var number = ppp.sub
      this.$eventBus.$emit('show-call-widget', layout, {peopleName, number})

    },

    showFilter(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.filterItemMenuVisible) {
        this.$popper.show(
          {
            template: `
              <div class="common-menulist" style="width:280px;">
                <div v-for="(itm, idx) in filterItemList"
                  :key="idx"
                  :class="{
                    'common-menulist-item': itm.label!=='divider',
                    'common-menulist-divider': itm.label=='divider',
                  }" 
                  style="padding-left: 8px;"
                  @click="close(itm)"
                >
                  <div v-if="itm.iconVisible" style="width:40px;">
                    <wl-icon :name="itm.icon" :color="itm.color" />
                  </div>
                  <div v-if="itm.label!=='divider'" class="lb">
                    <div class="line1">{{itm.label}}</div>
                    <div v-if="itm.sub" class="line2">{{itm.sub}}</div>
                  </div>
                  <svg v-if="selected.label === itm.label" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                  </svg>
                </div>

              </div>
            `,
            props: ['filterItemList', 'selected', 'onSelect'],
            methods: {
              close(itm) {
                this.$popper.hideAll();
                this.onSelect(itm);
              },
            }
          },
          {
            filterItemList: this.filterItemList,
            selected: this.filterItem,
            onSelect: (itm) => {
              this.filterItem = itm
            },
          }, // component props
          {
            reference: this.$refs.iconfilter,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            options: {
              placement: 'bottom',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.filterItemMenuVisible = true },
            closed: () => { this.filterItemMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

    showForwardCalls(e) {
      e.preventDefault()
      e.stopPropagation()

      if (!this.forwardCallsToMenuVisible) {
        this.$popper.show(
          {
            template: `
              <div class="common-menulist" style="width:280px;">
                <div class="common-menulist-section-title">
                  <wl-icon name="call-forward-settings-bold" size="16" style="margin-right:8px" />
                  Forward calls to
                </div>
                <div v-for="(itm, idx) in forwardCallsToItemList"
                  :key="idx"
                  :class="{
                    'common-menulist-item': itm.label!=='divider',
                    'common-menulist-item-48': itm.label!=='divider',
                  }" 
                  style="padding-left: 8px;"
                  @click="close(itm)"
                >
                  <div class="lb">
                    <div class="line1">{{itm.label}}</div>
                    <div v-if="itm.sub" class="line2">{{itm.sub}}</div>
                  </div>
                  <svg v-if="selected.label === itm.label" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z" fill="#64B4FA"/>
                  </svg>
                </div>

              </div>
            `,
            props: ['forwardCallsToItemList', 'selected', 'onSelect'],
            methods: {
              close(itm) {
                this.$popper.hideAll();
                this.onSelect(itm);
              },
            }
          },
          {
            forwardCallsToItemList: this.forwardCallsToItemList,
            selected: this.forwardCallsTo,
            onSelect: (itm) => {
              this.forwardCallsTo = itm
              if (itm.sub) {
                let opt = {
                  visible: true,
                  icon: 'call-forward-settings-filled',
                  content: `Call forwarding to: +1 456 566 1200`,
                  button: {
                    label: 'Dismiss',
                  },
                  closeButtonVisible: false,
                }
                this.$store.commit('teamsAlertbanner', opt);
              }
            },
          }, // component props
          {
            reference: this.$refs.btnforwardcalls,
            closeTrigger: 'mousedown',
            arrowVisible: true,
            roundedCorner: true,
            borderRadius: '12px',
            appendToBody: true,
            theme: `${this.theme} ${this.themeColor}`,
            backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
            options: {
              placement: 'bottom',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            },
          }, // popper props
          {
            opened: () => { this.forwardCallsToMenuVisible = true },
            closed: () => { this.forwardCallsToMenuVisible = false },
          } // popper eventlistener
        );
      } else {
        this.$popper.hideAll();
      }
    },

  },
};
</script>

<style lang="scss">
.team-calling {
  display: flex;
  flex-grow: 1;
  border-radius: 12px 0px 0px 0px;
  height: 100%;

  .spacer {
    flex-grow: 1;
  }
  

  &.onecolumn {
    flex-direction: column;
    overflow: hidden;

    .teams-2nd-calling {
      min-width: auto;
      width: auto;
      flex-grow: 1;
      border-radius: 12px 12px 0 0;

      &-title {
        flex-direction: row;
        align-items: center;

        .no {
          display: flex;
          flex-grow: 1;
          justify-content: flex-end;
          font-size: 14px;
          font-weight: normal;
          opacity: .7;
          margin-right: 16px;
        }
      }

      &-line2 {
        margin-right: 16px;
      }
      &-dialgrp {

        .searchrow .right .btndialpad {
          display: flex;
        }
        .teams-2nd-calling-tabs {
          display: none;
        }

        .teams-2nd-calling-speeddial {
          min-height: 220px;
          margin-top: 8px;

          .teams-2nd-calling-speeddial-empty .img {
            width: 90px;
            height: 90px;
          }
        }

      }

    }

    .calling-details {
      margin-top: -22px;
      background: none !important;
      margin-left: 0;
    }
  }


  .teams-2nd-calling {
    display: flex;
    flex-direction: column;
    position: relative;
    
    flex-shrink: 0;
    overflow: hidden;
    width: 356px;
    min-width: 290px;
    user-select: none;
    border-radius: 12px 12px 0px 0px;

    &-title {
      display: flex;
      flex-direction: column;

      font-size: 20px;
      font-weight: 600;
      margin: 12px 0 2px 16px;

      .no {
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 12px;
      }
    }
    &-line2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 0 16px;
      
      .btn-widget {
        padding: 0 10px;
      }

    }

    &-dialgrp {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      margin: 10px 0 20px 0;
      flex-grow: 1;

      .searchrow {
        display: flex;
        align-items: center;
        margin: 0 16px;

        .left {
          @include flex;
          position: relative;
          flex-grow: 1;

          .searchinput {
            margin: 0;
            flex-grow: 1;

            .md-input {
              width: 100%;
              height: 32px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: normal;
              padding-left: 10px;
              color: rgba($color: white, $alpha: 0.95) !important;
              background-color: rgba($color: #000, $alpha: 1) !important;
              border: 1px solid rgba(255, 255, 255, 0.5) !important;

              &::placeholder {
                color: rgba(255, 255, 255, 0.7) !important;
              }
              &:hover {
                border-color: rgba($color: white, $alpha: 0.7) !important;
              }
              &:focus {
                border-color: rgba($color: white, $alpha: 0.9) !important;
                box-shadow: 0 0 0 3px $md-blue-50 !important;
              }
            }
          }
        }

        .right {
          display: flex;
          justify-content: center;
          align-items: center;

          .btnc {
            @include flex;
            width: 32px;
            height: 32px;
            box-sizing: border-box;
            border: 1px solid rgba($color: #fff, $alpha: .3);
            border-radius: 50%;
            transition: all .3s;
            margin-left: 8px;

            svg path {
              transition: all .3s;
              fill: #000000;
            }

            &:hover, &.active {
              background-color: rgba($color: #000000, $alpha: .95);
              svg path {
                fill: #FFFFFF;
              }
            }
          }

          .btndialpad {
            display: none;
          }
        }
      }
      

      .teams-2nd-calling-tabs {
        position: relative;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin: 12px 16px 0 16px;

        .teams-2nd-calling-tab-active-bg {
          position: absolute;
          height: 28px;
          top: 0;
          left: 0;
          border-radius: 14px;
          background-color: rgba($color: #FFFFFF, $alpha: .2);
          pointer-events: none;
        }

        .btn {
          height: 28px;
          border-radius: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 12px;
          margin-right: 8px;
          pointer-events: auto;

          .lb {
            font-size: 14px;
            opacity: 0.7;
            transition: all 0.3s ease;
            pointer-events: none;
          }

          &:hover {
            .lb {
              opacity: 0.9;
            }
          }

          &.active {
            .lb {
              opacity: 0.9;

            }
          }
        }

        .badge {
          height: 18px;
          min-width: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: $md-blue-60;
          border-radius: 9px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.95);
          margin-right: 4px;
        }

        .btn-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          .disabled {
            opacity: .4;
          }

          &:hover {
            background-color: rgba($color: white, $alpha: 0.07);
          }
          &:active {
            background-color: rgba($color: white, $alpha: 0.1);
          }
        }

      }


      






      .teams-2nd-calling-speeddial-accheader {
        font-size: 16px;
        font-weight: normal;
        color: rgba(255, 255, 255, 0.7);
        margin: 16px 0 0 16px;
      }

      .teams-2nd-calling-speeddial {
        display: flex;
        flex-direction: row;
        flex-shrink: 1;
        flex-grow: 1;
        width: 100%;
        height: 100px;
        user-select: none;
        transition: opacity .3s;
        margin-top: 20px;

        .scrollcont {
          display: flex;
          flex-direction: row;
          justify-content: center;
        }

        &-head {
          height: 32px;
          margin-top: 12px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          margin-bottom: 8px;

          .tt {
            margin-left: 8px;
            opacity: .7;
          }
          .add {
            padding: 0 10px !important;
            min-width: 10px;
            margin-right: 16px;
          }
        }
        
        $item-width: 102px;

        &-list {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, $item-width);
          grid-gap: 0;
          justify-content: center;
          padding: initial;

          .invisibleitem {
            pointer-events: none;
          }
          
          .listitm {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: $item-width;
            height: 108px;
            border-radius: 8px;
            margin: 0 1px 4px 1px;
            text-align: center;
            transform: translate(0, 0); /* remove drag image background */

            .bg {
              position: absolute;
              display: none;
              width: 100%;
              height: 100%;
              border-radius: 8px;
              opacity: .07;
              background-color: #000000;
              pointer-events: auto;
              cursor: grab;

              &:active, &.active {
                opacity: .11;
                cursor: grabbing;
              }
            }

            &.noactive {
              &:hover, &:active {
                background-color: transparent !important;
              }
              .dragarea {
                display: none !important;
              }
            }

            &.placeholder {
              background-color: rgba(0, 0, 0, 0.5) !important;
            }

            .btnmore {
              display: none;
              position: absolute;
              justify-content: center;
              align-items: center;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              top: 2px;
              right: 2px;
              box-sizing: border-box;
              border: none;
              
              svg {
                pointer-events: none;
              }

              &:hover {
                background: rgba(255, 255, 255, 0.07);
              }
              &:active, &.active {
                background: rgba(255, 255, 255, 0.2);
              }
              
            }

            .avatar {
              width: 48px;
              height: 48px;
              pointer-events: auto;
              z-index: 10;
              cursor: grab;
            }
            .name {
              font-size: 14px;
              max-width: 103px;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
              pointer-events: none;
            }
            .type {
              margin-top: -3px;
              font-size: 12px;
              opacity: .7;
              pointer-events: none;
            }
            .ctrl {
              display: none;
              position: absolute;
              justify-content: center;
              align-items: center;
              width: 100px;
              height: 36px;
              bottom: 8px;
              pointer-events: none;

              .btn {
                @include flex;
                flex-shrink: 0;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                margin: 0 4px;
                pointer-events: auto;

                &.btn-green {
                  background-color: $md-green-60;
                }

                &.btn-outline {
                  min-width: 0;

                  svg path {
                    fill: #000000;
                  }
                }

                &:hover {
                  &.btn-green {
                    background-color: $md-green-70;
                  }
                }
                &:active {
                  &.btn-green {
                    background-color: $md-green-80;
                  }
                }
              }

            }

            &:hover {
              .bg {
                display: flex;
              }
              
              .name {
                opacity: 0;
              }
              .type {
                opacity: 0;
              }
              .ctrl {
                display: flex;
              }
              .btnmore {
                display: flex;
              }
            }
            &.active {
              .bg {
                display: flex;
              }
              .btnmore {
                display: flex;
              }
            }
            

            .btn-add {
              @include flex;
              width: 52px;
              height: 52px;
              border: 1px solid rgba(255, 255, 255, 0.3);
              border-radius: 26px;
              box-sizing: border-box;

              &:hover, &:active {
                background: rgba(255, 255, 255, 0.07);
              }
            }

            .add-label {
              display: flex;
              font-size: 14px;
              opacity: .7;
              height: 48px;
              padding-top: 8px;
            }
          }
        }

        &-empty {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 75%;
          flex-grow: 1;
          max-width: 320px;

          .img {
            width: 120px;
            height: 120px;
            background-image: url(~@/assets/img/empty-state-speed-dial.svg);
            background-repeat: no-repeat;
            background-size: contain;
            margin-bottom: 20px;
          }

          .title {
            font-weight: 700;
            font-size: 16px;
            opacity: .95;
            line-height: 24px;
            margin-bottom: 5px;
          }
          .des {
            font-size: 14px;
            opacity: .7;
          }

          .btn {
            font-weight: 600;
            font-size: 16px;
            padding: 0 12px;
          }
        }

      }
      .max-speed-dials {
        display: flex;
        justify-content: flex-end;
        font-style: italic;
        font-size: 12px;
        opacity: .7;
        margin-right: 18px;
      }

      .teams-2nd-calling-searchresult {
        width: 100%;

        &.short {
          height: calc(100% - 58px - 455px);
        }
        
        &-list {
          margin-right: 20px;

          &-res {
            width: 100%;
            height: 48px;
            display: flex;
            margin: 8px 0;
          }
          
          &-title {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 24px;
            opacity: 0.7;
            font-size: 12px;
            font-weight: 600;
            padding: 2px 0 0 12px;
          }

          &-more {
            height: 24px;
            font-size: 12px;
            padding: 2px 0 0 12px;
            font-weight: 600;
            text-decoration: underline;
            color: $text-color-hyperlink-light-ui;
            margin-bottom: 16px;
          }
        }
      }

      .teams-2nd-calling-dialpad {
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        flex-grow: 1;
        width: 100%;
        height: 100px;
        margin-top: 28px;

        .scrollcont {
          display: flex;
          flex-direction: column;
        }
        .dialpad {
          align-self: center;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          width: 240px;
          user-select: none;
        }

        .num {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin: 0 8px 16px 8px;

          &:hover {
            background-color: rgba($color: #000000, $alpha: .07);
          }
          &:active {
            background-color: rgba($color: #000000, $alpha: .2);
          }

          .t1 {
            font-size: 26px;
            line-height: 24px;
          }
          .t2 {
            font-size: 14px;
            opacity: .7;
            height: 24px;
          }
        }

        .btns {
          @include flex;
          width: 100%;
          margin-top: 8px;

          .btn {
            @include flex;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background-color: $md-green-60;
            margin: 0 16px;

            &:hover {
              background-color: $md-green-70;
            }
            &:active {
              background-color: $md-green-80;
            } 
          }
        }
      }

    }


  }

  .forwardtorow {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;

    .forwardto {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      border-radius: 20px;
      padding: 0 8px;

      .lb {
        margin: 0 4px;
      }

      &:hover {
        background-color: rgba($color: #FFF, $alpha: .11);
      }
      &:active, &.active {
        background-color: rgba($color: #FFF, $alpha: .2);
      }
    }
  }


  .calling-details {
    height: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    user-select: none;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 12px 0px 0px 0px;
    margin-left: 4px;
    
    color: $text-color-primary-light-ui;

    .top {
      position: relative;
      width: calc(100% - 16px - 16px);
      height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 14px 0 12px 16px;

      .space-content-tabs {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        flex-grow: 1;

        .space-content-tab-active-bg {
          position: absolute;
          height: 28px;
          top: 0;
          left: 0;
          border-radius: 14px;
          background-color: rgba($color: #000000, $alpha: .1);
          pointer-events: none;
        }

        .btn {
          height: 28px;
          border-radius: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 12px;
          margin-right: 8px;
          pointer-events: auto;

          .lb {
            font-size: 14px;
            opacity: 0.7;
            transition: all 0.3s ease;
            pointer-events: none;
          }

          &:hover {
            .lb {
              opacity: 0.9;
            }
          }

          &.active {
            .lb {
              opacity: 0.9;

            }
          }
        }

        .badge {
          height: 18px;
          min-width: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: $md-blue-60;
          border-radius: 9px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.95);
          margin-right: 4px;
        }
      }

      .btn-circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .disabled {
          opacity: .4;
        }

        &:hover {
          background-color: rgba($color: white, $alpha: 0.07);
        }
        &:active {
          background-color: rgba($color: white, $alpha: 0.1);
        }
      }
    }

    .cont-wrap {
      display: flex;
      width: calc(100% - 4px);
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      height: 100px;

      .scrollcont {
        display: flex;
        flex-direction: column;
      }
    }


    .cont-list {
      display: flex;
      flex-direction: column;
      width: calc(100% - 8px - 20px);
      margin-left: 8px;

      .itm-call {
        display: flex;
        flex-direction: column;

        margin-bottom: 8px;
        border-radius: 8px;
        transition: all .2s ease;
        height: 48px;
        overflow: hidden;
        transform: rotate(0deg);

        &.grow .row1 .left{
          flex-grow: 1;
        }

        .row1 {
          position: relative;
          display: flex;
          align-items: center;
          height: 48px;
          flex-shrink: 0;
        }

        .row2 {
          display: flex;
          opacity: 0;
          flex-direction: column;
          margin: 4px 15px 8px 32px;
          padding: 10px 0  2px 0;
          border-top: 1px solid rgba($color: #000000, $alpha: .2);
          transition: all .2s ease;

          &.shrink {
            .subitm2 {
              flex-direction: column;

              .subitm-l {
                min-width: 0;
                padding-left: 0;
              }

              .subitm-m {
                margin-bottom: 8px;
              }
            }
          }

          .headtt {
            @include flex;
            margin-top: -4px;
            margin-bottom: 8px;

            .lft {
              font-size: 12px;
              flex-grow: 1;
            }
            .rgt {
              @include flex;
              flex-shrink: 0;

              .btnc {
                @include flex;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                margin-left: 8px;

                &:hover {
                  background-color: rgba($color: #FFF, $alpha: .07);
                }
                &:active {
                  background-color: rgba($color: #FFF, $alpha: .11);
                }
              }
            }
          }

          .subitm {
            display: flex;
            align-items: flex-start;
            height: 32px;
            
            &-l {
              display: flex;
              align-items: center;
              width: 43.4%;
              min-width: 134px;
              padding-left: 25px;
              font-size: 14px;

              .lev {
                margin-right: 4px;
                font-weight: 600;
              }

              .rw {
                display: flex;
                align-items: center;
              }

              .ico {
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                margin-right: 6px;
              }

              .lb{
                display: flex;
                align-items: center;
                overflow:hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
                
              }

              
            }
            &-m {
              flex-grow: 1;
              display: flex;
              align-items: center;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
              font-size: 14px;

              &.grow {
                flex-grow: 1;
                padding-left: 0;
                min-width: 0;
              }
            }
            &-r {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              font-size: 14px;
            }
          }

          .subitm2 {
            min-height: 0;
            height: auto;

            .subitm-l {
              flex-shrink: 0;
              flex-grow: 0;
              width: 20%;
              padding-left: 0;
              opacity: .7;
            }
            .subitm-m {
              overflow: visible;
              white-space: normal;
              text-overflow: clip;
              opacity: .95;
              flex-wrap: wrap;

              .tag {
                @include flex;
              }

              .ico {
                margin-right: 3px;
              }
              .divid {
                margin: 0 6px;
              }
            }
            .subitm-r {
              flex-shrink: 0;
              flex-grow: 0;
              
            }
          }
        }

        .left {
          display: flex;
          align-items: center;
          width: 45%;

          .ico {
            @include flex;
            width: 16px;
            height: 16px;
            margin: 0 8px 0 10px;
            flex-shrink: 0;
          }

          .avatar {
            flex-shrink: 0;
            margin-right: 12px;
          }

          .txt {
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            flex-grow: 1;
            padding-right: 24px;

            .lb{
              font-size: 16px;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;

              &.unread {
                font-weight: bold;
              }
            }
            .lb2{
              display: flex;
              font-size: 14px;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
              margin-top: -4px;

              .tt {
                opacity: .7;
                overflow:hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
                max-width: 320px;
                width: 100px;
                flex-grow: 1;
              }

              .lev {
                margin-right: 4px;
                font-weight: 600;
              }
            }
          }
        }
        .mid {
          flex-grow: 1;
          display: flex;
          align-items: center;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          min-width: 210px;

          .rw {
            display: flex;
            align-items: center;
          }

          .ico {
            display: flex;
            align-items: center;
            margin-right: 6px;
          }

          .lb{
            display: flex;
            align-items: center;
            font-size: 15px;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
          }

          .lb2{
            display: flex;
            align-items: center;
            font-size: 12px;
          }

          .slider {
            width: 110px;
            margin: 0;

            .md-slider__bar {
              background-color: rgba($color: #000000, $alpha: .5);
            }
            .md-slider__pointer {
              top: -7px;
              width: 16px;
              height: 16px;
              margin-left: -8px;
            }
          }

          svg {
            display: flex;
            align-items: center;
          }
        }

        .right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-right: 12px;
          min-width: 120px;
          
          .txt {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;

            .lb{
              font-size: 12px;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
            }
            .lb2{
              font-size: 12px;
              opacity: .7;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
              margin-top: -2px;
            }

            .ico {
              display: none;
            }
          }

        }

        .buttons {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          justify-content: flex-end;
          align-items: center;
          flex-shrink: 0;
          padding: 8px 12px 8px 30px;
        }

        .btn {
          @include flex;
          min-width: 32px;
          margin-left: 8px;

          &.green {
            svg path {
              fill: #FFFFFF;
            }
          }

          &.md-button-solid {
            svg path {
              fill: #FFFFFF;
            }
          }
          &.md-button-outline {
            svg path {
              fill: #000000;
            }
          }
        }

        .mid svg, .right svg {
          path {
            fill: #000000;
            fill-opacity: .95;
          }

          &.red {
            path {
              fill: $textColor-error-lightUi;
              fill-opacity: .95;
            }
          }

          &.unread {
            path {
              fill: $md-blue-60;
              fill-opacity: 1;
            }
          }
        }

        .red {
          color: $textColor-error-lightUi;
          svg path{
            fill: $textColor-error-lightUi;
            fill-opacity: 1;
          }
        }

        .bold {
          font-weight: bold;
        }

        &:hover, &.active, &.exp {
          background: rgba($color: #000000, $alpha: 0.07);
          .left.gradientmask {
            mask: linear-gradient(to right, rgba($color: #000000, $alpha: 1.0) 40%, rgba($color: #000000, $alpha: 0.0) 70%);
            mask-repeat: no-repeat;
          }
          .left.gradientmask3btn {
            mask: linear-gradient(to right, rgba($color: #000000, $alpha: 1.0) 30%, rgba($color: #000000, $alpha: 0.0) 50%);
            mask-repeat: no-repeat;
          }
          .right {
            .txt {
              display: none;
            }
          }
          .buttons {
            display: flex;
          }
        }

        &:active, &.active, &.exp {
          background: rgba($color: #000000, $alpha: 0.11);
        }

        &.exp {
          height: auto;
          overflow: visible;

          .row2 {
            opacity: 1;
          }
        }
      }

    }

    .cont-list-empty {
      @include flex(column);
      flex-grow: 1;
      margin-bottom: 12%;

      .lb {
        margin: 20px 0;
      }

    }


  }


}




/* theme ----- dark/hybrid */
.dark, .hybrid {
  .teams-2nd-calling {
    &-dialgrp {

      .searchrow {
        .right {
          .btnc {
            svg path {
              fill: #FFFFFF;
            }

            &:hover, &.active {
              background-color: rgba($color: #FFFFFF, $alpha: .95);
              svg path {
                fill: #000000;
              }
            }
          }
        }
      }
      
    }

    .teams-2nd-calling-speeddial {
      &-list {

        .listitm {

          .bg {
            background-color: #FFFFFF;
          }

          .ctrl {
            .btn {
              &.btn-outline {
                svg path {
                  fill: #FFFFFF;
                }
              }
            }
          }
          
        }
      }
    }

    .teams-2nd-calling-searchresult {
      &-list {
        &-res {
          .left {
            .icon {
              background-color: rgba(255, 255, 255, .3);
            }
          }
        }
        &-more {
          color: $text-color-hyperlink-dark-ui;
        }
      }
    }

    .teams-2nd-calling-dialpad {
      .num {
        &:hover {
          background-color: rgba($color: #FFFFFF, $alpha: .07);
        }
        &:active {
          background-color: rgba($color: #FFFFFF, $alpha: .2);
        }
      }
    }
    

  }
}


.dark {
  .calling-details {
    color: $text-color-primary-dark-ui;

    .top {
      .space-content-tabs {

        .space-content-tab-active-bg {
          background-color: rgba($color: #FFFFFF, $alpha: .1);
        }

        .badge {
          background: $md-blue-60;
          color: rgba($color: #FFFFFF, $alpha: .95);
        }
      }
    }

    .cont-list {

      .itm-call {

        .row2 {
          border-top: 1px solid rgba($color: #FFFFFF, $alpha: .2);
        }

        .mid {
          .slider {
            .md-slider__bar {
              background-color: rgba($color: #FFFFFF, $alpha: .5);
            }
          }
        }

        .btn {
          &.md-button-solid {
            svg path {
              fill: #000000;
            }
          }
          &.md-button-outline {
            svg path {
              fill: #FFFFFF;
            }
          }
        }

        .mid svg, .right svg {
          path {
            fill: #FFFFFF;
          }
          &.red {
            path {
              fill: $textColor-error-darkUi;
              fill-opacity: .95;
            }
          }
          &.unread {
            path {
              fill: $md-blue-40;
            }
          }
        }

        .red {
          color: $textColor-error-darkUi;
          svg path{
            fill: $textColor-error-darkUi;
          }
        }

        &:hover {
          background: rgba($color: #FFFFFF, $alpha: 0.07);
        }
        &:active, &.active, &.exp {
          background: rgba($color: #FFFFFF, $alpha: 0.11);
        }
      }
      
    }

  }
}


</style>

