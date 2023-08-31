<template>
    <div class='space-meetings'>
        <div class="top">
          <md-button class="btn md-button-outline btn-add" aria-label="x" :size="28" >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 7.5H8.5V3C8.5 2.86739 8.44732 2.74021 8.35355 2.64645C8.25979 2.55268 8.13261 2.5 8 2.5C7.86739 2.5 7.74021 2.55268 7.64645 2.64645C7.55268 2.74021 7.5 2.86739 7.5 3V7.5H3C2.86739 7.5 2.74021 7.55268 2.64645 7.64645C2.55268 7.74021 2.5 7.86739 2.5 8C2.5 8.13261 2.55268 8.25979 2.64645 8.35355C2.74021 8.44732 2.86739 8.5 3 8.5H7.5V13C7.5 13.1326 7.55268 13.2598 7.64645 13.3536C7.74021 13.4473 7.86739 13.5 8 13.5C8.13261 13.5 8.25979 13.4473 8.35355 13.3536C8.44732 13.2598 8.5 13.1326 8.5 13V8.5H13C13.1326 8.5 13.2598 8.44732 13.3536 8.35355C13.4473 8.25979 13.5 8.13261 13.5 8C13.5 7.86739 13.4473 7.74021 13.3536 7.64645C13.2598 7.55268 13.1326 7.5 13 7.5Z" fill="white" fill-opacity="0.95"/>
            </svg>
            <span class="label">Schedule a meeting</span>
          </md-button>

        </div>

        <wl-scrollbar 
          ref="scrollbar" 
          class='cont-wrap' 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
        >

          <div class="scrollcont">
            <div class="cont-area cont-meetings" >
              <div 
                v-for="(itm, idx) in meetings"
                :key="`contitm4${idx}`"
                class="itm-meeting" 
              >
                <span class="left">
                  <div class="date">{{itm.date}}</div>
                  <div class="time">{{itm.time}}</div>
                </span>
                <span class="mid">
                  <span class="lb">{{itm.title}}</span>
                  <span class="icos">
                    <wl-icon 
                      v-for="(i, idx) in itm.icons"
                      :key="`meeting-ico${idx}`"
                      :name="i"
                      size="12"
                      class="ico"
                    />
                  </span>
                </span>
                <span class="right">
                  <presence-avatar
                    :title="people(itm.host).name"
                    :src="$store.state.avatarPath + people(itm.host).avatar" 
                    type="group" 
                    :color="'white'"
                    :fontWeight="600"
                    :size="32"
                    :presence="people(itm.host).status" 
                    :theme="theme === 'light' ? 'light' : 'dark'"
                    class="avatar" 

                    v-tooltip="{
                        content: $store.getters.contactCardTemplate(people(itm.host).name, false), 
                        html: true,
                        placement: 'left',
                        classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                        autoHide: false,
                        delay: 200,
                    }"
                  />
                  
                </span>
              </div>
            </div>

            <div class="empty" v-if="meetings === undefined">
              <div class="img"></div>
              <div class="title"> </div>
              <div class="des"> </div>
            </div>

          </div>
          

        </wl-scrollbar>

    </div>
</template>

<script>

export default {
    props:[
        'meetings',
    ],
    data() {
        return {
        }
    },
    computed:{
      theme() {
        return this.$store.state.theme;
      },
    },
    mounted(){
      this.$eventBus.$on('teams-resizing', this.setContentWidth);
      this.setContentWidth();

    },
    destroyed() {
      this.$eventBus.$off('teams-resizing', this.setContentWidth);
    },
    watch: {

    },
    methods:{
      people(name) {
        return this.$store.getters.people(name);
      },

      setContentWidth() {
        /*
        const itemwidth = 194 + 8 * 2;
        if (document.querySelector(`.cont-area`)) {
          if (this.activeTabId === 0 || this.activeTabId === 1) {
            const rect = document.querySelector(`.space-meetings`).getBoundingClientRect();
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
.space-meetings {
  width: 100%;
  height: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  user-select: none;
  box-sizing: border-box;
  flex-grow: 1;

  .top {
    position: relative;
    height: 28px;
    display: flex;
    margin-left: 24px;
    margin-bottom: 16px;

    .btn-add {
      padding: 0 10px;
      .label {
        font-size: 14px;
        margin-left: 4px;
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
    margin: 0 0 4px 0;

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


  .cont-meetings {
    display: flex;
    width: 100%;
    flex-direction: column;
    margin-bottom: 16px;

    .itm-meeting {
      display: flex;
      align-items: center;
      min-height: 48px;
      margin-bottom: 4px;
      border-radius: 8px;
      transition: all .2s ease;
      background: rgba($color: #000000, $alpha: .11);

      .left {
        @include flex(column, flex-start, flex-start);
        width: 120px;
        font-size: 14px;
        line-height: 22px;
        margin-left: 12px;
        margin-right: 24px;

        .time {
          opacity: .7;
        }

      }
      .mid {
        @include flex(row, flex-start);
        flex-grow: 1;

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
          margin-right: 12px;
        }
        .icos{
          @include flex(row, flex-start);

          .ico {
            margin-right: 8px;
          }
        }
      }
      .right {
        display: flex;
        margin-right: 12px;
        .avatar {
          pointer-events: auto;
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
  .space-meetings {

    .cont-meetings {
      .itm-meeting {
        background: rgba($color: #FFFFFF, $alpha: .11);

        &:hover {
          background: rgba($color: #FFFFFF, $alpha: 0.2);
        }
      }
    }
  }
}

</style>
