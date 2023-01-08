import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { Village } from '../../types/VillageTypes'
import { Action, ActionContext } from '../../types/ActionTypes'
import { parseIntIgnoreSep } from '../../utils/NumberUtils'

class UpdatePlusResourcesAction extends Action<any> {
    name = 'UpdatePlusResourcesAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage === CurrentPageEnum.PlusResources
    }

    run = async () => {
        const rows = $('#ressources tr')
        const villages = await db.villages.toArray()

        const villageUpdates: Village[] = []

        rows.each((_, e) => {
            const villageHref = $(e).find('.vil a').attr('href')

            if (!villageHref)
                return

            const lumber = parseIntIgnoreSep($(e).find('.lum').text())
            const clay = parseIntIgnoreSep($(e).find('.clay').text())
            const iron = parseIntIgnoreSep($(e).find('.iron').text())
            const crop = parseIntIgnoreSep($(e).find('.crop').text())

            const villageId = villageHref.split('newdid=')[1]

            const village = villages.find(v => v.id === villageId)
            if (!village)
                return

            villageUpdates.push({
                ...village,
                lumber,
                clay,
                iron,
                crop
            })
        })

        db.villages.bulkPut(villageUpdates)

        return true
    }
}

export default new UpdatePlusResourcesAction()