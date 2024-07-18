import styles from './styles.module.css';
import Link from 'next/link';
import Image from 'next/image';
import LogoImage from '../../../../../../public/assets/logoIcons/coretto_color_horizontal.png';
import UserImage from '../../../../../../public/assets/login/login_Branco.svg';

const SimpleHeader = () => {
    return (
        <header className={styles.header}>
            <nav className={styles.navigation}>
                <Link href='/'>
                    <Image className={styles.logo} src={LogoImage} alt='logo' priority />
                </Link>
                <ul className={styles.menu}>
                    <Link href='/login' className={styles.link}>
                            <Image className={styles.user} src={UserImage} alt='user' priority />
                            <li>Login</li>
                    </Link>
                </ul>
            </nav>
        </header>
    );
};

export default SimpleHeader;
