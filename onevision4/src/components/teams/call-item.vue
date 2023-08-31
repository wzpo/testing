<template>
  <div 
    class="call-item" 
  >
      <!-- non-conference -->
      <div 
        v-if="info && !info.conference" 
        class="expcont"
        :class="{
          transferred: info.transferred
        }"
      >
        <div v-if="info.incoming" class="row1">
          <span class="lft">Incoming call</span>
          <span class="rgt">
            <div class="ico">
              <wl-icon name="alert-muted-bold" size="16" />
            </div>
            <div class="ico">
              <wl-icon name="cancel-bold" size="16" />
            </div>
          </span>
        </div>
  
        <div class="row2">
          <span class="left">
  
            <presence-avatar
              v-if="!info.transferred"
              :title="info.people.name"
              :src="info.people.avatar ? avatarPath + info.people.avatar : ''" 
              :icon="info.people.isNumber ? 'participant-bold' : null"
              :color="'white'"
              :backgroundColor="'#545454'"
              :size="32"
              :presence="!info.people.isNumber ? (!info.onhold ? 'call' : 'onhold') : null" 
              :theme="theme === 'light' ? 'light' : 'dark'"
              class="avatar" 
  
            />
            
            <div class="txt">
              <span v-if="!info.transferred" class="lb" >
                {{ isNaN(info.people.name) ? info.people.name : formatCallNumber(info.people.name) }}
                <span v-if="info.people.num" class="num">({{info.people.num}})</span>
              </span>
  
              <span v-if="!info.transferred && info.number" class="lb2">
                <span v-if="!info.people.isNumber" class="first" >{{ info.number }}</span>
                <wl-icon v-if="!info.people.isNumber && (!info.incoming || layout==='simple')" name="dot-divider" size="4" class="dot-divider" color="gray-60" />
                <span v-if="!info.incoming && !info.onhold" class="green">{{timer1.value}}</span>
                <span v-if="info.onhold" class="green">On hold</span>
  
                <wl-icon v-if="!info.incoming && !info.onhold" name="dot-divider" size="4" class="dot-divider" color="gray-60" />
                <div v-if="!info.incoming && !info.onhold" class="btn-remove-noise">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5717 8.84863C14.5717 12.4385 11.6616 15.3486 8.07172 15.3486C4.48187 15.3486 1.57172 12.4385 1.57172 8.84863C1.57172 5.25878 4.48187 2.34863 8.07172 2.34863C11.6616 2.34863 14.5717 5.25878 14.5717 8.84863ZM8.56959 4.30253C8.54577 4.04535 8.33 3.84863 8.07172 3.84863C7.81344 3.84863 7.59766 4.04535 7.57385 4.30253L7.2907 7.36051L6.9697 7.03951L6.90134 6.48115C6.87156 6.23787 6.66982 6.05204 6.42491 6.0423C6.29793 6.03726 6.17877 6.08032 6.08661 6.15642L4.92527 4.99508C4.73001 4.79982 4.41342 4.79982 4.21816 4.99508C4.04683 5.16641 4.02583 5.43114 4.15516 5.62536L11.295 12.7652C11.4892 12.8945 11.7539 12.8735 11.9253 12.7022C12.1205 12.5069 12.1205 12.1903 11.9253 11.9951L10.9174 10.9872C10.9777 10.9295 11.0241 10.8563 11.0498 10.7723L11.3989 9.63171C11.489 9.71492 11.609 9.7646 11.7384 9.7646H13.0717C13.3479 9.7646 13.5717 9.54074 13.5717 9.2646C13.5717 8.98846 13.3479 8.7646 13.0717 8.7646H12.1307L11.8907 7.78434C11.8372 7.56575 11.6442 7.40986 11.4193 7.40346C11.1943 7.39706 10.9928 7.54173 10.9269 7.75692L10.6687 8.60053L10.2283 6.44195C10.1793 6.2018 9.96343 6.03257 9.71852 6.0423C9.47362 6.05204 9.27187 6.23787 9.24209 6.48115L8.97404 8.67061L8.56959 4.30253ZM9.5239 12.4083L8.19257 11.077L8.40718 13.3947C8.43073 13.6491 8.64225 13.8448 8.89768 13.8486C9.15311 13.8523 9.3703 13.663 9.40134 13.4094L9.5239 12.4083ZM7.97134 10.8558L5.51561 8.40002L5.47469 8.60053L5.36821 8.25262L4.55403 7.43844C4.40671 7.49691 4.29207 7.62369 4.25273 7.78434L4.01271 8.7646H3.07172C2.79557 8.7646 2.57172 8.98846 2.57172 9.2646C2.57172 9.54074 2.79557 9.7646 3.07172 9.7646H4.40505C4.53447 9.7646 4.65448 9.71492 4.74451 9.63171L5.09361 10.7723C5.16053 10.9909 5.36725 11.1363 5.59564 11.1254C5.82404 11.1144 6.01591 10.9499 6.06162 10.7259L6.28158 9.64793L6.74209 13.4094C6.77313 13.663 6.99032 13.8523 7.24576 13.8486C7.50119 13.8448 7.7127 13.6491 7.73625 13.3947L7.97134 10.8558ZM9.93459 10.0044L9.8309 9.90071L9.86185 9.64793L9.93459 10.0044Z" fill="white"/>
                  </svg>
                </div>
              </span>
  
              <span v-if="info.transferred" class="lb2">
                <wl-icon name="check-circle-badge-filled" size="16" class="ico" />
                <span class="green">{{info.number}} transferred to {{info.transferred.number}}</span>
              </span>
            </div>
          </span>
          
          <span class="right">
  
            <md-button 
              v-if="info.incoming"
              class="btn btn-circle red" 
              color="red"
              aria-label="x" 
              :size="32" 
              @click="decline"
            >
              <wl-icon name="handset-filled" size="16" :style="{transform: 'rotate(135deg)', }" />
            </md-button>
  
            <md-button 
              v-if="info.incoming"
              class="btn btn-circle green" 
              color="green"
              aria-label="x" 
              :size="32" 
              @click="holdAndAnswer"
            >
              <wl-icon name="handset-filled" size="16" />
            </md-button>
  
            <md-button 
              v-if="info.onhold && !info.transferred"
              class="btn btn-circle40 md-button-outline" 
              aria-label="x" 
              :size="40" 
              title="Transfer"
              @click="transfer"
            >
              <wl-icon name="next-bold" size="16" />
            </md-button>
  
            <md-button 
              v-if="info.onhold && !info.transferred"
              class="btn md-button-outline-green" 
              aria-label="x" 
              :size="40" 
              style="padding: 0 16px"
              @click="resume"
            >
              Resume
            </md-button>
  
            <!--md-button v-if="!info.transferred && !info.incoming && !info.onhold" class="btn md-button-outline btn-circle" aria-label="x" :size="28" >
              <wl-icon name="maximize-bold" size="16" />
            </md-button-->
            <span v-if="info.transferred" class="spacer"></span>
            <md-button v-if="info.transferred" class="btn md-button-outline btn-circle-noborder" aria-label="x" :size="28" @click="close" >
              <wl-icon name="cancel-bold" size="16" />
            </md-button>
            
          </span>
  
        </div>
  
        <div v-if="!info.incoming && !info.onhold && !info.transferred" class="row3 controls">
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" :title="muted ? 'Unmute' : 'Mute'">
            <wl-icon v-if="muted" name="microphone-muted-bold" :color=" theme === 'light' ? 'red-60' : 'red-40' " size="16" class="ico" />
  
            <svg v-show="!muted" class="ico" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0012 14H11.0115C10.4215 14.0146 9.84622 13.8147 9.39243 13.4374C8.93864 13.06 8.63713 12.5309 8.54386 11.9481C9.23297 11.8206 9.85576 11.456 10.3044 10.9176C10.753 10.3792 10.9992 9.70082 11.0002 9V4C11.0002 3.20435 10.6842 2.44129 10.1216 1.87868C9.55896 1.31607 8.79589 1 8.00025 1C7.2046 1 6.44153 1.31607 5.87893 1.87868C5.31632 2.44129 5.00025 3.20435 5.00025 4V9C5.00149 9.71404 5.25721 10.4043 5.7215 10.9468C6.18579 11.4892 6.82824 11.8485 7.53353 11.96C7.62772 12.7332 7.98019 13.452 8.53387 14H4.00122C3.86861 14 3.74144 14.0527 3.64767 14.1464C3.5539 14.2402 3.50122 14.3674 3.50122 14.5C3.50122 14.6326 3.5539 14.7598 3.64767 14.8536C3.74144 14.9473 3.86861 15 4.00122 15H12.0012C12.1338 15 12.261 14.9473 12.3548 14.8536C12.4485 14.7598 12.5012 14.6326 12.5012 14.5C12.5012 14.3674 12.4485 14.2402 12.3548 14.1464C12.261 14.0527 12.1338 14 12.0012 14ZM6.00025 7.494V6.5H10.0002V7.494H6.00025ZM8.00025 2C8.53052 2.00053 9.03892 2.21141 9.41387 2.58637C9.78883 2.96133 9.99972 3.46973 10.0002 4V5.5H6.00025V4C6.00078 3.46973 6.21166 2.96133 6.58662 2.58637C6.96157 2.21141 7.46997 2.00053 8.00025 2Z" fill="white" fill-opacity="0.95"/>
              <path d="M6 7.5H10V9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9V7.5Z" fill="#3CC29A"/>
              <rect x="6" y="5.5" width="4" height="1" fill="#3CC29A"/>
            </svg>
  
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" title="Keypad" >
            <wl-icon
                name="dialpad-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" title="Hold" >
            <wl-icon
                name="pause-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" title="Transfer" @click="transfer" >
            <wl-icon
                name="next-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" title="Add" >
            <wl-icon
                name="participant-add-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" :class="{active: moreMenuVisible}" aria-label="x" :size="40" title="More" ref="tool-btn-more" @click="showMoreMenu">
            <wl-icon
                name="more-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button--red btn-circle" aria-label="x" :size="40" @click='endcall' >
            <wl-icon
                name="cancel-bold" 
                color="white-95"
                size="16"
              /> 
          </md-button>
        </div>
      </div>

  
      <!-- conference part 1 calling / merge-->
      <div 
        v-if="info && info.conference" 
        class="expcont"
      >
  
        <div class="row2">
          <span class="left">
  
            <presence-avatar
              v-if="!info.conferenceOn"
              :title="info.conference.people ? info.conference.people.name : info.conference.number"
              :src="info.conference.people && info.conference.people.avatar ? avatarPath + info.conference.people.avatar : ''" 
              :icon="info.conference.people && info.conference.people.isNumber ? 'participant-bold' : null"
              :color="'white'"
              :backgroundColor="'#545454'"
              :size="32"
              :presence="info.conference.people ? 'call' : ''" 
              :theme="theme === 'light' ? 'light' : 'dark'"
              class="avatar" 
  
            />
  
            <presence-avatar
              v-if="info.conferenceOn"
              :icon="'meet-bold'"
              :iconSize="20"
              :color="'white'"
              :backgroundColor="'#545454'"
              :size="32"
              :theme="theme === 'light' ? 'light' : 'dark'"
              class="avatar" 
  
            />
            
            <div class="txt">
  
              <span v-if="!info.conferenceOn && info.conference.people" class="lb" >
                {{ isNaN(info.conference.people.name) ? info.conference.people.name : formatCallNumber(info.conference.people.name) }}
                <span v-if="info.conference.people.num" class="num">({{info.conference.people.num}})</span>
              </span>
              <span v-if="!info.conferenceOn && !info.conference.people" class="lb" >
                {{ info.conference.number }}
              </span>
  
              <span v-if="info.conferenceOn" class="lb" >
                Conference
              </span>
  
              <span class="lb2">
                <span class="green">{{timer2.value}}</span>
  
                <wl-icon name="dot-divider" size="4" class="dot-divider" color="gray-60" />
                <div class="btn-remove-noise">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5717 8.84863C14.5717 12.4385 11.6616 15.3486 8.07172 15.3486C4.48187 15.3486 1.57172 12.4385 1.57172 8.84863C1.57172 5.25878 4.48187 2.34863 8.07172 2.34863C11.6616 2.34863 14.5717 5.25878 14.5717 8.84863ZM8.56959 4.30253C8.54577 4.04535 8.33 3.84863 8.07172 3.84863C7.81344 3.84863 7.59766 4.04535 7.57385 4.30253L7.2907 7.36051L6.9697 7.03951L6.90134 6.48115C6.87156 6.23787 6.66982 6.05204 6.42491 6.0423C6.29793 6.03726 6.17877 6.08032 6.08661 6.15642L4.92527 4.99508C4.73001 4.79982 4.41342 4.79982 4.21816 4.99508C4.04683 5.16641 4.02583 5.43114 4.15516 5.62536L11.295 12.7652C11.4892 12.8945 11.7539 12.8735 11.9253 12.7022C12.1205 12.5069 12.1205 12.1903 11.9253 11.9951L10.9174 10.9872C10.9777 10.9295 11.0241 10.8563 11.0498 10.7723L11.3989 9.63171C11.489 9.71492 11.609 9.7646 11.7384 9.7646H13.0717C13.3479 9.7646 13.5717 9.54074 13.5717 9.2646C13.5717 8.98846 13.3479 8.7646 13.0717 8.7646H12.1307L11.8907 7.78434C11.8372 7.56575 11.6442 7.40986 11.4193 7.40346C11.1943 7.39706 10.9928 7.54173 10.9269 7.75692L10.6687 8.60053L10.2283 6.44195C10.1793 6.2018 9.96343 6.03257 9.71852 6.0423C9.47362 6.05204 9.27187 6.23787 9.24209 6.48115L8.97404 8.67061L8.56959 4.30253ZM9.5239 12.4083L8.19257 11.077L8.40718 13.3947C8.43073 13.6491 8.64225 13.8448 8.89768 13.8486C9.15311 13.8523 9.3703 13.663 9.40134 13.4094L9.5239 12.4083ZM7.97134 10.8558L5.51561 8.40002L5.47469 8.60053L5.36821 8.25262L4.55403 7.43844C4.40671 7.49691 4.29207 7.62369 4.25273 7.78434L4.01271 8.7646H3.07172C2.79557 8.7646 2.57172 8.98846 2.57172 9.2646C2.57172 9.54074 2.79557 9.7646 3.07172 9.7646H4.40505C4.53447 9.7646 4.65448 9.71492 4.74451 9.63171L5.09361 10.7723C5.16053 10.9909 5.36725 11.1363 5.59564 11.1254C5.82404 11.1144 6.01591 10.9499 6.06162 10.7259L6.28158 9.64793L6.74209 13.4094C6.77313 13.663 6.99032 13.8523 7.24576 13.8486C7.50119 13.8448 7.7127 13.6491 7.73625 13.3947L7.97134 10.8558ZM9.93459 10.0044L9.8309 9.90071L9.86185 9.64793L9.93459 10.0044Z" fill="white"/>
                  </svg>
                </div>
              </span>
  
            </div>
          </span>
          
          <span 
            v-if="!info.conferenceOn" 
            class="right"
          >
  
            <md-button 
              class="btn" 
              color="green"
              aria-label="x" 
              :size="40" 
              style="padding: 0 16px"
              @click="merge"
            >
              {{ !conferenceCallPickedup ? 'Calling' : 'Merge' }}
            </md-button>
            
          </span>
  
          <span 
            v-if="info.conferenceOn" 
            class="right"
          >
            <span style="margin-right:4px;">2</span>
            <wl-icon name="participant-list-bold" size="16" />
            
          </span>
  
        </div>
  
        <div class="row3 controls">
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" :title="muted ? 'Unmute' : 'Mute'">
            <wl-icon v-if="muted" name="microphone-muted-bold" :color=" theme === 'light' ? 'red-60' : 'red-40' " size="16" class="ico" />
  
            <svg v-show="!muted" class="ico" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0012 14H11.0115C10.4215 14.0146 9.84622 13.8147 9.39243 13.4374C8.93864 13.06 8.63713 12.5309 8.54386 11.9481C9.23297 11.8206 9.85576 11.456 10.3044 10.9176C10.753 10.3792 10.9992 9.70082 11.0002 9V4C11.0002 3.20435 10.6842 2.44129 10.1216 1.87868C9.55896 1.31607 8.79589 1 8.00025 1C7.2046 1 6.44153 1.31607 5.87893 1.87868C5.31632 2.44129 5.00025 3.20435 5.00025 4V9C5.00149 9.71404 5.25721 10.4043 5.7215 10.9468C6.18579 11.4892 6.82824 11.8485 7.53353 11.96C7.62772 12.7332 7.98019 13.452 8.53387 14H4.00122C3.86861 14 3.74144 14.0527 3.64767 14.1464C3.5539 14.2402 3.50122 14.3674 3.50122 14.5C3.50122 14.6326 3.5539 14.7598 3.64767 14.8536C3.74144 14.9473 3.86861 15 4.00122 15H12.0012C12.1338 15 12.261 14.9473 12.3548 14.8536C12.4485 14.7598 12.5012 14.6326 12.5012 14.5C12.5012 14.3674 12.4485 14.2402 12.3548 14.1464C12.261 14.0527 12.1338 14 12.0012 14ZM6.00025 7.494V6.5H10.0002V7.494H6.00025ZM8.00025 2C8.53052 2.00053 9.03892 2.21141 9.41387 2.58637C9.78883 2.96133 9.99972 3.46973 10.0002 4V5.5H6.00025V4C6.00078 3.46973 6.21166 2.96133 6.58662 2.58637C6.96157 2.21141 7.46997 2.00053 8.00025 2Z" fill="white" fill-opacity="0.95"/>
              <path d="M6 7.5H10V9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9V7.5Z" fill="#3CC29A"/>
              <rect x="6" y="5.5" width="4" height="1" fill="#3CC29A"/>
            </svg>
  
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" title="Keypad" >
            <wl-icon
                name="dialpad-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" title="Hold" >
            <wl-icon
                name="pause-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" title="Transfer" >
            <wl-icon
                name="next-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" aria-label="x" :size="40" title="Add" >
            <wl-icon
                name="participant-add-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button-outline btn-circle" :class="{active: moreMenuVisible}" aria-label="x" :size="40" title="More" ref="tool-btn-more" >
            <wl-icon
                name="more-bold" 
                :color=" theme === 'light' ? 'black-95' : 'white-95' "
                size="16"
              /> 
          </md-button>
  
          <md-button class="btn md-button--red btn-circle" aria-label="x" :size="40" @click="endcallConference">
            <wl-icon
                name="cancel-bold" 
                color="white-95"
                size="16"
              /> 
          </md-button>
        </div>
      </div>
  
      
      <!-- conference part 2 resume -->
      <div 
        v-if="info && info.conference && !info.conferenceOn" 
        class="expcont"
      >
  
        <div class="row2">
          <span class="left">
  
            <presence-avatar
              :title="info.people.name"
              :src="info.people.avatar ? avatarPath + info.people.avatar : ''" 
              :icon="info.people.isNumber ? 'participant-bold' : null"
              :color="'white'"
              :backgroundColor="'#545454'"
              :size="32"
              :presence="'onhold'" 
              :theme="theme === 'light' ? 'light' : 'dark'"
              class="avatar" 
  
            />
            
            <div class="txt">
              <span class="lb" >
                {{ isNaN(info.people.name) ? info.people.name : formatCallNumber(info.people.name) }}
                <span v-if="info.people.num" class="num">({{info.people.num}})</span>
              </span>
  
              <span class="lb2">
                <span class="green">{{timer1.value}}</span>
  
                <wl-icon name="dot-divider" size="4" class="dot-divider" color="gray-60" />
                <div class="btn-remove-noise">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5717 8.84863C14.5717 12.4385 11.6616 15.3486 8.07172 15.3486C4.48187 15.3486 1.57172 12.4385 1.57172 8.84863C1.57172 5.25878 4.48187 2.34863 8.07172 2.34863C11.6616 2.34863 14.5717 5.25878 14.5717 8.84863ZM8.56959 4.30253C8.54577 4.04535 8.33 3.84863 8.07172 3.84863C7.81344 3.84863 7.59766 4.04535 7.57385 4.30253L7.2907 7.36051L6.9697 7.03951L6.90134 6.48115C6.87156 6.23787 6.66982 6.05204 6.42491 6.0423C6.29793 6.03726 6.17877 6.08032 6.08661 6.15642L4.92527 4.99508C4.73001 4.79982 4.41342 4.79982 4.21816 4.99508C4.04683 5.16641 4.02583 5.43114 4.15516 5.62536L11.295 12.7652C11.4892 12.8945 11.7539 12.8735 11.9253 12.7022C12.1205 12.5069 12.1205 12.1903 11.9253 11.9951L10.9174 10.9872C10.9777 10.9295 11.0241 10.8563 11.0498 10.7723L11.3989 9.63171C11.489 9.71492 11.609 9.7646 11.7384 9.7646H13.0717C13.3479 9.7646 13.5717 9.54074 13.5717 9.2646C13.5717 8.98846 13.3479 8.7646 13.0717 8.7646H12.1307L11.8907 7.78434C11.8372 7.56575 11.6442 7.40986 11.4193 7.40346C11.1943 7.39706 10.9928 7.54173 10.9269 7.75692L10.6687 8.60053L10.2283 6.44195C10.1793 6.2018 9.96343 6.03257 9.71852 6.0423C9.47362 6.05204 9.27187 6.23787 9.24209 6.48115L8.97404 8.67061L8.56959 4.30253ZM9.5239 12.4083L8.19257 11.077L8.40718 13.3947C8.43073 13.6491 8.64225 13.8448 8.89768 13.8486C9.15311 13.8523 9.3703 13.663 9.40134 13.4094L9.5239 12.4083ZM7.97134 10.8558L5.51561 8.40002L5.47469 8.60053L5.36821 8.25262L4.55403 7.43844C4.40671 7.49691 4.29207 7.62369 4.25273 7.78434L4.01271 8.7646H3.07172C2.79557 8.7646 2.57172 8.98846 2.57172 9.2646C2.57172 9.54074 2.79557 9.7646 3.07172 9.7646H4.40505C4.53447 9.7646 4.65448 9.71492 4.74451 9.63171L5.09361 10.7723C5.16053 10.9909 5.36725 11.1363 5.59564 11.1254C5.82404 11.1144 6.01591 10.9499 6.06162 10.7259L6.28158 9.64793L6.74209 13.4094C6.77313 13.663 6.99032 13.8523 7.24576 13.8486C7.50119 13.8448 7.7127 13.6491 7.73625 13.3947L7.97134 10.8558ZM9.93459 10.0044L9.8309 9.90071L9.86185 9.64793L9.93459 10.0044Z" fill="white"/>
                  </svg>
                </div>
              </span>
  
            </div>
          </span>
          
          <span class="right">
  
            <md-button 
              class="btn btn-circle40 md-button-outline" 
              aria-label="x" 
              :size="40" 
              title="Transfer"
            >
              <wl-icon name="next-bold" size="16" />
            </md-button>
  
            <md-button 
              class="btn md-button-outline-green" 
              aria-label="x" 
              :size="40" 
              style="padding: 0 16px"
            >
              Resume
            </md-button>
  
            
          </span>
  
        </div>
  
      </div>


  </div>
