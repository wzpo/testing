<template>
  <div class='signin' :class="[theme]">
    <div class="bg"></div>

    <div class="center" ref="center">

      <div class="content" :class="{ visible: contentVisible }">

        <div class="pane">
          <div class="title">
            {{ title }}
            <div v-if="page === 'page-no-meeting'" class="icon"><wl-icon name="arrow-down-bold" size="16" /></div>
          </div>
          <div v-if="page === 'page-with-meeting-name'" class="time">09:00 AM - 09:30 AM</div>
          <div v-if="page === 'page-with-meeting-name' || page === 'page-guest-name-email'" class="title2">If you're the meeting host, sign in to start the meeting.</div>
          
          <div v-show="page === 'page-guest'" class="inputwrap">
            <input v-model="displayname" :placeholder="`Display name`" class="email" @input="changeHandler"
              @click="setDisplayname" />
            <div v-show="displayname" class="close" @click="displayname = ''">
              <wl-icon name="cancel-bold" size="16" color="white" style="opacity:.7" />
            </div>
          </div>

          <span v-show="page === 'page-guest-name-email'" class="label">Name</span>
          <div v-show="page === 'page-guest-name-email'" class="inputwrap">
            <input v-model="displayname" :placeholder="`Display name`" class="email" @input="changeHandler"
              @click="setDisplayname" />
            <div v-show="displayname" class="close" @click="displayname = ''">
              <wl-icon name="cancel-bold" size="16" color="white" style="opacity:.7" />
            </div>
          </div>
          <span v-show="page === 'page-guest-name-email'" class="label">Email address</span>
          <input v-show="page === 'page-guest-name-email'" v-model="email" :placeholder="`Email address`" class="email" style="margin-bottom: 16px;" @input="changeHandler"
              @click="setEmail" />

          <md-checkbox v-show="page === 'page-guest' || page === 'page-guest-name-email'" value="Remember me" label="Remember me" htmlId="1" checked class="chbox" />
          <div class="btns">

            <md-button v-if="page === 'page-with-meeting-name'" class="btn md-button-solid btn-back" aria-label="x" :size="32">Sign in and
              join</md-button>
            <md-button v-if="page === 'page-with-meeting-name'" class="btn md-button-outline btn-back" aria-label="x" :size="32"
              @click="page = 'page-guest'">Join as a guest</md-button>

            <md-button v-if="page === 'page-guest'" class="btn md-button-solid btn-back" aria-label="x" :size="32"
              :disabled="!email && !displayname" @click="nextHandler">Next</md-button>

            <md-button v-if="page === 'page-guest-name-email'" class="btn md-button-solid btn-back" aria-label="x" :size="32"
              :disabled="!email || !displayname" @click="nextHandler">Join as a guest</md-button>

            <md-button v-if="page === 'page-no-meeting'" class="btn md-button-solid btn-back" aria-label="x" :size="32"
              style="margin-top:22px;">Sign in</md-button>
            <md-button v-if="page === 'page-no-meeting'" class="btn md-button-outline btn-back" aria-label="x" :size="32"
              @click="afterSignIn">Join a meeting</md-button>

            <div v-if="page === 'page-no-meeting'" class="txtlink">Create a new account</div>
            <div v-if="page === 'page-guest-name-email'" class="txtlink">Sign in</div>
          </div>

          <div v-if="page === 'page-signing-in'" class="spinner spinner32 spinner-animation"></div>

        </div>


      </div>

      <div class="logo" ref="logo"></div>

    </div>
    <topbar :showLogo="false" class="topbar" type="simple" @close="close"></topbar>
    <div v-if="contentVisible && (page === 'page-guest' || page === 'page-signing-in')" class="btn-circle btn-backtostep1" @click="page = 'page-with-meeting-name'">
      <wl-icon name="arrow-left-bold" size="20" />
    </div>
    <div class="bottom">
      <div class="cisco-logo">
        <svg width="153" height="22" viewBox="0 0 153 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_9676_476539)">
            <path
              d="M19.6605 5.78467H22.7529L18.2568 19.3752H14.7092L11.3488 9.11955L7.9884 19.3752H4.49613L0 5.78467H3.16473L6.35499 16.1126L9.70263 5.78467H13.063L16.466 16.1679L19.6605 5.78467Z"
              fill="white" />
            <path
              d="M36.0159 13.6713H25.9858C26.0784 14.3721 26.3412 15.0395 26.7514 15.6152C27.1148 16.1189 27.607 16.5156 28.1764 16.7637C28.7563 17.0142 29.3823 17.1403 30.014 17.1338C30.7142 17.1311 31.4083 17.0044 32.0643 16.7595C32.7443 16.5108 33.3794 16.1531 33.9444 15.7003L35.4204 17.8271C34.6677 18.4834 33.7913 18.9824 32.8427 19.2947C31.8685 19.6005 30.8522 19.7512 29.8311 19.7413C28.5735 19.7661 27.3313 19.461 26.2282 18.8565C25.1849 18.2718 24.3303 17.4011 23.7654 16.3469C23.1576 15.1913 22.8532 13.9004 22.8806 12.5951C22.8545 11.3021 23.1467 10.0225 23.7313 8.86891C24.2746 7.81964 25.1033 6.94524 26.1219 6.34648C27.1906 5.73142 28.4069 5.41962 29.6397 5.4447C30.8031 5.41251 31.951 5.71638 32.9461 6.31992C33.9412 6.92346 34.7412 7.80108 35.2503 8.84764C35.8123 10.005 36.0922 11.279 36.067 12.5654C36.0712 12.8503 36.0542 13.2204 36.0159 13.6713ZM33.0384 11.4169C32.947 10.4855 32.5473 9.6112 31.9026 8.93271C31.5936 8.6431 31.2295 8.41855 30.832 8.2724C30.4345 8.12626 30.0117 8.0615 29.5886 8.08198C29.1434 8.06159 28.6985 8.13092 28.2805 8.28583C27.8626 8.44075 27.48 8.67809 27.1555 8.98376C26.5131 9.65229 26.103 10.5099 25.9858 11.4296L33.0384 11.4169Z"
              fill="white" />
            <path
              d="M48.7047 6.35499C49.7394 6.96704 50.5879 7.84935 51.1591 8.90719C51.7698 10.0347 52.0803 11.3003 52.0608 12.5824C52.0804 13.8631 51.7698 15.1273 51.1591 16.2533C50.5878 17.316 49.7361 18.2018 48.6967 18.8145C47.6573 19.4272 46.4699 19.7433 45.2635 19.7285C44.4168 19.7463 43.5773 19.5702 42.8091 19.2138C42.1051 18.8743 41.4892 18.3764 41.0098 17.7591V19.3755H38.0322V0H41.0098V7.40139C41.4913 6.78823 42.1068 6.2935 42.8091 5.95514C43.5763 5.59525 44.4163 5.41764 45.2635 5.43619C46.4731 5.42139 47.6635 5.73923 48.7047 6.35499ZM47.0798 16.3554C47.6974 15.9757 48.1945 15.4284 48.5133 14.7773C48.8405 14.0911 49.0103 13.3405 49.0103 12.5802C49.0103 11.82 48.8405 11.0694 48.5133 10.3832C48.1932 9.73298 47.6964 9.18606 47.0798 8.8051C46.4244 8.43018 45.6825 8.23295 44.9274 8.23295C44.1724 8.23295 43.4304 8.43018 42.7751 8.8051C42.1569 9.18049 41.656 9.7212 41.3288 10.3662C40.975 11.0551 40.7968 11.8208 40.8099 12.5951C40.7964 13.3682 40.9747 14.1325 41.3288 14.8198C41.656 15.4648 42.1569 16.0055 42.7751 16.3809C43.4304 16.7558 44.1724 16.9531 44.9274 16.9531C45.6825 16.9531 46.4244 16.7558 47.0798 16.3809V16.3554Z"
              fill="white" />
            <path
              d="M66.7526 13.6716H56.7267C56.8193 14.3724 57.0822 15.0399 57.4924 15.6156C57.8558 16.1193 58.348 16.516 58.9174 16.7641C59.4973 17.0145 60.1233 17.1406 60.755 17.1341C61.4551 17.1308 62.1491 17.0041 62.8052 16.7598C63.4853 16.5112 64.1203 16.1534 64.6854 15.7006L66.1571 17.8275C65.4066 18.4846 64.5314 18.9837 63.5837 19.295C62.6079 19.6006 61.5903 19.7513 60.5678 19.7416C59.3103 19.765 58.0685 19.4601 56.9649 18.8569C55.9237 18.2708 55.0709 17.4003 54.5063 16.3472C53.8973 15.192 53.5914 13.9011 53.6173 12.5955C53.5914 11.3025 53.8835 10.0229 54.468 8.86924C55.0113 7.81998 55.84 6.94558 56.8586 6.34682C57.9335 5.72277 59.1593 5.40639 60.4019 5.43228C61.565 5.40167 62.7123 5.7062 63.7071 6.30957C64.7019 6.91293 65.5022 7.78965 66.0125 8.83521C66.5745 9.99256 66.8544 11.2666 66.8292 12.5529C66.8122 12.8507 66.7824 13.2208 66.7526 13.6716ZM63.7751 11.4172C63.6769 10.4918 63.2762 9.62458 62.6351 8.95006C62.3282 8.65885 61.9661 8.43204 61.5701 8.283C61.1742 8.13397 60.7524 8.06573 60.3296 8.08231C59.8843 8.06144 59.4393 8.13054 59.0212 8.28548C58.6032 8.44042 58.2207 8.67802 57.8965 8.98409C57.2526 9.65158 56.8422 10.5097 56.7267 11.43L63.7751 11.4172Z"
              fill="white" />
            <path
              d="M80.8963 19.3752H77.2509L73.8054 14.6493L70.4025 19.3752H66.9272L72.0317 12.4374L67.0081 5.78467H70.6577L73.9756 10.3233L77.2935 5.78467H80.8198L75.7749 12.4119L80.8963 19.3752Z"
              fill="white" />
            <path
              d="M19.6605 5.78467H22.7529L18.2568 19.3752H14.7092L11.3488 9.11955L7.9884 19.3752H4.49613L0 5.78467H3.16473L6.35499 16.1126L9.70263 5.78467H13.063L16.466 16.1679L19.6605 5.78467Z"
              fill="white" />
            <path
              d="M36.0159 13.6714H25.9858C26.0784 14.3722 26.3412 15.0396 26.7514 15.6153C27.1148 16.119 27.607 16.5157 28.1764 16.7638C28.7563 17.0143 29.3823 17.1403 30.014 17.1339C30.7142 17.1312 31.4083 17.0045 32.0643 16.7595C32.7443 16.5109 33.3793 16.1531 33.9444 15.7004L35.4204 17.8272C34.6677 18.4835 33.7913 18.9825 32.8427 19.2947C31.8685 19.6005 30.8522 19.7513 29.8311 19.7414C28.5735 19.7662 27.3313 19.4611 26.2282 18.8566C25.1849 18.2719 24.3303 17.4011 23.7654 16.3469C23.1576 15.1914 22.8532 13.9005 22.8806 12.5952C22.8545 11.3022 23.1467 10.0226 23.7313 8.86897C24.2746 7.81971 25.1033 6.9453 26.1219 6.34654C27.1906 5.73148 28.4069 5.41969 29.6397 5.44476C30.8173 5.4211 31.9771 5.73394 32.9831 6.34654C33.9607 6.95586 34.7466 7.8287 35.2503 8.86472C35.8127 10.0204 36.0926 11.2931 36.067 12.5782C36.0712 12.8504 36.0542 13.2205 36.0159 13.6714ZM33.0384 11.4169C32.947 10.4855 32.5473 9.61127 31.9026 8.93277C31.5936 8.64316 31.2295 8.41861 30.832 8.27246C30.4345 8.12632 30.0117 8.06156 29.5886 8.08204C29.1434 8.06166 28.6985 8.13098 28.2805 8.28589C27.8626 8.44081 27.48 8.67815 27.1555 8.98382C26.5131 9.65235 26.103 10.5099 25.9858 11.4297L33.0384 11.4169Z"
              fill="white" />
            <path
              d="M48.7047 6.35499C49.7394 6.96704 50.5879 7.84935 51.1591 8.90719C51.7698 10.0347 52.0803 11.3003 52.0608 12.5824C52.0804 13.8631 51.7698 15.1273 51.1591 16.2533C50.5878 17.316 49.7361 18.2018 48.6967 18.8145C47.6573 19.4272 46.4699 19.7433 45.2635 19.7285C44.4168 19.7463 43.5773 19.5702 42.8091 19.2138C42.1051 18.8743 41.4892 18.3764 41.0098 17.7591V19.3755H38.0322V0H41.0098V7.40139C41.4913 6.78823 42.1068 6.2935 42.8091 5.95514C43.5763 5.59525 44.4163 5.41764 45.2635 5.43619C46.4731 5.42139 47.6635 5.73923 48.7047 6.35499ZM47.0798 16.3554C47.6974 15.9757 48.1945 15.4284 48.5133 14.7773C48.8405 14.0911 49.0103 13.3405 49.0103 12.5802C49.0103 11.82 48.8405 11.0694 48.5133 10.3832C48.1939 9.73362 47.6968 9.1879 47.0798 8.80936C46.4248 8.4332 45.6827 8.23525 44.9274 8.23525C44.1721 8.23525 43.43 8.4332 42.7751 8.80936C42.1569 9.18474 41.656 9.72545 41.3288 10.3705C40.975 11.0594 40.7968 11.825 40.8099 12.5994C40.7964 13.3724 40.9747 14.1368 41.3288 14.8241C41.656 15.4691 42.1569 16.0098 42.7751 16.3852C43.4304 16.7601 44.1724 16.9573 44.9274 16.9573C45.6825 16.9573 46.4244 16.7601 47.0798 16.3852V16.3554Z"
              fill="white" />
            <path
              d="M66.7527 13.6713H56.7267C56.8193 14.3721 57.0822 15.0395 57.4924 15.6152C57.8558 16.1189 58.348 16.5156 58.9174 16.7637C59.4973 17.0142 60.1233 17.1403 60.755 17.1338C61.4551 17.1305 62.1491 17.0038 62.8052 16.7595C63.4853 16.5108 64.1203 16.1531 64.6854 15.7003L66.1571 17.8271C65.4066 18.4843 64.5314 18.9834 63.5837 19.2947C62.6079 19.6002 61.5903 19.7509 60.5678 19.7413C59.3104 19.7647 58.0685 19.4597 56.9649 18.8565C55.9237 18.2704 55.0709 17.3999 54.5063 16.3469C53.8973 15.1917 53.5914 13.9008 53.6173 12.5951C53.5914 11.3021 53.8835 10.0225 54.468 8.8689C55.0113 7.81963 55.84 6.94523 56.8586 6.34647C57.9335 5.72243 59.1593 5.40605 60.4019 5.43193C61.5652 5.40027 62.7129 5.70436 63.7079 6.30784C64.7029 6.91132 65.503 7.78864 66.0125 8.83487C66.575 9.99056 66.8549 11.2633 66.8292 12.5483C66.8122 12.8503 66.7824 13.2204 66.7527 13.6713ZM63.7751 11.4168C63.6769 10.4914 63.2762 9.62423 62.6351 8.94972C62.3282 8.6585 61.9661 8.43169 61.5701 8.28266C61.1742 8.13362 60.7524 8.06539 60.3296 8.08197C59.8843 8.0611 59.4393 8.1302 59.0212 8.28514C58.6032 8.44007 58.2207 8.67768 57.8965 8.98375C57.2526 9.65123 56.8422 10.5093 56.7267 11.4296L63.7751 11.4168Z"
              fill="white" />
            <path
              d="M80.8963 19.3752H77.2509L73.8054 14.6493L70.4025 19.3752H66.9272L72.0317 12.4374L67.0081 5.78467H70.6577L73.9756 10.3233L77.2935 5.78467H80.8198L75.7749 12.4119L80.8963 19.3752Z"
              fill="white" />
            <path
              d="M88.9014 19.3499H87.8252V9.56641H89.1311V13.2671C89.391 12.8836 89.7448 12.5732 90.1589 12.3654C90.5729 12.1576 91.0333 12.0595 91.4961 12.0803C91.9493 12.0592 92.401 12.147 92.8133 12.3365C93.2255 12.526 93.5863 12.8115 93.8654 13.1693C94.3945 13.9293 94.6563 14.8434 94.6098 15.7683C94.6098 17.0444 94.2738 18.027 93.5932 18.7033C93.3049 18.9863 92.962 19.2077 92.5853 19.3539C92.2087 19.5002 91.8063 19.5683 91.4025 19.554C90.9536 19.5771 90.5062 19.4839 90.1038 19.2835C89.7014 19.083 89.3576 18.7821 89.1056 18.4098L88.9014 19.3499ZM93.2401 15.7385C93.2678 15.3775 93.2229 15.0147 93.1082 14.6714C92.9936 14.328 92.8113 14.0111 92.5723 13.7393C92.3923 13.5558 92.176 13.4119 91.9372 13.3167C91.6984 13.2215 91.4425 13.1771 91.1856 13.1863C90.8846 13.1741 90.585 13.2328 90.3109 13.3577C90.0368 13.4826 89.7958 13.6701 89.6075 13.9052C89.2144 14.433 89.0174 15.0812 89.0503 15.7385C88.9976 16.4932 89.2366 17.2393 89.7181 17.8228C89.9013 18.0289 90.128 18.1919 90.3817 18.3C90.6355 18.4081 90.91 18.4587 91.1856 18.4481C91.486 18.4628 91.7852 18.401 92.0553 18.2686C92.3253 18.1362 92.5574 17.9374 92.7297 17.6909C93.1 17.1096 93.2786 16.4267 93.2401 15.7385Z"
              fill="white" />
            <path
              d="M101.59 12.2764L99.1106 19.4438C98.9119 20.1404 98.5954 20.7979 98.1748 21.3877C98.0062 21.5861 97.7952 21.7442 97.5575 21.8502C97.3197 21.9562 97.0611 22.0075 96.8009 22.0003C96.5135 21.9948 96.2279 21.9548 95.9501 21.8812V20.8177C96.1722 20.8777 96.4007 20.9106 96.6307 20.9156C96.7553 20.9218 96.8796 20.8984 96.9934 20.8474C97.1073 20.7964 97.2075 20.7192 97.2858 20.6221C97.5355 20.2243 97.7314 19.7952 97.8685 19.346H97.4432L94.8569 12.2764H96.2734L98.2854 18.2911L100.285 12.2806L101.59 12.2764Z"
              fill="white" />
            <path d="M119.822 9.5708H117.346V19.384H119.822V9.5708Z" fill="white" />
            <path
              d="M139.785 12.3821C139.147 12.0347 138.431 11.8547 137.704 11.8589C137.352 11.8447 137 11.9019 136.67 12.0271C136.34 12.1522 136.038 12.3428 135.784 12.5873C135.529 12.8318 135.327 13.1253 135.188 13.45C135.05 13.7747 134.979 14.1241 134.979 14.4771C134.979 14.8301 135.05 15.1794 135.188 15.5041C135.327 15.8289 135.529 16.1223 135.784 16.3668C136.038 16.6113 136.34 16.8019 136.67 16.9271C137 17.0522 137.352 17.1094 137.704 17.0952C138.429 17.1038 139.145 16.9297 139.785 16.589V19.2263C139.052 19.4509 138.292 19.5683 137.526 19.5751C134.744 19.5666 132.29 17.6354 132.29 14.4622C132.29 11.5314 134.501 9.3833 137.513 9.3833C138.28 9.38586 139.041 9.5049 139.772 9.73636L139.785 12.3821Z"
              fill="white" />
            <path
              d="M113.939 12.3821C113.305 12.0368 112.594 11.8568 111.871 11.8589C111.519 11.8447 111.167 11.9019 110.837 12.0271C110.507 12.1522 110.205 12.3428 109.951 12.5873C109.696 12.8318 109.494 13.1253 109.355 13.45C109.217 13.7747 109.146 14.1241 109.146 14.4771C109.146 14.8301 109.217 15.1794 109.355 15.5041C109.494 15.8289 109.696 16.1223 109.951 16.3668C110.205 16.6113 110.507 16.8019 110.837 16.9271C111.167 17.0522 111.519 17.1094 111.871 17.0952C112.592 17.1016 113.303 16.9276 113.939 16.589V19.2263C113.207 19.4509 112.446 19.5683 111.68 19.5751C108.894 19.5666 106.457 17.6354 106.457 14.4622C106.457 11.5314 108.668 9.3833 111.68 9.3833C112.447 9.38539 113.208 9.50445 113.939 9.73636V12.3821Z"
              fill="white" />
            <path
              d="M147.573 11.9102C147.061 11.9103 146.561 12.0625 146.135 12.3475C145.71 12.6326 145.379 13.0376 145.185 13.5111C144.99 13.9847 144.941 14.5053 145.043 15.007C145.145 15.5086 145.394 15.9686 145.758 16.3285C146.122 16.6884 146.585 16.9319 147.088 17.0282C147.59 17.1244 148.11 17.069 148.582 16.869C149.053 16.669 149.454 16.3334 149.734 15.9049C150.014 15.4764 150.161 14.9743 150.155 14.4624C150.159 14.1248 150.096 13.7897 149.969 13.4766C149.843 13.1635 149.655 12.8786 149.418 12.6385C149.18 12.3983 148.898 12.2077 148.586 12.0775C148.275 11.9474 147.94 11.8804 147.603 11.8805L147.573 11.9102ZM152.758 14.4624C152.779 15.4922 152.493 16.505 151.936 17.3716C151.38 18.2382 150.577 18.9193 149.632 19.3281C148.686 19.7369 147.641 19.8549 146.628 19.667C145.615 19.4791 144.681 18.9938 143.946 18.2731C143.21 17.5523 142.705 16.6288 142.496 15.6201C142.288 14.6115 142.384 13.5635 142.773 12.6098C143.162 11.6561 143.826 10.84 144.681 10.2654C145.536 9.69075 146.543 9.38377 147.573 9.38355C148.25 9.36349 148.925 9.48036 149.556 9.72714C150.187 9.97392 150.762 10.3455 151.246 10.8198C151.73 11.294 152.114 11.861 152.373 12.4869C152.633 13.1129 152.764 13.7848 152.758 14.4624Z"
              fill="white" />
            <path
              d="M129.21 11.7996C128.578 11.6282 127.928 11.5284 127.274 11.5018C126.283 11.5018 125.743 11.8336 125.743 12.3058C125.743 12.9013 126.47 13.1097 126.879 13.2416L127.559 13.4585C129.167 13.969 129.899 15.0707 129.899 16.266C129.899 18.7288 127.734 19.5583 125.836 19.5583C124.94 19.5496 124.046 19.4599 123.165 19.2903V17.0146C123.926 17.2361 124.712 17.359 125.505 17.3804C126.734 17.3804 127.304 17.0189 127.304 16.4616C127.304 15.9044 126.811 15.6789 126.198 15.4875L125.671 15.3131C124.292 14.8878 123.14 14.0668 123.14 12.4462C123.14 10.6086 124.514 9.375 126.798 9.375C127.611 9.38531 128.421 9.49095 129.21 9.68977V11.7996Z"
              fill="white" />
          </g>
          <defs>
            <clipPath id="clip0_9676_476539">
              <rect width="152.758" height="22" fill="white" />
            </clipPath>
          </defs>
        </svg>

      </div>
      <div v-if="page === 'page-with-meeting-name' || page === 'page-guest-name-email' || page === 'page-no-meeting'" class="cpy">By using Webex you accept the <span class="link">Term of
          Service</span>, <span class="link">Privacy Statement</span>, and <span class="link">Notices and
          Disclaimers</span>. <span class="link">Learn more about Webex</span>.</div>

      <svg v-if="os == 'win'" class="icomore" width="32" height="32" viewBox="0 0 32 32" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="white" fill-opacity="0.95" />
        <path
          d="M16 16.75C16.4142 16.75 16.75 16.4142 16.75 16C16.75 15.5858 16.4142 15.25 16 15.25C15.5858 15.25 15.25 15.5858 15.25 16C15.25 16.4142 15.5858 16.75 16 16.75Z"
          fill="black" fill-opacity="0.95" />
        <path
          d="M12.25 16.75C12.6642 16.75 13 16.4142 13 16C13 15.5858 12.6642 15.25 12.25 15.25C11.8358 15.25 11.5 15.5858 11.5 16C11.5 16.4142 11.8358 16.75 12.25 16.75Z"
          fill="black" fill-opacity="0.95" />
        <path
          d="M19.75 16.75C20.1642 16.75 20.5 16.4142 20.5 16C20.5 15.5858 20.1642 15.25 19.75 15.25C19.3358 15.25 19 15.5858 19 16C19 16.4142 19.3358 16.75 19.75 16.75Z"
          fill="black" fill-opacity="0.95" />
      </svg>

    </div>

    <div v-show="accessPopup" class="popup">
      <div v-show="accessPopup == 'mic'" class="img mic">
        <wl-hot :rect="{x:164,y:236,w:110,h:29}" @click.native="() => { accessPopup = 'cam' }" />
      </div>
      <div v-show="accessPopup == 'cam'" class="img cam">
        <wl-hot :rect="{x:164,y:236,w:110,h:29}" @click.native="() => { accessPopup = ''; afterSignIn() }" />
      </div>
    </div>
  </div>
