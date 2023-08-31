<template>
    <div class="popper-phone-settings common-menulist" style="width:276px; padding: 16px;">
        <div class="common-menulist-section-title" style="margin-bottom: 4px;">
            <wl-icon name="call-forward-settings-bold" size="16" style="margin-right: 4px;" />
            Forward calls to
        </div>

        <wl-combobox defaultLabel="None" width="100%" :datalist="[
            {
            label: 'None',
            },
            {
            label: 'Home',
            sub: '+1 456 566 7897',
            },
            {
            label: 'Mobile',
            sub: '+1 456 566 1200',
            },
            {
            label: 'Business',
            sub: '+1 456 566 1200',
            },
        ]" :defaultSelectedIndex="0" style="margin-bottom: 16px;" @select="onForwardCallsSelect"/>

        <div class="common-menulist-section-title" style="margin-bottom: 12px;">Manage my numbers</div>

        <md-checkbox value="+1 232 1223 1123"
            label="+1 232 1223 1123"
            htmlId="myno"
            :checked="true"
            style="margin: -4px 0 20px 0; "
          />

        <div class="common-menulist-section-title"
            style="display: flex; align-items: center; margin-bottom: 12px; margin-top: 12px;">
            <wl-icon name="location-bold" size="16" style="margin-right: 4px; " /> E911 Emergency address
            <wl-icon name="info-circle-bold" size="12" style="margin-left: 4px;" />
        </div>

        <wl-combobox defaultLabel="16666 NE 38th St. Seattle" width="100%" :datalist="[
            {
                label: '16666 NE 38th St. Seattle',
                value: '16666 NE 38th St. Seattle',
            },
        ]" :defaultSelectedIndex="0" style="margin-bottom: 16px;">
        </wl-combobox>

        <div class="common-menulist-divider"></div>

        <md-button class="btn md-button-outline " aria-label="x" :size="28"
            style="width: 244px; margin-top: 12px; font-size: 14px;">Open call preferences</md-button>

    </div>
</template>

<script>

export default {
    props: [
        'onForwardcallsChange'
    ],

    data() {
        return {

        };
    },
    computed: {
        os() {
            return this.$store.state.os;
        },
        theme() {
            return this.$store.state.theme;
        },
    },
    mounted() { },
    watch: {

    },
    methods: {
        onForwardCallsSelect(evt) {
            if (this.onForwardcallsChange) {
                this.onForwardcallsChange(evt);
            }
        },
        close() {
            this.$emit("close");
            this.$popper.hideAll();
        },
    }
};
</script>

<style lang="scss">
    .popper-phone-settings {
        .common-menulist-section-title {
            display: flex;
            align-items: center;
        }
    }
</style>
