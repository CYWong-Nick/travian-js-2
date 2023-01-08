import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import keyValueDao, { ConfigKey } from '../../database/dao/keyValueDao'
import moment from 'moment'
import NavigateToPlusOverviewAction from '../navigation/NavigateToPlusOverviewAction'
import NavigateToPlusResourcesAction from '../navigation/NavigateToPlusResourcesAction'
import NavigateToTownAction from '../navigation/NavigateToTownAction'

class ScanVillageOverviewAction extends Action<any> {
    name = 'ScanVillageOverviewAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const dao = keyValueDao<number>(ConfigKey.NextPlusOverviewScanTime, 0)
        const nextScan = await dao.getValue()

        if (moment(nextScan).isBefore(moment.now())) {
            await ActionQueueManager.begin()
                .add(NavigateToPlusOverviewAction, {})
                .add(NavigateToPlusResourcesAction, {})
                .add(NavigateToTownAction, {})
                .done()

            await dao.setValue(moment().add(10, 'minute').valueOf())
        }

        return true
    }
}

export default new ScanVillageOverviewAction()