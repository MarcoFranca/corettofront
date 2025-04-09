"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "@/app/api/axios";
import { ApoliceFormData } from "@/types/ApolicesInterface";

const UploadApolice = ({ setValue }: { setValue: any }) => {
    const { watch, getValues } = useFormContext<ApoliceFormData>();
    const clienteSelecionado = watch("cliente");

    const clienteId =
        typeof clienteSelecionado === "object" && clienteSelecionado !== null
            ? clienteSelecionado.value
            : clienteSelecionado;

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

            // Preenche os campos extraídos
            setValue("numero_apolice", dados.numero_apolice);
            setValue("data_inicio", dados.data_inicio.split("/").reverse().join("-"));
            setValue("observacoes", `Importado via PDF. Segurado: ${dados.segurado}, CPF: ${dados.cpf}`);

            if (dados.coberturas) {
                setValue("detalhes.coberturas", dados.coberturas.map((c: any) => ({
                    nome_id: null,
                    descricao: `Prêmio: R$ ${c.premio}`,
                    capital_segurado_money: parseFloat(c.capital_segurado),
                })));
            }

            if (dados.beneficiarios) {
                setValue("detalhes.beneficiarios", dados.beneficiarios.map((b: any) => ({
                    nome: b.nome,
                    parentesco: b.parentesco,
                    percentual: parseFloat(b.percentual),
                    data_nascimento: b.data_nascimento,
                })));
            }

            message.success("📄 Apólice importada com sucesso!");
        } catch (err) {
            console.error("❌ Erro ao extrair apólice:", err);
            message.error("Erro ao importar dados do PDF.");
        }

        return false;
    };

    return (
        <Upload
            beforeUpload={(file) => {
                handleUpload(file);
                return false;
            }}
            showUploadList={false}
        >
            <Button icon={<UploadOutlined />}>📥 Importar Apólice (PDF)</Button>
        </Upload>
    );
};

export default UploadApolice;
