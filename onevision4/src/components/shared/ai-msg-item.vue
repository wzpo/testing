<template>
    <div class='aimsgitem' :class="[theme, { spacer: type == 'spacer' }]">

        <wl-alertbanner v-if="type == 'alert'" :show="true" :icon="icon" :content="msg"
            :closeButtonVisible="true" :narrow="true" class="aimsgitem-alert" @close="closeAlertbanner" />

        <div v-if="type == 'msg'" class="aimsgitem-msg" :class="[frame]">
            <div class="aimsgitem-msg-cont">
                <div v-if="icon" class='aimsgitem-msg-icon' v-html="icon"> </div>
                <div class='aimsgitem-msg-tt' v-html="title"> </div>
                <div class='aimsgitem-msg-txt' v-html="msg"> </div>

                <div v-if="buttons" class="aimsgitem-msg-btns">
                    <md-button v-for="(btn, idx) in buttons" :key="`btn${idx}`" class="aimsgitem-msg-btns-btn"
                        :class="btn.class" aria-label="x" :size="btn.size"
                        :disabled="btn.disabled || btnDisabled[btn.label]" @click="() => {
                            if (btn.func) {
                                buttonClick(btn)
                            }
                        }">
                        {{ btn.label }}
                    </md-button>
                </div>
            </div>
            <div class="clr-border"></div>

        </div>

        <div v-if="['responding', 'result', 'meeting-summary', 'upcoming-meeting'].indexOf(type) > -1" class="aimsgitem-command" >
            <span class="aimsgitem-command-lb">
                <span class="l1">{{ commandName }}</span>
                <span v-if="time" class="l2">
                    {{ `Today, ${format(time, 'KK:mm a')}` }}
                    <wl-icon v-if="activeSpace" name="dot-divider" size="4" class="dot-divider" />
                    <span v-if="activeSpace" class="text-link underline" @click="gotoSpace(activeSpace.name)">{{ activeSpace.name }}</span>
                </span>
            </span>

            <div class="aimsgitem-command-icobtn" @click="clsed = !clsed">
                <wl-icon :name="clsed ? 'arrow-up-bold' : 'arrow-down-bold'" :size="16" />
            </div>
        </div>


        <div v-if="type == 'responding'" class="aimsgitem-responding" :class="[frame]">
            <div class="aimsgitem-responding-cont">
                <div class="aimsgitem-responding-head">
                    <div v-if="icon" class='aimsgitem-responding-icon' v-html="icon"></div>
                    <md-button class="btn md-button-outline" aria-label="x" :size="28" > 
                        Stop
                    </md-button>
                </div>
                <div class='aimsgitem-responding-row'>
                    <div class="spinner spinner16 spinner-animation"></div>
                    <div class='aimsgitem-responding-row-txt' v-html="msgs[respondingMsgId]"></div>
                </div>
            </div>
            <div class="clr-border"></div>

        </div>

        
        <div v-if="type == 'result'" v-show="!clsed" class="aimsgitem-result" :class="[frame]">
            <div class="aimsgitem-result-cont wrap">

                <div v-if="header" class='aimsgitem-result-header'>
                    <!--presence-avatar
                        v-if="activeSpace"
                        class='aimsgitem-result-header-avatar'
                        :title="activeSpace.name"
                        :src="activeSpace.avatar ? avatarPath + activeSpace.avatar : ''" 
                        :type="activeSpace.isSpace ? 'group' : ''" 
                        :color="'#FFFFFF'"
                        :size="20"
                        :backgroundColor="activeSpace.isSpace ? activeSpace.avatarBackgroundColor : '#545454'"
                        fontWeight="600"
                        :theme="theme === 'light' ? 'light' : 'dark'"
                    ></presence-avatar-->
                    <svg style="margin-right:6px;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 4C14.3284 4 15 3.32843 15 2.5C15 1.67157 14.3284 1 13.5 1C12.6716 1 12 1.67157 12 2.5C12 3.32843 12.6716 4 13.5 4ZM3 8.75C3 6.40279 4.90279 4.5 7.25 4.5C9.59721 4.5 11.5 6.40279 11.5 8.75C11.5 11.0972 9.59721 13 7.25 13C4.90279 13 3 11.0972 3 8.75ZM7.25 2.5C3.79822 2.5 1 5.29822 1 8.75C1 12.2018 3.79822 15 7.25 15C10.7018 15 13.5 12.2018 13.5 8.75C13.5 5.29822 10.7018 2.5 7.25 2.5Z" fill="url(#paint0_linear_4047_19503)"/>
                        <defs>
                        <linearGradient id="paint0_linear_4047_19503" x1="16" y1="0" x2="0" y2="16" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#ABABAB"/>
                        <stop offset="1" stop-color="#797979"/>
                        </linearGradient>
                        </defs>
                    </svg>
                    <div class='aimsgitem-result-header-tt' v-html="header.title"> </div>
                    <div class="aimsgitem-result-header-icons">
                        <div v-for="(ico, idx) in header.icons" :key="`ico${idx}`"
                            class="aimsgitem-result-header-icons-btn" :title="ico.tooltip" :id="ico.id"
                            @click="iconClick(ico)">
                            <wl-icon :name="ico.name" class="aimsgitem-result-header-icons-btn-ico" :size="16" />
                        </div>
                    </div>
                </div>

                <div class='aimsgitem-result-msgs'>
                    <div v-for="(msg, idx) in msgs" :key="`mg${idx}`" class="aimsgitem-result-msgs-msg">
                        <div v-if="msg.icon" class="ico" v-html="msg.icon"></div>
                        <div v-if="msg.txt" class="txt" v-html="msg.txt" @click="msgtextClickhandler($event)"></div>
                        <div v-if="msg.meetings" class="meetings">
                            <space-people-item
                                v-for="(p, idx) in msg.meetings"
                                :key="`space-list1-item-${idx}`"
                                :id="`${p.name.replace(/ /g, '_')}`"
                                itemtype="people"
                                :name="p.name"
                                :avatar="p.avatar"
                                :isgroup="false"
                                :status="p.status"
                                :subline="p.statusTxt"
                                :buttons="[/*'message', 'audiocall', 'videocall'*/]"
                                :avatarBackgroundColor="'#545454'"
                                :showHoverStyle="true"
                                :pill="false"
                                color="#FFFFFF"
                                class="meetingitem"
                                @select="() => {p.func()}"
                                />
                        </div>
                        
                    </div>
                </div>

                <div class='aimsgitem-common-bottom'>
                    <span class="lb">AI generated</span>
                    <wl-icon name="dot-divider" size="4" class="dot-divider" />
                    <span class="lb">Is this helpful?</span>
                    <wl-icon name="like-bold" size="14" class="ico" />
                    <wl-icon name="dislike-bold" size="14" class="ico" />
                </div>

            </div>
            <div v-if="buttons" class="aimsgitem-common-btns">
                <md-button v-for="(btn, idx) in buttons" :key="`btn${idx}`" class="aimsgitem-common-btns-btn"
                    :class="btn.class" aria-label="x" :size="btn.size" :disabled="btn.disabled || btnDisabled[btn.label]"
                    @click="() => {
                        if (btn.func) {
                            buttonClick(btn)
                        }
                    }">
                    {{ btn.label }}
                </md-button>
            </div>

            <div class="clr-border"></div>
        </div>

        <div v-if="type == 'meeting-summary'" v-show="!clsed" class="aimsgitem-meeting summary" :class="[frame]">
            
            <div class="aimsgitem-meeting-cont wrap">

                <div v-if="header" class='aimsgitem-result-header'>
                    <svg style="margin-right:6px;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 4C14.3284 4 15 3.32843 15 2.5C15 1.67157 14.3284 1 13.5 1C12.6716 1 12 1.67157 12 2.5C12 3.32843 12.6716 4 13.5 4ZM3 8.75C3 6.40279 4.90279 4.5 7.25 4.5C9.59721 4.5 11.5 6.40279 11.5 8.75C11.5 11.0972 9.59721 13 7.25 13C4.90279 13 3 11.0972 3 8.75ZM7.25 2.5C3.79822 2.5 1 5.29822 1 8.75C1 12.2018 3.79822 15 7.25 15C10.7018 15 13.5 12.2018 13.5 8.75C13.5 5.29822 10.7018 2.5 7.25 2.5Z" fill="url(#paint0_linear_4047_19503)"/>
                        <defs>
                        <linearGradient id="paint0_linear_4047_19503" x1="16" y1="0" x2="0" y2="16" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#ABABAB"/>
                        <stop offset="1" stop-color="#797979"/>
                        </linearGradient>
                        </defs>
                    </svg>
                    <div class='aimsgitem-result-header-tt' v-html="header.title"> </div>
                    <div class="aimsgitem-result-header-icons">
                        <div v-for="(ico, idx) in header.icons" :key="`ico${idx}`"
                            class="aimsgitem-result-header-icons-btn" :title="ico.tooltip" :id="ico.id"
                            @click="iconClick(ico)">
                            <wl-icon :name="ico.name" class="aimsgitem-result-header-icons-btn-ico" :size="16" />
                        </div>
                    </div>
                </div>

                <div class="aimsgitem-meeting-item">
                    <div class='left'>
                        <presence-avatar
                            :src="meetingSummary.avatar ? avatarPath + meetingSummary.avatar : ''" 
                            :color="'white'"
                            :backgroundColor="'#545454'"
                            :size="32"
                            :presence="meetingSummary.status" 
                            :theme="theme === 'light' ? 'light' : 'dark'"
                            class="avatar" 
                            />

                    </div>
                    <div class='mid'>
                        <span class="row1">
                            <span class="txt">{{ meetingSummary.title }}</span>
                        </span>

                        <span class="row2">
                            <span class="subline">10:30 AM - 11:30 AM</span>
                        </span>
                    </div>

                    <div class="right">
                        
                        <!--wl-icon v-for="(i, idx3) in meetingSummary.icons" :key="`meeting-ico${idx3}`" :name="i" size="12"
                            class="ico" /-->
                    </div>

                </div>

                <div class="scrollcontent-wrap">

                    <div class="block1">
                        <div class="subtitle">
                            <span class="lb">Meeting recap</span>
                            
                        </div>
                        <div class="des">Lorem ipsum dolor sit amet consectetur. Turpis cum volutpat dignissim vitae non vel. Ullamcorper aliquam gravida rhoncus facilisi fusce. Massa quam nibh suscipit sit amet. Massa augue sem feugiat eu morbi.</div>
                    </div>

                    <div class="block1">
                        <div class="subtitle">
                            <span class="lb">Action items</span>
                            
                        </div>
                        <div class="des">
                            <ul>
                                <li>Check with Felix to public beta, enabling outbound usage.</li>
                                <li>Austen Jones will follow up greater integrations between Vonage Business Cloud, its UCaaS solution, and Vonage Contact Center.</li>
                                <li>Made several products announcements during the quarter including CX Cloud.</li>
                            </ul>
                        </div>
                    </div>

                    <!--content-->

                    <div class="des des2">Attached to the meeting</div>
                    <div class="conitm">
                        <div class="thumb">
                            <svg width="65" height="51" viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.130859" y="0.5" width="64" height="50" rx="6" fill="#1170CF"/>
                            <path d="M39.1311 11.9998H25.1311C23.938 12.0011 22.7942 12.4756 21.9506 13.3192C21.1069 14.1628 20.6324 15.3067 20.6311 16.4998V34.4998C20.6324 35.6928 21.1069 36.8367 21.9506 37.6803C22.7942 38.5239 23.938 38.9985 25.1311 38.9998H39.1311C40.3242 38.9985 41.468 38.5239 42.3116 37.6803C43.1553 36.8367 43.6298 35.6928 43.6311 34.4998V16.4998C43.6298 15.3067 43.1553 14.1628 42.3116 13.3192C41.468 12.4756 40.3242 12.0011 39.1311 11.9998ZM36.1086 33.4822H33.7326L32.1252 26.8103L30.5891 33.4822H28.2971L26.2209 24.8435H28.3088L29.6174 31.2263L31.0686 24.8435H33.3127L34.885 31.2634L36.1331 24.8435H38.0413L36.1086 33.4822Z" fill="white"/>
                            </svg>
                        </div>
                        <div class="colr">
                            <span class="l1">Project Roadmap.doc</span>
                            <span class="l2">
                                36 KB
                                <wl-icon name="dot-divider" size="4" class="dot-divider" />
                                Clarissa Smith
                                <wl-icon name="dot-divider" size="4" class="dot-divider" />
                                07/26/2023
                            </span>
                        </div>
                    </div>

                    <!--content end-->


                </div>

                <div class='aimsgitem-common-bottom'>
                    <span class="lb">AI generated</span>
                    <wl-icon name="dot-divider" size="4" class="dot-divider" />
                    <span class="lb">Is this helpful?</span>
                    <wl-icon name="like-bold" size="14" class="ico" />
                    <wl-icon name="dislike-bold" size="14" class="ico" />
                </div>

                </div>
                <div v-if="buttons" class="aimsgitem-common-btns">
                <md-button v-for="(btn, idx) in buttons" :key="`btn${idx}`" class="aimsgitem-common-btns-btn"
                    :class="btn.class" aria-label="x" :size="btn.size" :disabled="btn.disabled || btnDisabled[btn.label]"
                    @click="() => {
                        if (btn.func) {
                            buttonClick(btn)
                        }
                    }">
                    {{ btn.label }}
                </md-button>
                </div>

                <div class="clr-border"></div>
        </div>

        <div v-if="type == 'upcoming-meeting'" v-show="!clsed" class="aimsgitem-meeting" :class="[frame]">
            
            <div class="aimsgitem-meeting-cont wrap">

                <div v-if="header" class='aimsgitem-result-header'>
                    <svg style="margin-right:6px;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 4C14.3284 4 15 3.32843 15 2.5C15 1.67157 14.3284 1 13.5 1C12.6716 1 12 1.67157 12 2.5C12 3.32843 12.6716 4 13.5 4ZM3 8.75C3 6.40279 4.90279 4.5 7.25 4.5C9.59721 4.5 11.5 6.40279 11.5 8.75C11.5 11.0972 9.59721 13 7.25 13C4.90279 13 3 11.0972 3 8.75ZM7.25 2.5C3.79822 2.5 1 5.29822 1 8.75C1 12.2018 3.79822 15 7.25 15C10.7018 15 13.5 12.2018 13.5 8.75C13.5 5.29822 10.7018 2.5 7.25 2.5Z" fill="url(#paint0_linear_4047_19503)"/>
                        <defs>
                        <linearGradient id="paint0_linear_4047_19503" x1="16" y1="0" x2="0" y2="16" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#ABABAB"/>
                        <stop offset="1" stop-color="#797979"/>
                        </linearGradient>
                        </defs>
                    </svg>
                    <div class='aimsgitem-result-header-tt' v-html="header.title"> </div>
                    <div class="aimsgitem-result-header-icons">
                        <div v-for="(ico, idx) in header.icons" :key="`ico${idx}`"
                            class="aimsgitem-result-header-icons-btn" :title="ico.tooltip" :id="ico.id"
                            @click="iconClick(ico)">
                            <wl-icon :name="ico.name" class="aimsgitem-result-header-icons-btn-ico" :size="16" />
                        </div>
                    </div>
                </div>

                <div class="aimsgitem-meeting-item">
                    <!--div class="marker" :class="'solid-gray'"></div-->
                    <div class='left'>
                        <presence-avatar
                            :src="upcomingMeeting.avatar ? avatarPath + upcomingMeeting.avatar : ''" 
                            :color="'white'"
                            :backgroundColor="'#545454'"
                            :size="32"
                            :presence="upcomingMeeting.status" 
                            :theme="theme === 'light' ? 'light' : 'dark'"
                            class="avatar" 
                            />

                    </div>
                    <div class='mid'>
                        <span class="row1">
                            <span class="txt">{{ upcomingMeeting.title }}</span>
                        </span>

                        <span class="row2">
                            <span class="subline">{{ $formatDate(upcomingMeeting.start, 'kk:mm') }} - {{ $formatDate(upcomingMeeting.end, 'kk:mm') }}</span>
                        </span>
                    </div>

                    <div class="right">
                        <md-button class="btn" aria-label="x" :size="28" color="green" @click="joinMeeting(true)">Join</md-button>
                        <!--wl-icon v-for="(i, idx3) in upcomingMeeting.icons" :key="`meeting-ico${idx3}`" :name="i" size="12"
                            class="ico" /-->
                    </div>

                </div>

                <div class="scrollcontent-wrap">

                    <div class="block1">
                        <div class="subtitle">
                            <span class="lb">Description</span>
                            
                        </div>
                        <div class="des">Hi team, we are going to kick off a new feature for our client. Please join this
                            meeting and discuss the details about it.</div>
                    </div>

                    <div class="subtitlegrp">
                        <!--span class="subtitle">{{`${upcomingMeeting.accepted.length} ${ upcomingMeeting.accepted.length > 1 ? 'invitees' : 'invitee'} accepted`}}</span-->
                        <span class="subtitle">Invitees ({{ `${upcomingMeeting.accepted.length +
                            upcomingMeeting.waiting.length}` }})</span>
                    </div>
                    <div class="accepted-avatars">
                        <presence-avatar v-for="(p, idx) in upcomingMeeting.accepted" :key="`acc${idx}`" :title="p"
                            :src="people(p).avatar ? avatarPath + people(p).avatar : ''" :color="'white'"
                            :backgroundColor="'#545454'" :size="32" :presence="people(p).status"
                            :theme="theme === 'light' ? 'light' : 'dark'" class="avatar" />
                        <span class="lb">{{ `${upcomingMeeting.accepted.length}/${upcomingMeeting.accepted.length +
                            upcomingMeeting.waiting.length}` }} Accepted</span>
                    </div>
                    <div class="des">2 Invitees are following this meeting. 
                        <wl-icon 
                            name="info-circle-bold" 
                            size="16"
                            style="margin-left:4px;"
                            />
                    </div>

                    <!--content-->

                    <div class="subtitle">Contents (2)</div>
                    <div class="des des2">Attached to the meeting</div>
                    <div class="conitm">
                        <div class="thumb">
                            <svg width="64" height="50" viewBox="0 0 64 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="64" height="50" rx="6" fill="#1170CF"/>
                                <path d="M35.8357 22H40.2052C40.2845 21.9986 40.3617 21.9752 40.4284 21.9324C40.4951 21.8897 40.5486 21.8292 40.583 21.7578C40.6173 21.6865 40.6312 21.6069 40.623 21.5281C40.6147 21.4493 40.5848 21.3744 40.5365 21.3116C39.4587 19.8943 36.9882 16.6487 35.7438 15.0377C35.6899 14.9685 35.6155 14.9181 35.5313 14.8938C35.4471 14.8694 35.3573 14.8723 35.2748 14.902C35.1923 14.9317 35.1213 14.9867 35.072 15.0591C35.0226 15.1316 34.9974 15.2178 35 15.3054V21.1446C35 21.7514 35.1451 22 35.8357 22Z" fill="white" fill-opacity="0.95"/>
                                <path d="M35 23.5C34.6022 23.5 34.2206 23.342 33.9393 23.0607C33.658 22.7794 33.5 22.3978 33.5 22V15.25C33.5 15.1505 33.4605 15.0552 33.3902 14.9848C33.3198 14.9145 33.2245 14.875 33.125 14.875H26.75C25.8549 14.875 24.9964 15.2306 24.3635 15.8635C23.7306 16.4965 23.375 17.3549 23.375 18.25V31.75C23.375 32.6451 23.7306 33.5035 24.3635 34.1365C24.9964 34.7694 25.8549 35.125 26.75 35.125H37.25C38.1451 35.125 39.0036 34.7694 39.6365 34.1365C40.2694 33.5035 40.625 32.6451 40.625 31.75V23.875C40.625 23.7755 40.5855 23.6802 40.5152 23.6098C40.4448 23.5395 40.3495 23.5 40.25 23.5H35Z" fill="white" fill-opacity="0.95"/>
                                </svg>

                        </div>
                        <div class="colr">
                            <span class="l1">Research&findings.doc</span>
                            <span class="l2">
                                36 KB
                                <wl-icon name="dot-divider" size="4" class="dot-divider" />
                                Clarissa Smith
                                <wl-icon name="dot-divider" size="4" class="dot-divider" />
                                07/26/2023
                            </span>
                        </div>
                    </div>
                    <div class="des des2">Related file shared in space</div>
                    <div class="conitm">
                        <div class="thumb">
                            <svg width="64" height="50" viewBox="0 0 64 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="64" height="50" rx="6" fill="#EE0507"/>
                                <path d="M32.1499 27.4151H31.5499V30.3401H32.1499C32.8999 30.3401 33.2749 29.8151 33.3499 28.8401C33.3499 28.3151 33.1999 27.9401 32.9749 27.7151C32.7499 27.4901 32.4499 27.4151 32.1499 27.4151Z" fill="white" fill-opacity="0.95"/>
                                <path d="M28.0249 27.4151H27.4249V28.9151H28.0249C28.5499 28.9151 28.8499 28.6151 28.8499 28.1651C28.8499 27.6401 28.5499 27.4151 28.0249 27.4151Z" fill="white" fill-opacity="0.95"/>
                                <path d="M37.25 14.875H26.75C24.875 14.875 23.375 16.375 23.375 18.25V31.75C23.375 33.625 24.875 35.125 26.75 35.125H37.25C39.125 35.125 40.625 33.625 40.625 31.75V18.25C40.625 16.375 39.125 14.875 37.25 14.875ZM29.375 29.275C29.075 29.5 28.625 29.575 28.025 29.575H27.425V31H26.45V26.65H28.025C28.7 26.65 29.15 26.8 29.525 27.1C29.75 27.325 29.9 27.7 29.9 28.15C29.9 28.675 29.75 29.05 29.375 29.275ZM32.15 31H30.5V26.65H32.15C33.575 26.65 34.325 27.4 34.325 28.825C34.325 30.25 33.575 31 32.15 31ZM37.775 27.4H36.05V28.525H37.55V29.275H36.05V31H35V26.65H37.775V27.4Z" fill="white" fill-opacity="0.95"/>
                                </svg>

                        </div>
                        <div class="colr">
                            <span class="l1">API optimization.pdf</span>
                            <span class="l2">
                                36 KB
                                <wl-icon name="dot-divider" size="4" class="dot-divider" />
                                Clarissa Smith
                                <wl-icon name="dot-divider" size="4" class="dot-divider" />
                                07/26/2023
                            </span>
                        </div>
                    </div>

                    <!--content end-->

                    <div class="block1" style="margin-bottom:8px;">
                        <div class="subtitlegrp">
                            <span class="subtitle">AI summarized related discussion and space</span>
                        </div>
                        <div class="des des2">Lorem ipsum dolor sit amet consectetur. Turpis cum volutpat dignissim vitae non vel. Ullamcorper aliquam gravida rhoncus facilisi fusce. Massa quam nibh suscipit sit amet. Massa augue sem feugiat eu morbi.</div>
                        <div class="text-link">Scrum Team</div>
                        <div class="text-link">Scrum Team - UX only</div>
                    </div>

                    <div class="block1">
                        <div class="subtitlegrp">
                            <span class="subtitle">Recommend room</span>
                        </div>
                        <div class="conitm2">
                            <div class="coll">
                                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16.1309" cy="16.5" r="16" fill="#545454"/>
                                <path d="M20.6309 10.9999H11.6309C10.9681 11.0007 10.3326 11.2644 9.86395 11.733C9.39528 12.2017 9.13164 12.8371 9.13086 13.4999V19.5002C9.13164 20.163 9.39528 20.7984 9.86395 21.2671C10.3326 21.7358 10.9681 21.9994 11.6309 22.0002H20.6309C21.2937 21.9994 21.9291 21.7358 22.3978 21.2671C22.8664 20.7984 23.1301 20.163 23.1309 19.5002V13.4999C23.1301 12.8371 22.8664 12.2017 22.3978 11.733C21.9291 11.2644 21.2937 11.0007 20.6309 10.9999ZM11.6309 11.9999H20.6309C21.0286 12.0004 21.4098 12.1585 21.691 12.4398C21.9722 12.721 22.1304 13.1022 22.1309 13.4999V18.0002H10.1309V13.4999C10.1313 13.1022 10.2895 12.721 10.5707 12.4398C10.8519 12.1585 11.2332 12.0004 11.6309 11.9999ZM20.6309 21.0002H11.6309C11.2332 20.9997 10.8519 20.8416 10.5707 20.5604C10.2895 20.2792 10.1313 19.8979 10.1309 19.5002V19.0002H22.1309V19.5002C22.1304 19.8979 21.9723 20.2792 21.691 20.5604C21.4098 20.8416 21.0286 20.9997 20.6309 21.0002Z" fill="white" fill-opacity="0.95"/>
                                <path d="M15.6309 13.9999H16.6309C16.7635 13.9999 16.8906 13.9473 16.9844 13.8535C17.0782 13.7597 17.1309 13.6325 17.1309 13.4999C17.1309 13.3673 17.0782 13.2402 16.9844 13.1464C16.8906 13.0526 16.7635 12.9999 16.6309 12.9999H15.6309C15.4983 12.9999 15.3711 13.0526 15.2773 13.1464C15.1835 13.2402 15.1309 13.3673 15.1309 13.4999C15.1309 13.6325 15.1835 13.7597 15.2773 13.8535C15.3711 13.9473 15.4983 13.9999 15.6309 13.9999Z" fill="white" fill-opacity="0.95"/>
                                </svg>
                            </div>

                            <div class="colm">
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.2773 11.1464L10.6308 13.7929L8.98434 12.1464C8.89059 12.0527 8.76342 12 8.63083 12C8.49823 12 8.37107 12.0527 8.27731 12.1464C8.18355 12.2402 8.13088 12.3673 8.13088 12.4999C8.13088 12.6325 8.18355 12.7597 8.27731 12.8535L10.2773 14.8535C10.3237 14.8999 10.3788 14.9367 10.4395 14.9619C10.5002 14.987 10.5652 14.9999 10.6308 14.9999C10.6965 14.9999 10.7615 14.987 10.8222 14.9619C10.8828 14.9367 10.9379 14.8999 10.9843 14.8535L13.9843 11.8535C14.0781 11.7597 14.1308 11.6325 14.1308 11.4999C14.1308 11.3673 14.0781 11.2402 13.9843 11.1464C13.8906 11.0527 13.7634 11 13.6308 11C13.4982 11 13.3711 11.0527 13.2773 11.1464Z" fill="#3CC29A"/>
                                <path d="M11.6309 2.99994V2.00043C11.6309 1.86782 11.5782 1.74064 11.4844 1.64687C11.3906 1.55311 11.2635 1.50043 11.1309 1.50043C10.9983 1.50043 10.8711 1.55311 10.7773 1.64687C10.6835 1.74064 10.6309 1.86782 10.6309 2.00043V2.99993H5.63086V2.00043C5.63086 1.86782 5.57818 1.74064 5.48441 1.64687C5.39064 1.55311 5.26347 1.50043 5.13086 1.50043C4.99825 1.50043 4.87107 1.55311 4.77731 1.64687C4.68354 1.74064 4.63086 1.86782 4.63086 2.00043V2.99993C3.96806 3.00071 3.33263 3.26435 2.86395 3.73302C2.39528 4.20169 2.13164 4.83713 2.13086 5.49993V12.4999C2.13164 13.1627 2.39528 13.7982 2.86395 14.2668C3.33263 14.7355 3.96806 14.9991 4.63086 14.9999H7.13086C7.26347 14.9999 7.39064 14.9472 7.48441 14.8535C7.57818 14.7597 7.63086 14.6325 7.63086 14.4999C7.63086 14.3673 7.57818 14.2401 7.48441 14.1464C7.39064 14.0526 7.26347 13.9999 7.13086 13.9999H4.63086C4.23317 13.9995 3.85189 13.8413 3.57068 13.5601C3.28947 13.2789 3.13129 12.8976 3.13086 12.4999V7.00093H13.1309V8.99993C13.1309 9.13254 13.1835 9.25971 13.2773 9.35348C13.3711 9.44725 13.4983 9.49993 13.6309 9.49993C13.7635 9.49993 13.8906 9.44725 13.9844 9.35348C14.0782 9.25971 14.1309 9.13254 14.1309 8.99993V5.49993C14.1301 4.83713 13.8664 4.2017 13.3978 3.73303C12.9291 3.26436 12.2937 3.00072 11.6309 2.99994ZM3.13086 6.00094V5.49994C3.13129 5.10225 3.28947 4.72097 3.57068 4.43976C3.85189 4.15855 4.23317 4.00038 4.63086 3.99994H11.6309C12.0286 4.00038 12.4098 4.15855 12.691 4.43976C12.9723 4.72097 13.1304 5.10225 13.1309 5.49994V6.00094H3.13086Z" fill="#3CC29A"/>
                                </svg>
                            </div>

                            <div class="colr">
                                <span class="l1">SHN-17-APR 10</span>
                                <span class="l2">
                                    <wl-icon name="participant-bold" size="16" style="margin-right:2px;" />
                                    1
                                    <wl-icon name="dot-divider" size="4" class="dot-divider" />
                                    Keji Building B17
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class='aimsgitem-common-bottom'>
                    <span class="lb">AI generated</span>
                    <wl-icon name="dot-divider" size="4" class="dot-divider" />
                    <span class="lb">Is this helpful?</span>
                    <wl-icon name="like-bold" size="14" class="ico" />
                    <wl-icon name="dislike-bold" size="14" class="ico" />
                </div>

            </div>
            <div v-if="buttons" class="aimsgitem-common-btns">
                <md-button v-for="(btn, idx) in buttons" :key="`btn${idx}`" class="aimsgitem-common-btns-btn"
                    :class="btn.class" aria-label="x" :size="btn.size" :disabled="btn.disabled || btnDisabled[btn.label]"
                    @click="() => {
                        if (btn.func) {
                            buttonClick(btn)
                        }
                    }">
                    {{ btn.label }}
                </md-button>
            </div>

            <div class="clr-border"></div>
        </div>


    </div>
