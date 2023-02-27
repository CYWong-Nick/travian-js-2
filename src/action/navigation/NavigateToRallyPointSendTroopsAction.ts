import { Action, ActionContext } from "../../types/ActionTypes"
import { isInBuildingAtPosition } from "../../utils/BotUtils"
import { toTown } from "../../utils/NavigationUtils"

class NavigateToRallyPointSendTroopsAction extends Action<any> {
  name = 'NavigateToRallyPointSendTroopsAction'

  shouldRun = async (ctx: ActionContext, param: any) => {
    return isInBuildingAtPosition('16', 39)
  }

  run = async (ctx: ActionContext, param: any) => {
    $('.favorKey2 a')[0].click()
    return false
  }

  onFail = async (ctx: ActionContext, params: any): Promise<boolean> => {
    toTown()
    return false
  }
}

export default new NavigateToRallyPointSendTroopsAction()