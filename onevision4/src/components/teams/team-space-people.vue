<template>
    <div class='space-people'>
        <wl-scrollbar 
          class='space-people-list' 
          :theme="theme === 'dark' ? 'dark' : 'light'" 
          :arrowVisible="$store.state.os==='win'"
        >
          
          <div class="scrollcontent-need-a-wrap">
            <md-button class="btn-add-people md-button-outline" aria-label="x" size="28" >
              <wl-icon name="plus-bold" size="16" class="icoplus"  />
              Add people
            </md-button>

            <div class="space-people-list-itms" @mouseleave="leaveItems">
              <div 
                class="space-people-list-itms-active-bg" 
                :class="{
                  trans: transEnabled,
                }"
              ></div>

              <space-people-item
                v-for="(p, idx) in peopleList"
                :key="`pp${idx}`"
                :id="`pid-${idx}`"
                itemtype="people"
                :name="p.name"
                :avatar="p.avatar"
                :isgroup="false"
                :singleLine="true"
                :status="p.status"
                :subline="p.statusTxt"
                :active="idx === activeId"
                color="#FFFFFF"
                @hover="hoverItem"
                @select="selectItem(idx)"
              />
            </div>
          </div>

        </wl-scrollbar>


        <div class="space-people-content" >
          <div class="empty" v-if="activeId === null">
            <div class="img"></div>
            <div class="title">Get to know the people you're working with</div>
            <div class="des">Choose someone from the list to learn more about them.</div>
          </div>

          <div v-if="activeId !== null" class="space-people-content-top" >
            <div class="space-people-content-top-banner" ></div>
            <div class="space-people-content-top-row1" >
              <presence-avatar
                :title="selectedPeople.name"
                :src="selectedPeople.avatar ? $store.state.avatarPath + selectedPeople.avatar : ''" 
                type="group" 
                color="#FFFFFF"
                :size="64"
                :fontWeight="600"
                :presence="selectedPeople.status" 
                :theme="theme === 'light' ? 'light' : 'dark'"
                class="avatar" 
              ></presence-avatar>

              <div class="space-people-content-top-row1-col2" >
                <div class="name">
                  {{selectedPeople.name}}
                </div>
                <div class="status">
                  Active
                  <wl-icon class="divd" name="dot-divider" size="4" />
                  Let's rock it!
                </div>
              </div>

              <div class="space-people-content-top-row1-col3">
                <div class="btn blue btn-message" @click="callback('message')">
                  <wl-icon name="chat-bold" size="16" />
                </div>
                <div class="btn green btn-audiocall" @click="callback('audiocall')">
                  <wl-icon name="handset-bold" size="16" />
                </div>
                <div class="btn green btn-videocall" @click="callback('videocall')" >
                  <wl-icon name="camera-bold" size="16" />
                </div>
              </div>

            </div>
            <div class="space-people-content-top-row2" >
              <md-button class="btn-edit-contact md-button-outline" aria-label="x" size="28" >
                Edit contact
              </md-button>
            </div>
            <div class="space-people-content-top-row3" >
              <div class="title" >Profile</div>
              <div class="btns" >
                <md-button class="btn-pip md-button-outline" aria-label="x" size="28" >
                  People Insights Profile
                </md-button>
              </div>
            </div>
          </div>

          <wl-scrollbar 
            v-if="activeId !== null"
            class="space-people-content-bot" 
            :theme="theme === 'dark' ? 'dark' : 'light'"
            :arrowVisible="$store.state.os==='win'"
          >
            <div class="profile">
              <div class="blk" style="width:100%">
                <div class="rw1">Title</div>
                <div class="rw2">Leader, User Experience Engineering</div>
              </div>
              <div class="blk" style="width:30%">
                <div class="rw1">Department</div>
                <div class="rw2">1800263788</div>
              </div>
              <div class="blk" style="width:30%">
                <div class="rw1">Manager</div>
                <div class="rw2">Leila Wayne</div>
              </div>
              <div class="blk" style="width:50%">
                <div class="rw1">Phone</div>
                <div class="rw2"><span class="mgr">Work:</span> <span class="hypertxt">+86 26376983</span></div>
                <div class="rw2"><span class="mgr">Mobile:</span> <span class="hypertxt">+86 26376983</span></div>
              </div>
              <div class="blk" style="width:50%">
                <div class="rw1">Email</div>
                <div class="rw2"><span class="hypertxt">{{selectedPeople.name.toLowerCase().replace(/ /g, '.') + '@cisco.com'}}</span></div>
              </div>
              <div class="blk" style="width:100%; margin-bottom: 100px;">
                <div class="rw1">Personal meeting room</div>
                <div class="rw2"><span class="hypertxt">isabrennan@cisco.webex.com</span></div>
              </div>

              
            </div>
          </wl-scrollbar>
        </div>

    </div>
</template>

<script>

