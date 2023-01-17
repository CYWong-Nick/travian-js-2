import { Action, ActionContext } from "../../types/ActionTypes"
import { isInBuildingAtPosition } from "../../utils/BotUtils"

class NavigateToRallyPointOverviewAction extends Action<any> {
  name = 'NavigateToRallyPointOverviewAction'
  
  shouldRun = async (ctx: ActionContext, param: any) => {
    return isInBuildingAtPosition('16', 39)
  }

  run = async (ctx: ActionContext, param: any) => {
    $('.favorKey1 a')[0].click()
    return false
  }
}

export default new NavigateToRallyPointOverviewAction()