import styled from 'styled-components';

export const PersonalInfoContainer = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
`;

export const TitleHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const SectionContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
`;

export const IconImage = styled.img`
    height: 32px;
    width: auto;
`;

export const EditIcon = styled.img`
    height: 24px;
    width: auto;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
        transition: transform 0.3s;
    }
`;
