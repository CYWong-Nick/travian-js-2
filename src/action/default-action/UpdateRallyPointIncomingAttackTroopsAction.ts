import { Action, ActionContext } from '../../types/ActionTypes';
import { cleanParseInt } from '../../utils/NumberUtils';
import { isInBuilding } from '../../utils/BotUtils';
import { IncomingAttack, IncomingAttackType, IncomingAttackUnit } from '../../types/DatabaseTypes';
import { db } from '../../database/db';
import notification from '../../notification/notification';

class UpdateRallyPointIncomingAttackTroopsAction extends Action<any> {
    name = 'UpdateRallyPointIncomingAttackTroopsAction'
    
    shouldRun = async (ctx: ActionContext) => {
        return isInBuilding('16', 39, { tt: '1' })
            && $('.filterCategory1').parent().hasClass('iconFilterActive')
            && $('.subFilterCategory1').parent().hasClass('iconFilterActive')
            && !$('.subFilterCategory2').parent().hasClass('iconFilterActive')
            && !$('.subFilterCategory3').parent().hasClass('iconFilterActive')
    }

    process = (element: JQuery<HTMLElement>, type: IncomingAttackType) => {
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

        const villageLink = element.find('.troopHeadline  a:nth-child(2)').attr('href')
        if (!villageLink)
            return

        const villageId = "" + cleanParseInt(villageLink)
        const now = Date.now()

        const entry: IncomingAttack = {
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
        const attacks: IncomingAttack[] = []
        const attackUnits: Record<string, IncomingAttackUnit[]> = {}

        for (const ele of $('.troop_details.inRaid')) {
            const result = this.process($(ele), IncomingAttackType.Raid)
            if (result) {
                const { entry, units } = result
                attacks.push(entry)
                attackUnits[entry.id] = units
            }
        }

        for (const ele of $('.troop_details.inAttack')) {
            const result = this.process($(ele), IncomingAttackType.Attack)
            if (result) {
                const { entry, units } = result
                attacks.push(entry)
                attackUnits[entry.id] = units
            }
        }

        const existing = await db.incomingAttack.toArray()
        const outdatedIds = existing.filter(e => !attacks.find(a => a.id === e.id)).map(e => e.id)

        await db.incomingAttack.bulkDelete(outdatedIds)
        await db.incomingAttackUnit.where('incomingAttackId').anyOf(outdatedIds).delete()
        await db.incomingAttack.bulkPut(attacks)
        await db.incomingAttackUnit.bulkPut(Object.values(attackUnits).flatMap(e => e))

        for (const attack of attacks.filter(e => !existing.find(a => a.id === e.id))) {
            notification.notificationRallyPointAttack(ctx.currentVillage.name, attack, attackUnits[attack.id])
        }

        return true
    }
}

export default new UpdateRallyPointIncomingAttackTroopsAction()