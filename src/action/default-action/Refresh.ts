import { CurrentPageEnum } from '../../types/CommonTypes'
import { Action, ActionContext } from '../../types/ActionTypes'
import { autoLoginFeatureDao } from '../../database/dao/feature/autoLoginFeatureDao'


class AutoLoginAction extends Action<any> {
    name = 'AutoLoginAction'

    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage === CurrentPageEnum.Login
    }

    run = async () => {
        const { getValue } = autoLoginFeatureDao()
        const { username, password } = await getValue()

        if (!username || !password) {
            return false
        }

        $('input[name=name]').val(username)
        $('input[name=password]').val(password)
        $('button[type=submit]').trigger('click')

        return false
    }
}

export default new AutoLoginAction()