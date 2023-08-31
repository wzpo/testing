<template>
    <div id='pop-sign-language-video' :class="[os, theme]" :style="{
        background: `linear-gradient(180deg, ${themeColorList[theme][themeColor]['app'][0]} 0%, ${themeColorList[theme][themeColor]['app'][1]} 100%)`
    }">

        <topbar-simple :title='`<svg style="margin-right:4px;" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_297_72478)">
<path d="M6 0.9375C4.99873 0.9375 4.01995 1.23441 3.18743 1.79069C2.3549 2.34696 1.70603 3.13761 1.32286 4.06266C0.939694 4.98772 0.839439 6.00562 1.03478 6.98764C1.23011 7.96967 1.71227 8.87173 2.42027 9.57973C3.12828 10.2877 4.03033 10.7699 5.01236 10.9652C5.99439 11.1606 7.01229 11.0603 7.93734 10.6771C8.86239 10.294 9.65304 9.6451 10.2093 8.81257C10.7656 7.98005 11.0625 7.00127 11.0625 6C11.061 4.6578 10.5272 3.37101 9.57807 2.42193C8.629 1.47285 7.3422 0.938999 6 0.9375Z" fill="#27A17A"/>
</g>
<defs>
<clipPath id="clip0_297_72478">
<rect width="12" height="12" fill="white"/>
</clipPath>
</defs>
</svg>
Sign Language Interpreter`' :buttons="['close']" :titleStyle="{marginLeft: '10px',}" @close="closeByHand">
            <div slot="right" class='iconbtn' @click="popin" v-tooltip="'Show with others'" style="margin-right: 10px;" >
                <wl-icon name="pop-in-bold" :size="16" />
            </div>
        </topbar-simple>
<!--wl-combobox class="btn-change" width="290px" height="24" display="button" :maxRow="4" placement="bottom-end" defaultLabel="Change Sign language"
                :datalist="signLanguageList" :defaultSelectedIndex="signLanguageIndex" @select="selectCombobox" /-->
        <div class="mainbody">
            <video-item 
            :name='signLanguagePeople.name' 
            :avatar='signLanguagePeople.avatar' 
            :video='signLanguagePeople.video' 
            :audio='signLanguagePeople.audio'
            :muted='false' 
            :isSign='true' 
            :meetingId="meetingId"
            :signLang='signLanguagePeople.lang' 
            :statusTxt="signLanguagePeople.statusTxt" 
            :isBgVideo='false' 
            :isActiveSpeaker='false' 
            class="videoview"
        />

        </div><!--mainbody-->

    </div>
</template>

<script>
import _ from 'lodash'

export default {
    props: ['meetingId'],

    data() {
        return {

        }
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
        peopleSI() {
            return this.$store.state.peopleSI;
        },
        signLanguage() {
            return this.$store.state.signLanguage;
        },
        signLanguageList() {
            return _.tail(this.$store.state.signLanguageList);
        },
        signLanguageIndex() {
            for (var i = 0; i < this.signLanguageList.length; i++) {
                if (this.signLanguageList[i].value === this.signLanguage) {
                    return i
                }
            }
            return 0
        },
        signLanguagePeople() {
            let p = this.peopleSI.find(p => {
                return p.lang == this.signLanguage
            })
            return p
        },

    },
    mounted() {

    },
    beforeDestroy() {

    },
    watch: {

    },
    methods: {
        selectCombobox(evt) {
            if (evt.data.value != 'na') {
                this.$store.commit('signLanguage', evt.data.value);
            }
        },
        popin() {
            this.$store.commit('signLanguageVideoPosition', 'after-selfvideo')
            this.$emit('close');
        },
        closeByHand() {
            this.$store.commit('signLanguage', '');
            this.$emit('close');
        },
    }

}
</script>

<style lang="scss">
#pop-sign-language-video {
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    user-select: none;
    height: 100%;

    .mainbody {
        display: flex;
        flex-grow: 1;

        .videoview {
            display: flex;
            width: 100%;
            height: 100%;

            .video_item {
                width: 100%;
            }
        }

    }

    &.mac {
        border-radius: 12px;
        overflow: hidden;
    }


    /* theme ----- dark/hybrid */
    &.dark,
    &.hybrid {
        color: $text-color-primary-dark-ui;
    }

}
</style>