</template>

<script>

import mframe from 'mframe';
export default {
  props: {
    defaultPage: {
      type: String,
    },
    teamsOption: {
      type: Object,
    },
    gotoAfterSignIn: {
      type: String,
      default: 'meeting',
    },
    closeAfterSignIn: {
      type: Boolean,
    },
  },
  data() {
    return {
      meetingTitle: 'Feature Planning Meeting',
      contentVisible: false,

      displayname: '',
      email: '',
      page: 'page-guest',

      accessPopup: null,
    }
  },
  computed: {
    title() {
      if(this.page === 'page-guest-name-email') {
        return 'Join meeting'
      } else if (this.page === 'page-guest') {
        return 'Join as a guest'
      } else if (this.page === 'page-no-meeting') {
        return 'Webex'
      } else if (this.page === 'page-signing-in') {
        return 'Signing in...'
      } else {
        return this.meetingTitle //'Join meeting'
      }
    },
    os() {
      return this.$store.state.os;
    },
    theme() {
      return this.$store.state.theme;
    },
    me() {
      return this.$store.getters.me;
    },

  },
  mounted() {
    if (this.defaultPage) {
      this.page = this.defaultPage
    } else {
      if (this.os === 'win') {
        this.page = 'page-guest'
      }
      else if (this.os === 'mac') {
        this.page = 'page-with-meeting-name'
      }
    }

    const rect1 = this.$refs.center.getBoundingClientRect();
    const rect2 = this.$refs.logo.getBoundingClientRect();
    const trans = mframe([{
      dom: this.$refs.logo,
      frames: [
        {
          css: {
            left: `${(rect1.width - rect2.width) / 2}px`,
            top: `${(rect1.height - rect2.height) / 2}px`,
            transform: `scale(1)`,
          }, time: 0
        },
        {
          css: {
            left: '148px',
            top: '-50px',
            transform: `scale(0.7)`,
          }, time: 40, tween: 'easeInOut'
        }
      ]
    }]);
    setTimeout(() => {
      trans.play();
      this.contentVisible = true;
    }, 2000);

    if (this.page === 'page-signing-in') {
      setTimeout(() => {
        this.afterSignIn()
      }, 4000);
    }
    
  },
  watch: {

  },
  methods: {
    setDisplayname() {
      this.displayname = this.me.name
    },
    setEmail() {
      this.email = `${this.me.name.toLowerCase().replace(/ /g, '.')}@company.com`
    },
    changeHandler() {

    },
    nextHandler() {
      if (this.os === 'win') {
        this.afterSignIn()
      } else {
        this.accessPopup = 'mic'
      }
    },
    afterSignIn() {
      if (this.gotoAfterSignIn === 'teams') {
        this.openTeams()
      } else if (this.gotoAfterSignIn === 'meeting') {
        this.openInterstitial()
      }

      if (this.closeAfterSignIn) {
        this.close()
      }
    },
    openInterstitial() {
      this.page = 'page-no-meeting'
      this.$store.commit('meetingTitle', this.meetingTitle);
      this.$store.commit('interstitialParams', { visible: true, host: false });
    },
    openTeams() {
        this.$eventBus.$emit('open-team-window', this.teamsOption ? this.teamsOption : { }, {

        });
    },
    close() {
      this.$emit('close')
    },

  }
}
</script>


