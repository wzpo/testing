<template>
    <div 
      :id="id"
      class='space-people-list-item' 
      :class="[{
        hoverbg: showHoverStyle,
        active, 
        people: itemtype==='people',
        compact: compact,
        singleline: singleLine,
        pill: pill,
      }]"
      :style="{
        height: height || '',
      }"
      @mouseover="hover" 
      @click="select"
    >
        <div 
          class='left'
          :style="{
            width: height || '',
            height: height || '',
          }"
        >
          <presence-avatar
            v-if="!$slots.icon"
            :title="avatarText ? avatarText : name"
            :src="avatar ? avatarPath + avatar : ''" 
            :type="isgroup ? 'group' : ''" 
            :color="color"
            :fontWeight="fontWeight"
            :backgroundColor="avatarBackgroundColor"
            :size="avatarSize ? avatarSize : (compact ? 24 : 32)"
            :presence="status" 
            :icon="icon" 
            :theme="theme === 'light' ? 'light' : 'dark'"
            class="avatar" 

            v-tooltip="{
                content: isPeople() ? contactCardTemplate : spaceCardTemplate, 
                html: true,
                placement: 'right',
                classes: `tooltip-for-contact-card ${theme} ${$store.state.themeColor}`,
                autoHide: false,
                delay: 200,
            }"
          >
            <wl-icon v-if="icon" slot="icon" :name="icon" size="12" />
          </presence-avatar>

          <div v-if="$slots.icon" class="icon" :class="{compact: compact || singleLine}" :style="{backgroundColor: avatarBackgroundColor}">
            <slot name="icon"></slot>
          </div>

        </div>

        <div class='mid' :class="{unread: unread}">
          <span class="row1">
            <highlight-text 
              class="txt" 
              :style="row1Style"
              :keyword="highlightRow1" 
              :sensitive="false" 
              :overWriteStyle="highlightStyle"
            >
              {{ name }}
            </highlight-text>
            <span v-if="(compact || singleLine) && subline" class="divd">
              <wl-icon name="dot-divider" size="4" />
            </span>
          </span>
          <span v-if="subline" class="row2" :style="row2Style" >
            
            <highlight-text 
              v-if="subline" 
              :keyword="highlightRow2" 
              :sensitive="false" 
              :overWriteStyle="highlightStyle"
              class="subline" 
              :style="{
                color: teamColor && teamColor[theme === 'light' ? 'light' : 'dark'],
              }"
            >
              {{ subline }}
            </highlight-text>
          </span>
        </div>

        <div v-if="!obtp && alertMuted" class="right alert-muted" >
          <wl-icon name="alert-muted-bold" size="14" class="" />
        </div>
        <div v-if="!obtp && mention" class="right mention" >
          <wl-icon name="mention" size="14" class="dot" />
        </div>
        <div v-if="!obtp && !alertMuted && !mention && unread" class="right unread" >
          <wl-icon name="unread-filled" size="14" class="dot" />
        </div>

        <div v-if="obtp" class="right obtp" >
          <span v-if="obtp.joined" class="joined">{{obtp.joined}}</span>
          <wl-icon v-if="obtp.joined" name="participant-list-bold" size="16" class="plist" />
          <md-button
            aria-label="button"
            color="green"
            size="28"
            class="btn-obtp"
            @click="callback('obtp')"
          >{{obtp.label || obtp.seconds}}</md-button>
        </div>

        <div v-if="buttons" class="right buttons">
          
          <div v-if="buttons.indexOf('message') > -1" class="btn btn-message" @click="callback('message')">
            <wl-icon name="chat-bold" size="16" />
          </div>
          <div v-if="buttons.indexOf('audiocall') > -1" class="btn btn-audiocall" @click="callback('audiocall')">
            <wl-icon name="handset-bold" size="16" />
          </div>
          <div v-if="buttons.indexOf('videocall') > -1" class="btn btn-videocall" @click="callback('videocall')" >
            <wl-icon name="camera-bold" size="16" />
          </div>
          <md-button
            v-if="buttons.indexOf('meet') > -1" 
            aria-label="button"
            color="green"
            size="28"
            class="btn-meet"
            @click="callback('meet')"
          >Meet</md-button>
        </div>

        <div v-if="$slots.buttons" class="right buttons">
          <slot name="buttons"></slot>
        </div>

    </div>
</template>

<script>

