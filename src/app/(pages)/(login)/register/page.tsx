import styles from './styles.module.css';
import RegisterForm from "@/app/(pages)/(login)/register/RegisterForm";


export default function RegisterPage () {


    return (
            <div className={styles.container}>
                {/*<SimpleNavBar/>*/}
                <RegisterForm />
            </div>
    );
};


