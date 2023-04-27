import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Battlefield from "@/views/Battlefield.vue";
import DiscordRedirect from "@/views/DiscordRedirect.vue"
import store from "@/store";
import TestField from "@/views/TestField.vue";

const ifAuthenticated = (to, from, next) => {
    if (store.getters["user/getAuth"]) {
        next()
        return
    }
    next('/')
}

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/battlefield",
        name: "Battlefield",
        component: Battlefield,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/connect/discord/redirect',
        name: 'DiscordRedirect',
        component: DiscordRedirect,
    },
    {
        path: '/test',
        name: 'TestField',
        component: TestField,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
