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

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerBar}>
                <div className={styles.userMenu}>
                    <Image
                        src={UserImage}
                        alt="user"
                        className={styles.userImage}
                        onClick={toggleDropdown}
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
