import { Action, ActionContext } from '../../types/ActionTypes';
import { isInBuildingAtPosition, sleep } from '../../utils/BotUtils';
import { db } from '../../database/db';
import { cleanParseInt } from '../../utils/NumberUtils';

interface RaidActionParam {
    raidScheduledId: string
}

class RaidAction extends Action<RaidActionParam> {
    name = 'RaidAction'
    
    shouldRun = async (ctx: ActionContext) => {
        return isInBuildingAtPosition('16', 39, { tt: '99' })
    }

    run = async (ctx: ActionContext, param: RaidActionParam) => {
        while ($('div.expandCollapse.expanded.loading').length) {
            await sleep(0.5)
        }

        const raidSchedule = await db.raidSchedule.get(param.raidScheduledId)
        if (!raidSchedule)
            throw new Error("Raid schedule not found")

        for (let raidList of $('.raidList')) {
            const listEle = $(raidList)
            const listName = listEle.find('.listName').text().trim()
            const listSize = cleanParseInt(listEle.find('.slotsCount').text())
            
            if (listName.startsWith(raidSchedule.prefix) && listSize) {
                listEle.find('button[value=Start]')[0].click()
                while (listEle.find('button[disabled=disabled]').length) {
                    await sleep(0.5)
                }
            }
        }

        return true
    }
}

export default new RaidAction()