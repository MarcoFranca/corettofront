'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './MenuMobile.module.css';

// Imagens
// import DefaultUserImage from "../../../../../../public/assets/common/user.svg";
// import CloseIcon from "../../../../../../public/assets/pages/agenda/agenda.svg";
// import LogoImage from '../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg';
import DashboardImage from '../../../../../../public/assets/asideButtons/dashboard.svg';
import DolarImage from '../../../../../../public/assets/asideButtons/Leads.svg';
import CarteiraImage from '../../../../../../public/assets/asideButtons/carteira.svg';
import TodoImage from '../../../../../../public/assets/asideButtons/todo.svg';
import ConfigImage from '../../../../../../public/assets/asideButtons/engrenagem.svg';
import AgendaImage from '../../../../../../public/assets/asideButtons/agenda2.svg';
interface MenuMobileProps {
    profileImage: string | null;
    user: { username: string } | null;
    onLogout: () => void;
}

const MenuMobile: React.FC<MenuMobileProps> = ({ profileImage, user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    return (
        <nav className={styles.mobileMenu}>
                <ul className={styles.buttons}>
                    <Image className={styles.buttonsCell} onClick={() => handleNavigate("/dashboard/perfil")} src={DashboardImage} alt="Dashboard" priority />
                    <Image className={styles.buttonsCell} onClick={() => handleNavigate("/dashboard/lead")} src={DolarImage} alt="lead" priority />
                    <Image className={styles.buttonsCell} onClick={() => handleNavigate("/dashboard/carteira")} src={CarteiraImage} alt="carteira" priority />
                    <Image className={styles.buttonsCell} onClick={() => handleNavigate("/dashboard/tarefas")} src={TodoImage} alt="tarefas" priority />
                    <Image className={styles.buttonsCell} onClick={() => handleNavigate("/dashboard/agenda")} src={AgendaImage} alt="agenda" priority />
                    <Image className={styles.buttonsCell} onClick={() => handleNavigate("/dashboard/config")} src={ConfigImage} alt="config" priority />
                </ul>
        </nav>
    );
};

export default MenuMobile;
