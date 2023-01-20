import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import keyValueDao, { ConfigKey } from '../../database/dao/keyValueDao'
import moment from 'moment'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import NavigateToBuildingAction from '../navigation/NavigateToBuildingAction'
import NavigateToRallyPointFarmListAction from '../navigation/NavigateToRallyPointFarmListAction'
import SwitchVillageAction from '../navigation/SwitchVillageAction'
import DisableRaidLossAction from '../raid/DisableRaidLossAction'

class ScanRaidLossAction extends Action<any> {
    name = 'ScanRaidLossAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const villages = await db.villages.toArray()
        const capital = villages.find(v => v.isCapital)

        if (!capital) {
            throw new Error("Capital not found")
        }

        const nextRaidReportScanTimeDao = keyValueDao<number>(ConfigKey.NextRaidReportScanTime, 0)
        const nextRaidReportScanTime = await nextRaidReportScanTimeDao.getValue()

        if (moment(nextRaidReportScanTime).isBefore(moment.now())) {
            await ActionQueueManager.begin()
                .add(SwitchVillageAction, { villageId: capital.id })
                .add(NavigateToTownAction, {})
                .add(NavigateToBuildingAction, { buildingId: '16', position: 39 })
                .add(NavigateToRallyPointFarmListAction, {})
                .add(DisableRaidLossAction, {})
                .add(NavigateToTownAction, {})
                .done()

            await nextRaidReportScanTimeDao.setValue(moment().add(5, 'minute').valueOf())
        }
        return true
    }
}

export default new ScanRaidLossAction()