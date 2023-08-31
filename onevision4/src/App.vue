<template>
  <div id="app">
    <form v-if="!accesscodeValid" name='passcode' @submit="handleSubmit" class="form">
      <md-input
        name="assess"
        label=""
        htmlId="assess"
        type="password"
        :messageArr="error"
        :value="passcode"
        placeholder="Enter access code"
        @change="handleChange"
        :disabled="inputDisabled"
        class="input"
        shape="pill"
      />
      <md-button type="submit" color="green" aria-label="go" >Enter</md-button>
    </form>
    
    <Index v-if="accesscodeValid" />
  </div>
</template>

<script>
import Index from './components/index.vue'
import getQueryString from './utils/getQueryString'

export default {
  name: 'App',
  components: {
    Index
  },
  data() {
    return {
      accesscodeValid: false,
      inputDisabled: false,
      passcode: '',
      error: [],
    };
  },
  mounted() {
    if (sessionStorage.getItem(`access_code_${this.prototypeName}`) || !this.forceAuth && (window.location.hostname === 'localhost' || window.location.hostname === 'prototype.cisco.com')) {
      this.accesscodeValid = true;
    }
    const accesscode = getQueryString('accesscode');
    if (accesscode) {
      this.passcode = accesscode;
      this.validAccesscode();
    }
  },
  computed: {
    prototypeName() {
      return this.$store.state.prototypeName;
    },
    accessCode() {
      return this.$store.state.accessCode;
    },
    forceAuth() {
      return this.$store.state.forceAuth;
    },
  },
  methods: {
    handleChange(e) {
      this.passcode = e.target.value
    },

    handleSubmit(event) {
      event && event.preventDefault(); 
      this.inputDisabled = true;
      this.validAccesscode();
    },

    validAccesscode() {
      const msg = [
        {
          message: 'Invalid code',
          type: 'error'
        },
      ];

      if (this.passcode !== this.accessCode) {
        this.error = msg;
        this.inputDisabled = false;
      } else {
        this.error = [];
        this.accesscodeValid = true;
        sessionStorage.setItem(`access_code_${this.prototypeName}`, 'ok');
      }

      /*
      this.$ajax.post(
        `https://wzpo.net/webex/access.php`,
        this.$qs.stringify({
          page: this.prototypeName,
          code: this.passcode,
        })
      )
        .then(res=> {
          const msg = [
            {
              message: 'Access code is invalid',
              type: 'error'
            },
          ];

          if (res.data.errorcode !== '0') {
            this.error = msg;
            this.inputDisabled = false;
          } else {
            this.error = [];
            this.accesscodeValid = true;
            sessionStorage.setItem(`access_code_${this.prototypeName}`, 'ok');
          }
        })
        .catch(error=>{
          this.inputDisabled = false;
          console.log(error)
        });
        */
    },
  },
}
</script>

<style lang="scss">
  #app {
    display: flex;
    justify-content: center;
  }
  .form {
    display: flex;
    margin: 100px;

    .input {
      margin-right: 10px;
      width: 200px;
    }
  }
</style>
