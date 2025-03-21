"use client";
import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/hooks";
import { createParceiro } from "@/store/slices/parceirosSlice";

const { Option } = Select;

const CadastroParceiro: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await dispatch(createParceiro(values)).unwrap();
            message.success("Parceiro cadastrado com sucesso!");
            router.push("/dashboard/parceiros");
        } catch (error) {
            message.error("Erro ao cadastrar parceiro. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: "auto", padding: "20px" }}>
            <h2>Cadastrar Novo Parceiro</h2>
            <Form layout="vertical" onFinish={onFinish}>
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
        </div>
    );
};

export default CadastroParceiro;
