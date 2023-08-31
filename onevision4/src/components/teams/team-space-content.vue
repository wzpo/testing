<template>
    <div class='space-content'>
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
              <span class="lb">{{tab}}</span>
            </div>
          </div>

        </div>

        <wl-scrollbar 
          ref="scrollbar" 
          class='cont-wrap' 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
        >

          <div class="scrollcont">

            <div v-if="activeTabId === 0" class="tools-files" >
              <md-button class="btn md-button-outline btn-cnc" aria-label="x" :size="28" >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0899 5.60767C11.715 4.83807 11.1346 4.18715 10.4128 3.72689C9.69098 3.26664 8.85596 3.01498 8.00004 2.99976C6.86172 3.00773 5.7669 3.43805 4.92782 4.20732C4.08873 4.97658 3.56514 6.02998 3.45854 7.16333C3.06673 7.22848 2.69215 7.37225 2.35737 7.58599C2.02258 7.79973 1.73452 8.07901 1.51053 8.40702C1.28653 8.73503 1.13124 9.10497 1.054 9.49459C0.976756 9.8842 0.979167 10.2854 1.06108 10.6741C1.21079 11.3406 1.58501 11.9353 2.12106 12.3588C2.6571 12.7822 3.32238 13.0085 4.00542 12.9998H11.0899C12.0336 13.0115 12.9491 12.6785 13.6647 12.0633C14.3803 11.448 14.8468 10.5927 14.9766 9.65796C15.075 8.74646 14.8354 7.83057 14.3033 7.084C13.7712 6.33743 12.9836 5.81211 12.0899 5.60767ZM13.9825 9.55198C13.8806 10.242 13.5307 10.8713 12.9982 11.3219C12.4658 11.7725 11.7873 12.0135 11.0899 11.9997H4.00541C3.55264 12.0091 3.1104 11.8626 2.75271 11.5848C2.39503 11.3071 2.14362 10.9148 2.04057 10.4739C1.98 10.191 1.98338 9.89817 2.05046 9.61678C2.11754 9.33539 2.24662 9.07253 2.42827 8.8474C2.60993 8.62227 2.83957 8.44056 3.10043 8.31553C3.3613 8.19051 3.64679 8.12532 3.93607 8.12474H4.43607V7.62474C4.4406 6.67523 4.81565 5.76501 5.48133 5.08793C6.14702 4.41084 7.05074 4.02039 8.00003 3.99974C8.70588 4.01523 9.39199 4.23568 9.97476 4.63422C10.5575 5.03276 11.0118 5.5922 11.2823 6.24437L11.3907 6.50169L11.6665 6.54419C12.3656 6.65078 12.9966 7.02302 13.4281 7.58335C13.8595 8.14367 14.0581 8.84886 13.9825 9.55198Z" fill="white" fill-opacity="0.95"/>
                </svg>
                <span class="label">Connect to account</span>
              </md-button>
              <div class="btngroup">
                <div class="bt" :class="{active: filesView === 'grid'}" @click="filesView='grid'"><wl-icon class="ico ico1" name="view-thumbnail-bold" size="12" /></div>
                <div class="bt" :class="{active: filesView === 'list'}" @click="filesView='list'"><wl-icon class="ico ico2" name="view-list-bold" size="12" /></div>
              </div>
            </div>

            <div 
              v-if="content !== undefined 
                && content[tabs[activeTabId].toLowerCase()] !== undefined 
                && activeTabId === 0 
                && filesView === 'grid'" 
              class="cont-area cont-files-grid" 
            >
              <div 
                v-for="(itm, idx) in content[tabs[activeTabId].toLowerCase()]"
                :key="`contitm${idx}`"
                class="itm-file" 
              >
                <span class="thumb">
                  <div class="img" 
                    :style="{
                      backgroundImage: `url(${$store.state.spaceFilePath + itm.thumb})`
                  }"></div>
                  <div v-if="itm.onedrive" class="onedrive">OneDrive</div>
                  <div class="ctrl">
                    <div class="rbtn">
                      <wl-icon class="ico" name="chat-bold" size="16" color="gray-95" />
                    </div>
                    <div class="rbtn">
                      <wl-icon class="ico" name="download-bold" size="16" color="gray-95" />
                    </div>
                  </div>
                </span>
                <span class="lb">{{itm.name}}</span>
                <span class="lb2">
                  <span class="txt">{{itm.user}}</span>
                  <span class="dot-divider"></span>
                  <span class="txt">{{itm.date}}</span>
                  <wl-icon class="ico" name="check-circle-bold" size="16" color="green-40" />
                </span>
                
              </div>
            </div>

            <div 
              v-if="content !== undefined 
                && content[tabs[activeTabId].toLowerCase()] !== undefined 
                && activeTabId === 0 
                && filesView === 'list'" 
              class="cont-area cont-files-list" 
            >
              <div 
                v-for="(itm, idx) in content[tabs[activeTabId].toLowerCase()]"
                :key="`contitm${idx}`"
                class="itm-filelst" 
              >
                <span class="left">
                  <div class="img" 
                    :class="{
                      fileicon: itm.thumbIsExt,
                    }"
                    :style="{
                      backgroundImage: `url(${$store.state.spaceFilePath + itm.thumb})`
                  }"></div>
                </span>
                <div class="mid">
                  <span class="lb">{{itm.name}}</span>
                  <span class="lb2">
                    <div v-if="itm.onedrive" class="txt onedrive">OneDrive</div>
                    <span class="txt size">{{itm.size}}</span>
                    <span class="dot-divider"></span>
                    <span class="txt">{{itm.user}}</span>
                    <span class="dot-divider"></span>
                    <span class="txt">{{itm.date}}</span>
                    <wl-icon class="ico" name="check-circle-bold" size="16" color="green-40" />
                  </span>
                </div>
                <span class="right">
                  <span class="ico">
                    <wl-icon name="chat-bold" size="16" color="gray-95" />
                  </span>
                  <span v-if="itm.zip" class="ico" >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.6619 6.0493C14.4775 5.82768 14.2327 5.66439 13.9572 5.5793C13.8584 4.99872 13.5576 4.47173 13.108 4.0913C12.6584 3.71087 12.0889 3.50146 11.5 3.5H7.9778C7.90545 3.50004 7.83395 3.48435 7.76828 3.454C7.7026 3.42365 7.64431 3.37938 7.59745 3.32425L7.2239 2.88525C6.9895 2.60763 6.69728 2.38456 6.36767 2.23165C6.03807 2.07875 5.67904 1.99968 5.3157 2H3.5C2.8372 2.00078 2.20177 2.26442 1.7331 2.7331C1.26442 3.20177 1.00078 3.8372 1 4.5V11.5C1.00078 12.1628 1.26442 12.7982 1.7331 13.2669C2.20177 13.7356 2.8372 13.9992 3.5 14H12.4017C12.7482 13.9993 13.0838 13.879 13.3518 13.6593C13.6198 13.4396 13.8037 13.1341 13.8723 12.7945L14.9724 7.29445C15.0165 7.07688 15.0115 6.85221 14.9578 6.63681C14.9041 6.42141 14.803 6.2207 14.6619 6.0493ZM2 11.5V4.5C2.00044 4.10231 2.15861 3.72103 2.43982 3.43982C2.72103 3.15861 3.10231 3.00044 3.5 3H5.31595C5.53398 2.99979 5.74943 3.04723 5.94721 3.13899C6.14499 3.23076 6.32032 3.36463 6.46095 3.53125L6.83695 3.97365C6.97767 4.13875 7.15256 4.27132 7.34953 4.3622C7.54651 4.45307 7.76087 4.50009 7.9778 4.5H11.5C11.8092 4.50095 12.1105 4.59758 12.3626 4.77663C12.6147 4.95568 12.8052 5.20836 12.9079 5.5H5.0413C4.69476 5.50067 4.35909 5.62103 4.09109 5.84072C3.82309 6.06041 3.6392 6.36593 3.57055 6.7056L2.47055 12.2056C2.44767 12.3238 2.43907 12.4443 2.44495 12.5646C2.30395 12.4254 2.192 12.2597 2.11561 12.0769C2.03923 11.8942 1.99993 11.6981 2 11.5ZM12.8921 12.5987C12.8692 12.7118 12.8079 12.8135 12.7186 12.8866C12.6293 12.9597 12.5175 12.9998 12.4021 13H3.9412C3.86724 13 3.79421 12.9835 3.72737 12.9518C3.66053 12.9202 3.60155 12.8741 3.55468 12.8169C3.50782 12.7596 3.47422 12.6927 3.45633 12.621C3.43843 12.5492 3.43668 12.4744 3.4512 12.4019L4.5512 6.9014C4.57413 6.78828 4.63541 6.68655 4.7247 6.61342C4.81398 6.54028 4.92578 6.50021 5.0412 6.5H13.5017C13.5757 6.50004 13.6487 6.51649 13.7155 6.54816C13.7824 6.57983 13.8413 6.62593 13.8882 6.68315C13.9351 6.74036 13.9687 6.80726 13.9866 6.87903C14.0045 6.95079 14.0062 7.02563 13.9917 7.09815L12.8921 12.5987Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                  </span>
                  <span class="ico">
                    <wl-icon name="download-bold" size="16" color="gray-95" />
                  </span>
                  
                </span>
                
              </div>
            </div>
            

            <div v-if="activeTabId === 1" class="tools-whiteboards">
              <md-button class="btn md-button-outline btn-new-wb" aria-label="x" :size="28" >
                <wl-icon name="plus-bold" size="16" class="ico" />
                <span class="label">New whiteboard</span>
              </md-button>
            </div>
            <div class="cont-area cont-whiteboards" v-if="content !== undefined && content[tabs[activeTabId].toLowerCase()] !== undefined && activeTabId === 1">

              <div 
                v-for="(itm, idx) in content[tabs[activeTabId].toLowerCase()]"
                :key="`contitm2${idx}`"
                class="itm-wb" 
              >
                <span class="thumb">
                  <div class="img" :id="`whiteboardthumbimg${idx}`"
                    :style="{
                      backgroundImage: itm.thumb ? `url(${$store.state.spaceWhiteboardPath + itm.thumb})` : ``,}"
                    ></div>
                  <div class="ctrl">
                    <div class="rbtn">
                      <wl-icon class="ico" name="chat-bold" size="16" color="gray-95" />
                    </div>
                    <div class="rbtn">
                      <wl-icon class="ico" name="download-bold" size="16" color="gray-95" />
                    </div>
                  </div>
                </span>
                <span class="lb">{{itm.name}}</span>
                <span class="lb2">
                  <span class="txt">{{itm.user}}</span>
                  <span class="dot-divider"></span>
                  <span class="txt">{{itm.date}}</span>
                </span>
              </div>
            </div>

            <div class="cont-area cont-links" v-if="content !== undefined && content[tabs[activeTabId].toLowerCase()] !== undefined && activeTabId === 2">
              <div 
                v-for="(itm, idx) in content[tabs[activeTabId].toLowerCase()]"
                :key="`contitm3${idx}`"
                class="itm-link" 
              >
                <span class="left">
                  <wl-icon class="ico" name="browser-bold" size="20" />
                </span>
                <span class="mid">
                  <span class="lb">{{itm.name}}</span>
                  <span class="lb2">{{itm.url}}</span>
                  <span class="lb3">
                    <span class="txt">{{itm.user}}</span>
                    <span class="dot-divider"></span>
                    <span class="txt">{{itm.date}}</span>
                  </span>
                </span>
                <span class="right">
                  
                  <span class="ico">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 0.999756H7.5C6.8372 1.00053 6.20176 1.26418 5.73309 1.73285C5.26442 2.20152 5.00078 2.83695 5 3.49976H4.5C3.8372 3.50053 3.20176 3.76418 2.73309 4.23285C2.26442 4.70152 2.00078 5.33695 2 5.99976V12.5027C2.00078 13.1655 2.26442 13.8009 2.73309 14.2696C3.20177 14.7383 3.8372 15.0019 4.5 15.0027H8.5C9.1628 15.0019 9.79823 14.7383 10.2669 14.2696C10.7356 13.8009 10.9992 13.1655 11 12.5027V12.5012H11.5C12.1628 12.5004 12.7982 12.2368 13.2669 11.7681C13.7356 11.2995 13.9992 10.664 14 10.0012V3.49976C13.9992 2.83695 13.7356 2.20152 13.2669 1.73285C12.7982 1.26418 12.1628 1.00054 11.5 0.999756ZM10 12.5027C9.99956 12.9004 9.84139 13.2817 9.56018 13.5629C9.27897 13.8441 8.89769 14.0022 8.5 14.0027H4.5C4.10231 14.0023 3.72103 13.8441 3.43982 13.5629C3.15861 13.2817 3.00043 12.9004 3 12.5027V5.99976C3.00043 5.60206 3.15861 5.22079 3.43982 4.93958C3.72103 4.65837 4.10231 4.50019 4.5 4.49976H8.5C8.89769 4.50019 9.27897 4.65837 9.56018 4.93958C9.84139 5.22079 9.99957 5.60206 10 5.99976V12.5027ZM13 10.0012C12.9996 10.3989 12.8414 10.7802 12.5602 11.0614C12.279 11.3426 11.8977 11.5008 11.5 11.5012H11V5.99976C10.9992 5.33695 10.7356 4.70152 10.2669 4.23285C9.79823 3.76418 9.1628 3.50054 8.5 3.49976H6C6.00043 3.10206 6.15861 2.72079 6.43982 2.43958C6.72103 2.15836 7.10231 2.00019 7.5 1.99976H11.5C11.8977 2.00019 12.279 2.15836 12.5602 2.43958C12.8414 2.72079 12.9996 3.10206 13 3.49976V10.0012Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                  </span>
                  <span class="ico">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.98836 14.5003C2.45806 14.5074 1.93187 14.4065 1.44176 14.2039C1.32216 14.1495 1.21885 14.0647 1.14203 13.9581C1.06521 13.8515 1.01755 13.7267 1.00376 13.596C0.989818 13.4668 1.01033 13.3361 1.06322 13.2174C1.1161 13.0986 1.19947 12.996 1.30486 12.9199C1.36541 12.8755 1.43551 12.8306 1.51266 12.7818C1.99364 12.5033 2.36035 12.0633 2.54766 11.5401C1.76024 10.3277 1.39938 8.88747 1.52214 7.44707C1.64489 6.00667 2.24426 4.64828 3.22548 3.58666C4.2067 2.52505 5.51379 1.82078 6.94009 1.5852C8.36639 1.34962 9.83052 1.59618 11.101 2.28589C12.3715 2.9756 13.3758 4.06911 13.9552 5.39353C14.5347 6.71796 14.6561 8.19773 14.3003 9.5989C13.9446 11.0001 13.1319 12.2427 11.9909 13.1303C10.8498 14.0179 9.44548 14.4998 7.99986 14.4999C7.03963 14.4995 6.09131 14.2872 5.22251 13.8783C4.54953 14.288 3.77623 14.5033 2.98836 14.5003ZM2.33141 13.4373C2.7738 13.5265 3.22976 13.5244 3.67129 13.431C4.11282 13.3376 4.53061 13.155 4.89901 12.8943C4.97464 12.8407 5.06369 12.8091 5.15621 12.8032C5.24874 12.7972 5.34109 12.8171 5.42296 12.8607C6.61446 13.493 7.99673 13.6657 9.30718 13.3459C10.6176 13.026 11.7649 12.236 12.5312 11.1259C13.2974 10.0157 13.6292 8.66278 13.4635 7.32409C13.2977 5.9854 12.646 4.75422 11.6322 3.86444C10.6184 2.97467 9.31303 2.48829 7.96416 2.4977C6.61528 2.50711 5.31685 3.01166 4.31553 3.91549C3.31421 4.81933 2.67977 6.05948 2.53273 7.40035C2.3857 8.74123 2.73631 10.0894 3.51796 11.1888C3.56548 11.2554 3.5959 11.3327 3.60654 11.4138C3.61719 11.495 3.60773 11.5775 3.57901 11.6541C3.35635 12.3626 2.9207 12.9853 2.33141 13.4373Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                  </span>

                </span>
              </div>
            </div>

            <div class="cont-area cont-recordings" v-if="content !== undefined && content[tabs[activeTabId].toLowerCase()] !== undefined && activeTabId === 3">
              <div 
                v-for="(itm, idx) in content[tabs[activeTabId].toLowerCase()]"
                :key="`contitm4${idx}`"
                class="itm-record" 
              >
                <span class="left">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.99066 13.9984C3.59412 13.9967 3.21442 13.8379 2.93464 13.5569C2.65486 13.2759 2.49777 12.8955 2.49774 12.4989V3.50088C2.49771 3.24518 2.56305 2.99371 2.68756 2.77038C2.81208 2.54705 2.99163 2.35926 3.20916 2.22485C3.42669 2.09045 3.67497 2.0139 3.93041 2.00247C4.18586 1.99105 4.43998 2.04512 4.66864 2.15957L12.6848 6.66396C12.9318 6.79027 13.139 6.98261 13.2833 7.21961C13.4276 7.4566 13.5033 7.72897 13.5021 8.00643C13.5009 8.2839 13.4228 8.55559 13.2764 8.79131C13.13 9.02704 12.9212 9.21756 12.673 9.3417L4.68988 13.8295C4.47316 13.9395 4.23372 13.9974 3.99066 13.9984ZM4.00482 2.99648C3.90926 2.99801 3.81593 3.02552 3.73482 3.07607C3.66187 3.12026 3.60166 3.18265 3.5601 3.25712C3.51854 3.33159 3.49706 3.41559 3.49776 3.50088V12.4989C3.49777 12.5842 3.51957 12.668 3.5611 12.7425C3.60263 12.8169 3.66249 12.8795 3.73502 12.9243C3.80754 12.9692 3.89032 12.9947 3.97549 12.9985C4.06066 13.0023 4.14539 12.9843 4.22164 12.9462L12.2043 8.4584C12.2929 8.41891 12.3682 8.35459 12.4211 8.27323C12.4739 8.19186 12.5021 8.09692 12.5022 7.9999C12.5033 7.90681 12.4779 7.81532 12.4289 7.73612C12.38 7.65692 12.3095 7.59328 12.2258 7.55263L12.2043 7.5414L4.20014 3.04287C4.13954 3.0124 4.07265 2.99651 4.00482 2.99648Z" fill="black" fill-opacity="0.95"/>
                  </svg>
                </span>
                <span class="mid">
                  <span class="lb">{{itm.name}}</span>
                  <span class="lb3">
                    <span class="txt">{{itm.date}}</span>
                    <span class="dot-divider"></span>
                    <span class="txt">{{itm.time}}</span>
                    <span class="dot-divider"></span>
                    <span class="txt">{{itm.duration}}</span>
                  </span>
                </span>
                <span class="right">
                  <span class="ico">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 1C6.61553 1 5.26216 1.41054 4.11101 2.17971C2.95987 2.94888 2.06266 4.04213 1.53285 5.32122C1.00303 6.6003 0.86441 8.00777 1.13451 9.36563C1.4046 10.7235 2.07129 11.9708 3.05026 12.9497C4.02922 13.9287 5.2765 14.5954 6.63437 14.8655C7.99224 15.1356 9.3997 14.997 10.6788 14.4672C11.9579 13.9373 13.0511 13.0401 13.8203 11.889C14.5895 10.7378 15 9.38447 15 8C14.9979 6.14412 14.2598 4.36485 12.9475 3.05255C11.6351 1.74025 9.85588 1.00208 8 1ZM8 14C6.81331 14 5.65328 13.6481 4.66658 12.9888C3.67989 12.3295 2.91085 11.3925 2.45673 10.2961C2.0026 9.19975 1.88378 7.99335 2.11529 6.82946C2.3468 5.66557 2.91825 4.59647 3.75736 3.75736C4.59648 2.91824 5.66558 2.3468 6.82946 2.11529C7.99335 1.88378 9.19975 2.0026 10.2961 2.45672C11.3925 2.91085 12.3295 3.67988 12.9888 4.66658C13.6481 5.65327 14 6.81331 14 8C13.9983 9.59077 13.3656 11.1159 12.2407 12.2407C11.1159 13.3656 9.59077 13.9983 8 14Z" fill="white" fill-opacity="0.95"/>
                      <path d="M7.87499 6.74982C8.22017 6.74982 8.49999 6.46999 8.49999 6.12482C8.49999 5.77964 8.22017 5.49982 7.87499 5.49982C7.52981 5.49982 7.24999 5.77964 7.24999 6.12482C7.24999 6.46999 7.52981 6.74982 7.87499 6.74982Z" fill="white" fill-opacity="0.95"/>
                      <path d="M9 10H8.5V8C8.50004 7.93433 8.48713 7.86929 8.46202 7.80862C8.4369 7.74794 8.40008 7.6928 8.35364 7.64636C8.3072 7.59993 8.25207 7.5631 8.19139 7.53799C8.13071 7.51287 8.06567 7.49996 8 7.5H7.5C7.36739 7.5 7.24022 7.55268 7.14645 7.64645C7.05268 7.74022 7 7.86739 7 8C7 8.13261 7.05268 8.25979 7.14645 8.35355C7.24022 8.44732 7.36739 8.5 7.5 8.5V10H7C6.86739 10 6.74022 10.0527 6.64645 10.1464C6.55268 10.2402 6.5 10.3674 6.5 10.5C6.5 10.6326 6.55268 10.7598 6.64645 10.8536C6.74022 10.9473 6.86739 11 7 11H9C9.13261 11 9.25979 10.9473 9.35356 10.8536C9.44732 10.7598 9.5 10.6326 9.5 10.5C9.5 10.3674 9.44732 10.2402 9.35356 10.1464C9.25979 10.0527 9.13261 10 9 10Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                  </span>
                  <span class="ico">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.3535 3.85351L7.5 2.70703V6.50146C7.5 6.63407 7.55268 6.76125 7.64645 6.85502C7.74021 6.94878 7.86739 7.00146 8 7.00146C8.13261 7.00146 8.25979 6.94878 8.35355 6.85502C8.44732 6.76125 8.5 6.63407 8.5 6.50146V2.70703L9.6465 3.85353C9.7404 3.94662 9.86735 3.99872 9.99957 3.99843C10.1318 3.99815 10.2585 3.94549 10.352 3.85199C10.4455 3.75849 10.4981 3.63177 10.4984 3.49955C10.4987 3.36732 10.4466 3.24037 10.3535 3.14648L8.3535 1.14648C8.30708 1.10004 8.25197 1.0632 8.19132 1.03807C8.13066 1.01294 8.06564 1 7.99999 1C7.93433 1 7.86931 1.01294 7.80865 1.03807C7.748 1.0632 7.69289 1.10004 7.64647 1.14648L5.64647 3.14648C5.55271 3.24024 5.50004 3.3674 5.50004 3.5C5.50004 3.63259 5.55271 3.75975 5.64647 3.85351C5.74023 3.94727 5.86739 3.99994 5.99999 3.99994C6.13258 3.99994 6.25974 3.94727 6.3535 3.85351Z" fill="white" fill-opacity="0.95"/>
                      <path d="M12.5 3.00146C12.4343 3.00146 12.3693 3.0144 12.3087 3.03952C12.248 3.06465 12.1929 3.10148 12.1464 3.14791C12.1 3.19434 12.0632 3.24946 12.0381 3.31012C12.0129 3.37078 12 3.4358 12 3.50146C12 3.56712 12.0129 3.63214 12.0381 3.6928C12.0632 3.75347 12.1 3.80859 12.1464 3.85502C12.1929 3.90145 12.248 3.93828 12.3087 3.9634C12.3693 3.98853 12.4343 4.00146 12.5 4.00146C12.8977 4.0019 13.279 4.16007 13.5602 4.44128C13.8414 4.72249 13.9996 5.10377 14 5.50146V11.5015C13.9996 11.8992 13.8414 12.2804 13.5602 12.5616C13.279 12.8429 12.8977 13.001 12.5 13.0015H3.5C3.10231 13.001 2.72103 12.8429 2.43982 12.5616C2.15861 12.2804 2.00043 11.8992 2 11.5015V5.50146C2.00043 5.10377 2.15861 4.72249 2.43982 4.44128C2.72103 4.16007 3.10231 4.0019 3.5 4.00146C3.63261 4.00146 3.75979 3.94878 3.85355 3.85502C3.94732 3.76125 4 3.63407 4 3.50146C4 3.36885 3.94732 3.24168 3.85355 3.14791C3.75979 3.05414 3.63261 3.00146 3.5 3.00146C2.8372 3.00224 2.20177 3.26588 1.73309 3.73456C1.26442 4.20323 1.00078 4.83866 1 5.50146V11.5015C1.00078 12.1643 1.26442 12.7997 1.73309 13.2684C2.20177 13.737 2.8372 14.0007 3.5 14.0015H12.5C13.1628 14.0007 13.7982 13.737 14.2669 13.2684C14.7356 12.7997 14.9992 12.1643 15 11.5015V5.50146C14.9992 4.83866 14.7356 4.20323 14.2669 3.73456C13.7982 3.26588 13.1628 3.00224 12.5 3.00146Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                  </span>
                  <span class="ico">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.98848 14.5005C2.45819 14.5076 1.93199 14.4068 1.44188 14.2041C1.32229 14.1497 1.21897 14.065 1.14215 13.9584C1.06533 13.8517 1.01767 13.7269 1.00388 13.5962C0.989941 13.467 1.01045 13.3364 1.06334 13.2176C1.11622 13.0989 1.19959 12.9962 1.30498 12.9201C1.36553 12.8757 1.43563 12.8308 1.51278 12.782C1.99376 12.5035 2.36047 12.0636 2.54778 11.5403C1.76036 10.3279 1.3995 8.88772 1.52226 7.44732C1.64502 6.00692 2.24439 4.64852 3.22561 3.58691C4.20683 2.52529 5.51391 1.82102 6.94021 1.58544C8.36651 1.34986 9.83064 1.59642 11.1011 2.28613C12.3716 2.97584 13.3759 4.06935 13.9554 5.39378C14.5348 6.7182 14.6562 8.19798 14.3005 9.59914C13.9447 11.0003 13.1321 12.2429 11.991 13.1305C10.85 14.0181 9.4456 14.5001 7.99998 14.5001C7.03975 14.4997 6.09143 14.2875 5.22263 13.8785C4.54965 14.2882 3.77635 14.5035 2.98848 14.5005ZM2.33153 13.4375C2.77392 13.5267 3.22988 13.5246 3.67141 13.4312C4.11294 13.3378 4.53073 13.1552 4.89913 12.8945C4.97476 12.8409 5.06381 12.8094 5.15633 12.8034C5.24886 12.7975 5.34122 12.8174 5.42308 12.8609C6.61458 13.4933 7.99686 13.6659 9.3073 13.3461C10.6178 13.0263 11.7651 12.2363 12.5313 11.1261C13.2975 10.016 13.6293 8.66302 13.4636 7.32433C13.2978 5.98564 12.6462 4.75447 11.6323 3.86469C10.6185 2.97491 9.31315 2.48853 7.96428 2.49794C6.6154 2.50735 5.31697 3.0119 4.31565 3.91574C3.31433 4.81957 2.67989 6.05973 2.53286 7.4006C2.38582 8.74147 2.73643 10.0896 3.51808 11.189C3.5656 11.2556 3.59602 11.3329 3.60667 11.4141C3.61731 11.4952 3.60786 11.5777 3.57913 11.6543C3.35647 12.3629 2.92082 12.9855 2.33153 13.4375Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                  </span>
                  
                </span>
              </div>
            </div>

            <div class="empty" v-if="content === undefined || content[tabs[activeTabId].toLowerCase()] === undefined">
              <div class="img"></div>
              <div class="title">{{tabs[activeTabId]}}</div>
              <div class="des">{{emptyword[activeTabId]}}</div>
            </div>

          </div>
          

        </wl-scrollbar>

    </div>
