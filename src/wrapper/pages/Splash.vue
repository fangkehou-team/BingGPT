<script setup>

import Microsoft from "../components/Microsoft.vue";
</script>

<template>
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; position: absolute; width: 100vw; height: 100vh; top: 0; left: 0;">
    <img style="width: 100px" src="../assets/copilot.svg" alt="Copilot Logo">
    <p class="splash_primary">BingGPT</p>
    <p class="splash_secondary">Powered By Copilot with Bing Chat</p>
    <p class="splash_check"><input type="checkbox">don't show this again</p>
    <a style='display: block; margin-top: 10px; font-size: 25px; text-align: center;' href='https://www.bing.com/fd/auth/signin?action=interactive&provider=windows_live_id&return_url=https%3a%2f%2fwww.bing.com'><Microsoft></Microsoft></a>"
  </div>
</template>

<style scoped>

.splash_primary {
  padding-top: 30px;
  font-family: SansSerif,sans-serif;
  font-size: 30px;
}

.splash_secondary {
  font-family: SansSerif,sans-serif;
}

.splash_check {
  font-family: SansSerif,sans-serif;
}

@media (prefers-color-scheme: dark) {
  .splash_primary {
    color: #FFFFFF;
  }

  .splash_secondary {
    color: #FFFFFF;
  }

  .splash_check {
    color: #FFFFFF;
  }
}

</style>