import { FC } from "react";
import styled from "styled-components";

interface ButtonProps {
    children: React.ReactNode,
    onClick: () => any
}

const StyledButton = styled.button({
    border: '1px solid black',
    borderRadius: 3
})

const Button: FC<ButtonProps> = ({
    children,
    onClick
}) => {
    return <StyledButton onClick={onClick}>
        {children}
    </StyledButton>
}

export default Button