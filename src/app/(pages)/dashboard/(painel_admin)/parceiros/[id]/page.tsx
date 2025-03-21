"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, Button, Drawer, Form, Input, Select, message } from "antd";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchParceiroById, updateParceiro, Parceiro, Cliente } from "@/store/slices/parceirosSlice";
import { FaEdit } from "react-icons/fa";

const { Option } = Select;

const ParceiroDetalhes: React.FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const parceiro = useAppSelector((state) => state.parceiros.selectedParceiro) as Parceiro | null;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [form] = Form.useForm(); // ✅ Form para edição

    useEffect(() => {
        if (id) dispatch(fetchParceiroById(id as string));
    }, [dispatch, id]);

    if (!parceiro) return <p>Carregando...</p>;

    // Abre o Drawer e carrega os dados do parceiro no formulário
    const handleEdit = () => {
        form.setFieldsValue({
            nome: parceiro.nome,
            telefone: parceiro.telefone || "",
            email: parceiro.email || "",
            tipo: parceiro.tipo,
            comissao: parceiro.comissao,
            ativo: parceiro.ativo,
        });
        setIsDrawerOpen(true);
    };

    // Envia os dados atualizados para o backend
    const onFinish = async (values: any) => {
        try {
            await dispatch(updateParceiro({ id: parceiro.id, parceiroData: values })).unwrap();
            message.success("Parceiro atualizado com sucesso!");
            setIsDrawerOpen(false);
            dispatch(fetchParceiroById(parceiro.id)); // 🔄 Atualiza os detalhes após edição
        } catch (error) {
            console.error("❌ Erro ao atualizar parceiro:", error);
            message.error("Erro ao atualizar parceiro. Tente novamente.");
        }
    };

    return (
        <div>
            <Card
                title={`Detalhes do Parceiro - ${parceiro.nome}`}
                extra={<Button icon={<FaEdit />} onClick={handleEdit}>Editar</Button>}
                style={{ maxWidth: 600, margin: "auto" }}
            >
                <Typography.Paragraph><strong>Telefone:</strong> {parceiro.telefone || "Não informado"}</Typography.Paragraph>
                <Typography.Paragraph><strong>Email:</strong> {parceiro.email || "Não informado"}</Typography.Paragraph>
                <Typography.Paragraph><strong>Comissão:</strong> {parceiro.comissao}%</Typography.Paragraph>
                <Typography.Paragraph><strong>Tipo:</strong> {parceiro.tipo}</Typography.Paragraph>
                <Typography.Paragraph><strong>Status:</strong> {parceiro.ativo ? "Ativo" : "Inativo"}</Typography.Paragraph>

                <Typography.Title level={4}>Clientes Indicados</Typography.Title>
                {parceiro.clientes_indicados.length > 0 ? (
                    parceiro.clientes_indicados.map((cliente: Cliente) => (
                        <Tag key={cliente.id} onClick={() => router.push(`/dashboard/clientes/${cliente.id}`)} color="blue">
                            {cliente.nome}
                        </Tag>
                    ))
                ) : (
                    <Typography.Paragraph>Nenhum cliente indicado</Typography.Paragraph>
                )}
            </Card>

            {/* Drawer de Edição */}
            <Drawer
                title="Editar Parceiro"
                placement="right"
                closable
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                width="40vw"
            >
                <Form layout="vertical" form={form} onFinish={onFinish}>
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
                        <Select>
                            <Option value="preposto">Preposto</Option>
                            <Option value="joint">Joint Venture</Option>
                            <Option value="autonomo">Autônomo</Option>
                            <Option value="empresa">Empresa</Option>
                            <Option value="outros">Outros</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Comissão (%)" name="comissao">
                        <Input type="number" min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item label="Status" name="ativo">
                        <Select>
                            <Option value={true}>Ativo</Option>
                            <Option value={false}>Inativo</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Salvar Alterações
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default ParceiroDetalhes;
