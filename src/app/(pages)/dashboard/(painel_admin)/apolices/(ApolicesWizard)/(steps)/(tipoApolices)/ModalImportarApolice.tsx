// 📂 components/ApolicesWizard/steps/ModalImportarApolice.tsx
"use client";

import React, { useState } from "react";
import { Modal, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import api from "@/app/api/axios";
import { ApoliceFormData } from "@/types/ApolicesInterface";

const ModalImportarApolice: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const { watch, setValue } = useFormContext<ApoliceFormData>();

    const cliente = watch("cliente");
    const clienteId =
        typeof cliente === "object" && cliente !== null && "value" in cliente
            ? cliente.value
            : cliente;

    const handleUpload = async (file: File) => {
        if (!clienteId) {
            message.error("Selecione um cliente antes de importar.");
            return;
        }

        const formData = new FormData();
        formData.append("arquivo", file);
        formData.append("cliente_id", clienteId);

        try {
            const response = await api.post("/extrair-apolice/", formData);
            const dados = response.data.dados_extraidos;

            // Dados principais
            setValue("numero_apolice", dados.numero_apolice);
            setValue("data_inicio", dados.data_inicio.split("/").reverse().join("-"));
            setValue("observacoes", `Importado via PDF. Segurado: ${dados.segurado}, CPF: ${dados.cpf}`);

            // Beneficiários
            if (dados.beneficiarios) {
                setValue("detalhes.beneficiarios", dados.beneficiarios.map((b: any) => ({
                    nome: b.nome,
                    parentesco: b.parentesco,
                    percentual: parseFloat(b.percentual),
                    data_nascimento: b.data_nascimento,
                })));
            }

            // Coberturas
            if (dados.coberturas) {
                setValue("detalhes.coberturas", dados.coberturas.map((c: any) => ({
                    nome_id: null,
                    descricao: `Prêmio: R$ ${c.premio}`,
                    capital_segurado_money: parseFloat(c.capital_segurado),
                })));
            }

            message.success("📄 Apólice importada com sucesso!");
            setVisible(false);
        } catch (err) {
            console.error("❌ Erro ao extrair dados:", err);
            message.error("Erro ao extrair dados da apólice.");
        }
        return false;
    };

    return (
        <>
            <Button
                type="dashed"
    icon={<UploadOutlined />}
    onClick={() => setVisible(true)}
    style={{ marginBottom: 12 }}
>
📥 Importar Apólice (PDF)
    </Button>

    <Modal
    title="Importar Apólice de Seguro de Vida"
    open={visible}
    onCancel={() => setVisible(false)}
    footer={null}
    >
    <Upload
        beforeUpload={(file) => {
        handleUpload(file);
        return false;
    }}
    showUploadList={false}
    >
    <Button icon={<UploadOutlined />}>Selecionar Arquivo PDF</Button>
    </Upload>
    </Modal>
    </>
);
};

export default ModalImportarApolice;
