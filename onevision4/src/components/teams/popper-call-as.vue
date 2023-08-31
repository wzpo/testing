<template>
    <div class="common-menulist" style="width:280px;">
        <div class="common-menulist-section-title">Call as</div>
        <div v-for="(itm, idx) in callAsList" :key="idx" :class="{
            'common-menulist-item': itm.label !== 'divider',
            'common-menulist-item-48': itm.label !== 'divider',
        }" style="padding-left: 8px;" @click="close(itm)">
            <div style="width:40px;">
                <wl-icon v-if="itm.iconVisible" :name="itm.icon" :color="itm.color" />
            </div>
            <div class="lb">
                <div class="line1">{{ itm.label }}</div>
                <div v-if="itm.sub" class="line2">{{ itm.sub }}</div>
            </div>
            <svg v-if="selected.label === itm.label" style="margin-right: 12px;" width="14" height="9" viewBox="0 0 14 9"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.60029 8.5621C4.53438 8.56225 4.46909 8.54929 4.40823 8.52397C4.34737 8.49866 4.29215 8.46149 4.24579 8.41464L0.645699 4.79696C0.599403 4.75041 0.562729 4.69519 0.537772 4.63447C0.512816 4.57374 0.500064 4.50869 0.500246 4.44304C0.500428 4.37738 0.51354 4.31241 0.538833 4.25182C0.564126 4.19123 0.601105 4.13622 0.647659 4.08992C0.694212 4.04363 0.749429 4.00695 0.810156 3.982C0.870882 3.95704 0.93593 3.94429 1.00158 3.94447C1.06724 3.94465 1.13222 3.95777 1.1928 3.98306C1.25339 4.00835 1.3084 4.04533 1.3547 4.09188L4.62716 7.38046L12.675 0.483C12.7756 0.396753 12.9064 0.35401 13.0385 0.364174C13.1707 0.374339 13.2933 0.436578 13.3796 0.5372C13.4658 0.637822 13.5086 0.768584 13.4984 0.90072C13.4882 1.03286 13.426 1.15554 13.3254 1.24179L4.92548 8.44149C4.83506 8.5194 4.71964 8.5622 4.60029 8.5621Z"
                    fill="#64B4FA" />
            </svg>
        </div>

    </div>
</template>

<script>

export default {
    props: [
        'callAsList', 'selected', 'onSelect'
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

        close(itm) {
            this.$store.commit('callAs', itm);
            this.$emit("close");
            this.$popper.hideAll();
        },
    }
};
</script>

<style lang="scss"></style>
