import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { Action, ActionContext } from '../../types/ActionTypes'
import moment from 'moment'
import { ActionQueueManager } from '../action'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import NavigateToBuildingAction from '../navigation/NavigateToBuildingAction'
import NavigateToFieldAction from '../navigation/NavigateToFieldAction'
import NavigateToMarketSendResourceAction from '../navigation/NavigateToMarketSendResourceAction'
import SendResourceAction from '../market/SendResourceAction'

class ScanResourceEvadeAction extends Action<any> {
    name = 'ScanAdventureAction'

    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const villages = await db.villages.toArray()
        const incomingAttacks = await db.incomingAttack.toArray()

        const mgr = ActionQueueManager.begin()

        const resourceEvasions = incomingAttacks.filter(e =>
            !e.resourceEvadeCompleted
            && moment().diff(e.arrivalLocalTime, 'minute') <= 1
            && villages.find(v => v.id === e.villageId)?.enableResourceEvade
        )

        for (const e of resourceEvasions) {
            const village = villages.find(v => v.id === e.villageId)
            const targetVillage = villages.find(v => v.id === village?.resourceEvadeVillageId)
            const market = await db.villageBuildings.where({ villageId: e.villageId, buildingId: '17' }).first()
            if (!market || !targetVillage) {
                continue
            }

            mgr.add(NavigateToTownAction, {})
                .add(NavigateToBuildingAction, { buildingId: '17', position: market.position })
                .add(NavigateToMarketSendResourceAction, {})
                .add(SendResourceAction, { targetVillage, isAutoEvade: true, attackId: e.id })
                .add(NavigateToFieldAction, {})
        }

        await mgr.done()

        return true
    }
}

export default new ScanResourceEvadeAction()