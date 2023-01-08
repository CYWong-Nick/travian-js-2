import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

class NavigateToAllReportAction extends Action<any> {
    shouldRun = async (ctx: ActionContext, param: any) => {
      return ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async (ctx: ActionContext, param: any) => {
        $('.reports')[0].click()
        return false
    }
}

export default new NavigateToAllReportAction()