<template>
  <fragment>

    <notifications
        group="default" 
        :fixed="false" 
        :max="3"
        :width="400"
        :margin="50"
        animation-name="v-move-in"
      >
        <template slot="body" slot-scope="props">
        <div 
          class="notification-item" 
          :class="[theme]" 
          @click="() => {
            if(!props.item.data.button1Click) {
              props.item.data.click();
              props.close();
            }
          }">
          <div class="notification-item-l">
            <md-avatar 
              v-if="props.item.data.people"
              :src="$store.state.avatarPath+$store.getters.people(props.item.data.people).avatar" 
              :size="40"
              class="avatar"
            />
            <div v-if="props.item.data.iconhtml" class="iconhtml" v-html="props.item.data.iconhtml"></div>
            <wl-icon v-if="props.item.data.icon" class="ico" :name="props.item.data.icon" size="24" color="white" />
          </div>
          <div class="notification-item-r">
            <div v-if="props.item.title" class="notification-item-line1">
              {{props.item.title}}
            </div>
            <div 
              v-if="props.item.text" 
              class="notification-item-line2" 
              :class="{alginicon: !props.item.title}"
              v-html="props.item.text"
            >
            </div>
            <div v-if="props.item.data.button1Text" class="notification-item-line3">
              <md-button 
                class="btn md-button-solid" 
                aria-label="x" 
                size="28" 
                @click="() => {
                  props.item.data.button1Click();
                  props.close();
                }"
              >
                {{props.item.data.button1Text}}
              </md-button>
            </div>
          </div>
          <div v-if="props.item.data.closeable" class="notification-close" @click.stop="props.close">
            <wl-icon name="cancel-bold" size="16" />
          </div>
        </div>
      </template>
    </notifications>



    <notifications
      group="inmeeting" 
      :fixed="false" 
      :max="3"
      :width="360"
      :margin="90"
      animation-name="v-move-in"
    >
      <!--   ADD Template here     -->
    </notifications>




      
  </fragment>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted() {
    
  },
  watch: {},
  methods: {
  }
};
</script>

<style lang="scss" >
.notification-item {
  position: relative;
  display: flex;
  margin: 2px 5px;
  background: white;
  font-size: 14px;
  padding: 10px;
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.16);
  border-radius: 8px;

  .notification-item-l {
    position: relative;
    display: flex;
    justify-content: center;
    /*align-items: center;*/
    margin: 8px 8px 0 8px;

    .iconhtml {
      min-width: 32px;
      height: 32px;
    }
  }
  .notification-item-r {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;

    .defaultxt {
      font-size: 14px;
      line-height: 18px;
    }

    .notification-item-line1 {
      font-weight: 600;
      padding-right: 20px;
      opacity: .95;
    }
    .notification-item-line2 {
      padding-right: 20px;
      opacity: .95;

      &.alginicon {
        display: flex;
        align-items: center;
        min-height: 32px;
        margin-top: 8px;
      }
    }
    .notification-item-line3 {
      display: flex;
      flex-grow: 1;
      justify-content: flex-end;
      margin: 16px -8px -4px 0;

      .btn {
        margin-right: 8px;
        margin-bottom: 4px;
        padding: 0 10px;
        min-width: 0;
      }
    }
  }

  .notification-close {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nicon {
    width: 32px;
    height: 32px;
    background-repeat: no-repeat;
    background-size: contain;
  }

  /* ------------------ drak ------------------ */

  &.dark {
    background: $md-gray-95;
    color: $text-color-primary-dark-ui;
  }
}

.v-move-in-enter-active,
.v-move-in-move {
  transition: all 1.0s ease-out;
}
.v-move-in-leave-active {
  transition: all 1.2s ease-out;
}
.v-move-in-enter {
  opacity: 0;
  transform: translateX(300px);
}
.v-move-in-leave-to {
  opacity: 0;
  
}

</style>
