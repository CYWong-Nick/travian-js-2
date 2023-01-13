import { v4 } from 'uuid';
import { db } from '../../database/db';
import { buildings } from '../../static-data/building';
import { CurrentPageEnum } from '../../types/CommonTypes';
import { cleanParseInt } from '../../utils/NumberUtils';
import { Action, ActionContext } from '../../types/ActionTypes';
import keyValueDao, { ConfigKey } from '../../database/dao/keyValueDao';

class UpdateVillageBasicInfo extends Action<any> {
    name = 'UpdateVillageBasicInfo'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        return [CurrentPageEnum.Field, CurrentPageEnum.Town].includes(ctx.currentPage)
    }

    run = async (ctx: ActionContext) => {
        const currentVillageId = ctx.currentVillage.id
        const warehouseCapacity = cleanParseInt($('.warehouse .capacity .value').text())
        const granaryCapacity = cleanParseInt($('.granary .capacity .value').text())
        const lumber = cleanParseInt($('#l1').text())
        const clay = cleanParseInt($('#l2').text())
        const iron = cleanParseInt($('#l3').text())
        const crop = cleanParseInt($('#l4').text())

        const playerName = $('.playerName').text()
        await keyValueDao<string>(ConfigKey.PlayerName, '').setValue(playerName)

        const village = await db.villages.get(currentVillageId)
        if (village) {
            await db.villages.put({
                ...village,
                lumber,
                clay,
                iron,
                crop,
                lumberCapacity: warehouseCapacity,
                clayCapacity: warehouseCapacity,
                ironCapacity: warehouseCapacity,
                cropCapacity: granaryCapacity
            })
        }

        const currentBuildingQueue = $('.buildingList li').map((idx, e) => {
            const ele = $(e)
            const name = ele.find('.name')[0].childNodes[0].textContent?.trim()
            const level = ele.find('.lvl').text()
            const duration = ele.find('.timer').attr('value')

            const buildingId = Object.values(buildings)
                .find(e => e.name === name)
                ?.id

            if (!buildingId || !level || !duration)
                return null

            return {
                id: v4(),
                villageId: currentVillageId,
                buildingId,
                targetLevel: cleanParseInt(level),
                targetCompletionTime: Date.now() + parseInt(duration) * 1000
            }
        }).toArray()
        
        await db.transaction('rw', db.currentBuildQueue, async () => {
            await db.currentBuildQueue.where('villageId').equals(currentVillageId).delete()
            await db.currentBuildQueue.bulkPut(currentBuildingQueue)
        })
        
        return true
    }
}

export default new UpdateVillageBasicInfo()