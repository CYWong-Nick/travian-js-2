import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import NavigateToBuildingAction from '../navigation/NavigateToBuildingAction'
import SwitchVillageAction from '../navigation/SwitchVillageAction'
import RaidAction from '../raid/RaidAction'
import moment from 'moment'
import { randomInteger } from '../../utils/NumberUtils'
import NavigateToRallyPointFarmListAction from '../navigation/NavigateToRallyPointFarmListAction'

class ScanRaidScheduleAction extends Action<any> {
    name = 'ScanRaidScheduleAction'
    
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

        const raidSchedule = await db.raidSchedule.toArray()
        const mgr = ActionQueueManager.begin()
        db.raidSchedule.bulkPut(
            raidSchedule.filter(e => e.nextFarmTime < Date.now())
                .map(e => {
                    mgr.add(SwitchVillageAction, { villageId: capital.id })
                        .add(NavigateToTownAction, {})
                        .add(NavigateToBuildingAction, { buildingId: '16', position: 39 })
                        .add(NavigateToRallyPointFarmListAction, {})
                        .add(RaidAction, { raidScheduledId: e.id })
                        .add(NavigateToTownAction, {})

                    return {
                        ...e,
                        nextFarmTime: moment().add(randomInteger(e.minInterval, e.maxInterval), 'second').valueOf()
                    }
                })
        )

        await mgr.done()
        return true
    }
}

export default new ScanRaidScheduleAction()