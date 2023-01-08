import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

class NavigateToPlusResourcesAction extends Action<any> {
  shouldRun = async (ctx: ActionContext, param: any) => {
    return ctx.currentPage === CurrentPageEnum.PlusOverview
  }

  run = async (ctx: ActionContext, param: any) => {
    $('.tabItem[href="/village/statistics/resources"]')[0].click()
    return false
  }
}

export default new NavigateToPlusResourcesAction()