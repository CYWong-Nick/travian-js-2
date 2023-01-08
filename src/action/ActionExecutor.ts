import { db } from "../database/db"
import { ActionQueueItem } from "../types/DatabaseTypes"
import { getCurrentPage, getCurrentVillage } from "../utils/BotUtils"
import { actionRegistry, defaultActions, defaultScanners } from "./action"
import { ActionContext } from "../types/ActionTypes"

class ActionExecutor {
    run = async (bot: boolean) => {
        await this.runDefaultActions()
        if (bot) {
            await this.runDefaultScanners()
            await this.runActionQueue()
        }
    }

    runAction = async (item: ActionQueueItem): Promise<boolean> => {
        const action = actionRegistry[item.action]
        const param = typeof item.param === 'string' ? JSON.parse(item.param) : item.param
        const currentVillage = await getCurrentVillage()
        const context: ActionContext = {
            currentPage: getCurrentPage(),
            currentVillage,
        }

        try {
            const s = Date.now()
            console.log("Start", action.constructor.name)

            const shuoldRun = await action.shouldRun(context, param)
            if (shuoldRun) {
                const shouldContinue = await action.run(context, param)
                console.log("End", action.constructor.name, (Date.now() - s) / 1000)
                return shouldContinue
            } else {
                return Promise.resolve(true)
            }
        } catch (e) {
            const err = e as Error
            console.log(`Action ${item.action} failed, error is \n ${err.stack}`)
            return action.onFail(context, param)
        }
    }

    runDefaultActions = async () => {
        const defaultActionItems = defaultActions.map(action => ({
            id: '',
            action,
            param: null,
            seq: 0
        }))
        
        for (const item of defaultActionItems) {
            const shouldContinue = await this.runAction(item)
            if (!shouldContinue)
                break;
        }
    }

    runDefaultScanners = async () => {
        const defaultActionItems = defaultScanners.map(action => ({
            id: '',
            action,
            param: null,
            seq: 0
        }))
        
        for (const item of defaultActionItems) {
            const shouldContinue = await this.runAction(item)
            if (!shouldContinue)
                break;
        }
    }

    runActionQueue = async () => {
        const actionQueue = await db.actionQueue.orderBy('seq').toArray()
        for (const item of actionQueue) {
            await db.actionQueue.delete(item.id)
            const shouldContinue = await this.runAction(item)
            if (!shouldContinue)
                break;
        }
    }
}

export default new ActionExecutor()