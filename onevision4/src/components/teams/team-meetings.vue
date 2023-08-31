<template>
  <div 
    class="teams-meetings" 
    :class="theme === 'dark' ? 'dark' : 'light'"
    :style="{
      background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
      borderTopRightRadius: teamsSidecarName && !gptPanelPopouted || meetingsSidecarVisible ? '12px' : '0',
    }"
  >


      <wl-alertbanner :show="alertbannerVisible" icon="info-badge-filled" content="Connect other calendars to see your other meetings in addition to Webex meetings." :button="{label:'Connect', func: () => {connectCal()}}" class="alertbanner" @close="() => {alertbannerVisible = false}"/>
      <div class="teams-meetings-list" >

        <div class="teams-meetings-list-top">
          <div class="teams-meetings-list-top-left">
            <div class="title">Meetings</div>
            <div class="sub">
              <div class="btn-pmr" v-tooltip="{
                    content: `Your Webex Personal Room is your \nown virtual conference space that's \nalways available and has its own \nPersonal Room link and video \naddress.`, 
                    html: false,
                    placement: 'bottom',
                }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9684 4.49519L9.47034 1.97859C9.0438 1.66721 8.52942 1.49929 8.00133 1.49902C7.47323 1.49876 6.95868 1.66617 6.53184 1.97712L3.02991 4.49665C2.71133 4.72894 2.45204 5.03312 2.27311 5.38445C2.09418 5.73579 2.00065 6.12438 2.00012 6.51865V12.0001C2.0009 12.6629 2.26454 13.2983 2.73322 13.767C3.20189 14.2356 3.83732 14.4993 4.50012 14.5001H11.5001C12.1629 14.4993 12.7984 14.2357 13.267 13.767C13.7357 13.2983 13.9993 12.6629 14.0001 12.0001V6.51863C13.9995 6.12396 13.9057 5.73501 13.7265 5.38341C13.5472 5.03181 13.2874 4.72749 12.9684 4.49519ZM13.0001 12.0001C12.9997 12.3978 12.8415 12.779 12.5603 13.0603C12.2791 13.3415 11.8978 13.4996 11.5001 13.5001H4.50012C4.10243 13.4996 3.72115 13.3415 3.43994 13.0603C3.15873 12.779 3.00056 12.3978 3.00012 12.0001V6.51863C3.00036 6.28246 3.05623 6.04966 3.16321 5.83911C3.27018 5.62856 3.42525 5.44617 3.61585 5.30671L7.1178 2.78718C7.37436 2.60004 7.68378 2.49932 8.00134 2.49958C8.3189 2.49984 8.62815 2.60108 8.8844 2.78865L12.3824 5.30525C12.5735 5.44471 12.729 5.62726 12.8364 5.83808C12.9437 6.0489 12.9998 6.28206 13.0001 6.51863V12.0001Z" fill="white" fill-opacity="0.7"/>
                  <path d="M9.43839 7.88389C9.71123 7.60153 9.89492 7.24511 9.96656 6.85906C10.0382 6.473 9.99463 6.0744 9.84127 5.71295C9.68791 5.3515 9.43154 5.04318 9.10414 4.82644C8.77674 4.6097 8.39278 4.49413 8.00014 4.49413C7.60749 4.49413 7.22354 4.6097 6.89613 4.82644C6.56873 5.04318 6.31237 5.3515 6.15901 5.71295C6.00565 6.0744 5.96207 6.473 6.03371 6.85906C6.10535 7.24511 6.28905 7.60153 6.56189 7.88389C6.10397 8.12566 5.71824 8.48438 5.44393 8.92358C5.16961 9.36277 5.01649 9.86678 5.00015 10.3843C5.00015 10.7086 5.14273 11.3087 6.09683 11.6881C6.70678 11.9081 7.35182 12.0148 8.00015 12.003C9.38394 12.003 11.0001 11.5792 11.0001 10.3843C10.9838 9.86678 10.8307 9.36277 10.5564 8.92357C10.282 8.48438 9.89631 8.12566 9.43839 7.88389ZM8.00012 5.50007C8.1979 5.50007 8.39124 5.55872 8.55569 5.6686C8.72014 5.77848 8.84831 5.93466 8.924 6.11739C8.99969 6.30011 9.01949 6.50118 8.98091 6.69516C8.94232 6.88914 8.84708 7.06732 8.70723 7.20718C8.56738 7.34703 8.38919 7.44227 8.19521 7.48086C8.00123 7.51944 7.80016 7.49964 7.61744 7.42395C7.43471 7.34826 7.27853 7.22009 7.16865 7.05564C7.05877 6.89119 7.00012 6.69785 7.00012 6.50007C7.00047 6.23496 7.10594 5.98081 7.2934 5.79334C7.48086 5.60588 7.73501 5.50042 8.00012 5.50007ZM8.00012 11.003C6.77942 11.003 6.00012 10.6368 6.00012 10.3843C6.03168 9.87534 6.25613 9.39751 6.62773 9.04823C6.99934 8.69895 7.49014 8.5045 8.00012 8.5045C8.51011 8.5045 9.00091 8.69895 9.37251 9.04823C9.74412 9.39751 9.96856 9.87534 10.0001 10.3843C10.0001 10.6368 9.22083 11.003 8.00012 11.003Z" fill="white" fill-opacity="0.7"/>
                </svg>
              </div>
              <span class="lb">{{'http://go.webex.com/meet/' + me.name.toLowerCase().replace(/ /g, '')}}</span>
              <div class="btnr">
                <md-button aria-label="button" size="28" class="md-button-outline btn-copy" v-tooltip="{
                      content: 'Click to copy your Personal Room link', 
                      html: true,
                      placement: 'bottom',
                  }"
                  @click="copy">
                  <wl-icon v-if="!copied" name="copy-bold" size="16" />
                  <wl-icon v-if="copied" name="check-bold" size="16" />
                </md-button>
              </div>
            </div>
          </div>
          <div class="teams-meetings-list-top-right">
            <md-button v-if="collapsed2"
              aria-label="button"
              color="green"
              size="32"
              class="btn"
              @click="meet"
            >Start</md-button>

            <md-button v-if="collapsed2"
              aria-label="button"
              color="green"
              size="32"
              class="btn"
            >Join</md-button>

            <md-button v-if="collapsed2"
              aria-label="button"
              size="32"
              class="btn"
            >
              Schedule
              <wl-icon name="arrow-down-bold" size="16" color="black" class="ico" />
            </md-button>

            <span v-if="!collapsed2" class="clslb">Collapse</span>

            <div class="exp-arrow" @click="collapsed2=!collapsed2">
              <wl-icon v-if="collapsed2" name="arrow-circle-down-bold" size="16" class="ico" />
              <wl-icon v-if="!collapsed2" name="arrow-circle-up-bold" size="16" class="ico" />
            </div>
          </div>
        </div>

        <div v-if="!collapsed2" class="teams-meetings-list-meetingbtns">

          <div class="itms">
            <div class="itm">
              <md-button
                aria-label="button"
                color="green"
                size="52"
                class="btn"
                @click="meet"
              ><wl-icon name="camera-regular" size="28" color="white" /></md-button>
              <span class="lb">Start a meeting</span>
            </div>

            <div class="itm">
              <md-button
                aria-label="button"
                color="green"
                size="52"
                class="btn"
              ><wl-icon name="enter-room-regular" size="28" color="white" /></md-button>
              <span class="lb">Join a meeting</span>
            </div>

            <div class="itm">
              <md-button
                aria-label="button"
                size="52"
                class="btn"
              ><wl-icon name="calendar-add-regular" size="28" color="black" /></md-button>
              <span class="lb">Schedule a meeting <wl-icon name="arrow-down-bold" size="16" color="white" class="ico" /></span>
            </div>
          </div>

        </div>

        <div v-if="!calendarMeetingsConnected" class="teams-meetings-list-divider" ></div>

        <div v-if="calendarMeetingsConnected" class="teams-meetings-list-mid">
          <div class='teams-meetings-list-mid-tabs' @mouseleave="leaveTab">
            <div class="teams-meetings-list-mid-tabs-active-bg"></div>
            <div 
              v-for="(tab, idx) in tabs"
              :key="`tttt${idx}`"
              class="teams-meetings-list-mid-tabs-tab" 
              :class="[{
                active: activeTabId === idx,
              }, `teams-meetings-list-mid-tabs-tab${idx}`]" 
              @click="selectTab(idx)" 
            >
              <span class="lb">{{tab}}</span>
            </div>
          </div>

          <div class='teams-meetings-list-mid-right' >
            
            <div class="btngrp" >
              <div class="btn btn1" @click="goPrev" >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.70697 8.00011L11.3534 2.35376C11.4448 2.25953 11.4955 2.13312 11.4945 2.00183C11.4935 1.87054 11.4409 1.74491 11.3481 1.65207C11.2553 1.55923 11.1296 1.50663 10.9984 1.50563C10.8671 1.50463 10.7407 1.5553 10.6464 1.64671L4.64642 7.64671C4.55267 7.74048 4.5 7.86764 4.5 8.00024C4.5 8.13283 4.55267 8.26 4.64642 8.35376L10.6464 14.3538C10.6926 14.4014 10.7478 14.4393 10.8087 14.4653C10.8697 14.4914 10.9352 14.5051 11.0015 14.5056C11.0678 14.5061 11.1335 14.4934 11.1949 14.4683C11.2562 14.4431 11.312 14.406 11.3589 14.3592C11.4057 14.3123 11.4428 14.2565 11.468 14.1952C11.4931 14.1338 11.5058 14.0681 11.5053 14.0018C11.5048 13.9355 11.4911 13.87 11.465 13.809C11.4389 13.748 11.401 13.6929 11.3534 13.6467L5.70697 8.00011Z" fill="white" fill-opacity="0.95"/>
                </svg>

              </div>
              <div class="divider" ></div>
              <div class="btn btnmd" ref="btncal" @click="showCalendarDropdown" >
                <span class="lb">{{$formatDate(currentDate, 'LLLL d, yyyy')}}</span>
              </div>
              <div class="divider" ></div>
              <div class="btn btn1" @click="goNext" >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.354 7.64648L5.35399 1.64648C5.30783 1.59889 5.25266 1.56096 5.1917 1.53489C5.13074 1.50883 5.0652 1.49515 4.9989 1.49464C4.9326 1.49414 4.86687 1.50683 4.80552 1.53197C4.74417 1.55711 4.68843 1.5942 4.64155 1.64109C4.59467 1.68797 4.55758 1.74371 4.53245 1.80506C4.50731 1.86641 4.49463 1.93215 4.49513 1.99845C4.49564 2.06475 4.50933 2.13028 4.5354 2.19124C4.56147 2.2522 4.5994 2.30737 4.64699 2.35353L10.2934 7.99988L4.64699 13.6465C4.5994 13.6926 4.56147 13.7478 4.5354 13.8088C4.50933 13.8697 4.49564 13.9353 4.49513 14.0016C4.49463 14.0679 4.50731 14.1336 4.53245 14.195C4.55758 14.2563 4.59467 14.312 4.64155 14.3589C4.68843 14.4058 4.74417 14.4429 4.80552 14.468C4.86687 14.4932 4.9326 14.5059 4.9989 14.5054C5.0652 14.5049 5.13074 14.4912 5.1917 14.4651C5.25266 14.439 5.30783 14.4011 5.35399 14.3535L11.354 8.35353C11.4477 8.25977 11.5004 8.1326 11.5004 8.00001C11.5004 7.86741 11.4477 7.74025 11.354 7.64648Z" fill="white" fill-opacity="0.95"/>
                </svg>

              </div>
            </div>

            <md-button
              v-if="!meetingsSidecarVisible"
              aria-label="button"
              size="28" 
              className="btnitm btn-today md-button-outline"
              @click="goToday"
            >Today</md-button>

            <md-button aria-label="button" size="28" ref="listtype" className="btnitm cbox md-button-outline" @click="showListTypeDropdown" >
              <wl-icon class="ico" :name="listIcons[listType.replace(/ /g, '')]" size="16" />
              <span class="lb">{{listType}}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.3542 4.64666C14.2605 4.55291 14.1333 4.50024 14.0007 4.50024C13.8681 4.50024 13.741 4.55291 13.6472 4.64666L8.00048 10.2932L2.35398 4.64666C2.25974 4.55525 2.13333 4.50458 2.00204 4.50558C1.87075 4.50658 1.74513 4.55918 1.65229 4.65202C1.55946 4.74486 1.50687 4.87049 1.50587 5.00178C1.50488 5.13307 1.55556 5.25948 1.64698 5.35371L7.64698 11.3537C7.74075 11.4474 7.8679 11.5001 8.00048 11.5001C8.13307 11.5001 8.26022 11.4474 8.35398 11.3537L14.354 5.35371C14.4478 5.25998 14.5005 5.13283 14.5005 5.00024C14.5006 4.86765 14.448 4.74046 14.3542 4.64666Z" fill="white" fill-opacity="0.95"/>
              </svg>
            </md-button>

          </div>

        </div>

        <!--wl-scrollbar 
          v-if="!calendarMeetingsConnected"
          ref="scrollbar"
          class="teams-meetings-list-items" 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
        >
          <div v-if="listType === 'List'" class="scrollcontent-need-a-wrap" ref="scrollcontent" >
            <div
              v-for="(d, idx) in meetingList"
              :key="`date-item${idx}`"
              class="item-date"
            >
              <div
                v-for="(m, idx2) in d.meetings"
                :key="`meeting-item${idx2}`"
                class="item-meeting"
                :class="{
                  active: selectedMeeting && selectedMeeting.title === m.title,
                  past: false,
                }"
                @click="toggleMeetingDetails(m)"
              >

              <div class="wrap">
                <div class="marker" :class="[m.marker]"></div>
                  <div class='left' >
                    <presence-avatar
                      v-if="m.organizer"
                      :title="m.organizer"
                      :src="people(m.organizer).avatar ? avatarPath + people(m.organizer).avatar : ''" 
                      :color="'white'"
                      :backgroundColor="'#545454'"
                      :size="32"
                      :presence="people(m.organizer).status" 
                      :theme="theme === 'light' ? 'light' : 'dark'"
                      class="avatar" 
                    />
                    <md-avatar
                      v-if="!m.organizer"
                      :title="m.title"
                      type="group" 
                      :size="32" 
                      color="#FFFFFF"
                      :fontWeight="600"
                      :backgroundColor="'#545454'"
                      class="avatar" 
                    />

                  </div>

                  <div class='mid' >
                    <span class="row1">
                      <span class="txt" :class="{active: true}">{{ m.title }}</span>
                    </span>

                    <span class="row2" >
                      <span class="subline" >Anytime</span>
                    </span>

                  </div>

                  <span class="spacename text-link">{{ m.team }}</span>

                  <div class="btns" >
                    <md-button aria-label="button" size="28" color="green" class="btn fte-joinbutton" @click="join(m, $event)">
                      Join
                    </md-button>
                  </div>

                  <div class="right">
                    <wl-icon 
                      v-for="(i, idx3) in m.icons"
                      :key="`meeting-ico${idx3}`"
                      :name="i"
                      size="12"
                      class="ico"
                    />
                  </div>

                </div>
                <div class="closeico" @click="removeTestMeeing">
                  <wl-icon name="clear-filled" size="16" color="rgba(255,255,255,.7)" />
                </div>
              </div>

            </div>
          </div>

        </wl-scrollbar-->

        <wl-scrollbar 
          v-if="calendarMeetingsConnected"
          ref="scrollbar"
          class="teams-meetings-list-items" 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
        >
          <div v-if="listType === 'List'" class="scrollcontent-need-a-wrap" ref="scrollcontent" >
            <div
              v-for="(d, idx) in getMeetingDateList(activeTabId)"
              :key="`date-item${idx}`"
              class="item-date"
            >
              <div class="date" :class="{today: $isEqualDate(d.date, today)}" :ref="`anchor${$formatDate(d.date, 't')}`" >
                {{ $formatDate(d.date, 'EEEE, LLLL d') }}
              </div>

              <div
                v-for="(m, idx2) in getMeetingList(activeTabId, d.meetings)"
                :key="`meeting-item${idx2}`"
                class="item-meeting"
                :class="{
                  active: (meetingsSidecarVisible || isPopout()) && selectedMeeting && selectedMeeting.title === m.title && $formatDate(selectedMeeting.start, 't') === $formatDate(m.start, 't'),
                  past: activeTabId == 0 && $isPastDate(m.end),
                  recap: activeTabId == 1,
                }"
                @click="toggleMeetingDetails(m)"
              >
                <div v-if="activeTabId == 0" class="wrap">
                  <div v-if="m.type !== 'no'" class="marker" :class="[m.marker]"></div>
                  <div class='left' >
                    <presence-avatar
                      v-if="m.organizer"
                      :title="m.organizer"
                      :src="people(m.organizer).avatar ? avatarPath + people(m.organizer).avatar : ''" 
                      :color="'white'"
                      :backgroundColor="'#545454'"
                      :size="32"
                      :presence="people(m.organizer).status" 
                      :theme="theme === 'light' ? 'light' : 'dark'"
                      class="avatar" 
                    />
                    <md-avatar
                      v-if="!m.organizer"
                      :title="m.title"
                      type="group" 
                      :size="32" 
                      color="#FFFFFF"
                      :fontWeight="600"
                      :backgroundColor="'#545454'"
                      class="avatar" 
                    />

                  </div>

                  <div class='mid' >
                    <span class="row1">
                      <span class="txt" :class="{active: inProgress(m.start, m.end) || inMinutes(m.start)}">{{ m.title }}</span>
                    </span>

                    <span class="row2" >
                      <span v-if="!inProgress(m.start, m.end)" class="subline" >{{ m.time ? m.time : `${$formatDate(m.start, 'kk:mm')} - ${$formatDate(m.end, 'kk:mm')}` }}</span>
                      <span v-if="inProgress(m.start, m.end)" class="green" >
                        <span class="green">In progress</span>
                        <wl-icon v-if="m.team" name="dot-divider" size="4" class="divider" />
                        <span class="green">00:23</span>
                      </span>
                      <wl-icon v-if="inMinutes(m.start)" name="dot-divider" size="4" class="divider" />
                      <span v-if="inMinutes(m.start)" class="green">{{ `in ${inMinutes(m.start)} minutes` }}</span>
                    </span>

                  </div>

                  <span class="spacename text-link">{{ m.team }}</span>

                  <div class="btns" v-if="inProgress(m.start, m.end) || inMinutes(m.start)">
                    <!--
                    <md-button aria-label="button" size="28" class="btn md-button-outline" >
                      <wl-icon name="chat-bold" size="16" class="ico" />
                      Message
                    </md-button>
                    -->
                    <md-button aria-label="button" size="28" color="green" class="btn" @click="join(m, $event, inProgress(m.start, m.end))">
                      Join
                    </md-button>
                  </div>

                  <div v-if="!inProgress(m.start, m.end) && !inMinutes(m.start)" class="right">
                    <wl-icon v-if="m.follow" name="flag-filled" size="12" class="ico" />
                    <wl-icon 
                      v-for="(i, idx3) in m.icons"
                      :key="`meeting-ico${idx3}`"
                      :name="i"
                      size="12"
                      class="ico"
                    />
                  </div>
                </div> <!--activeTabId==0-->

                <div v-if="activeTabId == 1" class="wrap">
                  <div v-if="m.type !== 'no'" class="marker" :class="[m.marker]"></div>
                  <div class='left' >
                    <presence-avatar
                      v-if="m.organizer"
                      :title="m.organizer"
                      :src="people(m.organizer).avatar ? avatarPath + people(m.organizer).avatar : ''" 
                      :color="'white'"
                      :backgroundColor="'#545454'"
                      :size="32"
                      :presence="people(m.organizer).status" 
                      :theme="theme === 'light' ? 'light' : 'dark'"
                      class="avatar" 
                    />
                    <md-avatar
                      v-if="!m.organizer"
                      :title="m.title"
                      type="group" 
                      :size="32" 
                      color="#FFFFFF"
                      :fontWeight="600"
                      :backgroundColor="'#545454'"
                      class="avatar" 
                    />

                  </div>

                  <div class='mid' >
                    <span class="row1">
                      <span class="txt">{{ m.title }}</span>
                      <wl-icon v-if="m.team" name="dot-divider" size="4" class="divider" />
                      <span v-if="m.team" class="spacename text-link">{{ m.team }}</span>
                    </span>

                    <span class="row2" >
                      <span class="subline" >{{ m.time ? m.time : `${$formatDate(m.start, 'kk:mm')} - ${$formatDate(m.end, 'kk:mm')}` }}</span>
                    </span>
                    <span v-if="m.tags" class="row3" >
                      <div 
                        v-for="(tag, idx) in m.tags"
                        :key="`k${idx}`"
                        class="tag"
                        @click="tagClickHandler($event, m, tag)"
                    >
                      {{ tag.name }} 
                    </div>
                    </span>
                  </div>

                  <div class="btns" >
                    <md-button aria-label="button" size="28" class="btn md-button-outline btn-circle" >
                      <wl-icon name="forward-message-bold" size="16" />
                    </md-button>
                  </div>

                </div><!--activeTabId==1-->



              </div>
            </div>
          </div>


          <div v-if="listType === 'Day'" class="items-day scrollcontent-need-a-wrap" ref="scrollcontent" >
            <div
              v-for="(n, idx) in 24"
              :key="`hour${idx}`"
              class="item-hour"
            >
              <div class="lb" >
                {{ (idx > 9 ? idx : ('0' + idx) ) + ':00'}}
              </div>
              <div class="line"></div>
            </div>

            <div v-if="$isToday(currentDate)" class="nowtime" :style="{top: `${nowtimeTop}px`}">
              <div class="lb">{{ nowtime }}</div>
              <div class="dot"></div>
              <div class="line"></div>
            </div>

            <div class="meetinglist">

              <div 
                v-for="(m, idx) in getDayViewMeetings()"
                :key="`item${idx}`"
                class="item-meeting"
                :style="{
                  top: m.position.top,
                  left: m.position.left,
                  width: m.position.width,
                  height: m.position.height,
                  ...styleObject,
                }"
              >
                <div class="incoming-idx" ></div>
                <div class='mid'>
                  <span class="row1">
                    <span class="txt">{{ m.title }}</span>
                  </span>
                  <span class="row2" >
                    <span class="subline" >{{ m.organizer }}</span>
                  </span>
                </div>

                <div class="team" >
                  {{ m.team }}
                </div>
                <div class="right">
                  <wl-icon 
                    v-for="(i, idx3) in m.icons"
                    :key="`meeting-ico${idx3}`"
                    :name="i"
                    size="12"
                    class="ico"
                  />
                </div>
              </div>

            </div>

          </div>


        </wl-scrollbar>


        </div>

