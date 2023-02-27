import { db } from '../../database/db';
import { Action, ActionContext } from '../../types/ActionTypes';
import { isInBuildingAtPosition } from '../../utils/BotUtils';

export enum SendTroopEventType {
    REINFORCEMENT = 'REINFORCEMENT',
    ATTACK = 'ATTACK',
    RAID = 'RAID'
}

interface SendTroopsActionParam {
    coordX: number
    coordY: number
    troops: number[]
    eventType: SendTroopEventType
    isAutoEvade?: boolean
    attackId?: string
}

class SendTroopsAction extends Action<SendTroopsActionParam> {
    name = 'SendTroopsAction'

    shouldRun = async (ctx: ActionContext) => {
        return isInBuildingAtPosition('16', 39, { tt: '2' })
    }

    getEventId = (eventType: SendTroopEventType) => {
        switch (eventType) {
            case SendTroopEventType.REINFORCEMENT: {
                return '5'
            }
            case SendTroopEventType.ATTACK: {
                return '3'
            }
            case SendTroopEventType.RAID: {
                return '4'
            }
        }
    }

    run = async (ctx: ActionContext, param: SendTroopsActionParam) => {
        const eventId = this.getEventId(param.eventType)

        $('#xCoordInput').val(param.coordX)
        $('#yCoordInput').val(param.coordY)
        $(`input[name=eventType][value=${eventId}]`).trigger('click')

        if (param.isAutoEvade) {
            $('tr a').trigger('click')

            if (param.attackId) {
                const incomingAttack = await db.incomingAttack.get(param.attackId)
                incomingAttack && await db.incomingAttack.put({
                    ...incomingAttack,
                    troopEvadeCompleted: true
                })
            }
        } else {
            for (let i = 1; i <= 11; i++) {
                const troopCount = param.troops[i]
                if (!troopCount) {
                    continue
                }
                $(`input[name="troop[t${i}]"]`).text(troopCount)
            }
        }

        $('.textButtonV1.green').trigger('click')

        return false
    }
}

export default new SendTroopsAction()