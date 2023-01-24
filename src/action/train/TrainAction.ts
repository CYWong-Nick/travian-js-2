import { Action, ActionContext } from '../../types/ActionTypes';
import { isInBuilding } from '../../utils/BotUtils';
import { db } from '../../database/db';
import { toTown } from '../../utils/NavigationUtils';
import { randomInteger } from '../../utils/NumberUtils';
import moment from 'moment';
import { getTroopInfo, getTroopTrainingBuildingIds } from '../../static-data/troop';

interface TrainActionParam {
    trainScheduleId: string
}

class TrainAction extends Action<TrainActionParam> {
    name = 'TrainAction'

    shouldRun = async (ctx: ActionContext, param: TrainActionParam) => {
        const trainSchedule = await db.autoTrainSchedule.get(param.trainScheduleId)
        if (!trainSchedule) {
            return false
        }

        const troop = getTroopInfo(ctx.currentVillage.tribe, trainSchedule.troopId)
        const buildingIds = getTroopTrainingBuildingIds(troop)

        return ctx.currentVillage.id === trainSchedule.villageId
            && buildingIds.some(e => isInBuilding(e))
    }

    run = async (ctx: ActionContext, param: TrainActionParam) => {
        const trainSchedule = await db.autoTrainSchedule.get(param.trainScheduleId)
        if (!trainSchedule) {
            throw new Error("No train schedule found")
        }

        $(`.cta input[name=${trainSchedule.troopId}]`).val(trainSchedule.count)

        await db.autoTrainSchedule.put({
            ...trainSchedule,
            nextTrainTime: moment().add(
                randomInteger(trainSchedule.minInterval, trainSchedule.maxInterval),
                'seconds'
            ).valueOf()
        })

        $('.green.startTraining').trigger('click')

        return false
    }

    onFail = async (ctx: ActionContext, params: TrainActionParam): Promise<boolean> => {
        toTown()
        return false
    }
}

export default new TrainAction()