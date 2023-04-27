<template>
    <div class="wrapper position-relative">
        <div v-if="isAuth" class="user-name text-start">
            <div class="d-flex align-center">
                <div class="avatar">
                    <v-img
                        class="rounded"
                        :width="64"
                        cover
                        :src="getUserAvatar"
                    ></v-img>
                </div>
                <div class="name pl-2">
                    {{ getUserName }}
                </div>
            </div>
        </div>
        <v-container>
            <v-row class="justify-center">
                <v-col cols="12">
                    <div class="game-title">
                        SAMPLE TEXT <br> CLICKER
                    </div>
                </v-col>
                <v-col cols="5">
                    <ul v-if="isAuth" class="menu">
                        <li class="menu__item"><router-link to="battlefield">Играть</router-link></li>
                        <li class="menu__item">
                            <a href="#" @click.prevent="isRatingOpened = true">Таблица лидеров</a>
                        </li>
                        <li class="menu__item"><a href="#" @click.prevent="logout">Выход</a></li>
                    </ul>
                    <div v-else class="menu">
                        <a :href="loginUrl">Войти с помощью Discord</a>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog
            v-model="isRatingOpened"
            persistent
            width="auto"
        >
           <the-rating @rating:close="isRatingOpened = false" />
        </v-dialog>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import TheRating from "@/components/TheRating.vue";

export default {
    name: 'TheHome',
    components: {TheRating},
    data() {
        return {
            isRatingOpened: false
        }
    },
    computed: {
        ...mapGetters({
            getUserName: "user/getUserName",
            isAuth: "user/getAuth",
            getUserAvatar: "user/getAvatar"
        }),
        loginUrl() {
            return import.meta.env.VITE_SERVER_URL + '/api/connect/discord'
        }
    },
    methods: {
        ...mapMutations({
            resetStore: 'user/RESET_STORE'
        }),
        logout() {
            localStorage.removeItem('jwt')
            localStorage.removeItem('id')
            localStorage.removeItem('username')
            this.resetStore()
            this.$router.go(0)
        }
    }
}
</script>

<style lang="scss" scoped>
$text-color: #EADEDA;
$stroke-color: #0e0e0e;
$hover-link: #820263;

.wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    background: url('@/assets/img/menu-bg.jpg') no-repeat center center;
    background-size: cover;
    align-items: center;
}

.user-name {
    font-size: 14px;
    color: $text-color;
    -webkit-text-stroke-color: $stroke-color;
    -webkit-text-stroke-width: 1px;
    position: absolute;
    top: 20px;
    left: 20px;
}

.game-title {
	font-size: 62px;
	color: $text-color;
    margin-bottom: 25px;
	-webkit-text-stroke-color: $stroke-color;
	-webkit-text-stroke-width: 4px;
}

.menu {
  list-style-type: none;
  padding: 40px 0;
  border: 4px solid $stroke-color;
  background: rgba(0 0 0 / 0.4);

  &__item {
      padding: 10px 0;
  }

  a {
    color: $text-color;
    text-decoration: none;
    font-size: 22px;
    -webkit-text-stroke-color: $stroke-color;
    -webkit-text-stroke-width: 1px;
    transition: .3s ease;

    &:hover {
      color: $hover-link;
      transition: .3s ease;
    }
  }
}
</style>
