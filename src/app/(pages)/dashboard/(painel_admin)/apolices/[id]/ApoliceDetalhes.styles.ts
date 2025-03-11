import styled from "styled-components";

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
    background-color: #f8f9fa;
    height: 100%;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    overflow: hidden;
    gap: 16px;
`;

export const Loader = styled.div`
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #007bff;
    padding: 20px;
`;

export const DetailsContainer = styled.div`
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: auto;
`;

// 🔹 Melhor distribuição dos cards
export const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    width: 100%;
    border: solid 1px #ddd;
    padding: 16px;
    border-radius: 8px;
    background: white;

    h3 {
        font-size: 18px;
        margin-bottom: 16px;
        color: #343a40;
        border-bottom: 2px solid rgba(16, 10, 10, 0.15);
        padding-bottom: 8px;
    }
`;

// 🔹 Distribui os campos em duas colunas
export const SectionContent = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;  // Em telas menores, volta para uma coluna
    }
`;

export const Label = styled.span`
    font-weight: bold;
    color: #6c757d;
    margin: 8px 0;
`;

export const Value = styled.span`
    color: #343a40;
    font-size: 16px;
    display: block;
    margin-bottom: 8px;
`;

export const BeneficiarioList = styled.ul`
    list-style: none;
    padding: 0;
`;

export const BeneficiarioItem = styled.li`
    font-size: 16px;
    padding: 6px 0;
`;

export const DownloadButton = styled.a`
    background: #007bff;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    width: fit-content;
    gap: 8px;
    font-weight: bold;

    &:hover {
        background: #0056b3;
        color: #f5f5f5;
        transition: 500ms;
    }
`;

export const StatusBadge = styled.span<{ color: string }>`
    color: white;
    background-color: ${(props) => props.color};
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    margin-left: 8px;
`;

export const ActionButtons = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;

    .back-btn {
        background: #6c757d;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;

        &:hover {
            background: #495057;
        }
    }
`;

export const BeneficiarioContent = styled.div`
    display: flex;
    background-color: #d4dbe1;
    width: fit-content;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;

    p {
        margin: 0;
    }
`

export const EditButton = styled.button`
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 14px;
    margin-left: 6px;
    &:hover {
        color: #0056b3;
    }
`;

export const InputEdit = styled.input`
    border: 1px solid #ddd;
    padding: 4px 8px;
    font-size: 14px;
    border-radius: 4px;
    outline: none;
`;

export const DetailsRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
`;

export const DetailsLabel = styled.span`
    font-weight: bold;
    color: #555;
`;

export const DetailsValue = styled.span`
    color: #333;
`;
