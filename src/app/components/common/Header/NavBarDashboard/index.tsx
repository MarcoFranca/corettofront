'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './styles.module.css';
import UserImage from '@/../public/assets/user.png';

const DashboardHeader = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    const toggleDropdown = (open: boolean) => {
        setDropdownOpen(open);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerBar}>
                <div className={styles.profile}>
                    <h2>{user?.username ?? 'usuario'}</h2>
                    <p>{user?.email ?? 'email.exempo.com'}</p>
                </div>
                <div
                    className={styles.userMenu}
                    onMouseEnter={() => toggleDropdown(true)}
                    onMouseLeave={() => toggleDropdown(false)}
                >
                    <Image
                        src={UserImage}
                        alt="user"
                        className={styles.userImage}
                    />
                    {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={() => router.push('/edit-profile')}>Editar Perfil</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
