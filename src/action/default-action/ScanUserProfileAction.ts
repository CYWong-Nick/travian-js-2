import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import keyValueDao, { ConfigKey } from '../../database/dao/keyValueDao'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import moment from 'moment'
import NavigateToUserProfileAction from '../navigation/NavigateToUserProfileAction'

class ScanUserProfileAction extends Action<any> {
    name = 'ScanUserProfileAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const nextUserProfileScanTimeDao = keyValueDao<number>(ConfigKey.NextUserProfileScanTime, 0)
        const nextUserProfileScanTime = await nextUserProfileScanTimeDao.getValue()

        if (moment(nextUserProfileScanTime).isBefore(moment.now())) {
            await ActionQueueManager.begin()
                .add(NavigateToUserProfileAction, {})
                .add(NavigateToTownAction, {})
                .done()

            await nextUserProfileScanTimeDao.setValue(moment().add(12, 'minute').valueOf())
        }
        return true
    }
}

export default new ScanUserProfileAction()