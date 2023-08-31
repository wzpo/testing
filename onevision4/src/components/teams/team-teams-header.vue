<template>
    <div 
      class='team-teams-header' 
      :class="[theme]"
    >
        
        <div 
          class="ava"
        >
          <div class="txt">
            {{team.name.substr(0, 1).toUpperCase()}}
          </div>
        </div>
        <span class="row1" >

          <div class="toplev" >
            <div class="title">
              <span class="name">{{ team.name }}</span>
            </div>
            
          </div>

        </span>

        <span class="row2">
          <div class="tabs team-teams-header-tabs" @mouseleave="leaveTab">
            <div class="team-teams-header-tab-active-bg"></div>
            <div class="tab team-teams-header-tab0" :class="{active: activeTabId === 0}" @mouseover="hoverTab(0)" @click="selectTab(0, 'about')" >
              About
            </div>
            <div class="tab team-teams-header-tab1" :class="{active: activeTabId === 1}" @mouseover="hoverTab(1)" @click="selectTab(1, 'member')" >
              Members ({{$store.state.peopleList.filter((p) => {return !p.isroom}).length}})
            </div>

          </div>
          <div class="icons">
            
            <div class="btn-circle">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7322 2.26782C13.4888 2.02433 13.1999 1.83116 12.8819 1.69938C12.5638 1.56759 12.2229 1.49976 11.8787 1.49976C11.5344 1.49976 11.1935 1.56759 10.8755 1.69938C10.5575 1.83116 10.2685 2.02433 10.0252 2.26782L1.79297 10.5002C1.69981 10.5929 1.62594 10.703 1.57565 10.8244C1.52536 10.9458 1.49965 11.0759 1.5 11.2073V13.5002C1.50031 13.7654 1.60576 14.0195 1.79323 14.207C1.9807 14.3945 2.23488 14.4999 2.5 14.5002H4.79275C4.92416 14.5006 5.05434 14.4749 5.17574 14.4246C5.29715 14.3743 5.40737 14.3005 5.50002 14.2073L13.7322 5.97485C14.2229 5.48282 14.4985 4.81626 14.4985 4.12134C14.4985 3.42642 14.2229 2.75986 13.7322 2.26782ZM13.0252 5.26782L4.79297 13.5002H2.50002V11.2073L10.7322 2.97485C11.0363 2.67112 11.4486 2.50059 11.8785 2.50073C12.3083 2.50088 12.7205 2.67169 13.0244 2.97562C13.3283 3.27956 13.4991 3.69174 13.4993 4.12156C13.4994 4.55139 13.3289 4.96369 13.0252 5.26782Z" fill="white" fill-opacity="0.95"/>
              </svg>

            </div>
            <div class="btn-circle">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5157 4.00305H3.5045C3.10681 4.00349 2.72553 4.16166 2.44432 4.44287C2.16311 4.72408 2.00494 5.10536 2.0045 5.50305V11.4994C2.00528 12.1622 2.26892 12.7976 2.7376 13.2663C3.20627 13.735 3.8417 13.9986 4.5045 13.9994H11.5157C12.1786 13.9986 12.814 13.735 13.2827 13.2663C13.7513 12.7976 14.015 12.1622 14.0157 11.4994V5.50305C14.0153 5.10536 13.8571 4.72408 13.5759 4.44287C13.2947 4.16166 12.9134 4.00349 12.5157 4.00305ZM13.0157 11.4994C13.0153 11.8971 12.8571 12.2784 12.5759 12.5596C12.2947 12.8408 11.9134 12.999 11.5157 12.9994H4.5045C4.10681 12.999 3.72553 12.8408 3.44432 12.5596C3.16311 12.2784 3.00494 11.8971 3.0045 11.4994V5.50305C3.00463 5.37048 3.05735 5.24338 3.15109 5.14964C3.24483 5.0559 3.37193 5.00318 3.5045 5.00305H12.5157C12.6483 5.00318 12.7754 5.0559 12.8692 5.14964C12.9629 5.24338 13.0156 5.37048 13.0157 5.50305V11.4994Z" fill="white" fill-opacity="0.95"/>
              <path d="M2.5 3.0011H13.5C13.6326 3.0011 13.7598 2.94842 13.8536 2.85465C13.9473 2.76088 14 2.63371 14 2.5011C14 2.36849 13.9473 2.24131 13.8536 2.14755C13.7598 2.05378 13.6326 2.0011 13.5 2.0011H2.5C2.36739 2.0011 2.24021 2.05378 2.14645 2.14755C2.05268 2.24131 2 2.36849 2 2.5011C2 2.63371 2.05268 2.76088 2.14645 2.85465C2.24021 2.94842 2.36739 3.0011 2.5 3.0011Z" fill="white" fill-opacity="0.95"/>
              <path d="M10.5 5.99995H5.5C5.36739 5.99995 5.24021 6.05263 5.14645 6.1464C5.05268 6.24016 5 6.36734 5 6.49995C4.99596 6.87437 5.08387 7.24406 5.256 7.57659C5.42814 7.90912 5.67925 8.19433 5.9873 8.4072C6.57805 8.80518 7.27708 9.01147 7.98925 8.998C9.48545 8.9979 11 8.13995 11 6.49995C11 6.36734 10.9473 6.24016 10.8536 6.1464C10.7598 6.05263 10.6326 5.99995 10.5 5.99995ZM7.98925 7.998C7.48529 8.00929 6.98968 7.86804 6.5674 7.59275C6.35294 7.44679 6.1866 7.24049 6.08945 6.99995H9.90585C9.629 7.68225 8.7842 7.998 7.98925 7.998Z" fill="white" fill-opacity="0.95"/>
              </svg>

            </div>
            <md-button
                aria-label="button"
                color="green"
                size="28"
                class="btn-leave md-button--red"
              >Leave team</md-button>

          </div>
        </span>

    </div>
