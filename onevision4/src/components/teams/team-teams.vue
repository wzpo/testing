<template>
  <fragment>

    <div 
      v-if="!activeTeamItem.name"
      class="teams-defaultpage " 
      :class="[theme]"
      :style="{
        background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
        borderTopRightRadius: teamsSidecarName && !gptPanelPopouted || meetingsSidecarVisible ? '12px' : '0',
      }"
    >
      <div class="img">
        <svg width="175" height="128" viewBox="0 0 175 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24.7865 16.72C34.0265 18.7 41.0465 27.7 39.6065 38.02C38.3465 47.02 30.7265 54.04 21.6065 54.46C10.5665 55.06 1.38647 46.24 1.38647 35.26C1.38647 24.64 9.96647 16.06 20.5865 16.06V12.46C20.5865 6.52 25.4465 1.66 31.3865 1.66H163.386C169.326 1.66 174.186 6.52 174.186 12.46V115.66C174.186 121.6 169.326 126.46 163.386 126.46H31.3865C25.4465 126.46 20.5865 121.6 20.5865 115.66V58.66M17.0465 32.02C16.5065 31.84 15.9065 31.72 15.2465 31.72C12.2465 31.72 9.84648 33.88 9.84648 36.52C9.84648 38.32 12.8465 38.92 15.2465 38.92M25.9865 38.92C28.3865 38.92 31.3865 38.32 31.3865 36.52C31.3865 33.88 28.9865 31.72 25.9865 31.72M25.9865 31.72C25.3265 31.72 24.7265 31.84 24.1865 32.02M25.9865 31.72C27.6433 31.72 28.9865 30.3769 28.9865 28.72C28.9865 27.0632 27.6433 25.72 25.9865 25.72C24.3296 25.72 22.9865 27.0632 22.9865 28.72C22.9865 30.3769 24.3296 31.72 25.9865 31.72ZM20.5865 36.52C22.5747 36.52 24.1865 34.9082 24.1865 32.92C24.1865 30.9318 22.5747 29.32 20.5865 29.32C18.5983 29.32 16.9865 30.9318 16.9865 32.92C16.9865 34.9082 18.5983 36.52 20.5865 36.52ZM20.5865 36.52C24.2465 36.52 27.1865 39.22 27.1865 42.52C27.1865 44.32 23.5865 45.52 20.5865 45.52C17.5865 45.52 13.9865 44.32 13.9865 42.52C13.9865 39.22 16.9265 36.52 20.5865 36.52ZM66.1865 25.72V35.32M70.9865 30.52H61.3865M94.9865 23.32H114.186M94.9865 28.12H104.586M133.386 23.32H152.586M133.386 28.12H142.986M94.9865 56.92H114.186M94.9865 61.72H104.586M133.386 56.92H152.586M133.386 61.72H142.986M94.9865 90.52H114.186M94.9865 95.32H104.586M56.5865 56.92H75.7865M56.5865 61.72H66.1865M56.5865 90.52H75.7865M56.5865 95.32H66.1865M18.1865 28.72C18.1865 30.3769 16.8433 31.72 15.1865 31.72C13.5296 31.72 12.1865 30.3769 12.1865 28.72C12.1865 27.0632 13.5296 25.72 15.1865 25.72C16.8433 25.72 18.1865 27.0632 18.1865 28.72ZM78.1865 44.92H54.1865C51.5465 44.92 49.3865 42.76 49.3865 40.12V20.92C49.3865 18.28 51.5465 16.12 54.1865 16.12H78.1865C80.8265 16.12 82.9865 18.28 82.9865 20.92V40.12C82.9865 42.82 80.8865 44.92 78.1865 44.92ZM116.586 44.92H92.5865C89.9465 44.92 87.7865 42.76 87.7865 40.12V20.92C87.7865 18.28 89.9465 16.12 92.5865 16.12H116.586C119.226 16.12 121.386 18.28 121.386 20.92V40.12C121.386 42.82 119.286 44.92 116.586 44.92ZM154.986 44.92H130.986C128.346 44.92 126.186 42.76 126.186 40.12V20.92C126.186 18.28 128.346 16.12 130.986 16.12H154.986C157.626 16.12 159.786 18.28 159.786 20.92V40.12C159.786 42.82 157.686 44.92 154.986 44.92ZM78.1865 78.52H54.1865C51.5465 78.52 49.3865 76.36 49.3865 73.72V54.52C49.3865 51.88 51.5465 49.72 54.1865 49.72H78.1865C80.8265 49.72 82.9865 51.88 82.9865 54.52V73.72C82.9865 76.42 80.8865 78.52 78.1865 78.52ZM116.586 78.52H92.5865C89.9465 78.52 87.7865 76.36 87.7865 73.72V54.52C87.7865 51.88 89.9465 49.72 92.5865 49.72H116.586C119.226 49.72 121.386 51.88 121.386 54.52V73.72C121.386 76.42 119.286 78.52 116.586 78.52ZM154.986 78.52H130.986C128.346 78.52 126.186 76.36 126.186 73.72V54.52C126.186 51.88 128.346 49.72 130.986 49.72H154.986C157.626 49.72 159.786 51.88 159.786 54.52V73.72C159.786 76.42 157.686 78.52 154.986 78.52ZM78.1865 112.12H54.1865C51.5465 112.12 49.3865 109.96 49.3865 107.32V88.12C49.3865 85.48 51.5465 83.32 54.1865 83.32H78.1865C80.8265 83.32 82.9865 85.48 82.9865 88.12V107.32C82.9865 110.02 80.8865 112.12 78.1865 112.12ZM116.586 112.12H92.5865C89.9465 112.12 87.7865 109.96 87.7865 107.32V88.12C87.7865 85.48 89.9465 83.32 92.5865 83.32H116.586C119.226 83.32 121.386 85.48 121.386 88.12V107.32C121.386 110.02 119.286 112.12 116.586 112.12Z" stroke="url(#paint0_linear_447_1540)" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
          <linearGradient id="paint0_linear_447_1540" x1="87.7865" y1="1.66" x2="87.7865" y2="126.46" gradientUnits="userSpaceOnUse">
          <stop stop-color="#279BE8"/>
          <stop offset="1" stop-color="#875AE0"/>
          </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="right">
        <div class="title">{{createTeamVisible ? 'Create a team' : 'Welcome to Teams'}}</div>
        <div class="des">Organize spaces for a group of people with a common goal. A team could be your department or the people you work with on a project.</div>
        <md-button v-if="!createTeamVisible" class="btn md-button-outline btn-add" aria-label="x" :size="32" @click="showCreatePage" >
          <wl-icon name="plus-bold" size="16" class="ico" />
          <span class="label">Create a team</span>
        </md-button>
        <div v-if="createTeamVisible" class="createpage">
          <md-input 
            class="md-search-input input" 
            placeholder="Name the team (required)"
          >
          </md-input>

          <md-input 
            class="md-search-input input textarea" 
            placeholder="Describe the team"
            multiline
          >
          </md-input>

          <md-input 
            class="md-search-input input search" 
            clear
            placeholder="Add people by name or email"
          >
            <wl-icon
              name="search-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
              class="md-search-input__icon"
              slot="inputBefore"
            />
          </md-input>

          <div class="btns">
            <md-button class="btn md-button-solid " aria-label="x" :size="32" disabled >
              Create
            </md-button>
            <md-button class="btn md-button-outline " aria-label="x" :size="32" @click="createTeamVisible=false" >
              Close
            </md-button>
          </div>
        </div>
      </div>

    </div>

    <div 
      v-if="activeTeamItem.name"
      class="teams-detailpage " 
      :class="[theme]"
      :style="{
        background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
        borderTopRightRadius: teamsSidecarName && !gptPanelPopouted || meetingsSidecarVisible ? '12px' : '0',
      }"
    >
      <div class="bg">
        <svg width="716" height="318" viewBox="0 0 716 318" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_390_81604" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="780" height="319">
          <rect x="780" y="318" width="780" height="318" transform="rotate(180 780 318)" fill="white"/>
          </mask>
          <g mask="url(#mask0_390_81604)">
          <g opacity="0.9">
          <g opacity="0.9">
          <g opacity="0.4" filter="url(#filter0_f_390_81604)">
          <ellipse rx="268" ry="66.6792" transform="matrix(-1 7.3455e-08 -4.59748e-07 1 288 63.9812)" :fill="activeTeamItem.color2"/>
          </g>
          <g opacity="0.4" filter="url(#filter1_f_390_81604)">
          <ellipse rx="154" ry="56.5" transform="matrix(-1 5.96356e-08 -1.87623e-07 1 145 77.5)" :fill="activeTeamItem.color2"/>
          </g>
          </g>
          </g>
          </g>
          <defs>
          <filter id="filter0_f_390_81604" x="-80" y="-102.698" width="736" height="333.358" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_390_81604"/>
          </filter>
          <filter id="filter1_f_390_81604" x="-119" y="-89" width="528" height="333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="55" result="effect1_foregroundBlur_390_81604"/>
          </filter>
          </defs>
        </svg>
      </div>
      
      <team-teams-header 
        :team="activeTeamItem" 
        @tabchange="tabchange"
      />

      <div 
        v-if="selectedTab === 'about'"
        class="about"
      >
        <div class="left">
          <div class="info">
            Design has a big impact at Renergise, and the work we do directly shapes the direction of the company. We always strive for excellence, with a strong focus on research and feedback loops, both internal and external.
          </div>
          <md-button class="btn md-button-outline" aria-label="x" :size="32" >
            <wl-icon name="plus-bold" size="16" class="ico" />
            <span class="label">Create a team space</span>
          </md-button>
        </div>
        <div class="right">
          <div 
            v-for="(itm, idx) in moderators"
            :key="`md-itm-${idx}`"
            class="moderator"
          >
            <presence-avatar
              :src="$store.state.avatarPath+$store.getters.people(itm).avatar" 
              :size="72"
              :presence="'active'" 
              :theme="theme === 'light' ? 'light' : 'dark'"
              class="avatar" 
            />
            <div class="info">
              <div class="ro1">{{itm}}</div>
              <div class="ro2">{{idx === 0 ? 'Head of Design' : 'Design Manager'}}</div>
              <div class="ro3">Moderator</div>
            </div>

          </div>

          <md-button class="btn md-button-outline" aria-label="x" :size="32" >
            <wl-icon name="plus-bold" size="16" class="ico" />
            <span class="label">Add a team moderator</span>
          </md-button>
        </div>
      </div>
      
      <div 
        v-if="selectedTab === 'member'"
        class="member"
      >
        <div class="top">
          <md-input 
            class="md-search-input input search" 
            clear
            placeholder="Add or find by name or email"
          >
            <wl-icon
              name="search-bold" 
              :color=" theme === 'light' ? 'black-95' : 'white-95' "
              size="16"
              class="md-search-input__icon"
              slot="inputBefore"
            />
          </md-input>

          <md-button class="btn md-button-outline btn-manage" aria-label="x" :size="32" >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8821 8.33466C12.4914 7.84504 12.8853 7.1367 12.9798 6.36075C13.0742 5.5848 12.8617 4.80266 12.3875 4.1812C11.9134 3.55973 11.2152 3.14814 10.4419 3.03422C9.66853 2.9203 8.8813 3.11307 8.2481 3.57141C8.24875 3.54771 8.25515 3.52561 8.25515 3.50181C8.25634 3.08822 8.15489 2.68079 7.95991 2.31604C7.76493 1.95129 7.48249 1.64061 7.13792 1.41185C6.79335 1.18309 6.3974 1.04339 5.98557 1.00527C5.57373 0.967151 5.15887 1.03181 4.77817 1.19344C4.39746 1.35507 4.0628 1.60863 3.80418 1.9314C3.54557 2.25417 3.37107 2.63605 3.29632 3.04284C3.22158 3.44963 3.24893 3.8686 3.37592 4.26222C3.50291 4.65584 3.72557 5.0118 4.02395 5.29821C3.17038 5.56398 2.42068 6.08879 1.87882 6.79985C1.33697 7.51091 1.02983 8.37297 1 9.26646C1 9.83091 1.285 10.6175 2.6436 11.1576C3.42967 11.4448 4.25553 11.6084 5.09175 11.6426C5.03159 11.9199 5.00084 12.2029 5 12.4867C5 13.0751 5.29885 13.8954 6.7212 14.4613C7.77184 14.8388 8.88258 15.0214 9.9988 15C12.4876 15 14.9983 14.2231 14.9983 12.4868C14.9683 11.5584 14.6531 10.6618 14.0955 9.91887C13.538 9.17597 12.7651 8.62282 11.8821 8.33466ZM9.9993 4.00231C10.5251 4.00882 11.0272 4.22216 11.3969 4.59614C11.7666 4.97012 11.9741 5.47465 11.9745 6.00051C11.975 6.52637 11.7683 7.03124 11.3992 7.40583C11.0302 7.78042 10.5284 7.99459 10.0026 8.00196H9.99595C9.47014 7.99458 8.9684 7.78041 8.59933 7.40581C8.23027 7.03122 8.02359 6.52634 8.02403 6.00048C8.02447 5.47463 8.232 4.9701 8.60169 4.59612C8.97138 4.22214 9.47348 4.00881 9.9993 4.00231ZM5.755 2.00181C6.05167 2.00181 6.34168 2.08979 6.58836 2.25461C6.83503 2.41943 7.02729 2.6537 7.14082 2.92779C7.25435 3.20188 7.28406 3.50348 7.22618 3.79445C7.1683 4.08542 7.02544 4.35269 6.81566 4.56247C6.60588 4.77225 6.33861 4.91511 6.04764 4.97299C5.75666 5.03087 5.45506 5.00116 5.18097 4.88763C4.90689 4.7741 4.67262 4.58184 4.5078 4.33517C4.34297 4.08849 4.255 3.79848 4.255 3.50181C4.25544 3.10412 4.41361 2.72284 4.69482 2.44163C4.97603 2.16042 5.35731 2.00225 5.755 2.00181ZM5.43625 10.6624C3.515 10.6023 2 9.99996 2 9.26646C2 7.46646 3.68265 6.00231 5.751 6.00231C6.17778 6.00272 6.60203 6.06781 7.0093 6.19536C7.03567 6.60918 7.14772 7.01302 7.33834 7.38127C7.52896 7.74952 7.79399 8.07416 8.11665 8.33461C6.95963 8.74129 6.00099 9.57372 5.43625 10.6624ZM9.9988 14C7.7566 14 6 13.3353 6 12.4867C6 10.5653 7.79395 9.00166 9.99955 9.00166C12.2051 9.00166 13.9986 10.5651 13.9986 12.4867C13.9983 13.3353 12.2415 14 9.9988 14Z" fill="white" fill-opacity="0.95"/>
            </svg>
            <span class="label">Manage</span>
          </md-button>
        </div>
        <wl-scrollbar 
          class="scrollpane" 
          :alwaysVisible="false"
          :arrowVisible="$store.state.os==='win'"
          :theme="theme === 'dark' ? 'dark' : 'light'"
        >
          <div class="scrollcontent" ref="scrollcontent">
            <wl-accordion 
              :showBottomBorder="false" 
              :defaultCollapsed="false" 
              iconLocation="before" 
              arrowCollapsed="arrow-right-bold"
              arrowExpanded="arrow-down-bold"
              class="accordion"
              headerClass="accordion-header"
            >
              <span slot="header" class="accordion-title" >
                <span class="name" >Moderators ({{moderators.length}})</span>
              </span>

              <space-people-item
                v-for="(p, idx) in moderators"
                :key="`pp${idx}`"
                :id="`pid-${idx}`"
                class="pitem"
                itemtype="people"
                :name="p"
                :avatar="$store.getters.people(p).avatar"
                :avatarSize="32"
                :isgroup="true"
                :singleLine="true"
                :status="$store.getters.people(p).status"
                :subline="$store.getters.people(p).statusTxt"
                :active="`itm1-${p}` === activePeopleId"
                :compact="true"
                :showHoverStyle="true"
                color="#FFFFFF"
                :style="{width: `${maxWidth}px`}"
                @select="selectPeople(`itm1-${p}`)"
              >
                <div v-if="p !== me.name" slot="buttons" class="btns">
                  <md-button class="btnr md-button-outline-red btn2" aria-label="x" :size="28" >
                    Remove
                  </md-button>
                </div>
              </space-people-item>

            </wl-accordion>

            <wl-accordion 
              :showBottomBorder="false" 
              :defaultCollapsed="false" 
              iconLocation="before" 
              arrowCollapsed="arrow-right-bold"
              arrowExpanded="arrow-down-bold"
              class="accordion"
              headerClass="accordion-header"
            >
              <span slot="header" class="accordion-title" >
                <span class="name" >Members ({{peopleList.length}})</span>
              </span>

              <space-people-item
                v-for="(p, idx) in peopleList"
                :key="`pp${idx}`"
                :id="`pid-${idx}`"
                class="pitem"
  
                itemtype="people"
                :name="p.name"
                :avatar="p.avatar"
                :avatarSize="32"
                :isgroup="true"
                :singleLine="true"
                :status="p.status"
                :subline="p.statusTxt"
                :active="`itm2-${p.name}` === activePeopleId"
                :compact="true"
                :showHoverStyle="true"
                color="#FFFFFF"
                :style="{width: `${maxWidth}px`}"
                @select="selectPeople(`itm2-${p.name}`)"
              >
                <div slot="buttons" class="btns">
                  <md-button class="btnr md-button-outline btn1" aria-label="x" :size="28" >
                    Make a moderator
                  </md-button>
                  <md-button class="btnr md-button-outline-red btn2" aria-label="x" :size="28" >
                    Remove
                  </md-button>
                </div>
              </space-people-item>
            </wl-accordion>
          </div>
          
        </wl-scrollbar >
      </div>

    </div>

  </fragment>
