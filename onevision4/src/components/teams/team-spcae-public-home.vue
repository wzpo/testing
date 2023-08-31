<template>
    <fragment>
  
      <div 
        class="public-space-homepage " 
        :class="[theme]"
        :style="{
          background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['content'][0]} 0%, ${themeColorList[theme][themeColor]['content'][1]} 100%)`,
          borderTopRightRadius: teamsSidecarName && !gptPanelPopouted || meetingsSidecarVisible ? '12px' : '0',
        }"
      >

        <wl-scrollbar 
          ref="scrollbar" 
          class='cont-wrap' 
          :theme="theme === 'dark' ? 'dark' : 'light'"
          :arrowVisible="$store.state.os==='win'"
        >

          <div class="scrollcont">
            <div class="cont-area" >
                <div class="title">Explore public spaces</div>
                <div class="subtitle">See all the conversations you’re welcome to join.</div>
                <md-input 
                    class="md-search-input search searchinput" 
                    ref="searchinput"
                    clear
                    shape="pill"
                    placeholder="Search for a public space"
                    >
                    <wl-icon
                        name="search-bold" 
                        :color=" theme === 'light' ? 'black-95' : 'white-95' "
                        size="16"
                        class="md-search-input__icon"
                        slot="inputBefore"
                        />
                    <wl-icon
                        name="cancel-bold" 
                        :color=" theme === 'light' ? 'black-95' : 'white-95' "
                        size="16"
                        slot="clear"
                    />
                </md-input>

                <div class="space-items" >

                    <div class="space-items-list" >

                        <div
                            v-for="(p, idx) in spacelist"
                            :key="`list-item-${idx}`"
                            :id="`list-item-${p.id}`"
                            class="listitm"
                        >
                            <div class="bg"></div>
                            <div :class="`avatar ava${p.avatar}`" ></div>
                            <div class="name">{{p.name}}</div>
                            <div class="pnum">{{p.pnum}}</div>
                            <div class="lastact">{{p.lastact}}</div>
                            <div class="desc">{{p.desc}}</div>

                            <md-button class="btn md-button-solid" aria-label="x" :size="32" >Join</md-button>
                        </div>

                    </div>

                </div>
            </div>

          </div>
          

        </wl-scrollbar>


  
      </div>

  
    </fragment>
  </template>
  
  <script>
  
  export default {
      props:[

      ],
      data() {
          return {
            spacelist: [
                {
                    name: 'Sew crafty',
                    pnum: '10 people',
                    lastact: 'Latest activity on Friday • 22/07/2022',
                    desc: 'Love knitting, crafting, quilting, and crocheting? We love it too.',
                    avatar: '01',
                },
                {
                    name: 'Bargain hunters',
                    pnum: '30 people',
                    lastact: 'Latest activity 18 hours ago',
                    desc: 'Spotted a bargain? Got a promo code to share? Post it here.',
                    avatar: '02',
                },
                {
                    name: 'Travel Tips',
                    pnum: '30 people',
                    lastact: 'Latest activity yesterday',
                    desc: 'A place for everyone who is interested in travel!',
                    avatar: '03',
                },
                {
                    name: 'Hot shots',
                    pnum: '10 people',
                    lastact: 'Latest activity ~55 minutes ago',
                    desc: 'Space description Space description Space description ',
                    avatar: '04',
                },
                {
                    name: 'HR Helpdesk',
                    pnum: '10 people',
                    lastact: 'Latest activity yesterday',
                    desc: 'Space description Space description Space description ',
                    avatar: '05',
                },
                {
                    name: 'IT Troubleshooting',
                    pnum: '10 people',
                    lastact: 'Latest activity on Friday • 22/07/2022',
                    desc: 'Space description Space description Space description ',
                    avatar: '06',
                },

            ],
          }
      },
      computed:{
        theme() {
          return this.$store.state.theme;
        },
        themeColor() {
          return this.$store.state.themeColor;
        },
        themeColorList() {
          return this.$store.state.themeColorList;
        },

        me() {
          return this.$store.getters.me;
        },
        teamsSidecarName() {
            return this.$store.state.teamsSidecarName;
        },
        gptPanelPopouted() {
            return this.$store.state.gptPanelPopouted;
        },
        meetingsSidecarVisible() {
            return this.$store.state.meetingsSidecarVisible;
        },
      },
      mounted(){

        
      },
      destroyed() {

      },
      watch: {
  
      },
      methods:{
  
      }
  }
  </script>
  
  
  <style lang="scss">
  
  .public-space-homepage {
    @include flex(column, flex-start, flex-start);
    width: 100%;
    height: 100%;
    border-radius: 12px 0 0px 0px;

    .cont-wrap {
        display: flex;
        width: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        overflow: hidden;
        margin: 4px 0 4px 0;
        height: 100px;

        .scrollcont {
            display: flex;
            flex-direction: column;
            padding-left: 24px;
        }

        .cont-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: calc(100% - 16px);
            margin: 36px 16px 16px 0;

            .title {
                font-weight: 600;
                font-size: 26px;
            }
            .subtitle {
                font-size: 14px;
            }

            .searchinput {
                margin: 16px 0 0;
                flex-grow: 1;
                flex-shrink: 1;
                max-width: 492px;
                width: 100%;

                .md-input {
                    width: 100%;
                    height: 32px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: normal;
                    padding-left: 32px;
                    color: rgba($color: white, $alpha: 0.95) !important;
                    background-color: #000 !important;
                    border: 1px solid rgba(255, 255, 255, 0.5) !important;

                    &::placeholder {
                        color: rgba(255, 255, 255, 0.7) !important;
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


            .space-items {
                display: flex;
                flex-direction: row;
                flex-shrink: 1;
                flex-grow: 1;
                width: 100%;
                user-select: none;
                transition: opacity .3s;
                margin-top: 20px;
                
                &-list {
                    margin-left: 0;
                    margin-right: 0;
                    display: flex;
                    flex-wrap: wrap;
                    flex-grow: 1;
                    justify-content: center;
                    
                    .listitm {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 200px;
                        height: 264px;
                        margin: 0 8px 16px 8px;
                        text-align: center;
                        
                        background: #000000;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);
                        border-radius: 12px;
                        padding: 0 10px;

                        .bg {
                            position: absolute;
                            width: calc(100% - 2px);
                            height: 58px;
                            top: 1px;
                            left: 1px;
                            background: url(~@/assets/img/tmp-public-space-header.png);
                            background-size: cover;
                            border-radius: 10px 10px 0px 0px;
                        }

                        .avatar {
                            width: 48px;
                            height: 48px;
                            margin-top: 26px;
                            background-size: cover;
                            background-repeat: no-repeat;
                            border-radius: 50%;
                            flex-shrink: 0;
                            flex-grow: 0;
                            z-index: 2;

                            &.ava01 {
                                background-image: url(~@/assets/img/tmp-public-space-ava01.png);
                            }
                            &.ava02 {
                                background-image: url(~@/assets/img/tmp-public-space-ava02.png);
                            }
                            &.ava03 {
                                background-image: url(~@/assets/img/tmp-public-space-ava03.png);
                            }
                            &.ava04 {
                                background-image: url(~@/assets/img/tmp-public-space-ava04.png);
                            }
                            &.ava05 {
                                background-image: url(~@/assets/img/tmp-public-space-ava05.png);
                            }
                            &.ava06 {
                                background-image: url(~@/assets/img/tmp-public-space-ava06.png);
                            }
                        }

                        .name {
                            font-size: 16px;
                            font-weight: 700;
                            opacity: .95;
                            margin-bottom: 2px;
                        }
                        .pnum, .lastact {
                            font-weight: 600;
                            font-size: 12px;
                            opacity: .7;
                            line-height: 18px;
                            margin-bottom: 2px;
                        }
                        .desc {
                            font-weight: 600;
                            font-size: 12px;
                            opacity: .95;
                            flex-grow: 1;
                            line-height: 18px;
                        }

                        .btn {
                            padding: 0 12px;
                            margin-bottom: 20px;
                        }

                    }
                }

            }
            
        }
    }
    
  }

  </style>
  