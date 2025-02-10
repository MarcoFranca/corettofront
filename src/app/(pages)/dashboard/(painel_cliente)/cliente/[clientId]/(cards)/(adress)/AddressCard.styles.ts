import styled from "styled-components";

export const CardContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
`;

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
`;

export const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const SectionTitle = styled.h3`
    font-size: 1.2em;
    color: #020f60;
    margin: 0;
`;

export const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
        transition: transform 0.3s;
    }
`;

export const AddressDetails = styled.div`
    margin-top: 10px;
    font-size: 0.95rem;
    color: #333;
    line-height: 1.5;

    p {
        margin: 5px 0;
    }

    strong {
        color: #005bb5;
    }
`;

export const EmptyMessage = styled.p`
    color: #888;
    font-style: italic;
    text-align: center;
`;

/* 🔹 Estilos para alinhar os ícones e textos */
export const AddressField = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 5px 0;
`;

export const AddressIcon = styled.div`
    color: #005bb5;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
`;
