'use client'
import React, {useState} from "react";
import api from "@/app/api/axios";
import styles from "@/app/(pages)/(login)/reset-password/styles.module.css";
import CadeadoImage from "../../../../../public/assets/common/cadeado.png";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordForm() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/password_reset/', { email });

            setMessage('Se um usuário com esse e-mail existir, um link de redefinição de senha será enviado.');
        } catch (error) {
            setMessage('Erro ao solicitar redefinição de senha. Tente novamente.');
            console.error('Erro ao solicitar redefinição de senha:', error);
        }
    };

    return(
        <div className={styles.container_form}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Image src={CadeadoImage} alt={'Cadeado'} className={styles.image}/>
                <h1>Problemas para entrar?</h1>
                <p>Insira o seu email e enviaremos um link para você voltar a acessar a sua conta.</p>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>Enviar Link para login</button>
                <p>ou</p>
                <Link href={'/register'}>Criar nova conta</Link>
                {message && <p className={styles.message}>{message}</p>}
            </form>
               <Link className={styles.login} href={'/login'}> Voltar ao Login</Link>
        </div>
    )
}