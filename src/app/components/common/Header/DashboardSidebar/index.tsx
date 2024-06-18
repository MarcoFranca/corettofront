import styles from './styles.module.css';
import LogoImage from '@/../public/assets/Ativo 1.png';
import DashboardImage from '@/../public/assets/dashboard.png';
import DolarImage from '@/../public/assets/dolar.png';
import Image from 'next/image';
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";

const DashboardSidebar = () => {

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profile}>
            <Image src={LogoImage} alt={'logo'} className={styles.logo}/>
            </div>
            <nav>
                <ul>
                    <Cell image={DashboardImage} alt="Dashboard" link={'/dashboard'} text={'Dashboard'}/>
                    <Cell image={DolarImage} alt="Dolar" link={'/dashboard/leads'} text={'Leads'}/>
                    {/* Adicione mais links conforme necessário */}
                </ul>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
