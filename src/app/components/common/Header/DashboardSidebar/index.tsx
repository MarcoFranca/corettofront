'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import Image from 'next/image';
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";
import styles from './styles.module.css';

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

const DashboardSidebar = ({ profileImage }: { profileImage: string | null }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const auth = useAppSelector((state) => state.auth);
    const user = auth?.user || null;

    const [dropdownOpen, setDropdownOpen] = useState(false);

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
                            width={50}
                            height={50}
                        />
                        <p>{user?.username ?? 'Usuário'}</p>
                    </div>
                    {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.dropdownBar}></div>
                            <div className={styles.dropdownButton} onClick={() => router.push('/dashboard/perfil')}>
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
