<template>
    <div class="pop_fte">
      <div class="tt">{{title}}</div>
      <div class="msg">{{message}}</div>
      <div class="sub" v-if="btn || btn2">
        <div class="btn" v-if="btn" @click="onBtn">{{btn}}</div>
        <div class="btn2" v-if="btn2" @click="onBtn2">{{btn2}}</div>
      </div>
    </div>
</template>

<script>

export default {
  props: [
    'title',
    'message',
    'btn',
    'btn2',
    'func',
    'func2',
  ],
  data() {
    return {};
  },
  computed: {
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },

  },
  mounted() {},
  watch: {

  },
  methods: {
    onBtn() {
      if (this.func) {
        this.func();
      }
      this.close();
    },
    onBtn2() {
      if (this.func2) {
        this.func2();
      }
      this.close();
    },
    close() {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss">
.pop_fte {
  width:340px; 
  display:flex; 
  flex-direction: column;
  color: white;
  margin: 15px;

  .tt {
    font-weight: bold;
    margin-bottom: 8px;
  }
  .msg {
    margin-bottom: 12px;
  }
  .sub {
    display:flex; 

    .btn {
      margin-bottom: 8px;
      padding: 0 15px;
      height: 28px; 
      box-sizing: border-box; 
      border: 1px solid white; 
      border-radius: 14px; 
      display:flex; 
      align-items: center; 
      justify-content: center;
      cursor: pointer;
    }
    .btn2 {
      margin-left: 10px;
      text-decoration: underline;
      cursor: pointer;
    }
  }


}

</style>
