<template>
    <div 
      id="reaction-combo" 
      :class="[theme, fade_css]"
      v-show="!reactionStackVisible && reactionVisibleCount > 0"
    >
      <div 
        class="wrap" 
        :style="{bottom: '0px'}"
        @click="toggle" 
      >

        <div v-if="reactions.length > 0 && !reactionStackVisible" class="ico_reaction" :class="animations[reactionList[reactionList.length-1].animationName]">
          <div
            class="avatar"
            :style='{backgroundImage: avatarUrl}' >
              <span v-if="!avatar">{{ abbr }}</span>
          </div>
        </div>

        <div class="arr" v-tooltip="'Expand Reactions'" v-if="!reactionStackVisible && reactions.length > 0">
          <wl-icon
            v-if="reactionStackVisible"
            name="arrow-left-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="8"
            class="ico"
          />
          <wl-icon
            v-if="!reactionStackVisible"
            name="arrow-right-bold" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="8"
            class="ico"
          />
        </div>
        
      </div>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
  props: {
    meetingId: String,
  },
  data() {
    return {
      fade_css: '',
      reactions: [],
      itv: 0,
      animations: {
        'thumbs-up': 'reaction02',
        haha: 'reaction14',
        heart: 'reaction09',
        celebrate: 'reaction04',
        raise_hand: 'reaction01',
        sad: 'reaction11',
        smile: 'reaction10',
        surprised: 'reaction12',
      },
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    me() {
      return this.$store.getters.me;
    },
    avatar() {
      const name = this.reactionList[this.reactionList.length-1].attendeeName;
      const p = this.$store.getters.people(name);
      return p ? p.avatar : null;
    },
    avatarUrl(){
        if(this.avatar){
            return 'url('+this.$store.state.avatarPath+this.avatar+')';
        }else{
            return 'none';
        }
    },
    abbr(){
      const name = this.reactionList[this.reactionList.length-1].attendeeName;
      if (name) {
        let arr = name.split(' ');
        return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
      } else {
        return '';
      }
    },
    reactionList() {
      return this.$store.state.reactionList;
    },
    reactionVisibleCount() {
      return this.$store.state.reactionVisibleCount;
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId);
    },
    selfSharingScreen() {
      return this.$store.state.selfSharingScreen;
    },
    reactionStackVisible() {
      return this.$store.state.reactionStackVisible;
    },

  },
  mounted() {
    //this.countNum();
    //setInterval(() => {
      //this.countNum();
    //}, _.random(1000, 3000));
  },
  destroyed() {
    
  },
  watch: {
    reactionList(newVal) {
      if (newVal !== null && newVal.length > 0) {
        const reaction = newVal[newVal.length - 1];
        let exist = false;
        for (let i=0; i<this.reactions.length; i++) {
          const re = this.reactions[i];
          if (re.animationName === reaction.animationName) {
            exist = true;
          }
        }

        if (!exist) {
          reaction.number = _.random(3, 5);
          this.reactions.unshift(reaction);

          if (this.reactions.length > 3) {
            // this.reactions.shift();
          }
        }

        this.countNum();

        clearTimeout(this.itv);
        this.itv = setTimeout(() => {
          this.fade();
        }, 30000);

      }

    },
  },
  methods: {
    countNum() {
      if (this.reactions.length > 0) {
        for (let i=0; i<this.reactions.length; i++) {
          const re = this.reactions[i];
          const rand = _.random(0, 1);
          const n = rand === 1 ? _.random(1, 5) : 0;
          const nn = re.number > 18 ? 3 : re.number;
          this.reactions[i].number = nn + n;
        }

        this.$forceUpdate();
      }
      
    },

    hide() {
      this.fade_css = 'slide-out';
      this.$store.commit('reactionStackVisible', false);
      // this.reactions = [];
    },
    show() {
      this.fade_css = 'slide-in';
      this.$store.commit('reactionStackVisible', true);
    },

    toggle() {
      if (this.reactionStackVisible) {
        this.hide()
      } else {
        this.show()
      }
    },

    

  }
};
</script>

<style lang="scss">
#reaction-combo {
  transition: all 0.3s;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;

  .wrap {
    display: flex;
    position: absolute;
    left: -7px;
    bottom: 10px;
    height: 28px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;

    .itm {
      transition: all 0.3s;
    }

    .arr {
      width: 20px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      pointer-events: auto;
      opacity: 0;

      .ico {
        margin-right: 2px;
      }

    }

    &:hover {
      background-color: rgba($color: #FFFFFF, $alpha: 0.5);
      .arr {
        opacity: 1;
      }
    }
  }

  .ico_reaction {
    margin-top: -8px;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    margin-left: 15px;
    margin-right: 8px;
  }

  &.fade-in {
    opacity: 1;
  }
  &.fade-out {
    opacity: 0;
  }

  .avatar{
    position: absolute;
    width: 16px;
    height: 16px;
    right: 22px;
    bottom: 0;
    border-radius: 50%;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #FFF;
    background-color: #EEE;
  }
  .avatar span{
    font-size: 7px;
    color: #33AC96;
    margin-left: 2px;
    margin-top: 1px;
  }

  /* ------------------ drak/hybrid ------------------ */

  &.dark,
  &.hybrid {
    .wrap {
      &:hover {
        background-color: rgba($color: #292929, $alpha: 0.6);
      }
    }

    .avatar{
      border: 1px solid $md-gray-90;
      background-color: $md-gray-80;
    }

  }

}

</style>
