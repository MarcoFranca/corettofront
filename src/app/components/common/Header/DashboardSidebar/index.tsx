'use client'
import styles from './styles.module.css';
import LogoImage from '@/../public/assets/Ativo 1.png';
import DashboardImage from '@/../public/assets/dashboard.png';
import DolarImage from '@/../public/assets/dolar.png';
import Image from 'next/image';
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";

// @ts-ignore
const DashboardSidebar = ({setActiveTab}) => {

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profile}>
            <Image src={LogoImage} alt={'logo'} className={styles.logo} priority/>
            </div>
            <nav >
                <ul>
                    <Cell onclick={setActiveTab} image={DashboardImage} alt="Dashboard" text={'DASHBOARD'} campo={'dashboard'}/>
                    <Cell onclick={setActiveTab} image={DolarImage} alt="Dolar" campo={'leads'} text={'LEADS'}/>
                    {/* Adicione mais links conforme necessário */}
                </ul>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
