import React, { useState } from "react";
import Modal from "@/app/components/Modal/simpleModal";
import Input from "@/app/components/ui/input/FloatingMaskedInput"; // ✅ Importando o componente de Input
import Button from "@/app/components/ui/Button";
import { toast } from "react-toastify";
import { Cliente } from "@/types/interfaces";
import { useAppDispatch } from "@/hooks/hooks";
import { updateCliente } from "@/store/slices/clientesSlice";
import { ModalContainer, FormGroup } from "./EditDocumentsModal.styles";
import { removeMask, getCpfMask, getIdentityMask } from "@/utils/maskUtils"; // ✅ Importamos os utilitários

interface EditDocumentsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    cliente: Cliente;
}

const EditDocumentsModal: React.FC<EditDocumentsModalProps> = ({ isOpen, onRequestClose, cliente }) => {
    const dispatch = useAppDispatch();

    const [cpf, setCpf] = useState(cliente.cpf || "");
    const [identidade, setIdentidade] = useState(cliente.identidade || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!cpf && !identidade) {
            toast.error("⚠️ Preencha pelo menos um dos campos.");
            return;
        }

        const payload = {
            cpf: removeMask(cpf), // 🔥 Enviamos o CPF sem máscara
            identidade: removeMask(identidade), // 🔥 Enviamos a Identidade sem máscara
        };

        dispatch(updateCliente({ id: cliente.id, updatedCliente: payload }))
            .unwrap()
            .then(() => {
                toast.success("📜 Documentos atualizados com sucesso!");
                onRequestClose();
            })
            .catch((error) => {
                console.error("Erro ao atualizar documentos:", error);
                toast.error("❌ Erro ao atualizar documentos. Tente novamente.");
            });
    };

    return (
        <Modal show={isOpen} onClose={onRequestClose} title="Editar Documentos">
            <ModalContainer onSubmit={handleSubmit}>
                <FormGroup>
                    <Input
                        name='CPF'
                        label="CPF"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                        placeholder="Digite o CPF"
                        mask={getCpfMask(cpf)} // ✅ Usa máscara dinâmica
                    />
                </FormGroup>

                <FormGroup>
                    <Input
                        name={'identidade'}
                        label="Identidade"
                        type="text"
                        value={identidade}
                        onChange={(e) => setIdentidade(e.target.value)}
                        required
                        placeholder="Digite a Identidade"
                        mask={getIdentityMask(identidade)}
                    />
                </FormGroup>

                <Button variant="primary" type="submit">Salvar</Button>
            </ModalContainer>
        </Modal>
    );
};

export default EditDocumentsModal;
