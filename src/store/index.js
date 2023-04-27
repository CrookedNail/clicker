import { createStore } from "vuex";
import levels from "./levels";
import stats from "./stats";
import user from "./user"
import items from "./items"
import skills from "./skills"

const store = createStore({
    modules: { levels, stats, user, items, skills },
});

export default store;
