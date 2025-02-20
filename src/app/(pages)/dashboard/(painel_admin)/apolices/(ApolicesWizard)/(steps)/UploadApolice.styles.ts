import styled from "styled-components";
import { Upload } from "antd";

export const UploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    text-align: center;
    width: 100%;
`;

export const UploadTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    color: #4a4a4a;
`;

export const StyledDragger = styled(Upload.Dragger)`
    width: 100%;
    padding: 2rem;
    background-color: #ffffff;
    border: 2px dashed #bfbfbf;
    border-radius: 8px;
    transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;

    &:hover {
        border-color: #1890ff;
        background-color: #f0faff;
    }

    &.ant-upload-drag {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

export const FileInfo = styled.p`
    font-size: 1rem;
    color: #1890ff;
    font-weight: 500;
    margin-top: 0.5rem;
`;