// import mframe from 'mframe'
export default {
    props:{
      id: {
        type: String,
      },
      type: {
        type: String,
      },
      itemtype: {
        type: String,
      },
      name: {
        type: String,
      },
      color: {
        type: String,
      },
      fontWeight: {
        type: [Number, String],
      },
      icon: {
        type: String,
      },
      subline: {
        type: String,
      },
      teamColor: {
        type: Object,
      },
      avatar: {
        type: String,
      },
      avatarText: {
        type: String,
      },
      avatarSize: {
        type: Number,
      },
      avatarBackgroundColor: {
        type: [String, Array],
        default: '#545454',
      },
      height: {
        type: [Number, String],
      },
      unread: {
        type: Boolean,
      },
      alertMuted: {
        type: Boolean,
      },
      mention: {
        type: Boolean,
      },
      isgroup: {
        type: Boolean,
      },
      active: {
        type: Boolean,
      },
      status: {
        type: String,
      },
      buttons: {
        type: Array,
      },
      buttonsCallback: {
        type: Object,
      },
      compact: {
        type: Boolean,
      },
      singleLine: {
        type: Boolean,
      },
      highlightRow1: {
        type: String,
        default: '',
      },
      highlightRow2: {
        type: String,
        default: '',
      },
      highlightStyle: {
        type: Object,
        default: () => {
          return {
            color: '#000000',
            fontWeight: 'bold',
            //background: '#FBAB18',
          }
        }
      },
      row1Style: {
        type: Object,
      },
      row2Style: {
        type: Object,
      },
      showHoverStyle: {
        type: Boolean,
      },
      pill: {
        type: Boolean,
        default: true,
      },
      obtp: {
        type: Object,
      },

    },
    data() {
      return {
      }
    },
    computed:{
      theme() {
        return this.$store.state.theme;
      },
      avatarPath(){
        return this.$store.state.avatarPath;
      },
      abbr(){
        let arr = this.name.split(' ');
        return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
      },
      contactCardTemplate() {
        return this.$store.getters.contactCardTemplate(this.name, false);
      },
      spaceCardTemplate() {
        let color
        if(this.teamColor) {
          color = this.teamColor[this.$store.state.theme === 'light' ? 'light' : 'dark']
        }
        return this.$store.getters.spaceCardTemplate(this.name, this.subline, color, this.avatarBackgroundColor[0]);
      },
    },
    mounted(){

    },
    watch: {

    },
    methods:{
      hover() {
        this.$emit('hover', {id: this.id})
      },
      select() {
        this.$emit('select', {id: this.id, name: this.name})
      },
      isPeople() {
        return this.$store.getters.people(this.name) ? true : false
      },
      callback(type) {
        if (this.buttonsCallback[type] && typeof this.buttonsCallback[type] === 'function' ) {
          this.buttonsCallback[type]();
        }
      },
    }
}
</script>


<style lang="scss">
.space-people-list-item {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    user-select: none;
    border-radius: 8px;

    &.pill {
      border-radius: 25px;
    }

    .left {
      width: 50px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      flex-grow: 0;
      margin-right: 5px;

      .icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.compact {
          width: 25px;
          height: 25px;
        }
      }

    }

    .mid {
      flex-grow: 1;
      overflow:hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 0;

      .row1 {
        display: flex;
        font-size: 16px;

        .txt {
          opacity: 0.7;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          pointer-events: none;
        }
      }

      .row2 {
        display: flex;
        font-size: 14px;
        margin-top: -5px;

        .subline {
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          pointer-events: none;
        }
      }

      &.unread {
        .row1 {
          .txt {
            font-weight: bold;
            opacity: 0.9;
          }
        }
      }

    }

    .right {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 12px;

      .dot {
        margin-left: 8px;
        path {
          fill: $md-blue-60;
        }
      }

      &.buttons {
        display: none;
        pointer-events: auto;
      }

      &.obtp {
        @include flex;
        pointer-events: auto;

        .joined {
          font-size: 14px;
          opacity: .95;
        }
        .plist {
          margin-left: 2px;
          margin-right: 8px;
          path {
            fill: rgba($color: #FFFFFF, $alpha: .95);
          }
        }
        .btn-obtp {
          font-size: 14px;
          padding: 0 10px;
          min-width: 0;
        }
      }

      .btn {
        @include flex;
        width: 28px;
        height: 28px;
        border-radius: 14px;
        margin-left: 8px;
        color: white;
      }

      .btn-message {
        background-color: $md-blue-60;
      }
      .btn-audiocall {
        background-color: $md-green-60;
      }
      .btn-videocall {
        background-color: $md-green-60;
      }
      .btn-meet {
        font-size: 12px;
        padding: 0 14px;
        min-width: 0;
      }
    }

    &.people {
      .mid {
        .row1 .txt{
          font-size: 15px;
          opacity: .9;
        }
        .row2 .subline{
          opacity: .7;
        }
      }
    }

    &:hover {
      
      &.hoverbg {
        background: rgba(255, 255, 255, 0.05);
      }

      .mid {
        .row1 {
          .txt {
            opacity: 0.9;
          }
        }
      }

      .right {
        &.buttons {
          display: flex;
        }
      }
    }
    
    &.active,
    &:active {
      background: rgba($color: black, $alpha: 0.1);

      .mid {
        .row1 {
          .txt {
            opacity: 0.9;
          }
        }
      }

      .right {
        &.buttons {
          display: flex;
        }
      }

    }

    &.compact,
    &.singleline {
      height: 32px;
      border-radius: 16px;

      .left {
        width: 32px;
        margin: 0 4px 0 0;
      }

      .mid {
        flex-grow: 1;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-right: 8px;
        font-size: 12px;

        .row1 {
          display: flex;

          .txt {
            opacity: 0.7;
          }
          .divd {
            @include flex;
            margin: 0 8px;
            path {
              fill: rgba(0, 0, 0, 0.4);
            }
          }
        }

        .row2 {
          display: flex;
          font-size: 12px;
          margin: 0;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          pointer-events: none;
        }

        &.unread {
          .row1 {
            .txt {
              font-weight: bold;
              opacity: 0.9;
            }
          }
        }

      }

      &:hover {

        .mid {
          .row1 {
            .txt {
              opacity: 0.9;
            }
          }
        }
      }
      
      &.active,
      &:active {

        .mid {
          .row1 {
            .txt {
              opacity: 0.9;
            }
          }
        }

      }

    }

    &.singleline {
      height: 40px;
      border-radius: 20px;

      .left {
        width: 32px;
        margin: 0 4px;
      }

      .mid {
        margin-left: 6px;
        .row1, .row2 {
          font-size: 14px;
        }
      }
    }
}

/* theme ----- dark/hybrid */
.dark, .hybrid {
  .space-people-list-item {

    .mid {
      .row1 {
        .divd {
          path {
            fill: rgba(255, 255, 255, 0.4);
          }
        }
      }
    }
    .right {
      .dot {
        path {
          fill: $md-blue-40;
        }
      }
    }

    &.active,
    &:active {
      background: rgba($color: white, $alpha: 0.1);
    }

  }
}
</style>
