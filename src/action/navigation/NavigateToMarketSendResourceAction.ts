import { Action, ActionContext } from "../../types/ActionTypes"
import { isInBuilding } from "../../utils/BotUtils"
 
class NavigateToMarketSendResourceAction extends Action<any> {
    name = 'NavigateToMarketSendResourceAction'
    
    shouldRun = async (ctx: ActionContext, param: any) => {
        return isInBuilding('17')
    }

    run = async (ctx: ActionContext, param: any) => {
        $('.favorKey5 a')[0].click()
        return false
    }
}

export default new NavigateToMarketSendResourceAction()