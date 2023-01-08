import { db } from "../../database/db"
import { CurrentPageEnum, Tribe } from "../../types/CommonTypes"
import { VillageFieldLayoutEnum } from "../../types/VillageTypes"
import { Action, ActionContext } from "../../types/ActionTypes"

class UpdateFieldBasicInfoAction extends Action<any> {
    name = 'UpdateFieldBasicInfoAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage === CurrentPageEnum.Field
    }

    getTribe = (): Tribe => {
        const ele = $('#resourceFieldContainer')
        if (ele.hasClass('tribe1')) {
            return Tribe.Romans
        } else if (ele.hasClass('tribe2')) {
            return Tribe.Teutons
        } else if (ele.hasClass('tribe3')) {
            return Tribe.Gauls
        } else if (ele.hasClass('tribe6')) {
            return Tribe.Egyptians
        } else if (ele.hasClass('tribe7')) {
            return Tribe.Huns
        } else if (ele.hasClass('tribe8')) {
            return Tribe.Spartans
        } else {
            return Tribe.Unknown
        }
    }

    getResourceFieldType = (): VillageFieldLayoutEnum => {
        const ele = $('#resourceFieldContainer')
        if (ele.hasClass('resourceField1')) {
            return VillageFieldLayoutEnum.F3339
        } else if (ele.hasClass('resourceField2')) {
            return VillageFieldLayoutEnum.F3456
        } else if (ele.hasClass('resourceField3')) {
            return VillageFieldLayoutEnum.F4446
        } else if (ele.hasClass('resourceField4')) {
            return VillageFieldLayoutEnum.F4536
        } else if (ele.hasClass('resourceField5')) {
            return VillageFieldLayoutEnum.F5346
        } else if (ele.hasClass('resourceField6')) {
            return VillageFieldLayoutEnum.F15C
        } else if (ele.hasClass('resourceField7')) {
            return VillageFieldLayoutEnum.F4437
        } else if (ele.hasClass('resourceField8')) {
            return VillageFieldLayoutEnum.F3447
        } else if (ele.hasClass('resourceField9')) {
            return VillageFieldLayoutEnum.F4347
        } else if (ele.hasClass('resourceField10')) {
            return VillageFieldLayoutEnum.F3546
        } else if (ele.hasClass('resourceField11')) {
            return VillageFieldLayoutEnum.F4356
        } else if (ele.hasClass('resourceField12')) {
            return VillageFieldLayoutEnum.F5436
        } else if (ele.hasClass('resourceField13')) {
            return VillageFieldLayoutEnum.F18C
        } else {
            return VillageFieldLayoutEnum.Unknown
        }
    }

    run = async (ctx: ActionContext) => {
        const tribe = this.getTribe()
        const layout = this.getResourceFieldType()
        db.villages.get(ctx.currentVillage.id)
            .then(village => {
                if (village) {
                    db.villages.put({
                        ...village,
                        tribe,
                        layout
                    })
                }
            })

        return true
    }
}

export default new UpdateFieldBasicInfoAction()