<style lang="scss">
.signin {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  .popup {
    position: absolute;
    width: 100%;
    height: 100%;

    $imgw: calc(638px / 2);
    $imgh: calc(704px / 2);

    .img {
      position: absolute;
      width: $imgw;
      height: $imgh;
      left: calc((100% - $imgw)/2);
      top: calc((100% - $imgh)/2);
      background-size: $imgw $imgh;
      background-position: 0 0;
      background-repeat: no-repeat;
    }

    .mic {
      background-image: url(~@/components/onboarding/img/joinbylink-mac-access-mic.png);
    }

    .cam {
      background-image: url(~@/components/onboarding/img/joinbylink-mac-access-cam.png);
    }
  }

  .bg {
    position: absolute;
    transition: all .6s ease;
    width: 100%;
    height: 100%;
    background-image: url('../assets/img/sign-bg-light.png');
    background-size: cover;
    background-color: rgb(16, 16, 16);
  }

  .topbar {
    position: absolute;
    top: 0;
    width: 100%;
    height: 32px;
  }

  .center {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: 530px;

    .logo {
      position: absolute;
      display: flex;
      width: 293px;
      height: 293px;
      top: calc((100% - 293px) / 2);
      left: calc((100% - 293px) / 2);
      transform-origin: 0 0;

      background-image: url('../assets/img/webex-logo-animated.webp');
      background-size: 293px 293px;
      background-position: left;
      background-repeat: no-repeat;
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      transition: all .6s ease;

      opacity: 0;
      margin-top: 200px;

      .pane {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        border-radius: 2px;
        padding: 30px;
        padding-top: 112px;
        margin-bottom: 48px;
        transition: all .3s ease;

        .title {
          @include flex;
          font-size: 26px;
          text-align: center;

          .icon {
            @include flex;
            width: 32px;
            height: 32px;
          }
        }

        .title2 {
          font-size: 15px;
          margin-bottom: 32px;
          text-align: center;
        }

        .time {
          font-size: 14px;
          margin-bottom: 16px;
          opacity: .7;
          text-align: center;
        }

        .label {
          @include flex(row, flex-start);
          width: 260px;
          padding-left: 4px;
          opacity: .95;
          font-size: 14px;
        }

        .inputwrap {
          @include flex;
          position: relative;
          width: 260px;
          height: 32px;
          margin-bottom: 12px;

          .close {
            position: absolute;
            @include flex;
            width: 16px;
            height: 16px;
            top: 8px;
            right: 8px;
          }
        }

        .email {
          @include focus-styles;
          color: white;
          box-sizing: border-box;
          width: 260px;
          height: 32px;
          line-height: 32px;
          font-size: 16px;
          padding: 0 8px;

          background: black;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 8px;

          &::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }

          &:focus {
            border: 1px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0px 0px 0px 2px #000000, 0px 0px 0px 5px rgba(100, 180, 250, 0.3), 0px 0px 0px 4px #64B4FA;
          }
        }

        .chbox {
          width: 260px;

          span {
            font-size: 14px;
            opacity: .95;
          }
        }

        .btns {
          @include flex(column);
          position: relative;
          margin-top: 4px;
          margin-bottom: 32px;

          .btn {
            width: 260px;
            box-sizing: border-box;
            margin-bottom: 16px;
            font-size: 16px;
            font-weight: 600;
          }

          .txtlink {
            font-size: 16px;
            color: $text-color-hyperlink-dark-ui;
            cursor: pointer;
          }
        }


        .spinner {
          margin-top: 30px;
        }

      }


      .links {
        transition: all .3s ease;

        .link1,
        .link2 {
          width: 100%;
          text-align: center;
          font-size: 12px;
        }
      }


      &.visible {
        opacity: 1;
        margin-top: 0;
        transition-delay: .2s;

        .others {
          .ico {
            svg {
              top: 0;
            }

            .disabled {
              opacity: 1;
            }
          }
        }

      }
    }

  }

  .btn-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    box-sizing: border-box;
    border: 1px solid rgba($color: #FFF, $alpha: .3);

    &:hover {
      border: 1px solid rgba($color: #FFF, $alpha: .5);
      background-color: rgba($color: #FFF, $alpha: .07);
    }

    &:active,
    &.active {
      border: 1px solid rgba($color: #FFF, $alpha: .9);
      background-color: rgba($color: #FFF, $alpha: .2);
    }

    .badge {
      top: -6px;
      right: -8px;
    }
  }

  .btn-backtostep1 {
    position: absolute;
    left: 80px;
    top: calc((100% - 40px)/2);
  }

  .bottom {
    @include flex;
    position: absolute;
    width: 100%;
    bottom: 0;
    font-size: 14px;
    margin-bottom: 20px;

    .cisco-logo {
      width: 153px;
      height: 22px;

      path {
        fill: #545454;
      }
    }

    .cpy {
      margin-left: 5px;
      color: $text-color-secondary-light-ui;
    }

    .icomore {
      position: absolute;
      right: 32px;
      bottom: 4px;
    }
  }

  .link {
    color: $text-color-hyperlink-light-ui;
    text-decoration: underline;
    cursor: pointer;
  }
}


@keyframes logo-animation {
  0% {
    background-position: left;
  }

  0.1% {
    background-position: right;
  }

  100% {
    background-position: right;
  }
}

/* theme ----- dark/hybrid */
.dark,
.hybrid {
  .signin {

    .bg {
      background: url('../assets/img/sign-bg-dark.png') no-repeat;
    }

    .bottom {
      @include flex;

      .cisco-logo {
        path {
          fill: #FFFFFF;
        }
      }

      .cpy {
        color: $text-color-secondary-dark-ui;
      }
    }

    .link {
      color: $text-color-hyperlink-dark-ui;
    }

  }
}</style>
