"use client";

import React, { useState } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { UseFormSetValue } from "react-hook-form";
import {
    UploadContainer,
    UploadTitle,
    StyledDragger,
    FileInfo
} from "./UploadApolice.styles";

interface UploadApoliceProps {
    setValue: UseFormSetValue<any>;
}

const UploadApolice: React.FC<UploadApoliceProps> = ({ setValue }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const beforeUpload = (file: File) => {
        const isAllowed =
            file.type === "application/pdf" ||
            file.type.startsWith("image/") ||
            file.type === "application/msword";

        if (!isAllowed) {
            message.error("Somente arquivos PDF, DOC ou imagens são permitidos!");
            return false;
        }

        setFileName(file.name);
        setValue("arquivoApolice", file, { shouldValidate: true }); // 🔥 Agora o arquivo faz parte do formulário

        return false; // Evita o upload automático
    };

    return (
        <UploadContainer>
            <UploadTitle>📑 Importar Apólice</UploadTitle>

            <StyledDragger beforeUpload={beforeUpload} showUploadList={false}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ fontSize: "3rem", color: "#1890ff" }} />
                </p>
                <p className="ant-upload-text">
                    Clique ou arraste um arquivo para esta área
                </p>
                <p className="ant-upload-hint">
                    Arquivos suportados: PDF, DOC, Imagens (JPG, PNG)
                </p>
            </StyledDragger>

            {fileName && <FileInfo>📄 Arquivo Selecionado: {fileName}</FileInfo>}
        </UploadContainer>
    );
};

export default UploadApolice;
