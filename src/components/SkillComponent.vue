<template>
    <v-card
        class="skill pa-1"
    >
        <span v-if="skill.type === 'passive'" class="animate"></span>
        <span v-if="skill.type === 'passive'" class="animate"></span>
        <span v-if="skill.type === 'passive'" class="animate"></span>
        <span v-if="skill.type === 'passive'" class="animate"></span>
        <div class="overlay">
            <v-img class="position-relative" :src="computedImg">
                <v-tooltip
                    activator="parent"
                    max-width="350"
                    location="top"
                    :open-delay="150"
                >
                    <div class="tooltip-content">
                        <div class="d-flex justify-center">
                            <v-img class="tooltip-img" :src="computedImg" />
                        </div>
                        <div class="text-center mb-2">
                            <span class="font-weight-bold text-grey-lighten-5">{{ skill.name }}</span>
                        </div>
                        <div class="mb-2">
                            {{ skill.description }}
                        </div>
                        <ul class="skill-stats">
                            <li>
                                <span class="font-weight-bold">Тип:</span>{{ computedType[skill.type] }}
                            </li>
                            <li v-if="skill.stats.dps">
                                <span class="font-weight-bold">Дамаг:</span>+{{skill.stats.dps}}
                            </li>
                            <li v-if="skill.stats.dpt">
                                <span class="font-weight-bold">Дамаг в сек.:</span>+{{skill.stats.dpt}}
                            </li>
                            <li v-if="skill.duration">
                                <span class="font-weight-bold">Время действия:</span>{{skill.duration}}
                            </li>
                            <li v-if="skill.duration">
                                <span class="font-weight-bold">Время перезарядки:</span>{{skill.cd}}
                            </li>
                        </ul>
                    </div>
                </v-tooltip>
            </v-img>
        </div>
    </v-card>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

const SKILLS_PATH = import.meta.env.BASE_URL + 'src/assets/img/skills/'
export default {
    name: "SkillComponent",
    props: {
        skill: Object
    },
    computed: {
        ...mapGetters({
            getStats: 'user/getStats'
        }),

        computedImg() {
            return SKILLS_PATH + this.skill.img
        },

        computedType() {
            return {
                passive: 'Пассивный',
                active: 'Активный'
            }
        }
    },
    methods: {
        ...mapMutations({
            addDPS: 'user/ADD_DPS',
            addDPT: 'user/ADD_DPT'
        })
    }
}
</script>

<style lang="scss" scoped>
.skill {
    width: 55px;
    height: 55px;
    position: relative;
    & .animate:nth-child(5){
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, $epic, $legendary);
        animation: animate1 2s linear infinite;
    }
    & .animate:nth-child(2){
        position: absolute;
        top: 0;
        right: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, $epic, $legendary);
        animation: animate2 2s linear infinite;
        animation-delay: 1s;
    }
    & .animate:nth-child(3){
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to left, $epic, $legendary);
        animation: animate3 2s linear infinite;
    }
    & .animate:nth-child(4){
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(to top, $epic, $legendary);
        animation: animate4 2s linear infinite;
        animation-delay: 1s;
    }
}
.skill-stats {
    list-style-type: none;
}
.tooltip-img {
    max-width: 100px;
}
.overlay {
    padding: 3px;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(black, 0.2);
    top: 0;
    left: 0;
    z-index: 5;
}
@keyframes animate1{
    0%{
        transform: translateX(-100%);
    }

    100%{
        transform: translateX(100%);
    }
}
@keyframes animate2{
    0%{
        transform: translateY(-100%);
    }

    100%{
        transform: translateY(100%);
    }
}
@keyframes animate3{
    0%{
        transform: translateX(100%);
    }

    100%{
        transform: translateX(-100%);
    }
}
@keyframes animate4{
    0%{
        transform: translateY(100%);
    }

    100%{
        transform: translateY(-100%);
    }
}
</style>