export default {
    props: [
      'people',
    ],
    data() {
        return {
          activeId: null,
          selectedPeople: null,
          transEnabled: false,
        }
    },
    computed:{
      theme() {
        return this.$store.state.theme;
      },
      peopleList() {
        let lst = [this.$store.getters.me];
        lst = lst.concat(this.$store.getters.peopleList(this.people));
        return lst;
      },
    },
    mounted(){
      this.$eventBus.$on('teams-resizing', this.setContentHeight);
      this.setContentHeight();
    },
    destroyed() {
      this.$eventBus.$off('teams-resizing', this.setContentHeight);
    },
    watch: {

    },
    methods:{
      hoverItem(e) {
        this.moveItemBg(e.id);
      },
      leaveItems() {
        document.querySelector(`.space-people-list-itms-active-bg`).style.opacity = '0';
        this.transEnabled = false;
      },
      moveItemBg(id) {
        if (id === this.activeId) {
          this.leaveItems();
          return;
        }
        const rect = document.getElementById(id).getBoundingClientRect();
        const rect2 = document.querySelector(`.space-people-list-itms`).getBoundingClientRect();
        document.querySelector(`.space-people-list-itms-active-bg`).style.top = `calc(${rect.top - rect2.top}px)`;
        document.querySelector(`.space-people-list-itms-active-bg`).style.opacity = '1';
        
        if (!this.transEnabled) {
          requestAnimationFrame(() => {
            this.transEnabled = true;
          });
        }
      },
      selectItem(idx) {
        this.activeId = idx;
        this.selectedPeople = this.peopleList[idx];
        document.querySelector(`.space-people-list-itms-active-bg`).style.opacity = '0';
      },
      setContentHeight() {
        
      },
    }
}
</script>


<style lang="scss">
.space-people {
  width: 100%;
  height: 100px;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: row;
  user-select: none;
  box-sizing: border-box;
  padding: 0 0 0 6px;
  overflow: hidden;

  &-list {
    display: flex;
    flex-direction: column;
    width: 260px;
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
    padding-right: 4px;

    .btn-add-people {
      padding: 0 10px !important;
      margin-bottom: 15px;
      margin-left: 15px;

      .md-button__children {
        font-size: 12px;
      }

      .icoplus {
        margin-right: 4px;
      }
    }

    &-itms {
      position: relative;

      &-active-bg {
        position: absolute;
        height: 40px;
        width: 100%;
        top: 0;
        left: 0;
        border-radius: 20px;
        transition: opacity 0.2s ease;
        background-color: rgba($color: #000000, $alpha: 0.07);
        opacity: 0;
        pointer-events: none;

        &.trans {
          transition: all 0.2s ease;
        }
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 1;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;

    .empty{
      display: flex;
      flex-direction: column;
      margin-left: 60px;
      max-width: 360px;
      justify-content: center;
      height: 90%;
      max-width: 360px;

      .img {
        width: 112px;
        height: 120px;
        background: url(~@/assets/img/empty-state-space-people.svg) no-repeat;
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

    &-top {
      position: relative;
      width: 100%;
      margin-bottom: 24px;

      &-banner {
        position: absolute;
        border-top-left-radius: 12px;
        background: rgba(255, 255, 255, 0.07);
        width: 100%;
        height: 64px;
      }
      &-row1 {
        position: relative;
        @include flex(row, flex-start, flex-start);
        padding: 46px 16px 0 16px;

        &-col2 {
          flex-grow: 1;
          margin-left: 16px;
          margin-top: 22px;

          .name {
            font-size: 16px;
            font-weight: 600;
          }
          .status {
            display: flex;
            align-items: center;
            font-size: 14px;
            opacity: .7;
            margin-top: -4px;

            .divd {
              margin: 0 8px;
            }
          }
        }

        &-col3 {
          @include flex(row, flex-start, flex-start);
          margin-top: 4px;

          .btn {
            @include flex;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin-left: 8px;

            &.blue {
              background-color: $md-blue-60;
            }
            &.green {
              background-color: $md-green-60;
            }
          }

        }
      }

      &-row2 {
        @include flex(row, flex-end, flex-start);
        margin: 12px 16px 0 16px;

        .btn-edit-contact {
          padding: 0 8px !important;
          font-weight: normal !important;
        }
      }

      &-row3 {
        @include flex(column, flex-start, flex-start);
        margin: 8px 16px 0 16px;

        .title {
          width: 100%;
          font-size: 14px;
          opacity: .7;
          padding-left: 12px;
          padding-bottom: 2px;
          border-bottom: 1px solid rgba($color: #FFF, $alpha: .58);
        }
        .btns {
          margin-top: 14px;
        }
        .btn-pip {
          padding: 0 8px !important;
          font-weight: normal !important;
        }

      }

    }

    &-bot {
      display: flex;
      width: 100%;
      padding-left: 20px;

      .profile {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;

        .blk {
          @include flex(column, flex-start, flex-start);
          font-size: 14px;
          margin-bottom: 16px;

          .rw1 {
            opacity: .7;
          }
          .rw2 {
            opacity: .95;
          }
        }
      }

      .mgr {
        margin-right: 4px;
      }

      .hypertxt {
        color: $md-blue-40;
        text-decoration: underline;
      }
    }

  }

}

/* theme ----- dark/hybrid */

.dark {
  .space-people {
    &-list {

      &-itms {

        &-active-bg {
          background-color: rgba($color: #FFFFFF, $alpha: 0.07);
        }
      }
    }

  }
}

</style>