</template>

<script>

export default {
    props:{
      team: Object,
      tab: {
        default: 'about',
      },
    },
    data() {
        return {
          curtab: this.tab,
          activeTabId: 0,
        }
    },
    computed:{
      theme() {
        return this.$store.state.theme;
      },
    },
    mounted(){
      
    },
    watch: {
      team() {
        this.selectTab(0, 'about');
      },
    },
    methods:{
      hoverTab(id) {
        if (this.isdragging) {
          return;
        }
        this.moveTabBg(id);
      },
      leaveTab() {
        this.moveTabBg(this.activeTabId);
      },
      moveTabBg(id) {
        const rect = document.querySelector(`.team-teams-header-tab${id}`).getBoundingClientRect();
        const rect2 = document.querySelector(`.team-teams-header-tabs`).getBoundingClientRect();
        document.querySelector(`.team-teams-header-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
        document.querySelector(`.team-teams-header-tab-active-bg`).style.width = `${rect.width}px`;
      },
      selectTab(id, tab) {
        this.moveTabBg(id);
        this.activeTabId = id;
        this.curtab = tab;
        this.$emit('tabchange', tab);
      },

    }
}
</script>


<style lang="scss">
.team-teams-header {
  position: relative;
  width: 100%;
  height: 114px;
  display: flex;
  flex-direction: column;
  user-select: none;

  .ava {
    @include flex;
    position: absolute;
    width: 86px;
    height: 86px;
    top: 16px;
    left: 16px;
    border-radius: 12px;
    overflow: hidden;
    background: url(~@/assets/img/temp-space-display-avatars.png) no-repeat;
    background-size: cover;

    .txt {
      font-size: 48px;
      opacity: .95;
    }
  }

  .row1 {
    margin-left: 100px;
    margin-top: 40px;
    margin-bottom: 8px;
    position: relative;
    display: flex;
    align-items: center;

    .toplev {
      position: relative;
      flex-grow: 1;
      display: flex;
      align-items: center;
      margin-left: 16px;
      
      .title {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .name {
          height: 26px;
          display: flex;
          font-size: 20px;
          line-height: 22px;
        }
      }

    }

  }
  .row2 {
    margin-left: 100px;
    display: flex;
    align-items: center;
    height: 28px;
    
    .tabs {
      position: relative;
      display: flex;
      margin: 0 0 0 16px;
      user-select: none;
      flex-grow: 1;

      .team-teams-header-tab-active-bg {
        position: absolute;
        height: 28px;
        width: 64px;
        top: 0;
        left: 0;
        border-radius: 14px;
        transition: all 0.2s ease;
        background-color: rgba(255, 255, 255, 0.1);
        pointer-events: none;
      }

      .tab {
        height: 28px;
        border-radius: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        margin-right: 8px;
        pointer-events: auto;
        font-size: 14px;
        opacity: 0.7;

        &:hover {
          opacity: 0.9;
        }

        &.active {
          opacity: 0.9;
        }

      }
    }

    .icons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 16px;
      margin-bottom: 12px;
      flex-shrink: 0;

      .btn-circle {
        @include flex;
        width: 28px;
        height: 28px;
        box-sizing: border-box;
        border: 1px solid rgba($color: #FFFFFF, $alpha: .3);
        border-radius: 50%;
        margin-right: 8px;
        margin-top: 14px;
        align-self: flex-start;
      }

      .btn-leave {
        min-width: 44px;
        height: 28px;
        font-size: 14px;
        padding: 0 10px;
        margin-top: 14px;
        align-self: flex-start;
      }

      svg {
        path {
          fill: white;
          fill-opacity: .95;
        }
      }
    }
  }


  /* theme ----- light/hybrid */
  &.light, &.hybrid {
    color: $text-color-primary-light-ui;

    .row2 {
      .tabs {
        .team-teams-header-tab-active-bg {
          background-color: rgba($color: #000000, $alpha: .1)
        }
      }
      .icons {
        svg {
          path {
            fill: black;
          }
        }
      }
    }
  }

}

</style>
