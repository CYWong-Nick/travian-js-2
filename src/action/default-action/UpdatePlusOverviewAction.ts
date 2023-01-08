import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { Action, ActionContext } from '../../types/ActionTypes'
import { ActionQueueManager } from '../action'
import SwitchVillageAction from '../navigation/SwitchVillageAction'
import NavigateToTownAction from '../navigation/NavigateToTownAction'

class UpdatePlusOverviewAction extends Action<any> {
    name = 'UpdatePlusOverviewAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage === CurrentPageEnum.PlusOverview
    }

    run = async () => {
        const currentBuildQueue = await db.currentBuildQueue.toArray()
        const rows = $('#overview tr')
        const mgr = ActionQueueManager.begin()

        rows.each((_, e) => {
            const villageHref = $(e).find('.vil a').attr('href')
            if (!villageHref)
                return
            const villageId = villageHref.split('newdid=')[1]
            const buildCount = $(e).find('.bui a').length
            if (buildCount !== currentBuildQueue.filter(i => i.villageId === villageId).length) {
                mgr.add(SwitchVillageAction, { villageId })
                mgr.add(NavigateToTownAction, {})
            }
        })

        mgr.done()

        return true
    }
}

export default new UpdatePlusOverviewAction()