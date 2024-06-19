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
                <button className={styles.button}>
                    + NOVO LEAD
                </button>

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
                            <p>{user?.username ?? 'usuario'}</p>
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
