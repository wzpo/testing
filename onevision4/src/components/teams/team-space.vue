<template>
    <div 
      class='space-content-area' 
      :class="[theme, {
        windowmode: isPopout,
        rounded: !isPopout,
      }]"
      :style="{
        background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
        borderTopRightRadius: !isPopout && teamsSidecarName ? '12px' : '0',
      }"
    >
        
      <topbar v-if="isPopout" type="" :active="active" :showLogo="false" class="space-popout-titlebar" :titleStyle="{marginLeft: '4px',}" @close="close" @mousedown="mousedown" />
      <team-space-header 
        :isPopout="isPopout"
        :isFav="isFav"
        :parentRect="parentRect"
        :spaceName="spaceName" 
        :isSpace="isSpace" 
        :team="team" 
        :teamColor="teamColor" 
        :spaceSize="spaceSize"
        :cover="cover"
        :coverExpanded="coverExpanded"
        :statusTxt="statusTxt"
        :people="people"
        :content="content"
        @tabchange="tabchange"
      />

      <wl-scrollbar 
        v-if="selectedTab === 'message' && !isFTE && !isPersonal"
        ref='messages'
        class="messages" 
        :alwaysVisible="false"
        :arrowVisible="$store.state.os==='win'"
        :theme="theme === 'dark' ? 'dark' : 'light'"
        @scroll="scroll"
      >
        <div class="list" ref="messagelist">
          <chat-item
            v-for="(p, index) in messages"
            :key="index"
            :type="p.type"
            :thread="p.thread"
            :date="p.date"
            :time="p.time"
            :name="p.name"
            :isbot="p.isbot"
            :msg="p.msg"
            :attachment="p.attachment"
            :title="p.title"
            :file="p.file"
            :icon="p.icon"
            :click="p.click"
            :replies="p.replies"
            :reactions="p.reactions"
            :meetinginfo="p.meetinginfo"
            @scrolltoend="scrollToEnd"
            tools="thread"
          ></chat-item>

          <div v-if="seenby" class="seenby" >
            <div class="lb">Seen by</div>
            <div class="avatars">
                <presence-avatar
                v-for="(p, idx) in seenbylist"
                :key="`seenby-item${idx}`"
                :title="p.name"
                :src="p.avatar ? avatarPath + p.avatar : ''" 
                :size="24" 
                :presence="p.status"
                :type="p.typing ? 'typing' : ''"
                :theme="theme"
                :color="'white'"
                :backgroundColor="'#545454'"
                class="avatar"
                v-tooltip="{
                    content: contactCardTemplate(p.name), 
                    html: true,
                    placement: 'top',
                    classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                    autoHide: false,
                    delay: 200,
                }"
            />
            </div>
          </div>
        </div>

        <div slot="overlay" class="messages-overlay">
          <md-button v-if="!isReplyButtonVisible && newRepliesButtonVisible" color="blue" aria-label="resume" size="28" class="btnup" @click="scrollToY(newRepliesScrollY, false)" >
            New replies
            <wl-icon
              name="arrow-up-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
              style="margin-left: 4px"
            />
          </md-button>
          <md-button v-if="!isEnd" color="blue" aria-label="resume" size="28" class="btndown" @click="scrollToEnd(false)" >
            <wl-icon
              name="arrow-down-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
            />
          </md-button>
        </div>

        

      </wl-scrollbar >

      <div v-if="isFTE" class="fte">
        <div class="tt">{{ `Welcome ${me.name.split(' ')[0]} 👋` }}</div>
        <div class="content">
          <wl-hot :rect="{x:103,y:183,w:57,h:30}" @click.native="() => { showInvite() }" />
          <wl-hot :rect="{x:370,y:183,w:63,h:30}" @click.native="() => { showGuide() }" />
        </div>
      </div>

      <div v-if="selectedTab === 'message'" class='inputbox' >
        <div v-if="inputboxDividerVisible" class="divider-h" style="position: absolute; top:0;"></div>
        <input 
          v-model="message" 
          :placeholder="`Write a message to ${spaceName}`" 
          v-on:keyup.enter="sendmsg"
          class="chatinput"
          :class="{narrow: spaceSize !=='normal'}"
        />

        <div class="tools" :class="{narrow: spaceSize !=='normal'}">
          <span class="icons">
            <svg width="220" height="24" viewBox="0 0 220 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 11C16.3674 11 16.2402 11.0527 16.1464 11.1464C16.0527 11.2402 16 11.3674 16 11.5V14C16 15.0609 15.5786 16.0783 14.8284 16.8284C14.0783 17.5786 13.0609 18 12 18C10.9391 18 9.92172 17.5786 9.17157 16.8284C8.42143 16.0783 8 15.0609 8 14V8.5C8 7.83696 8.26339 7.20107 8.73223 6.73223C9.20107 6.26339 9.83696 6 10.5 6C11.163 6 11.7989 6.26339 12.2678 6.73223C12.7366 7.20107 13 7.83696 13 8.5V14C13 14.2652 12.8946 14.5196 12.7071 14.7071C12.5196 14.8946 12.2652 15 12 15C11.7348 15 11.4804 14.8946 11.2929 14.7071C11.1054 14.5196 11 14.2652 11 14V8.5C11 8.36739 10.9473 8.24021 10.8536 8.14645C10.7598 8.05268 10.6326 8 10.5 8C10.3674 8 10.2402 8.05268 10.1464 8.14645C10.0527 8.24021 10 8.36739 10 8.5V14C10 14.5304 10.2107 15.0391 10.5858 15.4142C10.9609 15.7893 11.4696 16 12 16C12.5304 16 13.0391 15.7893 13.4142 15.4142C13.7893 15.0391 14 14.5304 14 14V8.5C14 7.57174 13.6313 6.6815 12.9749 6.02513C12.3185 5.36875 11.4283 5 10.5 5C9.57174 5 8.6815 5.36875 8.02513 6.02513C7.36875 6.6815 7 7.57174 7 8.5V14C7 15.3261 7.52678 16.5979 8.46447 17.5355C9.40215 18.4732 10.6739 19 12 19C13.3261 19 14.5979 18.4732 15.5355 17.5355C16.4732 16.5979 17 15.3261 17 14V11.5C17 11.3674 16.9473 11.2402 16.8536 11.1464C16.7598 11.0527 16.6326 11 16.5 11Z" fill="white" fill-opacity="0.7"/>
              <path d="M46.5001 12C46.4344 12 46.3694 12.0129 46.3087 12.038C46.248 12.0631 46.1929 12.0999 46.1465 12.1464C46.1 12.1928 46.0632 12.2479 46.0381 12.3086C46.013 12.3693 46.0001 12.4343 46.0001 12.5V14.7778C46.027 15.2045 45.8846 15.6246 45.6038 15.947C45.323 16.2694 44.9264 16.4681 44.5001 16.5H35.5001C35.0738 16.4681 34.6772 16.2694 34.3964 15.947C34.1156 15.6246 33.9732 15.2045 34.0001 14.7778V9.22219C33.9732 8.79549 34.1156 8.37539 34.3964 8.053C34.6772 7.7306 35.0738 7.53191 35.5001 7.50002H41.5015C41.6342 7.50002 41.7613 7.44734 41.8551 7.35357C41.9489 7.2598 42.0015 7.13262 42.0015 7.00002C42.0015 6.86741 41.9489 6.74023 41.8551 6.64646C41.7613 6.55269 41.6342 6.50002 41.5015 6.50002H35.5001C34.8083 6.5315 34.1571 6.83546 33.6887 7.34551C33.2203 7.85555 32.9727 8.53023 33.0001 9.22219V14.7778C32.9727 15.4698 33.2203 16.1445 33.6887 16.6545C34.1571 17.1646 34.8083 17.4685 35.5001 17.5H44.5001C45.1919 17.4685 45.8431 17.1646 46.3115 16.6545C46.7799 16.1445 47.0275 15.4698 47.0001 14.7778V12.5C47.0001 12.4343 46.9872 12.3693 46.9621 12.3086C46.937 12.2479 46.9002 12.1928 46.8537 12.1464C46.8073 12.0999 46.7522 12.0631 46.6915 12.038C46.6308 12.0129 46.5658 12 46.5001 12Z" fill="white" fill-opacity="0.7"/>
              <path d="M42.5001 9.5H44.0001V11C44.0001 11.1326 44.0528 11.2598 44.1465 11.3536C44.2403 11.4473 44.3675 11.5 44.5001 11.5C44.6327 11.5 44.7599 11.4473 44.8537 11.3536C44.9474 11.2598 45.0001 11.1326 45.0001 11V9.5H46.5001C46.6327 9.5 46.7599 9.44732 46.8537 9.35355C46.9474 9.25979 47.0001 9.13261 47.0001 9C47.0001 8.86739 46.9474 8.74021 46.8537 8.64645C46.7599 8.55268 46.6327 8.5 46.5001 8.5H45.0001V7C45.0001 6.86739 44.9474 6.74021 44.8537 6.64645C44.7599 6.55268 44.6327 6.5 44.5001 6.5C44.3675 6.5 44.2403 6.55268 44.1465 6.64645C44.0528 6.74021 44.0001 6.86739 44.0001 7V8.5H42.5001C42.3675 8.5 42.2403 8.55268 42.1465 8.64645C42.0528 8.74021 42.0001 8.86739 42.0001 9C42.0001 9.13261 42.0528 9.25979 42.1465 9.35355C42.2403 9.44732 42.3675 9.5 42.5001 9.5Z" fill="white" fill-opacity="0.7"/>
              <path d="M61.4999 7H65.9994L65.9999 15.5C65.9999 15.6326 66.0526 15.7598 66.1463 15.8536C66.2401 15.9473 66.3673 16 66.4999 16C66.6325 16 66.7597 15.9473 66.8534 15.8536C66.9472 15.7598 66.9999 15.6326 66.9999 15.5L66.9994 7H71.4999C71.6325 7 71.7597 6.94732 71.8534 6.85355C71.9472 6.75979 71.9999 6.63261 71.9999 6.5C71.9999 6.36739 71.9472 6.24021 71.8534 6.14645C71.7597 6.05268 71.6325 6 71.4999 6H61.4999C61.3673 6 61.2401 6.05268 61.1463 6.14645C61.0526 6.24021 60.9999 6.36739 60.9999 6.5C60.9999 6.63261 61.0526 6.75979 61.1463 6.85355C61.2401 6.94732 61.3673 7 61.4999 7Z" fill="white" fill-opacity="0.7"/>
              <path d="M68.9999 9C68.8673 9 68.7401 9.05268 68.6463 9.14645C68.5526 9.24021 68.4999 9.36739 68.4999 9.5C68.4999 9.63261 68.5526 9.75979 68.6463 9.85355C68.7401 9.94732 68.8673 10 68.9999 10H71.4994V15.5C71.4994 15.6326 71.5521 15.7598 71.6458 15.8536C71.7396 15.9473 71.8668 16 71.9994 16C72.132 16 72.2592 15.9473 72.3529 15.8536C72.4467 15.7598 72.4994 15.6326 72.4994 15.5V10H74.4999C74.6325 10 74.7597 9.94732 74.8534 9.85355C74.9472 9.75979 74.9999 9.63261 74.9999 9.5C74.9999 9.36739 74.9472 9.24021 74.8534 9.14645C74.7597 9.05268 74.6325 9 74.4999 9H68.9999Z" fill="white" fill-opacity="0.7"/>
              <path d="M74.4999 17H61.4999C61.3673 17 61.2401 17.0527 61.1463 17.1464C61.0526 17.2402 60.9999 17.3674 60.9999 17.5C60.9999 17.6326 61.0526 17.7598 61.1463 17.8536C61.2401 17.9473 61.3673 18 61.4999 18H74.4999C74.6325 18 74.7597 17.9473 74.8534 17.8536C74.9472 17.7598 74.9999 17.6326 74.9999 17.5C74.9999 17.3674 74.9472 17.2402 74.8534 17.1464C74.7597 17.0527 74.6325 17 74.4999 17Z" fill="white" fill-opacity="0.7"/>
              <path d="M96 5C94.6155 5 93.2622 5.41054 92.111 6.17971C90.9599 6.94888 90.0627 8.04213 89.5328 9.32122C89.003 10.6003 88.8644 12.0078 89.1345 13.3656C89.4046 14.7235 90.0713 15.9708 91.0503 16.9497C92.0292 17.9287 93.2765 18.5954 94.6344 18.8655C95.9922 19.1356 97.3997 18.997 98.6788 18.4672C99.9579 17.9373 101.051 17.0401 101.82 15.889C102.589 14.7378 103 13.3845 103 12C102.998 10.1441 102.26 8.36491 100.947 7.05262C99.6351 5.74033 97.8559 5.00214 96 5ZM96 18C94.8133 18 93.6533 17.6481 92.6666 16.9888C91.6799 16.3295 90.9109 15.3925 90.4567 14.2961C90.0026 13.1997 89.8838 11.9933 90.1153 10.8295C90.3468 9.66557 90.9182 8.59647 91.7574 7.75736C92.5965 6.91824 93.6656 6.3468 94.8295 6.11529C95.9933 5.88378 97.1997 6.0026 98.2961 6.45672C99.3925 6.91085 100.33 7.67988 100.989 8.66658C101.648 9.65327 102 10.8133 102 12C101.998 13.5908 101.366 15.1158 100.241 16.2407C99.1159 17.3655 97.5908 17.9982 96 18Z" fill="white" fill-opacity="0.7"/>
              <path d="M93.75 11.5C94.1642 11.5 94.5 11.1642 94.5 10.75C94.5 10.3358 94.1642 10 93.75 10C93.3358 10 93 10.3358 93 10.75C93 11.1642 93.3358 11.5 93.75 11.5Z" fill="white" fill-opacity="0.7"/>
              <path d="M98.25 11.5C98.6642 11.5 99 11.1642 99 10.75C99 10.3358 98.6642 10 98.25 10C97.8358 10 97.5 10.3358 97.5 10.75C97.5 11.1642 97.8358 11.5 98.25 11.5Z" fill="white" fill-opacity="0.7"/>
              <path d="M99.1803 13.0339C99.0566 12.9864 98.9191 12.9899 98.7979 13.0435C98.6768 13.0971 98.5818 13.1966 98.5338 13.3201C98.3232 13.8185 97.9703 14.2438 97.5192 14.5426C97.0681 14.8415 96.5389 15.0007 95.9978 15.0002C95.4567 14.9997 94.9277 14.8396 94.4772 14.54C94.0266 14.2404 93.6744 13.8145 93.4647 13.3156C93.441 13.2538 93.4053 13.1973 93.3597 13.1494C93.314 13.1014 93.2593 13.0631 93.1986 13.0365C93.138 13.0098 93.0727 12.9955 93.0065 12.9944C92.9403 12.9932 92.8745 13.0052 92.813 13.0297C92.7515 13.0541 92.6954 13.0906 92.6481 13.1368C92.6008 13.1831 92.5631 13.2384 92.5373 13.2993C92.5115 13.3603 92.498 13.4258 92.4977 13.492C92.4974 13.5582 92.5103 13.6238 92.5355 13.685C92.8194 14.3707 93.3004 14.9568 93.9175 15.3689C94.5347 15.7811 95.2603 16.0009 96.0024 16.0004C96.7446 15.9999 97.4699 15.7792 98.0865 15.3663C98.7032 14.9533 99.1834 14.3667 99.4664 13.6806C99.4901 13.6194 99.5015 13.554 99.5 13.4884C99.4984 13.4227 99.484 13.358 99.4574 13.2979C99.4308 13.2379 99.3927 13.1836 99.3451 13.1383C99.2976 13.093 99.2415 13.0575 99.1803 13.0339Z" fill="white" fill-opacity="0.7"/>
              <path d="M127.5 5H120.5C119.837 5.00078 119.202 5.26442 118.733 5.7331C118.264 6.20177 118.001 6.8372 118 7.5V16.5C118.001 17.1628 118.264 17.7982 118.733 18.2669C119.202 18.7356 119.837 18.9992 120.5 19H127.5C128.163 18.9992 128.798 18.7356 129.267 18.2669C129.736 17.7982 129.999 17.1628 130 16.5V7.5C129.999 6.8372 129.736 6.20177 129.267 5.7331C128.798 5.26442 128.163 5.00078 127.5 5ZM129 16.5C129 16.8977 128.841 17.279 128.56 17.5602C128.279 17.8414 127.898 17.9996 127.5 18H120.5C120.102 17.9996 119.721 17.8414 119.44 17.5602C119.159 17.279 119 16.8977 119 16.5V7.5C119 7.10231 119.159 6.72103 119.44 6.43982C119.721 6.15861 120.102 6.00044 120.5 6H127.5C127.898 6.00044 128.279 6.15861 128.56 6.43982C128.841 6.72103 129 7.10231 129 7.5V16.5Z" fill="white" fill-opacity="0.7"/>
              <path d="M121.94 13.41C122.101 13.3945 122.262 13.4391 122.392 13.535C122.522 13.631 122.612 13.7717 122.645 13.93H123.48C123.423 13.6228 123.256 13.347 123.01 13.1546C122.701 12.9257 122.324 12.8093 121.94 12.825C121.499 12.8033 121.067 12.9497 120.73 13.2347C120.54 13.4227 120.393 13.6496 120.298 13.8999C120.204 14.1502 120.166 14.418 120.185 14.6847C120.158 15.1743 120.305 15.6576 120.6 16.0495C120.744 16.2221 120.926 16.3593 121.131 16.4504C121.337 16.5415 121.56 16.5841 121.785 16.5749C121.977 16.5865 122.169 16.5558 122.348 16.485C122.527 16.4141 122.688 16.3049 122.82 16.1649L122.94 16.4999H123.48V14.495H121.905V15.04H122.755V15.295C122.757 15.3835 122.739 15.4713 122.704 15.5524C122.668 15.6335 122.616 15.706 122.55 15.765C122.469 15.8397 122.373 15.8976 122.269 15.9353C122.166 15.9731 122.055 15.9899 121.945 15.985C121.832 15.989 121.72 15.9672 121.617 15.9212C121.514 15.8753 121.423 15.8065 121.35 15.72C121.133 15.4205 121.03 15.0535 121.06 14.685C121.039 14.3569 121.116 14.03 121.28 13.745C121.351 13.6364 121.449 13.5484 121.565 13.4896C121.681 13.4308 121.81 13.4034 121.94 13.41Z" fill="white" fill-opacity="0.7"/>
              <path d="M124.935 12.8996H124.095V16.4997H124.935V12.8996Z" fill="white" fill-opacity="0.7"/>
              <path d="M125.583 16.4995H126.424V15.0445H127.714V14.4645H126.424V13.5045H127.868V12.8995H125.583V16.4995Z" fill="white" fill-opacity="0.7"/>
              <path d="M150.43 12.3996C150.209 12.2339 149.896 12.2786 149.73 12.4996C149.564 12.7205 149.609 13.0339 149.83 13.1996L150.367 13.6027C151.412 14.386 152.848 14.386 153.892 13.6027L154.43 13.1996C154.651 13.0339 154.696 12.7205 154.53 12.4996C154.364 12.2786 154.051 12.2339 153.83 12.3996L153.292 12.8027C152.603 13.3194 151.656 13.3194 150.967 12.8027L150.43 12.3996Z" fill="white" fill-opacity="0.7"/>
              <path d="M154.942 9.61206C154.942 10.1989 154.537 10.6746 154.036 10.6746C153.536 10.6746 153.13 10.1989 153.13 9.61206C153.13 9.02526 153.536 8.54956 154.036 8.54956C154.537 8.54956 154.942 9.02526 154.942 9.61206Z" fill="white" fill-opacity="0.7"/>
              <path d="M149.71 8.56031C149.509 8.51107 149.306 8.63424 149.257 8.83541C149.207 9.03658 149.331 9.23957 149.532 9.28881C149.714 9.3333 149.985 9.42754 150.231 9.56512C149.788 9.59238 149.454 9.73819 149.274 9.87933C149.111 10.007 149.082 10.2427 149.21 10.4058C149.337 10.5688 149.573 10.5975 149.736 10.4698C149.823 10.4018 150.286 10.1801 151.014 10.4174C151.137 10.4577 151.272 10.4313 151.372 10.3477C151.471 10.2641 151.52 10.1352 151.501 10.0068C151.43 9.51853 151.045 9.18391 150.712 8.97784C150.364 8.76229 149.971 8.6242 149.71 8.56031Z" fill="white" fill-opacity="0.7"/>
              <path d="M148.63 5.2998C147.249 5.2998 146.13 6.41903 146.13 7.79972V14.2994C146.13 15.6801 147.249 16.7994 148.63 16.7994H150.13V17.7993C150.13 18.5381 150.988 18.9433 151.559 18.4763L151.565 18.4709L153.009 17.2489C153.366 16.9582 153.812 16.7994 154.272 16.7994H155.38C156.761 16.7994 157.88 15.6801 157.88 14.2994V7.78771C157.88 6.41368 156.766 5.2998 155.392 5.2998H148.63ZM147.13 7.79972C147.13 6.97136 147.801 6.2998 148.63 6.2998H155.392C156.214 6.2998 156.88 6.96596 156.88 7.78771V14.2994C156.88 15.1278 156.208 15.7994 155.38 15.7994H154.272C153.58 15.7994 152.909 16.0389 152.373 16.4775L152.366 16.4828L151.13 17.5294V16.7993C151.13 16.247 150.682 15.7994 150.13 15.7994H148.63C147.801 15.7994 147.13 15.1278 147.13 14.2994V7.79972Z" fill="white" fill-opacity="0.7"/>
              <path d="M180 5C178.912 4.999 177.839 5.25149 176.866 5.73744C175.893 6.22338 175.047 6.92942 174.394 7.79952C173.741 8.66962 173.3 9.67986 173.106 10.7501C172.912 11.8203 172.97 12.9211 173.275 13.965C173.58 15.009 174.125 15.9674 174.865 16.7643C175.605 17.5612 176.521 18.1746 177.54 18.5559C178.559 18.9371 179.652 19.0758 180.734 18.9608C181.815 18.8457 182.855 18.4803 183.771 17.8933C183.826 17.8577 183.874 17.8116 183.911 17.7576C183.949 17.7036 183.975 17.6427 183.989 17.5785C184.003 17.5143 184.004 17.448 183.992 17.3834C183.98 17.3188 183.956 17.2571 183.92 17.2019C183.885 17.1467 183.839 17.099 183.785 17.0617C183.731 17.0243 183.67 16.9979 183.606 16.984C183.541 16.9701 183.475 16.969 183.41 16.9808C183.346 16.9925 183.284 17.0169 183.229 17.0525C182.106 17.7689 180.777 18.0912 179.451 17.9687C178.125 17.8462 176.878 17.2858 175.905 16.376C174.933 15.4661 174.291 14.2584 174.081 12.9434C173.871 11.6284 174.104 10.2809 174.745 9.11329C175.385 7.94569 176.396 7.02443 177.618 6.49478C178.84 5.96513 180.203 5.85722 181.493 6.18806C182.783 6.51889 183.926 7.26966 184.742 8.32199C185.558 9.37431 186.001 10.6683 186 12C186 14 185.186 14 184.749 14C184.434 14.0098 184.127 13.8964 183.894 13.6839C183.661 13.4714 183.519 13.1765 183.5 12.8616V9C183.5 8.86739 183.447 8.74022 183.354 8.64645C183.26 8.55268 183.133 8.5 183 8.5C182.867 8.5 182.74 8.55268 182.646 8.64645C182.553 8.74022 182.5 8.86739 182.5 9V9.5568C181.997 9.04131 181.347 8.69358 180.639 8.56105C179.931 8.42853 179.2 8.51766 178.544 8.81629C177.889 9.11493 177.341 9.60851 176.977 10.2297C176.612 10.8509 176.448 11.5694 176.507 12.2873C176.566 13.0051 176.845 13.6873 177.306 14.2407C177.767 14.7942 178.387 15.1919 179.083 15.3797C179.778 15.5675 180.515 15.5361 181.191 15.2899C181.868 15.0437 182.453 14.5947 182.865 14.0041C183.075 14.3101 183.356 14.5606 183.685 14.7341C184.013 14.9075 184.378 14.9988 184.75 15C186.243 15 187 13.991 187 12C186.998 10.1441 186.26 8.36491 184.947 7.05262C183.635 5.74033 181.856 5.00215 180 5ZM179.999 14.5008C179.505 14.5008 179.022 14.3541 178.611 14.0794C178.199 13.8047 177.879 13.4143 177.69 12.9575C177.501 12.5006 177.451 11.998 177.547 11.513C177.644 11.0281 177.882 10.5826 178.232 10.233C178.581 9.88335 179.027 9.64525 179.512 9.54879C179.997 9.45233 180.499 9.50183 180.956 9.69105C181.413 9.88027 181.803 10.2007 182.078 10.6118C182.353 11.023 182.499 11.5063 182.499 12.0008C182.499 12.6635 182.235 13.2989 181.766 13.7676C181.298 14.2362 180.662 14.4999 179.999 14.5008Z" fill="white" fill-opacity="0.7"/>
              <path d="M212.968 8.49518L209.47 5.97859C209.044 5.66721 208.529 5.49929 208.001 5.49902C207.473 5.49876 206.959 5.66617 206.532 5.97712L203.03 8.49665C202.711 8.72894 202.452 9.03312 202.273 9.38445C202.094 9.73579 202.001 10.1244 202 10.5187V16.0001C202.001 16.6629 202.265 17.2983 202.733 17.767C203.202 18.2356 203.837 18.4993 204.5 18.5001H211.5C212.163 18.4993 212.798 18.2356 213.267 17.767C213.736 17.2983 213.999 16.6629 214 16.0001V10.5186C213.999 10.124 213.906 9.73501 213.726 9.38341C213.547 9.03181 213.287 8.72749 212.968 8.49518ZM213 16.0001C213 16.3978 212.842 16.779 212.56 17.0602C212.279 17.3415 211.898 17.4996 211.5 17.5001H204.5C204.102 17.4996 203.721 17.3415 203.44 17.0602C203.159 16.779 203.001 16.3978 203 16.0001V10.5186C203 10.2825 203.056 10.0497 203.163 9.83911C203.27 9.62856 203.425 9.44616 203.616 9.30671L207.118 6.78718C207.374 6.60004 207.684 6.49932 208.001 6.49958C208.319 6.49984 208.628 6.60108 208.884 6.78865L212.382 9.30524C212.574 9.44471 212.729 9.62726 212.836 9.83808C212.944 10.0489 213 10.2821 213 10.5186V16.0001Z" fill="white" fill-opacity="0.7"/>
              <path d="M209.438 11.8839C209.711 11.6015 209.895 11.2451 209.967 10.8591C210.038 10.473 209.995 10.0744 209.841 9.71295C209.688 9.3515 209.432 9.04318 209.104 8.82644C208.777 8.6097 208.393 8.49413 208 8.49413C207.607 8.49413 207.224 8.6097 206.896 8.82644C206.569 9.04318 206.312 9.3515 206.159 9.71295C206.006 10.0744 205.962 10.473 206.034 10.8591C206.105 11.2451 206.289 11.6015 206.562 11.8839C206.104 12.1257 205.718 12.4844 205.444 12.9236C205.17 13.3628 205.016 13.8668 205 14.3843C205 14.7086 205.143 15.3087 206.097 15.6881C206.707 15.9081 207.352 16.0148 208 16.003C209.384 16.003 211 15.5792 211 14.3843C210.984 13.8668 210.831 13.3628 210.556 12.9236C210.282 12.4844 209.896 12.1257 209.438 11.8839ZM208 9.50007C208.198 9.50007 208.391 9.55872 208.556 9.6686C208.72 9.77848 208.848 9.93466 208.924 10.1174C209 10.3001 209.019 10.5012 208.981 10.6952C208.942 10.8891 208.847 11.0673 208.707 11.2072C208.567 11.347 208.389 11.4423 208.195 11.4809C208.001 11.5194 207.8 11.4996 207.617 11.4239C207.435 11.3483 207.279 11.2201 207.169 11.0556C207.059 10.8912 207 10.6979 207 10.5001C207 10.235 207.106 9.98081 207.293 9.79334C207.481 9.60588 207.735 9.50042 208 9.50007ZM208 15.003C206.779 15.003 206 14.6368 206 14.3843C206.032 13.8753 206.256 13.3975 206.628 13.0482C206.999 12.699 207.49 12.5045 208 12.5045C208.51 12.5045 209.001 12.699 209.373 13.0482C209.744 13.3975 209.969 13.8753 210 14.3843C210 14.6368 209.221 15.003 208 15.003Z" fill="white" fill-opacity="0.7"/>
            </svg>
          </span>
