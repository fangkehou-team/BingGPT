<script setup>
import {ref} from "vue";

const urlWrapper = "https://www.bing.com/fd/auth/signin?action=interactive&provider=windows_live_id&return_url=";
let chatUrl = urlWrapper + encodeURIComponent(window.ipcRenderer.getChatUrl())
let composeUrl = urlWrapper + encodeURIComponent(window.ipcRenderer.getComposeUrl())

let tab = ref("0")
</script>

<template>
  <div class="tabs-container">
    <div class="tabs">
      <input id="chat" type="radio" class="tab tab-selector" checked="checked" name="tab" value="0" v-model="tab"/>
      <label for="chat" class="tab tab-primary">Chat</label>
      <input id="compose" type="radio" class="tab tab-selector" name="tab" value="1" v-model="tab"/>
      <label for="compose" class="tab tab-success">Compose</label>
    </div>
  </div>
  <iframe :hidden="tab != '0'" class="underside-iframe" :class="{ active: tab == '0' }" name="underside-iframe-container" frameborder="0"
          csp="frame-src https://www.bing.com/search https://edgeservices.bing.com/ https://www.bing.com/shop/productpage https://www.bing.com/images/create https://login.live.com/login.srf https://www.bing.com/turing/captcha/challenge https://www.bing.com/api/shopping/v1/edgeframe https://www.msn.com/widgets/fullpage/gaming/gamingfeed-widget https://challenges.cloudflare.com/ https://www.bing.com/lite/auw https://www.bing.com/travelgrowthedge/ux https://login.live.com/ https://login.microsoftonline.com/; base-uri 'self'; require-trusted-types-for 'script'; trusted-types default;"
          allow="clipboard-write;microphone;camera" :src="chatUrl"
          style="position: absolute; width: 100%; height: calc(100% - 37px);; top: 0; left: 0; padding-top: 37px"></iframe>
  <iframe :hidden="tab != '1'" class="underside-iframe" :class="{ active: tab == '1' }" name="underside-iframe-container" frameborder="0"
          csp="frame-src https://www.bing.com/search https://edgeservices.bing.com/ https://www.bing.com/shop/productpage https://www.bing.com/images/create https://login.live.com/login.srf https://www.bing.com/turing/captcha/challenge https://www.bing.com/api/shopping/v1/edgeframe https://www.msn.com/widgets/fullpage/gaming/gamingfeed-widget https://challenges.cloudflare.com/ https://www.bing.com/lite/auw https://www.bing.com/travelgrowthedge/ux https://login.live.com/ https://login.microsoftonline.com/; base-uri 'self'; require-trusted-types-for 'script'; trusted-types default;"
          allow="clipboard-write;microphone;camera" :src="composeUrl"
          style="position: absolute; width: 100%; height: calc(100% - 37px); top: 0; left: 0; padding-top: 37px"></iframe>
</template>

<style scoped>
.tabs-container {
  text-align: center;
  position: relative;
  border: 1px solid #BBB;
  box-shadow: 1px 1px 5px 0 rgba(50, 50, 50, 0.7);
  height: 36px;
  margin: 0 5px 0 5px;
  border-radius: 0 0 5px 5px;
  padding: 0;
  z-index: 999;
  background: #FFF;
}

@media (prefers-color-scheme: dark) {
  .tabs-container {
    background: #303030;
    border: 1px solid #212121;
    color: #E3ECF5;
    box-shadow: 1px 1px 5px 0 rgba(125, 125, 125, 0.5);
  }
}

.tabs {
  width: 40%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: inline-flex;
  align-items: flex-end;
  line-height: 18px;
  text-align: center;
}

.tabs input {
  position: absolute;
  opacity: 0;
  margin: 0;
  padding: 0;
  display: block;
}

.tabs label {
  font-family: sans-serif;
  min-width: 50%;
  padding-bottom: 5px;
}

.tabs input + label:hover {
  color: #777;
}

#chat + label:after,
#compose + label:after {
  content: "";
  background-color: #67b0d7;
  display: block;
  margin: 0 auto;
  width: 30px;
  height: 6px;
  border-radius: 3px;
  opacity: 0;
}

#chat:checked + label:after,
#compose:checked + label:after {
  opacity: 1;
}


</style>