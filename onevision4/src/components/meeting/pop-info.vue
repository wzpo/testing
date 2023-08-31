<template>
    <div id="pop_info"
      :class="[os, theme]"
    >
      <div class="title">{{ meetingTitle }}</div>
      <div class="host">
        <div class="avatar" v-bind:style="{backgroundImage: avatarUrl}"></div>
        <span class="lb">Host:</span>
        <span class="name">{{ hostName }}</span>
      </div>

      <md-button class="btn md-button-outline btn-copy-info" aria-label="x" :size="28" >Copy meeting information</md-button>
      <div class="divider" ></div>

      <div class="tabs">
        <div class="tab" :class="{active: selectedTab === 0}" @click="selectedTab=0" >
          <span class="lb">General</span>
        </div>
        <div class="tab" :class="{active: selectedTab === 1}" @click="selectedTab=1" >
          <wl-icon 
            name="end-to-end-encryption" 
            color="blue-50"
            size="12"
            class="ico"
          />
          <span class="lb">Security</span>
        </div>
      </div>

      <span v-if="selectedTab === 0">
        <div class="sec">
          <h1>
            <span class="lb">Meeting link</span>
            <wl-icon 
              name="copy-bold" 
              :color=" theme === 'dark' ?  'white-95' : 'black-95' "
              size="16"
              class="ico"
            />
            <span class="spacer"></span>
          </h1>
          <p>https://go.webex.com/go/j.php?MTID=md2baae7e4b0f5be8496394427fae7cae</p>
        </div>

        <div class="sec">
          <h1><span class="lb">Meeting number</span></h1>
          <p>209 035 0635</p>
        </div>

        <div class="sec">
          <h1><span class="lb">Video address</span></h1>
          <p>US Toll +1-425-655-0000</p>
          <p class="text-link underline">Show all global call-in numbers</p>
        </div>

        <div class="sec">
          <h1><span class="lb">Access code</span></h1>
          <p>209 035 0635</p>
        </div>

        <div class="sec">
          <h1><span class="lb">Host key</span></h1>
          <p>938211</p>
        </div>
      </span>


      <span v-if="selectedTab === 1">
        <div class="sec">
          <div class="inline-alert">
            <wl-icon 
              name="info-circle-filled" 
              :color=" theme === 'dark' ?  'blue-40' : 'blue-60' "
              size="16"
              class="ico"
            />
            <div class="msg">
              You are securely connected to this meeting with strong end-to-end encryption. 
            </div>
          </div>
        </div>

        <div class="sec">
          <h1><span class="lb">Security code</span> <span class="text-link underline">Learn more</span></h1>
          <p class="code">KKH - 7CV- MGV - QTC - 37J</p>
        </div>

        <div class="sec">
          <h1><span class="lb">Server connection</span></h1>
          <p>TLS with ECDH and AES-256-GCM</p>
        </div>

        <div class="sec">
          <h1><span class="lb">Media connection</span></h1>
          <p>AES-256-GCM</p>
        </div>

        <div class="sec">
          <h1><span class="lb">This meeting allows phone audio connection. </span></h1>
        </div>

        <div class="sec">
          <h1><span class="lb">End-to-end encrypted connections</span> <span class="text-link underline">Learn more</span></h1>
          <p>Audio: No audio connection</p>
          <p>Video: Yes</p>
        </div>

      </span>

      

    </div>
</template>

<script>

export default {
  data() {
    return {
      selectedTab: 0, 
    };
  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    host() {
      let people = this.$store.getters.host;
      return people;
    },
    hostName() {
      return this.host.name;
    },
    meetingTitle() {
      return this.$store.state.meetingTitle;
    },
    avatarUrl() {
      if (this.host.avatar !== null) {
        return "url(" + this.$store.state.avatarPath + this.host.avatar + ")";
      } else {
        return "none";
      }
    }
  },
  mounted() {},
  watch: {

  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
#pop_info {
  width: 342px;
  pointer-events: auto;
  padding: 15px 0 5px 0;
  overflow: hidden;

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

  .title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;

    margin-left: 18px;
    margin-right: 18px;
  }

  .host {
    margin-top: 6px;
    margin-bottom: 14px;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-left: 18px;
    margin-right: 18px;

    .avatar {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #f5f5f6;
      margin-right: 8px;
    }

    .lb {
      opacity: .7;
      margin-right: 4px;
    }
  }

  .btn-copy-info {
    width: 175px;
    margin-bottom: 15px;

    margin-left: 18px;
  }

  .divider {
    border-bottom: 1px solid rgba($color: #000000, $alpha: .2);
  }

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

      .ico {
        margin-right: 8px;
      }

      .lb {
        font-size: 12px;
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

  .sec {
    font-size: 12px;
    margin-bottom: 12px;
    
    margin-left: 18px;
    margin-right: 18px;

    h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      
      .lb {
        opacity: .7;
      }
      .ico {
        margin-left: 6px;
      }
    }
    p {
      margin: 0;
      font-size: 16px;
      cursor: text;
      user-select: text;
      line-height: 24px;
      word-break: break-all;
      word-wrap: break-word;

      &.code {
        @include flex;
        width: 100%;
        height: 36px;
        border-radius: 4px;
        background: $md-gray-10;
        font-size: 16px;
        margin-top: 8px;
      }
    }
  }

  .inline-alert {
    display: flex;
    border-radius: 8px;
    padding: 5px 0 7px 12px;
    background: $md-blue-10;

    .ico {
      margin: 4px 8px 0 0;
      flex-shrink: 0;
    }

    .msg {
      font-size: 14px;
      line-height: 22px;
      color: $md-blue-60;
    }
  }

  .spacer {
    flex-grow: 1;
  }


  /* ------------------ hybrid / drak ------------------ */

  &.hybrid {
    color: $text-color-primary-light-ui;
  }

  &.dark {
    color: $text-color-primary-dark-ui;

    .divider {
      border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: .2);
    }

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

    .sec {

      p {

        &.code {
          background: $md-gray-90;
        }
      }
    }

    .inline-alert {
      background: $md-blue-90;
      .msg {
        color: $md-blue-40;
      }
    }
  }

}

</style>
