<template>
    <div class="rating rounded">
        <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="computedUsers"
            :loading="!isLoaded"
            class="elevation-1 mb-4"
        >
            <template v-slot:item.username="{ item }">
                <div class="d-flex align-center">
                    <div class="avatar mr-3">
                        <v-img
                            :src="item.value.attributes.discordAvatar"
                            :width="50"
                            :height="50"
                            :aspect-ratio="1"
                            object-fit="contain"
                        />
                    </div>
                    {{ item.value.attributes.username.split('#')[0] }}
                </div>
            </template>
        </v-data-table-server>
        <div class="d-flex justify-center">
            <v-btn class="mr-5" @click="getAllUsers($api)">Обновить</v-btn>
            <v-btn @click="$emit('rating:close')">Закрыть</v-btn>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {VDataTableServer} from "vuetify/labs/components";

export default {
    name: "TheRating",
    components: {
        VDataTableServer
    },
    mounted() {
        this.getAllUsers(this.$api)
    },
    data() {
        return {
            itemsPerPage: 10,
            place: 0,
            headers: [
                {
                    title: 'Discord',
                    align: 'start',
                    sortable: false,
                    key: 'username',
                },
                { title: 'Наивысший уровень', align: 'center', sortable: false, key: 'attributes.completedLevel' },
                { title: 'Кол-во кликов', align: 'center', sortable: false, key: 'attributes.clicks' }
            ]
        }
    },
    computed: {
        ...mapGetters({
            allUsers: 'user/getAllUsers',
            isLoaded: 'user/getAllUsersLoaded'
        }),
        computedUsers() {
            return this.allUsers.slice(0, 5)
        }
    },
    methods: {
        ...mapActions({
            getAllUsers: 'user/getAllUsers'
        })
    }
}
</script>

<style lang="scss">
.v-data-table-footer {
    display: none !important;
}
.rating__table {
    width: 1000px;
}
</style>