<!-- icon: people outside company !!!!!!
          <svg class="warning" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.125 11.221V11.8748C11.125 11.9743 11.1645 12.0697 11.2348 12.14C11.3052 12.2103 11.4005 12.2498 11.5 12.2498C11.5995 12.2498 11.6948 12.2103 11.7652 12.14C11.8355 12.0697 11.875 11.9743 11.875 11.8748V11.221C11.875 11.1216 11.8355 11.0262 11.7652 10.9559C11.6948 10.8856 11.5995 10.846 11.5 10.846C11.4005 10.846 11.3052 10.8856 11.2348 10.9559C11.1645 11.0262 11.125 11.1216 11.125 11.221Z" fill="#F2990A"/>
            <path d="M11.4999 13.5C11.7071 13.5 11.8749 13.3321 11.8749 13.125C11.8749 12.9179 11.7071 12.75 11.4999 12.75C11.2928 12.75 11.1249 12.9179 11.1249 13.125C11.1249 13.3321 11.2928 13.5 11.4999 13.5Z" fill="#F2990A"/>
            <path d="M14.8691 13.5057L12.376 9.00471L12.3701 8.99494C12.2816 8.84324 12.1548 8.71752 12.0023 8.63044C11.8497 8.54335 11.677 8.49797 11.5014 8.49886C11.3258 8.49975 11.1535 8.54688 11.0019 8.63551C10.8502 8.72414 10.7246 8.85114 10.6377 9.00373L8.13623 13.4959C8.04769 13.6479 8.0008 13.8206 8.00029 13.9965C7.99978 14.1724 8.04566 14.3454 8.13331 14.4979C8.22096 14.6504 8.34728 14.7771 8.49953 14.8652C8.65178 14.9534 8.82458 14.9998 9.00049 14.9998H13.9995C14.1745 14.9998 14.3464 14.9539 14.498 14.8667C14.6497 14.7795 14.7758 14.654 14.8639 14.5028C14.9519 14.3515 14.9987 14.1799 14.9996 14.0049C15.0005 13.83 14.9556 13.6578 14.8691 13.5057ZM9.00537 13.9911L11.5054 9.49692L13.9995 13.9998L9.00537 13.9911Z" fill="#F2990A"/>
            <path d="M9.72168 7.1195C9.48004 7.00482 9.23118 6.906 8.97668 6.82367C9.51608 6.4104 9.91238 5.83846 10.1099 5.18827C10.3073 4.53809 10.296 3.84236 10.0776 3.19891C9.85913 2.55547 9.44449 1.99669 8.89198 1.60113C8.33946 1.20557 7.67686 0.99314 6.99735 0.993707C6.31783 0.994274 5.65559 1.20781 5.10373 1.60429C4.55188 2.00077 4.13817 2.56025 3.92079 3.20405C3.70341 3.84786 3.69328 4.5436 3.89184 5.19346C4.0904 5.84332 4.48765 6.4146 5.02774 6.82696C2.71084 7.60096 1 9.67538 1 12.0458C1 14.0819 3.9575 14.9105 6.48974 15.0009C6.49609 15.0014 6.50196 15.0014 6.5083 15.0014C6.63922 15.0011 6.76483 14.9496 6.85814 14.8577C6.95144 14.7659 7.005 14.6411 7.00731 14.5102C7.00961 14.3793 6.96047 14.2527 6.87045 14.1577C6.78043 14.0626 6.65671 14.0067 6.52588 14.0019C3.90332 13.9076 2 13.0854 2 12.0458C2 9.58144 4.28955 7.4999 7 7.4999C7.79195 7.49747 8.57406 7.67529 9.28711 8.0199C9.34625 8.04863 9.41049 8.06542 9.47613 8.06929C9.54177 8.07316 9.60753 8.06405 9.66965 8.04247C9.73176 8.02088 9.789 7.98726 9.8381 7.94352C9.8872 7.89977 9.92718 7.84678 9.95577 7.78756C9.98435 7.72834 10.001 7.66406 10.0047 7.59841C10.0084 7.53276 9.99908 7.46702 9.97733 7.40496C9.95559 7.3429 9.92181 7.28575 9.87794 7.23676C9.83407 7.18778 9.78098 7.14793 9.72168 7.1195ZM4.75001 4.24985C4.75001 3.80484 4.88197 3.36983 5.1292 2.99981C5.37643 2.6298 5.72783 2.34142 6.13897 2.17112C6.5501 2.00082 7.0025 1.95626 7.43896 2.04308C7.87541 2.1299 8.27633 2.34419 8.59099 2.65886C8.90566 2.97353 9.11995 3.37444 9.20677 3.81089C9.29359 4.24735 9.24903 4.69975 9.07873 5.11089C8.90844 5.52202 8.62005 5.87342 8.25004 6.12065C7.88003 6.36789 7.44501 6.49985 7 6.49985C6.40347 6.4992 5.83155 6.26193 5.40973 5.84012C4.98792 5.4183 4.75066 4.84639 4.75001 4.24985Z" fill="#F2990A"/>
          </svg>