<!--
        <div v-if="!calendarMeetingsConnected && !emptyStateVisible" class="fte-calendar">
          <div v-show="!meetingsSidecarVisible" class="phimg">
            <wl-hot :rect="{x:148,y:158,w:108,h:24}" @click.native="() => { alertbannerVisible = true; emptyStateVisible = true; $popper.hideAll(); }" />
          </div>
          <div v-show="meetingsSidecarVisible" class="phimg2">
            <wl-hot :rect="{x:166,y:182,w:108,h:24}" @click.native="() => { alertbannerVisible = true; emptyStateVisible = true; $popper.hideAll(); }" />
          </div>
        </div>

        <div v-if="!calendarMeetingsConnected && emptyStateVisible" class="empty-state">
          <div class="phimg"></div>
        </div>
-->
        <div v-if="!calendarMeetingsConnected" class="fte-calendar">
          <div class="phimg">
            <wl-hot :rect="{x:122,y:170,w:53,h:29}" @click.native="($event) => { join(meetingList_test[0], $event); $popper.hideAll(); }" />
            <wl-hot :rect="{x:414,y:170,w:75,h:29}" @click.native="() => { connectCal(); $popper.hideAll(); }" />
          </div>
        </div>


  </div>
</template>

<script>

import {
  addDays,
  addMinutes,
  format,
  isFuture,
  isPast,
  isEqual,
  getUnixTime,
  set,
} from 'date-fns'
import coachmark from '../shared/coachmark.vue'


