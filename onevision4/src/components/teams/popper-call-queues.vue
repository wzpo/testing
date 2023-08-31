<template>
    <div class="common-menulist" style="width:290px; padding: 16px;">
        <div class="common-menulist-section-title" style="margin-bottom: 4px;">Agent status</div>

        <wl-combobox defaultLabel="Available" width="100%" :datalist="[
            {
                label: 'Signed In',
                value: 'Signed In',
                sub: 'You have signed in, but are not yet ready to receive calls.',
            },
            {
                label: 'Signed Out',
                value: 'Signed Out',
                sub: 'You are signed out and will not receive calls.',
            },
            {
                label: 'Available',
                value: 'Available',
                sub: 'You are ready to receive calls.',
            },
            {
                label: 'Unavailable',
                value: 'Unavailable',
                sub: 'You are not available to receive calls.',
            },
            {
                label: 'Wrapping Up',
                value: 'Wrapping Up',
                sub: 'You are not available to receive calls.',
            },
        ]" :defaultSelectedIndex="2" style="margin-bottom: 6px;" />

        <div class="common-menulist-section-title">You are not ready to receive calls</div>

        <div class="common-menulist-divider"></div>

        <wl-scrollbar :alwaysVisible="false" :arrowVisible="false" :theme="'dark'"
            style=" flex-shrink: 1; flex-grow: 1; width: calc(100% + 16px); overflow: hidden; height: 300px; padding: 0 30px 0 0; ">
            <div>
                <div class="common-menulist-section-title" style="margin-bottom: 4px;">Join queues</div>

                <div v-for="(itm, idx) in queueList" :key="idx"
                    style="display:flex; align-items: center; justify-content: space-between; padding-left: 4px; margin: 6px 0;">
                    <div>
                        <div style="font-size:16px; ">{{ itm.label }}</div>
                        <div v-if="itm.sub" style=" opacity:.7; font-size:14px; margin-top: -2px;">{{ itm.sub }}</div>
                    </div>

                    <md-toggle-switch class="toggle-switch-m" label="" :htmlId="`tw${idx}`" :checked="itm.on" :disabled="!itm.enabled"></md-toggle-switch>

                </div>
            </div>
        </wl-scrollbar>

    </div>
</template>

<script>

export default {
    props: [
        'queueList',
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

        close() {
            this.$emit("close");
            this.$popper.hideAll();
        },
    }
};
</script>

<style lang="scss"></style>
