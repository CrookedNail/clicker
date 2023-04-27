export default {
    namespaced: true,
    state: {
        itemsList: []
    },
    getters: {
        getItemsList(state) {
            return state.itemsList
        }
    },
    mutations: {
        SET_ITEMS_LIST(state, payload) {
            state.itemsList = payload
        }
    },
    actions: {
        async getItems(context, payload) {
            const data = await payload.items.getAllItems()
            context.commit('SET_ITEMS_LIST', data)
        }
    }
}
