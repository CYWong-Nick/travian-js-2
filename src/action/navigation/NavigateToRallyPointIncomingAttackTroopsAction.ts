import { Action, ActionContext } from '../../types/ActionTypes';
import { isInBuilding } from '../../utils/BotUtils';
import { ActionQueueManager } from '../action';

const buttonTargetState = [
    {
        selector: '.filterCategory1',
        state: true
    },
    {
        selector: '.subFilterCategory1',
        state: true
    },
    {
        selector: '.subFilterCategory2',
        state: false
    },
    {
        selector: '.subFilterCategory3',
        state: false
    }
]

class NavigateToRallyPointIncomingAttackTroopsAction extends Action<any> {
    name = 'NavigateToRallyPointIncomingAttackTroopsAction'
    
    shouldRun = async (ctx: ActionContext) => {
        return isInBuilding('16', 39, { tt: '1' })
    }

    toggleToState = async (selector: string, checked: boolean): Promise<boolean> => {
        const ele = $(selector)
        if (ele.parent().hasClass('iconFilterActive') === checked) {
            return false
        } else {
            await ActionQueueManager.begin()
                .addFromBeginning(new NavigateToRallyPointIncomingAttackTroopsAction(), {})
                .done()

            ele[0].click()
            return true
        }
    }

    run = async (ctx: ActionContext) => {
        for (const item of buttonTargetState) {
            const toggled = await this.toggleToState(item.selector, item.state)
            if (toggled) {
                return false
            }
        }

        return true
    }
}

export default new NavigateToRallyPointIncomingAttackTroopsAction()