import { CurrentPageEnum } from "../../types/CommonTypes"
import { toField } from "../../utils/NavigationUtils"
import { Action, ActionContext } from "../../types/ActionTypes"

class NavigateToFieldAction extends Action<any> {
    shouldRun = async (ctx: ActionContext) => {
        return ctx.currentPage !== CurrentPageEnum.Field
    }

    run = async (ctx: ActionContext) => {
        toField()
        return false
    }
}

export default new NavigateToFieldAction()