<template>
  <div
  class="menu-nav-item"
  :class="[theme]"
  @contextmenu="onContextmenu"
  >
      <div class='grp' >

        <div v-if="!item.inmore" class='itm' @click="unpin" @contextmenu="unpin">
          <span class="lb" >Unpin from sidebar</span>
        </div>
        <div v-if="item.inmore" class='itm' @click="pin" @contextmenu="pin">
          <span class="lb" >Pin to sidebar</span>
        </div>

        <div class="divider" ></div>

        <div class='itm' :class="{disabled: isfirst}" @click="move2top" @contextmenu="move2top">
          <span class="lb" >Move to top</span>
        </div>
        <div class='itm' :class="{disabled: islast}" @click="move2bottom" @contextmenu="move2bottom">
          <span class="lb" >Move to bottom</span>
        </div>
        <div class='itm' :class="{disabled: isfirst}" @click="moveup" @contextmenu="moveup">
          <span class="lb" >Move up</span>
        </div>
        <div class='itm' :class="{disabled: islast}" @click="movedown" @contextmenu="movedown">
          <span class="lb" >Move down</span>
        </div>

      </div>


  </div>
</template>

<script>
import _ from 'lodash';
export default {
  props: [
    'isfirst',
    'islast',
    'item',
    'shouldAdjustPosition',
  ],
  data() {
    return {
      
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    teamsNavItems() {
      return this.$store.state.teamsNavItems;
    },
    
  },
  mounted() {},
  watch: {

  },
  methods: {
    onContextmenu(evt) {
      evt.preventDefault();
    },
    pin() {
      var i, itm, picked;
      var list = this.teamsNavItems
      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (this.item.id === itm.id) {
          itm.inmore = false;
          picked = itm
          list.splice(i, 1);
          break;
        }
      }

      var sortableitems = this.teamsNavItems.reduce(
          (arr, itm) => {
            if (itm.sortable && itm.inmore === picked.inmore) {
              arr.push(itm.id);
              return arr;
            }
            return arr;
          },
          []
        );
      
      //var id = _.last(sortableitems)
      /*
      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (id === itm.id) {
          list.splice(i+1, 0, picked);
          break;
        }
      }
      */
      if (sortableitems.length > 0) {
        var id = _.head(sortableitems)
        for(i=list.length-1; i>=0; i--) {
          itm = list[i];
          if (id === itm.id) {
            list.splice(i, 0, picked);
            break;
          }
        }
      } else {
        list.push(picked);
      }
      

      this.$store.commit('teamsNavItems', list);

      if (this.shouldAdjustPosition) {
        this.shouldAdjustPosition();
      }
      this.close();
    },
    unpin() {
      var i, itm, picked;
      var list = this.teamsNavItems
      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (this.item.id === itm.id) {
          itm.inmore = true;
          picked = itm
          list.splice(i, 1);
          break;
        }
      }

      var sortableitems = this.teamsNavItems.reduce(
          (arr, itm) => {
            if (itm.sortable && itm.inmore === picked.inmore) {
              arr.push(itm.id);
              return arr;
            }
            return arr;
          },
          []
        );


      if (sortableitems.length > 0) {
        var id = _.head(sortableitems)
        for(i=list.length-1; i>=0; i--) {
          itm = list[i];
          if (id === itm.id) {
            list.splice(i, 0, picked);
            break;
          }
        }
      } else {
        list.push(picked);
      }

      this.$store.commit('teamsNavItems', list);
      
      this.close();
    },

    moveup() {
      var i, itm, picked;
      var list = this.teamsNavItems

      picked = this.item;

      var sortableitems = this.teamsNavItems.reduce(
          (arr, itm) => {
            if (itm.sortable && itm.inmore === picked.inmore) {
              arr.push(itm.id);
              return arr;
            }
            return arr;
          },
          []
        );
      var idx = sortableitems.indexOf(picked.id);
      var id = sortableitems[idx-1]

      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (picked.id === itm.id) {
          list.splice(i, 1);
          break
        }
      }
      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (id === itm.id) {
          list.splice(i, 0, picked);
          break
        }
      }

      this.$store.commit('teamsNavItems', list);

      this.close();
    },
    movedown() {
      var i, itm, picked;
      var list = this.teamsNavItems

      picked = this.item;

      var sortableitems = this.teamsNavItems.reduce(
          (arr, itm) => {
            if (itm.sortable && itm.inmore === picked.inmore) {
              arr.push(itm.id);
              return arr;
            }
            return arr;
          },
          []
        );
      var idx = sortableitems.indexOf(picked.id);
      var id = sortableitems[idx+1]

      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (picked.id === itm.id) {
          list.splice(i, 1);
          break
        }
      }
      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (id === itm.id) {
          list.splice(i+1, 0, picked);
          break
        }
      }

      this.$store.commit('teamsNavItems', list);

      this.close();
    },

    move2top() {
      var i, itm, picked;
      var list = this.teamsNavItems
      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (this.item.id === itm.id) {
          picked = itm
          list.splice(i, 1);
          break;
        }
      }

      var sortableitems = this.teamsNavItems.reduce(
          (arr, itm) => {
            if (itm.sortable && itm.inmore === picked.inmore) {
              arr.push(itm.id);
              return arr;
            }
            return arr;
          },
          []
        );
      var id = _.head(sortableitems)

      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (id === itm.id) {
          list.splice(i, 0, picked);
          break;
        }
      }

      this.$store.commit('teamsNavItems', list);

      this.close();
    },
    move2bottom() {
      var i, itm, picked;
      var list = this.teamsNavItems
      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (this.item.id === itm.id) {
          picked = itm
          list.splice(i, 1);
          break;
        }
      }

      var sortableitems = this.teamsNavItems.reduce(
          (arr, itm) => {
            if (itm.sortable && itm.inmore === picked.inmore) {
              arr.push(itm.id);
              return arr;
            }
            return arr;
          },
          []
        );
      var id = _.last(sortableitems)

      for(i=list.length-1; i>=0; i--) {
        itm = list[i];
        if (id === itm.id) {
          list.splice(i+1, 0, picked);
          break;
        }
      }

      this.$store.commit('teamsNavItems', list);

      this.close();
    },

    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">
