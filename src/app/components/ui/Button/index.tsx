import React from 'react';
import {StyledButton, ButtonContent, IconWrapper, IsLoadingText} from './Button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean; // ✅ Adicionamos uma prop para controlar o estado de carregamento
    textLoading?:string;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           icon,
                                           iconPosition = 'left',
                                           isLoading = false,
                                           textLoading="Salvando...",
                                           ...props
                                       }) => {
    return (
        <StyledButton variant={variant} {...props}>
            <ButtonContent iconPosition={iconPosition}>
                {isLoading ? (
                    <IsLoadingText>
                        <span className="spinner" />
                        <p>{textLoading}</p>
                    </IsLoadingText>
                ) : (
                    <>
                        {icon && iconPosition === 'left' && <IconWrapper>{icon}</IconWrapper>}
                        <span>{children}</span>
                        {icon && iconPosition === 'right' && <IconWrapper>{icon}</IconWrapper>}
                    </>
                )}
            </ButtonContent>

        </StyledButton>
    );
};

export default Button;
