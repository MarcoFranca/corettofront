'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { AppDispatch } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { fetchProfile, fetchSubUsers, updateProfile } from '@/store/slices/profileSlice';
import api from '@/app/api/axios';
import Modal from '@/app/components/Modal/simpleModal';
import Index from '@/app/components/ui/Button';
import FloatingMaskedInput from '@/app/components/ui/input/FloatingMaskedInput';
import {
    Card,
    CardsContainer,
    CardTitle,
    ProfileContainer, SubuserTable,
    SubuserTableContainer, TableButton
} from "./profiles.styled";
import {useForm} from "react-hook-form";
import PaymentCard from "@/app/components/config/pagamentos/PaymentCard";

export default function ProfilePage() {
    const dispatch: AppDispatch = useDispatch();
    const { register, setValue, control } = useForm();


    const { data: profile, subUserData, subUsers } = useSelector((state: RootState) => state.profile);

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

    // Capture tokens from URL on page load and validate with the backend
    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     const accessToken = params.get("access_token");
    //     const refreshToken = params.get("refresh_token");
    //
    //     if (accessToken && refreshToken) {
    //         dispatch(setToken({ access: accessToken, refresh: refreshToken }));
    //         localStorage.setItem("accessToken", accessToken);
    //         localStorage.setItem("refreshToken", refreshToken);
    //
    //         api.get('/user_detail/', {
    //             headers: { Authorization: `Bearer ${accessToken}` }
    //         }).then((response) => {
    //             dispatch(setUser(response.data));
    //             router.replace("/dashboard/perfil");
    //         }).catch((error) => {
    //             console.error("Erro ao validar token do Google:", error);
    //             setMessage("Erro ao fazer login com Google.");
    //         });
    //     } else {
    //         console.log("Tokens não encontrados no URL de redirecionamento.");
    //     }
    // }, [dispatch, router]);



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
        if (profile) {
            dispatch(
                updateProfile({
                    user: {
                        ...profile.user,
                        [name]: value,
                    },
                })
            );
        }
    };

    const handleSubUserChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSubUser({ ...subUser, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && profile) {
            dispatch(
                updateProfile({
                    ...profile,
                    foto: file,
                })
            );
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
            await api.post('/subusuarios/', subUser);
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
        <ProfileContainer>
            <h2>Bem-vindo, {displayName}!</h2>

            <CardsContainer>
                    <PaymentCard
                        exibirLimites={true}
                    />

                <Card>
                    <CardTitle>
                        <h3>Informações do Perfil</h3>
                        <Index onClick={() => openEditModal('profile')}>Editar</Index>
                    </CardTitle>
                    <p><strong>Nome:</strong> {profile?.user.first_name}</p>
                    <p><strong>Sobrenome:</strong> {profile?.user.last_name}</p>
                    {isSubUser && (
                        <p><strong>Função:</strong> {subUserData?.role}</p>
                    )}
                </Card>
            </CardsContainer>

            {!assinaturaInativa && !isSubUser && (
                <SubuserTableContainer>
                    <h3>Subusuários</h3>
                    <SubuserTable>
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
                                        <TableButton
                                            onClick={() => handleDeleteSubUser(user.id)}
                                        >
                                            Remover
                                        </TableButton>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </SubuserTable>

                    <div>
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
                        <Index type="submit" disabled={loadingSubUser}>
                            {loadingSubUser ? 'Adicionando...' : 'Adicionar Subusuário'}
                        </Index>
                    </div>
                    {message && <p>{message}</p>}
                </SubuserTableContainer>
            )}

            {showEditModal && (
                <Modal show={showEditModal} onClose={closeEditModal} title="Editar Perfil">

                    <form onSubmit={handleSubmit}>
                        {/* 🔹 Nome */}
                        <FloatingMaskedInput
                            label="Nome"
                            type="text"
                            name="first_name"
                            value={profile?.user.first_name || ''}
                            onChange={handleInputChange}
                            required
                            floatLabel={true} // 🔥 Agora permite ativar/desativar o float
                            register={register}  // ✅ Agora passando corretamente
                            setValue={setValue}  // ✅ Agora passando corretamente
                            control={control}    // ✅ Agora passando corretamente
                        />

                        {/* 🔹 Sobrenome */}
                        <FloatingMaskedInput
                            label="Sobrenome"
                            type="text"
                            name="last_name"
                            value={profile?.user.last_name || ''}
                            onChange={handleInputChange}
                            floatLabel={true}
                            register={register}  // ✅ Agora passando corretamente
                            setValue={setValue}  // ✅ Agora passando corretamente
                            control={control}    // ✅ Agora passando corretamente
                        />

                        {/* 🔹 Foto (Arquivo) - NÃO usa FloatingMaskedInput */}
                        <label htmlFor="foto">Foto</label>
                        <input
                            type="file"
                            name="foto"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <Index variant="primary" type="submit">
                            Salvar
                        </Index>
                        <Index variant="secondary" type="button" onClick={closeEditModal}>
                            Cancelar
                        </Index>
                    </form>
                </Modal>
            )}

        </ProfileContainer>
    );
}