import { Action, ActionContext } from '../../types/ActionTypes';
import { cleanParseInt } from '../../utils/NumberUtils';
import { isInBuildingAtPosition } from '../../utils/BotUtils';
import { IncomingAttack, IncomingAttackType, IncomingAttackUnit } from '../../types/DatabaseTypes';
import { db } from '../../database/db';
import notification from '../../notification/notification';
import moment from 'moment';

type IncomingAttackUpdate = Omit<IncomingAttack, 'troopEvadeCompleted' | 'resourceEvadeCompleted'>

class UpdateRallyPointIncomingAttackTroopsAction extends Action<any> {
    name = 'UpdateRallyPointIncomingAttackTroopsAction'

    shouldRun = async (ctx: ActionContext) => {
        return isInBuildingAtPosition('16', 39, { tt: '1' })
    }

    process = (villageId: string, element: JQuery<HTMLElement>, type: IncomingAttackType) => {
        const id = "" + cleanParseInt(element.find('img.markAttack')[0].id)
        const timeLeftStr = element.find('.timer').attr('value')
        if (!timeLeftStr) {
            return
        }

        const headline = element.find('.troopHeadline').text()
        const attackerName = headline.split(' ')[0].trim()
        const attackerCoordX = cleanParseInt(element.find('.coordinateX').text())
        const attackerCoordY = cleanParseInt(element.find('.coordinateY').text())
        const timeLeft = parseInt(timeLeftStr)

        const now = Date.now()

        const entry: IncomingAttackUpdate = {
            id,
            type,
            attackerName,
            attackerCoordX,
            attackerCoordY,
            villageId,
            arrivalLocalTime: now + timeLeft * 1000,
            updatedAt: now
        }

        const unitNames = element.find('.units .uniticon img')
            .map((_, e) => e.getAttribute('alt') || '')
            .toArray()

        const unitCounts = element.find('.units.last .unit')
            .map((_, e) => e.innerText)
            .toArray()

        const units: IncomingAttackUnit[] = unitNames.map((e, i) => ({
            id: id + '|' + i,
            incomingAttackId: id,
            unitName: e,
            unitCount: unitCounts[i]
        }))

        return { entry, units }
    }

    run = async (ctx: ActionContext) => {
        const attacks: IncomingAttackUpdate[] = []
        const attackUnits: Record<string, IncomingAttackUnit[]> = {}
        const villageId = ctx.currentVillage.id

        for (const ele of $('.troop_details.inRaid')) {
            const result = this.process(villageId, $(ele), IncomingAttackType.Raid)
            if (result) {
                const { entry, units } = result
                attacks.push(entry)
                attackUnits[entry.id] = units
            }
        }

        for (const ele of $('.troop_details.inAttack')) {
            const result = this.process(villageId, $(ele), IncomingAttackType.Attack)
            if (result) {
                const { entry, units } = result
                attacks.push(entry)
                attackUnits[entry.id] = units
            }
        }

        const existingAttacks = await db.incomingAttack.where('villageId').equals(villageId).toArray()
        const mergedAttacks: IncomingAttack[] = attacks.map(a => {
            const existingAttack = existingAttacks.find(ea => ea.id === a.id)
            return {
                ...a,
                troopEvadeCompleted: existingAttack?.troopEvadeCompleted || false,
                resourceEvadeCompleted: existingAttack?.resourceEvadeCompleted || false
            }
        })
        const outdatedIds = existingAttacks.filter(e => !attacks.find(a => a.id === e.id)).map(e => e.id)

        await db.incomingAttack.bulkDelete(outdatedIds)
        await db.incomingAttackUnit.where('incomingAttackId').anyOf(outdatedIds).delete()
        await db.incomingAttack.bulkPut(mergedAttacks)
        await db.incomingAttackUnit.bulkPut(Object.values(attackUnits).flatMap(e => e))

        for (const attack of mergedAttacks.filter(e => !existingAttacks.find(a => a.id === e.id))) {
            await notification.notificationRallyPointAttack(ctx.currentVillage.name, attack, attackUnits[attack.id])
        }

        await db.villages.put({
            ...ctx.currentVillage,
            nextRallyPointAttackScanTime: moment().add(5, 'minutes').valueOf()
        })

        return true
    }
}

export default new UpdateRallyPointIncomingAttackTroopsAction()