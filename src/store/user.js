import { v4 as uuid } from "uuid"
export default {
    namespaced: true,
    state: {
        isAuth: false,
        jwt: '',
        userName: '',
        id: '',
        avatar: '',
        stats: {
            completedLevel: 1,
            damagePerClick: 1,
            damagePerTick: 0,
            gold: 0,
            goldPerTick: 0,
            clicks: 0,
            critChance: 0,
            critDamage: 0
        },
        inventory: [],
        activeItems: [],
        dataLoaded: false,
        allUsers: [],
        allUsersLoaded: false
    },
    getters: {
        getAuth(state) {
            return state.isAuth
        },

        getDataLoaded(state) {
            return state.dataLoaded
        },

        getAllUsers(state) {
            return state.allUsers
        },

        getAllUsersLoaded(state) {
            return state.allUsersLoaded
        },

        getJwt(state) {
            return state.jwt
        },

        getUserName(state) {
            return state.userName
        },

        getId(state) {
            return state.id
        },

        getCompletedLevels(state) {
            return state.stats.completedLevel
        },

        getAvatar(state) {
            return state.avatar
        },

        getStats(state) {
            return state.stats
        },

        getInventory(state) {
            return state.inventory
        },

        getActiveItems(state) {
            return state.activeItems
        }
    },
    mutations: {
        SET_IS_AUTH(state, payload) {
            state.isAuth = payload
        },

        SET_DATA_LOADED(state, payload) {
            state.dataLoaded = payload
        },

        RESET_STORE(state) {
            state.isAuth = false
            state.jwt = ''
            state.userName = ''
            state.id = ''
            state.avatar = ''
            state.stats = {
                completedLevel: 1,
                damagePerClick: 1,
                damagePerTick: 0,
                gold: 0,
                goldPerTick: 0,
                clicks: 0,
                critChance: 0,
                critDamage: 0
            }
            state.inventory = []
        },

        SET_ALL_USERS(state, payload) {
            state.allUsers = payload
        },

        SET_ALL_USERS_LOADED(state, payload) {
            state.allUsersLoaded = payload
        },

        SET_JWT(state, payload) {
            state.jwt = payload
        },

        SET_USER_NAME(state, payload) {
            state.userName = payload
        },

        SET_ID(state, payload) {
            state.id = payload
        },

        SET_COMPLETED_LEVELS(state, payload) {
            state.stats.completedLevel = payload
        },

        SET_AVATAR(state, payload) {
            state.avatar = payload
        },

        SET_STATS(state, payload) {
            state.stats = payload
        },

        INCREMENT_CLICK(state) {
            state.stats.clicks++
        },

        SET_INVENTORY(state, payload) {
            state.inventory = payload
        },

        SET_ACTIVE_ITEMS(state, payload) {
            state.activeItems = payload
        },

        UPDATE_DPS(state, payload) {
            state.stats.damagePerClick = payload
        },

        UPDATE_DPT(state, payload) {
            state.stats.damagePerTick = payload
        },

        UPDATE_CRIT_CHANCE(state, payload) {
            state.stats.critChance = payload
        },

        UPDATE_CRIT_DAMAGE(state, payload) {
            state.stats.critDamage = payload
        },

        ADD_CRIT_CHANCE(state, payload) {
            state.stats.critChance += payload
        },

        ADD_CRIT_DAMAGE(state, payload) {
            state.stats.critDamage += payload
        },

        ADD_TO_INVENTORY(state, payload) {
            state.inventory.push(payload)
        },

        ADD_DPS(state, payload) {
            state.stats.damagePerClick += payload
        },

        ADD_DPT(state, payload) {
            state.stats.damagePerTick += payload
        },

        ADD_GOLD(state, payload) {
            state.stats.gold += payload
        },

        ADD_GPT(state, payload) {
            state.stats.goldPerTick += payload
        },

        REMOVE_GOLD(state, payload) {
            state.stats.gold -= payload
        }
    },
    actions: {
        async getUser(context, payload) {
            context.commit('SET_DATA_LOADED', false)
            const data = await payload.user.getUser(Number(context.state.id))
            context.commit('SET_AVATAR', data.discordAvatar)
            context.commit('SET_STATS', {
                damagePerClick: data.damagePerClick,
                completedLevel: data.completedLevel,
                damagePerTick: data.damagePerTick,
                gold: Number(data.gold),
                goldPerTick: data.goldPerTick,
                clicks: data.clicks,
                critChance: 0,
                critDamage: 0
            })
            data.inventory.map((item) => {
                item.uuid = uuid()
            })
            context.commit('SET_INVENTORY', data.inventory)
            context.commit('SET_ACTIVE_ITEMS', data.activeItems)
            context.commit('SET_DATA_LOADED', true)
        },

        async getAllUsers(context, payload) {
            context.commit('SET_ALL_USERS_LOADED', false)
            const data = await payload.user.getAllUsers()
            context.commit('SET_ALL_USERS', data)
            context.commit('SET_ALL_USERS_LOADED', true)
        },

        async updateStats(context, payload) {
            return await payload.user.updateStats(Number(context.state.id), context.state.inventory,
                Number(context.state.stats.clicks),
                Number(context.state.stats.gold),
                context.state.activeItems
            )
        }
    }
}
