import { createApp } from 'vue';
import App from './App.vue';
import Splash from "./pages/Splash.vue";
import Main from "./pages/Main.vue";
import {createRouter, createWebHashHistory} from "vue-router";
import Loading from "./pages/Loading.vue";


const routes = [
    { path: '/', component: Loading },
    { path: '/splash', component: Splash },
    { path: '/main', component: Main },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

createApp(App).use(router).mount('#app');