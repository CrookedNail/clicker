<template>
  <div class="container-fluid h-100">
      {{ timer }}
    <div class="row h-100">
      <div class="col-12">
        <div
          class="enemy__wrapper d-flex align-items-center justify-content-center align-content-center flex-column h-100"
        >
          <div class="enemy__stats">
            <div class="enemy__stats-name">
              {{ enemy.name }}
            </div>
              <div class="enemy__stats-subname">
                  {{ enemy.subname }}
              </div>

            <div class="enemy__stats-hp">
              {{  currentHealth }} <span class="divider">/</span> {{ enemy.hp }}
            </div>

            <div class="enemy__stats-hp-bar">
                <v-progress-linear
                    :style="{ 'width': enemy.hp + 'px'}"
                    :model-value="currentHealth"
                    :max="enemy.hp"
                    height="20"
                    striped
                    color="red"
                ></v-progress-linear>

            </div>
          </div>
          <div class="enemy__block">
            <img
              :style="`${enemy.mask}; cursor: url('${cursor}') 16 16, auto;`"
              class="enemy"
              :class="attack || dpsHolding ? 'damage' : ''"
              :src="computedAvatar"
              alt=""
              draggable="false"
              @mousedown="attack = true"
              @mouseup="attack = false"
              @mouseout="attack = false"
              @click="doFlat">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import soundSystem from "@/utils/soundSystem";
import randomizer from "@/utils/randomizer";

const IMG_PATH = import.meta.env.BASE_URL + 'src/assets/img/enemies/'
const CURSORS_PATH = import.meta.env.BASE_URL + 'src/assets/img/cursors/'

export default {
    name: "TheEnemy",
    props: {
        enemy: {
            type: Object,
            default:  () => {}
        }
    },
    data() {
        return {
            attack: false,
            dpsHolding: false,
            currentHealth: null,
            gameCycle: null,
            subLevel: 0,
            isLoading: true,
            timer: 0
        }
    },
    mounted() {
        this.setupEnemy()
        this.gameCycle = setInterval(this.doCycle, 1000);
    },
    beforeUnmount() {
        clearInterval(this.gameCycle);
    },
    watch: {
        'enemy'() {
            this.timer = 0
            this.setupEnemy()
        }
    },
    computed: {
        ...mapGetters({
            stats: 'user/getStats',
            getActiveItems: 'user/getActiveItems'
        }),

        computedAvatar() {
            return this.attack || this.dpsHolding
                ? IMG_PATH + this.enemy.avatarDamaged
                : IMG_PATH + this.enemy.avatar
        },

        computedPunchSounds() {
            return this.enemy?.punchSounds ? this.enemy.punchSounds : "punch1,punch2"
        },

        computedPhrasesSounds() {
            let phrases = null
            if (this.enemy?.phrasesSounds) {
                phrases = this.enemy.phrasesSounds.split(',').map((item) => {
                    return {
                        sound: item,
                        isPlayed: false
                    }
                })
            }
            return this.enemy?.phrasesSounds ? phrases : []
        },

        cursor() {
            const cursorImg = this.getActiveItems[0]?.img
                ? this.getActiveItems[0].img
                : 'stick.png'
            return CURSORS_PATH + cursorImg
        },

        percenttOfHp() {
            return this.currentHealth / this.enemy.hp * 100
        },

        computedCritDamage() {
            return Math.floor(this.stats.damagePerClick + (this.stats.damagePerClick * this.stats.critDamage / 100))
        }
    },
    methods: {
        ...mapMutations({
            addCoins: 'user/ADD_GOLD',
            addClick: 'user/INCREMENT_CLICK'
        }),

        setupEnemy() {
            //Устанавливаем HP бар равный кол-ву зворовья выбранного врага.
            this.currentHealth = this.enemy.hp;
        },

        getReward() {
            //Получаем монеты за убийство врага.
            this.addCoins(Number(this.enemy.rewardMoney));
        },

        removeHealth(count) {
            this.currentHealth = Math.max(0, this.currentHealth - count);
            if (this.currentHealth === 0) {
                this.getReward();
                soundSystem.playEnemyDied()
                this.$emit('enemy-died')
                this.setupEnemy()
            }
        },

        doCycle() {
            //Функция основного цикла. В нее помещаем то что должно выполняться 1 раз в сек. Пример: Урон в секунду, Получение монет в секунду

            this.timer++
            //Добавление монет в секунду
            this.stats.goldPerTick ? this.addCoins(this.stats.goldPerTick) : '';

            //Воспроизводим фразы врагов, 3 фразы за уровень 70%, 40%, 10%
            const [phrase1, phrase2, phrase3] = this.computedPhrasesSounds;
            if (this.percenttOfHp <= 70 && phrase1?.isPlayed === false) {
                soundSystem.playPhrase(phrase1.sound);
                phrase1.isPlayed = true;
            }

            if (this.percenttOfHp <= 40 && phrase2?.isPlayed === false) {
                soundSystem.playPhrase(phrase2.sound);
                phrase2.isPlayed = true;
            }

            if (this.percenttOfHp <= 10 && phrase3?.isPlayed === false) {
                soundSystem.playPhrase(phrase3.sound);
                phrase3.isPlayed = true;
            }

            //Нанесение Урона в секунду.
            this.removeHealth(this.stats.damagePerTick);

            //Устанавливаем анимацию дрожания для врага при получении урона в секунду.
            if (this.stats.damagePerTick !== 0) {
                this.dpsHolding = true;

                setTimeout(() => this.dpsHolding = false, 200);
            }
        },

        doFlat(e) {
            //Высчитываем крит
            const isCrit = randomizer(this.stats.critChance)
            //Добавляем клик в счетчик
            this.addClick()
            //Проигрываем звуки удара
            soundSystem.playPunch(this.computedPunchSounds, 0.5)
            //Отнимаем hp у врага, если крит удар, то добавляем значение крит урона
            isCrit
                ? this.removeHealth(this.computedCritDamage)
                : this.removeHealth(this.stats.damagePerClick)
            //Рисуем цифры урона
            isCrit
                ? this.createDamageDealtBlock(e.pageX, e.pageY, this.computedCritDamage, true)
                : this.createDamageDealtBlock(e.pageX, e.pageY, this.stats.damagePerClick)
        },

        createDamageDealtBlock(x, y, damage, crit = false) {
            let damageNumber = document.createElement('div');
            damageNumber.className = crit ? 'damage-number crit' : 'damage-number';
            damageNumber.innerHTML = "<span>-" + damage + "</span>";
            document.getElementById('app').before(damageNumber);

            damageNumber.style.top = y - damageNumber.offsetHeight + 'px';
            damageNumber.style.left = x - (damageNumber.offsetWidth / 2) + 'px';
            damageNumber.style.transform = 'translateY(-50px)';
            setTimeout(function () {
                damageNumber.style.opacity = '0';
                damageNumber.style.transition = '0.3s';
                damageNumber.remove();
            }, 300);
        }
    }
}
</script>

