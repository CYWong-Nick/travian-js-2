import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import NavigateToBuildingAction from '../navigation/NavigateToBuildingAction'
import SwitchVillageAction from '../navigation/SwitchVillageAction'
import moment from 'moment'
import NavigateToRallyPointOverviewAction from '../navigation/NavigateToRallyPointOverviewAction'
import NavigateToRallyPointIncomingAttackTroopsAction from '../navigation/NavigateToRallyPointIncomingAttackTroopsAction'
import keyValueDao, { ConfigKey } from '../../database/dao/keyValueDao'

class ScanRallyPointIncomingAttackAction extends Action<any> {
    name = 'ScanRallyPointIncomingAttackAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const dao = keyValueDao<number>(ConfigKey.NextRallyPointIncomingAttackScanTime, 0)
        const nextRallyPointIncomingAttackScanTime = await dao.getValue()

        if (nextRallyPointIncomingAttackScanTime > Date.now()) {
            return true
        }

        const villages = await db.villages.toArray()
        const scanVillages = villages.filter(e => !!e.plusAttackStartTime)
        const mgr = ActionQueueManager.begin()
        scanVillages.forEach(e => {
            mgr.add(SwitchVillageAction, { villageId: e.id })
                .add(NavigateToTownAction, {})
                .add(NavigateToBuildingAction, { buildingId: '16', position: 39 })
                .add(NavigateToRallyPointOverviewAction, {})
                .add(NavigateToRallyPointIncomingAttackTroopsAction, {})
                .add(NavigateToTownAction, {})
        })
        await mgr.done()
        await dao.setValue(moment().add(5, 'minute').valueOf())
        return true
    }
}

export default new ScanRallyPointIncomingAttackAction()