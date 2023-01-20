import keyBy from "lodash.keyby";
import { Tribe, Troop } from "../types/CommonTypes";

const troops: Record<string, Troop> = keyBy([], 'id') // TTD

export const getTroopInfo = (tribe: Tribe, troopId: string) => {
    return troops[`${tribe}|${troopId}`]
}