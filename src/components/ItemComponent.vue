<template>
    <v-card
        class="item pa-1"
        :class="computedClass"
    >
        <v-img class="position-relative" :src="computedSrc">
            <v-tooltip
                activator="parent"
                max-width="350"
                location="top"
                :open-delay="150"
                :disabled="tooltipDisabled"
            >
                <div class="tooltip-content">
                    <div class="d-flex justify-center">
                        <v-img class="tooltip-img" :src="computedSrc" />
                    </div>
                    <div class="text-center mb-2">
                        <span class="font-weight-bold text-grey-lighten-5">{{ item.name }}</span>
                    </div>
                    <div class="mb-2">
                        {{ item.description }}
                    </div>
                    <ul class="item-stats">
                        <li>
                            <span class="font-weight-bold">Качество:</span>{{ computedName[item.type] }}
                        </li>
                        <li v-if="item.stats.dps">
                            <span class="font-weight-bold">Дамаг:</span>+{{item.stats.dps}}
                        </li>
                        <li v-if="item.stats.dpt">
                            <span class="font-weight-bold">Дамаг в сек.:</span>+{{item.stats.dpt}}
                        </li>
                        <li v-if="item?.count">
                            <span class="font-weight-bold">Кол-во:</span>{{item.count}}
                        </li>
                        <li>
                            <span class="font-weight-bold">Покупка:</span>{{item.cost}}
                        </li>
                        <li>
                            <span class="font-weight-bold">Продажа:</span>{{item.sellCost}}
                        </li>
                        <li v-if="item.stats?.critChance">
                            <span class="font-weight-bold">Крит. шанс:</span>+{{item.stats.critChance}}
                        </li>
                        <li v-if="item.stats?.critDamage">
                            <span class="font-weight-bold">Крит. урон:</span>+{{item.stats.critDamage}}
                        </li>
                        <li v-if="item.skill?.id">
                            <div>Скилл</div>
                            <span class="font-weight-bold">Название:</span>{{item.skill.name}}
                        </li>
                    </ul>
                </div>
            </v-tooltip>
            <div v-if="item?.count > 1" class="item-count position-absolute text-very-small text-orange">
                x{{ item.count }}
            </div>
        </v-img>
    </v-card>
</template>

<script>
const IMG_PATH = import.meta.env.BASE_URL + 'src/assets/img/shop/items/'
export default {
    name: "ItemDrop",
    props: {
        item: Object,
        count: Number,
        tooltipDisabled: Boolean
    },
    computed: {
        computedSrc() {
            return IMG_PATH + this.item.img
        },

        computedClass() {
            return `item-${this.item.type}`
        },

        computedName() {
            return {
                common: 'Обычное',
                rare: 'Редкое',
                epic: 'Эпическое',
                legendary: 'Легендарное'
            }
        }
    }
}
</script>

<style scoped>
.item {
    width: 55px;
    height: 55px;
}

.item-stats {
    list-style-type: none;
}

.item-count {
    bottom: 0;
    left: 2px;
}

.tooltip-img {
    max-width: 100px;
}
</style>
