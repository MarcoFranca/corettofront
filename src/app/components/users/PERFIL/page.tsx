'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import api from '@/app/api/axios';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import { Plano } from '@/types/interfaces';

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<{
        first_name: string;
        last_name: string;
        username: string;
        foto: string | File;
        assinatura_status: 'active' | 'trialing' | 'inactive';
        plano?: Plano | null;
    }>({
        first_name: '',
        last_name: '',
        username: '', // Adicionando o campo de username
        foto: '',
        assinatura_status: 'inactive',
        plano: null,
    });


    const [message, setMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentField, setCurrentField] = useState<string>('');
    const [loadingPortal, setLoadingPortal] = useState(false);
    const [errorPortal, setErrorPortal] = useState('');
    const [subUser, setSubUser] = useState({
        username: '',
        password: '',
        role: 'subuser',
    });
    const [loadingSubUser, setLoadingSubUser] = useState(false);
    const [subUsers, setSubUsers] = useState<any[]>([]);  // List of sub-users

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get('/profiles/me/');
                setProfile({
                    ...response.data,
                    first_name: response.data.user.first_name,
                    last_name: response.data.user.last_name,
                    username: response.data.user.username, // Adicionando o username vindo da API
                    plano: response.data.plano,
                });
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            }
        }
        fetchProfile();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubUserChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSubUser({ ...subUser, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfile({ ...profile, foto: file });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('user.first_name', profile.first_name);
            formData.append('user.last_name', profile.last_name);

            if (profile.foto && typeof profile.foto !== 'string') {
                formData.append('image', profile.foto);
            }

            await api.patch('/profiles/me/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Perfil atualizado com sucesso!');
            closeEditModal();
        } catch (error) {
            setMessage('Erro ao atualizar perfil. Tente novamente.');
            console.error('Erro ao atualizar perfil:', error);
        }
    };

    const openEditModal = (field: string) => {
        setCurrentField(field);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    const handleOpenPortal = async () => {
        setLoadingPortal(true);
        try {
            const response = await api.post('pagamentos/customer-portal/');
            const { url } = response.data;
            if (url) {
                window.location.href = url;
            } else {
                setErrorPortal('Erro ao redirecionar para o portal de pagamentos.');
            }
        } catch (err) {
            setErrorPortal('Erro ao abrir o portal do cliente.');
        } finally {
            setLoadingPortal(false);
        }
    };

    const handleAddSubUser = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingSubUser(true);
        try {
            const response = await api.post('/subusuarios/', subUser);
            setMessage('Subusuário adicionado com sucesso!');
            setSubUsers([...subUsers, response.data]);  // Atualiza a lista de subusuários
            setSubUser({ username: '', password: '', role: 'subuser' });
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail || 'Erro ao adicionar subusuário.';
            setMessage(errorMessage);
            console.error('Erro ao adicionar subusuário:', error);
        } finally {
            setLoadingSubUser(false);
        }
    };

    const displayName = profile.first_name || profile.last_name
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : profile.username; // Exibe o username caso nome e sobrenome estejam vazios

    const assinaturaInativa = profile.assinatura_status === 'inactive';

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.greeting}>Bem-vindo, {displayName}!</h2>

            <div className={styles.cardsContainer}>
                {/* Card do Plano */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <h3>Plano Atual</h3>
                    </div>
                    <p>
                        <strong>Status:</strong> {profile.assinatura_status === 'trialing' ? 'Em período de teste' : profile.assinatura_status === 'active' ? 'Ativo' : 'Inativo'}
                    </p>
                    <p><strong>Nome do Plano:</strong> {profile.plano?.nome || 'Nenhum plano escolhido'}</p>
                    <p><strong>Preço:</strong> R$ {profile.plano?.preco || 'N/A'}</p>
                    <button className={styles.button} onClick={handleOpenPortal} disabled={loadingPortal}>
                        {loadingPortal ? 'Abrindo portal...' : 'Ver Pagamentos e Recibos'}
                    </button>
                    {errorPortal && <p className={styles.error}>{errorPortal}</p>}
                </div>

                {/* Card de Informações do Perfil */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <h3>Informações do Perfil</h3>
                        <button className={styles.button} onClick={() => openEditModal('profile')}>Editar</button>
                    </div>
                    <p><strong>Nome:</strong> {profile.first_name}</p>
                    <p><strong>Sobrenome:</strong> {profile.last_name}</p>
                </div>
            </div>

            {/* Tabela de Subusuários */}
            {!assinaturaInativa && (
                <div className={styles.subuserTableContainer}>
                    <h3>Subusuários</h3>
                    <table className={styles.subuserTable}>
                        <thead>
                        <tr>
                            <th>Nome de Usuário</th>
                            <th>Função</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subUsers.length === 0 ? (
                            <tr>
                                <td colSpan={3}>Nenhum subusuário cadastrado.</td>
                            </tr>
                        ) : (
                            subUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td><button className={styles.tableButton}>Remover</button></td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {/* Formulário de Adição de Subusuário */}
                    <form onSubmit={handleAddSubUser} className={styles.subuserForm}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nome de usuário"
                            value={subUser.username}
                            onChange={handleSubUserChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            value={subUser.password}
                            onChange={handleSubUserChange}
                            required
                        />
                        <button className={styles.button} type="submit" disabled={loadingSubUser}>
                            {loadingSubUser ? 'Adicionando...' : 'Adicionar Subusuário'}
                        </button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            )}

            {/* Modal de Edição */}
            {showEditModal && (
                <div className={styles.modal}>
                    <form onSubmit={handleSubmit} className={styles.profileForm}>
                        <h2>Editar {currentField}</h2>
                        {currentField === 'profile' && (
                            <>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="Nome"
                                    value={profile.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Sobrenome"
                                    value={profile.last_name}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="file"
                                    name="foto"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </>
                        )}
                        <button className={styles.button} type="submit">
                            Salvar
                        </button>
                        <button className={styles.button} type="button" onClick={closeEditModal}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
