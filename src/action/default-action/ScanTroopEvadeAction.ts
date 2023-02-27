import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { Action, ActionContext } from '../../types/ActionTypes'
import moment from 'moment'
import { ActionQueueManager } from '../action'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import NavigateToBuildingAction from '../navigation/NavigateToBuildingAction'
import NavigateToRallyPointSendTroopsAction from '../navigation/NavigateToRallyPointSendTroopsAction'
import SendTroopsAction, { SendTroopEventType } from '../raid/SendTroopsAction'
import ConfirmSendTroopsAction from '../raid/ConfirmSendTroopsAction'

class ScanTroopEvadeAction extends Action<any> {
    name = 'ScanTroopEvadeAction'

    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const villages = await db.villages.toArray()
        const incomingAttacks = await db.incomingAttack.toArray()

        const mgr = ActionQueueManager.begin()

        const troopEvasions = incomingAttacks.filter(e =>
            !e.troopEvadeCompleted
            && moment(e.arrivalLocalTime).diff(moment(), 'minute') <= 200
            && villages.find(v => v.id === e.villageId)?.enableTroopEvade
        )

        for (const e of troopEvasions) {
            const village = villages.find(v => v.id === e.villageId)

            if (!village) {
                continue
            }

            mgr.add(NavigateToTownAction, {})
                .add(NavigateToBuildingAction, { buildingId: '16', position: 39 })
                .add(NavigateToRallyPointSendTroopsAction, {})
                .add(SendTroopsAction, { coordX: village.troopEvadeTargetCoordX, coordY: village.troopEvadeTargetCoordY, eventType: SendTroopEventType.RAID, isAutoEvade: true, troops: [] })
                .add(ConfirmSendTroopsAction, {})
                .add(NavigateToTownAction, {})
        }

        await mgr.done()

        return true
    }
}

export default new ScanTroopEvadeAction()