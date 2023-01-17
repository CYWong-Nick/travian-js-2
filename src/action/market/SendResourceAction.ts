import { db } from "../../database/db"
import { Action, ActionContext } from "../../types/ActionTypes"
import { Village } from "../../types/VillageTypes"
import { isInBuilding } from "../../utils/BotUtils"

interface SendResourceActionParam {
    lumber?: number
    clay?: number
    iron?: number
    crop?: number
    targetVillage: Village
    isAutoEvade?: boolean
    attackId?: string
}

class SendResourceAction extends Action<SendResourceActionParam> {
    name = 'SendResourceAction'

    shouldRun = async (ctx: ActionContext, param: SendResourceActionParam) => {
        return isInBuilding('17', { t: '5' })
    }

    run = async (ctx: ActionContext, param: SendResourceActionParam) => {
        let lumber = param.lumber
        let clay = param.clay
        let iron = param.iron
        let crop = param.crop

        const totalMerchantCapacity = parseInt($('#merchantCapacityValue').text())

        if (param.isAutoEvade) {
            const totalResource = ctx.currentVillage.lumber + ctx.currentVillage.clay + ctx.currentVillage.iron + ctx.currentVillage.crop
            const percent = totalMerchantCapacity / totalResource

            if (percent >= 1) {
                lumber = ctx.currentVillage.lumber
                clay = ctx.currentVillage.clay
                iron = ctx.currentVillage.iron
                crop = ctx.currentVillage.crop
            } else {
                lumber = Math.floor(ctx.currentVillage.lumber * percent)
                clay = Math.floor(ctx.currentVillage.clay * percent)
                iron = Math.floor(ctx.currentVillage.iron * percent)
                crop = Math.floor(ctx.currentVillage.crop * percent)
            }

            if (param.attackId) {
                const incomingAttack = await db.incomingAttack.get(param.attackId)
                incomingAttack && await db.incomingAttack.put({
                    ...incomingAttack,
                    resourceEvadeCompleted: true
                })
            }
        }

        $('#r1').val(lumber ?? 0)
        $('#r2').val(clay ?? 0)
        $('#r3').val(iron ?? 0)
        $('#r4').val(crop ?? 0)
        $('.coordinates.x').val(param.targetVillage.coordX)
        $('.coordinates.y').val(param.targetVillage.coordY)

        return true
    }
}

export default new SendResourceAction()