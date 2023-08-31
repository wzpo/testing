<template>
    <div class='contactsheader'>
      <div class="row1" >
        <div class="left" >
          <div class="dropdown" >
            <span class="lb">Contacts</span>
          </div>
        </div>

        <div class='right' >
          <span 
            class="btn-circle btnplus" 
            :class="{
              active: addVisible,
            }"
            ref="addbtn"
            @click="showAdd"
            >
            <wl-icon name="plus-bold" size="16" />
          </span>

        </div>

      </div>

    </div>
</template>

<script>

import popContactCreate from './pop-contact-create.vue';

export default {
    props:[
       'name',
    ],
    data() {
      return {
        activeTabId: 0,

        addVisible: false,
        addList: [
          {
            label: 'Add a contact',
            icon: 'contact-card-bold',
          },
          {
            label: 'Create a group',
            icon: 'list-menu-bold',
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
    },

    mounted(){
      this.selectTab(this.activeTabId);
    },
    destroyed() {
      this.$eventBus.$off('space-search-changed');
    },
    watch: {

    },
    methods:{
      hoverTab(id) {
        this.moveTabBg(id);
      },
      leaveTab() {
        this.moveTabBg(this.activeTabId);
      },
      selectTab(id) {
        this.activeTabId = id;
        if (this.isShowTabs) {
          this.moveTabBg(id);
        }
        this.$store.commit('spaceListTabId', id);
        this.$store.commit('publicSpaceHomepageVisible', true);
      },
      moveTabBg(id) {
        const rect = document.querySelector(`.contactsheader-tab${id}`).getBoundingClientRect();
        const rect2 = document.querySelector(`.contactsheader-tabs`).getBoundingClientRect();
        document.querySelector(`.contactsheader-tab-active-bg`).style.left = `${rect.left - rect2.left}px`;
        document.querySelector(`.contactsheader-tab-active-bg`).style.width = `${rect.width}px`;
      },


      showAdd(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.addVisible) {
          this.$popper.show(
            {
              template: `
                <div class="common-menulist" style="width:220px;">
                  <div v-for="(itm, idx) in addList"
                    :key="idx"
                    :class="{
                      'common-menulist-item': itm.type!=='divider',
                      'divider': itm.type==='divider',
                    }" 
                    @click="close(itm)"
                  >
                    <wl-icon v-if="itm.type!=='divider'" :name="itm.icon" size="16" style="margin-right: 8px;" />
                    <div v-if="itm.type!=='divider'" class="lb">
                      <div class="line1">
                        {{itm.label}}
                      </div>
                    </div>

                    <div v-if="itm.type==='divider'" style="border-top:1px solid rgba(255,255,255,.2); margin: 4px 4px;"></div>
                  </div>

                </div>
              `,
              props: ['parentRef', 'addList', 'onSelect'],
              methods: {
                close(itm) {
                  this.$popper.hideAll();
                  this.onSelect(itm);
                },
              }
            },
            {
              parentRef: this,
              addList: this.addList,
              onSelect: (itm) => {
                if (itm.label === 'Add a contact') {
                    this.addContact()
                }
              },
            }, // component props
            {
              reference: this.$refs.addbtn,
              closeTrigger: 'mousedown',
              arrowVisible: true,
              roundedCorner: true,
              borderRadius: '12px',
              appendToBody: true,
              theme: `${this.theme} ${this.themeColor}`,
              backgroundColor: this.themeColorList[this.theme][this.themeColor]['content'][1],
              options: {
                placement: 'bottom', 
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 2],
                    },
                  },
                ],
              },
            }, // popper props
            {
              opened: () => {this.addVisible = true},
              closed: () => {this.addVisible = false},
            } // popper eventlistener
          );
        } else {
          this.$popper.hideAll();
        }
      },

      addContact(name) {
        this.$modal.show(
          popContactCreate,
          {
            peoplename: name,
            onAdd: () => {
              this.selectTab1(1);
            },
          }, // component props
          {
            name: 'contact-create',
            clickToClose: false,
            frameless: false,
            shadow: true,
            resizable: false,
            resizeEdges: ['br', 'b', 'r'],
            draggable: '#pop-contact-create .head',
            roundedCorner: false,
            overlayVisible: true,
            overlayTransparent: 0,
            theme: this.theme,
            width: 374,
            height: 518,
            transition: true,
          }, // modal props
          {} // modal eventlistener
        );

      },


    }
}
</script>


<style lang="scss">
.contactsheader {
  @include flex(column);
  width: calc(100% - 32px);
  user-select: none;
  margin: 16px 16px 4px 16px;
  box-sizing: border-box;

  .row1 {
    @include flex;
    width: 100%;
    margin-bottom: 8px;

    .left {
      @include flex(row, space-between);
      flex-grow: 1;

      .dropdown {
        @include flex;

        .lb {
          font-size: 20px;
          opacity: .95;
          margin-right: 4px;
        }
      }
    }
  }

  .btn {
    height: 28px;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    margin-right: 8px;

    .lb {
      font-size: 14px;
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    &:hover {
      .lb {
        opacity: 0.9;
      }
    }

    &.active {

      .lb {
        opacity: 0.9;
        font-weight: 600;
      }
    }
  }



  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btnplus {
      margin-left: 4px;
    }
  }

  .btn-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .disabled {
      opacity: .4;
    }

    &:hover {
      background-color: rgba($color: black, $alpha: 0.07);
    }
    &:active, &.active {
      background-color: rgba($color: black, $alpha: 0.1);
    }
  }

}

/* theme ----- dark/hybrid */

.dark, .hybrid {

  .btn-circle {
    &:hover {
      background-color: rgba($color: white, $alpha: 0.07);
    }
    &:active, &.active {
      background-color: rgba($color: white, $alpha: 0.1);
    }
  }
}

</style>
