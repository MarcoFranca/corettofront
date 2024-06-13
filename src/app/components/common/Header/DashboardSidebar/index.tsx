import Link from 'next/link';
import styles from './styles.module.css';
import UserImage from '@/../public/assets/user.png';
import Image from 'next/image';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";

const DashboardSidebar = () => {
    const dispatch = useDispatch();
    // @ts-ignore
    const {email, username} = useSelector((state: RootState) => state.auth.user);
    return (
        <aside className={styles.sidebar}>
            <div className={styles.profile}>
                <Image
                    src={UserImage}
                    alt="user"
                    className={styles.userImage}
                />
                <div className={styles.profileDetails}>
                    <h3>{username}</h3>
                    <p>{email}</p>
                </div>
            </div>
            <nav>
                <ul>
                    <li>
                        <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/clients">Clientes</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/leads">Leads</Link>
                    </li>
                    {/* Adicione mais links conforme necessário */}
                </ul>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