</template>

<script>
import {
  format,
} from 'date-fns'

export default {
    props: {
        uid: String,
        type: String,
        commandName: String,
        time: Date,
        icon: String,
        title: String,
        msg: String,
        msgs: Array,
        buttons: Array,
        activeSpace: Object,
        header: Object,
        completefunc: Object,
        upcomingMeeting: Object,
        meetingSummary: Object,
        frame: String,
    },
    data() {
        return {
            btnDisabled: {},
            respondingMsgId: 0,
            clsed: false,
        }
    },
    computed: {
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
        avatarPath(){
            return this.$store.state.avatarPath;
        },
        abbr(){
            let arr = this.name.split(' ');
            return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
        },

    },
    mounted() {
        if (this.type == 'responding' && this.msgs && this.msgs.length >= 1) {
            this.startRespondingQueue()
        }
    },
    watch: {
        uid() {
            this.btnDisabled = {}
            this.respondingMsgId = 0
            this.$forceUpdate()
        },
        type(val) {
            if (val == 'responding' && this.msgs && this.msgs.length >= 1) {
                this.startRespondingQueue()
            }
        },
        clsed() {
            this.$emit('resized')
        },
    },
    methods: {
        format(date, fmt) {
            return format(date, fmt);
        },
        people(name) {
            return this.$store.getters.people(name);
        },
        startRespondingQueue() {
            let itv = setInterval(() => {
                if (this.respondingMsgId < this.msgs.length - 1) {
                    this.respondingMsgId++
                } else {
                    clearInterval(itv)
                    setTimeout(() => {
                        this.$emit('funccalled', { func: { name: this.completefunc.name } })
                    }, 500)
                }
            }, 600)
        },
        closeAlertbanner() {
            this.$emit('funccalled', { func: { name: 'closeAlert' } })
        },
        buttonClick(btn) {
            this.btnDisabled[btn.label] = true
            this.$forceUpdate()
            this.$emit('funccalled', { func: btn.func })
        },
        iconClick(ico) {
            if(ico.val == 'more'){
                const el = document.getElementById(ico.id)
                this.$popper.show(
                    {
                        template: `
                            <div class="common-menulist" style="width:168px;">
                                <div class='common-menulist-item common-menulist-item-32' >
                                    <wl-icon name="pen-bold" size="16" style="margin:0 6px 0 -4px;" />
                                    <span class="lb" >Edit</span>
                                </div>
                                <div class='common-menulist-item common-menulist-item-32' >
                                    <wl-icon name="copy-bold" size="16" style="margin:0 6px 0 -4px;" />
                                    <span class="lb" >Copy</span>
                                </div>
                                <div class='common-menulist-item common-menulist-item-32' >
                                    <wl-icon name="forward-message-bold" size="16" style="margin:0 6px 0 -4px;" />
                                    <span class="lb" >Forward</span>
                                </div>
                            </div>
                        `,
                        props: [],
                        methods: {

                        }
                    },
                    {

                    }, // component props
                    {
                        reference: el,
                        name: 'ai-card-more',
                        arrowVisible: true,
                        roundedCorner: true,
                        borderRadius: '12px',
                        frameless: false,
                        shadow: false,
                        appendToBody: true,
                        theme: `${this.theme} ${this.themeColor}`,
                        closeTrigger: 'mousedown',
                        options: {
                            placement: 'bottom',
                            modifiers: [
                            {
                                name: 'offset',
                            },
                            ],

                        },
                    }, // popper props
                    {
                        opened: () => { },
                        closed: () => { },
                    } // popper eventlistener
                );
            }
        },
        joinMeeting(late) {
            this.$store.commit('meetingTitle', this.upcomingMeeting.title);
            this.$store.commit('interstitialParams', { visible: true, host: false, late: late });
        },
        gotoSpace(spacename) {
            const spaceid = spacename.replace(/ /g, '_')
            this.$store.commit('activeSpaceId', spaceid);
            this.$store.commit('teamsNav', 'messaging')
        },
        msgtextClickhandler(evt) {
            if(evt.target.classList.contains('clickfunc')){
                this[evt.target.attributes.func.nodeValue](evt.target.attributes.params.nodeValue) //eg: gotoSpace
            }
        },




    }
}
</script>


