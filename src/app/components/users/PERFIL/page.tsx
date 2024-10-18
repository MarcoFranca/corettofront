'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { AppDispatch } from '@/store'; // Importe a tipagem do dispatch
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { fetchProfile, fetchSubUsers, updateProfile } from '@/store/slices/profileSlice';
import styles from './styles.module.css';
import api from '@/app/api/axios';

export default function ProfilePage() {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    const { data: profile, subUserData, subUsers, loading, error } = useSelector((state: RootState) => state.profile);

    const [message, setMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentField, setCurrentField] = useState<string>('');
    const [loadingPortal, setLoadingPortal] = useState(false);
    const [errorPortal, setErrorPortal] = useState('');
    const [subUser, setSubUser] = useState({
        username: '',
        password: '',
        role: 'secretaria',
    });
    const [loadingSubUser, setLoadingSubUser] = useState(false);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile && !subUserData) {
            dispatch(fetchSubUsers());
        }
    }, [profile, subUserData, dispatch]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch(updateProfile({ user: { ...profile?.user, [name]: value } }));
    };

    const handleSubUserChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            formData.append('user.first_name', profile?.user.first_name || '');
            formData.append('user.last_name', profile?.user.last_name || '');

            if (profile?.foto && typeof profile.foto !== 'string') {
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

    const handleAddSubUser = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingSubUser(true);

        const maxSubUsers = profile?.plano?.limite_subusuarios || 0;
        if (subUsers.length >= maxSubUsers) {
            setMessage(`Limite de ${maxSubUsers} subusuários atingido. Não é possível adicionar mais subusuários.`);
            setLoadingSubUser(false);
            return;
        }

        try {
            const response = await api.post('/subusuarios/', subUser);
            setMessage('Subusuário adicionado com sucesso!');
            dispatch(fetchSubUsers());
            setSubUser({ username: '', password: '', role: 'secretaria' });
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.[0] || 'Erro ao adicionar subusuário.';
            setMessage(errorMessage);
        } finally {
            setLoadingSubUser(false);
        }
    };

    const handleDeleteSubUser = async (id: string) => {
        try {
            await api.delete(`/subusuarios/${id}/`);
            dispatch(fetchSubUsers());
            setMessage('Subusuário removido com sucesso!');
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail || 'Erro ao remover subusuário.';
            setMessage(errorMessage);
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

    const displayName = profile?.user.first_name || profile?.user.last_name
        ? `${profile?.user.first_name} ${profile?.user.last_name}`.trim()
        : profile?.user.username;

    const assinaturaInativa = profile?.assinatura_status === 'inactive';
    const isSubUser = !!subUserData;

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.greeting}>Bem-vindo, {displayName}!</h2>

            <div className={styles.cardsContainer}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <h3>Plano Atual</h3>
                    </div>
                    <p><strong>Status:</strong> {profile?.assinatura_status === 'trialing' ? 'Em período de teste' : profile?.assinatura_status === 'active' ? 'Ativo' : 'Inativo'}</p>
                    <p><strong>Nome do Plano:</strong> {profile?.plano?.nome || 'Nenhum plano escolhido'}</p>
                    <p><strong>Preço:</strong> R$ {profile?.plano?.preco || 'N/A'}</p>
                    {!isSubUser && (
                        <>
                            <p><strong>Limite de Subusuários:</strong> {profile?.plano?.limite_subusuarios || 'N/A'}</p>
                            <p><strong>Subusuários Atuais:</strong> {subUsers.length} / {profile?.plano?.limite_subusuarios || '0'}</p>
                        </>
                    )}
                    <button className={styles.button} onClick={handleOpenPortal} disabled={loadingPortal}>
                        {loadingPortal ? 'Abrindo portal...' : 'Ver Pagamentos e Recibos'}
                    </button>
                    {errorPortal && <p className={styles.error}>{errorPortal}</p>}
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <h3>Informações do Perfil</h3>
                        <button className={styles.button} onClick={() => openEditModal('profile')}>Editar</button>
                    </div>
                    <p><strong>Nome:</strong> {profile?.user.first_name}</p>
                    <p><strong>Sobrenome:</strong> {profile?.user.last_name}</p>
                    {isSubUser && (
                        <p><strong>Função:</strong> {subUserData?.role}</p>
                    )}
                </div>
            </div>

            {!assinaturaInativa && !isSubUser && (
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
                                    <td>
                                        <button
                                            className={styles.tableButton}
                                            onClick={() => handleDeleteSubUser(user.id)}
                                        >
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

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
                        <select
                            name="role"
                            value={subUser.role}
                            onChange={handleSubUserChange}
                            required
                        >
                            <option value="secretaria">Secretaria</option>
                            <option value="gerente">Gerente</option>
                        </select>
                        <button className={styles.button} type="submit" disabled={loadingSubUser}>
                            {loadingSubUser ? 'Adicionando...' : 'Adicionar Subusuário'}
                        </button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            )}

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
                                    value={profile?.user.first_name || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Sobrenome"
                                    value={profile?.user.last_name || ''}
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