.menu-nav-item {
  width: 260px;
  pointer-events: auto;

  padding: 4px;

  .grp .tt{
    height: 32px;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
  
    font-size: 12px;
    margin-bottom: 3px;
    padding: 0 15px;

    .ico {
      margin-right: 5px;
    }

    .lb{
      opacity: .7;
    }
  }

  .itm{
    height: 32px;
    cursor: default;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 12px;
    border-radius: 8px;

    &.disabled {
      opacity: .35;
      pointer-events: none;
    }

  }
  .itm .bold{
    font-weight: 600;
  }
  .itm .indent{
      margin-left: 12px;
  }
  .itm:hover{
    background-color: rgba($color: #000000, $alpha: .07);
  }
  .itm:active{
    background-color: rgba($color: #000000, $alpha: .11);
  }

  .itm .lb{
      font-size: 14px;
      pointer-events: none;
  }
  .itm .ico{
      margin-right: -12px;
  }
  .divider{
    margin: 4px 8px;
    border-bottom: 1px solid #EEE;
  }

  .blue path{
    fill: $md-blue-60;
  }

  /* ------------------ drak ------------------ */

  &.hybrid {
    color: $text-color-primary-light-ui;
  }

  &.dark {
    color: $text-color-primary-dark-ui;

    .tt {
      color: $text-color-disabled-light-ui;
    }
    .divider{
      border-bottom: 1px solid $md-gray-80;
    }
    .itm:hover{
      background-color: rgba($color: #FFFFFF, $alpha: .07);
    }
    .itm:active{
      background-color: rgba($color: #FFFFFF, $alpha: .11);
    }

    .blue path{
      fill: $md-blue-40;
    }
  }

}

</style>
