import styled from "styled-components";

export const Container = styled.div`
    padding: 25px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0 10px 10px 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;

    h3 {
        font-size: 1.2rem;
        color: #333;
        margin: 0;
    }
`;

export const UploadButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;

    &:hover {
        background-color: #0056b3;
    }

    svg {
        font-size: 1.2rem;
    }
`;

export const ScrollableContainer = styled.div`
    max-height: 250px;
    overflow-y: auto;
    padding-right: 5px;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 5px;
    }
`;

export const DocumentsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const DocumentItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background 0.3s ease;

    &:hover {
        background-color: #eef5ff;
    }

    p {
        font-size: 0.95rem;
        font-weight: 500;
        margin: 0;
        color: #333;
    }

    small {
        display: block;
        color: #666;
        font-size: 0.8rem;
    }

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .icon-group {
            display: flex;
            gap: 10px;

            svg {
                cursor: pointer;
                transition: 0.3s;
                font-size: 1.2rem;
            }

            svg:hover {
                color: red;
            }
        }
    }
`;

export const Divider = styled.hr`
    border: none;
    border-top: 1px solid #ddd;
    margin: 10px 0;
`;

export const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #f1f5ff;
    border-radius: 8px;
    border: 1px solid #cce5ff;
    gap: 16px;

    p {
        margin: 0;
        font-size: 0.95rem;
        font-weight: bold;
    }

    .maskInput{
        font-size: 16px;
        background: transparent;
        border: none;
        pointer-events: none;
        outline: none;
    }
`;

export const EmptyMessage = styled.p`
    text-align: center;
    color: #888;
    font-style: italic;
`;
