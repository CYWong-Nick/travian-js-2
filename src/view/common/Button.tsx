import { FC } from "react";
import styled from "styled-components";

interface ButtonProps {
    children: React.ReactNode,
    onClick: () => any
}

const StyledButton = styled.button<React.ButtonHTMLAttributes<HTMLButtonElement>>(props => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: '1px solid black',
    borderRadius: 3,
    color: props.disabled ? 'grey' : 'currentcolor',
    fill: props.disabled ? 'grey' : 'currentcolor',
    cursor: props.disabled ? 'not-allowed' : 'pointer'
}))

const Button: FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    onClick,
    ...props
}) => {
    return <StyledButton onClick={onClick} {...props}>
        {children}
    </StyledButton>
}

export default Button