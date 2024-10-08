'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import api from '@/app/api/axios';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

export default function ProfilePage() {
    const [profile, setProfile] = useState<{
        first_name: string;
        last_name: string;
        foto: string | File;
        assinatura_status: string;
        plano?: {
            nome: string;
            descricao: string;
            preco: string;
        } | null; // Adicionando o plano ao estado
    }>({
        first_name: '',
        last_name: '',
        foto: '',
        assinatura_status: 'pendente',
        plano: null,
    });

    const [message, setMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentField, setCurrentField] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get('/profiles/me/');
                setProfile({
                    ...response.data,
                    first_name: response.data.user.first_name,
                    last_name: response.data.user.last_name,
                    isAccountActive: response.data.user.is_active,
                    plano: response.data.plano, // Definindo o plano
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

    // const assinaturaStatus = () => {
    //     return profile.assinatura_status !== 'active';
    // };


    return (
        <div className={styles.profileContainer}>
            {/* Tarja de Status da Conta */}
            {/*{assinaturaStatus() && (*/}
            {/*    <div className={styles.notificationBar}>*/}
            {/*        <div className={styles.notificationBarContent}>*/}
            {/*            <p className={styles.notificationBarText}>Sua conta está inativa.</p>*/}
            {/*            <button className={styles.notificationBarButton} onClick={() => router.push('/planos')}>Escolher*/}
            {/*                seu Plano*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* Informações do Perfil */}
            <div className={styles.cardsContainer}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <h3>Plano Atual</h3>
                        <button className={styles.button} onClick={() => router.push('/planos')}>Escolher Plano</button>
                    </div>
                    {profile.plano ? (
                        <>
                            <p>Nome do Plano: {profile.plano.nome}</p>
                            <p>Descrição: {profile.plano.descricao}</p>
                            <p>Preço: R$ {profile.plano.preco}</p>
                        </>
                    ) : (
                        <p>Escolha um plano para ativar sua conta.</p>
                    )}
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <h3>Informações do Perfil</h3>
                        <button className={styles.button} onClick={() => openEditModal('profile')}>Editar</button>
                    </div>
                    <div className={styles.perfilCardCell}>
                        <p>Nome: </p><p>{profile.first_name}</p>
                    </div>
                    <div className={styles.perfilCardCell}>
                        <p>Sobrenome:</p><p>{profile.last_name}</p>
                    </div>
                </div>

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
                            <button className={styles.button} type="submit">Salvar</button>
                            <button className={styles.button} type="button" onClick={closeEditModal}>Cancelar</button>
                        </form>
                    </div>
                )}
            </div>
            {message && <p>{message}</p>}
        </div>

    );
}
