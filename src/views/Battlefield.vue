<template>
    <div class="wrapper">
        <v-container fluid class="py-0">
            <v-row>
                <v-col cols="8">
                    <div class="battlefield position-relative">
                        <div class="battlefield__exit position-absolute">
                            <router-link to="/">В меню</router-link>
                        </div>

                        <div v-if="!isLoaded || isItemDropped">Загрузка...</div>

                        <div v-if="isLoaded && !gameOver && !isShop">
                            <the-enemy v-if="!isItemDropped" :enemy="enemy" @enemyDied="enemyDied"/>
                            <div class="battlefield__level position-absolute">
                                <span class="battlefield__level-title">Уровень</span><br>
                                <span class="battlefield__level-text">{{ getCompletedLevels }} - {{ subLevel }}</span>
                            </div>
                        </div>

                        <div v-if="isItemDropped">
                            <v-dialog
                                v-model="isItemDropped"
                                persistent
                                width="auto"
                            >
                                <v-card class="pa-4">
                                    <v-card-title
                                        class="pt-0 mb-4 text-center text-subtitle"
                                        v-html="droppedItemsText" />
                                    <div class="d-flex justify-center">
                                        <item-drop
                                            v-for="(item, index) in droppedItems"
                                            :key="index"
                                            :item="item"
                                            @click="addToInventory(item)"
                                        />
                                    </div>
                                </v-card>
                            </v-dialog>
                        </div>

                        <div v-if="isShop" class="w-100 h-100">
                            <the-shop @close="setNextLevel" />
                        </div>

                        <div v-if="gameOver" class="d-flex align-center justify-content-center h-100 w-100">
                            <div class="gameover">GAME OVER</div>
                        </div>
                    </div>
                </v-col>

                <v-col col="4">
                    <div class="mb-5">
                        <the-stats></the-stats>
                    </div>
                    <div>
                        <the-inventory v-if="isLoaded"></the-inventory>
                        <div v-else>Загрузка...</div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import TheEnemy from "@/components/TheEnemy.vue";
import TheInventory from "@/components/TheInventory.vue";
import TheStats from "@/components/TheStats.vue";
import ItemDrop from "@/components/ItemComponent.vue";
import {mapActions, mapGetters, mapMutations} from "vuex";
import randomizer from "@/utils/randomizer";
import TheShop from "@/components/TheShop.vue";
import soundSystem from "@/utils/soundSystem";

