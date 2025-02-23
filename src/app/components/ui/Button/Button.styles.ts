import styled, { css } from 'styled-components';

interface StyledButtonProps {
    $variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
}

export const StyledButton = styled.button<StyledButtonProps>`
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;

    &:hover {
        transform: scale(1.02);
    }

    ${({ $variant }) =>
            $variant === 'primary' &&
            css`
                background-color: #007bff;
                color: white;
                &:hover {
                    background-color: #0056b3;
                }
            `}

    ${({ $variant }) =>
            $variant === 'secondary' &&
            css`
                background-color: #6c757d;
                color: white;
                &:hover {
                    background-color: #5a6268;
                }
            `}

    ${({ $variant }) =>
            $variant === 'danger' &&
            css`
                background-color: #d9534f;
                color: white;
                &:hover {
                    background-color: #c9302c;
                }
            `}

    ${({ $variant }) =>
            $variant === 'success' &&
            css`
                background-color: #28a745;
                color: white;
                &:hover {
                    background-color: #218838;
                }
            `}

    ${({ $variant }) =>
            $variant === 'warning' &&
            css`
                background-color: #ffc107;
                color: black;
                &:hover {
                    background-color: #e0a800;
                }
            `}

    //.spinner {
    //    border: 4px solid rgba(0, 0, 0, 0.1);
    //    border-top: 4px solid white;
    //    border-radius: 50%;
    //    width: 18px;
    //    height: 18px;
    //    animation: spin 1s linear infinite;
    //}
    //
    //@keyframes spin {
    //    0% { transform: rotate(0deg); }
    //    100% { transform: rotate(360deg); }
    //}
`;

export const ButtonContent = styled.div.attrs<{ $iconPosition: 'left' | 'right' }>(
    (props) => ({
        $iconPosition: props.$iconPosition, // ✅ Agora é uma prop interna
    })
)<{ $iconPosition: 'left' | 'right' }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    ${({ $iconPosition }) =>
            $iconPosition === 'right' &&
            css`
                flex-direction: row-reverse;
            `}
`;


export const IconWrapper = styled.span`
    display: flex;
    align-items: center;
    font-size: 1.2rem; /* Ajuste o tamanho do ícone */
`;

export const IsLoadingText = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    p{
        margin: 0;
    }
`