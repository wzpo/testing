<template>
    <div id="reaction-stack" :class="[theme]" :style="{opacity: reactionStackVisible ? 1 : 0}">
      
      <div 
        class="hoverbg" 
        v-show="reactionVisibleCount > 0"
        :style="{
          bottom: '0',
          height: `${hoverbgHeight}px`,
          width: '170px',
        }"
      >
        <div class="hd" @click="toggle" v-tooltip="'Collapse Reactions'">
          <wl-icon
            name="arrow-down-filled" 
            :color=" theme === 'light' ? 'black-95' : 'white-95' "
            size="8"
          />
        </div>
      </div>

      <div 
        class="wrap mask" 
        :style="{
          bottom: '15px',
        }"
      >
        
        <reaction-item 
          class="itm0"
          :classid="0"
          :animationName="animationName_itm0"
          :name="attendeeName_itm0"
        ></reaction-item>

        <reaction-item 
          class="itm1"
          :classid="1"
          :animationName="animationName_itm1"
          :name="attendeeName_itm1"
        ></reaction-item>

        <reaction-item 
          class="itm2"
          :classid="2"
          :animationName="animationName_itm2"
          :name="attendeeName_itm2"
        ></reaction-item>

        <reaction-item 
          class="itm3"
          :classid="3"
          :animationName="animationName_itm3"
          :name="attendeeName_itm3"
        ></reaction-item>

        <reaction-item 
          class="itm4"
          :classid="4"
          :animationName="animationName_itm4"
          :name="attendeeName_itm4"
        ></reaction-item>


        <reaction-item 
          class="itm5"
          :classid="5"
          :animationName="animationName_itm5"
          :name="attendeeName_itm5"
        ></reaction-item>


        <reaction-item 
          class="itm6"
          :classid="6"
          :animationName="animationName_itm6"
          :name="attendeeName_itm6"
        ></reaction-item>

        <reaction-item 
          class="itm7"
          :classid="7"
          :animationName="animationName_itm7"
          :name="attendeeName_itm7"
        ></reaction-item>

        <reaction-item 
          class="itm8"
          :classid="8"
          :animationName="animationName_itm8"
          :name="attendeeName_itm8"
        ></reaction-item>


        <reaction-item 
          class="itm9"
          :classid="9"
          :animationName="animationName_itm9"
          :name="attendeeName_itm9"
        ></reaction-item>


        <reaction-item 
          class="itm10"
          :classid="10"
          :animationName="animationName_itm10"
          :name="attendeeName_itm10"
        ></reaction-item>

        <reaction-item 
          class="itm11"
          :classid="11"
          :animationName="animationName_itm11"
          :name="attendeeName_itm11"
        ></reaction-item>
        
      </div>
    </div>
</template>

<script>
import mframe from 'mframe'
import _ from 'lodash';

