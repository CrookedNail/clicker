<template>
  <div class="inventory__block">
      <div class="inventory-title">
          Активные слоты
      </div>
      <v-container fluid>
          <div class="d-flex align-center justify-center">
              <div class="position-relative">
                  <div class="main-item position-absolute">
                  </div>
                  <draggable
                      v-model="computedActiveItems"
                      v-bind="dragOptions"
                      id="active-items"
                      class="d-inline-flex v-row--dense inventory-active mb-5"
                      group="items"
                      tag="v-row"
                      @start="onDrag"
                      @end="drag=false"
                      item-key="uuid"
                  >
                      <template #item="{element, index}">
                          <v-col
                              cols="auto position-relative"
                          >
                              <div class="active-items__index position-absolute">{{ index + 1 }}</div>
                              <item
                                  v-if="element?.name"
                                  :item="element"
                                  :tooltip-disabled="drag"
                              />
                          </v-col>
                      </template>
                  </draggable>
              </div>
          </div>
          <div class="inventory-title mb-5">
              Инвентарь
          </div>
          <draggable
              v-model="computedInventory"
              v-bind="dragOptions"
              id="inventory"
              class="d-flex v-row--dense mb-5"
              group="items"
              tag="v-row"
              @start="onDrag"
              :move="onActiveItemsFull"
              @end="drag=false"
              item-key="uuid">
              <template #item="{element}">
                  <v-col cols="auto">
                      <item
                          :item="element"
                          :tooltip-disabled="drag"
                      />
                  </v-col>
              </template>
          </draggable>
          <div class="inventory-title mb-5">
              Скиллы
          </div>
          <v-row>
              <v-col v-for="skill in getSkills" :key="skill.id">
                  <skill :skill="skill"></skill>
              </v-col>
          </v-row>
      </v-container>

      <div class="inventory-title">
          Все предметы
      </div>
      <v-container v-show="false">
          <v-row dense>
              <v-col cols="auto" v-for="(item, index) in getItems" :key="index">
                  <item
                      :item="item"
                      :tooltip-disabled="drag"
                  />
              </v-col>
          </v-row>
      </v-container>
  </div>
</template>

<script>
import Item from "@/components/ItemComponent.vue";
import Skill from "@/components/SkillComponent.vue"
import Draggable from "vuedraggable"
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "TheInventory",

    components: {
        Item,
        Draggable,
        Skill
    },

    data() {
        return {
            drag: false,
            inventoryDrag: false
        }
    },

    computed: {
        ...mapGetters({
            getStats: 'user/getStats',
            getItems: 'items/getItemsList',
            getInventory: 'user/getInventory',
            getActiveItems: 'user/getActiveItems',
            getSkills: 'skills/getSkills'
        }),

        dragOptions() {
            return {
                animation: 150,
                group: "items",
                disabled: false,
                ghostClass: "ghost"
            };
        },

        computedActiveItems: {
            get() {
                if (this.getActiveItems) {
                    const sumStats = this.getActiveItems.reduce((acc, item) => {
                        acc.dps += item.stats.dps
                        acc.dpt += item.stats.dpt
                        acc.critChance += item.stats.critChance
                        acc.critDamage += item.stats.critDamage
                        item.skill?.id ? acc.skills.push(item.skill) : ''
                        return acc;
                    }, { dps: 0, dpt: 0, critChance: 0, critDamage: 0, skills: [] });
                    const uniqueSkills = sumStats.skills.filter((obj, index, self) => {
                        return index === self.findIndex((t) => (
                            t.id === obj.id
                        ));
                    });
                    this.updateSkills(uniqueSkills)
                    this.updateDPS(sumStats.dps + this.computedPassiveSkillsStats.dps + 1)
                    this.updateDPT(sumStats.dpt + this.computedPassiveSkillsStats.dpt)
                    this.updateCritChance(sumStats.critChance)
                    this.updateCritDamage(sumStats.critDamage + 50)
                }

                return this.getActiveItems
            },
            set(value) {
                this.updateActiveItems(value)
            }
        },

        computedPassiveSkillsStats() {
            let sumStats = {
                dps: 0,
                dpt: 0
            }

            this.getSkills.map((item) => {
                if (item.type === 'passive') {
                    sumStats.dps += item.stats.dps
                    sumStats.dpt += item.stats.dpt
                }
            })

            return sumStats
        },

        computedInventory: {
            get() {
                return this.getInventory
            },
            set(value) {
                this.updateInventory(value)
            }
        }
    },
    methods: {
        ...mapMutations({
            updateDPS: 'user/UPDATE_DPS',
            updateDPT: 'user/UPDATE_DPT',
            updateCritChance: 'user/UPDATE_CRIT_CHANCE',
            updateCritDamage: 'user/UPDATE_CRIT_DAMAGE',
            updateInventory: 'user/SET_INVENTORY',
            updateActiveItems: 'user/SET_ACTIVE_ITEMS',
            updateMainItem: 'user/UPDATE_MAIN_ITEM',
            updateSkills: 'skills/updateSkills'
        }),

        onDrag() {
            this.drag = true
        },

        onActiveItemsFull(evt) {
            return !(evt.to.id === 'active-items' && this.computedActiveItems.length === 6);
        }
    }
}
</script>

<style lang="scss" scoped>
.inventory-active {
    max-width: 190px;
    width: 190px;
    min-height: 130px;
}
#main-item {
    max-width: 70px;
}
.active-items__index {
    bottom: 5px;
    left: 8px;
    font-size: $small;
    z-index: 5;
}
.main-item {
    width: 55px;
    height: 55px;
    top: 0;
    left: 0;
    border-radius: 4px;
    background: linear-gradient(120deg, #008000, #00FF00, #008000);
    animation: shadow-glow 2s ease-in-out infinite alternate;
}
@keyframes shadow-glow {
    0% {
        opacity: 0.5;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.5;
    }
}
</style>
