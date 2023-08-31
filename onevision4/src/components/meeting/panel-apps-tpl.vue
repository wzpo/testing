<template>
  <div
    id="panel-apps-tpl"
    :class="[theme]"
  >   
    <div class="head" >
      <div class="lft" >
        <div class="icobtn" @click="funcBack" >
          <wl-icon
            name="arrow-left-bold"
            size="16"
          />
        </div>
        <div class="name">
          
          <div class="icon" :class="iconImage">
            <svg v-if="!iconImage" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="8" fill="white" fill-opacity="0.11"/>
              <path d="M11.68 5.13261L8.24375 3.67389C8.16716 3.64221 8.08507 3.62593 8.00218 3.62598C7.91929 3.62602 7.83722 3.6424 7.76066 3.67417L4.32219 5.13202C4.20815 5.17929 4.11071 5.25936 4.04223 5.36207C3.97374 5.46478 3.93729 5.58551 3.9375 5.70896V10.2922C3.93719 10.4153 3.97338 10.5358 4.0415 10.6383C4.10961 10.7409 4.20659 10.8209 4.32019 10.8684L7.76288 12.3273C7.8389 12.3589 7.92043 12.3751 8.00275 12.375C8.08612 12.375 8.16867 12.3586 8.24569 12.3267L11.6783 10.8687C11.7922 10.8214 11.8896 10.7413 11.958 10.6387C12.0264 10.536 12.0627 10.4153 12.0625 10.2919V5.70864C12.0628 5.58557 12.0267 5.46515 11.9586 5.36262C11.8905 5.26009 11.7935 5.18005 11.68 5.13261ZM8.00094 4.24974L10.939 5.49699L7.99375 6.72442L5.05725 5.49902L8.00094 4.24974ZM4.56425 5.97055L7.6875 7.27389V11.6166L4.5625 10.2922L4.56425 5.97055ZM11.4352 10.2928L8.3125 11.6204V7.26861L11.4375 5.96624V10.2919L11.4352 10.2928Z" fill="white"/>
            </svg>
          </div>
          <span class="lb">{{title}}</span>
        </div>
      </div>

      <div class="rgt" >
        <div class="icobtn">
          <wl-icon
            name="refresh-bold"
            size="16"
          />
        </div>
        <div class="icobtn" @click="funcPopout" >
          <wl-icon
            name="pop-out-bold"
            size="16"
          />
        </div>
        <div class="icobtn" @click="close" >
          <wl-icon
            name="cancel-bold"
            size="16"
          />
        </div>
      </div>

    </div>

    <div class="appcontent" >
      <slot></slot>
    </div>

    <div v-if="bottomVisible" class="bot" >
      <div class="btn" @click="bottomButtonFunc" >
        <wl-icon
          name="application-bold"
          size="16"
        />
        <span class="lb">{{ bottomButtonLabel }}</span>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: 'App Name',
    },
    iconImage: {
      type: String,
    },
    funcBack: {
      type: Function,
    },
    bottomVisible: {
      type: Boolean,
    },
    bottomButtonLabel: {
      type: String,
      default: 'Open together',
    },
    bottomButtonFunc: {
      type: Function,
    },
    funcPopout: {
      type: Function,
    },
  },

  data() {
    return {

    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    me() {
      return this.$store.getters.me;
    },
  },
  mounted() {
    
  },
  watch: {

  },
  methods: {

    close() {
      this.$store.commit("appsPanelVisible", false);
    },


  }
};
</script>


<style lang="scss">
#panel-apps-tpl {

  position: relative;
  @include flex(column, flex-start);
  flex-grow: 1;
  width: 100%;

  .head {
    @include flex(row, space-between);
    height: 48px;
    width: 100%;
    user-select: none;

    .icobtn {
      @include flex;
      width: 28px;
      height: 28px;
    }

    .name {
      @include flex(row, flex-start);

      .icon {
        width: 16px;
        height: 16px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }

      .lb {
        margin-left: 4px;
        font-weight: bold;
        font-size: 16px;
        opacity: .95;
      }
    }

    .lft {
      @include flex(row, flex-start);
      margin-left: 4px;

      .icobtn {
        margin-right: 4px;
      }
    }
    .rgt {
      @include flex(row, flex-end);
      margin-right: 4px;

    }
  }

  .appcontent {
    @include flex(column, flex-start, flex-start);
    width: 100%;
    flex-grow: 1;
  }

  .bot {
    @include flex;
    height: 44px;
    width: 100%;

    .btn {
      @include flex;
      height: 28px;
      border-radius: 14px;
      padding: 0 12px;
      user-select: none;

      &:hover {
        background: rgba($color: #FFF, $alpha: .07);
      }
      &:active {
        background: rgba($color: #FFF, $alpha: .2);
      }

      .lb {
        margin-left: 4px;
      }
    }
  }


  /* theme ----- dark/hybrid */
  &.hybrid {
    color: $text-color-primary-light-ui;
  }
  &.dark {
    color: $text-color-primary-dark-ui;
  }
}


</style>
