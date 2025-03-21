"use client";
import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useAppDispatch } from "@/hooks/hooks";
import { createParceiro } from "@/store/slices/parceirosSlice";

const { Option } = Select;

interface Props {
    onClose: () => void;
}

const ParceiroWizard: React.FC<Props> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const parceiroData = {
                nome: values.nome,
                telefone: values.telefone || null,
                email: values.email || null,
                tipo: values.tipo || "preposto",
                comissao: 0.0,
                ativo: true,
                clientes_indicados: values.clientes_indicados || [], // 🔥 Mantém a lista vazia se não houver clientes
            };

            console.log("📤 Enviando dados:", parceiroData);

            await dispatch(createParceiro(parceiroData)).unwrap();
            message.success("Parceiro cadastrado com sucesso!");
            onClose();
        } catch (error: any) {
            console.error("❌ Erro ao cadastrar parceiro:", error);
            if (error.response?.data) {
                const errors = error.response.data;
                Object.keys(errors).forEach((key) => {
                    message.error(`${key}: ${errors[key]}`);
                });
            } else {
                message.error("Erro desconhecido ao cadastrar parceiro.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Form layout="vertical" onFinish={onFinish} style={{ padding: 20 }}>
            <Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Informe o nome" }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Telefone" name="telefone">
                <Input />
            </Form.Item>
            <Form.Item label="E-mail" name="email">
                <Input type="email" />
            </Form.Item>
            <Form.Item label="Tipo de Parceiro" name="tipo">
                <Select placeholder="Selecione um tipo">
                    <Option value="preposto">Preposto</Option>
                    <Option value="joint">Joint Venture</Option>
                    <Option value="autonomo">Autônomo</Option>
                    <Option value="empresa">Empresa</Option>
                    <Option value="outros">Outros</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Cadastrar
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ParceiroWizard;
