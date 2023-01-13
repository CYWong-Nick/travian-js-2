import { CurrentPageEnum } from '../../types/CommonTypes'
import { Action, ActionContext } from '../../types/ActionTypes'
import keyValueDao, { ConfigKey } from '../../database/dao/keyValueDao'


class AutoLoginAction extends Action<any> {
    name = 'AutoLoginAction'

    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage === CurrentPageEnum.Login
    }

    run = async () => {
        const username = await keyValueDao(ConfigKey.LoginName, '').getValue()
        const password = await keyValueDao(ConfigKey.LoginPassword, '').getValue()

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