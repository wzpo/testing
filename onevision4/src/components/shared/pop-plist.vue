<template>
    <div id="pop-plist"
      :class="[os, theme]"
    >
      <div class="title">Waiting in lobby</div>
      <people-item
          v-for="(p, index) in noInMeetingPeople"
          :key="`not${index}`"
          :name="p.name"
          :avatar="p.avatar"
          :iconSize="24"
          :suffix="p.guest ? '(Guest)' : null"
          :external="p.external"
        ></people-item>

      <div class="title">In meeting</div>
      <people-item
          v-for="(p, index) in inMeetingPeople"
          :key="`in${index}`"
          :name="p.name"
          :avatar="p.avatar"
          :iconSize="24"
          :suffix="p.guest ? '(Guest)' : null"
          :external="p.external"
        ></people-item>
    </div>
</template>

<script>

export default {
  data() {
    return {
      inMeetingPeople: [],
      noInMeetingPeople: [],
      pageX: 0,
      pageY: 0,
      itv: 0,
    };
  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    host() {
      let people = this.$store.getters.host;
      return people;
    },
    hostName() {
      return this.host.name;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },

  },
  mounted() {
    this.inMeetingPeople = this.peopleList.slice(2, 5);
    this.noInMeetingPeople = this.peopleList.slice(6, 10);
  },
  watch: {
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
#pop-plist {
  width: 240px;
  pointer-events: auto;
  margin: 5px 0;

  .title {
    color: $text-color-secondary-light-ui;
    font-size: 12px;
    height: 32px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $md-gray-10;
    margin-left: 15px;
  }

  /* ------------------ drak ------------------ */

  &.dark {
    color: $text-color-primary-dark-ui;
  }
  &.dark .title{
    color: $text-color-disabled-light-ui;
    border-bottom: 1px solid $md-gray-80;
  }

}

</style>
