import styled from "styled-components";

export interface BaseIconProps {
    size?: number
}

const BaseIcon = styled.svg<BaseIconProps>(({ size = 10 }) => ({
    width: size,
    height: size
}))

export default BaseIcon