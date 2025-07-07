import styled from "styled-components";

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    z-index: 99999;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;

    label {
        font-size: 0.95rem;
        font-weight: bold;
        color: #333;
    }

    input,
    select {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 0.95rem;
        background: white;
        transition: 0.3s;

        &:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
        }
    }
`;

export const UploadButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
    width: 100%;

    &:hover {
        background-color: #0056b3;
    }

    svg {
        font-size: 1.2rem;
    }
`;
