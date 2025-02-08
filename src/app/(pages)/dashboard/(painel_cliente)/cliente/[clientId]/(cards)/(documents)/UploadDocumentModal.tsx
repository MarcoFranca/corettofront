import React, { useState } from "react";
import Modal from "@/app/components/Modal/simpleModal";
import { Cliente } from "@/types/interfaces";
import api from "@/app/api/axios";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
    ModalContainer,
    FormGroup
} from "./UploadDocumentModal.styles";

interface UploadDocumentModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    cliente: Cliente;
    refreshDocuments: () => void;
}

const categoriaOptions = [
    { value: "identidade", label: "Identidade" },
    { value: "comprovante_residencia", label: "Comprovante de Residência" },
    { value: "declaracao_saude", label: "Declaração de Saúde" },
    { value: "contrato", label: "Contrato" },
    { value: "outros", label: "Outros" },
];

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onRequestClose, cliente, refreshDocuments }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [categoria, setCategoria] = useState("outros");
    const [detalhes, setDetalhes] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.warn("Selecione um arquivo para enviar.");
            return;
        }

        const formData = new FormData();
        formData.append("arquivo", selectedFile);
        formData.append("nome", selectedFile.name);
        formData.append("categoria", categoria);
        formData.append("detalhes", detalhes);
        formData.append("cliente", cliente.id.toString());

        setIsUploading(true);

        try {
            await api.post(`/documentos/`, formData);
            toast.success("Documento enviado com sucesso!");
            refreshDocuments();
            onRequestClose();
        } catch (error) {
            toast.error("Erro ao enviar documento.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onRequestClose} title="📤 Enviar Documento">
            <ModalContainer>
                <FormGroup>
                    <label>Selecione o Arquivo</label>
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                </FormGroup>
                <FormGroup>
                    <label>Categoria</label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        {categoriaOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </FormGroup>
                <FormGroup>
                    <label>Detalhes (Opcional)</label>
                    <input type="text" value={detalhes} onChange={(e) => setDetalhes(e.target.value)} />
                </FormGroup>

                <button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Enviando..." : <><FaCloudUploadAlt /> Enviar</>}
                </button>
            </ModalContainer>
        </Modal>
    );
};

export default UploadDocumentModal;
