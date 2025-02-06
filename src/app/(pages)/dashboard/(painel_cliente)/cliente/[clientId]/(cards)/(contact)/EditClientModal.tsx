// src/app/components/Modal/profile/EditClientModal.tsx
import React, { useState } from 'react';
import Modal from '@/app/components/Modal/simpleModal';
import Input from '@/app/components/global/Input';
import Button from '@/app/components/global/Button';
import { toast } from 'react-toastify';
import { ContatoAdicional, EditClientModalProps } from "@/types/interfaces";
import {
    ModalContainer,
    Form,
    InputGroup,
    AdditionalContacts,
    ContactRow,
    RemoveButton,
    AddButton,
    EmptyMessage
} from './EditClientModal.Styles';

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
        const newContatos = contatosAdicionais.filter((_, i) => i !== index);
        setContatosAdicionais(newContatos);
    };

    const handleContatoChange = (index: number, valor: string) => {
        const updatedContatos = [...contatosAdicionais];
        updatedContatos[index] = { ...updatedContatos[index], valor };
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
                        <Input type="text" label={"Telefone"} value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
                    </InputGroup>

                    {/* Contatos Adicionais */}
                    <AdditionalContacts>
                        <h4>Contatos Adicionais</h4>
                        {contatosAdicionais.length > 0 ? (
                            contatosAdicionais.map((contato, index) => (
                                <ContactRow key={index}>
                                    <select
                                        value={contato.tipo}
                                        onChange={(e) => handleTipoChange(index, e.target.value)}
                                    >
                                        <option value="celular">Celular</option>
                                        <option value="residencial">Residencial</option>
                                        <option value="comercial">Comercial</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                    <Input
                                        type="text"
                                        value={contato.valor}
                                        onChange={(e) => handleContatoChange(index, e.target.value)}
                                        required
                                        label={'Contato'}
                                    />
                                    <RemoveButton type="button" onClick={() => handleRemoveContato(index)}>
                                        ❌
                                    </RemoveButton>
                                </ContactRow>
                            ))
                        ) : (
                            <EmptyMessage>Nenhum contato adicional cadastrado.</EmptyMessage>
                        )}
                        <AddButton type="button" onClick={handleAddContato}>
                            ➕ Adicionar Contato
                        </AddButton>
                    </AdditionalContacts>

                    <Button variant="primary" type="submit">
                        Salvar
                    </Button>
                </Form>
            </ModalContainer>
        </Modal>
    );
};

export default EditClientModal;
