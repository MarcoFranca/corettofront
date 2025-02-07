// ContactStyles.ts
import styled from "styled-components";

export const ContactContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
`;

export const ContactHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
`;

export const ContactContain = styled.div`
    overflow: auto;
`

export const ContactTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const TippyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    p{
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        color: #f0ad4e;

    }
`
export const TippyText = styled.div`
    display: flex;
    gap: 8px;
    color: #4caf50;
    
`

export const ContactIcon = styled.img`
    height: 24px;
    width: auto;
    cursor: pointer;
    
    &:hover {
        transform: scale(1.1);
        transition: transform 0.3s ease-in-out;
    }
`;

export const ContactRow = styled.div`
    display: flex;
    align-items: center;
    height: auto;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 5px;
    background-color: #f8f9fa;
    transition: background 0.3s ease;
    font-size: 1rem;
    
    p{
        margin: 0;
    }
    
    &:hover {
        background-color: #eef5ff;
    }
`;

export const AddContactButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

export const EmptyMessage = styled.p`
    text-align: center;
    color: #888;
    font-style: italic;
`;

export const AdditionalContactsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
`;

export const ContactLabel = styled.h4`
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 5px;
`;
