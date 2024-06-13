'use client'
import styles from './styles.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
const DynamicHeader = dynamic(() => import('../../components/common/(header)/Header'), { ssr: false });

interface User {
    id: number;
    username: string;
    email: string;
    token: {
        refresh: string;
        access: string;
    };
}

const UserPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push('/');
        }
    }, [router]);
    return(
        <>
        <DynamicHeader/>
        <main className={styles.main}>
            <h1>Nome de usuario: {user?.username}</h1>
            <h1>Email: {user?.email}</h1>
            <Link href={'/change-password'}>deseja alterar a senha?</Link>
        </main>
        </>
    )

}

export default UserPage