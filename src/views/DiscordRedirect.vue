<template>
    <div class="wrapper">
        <div v-if="!isLoaded">Загрузка...</div>
        <div v-else>Успешный вкид. Перенаправляю на главную страницу</div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            isLoaded: false
        }
    },
    mounted() {
        const code = this.$route.query.access_token

        fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/discord/callback?access_token=${code}`)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
                }
                return res;
            })
            .then(res => res.json())
            .then(res => {
                localStorage.setItem('jwt', res.jwt)
                localStorage.setItem('username', res.user.username)
                localStorage.setItem('id', res.user.id)
                const _id = this.$CryptoJS.AES.encrypt('[]', import.meta.env.VITE_SECRET_KEY).toString()

                localStorage.getItem('_id') ? '' : localStorage.setItem('_id', _id)

                this.getDiscordAvatar(res.user.id, code)
                this.isLoaded = true
                setTimeout(() => {
                    this.$emit('authorize')
                    this.$router.push('/')
                }, 3000)
            })
            .catch(err => {
                console.log(err)
            });
    },
    methods: {
        async getDiscordAvatar(id, token) {
            const response = await axios.get("https://discord.com/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await this.$api.user.updateDiscordAvatar(id, `https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    background: url('@/assets/img/menu-bg.jpg') no-repeat center center;
    background-size: cover;
    align-items: center;
    justify-content: center;
    color: #EADEDA;

    div {
        -webkit-text-stroke-color: #0e0e0e;
        -webkit-text-stroke-width: 1px;
    }
}
</style>