<style lang="scss">
.aimsgitem {
    margin: 5px 8px 8px 8px;
    display: flex;
    flex-direction: column;
    width: calc(100% - 8px - 8px);

    &.spacer {
        flex-grow: 1;
    }

    &-alert {
        min-height: 50px;
        border-radius: 8px;
        margin: 0 !important;
        width: 100%;

        .content {
            font-size: 14px;
            line-height: 22px;
            margin-right: 20px;
        }

        .btnx {
            top: calc((100% - 16px)/2);
        }

    }

    .colored {
        position: relative;

        .clr-border {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            border-radius: 8px;
            box-sizing: border-box;
            transition: opacity 0.3s ease-out;

            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 8px;
                padding: 1px;
                background: linear-gradient(135deg, rgba($color: #0672EF, $alpha: 0.0) 0%, rgba($color: #0672EF, $alpha: 0.4) 30%, rgba($color: #3CC29A, $alpha: 0.4) 70%, rgba($color: #3CC29A, $alpha: 0.0) 100%);
                -webkit-mask:
                    linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
                mask:
                    linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: destination-out;
                mask-composite: exclude;

                pointer-events: none;
            }
        }
    }


    .solidgray .wrap {
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.07);
    }


    &-msg {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        width: 100%;
        margin-top: 20px;

        &-cont {
            margin: 8px;
        }

        &-icon {
            @include flex;
            width: 32px;
            height: 32px;
        }

        &-tt {
            font-size: 14px;
            font-weight: 600;
            line-height: 24px;
            padding: 0 4px;
        }

        &-txt {
            font-size: 14px;
            font-weight: normal;
            line-height: 22px;
            padding: 0 4px;
        }

        &-btns {
            @include flex(row, flex-start);
            margin: 8px 4px;

            &-btn {
                min-width: 0 !important;
                padding: 0 10px !important;
                margin-right: 4px !important;
                font-weight: normal !important;
            }
        }

    }

    &-responding {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 8px;
        width: 100%;

        &-head {
            @include flex(row, space-between);
            width: 100%;

            .btn {
                margin-right: 8px;
                min-width: 50px;
            }
        }

        &-cont {
            @include flex(column, flex-start, flex-start);
            margin: 8px;
            width: 100%;
        }

        &-icon {
            @include flex;
            width: 32px;
            height: 32px;
            margin-left: 8px;
        }

        &-row {
            @include flex(row, flex-start);
            margin-left: 16px;

            &-txt {
                font-size: 14px;
                font-weight: normal;
                line-height: 22px;
                padding: 0 4px;
                margin-left: 0px;
            }
        }

    }

    &-command {
        @include flex(row, flex-start);
        margin-bottom: 4px;
        user-select: none;
        background-color: rgba(255, 255, 255, 0.20);
        border-radius: 8px;
        padding: 8px;

        &-lb {
            @include flex(column, flex-start, flex-start);
            margin-left: 6px;
            flex-grow: 1;
            font-size: 14px;

            .l1 {
                font-weight: 600;
            }
            .l2 {
                @include flex(row, flex-start);
                opacity: .7;
                margin-top: -2px;
            }
        }

        &-icobtn {
            @include flex;
            height: 24px;
            width: 24px;
            margin-left: 4px;
            border-radius: 50%;
            flex-shrink: 0;

            &:hover {
                background-color: rgba($color: #FFF, $alpha: .07);
            }
            &:active {
                background-color: rgba($color: #FFF, $alpha: .2);
            }
        }
    }

    &-result-header {
        @include flex(row, flex-start);
        height: 24px;
        margin: 0 4px 8px 0;

        &-avatar {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }

        &-tt {
            font-size: 14px;
            font-weight: 600;
            flex-grow: 1;
        }

        &-icons {
            @include flex(row, flex-end);

            &-btn {
                @include flex;
                height: 24px;
                width: 24px;
                margin-left: 4px;
                border-radius: 50%;
                &:hover {
                    background-color: rgba($color: #FFF, $alpha: .07);
                }
                &:active {
                    background-color: rgba($color: #FFF, $alpha: .2);
                }
            }
        }
    }

    &-result {
        display: flex;
        flex-direction: column;
        width: 100%;

        &-cont {
            padding: 8px;
        }

        &-msgs {

            &-msg {
                @include flex(row, flex-start, flex-start);
                margin-bottom: 8px;

                .ico {
                    width: 16px;
                    height: 16px;
                    margin-top: 4px;
                    margin-right: 4px;
                }

                .txt {
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 22px;

                    ul {
                        margin: 0;
                    }
                }

                .meetings {
                    width: 100%;

                    .meetingitem {
                        width: calc(100% - 18px);
                        margin-left: 18px;
                    }
                }
            }
        }

    }

    &-common-bottom {
        @include flex(row, flex-start);
        border-top: 1px solid rgba($color: #FFF, $alpha: .2);
        padding-top: 10px;

        .lb {
            opacity: .7;
        }

        .ico {
            margin-left: 8px;
            opacity: .7;
        }

    }

    &-common-btns {
        @include flex(row, flex-end);
        margin: 16px 4px;

        &-btn {
            min-width: 0 !important;
            padding: 0 10px !important;
            margin-left: 4px !important;
            font-weight: normal !important;
        }
    }

    &-meeting {
        display: flex;
        flex-direction: column;
        width: 100%;

        &-item {
            position: relative;
            display: flex;
            align-items: center;
            overflow: hidden;
            width: 100%;
            padding-bottom: 10px;
            margin-bottom: 6px;
            border-bottom: 1px solid rgba($color: #FFF, $alpha: .2);

            .left {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                flex-grow: 0;
                margin: 0 12px 0 4px;
            }

            .mid {
                flex-grow: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
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
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        pointer-events: none;
                        opacity: .7;
                    }

                    .green {
                        display: flex;
                        align-items: center;
                        color: $md-green-40;
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
                align-items: center;

                .btn {
                    padding: 0 10px;
                    min-width: 0;
                    font-size: 14px;
                }

                
            }
        }

        &-cont {
            padding: 8px;

            .scrollcontent-wrap {
                display: flex;
                flex-direction: column;
                width: calc(100%);
                padding-bottom: 8px;

                .invited {
                    @include flex(row, flex-start);
                    margin-bottom: 12px;

                    .avatar {
                        margin-right: 8px;
                    }

                    .lb {
                        font-size: 14px;
                        opacity: .95;
                    }
                }

                .subtitlegrp {
                    @include flex(row, flex-start);
                }

                .subtitle {
                    @include flex(row, flex-start);
                    font-weight: 700;
                    flex-grow: 1;
                    height: 32px;
                    margin-bottom: 4px;
                    font-size: 14px;

                    .lb {
                        flex-grow: 1;
                    }
                }

                .md-button {
                    padding: 0 10px;
                    min-width: 0;
                    font-size: 14px;
                    font-weight: normal;
                }

                .cattitle {
                    font-weight: 600;
                    font-size: 14px;
                }

                .text-link {
                    font-size: 14px;
                    text-decoration: underline;
                }

                .accepted-avatars {
                    @include flex(row, flex-start);
                    margin-bottom: 12px;

                    .avatar {
                        margin-right: 8px;
                    }

                    .lb {
                        font-size: 14px;
                        margin-left: 4px;
                    }
                }

                .txt {
                    opacity: .95;
                }

                .des {
                    display: flex;
                    align-items: center;
                    color: rgba($color: #FFF, $alpha: .7);
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                .des2 {
                    margin-bottom: 0;
                }

                .icobtn {
                    @include flex;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    margin-left: 8px;

                    &:hover {
                        background-color: rgba($color: #FFF, $alpha: .11);
                    }

                    &:active {
                        background-color: rgba($color: #FFF, $alpha: .2);
                    }
                }

                .conitm {
                    @include flex(row, flex-start);
                    font-size: 14px;
                    border-radius: 8px;
                    background-color: rgba($color: #FFF, $alpha: .11);
                    margin-bottom: 8px;

                    .thumb {
                        width: 64px;
                        height: 50px;
                        margin-right: 12px;
                    }

                    .colr {
                        @include flex(column, flex-start, flex-start);

                        .l1 {
                            font-weight: 600;
                            opacity: .95;
                        }

                        .l2 {
                            @include flex(row, flex-start);
                            opacity: .7;
                        }
                    }
                }

                .conitm2 {
                    @include flex(row, flex-start);
                    font-size: 14px;
                    border-radius: 8px;
                    margin-bottom: 8px;

                    .coll {
                        @include flex;
                        margin-right: 8px;
                    }

                    .colm {
                        @include flex;
                        margin-right: 8px;
                    }

                    .colr {
                        @include flex(column, flex-start, flex-start);

                        .l1 {
                            opacity: .95;
                            font-size: 16px;
                            margin-top: -2px;
                        }

                        .l2 {
                            @include flex(row, flex-start);
                            opacity: .7;
                            margin-top: -4px;
                        }
                    }
                }

                .btnrow {
                    @include flex(row, flex-start);
                    margin-top: 16px;
                }


                .block {
                    position: relative;
                    border-radius: 4px;
                    padding: 4px 8px;


                    &.editable:hover {
                        background: rgba(255, 255, 255, 0.07);
                    }

                    .blocktt {
                        display: flex;
                        flex-direction: column;

                        &.clsed {
                            flex-direction: row;
                            align-items: center;

                            .tagrow {
                                margin: 2px 0;
                            }
                        }

                        .lb {
                            font-size: 12px;
                            font-weight: bold;
                            opacity: .7;
                            min-width: 90px;
                        }

                        .tagrow {
                            display: flex;
                            margin: 4px 0;

                            .tag {
                                @include flex;
                                background: #707070;
                                border-radius: 4px;
                                padding: 0 6px;
                                height: 20px;
                                font-size: 12px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }

                            &.editing {
                                .tag {
                                    background: rgba(255, 255, 255, 0.07);
                                    color: rgba(255, 255, 255, 0.4);
                                }
                            }
                        }
                    }

                    .blkcont {
                        font-size: 14px;


                        .gray {
                            color: rgba(255, 255, 255, 0.4);
                        }

                        .blue {
                            color: #64B4FA;
                        }

                        ul {
                            margin: 0;
                            padding-left: 24px;

                            li {
                                text-indent: 0;
                            }
                        }

                        .editing {
                            width: 100%;
                            margin-bottom: 8px;
                            background: rgba(255, 255, 255, 0.11);
                            border: 1px solid rgba(255, 255, 255, 0.9);
                            border-radius: 8px;
                            font-size: 14px;
                            color: white;
                            padding: 0 8px;
                            max-height: 184px;
                            overflow-y: scroll;
                            overscroll-behavior: contain;

                            &:focus {
                                outline: none !important;
                            }
                        }

                        .btns {
                            @include flex(row, flex-end);

                            .btn {
                                font-size: 14px;
                            }
                        }
                    }


                }

            }
        }

    }


    .dot-divider {
        margin: 0 8px;
    }


    /* theme ----- light/hybrid */
    &.light,
    &.hybrid {
        color: $text-color-primary-light-ui;



    }

}
</style>
