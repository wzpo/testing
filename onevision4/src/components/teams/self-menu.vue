<template>
    <div id="self-menu" :class="[os, theme]">

        <div class="cover"></div>
        <div class="selfavatar ">
            <presence-avatar :src="$store.state.avatarPath + $store.getters.me.avatar" :size="72"
                :presence="$store.getters.me.status" :theme="theme === 'light' ? 'light' : 'dark'" class="avatar">
            </presence-avatar>
        </div>
        <div class="name">{{ me.name }}</div>
        <div class="sub">She/Her</div>
        <div class="sub">{{ `${this.me.name.toLowerCase().replace(/ /g, '.')}@company.com` }}</div>
        <div class="sub">+1 400 668 5678</div>

        <div class="split-line" style="margin: 12px 0 4px 0;"></div>

        <div class="common-menulist" >
            <div v-for="(itm, idx) in menulist" :key="idx" :class="{
                'common-menulist-item common-menulist-item-50': itm.type !== 'divider',
                'divider': itm.type === 'divider',
            }" @click="close(itm)">
                
                <div v-if="itm.type !== 'divider'" class="lb" style="flex-grow: 1;">
                    <div class="line1">
                        {{ itm.label }}
                    </div>
                    <div v-if="itm.second" class="line2" v-html="itm.label != 'Status' ? itm.second : me.statusTxt"></div>
                </div>

                <wl-icon v-if="itm.suffixIcon" :name="itm.suffixIcon" size="16" style="margin-right: 8px;" />

                <div v-if="itm.type === 'divider'" style="border-top:1px solid rgba(255,255,255,.2); margin: 4px 4px;"></div>
            </div>

        </div>

    </div>
</template>
  
<script>

export default {
    props: {
        onSelect: {
            type: Function,
        },
    },

    data() {
        return {

            menulist: [
                {
                    label: 'Availability',
                    second: 'Do not disturb until tomorrow,...',
                    suffixIcon: 'arrow-right-bold',
                },
                {
                    label: 'Status',
                    second: 'Active',
                    suffixIcon: 'arrow-right-bold',
                },
                {
                    label: 'Edit profile',
                },
                {
                    label: 'My phone',
                    second: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.13965 1.57762C5.92824 1.57762 4.74403 1.93685 3.73678 2.60987C2.72953 3.28289 1.94448 4.23949 1.48089 5.35869C1.0173 6.47788 0.896007 7.70942 1.13234 8.89755C1.36868 10.0857 1.95203 11.1771 2.80862 12.0336C3.66522 12.8902 4.75659 13.4736 5.94472 13.7099C7.13286 13.9463 8.36439 13.825 9.48359 13.3614C10.6028 12.8978 11.5594 12.1127 12.2324 11.1055C12.9054 10.0982 13.2647 8.91403 13.2647 7.70262C13.2628 6.07873 12.6169 4.52187 11.4687 3.3736C10.3204 2.22534 8.76354 1.57944 7.13965 1.57762ZM7.13965 12.9526C6.1013 12.9526 5.08627 12.6447 4.22291 12.0678C3.35955 11.491 2.68664 10.671 2.28928 9.71171C1.89192 8.7524 1.78796 7.6968 1.99053 6.6784C2.1931 5.66 2.69311 4.72454 3.42734 3.99031C4.16157 3.25608 5.09703 2.75607 6.11543 2.5535C7.13383 2.35093 8.18943 2.45489 9.14874 2.85225C10.1081 3.24961 10.928 3.92252 11.5049 4.78588C12.0817 5.64924 12.3897 6.66427 12.3897 7.70262C12.3881 9.09454 11.8345 10.429 10.8503 11.4133C9.86605 12.3975 8.53157 12.9511 7.13965 12.9526Z" fill="#3CC29A"/>
<path d="M9.04261 6.05815L6.28815 8.41869L5.26233 7.38776C5.22183 7.34702 5.17369 7.31467 5.12068 7.29253C5.06766 7.2704 5.01081 7.25893 4.95336 7.25877C4.89591 7.25861 4.839 7.26977 4.78586 7.2916C4.73273 7.31344 4.68441 7.34553 4.64368 7.38604C4.60294 7.42655 4.57059 7.47468 4.54845 7.5277C4.52632 7.58071 4.51485 7.63756 4.51469 7.69501C4.51453 7.75246 4.52569 7.80938 4.54752 7.86251C4.56936 7.91565 4.60145 7.96396 4.64196 8.0047L5.95446 9.32361C6.03227 9.40195 6.13686 9.44793 6.2472 9.45229C6.35754 9.45665 6.46543 9.41907 6.54918 9.3471L9.61168 6.7221C9.65528 6.68474 9.69109 6.63915 9.71706 6.58794C9.74304 6.53674 9.75868 6.48092 9.76308 6.42367C9.76748 6.36642 9.76057 6.30887 9.74273 6.25429C9.72489 6.19971 9.69647 6.14919 9.65911 6.10559C9.62174 6.062 9.57615 6.02619 9.52495 6.00021C9.47374 5.97424 9.41792 5.9586 9.36067 5.95419C9.30342 5.94979 9.24587 5.95671 9.19129 5.97455C9.13672 5.99239 9.0862 6.02079 9.04261 6.05815Z" fill="#3CC29A"/>
</svg> <span style="margin-left: 4px;">Connected</span>`,
                    suffixIcon: 'arrow-right-bold',
                },
                {
                    type: 'divider',
                },
                {
                    label: 'Settings',
                },
                {
                    label: 'Manage account',
                    suffixIcon: 'pop-out-bold',
                },
                {
                    label: 'Help',
                    suffixIcon: 'arrow-right-bold',
                },
                {
                    type: 'divider',
                },
                {
                    label: 'Sign Out',
                },
                {
                    label: 'Exit Webex',
                },
                

            ],
        };
    },
    computed: {
        os() {
            return this.$store.state.os;
        },
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
        globalHeaderStatus() {
            return this.$store.state.globalHeaderStatus;
        },


    },
    beforeMount() {

    },
    mounted() {

    },
    watch: {

    },
    methods: {

        close(itm) {
            if (this.onSelect) {
                this.onSelect(itm)
            }
            this.$emit("close");
        },

    }
};
</script>
  
<style lang="scss">
#self-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 280px;
    background: #000000;
    pointer-events: auto;
    overflow: hidden;
    box-sizing: border-box;
    user-select: none;


    .split-line {
        width: 100%;
        border-bottom: 1px solid #EEE;
    }


    .cover {
        position: absolute;
        width: 100%;
        height: 84px;
        background-image: url(~@/assets/img/contact-card-cover.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        opacity: .1;
    }

    .selfavatar {
        position: relative;
        width: 72px;
        height: 72px;
        margin-top: 30px;
        margin-bottom: 12px;
        border-radius: 50%;
    }

    .name {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
    }

    .sub {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
    }

    .common-menulist {
        width: 100%;
    }




    /* ------------------ drak ------------------ */

    &.dark {
        color: $text-color-primary-dark-ui;

        .split-line {
            border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        }


        .cover {
            opacity: 1.0;
        }

        .avatar {
            .md-avatar {
                background-color: $md-gray-80;
            }

            .idx-active {
                background: $md-green-40;
            }
        }

        .link {
            color: $text-color-hyperlink-dark-ui;
        }



    }

}
</style>
  