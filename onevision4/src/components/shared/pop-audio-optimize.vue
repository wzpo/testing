<template>
  <div class="audio-optimize-dropdown" @mousedown="click">
    <div 
      v-for="(itm, idx) in optimizes"
      :key="idx"
      class="item" 
      :class="{active: idx === 0}" 
      @click="selectItem(itm)" 
    >
      <span class="ico" v-html="itm.svg"></span>
      <span class="lb">
        <span class="t1">{{itm.title}}</span>
        <span class="t2">{{itm.des}}</span>
      </span>
      <wl-icon class="ck" v-if="idx === 0" name="check-bold" size="12" />
    </div>
  </div>
</template>

<script>

export default {
  props: [],
  data() {
    return {
      optimizes: [
        {
          title: 'For me',
          des: 'Others can hear you speak with no background noise',
          svg: `<svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.64713 11.2941C5.45224 11.2941 5.29419 11.1362 5.29419 10.9412V0.352941C5.29419 0.158047 5.45224 0 5.64713 0C5.84202 0 6.00007 0.158047 6.00007 0.352941V10.9412C6.00007 11.1362 5.84202 11.2941 5.64713 11.2941Z" fill="#64B4FA"/>
            <path d="M10.5882 12.0001H9.89978L9.5595 11.1018H8.07176L7.74467 12.0001H7.05884L8.47535 8.4707H9.18229L10.5882 12.0001ZM9.39331 10.6243L8.86839 9.21646C8.85256 9.17051 8.83585 9.09668 8.81827 8.99495H8.80772C8.79189 9.08847 8.7743 9.16231 8.75496 9.21646L8.23531 10.6243H9.39331Z" fill="#64B4FA"/>
            <path d="M7.41178 7.76459C7.21671 7.76459 7.05884 7.60672 7.05884 7.41165V3.88224C7.05884 3.68734 7.21671 3.5293 7.41178 3.5293C7.60685 3.5293 7.76472 3.68734 7.76472 3.88224V7.41165C7.76472 7.60672 7.60685 7.76459 7.41178 7.76459Z" fill="#64B4FA"/>
            <path d="M2.11759 8.11793C1.9227 8.11793 1.76465 7.96006 1.76465 7.76499V3.5297C1.76465 3.3348 1.9227 3.17676 2.11759 3.17676C2.31248 3.17676 2.47053 3.3348 2.47053 3.5297V7.76499C2.47053 7.96006 2.31248 8.11793 2.11759 8.11793Z" fill="#64B4FA"/>
            <path d="M3.88224 9.52935C3.68734 9.52935 3.5293 9.37148 3.5293 9.17641V2.11759C3.5293 1.9227 3.68734 1.76465 3.88224 1.76465C4.07713 1.76465 4.23518 1.9227 4.23518 2.11759V9.17641C4.23518 9.37148 4.07713 9.52935 3.88224 9.52935Z" fill="#64B4FA"/>
            <path d="M9.17643 6.70603C8.98136 6.70603 8.82349 6.54816 8.82349 6.35308V4.94132C8.82349 4.74643 8.98136 4.58838 9.17643 4.58838C9.3715 4.58838 9.52937 4.74643 9.52937 4.94132V6.35308C9.52937 6.54816 9.3715 6.70603 9.17643 6.70603Z" fill="#64B4FA"/>
            <path d="M0.352941 6.66174C0.158047 6.66174 0 6.50387 0 6.30879V4.98527C0 4.79037 0.158047 4.63232 0.352941 4.63232C0.547835 4.63232 0.705882 4.79037 0.705882 4.98527V6.30879C0.705882 6.50387 0.547835 6.66174 0.352941 6.66174Z" fill="#64B4FA"/>
            </svg>`,
        },
        {
          title: 'For all people in room',
          des: 'Others can hear all the speakers near your microphone with no background noise',
          svg: `<svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12C5.79293 12 5.625 11.8323 5.625 11.625V0.375C5.625 0.167925 5.79293 0 6 0C6.20707 0 6.375 0.167925 6.375 0.375V11.625C6.375 11.8323 6.20707 12 6 12Z" fill="#F7F7F7"/>
            <path d="M7.875 8.25C7.66774 8.25 7.5 8.08226 7.5 7.875V4.125C7.5 3.91793 7.66774 3.75 7.875 3.75C8.08226 3.75 8.25 3.91793 8.25 4.125V7.875C8.25 8.08226 8.08226 8.25 7.875 8.25Z" fill="#F7F7F7"/>
            <path d="M2.25 8.625C2.04293 8.625 1.875 8.45726 1.875 8.25V3.75C1.875 3.54293 2.04293 3.375 2.25 3.375C2.45707 3.375 2.625 3.54293 2.625 3.75V8.25C2.625 8.45726 2.45707 8.625 2.25 8.625Z" fill="#F7F7F7"/>
            <path d="M4.125 10.125C3.91793 10.125 3.75 9.95726 3.75 9.75V2.25C3.75 2.04293 3.91793 1.875 4.125 1.875C4.33207 1.875 4.5 2.04293 4.5 2.25V9.75C4.5 9.95726 4.33207 10.125 4.125 10.125Z" fill="#F7F7F7"/>
            <path d="M9.75 7.125C9.54274 7.125 9.375 6.95726 9.375 6.75V5.25C9.375 5.04293 9.54274 4.875 9.75 4.875C9.95726 4.875 10.125 5.04293 10.125 5.25V6.75C10.125 6.95726 9.95726 7.125 9.75 7.125Z" fill="#F7F7F7"/>
            <path d="M0.375 7.07812C0.167925 7.07812 0 6.91039 0 6.70312V5.29688C0 5.0898 0.167925 4.92188 0.375 4.92188C0.582075 4.92188 0.75 5.0898 0.75 5.29688V6.70312C0.75 6.91039 0.582075 7.07812 0.375 7.07812Z" fill="#F7F7F7"/>
            <path d="M9.91016 11.0938H11.4805V10.4609H9.91016V8.8125H9.27734V10.4609H7.70703V11.0938H9.27734V12.7422H9.91016V11.0938Z" fill="white"/>
            </svg>`,
        },
        {
          title: 'For music',
          des: 'Others hear the original sound when you play an instrument or sing',
          svg: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 3.58286V6.76762C9.20583 6.59745 8.86429 6.50005 8.5 6.50005C7.39543 6.50005 6.5 7.39548 6.5 8.50005C6.5 9.60462 7.39543 10.5001 8.5 10.5001C9.60457 10.5001 10.5 9.60462 10.5 8.50005V1.31598C10.5 0.580518 9.84444 0.018102 9.11753 0.129934L4.01753 0.91455C3.43213 1.00461 3 1.50831 3 2.1006V8.26762C2.70583 8.09745 2.36429 8.00005 2 8.00005C0.895431 8.00005 0 8.89548 0 10.0001C0 11.1046 0.895431 12.0001 2 12.0001C3.10457 12.0001 4 11.1046 4 10.0001V4.42901L9.5 3.58286ZM9.5 1.31598C9.5 1.1934 9.39074 1.09967 9.26959 1.11831L4.16959 1.90292C4.07202 1.91793 4 2.00188 4 2.1006V3.41725L9.5 2.57109V1.31598ZM8.5 7.50005C9.05228 7.50005 9.5 7.94777 9.5 8.50005C9.5 9.05234 9.05228 9.50005 8.5 9.50005C7.94772 9.50005 7.5 9.05234 7.5 8.50005C7.5 7.94777 7.94772 7.50005 8.5 7.50005ZM3 10.0001C3 9.44777 2.55228 9.00005 2 9.00005C1.44772 9.00005 1 9.44777 1 10.0001C1 10.5523 1.44772 11.0001 2 11.0001C2.55228 11.0001 3 10.5523 3 10.0001Z" fill="white" fill-opacity="0.95"/>
            </svg>`,
        },
      ],
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    click(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    selectItem() {
      this.close();
    },

    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">
.audio-optimize-dropdown {
  width: 296px;
  background-color: $background-primary-lightUi;

  .item {
    display: flex;
    align-items: flex-start;
    height: 68px;
    cursor: default;
    user-select: none;
    padding: 0 12px 0 8px;

    .ico {
      @include flex;
      width: 32px;
      height: 32px;
      flex-shrink: 0;

      svg path {
        fill: black;
      }
    }

    .ck {
      @include flex;
      height: 32px;
    }

    .lb {
      flex-grow: 1;
      font-size: 14px;
      display: flex;
      flex-direction: column;

      .t1 {
        display: flex;
        align-items: center;
        height: 32px;
        font-size: 14px;
      }

      .t2 {
        opacity: .7;
        font-size: 12px;
        line-height: 15px;
      }
    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: .1);
    }
    &:active {
      background-color: rgba($color: #000000, $alpha: .2);
    }
    &.active {
      .t1 {
        color: $md-blue-60;
      }
      .ico, .ck {
        color: $md-blue-60;
        svg path {
          fill: $md-blue-60;
        }
      }
    }
  }
}

.dark {
  .audio-optimize-dropdown {
    background-color: $background-primary-darkUi;

    .header {
      .ico {
        svg path {
          fill: white;
        }
      }
    }

    .item {
      .ico {
        svg path {
          fill: white;
        }
      }

      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .1);
      }
      &:active {
        background-color: rgba($color: #FFFFFF, $alpha: .2);
      }
      &.active {
        .t1 {
          color: $md-blue-40;
        }
        .ico, .ck {
          color: $md-blue-40;
          svg path {
            fill: $md-blue-40;
          }
        }
      }
    }
  }
}

</style>
