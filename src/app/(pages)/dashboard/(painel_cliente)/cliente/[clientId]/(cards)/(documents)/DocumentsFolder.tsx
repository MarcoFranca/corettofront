import React, { useState, useEffect } from "react";
import { Cliente } from "@/types/interfaces";
import { toast } from "react-toastify";
import api from "@/app/api/axios";
import { FaDownload, FaTrashAlt, FaPlus } from "react-icons/fa";
import {
    Container,
    DocumentItem,
    DocumentsList,
    UploadButton,
    Header,
    ScrollableContainer,
} from "./DocumentsFolder.styles";
import UploadDocumentModal from "./UploadDocumentModal";


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

interface Props {
    cliente: Cliente;
}

const DocumentsFolder: React.FC<Props> = ({ cliente }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, [cliente.id]);

    const fetchDocuments = () => {
        api.get(`/documentos/?cliente=${cliente.id}`)
            .then((response) => setDocuments(response.data))
            .catch((error) => toast.error("Erro ao carregar documentos."));
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja remover este documento?")) return;

        try {
            await api.delete(`/documentos/${id}/`);
            toast.success("Documento removido com sucesso!");
            setDocuments(documents.filter((doc) => doc.id !== id));
        } catch (error) {
            toast.error("Erro ao remover documento.");
        }
    };

    return (
        <Container>

            <Header>
                <h3>📁 Documentos do Cliente</h3>
                <UploadButton onClick={() => setUploadModalOpen(true)}>
                    <FaPlus /> Adicionar Documento
                </UploadButton>
            </Header>

            <ScrollableContainer>
                <DocumentsList>
                    {documents.length > 0 ? (
                        documents.map((doc) => (
                            <DocumentItem key={doc.id}>
                                <p>{doc.nome} - <em>{doc.categoria_display}</em></p>
                                <small>📆 Criado em: {new Date(doc.criado_em).toLocaleDateString()}</small>
                                {doc.expiracao && <small>⏳ Expira em: {new Date(doc.expiracao).toLocaleDateString()}</small>}
                                {doc.detalhes && <small>ℹ️ {doc.detalhes}</small>}
                                <div>
                                    <div className="icon-group">
                                        <FaDownload onClick={() => window.open(doc.arquivo, "_blank")} />
                                        <FaTrashAlt onClick={() => handleDelete(doc.id)} />
                                    </div>
                                </div>
                            </DocumentItem>
                        ))
                    ) : (
                        <p>Nenhum documento encontrado.</p>
                    )}
                </DocumentsList>
            </ScrollableContainer>

            {/* 🔹 Modal de Upload */}
            <UploadDocumentModal
                isOpen={isUploadModalOpen}
                onRequestClose={() => setUploadModalOpen(false)}
                cliente={cliente}
                refreshDocuments={fetchDocuments}
            />
        </Container>
    );
};

export default DocumentsFolder;
