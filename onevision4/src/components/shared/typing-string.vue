<template>
    <span class="typing-string">
        <fragment 
            v-for="(s, idx) in strlist" 
            :key="`s${idx}`"
        >{{ `${s.str} ` }}
        </fragment>
    </span>
</template>

<script>

export default {
    props: {
        strings: {
            type: Array,
            // {
            //    delay: ms
            //    str: 'aaaaaaa'
            //  }
        },
    },
    data() {
        return {
            visibleNumber: 0,
        }
    },
    computed: {
        strlist() {
            return this.strings.filter( (val, idx) => this.visibleNumber > idx )
        },
    },
    mounted() {
        for (let i = 0; i < this.strings.length; i++) {
            this.setvisible(i)
        }
    },
    watch: {

    },
    methods: {
        setvisible(idx) {
            let s = this.strings[idx]
            setTimeout(() => {
                this.visibleNumber++
            }, s.delay)
        },
    }
}
</script>


<style lang="scss">
.typing-string {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    transition: all .2s;
}
</style>
