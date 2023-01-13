import { db } from "../../database/db"
import { toField } from "../../utils/NavigationUtils"
import { Action, ActionContext } from "../../types/ActionTypes"

interface BuildActionParam {
    buildItemId: string
}

class BuildAction extends Action<BuildActionParam> {
    name = 'BuildAction'

    shouldRun = async (ctx: ActionContext, param: BuildActionParam) => {
        const item = await db.buildQueue.get(param.buildItemId)
        if (!item)
            return false

        const url = new URL(window.location.href)
        return url.searchParams.get('id') === '' + item.position
    }

    run = async (ctx: ActionContext, param: BuildActionParam) => {
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

        const buildButton = $(`#contract_building${item.buildingId} .green.new`)[0]
        if (buildButton) {
            await db.buildQueue.delete(item.id)
            buildButton.click()
        } else {
            throw new Error("Cannot build")
        }

        return false
    }

    onFail = async (ctx: ActionContext, params: BuildActionParam) => {
        toField()
        return false
    }
}

export default new BuildAction()