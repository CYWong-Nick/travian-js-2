import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

class NavigateToAdventureAction extends Action<any> {
  name = 'NavigateToAdventureAction'

  shouldRun = async (ctx: ActionContext, param: any) => {
    return ctx.currentPage !== CurrentPageEnum.Unknown
  }

  run = async (ctx: ActionContext, param: any) => {
    $('.adventure .content')[0].click()
    return false
  }
}

export default new NavigateToAdventureAction()