-->
          <div class="messaging-input-toolbar-spacer"></div>
          <span v-show="!shrinkTrigger('.fornewline')" class="fornewline">Shift + Enter for a new line</span>
        </div>

        <div class="send" :class="{disabled: !message}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.725 7.55265L1.72502 1.05265C1.6373 1.0088 1.53862 0.991692 1.44126 1.00347C1.3439 1.01524 1.25214 1.05537 1.17741 1.11887C1.10267 1.18237 1.04824 1.26644 1.0209 1.36063C0.993559 1.45481 0.994503 1.55495 1.02362 1.6486L3.00112 8L1.02362 14.3515C0.994433 14.4451 0.993442 14.5453 1.02077 14.6395C1.04809 14.7337 1.10253 14.8178 1.17729 14.8813C1.25206 14.9448 1.34385 14.9849 1.44124 14.9966C1.53863 15.0083 1.63732 14.9912 1.72502 14.9472L14.725 8.4472C14.8081 8.40569 14.878 8.34185 14.9268 8.26285C14.9757 8.18385 15.0015 8.09281 15.0015 7.99993C15.0015 7.90705 14.9757 7.816 14.9268 7.737C14.878 7.658 14.8081 7.59417 14.725 7.55265ZM2.32732 2.4721L12.383 7.5H3.89267L2.32732 2.4721ZM3.89267 8.5H12.383L2.32732 13.5278L3.89267 8.5Z" fill="white" fill-opacity="0.4"/>
          </svg>
        </div>

      </div>

      <!-- people tab -->
      <team-space-people 
        v-if="selectedTab === 'people' && !isFTE && !isPersonal"
        :people="people"
      />

      <!-- content tab -->
      <team-space-content 
        v-if="selectedTab === 'content' && !isFTE && !isPersonal" 
        :content="content"
      />

      <!-- meetings tab -->
      <team-space-meetings 
        v-if="selectedTab === 'meetings' && !isFTE && !isPersonal" 
        :meetings="meetings"
      />

    </div>
