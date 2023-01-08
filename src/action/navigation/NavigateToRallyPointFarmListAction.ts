import { Action, ActionContext } from "../../types/ActionTypes"
import { isInBuilding } from "../../utils/BotUtils"
import { toTown } from "../../utils/NavigationUtils"

class NavigateToRallyPointFarmListAction extends Action<any> {
  name = 'NavigateToRallyPointFarmListAction'

  shouldRun = async (ctx: ActionContext, param: any) => {
    return isInBuilding('16', 39)
  }

  run = async (ctx: ActionContext, param: any) => {
    const ele = $('.favorKey99 a')
    if (ele.hasClass('gold')) {
      throw new Error("Gold club not activated.")
    }

    ele[0].click()
    return false
  }

  onFail = async (ctx: ActionContext, params: any): Promise<boolean> => {
    toTown()
    return false
  }
}

export default new NavigateToRallyPointFarmListAction()