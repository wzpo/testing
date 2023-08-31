<!-- 作废了，不用了 -->

<template>
    <div id="pop-filter"
      :class="[os, theme]"
    >
      <div 
        v-for="(itm, idx) in menulist[0]"
        :key="`g1-${idx}`"
        class='item' 
        :class="{
          active: activeId === idx,
          'split-line': idx === menulist[0].length - 1,
        }" 
        @click="() => {selectFilter(idx)}"
      >
        <span class="lb" >{{itm}}</span>
      </div>


      <div 
        v-for="(itm, idx) in menulist[1]"
        :key="`g2-${idx}`"
        class='item' 
        @click="toggle(idx)"
      >
        <span class="lb" >{{itm.name}}</span>
        <span class="check" >
          <wl-icon v-if="itm.check || spaceListCompactView && idx === 2" name="check-bold" size="12" />
        </span>
      </div>


    </div>
</template>

<script>

export default {
  props: [
    'onSelect',
    'selectedId',
  ],

  data() {
    return {
      activeId: this.selectedId,
      menulist: [
        [
          'Show Full List',
          'Notifications',
          'Unread',
          'Hidden',
          'Mentions to Me',
          'Mentions to All',
          'Threads',
          'Flags',
        ],
        [
          {
            name: 'Show Favorites on Top',
            check: true,
          },
          {
            name: 'Separate DMs and Spaces',
            check: true,
          },
          {
            name: 'Show compact view',
            check: false,
          },
        ],
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
    spaceListCompactView() {
      return this.$store.state.spaceListCompactView;
    },
  },
  mounted() {},
  watch: {

  },
  methods: {
    selectFilter(idx) {
      this.close();
      this.activeId = idx
      if(this.onSelect) {
        this.onSelect(idx, this.menulist[0][idx])
      }
    },
    close() {
      this.$emit("close");
    },
    toggle(idx) {
      if(idx === 2) {
        this.$store.commit('spaceListCompactView', !this.spaceListCompactView);
      }
      this.close();
    },
  }
};
</script>

<style lang="scss">
#pop-filter {
  width: 260px;
  pointer-events: auto;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.2), 0px 0px 1px rgba(0, 0, 0, 0.12);

  .item {
    width: 100%;
    height: 40px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;

    .lb{
      font-size: 14px;
      pointer-events: none;
      flex-grow: 1;
    }

    .check {
      path {
        fill: $md-blue-60;
      }
    }

    &:hover{
      background: rgba($color: #000000, $alpha: .1);
    }
    &:active, &.active{
      background: rgba($color: #000000, $alpha: .15);
    }
  }

  .split-line{
      border-bottom: 1px solid #EEE;
  }


  /* ------------------ drak ------------------ */

  &.dark {
    color: $text-color-primary-dark-ui;

    .split-line{
      border-bottom: 1px solid $md-gray-80;
    }

    .item {
      .check {
        path {
          fill: $md-blue-40;
        }
      }

      &:hover{
        background: rgba($color: #FFFFFF, $alpha: .1);
      }
      &:active, &.active{
        background: rgba($color: #FFFFFF, $alpha: .15);
      }
    }
  }

}

</style>
