<template>
    <div
    id="pop-caption-option"
    :class="[theme]"
    >

        <div v-if="!submenuVisible" class='grp' >

          <div class='itm' @click="openLangList">
            <div class="lft">
              <span class="lb1" >Spoken language</span>
              <span class="lb2" >English</span>
            </div>
            <wl-icon name="arrow-right-bold" size="16" />
          </div>

          <div class='itm' @click="openLangList">
            <div class="lft">
              <span class="lb1" >Caption language</span>
              <span class="lb2" >English</span>
            </div>
            <wl-icon name="arrow-right-bold" size="16" />
          </div>
        </div>

        <div v-if="submenuVisible" class='grp' >

          <div class='head' @click="() => {submenuVisible = false}" >
            <wl-icon name="arrow-left-bold" size="12" />
            <span class="lb" >Caption language</span>
          </div>

          <md-input 
            class="md-search-input search" 
            clear
            placeholder="Search"
          >
            <wl-icon
              class="md-search-input__icon"
              name="search-bold"
              size="16"
              slot="inputBefore"
            />
          </md-input>

          <wl-scrollbar 
            class="langlist" 
            :alwaysVisible="false"
            :arrowVisible="$store.state.os==='win'"
            :theme="theme === 'dark' ? 'dark' : 'light'"
          >
            <div class="list">
              <div
                v-for="(itm, index) in lang"
                :key="index"
              >
                <div class="lanitm">
                  <div class="lft">
                    <div class="line1" :class="{small: index === 0}" >{{itm.line1}}</div>
                    <div v-if="itm.line2" class="line2">{{itm.line2}}</div>
                  </div>
                  <wl-icon
                    v-if="index === 1"
                    name="check-bold" 
                    size="16"
                    color="blue-40"
                    class="ico"
                  />
                </div>
              </div>
            </div>
          </wl-scrollbar >
          
        </div>

    </div>
</template>

<script>

export default {
  data() {
    return {
      settingMenuType: '',
      copiedVisible: false,
      submenuVisible: false,

      lang: [
        {
          line1: `Don’t translate`,
        },
        {
          line1: 'English',
          line2: 'English',
        },
        {
          line1: '简体中文',
          line2: 'Simplified Chinese',
        },
        {
          line1: 'Deutsch',
          line2: 'German',
        },
        {
          line1: 'Espanol',
          line2: 'Spanish',
        },
        {
          line1: 'Pусский',
          line2: 'Russkiy',
        },
        {
          line1: 'Francais',
          line2: 'French',
        },
        {
          line1: 'Francais',
          line2: 'French',
        },
        {
          line1: 'Francais',
          line2: 'French',
        },
        {
          line1: 'Francais',
          line2: 'French',
        },
        {
          line1: 'Francais',
          line2: 'French',
        },
        {
          line1: 'Francais',
          line2: 'French',
        },
        {
          line1: 'Francais',
          line2: 'French',
        },
      ],
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    os() {
      return this.$store.state.os;
    },


  },
  mounted() {},
  watch: {

  },
  methods: {

    openLangList() {
      this.submenuVisible = true
    },

    close() {
      this.$emit("close");
    },

  }
};
</script>

<style lang="scss">
#pop-caption-option {
  width: 280px;
  pointer-events: auto;

  .grp {
    margin: 8px;
  }

  .itm{
    @include flex;
    width: 100%;
    height: 48px;
    cursor: default;
    user-select: none;
    border-radius: 8px;
    padding: 0 15px;

    .lft {
      @include flex(column, flex-start, flex-start);
      flex-grow: 1;

      .lb1 {
        font-size: 14px;
        opacity: .7;
        line-height: 22px;
      }
      .lb2 {
        opacity: .95;
        line-height: 24px;
        margin-top: -2px;
      }
    }

    &:hover {
      background: rgba($color: #000000, $alpha: 0.07);
    }
    &:active {
      background: rgba($color: #000000, $alpha: 0.2);
    }
  }

  .head {
    @include flex(row, flex-start);
    height: 32px;
    width: 100%;
    margin-bottom: 8px;
    padding-left: 8px;

    .lb {
      margin-left: 8px;
      font-size: 14px;
      opacity: .95;
      user-select: none;
    }
  }

  .search {
    margin-bottom: 0;
    .md-input__before {
      color: rgba($color: white, $alpha: 0.95);
      fill: rgba($color: white, $alpha: 0.95);
    }
    .md-input {
      height: 28px;
      font-size: 12px;
      padding-left: 30px;
      color: rgba($color: white, $alpha: 0.95) !important;
      background: rgba($color: #000000, $alpha: .5) !important;
      border-color: rgba($color: white, $alpha: 0.5) !important;
      border-radius: 8px !important;

      &::placeholder {
        color: rgba($color: white, $alpha: 0.7) !important;
      }
      &:hover {
        border-color: rgba($color: white, $alpha: 0.7) !important;
      }
      &:focus {
        border-color: rgba($color: white, $alpha: 0.9) !important;
        box-shadow: 0 0 0 3px $md-blue-50 !important;
      }
    }

  }

  .langlist {
    flex-shrink: 1;
    flex-grow: 1;
    width: 100%;
    overflow-x: hidden;
    height: 300px;
    margin-top: 8px;
    margin-right: -4px;

    .list {
      width: calc(100% - 18px);

      .lanitm {
        @include flex(row, flex-start);
        border-radius: 8px;
        padding-left: 8px;

        .lft {
          @include flex(column, flex-start, flex-start);
          flex-grow: 1;
          padding: 2px 8px 2px 0;
        }

        .line1 {
          opacity: .95;

          &.small {
            font-size: 14px;
          }
        }
        .line2 {
          opacity: .7;
          font-size: 14px;
          margin-top: -2px;
        }

        .ico {
          margin-right: 16px;
        }

        &:hover {
          background: rgba($color: #FFF, $alpha: 0.07);
        }
        &:active {
          background: rgba($color: #FFF, $alpha: 0.2);
        }
      }

    }
  }

  

  /* ------------------ drak ------------------ */

  &.hybrid {
    color: $text-color-primary-light-ui;
  }

  &.dark {
    color: $text-color-primary-dark-ui;

    .itm {

      &:hover {
        background: rgba($color: #FFFFFF, $alpha: 0.1);
      }
      &:active {
        background: rgba($color: #FFFFFF, $alpha: 0.2);
      }
    }

  }
  

}
</style>
