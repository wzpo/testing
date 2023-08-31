<template>
    <div class='chatitem' :class="[theme]">
        <presence-avatar v-if="type !== 'divider-new' && type !== 'info' && !avatarHtml" :title="name" :src="avatarUrl"
            :size="avatarSize" :presence="status" :theme="theme" class="avatar" :style="{
                height: `${avatarSize}px`,
                marginRight: `${avatarSize < 32 ? 2 : 8}px`,
            }" v-tooltip="{
    content: name !== me.name && name !== 'You' ? contactCardTemplate : null,
    html: true,
    placement: 'left',
    classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
    autoHide: false,
    delay: 200,
}" />
        <div v-if="avatarHtml" class="avatar-html" :style="{
            height: `${avatarSize}px`,
            width: `${avatarSize}px`,
            marginRight: `${avatarSize < 32 ? 2 : 8}px`,
        }" v-html="avatarHtml"></div>
        <div v-if="type !== 'divider-new' && type !== 'info'" class="colr" :class="{
            active: active,
            disable: disableHover,
        }" @mouseover="() => { this.ishover = true }" @mouseout="() => { this.ishover = false }">
            <div class='line1'>
                <span class="name" :class="{ me: name === 'You', flexgrow: timeRightAlign }">{{ name }}</span>
                <span class="time">{{ time }}</span>
            </div>

            <div v-if="type === 'msg'" class='cont-msg'>
                <div v-if="attachment && attachment.type === 'miro-embed'" class='attachment miro-embed'>
                    <md-button aria-label="button" color="green" size="24" class="btn" @click="shareInMeeting">Share in
                        Meeting</md-button>
                </div>

                <div v-if="attachment && attachment.type === 'miro-added'" class='attachment miro-added'>
                    <wl-icon name="copy-bold" size="20" class="ico" />
                </div>

                <div v-if="attachment && attachment.type === 'image'" class='attachment image' @click="click && click()">
                    <div v-if="attachment.file" class="img"
                        :style="{ backgroundImage: `url(${filePath}${attachment.file})` }"></div>
                    <div v-if="attachment.title" class='imagett'>{{ attachment.title }}</div>
                </div>

                <div v-if="attachment && attachment.type === 'canvas'" class='attachment image' @click="click && click()">
                    <div class="img" ref="canvas"></div>
                    <div v-if="attachment.title" class='imagett'>{{ attachment.title }}</div>
                </div>

                <div class='lb_msg' v-html="msg"> </div>

                <div v-if="reactions" class="reactions">
                    <div v-for="(itm, idx) in reactions" :key="`rct-item${idx}`" class="btn-reaction">
                        <div :class="['ico', !reactionAnimate ? `reaction--${itm.name}` : `reaction-play--${itm.name}`]">
                        </div>
                        <div :class="['number', itm.self ? 'self' : '']">{{ itm.number }}</div>
                    </div>
                    <div class="btn-reaction">
                        <wl-icon name="reactions-bold" size="12" color="white" />
                    </div>
                </div>

            </div>

            <div v-if="type === 'cal'" class='cont-cal'>
                <div class="row1">
                    <div class="row1time">
                        <span class="dt">{{meetinginfo.date}}</span>
                        <span class="tm">{{meetinginfo.time}}</span>
                    </div>
                    <div class="row1tt">{{ meetinginfo.title }}</div>
                </div>
                <div class="marker"></div>

            </div>

            <div v-if="type === 'meeting' && meetinginfo" class='cont-meeting'>
                <div class="marker"></div>
                <div class="item-meeting">
                    <div v-if="meetinginfo.organizer" class='left'>
                        <presence-avatar v-if="meetinginfo.organizer" :title="meetinginfo.organizer"
                            :src="people(meetinginfo.organizer).avatar ? $store.state.avatarPath + people(meetinginfo.organizer).avatar : ''"
                            :color="'white'" :backgroundColor="'#545454'" :size="32"
                            :presence="people(meetinginfo.organizer).status" :theme="theme === 'light' ? 'light' : 'dark'"
                            class="avatar" />
                        <md-avatar v-if="!meetinginfo.organizer" :title="meetinginfo.title" type="group" :size="32"
                            color="#FFFFFF" :fontWeight="600" :backgroundColor="'#545454'" class="avatar" />
                    </div>

                    <div class='mid'>
                        <span class="row1">
                            <span class="txt"><b>{{ meetinginfo.title }}</b></span>
                            <wl-icon v-if="meetinginfo.team" name="dot-divider" size="4" class="divider" />
                            <span v-if="meetinginfo.team" class="spacename text-link">{{ meetinginfo.team }}</span>
                        </span>

                        <span class="row2">
                            <span class="subline">
                                {{ meetinginfo.date ? `${meetinginfo.date}` : `` }}
                                <wl-icon v-if="meetinginfo.date" name="dot-divider" size="4" class="divider" />
                                {{ meetinginfo.time ? meetinginfo.time : `${meetinginfo.start} - ${meetinginfo.end}` }}
                            </span>
                        </span>
                        <span v-if="meetinginfo.tags" class="row3">
                            <div v-for="(tag, idx) in meetinginfo.tags" :key="`k${idx}`" class="tag" @click="tagClickHandler($event, tag)">
                                {{ tag.name }}
                            </div>
                        </span>

                        <span v-if="meetinginfo.summary" class="meetingsummary">
                            <div class="divider-h"></div>
                            <div class="section">
                                <div class="subtitlegrp">
                                    <span class="subtitle">
                                        Meeting summary
                                        <wl-icon name="show-bold" size="16" class="ico" />
                                    </span>
                                </div>

                                <div class="block" >
                                    <div class="blocktt" :class="{editing: summaryIsediting}" >
                                        <span class="lb">Meeting notes</span>
                                        <span class="tagrow" ><span class="tag">{{!summaryEdited ? 'Your personal AI suggested notes' : `Edited by ${me.name}`}}</span></span>
                                        <span class="spacer"></span>
                                        <span class="btnc" @click="summaryIsediting=true; summaryClsed=false;" >
                                            <wl-icon name="pen-bold" size="16" />
                                        </span>
                                    </div>
                                    <div class="blkcont" >
                                        <svg v-if="summaryIsediting" style="margin-top: 4px;" width="265" height="26" viewBox="0 0 265 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <mask id="mask0_39_76108" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="1" y="1" width="96" height="24">
                                            <rect x="1" y="1" width="96" height="24" rx="12" fill="white"/>
                                            </mask>
                                            <g mask="url(#mask0_39_76108)">
                                            <path d="M19.6517 12.6791C20.0693 12.1474 20.2916 11.4885 20.2815 10.8125C20.2806 10.0586 19.9807 9.33575 19.4476 8.80263C18.9145 8.26951 18.1917 7.96962 17.4377 7.96875H13.9377C13.7637 7.96876 13.5968 8.0379 13.4737 8.16097C13.3506 8.28404 13.2815 8.45095 13.2815 8.625V17.3752C13.2815 17.5492 13.3507 17.7161 13.4738 17.8392C13.5968 17.9623 13.7637 18.0314 13.9377 18.0315H18.3127C18.9469 18.0315 19.5628 17.8196 20.0626 17.4294C20.5625 17.0392 20.9176 16.4931 21.0715 15.878C21.2254 15.2628 21.1692 14.6139 20.912 14.0343C20.6548 13.4547 20.2112 12.9777 19.6517 12.6791ZM14.594 9.28125H17.4377C17.8437 9.28174 18.2329 9.44323 18.52 9.73028C18.807 10.0173 18.9685 10.4065 18.969 10.8125C18.9848 11.0054 18.9609 11.1995 18.8988 11.3828C18.8367 11.566 18.7376 11.7346 18.6078 11.8781C18.4779 12.0216 18.32 12.137 18.1438 12.2171C17.9677 12.2972 17.7769 12.3403 17.5834 12.3438H14.594V9.28125ZM18.3127 16.719H14.594V13.656H18.3127C18.7189 13.656 19.1084 13.8174 19.3957 14.1046C19.6829 14.3918 19.8442 14.7813 19.8442 15.1875C19.8442 15.5937 19.6829 15.9832 19.3957 16.2704C19.1084 16.5576 18.7189 16.719 18.3127 16.719Z" fill="white" fill-opacity="0.95"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M33 0.5H65V25.5H33V0.5Z" stroke="#484848"/>
                                            <path d="M52.9373 8.6875H47.6873C47.5712 8.6875 47.4599 8.73359 47.3779 8.81564C47.2958 8.89769 47.2498 9.00897 47.2498 9.125C47.2498 9.24103 47.2958 9.35231 47.3779 9.43436C47.4599 9.51641 47.5712 9.5625 47.6873 9.5625H49.7242L47.3617 17.4375H45.0623C44.9462 17.4375 44.8349 17.4836 44.7529 17.5656C44.6708 17.6477 44.6248 17.759 44.6248 17.875C44.6248 17.991 44.6708 18.1023 44.7529 18.1844C44.8349 18.2664 44.9462 18.3125 45.0623 18.3125H50.3123C50.4283 18.3125 50.5396 18.2664 50.6216 18.1844C50.7037 18.1023 50.7498 17.991 50.7498 17.875C50.7498 17.759 50.7037 17.6477 50.6216 17.5656C50.5396 17.4836 50.4283 17.4375 50.3123 17.4375H48.2753L50.6378 9.5625H52.9372C53.0533 9.5625 53.1646 9.51641 53.2466 9.43436C53.3286 9.35231 53.3747 9.24103 53.3747 9.125C53.3747 9.00897 53.3286 8.89769 53.2466 8.81564C53.1646 8.73359 53.0533 8.6875 52.9373 8.6875Z" fill="white" fill-opacity="0.95"/>
                                            <path d="M84.9375 17.3748H77.0625C76.9465 17.3748 76.8352 17.4208 76.7531 17.5029C76.6711 17.5849 76.625 17.6962 76.625 17.8123C76.625 17.9283 76.6711 18.0396 76.7531 18.1216C76.8352 18.2037 76.9465 18.2498 77.0625 18.2498H84.9375C85.0535 18.2498 85.1648 18.2037 85.2469 18.1216C85.3289 18.0396 85.375 17.9283 85.375 17.8123C85.375 17.6962 85.3289 17.5849 85.2469 17.5029C85.1648 17.4208 85.0535 17.3748 84.9375 17.3748Z" fill="white" fill-opacity="0.95"/>
                                            <path d="M81 16.4998C81.9279 16.4987 82.8176 16.1296 83.4737 15.4735C84.1298 14.8173 84.4989 13.9277 84.5 12.9998V8.18726C84.5 8.07122 84.4539 7.95994 84.3719 7.8779C84.2898 7.79585 84.1785 7.74976 84.0625 7.74976C83.9465 7.74976 83.8352 7.79585 83.7531 7.8779C83.6711 7.95994 83.625 8.07122 83.625 8.18726V12.9998C83.625 13.6959 83.3484 14.3636 82.8562 14.8559C82.3639 15.3482 81.6962 15.6248 81 15.6248C80.3038 15.6248 79.6361 15.3482 79.1438 14.8559C78.6516 14.3636 78.375 13.6959 78.375 12.9998V8.18726C78.375 8.07122 78.3289 7.95994 78.2469 7.8779C78.1648 7.79585 78.0535 7.74976 77.9375 7.74976C77.8215 7.74976 77.7102 7.79585 77.6281 7.8779C77.5461 7.95994 77.5 8.07122 77.5 8.18726V12.9998C77.5011 13.9277 77.8702 14.8173 78.5263 15.4735C79.1824 16.1296 80.0721 16.4987 81 16.4998Z" fill="white" fill-opacity="0.95"/>
                                            </g>
                                            <rect x="0.5" y="0.5" width="97" height="25" rx="12.5" stroke="white" stroke-opacity="0.2"/>
                                            <mask id="mask1_39_76108" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="105" y="1" width="96" height="24">
                                            <rect x="105" y="1" width="96" height="24" rx="12" fill="white"/>
                                            </mask>
                                            <g mask="url(#mask1_39_76108)">
                                            <path d="M124.901 8.62663L122.901 9.7266V10.689L124.888 9.6016V17.3762H125.813V8.62663H124.901Z" fill="white" fill-opacity="0.95"/>
                                            <path d="M120.999 8.62598C120.757 8.62598 120.562 8.82189 120.562 9.06348V12.5635H117.062V9.06348C117.062 8.82189 116.866 8.62598 116.624 8.62598C116.382 8.62598 116.187 8.82189 116.187 9.06348V16.9383C116.187 17.1801 116.382 17.3758 116.624 17.3758C116.866 17.3758 117.062 17.1801 117.062 16.9383V13.4387H120.562V16.9383C120.562 17.1801 120.757 17.3758 120.999 17.3758C121.241 17.3758 121.437 17.1801 121.437 16.9383V9.06348C121.437 8.82189 121.241 8.62598 120.999 8.62598Z" fill="white" fill-opacity="0.95"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M137 0.5H169V25.5H137V0.5Z" stroke="#484848"/>
                                            <path d="M157.238 14.7744C157.924 14.113 158.397 13.574 158.659 13.1575C158.993 12.6512 159.161 12.1041 159.161 11.516C159.161 10.8464 158.932 10.2951 158.475 9.86229C157.968 9.37225 157.299 9.12725 156.466 9.12725C155.731 9.12725 155.106 9.31931 154.592 9.70295C154.004 10.1276 153.656 10.7157 153.55 11.467H154.518C154.575 11.018 154.759 10.6544 155.069 10.3767C155.42 10.0582 155.878 9.89904 156.441 9.89904C156.956 9.89904 157.372 10.0298 157.691 10.291C158.05 10.585 158.23 10.9975 158.23 11.5281C158.23 11.9368 158.121 12.3183 157.905 12.6736C157.689 13.0288 157.287 13.4965 156.698 14.0762L153.697 17.0409V17.886H159.136V17.0409H154.922L157.238 14.7744Z" fill="white" fill-opacity="0.95"/>
                                            <path d="M151.687 9.12598C151.445 9.12598 151.249 9.32189 151.249 9.56348V13.0635H147.749V9.56348C147.749 9.32189 147.554 9.12598 147.312 9.12598C147.07 9.12598 146.874 9.32189 146.874 9.56348V17.4387C146.874 17.6805 147.07 17.8762 147.312 17.8762C147.554 17.8762 147.749 17.6805 147.749 17.4387V13.9383H151.249V17.4387C151.249 17.6805 151.445 17.8762 151.687 17.8762C151.929 17.8762 152.124 17.6805 152.124 17.4387V9.56348C152.124 9.32185 151.929 9.12598 151.687 9.12598Z" fill="white" fill-opacity="0.95"/>
                                            <path d="M190.655 13.5015C190.319 13.0932 189.87 12.8411 189.31 12.745C189.759 12.625 190.119 12.4088 190.391 12.0965C190.704 11.7444 190.86 11.312 190.86 10.7995C190.86 10.1591 190.627 9.64257 190.163 9.25035C189.667 8.83398 189.018 8.62573 188.217 8.62573C187.497 8.62573 186.884 8.79386 186.38 9.1303C185.795 9.50673 185.447 10.0429 185.335 10.7395H186.272C186.344 10.3473 186.528 10.0309 186.824 9.7908C187.169 9.51863 187.617 9.38235 188.17 9.38235C188.642 9.38235 189.038 9.49045 189.358 9.70662C189.75 9.97901 189.947 10.3672 189.947 10.8715C189.947 11.312 189.807 11.6722 189.527 11.9524C189.23 12.2487 188.842 12.3968 188.361 12.3968H187.617V13.1774H188.398C188.87 13.1774 189.266 13.2972 189.586 13.5373C190.003 13.8497 190.211 14.3059 190.211 14.9067C190.211 15.3954 190.055 15.7915 189.743 16.0957C189.374 16.4558 188.862 16.6362 188.205 16.6362C187.701 16.6362 187.281 16.5281 186.945 16.3119C186.568 16.0718 186.328 15.7074 186.224 15.219H185.275C185.379 15.8437 185.66 16.344 186.116 16.7204C186.644 17.1604 187.345 17.3809 188.217 17.3809C189.026 17.3809 189.694 17.1848 190.223 16.7922C190.824 16.3358 191.124 15.7112 191.124 14.9187C191.124 14.3585 190.968 13.886 190.655 13.5015Z" fill="white" fill-opacity="0.95"/>
                                            <path d="M183.687 8.62613C183.445 8.62613 183.249 8.82204 183.249 9.06363V12.5636H179.749V9.06363C179.749 8.82204 179.553 8.62613 179.312 8.62613C179.07 8.62613 178.874 8.82204 178.874 9.06363V16.9386C178.874 17.1804 179.07 17.3761 179.312 17.3761C179.553 17.3761 179.749 17.1804 179.749 16.9386V13.4386H183.249V16.9386C183.249 17.1804 183.445 17.3761 183.687 17.3761C183.928 17.3761 184.124 17.1804 184.124 16.9386V9.06363C184.124 8.82204 183.928 8.62613 183.687 8.62613Z" fill="white" fill-opacity="0.95"/>
                                            </g>
                                            <rect x="104.5" y="0.5" width="97" height="25" rx="12.5" stroke="white" stroke-opacity="0.2"/>
                                            <path d="M218.146 15.8535C218.24 15.9473 218.367 15.9999 218.5 15.9999C218.633 15.9999 218.76 15.9473 218.854 15.8535L223.854 10.8535C223.901 10.8074 223.939 10.7522 223.965 10.6912C223.991 10.6303 224.005 10.5647 224.005 10.4984C224.006 10.4321 223.993 10.3664 223.968 10.305C223.943 10.2437 223.906 10.188 223.859 10.1411C223.812 10.0942 223.756 10.0571 223.695 10.032C223.634 10.0068 223.568 9.99416 223.502 9.99466C223.435 9.99517 223.37 10.0089 223.309 10.0349C223.248 10.061 223.193 10.0989 223.146 10.1465L218.146 15.1465C218.053 15.2403 218 15.3674 218 15.5C218 15.6326 218.053 15.7598 218.146 15.8535Z" fill="white" fill-opacity="0.7"/>
                                            <path d="M222.029 15.0008C221.897 14.9919 221.767 15.0349 221.667 15.1206C221.566 15.2063 221.503 15.328 221.491 15.4595C221.439 16.1087 221.158 16.7182 220.697 17.179L219.679 18.1973C219.165 18.7113 218.468 19 217.741 19C217.014 19 216.317 18.7113 215.803 18.1973C215.289 17.6833 215 16.9862 215 16.2593C215 15.5324 215.289 14.8353 215.803 14.3213L216.821 13.3028C217.282 12.8424 217.891 12.5609 218.54 12.5086C218.606 12.5046 218.671 12.4874 218.731 12.458C218.79 12.4286 218.844 12.3876 218.887 12.3374C218.931 12.2872 218.964 12.2288 218.985 12.1656C219.005 12.1024 219.013 12.0358 219.008 11.9695C219.003 11.9032 218.984 11.8387 218.954 11.7796C218.923 11.7206 218.881 11.6682 218.83 11.6256C218.779 11.583 218.72 11.551 218.656 11.5315C218.593 11.512 218.526 11.5054 218.46 11.512C217.574 11.5831 216.743 11.9673 216.114 12.5957L215.096 13.6143C214.4 14.3171 214.012 15.2665 214.014 16.2551C214.017 17.2436 214.411 18.1909 215.11 18.89C215.809 19.589 216.756 19.9829 217.745 19.9856C218.733 19.9882 219.683 19.5995 220.386 18.9043L221.404 17.886C222.033 17.2571 222.417 16.4252 222.488 15.539C222.493 15.4735 222.486 15.4077 222.466 15.3452C222.445 15.2827 222.413 15.2248 222.37 15.1748C222.328 15.1248 222.276 15.0837 222.217 15.0539C222.159 15.024 222.095 15.006 222.029 15.0008Z" fill="white" fill-opacity="0.7"/>
                                            <path d="M226.904 7.09573C226.202 6.39531 225.251 6.00195 224.259 6.00195C223.268 6.00195 222.316 6.39531 221.614 7.09573L220.608 8.10183C219.953 8.72106 219.56 9.56835 219.511 10.4688C219.507 10.5343 219.516 10.6 219.537 10.6622C219.558 10.7244 219.591 10.7817 219.635 10.8311C219.678 10.8804 219.731 10.9207 219.79 10.9497C219.848 10.9787 219.913 10.9958 219.978 11C220.044 11.0043 220.109 10.9955 220.171 10.9744C220.234 10.9532 220.291 10.92 220.34 10.8767C220.39 10.8333 220.43 10.7807 220.459 10.7217C220.488 10.6628 220.505 10.5988 220.509 10.5332C220.544 9.88176 220.828 9.26861 221.303 8.82133L222.321 7.80278C222.835 7.28879 223.532 7.00004 224.259 7.00006C224.986 7.00008 225.683 7.28886 226.197 7.80288C226.711 8.31689 227 9.01404 227 9.74095C227 10.4679 226.711 11.165 226.197 11.679L225.179 12.6973C224.718 13.1576 224.109 13.4391 223.46 13.4912C223.331 13.5011 223.211 13.5606 223.125 13.6572C223.039 13.7538 222.994 13.88 222.999 14.0093C223.004 14.1386 223.059 14.2609 223.152 14.3505C223.246 14.4401 223.37 14.49 223.499 14.4898C223.513 14.4898 223.526 14.4893 223.539 14.4883C224.425 14.4171 225.257 14.0329 225.886 13.4043L226.904 12.386C227.605 11.684 227.998 10.7327 227.998 9.74089C227.998 8.7491 227.605 7.79781 226.904 7.09573Z" fill="white" fill-opacity="0.7"/>
                                            <circle cx="253" cy="13" r="12" fill="white" fill-opacity="0.07"/>
                                            <path d="M256.147 14.6467L256 14.7933V10C256 9.89911 255.969 9.80061 255.912 9.71743C255.855 9.63426 255.774 9.5703 255.68 9.53396C255.586 9.49762 255.483 9.49061 255.385 9.51383C255.287 9.53706 255.198 9.58944 255.13 9.6641L253 12.012L250.87 9.66405C250.802 9.58939 250.713 9.53701 250.615 9.51378C250.517 9.49056 250.414 9.49758 250.32 9.53392C250.226 9.57026 250.145 9.63423 250.088 9.71741C250.031 9.8006 250 9.89911 250 10V15C250 15.1326 250.053 15.2598 250.146 15.3536C250.24 15.4473 250.367 15.5 250.5 15.5C250.633 15.5 250.76 15.4473 250.854 15.3536C250.947 15.2598 251 15.1326 251 15V11.2956L252.63 13.092C252.678 13.1416 252.736 13.181 252.799 13.2079C252.863 13.2349 252.931 13.2488 253 13.2488C253.069 13.2488 253.138 13.2349 253.201 13.2079C253.265 13.181 253.322 13.1416 253.37 13.092L255 11.2956V14.793L254.854 14.6467C254.807 14.5991 254.752 14.5612 254.691 14.5351C254.63 14.509 254.565 14.4953 254.498 14.4948C254.432 14.4943 254.366 14.507 254.305 14.5322C254.244 14.5573 254.188 14.5944 254.141 14.6413C254.094 14.6881 254.057 14.7439 254.032 14.8052C254.007 14.8666 253.994 14.9323 253.995 14.9986C253.995 15.0649 254.009 15.1304 254.035 15.1914C254.061 15.2524 254.099 15.3075 254.146 15.3537L255.147 16.3537C255.241 16.4475 255.368 16.5001 255.5 16.5001C255.633 16.5001 255.76 16.4475 255.854 16.3537L256.854 15.3537C256.945 15.2595 256.996 15.133 256.995 15.0018C256.994 14.8705 256.941 14.7448 256.848 14.652C256.755 14.5592 256.63 14.5066 256.498 14.5056C256.367 14.5046 256.241 14.5553 256.147 14.6467Z" fill="white" fill-opacity="0.95"/>
                                            <path d="M256.5 7H249.5C248.837 7.00078 248.202 7.26442 247.733 7.7331C247.264 8.20177 247.001 8.8372 247 9.5V16.5C247.001 17.1628 247.264 17.7982 247.733 18.2669C248.202 18.7356 248.837 18.9992 249.5 19H256.5C257.163 18.9992 257.798 18.7356 258.267 18.2669C258.736 17.7982 258.999 17.1628 259 16.5V9.5C258.999 8.8372 258.736 8.20177 258.267 7.7331C257.798 7.26442 257.163 7.00078 256.5 7ZM258 16.5C258 16.8977 257.841 17.279 257.56 17.5602C257.279 17.8414 256.898 17.9996 256.5 18H249.5C249.102 17.9996 248.721 17.8414 248.44 17.5602C248.159 17.279 248 16.8977 248 16.5V9.5C248 9.10231 248.159 8.72103 248.44 8.43982C248.721 8.15861 249.102 8.00044 249.5 8H256.5C256.898 8.00044 257.279 8.15861 257.56 8.43982C257.841 8.72103 258 9.10231 258 9.5V16.5Z" fill="white" fill-opacity="0.95"/>
                                        </svg>

                                        <div :class="{editing: summaryIsediting}" 
                                            :contenteditable="summaryIsediting" 
                                            >
                                            <span class="gray">Avaya</span> is positioning new metrics to demonstrate it is transforming its business to a software and service company.
                                            <fragment v-if="!summaryClsed" >
                                                <span class="gray">Clarissa</span> will check with <span class="blue">Jenny</span> to public beta, enabling outbound usage.
                                            </fragment>
                                            <fragment v-if="summaryClsed" >
                                                ...
                                            </fragment>
                                            
                                            <ul v-if="!summaryClsed" >
                                                <li>Software and Service was 88% of total revenue ~$600M, +1% </li>
                                                <li>Recurring revenue was 64% of total revenue ~$436M +4% </li>
                                                <li>Product revenue from software ~$162M -4%</li>
                                                <li>Product revenue from hardware ~$83% -31% </li>
                                                <li>Cloud, Alliance and Partner (CAPs) was 23% of revenue</li> 
                                            </ul>
                                        </div>

                                        <div v-if="summaryIsediting" class="btns" >
                                            <md-button class="btn md-button-solid" aria-label="x" :size="28" @click="() => {summaryIsediting=false; summaryEdited=true;}">Save</md-button>
                                            <md-button class="btn md-button-outline" aria-label="x" :size="28" @click="summaryIsediting=false">Cancel</md-button>
                                        </div>
                                        
                                    </div>

                                </div>

                                <div v-if="!summaryClsed" class="divider-h"></div>

                                <div v-if="!summaryClsed" class="block" >
                                    <div class="blocktt" :class="{editing: summaryIsediting}" >
                                        <span class="lb">Action items</span>
                                        <span class="tagrow"><span class="tag">Your personal AI suggested action items</span></span>
                                        <span class="spacer"></span>
                                        <span class="btnc" >
                                            <wl-icon name="pen-bold" size="16" />
                                        </span>
                                    </div>
                                    <div class="blkcont">
                                        <ul>
                                            <li>Check with Felix to public beta, enabling outbound usage. </li>
                                            <li>Austen Jones will follow up greater integrations between Vonage Business Cloud, its UCaaS solution, and Vonage Contact Center.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="text-link" @click="toggleSummary">
                                    {{ summaryClsed ? 'Show full summary' : 'Hide summary' }}
                                </div>

                            </div>

                        </span>
                    </div>

                    <div v-if="meetinginfo.icons" class="icons">
                        <wl-icon name="recurring-bold" size="12" class="ico" />
                        <wl-icon name="webex-helix-filled" size="12" class="ico" />
                    </div>

                </div>

            </div>

            <div v-if="type === 'image'" class='cont-image' @click="click && click()">
                <div class='file' :style="{ 
                    backgroundImage: `url(${filePath}${file.name})`,
                    width: file.width,
                    height: file.height,
                    }">
                    <wl-icon v-if="file.icon" :name="file.icon" size="12" />
                    <div class="bottom">
                        <div class='left'>
                            <div class='lb_title'>{{ file.title }}</div>
                            <div class='lb_line2'>
                                <span class="size">{{ file.size }}</span>
                                <wl-icon name="dot-divider" size="4" class="dot-divider" style="margin:0 8px;" />
                                <wl-icon name="check-circle-filled" size="15" color="#3CC29A" />
                                <span style="color:#3CC29A" >Safe</span>
                            </div>
                        </div>
                        <div class='right'>
                            <md-button class="btn md-button-solid btn-circle-28" aria-label="x" :size="28">
                                <wl-icon name="download-bold" size="16" color="gray-95" />
                            </md-button>
                        </div>
                    </div>
                </div>
                <div class='lb_msg' v-html="msg"></div>

                <div v-if="reactions" class="reactions">
                    <div v-for="(itm, idx) in reactions" :key="`rct-item${idx}`" class="btn-reaction">
                        <div :class="['ico', !reactionAnimate ? `reaction--${itm.name}` : `reaction-play--${itm.name}`]">
                        </div>
                        <div :class="['number', itm.self ? 'self' : '']">{{ itm.number }}</div>
                    </div>
                    <div class="btn-reaction">
                        <wl-icon name="reactions-bold" size="12" color="white" />
                    </div>
                </div>
            </div>

            <div v-if="type === 'file'" class='cont-file' @click="click && click()">
                <div class='file' >
                    <div class="iconimg" v-html="file.icon"></div>
                    <div class='left'>
                        <div class='lb_title'>{{ file.name }}</div>
                        <div class='lb_line2'>
                            <span class="size">{{ file.size }}</span>
                            <wl-icon name="dot-divider" size="4" class="dot-divider" style="margin:0 8px;" />
                            <wl-icon name="check-circle-filled" size="15" color="#3CC29A" />
                            <span style="color:#3CC29A" >Safe</span>
                        </div>
                    </div>
                    <div class='right'>
                        <md-button class="btn md-button-solid btn-circle-28" aria-label="x" :size="28">
                            <wl-icon name="download-bold" size="16" color="gray-95" />
                        </md-button>
                    </div>
                </div>
                <div class='lb_msg' v-html="msg"></div>

                <div v-if="reactions" class="reactions">
                    <div v-for="(itm, idx) in reactions" :key="`rct-item${idx}`" class="btn-reaction">
                        <div :class="['ico', !reactionAnimate ? `reaction--${itm.name}` : `reaction-play--${itm.name}`]">
                        </div>
                        <div :class="['number', itm.self ? 'self' : '']">{{ itm.number }}</div>
                    </div>
                    <div class="btn-reaction">
                        <wl-icon name="reactions-bold" size="12" color="white" />
                    </div>
                </div>
            </div>

            <div v-if="replies" class="replies">
                <chat-item v-for="(p, index) in replies" :key="`replies${index}`" :type="p.type" :thread="p.thread"
                    :time="p.time" :name="p.name" :isbot="p.isbot" :msg="p.msg" :attachment="p.attachment" :title="p.title" :reactions="p.reactions"
                    :icon="p.icon" :file="p.file" :meeting="p.meeting" :timeRightAlign="p.timeRightAlign" :disableHover="p.disableHover"
                    :avatarSize="p.avatarSize" :avatarHtml="p.avatarHtml" :click="p.click" tools="reply" />
            </div>
            <div v-if="replies" class="repliesbot">
                <md-button class="btn md-button-outline" aria-label="x" :size="28" >
                    <wl-icon name="reply-bold" size="16" class="ico" />
                    Reply
                </md-button>
                <md-button class="btn md-button-outline" aria-label="x" :size="28" >
                    <wl-icon name="hide-bold" size="16" class="ico" />
                    Collapse
                </md-button>
            </div>

            <div v-if="tools" v-show="ishover || moreMenuVisible" class="tools" :style="{ backgroundColor: contentColor[1] }">
                <div v-show="name === 'You'" class="itm">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.2991 1.70081C10.1166 1.51818 9.89992 1.37331 9.66139 1.27447C9.42287 1.17563 9.16721 1.12476 8.90901 1.12476C8.65082 1.12476 8.39516 1.17563 8.15663 1.27447C7.91811 1.37331 7.70139 1.51818 7.51888 1.70081L1.34473 7.87512C1.27485 7.94458 1.21945 8.02722 1.18174 8.11824C1.14402 8.20927 1.12474 8.30687 1.125 8.40539V10.1251C1.12523 10.324 1.20432 10.5146 1.34492 10.6552C1.48553 10.7958 1.67616 10.8749 1.875 10.8751H3.59456C3.69312 10.8754 3.79075 10.8561 3.88181 10.8184C3.97286 10.7807 4.05553 10.7253 4.12502 10.6554L10.2991 4.48108C10.6672 4.11205 10.8739 3.61213 10.8739 3.09094C10.8739 2.56976 10.6672 2.06984 10.2991 1.70081ZM9.76888 3.95081L3.59473 10.1251H1.87502V8.40539L8.04915 2.23108C8.27725 2.00328 8.58647 1.87538 8.90884 1.87549C9.23121 1.8756 9.54035 2.00371 9.7683 2.23166C9.99625 2.45961 10.1244 2.76874 10.1245 3.09111C10.1246 3.41348 9.99667 3.7227 9.76888 3.95081Z"
                            fill="black" fill-opacity="0.95" />
                    </svg>
                </div>
                <div v-show="tools === 'thread'" class="itm">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.74003 3.75001H6.00003L5.99928 2.06251C5.99928 1.95214 5.96681 1.84421 5.90592 1.75215C5.84502 1.6601 5.75839 1.58799 5.65681 1.54482C5.55523 1.50165 5.44319 1.48931 5.33466 1.50935C5.22612 1.52939 5.12587 1.58092 5.04641 1.65751L0.913905 5.60296C0.86173 5.65598 0.820519 5.71877 0.792629 5.78773C0.764739 5.85669 0.750716 5.93047 0.751364 6.00485C0.752012 6.07924 0.767317 6.15276 0.796404 6.22123C0.825491 6.28969 0.86779 6.35175 0.92088 6.40385L5.04329 10.3388C5.12235 10.4164 5.22259 10.469 5.33144 10.4899C5.44028 10.5108 5.55287 10.4991 5.65508 10.4563C5.75729 10.4134 5.84456 10.3413 5.90593 10.249C5.9673 10.1567 6.00003 10.0483 6.00003 9.93751V8.25001H7.71937C10.0441 8.25001 10.4949 9.78189 10.5121 9.84451C10.5349 9.93297 10.5892 10.0101 10.6649 10.0613C10.7405 10.1125 10.8322 10.1344 10.9228 10.1228C11.0135 10.1112 11.0967 10.0669 11.157 9.99829C11.2173 9.92965 11.2504 9.84137 11.2502 9.75001V7.12089C11.2458 6.66767 11.1509 6.21989 10.9712 5.8038C10.7914 5.38771 10.5305 5.01167 10.2036 4.69773C9.87665 4.38379 9.49036 4.13826 9.06734 3.97552C8.64431 3.81279 8.19306 3.73612 7.74003 3.75001ZM10.5 8.47816C9.98092 7.97416 9.12003 7.50001 7.71955 7.50001H5.62522C5.52576 7.50001 5.43038 7.53952 5.36005 7.60985C5.28973 7.68017 5.25022 7.77556 5.25022 7.87501L5.25003 9.49944L1.58407 6.00001L5.24947 2.50051L5.25022 4.12501C5.25022 4.22447 5.28973 4.31985 5.36005 4.39018C5.43038 4.46051 5.52576 4.50001 5.62522 4.50001H7.74022C8.09444 4.4873 8.44763 4.54538 8.77913 4.67086C9.11062 4.79633 9.41375 4.98668 9.67077 5.23075C9.92779 5.47483 10.1335 5.76773 10.276 6.0923C10.4184 6.41687 10.4946 6.7666 10.5002 7.121L10.5 8.47816Z"
                            fill="black" fill-opacity="0.95" />
                    </svg>
                </div>
                <div class="itm">
                    <wl-icon name="reactions-bold" size="12" />
                </div>
                <div class="itm">
                    <wl-icon name="block-quote-bold" size="12" />
                </div>
                <div class="itm">
                    <wl-icon name="forward-message-bold" size="12" />
                </div>
                <div class="itm" :class="{ active: moreMenuVisible }" ref="tool-btn-more" @click="showMoreMenu">
                    <wl-icon name="more-bold" size="12" />
                </div>

            </div>

        </div>

        <div v-if="type === 'divider-new'" class="divider-new">
            <div class="line"></div>
            <span>New</span>
            <div class="line"></div>
        </div>

        <div v-if="type === 'info'" class="info">
            {{ msg }}
        </div>

    </div>
