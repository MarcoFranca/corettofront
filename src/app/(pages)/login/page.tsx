import dynamic from 'next/dynamic';
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";
import styles from './styles.module.css';


export const metadata = {
    title: "Login - Coretto CRM",
    description: "Faça login no Coretto CRM",
};

// Importação dinâmica do LoginForm
const DynamicLoginForm = dynamic(() => import('./LoginForm'), { ssr: false });

const LoginPage = () => {
    return (
        <div className={styles.container}>
            <SimpleNavBar />
            <div className={styles.main}>
                <h1>Login</h1>
                <DynamicLoginForm />
            </div>
        </div>
    );
};

export default LoginPage;