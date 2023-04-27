import {random} from "lodash/number";

export default function randomizer(proc) {
    const randomNumber = random(1, 100)

    return randomNumber <= proc
}
