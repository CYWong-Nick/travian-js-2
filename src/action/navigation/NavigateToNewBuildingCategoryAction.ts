import { BuildingCategory } from "../../types/BuildingTypes"
import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

interface NavigateToNewBuildingCategoryActionParam {
    category: BuildingCategory
}

class NavigateToNewBuildingCategoryAction extends Action<NavigateToNewBuildingCategoryActionParam> {
    name = 'NavigateToNewBuildingCategoryAction'
    
    shouldRun = async (ctx: ActionContext, param: NavigateToNewBuildingCategoryActionParam) => {
        return ctx.currentPage === CurrentPageEnum.Building && param.category !== BuildingCategory.Others
    }

    run = async (ctx: ActionContext, param: NavigateToNewBuildingCategoryActionParam) => {
        if (param.category === BuildingCategory.Infrastructure) {
            $('.tabItem.infrastructure')[0].click()
        } else if (param.category === BuildingCategory.Military) {
            $('.tabItem.military')[0].click()
        } else if (param.category === BuildingCategory.Resources) {
            $('.tabItem.resources')[0].click()
        }

        return false
    }
}

export default new NavigateToNewBuildingCategoryAction()