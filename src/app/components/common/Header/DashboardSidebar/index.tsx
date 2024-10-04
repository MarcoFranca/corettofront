'use client'
import React, { useState, useEffect } from 'react';
import api from '@/app/api/axios';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";
import { logout } from "@/store/slices/authSlice";
import Image from 'next/image';

// Importações de imagens
import DefaultUserImage from "../../../../../../public/assets/common/user.svg"; // Imagem padrão
import EditUserImage from "../../../../../../public/assets/common/editar_usuario_branco.svg";
import LogoutImage from "../../../../../../public/assets/login/logout_branco.svg";
import LogoImage from '../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg';
import DashboardImage from '../../../../../../public/assets/asideButtons/dashboard.svg';
import DolarImage from '../../../../../../public/assets/asideButtons/Leads.svg';
import CarteiraImage from '../../../../../../public/assets/asideButtons/carteira.svg';
import TodoImage from '../../../../../../public/assets/asideButtons/todo.svg';
import ConfigImage from '../../../../../../public/assets/asideButtons/engrenagem.svg';
import AgendaImage from '../../../../../../public/assets/asideButtons/agenda2.svg';

const DashboardSidebar = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [profileImage, setProfileImage] = useState<string | null>(null); // Estado para armazenar a imagem do perfil
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Função para buscar a imagem de perfil do usuário
        async function fetchProfileImage() {
            try {
                const response = await api.get('/profiles/me/');
                setProfileImage(response.data.image); // Define a imagem de perfil do usuário
            } catch (error) {
                console.error('Erro ao carregar a imagem do perfil:', error);
            }
        }

        fetchProfileImage();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    const toggleDropdown = (open: boolean) => {
        setDropdownOpen(open);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profile}>
                <Image src={LogoImage} alt={'logo'} className={styles.logo} priority />
            </div>
            <div className={styles.headerBar}>
                <div
                    className={styles.userMenu}
                    onClick={() => toggleDropdown(true)}
                    onMouseLeave={() => toggleDropdown(false)}
                >
                    <div className={styles.userMenuAcecces}>
                        <Image
                            src={profileImage || DefaultUserImage} // Usa a imagem do perfil ou a imagem padrão
                            alt="user"
                            className={styles.userImage}
                            width={50} // Define largura
                            height={50} // Define altura
                        />
                        <p>{user?.username ?? 'Usuário'}</p>
                    </div>
                    {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.dropdownBar}></div>
                            <div className={styles.dropdownButton} onClick={() => router.push('/edit-profile')}>
                                <Image src={EditUserImage} alt={'editar usuario'} />
                                Editar
                            </div>
                            <div className={styles.dropdownButton} onClick={handleLogout}>
                                <Image src={LogoutImage} alt={'logout'} />
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <nav>
                <ul>
                    <Cell url='/dashboard/perfil' image={DashboardImage} alt="Dashboard" text={'DASHBOARD'} campo={'dashboard'} />
                    <Cell url='/dashboard/lead' image={DolarImage} alt="Lead" campo={'leads'} text={'LEADS'} />
                    <Cell url='/dashboard/carteira' image={CarteiraImage} alt="Carteira" campo={'carteira'} text={'CARTEIRA'} />
                    <Cell url='/dashboard/tarefas' image={TodoImage} alt="Tarefas" campo={'tarefas'} text={'TAREFAS'} />
                    <Cell url='/dashboard/agenda' image={AgendaImage} alt="Agenda" campo={'agenda'} text={'AGENDA'} />
                    <Cell url='/dashboard/config' image={ConfigImage} alt="Engrenagem" campo={'config'} text={'CONFIGURAÇÃO'} />
                </ul>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
