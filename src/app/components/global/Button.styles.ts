import styled, { css } from 'styled-components';

interface StyledButtonProps {
    variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
}

export const StyledButton = styled.button<StyledButtonProps>`
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    font-size: 1rem;
    display: inline-flex; /* Para alinhar o texto e o ícone */
    align-items: center;
    justify-content: center;
    gap: 8px; /* Espaçamento entre o ícone e o texto */
    font-weight: 500;

    &:hover {
        transform: scale(1.02);
    }

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

    ${(props) =>
            props.variant === 'success' &&
            css`
      background-color: #28a745;
      color: white;

      &:hover {
        background-color: #218838;
      }
    `}

    ${(props) =>
            props.variant === 'warning' &&
            css`
      background-color: #ffc107;
      color: black;

      &:hover {
        background-color: #e0a800;
      }
    `}
`;

export const ButtonContent = styled.div<{ iconPosition: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(props) =>
    props.iconPosition === 'right' &&
    css`
      flex-direction: row-reverse;
    `}
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.2rem; /* Ajuste o tamanho do ícone */
`;
