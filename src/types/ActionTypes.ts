import { CurrentPageEnum } from "./CommonTypes"
import { Village } from "./VillageTypes"

export interface ActionContext {
    currentPage: CurrentPageEnum
    currentVillage: Village
}

export abstract class Action<T> {
    shouldRun = (ctx: ActionContext, params: T): Promise<boolean> => Promise.resolve(true)
    abstract run:  (ctx: ActionContext, params: T) => Promise<boolean>
    onFail = (ctx: ActionContext, params: T): Promise<boolean> => {
        return Promise.resolve(false)    
    }
}