<style lang="scss">
.enemy__block {
  max-height: 600px;
  height: 600px;
}

.enemy__stats {
  color: #fff;
  margin-bottom: 50px;

  &-name {
    font-size: 20px;
  }

  &-subname {
    font-size: 12px;
    margin-bottom: 20px;
      color: darkgray;
  }

  &-hp {
    font-size: 14px;
  }

  &-hp-bar {
    display: inline-block;

    .v-progress-linear {
      max-width: 400px;
      border: 1px solid #000;
    }
  }
}

.enemy {
  will-change: transform;
  max-height: 600px;
}

.damage {
  animation: shake 0.5s infinite;
  transition: .1s ease;
  will-change: transform;
}

.divider {
  display: inline-block;
  //margin-left: -10px;
  //margin-right: -10px;
}

.crit {
    font-size: $crit;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg) scale(0.95); transition: .1s ease; }
  10% { transform: translate(-1px, -2px) rotate(-1deg) scale(0.95); transition: .1s ease; }
  20% { transform: translate(-3px, 0) rotate(1deg) scale(0.95); transition: .1s ease; }
  30% { transform: translate(3px, 2px) rotate(0deg) scale(0.95); transition: .1s ease; }
  40% { transform: translate(1px, -1px) rotate(1deg) scale(0.95); transition: .1s ease; }
  50% { transform: translate(-1px, 2px) rotate(-1deg) scale(0.95); transition: .1s ease; }
  60% { transform: translate(-3px, 1px) rotate(0deg) scale(0.95); transition: .1s ease; }
  70% { transform: translate(3px, 1px) rotate(-1deg) scale(0.95); transition: .1s ease; }
  80% { transform: translate(-1px, -1px) rotate(1deg) scale(0.95); transition: .1s ease; }
  90% { transform: translate(1px, 2px) rotate(0deg) scale(0.95); transition: .1s ease; }
  100% { transform: translate(1px, -2px) rotate(-1deg) scale(0.95); transition: .1s ease; }
}
</style>
