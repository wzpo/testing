<template>
  <div v-if="visible" class="speaking-bubble">
    <div class="as_name">
      <md-avatar
        :src="avatar"
        :title="activeSpeaker"
        class="avatar"
      />
      <span class="lb2">{{ activeSpeaker }}</span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  props:{
    activeSpeaker: {
      default: '',
    },
  },
  data () {
    return {
      visible: false,
    }
  },
  mounted () {
    // this.randomChangeActiveSpeaker()
  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    fullscreen() {
      return this.$store.state.fullscreen;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    hidePeopleWithoutVideo() {
      return this.$store.state.hidePeopleWithoutVideo;
    },
    avatar() {
      const p = this.peopleList.find(people => people.name === this.activeSpeaker)
      if (p && p.avatar) {
        return this.$store.state.avatarPath+p.avatar;
      } else {
        return this.$store.state.avatarPath+_.random(1, 6)+'.svg';
      }
    },

  },
  watch: {
    activeSpeaker() {
      this.checkVisible()
    },
    hidePeopleWithoutVideo() {
      this.checkVisible()
    },
  },
  methods: {
    checkVisible() {
      const p = this.peopleList.find(people => people.name === this.activeSpeaker)
      if (this.hidePeopleWithoutVideo && p && !p.video) {
        this.visible = true
      } else {
        this.visible = false
      }
    },
    
  },
}
</script>

<style lang="scss" >
  .speaking-bubble {
    position: relative;
    flex-shrink: 0;
    max-width: 356px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    padding: 0 4px;
    border-radius: 14px;
    box-sizing: border-box;
    transition: all 0.2s ease-out;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 14px; 
        padding: 2px; 
        background: linear-gradient(to right, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude; 

        animation-name: glow-animation-before;
        animation-duration: 16s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        pointer-events: none;
    }

    &::after {
        opacity: .6;
        content: "";
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border-radius: 18px; 
        padding: 4px; 
        background: linear-gradient(to right, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude; 

        animation-name: glow-animation-after;
        animation-duration: 16s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        pointer-events: none;
    }

    @keyframes glow-animation-before {
        0% { 
            background: linear-gradient(0deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        5% { 
            background: linear-gradient(18deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        10% { 
            background: linear-gradient(36deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        15% {
            background: linear-gradient(54deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        20% { 
            background: linear-gradient(72deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        25% { 
            background: linear-gradient(90deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        30% { 
            background: linear-gradient(108deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        35% { 
            background: linear-gradient(126deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        40% { 
            background: linear-gradient(144deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        45% { 
            background: linear-gradient(162deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        50% { 
            background: linear-gradient(180deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        55% { 
            background: linear-gradient(198deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        60% {
            background: linear-gradient(216deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        65% { 
            background: linear-gradient(234deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        70% { 
            background: linear-gradient(252deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        75% { 
            background: linear-gradient(270deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        80% { 
            background: linear-gradient(288deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        85% { 
            background: linear-gradient(306deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        90% { 
            background: linear-gradient(324deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        95% {
            background: linear-gradient(342deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        100% { 
            background: linear-gradient(360deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
    }

    @keyframes glow-animation-after {
        0% { 
            opacity: .6;
            background: linear-gradient(0deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        5% { 
            opacity: .3;
            background: linear-gradient(18deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        10% { 
            opacity: .0;
            background: linear-gradient(36deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        15% {
            opacity: .3;
            background: linear-gradient(54deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        20% { 
            opacity: .6;
            background: linear-gradient(72deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        25% { 
            opacity: .3;
            background: linear-gradient(90deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        30% { 
            opacity: .0;
            background: linear-gradient(108deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        35% { 
            opacity: .3;
            background: linear-gradient(126deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        40% { 
            opacity: .6;
            background: linear-gradient(144deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        45% { 
            opacity: .3;
            background: linear-gradient(162deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        50% { 
            opacity: 0;
            background: linear-gradient(180deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        55% { 
            opacity: .3;
            background: linear-gradient(198deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        60% {
            opacity: .6; 
            background: linear-gradient(216deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        65% { 
            opacity: .3; 
            background: linear-gradient(234deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        70% { 
            opacity: .0; 
            background: linear-gradient(252deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        75% { 
            opacity: .3; 
            background: linear-gradient(270deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        80% { 
            opacity: .6; 
            background: linear-gradient(288deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        85% { 
            opacity: .3; 
            background: linear-gradient(306deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        90% { 
            opacity: .0; 
            background: linear-gradient(324deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        95% {
            opacity: .3; 
            background: linear-gradient(342deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
        100% { 
            opacity: .6; 
            background: linear-gradient(360deg, rgba($color: #30C9B0, $alpha: 1.0) 0%, rgba($color: #64B4FA, $alpha: 1.0) 50%, rgba($color: #30C9B0, $alpha: 1.0) 100%);
        }
    }

    .as_name {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      flex-grow: 1;

      .avatar {
        margin-right: 4px;
        width: 20px;
        height: 20px;
        font-size: 10px;
      }
      .lb2 {
        margin-right: 2px;
        font-weight: normal;
      }
    }
  }

</style>
