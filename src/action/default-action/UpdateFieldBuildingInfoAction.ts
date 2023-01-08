
import { v4 } from 'uuid';
import { db } from '../../database/db';
import { CurrentPageEnum } from '../../types/CommonTypes';
import { VillageBuilding } from '../../types/DatabaseTypes';
import { Action, ActionContext } from '../../types/ActionTypes';
import { parseIntIgnoreSep } from '../../utils/NumberUtils';

class UpdateFieldBuildingInfoAction extends Action<any> {
    name = 'UpdateFieldBuildingInfoAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage === CurrentPageEnum.Field
    }

    private _run = async (ctx: ActionContext) => {
        $('.level').each((idx, e) => {
            const classList = [...e.classList];
            const buildingId = classList.find(e => /gid.+/.test(e))?.replace('gid', '');
            const level = classList.find(e => /level.+/.test(e))?.replace('level', '');
            const position = classList.find(e => /buildingSlot.+/.test(e))?.replace('buildingSlot', '');

            if (!buildingId || !level || !position)
                return;

            // @ts-ignore
            const notice = $(e._tippy?.popper).find('.notice');
            const upgradeLevel = notice.length ?
                Math.max(
                    ...notice
                        .map((_, e) => parseIntIgnoreSep(e.textContent || ''))
                        .toArray()
                )
                : null;

            const levelInt = upgradeLevel || parseInt(level);
            const positionInt = parseInt(position);
            db.villageBuildings.where({
                villageId: ctx.currentVillage.id,
                buildingId,
                position: positionInt
            }).first().then(res => {
                if (level) {
                    const record: VillageBuilding = {
                        id: res?.id || v4(),
                        villageId: ctx.currentVillage.id,
                        buildingId,
                        level: levelInt,
                        position: positionInt
                    };

                    db.villageBuildings.put(record);
                } else {
                    res && db.villageBuildings.delete(res.id);
                }
            });
        });

        return true;
    };
    public get run() {
        return this._run;
    }
    public set run(value) {
        this._run = value;
    }
}

export default new UpdateFieldBuildingInfoAction()