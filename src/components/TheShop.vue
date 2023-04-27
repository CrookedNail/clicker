<template>
    <v-container class="h-100">
        <v-row class="h-100 align-center">
            <v-col cols="12">
                <div class="shop-title mb-10">Магазин by Bratka</div>
                <v-card>
                    <v-tabs
                        v-model="tab"
                        color="deep-purple-accent-4"
                        align-tabs="center"
                    >
                        <v-tab>Купить</v-tab>
                        <v-tab>Продать</v-tab>
                    </v-tabs>
                    <v-window v-model="tab" class="my-5">
                        <v-window-item>
                            <v-container fluid>
                                <v-row v-if="isLoaded" class="justify-center position-relative">
                                    <v-col
                                        v-for="(item, index) in threeItems"
                                        class="pa-2"
                                        :key="item.id"
                                        cols="auto">
                                        <item-buy
                                            :class="computedClasses(index)"
                                            :item="item"
                                            @click="buyItem(item, index)"
                                        />
                                    </v-col>
                                    <div class="shop-refresh">
                                        <v-btn @click="generateShop">Обновить</v-btn>
                                    </div>
                                </v-row>
                                <v-row v-if="isLoaded && shopItems.length === 0">
                                    <v-col>
                                        <div class="shop-empty">
                                            Магазин пуст
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-window-item>
                        <v-window-item>
                            <v-container fluid>
                                <v-row class="justify-center">
                                    <v-col
                                        v-for="(item, index) in getInventory"
                                        class="pa-2"
                                        :key="item.uuid"
                                        cols="auto">
                                        <item-buy
                                            :item="item"
                                            @click="sellItem(item, index)"
                                        />
                                    </v-col>
                                    <div v-if="!getInventory.length">
                                        Ваш инвентарь пуст
                                    </div>
                                </v-row>
                            </v-container>
                        </v-window-item>
                    </v-window>
                </v-card>

                <v-btn class="mt-5" @click="$emit('close')">Продолжить</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import {mapGetters, mapMutations} from "vuex"
import ItemBuy from "./ItemComponent.vue"
import soundSystem from "@/utils/soundSystem";

export default {
    name: "TheShop",
    components: {
        ItemBuy
    },
    data() {
        return {
            tab: null,
            shopItems: [],
            notEnoughGold: [false, false, false]
        }
    },
    watch: {
        isLoaded(newVal) {
            newVal ? this.generateShop() : ''
        }
    },
    mounted() {
        this.isLoaded ? this.generateShop() : ''
    },
    computed: {
        ...mapGetters({
            getShopItems: 'levels/getShopList',
            isLoaded: 'levels/getDataLoaded',
            getInventory: 'user/getInventory',
            getStats: 'user/getStats'
        }),

        computedClasses() {
            return (index) => {
                return this.notEnoughGold[index] ? 'animate__animated animate__headShake animate__fast' : ''
            }
        },

        threeItems() {
            return this.shopItems
        }
    },
    methods: {
        ...mapMutations({
            addToInventory: 'user/ADD_TO_INVENTORY',
            setInventory: 'user/SET_INVENTORY',
            removeGold: 'user/REMOVE_GOLD',
            addGold: 'user/ADD_GOLD'
        }),
        buyItem(item, index) {
            for (let i = 0; i < this.notEnoughGold.length; i++) {
                this.notEnoughGold[i] = false;
            }
            if (this.isEnoughGold(item)) {
                this.shopItems.splice(index, 1)
                this.removeGold(Number(item.cost))
                this.addToInventory(item)
                soundSystem.playSound('', '/sounds/buy.mp3', 0.8)
            } else {
                this.notEnoughGold[index] = true
            }
        },

        sellItem(item) {
            const newInventory = this.getInventory.filter(obj => obj.uuid !== item.uuid)
            this.setInventory(newInventory)
            soundSystem.playSound('', '/sounds/buy.mp3', 0.8)
            this.addGold(item.sellCost)
        },

        generateShop() {
            const randomIndexes = new Set()

            this.shopItems = []

            while (randomIndexes.size < 3) {
                const randomIndex = Math.floor(Math.random() * this.getShopItems.length);
                randomIndexes.add(randomIndex);
            }

            randomIndexes.forEach((index) => {
                this.shopItems.push(this.getShopItems[index]);
            });

            return this.shopItems.slice(0, 3)
        },

        isEnoughGold(item) {
            return item.cost <= this.getStats.gold
        }
    }
}
</script>

<style scoped>
.shop-refresh {
    position: absolute;
    top: 10px;
    right: 10px;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
