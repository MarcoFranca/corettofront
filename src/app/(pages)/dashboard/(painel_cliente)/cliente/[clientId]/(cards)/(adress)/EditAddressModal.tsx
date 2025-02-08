import React, { useState } from "react";
import { Cliente } from "@/types/interfaces";
import SimpleModal from "@/app/components/Modal/simpleModal"; // Importe o SimpleModal
import {
    FormGroup
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(documents)/EditDocumentsModal.styles";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import {
    CancelButton,
    ConfirmButton,
    ModalContainer,
    Row
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(adress)/EditAddressModal.styles";
import {ModalActions} from "@/app/components/Modal/confirm/ConfirmDeleteModal.styles";

interface EditAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    cliente: Cliente;
    onSave: (data: any) => void; // Callback para salvar os dados
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               cliente,
                                                               onSave,
                                                           }) => {
    const [formData, setFormData] = useState(cliente.endereco || {});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <SimpleModal show={isOpen} onClose={onClose} title="Editar Endereço">
            <ModalContainer>
                <FormGroup>
                    <label>Logradouro:</label>
                    <FloatingMaskedInput
                        label={'Logradouro:'}
                        type="text"
                        name="logradouro"
                        value={formData.logradouro || ""}
                        onChange={handleInputChange}
                    />
                </FormGroup>

                <Row>
                    <FormGroup>
                        <FloatingMaskedInput
                            label={'Número:'}
                            type="text"
                            name="numero"
                            value={formData.numero || ""}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FloatingMaskedInput
                            label="Complemento:"
                            type="text"
                            name="complemento"
                            value={formData.complemento || ""}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Row>

                <Row>
                    <FormGroup>
                        <FloatingMaskedInput
                            label="Bairro:"
                            type="text"
                            name="bairro"
                            value={formData.bairro || ""}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FloatingMaskedInput
                            label="Cidade:"
                            type="text"
                            name="cidade"
                            value={formData.cidade || ""}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Row>

                <Row>
                    <FormGroup>
                        <FloatingMaskedInput
                            label="UF:"
                            type="text"
                            name="uf"
                            value={formData.uf || ""}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FloatingMaskedInput
                            label="CEP:"
                            type="text"
                            name="cep"
                            value={formData.cep || ""}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Row>

                <ModalActions>
                    <ConfirmButton onClick={handleSave}>Salvar</ConfirmButton>
                    <CancelButton onClick={onClose}>Cancelar</CancelButton>
                </ModalActions>
            </ModalContainer>
        </SimpleModal>
    );
};

export default EditAddressModal;
