export default {
    namespaced: true,
    state: {
        enemiesList: [],
        nextLevelEnemiesList: [],
        itemsList: [],
        dataLoaded: false,
        shopItems: []
    },
    getters: {
        getEnemies(state) {
            return state.enemiesList
        },

        getItemsList(state) {
            return state.itemsList
        },

        getNextLevelEnemies(state) {
            return state.nextLevelEnemiesList
        },

        getDataLoaded(state) {
            return state.dataLoaded
        },

        getShopList(state) {
            return state.shopItems
        },

        getCompletedLevel: (state, getters, rootState, rootGetters) => rootGetters['user/getCompletedLevels']
    },
    mutations: {
        SET_ENEMIES_LIST(state, payload) {
            state.enemiesList = payload
        },

        SET_NEXT_ENEMIES_LIST(state, payload) {
            state.nextLevelEnemiesList = payload
        },

        SET_DATA_LOADED(state, payload) {
            state.dataLoaded = payload
        },

        SET_ITEMS_LIST(state, payload) {
            state.itemsList = payload
        },

        SET_SHOP_LIST(state, payload) {
            state.shopItems = payload
        }
    },
    actions: {
        async getLevels(context, payload) {
            context.commit('SET_DATA_LOADED', false)
            try {
                const data = await payload.level.getLevel(context.getters.getCompletedLevel);
                context.commit('SET_ENEMIES_LIST', data[0]?.enemies || [])
                context.commit('SET_NEXT_ENEMIES_LIST', data[1]?.enemies || [])
                context.commit('SET_ITEMS_LIST', data[0].items || [])
                context.commit('SET_SHOP_LIST', data[0].shop)
                context.commit('SET_DATA_LOADED', true)
            } catch (error) {
                console.log(error)
            }
        }
    }
}