</template>

<script>

export default {
    props: {
        active: Boolean,
        type: String,
        name: String,
        msg: String,
        attachment: Object,
        date: String,
        time: String,
        title: String,
        icon: String,
        isbot: Boolean,
        click: Function,
        replies: Array,
        file: Object,
        tools: String,
        reactions: Array,
        meetinginfo: Object,
        timeRightAlign: Boolean,
        disableHover: Boolean,
        avatarSize: {
            type: Number,
            default: 32,
        },
        avatarHtml: String,
    },
    data() {
        return {
            ishover: false,
            moreMenuVisible: false,
            reactionAnimate: false,

            summaryClsed: true,
            summaryIsediting: false,
            summaryEdited: false,

            testMeetingTitle: 'Session: Hybrid Work',
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
        contentColor() {
            return this.themeColorList[this.theme][this.themeColor]['content'];
        },
        me() {
            return this.$store.getters.me;
        },
        avatar() {
            const nm = this.name === 'You' ? this.me.name : this.name;
            let people = this.$store.getters.people(nm);
            if (people) {
                return people.avatar;
            } else {
                return null;
            }
        },
        status() {
            if (this.isbot) {
                return 'bot';
            }
            let people = this.$store.getters.people(this.name);
            if (people) {
                return people.status;
            } else {
                return null;
            }
        },
        avatarUrl() {
            if (this.avatar !== null && this.avatar !== undefined) {
                return this.$store.state.avatarPath + this.avatar;
            } else {
                return '';
            }
        },
        abbr() {
            let arr = this.name.split(' ');
            return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
        },
        isMe() {
            let people = this.$store.getters.people(this.name);
            if (people) {
                return people.me;
            } else {
                return false;
            }
        },
        name2name() {
            let people = this.$store.getters.people(this.name);
            if (!people) {
                return '';
            }
            if (!people.me) {
                return this.name;
            } else {
                return 'You ';
            }
        },
        filePath() {
            return this.$store.state.filePath;
        },
        contactCardTemplate() {
            return this.$store.getters.contactCardTemplate(this.name, false);
        },
    },
    mounted() {
        this.reactionAnimate = true
        setTimeout(() => {
            this.reactionAnimate = false
        }, 1500);

        if (this.attachment && this.attachment.canvaskey) {
            let canvas = this.$store.state.savedCanvasFromHandtracking[this.attachment.canvaskey]
            canvas.style.width = `132px`;
            canvas.style.height = `76px`
            this.$refs.canvas.appendChild(canvas)
        }
    },
    watch: {

    },
    methods: {
        people(name) {
            return this.$store.getters.people(name);
        },
        showMoreMenu() {
            if (this.moreMenuVisible) {
                this.$popper.hideAll();
                return;
            }
            this.$popper.show(
                {
                    template: `
                <div class="common-menulist" style="width:260px;">
                  <div class='common-menulist-item common-menulist-item-32'>
                    <wl-icon name='pin-bold' size='16' />
                    <span class="lb" style="margin-left:8px; font-size: 14px;" >Pin message</span>
                  </div>
                  <div class='common-menulist-item common-menulist-item-32'>
                    <wl-icon name='flag-filled' size='16' />
                    <span class="lb" style="margin-left:8px; font-size: 14px;" >Unflag</span>
                  </div>
                  <div class='common-menulist-item common-menulist-item-32'>
                    <wl-icon name='mark-as-unread' size='16' />
                    <span class="lb" style="margin-left:8px; font-size: 14px;" >Mark as unread for me</span>
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
                    reference: this.$refs['tool-btn-more'],
                    closeTrigger: 'mousedown',
                    arrowVisible: false,
                    roundedCorner: true,
                    frameless: false,
                    borderRadius: '12px',
                    backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
                    appendToBody: true,
                    theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
                    options: {
                        placement: 'bottom-end',
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [10, 4],
                                },
                            },
                        ],
                    },
                }, // popper props
                {
                    opened: () => { this.moreMenuVisible = true },
                    closed: () => { this.moreMenuVisible = false },
                } // popper eventlistener
            );
        },
        shareInMeeting() {
            // start sharing
            /*
            this.$store.commit('meetingTypeXXXX', 'webex');
            this.$store.commit('meetingVisibleXXXXX', true);
            this.$store.commit('currentSharingXXXX', 'miro');
            this.$store.commit('videoLayoutXXX', 'stage-sharing');
            */
        },
        toggleSummary() {
            this.summaryClsed = !this.summaryClsed
            if (this.summaryClsed) {
                this.$nextTick(() => {
                    this.$emit('scrolltoend')
                })
            }
        },
        tagClickHandler(evt, tag) {
            evt.stopPropagation()
            evt.preventDefault()

            let selectedMeeting = {
                title: this.testMeetingTitle,
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
                    '3 Recordings',
                    'Meeting notes',
                    'Action items',
                ],
                }
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

            if (tag.data == 'recordings') {
                
                this.$eventBus.$emit('open-recording-player-window', {
                    meetingInfo: selectedMeeting,
                    smartChapter: smartChapter,
                }, {})
            } else if (tag.data == 'meetingnotes') {
                /*
                this.$store.commit('teamsMeetingOnloadData', {
                    selectedMeeting: this.testMeetingTitle,
                    jumpto: null,
                });
                this.$store.commit('teamsNav', 'meetings');
                */
                this.$eventBus.$emit('open-meeting-info-window', {
                    meetingInfo: selectedMeeting,
                    jumpto: null,
                    windowtitle: 'Meeting recaps',
                }, {})
            } else if (tag.data == 'actionitems') {
                /*
                this.$store.commit('teamsMeetingOnloadData', {
                    selectedMeeting: this.testMeetingTitle,
                    jumpto: 'actionitems',
                });
                this.$store.commit('teamsNav', 'meetings');
                */
                this.$eventBus.$emit('open-meeting-info-window', {
                    meetingInfo: selectedMeeting,
                    jumpto: 'actionitems',
                    windowtitle: 'Meeting recaps',
                }, {})
            }
            
        },
    }
}
</script>


<style scoped lang="scss">
.chatitem {
    margin: 5px 8px 0 16px;
    display: flex;
    flex-direction: row;

    .avatar {
        margin-top: 12px;
        flex-shrink: 0;
    }

    .avatar-html {
        display: flex;
    }


    .colr {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        border-radius: 8px;
        padding: 5px 7px;

        &.disable {

            &:hover,
            &:active,
            &.active {
                background: none !important;
            }
        }

        &:hover {
            background: rgba(45,45,45,1);
        }

        &:active,
        &.active {
            background: rgba(31,49,61,1);
        }

        .line1 {
            display: flex;
            align-items: center;
            font-size: 14px;

            .name {
                opacity: .7;

                &.me {
                    font-weight: bold;
                    opacity: .95;
                }
            }

            .time {
                margin-left: 10px;
                opacity: .7;
            }

            .flexgrow {
                flex-grow: 1;
            }
        }

        .cont-msg {
            display: flex;
            flex-direction: column;

            .lb_msg {
                font-size: 16px;
                font-weight: normal;
                line-height: 24px;
                color: rgba($color: #FFFFFF, $alpha: .95);
            }

            .attachment {
                &.image {
                    display: flex;
                    flex-direction: column;
                    margin-top: 5px;

                    img,
                    .img {
                        width: 132px;
                        height: 76px;
                        background-repeat: no-repeat;
                        background-size: contain;
                    }

                    .imagett {
                        font-size: 11px;
                    }
                }
            }

            
        }

        .reactions {
            @include flex(row, flex-start);

            .btn-reaction {
                @include flex;
                height: 20px;
                min-width: 20px;
                border-radius: 10px;
                box-sizing: border-box;
                background: rgba($color: #FFFFFF, $alpha: .11);
                border: 1px solid rgba(255, 255, 255, 0.2);
                margin-right: 4px;
                margin-top: 6px;

                .ico {
                    width: 12px;
                    height: 12px;
                    background-size: contain;
                    margin-left: 8px;
                    margin-right: 4px;
                    pointer-events: none;
                }

                .number {
                    font-size: 12px;
                    margin-right: 8px;
                    user-select: none;

                    &.self {
                        color: $md-blue-40;
                    }
                }

                &:hover {
                    background: rgba($color: #FFFFFF, $alpha: .2);
                }

                &:active {
                    background: rgba($color: #FFFFFF, $alpha: .3);
                }
            }
        }

        .cont-cal {
            position: relative;
            display: flex;
            flex-direction: column;
            background: rgba(45,45,45,1);
            padding: 6px 10px 6px 30px;
            min-height: 48px;
            border-radius: 4px;

            .row1 {
                display: flex;
                .row1time {
                    @include flex(column, center, flex-start);
                    width: 120px;
                    font-size: 12px;
                    .dt {
                        font-weight: 600;
                    };
                    .tm {
                        opacity: .7;
                    };

                }

                .row1tt {
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    overflow:hidden;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                }
            }
            .marker {
                position: absolute;
                background: rgba(214,107,41,1);
                width: 4px;
                height: calc(100% - 8px);
                top: 4px;
                left: 4px;
                border-radius: 2px;            }
        }

        .cont-meeting {
            position: relative;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            background: #3B3B3B;
            overflow: hidden;
            margin-top: 4px;

            .marker {
                position: absolute;
                left: 0;
                height: 100%;
                width: 6px;
                background: rgba(255, 255, 255, 0.3);
            }

            .item-meeting {
                position: relative;
                width: 100%;
                min-height: 54px;
                display: flex;
                margin: 4px 0;
                border-radius: 8px;
                transition: all .2s ease;

                .left {
                    @include flex;
                    width: 48px;
                    height: 48px;
                    flex-shrink: 0;
                    flex-grow: 0;
                    margin: 0 -10px 0 10px;

                    .avatar {
                        margin: 0;
                    }
                }

                .mid {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    margin-right: 12px;
                    margin-left: 16px;

                    .row1 {
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;

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
                            display: flex;
                            align-items: center;
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

                    .meetingsummary {
                        display: flex;
                        flex-direction: column;

                        .section {
                            display: flex;
                            flex-direction: column;
                        }

                        .subtitlegrp {
                            @include flex(row, flex-start);
                        }

                        .subtitle {
                            @include flex(row, flex-start);
                            font-weight: 600;
                            font-size: 14px;
                            flex-grow: 1;
                            margin-bottom: 4px;

                            .ico {
                                margin-left: 12px;
                            }
                        }
                        .text-link {
                            font-size: 14px;
                            margin-bottom: 4px;
                            text-decoration: underline;
                            cursor: pointer;
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
                            opacity: .7;
                            font-size: 14px;
                            margin-bottom: 12px;
                        }

                        .conitm {
                            @include flex(row, flex-start);

                            .thumb {
                                width: 68px;
                                height: 44px;
                                margin-right: 12px;
                            }

                            .colr {
                                @include flex(column, flex-start, flex-start);

                                .l1 {
                                    font-weight: 600;
                                    opacity: .95;
                                    font-size: 12px;
                                }

                                .l2 {
                                    opacity: .7;
                                    font-size: 12px;
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
                            padding: 4px 0;

                            .blocktt {
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                flex-wrap: wrap;

                                &.editing {
                                    .tag {
                                        background: rgba(255, 255, 255, 0.07);
                                        color: rgba(255, 255, 255, 0.4);
                                    }
                                    .btnc {
                                        opacity: .4;
                                    }
                                }
                                
                                .lb {
                                    font-size: 12px;
                                    font-weight: bold;
                                    opacity: .7;
                                    margin-right: 12px;
                                }

                                .tagrow {
                                    display: flex;
                                    margin: 2px 0;

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
                                }

                                .spacer{
                                    flex-grow: 1;
                                }
                                .btnc {
                                    @include flex;
                                    width: 24px;
                                    height: 24px;
                                    border-radius: 50%;

                                    &:hover {
                                        background-color: rgba($color: #FFF, $alpha: .11);
                                    }
                                    &:active, &.active {
                                        background-color: rgba($color: #FFF, $alpha: .2);
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
                            .tools {
                                position: absolute;
                                display: flex;
                                height: 20px;
                                top: -10px;
                                right: 8px;
                                box-sizing: border-box;
                                border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
                                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
                                border-radius: 10px;
                                overflow: hidden;

                                .itm {
                                    @include flex;
                                    width: 32px;
                                    
                                    svg path {
                                        fill: white;
                                        fill-opacity: .95;
                                    }
                                    &:hover {
                                        background-color: rgba($color: #FFFFFF, $alpha: .1);
                                    }
                                    &:active, &.active {
                                        background-color: rgba($color: #FFFFFF, $alpha: .2);
                                    }
                                }
                            }

                            .scitem {
                                display: flex;
                                flex-wrap: wrap;
                                align-items: center;
                                font-size: 12px;
                                min-height: 36px;
                                padding: 8px 0;

                                .name {
                                    font-weight: 600;
                                    width: 120px;
                                    flex-shrink: 0;
                                }
                                .ts {
                                    opacity: .7;
                                    width: 220px;
                                    flex-shrink: 0;
                                }
                            }
                        }

                        .divider-h {
                            border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: .1);
                            margin: 8px 0;
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

                .icons {
                    position: absolute;
                    display: flex;
                    justify-content: flex-end;
                    right: 12px;
                    top: 12px;

                    .ico {
                        margin-right: 4px;
                        opacity: .7;
                    }
                }


            }


        }

        .cont-image {
            display: flex;
            flex-direction: column;
            
            .file {
                @include flex;
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                background: $md-gray-10;
                flex-shrink: 0;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                user-select: none;

                .bottom {
                    @include flex(row, flex-start);
                    display: none;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    padding: 4px 16px;
                    background-color: rgba($color: #000000, $alpha: .9);

                    .left {
                        @include flex(column, flex-start, flex-start);
                        flex-grow: 1;
                        font-size: 14px;
                        line-height: 20px;

                        .lb_title {
                            font-weight: 600;
                        }
                        .lb_line2 {
                            @include flex(row, flex-start);
                        }
                        
                    }
                    .right {
                        @include flex(row, flex-end);
                    }

                }

                &:hover {
                    .bottom {
                        display: flex;
                    }
                }
            }

            .lb_msg {
                
            }
        }

        .cont-file {
            display: flex;
            flex-direction: column;
            
            .file {
                user-select: none;
                @include flex(row, flex-start);
                width: 320px;
                flex-shrink: 1;
                border-radius: 8px;
                background-color: rgba($color: #FFF, $alpha: .11);
                border: 1px solid rgba($color: #FFF, $alpha: .2);
                padding: 0 16px 0 0;
                overflow: hidden;
                box-sizing: border-box;

                .iconimg {
                    @include flex;
                    width: 64px;
                    height: 52px;
                    margin: 0 12px 0 0;
                    padding: 0;
                    overflow: hidden;
                }

                .left {
                    @include flex(column, flex-start, flex-start);
                    flex-grow: 1;
                    font-size: 14px;
                    line-height: 20px;

                    .lb_title {
                        font-weight: 600;
                    }
                    .lb_line2 {
                        @include flex(row, flex-start);
                    }
                    
                }
                .right {
                    @include flex(row, flex-end);
                }
            }

            .lb_msg {
                
            }
        }

        .replies {
            margin-top: 10px;
            margin-left: 10px;
            border-left: 4px solid rgba($color: #FFF, $alpha: .2);
        }
        .repliesbot {
            margin-top: 8px;
            margin-left: 10px;

            .btn {
                font-size: 14px;
                font-weight: normal;
                padding: 0 10px;

                .ico {
                    margin-right: 4px;
                }
            }
        }

        .btn-circle-28 {
            width: 28px;
            height: 28px;
            min-width: 0;
            flex-shrink: 0;
        }

        .tools {
            position: absolute;
            display: flex;
            height: 20px;
            top: -10px;
            right: 10px;
            box-sizing: border-box;
            border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
            border-radius: 10px;
            overflow: hidden;

            .itm {
                @include flex;
                width: 32px;

                svg path {
                    fill: white;
                    fill-opacity: .95;

                    &.flag {
                        fill: $md-blue-60;
                        fill-opacity: 1;
                    }
                }

                &:hover {
                    background-color: rgba($color: #FFFFFF, $alpha: .1);
                }

                &:active,
                &.active {
                    background-color: rgba($color: #FFFFFF, $alpha: .2);
                }
            }
        }
    }

    .divider-new {
        @include flex;
        width: calc(100% - 50px);
        margin-left: 50px;

        span {
            color: $md-blue-40;
            margin: 0 8px;
            font-size: 12px;
        }

        .line {
            width: 1px;
            flex-grow: 1;
            height: 1px;
            border-top: 1px solid $md-blue-40;
            margin-top: 2px;
        }

    }

    .info {
        @include flex;
        width: 100%;
        font-size: 14px;
        opacity: .7;
        margin: 8px 0;
    }

    /* theme ----- light/hybrid */
    &.light,
    &.hybrid {
        color: $text-color-primary-light-ui;

        .colr {

            .cont-msg {
                .lb_msg {
                    color: rgba($color: #000000, $alpha: .95);
                }
            }

            &:hover {
                background: rgba($color: #000000, $alpha: .04);
            }

            &:active,
            &.active {
                background: rgba($color: #000000, $alpha: .11);
            }

            .replies {
                border-left: 4px solid #DEDEDE;
            }

            .tools {
                border: 1px solid rgba(0, 0, 0, 0.3);

                .itm {
                    svg path {
                        fill: black;

                        &.flag {
                            fill: $md-blue-40;
                        }
                    }

                    &:hover {
                        background-color: rgba($color: #000000, $alpha: .1);
                    }

                    &:active,
                    &.active {
                        background-color: rgba($color: #000000, $alpha: .2);
                    }
                }
            }
        }

        .divider-new {
            span {
                color: $md-blue-60;
            }

            .line {
                border-top: 1px solid $md-blue-60;
            }

        }

    }

}
</style>
