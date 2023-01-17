import { db } from "../../database/db"
import { toField } from "../../utils/NavigationUtils"
import { Action, ActionContext } from "../../types/ActionTypes"
import { isInBuildingAtPosition } from "../../utils/BotUtils"

interface UpgradeActionParam {
    buildItemId: string
}

class UpgradeAction extends Action<UpgradeActionParam> {
    name = 'UpgradeAction'
    
    shouldRun = async (ctx: ActionContext, param: UpgradeActionParam) => {
        const item = await db.buildQueue.get(param.buildItemId)
        if (!item)
            return false

        return isInBuildingAtPosition(item.buildingId, item.position)
    }

    run = async (ctx: ActionContext, param: UpgradeActionParam) => {
        const item = await db.buildQueue.get(param.buildItemId)
        if (!item) {
            throw new Error("Item not found")
        }

        const building = await db.villageBuildings.where({ villageId: item.villageId, buildingId: item.buildingId, position: item.position }).first()
        if (!building) {
            await db.buildQueue.delete(param.buildItemId)
            throw new Error("Building not found")
        }

        if (building.level + 1 !== item.targetLevel) {
            await db.buildQueue.delete(param.buildItemId)
            throw new Error('Mismatch level, skipping build.')
        }

        // Build
        const buildButton = $('.green.build:not(.videoFeatureButton)')[0]

        if (buildButton) {
            await db.buildQueue.delete(param.buildItemId)
            buildButton.click()
        } else {
            throw new Error('Cannot upgrade building')
        }
        return false
    }

    onFail = async (ctx: ActionContext, params: UpgradeActionParam) => {
        toField()
        return false
    }
}

export default new UpgradeAction()