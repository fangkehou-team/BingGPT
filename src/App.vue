<script setup>

import {useRoute, useRouter} from "vue-router";
import {onMounted} from "vue";

let router = useRouter();

let login = location.search.indexOf("login") >= 0

if (login) {
  router.push("/main")
} else if (localStorage.getItem("nosplash") == "true") {
  window.location.replace("https://www.bing.com/fd/auth/signin?action=interactive&provider=windows_live_id&return_url=https%3a%2f%2fwww.bing.com")
} else {
  router.push("/splash")
}

</script>

<template>
  <router-view></router-view>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
}
</style>