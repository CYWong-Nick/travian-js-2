import { v4 } from 'uuid';
import { db } from '../../database/db';
import { CurrentPageEnum } from '../../types/CommonTypes';
import { Action, ActionContext } from '../../types/ActionTypes';
import { cleanParseInt } from '../../utils/NumberUtils';

class UpdateTownBuildingInfoAction extends Action<any> {
    name = 'UpdateTownBuildingInfoAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage === CurrentPageEnum.Town
    }

    run = async (ctx: ActionContext) => {
        const currentVillageId = ctx.currentVillage.id
        const villageBuildings = [...await db.villageBuildings.where('villageId').equals(currentVillageId).toArray()]
        const removal: string[] = []

        $('.buildingSlot').each((idx, e) => {
            const position = e.getAttribute('data-aid')
            const buildingId = e.getAttribute('data-gid')
            const levelEle = $(e).find('a.level')[0]
            const level = levelEle?.getAttribute('data-level')

            if (!buildingId || !position)
                return

            const positionInt = parseInt(position)
            const building = villageBuildings.find(e => e.position === positionInt)

            if (level && buildingId !== '0') {

                const tippy = positionInt === 40 ?
                    // @ts-ignore
                    $('#villageContent > div.buildingSlot.a40.bottom > svg > g.highlightShape > path')[0]._tippy
                    // @ts-ignore
                    : levelEle?._tippy

                const notice = $(tippy?.popper).find('.notice')
                const upgradeLevel = notice.length ?
                    Math.max(
                        ...notice
                            .map((_, e) => cleanParseInt(e.textContent || ''))
                            .toArray()
                    )
                    : null

                const levelInt = upgradeLevel || parseInt(level)

                if (building) {
                    building.buildingId = buildingId
                    building.level = levelInt
                } else {
                    villageBuildings.push({
                        id: v4(),
                        villageId: currentVillageId,
                        buildingId,
                        level: levelInt,
                        position: positionInt
                    })
                }
            } else {
                if (building && building.level !== 0)
                    removal.push(building.id)
            }
        })

        db.villageBuildings.bulkPut(villageBuildings)
        db.villageBuildings.bulkDelete(removal)

        return true
    }
}

export default new UpdateTownBuildingInfoAction()