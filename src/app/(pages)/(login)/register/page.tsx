import styles from './styles.module.css';
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";
import RegisterForm from "@/app/(pages)/(login)/register/RegisterForm";


export default function RegisterPage () {


    return (
            <div className={styles.container}>
                <SimpleNavBar/>
                <RegisterForm />
            </div>
    );
};


