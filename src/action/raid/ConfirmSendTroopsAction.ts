import { Action, ActionContext } from '../../types/ActionTypes';
import { isInBuildingAtPosition } from '../../utils/BotUtils';

class ConfirmSendTroopsAction extends Action<any> {
    name = 'ConfirmSendTroopsAction'

    shouldRun = async (ctx: ActionContext) => {
        return isInBuildingAtPosition('16', 39, { tt: '2' })
    }

    run = async (ctx: ActionContext) => {
        $('.textButtonV1.green.rallyPointConfirm')[0].click()
        return false
    }
}

export default new ConfirmSendTroopsAction()