export default {
  props: {
    meetingId: String,
  },
  data() {
    return {
      rolling: false,
      list: ['itm0', 'itm1', 'itm2', 'itm3', 'itm4', 'itm5', 'itm6', 'itm7', 'itm8', 'itm9', 'itm10', 'itm11'],

      animationName_itm0: null,
      animationName_itm1: null,
      animationName_itm2: null,
      animationName_itm3: null,
      animationName_itm4: null,
      animationName_itm5: null,
      animationName_itm6: null,
      animationName_itm7: null,
      animationName_itm8: null,
      animationName_itm9: null,
      animationName_itm10: null,
      animationName_itm11: null,

      attendeeName_itm0: null,
      attendeeName_itm1: null,
      attendeeName_itm2: null,
      attendeeName_itm3: null,
      attendeeName_itm4: null,
      attendeeName_itm5: null,
      attendeeName_itm6: null,
      attendeeName_itm7: null,
      attendeeName_itm8: null,
      attendeeName_itm9: null,
      attendeeName_itm10: null,
      attendeeName_itm11: null,
      
      timeoutid: null,
      currentItmId: 0,
      mframeList: {},

      hoverbgHeight: 190,

      transList: [],
      transFadeIn: null,
      auto_add_interval: 1800,
      add_timeout_id: 0,
      reactionSendOnGridFirst: 4,
      cooldown: 0,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    me() {
      return this.$store.getters.me;
    },
    peopleList() {
      return this.$store.state.peopleList;
    },
    autoPlayReactions() {
      return this.$store.state.autoPlayReactions;
    },
    reactionList() {
      return this.$store.state.reactionList;
    },
    reactionVisibleCount() {
      return this.$store.state.reactionVisibleCount;
    },
    videoLayout() {
      return this.$store.getters.videoLayout(this.meetingId);
    },
    reactionStackVisible() {
      return this.$store.state.reactionStackVisible;
    },
    reactionAnimations() {
      return this.$store.state.reactionAnimations;
    },
    reactionAnimationNames() {
      return this.$store.getters.reactionAnimationNames;
    },

  },
  mounted() {

  },
  beforeDestroy() {
    clearTimeout(this.add_timeout_id);
  },
  watch: {
    autoPlayReactions(val) {
      if (val) {
        this.start();
      } else {
        clearTimeout(this.add_timeout_id);
      }
    },
    reactionList(newVal) {
      if (newVal !== null && newVal.length > 0) {
        const reaction = newVal[newVal.length - 1];
        if (this.$store.getters.peopleIsInMeeting(reaction.attendeeName) && reaction.attendeeName !== this.me) {
          return;
        }
        this.rolling = true;
        clearTimeout(this.timeoutid);
        this[`animationName_${this.list[this.currentItmId]}`] = reaction.animationName;
        this[`attendeeName_${this.list[this.currentItmId]}`] = reaction.attendeeName;
        this.roll();
      }
    },
  },
  methods: {

    start() {
      // add others reaction
      const rlst = this.reactionAnimationNames;

      let plst1 = [
        "Emma Hirst",
        "Adrian Delamico",
        "David Liam",
        "Catherine Sinu",
        "Giacomo Edwards",
        "Anastasia Teng",
        "Benoit Lapointe",
      ];

      const plst = [
        "Emma Hirst",
        "Adrian Delamico",
        "David Liam",
        "Sherry Mckenna",
        "Barbara German",
        "Catherine Sinu",
        "Giacomo Edwards",
        "Anastasia Teng",
        "Benjamin Vitali",
        "James Weston",
        "Benoit Lapointe",
        "Kate Robertson",
        "Marc Brown",
        "Maria Rossi",
        "Marissa Reena",
        "Peter Hogan",
        "Dheeraj Bhasin",
        "Gaurav Bacchan",
        "Sadie Harris",
        "Harish Mohanty",
        "Shivani Gupta",
      ];
      const reaction = rlst[_.random(0, rlst.length-1)];
      const pname = plst[_.random(0, plst.length-1)]; //this.reactionSendOnGridFirst > 0 ? plst1[_.random(0, plst1.length-1)] : plst[_.random(0, plst.length-1)];

      let d = new Date();
      let time = d.getTime();
      if (plst1.indexOf(pname) > -1) {
        if(time - this.cooldown < 3000) {
          clearTimeout(this.add_timeout_id);
          this.start()
          return;
        }
        this.cooldown = time;
      }

      this.reactionList.push({
        animationName: reaction,
        attendeeName: pname,
      })
      this.$store.commit('reactionList', this.reactionList);

      if (!this.$store.getters.peopleIsInMeeting(pname)) {

        this.$store.commit('reactionVisibleCount', Math.min(this.reactionVisibleCount+1, 7));
      }

      this.reactionSendOnGridFirst--;

      // set reaction
      let plist = [];
      const len = this.peopleList.length;
      for (let i = 0; i < len; i++) {
          const p = this.peopleList[i];
          if (p.name === pname) {
              p.reaction = reaction;
          }
          plist.push(p);
      }
      this.$store.commit("doNotAutoChangeZoom", true);
      this.$store.commit("peopleList", plist);

      this.add_timeout_id = setTimeout(() => {
        /*
        if (this.auto_add_interval > 300 && this.auto_add_interval < 500) {
          this.auto_add_interval -= 50;
        } else if (this.auto_add_interval < 200) {
          this.auto_add_interval += 1000;
        } else if (this.auto_add_interval < 300) {
          this.auto_add_interval -= 5;
        } else {
          this.auto_add_interval -= 100;
        }
        */
        this.auto_add_interval = _.random(500, 2000);

        this.start();
      }, this.auto_add_interval);
    },

    roll() {
      if (!this.autoPlayReactions) {
        return;
      }

      // MC============

      for(let j = 0; j < this.transList.length; j++) {
        this.transList[j].stop();
      }

      const dur = 5;
      const cid = this.currentItmId;

      if (this.mframeList['mframe' + cid]) {
        this.mframeList['mframe' + cid].stop();
        if (typeof this.mframeList['mframe' + cid].state === 'function') {
          this.mframeList['mframe' + cid].state(dur+15, true);
        }
      }

      let i = this.currentItmId;
      if (this.currentItmId < this.list.length - 1) {
        this.currentItmId++;
      } else {
        this.currentItmId = 0;
      }
      const itm = document.querySelector(`#reaction-stack .${this.list[i]}`);

      itm.style.left = '10px'; 
      itm.style.top = '345px'; 
      itm.style.opacity = '1.0'; 
      itm.style.transform = 'scale(1.0)'; 

      this.hoverbgHeight = 36 * Math.min(this.reactionVisibleCount, 6) + 20;

      this.transFadeIn = mframe([{
          dom: itm,
          frames: [ 
              { css: {transform: 'scale(0.5, 0.0)', opacity: '0.0'}, time: 0},
              { css: {transform: 'scale(1.0, 1.0)', opacity: '0.5'}, time: dur, tween: 'easeInOut'},
              { css: {transform: 'scale(1.0, 1.0)', opacity: '1.0'}, time: dur+15, tween: 'easeInOut'},
              { css: {transform: 'scale(1.0, 1.0)', opacity: '1.0'}, time: 300},
              { css: {transform: 'scale(1.0, 1.0)', opacity: '0.0'}, time: 330, tween: 'easeInOut'},
          ]
      }], {
        end: () => {
          this[`animationName_${this.list[i]}`] = null;
          this[`attendeeName_${this.list[i]}`] = null;
          this.mframeList['mframe' + i] = null;

          this.hoverbgHeight = 36 * Math.min((this.reactionVisibleCount-1), 11) + 20;
          this.$store.commit('reactionVisibleCount', Math.max((this.reactionVisibleCount-1), 0));
        }
      });
      this.transFadeIn.play();
      this.mframeList['mframe' + i] = this.transFadeIn;

      this.moveUp(i);

      
    },

    moveUp(exceptId) {
      for(let i=0; i<=this.list.length; i++) {
        if (exceptId !== i) {
          const el = document.querySelector(`#reaction-stack .${this.list[i]}`);
          if (el) {
            const rect = el.getBoundingClientRect();
            const rectP = document.querySelector(`#reaction-stack .wrap`).getBoundingClientRect();
            let top1 = `${rect.top - rectP.top}px`;
            let top2 = `${rect.top - rectP.top - 36}px`;
            let trans = mframe([{
                dom: el,
                frames: [ 
                    { css: {top: top1}, time: 0, tween: 'easeOut'},
                    { css: {top: top2}, time: 5, tween: 'easeOut' },
                ]
            }], { 
              end: () => {
                this.transList.shift();
              }
            });
            trans.play();
            this.transList.push(trans);
          }
          
        }
        
      }
    },
    toggle() {
      /*
      this.$store.commit('reactionStackVisible', false); 
      */
    },
    

  }
};
</script>

<style lang="scss">
#reaction-stack {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  align-items: center;

  .hoverbg {
    position: absolute;
    bottom: 0;
    pointer-events: auto;
    opacity: 0;
    display: flex;
    width: 170px;
    height: 200px;
    border-radius: 12px;
    background: linear-gradient(to top, rgba(0,0,0,.2) 0%, rgba(0,0,0,0) 100%);
    flex-direction: column;

    .hd {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &:hover {
    .hoverbg {
      opacity: 1;
    }
  }

  
  .wrap {
    position: absolute;
    width: 220px;
    height: 380px;
    left: 0;

    &.mask{
      mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,.3) 35%, rgba(0,0,0,0) 48%);
    }
  }

  /* ------------------ drak/hybrid ------------------ */

  &.dark,
  &.hybrid {
    .hoverbg {
      background: linear-gradient(to top, rgba($color: #292929, $alpha: 1) 0%, rgba($color: #292929, $alpha: 0.0) 100%);
    }
  }

}

</style>
