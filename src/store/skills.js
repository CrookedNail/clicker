export default {
    namespaced: true,
    state: {
        skillsList: []
    },
    getters: {
        getSkills(state) {
            return state.skillsList
        }
    },
    mutations: {
        addSkill(state, payload) {
            state.skillsList.push(payload)
        },
        updateSkills(state, payload) {
            state.skillsList = payload
        }
    }
}
