import { Howl, Howler } from "howler"
import {random} from "lodash/number";

const ENEMY_DIED = '/sounds/kill.mp3'
const PUNCH_PATH = '/sounds/punches/'
const ENEMY_BG_PATH = '/sounds/backgrounds/'
const PHRASES_PATH = '/sounds/phrases/'
const DEFAULT_VOLUME = 1
const sounds = {}

function playEnemyDied() {
    let enemyDied = new Howl({
        src: ENEMY_DIED,
        volume: 0.5
    })

    enemyDied.play()
}

function playSound(id, src, volume) {
    sounds[id] = new Howl({
        src: src,
        volume: volume || DEFAULT_VOLUME
    })

    sounds[id].play()
}

function playPunch(src, volume) {
    src = src.split(',')
    const punchSound = src[random(0, src.length - 1)]

    let punch = new Howl({
        src: PUNCH_PATH + punchSound + '.mp3',
        volume: volume || DEFAULT_VOLUME
    })

    punch.play()
}

function playPhrase(src, volume) {
    let phrase = new Howl({
        src: PHRASES_PATH + src + '.mp3',
        volume: volume || DEFAULT_VOLUME
    })

    phrase.play()
}
function playEnemyBg(id, src, volume) {
    sounds[id] = new Howl({
        src: ENEMY_BG_PATH + src + '.mp3',
        volume: volume || DEFAULT_VOLUME,
        loop: true
    })

    sounds[id].play()
}

function stopSound(id) {
    if (sounds[id]) {
        sounds[id].stop()
        delete sounds[id]
    }
}

export  default {
    playSound,
    stopSound,
    playEnemyBg,
    playEnemyDied,
    playPunch,
    playPhrase
}
