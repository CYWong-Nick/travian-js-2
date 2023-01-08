import { db } from "../../database/db"
import { CurrentPageEnum, Tribe } from "../../types/CommonTypes"
import { Action, ActionContext } from "../../types/ActionTypes"


class UpdateTownBasicInfoAction extends Action<any> {
    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage === CurrentPageEnum.Town
    }

    getTribe = (): Tribe => {
        if ($('.roman').length) {
            return Tribe.Romans
        } else if ($('.teuton').length) {
            return Tribe.Teutons
        } else if ($('.gaul').length) {
            return Tribe.Gauls
        } else if ($('.egyptian').length) {
            return Tribe.Egyptians
        } else if ($('.hun').length) {
            return Tribe.Huns
        } else if ($('.spartan').length) {
            return Tribe.Spartans
        } else {
            return Tribe.Unknown
        }
    }

    run = async (ctx: ActionContext) => {
        const tribe = this.getTribe()
        db.villages.get(ctx.currentVillage.id)
            .then(village => {
                if (village) {
                    db.villages.put({
                        ...village,
                        tribe
                    })
                }
            })
        
        return true
    }
}

export default new UpdateTownBasicInfoAction()

