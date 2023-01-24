import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import NavigateToBuildingAction from '../navigation/NavigateToBuildingAction'
import SwitchVillageAction from '../navigation/SwitchVillageAction'
import NavigateToRallyPointOverviewAction from '../navigation/NavigateToRallyPointOverviewAction'
import NavigateToRallyPointIncomingAttackTroopsAction from '../navigation/NavigateToRallyPointIncomingAttackTroopsAction'
import UpdateRallyPointIncomingAttackTroopsAction from './UpdateRallyPointIncomingAttackTroopsAction'

class ScanRallyPointIncomingAttackAction extends Action<any> {
    name = 'ScanRallyPointIncomingAttackAction'

    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const villages = await db.villages.toArray()
        const scanVillages = villages.filter(e => e.hasPlusAttackWarning && e.nextRallyPointAttackScanTime <= Date.now())
        const mgr = ActionQueueManager.begin()
        scanVillages.forEach(e => {
            mgr.add(SwitchVillageAction, { villageId: e.id })
                .add(NavigateToTownAction, {})
                .add(NavigateToBuildingAction, { buildingId: '16', position: 39 })
                .add(NavigateToRallyPointOverviewAction, {})
                .add(NavigateToRallyPointIncomingAttackTroopsAction, {})
                .add(UpdateRallyPointIncomingAttackTroopsAction, {})
                .add(NavigateToTownAction, {})
        })
        await mgr.done()
        return true
    }
}

export default new ScanRallyPointIncomingAttackAction()