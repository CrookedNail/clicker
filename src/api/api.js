import api from "./index";

export default {
    install(app) {
        app.config.globalProperties.$api = api;
    },
};