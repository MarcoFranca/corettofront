import styled from 'styled-components';

export const ModalOverlay = styled.div`
    background: rgba(0, 0, 0, 0.75);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
`;

export const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    height: 90%;
    max-height: 300px;
    max-width: 350px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

export const ModalHeader = styled.h2`
    margin: 16px;
`;

export const ModalMessage = styled.p`
    margin: 16px;
`;

export const ModalActions = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
`;

export const ModalButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;

    &.confirm {
        background: #28a745;
        color: #fff;
    }

    &.confirm:hover {
        background: #218838;
    }

    &.cancel {
        background: #dc3545;
        color: #fff;
    }

    &.cancel:hover {
        background: #c82333;
    }
`;
