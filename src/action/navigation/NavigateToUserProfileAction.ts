import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

class NavigateToUserProfileAction extends Action<any> {
    shouldRun = async (ctx: ActionContext, param: any) => {
      return ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async (ctx: ActionContext, param: any) => {
        $('.profile a')[0].click()
        return false
    }
}

export default new NavigateToUserProfileAction()