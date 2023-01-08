import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

class NavigateToPlusOverviewAction extends Action<any> {
    shouldRun = async (ctx: ActionContext, param: any) => {
      return ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async (ctx: ActionContext, param: any) => {
        $('.overview.green')[0].click()
        return false
    }
}

export default new NavigateToPlusOverviewAction()