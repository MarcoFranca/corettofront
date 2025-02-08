import styled from "styled-components";

export const DocumentContainer = styled.div`
    display: flex;
    flex: 1;
    width: 50%;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    min-height: 120px; /* 🔹 Ajusta a altura mínima */
`;

export const DocumentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
`;

export const DocumentTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const DocumentIconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        transform: scale(1.1);
        transition: transform 0.3s ease-in-out;
    }
`;

export const DocumentRow = styled.div`
    display: flex;
    flex-direction: column; /* 🔹 Ajuste para melhor visualização */
    gap: 6px;
    padding: 8px 10px;
    border-radius: 5px;
    background-color: #f8f9fa;
    transition: background 0.3s ease;
    font-size: 1rem;
    
    .maskInput{
        font-size: 16px;
        background: transparent;
        border: none;
        pointer-events: none;
        outline: none;
    }
    strong{
        margin-right:8px;
    }
    
    p {
        margin: 0;
    }

    &:hover {
        background-color: #eef5ff;
    }
`;

export const EmptyMessage = styled.p`
    text-align: center;
    color: #888;
    font-style: italic;
`;
