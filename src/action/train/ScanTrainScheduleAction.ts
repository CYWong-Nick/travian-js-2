import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import TrainAction from './TrainAction'
import SwitchVillageAction from '../navigation/SwitchVillageAction'
import NavigateToBuildingAction from '../navigation/NavigateToBuildingAction'

class ScanTrainScheduleAction extends Action<any> {
    name = 'ScanTrainScheduleAction'

    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const trainSchedules = await db.autoTrainSchedule.toArray()
        if (!trainSchedules) {
            return true
        }

        const now = Date.now()
        const targets = trainSchedules.filter(e => e.nextTrainTime <= now)

        const mgr = ActionQueueManager.begin()
        for (const target of targets) {
            const building = await db.villageBuildings.where({
                villageId: target.villageId,
                buildingId: target.buildingId
            }).first()

            if (!building) {
                continue
            }

            mgr.add(SwitchVillageAction, { villageId: target.villageId })
                .add(NavigateToTownAction, {})
                .add(NavigateToBuildingAction, { buildingId: building.buildingId, position: building.position })
                .add(TrainAction, { trainScheduleId: target.id })
                .add(NavigateToTownAction, {})
        }

        await mgr.done()
        return true
    }
}

export default new ScanTrainScheduleAction()