import React from 'react';
import { StyledButton } from './Button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    return (
        <StyledButton variant={variant} {...props}>
            {children}
        </StyledButton>
    );
};

export default Button;
