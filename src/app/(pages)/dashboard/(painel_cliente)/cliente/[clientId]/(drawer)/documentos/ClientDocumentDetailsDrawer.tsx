// components/drawer/ClientDocumentDetailsDrawer.tsx
'use client';
import React, { useEffect, useState } from "react";
import { Drawer, Button, Space, Tooltip, Tag, Spin, message } from "antd";
import {
    IdcardOutlined,
    CopyOutlined,
    EditOutlined,
    FileTextOutlined,
    UserOutlined,
    FilePdfOutlined,
    DeleteOutlined,
    CloudDownloadOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { formatCPFOrCNPJ, formatIdentidade } from "@/utils/maskUtils";
import api from "@/app/api/axios";
import UploadDocumentModal
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(documents)/UploadDocumentModal";
import {
    DocActions,
    DocItem, DocLeft,
    DocList,
    InfoLine
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/documentos/ClientDocumentDetailsDrawer.styles";
import {FaDownload, FaTrashAlt} from "react-icons/fa";
import {getCategoryTagColor, getFileIcon} from "@/utils/getFileIcon";

interface Props {
    open: boolean;
    cliente: any;
    onClose: () => void;
    onEditClick: () => void;
}

interface Document {
    id: number;
    nome: string;
    categoria: string;
    categoria_display: string;
    detalhes: string;
    expiracao: string | null;
    arquivo: string;
    criado_em: string;
}

const categoriaColors: Record<string, string> = {
    identidade: "blue",
    comprovante_residencia: "geekblue",
    declaracao_saude: "green",
    contrato: "purple",
    outros: "cyan",
};

const ClientDocumentDetailsDrawer: React.FC<Props> = ({
                                                          open, cliente, onClose, onEditClick
                                                      }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    useEffect(() => {
        if (open && cliente?.id) {
            fetchDocuments();
        }
    }, [open, cliente?.id]);

    const fetchDocuments = () => {
        setLoadingDocs(true);
        api.get(`/documentos/?cliente=${cliente.id}`)
            .then((response) => setDocuments(response.data))
            .catch(() => message.error("Erro ao carregar documentos."))
            .finally(() => setLoadingDocs(false));
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja remover este documento?")) return;
        try {
            await api.delete(`/documentos/${id}/`);
            message.success("Documento removido com sucesso!");
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        } catch (error) {
            message.error("Erro ao remover documento.");
        }
    };

    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

    return (
        <>
            <Drawer
                title={
                    <Space>
                        <IdcardOutlined /> Detalhes de Documentos
                    </Space>
                }
                open={open}
                onClose={onClose}
                width={590}
                destroyOnClose
                extra={
                    <Button icon={<EditOutlined />} onClick={onEditClick} type="primary">
                        Editar documentos
                    </Button>
                }
            >
                {/* CPF */}
                <InfoLine>
                    <FileTextOutlined style={{ color: "#042a75", fontSize: 19 }} />
                    <strong style={{ minWidth: 65 }}>CPF:</strong>
                    <span style={{ fontSize: 17 }}>
                    {cliente.cpf ? (
                        <Tag color="blue" style={{ fontSize: 15 }}>{formatCPFOrCNPJ(cliente.cpf)}</Tag>
                    ) : (
                        <span style={{ color: "#b8beca" }}>Não informado</span>
                    )}
                </span>
                    {cliente.cpf && (
                        <Tooltip title="Copiar CPF">
                            <Button
                                icon={<CopyOutlined />}
                                size="small"
                                style={{ border: "none" }}
                                onClick={() => copyToClipboard(formatCPFOrCNPJ(cliente.cpf))}
                            />
                        </Tooltip>
                    )}
                </InfoLine>
                {/* Identidade */}
                <InfoLine>
                    <UserOutlined style={{ color: "#042a75", fontSize: 19 }} />
                    <strong style={{ minWidth: 95 }}>Identidade:</strong>
                    <span>
                    {cliente.identidade ? (
                        <Tag color="magenta" style={{ fontSize: 14 }}>
                            {formatIdentidade(cliente.identidade, cliente.tipo_identidade)}
                        </Tag>
                    ) : (
                        <span style={{ color: "#b8beca" }}>Não informado</span>
                    )}
                </span>
                    {cliente.identidade && (
                        <Tooltip title="Copiar Identidade">
                            <Button
                                icon={<CopyOutlined />}
                                size="small"
                                style={{ border: "none" }}
                                onClick={() => copyToClipboard(cliente.identidade)}
                            />
                        </Tooltip>
                    )}
                </InfoLine>
                {/* Tipo de Identidade */}
                <InfoLine>
                    <FileTextOutlined style={{ color: "#33cccc", fontSize: 18 }} />
                    <strong style={{ minWidth: 125 }}>Tipo de Identidade:</strong>
                    <span>
                    {cliente.tipo_identidade ? (
                        <Tag color="cyan" style={{ fontSize: 13 }}>{cliente.tipo_identidade}</Tag>
                    ) : (
                        <span style={{ color: "#b8beca" }}>Não informado</span>
                    )}
                </span>
                </InfoLine>

                {/* Documentos Importados */}
                <div style={{
                    margin: "22px 0 8px",
                    fontWeight: 600,
                    fontSize: 17,
                    color: "#042a75",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between"
                }}>
                <span>
                    <FilePdfOutlined style={{ fontSize: 20, color: "#33cccc" }} />
                    Documentos importados
                </span>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setIsUploadModalOpen(true)}
                        style={{ borderRadius: 18 }}
                    >
                        Adicionar
                    </Button>
                </div>
                <DocList>
                    {documents.map((doc) => (
                        <DocItem key={doc.id}>
                            <DocLeft>
                                {getFileIcon(doc.nome)}
                                <div>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>
                                        {doc.nome}
                                        <Tag color={getCategoryTagColor(doc.categoria)} style={{ marginLeft: 8, fontWeight: 600 }}>
                                            {doc.categoria_display}
                                        </Tag>
                                    </div>
                                    <div style={{ fontSize: 13, color: "#888" }}>
                                        {doc.detalhes && <>ℹ️ {doc.detalhes}</>}
                                        {doc.criado_em && (
                                            <span style={{ marginLeft: 12 }}>
                                    📆 {new Date(doc.criado_em).toLocaleDateString("pt-BR")}
                                  </span>
                                        )}
                                    </div>
                                </div>
                            </DocLeft>
                            <DocActions>
                                <Tooltip title="Download">
                                    <Button icon={<FaDownload />} size="small" onClick={() => window.open(doc.arquivo, "_blank")} />
                                </Tooltip>
                                <Tooltip title="Excluir">
                                    <Button icon={<FaTrashAlt />} size="small" danger onClick={() => handleDelete(doc.id)} />
                                </Tooltip>
                            </DocActions>
                        </DocItem>
                    ))}
                </DocList>
            </Drawer>
            {/* Modal de upload (reutilizando seu modal pronto) */}
            <UploadDocumentModal
                isOpen={isUploadModalOpen}
                onRequestClose={() => setIsUploadModalOpen(false)}
                cliente={cliente}
                refreshDocuments={fetchDocuments}
            />
        </>
    );
};

export default ClientDocumentDetailsDrawer;
