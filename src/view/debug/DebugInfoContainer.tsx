import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import styled from "styled-components";
import { db } from "../../database/db";

const StyledDebugInfoContainer = styled.div({
})

const DebugInfoContainer: FC = () => {
    const actionQueue = useLiveQuery(() => db.actionQueue.orderBy('seq').toArray())

    return <StyledDebugInfoContainer>
        <h3>Action Queue</h3>
        <table>
            <thead>
                <tr>
                    <th>Action</th>
                    <th>Params</th>
                </tr>
            </thead>
            <tbody>
                {actionQueue?.map(e =>
                    <tr key={e.id}>
                        <td>{e.action}</td>
                        <td>{e.param}</td>
                    </tr>
                )}
            </tbody>
        </table>
    </StyledDebugInfoContainer>
}

export default DebugInfoContainer