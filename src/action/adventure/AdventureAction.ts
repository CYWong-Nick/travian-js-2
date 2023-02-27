import { adventureFeatureDao } from "../../database/dao/feature/adventureFeatureDao"
import { Action, ActionContext } from "../../types/ActionTypes"
import { CurrentPageEnum } from "../../types/CommonTypes"
import { cleanParseInt } from "../../utils/NumberUtils"

class AdventureAction extends Action<any> {
    name = 'AdventureAction'

    shouldRun = async (ctx: ActionContext) => {
        return ctx.currentPage === CurrentPageEnum.Adventure
    }

    run = async (ctx: ActionContext) => {
        const adventureSettings = await adventureFeatureDao().getValue()
        for (const ele of $('.adventureList tbody tr')) {
            const duration = $(ele).find('.duration').text()
            const [h, m, s] = duration.split(':').map(cleanParseInt)
            if (h * 3600 + m * 60 + s < adventureSettings.maxDuration) {
                $(ele).find('.textButtonV2.green')[0].click()
                return true
            }
        }

        return true
    }
}

export default new AdventureAction()