export default {
    props:{
      name: {
        type: String,
      },
      collapsed: {
        type: Boolean,
        default: true,
      },
    },
    data() {
        return {
          today: null,
          disableToggleMeetingDetails: false,
          animation: {
            duration: 300, // 数值为0或者很小时，SplitGridArea的sizeValue改变后，grid宽度不会改变，有时间去查查源代码。不用animation也可以避免这个bug
            easing: "easeInOutQuint"
          },
          transition: {
            name: "slide-to-left",
            duration: 0
          },
          listType: 'List', //Day, Work Week, Week
          listNames: ['List', 'Day', 'Work Week', 'Week'],
          listIcons: {
            List: 'calendar-week-bold',
            Day: 'calendar-day-bold',
            WorkWeek: 'calendar-work-week-bold',
            Week: 'calendar-week-view-bold',
          },
          activeTabId: 0,
          tabs: [
            'Calendar',
            'Meeting recaps',
            //'Webinars',
          ],
          currentDate: new Date(),
          dateList: [],
          meetingList: [],
          meetingList_test: [],
          meetingList_cnnted: [],
          menuCalendarVisible: false,
          menuListTypeVisible: false,
          copied: false,
          
          nowtime: '',
          nowtimeTop: 0,
          dateRowHeight: 80,
          nowtimeHeight: 20,
          collapsed2: true,
          alertbannerVisible: false,
          
        }
    },
    beforeMount() {
      this.collapsed2 = this.collapsed
      
      // add dates
      let d = new Date();
      const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      this.today = today

      const dp2 = addDays(today, -2)
      const dp1 = addDays(today, -1)
      const d1 = addDays(today, 1)
      const d2 = addDays(today, 2)
      const d3 = addDays(today, 3)
      const d4 = addDays(today, 4)
      const d5 = addDays(today, 5)

      let lst = [];
      lst.push(dp2);
      lst.push(dp1);
      lst.push(today);
      lst.push(d1);
      lst.push(d2);
      lst.push(d3);
      lst.push(d4);
      lst.push(d5);

      this.dateList = lst;

      let testmtlst = [
        {
          date: 'anytime',
          meetings: [
            {
              title: 'Test meeting',
              organizer: 'Emily Nakagawa',
              start: 'anytime',
              end: 'anytime',
              marker: 'solid-green',
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              team: 'Test space',
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
          ],
        },
      ]

      // add meetings
      let mtlst = [
        {
          date: dp2,
          meetings: [
            {
              title: 'Weekly Stand-up',
              organizer: 'Barbara German',
              start: set(dp2, { hours: 7, minutes: 30 }),
              end: set(dp2, { hours: 8 }),
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Squad weekly sync',
              organizer: 'Adrian Delamico',
              start: set(dp2, { hours: 11 }),
              end: set(dp2, { hours: 11, minutes: 30 }),
              avatarBackgroundColor: ['#97CC84', '#81AE74'],
              team: 'Marketing',
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
              tags: [
                {
                  name: 'Meeting notes',
                  data: 'meetingnotes',
                },
              ],
            },
          ],
        },
        {
          date: dp1,
          meetings: [
            {
              title: 'Weekly Stand-up',
              organizer: 'Barbara German',
              start: set(dp1, { hours: 7, minutes: 30 }),
              end: set(dp1, { hours: 8 }),
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
              tags: [
                {
                  name: '3 Recordings',
                  data: 'recordings',
                },
                {
                  name: 'Meeting notes',
                  data: 'meetingnotes',
                },
              ],
            },
            {
              title: 'Backlog Refinement Meeting',
              organizer: 'Catherine Sinu',
              start: set(dp1, { hours: 8 }),
              end: set(dp1, { hours: 10 }),
              link: 'Product energize',
              avatarBackgroundColor: ['#97CC84', '#81AE74'],
              team: 'Marketing',
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
          ],
        },
        {
          date: today,
          meetings: [
            {
              title: 'Design status sync',
              organizer: 'Benoit Lapointe',
              inmeeting: false,
              people: 8,
              start: this.$makeMeetingTime(-2)[0],
              end: this.$makeMeetingTime(-2)[1],
              position: {
                left: '0',
                width: '50%',
              },
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              team: 'Marketing',
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Session: Hybrid Work',
              organizer: 'David Liam',
              inmeeting: false,
              people: 8,
              start: this.$makeMeetingTime(-1)[0],
              end: this.$makeMeetingTime(-1)[1],
              position: {
                left: '0',
                width: '50%',
              },
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              team: 'The Design Group',
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
              tags: [
                {
                  name: '3 Recordings',
                  data: 'recordings',
                },
                {
                  name: 'Meeting notes',
                  data: 'meetingnotes',
                },
                {
                  name: 'Action items',
                  data: 'actionitems',
                },
              ],
            },


            {
              title: 'Follow-up meeting',
              organizer: 'Melissa Ryan',
              inmeeting: true,
              people: 8,
              start: this.$makeMeetingTime(0)[0],
              end: this.$makeMeetingTime(0)[1],
              position: {
                left: '0',
                width: '50%',
              },
              marker: 'solid-green',
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              team: 'The Design Group',
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Feature review',
              organizer: 'Giacomo Edwards',
              upcoming: true,
              start: this.$makeMeetingTime(1)[0],
              end: this.$makeMeetingTime(1)[1],
              position: {
                left: '50%',
                width: '50%',
              },
              link: 'Product energize',
              marker: 'dash-green',
              avatarBackgroundColor: ['#97CC84', '#81AE74'],
              team: 'Marketing',
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
          ],
        },
        {
          date: d1,
          meetings: [
            {
              title: '1:1 Sarah',
              organizer: this.me.name,
              start: set(d1, { hours: 8 }),
              end: set(d1, { hours: 8, minutes: 30 }),
              room: 'My personal room',
              marker: 'solid-gray',
              avatarBackgroundColor: ['#CE8054', '#C46152'],
              icons: ['recurring-bold'],
              accepted: ['Sarah Robertson'],
              waiting: [],
            },
            {
              title: '1:1 Barbara',
              organizer: this.me.name,
              start: set(d1, { hours: 9, minutes: 30 }),
              end: set(d1, { hours: 10 }),
              room: 'My personal room',
              marker: 'dash-gray',
              avatarBackgroundColor: ['#97CC84', '#81AE74'],
              icons: ['recurring-bold'],
              accepted: ['Barbara German'],
              waiting: [],
            },
            {
              title: 'Project plan review',
              organizer: 'Emma Hirst',
              start: set(d1, { hours: 11, minutes: 20 }),
              end: set(d1, { hours: 12 }),
              marker: 'dash-gray',
              avatarBackgroundColor: ['#CE8054', '#C46152'],
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Project Demos',
              organizer: 'Peter Hogan',
              start: set(d1, { hours: 14 }),
              end: set(d1, { hours: 15 }),
              marker: 'dash-gray',
              avatarBackgroundColor: ['#97CC84', '#81AE74'],
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Daily Meeting Sync Up',
              organizer: 'Adrian Delamico',
              start: set(d1, { hours: 15, minutes: 30 }),
              end: set(d1, { hours: 16, minutes: 30 }),
              marker: 'dash-gray',
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
          ],
        },
        {
          date: d2,
          meetings: [
            {
              title: `No Devices ${format(d2, 'EEEE')}`,
              time: 'All day',
              type: 'no',
              start: set(d2, { hours: 0 }),
              end: set(d2, { hours: 23, minutes: 59, seconds:59 }),
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              icons: ['recurring-bold'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Breakfast club',
              organizer: 'Catherine Sinu',
              start: set(d2, { hours: 7, minutes: 30 }),
              end: set(d2, { hours: 8 }),
              link: 'Team Awesome',
              marker: 'solid-gray',
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Office Hours',
              organizer: 'Giacomo Edwards',
              start: set(d2, { hours: 14 }),
              end: set(d2, { hours: 15, minutes: 30 }),
              link: 'General',
              marker: 'dash-gray',
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
          ],
        },
        {
          date: d3,
          meetings: [
            {
              title: 'Weekly Stand-up',
              organizer: 'Barbara German',
              start: set(d3, { hours: 7, minutes: 30 }),
              end: set(d3, { hours: 8 }),
              marker: 'solid-gray',
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Backlog Refinement Meeting',
              organizer: 'Benoit Lapointe',
              start: set(d3, { hours: 8 }),
              end: set(d3, { hours: 10 }),
              link: 'Product energize',
              marker: 'solid-gray',
              avatarBackgroundColor: ['#97CC84', '#81AE74'],
              team: 'Marketing',
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
          ],
        },
        {
          date: d4,
          meetings: [
            {
              title: 'Weekly Stand-up',
              organizer: 'Barbara German',
              start: set(d4, { hours: 7, minutes: 30 }),
              end: set(d4, { hours: 8 }),
              marker: 'solid-gray',
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Backlog Refinement Meeting',
              organizer: 'Catherine Sinu',
              start: set(d4, { hours: 8 }),
              end: set(d4, { hours: 10 }),
              link: 'Product energize',
              marker: 'solid-gray',
              avatarBackgroundColor: ['#97CC84', '#81AE74'],
              team: 'Marketing',
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
          ],
        },
        {
          date: d5,
          meetings: [
            {
              title: 'Weekly Stand-up',
              organizer: 'Barbara German',
              start: set(d5, { hours: 7, minutes: 30 }),
              end: set(d5, { hours: 8 }),
              marker: 'solid-gray',
              avatarBackgroundColor: ['#61B391', '#60C0A2'],
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
            {
              title: 'Backlog Refinement Meeting',
              organizer: 'Benjamin Vitali',
              start: set(d5, { hours: 8 }),
              end: set(d5, { hours: 10 }),
              link: 'Product energize',
              marker: 'solid-gray',
              avatarBackgroundColor: ['#97CC84', '#81AE74'],
              team: 'Marketing',
              accepted: ['David Liam', 'Benoit Lapointe', 'Benjamin Vitali', 'Marc Brown', 'Maria Rossi'],
              waiting: ['Catherine Sinu', 'Julia Cyrus', 'Sherry Mckenna', 'Barbara German', 'Dheeraj Bhasin'],
            },
          ],
        },
      ];

      for(let i=0; i<mtlst.length; i++){
        let dd = mtlst[i]
        let ddmeetings = dd.meetings
        for(let j=0; j<ddmeetings.length; j++){
          ddmeetings[j].id = Math.random().toString()
        }
      }

      this.meetingList_test = testmtlst
      this.meetingList_cnnted = mtlst

      this.meetingList = this.calendarMeetingsConnected ? mtlst : testmtlst

      if (this.calendarMeetingsConnected) {
        this.$store.commit('teamsMeetingList', mtlst);
      }
    },
    mounted(){
      if (this.calendarMeetingsConnected) {
        this.initState()
      }

      if (this.isFTE) {
        /*
        setTimeout(() => {
          this.showCoachmark({
            name: 'join-coachmark',
            closable: true,
            icon: null,
            title: null,
            content: `Check out our fantastic meeting experince now!`,
            subtext: null,
            reference: document.querySelector('.fte-joinbutton'),
            placement: `bottom`,
            button: {
              label: `Got it`,
              func: () => {  },
            },
          })
        }, 800)
        */
      }

      this.checkMeetingOnloadData()

      window.addEventListener('keydown', this.onKeydown)

      this.$eventBus.$on('open-meeting-info-sidecar', (options) => {
        this.findAndShowMeetingDetails(options.meetingName)
      });

      console.log(this.selectedMeeting)
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.onKeydown);
        this.$eventBus.$off('open-meeting-info-sidecar');
    },
    computed:{
      theme() {
        let t = this.$store.state.theme;
        return t === 'dark' ? 'dark' : 'light';
      },
      themeColor() {
        return this.$store.state.themeColor;
      },
      themeColorList() {
        return this.$store.state.themeColorList;
      },
      itembgColor() {
        return this.themeColorList[this.theme][this.themeColor]['itembg'];
      },
      avatarPath(){
        return this.$store.state.avatarPath;
      },
      isFTE(){
        return this.$store.state.isFTE;
      },
      calendarMeetingsConnected(){
        return this.$store.state.calendarMeetingsConnected;
      },
      meetingOptionsList(){
        return this.$store.state.meetingOptionsList;
      },
      teamsMeetingList(){
        return this.$store.state.teamsMeetingList;
      },
      teamsMeetingOnloadData(){
        return this.$store.state.teamsMeetingOnloadData;
      },
      me() {
        return this.$store.getters.me;
      },
      styleObject() {
        return {
          '--item-back-color': this.itembgColor.default,
          '--item-back-hover': this.itembgColor.hover,
          '--item-back-active': this.itembgColor.active,
        };
      },
      teamsSidecarName(){
        return this.$store.state.teamsSidecarName;
      },
      gptPanelPopouted(){
        return this.$store.state.gptPanelPopouted;
      },
      meetingsSidecarVisible(){
        return this.$store.state.meetingsSidecarVisible;
      },
      selectedMeeting(){
        return this.$store.state.selectedMeeting;
      },
      selectedMeetingJumpto(){
        return this.$store.state.selectedMeetingJumpto;
      },
      
    },
    watch: {
      teamsMeetingList(val) {
        this.meetingList_cnnted = val
        if (this.calendarMeetingsConnected) {
          this.meetingList = val
        }
      },
      teamsMeetingOnloadData(val) {
        if (val) {
          this.checkMeetingOnloadData()
        }
      },

      meetingOptionsList(newVal){
        if (this.isFTE && newVal.length === 0) {
          // meeting ended

          //show post meeting popup
          this.$modal.show(
            {
              template: `
                <div class="fte-post-test-meeting" >
                  <topbar-simple :buttons="['close', 'minimize']" class="topbar" @close="close" />
                  <div class="content">
                    <wl-hot :rect="{x:290,y:466,w:132,h:36}" @click.native="() => { gotoMeetingTab() }" />
                  </div>
                </div>
              `,
              props: [
                'parentref'
              ],
              data() {
                return {
                };
              },
              methods: {
                gotoMeetingTab() {
                  this.parentref.$store.commit('teamsNav', 'messaging')
                  this.close()
                },
                close() {
                  this.$emit('close')
                },
              }
            },
            {
              parentref: this,
            }, // component props
            {
              name: 'fte-post-test-meeting',
              clickToClose: false,
              transition: false,
              frameless: false,
              shadow: true,
              resizable: false,
              draggable: '.topbar',
              roundedCorner: false,
              overlayVisible: false,
              overlayTransparent: 0,
              theme: this.theme,
              width: 712,
              height: 576,
            }, // modal props
            {} // modal eventlistener
          );

          /*
          setTimeout(() => {
            this.showMeetingDetails(this.meetingList[0].meetings[0])

            this.$nextTick(() => {
              this.showCoachmark({
                name: 'meeting-recap-coachmark',
                closable: false,
                icon: 'transcript-bold',
                title: 'Meeting recap',
                content: `You can always revisit the useful info and content of each single meeting. `,
                subtext: null,
                reference: document.querySelector('.hidden-coachmark-ref'),
                closeTrigger: '',
                placement: `left`,
                button: {
                  label: `Done`,
                  func: () => {
                    this.$store.commit('teamWindowOverlayRect', null)
                  },
                },
              })

              const rectapp = document.querySelector('#teams-app').getBoundingClientRect()
              const rectpanel = document.querySelector('.teams-meetings-split-rightcol').getBoundingClientRect()
              this.$store.commit('teamWindowOverlayRect', {
                clipmask: {
                  '--top': `${rectpanel.top - rectapp.top}px`,
                  '--right': `0`,
                  '--bottom': `0`,
                  '--left': `${rectpanel.left - rectapp.left - 1}px`,
                },
              })
            })

          }, 100)
          */
        }
      },
      

      calendarMeetingsConnected(val) {
        if (val) {
          this.meetingList = this.meetingList_cnnted
          this.initState()
        }
      },
      currentDate(date) {
        this.scrollToDate(date, false)
      },
      listType(type) {
        if (type === 'List') {
          this.$refs.scrollbar.scrollToY(0, true);
        } else if (type === 'Day') {
          let d = new Date()
          let hour = d.getHours()
          let min = d.getMinutes()
          this.nowtime = format(d, 'kk:mm')
          this.nowtimeTop = hour * this.dateRowHeight + this.dateRowHeight / 60 * min - this.nowtimeHeight / 2

          this.$nextTick(() => {
            this.$refs.scrollbar.scrollToY(this.nowtimeTop - 150, true);
          });
        }
      },
      /*
      meetingsSidecarVisible() {
        // 调整 coachmark 位置
        let itvid = setInterval(() => {
          this.$popper.update('join-coachmark')
        }, 0)
        setTimeout(() => {
          clearInterval(itvid)
        }, 300)
      },
      */
    },
    methods:{
      onKeydown() {
          //console.log('evt.code', evt.code, evt.altKey);
      },
      
      
      inProgress(d1, d2) {
        let res = false
        if (isPast(d1) && isFuture(d2)) {
          res = true
        }
        return res
      },
      inMinutes(d1) {
        let res = false
        let d = addMinutes(d1, -15)
        if (isPast(d) && isFuture(d1)) {
          let sec = getUnixTime(d1) - getUnixTime(new Date())
          res = Math.ceil(sec/60)
        }
        
        return res
      },

      initState() {
        this.selectTab(this.activeTabId)
        
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
      getMeetingDateList(tabid) {
        if (tabid == 0) {
          return this.meetingList
        }
        return this.meetingList.filter(
          mt => this.$isPastDate(mt.date) || this.$isToday(mt.date)
        )
      },
      getMeetingList(tabid, meetings) {
        if (tabid == 0) {
          return meetings
        }
        return meetings.filter(
          mt => this.$isPastDate(mt.end)
        )
      },

      findAndShowMeetingDetails(meetingName) {
        let mtlst = this.meetingList_cnnted
        for(let i=0; i<mtlst.length; i++){
          let dd = mtlst[i]
          let ddmeetings = dd.meetings
          for(let j=0; j<ddmeetings.length; j++){
            let meeting = ddmeetings[j]
            if(meeting.title == meetingName) {
              this.showMeetingDetails(meeting)
              break
            }
          }
        }
      },
      findAndPopoutMeetingDetails(meetingName) {
        let mtlst = this.meetingList_cnnted
        for(let i=0; i<mtlst.length; i++){
          let dd = mtlst[i]
          let ddmeetings = dd.meetings
          for(let j=0; j<ddmeetings.length; j++){
            let meeting = ddmeetings[j]
            if(meeting.title == meetingName) {
              this.popoutMeetingDetails(meeting)
              break
            }
          }
        }
      },

      popoutMeetingDetails(meeting, jumpto) {
        this.closeDetailsSidecar()
        this.$eventBus.$emit('open-meeting-info-window', {
              meetingInfo: meeting,
              jumpto: jumpto,
          }, {})

      },
      toggleMeetingDetails(meeting) {
        if (this.disableToggleMeetingDetails) {
          return
        }
        this.disableToggleMeetingDetails = true
        setTimeout(() => {
          this.disableToggleMeetingDetails = false
        }, 10)

        if (!this.meetingsSidecarVisible || this.selectedMeeting.title !== meeting.title || format(this.selectedMeeting.start, 't') !== format(meeting.start, 't')) {
          this.showMeetingDetails(meeting)
        } else {
          this.closeDetailsSidecar()
        }
      },
      showMeetingDetails(meeting) {
        this.openDetailsSidecar()
        this.$store.commit('selectedMeeting', meeting);
      },
      removeTestMeeing(e)  {
        e.stopPropagation()

        if (!this.calendarMeetingsConnected) {
          this.meetingList = []
          this.closeDetailsSidecar()

          const ref = document.querySelector('#teamnav-help-button')
          const rect = ref.getBoundingClientRect()

          this.showCoachmark({
              name: 'help-coachmark',
              closable: false,
              icon: 'help-circle-bold',
              title: 'Help',
              content: `You can always retrieve the test meeting from the help menu.`,
              subtext: null,
              reference: ref,
              closeTrigger: '',
              placement: `right`,
              modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, rect.width > 40 ? -(rect.width - 85) : 2],
                    },
                  },
                ],
              button: {
                label: `Got it`,
                func: () => {
                 
                },
              },
            })
        }
      },
      getDayViewMeetings() {
        let list = []
        let d = this.currentDate
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        for(let i=0; i<this.meetingList.length; i++) {
          let mday = this.meetingList[i]
          if (isEqual(mday.date, dd)) {
            list = mday.meetings
          }
        }
        // meeting position: {top: '999px', left: '50%', width: '50%', height: '99px'}
        for(let i=0; i<list.length; i++) {
          let m = list[i]
          if (!m.position) {
            m.position = {
              left: '0',
              width: '100%',
            }
          }

          let d = m.start
          let hours = d.getHours()
          let mins = d.getMinutes()

          let sec = getUnixTime(m.end) - getUnixTime(m.start)
          let hours2 = Math.floor(sec / 3600)
          let mins2 = Math.floor(sec % 3600 / 60)

          m.position.top = `${ hours * this.dateRowHeight + this.dateRowHeight / 60 * mins }px`
          m.position.height = `${ hours2 * this.dateRowHeight + this.dateRowHeight / 60 * mins2 }px`
        }
        return list
      },
      goToday() {
        this.currentDate = new Date();
      },
      goPrev() {
        this.currentDate = addDays(this.currentDate, -1);
      },
      goNext() {
        this.currentDate = addDays(this.currentDate, 1);
      },
      copy() {
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 3000)
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

        if (id === 0) {
          requestAnimationFrame(() => {
            this.scrollToDate(this.today)
          })
        } else {
          this.$refs.scrollbar.scrollToY(0, true);
        }

      },
      moveTabBg(id) {
        const rect = document.querySelector(`.teams-meetings-list-mid-tabs-tab${id}`).getBoundingClientRect();
        const rect2 = document.querySelector(`.teams-meetings-list-mid-tabs`).getBoundingClientRect();
        document.querySelector(`.teams-meetings-list-mid-tabs-active-bg`).style.left = `${rect.left - rect2.left}px`;
        document.querySelector(`.teams-meetings-list-mid-tabs-active-bg`).style.width = `${rect.width}px`;
      },


      people(name) {
        return this.$store.getters.people(name);
      },
      scrollToDate(date, disableTransition=true) {
        let d = set(date, { hours: 0, minutes: 0, seconds:0 })
        const scroll = this.$refs.scrollbar
        const scrollcont = this.$refs.scrollcontent
        const dateel = this.$refs[`anchor${format(d, 't')}`]
        if (dateel && dateel[0]) {
          const daterect = dateel[0].getBoundingClientRect()
          const sconrect = scrollcont.getBoundingClientRect()
          let y = daterect.top - sconrect.top
          const maxy = sconrect.height - scroll.scrollWrapperHeight
          y = Math.min(y, maxy)
          scroll.scrollToY(y, disableTransition)
        }
        
      },
      showCalendarDropdown() {
        if (!this.menuCalendarVisible) {
          this.$popper.show(
            {
              template: `
              <div style="padding: 10px;">
                <wl-calendar 
                  :defaultDate="currentDate"
                  :dateList="dateList" 
                  :headerVisible="true" 
                  @input="select"
                />
              </div>
              `,
              props: ['currentDate', 'dateList', 'onSelect'],
              methods: {
                select(date) {
                  this.onSelect(date);
                  this.$popper.hideAll();
                },
              }
            },
            {
              onSelect: (date) => {
                this.currentDate = date;
              },
              currentDate: this.currentDate,
              dateList: this.dateList,
            }, // component props
            {
              reference: this.$refs.btncal,
              closeTrigger: 'mousedown',
              arrowVisible: true,
              roundedCorner: true,
              borderRadius: '14px',
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              appendToBody: true,
              theme: `${this.theme} ${this.themeColor}`,
              options: {placement: 'bottom'},
            }, // popper props
            {
              opened: () => {this.menuCalendarVisible = true},
              closed: () => {this.menuCalendarVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },
      showListTypeDropdown() {
        if (!this.menuListTypeVisible) {
          this.$popper.show(
            {
              template: `
                <div class="common-menulist" style="width:150px;">
                  <div 
                    v-for="(m, idx) in listNames" 
                    :key="idx"
                    class="common-menulist-item common-menulist-item-32" 
                    @click="select(m)"
                  >
                    <wl-icon :name="listIcons[m.replace(/ /g, '')]" size="16" style="margin:0 6px 0 -4px;" />
                    <span class="lb">{{m}}</span>
                  </div>
                </div>
              `,
              props: ['listNames', 'listIcons', 'onSelect'],
              methods: {
                select(name) {
                  this.onSelect(name);
                  this.$popper.hideAll();
                },
              }
            },
            {
              onSelect: this.changeListType,
              listNames: this.listNames,
              listIcons: this.listIcons,
            }, // component props
            {
              reference: this.$refs.listtype.$el,
              closeTrigger: 'mousedown',
              arrowVisible: false,
              roundedCorner: true,
              borderRadius: '14px',
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              appendToBody: true,
              theme: `${this.theme} ${this.themeColor}`,
              options: {placement: 'bottom'},
            }, // popper props
            {
              opened: () => {this.menuListTypeVisible = true},
              closed: () => {this.menuListTypeVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },
      changeListType(t) {
        this.listType = t;
      },

      meet() {
        this.$store.commit('meetingTitle', `${this.me.name}'s Personal Room`);
        this.$store.commit('interstitialParams', {visible: true, host: true});
      },
      join(info, event, late) {
        this.$popper.hideAll();

        if (event) {
          event.stopPropagation();
        }
        this.$store.commit('meetingTitle', info.title);
        this.$store.commit('interstitialParams', {visible: true, host: false, late: late});
      },

      connectCal() {
        this.$store.commit('calendarMeetingsConnected', true);
        this.collapsed2 = true
      },

      tagClickHandler(evt, meeting, tag) {
        evt.stopPropagation()
        evt.preventDefault()

        if (tag.data == 'recordings') {

            let smartChapter = [
                {
                    name: 'Intro',
                    timespan: '00:00:00 - 00:02:59',
                    thumb: 'tmp_recording_thumb_3.png',
                },
                {
                    name: 'Show and Share',
                    timespan: '00:00:10 - 00:11:59',
                    thumb: 'tmp_recording_thumb_3.png',
                },
                {
                    name: 'Feedback',
                    timespan: '00:12:00 - 00:21:59',
                    thumb: 'tmp_recording_thumb_3.png',
                },
                {
                    name: 'Stand up',
                    timespan: '00:22:00 - 00:24:30',
                    thumb: 'tmp_recording_thumb_3.png',
                },
            ]
            this.$eventBus.$emit('open-recording-player-window', {
                meetingInfo: meeting,
                smartChapter: smartChapter,
            }, {})

        } else if (tag.data == 'meetingnotes') {
          //this.$store.commit('teamsMeetingOnloadData', {
          //  selectedMeeting: meeting.title,
          //  jumpto: null,
          //});

          this.$store.commit('selectedMeeting', meeting);
          this.popoutMeetingDetails(meeting)

        } else if (tag.data == 'actionitems') {
          //this.$store.commit('teamsMeetingOnloadData', {
          //  selectedMeeting: meeting.title,
          //  jumpto: 'actionitems',
          //});
          this.$store.commit('selectedMeeting', meeting);
          this.popoutMeetingDetails(meeting, 'actionitems')

        }
          
      },

      checkMeetingOnloadData() {
        if (this.teamsMeetingOnloadData) {
          let dat = this.teamsMeetingOnloadData
          let meeting
          for(let i=0; i<this.meetingList.length; i++) {
            let meetings = this.meetingList[i].meetings
            if (meetings) {
              for(let j=0; j<meetings.length; j++) {
                if (dat.selectedMeeting == meetings[j].title) {
                  meeting = meetings[j]
                  break
                }
              }
            }
            
          }
          
          this.$store.commit('selectedMeetingJumpto', dat.jumpto);
          this.$store.commit('selectedMeeting', meeting);
          //this.showMeetingDetails(meeting)
          this.popoutMeetingDetails(meeting)


          this.$store.commit('teamsMeetingOnloadData', null);
        }
      },

      openDetailsSidecar() {
        this.$store.commit('meetingsSidecarVisible', true);
        this.$store.commit('teamsSidecarName', null);
      },
      closeDetailsSidecar() {
        this.$store.commit('meetingsSidecarVisible', false);
      },
      isPopout() {
        let poped = false
        this.$window.exist('popout-meeting-details', val => {
          poped = val
          })
        return poped
      },
    }
}
</script>


<style lang="scss">
.teams-meetings {
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  border-radius: 12px 0 0px 0px;
  user-select: none;
  color: $text-color-primary-light-ui;

  .alertbanner {
    margin: 10px 24px -8px 24px;
  }

  &-split {
    flex-grow: 1;
    &-leftcol {
      display: flex;
      flex-direction: column;
    }
    &-rightcol {
      display: flex;
    }
  }
  
  &-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 20px;
    flex-grow: 1;
    flex-shrink: 1;

    &-top {
      @include flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 24px 28px 24px;

      &-left {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex-shrink: 1;
        flex-grow: 1;

        .title {
          font-weight: 600;
          font-size: 20px;
          margin-bottom: 4px;
        }
        .sub {
          display: flex;
          align-items: center;
          flex-shrink: 1;
          flex-grow: 1;
          overflow: hidden;

          .btn-pmr {
            @include flex;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin-left: -8px;

            &:hover {
              background-color: rgba($color: #FFFF, $alpha: .1);
            }
            &:active {
              background-color: rgba($color: #FFFF, $alpha: .2);
            }
          }

          .lb {
            font-size: 14px;
            font-weight: 600;
            opacity: .7;
            margin-left: 4px;
            margin-right: 8px;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            width: 10px;
            max-width: 260px;
            flex-shrink: 1;
            flex-grow: 1;
          }

          .btnr {
            @include flex(row, flex-start);
            flex-grow: 1;

            .btn-copy {
              @include flex;
              width: 28px;
              height: 28px;
              box-sizing: border-box;
              min-width: 0;
            }
          }
        }
      }

      &-right {
        display: flex;

        .btn {
          height: 32px;
          margin: 0 2px;
          padding: 0;
          min-width: 0;

          .md-button__children {
            font-size: 16px !important;
            margin: 0 12px;
            font-weight: 600;
          }

          .ico {
            margin-left: 4px;
          }
        }

        .clslb {
          margin-right: -8px;
        }

        .exp-arrow {
          @include flex;
          height: 32px;
          width: 32px;
          border-radius: 50%;
          margin-left: 8px;

          svg path {
            fill: #000000;
          }
        }
      }
    }

    &-meetingbtns {
      @include flex;
      width: 100%;
      margin-bottom: 24px;

      .itms {
        @include flex(row, space-between);
        max-width: 752px;
        height: 120px;
        flex-shrink: 1;
        flex-grow: 1;

        .itm {
          @include flex(column);
          max-width: 256px;
          flex-shrink: 1;
          flex-grow: 1;

          .btn {
            width: 52px;
            height: 52px;
            padding: 0;
            min-width: 0;
            margin-bottom: 12px;
          }

          .lb {
            @include flex;
            font-weight: 700;
            font-size: 16px;

            .ico {
              margin-left: 8px;
            }
          }
        }
      }
    }

    &-divider {
      width: 100%;
      background: rgba(255, 255, 255, 0.2);
      height: 1px;
      margin-bottom: 12px;
    }

    &-mid {
      position: relative;
      height: 44px;
      display: flex;
      justify-content: space-between;
      background: rgba($color: #000000, $alpha: 0.07);
      border-radius: 24px;
      user-select: none;
      margin: 0 20px 4px 20px;

      &-tabs {
        position: relative;
        height: 100%;
        padding: 10px;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        flex-grow: 1;

        &-active-bg {
          position: absolute;
          height: 28px;
          top: 8px;
          left: 10px;
          border-radius: 14px;
          transition: all 0.2s ease;
          background-color: rgba($color: #000000, $alpha: .2);
          pointer-events: none;
        }

        &-tab {
          height: 28px;
          border-radius: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          margin-right: 8px;
          pointer-events: auto;

          .lb {
            font-size: 14px;
            opacity: 0.7;
            transition: all 0.3s ease;
            pointer-events: none;
            font-weight: 600;
          }

          &:hover {
            .lb {
              opacity: 0.95;
            }
          }

          &.active {
            .lb {
              opacity: 0.95;
            }
          }
        }
      }

      &-right {
        @include flex(row, flex-end);
        flex-grow: 1;

        .btnitm.md-button {
          margin-left: 8px;
          min-width: 0;
          padding: 0 10px;

          .md-button__children {
            font-size: 14px;
          }
        }

        .cbox {
          @include flex;
          margin-right: 8px;

          .ico {
            margin-right: 4px;
          }
          .lb {
            flex-grow: 1;
            text-align: left;
            margin-right: 4px;
          }
          
        }

        .btngrp {
          @include flex;
          height: 28px;
          transform: rotate(0deg);
          overflow: hidden;
          box-sizing: border-box;
          border: 1px solid rgba($color: #FFFFFF, $alpha: .2);
          border-radius: 14px;

          .btn {
            height: 26px;
            border-radius: 13px;
            margin: 0;
          }
          .divider {
            border-left: 1px solid rgba($color: #FFFFFF, $alpha: .2);
            width: 0;
            height: 16px;
            margin: 0 4px;
          }
          .btnmd {
            @include flex;
            flex-flow: 1;
            border-radius: 0;

            .lb {
              @include flex;
              height: 20px;
              flex-grow: 1;
              padding: 0 10px;
              box-sizing: border-box;
              font-weight: 600;
              font-size: 14px;
            }

            &:hover {
              background-color: rgba($color: #FFFFFF, $alpha: .07);
            }
            &:active,&.active {
              background-color: rgba($color: #FFFFFF, $alpha: .11);
            }
          }
          .btn1 {
            @include flex;
            width: 28px;
            border-radius: 50%;

            &:hover {
              background-color: rgba($color: #FFFFFF, $alpha: .07);
            }
            &:active {
              background-color: rgba($color: #FFFFFF, $alpha: .11);
            }
          }
        }

      }
    }

    &-items {
      padding: 0 20px;
      width: 100%;
      flex-grow: 1;
      flex-shrink: 1;
      height: 100px;

      /* ------ type: list ------ */

      .item-date {
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        align-items: center;
        user-select: none;

        .date {
          display: flex;
          align-items: center;
          width: 100%;
          height: 32px;
          opacity: .95;
          font-size: 16px;
          margin-left: 8px;

          &.today {
            font-weight: 700;
          }
        }

        .item-meeting {
          position: relative;
          width: 100%;
          min-height: 54px;
          display: flex;
          align-items: center;
          margin: 4px 0;
          border-radius: 8px;
          transition: all .2s ease;

          .wrap {
            position: relative;
            display: flex;
            align-items: center;
            border-radius: 8px;
            overflow: hidden;
            transform: rotate(0deg);
            background-color: rgba($color: #000000, $alpha: 0.07);
            width: 100%;
            height: 100%;
          }

          &.past .mid {
            .row1, .row2 {
              .txt {
                opacity: .5;
              }
            }
          }

          .closeico {
            display: none;
            position: absolute;
            top: -4px;
            right: -4px;
            width: 16px;
            height: 16px;
          }

          .incoming-idx {
            position: absolute;
            left: 0;
            height: 100%;
            width: 8px;
            background-color: rgba($color: #000000, $alpha: 0.8);
          }

          .marker {
            @include flex;
            position: absolute;
            left: 0;
            flex-shrink: 0;
            width: 6px;
            height: 100%;
            min-height: 50px;
            overflow: hidden;

            &.solid-green {
              background: #1D805F;
            }
            &.solid-gray {
              background: rgba(255, 255, 255, 0.3);
            }
            &.dash-green {
              background: url(~@/assets/img/meeting-marker-green.svg) no-repeat center center;
            }
            &.dash-gray {
              background: url(~@/assets/img/meeting-marker-gray.svg) no-repeat center center;
            }
          }

          .left {
            width: 48px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            flex-grow: 0;
            margin: 0 5px 0 10px;
          }

          .mid {
            flex-grow: 1;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: 12px;

            .row1 {
              font-size: 16px;
              display: flex;
              align-items: center;

              .txt {
                opacity: 0.95;
                overflow:hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
                pointer-events: none;

                &.active {
                  font-weight: 700;
                }
              }
            }

            .row2 {
              display: flex;
              font-size: 14px;
              margin-top: -4px;
              align-items: center;

              .subline {
                overflow:hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
                pointer-events: none;
                opacity: .7;
              }

              .green {
                display: flex;
                align-items: center;
                color: $md-green-40;
              }
            }

            .row3 {
              display: flex;
              flex-wrap: wrap;
              margin-top: 4px;

              .tag {
                @include flex;
                height: 24px;
                border-radius: 4px;
                box-sizing: border-box;
                border: 1px solid rgba(255, 255, 255, 0.4);
                background: #262626;
                padding: 0 8px;
                margin-right: 8px;
                margin-bottom: 8px;
                user-select: none;
                font-size: 14px;

                &:hover {
                  border: 1px solid rgba(255, 255, 255, 0.6);
                }
                &:active {
                  border: 1px solid rgba(255, 255, 255, 0.8);
                }
              }
            }

            .divider {
              margin: 0 8px;
            }

          }

          .spacename {
            text-decoration: underline;
            margin-right: 12px;
          }

          .btns {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-right: 12px;

            .ico {
              margin-right: 4px;
            }

            .btn {
              min-width: 0;
              padding: 0 10px;
              font-size: 14px;
              font-weight: 600;
            }

            .btn-circle {
              width: 28px;
              padding: 0;
            }
          }

          .right {
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            margin-right: 4px;

            .ico {
              margin-right: 8px;
              opacity: .7;
            }
          }

          &:hover {
            background-color: rgba($color: #000000, $alpha: 0.1);

            .closeico {
              display: flex;
            }

            .mid {
              .row1 {
                .txt {
                  opacity: 0.95;
                }
              }
            }
          }
          
          &.active,
          &:active {
            background-color: rgba($color: #000000, $alpha: 0.15);

            .mid {
              .row1 {
                .txt {
                  opacity: 0.95;
                }
              }
            }
          }

        }

      }


      /* ----- type: day ------ */
      .items-day {
        margin-top: 20px;
        position: relative;
        transition: all .2s ease;

        .item-hour {
          position: relative;
          display: flex;
          height: 80px;
          z-index: 8;

          .lb {
            display: flex;
            justify-content: flex-end;
            width: 48px;
            font-size: 12px;
            opacity: .7;
            margin-right: 12px;
            margin-top: -9px;
          }
          .line {
            flex-grow: 1;
            border-top: 1px solid rgba($color: #000000, $alpha: .2);
          }
        }

        .nowtime {
          position: absolute;
          display: flex;
          align-items: center;
          height: 20px;
          width: 100%;
          z-index: 9;

          .lb {
            display: flex;
            justify-content: flex-end;
            width: 48px;
            font-size: 12px;
            line-height: 14px;
            font-weight: bold;
            margin-right: 12px;
            color: $md-red-50;
          }
          .dot {
            width: 8px;
            height: 8px;
            margin-left: -4px;
            border-radius: 50%;
            background: $md-red-50;
          }
          .line {
            flex-grow: 1;
            border-top: 2px solid $md-red-50;
            z-index: 9;
          }
        }

        .meetinglist {
          position: absolute;
          width: calc(100% - 60px);
          left: 60px;
          top: 0;
        }

        .item-meeting {
          position: absolute;
          border-radius: 4px;
          display: flex;
          background: var(--item-back-color);
          overflow: hidden;
          transform: rotate(0deg);

          .incoming-idx {
            position: absolute;
            left: 0;
            height: 100%;
            width: 4px;
            background-color: rgba($color: #000000, $alpha: .7);
          }

          .mid {
            height: 100%;
            flex-grow: 1;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            margin-right: 12px;
            margin-left: 10px;
            padding-top: 2px;

            .row1 {
              display: flex;
              font-size: 12px;

              .txt {
                opacity: 0.95;
                overflow:hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
                pointer-events: none;
              }
            }

            .row2 {
              display: flex;
              font-size: 12px;
              margin-top: -2px;

              .subline {
                overflow:hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
                pointer-events: none;
                opacity: 0.7;
              }
            }

          }

          .team {
            height: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            font-size: 12px;
            padding-bottom: 2px;
            color: $md-blue-50;
          }

          .right {
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            padding-right: 6px;
            padding-bottom: 6px;
            margin-left: 30px;

            .ico {
              margin-left: 6px;
              opacity: .7;
            }
          }

          &:hover {
            background: var(--item-back-hover);

            .mid {
              .row1 {
                .txt {
                  opacity: 0.95;
                }
              }
            }
          }
          
          &.active,
          &:active {
            background: var(--item-back-active);

            .mid {
              .row1 {
                .txt {
                  opacity: 0.95;
                }
              }
            }
          }
        }

        
      }
      
    }

  }
/*
  .fte-calendar {
    @include flex;
    margin-bottom: 110px;
    
    .phimg {
      position: relative;
      width: 592px;
      height: 182px;
      background: url(~@/assets/img/teams-meeting-connect-calendar.svg) no-repeat center center;
    }
    .phimg2 {
      position: relative;
      width: 473px;
      height: 206px;
      background: url(~@/assets/img/teams-meeting-connect-calendar-s.svg) no-repeat center center;
    }
  }

  .empty-state {
    @include flex;
    margin-bottom: 110px;

    .phimg {
      position: relative;
      width: 376px;
      height: 174px;
      background: url(~@/assets/img/empty-state-meetings-376x174.svg) no-repeat center center;
    }
  }
*/
  .fte-calendar {
    @include flex;
    margin-bottom: 110px;
    flex-grow: 1;

    .phimg {
      position: relative;
      width: 600px;
      height: 214px;
      background: url(~@/assets/img/fte-teams-meeting.svg) no-repeat center center;
    }
  }

  .split-gutter {
    background-color: rgba($color: #FFFFFF, $alpha: .2);
  }

  .teams-meetings-split-rightcol {
    position: relative;
    display: flex;
    flex-direction: column;
    padding-left: 24px;

    .hidden-coachmark-ref {
      position: absolute;
      top: 120px;
      left: 0;
    }
    
  }

}





/* theme ----- dark/hybrid */

.dark {
  .teams-meetings {
    color: $text-color-primary-dark-ui;

    &-list {

      &-top {
        &-right {
          .exp-arrow {
            svg path {
              fill: #FFFFFF;
            }
          }
        }
      }

      &-mid {
        background: rgba($color: #FFFFFF, $alpha: 0.07);

        &-tabs {
          &-active-bg {
            background-color: rgba($color: #FFFFFF, $alpha: .2);
          }
        }
      }

      &-items {

        /* ------ type: list ------ */

        .item-date {
          .item-meeting {
            background: rgba(255, 255, 255, 0.07);

            .incoming-idx {
              background-color: rgba($color: #FFFFFF, $alpha: 0.8);
            }

            .team {
              color: $text-color-hyperlink-dark-ui;
            }

            &:hover {
              background: rgba(255, 255, 255, 0.1);
            }
            
            &.active,
            &:active {
              background: rgba(255, 255, 255, 0.15);
            }
            
          }

        }


        /* ----- type: day ------ */
        .items-day {
          .item-hour {
            .line {
              border-top: 1px solid rgba($color: #FFFFFF, $alpha: .2);
            }
          }

          .nowtime {
            .lb {
              color: $md-red-40;
            }
            .dot {
              background: $md-red-40;
            }
            .line {
              border-top: 2px solid $md-red-40;
            }
          }

          .item-meeting {
            .incoming-idx {
              background-color: rgba($color: #FFFFFF, $alpha: .7);
            }
          }

        }
        
      }

    }

  }
}


.fte-post-test-meeting {
  @include flex(column);
  width: 100%;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: #000000;

  .topbar {
    width: 100%;
  }
  .content {
    position: relative;
    @include flex;
    width: 100%;
    flex-grow: 1;
    background: url(~@/assets/img/fte-post-test-meeting.svg) no-repeat center center;
  }
}

</style>
