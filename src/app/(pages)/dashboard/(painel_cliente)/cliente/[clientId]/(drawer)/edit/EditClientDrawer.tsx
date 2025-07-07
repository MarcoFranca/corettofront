'use client';
import React, { useEffect } from "react";
import { Drawer, Button, Tabs, Avatar, Switch, Upload, Tooltip, Tag } from "antd";
import { UserOutlined, StarFilled, StarOutlined, UploadOutlined, EditOutlined } from "@ant-design/icons";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Cliente } from "@/types/interfaces";
import { useAppDispatch } from "@/services/hooks/hooks";
import { updateCliente, uploadFotoCliente } from "@/store/slices/clientesSlice";
import { toast } from "react-toastify";
import {
    DrawerFooter,
    SummaryHeader,
    SummaryMainInfo,
    SummaryActions,
    UploadHint,
    VIP
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/EditClientDrawer.styles";
import { buildSafePayload } from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/functions";
import DadosPessoaisSection from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/sections/DadosPessoaisSection";
import EditContactSection from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/sections/ContatoSection";
import EditDocumentsSection from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/sections/DocumentosSection";
import EditAddressSection from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/sections/EnderecoSection";
import api from "@/app/api/axios";
import EditSaudeSection
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/sections/EditSaudeSection"; // para chamada direta do endereço

function calcularIdade(dataNasc?: string) {
    if (!dataNasc) return "";
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }
    return idade;
}

interface Props {
    open: boolean;
    cliente: Cliente;
    onClose: () => void;
    onSave: (dadosAtualizados: Cliente) => void;
    defaultActiveTab?: string;
}

