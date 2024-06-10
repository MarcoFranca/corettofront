import Image from "next/image";
import HeroImage from "../../public/assets/hero.png";
import styles from "./page.module.css";
import {Header} from "./components/common/Header";
import Link from "next/link";



export default function Home() {

    return (
        <>
            <Header />
            <main className={styles.main}>
                <Image
                    className={styles.hero}
                    src={HeroImage}
                    alt="imagem de um crm"
                    priority
                />
                <div className={styles.heroContant}>
                    <h1>CRM para corretores</h1>
                    <p>
                        Escale a operação de vendas da sua corretora com inteligência. Conte com o CORETTO CRM para
                        controlar todas as etapas e tarefas das suas negociações com o cliente.
                    </p>
                    <div className={styles.heroContantButton}>
                        <Link className={styles.button} href={'/register'}>
                            CRIAR CONTA GRATUITA
                        </Link>
                        <Link className={styles.buttonVendas} href={'/register'}>
                            CONVERSE COM VENDAS
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
