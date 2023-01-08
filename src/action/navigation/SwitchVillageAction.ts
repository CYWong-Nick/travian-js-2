import { toVillage } from "../../utils/NavigationUtils"
import { Action, ActionContext } from "../../types/ActionTypes"

interface SwitchVillageActionParam {
    villageId: string
}

class SwitchVillageAction extends Action<SwitchVillageActionParam> {
    name = 'SwitchVillageAction'

    shouldRun = async (ctx: ActionContext, param: SwitchVillageActionParam) => {
        return ctx.currentVillage.id !== param.villageId
    }

    run = async (ctx: ActionContext, param: SwitchVillageActionParam) => {
        toVillage(param.villageId)
        return false
    }
}

export default new SwitchVillageAction()