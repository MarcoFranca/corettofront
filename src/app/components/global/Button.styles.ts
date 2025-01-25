import styled, { css } from 'styled-components';

interface StyledButtonProps {
    variant: 'primary' | 'secondary' | 'danger';
}

export const StyledButton = styled.button<StyledButtonProps>`
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 8px;
    transition: background-color 0.3s ease;
    font-size: 1rem;

    ${(props) =>
            props.variant === 'primary' &&
            css`
                background-color: #007bff;
                color: white;

                &:hover {
                    background-color: #0056b3;
                }
            `}

    ${(props) =>
            props.variant === 'secondary' &&
            css`
                background-color: #6c757d;
                color: white;

                &:hover {
                    background-color: #5a6268;
                }
            `}

    ${(props) =>
            props.variant === 'danger' &&
            css`
                background-color: #d9534f;
                color: white;

                &:hover {
                    background-color: #c9302c;
                }
            `}
`;
