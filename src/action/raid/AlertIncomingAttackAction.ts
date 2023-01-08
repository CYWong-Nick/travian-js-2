import { Action, ActionContext } from '../../types/ActionTypes';
import { isInBuilding, sleep } from '../../utils/BotUtils';

class NavigateToRallyPointIncomingTroopsAction extends Action<any> {
    shouldRun = async (ctx: ActionContext) => {
        return isInBuilding('16', 39, { tt: '1', filter: '1' })
    }

    run = async (ctx: ActionContext) => {
        $('.filterCategory1')[0].click()
        return false
    }
}

export default new NavigateToRallyPointIncomingTroopsAction()