'use client';
import React, { useState } from "react";
import { Button, Input, Select, Tag, Tooltip, Space, message } from "antd";
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    PhoneOutlined, UserOutlined
} from "@ant-design/icons";
import styled from "styled-components";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { formatPhoneNumber } from "@/utils/maskUtils";
import { ContatoAdicional } from "@/types/interfaces";
import { Grid2 } from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/EditClientDrawer.styles";
import PhoneInput from "@/app/components/ui/input/PhoneInput";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";

const contatoTypes = [
    { value: "celular", label: "Celular", icon: <PhoneOutlined /> },
    { value: "comercial", label: "Comercial", icon: <UserOutlined /> },
    { value: "residencial", label: "Residencial", icon: <UserOutlined /> },
    { value: "outro", label: "Outro", icon: <UserOutlined /> },
];

const ContactTag = styled(Tag)`
    margin-bottom: 6px;
    font-size: 15px;
`;

const Label = styled.div`
    font-weight: 500;
    margin-bottom: 4px;
`;

interface Props {
    cliente: any;
}

export default function EditContactSection({ cliente }: Props) {
    const { control, setValue, watch, register } = useFormContext();

    // useFieldArray sem generic (deixa RHF inferir, evita conflito de tipos)
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "contatos_adicionais",
    });

    // Novo contato
    const [novoContato, setNovoContato] = useState<ContatoAdicional>({
        tipo: "celular",
        valor: "",
    });
    const [editIdx, setEditIdx] = useState<number | null>(null);

    // Estado do contato preferido (dropdown)
    const contatoPreferido = watch("contato_preferido");

    // Handlers
    const handleAddContato = () => {
        if (!novoContato.valor) {
            message.error("Digite o número/contato.");
            return;
        }
        // Validação duplicidade
        if (
            fields.some(c => (c as any).valor === novoContato.valor) ||
            (cliente.telefone && cliente.telefone.replace(/\D/g, "") === novoContato.valor.replace(/\D/g, ""))
        ) {
            message.warning("Contato já cadastrado!");
            return;
        }
        append({
            tipo: novoContato.tipo || "celular",
            valor: novoContato.valor || "",
        });
        setNovoContato({ tipo: "celular", valor: "" });
    };

    const handleSaveEditContato = () => {
        if (editIdx === null) return;
        update(editIdx, {
            tipo: novoContato.tipo || "celular",
            valor: novoContato.valor || "",
            id: fields[editIdx]?.id, // Mantém o id caso exista!
        });
        setNovoContato({ tipo: "celular", valor: "" });
        setEditIdx(null);
    };

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Grid2>
                {/* E-mail */}
                <FloatingMaskedInput
                    name="email"
                    label="E-mail principal"
                    control={control}
                    setValue={setValue}
                    register={register}
                />
                <PhoneInput
                    name="telefone"
                    label="Telefone principal"
                    control={control}
                    setValue={setValue}
                />
            </Grid2>
            {/* Contato preferido */}
            <Label>
                <UserOutlined /> Contato preferido
            </Label>
            <Controller
                name="contato_preferido"
                control={control}
                defaultValue={cliente.contato_preferido || "telefone"}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={[
                            { value: "telefone", label: "Telefone" },
                            { value: "whatsapp", label: "WhatsApp" },
                            { value: "email", label: "E-mail" },
                        ]}
                        style={{ width: 170 }}
                    />
                )}
            />
            {/* Contatos adicionais */}
            <Label style={{ marginTop: 16 }}>
                <UserOutlined /> Contatos adicionais
            </Label>
            <div>
                {fields.length > 0 ? (
                    fields.map((contato, idx) => (
                        <ContactTag color="geekblue" key={(contato as any).id || idx}>
                            <span style={{ marginRight: 4 }}>
                                {contatoTypes.find(t => t.value === (contato as any).tipo)?.icon}
                            </span>
                            {formatPhoneNumber((contato as any).valor)} <small>({(contato as any).tipo})</small>
                            <Button
                                size="small"
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setNovoContato({
                                        tipo: (contato as any).tipo || "celular",
                                        valor: (contato as any).valor || "",
                                        id: (contato as any).id,
                                    });
                                    setEditIdx(idx);
                                }}
                            />
                            <Button
                                size="small"
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => remove(idx)}
                            />
                        </ContactTag>
                    ))
                ) : (
                    <div style={{ color: "#b8beca" }}>Nenhum contato adicional</div>
                )}
            </div>
            {/* Adicionar/editar contato adicional */}
            <Space>
                <Select
                    value={novoContato.tipo}
                    onChange={v => setNovoContato({ ...novoContato, tipo: v as any })}
                    options={contatoTypes}
                    style={{ width: 120 }}
                />
                <Input
                    value={novoContato.valor}
                    onChange={e => setNovoContato({ ...novoContato, valor: e.target.value })}
                    placeholder="(21) 90000-0000"
                    maxLength={16}
                    style={{ width: 160 }}
                />
                {editIdx === null ? (
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddContato}>
                        Adicionar
                    </Button>
                ) : (
                    <Button type="primary" icon={<EditOutlined />} onClick={handleSaveEditContato}>
                        Salvar edição
                    </Button>
                )}
            </Space>
        </Space>
    );
}
