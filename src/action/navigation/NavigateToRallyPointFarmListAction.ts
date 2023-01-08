import { Action, ActionContext } from "../../types/ActionTypes"
import { isInBuilding } from "../../utils/BotUtils"

class NavigateToRallyPointFarmListAction extends Action<any> {
  shouldRun = async (ctx: ActionContext, param: any) => {
    return isInBuilding('16', 39)
  }

  run = async (ctx: ActionContext, param: any) => {
    $('.favorKey99 a')[0].click()
    return false
  }
}

export default new NavigateToRallyPointFarmListAction()