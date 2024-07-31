import Image from "next/image";
import HeroImage from "../../public/assets/pages/site/hero.png";
import styles from "./page.module.css";
import Link from "next/link";
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";


export default function Home() {

    return (
        <>
            <SimpleNavBar/>
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
                        Escale a operação de vendas da sua corretora com inteligência. Conte com a Corretor Lab para
                        controlar todas as etapas e tarefas das suas negociações com o cliente.
                    </p>
                    <div className={styles.heroContantButton}>
                        <Link className={styles.button} href={'/register'}>
                            CRIAR CONTA GRATUITA
                        </Link>
                        <Link className={styles.buttonVendas} href={'https://wa.me/5521990050220'} target="_blank">
                            CONVERSE COM VENDAS
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
