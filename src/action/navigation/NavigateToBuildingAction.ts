import { buildings } from "../../static-data/building"
import { BuildingLocation } from "../../types/BuildingTypes"
import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

interface NavigateToBuildingActionParam {
    buildingId: string
    position: number,
    navigateIfEmpty?: boolean
}

class NavigateToBuildingAction extends Action<NavigateToBuildingActionParam> {
    shouldRun = async (ctx: ActionContext, param: NavigateToBuildingActionParam) => {
        const location = buildings[param.buildingId].location
        return (location === BuildingLocation.Field && ctx.currentPage === CurrentPageEnum.Field)
            || (location === BuildingLocation.Town && ctx.currentPage === CurrentPageEnum.Town)
    }

    run = async (ctx: ActionContext, param: NavigateToBuildingActionParam) => {
        const location = buildings[param.buildingId].location
        if (location === BuildingLocation.Field) {
            $(`.gid${param.buildingId}.buildingSlot${param.position}`)[0].click()
        } else {
            if (param.position === 40) {
                // Handling for wall
                $('.a40 .hoverShape path').trigger('click')
                if (param.navigateIfEmpty) {
                    $('.g0.a40 a')[0].click()
                }
            } else {
                const emptySelector = param.navigateIfEmpty ? `, .g0.a${param.position} a` : ''
                $(`.g${param.buildingId}.a${param.position} a ${emptySelector}`)[0].click()
            }
        }
        
        return false
    }
}

export default new NavigateToBuildingAction()