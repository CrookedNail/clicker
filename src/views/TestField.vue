<template>
    <div>
        <div class="enemy">
            Рандом версии 1: {{ random }} <br>
            <v-btn @click="generateRandom">Рандомить</v-btn>
        </div>
    </div>
</template>

<script>
import randomizer from "@/utils/randomizer";
export default {
    name: 'TestField',
    data() {
        return {
            random: 0
        }
    },
    methods: {
        generateRandom() {
            this.random = 0
            this.randomv2 = 0
            for (let i = 0; i < 10000; i++) {
                if (randomizer(0)) {
                    this.random++
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.enemy {
    width: 500px;
    height: 1000px;
}
</style>
