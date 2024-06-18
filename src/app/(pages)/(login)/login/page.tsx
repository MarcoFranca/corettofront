import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";
import styles from './styles.module.css';
import LoginForm from "@/app/(pages)/(login)/login/LoginForm";

export default function  LoginPage () {
    return (
        <div className={styles.container}>
            <SimpleNavBar />
            <LoginForm />
        </div>
    );
};

