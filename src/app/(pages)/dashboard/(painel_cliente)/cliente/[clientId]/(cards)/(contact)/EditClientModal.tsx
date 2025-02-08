import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Modal from '@/app/components/Modal/simpleModal';
import FloatingMaskedInput from '@/app/components/ui/input/FloatingMaskedInput';
import Index from '@/app/components/ui/Button';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from "react-icons/fa";
import { ContatoAdicional, EditClientModalProps } from "@/types/interfaces";
import { removeMask } from "@/utils/maskUtils";
import {
    ModalContainer,
    Form,
    InputGroup,
    AdditionalContacts,
    ContactRow,
    RemoveButton,
    EmptyMessage, ContactSelect, PhoneInput,
} from './EditClientModal.Styles';
import { IoSyncOutline } from "react-icons/io5";

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onRequestClose, initialData, onSave }) => {
    const methods = useForm(); // ✅ Inicializa React Hook Form

    const [email, setEmail] = useState(initialData.email);
    const [telefone, setTelefone] = useState(initialData.telefone);
    const [contatosAdicionais, setContatosAdicionais] = useState<ContatoAdicional[]>(
        initialData?.contatos_adicionais || []
    );

    const handleAddContato = () => {
        setContatosAdicionais([...contatosAdicionais, { id: "", tipo: "Outro", valor: "" }]);
    };

    const handleRemoveContato = (index: number) => {
        setContatosAdicionais(contatosAdicionais.filter((_, i) => i !== index));
    };

    const handleContatoChange = (index: number, valor: string) => {
        const cleanedValue = valor.replace(/\D/g, ""); // Remove tudo que não for número
        const updatedContatos = [...contatosAdicionais];
        updatedContatos[index] = { ...updatedContatos[index], valor: cleanedValue };
        setContatosAdicionais(updatedContatos);
    };

    const handleTipoChange = (index: number, tipo: string) => {
        const updatedContatos = [...contatosAdicionais];
        updatedContatos[index] = { ...updatedContatos[index], tipo };
        setContatosAdicionais(updatedContatos);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !telefone) {
            toast.error('⚠️ Preencha todos os campos obrigatórios.');
            return;
        }

        onSave({
            email,
            telefone,
            contatos_adicionais: contatosAdicionais.map(contato => ({
                id: contato.id || undefined,  // Se já existir, mantém o ID
                tipo: contato.tipo || 'outro',
                valor: contato.valor,
            })),
        });
    };

    return (
        <Modal show={isOpen} onClose={onRequestClose} title="Editar Contato">
            <FormProvider {...methods}> {/* ✅ ENVOLVE O FORM COM O FORM PROVIDER */}
                <ModalContainer>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <FloatingMaskedInput
                                type="email"
                                name="email"
                                value={email}
                                label="E-mail"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                floatLabel={true} // 🔥 Ativa o Floating Label
                            />
                        </InputGroup>

                        <InputGroup>
                            <FloatingMaskedInput
                                type="text"
                                name="telefone"
                                label="Telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(removeMask(e.target.value))}
                                mask="(99) 99999-9999"
                                maskPlaceholder={null} // ✅ Corrigido para aceitar `null`
                                required
                                floatLabel={true}
                            />
                        </InputGroup>

                        {/* Contatos Adicionais */}
                        <AdditionalContacts>
                            <h4>Contatos Adicionais</h4>
                            {contatosAdicionais.length > 0 ? (
                                contatosAdicionais.map((contato, index) => (
                                    <ContactRow key={index}>
                                        <ContactSelect>
                                            <select
                                                value={contato.tipo}
                                                onChange={(e) => handleTipoChange(index, e.target.value)}
                                            >
                                                <option value="celular">Celular</option>
                                                <option value="residencial">Residencial</option>
                                                <option value="comercial">Comercial</option>
                                                <option value="outro">Outro</option>
                                            </select>
                                            <PhoneInput
                                                mask={contato.tipo !== "residencial" ? "(99) 99999-9999" : "(99) 9999-9999"}
                                                value={contato.valor}
                                                onChange={(e) => handleContatoChange(index, e.target.value)}
                                                required
                                            />
                                            <RemoveButton
                                                type="button"
                                                onClick={() => handleRemoveContato(index)}
                                            >
                                                <FaTrash size={16}/>
                                            </RemoveButton>
                                        </ContactSelect>
                                    </ContactRow>
                                ))
                            ) : (
                                <EmptyMessage>Nenhum contato adicional cadastrado.</EmptyMessage>
                            )}
                            <Index type="button" variant="warning" icon={<FaPlus />} iconPosition="left" onClick={handleAddContato}>
                                Adicionar Contato
                            </Index>
                        </AdditionalContacts>

                        <Index variant="primary" type="submit" icon={<IoSyncOutline />} iconPosition="left">
                            Atualizar
                        </Index>
                    </Form>
                </ModalContainer>
            </FormProvider>
        </Modal>
    );
};

export default EditClientModal;
