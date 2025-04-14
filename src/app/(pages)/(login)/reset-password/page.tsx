// src/app/pages/reset-password/page.tsx
import styles from './styles.module.css';
import ResetPasswordForm from "@/app/(pages)/(login)/reset-password/ResetPasswordForm";

export default function  ResetPasswordPage () {

    return (
        <div className={styles.container}>
            <ResetPasswordForm/>
        </div>
    );
};

