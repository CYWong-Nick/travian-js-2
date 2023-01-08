import { Action, ActionContext } from "../../types/ActionTypes"
import { autoBuildVillage } from "../../static-data/plan"

class AutoBuildAction extends Action<any> {
    name = 'AutoBuildAction'
    
    shouldRun = async (ctx: ActionContext) => {
        return true
    }

    run = async (ctx: ActionContext) => {
        autoBuildVillage(ctx.currentVillage)
        return true
    }
}

export default new AutoBuildAction()