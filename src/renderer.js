import { createApp } from 'vue';
import App from './wrapper/App.vue';
import Splash from "./wrapper/pages/Splash.vue";
import Main from "./wrapper/pages/Main.vue";
import {createRouter, createWebHashHistory} from "vue-router";
import Loading from "./wrapper/pages/Loading.vue";


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