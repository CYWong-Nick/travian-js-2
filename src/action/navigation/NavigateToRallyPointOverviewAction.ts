import { Action, ActionContext } from "../../types/ActionTypes"
import { isInBuilding } from "../../utils/BotUtils"

class NavigateToRallyPointOverviewAction extends Action<any> {
  name = 'NavigateToRallyPointOverviewAction'
  
  shouldRun = async (ctx: ActionContext, param: any) => {
    return isInBuilding('16', 39)
  }

  run = async (ctx: ActionContext, param: any) => {
    $('.favorKey1 a')[0].click()
    return false
  }
}

export default new NavigateToRallyPointOverviewAction()