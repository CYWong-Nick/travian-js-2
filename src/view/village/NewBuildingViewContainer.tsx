import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import { db } from "../../database/db";
import { Village } from "../../types/VillageTypes";
import UpgradeIndicatorContainer from "./UpgradeIndicatorContainer";

interface NewBuildingViewContainerProps {
    position: number
    originalInnerHTML: string
}

const NewBuildingViewContainer: FC<NewBuildingViewContainerProps> = ({
    position,
    originalInnerHTML
}) => {

    const villages = useLiveQuery(() => db.villages.toArray(), [])
    const activeVillage = villages?.find(v => v.isActive)

    if (!activeVillage) {
        return <></>
    }

    return <NewBuildingView
        village={activeVillage}
        position={position}
        originalInnerHTML={originalInnerHTML}
    />
}

interface NewBuildingViewProps {
    village: Village
    position: number
    originalInnerHTML: string
}

const NewBuildingView: FC<NewBuildingViewProps> = ({
    village,
    position,
    originalInnerHTML
}) => {
    const building = useLiveQuery(() => db.villageBuildings.where({ villageId: village.id, position }).first(), [village])

    if (!building) {
        return <div dangerouslySetInnerHTML={{ __html: originalInnerHTML }} />
    }

    const tribe = village.tribe.substring(0, village.tribe.length - 1).toLowerCase()

    return <div>
        <a href={`/build.php?id=${position}`} className={`level colorLayer a${position} ${tribe}`} data-level="0">
            <UpgradeIndicatorContainer position={position} />
            <div className="labelLayer">0</div>
        </a>
        <img src="/img/x.gif" className={`building g${building.buildingId} ${tribe}`} alt="" />
    </div>
}

export default NewBuildingViewContainer