export default {
    name: 'TheBattlefield',
    components: {
        TheShop,
        TheEnemy,
        TheStats,
        TheInventory,
        ItemDrop
    },
    data() {
        return {
            subLevel: 0,
            enemy: {},
            nextLevelEnemies: [],
            isFirstLoad: true,
            gameOver: false,
            isItemDropped: false,
            isShop: false,
            checkItems: '',
            droppedItems: [],
            droppedItemsText: '',
            dropPercent: {
                common: 1,
                rare: 1,
                epic: 1,
                legendary: 1
            },
            enemyDropMultiplier: {
                default: 1,
                elite: 5,
                boss: 10
            }
        }
    },
    watch: {
        isLoaded(newVal) {
            if (newVal) {
                this.enemy = this.enemiesList[this.subLevel]
                this.enemy.bgMusic ? soundSystem.playEnemyBg('enemyBgMusic', this.enemy.bgMusic, 0.1) : ''
                this.subLevel++
            }
        }
    },
    computed: {
        ...mapGetters({
            isUserLoaded: 'user/getDataLoaded',
            isLevelLoaded: 'levels/getDataLoaded',
            enemiesList: 'levels/getEnemies',
            nextLevelEnemiesList: 'levels/getNextLevelEnemies',
            getCompletedLevels: 'user/getCompletedLevels',
            getUserId: "user/getId",
            itemsList: 'levels/getItemsList'
        }),

        isLoaded() {
            return this.isUserLoaded && this.isLevelLoaded
        },

        //Флаг для проверки прохождения уровня. Если враги на уровне закончились - возвращает true
        isEmptyEnemies() {
            return this.subLevel === this.enemiesList.length
        },

        //Проверка есть ли фраги на следующем уровне
        nextLevelHaveEnemies() {
            return this.nextLevelEnemiesList.length > 0
        }
    },
    mounted() {
        this.setEnemy()
    },
    methods: {
        ...mapMutations({
            setCompletedLevels: 'user/SET_COMPLETED_LEVELS',
            setInventory: 'user/ADD_TO_INVENTORY'
        }),
        ...mapActions({
            setNewLevel: 'levels/getLevels',
            updateStats: 'user/updateStats'
        }),

        //Возвращает 1 врага, в зависимости от Level и Sublevel
        setEnemy() {
            //Устанавливаем флаг, что не первая загрузка страницы
            this.isFirstLoad = false
            this.isItemDropped = false

            //Проверяем есть ли враги на уровне и есть ли враги на следующем. Если оба нет, то ставим флаг gameover в true
            if (this.isEmptyEnemies && !this.nextLevelHaveEnemies && this.isLoaded) {
                this.setGameOver(true)
            } else if(this.isLoaded) {
                //Если враги на уровне закончились, то устанавливаем следующий уровень
                if (this.isEmptyEnemies) {
                    this.isShop = true
                } else {
                    this.enemy = this.enemiesList[this.subLevel]
                    this.enemy.bgMusic ? soundSystem.playEnemyBg('enemyBgMusic', this.enemy.bgMusic, 0.1) : ''
                    this.subLevel++
                }
            }
        },

        // Что делаем когда враг умер
        enemyDied() {
            soundSystem.stopSound('enemyBgMusic')
            this.checkItems = this.$CryptoJS.AES.decrypt(localStorage.getItem('_id'), import.meta.env.VITE_SECRET_KEY).toString(this.$CryptoJS.enc.Utf8)
            this.getDroppedItems()

            if (this.droppedItems.length === 1) {
                this.droppedItemsText = 'Тебе выпал предмет!'
                this.isItemDropped = true
            } else if (this.droppedItems.length > 1) {
                this.droppedItemsText = 'Наааайс. Тебе повезло!<br> Выбери 1 предмет из списка'
                this.isItemDropped = true
            } else {
                this.isItemDropped = false
                this.setEnemy()
            }
        },

        // Получаем выпавшие предметы с врага
        getDroppedItems() {
            this.droppedItems = []
            this.itemsList.map((item) => {
                this.generateDrop(item)
            })
        },

        // Проверяем что выпало
        generateDrop(item) {
            switch (item.type) {
            case 'common': {
                randomizer(this.getDropPercent(item))
                    ? this.checkDrop(item)
                    : ''
                break
            }
            case 'rare': {
                randomizer(this.getDropPercent(item))
                    ? this.checkDrop(item)
                    : ''
                break
            }
            case 'epic': {
                randomizer(this.getDropPercent(item))
                    ? this.checkDrop(item)
                    : ''
                break
            }
            case 'legendary': {
                randomizer(this.getDropPercent(item))
                    ? this.checkDrop(item)
                    : ''
                break
            }
            }
        },

        // Финальный процент дропа предметов
        getDropPercent(item) {
            const levelMultiplier = Number(`1.${this.getCompletedLevels}`)
            const itemMultiplier = this.dropPercent[item.type]
            const enemyMultiplier = this.enemyDropMultiplier[this.enemy.type]

            const finalPercent = Math.floor((itemMultiplier + enemyMultiplier) * levelMultiplier)

            return finalPercent
        },

        // Проверяем падал ли уже предмет на уровне
        checkDrop(item) {
            const foundItem = JSON.parse(this.checkItems).find(droped => droped.name === item.name)
            if (foundItem !== undefined) {
                console.log('Предмет уже выпадал')
            } else {
                this.droppedItems.push(item)
            }
        },

        setNextLevel() {
            this.isShop = false
            //Обновляем переменную computedLevels в store
            this.setCompletedLevels(this.getCompletedLevels + 1)

            //Обновляем выпавшие предметы на уровне
            localStorage.setItem('_id', this.$CryptoJS.AES.encrypt('[]', import.meta.env.VITE_SECRET_KEY).toString())

            //Обновляем переменную computedLevels у user в базе данных
            this.$api.user.updateCompletedLevels(this.getUserId, this.getCompletedLevels)

            //Отправляем запрос на сервер для получения нового уровня
            this.setNewLevel(this.$api)

            //Сохраняем статы на сервере
            this.updateStats(this.$api)

            this.subLevel = 0
        },

        addToInventory(item) {
            // Превращаем строку с уже выпавшими предметами в массив
            const _id = JSON.parse(this.checkItems)
            // Добавляем выбранный итем в массив
            _id.push(item)
            // Снова превращаем в строку
            const stringId = JSON.stringify(_id)
            // Закидываем массив в localStorage, перед этим кодируем строку
            localStorage.setItem('_id', this.$CryptoJS.AES.encrypt(stringId, import.meta.env.VITE_SECRET_KEY).toString())
            this.setInventory(item)
            soundSystem.playSound('', '/sounds/buy.mp3', 0.8)
            this.setEnemy()
        },

        //Изменение флага gameover
        setGameOver(val) {
            this.gameOver = val
        }
    },
    beforeUnmount() {
        soundSystem.stopSound('enemyBgMusic')
        this.updateStats(this.$api)
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background: #EADEDA;
    width: 100vw;
    min-height: 100vh;
}

.battlefield {
    min-height: 100vh;

    &__exit {
        top: 20px;
        right: 20px;

        a {
            text-decoration: none;
            color: #2c3e50;
        }
    }

    &__level {
        top: 20px;
        left: 20px;

        &-title {
            font-size: 12px;
        }

        &-text {
            font-size: 11px;
        }
    }
}

.item + .item {
    margin-left: 15px;
}

.gameover {
    font-size: 72px;
    color: red
}
</style>
