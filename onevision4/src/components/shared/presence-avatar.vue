<template>
  <div class="presence-avatar">
    <md-avatar
      v-bind="$attrs" 
      v-on="$listeners"
      :size="$attrs.size"
      :class="[presence ? `presence-avatar-mask-${$attrs.size}` : '', presence && presenceAvatarIcons[presence].square ? 'square' : '']"
    >
      <wl-icon v-if="$attrs.icon" slot="icon" :name="$attrs.icon" :size="iconSize" />
    </md-avatar>

    <div
      v-if="bot"
      class="bot"
    >
      <img v-if="$attrs.title === 'Miro Bot'"  />
    </div>

    <div v-if="presence" class="presence" :class="`icon-${$attrs.size}`">
      <wl-icon
        :name="presenceAvatarIcons[presence].name"
        :size="presenceAvatarIconSize[$attrs.size]"
        :color="presenceAvatarIcons[presence].color[theme]"
      />
    </div>

  </div>
</template>

<script>
export default {
  name: 'presence-avatar',

  props: {
    presence: String,
    bot: String,
    theme: {
      type: String,
      default: 'light'
    },
    iconSize: {
      type: Number,
      default: 16,
    },
  },

  data() {
    return {

    }
  },

  computed: {
    presenceAvatarIcons() {
      return this.$store.state.presenceAvatarIcons;
    },
    presenceAvatarIconSize() {
      return this.$store.state.presenceAvatarIconSize;
    },

  },

  
};
</script>

<style lang="scss">
.presence-avatar {
  position: relative;
  display: flex;


  .bot {
    @include flex;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #fff;

    img {
      width: 18px;
      height: 18px;
      object-fit: contain;
    }
  }

  .presence {
    position: absolute;
    @include flex;

    &.icon-24 {
      width: 14px;
      height: 14px;
      bottom: -1px;
      right: -3px;
    }
    &.icon-32 {
      width: 16px;
      height: 16px;
      bottom: -2px;
      right: -4px;
    }
    &.icon-48 {
      width: 18px;
      height: 18px;
      bottom: -2px;
      right: -4px;
    }
    &.icon-64 {
      width: 20px;
      height: 20px;
      bottom: 1px;
      right: 2px;
    }
    &.icon-72 {
      width: 24px;
      height: 24px;
      bottom: -1px;
      right: 0px;
    }
    &.icon-88 {
      width: 32px;
      height: 32px;
      bottom: -5px;
      right: -4px;
    }
    &.icon-124 {
      width: 44px;
      height: 44px;
      bottom: -1px;
      right: 0px;
    }

    .botdeco {
      position: absolute;
      top: 1px;
      left: -3px;
    }
  }

}

</style>
