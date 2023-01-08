import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

class NavigateToOffensiveReportAction extends Action<any> {
    shouldRun = async (ctx: ActionContext, param: any) => {
        return ctx.currentPage === CurrentPageEnum.Report
    }

    run = async (ctx: ActionContext, param: any) => {
        $('.favorKeyoffensive > a')[0].click()
        return false
    }
}

export default new NavigateToOffensiveReportAction()