const EditClientDrawer: React.FC<Props> = ({
                                               open,
                                               cliente,
                                               onClose,
                                               onSave,
                                               defaultActiveTab
                                           }) => {
    const dispatch = useAppDispatch();

    const methods = useForm({
        defaultValues: {
            nome: "",
            sobre_nome: "",
            genero: "",
            estado_civil: "",
            cpf: "",
            identidade: "",
            tipo_identidade: "RG",
            data_nascimento: "",
            nome_mae: "",
            nome_pai: "",
            observacoes: "",
            email: "",
            telefone: "",
            is_vip: false,
            foto: "",
            // Endereço (flat para edição)
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            uf: "",
            cep: "",
            //Saúde
            peso: "",
            altura: "",
            doenca_preexistente: "",
            tem_doenca_preexistente: false,
            historico_familiar_doencas: "",
            tem_historico_familiar_doencas: false,
        },
    });

    const { control, handleSubmit, setValue, reset, register, watch } = methods;

    useEffect(() => {
        if (open && cliente) {
            const endereco = cliente.relacionamentos?.endereco || cliente.endereco || {};
            const saude = cliente.relacionamentos?.saude || {};

            reset({
                nome: cliente.nome || "",
                sobre_nome: cliente.sobre_nome || "",
                genero: cliente.genero || "",
                estado_civil: cliente.estado_civil && cliente.estado_civil !== "nan" ? cliente.estado_civil : "",
                cpf: cliente.cpf || "",
                identidade: cliente.identidade || "",
                tipo_identidade: cliente.tipo_identidade || "RG",
                data_nascimento: cliente.data_nascimento || "",
                nome_mae: cliente.nome_mae || "",
                nome_pai: cliente.nome_pai || "",
                observacoes: cliente.observacoes || "",
                email: cliente.email || "",
                telefone: cliente.telefone || "",
                is_vip: cliente.is_vip || false,
                foto: cliente.imagem_perfil || "",
                logradouro: cliente.relacionamentos?.endereco.logradouro || "",
                numero: cliente.relacionamentos?.endereco.numero || "",
                complemento: cliente.relacionamentos?.endereco.complemento || "",
                bairro: cliente.relacionamentos?.endereco.bairro || "",
                cidade: cliente.relacionamentos?.endereco.cidade || "",
                uf: cliente.relacionamentos?.endereco.uf || "",
                cep: cliente.relacionamentos?.endereco.cep || "",

                peso: cliente.relacionamentos?.saude?.peso !== undefined &&
                cliente.relacionamentos?.saude?.peso !== null ? String(cliente.relacionamentos?.saude?.peso) : "",
                altura: cliente.relacionamentos?.saude?.altura !== undefined && cliente.relacionamentos?.saude?.altura
                !== null ? String(cliente.relacionamentos?.saude?.altura) : "",
                doenca_preexistente: cliente.relacionamentos?.saude?.doenca_preexistente ?? "",
                tem_doenca_preexistente: cliente.relacionamentos?.saude?.tem_doenca_preexistente ?? false,
                historico_familiar_doencas: cliente.relacionamentos?.saude?.historico_familiar_doencas ?? "",
                tem_historico_familiar_doencas: cliente.relacionamentos?.saude?.tem_historico_familiar_doencas ?? false,
            });
        }
    }, [open, cliente, reset]);

    // --- 🔑 ATENÇÃO AQUI: Atualize cliente E endereço separadamente! ---
    const onSubmit = async (data: any) => {
        // Monta payload APENAS com campos do cliente, nunca inclua endereco
        const payload = buildSafePayload(data, cliente);

        // 1. Payload só com dados do cliente (limpe saúde/endereço)
        delete payload.peso;
        delete payload.altura;
        delete payload.doenca_preexistente;
        delete payload.tem_doenca_preexistente;
        delete payload.historico_familiar_doencas;
        delete payload.tem_historico_familiar_doencas;

        // Remove qualquer campo relacionado a endereco do payload do cliente
        delete payload.endereco;
        delete payload.logradouro;
        delete payload.numero;
        delete payload.complemento;
        delete payload.bairro;
        delete payload.cidade;
        delete payload.uf;
        delete payload.cep;

        try {
            // Atualiza dados do cliente normalmente (SEM endereco)
            await dispatch(
                updateCliente({ id: cliente.id, updatedCliente: payload })
            ).unwrap();

            // Atualiza endereço separado, se houve alteração ou preenchimento
            const enderecoPayload = {
                logradouro: data.logradouro,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                uf: data.uf,
                cep: data.cep,
                cliente: cliente.id, // ESSENCIAL!
            };
            const enderecoPreenchido = Object.values(enderecoPayload).some(
                (v, i) => v && (i !== 7) // ignora o campo cliente no some()
            );

            if (enderecoPreenchido) {
                const enderecoId = cliente.relacionamentos?.endereco?.id;

                if (enderecoId) {
                    await api.patch(`/enderecos/${enderecoId}/`, enderecoPayload);
                } else {
                    await api.post(`/enderecos/`, enderecoPayload);
                }
            }

            // 👇 ATUALIZA SAÚDE
            const saudePayload = {
                peso: data.peso ? parseFloat(data.peso) : null,
                altura: data.altura ? parseFloat(data.altura) : null,
                doenca_preexistente: data.doenca_preexistente,
                tem_doenca_preexistente: data.tem_doenca_preexistente,
                historico_familiar_doencas: data.historico_familiar_doencas,
                tem_historico_familiar_doencas: data.tem_historico_familiar_doencas,
            };

            const saudeId = cliente.relacionamentos?.saude?.id;

            if (
                saudePayload.peso ||
                saudePayload.altura ||
                saudePayload.doenca_preexistente ||
                saudePayload.tem_doenca_preexistente ||
                saudePayload.historico_familiar_doencas ||
                saudePayload.tem_historico_familiar_doencas
            ) {
                if (saudeId) {
                    await api.patch(`/saude/${cliente.id}/`, saudePayload);
                } else {
                    await api.post(`/saude/`, saudePayload);
                }
            }

            // Atualize o cliente no frontend após alterações
            const atualizado = await api.get(`/clientes/${cliente.id}/`);
            toast.success("📝 Dados atualizados com sucesso!");
            onSave(atualizado.data);
            onClose();
        } catch (error) {
            toast.error("❌ Erro ao atualizar. Tente novamente.");
        }
    };


    const onUploadPhoto = async (file: File) => {
        try {
            const atualizado = await dispatch(uploadFotoCliente({ id: cliente.id, file })).unwrap();
            toast.success("Foto atualizada com sucesso!");
            onSave(atualizado);
        } catch (err) {
            toast.error("Erro ao enviar a foto. Tente novamente.");
        }
        return false;
    };

    const imageUrl =
        cliente.imagem_perfil && cliente.imagem_perfil !== "nan"
            ? (cliente.imagem_perfil.startsWith("http")
                ? cliente.imagem_perfil
                : `${process.env.NEXT_PUBLIC_API_URL}${cliente.imagem_perfil}`)
            : undefined;

    const titulo = () => {
        return <p style={{ margin: 0 }}> <EditOutlined /> Editar Cliente</p>
    }

    return (
        <Drawer
            title={titulo()}
            width={650}
            open={open}
            onClose={onClose}
            styles={{ body: { padding: 0, background: "#f8fbff" } }}
            footer={
                <DrawerFooter>
                    <Button onClick={onClose} style={{ marginRight: 10 }}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" form="form-editar-cliente">
                        Salvar
                    </Button>
                </DrawerFooter>
            }
        >
            <SummaryHeader>
                <Avatar
                    size={74}
                    src={imageUrl}
                    icon={<UserOutlined />}
                    style={{ border: "3px solid #33cccc" }}
                />
                <SummaryMainInfo>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 22, fontWeight: 600, color: "#042a75" }}>
                            {cliente.nome} {cliente.sobre_nome}
                        </span>
                        <Tooltip title="Destaque VIP: facilita priorização e busca">
                            <VIP $vip={!!watch("is_vip")}>
                                <Controller
                                    name="is_vip"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            checkedChildren={<StarFilled />}
                                            unCheckedChildren={<StarOutlined />}
                                            onChange={val => setValue("is_vip", val)}
                                            style={{ marginLeft: 5, marginRight: 5 }}
                                        />
                                    )}
                                />
                                VIP
                            </VIP>
                        </Tooltip>
                    </div>
                    <div style={{ marginTop: 2, color: "#888" }}>
                        <Tag color="geekblue">{calcularIdade(cliente.data_nascimento)} anos</Tag>
                        <Tag color="cyan">{cliente.status}</Tag>
                    </div>
                </SummaryMainInfo>
                <SummaryActions>
                    <Upload
                        beforeUpload={onUploadPhoto}
                        showUploadList={false}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Trocar Foto</Button>
                        <UploadHint>JPG ou PNG, até 2MB</UploadHint>
                    </Upload>
                </SummaryActions>
            </SummaryHeader>

            <FormProvider {...methods}>
                <form id="form-editar-cliente" onSubmit={handleSubmit(onSubmit)} autoComplete="off" style={{ padding: 24 }}>
                    <Tabs
                        defaultActiveKey={defaultActiveTab ?? "1"}
                        items={[
                            {
                                key: "1",
                                label: "Dados Pessoais",
                                children: <DadosPessoaisSection methods={methods} cliente={cliente} />,
                            },
                            {
                                key: "2",
                                label: "Contato",
                                children: <EditContactSection cliente={cliente} />,
                            },
                            {
                                key: "3",
                                label: "Documentos",
                                children: <EditDocumentsSection cliente={cliente} />,
                            },
                            {
                                key: "4",
                                label: "Endereço",
                                children: <EditAddressSection />,
                            },
                            {
                                key: "5",
                                label: "Saúde",
                                children: <EditSaudeSection cliente={cliente} />,
                            },
                        ]}
                    />
                </form>
            </FormProvider>
        </Drawer>
    );
};

export default EditClientDrawer;