</template>

<script>
import timer from './../../utils/timer';
import _ from 'lodash';
export default {
  props: {
    info: {
      type: Object,
    },
    layout: {
      type: String,
      default: '',
    },
  },
  data() {
      return {
        muted: false,

        conferenceCallPickedup: false,
        moreMenuVisible: false,
        timer1 : {value: 0},
        timer2 : {value: 0},
      }
  },
  computed:{
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    avatarPath(){
      return this.$store.state.avatarPath;
    },
    avatarBgColors() {
      return this.$store.state.avatarBgColors;
    },
    callingPeopleItems() {
      return this.$store.state.callingPeopleItems;
    },
  },
  mounted() {

    timer.start(this.timer1);
  },
  beforeDestroy() {
    timer.stop(this.timer1);
    timer.stop(this.timer2);
  },
  updated() {
    if (this.info) {
      if (this.info.onhold || this.info.conference) {
        timer.pause(this.timer1);
      } else {
        timer.resume(this.timer1);
      }

      
    }
    
  },
  watch: {
    info(val) {

      if (val.conference && !this.conferenceCallPickedup) {
        timer.start(this.timer2); 
        setTimeout(() => {
          this.conferenceCallPickedup = true
        }, 3000)
      }
    }
  },
  methods:{
    endcall() {
      var incall
      if (this.callingPeopleItems[this.layout].length > 0) {
        incall = _.cloneDeep(this.callingPeopleItems);
        var i, itm

        var list = incall[this.layout]

        for (i=list.length-1; i>=0; i--) {
          itm = list[i];
          if (itm.people.name === this.info.people.name) {
            list.splice(i, 1)
            break
          }
          
        }
        
        for (i=0; i<list.length; i++) {
          itm = list[i];
          itm.onhold = false;
          break
        }

        incall[this.layout] = list
        this.$store.commit('callingPeopleItems', incall);
        return;
      }

    },
    endcallConference() {
      if (this.info.conferenceOn) {
        this.endcall()
        return
      }
      var incall
      if (this.callingPeopleItems[this.layout].length > 0) {
        incall = _.cloneDeep(this.callingPeopleItems);
        var i, itm

        var list = incall[this.layout]

        for (i=list.length-1; i>=0; i--) {
          itm = list[i];
          if (itm.people.name === this.info.people.name) {
            itm.conference = null
            break
          }
        }

        incall[this.layout] = list
        this.$store.commit('callingPeopleItems', incall);
        return;
      }
    },

    decline() {
      let incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[this.layout]
      var i, itm
      for (i = list.length-1; i >=0 ; i--) {
        itm = list[i];
        if (itm.people.name == this.info.people.name && itm.number == this.info.number) {
          list.splice(i, 1)
        }
      }
      incall[this.layout] = list;
      this.$store.commit('callingPeopleItems', incall);
    },
    transfer() {
      this.$emit('transfer', this.info, 'transfer-call');
    },
    holdAndAnswer() {
      var layout = 'widget'
      var incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[layout]
      for (let i=0; i<list.length; i++) {
        let itm = list[i];
        if (itm.people.name == this.info.people.name && itm.number == this.info.number) {
          itm.incoming = false
        } else {
          if (!itm.incoming) {
            itm.onhold = true
          }
        }
      }
      incall[layout] = list;
      this.$store.commit('callingPeopleItems', incall);

    },
    resume() {
      var layout = this.layout
      var incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[layout]

      for (let i=0; i<list.length; i++) {
        let itm = list[i];
        if (itm.people.name == this.info.people.name && itm.number == this.info.number) {
          itm.onhold = false
        } else if (!itm.onhold && !itm.incoming) {
          itm.onhold = true
        }
      }

      incall[layout] = list;
      this.$store.commit('callingPeopleItems', incall);
      this.$emit('resume');

    },
    merge() {
      if (this.conferenceCallPickedup) {
        var incall
        if (this.callingPeopleItems[this.layout].length > 0) {
          incall = _.cloneDeep(this.callingPeopleItems);
          var i, itm

          var list = incall[this.layout]

          for (i=list.length-1; i>=0; i--) {
            itm = list[i];
            if (itm.people.name === this.info.people.name) {
              itm.conferenceOn = true
              break
            }
          }

          incall[this.layout] = list
          this.$store.commit('callingPeopleItems', incall);
          return;
        }
      }
    },
    close() {
      var layout = this.layout
      var incall = _.cloneDeep(this.callingPeopleItems);
      var list = incall[layout]
      var i, itm
      for (i=0; i<list.length; i++) {
        itm = list[i];
        if (itm.transferred) {
          list.splice(i, 1);
          break;
        }
      }
      incall[layout] = list;
      this.$store.commit('callingPeopleItems', incall);
    },
    formatCallNumber(number) {
      if (number.toString().length < 9) {
        return number;
      } else {
        var s = number.toString();
        return `${s.substring(0, 3)}-${s.substring(3, 6)}-${s.substring(6)}`
      }
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
            <div class="common-menulist-section-title" style="margin: 8px 10px;">Calling options</div>
            <div class='common-menulist-item common-menulist-item-40' @click="onSelect('Switch to a video call')" >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5244 4.64893C14.3797 4.55868 14.2142 4.50723 14.0438 4.49953C13.8735 4.49183 13.704 4.52815 13.5518 4.60498C13.5365 4.61267 13.5217 4.62115 13.5073 4.63037L12 5.5885V5C11.9992 4.3372 11.7356 3.70176 11.2669 3.23309C10.7982 2.76442 10.1628 2.50078 9.5 2.5H3.5C2.8372 2.50078 2.20177 2.76442 1.73309 3.23309C1.26442 3.70177 1.00078 4.3372 1 5V11C1.00078 11.6628 1.26442 12.2982 1.73309 12.7669C2.20177 13.2356 2.8372 13.4992 3.5 13.5H9.5C10.1628 13.4992 10.7982 13.2356 11.2669 12.7669C11.7356 12.2982 11.9992 11.6628 12 11V10.4105L13.5073 11.3686C13.5214 11.3779 13.5361 11.3862 13.5513 11.3935C13.7037 11.4699 13.8731 11.5061 14.0434 11.4985C14.2137 11.4909 14.3793 11.4399 14.5243 11.3503C14.6694 11.2607 14.7891 11.1355 14.8721 10.9866C14.9551 10.8377 14.9986 10.67 14.9985 10.4995V5.49949C14.9991 5.32895 14.9558 5.16112 14.8728 5.01215C14.7898 4.86318 14.6698 4.7381 14.5244 4.64893ZM11 11C10.9996 11.3977 10.8414 11.779 10.5602 12.0602C10.279 12.3414 9.89769 12.4996 9.5 12.5H3.5C3.10231 12.4996 2.72103 12.3414 2.43982 12.0602C2.15861 11.779 2.00044 11.3977 2 11V5C2.00043 4.60231 2.15861 4.22103 2.43982 3.93982C2.72103 3.65861 3.10231 3.50043 3.5 3.5H9.5C9.89769 3.50043 10.279 3.65861 10.5602 3.93982C10.8414 4.22103 10.9996 4.60231 11 5V11ZM12 9.22595V6.77307L13.9985 5.50293L13.9995 10.4966L12 9.22595Z" fill="white" fill-opacity="0.95"/>
                <path d="M4.5 7C5.05228 7 5.5 6.55228 5.5 6C5.5 5.44772 5.05228 5 4.5 5C3.94772 5 3.5 5.44772 3.5 6C3.5 6.55228 3.94772 7 4.5 7Z" fill="#27A17A"/>
              </svg>
              <span class="lb" style="margin-left:8px;" >Switch to a video call</span>
            </div>
            <div class='common-menulist-item common-menulist-item-40' @click="onSelect('Start recording')" >
              <wl-icon name='record-bold' size='16' />
              <span class="lb" style="margin-left:8px;" >Start recording</span>
            </div>
            <div class='common-menulist-item common-menulist-item-40' @click="onSelect('Share screen')" >
              <wl-icon name='share-screen-bold' size='16' />
              <span class="lb" style="margin-left:8px;" >Share screen</span>
            </div>
            <div class='common-menulist-item common-menulist-item-40' @click="onSelect('Park')" >
              <wl-icon name='parked-bold' size='16' />
              <span class="lb" style="margin-left:8px;" >Park</span>
            </div>
            <div class='common-menulist-item common-menulist-item-40' @click="onSelect('Conference')" >
              <wl-icon name='meet-bold' size='16' />
              <span class="lb" style="margin-left:8px;" >Invite and meet</span>
            </div>
          </div>
        `,
              props: ['parent'],
              methods: {
                  onSelect(lb) {

                    if (lb == 'Conference') {
                      this.parent.$emit('conference', this.parent.info, 'add-person');
                    }
                    this.$popper.hideAll();
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
              reference: this.$refs['tool-btn-more'].$el,
              closeTrigger: 'mousedown',
              arrowVisible: true,
              roundedCorner: true,
              frameless: false,
              borderRadius: '12px',
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              appendToBody: true,
              theme: `${this.theme === 'light' ? 'light' : 'dark'} ${this.themeColor}`,
              options: {
                  placement: 'bottom',
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

  }
}
</script>


<style lang="scss">
.call-item {
  position: relative;
  display: flex;
  flex-direction: column;
  user-select: none;

  .divider {
    position: absolute;
    bottom: -6px;
  }

  .expcont {
    background: #1A1A1A;
    border-radius: 8px;
    margin: 0 16px 8px 16px;
    padding: 8px 0;
    min-height: 58px;

    &.transferred {
      display: flex;
      align-items: center;
      background: #0E2B20;
      color: #3CC29A !important;

      svg path {
        fill: #3CC29A !important;
      }

      .row2 .left {
        margin-right: 0px;

        .txt .lb2 .ico{
          margin-right: 4px;
        }
      }

      .right {
        margin-right: 4px !important;
      }
    }
  }

  .row1 {
    @include flex;
    height: 32px;
    margin: -8px 8px 0 12px;

    .lft {
      opacity: .7;
      font-size: 14px;
      flex-grow: 1;
    }
    .rgt {
      @include flex;
      opacity: .7;
      
      .ico {
        @include flex;
        width: 28px;
        height: 28px;
        margin-left: 8px;
      }
    }
  }
  
  .row2 {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 100%;

    .left {
      display: flex;
      align-items: center;
      flex-grow: 1;
      margin-left: 12px;
      margin-right: 8px;
      overflow:hidden;

      .avatar {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }

      .txt {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;

        .lb{
          font-size: 16px;
          line-height: 24px;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        .lb2{
          display: flex;
          align-items: center;
          font-size: 14px;
          line-height: 22px;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          margin-top: -2px;

          .first {
            opacity: .7;
          }
        }
      }

      .dot-divider {
        margin: 0 4px;
      }

      .green {
        color: $md-green-40;
      }

      .btn-remove-noise {
        width: 16px;
        height: 16px;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 12px;

      .btn {
        padding: 0 10px;
        margin-left: 8px;
      }

      .btn-circle {
        padding: 0;
        width: 32px;
        min-width: 32px;
      }

      .btn-circle40 {
        padding: 0;
        width: 40px;
        min-width: 40px;
      }
      .btn-circle28 {
        padding: 0;
        width: 28px;
        min-width: 28px;
      }
      .btn-circle-noborder {
        padding: 0;
        width: 28px;
        min-width: 28px;
        border: none !important;
        margin-left: 0;
      }

    }
  }

  .controls {
    @include flex;
    height: 48px;
    margin-top: 16px;

    .btn {
      margin: 0 8px;
      @include flex;
    }

    .btn-circle {
      flex-shrink: 0;
      padding: 0;
      width: 40px;
      min-width: 40px;
      height: 40px;
    }
    
  }

  .spacer {
    flex-grow: 1;
  }


}

/* theme ----- dark/hybrid */
.dark, .hybrid {

}

</style>
