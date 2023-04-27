<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <component :is="Component" @authorize="initializeApp" />
        </transition>
    </router-view>
</template>

<script>
import {mapActions, mapMutations} from "vuex";

export default {
    name: 'App',
    created() {
        this.initializeApp()
        // window.addEventListener('beforeunload', () => {
        //     this.updateStats(this.$api)
        // })
    },
    methods: {
        ...mapMutations({
            setUser: 'user/SET_USER_NAME',
            setJwt: 'user/SET_JWT',
            setAuth: 'user/SET_IS_AUTH',
            setId: 'user/SET_ID'
        }),
        ...mapActions({
            getUser: 'user/getUser',
            getLevels: 'levels/getLevels',
            getItems: 'items/getItems',
            updateStats: 'user/updateStats'
        }),
        initializeApp() {
            this.getItems(this.$api)
            if (this.isLocalStorage()) {
                this.setStore()
                this.getUser(this.$api)
                    .then(() => {
                        this.getLevels(this.$api)
                    })
            }
        },
        isLocalStorage() {
            return !!(localStorage.getItem('jwt') &&
                localStorage.getItem('id') &&
                localStorage.getItem('username'))
        },
        setStore() {
            this.setId(localStorage.getItem('id'))
            this.setUser(localStorage.getItem('username').split('#')[0])
            this.setJwt(localStorage.getItem('jwt'))
            this.setAuth(true)
        }
    }
}
</script>

<style lang="scss">
@import 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
@import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Roboto+Condensed:ital,wght@0,400;0,700;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;500;600;700&display=swap');

$font: 'Yanone', cursive;

body {
  font-family: $font;
  height: 100vh;
  position: relative;
}

.damage-number {
  position: absolute;
  color: #ff2525;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
  -webkit-text-stroke: 1px #000;
  font-size: 16px;
  z-index: 100;
  opacity: 1;
  transition: transform .3s, opacity .5s;
  will-change: transform;
}

#app {
  font-family: $font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.battlefield {
  height: 100%;
  width: 100%;
}

.shop {
  height: 50%;
  width: 100%;
  background: antiquewhite;
}

.inventory {
  padding: 10px;
  height: 50%;
  width: 100%;
  background: aquamarine;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
