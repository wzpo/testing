<template>
    <div
      id="pop_share"
      ref="popover"
      :class="[theme]"
      :style="{
        background: `${themeColorList[theme][themeColor]['bg']}`,
      }"
    >
      <div class="wrap">

        <topbar-simple height="48px" title="Share content" :buttons="['close']" :titleStyle="{fontSize: '16px', fontWeight: 'bold', marginLeft: '6px',}" @close="close" />

        <div class="head">
          <div class="tabs">
            <div class="tab" :class="{active: tab === 0}" @click="tab = 0">
              <span class="lb">Screen or application</span>
            </div>
            <div class="tab" :class="{active: tab === 1}" @click="tab = 1">
              <span class="lb">File</span>
            </div>
            <div class="tab" :class="{active: tab === 2}" @click="tab = 2">
              <span class="lb">Advanced</span>
            </div>
          </div>

        </div>

        <div 
          class="contents"
          :style="{
            background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['app'][0]} 0%, ${themeColorList[theme][themeColor]['app'][1]} 100%)`,
          }"
        >

          <div class="ctrls">
            
            <div class="ctrll">
              <wl-combobox
                defaultLabel="Automatically optimize"
                width="280px"
                :datalist="[
                  {
                    label: 'Automatically optimize',
                    value: 'Automatically optimize',
                  },
                  {
                    label: `Optimize for text and images`,
                    value: `Optimize for text and images`,
                  },
                  {
                    label: 'Optimize for motion and video',
                    value: 'Optimize for motion and video',
                  },
                ]"
                :defaultSelectedIndex="optimizeSelectedIndex"
                v-tooltip="{
                  html: true,
                  content: 'Choose the best frame rate and resolution for your <br>shared content type.',
                }"
                @select="selectCombobox"
              />
              
            </div>
            
            <div class="ctrlr">
              <md-checkbox 
                value="showcomputeraudio"
                label="Share computer audio"
                htmlId="showcomputeraudio"
                :checked="true"
                class="cb"
              />

              <md-checkbox 
                v-if="tab !== 2"
                value="immersive"
                label="Show me in front of presentation"
                htmlId="share content"
                :checked="immersiveShare"
                @change="setImmersive(!immersiveShare)"
                class="cb"
              />

              <div class="divider"></div>
              <div class="btnico">
                <wl-icon name="settings-bold" size="16" ></wl-icon>
              </div>
            </div>

          </div>

          <div class="section content" v-if="tab === 0">

            <div class="column column1" :class="{disabled: screenDisabled}">
              <div class="itms">
                <div class="itm screen screen1" @click="changeShare($event, {type: 'screen', name: 'Screen 1'})">
                  <svg class="frame" width="168" height="106" viewBox="0 0 168 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="168" height="98" rx="6" fill="#545454"/>
                    <rect x="66" y="104" width="40" height="2" rx="1" fill="#545454"/>
                    <rect x="82" y="98" width="8" height="6" fill="#545454"/>
                  </svg>

                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name === 'Screen 1'}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">Screen 1</div>
                </div>

                <div class="itm screen screen2" @click="changeShare($event, {type: 'screen', name: 'Screen 2'})">
                  <svg class="frame" width="168" height="106" viewBox="0 0 168 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="168" height="98" rx="6" fill="#545454"/>
                    <rect x="66" y="104" width="40" height="2" rx="1" fill="#545454"/>
                    <rect x="82" y="98" width="8" height="6" fill="#545454"/>
                  </svg>

                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name === 'Screen 2'}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">Screen 2</div>
                </div>
              </div>

            </div>

            <div class="divider_v"></div>

            <wl-scrollbar 
              class="column column2"
              :alwaysVisible="false"
              :arrowVisible="$store.state.os==='win'"
              :theme="theme === 'dark' ? 'dark' : 'light'"
            >
              <div class="itms">
                <div class="itm app1" @click="changeShare($event, {type: 'app', name: 'Microsoft Edge'})">
                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name.indexOf('Microsoft Edge') > -1}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">Microsoft Edge</div>
                  <div class="appico"></div>
                </div>

                <div class="itm app2" @click="changeShare($event, {type: 'app', name: 'PowerPoint'})">
                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name.indexOf('PowerPoint') > -1}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">Microsoft PowerPoint</div>
                  <div class="appico"></div>
                </div>

                <div class="itm app3" @click="changeShare($event, {type: 'app', name: 'Acrobat'})">
                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name.indexOf('Acrobat') > -1}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">Adobe Acrobat</div>
                  <div class="appico"></div>
                </div>

                <div class="itm app4" @click="changeShare($event, {type: 'app', name: 'Excel'})">
                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name.indexOf('Excel') > -1}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">Microsoft Excel</div>
                  <div class="appico"></div>
                </div>

                <div class="itm app5" @click="changeShare($event, {type: 'app', name: 'Chrome'})">
                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name.indexOf('Chrome') > -1}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">Google Chrome</div>
                  <div class="appico"></div>
                </div>

                <div class="itm app6" @click="changeShare($event, {type: 'app', name: 'Word'})">
                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name.indexOf('Word') > -1}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">Microsoft Word</div>
                  <div class="appico"></div>
                </div>

                <div class="itm app7" @click="changeShare($event, {type: 'app', name: 'MeetingWindow'})">
                  <div class="thumb"></div>
                  <div class="msk" :class="{show: selectedItem.name.indexOf('MeetingWindow') > -1}">
                    <div v-if="immersiveShare" class="immersive_figure" ></div>
                  </div>
                  <div class="lb">My meeting window</div>
                  <div class="appico"></div>
                </div>

              </div>
            </wl-scrollbar>

          </div>

          <div class="section content" v-if="tab === 1">

          </div>


          <div class="section content" v-if="tab === 2">
            <div class="itms">
              <div class="itm " @click="changeShare($event, {type: 'portion', name: 'screen'})">
                <div class="thumb">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.2503 20.6245C36.1682 20.6245 36.0869 20.6406 36.0111 20.672C35.9352 20.7034 35.8663 20.7494 35.8083 20.8075C35.7502 20.8655 35.7042 20.9344 35.6728 21.0103C35.6414 21.0861 35.6253 21.1674 35.6253 21.2495V26.9441C35.693 28.1766 35.2713 29.386 34.4521 30.3093C33.6328 31.2326 32.4821 31.7951 31.2503 31.8745H8.7503C7.51848 31.7951 6.36782 31.2326 5.54853 30.3093C4.72925 29.386 4.30761 28.1766 4.3753 26.9441V13.055C4.30761 11.8225 4.72925 10.613 5.54853 9.68975C6.36781 8.76646 7.51848 8.20395 8.7503 8.12455H23.7539C23.9197 8.12455 24.0787 8.0587 24.1959 7.94149C24.3131 7.82428 24.3789 7.66531 24.3789 7.49955C24.3789 7.33379 24.3131 7.17482 24.1959 7.05761C24.0787 6.9404 23.9197 6.87455 23.7539 6.87455H8.7503C7.18663 6.95327 5.71757 7.6473 4.66374 8.80519C3.6099 9.96308 3.05686 11.4908 3.1253 13.055V26.9441C3.05686 28.5083 3.60991 30.036 4.66374 31.1939C5.71757 32.3518 7.18663 33.0458 8.7503 33.1245H31.2503C32.814 33.0458 34.283 32.3518 35.3369 31.1939C36.3907 30.036 36.9437 28.5083 36.8753 26.9441V21.2495C36.8753 21.1674 36.8592 21.0861 36.8278 21.0103C36.7964 20.9344 36.7504 20.8655 36.6923 20.8075C36.6343 20.7494 36.5654 20.7034 36.4895 20.672C36.4137 20.6406 36.3324 20.6245 36.2503 20.6245Z" fill="white" fill-opacity="0.95"/>
                    <path d="M26.2503 13.1245H30.6253V17.4995C30.6253 17.6653 30.6911 17.8242 30.8084 17.9415C30.9256 18.0587 31.0845 18.1245 31.2503 18.1245C31.4161 18.1245 31.575 18.0587 31.6922 17.9415C31.8095 17.8242 31.8753 17.6653 31.8753 17.4995V13.1245H36.2503C36.4161 13.1245 36.575 13.0587 36.6922 12.9415C36.8094 12.8242 36.8753 12.6653 36.8753 12.4995C36.8753 12.3338 36.8094 12.1748 36.6922 12.0576C36.575 11.9404 36.4161 11.8745 36.2503 11.8745H31.8753V7.49951C31.8753 7.33375 31.8095 7.17478 31.6922 7.05757C31.575 6.94036 31.4161 6.87451 31.2503 6.87451C31.0845 6.87451 30.9256 6.94036 30.8084 7.05757C30.6911 7.17478 30.6253 7.33375 30.6253 7.49951V11.8745H26.2503C26.0845 11.8745 25.9256 11.9404 25.8084 12.0576C25.6911 12.1748 25.6253 12.3338 25.6253 12.4995C25.6253 12.6653 25.6911 12.8242 25.8084 12.9415C25.9256 13.0587 26.0845 13.1245 26.2503 13.1245Z" fill="white" fill-opacity="0.95"/>
                  </svg>
                </div>
                <div class="msk" :class="{show: selectedItem.name.indexOf('screen') > -1}">
                  <div v-if="immersiveShare" class="immersive_figure" ></div>
                </div>
                <div class="lb">Portion of screen</div>
              </div>

              <div class="itm " @click="changeShare($event, {type: 'audio', name: 'Computer audio only'})">
                <div class="thumb">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27.0459 13.9446C26.9895 14.0043 26.9454 14.0744 26.9161 14.1511C26.8869 14.2279 26.873 14.3096 26.8753 14.3916C26.8776 14.4737 26.8961 14.5545 26.9297 14.6295C26.9632 14.7044 27.0112 14.772 27.0709 14.8283C27.7912 15.4839 28.3678 16.2816 28.7644 17.1712C29.1609 18.0608 29.3688 19.0229 29.375 19.9968C29.3644 20.9707 29.1545 21.9322 28.7583 22.8219C28.362 23.7116 27.7878 24.5108 27.0709 25.1701C26.9799 25.256 26.9168 25.3672 26.8897 25.4894C26.8626 25.6116 26.8729 25.7391 26.9191 25.8554C26.9653 25.9716 27.0454 26.0713 27.149 26.1416C27.2526 26.2118 27.3748 26.2493 27.5 26.2492C27.6597 26.2498 27.8135 26.1886 27.9291 26.0783C28.7696 25.3032 29.4424 24.3642 29.906 23.3191C30.3697 22.274 30.6144 21.145 30.625 20.0017C30.6204 18.8567 30.3785 17.7251 29.9145 16.6783C29.4504 15.6316 28.7744 14.6924 27.9291 13.9201C27.8086 13.8064 27.648 13.7451 27.4824 13.7497C27.3168 13.7543 27.1599 13.8244 27.0459 13.9446Z" fill="white" fill-opacity="0.95"/>
                    <path d="M21.1041 4.47072C20.8778 4.37623 20.6286 4.35062 20.3878 4.39709C20.147 4.44356 19.9253 4.56005 19.7504 4.73197L10.9985 13.1243H6.25C5.42147 13.1252 4.62712 13.4547 4.04125 14.0405C3.45539 14.6264 3.12587 15.4207 3.125 16.2493V23.7493C3.12587 24.5778 3.45539 25.3722 4.04125 25.958C4.62712 26.5439 5.42147 26.8734 6.25 26.8743H10.9985L19.7406 35.2568C19.9155 35.4316 20.1382 35.5507 20.3807 35.5989C20.6232 35.6471 20.8745 35.6224 21.103 35.5278C21.3314 35.4332 21.5267 35.2731 21.6641 35.0675C21.8015 34.862 21.8749 34.6203 21.875 34.3731V5.62549C21.8753 5.37832 21.8021 5.13664 21.6649 4.93106C21.5277 4.72548 21.3325 4.56527 21.1041 4.47072ZM20.6158 34.3633L11.6827 25.7976C11.5661 25.6864 11.4111 25.6244 11.25 25.6243H6.25C5.75289 25.6237 5.27629 25.426 4.92477 25.0745C4.57326 24.723 4.37554 24.2464 4.375 23.7493V16.2493C4.37554 15.7522 4.57326 15.2756 4.92477 14.9241C5.27629 14.5725 5.75289 14.3748 6.25 14.3743H11.25C11.4111 14.3742 11.5661 14.3121 11.6827 14.2009L20.625 5.62549L20.6158 34.3633Z" fill="white" fill-opacity="0.95"/>
                    <path d="M33.3459 12.0452C33.2863 11.9888 33.2162 11.9448 33.1395 11.9155C33.0629 11.8863 32.9812 11.8725 32.8992 11.8748C32.8172 11.8771 32.7364 11.8956 32.6615 11.9291C32.5867 11.9626 32.5191 12.0106 32.4628 12.0702C32.4064 12.1298 32.3624 12.2 32.3331 12.2766C32.3039 12.3533 32.29 12.435 32.2924 12.517C32.2947 12.599 32.3131 12.6797 32.3467 12.7546C32.3802 12.8295 32.4282 12.897 32.4878 12.9534C33.4692 13.8467 34.2547 14.9339 34.7947 16.1463C35.3347 17.3586 35.6174 18.6697 35.625 19.9968C35.6107 21.3236 35.3249 22.6334 34.7852 23.8456C34.2456 25.0578 33.4635 26.1467 32.4872 27.0452C32.3675 27.1593 32.2979 27.3162 32.2936 27.4816C32.2894 27.6469 32.3508 27.8072 32.4645 27.9273C32.5782 28.0475 32.7348 28.1177 32.9001 28.1226C33.0655 28.1274 33.226 28.0666 33.3465 27.9534C34.4461 26.9389 35.3265 25.71 35.9333 24.3425C36.5401 22.975 36.8606 21.4978 36.875 20.0017C36.8687 18.5036 36.5519 17.023 35.9445 15.6535C35.337 14.2841 34.4522 13.0554 33.3459 12.0452Z" fill="white" fill-opacity="0.95"/>
                    </svg>
                </div>
                <div class="msk" :class="{show: selectedItem.name.indexOf('Computer audio only') > -1}">
                  <div v-if="immersiveShare" class="immersive_figure" ></div>
                </div>
                <div class="lb">Computer audio only</div>
              </div>

              <div class="itm " @click="changeShare($event, {type: 'camera', name: 'External camera'})">
                <div class="thumb">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.9862 12.1555C35.7048 11.9825 35.3827 11.8867 35.0525 11.8777C34.7223 11.8687 34.3955 11.9469 34.1051 12.1043L29.3779 15.1107V12.501C29.3763 11.0096 28.7831 9.57984 27.7286 8.5253C26.6741 7.47076 25.2443 6.8776 23.7529 6.87598H8.75293C7.26159 6.8776 5.83179 7.47076 4.77725 8.5253C3.72271 9.57984 3.12956 11.0096 3.12793 12.501V27.501C3.12955 28.9923 3.72271 30.4221 4.77725 31.4767C5.83179 32.5312 7.26159 33.1244 8.75293 33.126H23.7529C25.2443 33.1244 26.6741 32.5312 27.7286 31.4767C28.7831 30.4221 29.3763 28.9923 29.3779 27.501V24.8899L34.1612 27.927C34.422 28.058 34.7098 28.1265 35.0017 28.1272C35.4985 28.1255 35.9744 27.9272 36.3254 27.5756C36.6764 27.224 36.874 26.7478 36.8748 26.2509V13.7497C36.876 13.4301 36.7948 13.1155 36.6392 12.8363C36.4836 12.5571 36.2587 12.3226 35.9862 12.1555ZM28.1279 27.501C28.1265 28.6609 27.6651 29.7729 26.845 30.593C26.0248 31.4132 24.9128 31.8746 23.7529 31.876H8.75293C7.59304 31.8746 6.48105 31.4132 5.66089 30.593C4.84072 29.7729 4.37933 28.6609 4.37793 27.501V12.501C4.37933 11.3411 4.84072 10.2291 5.66089 9.40893C6.48105 8.58877 7.59304 8.12738 8.75293 8.12598H23.7529C24.9128 8.12738 26.0248 8.58877 26.845 9.40893C27.6651 10.2291 28.1265 11.3411 28.1279 12.501V27.501ZM35.6249 26.251C35.6242 26.3523 35.5991 26.4519 35.5518 26.5415C35.5046 26.6312 35.4364 26.7081 35.3532 26.7659C35.27 26.8237 35.1741 26.8606 35.0737 26.8736C34.9732 26.8866 34.8711 26.8753 34.7759 26.8406L29.3779 23.4098V16.5922L34.7197 13.1907C34.8151 13.1431 34.921 13.1207 35.0274 13.1255C35.1339 13.1303 35.2373 13.1622 35.328 13.2182C35.4186 13.2742 35.4935 13.3524 35.5454 13.4454C35.5974 13.5385 35.6247 13.6432 35.6249 13.7498V26.251Z" fill="white" fill-opacity="0.95"/>
                    </svg>

                </div>
                <div class="msk" :class="{show: selectedItem.name.indexOf('External camera') > -1}">
                  <div v-if="immersiveShare" class="immersive_figure" ></div>
                </div>
                <div class="lb">External camera</div>
              </div>

              <div class="itm " @click="changeShare($event, {type: 'cable', name: 'iPhone/iPad via cable'})">
                <div class="thumb">
                  <svg width="56" height="70" viewBox="0 0 56 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.1499 18.7598H12.9499" stroke="white" stroke-linecap="round"/>
                    <path d="M48.2998 18.8999L48.2998 22.3999" stroke="white" stroke-linecap="round"/>
                    <path d="M29.4 69.3L29.4 54.1545M27.3 52.018L27.3 49.8543L31.5 49.8543L31.5 52.018C31.5 53.208 30.555 54.1816 29.4 54.1816C28.2187 54.1545 27.3 53.208 27.3 52.018ZM27.3 49.8273L27.3 46.0409C27.3 45.7434 27.5363 45.5 27.825 45.5L30.975 45.5C31.2637 45.5 31.5 45.7434 31.5 46.0409L31.5 49.8273L27.3 49.8273Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.513 36.4464V38.2417C18.513 39.9237 17.1328 41.2998 15.446 41.2998H7.26723C5.58036 41.2998 4.2002 39.9237 4.2002 38.2417V19.8931C4.2002 18.2112 5.58036 16.835 7.26723 16.835H13.2125C13.9857 16.835 14.6125 16.2082 14.6125 15.435V13.2457C14.6125 10.5694 16.782 8.39981 19.4583 8.39981H46.2543C48.9306 8.39981 51.1002 10.5694 51.1002 13.2457V24.9645V28.1461C51.1002 30.8224 48.9306 32.992 46.2544 32.992H20.513C19.4084 32.992 18.513 32.0966 18.513 30.992V20.0338C18.513 19.1765 18.1626 18.4028 17.5946 17.8498" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                </div>
                <div class="msk" :class="{show: selectedItem.name.indexOf('iPhone/iPad via cable') > -1}">
                  <div v-if="immersiveShare" class="immersive_figure" ></div>
                </div>
                <div class="lb">iPhone/iPad via cable</div>
              </div>

            </div>
          </div>

          <div class="section bot">

            <div class="botl">
              <span v-if="tab===0 && selectedItem.type === 'app'">Hold<span class="bg">Shift</span>to select multiple applications.</span>
            </div>
            
            <div class="botr">
              <md-button :size="32" class="btn" :class="{disable: !selectedItem || !selectedItem.type}" aria-label="share" @click='share' >
                {{ firstButtonText }}
              </md-button>

              <md-button :size="32" class="btn md-button-outline" aria-label="cancel" @click='close'>
                Cancel
              </md-button>
            </div>
          </div>


        </div>

      </div>
    </div>
</template>

<script>
//import popFiles from '../shared/pop-files.vue'
//import popBox from '../meeting/pop-box.vue'

export default {
  props: {
    defaultTab: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      firstButtonText: 'Share',
      shareAudio: false,
      screenDisabled: false,
      tab: this.defaultTab || 0,
      menuSettingVisible: false,
      selectedItem: {
        type: 'screen',
        name: 'Screen 1',
      } ,
      optimizePrevIndex: 0,
      optimizeSelectedIndex: 0,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    themeColorList() {
      return this.$store.state.themeColorList;
    },
    popShareVisible() {
      return this.$store.state.popShareVisible;
    },
    immersiveShare() {
      return this.$store.state.immersiveShare;
    },
    selfSharing() {
      return this.$store.state.selfSharing;
    },
    sharePortionIsEditing() {
      return this.$store.state.sharePortionIsEditing;
    },
    selfSharingContent() {
      return this.$store.state.selfSharingContent;
    },
    os() {
      return this.$store.state.os;
    },
    chatMsgList() {
      return this.$store.state.chatMsgList;
    },
    spaceMsgList() {
      return this.$store.state.spaceMsgList;
    },
    fileList() {
      return this.$store.state.fileList;
    },
    filePath() {
      return this.$store.state.filePath;
    },
    me() {
      return this.$store.getters.me;
    },
  },
  beforeMount() {
    if (this.sharePortionIsEditing) {
      this.tab = 2;
    }
  },
  mounted() {
    if (this.selfSharing) {
      this.selectedItem = {
        type: this.selfSharing,
        name: this.selfSharingContent,
      };
    }
    window.addEventListener('keyup', this.onkeyup);
  },
  destroyed() {
    this.$store.commit("screenSelected", null);
    window.removeEventListener('keyup', this.onkeyup);
  },

  watch: {
    popShareVisible(val) {
      if (val) {
        this.$store.commit('selfvideoBgEffect', this.immersiveShare ? 'transparent' : null);
      }
    },
  },
  methods: {
    onkeyup(evt) {
      // console.log('evt.code', evt.code);
      if (evt.code === 'ShiftLeft' || evt.code === 'ShiftRight') {
        this.screenDisabled = false;
      }
    },
    changeShare(evt, obj) {
      if (obj.type !== 'camera' && this.optimizeSelectedIndex !== this.optimizePrevIndex) {
        this.optimizeSelectedIndex = this.optimizePrevIndex;
      }

      if (obj.type === 'portion' || obj.type === 'camera') {
        if (this.firstButtonText === 'Share') {
          this.firstButtonText = 'Next';
        }
        if (obj.type === 'camera') {
          this.optimizeSelectedIndex = 2;
        }

        this.selectedItem = obj;
        return;
      }

      this.firstButtonText = 'Share';

      if (obj.type === 'app' && evt.shiftKey) {
        if (this.selectedItem.type !== 'app') {
          this.selectedItem = obj;
        } else {
          if (this.selectedItem.name.indexOf(obj.name) === -1) {
            if (typeof this.selectedItem.name !== 'object') {
              this.selectedItem.name = [this.selectedItem.name];
            }
            this.selectedItem.name.push(obj.name);
          } else if (typeof this.selectedItem.name === 'object') {
            this.selectedItem.name.splice(this.selectedItem.name.indexOf(obj.name), 1);
          }
        }
        this.$store.commit("screenSelected", null);
        this.screenDisabled = true;
      } else if (obj.type === 'screen') {
        this.selectedItem = obj;
        this.$store.commit("screenSelected", obj.name);
      } else {
        this.selectedItem = obj;
        this.$store.commit("screenSelected", null);
      }

    },

    setImmersive(val) {
      this.$store.commit("immersiveShare", val);
      if (val) {
        this.$store.commit("immersiveVideoVisible", true);
      }
      setTimeout(() => {
        this.$store.commit('selfvideoBgEffect', val ? 'transparent' : null);
      }, 200);
    },
    share() {
      if (this.selectedItem.type === 'portion') {
        this.$store.commit("sharePortionIsEditing", true);
        this.close();
        return;
      }
      this.$store.commit('selfSharing', this.selectedItem.type);
      this.$store.commit('selfSharingContent', this.selectedItem.name);
      this.close();
    },
    close() {
      this.$emit("close");
    },
    selectCombobox(data) {
      if (data.manually) {
        this.optimizePrevIndex = data.index;
      }
      this.optimizeSelectedIndex = data.index;
    },




  }
};
</script>

<style lang="scss">
#pop_share {
  width: 100%;
  height: 100%;
  pointer-events: auto;
  user-select: none;
  box-sizing: border-box;
  border: 1px solid rgba($color: #000000, $alpha: .2);

  .wrap {
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;

    .head {
      height: 62px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;

      .tabs {
        @include flex(row, flex-start);
        margin: 14px 0 17px 0;

        margin-left: 18px;
        margin-right: 18px;

        .tab {
          @include flex;
          height: 28px;
          padding: 0 16px;
          margin-right: 8px;
          user-select: none;
          border-radius: 14px;

          .lb {
            font-size: 14px;
            font-weight: 600;
            opacity: .7;
          }

          &:hover {
            background: rgba($color: #000000, $alpha: .1);
            .lb {
              opacity: .95;
            }
          }

          &:active, &.active {
            background: rgba($color: #000000, $alpha: .2);
            .lb {
              opacity: .95;
            }
          }
        }
      }
      
    }

    .contents {
      @include flex(column, flex-start, flex-start);
      width: 100%;
      flex-grow: 1;
      flex-shrink: 1;
      border-radius: 12px 0px 12px 12px;
      padding: 16px 0 0 24px;
      overflow: hidden;

      .ctrls {
        @include flex(row, space-between);
        margin-bottom: 16px;
        width: 100%;

        .ctrll {
          @include flex(row, flex-start);

          
        }

        .ctrlr {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-right: 12px;

          .cb {
            margin-bottom: 0;
            margin-right: 16px;
          }

          .divider {
            width: 1px;
            height: 22px;
            background: rgba(255, 255, 255, 0.2);
          }

          .btnico {
            @include flex;
            width: 32px;
            height: 32px;
            margin-left: 12px;
          }

        }

      }
    }

    .content {
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
    }

    .section {
      display: flex;
      flex-direction: row;

      &.bot {
        width: 100%;
        height: 48px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        flex-shrink: 0;

        .botl {
          @include flex;

          .bg {
            background: rgba($color: #000000, $alpha: .2);
            border-radius: 4px;
            margin: 0px 8px;
            padding: 2px 8px;
          }
        }
        .botr {
          @include flex(row, flex-end);
        }
      }

      .btn {
        margin-right: 2px;
        padding: 0 12px;
        font-weight: normal;
        font-size: 16px;

        &.disable {
          pointer-events: none;
          opacity: .2;
        }

        &:last-child {
          margin-right: 20px;
        }
      }
    }
    .column {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0;

      .tt {
        font-size: 12px;
        font-weight: bold;
        margin-top: 15px;
        margin-left: 7px;
      }

      &.column1 {
        flex-shrink: 0;
        width: 210px;

        &.disabled {
          pointer-events: none;
          opacity: .2;
        }
      }
      &.column2 {
        flex-grow: 1;
        flex-grow: 1;
        margin: 0 4px 0 12px;
        height: 100%;
        overflow: hidden;
      }
    }

  }
  .close {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 8px;
    right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    cursor: default;
  }

  .divider_v {
    height: 372px;
    border-right: 1px solid rgba(0,0,0, 0.2);
    width: 1px;
  }

  .itms {
    text-align: left;

    .itm {
      position: relative;
      display: inline-block;
      width: 196px;
      height: 144px;
      margin: 0 12px 7px 0;
      border-radius: 6px;
      text-align: center;
      box-sizing: border-box;

      .appico {
        position: absolute;
        width: 48px;
        height: 48px;
        left: 8px;
        top: 8px;
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.3);
        box-sizing: border-box;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 32px 32px;
      }

      .lb {
        position: absolute;
        bottom: 8px;
        text-align: center;
        width: 100%;
        height: 24px;
        font-size: 16px;
      }
      .thumb {
        position: absolute;
        top: 18px;
        left: 18px;
        width: 160px;
        height: 90px;
        background-color: $md-gray-05;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

      }

      .lb {
        font-size: 16px;
      }

      .msk {
        position: absolute;
        width: 196px;
        height: 144px;
        border-radius: 12px;
        display: none;

        .immersive_figure {
          position: absolute;
          width: 56px;
          height: 53px;
          bottom: 34px;
          right: 15px;

          /* background: url(~@/assets/img/immersive-share-figure.svg) no-repeat; */
        }
      }
      
      &.screen {
        height: 152px;

        .frame {
          position: absolute;
          top: 14px;
          left: 14px;
        }

        .msk {
          height: 152px;
        }

      }

      &:hover .msk {
        display: block;
        border: 2px solid rgba($color: #000000, $alpha: .2);
      }
      &:active .msk, .msk.show {
        display: block;
        border: 2px solid $md-blue-60;
      }
    }
    
  }
  
  
  .screen1 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_screen1.png);
    background-size: 160px 90px;
    border-radius: 4px;
  }
  .screen2 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_screen2.png);
    background-size: 160px 90px;
    border-radius: 4px;
  }
  .app1 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_app1.png);
  }
  .app2 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_app2.png);
  }
  .app3 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_app1.png);
  }
  .app4 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_app1.png);
  }
  .app5 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_app1.png);
  }
  .app6 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_app3.png);
  }
  .app7 .thumb {
    background-image: url(~@/assets/img/sharing_thumb_app4.png);
  }
  
  .app1 .appico {
    background-image: url(~@/assets/img/sharing_ico_app1.png);
  }
  .app2 .appico {
    background-image: url(~@/assets/img/sharing_ico_app2.png);
  }
  .app3 .appico {
    background-image: url(~@/assets/img/sharing_ico_app3.png);
  }
  .app4 .appico {
    background-image: url(~@/assets/img/sharing_ico_app4.png);
  }
  .app5 .appico {
    background-image: url(~@/assets/img/sharing_ico_app5.png);
  }
  .app6 .appico {
    background-image: url(~@/assets/img/sharing_ico_app6.png);
  }
  .app7 .appico {
    background-image: url(~@/assets/img/sharing_ico_app7.png);
  }




  &.dark {
    color: $text-color-primary-dark-ui;
    border: 1px solid rgba($color: #FFFFFF, $alpha: .2);

    .itms {
      .itm {
        .appico {
          border: 1px solid rgba(255, 255, 255, 0.15);
          background-color: rgba($color: #000000, $alpha: .95);
        }

        .thumb {
          background-color: rgba($color: #FFFFFF, $alpha: .2);
        }

        &:hover {
          background-color: rgba($color: #000000, $alpha: .3);
          .msk {
            border: 2px solid rgba($color: #FFFFFF, $alpha: .2);
          }
        }
        &:active {
          background-color: rgba($color: #000000, $alpha: .3);

          .msk {
            border: 2px solid $md-blue-40;
          }
        }
        .msk.show {
          border: 2px solid $md-blue-40;
        }
      }
    }

    .divider_v {
      border-right: 1px solid rgba(255,255,255, 0.2);
    }
    .wrap .head {
      .tabs {
        .tab {
          &:hover {
            background: rgba($color: #FFFFFF, $alpha: .1);
          }
          &:active, &.active {
            background: rgba($color: #FFFFFF, $alpha: .2);
          }
        }
      }
    }

    .section {
      &.bot {
        .botl {
          .bg {
            background: rgba($color: #FFFFFF, $alpha: .2);
          }
        }
      }
    }

  }
  
}


</style>