</template>

<script>

export default {
    props:[
        'name',
    ],
    data() {
        return {
          selectedTab: 'about',
          transEnabled: false,
          createTeamVisible: false,
          activePeopleId: '',
          maxWidth: '',
          moderators: [],
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
      activeTeamItem() {
        return this.$store.state.activeTeamItem;
      },
      peopleList() {
        return this.$store.state.peopleList.filter((p) => {return !p.isroom});
      },
      me() {
        return this.$store.getters.me;
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
    mounted(){
      this.moderators = [
          this.me.name,
          'David Liam',
          'Adrian Delamico',
          'Giacomo Edwards',
        ];
      this.$eventBus.$on('teams-resizing', this.setLayout);
      
    },
    destroyed() {
      this.$eventBus.$off('teams-resizing', this.setLayout);
    },
    watch: {

    },
    methods:{
      showCreatePage() {
        this.createTeamVisible = true;
      },
      tabchange(name) {
        this.selectedTab = name;

        requestAnimationFrame(() => {
          this.setLayout();
        })
      },
      selectPeople(name) {
        this.activePeopleId = name;
      },
      setLayout() {
        const rect = this.$refs.scrollcontent.getBoundingClientRect()
        this.maxWidth = Math.floor(rect.width);
      },

    }
}
</script>


<style lang="scss">


.teams-defaultpage {
  @include flex(row, center, flex-start);
  width: 100%;
  height: 100%;
  padding: 16% 0 20% 10px;
  border-radius: 12px 0 0px 0px;

  .img {
    width: 173px;
    height: 125px;
    margin-right: 32px;
    margin-top: 24px;
  }
  .right {
    max-width: 404px;

    .title {
      font-size: 26px;
      line-height: 36px;
      opacity: .95;
    }
    .des {
      font-size: 14px;
      line-height: 22px;
      opacity: .95;
      margin-bottom: 20px;
    }
    .btn-add {
      padding: 0 12px;
      .label {
        font-size: 16px;
        margin-left: 6px;
        font-weight: normal;
      }
    }
  }

  .createpage {
    display: flex;
    flex-direction: column;

    .input {
      margin-bottom: 12px;
      
      .md-input {
        width: 404px;
        height: 32px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: normal;
        padding-left: 10px;
        color: rgba($color: white, $alpha: 0.95) !important;
        background-color: transparent !important;
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

    .textarea {
      height: 108px;
      .md-input {
        height: 108px;
        resize: none;
      }
    }

    .search {
      .md-input {
        padding-left: 30px;
      }
    }

    .btns {
      @include flex(row, flex-end);
      margin-top: 12px;

      .btn {
        margin-left: 8px;
      }
    }
  }
  
}


.teams-detailpage {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 12px 0 0px 0px;

  .bg {
    position: absolute;
    width: 780px;
    height: 318px;
  }

  .about {
    @include flex(row, flex-start, flex-start);
    
    .left {
      @include flex(column, flex-start, flex-start);
      width: 50%;
      padding: 48px 0 0 40px;

      .info {
        font-size: 16px;
        line-height: 24px;
        opacity: .95;
        margin-bottom: 32px;
      }

      .btn {
        padding: 0 12px;
        .label {
          font-size: 16px;
          margin-left: 6px;
          font-weight: normal;
        }
      }

    }
    .right {
      @include flex(column, flex-start, flex-start);
      width: 50%;
      padding: 48px 0 0 40px;

      .moderator {
        @include flex;
        margin-bottom: 18px;

        .avatar {
          width: 72px;
          height: 72px;
        }
        .info {
          @include flex(column, flex-start, flex-start);
          flex-grow: 1;
          margin-left: 12px;

          .ro1 {
            font-size: 20px;
            line-height: 30px;
            opacity: .95;
          }
          .ro2 {
            font-size: 14px;
            line-height: 22px;
            opacity: .95;
          }
          .ro3 {
            font-size: 14px;
            line-height: 22px;
            opacity: .7;
          }
        }
      }

      .btn {
        padding: 0 12px;
        .label {
          font-size: 16px;
          margin-left: 6px;
          font-weight: normal;
        }
      }

    }
  }
  .member {
    @include flex(column, flex-start, flex-start);
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;

    .top {
      @include flex(row, flex-start, flex-start);
      margin-top: 12px;
      margin-left: 16px;

      .input {
        margin-bottom: 12px;
        margin-bottom: 4px;
        
        .md-input {
          width: 320px;
          max-width: 320px;
          height: 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: normal;
          padding-top: 1px;
          padding-left: 30px;
          color: rgba($color: white, $alpha: 0.95) !important;
          background-color: #000000 !important;
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

      .btn-manage {
        padding: 0 12px;
        margin-left: 8px;

        .label {
          font-size: 16px;
          margin-left: 6px;
          font-weight: normal;
        }
      }
    }

    .scrollpane {
      @include flex(column, flex-start, flex-start);
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      height: 100px;
      width: 100%;
      padding-left: 16px;

      .wl-scrollbar__area {
        width: 100%;
      }

      .scrollcontent {
        @include flex(column, flex-start, flex-start);
        flex-grow: 1;
        width: calc(100% - 20px);
        overflow: hidden;

        .accordion {
          width: 100%;

          .accordion-header {
            height: 32px;
            margin-left: 14px;

            .accordion-title {
              font-size: 14px;
              opacity: .95;
            }
          }
        }

        .pitem {
          width: 100%;
          margin-bottom: 2px;
          overflow: hidden;

          .mid {
            flex-shrink: 1;
            .row1 {
              min-width: 200px;
              .divd {
                display: none;
              }
            }
            .row2 {
              flex-shrink: 1;
            }
          }

          .right {
            .btns {
              @include flex(row, flex-end);
              min-width: 240px;
              .btnr {
                margin-left: 8px;
                padding: 0 10px;
                font-weight: normal;
              }
            }
          }

          &:hover {
            .right {
              &.buttons {
                display: none;
              }
            }
          }
          &.active:hover {
            .right {
              &.buttons {
                display: flex;
              }
            }
          }
        }
      }

    }
  }
}

</style>
