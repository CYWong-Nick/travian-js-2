import { Action, ActionContext } from "../../types/ActionTypes"
import { CurrentPageEnum } from "../../types/CommonTypes"
import { cleanParseInt } from "../../utils/NumberUtils"

class AdventureAction extends Action<any> {
    name = 'AdventureAction'

    shouldRun = async (ctx: ActionContext) => {
        return ctx.currentPage === CurrentPageEnum.Adventure
    }

    run = async (ctx: ActionContext) => {
        for (const ele of $('.adventureList tbody tr')) {
            const duration = $(ele).find('.duration').text()
            const [h, m, s] = duration.split(':').map(cleanParseInt)
            if (h * 3600 + m * 60 + s < 1800) {
                $(ele).find('.textButtonV2.green')[0].click()
                return true
            }
        }

        return true
    }
}

export default new AdventureAction()