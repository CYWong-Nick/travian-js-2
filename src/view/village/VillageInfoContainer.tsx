import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import { db } from "../../database/db";
import { buildings } from "../../static-data/building";
import moment from 'moment'
import { BuildingLocation } from "../../types/BuildingTypes";
import { Village } from "../../types/VillageTypes";
import VillageAutoTrainContainer from "./VillageAutoTrainContainer";
import RowContainer from "../common/RowContainer";
import ColumnContainer from "../common/ColumnContainer";
import Checkbox from "../common/Checkbox";
import useItem from "../common/hooks/useItem";
import Dropdown from "../common/Dropdown"
import Input, { Scale } from "../common/Input";
import Button from "../common/Button";
import VillageBuildQueueContainer from "./VillageBuildQueueContainer";

interface VillageInfoContainerProps {
    village: Village
}

const VillageInfoContainer: FC<VillageInfoContainerProps> = ({
    village
}) => {
    const villages = useLiveQuery(() => db.villages.toArray())
    const villageBuildings = useLiveQuery(() => db.villageBuildings.where('villageId').equals(village.id).sortBy('position'), [village.id])
    const constructions = useLiveQuery(() => db.currentBuildQueue.where('villageId').equals(village.id).sortBy('targetCompletionTime'), [village.id])
    const fields = villageBuildings?.filter(vb => buildings[vb.buildingId]?.location === BuildingLocation.Field)
    const townBuildings = villageBuildings?.filter(vb => buildings[vb.buildingId]?.location === BuildingLocation.Town)

    const { item, updateItem, resetItem } = useItem(village)

    const handleSave = async () => {
        await db.villages.put(item)
        resetItem()
    }

    return <ColumnContainer>
        <RowContainer>
            <div>
                <h3>Basic Info</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{village.name}</td>
                        </tr>
                        <tr>
                            <th>Coords</th>
                            <td>{village.coordX}, {village.coordY}</td>
                        </tr>
                        <tr>
                            <th>Tribe</th>
                            <td>{village.tribe}</td>
                        </tr>
                        <tr>
                            <th>Field Type</th>
                            <td>{village.layout}</td>
                        </tr>
                        <tr>
                            <th>Capital</th>
                            <td>{village.isCapital ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <th>Lumber</th>
                            <td>{village.lumber} ({village.lumberCapacity})</td>
                        </tr>
                        <tr>
                            <th>Clay</th>
                            <td>{village.clay} ({village.clayCapacity})</td>
                        </tr>
                        <tr>
                            <th>Iron</th>
                            <td>{village.iron} ({village.ironCapacity})</td>
                        </tr>
                        <tr>
                            <th>Crop</th>
                            <td>{village.crop} ({village.cropCapacity})</td>
                        </tr>
                        <tr>
                            <th>Constructions</th>
                            <td>
                                {constructions?.map(e =>
                                    <div key={e.id}>
                                        {buildings[e.buildingId].name} Level {e.targetLevel} {moment(e.targetCompletionTime).format()}
                                    </div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>Next Rally Point Attack Scan</th>
                            <td>{moment(village.nextRallyPointAttackScanTime).format()}</td>
                        </tr>
                        <tr>
                            <th>Has incoming attack</th>
                            <td>{village.hasPlusAttackWarning ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <th>Resources Evasion</th>
                            <td>
                                <RowContainer>
                                    <span>Enable</span>
                                    <Checkbox checked={item.enableResourceEvade} onChange={() => updateItem('enableResourceEvade', !item.enableResourceEvade)} />
                                </RowContainer>
                                <RowContainer>
                                    <span>Target</span>
                                    <Dropdown
                                        value={item.resourceEvadeTargetVillageId}
                                        options={
                                            (villages || []).map(v => ({
                                                key: v.id,
                                                value: v.name
                                            }))
                                        }
                                        onChange={value => updateItem('resourceEvadeTargetVillageId', value)}
                                    />
                                </RowContainer>
                            </td>
                        </tr>
                        <tr>
                            <th>Troop Evasion</th>
                            <td>
                                <RowContainer>
                                    <span>Enable</span>
                                    <Checkbox checked={item.enableTroopEvade} onChange={() => updateItem('enableTroopEvade', !item.enableTroopEvade)} />
                                </RowContainer>
                                <RowContainer>
                                    <span>Target:</span>
                                    <span>(</span>
                                    <Input scale={Scale.XS} value={item.troopEvadeTargetCoordX} onChange={value => updateItem('troopEvadeTargetCoordX', parseInt(value) || 0)} />
                                    <span>, </span>
                                    <Input scale={Scale.XS} value={item.troopEvadeTargetCoordY} onChange={value => updateItem('troopEvadeTargetCoordY', parseInt(value) || 0)} />
                                    <span>)</span>
                                </RowContainer>
                            </td>
                        </tr>
                        <tr>
                            <th>Actions</th>
                            <td>
                                <RowContainer>
                                    <Button onClick={handleSave}>Save</Button>
                                </RowContainer>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Fields</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields?.map(field =>
                            <tr key={field.id}>
                                <td>{buildings[field.buildingId].name}</td>
                                <td>{field.position}</td>
                                <td>{field.level}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Town</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {townBuildings?.map(building =>
                            <tr key={building.id}>
                                <td>{buildings[building.buildingId].name}</td>
                                <td>{building.position}</td>
                                <td>{building.level}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </RowContainer>

        <RowContainer>
            <VillageAutoTrainContainer
                village={village}
            />
            <VillageBuildQueueContainer 
                village={village}
            />
        </RowContainer>
    </ColumnContainer>
}

export default VillageInfoContainer