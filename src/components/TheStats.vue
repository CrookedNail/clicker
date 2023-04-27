<template>
  <div class="stats">
    <h4 class="stats-title">Статистика</h4>
    <ul>
        <li>Монеты: {{ getStats.gold }} | <a href="#" @click.prevent="addGold(10)">+</a></li>
        <li>Урон: {{ getStats.damagePerClick }} | <a href="#" @click.prevent="addDPS(10)">+</a></li>
        <li>Урон в секунду: {{ getStats.damagePerTick }} | <a href="#" @click.prevent="addDPT(10)">+</a></li>
        <li>Крит. шанс: {{ getStats.critChance }} <a href="#" @click.prevent="addCritChance(10)">+</a></li>
        <li>Крит. урон: {{ getStats.critDamage }} <a href="#" @click.prevent="addCritDamage(10)">+</a></li>
        <li>Монеты в секунду: {{ getStats.goldPerTick }} | <a href="#" @click.prevent="addGPT(10)">+</a></li>
        <li>Совершено кликов: {{ getStats.clicks }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: "TheStats",
    computed: {
        ...mapGetters({
            getStats: 'user/getStats'
        })
    },
    methods: {
        ...mapMutations({
            addDPS: 'user/ADD_DPS',
            addDPT: 'user/ADD_DPT',
            addGold: 'user/ADD_GOLD',
            addGPT: 'user/ADD_GPT',
            addCritChance: 'user/ADD_CRIT_CHANCE',
            addCritDamage: 'user/ADD_CRIT_DAMAGE'
        })
    }
}
</script>

<style scoped lang="scss">
  .stats {
    text-align: left;

    &-title {
      font-size: 18px;
    }

    ul {
      padding: 0;
      list-style-type: none;
    }
  }
</style>