</template>

<script>
import _ from 'lodash'

export default {
    props:{
      parentRect: { // data comes from Windows.vue, WindowsContainer.vue
        type: DOMRect
      },
      active: { // data comes from Windows.vue, WindowsContainer.vue
        type: Boolean,
        default: true,
      },
      isPopout: Boolean,
      isFav: Boolean,
      id: String,
      spaceName: String,
      isPersonal: Boolean,
      isSpace: Boolean,
      team: String,
      statusTxt: String,
      teamColor: Object,
      cover: Number,
      coverExpanded: Boolean,
      spaceSize: {
        type: String,
        default: 'normal',
      },
      people: Array,
      content: Object,
      meetings: Array,
      seenby: Array,
      newRepliesButtonVisible: Boolean,
      scrollY: Number,
      newRepliesScrollY: Number,
    },
    data() {
      return {
        selectorPrefix: '',
        message: "",
        selectedTab: 'message',
        inputboxDividerVisible: false,
        fornewlineVisible: true,

        shrinkElements: [],
        hideableElementsAll: [
          {
            selector: '.fornewline',
          },
          
        ],
        hideableElements: [],
        isEnd: false,
        isReplyButtonVisible: false,
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
      me() {
        return this.$store.getters.me;
      },
      enabledApps() {
        return this.$store.state.enabledApps;
      },
      spaceMsgList() {
        return this.$store.state.spaceMsgList;
      },
      spaceList() {
        return this.$store.state.spaceList;
      },
      spaceListTabId() {
        return this.$store.state.spaceListTabId;
      },
      publicSpaceHomepageVisible() {
        return this.$store.state.publicSpaceHomepageVisible;
      },
      activePopoutSpaceIdList() {
        return this.$store.state.activePopoutSpaceIdList;
      },
      messages() {
        return this.spaceMsgList[this.id];
      },
      seenbylist() {
        let list = []
        if (this.seenby) {
          let len = this.seenby.length
          for(let i=0; i<len; i++){
            let itm = this.seenby[i]
            let people = this.$store.getters.people(itm.name)
            let obj = Object.assign(people, itm)
            list.push(obj)
          }
        }
        return list;
      },
      avatarPath(){
        return this.$store.state.avatarPath;
      },
      isFTE(){
        return this.$store.state.isFTE;
      },
      teamsSidecarName(){
        return this.$store.state.teamsSidecarName;
      },
    },
    beforeMount() {
      this.selectorPrefix = this.isPopout ? '.windowmode' : ''
    },
    mounted(){
      this.$nextTick(() => {
        const el = document.querySelector(`${this.selectorPrefix}.space-content-area .messages`)
        if (el) {
          el.style.height = '100px'; //change from 440px to 100px, for scrollbar + window-resize-min-height purpose

          if(!this.scrollY) {
            this.scrollToEnd();
          } else {
            requestAnimationFrame(() => {
              console.log(this.scrollY)
              this.scrollToY(this.scrollY, true);
            })
          }
        }
        
      })

      // for resize shrink 
      this.hideableElements = this.hideableElementsAll.filter(
        itm => {
          var el = document.querySelector(itm.selector);
          return el !== null
        }
      );
      this.$eventBus.$on('teams-resizing', this.onAppResizing);
    },
    beforeDestroy() {
      this.$eventBus.$off('teams-resizing', this.onAppResizing);
    },
    watch: {
      parentRect(val){
        const rect = {
          width: val.width,
          height: val.height,
          left: val.left,
          top: val.top,
          right: val.right,
          bottom: val.bottom,
        }
        this.$store.commit('popoutSpaceChangedRect', rect);
        this.onAppResizing()
      },
      spaceName() {
        this.$nextTick(() => {
          this.scrollToEnd();
        })
      },
      id() {
        // mark as read
        /*
        var msgs = _.cloneDeep(this.spaceMsgList);
        var lst = msgs[this.id] || []
        for(var i=0; i<lst.length; i++) {
          lst[i].unread = false;
        }
        msgs[this.id] = lst
        this.$store.commit('spaceMsgList', msgs);
        */

        // mark as read
        let slist = this.spaceList.slice()
        let len = slist.length
        for(let i=0; i<len; i++) {
          let lst = slist[i]
          let p = lst.find(
            itm => itm.name.replace(/ /g, '_') === this.id
          );
          if (p) {
            p.unread = false
          }
        }
        this.$store.commit('spaceList', slist);
        
      },
      messages() {
        this.$nextTick(() => {
          this.scrollToEnd();
        })
      },
      selectedTab(val) {
        if (val === 'message') {
          this.$nextTick(() => {
            this.scrollToEnd();
          })
        }
      },
    },
    methods:{
      contactCardTemplate(name) {
        return this.$store.getters.contactCardTemplate(name, false);
      },
      scrollToEnd(disableTransition = true) {
        var msgs = this.$refs.messages;
        var lstrect = this.$refs.messagelist.getBoundingClientRect();
        console.log('this.scrollY', lstrect.height - msgs.scrollWrapperHeight)
        msgs.scrollToY(lstrect.height - msgs.scrollWrapperHeight, disableTransition);
        this.inputboxDividerVisible = lstrect.height > msgs.scrollWrapperHeight;
      },
      scrollToUp(disableTransition) {
        var msgs = this.$refs.messages;
        msgs.scrollToY(0, disableTransition);
      },
      scrollToY(y, disableTransition) {
        var msgs = this.$refs.messages;
        msgs.scrollToY(y, disableTransition);
      },
      scroll() {
        var msgs = this.$refs.messages;
        var lstrect = this.$refs.messagelist.getBoundingClientRect();
        var maxy = Math.round(lstrect.height - msgs.scrollWrapperHeight)
        let top = msgs.top
        this.isEnd = top == maxy
        this.isReplyButtonVisible = top <= this.newRepliesScrollY

        if (this.isReplyButtonVisible && this.newRepliesButtonVisible) {
          // mark as read
          let slist = this.spaceList.slice()
          let len = slist.length
          for(let i=0; i<len; i++) {
            let lst = slist[i]
            let p = lst.find(
              itm => itm.name.replace(/ /g, '_') === this.id
            );
            if (p) {
              p.newRepliesButtonVisible = false
              p.scrollY = null
            }
          }
          this.$store.commit('spaceList', slist);
        }
      },

      tabchange(tab) {
       this.selectedTab = tab;
      },

      sendmsg() {
        this.scrollToEnd();
      },

      onAppResizing() {
        if (this.$refs.messages) {
          this.$refs.messages.update();
        }

        // shrink and hide elements
        //
        const minSpace = 4;
        const bounceSaftyGap = 4;
        var i, len, el, itm, widthAvaiable;
        var selector = this.isPopout ? '.windowmode .messaging-input-toolbar-spacer' : '.messaging-input-toolbar-spacer'
        var spacers = document.querySelectorAll(selector);
        len = spacers.length;
        widthAvaiable = 0;
        for(i=0; i<len; i++){
          el = spacers[i];
          widthAvaiable += el.getBoundingClientRect().width;
        }
        var elements = this.hideableElements;

        len = this.shrinkElements.length
        var selectors = this.shrinkElements.reduce((arr, val) => {
          arr.push(val.selector)
          return arr;
        }, []);

        if (widthAvaiable < minSpace) {
          var nextid = len
          if (elements.length > nextid) {
            itm = elements[nextid];
            el = document.querySelector(itm.selector);
            var width = el.getBoundingClientRect().width
            var obj = {
              selector: itm.selector,
              width: width,
              minwidth: itm.minwidth,
              replacedwidth: itm.replacedwidth,
            }
            if (!selectors.includes(itm.selector) && (!itm.minwidth || itm.minwidth >= width)) {
              this.shrinkElements.push(obj);
            }
            
          }
          
        } else {
          // show 
          if (len > 0) {
            itm = _.last(this.shrinkElements)
            var replacedwidth = itm.replacedwidth ? itm.replacedwidth : 0;
            if (widthAvaiable - minSpace + replacedwidth - bounceSaftyGap > itm.width) {
              this.shrinkElements.pop();
            }
          }
        }

      },

      shrinkTrigger(selector) {
        for(var i=this.shrinkElements.length-1; i>=0; i--){
          var ele = this.shrinkElements[i];
          if(ele.selector === selector){
            return true;
          }
        }
        return false
      },

      close() {
        this.$emit("close");
      },
      mousedown() {
        this.$store.commit('activePopoutSpaceFocusId', this.id);
        // 提升depth
        let lst = this.activePopoutSpaceIdList.slice()
        let idx = lst.indexOf(this.id)
        lst.splice(idx, 1);
        lst.push(this.id);
        this.$store.commit('activePopoutSpaceIdList', lst);
      },


      showInvite() {
        this.$modal.show(
          {
            template: `
              <div class="fte-pop-invite" >
                <topbar-simple :buttons="['close', 'minimize']" class="topbar" @close="close" />
                <div class="content">
                  <wl-hot :rect="{x:309,y:189,w:107,h:34}" @click.native="() => { close() }" />
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
              close() {
                this.$emit('close')
              },
            }
          },
          {
            parentref: this,
          }, // component props
          {
            name: 'fte-pop-invite',
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
      },

      showGuide() {
        this.$modal.show(
          {
            template: `
              <div class="fte-pop-watch-guide" >
                <topbar-simple :buttons="['close', 'minimize']" class="topbar" @close="close" />
                <div class="content">
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
              close() {
                this.$emit('close')
              },
            }
          },
          {
            parentref: this,
          }, // component props
          {
            name: 'fte-pop-watch-guide',
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
      },

    }

}
</script>


<style lang="scss">
$paddingleft: 16px;

.space-content-area {
  width: 100%;
  height: 100%;
  min-width: 310px; /* for two columns animation */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;

  &.rounded {
    border-radius: 12px 0 0px 0px;
  }

  .messages {
    flex-shrink: 1;
    flex-grow: 1;
    width: calc(100% - 4px);
    margin-right: 4px;
    overflow-x: hidden;
    height: 440px;

    .list {
      width: 100%;
      padding: 6px 24px 20px 10px;

    }

    .seenby {
      @include flex;
      margin-top: 16px;
      user-select: none;

      .lb {
        opacity: .7;
        font-size: 14px;
        margin-right: 6px;
      }

      .avatars {
        @include flex;

        .avatar {
          margin: 0 2px;
        }
      }
    }
  }

  .messages-overlay {
    @include flex(column, flex-end);
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-bottom: 8px;
    pointer-events: none;

    .btnup {
      @include flex;
      min-width: 0;
      padding: 0 10px;
      margin-bottom: 8px;
      font-size: 14px;
      pointer-events: auto;
    }
    .btndown {
      @include flex;
      width: 28px;
      min-width: 28px;
      padding: 0;
      margin: 0 0 8px 0;
      pointer-events: auto;
    }
  }

  .fte {
    @include flex(column);
    flex-shrink: 1;
    flex-grow: 1;
    width: 100%;
    height: 440px;

    .tt {
      
      @include flex;
      font-size: 26px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .content {
      position: relative;
      @include flex;
      width: 532px;
      height: 240px;
      background: url(~@/assets/img/fte-personal-space.svg) no-repeat center center;
    }
  }

  .inputbox {
    position: relative;

    .divider-h {
      margin-left: 4px;
      width: calc(100% - 4px);
      height: 1px;
      border-top: 1px solid rgba($color: #FFFFFF, $alpha: .2);
    }

    .tools {
      position: absolute;
      padding-left: $paddingleft;
      padding-right: 25px;
      padding-top: 10px;
      width: 100%;
      height: 40px;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .icons {
        display: flex;
        align-items: center;

        path {
          fill: white;
          fill-opacity: 0.7;
        }
        .stroke {
          stroke: rgba($color: #FFFFFF, $alpha: .7);
        }

        .ico {
          margin-right: 20px;
        }
      }

      .warning {
        path {
          fill: $md-yellow-40;
        }
      }

      .messaging-input-toolbar-spacer {
        width: 1px;
        flex-grow: 1;
      }

      .fornewline {
        display: flex;
        font-size: 14px;
        opacity: .6;
        white-space: nowrap;
      }

      &.narrow {
        /*
        height: 75px;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;

        .fornewline {
          justify-content: flex-end;
          flex-grow: 0;
          margin-top: 5px;
        }
        */
      }
    }

    .send {
      position: absolute;
      @include flex;
      width: 16px;
      height: 16px;
      top: 40px;
      right: 24px;

      svg path {
        fill: $md-blue-40;
        fill-opacity: 1.0;
      }
      
      &.disabled {
        opacity: .4;

        svg path {
          fill: white;
        }
      }

    }

    .chatinput {
      border: none;
      font-size: 16px;
      padding: 34px 50px 10px $paddingleft;
      margin-left: 4px;
      width: calc(100% - 4px);
      border-top: 1px solid transparent;
      background: transparent;
      cursor: text;
      color: rgba($color: white, $alpha: 0.95);
      ::placeholder {
        color: rgba($color: white, $alpha: 0.7) !important;
      }
      &:placeholder-shown {
        text-overflow: ellipsis;
      }

      &.narrow {
        /*padding-top: 70px;*/
      }
    }
    .chatinput:focus {
      outline: none;
      box-shadow: none;
      border-top: 1px solid $md-blue-40;
    }
  }
  


  /* theme ----- light/hybrid */
  &.light, &.hybrid {
    color: $text-color-primary-light-ui;


    .inputbox {

      .tools {

        .icons {

          path {
            fill: black;
          fill-opacity: 0.7;
          }
          .stroke {
            stroke: rgba($color: #000000, $alpha: .7);
          }
          
        }

        .warning {
          path {
            fill: $md-yellow-60;
          }
        }

      }

      .send {
        svg path {
          fill: $md-blue-60;
        }
        
        &.disabled {
          svg path {
            fill: black;
          }
        }
      }

      .chatinput {
        color: rgba($color: black, $alpha: 0.95);
        ::placeholder {
          color: rgba($color: black, $alpha: 0.7) !important;
        }
      }
      .chatinput:focus {
        border-top: 1px solid $md-blue-60;
      }
    }
  }

}


.fte-pop-invite {
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
    background: url(~@/assets/img/fte-invite.svg) no-repeat center center;
  }
}

.fte-pop-watch-guide {
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
    background: url(~@/assets/img/fte-watch-guide.svg) no-repeat center center;
  }
}
</style>
