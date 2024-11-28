'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './MenuMobile.module.css';

// Imagens
import DefaultUserImage from "../../../../../../public/assets/common/user.svg";
import CloseIcon from "../../../../../../public/assets/pages/agenda/agenda.svg";

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
        <div className={styles.mobileMenu}>
            <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>

            {isOpen && (
                <div className={styles.menuContent}>
                    <div className={styles.profile}>
                        <Image
                            src={profileImage || DefaultUserImage}
                            alt="User"
                            width={40}
                            height={40}
                            className={styles.userImage}
                        />
                        <p>{user?.username ?? "Usuário"}</p>
                        <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
                            <Image src={CloseIcon} alt="Close" />
                        </button>
                    </div>
                    <nav>
                        <ul>
                            <li onClick={() => handleNavigate("/dashboard/perfil")}>Dashboard</li>
                            <li onClick={() => handleNavigate("/dashboard/lead")}>Leads</li>
                            <li onClick={() => handleNavigate("/dashboard/carteira")}>Carteira</li>
                            <li onClick={() => handleNavigate("/dashboard/tarefas")}>Tarefas</li>
                            <li onClick={() => handleNavigate("/dashboard/agenda")}>Agenda</li>
                            <li onClick={() => handleNavigate("/dashboard/config")}>Configuração</li>
                        </ul>
                    </nav>
                    <button onClick={onLogout} className={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuMobile;
