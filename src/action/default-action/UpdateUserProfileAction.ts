import { db } from "../../database/db"
import { CurrentPageEnum } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"
import keyValueDao, { ConfigKey } from "../../database/dao/keyValueDao"

class UpdateUserProfileAction extends Action<any> {
    name = 'UpdateUserProfileAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        if (ctx.currentPage !== CurrentPageEnum.UserProfile)
            return false

        const playerName = $('.titleInHeader').text()
        const storedName = await keyValueDao<string>(ConfigKey.PlayerName, '').getValue()

        return playerName === storedName
    }

    run = async (ctx: ActionContext) => {
        let capitalName = ''
        $('.villages tr').each((_, e) => {
            const name = $(e).find('.name a').text()
            const additionalInfo = $(e).find('.additionalInfo').text()
            if (additionalInfo.includes('Capital')) {
                capitalName = name
            }
        })

        if (capitalName) {
            const villages = await db.villages.toArray()
            await db.villages.bulkPut(
                villages.map(v => ({
                    ...v,
                    isCapital: v.name === capitalName
                }))
            )
        }

        return true
    }
}

export default new UpdateUserProfileAction()