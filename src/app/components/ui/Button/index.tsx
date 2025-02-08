import React from 'react';
import { StyledButton, ButtonContent, IconWrapper } from './Button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'; // Adicionado mais variantes
    icon?: React.ReactNode; // Propriedade para o ícone
    iconPosition?: 'left' | 'right'; // Posição do ícone
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           icon,
                                           iconPosition = 'left',
                                           ...props
                                       }) => {
    return (
        <StyledButton variant={variant} {...props}>
            <ButtonContent iconPosition={iconPosition}>
                {icon && iconPosition === 'left' && <IconWrapper>{icon}</IconWrapper>}
                <span>{children}</span>
                {icon && iconPosition === 'right' && <IconWrapper>{icon}</IconWrapper>}
            </ButtonContent>
        </StyledButton>
    );
};

export default Button;
