import { CurrentPageEnum } from "../../types/CommonTypes"
import { toTown } from "../../utils/NavigationUtils"
import { Action, ActionContext } from "../../types/ActionTypes"

class NavigateToTownAction extends Action<any> {
    shouldRun = async (ctx: ActionContext) => {
        return ctx.currentPage !== CurrentPageEnum.Town
    }

    run = async (ctx: ActionContext) => {
        toTown()
        return false
    }
}

export default new NavigateToTownAction()