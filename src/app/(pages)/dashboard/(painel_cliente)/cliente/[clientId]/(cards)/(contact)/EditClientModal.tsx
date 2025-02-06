// src/app/components/Modal/profile/EditClientModal.tsx
import React, { useState } from 'react';
import Modal from '@/app/components/Modal/simpleModal';
import Input from '@/app/components/global/Input';
import Button from '@/app/components/global/Button';
import { toast } from 'react-toastify';
import {FaPlus, FaTrash} from "react-icons/fa"; // Ícones
import { ContatoAdicional, EditClientModalProps } from "@/types/interfaces";
import { removeMask } from "@/utils/phoneUtils";
import {
    ModalContainer,
    Form,
    InputGroup,
    AdditionalContacts,
    ContactRow,
    RemoveButton,
    EmptyMessage, ContactSelect, PhoneInput,
} from './EditClientModal.Styles';
import {IoSyncOutline} from "react-icons/io5";

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onRequestClose, initialData, onSave }) => {
    const [email, setEmail] = useState(initialData.email);
    const [telefone, setTelefone] = useState(initialData.telefone);
    const [contatosAdicionais, setContatosAdicionais] = useState<ContatoAdicional[]>(
        initialData?.contatos_adicionais || []
    );

    const handleAddContato = () => {
        setContatosAdicionais([...contatosAdicionais, { id: "", tipo: "Outro", valor: "" }]);
    };

    const handleRemoveContato = (index: number) => {
        const button = document.querySelector(`#remove-btn-${index}`); // Corrigindo a referência do botão

        if (button) {
            button.classList.add("shake"); // 🔥 Adiciona a classe para animar

            setTimeout(() => {
                setContatosAdicionais(contatosAdicionais.filter((_, i) => i !== index));
            }, 350); // ⏳ Aguarda a animação antes de remover
        } else {
            // setContatosAdicionais(contatosAdicionais.filter((_, i) => i !== index));
        }
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
            <ModalContainer>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Input type="email" value={email} label={'E-mail'} onChange={(e) => setEmail(e.target.value)} required />
                    </InputGroup>

                    <InputGroup>
                        <Input
                            type="text"
                            label={"Telefone"}
                            value={telefone}
                            onChange={(e) => setTelefone(removeMask(e.target.value))}
                            mask="(99) 99999-9999"
                            maskPlaceholder={null}
                            required
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
                                            mask={contato.tipo != "residencial" ? "(99) 99999-9999" : "(99) 9999-9999"}
                                            // Máscara dinâmica
                                            value={contato.valor}
                                            onChange={(e) => handleContatoChange(index, e.target.value)}
                                            required
                                        />
                                        <RemoveButton
                                            id={`remove-btn-${index}`} // 🔥 Adiciona um ID único para cada botão
                                            type="button"
                                            onClick={() => handleRemoveContato(index)}
                                        >
                                            <FaTrash size={16} />
                                        </RemoveButton>
                                    </ContactSelect>
                                </ContactRow>
                            ))
                        ) : (
                            <EmptyMessage>Nenhum contato adicional cadastrado.</EmptyMessage>
                        )}
                        <Button type="button" variant={"warning"} icon={<FaPlus />} iconPosition="left" onClick={handleAddContato}>
                            Adicionar Contato
                        </Button>
                    </AdditionalContacts>

                    <Button variant="primary" type="submit" icon={<IoSyncOutline /> } iconPosition={"left"}>
                        Atualizar
                    </Button>
                </Form>
            </ModalContainer>
        </Modal>
    );
};

export default EditClientModal;
