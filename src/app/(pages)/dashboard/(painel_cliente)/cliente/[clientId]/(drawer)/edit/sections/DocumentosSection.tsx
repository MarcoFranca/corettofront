'use client';
import React from "react";
import {Space} from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import {Controller, useFormContext} from "react-hook-form";
import CPFInput from "@/app/components/ui/input/CpfInput";
import IdentidadeInput from "@/app/components/ui/input/IdInput";
import styled from "styled-components";
import DocumentsFolder
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(documents)/DocumentsFolder";

const SectionTitle = styled.div`
    font-weight: 700;
    font-size: 18px;
    color: #042a75;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
`;

export default function EditDocumentsSection({ cliente }: { cliente: any }) {
    const { control, setValue, register } = useFormContext();

    return (
        <div>
            <SectionTitle>
                <IdcardOutlined /> Documentos Principais
            </SectionTitle>
            <Space direction="vertical" size={18} style={{ width: "100%" }}>
                <div style={{ display: "flex", gap: 18 }}>
                    <CPFInput
                        name="cpf"
                        label="CPF"
                        control={control}
                        setValue={setValue}
                    />
                    <IdentidadeInput
                        name="identidade"
                        label="Identidade"
                        control={control}
                        setValue={setValue}
                    />
                </div>
            </Space>
            <div style={{ margin: "28px 0 0 0" }}>
                {/* Aqui não controla mais modal nenhum */}
                <DocumentsFolder cliente={cliente} onAddDocument={() => {/* lógica para abrir modal */}} />
            </div>
        </div>
    );
}

