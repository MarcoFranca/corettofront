import styled from 'styled-components';

export const ModalContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
        font-weight: bold;
        color: #333;
    }

    input, select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
`;

export const SelectWrapper = styled.div`
    .react-select__control {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 2px;
    }
`;
