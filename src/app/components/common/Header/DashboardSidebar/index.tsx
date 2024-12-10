'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector, useMediaQuery } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import MenuMobile from "../DashboardMobile/MenuMobile";
import Image from 'next/image';
import styles from './styles.module.css';

// Imagens
import DefaultUserImage from "../../../../../../public/assets/common/user.svg";
import LogoImage from '../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg';
import DashboardImage from '../../../../../../public/assets/asideButtons/dashboard.svg';
import DolarImage from '../../../../../../public/assets/asideButtons/Leads.svg';
import CarteiraImage from '../../../../../../public/assets/asideButtons/carteira.svg';
import TodoImage from '../../../../../../public/assets/asideButtons/todo.svg';
import ConfigImage from '../../../../../../public/assets/asideButtons/engrenagem.svg';
import AgendaImage from '../../../../../../public/assets/asideButtons/agenda2.svg';
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";

const DashboardSidebar = ({ profileImage }: { profileImage: string | null }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state) => state.auth?.user);

    // Detecta se a tela é desktop (largura mínima de 768px)
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    // Menu Desktop
    if (isDesktop) {
        return (
            <aside className={styles.sidebar}>
                <div className={styles.profile}>
                    <Image src={LogoImage} alt="logo" className={styles.logo} priority />
                </div>
                <div className={styles.headerBar}>
                    <div className={styles.userMenu}>
                        <Image
                            src={profileImage || DefaultUserImage}
                            alt="user"
                            className={styles.userImage}
                        />
                        <p>{user?.username ?? 'Usuário'}</p>
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
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </aside>
        );
    }

    // Menu Mobile
    return (
        <MenuMobile
            profileImage={profileImage}
            user={user}
            onLogout={handleLogout}
        />
    );
};

export default DashboardSidebar;
