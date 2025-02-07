import React, { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal/simpleModal';
import Input from '@/app/components/global/Input';
import Button from '@/app/components/global/Button';
import { toast } from 'react-toastify';
import Select from 'react-select';
import api from '@/app/api/axios';
import { EditPersonalInfoModalProps, genderOptions, Profissao } from '@/types/interfaces';
import { ModalContainer, FormGroup, SelectWrapper } from './EditPersonalInfoModal.styles';

const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({ isOpen, onRequestClose, initialData, onSave }) => {
    const [dataNascimento, setDataNascimento] = useState(initialData.data_nascimento || '');
    const [genero, setGenero] = useState(
        initialData.genero ? { value: initialData.genero, label: initialData.genero === 'M' ? 'Masculino' : 'Feminino' } : null
    );

    const [profissoes, setProfissoes] = useState<{ label: string; options: { value: string; label: string }[] }[]>([]);
    const [profissao, setProfissao] = useState<{ value: string; label: string } | null>(
        initialData.profissao ? { value: initialData.profissao.id, label: initialData.profissao.nome } : null
    );

    // ✅ Carregar profissões e subcategorias ao abrir o modal
    useEffect(() => {
        const fetchProfissoes = async () => {
            try {
                const response = await api.get('/profissoes/');
                const dadosProfissoes = response.data;

                // Organiza profissões e subcategorias para exibição em grupos no Select
                const organizadas = dadosProfissoes.map((profissao: Profissao) => ({
                    label: profissao.nome, // Categoria principal
                    options: [
                        { value: profissao.id, label: `🔹 ${profissao.nome}` }, // Principal
                        ...(profissao.subcategorias ?? []).map((sub: Profissao) => ({
                            value: sub.id,
                            label: `↳ ${sub.nome}`, // Indica subnível
                        }))
                    ],
                }));

                setProfissoes(organizadas);
            } catch (error) {
                toast.error('Erro ao carregar profissões.');
                console.error('Erro ao buscar profissões:', error);
            }
        };

        if (isOpen) {
            fetchProfissoes();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dataNascimento || !genero || !profissao) {
            toast.error('⚠️ Preencha todos os campos obrigatórios.');
            return;
        }

        onSave({
            data_nascimento: dataNascimento,
            genero: genero.value,
            profissao_id: profissao.value, // 🔥 Agora passamos apenas o ID
        });
    };

    return (
        <Modal show={isOpen} onClose={onRequestClose} title="Editar Dados Pessoais">
            <ModalContainer onSubmit={handleSubmit}>
                <FormGroup>
                    <label>Data de Nascimento</label>
                    <Input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
                </FormGroup>

                <FormGroup>
                    <label>Gênero</label>
                    <SelectWrapper>
                        <Select
                            options={genderOptions}
                            value={genero}
                            onChange={(option) => setGenero(option)}
                            placeholder="Selecione o gênero"
                        />
                    </SelectWrapper>
                </FormGroup>

                <FormGroup>
                    <label>Profissão</label>
                    <SelectWrapper>
                        <Select
                            options={profissoes}
                            value={profissao}
                            onChange={(option) => setProfissao(option)}
                            placeholder="Selecione a profissão"
                            isSearchable
                        />
                    </SelectWrapper>
                </FormGroup>

                <Button variant="primary" type="submit">Salvar</Button>
            </ModalContainer>
        </Modal>
    );
};

export default EditPersonalInfoModal;
