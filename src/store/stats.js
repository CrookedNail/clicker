export default {
    namespaced: true,
    state: {
        coinsNumber: 0,
        damageList: {
            flat: 1,
            dps: 0,
            income: 0,
        }
    },
    getters: {
        //Урон
        damage(state) {
            return state.damageList;
        },

        //Монеты
        coins(state) {
            return state.coinsNumber;
        },
    },
    mutations: {
        addCoins(state, count = 0) {
            state.coinsNumber += count;
        },

        removeCoins(state, count = 0) {
            state.coinsNumber -= count;
        },

        addDamage(state, payload) {
            const keys = Object.keys(payload);

            for (let i = 0; i < keys.length; i++) {
                state.damageList[keys[i]] += payload[keys[i]].value;
            }
        },

        removeDamage(state, payload) {
            const keys = Object.keys(payload);

            for (let i = 0; i < keys.length; i++) {
                state.damageList[keys[i]] -= payload[keys[i]].value;
            }
        },

        buyItem(state, price) {
            state.coinsNumber -= price;
        },

        //ADMIN MODULES
        addDamageAdm(state, payload) {
            const keys = Object.keys(payload);

            for (let i = 0; i < keys.length; i++) {
                state.damageList[keys[i]] += payload[keys[i]];
            }
        },

        removeDamageAdm(state, payload) {
            const keys = Object.keys(payload);

            for (let i = 0; i < keys.length; i++) {
                state.damageList[keys[i]] -= payload[keys[i]];
            }
        },
    },
}