</template>

<script>

export default {
    props:[
        'content',
    ],
    data() {
        return {
          activeTabId: 0,
          tabs: [
            'Files',
            'Whiteboards',
            'Links',
            'Recordings',
          ],
          emptyword: [
            'Come here to find all the files shared in this space. To share a file, drag and drop it into the space or attach it in the message pane.',
            `Find your whiteboards saved here. Use a whiteboard to write out and sketch ideas with others. Start a new one with 'New Whiteboard'.`,
            'Links posted to this space appear here.',
            'When you attend a recorded meeting or when a reocrding is shared with you, it will appear here.',
          ],
          filesView: 'grid', // gird, list
        }
    },
    computed:{
      theme() {
        return this.$store.state.theme;
      },
    },
    mounted(){
      this.selectTab(this.activeTabId);

      this.$eventBus.$on('teams-resizing', this.setContentWidth);
      this.setContentWidth();


    },
    destroyed() {
      this.$eventBus.$off('teams-resizing', this.setContentWidth);
    },
    watch: {

    },
    methods:{
      hoverTab(id) {
        this.moveTabBg(id);
      },
      leaveTab() {
        this.moveTabBg(this.activeTabId);
      },
      selectTab(id) {
        this.activeTabId = id;
        this.moveTabBg(id);
        this.setContentWidth();
        this.$refs.scrollbar.scrollToY(0, true);

        this.$nextTick(() => {
          if (this.tabs[id] === 'Whiteboards') {
            let itemlist = this.content[this.tabs[id].toLowerCase()]
            for (let i=0; i<itemlist.length; i++) {
              let itm = itemlist[i]
              if (itm.canvaskey) {
                let canvas = this.$store.state.savedCanvasFromHandtracking[itm.canvaskey]
                canvas.style.width = `194px`;
                canvas.style.height = `124px`
                document.getElementById(`whiteboardthumbimg${i}`).appendChild(canvas)
              }
            }
          }
        })
      },
      moveTabBg(id) {
        const rect = document.querySelector(`.space-content-tab${id}`).getBoundingClientRect();
        const rect2 = document.querySelector(`.space-content-tabs`).getBoundingClientRect();
        document.querySelector(`.space-content-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
        document.querySelector(`.space-content-tab-active-bg`).style.width = `${rect.width}px`;
      },

      setContentWidth() {
        /*
        const itemwidth = 194 + 8 * 2;
        if (document.querySelector(`.cont-area`)) {
          if (this.activeTabId === 0 || this.activeTabId === 1) {
            const rect = document.querySelector(`.space-content`).getBoundingClientRect();
            const col = Math.floor((rect.width - 24 - 16) / itemwidth);
            const w = col * itemwidth + 2 + 24 + 16;
            document.querySelector(`.cont-area`).style.maxWidth = `${w}px`;
          } else {
            document.querySelector(`.cont-area`).style.maxWidth = ``;
          }
        }
        */
        
      },
    }
}
</script>


<style lang="scss">
.space-content {
  width: 100%;
  height: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  user-select: none;
  box-sizing: border-box;
  flex-grow: 1;

  .btn {
    height: 28px;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
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
        font-weight: 600;
      }
    }
  }

  .top {
    position: relative;
    width: calc(100% - 32px);
    height: 44px;
    display: flex;
    justify-content: space-between;
    background: rgba($color: #000000, $alpha: 0.07);
    border-radius: 22px;
    margin-left: 16px;

    .space-content-tabs {
      position: relative;
      width: 60px;
      height: 100%;
      padding: 8px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      flex-grow: 1;

      .space-content-tab-active-bg {
        position: absolute;
        height: 28px;
        top: 8px;
        left: 0;
        border-radius: 14px;
        transition: all 0.2s ease;
        background-color: rgba($color: #000000, $alpha: .2);
        pointer-events: none;
      }
    }
  }



  .cont-wrap {
    display: flex;
    width: calc(100% - 16px);
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
    height: 100px;
    margin: 12px 0 4px 0;

    .scrollcont {
      display: flex;
      flex-direction: column;
      padding-left: 24px;
    }
  }

  .empty{
    display: flex;
    flex-direction: column;
    width: 360px;
    margin-top: 50px;

    .img {
      width: 140px;
      height: 140px;
      background: url(~@/assets/img/empty-state-space-content.svg) no-repeat;
      background-size: contain;
      margin-bottom: 48px;
    }

    .title {
      font-weight: 600;
      font-size: 24px;
      opacity: .95;
      line-height: 30px;
      margin-bottom: 5px;
    }
    .des {
      font-size: 15px;
      opacity: .95;
    }
  }

  .tools-files {
    @include flex(row, space-between);
    height: 28px;
    width: 100%;
    padding-right: 24px;
    margin-bottom: 12px;

    .btn-cnc {
      padding: 0 10px;
      .label {
        font-size: 14px;
        margin-left: 4px;
      }
    }
    
    .ico {
      opacity: .7;
    }
    .ico1 {
      margin-left: 2px;
    }
    .ico2 {
      margin-right: 2px;
    }
    .lb {
      opacity: .7;
      font-size: 12px;
      margin-left: 8px;
      margin-right: 18px;
    }

    .btngroup {
      @include flex;
      height: 28px;
      border-radius: 14px;
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid rgba($color: #000000, $alpha: 0.2);

      .bt {
        @include flex;
        width: 28px;
        height: 100%;

        &:hover {
          background: rgba($color: #000000, $alpha: 0.1);
          .ico {
            opacity: .95;
          }
        }
        
        &:active, &.active {
          background: rgba($color: #000000, $alpha: 0.2);
          .ico {
            opacity: .95;
          }
        }
      }
    }
  }

  .cont-files-grid {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    padding: 0 0;
    align-content: center;

    .onedrive {
      @include flex;
      padding: 1px 8px;
      position: absolute;
      width: 76px;
      height: 24px;
      right: 8px;
      top: 8px;
      background: #FFFFFF;
      border: 1px solid #8F8F8F;
      box-sizing: border-box;
      border-radius: 4px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.95);
    }


    .itm-file {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 198px;
      margin: 0 24px 24px 0;

      .thumb {
        position: relative;
        width: 100%;
        height: 128px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-sizing: border-box;
        overflow: hidden;

        .img {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .ctrl {
          opacity: 0;
          position: absolute;
          bottom: 0;
          height: 52px;
          width: 100%;
          @include flex;
          background-color: rgba($color: #000000, $alpha: .9);

          .rbtn {
            @include flex;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin: 4px;
            color: rgba($color: #000000, $alpha: .95);
            background-color: rgba($color: #FFFFFF, $alpha: .95);
          }
        }

        &:hover {
          .ctrl {
            opacity: 1;
          }
        }
      }

      .lb {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        margin-top: 8px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }
      .lb2 {
        @include flex(row, flex-start);

        .txt {
          font-size: 14px;
          opacity: .7;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }

        .ico {
          margin-left: 8px;
        }
      }

      
    }
  }

  .cont-files-list {
    display: flex;
    width: calc(100% - 24px);
    flex-direction: column;
    margin-bottom: 16px;

    .itm-filelst {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      border-radius: 8px;
      transition: all .2s ease;
      background: rgba($color: #000000, $alpha: .11);

      .left {
        @include flex;
        width: 72px;
        height: 50px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-sizing: border-box;
        overflow: hidden;
        margin-right: 16px;

        .img {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;

          &.fileicon {
            background-size: 150%;
          }
        }
        
      }
      .mid {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        margin: 5px 0;

        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;

        .lb{
          font-size: 14px;
          line-height: 22px;
        }

        .lb2{
          @include flex(row, flex-start);
          font-size: 14px;
          line-height: 22px;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          .onedrive {
            margin-right: 6px;
          }
          .txt {
            opacity: .7;
          }
        }

        .ico {
          margin-left: 8px;
        }
      }
      .right {
        display: flex;
        margin: 10px;

        .ico {
          @include flex;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          margin: 0 4px;
          
          &:hover {
            background-color: rgba($color: #000000, $alpha: .1);
          }
        }

        svg path{
          fill: #000000;
          fill-opacity: .95;
        }
      }

      &:hover {
        background: rgba($color: #000000, $alpha: 0.2);
      }
    }
  }

  .tools-whiteboards {
    width: 100%;
    margin-bottom: 12px;

    .btn-new-wb {
      padding: 0 10px;
      .label {
        font-size: 14px;
        margin-left: 4px;
      }
    }
  }

  .cont-whiteboards {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-content: center;

    &.nocontent {
      justify-content: center;
    }


    .itm-wb {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 198px;
      margin: 0 24px 24px 0;
      transition: all .2s ease;

      .thumb {
        position: relative;
        width: 100%;
        height: 128px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-sizing: border-box;
        overflow: hidden;

        .img {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          background-color: white;
        }

        .ctrl {
          opacity: 0;
          position: absolute;
          bottom: 0;
          height: 52px;
          width: 100%;
          @include flex;
          background-color: rgba($color: #000000, $alpha: .9);

          .rbtn {
            @include flex;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin: 4px;
            color: rgba($color: #000000, $alpha: .95);
            background-color: rgba($color: #FFFFFF, $alpha: .95);
          }
        }

        &:hover {
          .ctrl {
            opacity: 1;
          }
        }
      }

      .lb {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        margin-top: 8px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }
      .lb2 {
        @include flex(row, flex-start);

        .txt {
          font-size: 14px;
          opacity: .7;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }

        .ico {
          margin-left: 8px;
        }
      }
    }

  }

  .cont-links {
    display: flex;
    width: calc(100% - 24px);
    flex-direction: column;
    margin-bottom: 16px;

    .itm-link {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      border-radius: 8px;
      transition: all .2s ease;
      background: rgba($color: #000000, $alpha: .11);

      .left {
        @include flex;
        width: 32px;
        height: 32px;
        background: #EEEEEE;
        border-radius: 8px;
        margin: 0 12px;
      }
      .mid {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        margin: 5px 0;

        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;

        .lb{
          font-size: 14px;
          font-weight: 600;
          line-height: 22px;
        }
        .lb2{
          font-size: 14px;
          line-height: 22px;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        .lb3{
          @include flex(row, flex-start);
          font-size: 14px;
          line-height: 22px;
          .txt {
            opacity: .7;
          }
        }
      }
      .right {
        display: flex;
        margin: 10px;

        .ico {
          @include flex;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          margin: 0 4px;
          
          &:hover {
            background-color: rgba($color: #000000, $alpha: .1);
          }
        }

        svg path{
          fill: #000000;
          fill-opacity: .95;
        }
      }

      &:hover {
        background: rgba($color: #000000, $alpha: 0.2);
      }
    }
    
  }


  .cont-recordings {
    display: flex;
    width: calc(100% - 24px);
    flex-direction: column;
    margin-bottom: 16px;

    .itm-record {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      border-radius: 8px;
      transition: all .2s ease;
      background: rgba($color: #000000, $alpha: .11);

      .left {
        @include flex;
        width: 32px;
        height: 32px;
        background: rgba($color: #000000, $alpha: .95);
        border-radius: 50%;
        margin: 10px;
        svg path{
          fill: #FFFFFF;
        }
      }
      .mid {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        margin: 5px 0;

        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;

        .lb{
          font-size: 14px;
          font-weight: 600;
          line-height: 22px;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        .lb3{
          @include flex(row, flex-start);
          .txt {
            font-size: 14px;
            line-height: 22px;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            opacity: .7;
          }
        }
      }
      .right {
        display: flex;
        margin: 10px;

        .ico {
          @include flex;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          margin: 0 4px;
          
          &:hover {
            background-color: rgba($color: #000000, $alpha: .2);
          }
        }

        svg path{
          fill: #000000;
          fill-opacity: .95;
        }
      }

      &:hover {
        background: rgba($color: #000000, $alpha: 0.1);
      }
    }
    
  }

  .dot-divider {
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    margin: 0 8px;
  }

}

/* theme ----- dark/hybrid */

.dark {
  .space-content {

    .top {
      background: rgba($color: #FFFFFF, $alpha: 0.07);

      .space-content-tabs {
        .space-content-tab-active-bg {
          background-color: rgba($color: white, $alpha: .2);
        }
      }
    }
    .tools-files {
      .btngroup {
        border: 1px solid rgba($color: #FFFFFF, $alpha: 0.2);
        .bt {
          &:hover {
            background: rgba($color: #FFFFFF, $alpha: 0.1);
          }
          &:active, &.active {
            background: rgba($color: #FFFFFF, $alpha: 0.2);
          }
        }
      }
    }

    .cont-files-list {

      .itm-filelst {
        background: rgba($color: #FFFFFF, $alpha: .11);

        .right {
          .ico:hover {
            background-color: rgba($color: #FFFFFF, $alpha: .1);
          }
          svg path{
            fill: #FFFFFF;
          }
        }

        &:hover {
          background: rgba($color: #FFFFFF, $alpha: 0.2);
        }
      }
    }

    .cont-links {

      .itm-link {
        background: rgba($color: #FFFFFF, $alpha: .11);
        .left {
          background: rgba(255, 255, 255, 0.3);
        }
        .right {
          .ico:hover {
            background-color: rgba($color: #FFFFFF, $alpha: .1);
          }
          svg path{
            fill: #FFFFFF;
          }
        }

        &:hover {
          background: rgba($color: #FFFFFF, $alpha: 0.2);
        }
      }
    }

    .cont-recordings {
      .itm-record {
        background: rgba($color: #FFFFFF, $alpha: .11);
        .left {
          background: rgba($color: #FFFFFF, $alpha: .95);
          svg path{
            fill: #000000;
          }
        }
        .right {
          .ico:hover {
            background-color: rgba($color: #FFFFFF, $alpha: .1);
          }
          svg path{
            fill: #FFFFFF;
          }
        }

        &:hover {
          background: rgba($color: #FFFFFF, $alpha: 0.2);
        }
      }
    }
  }
}

</style>
