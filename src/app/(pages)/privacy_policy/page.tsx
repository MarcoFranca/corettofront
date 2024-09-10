import React from 'react';
import styles from './styles.module.css';

export default function PoliticasPage() {
    return (
        <body className={styles.body}>
        <header className={styles.headerPolice}>
            <h1>Política de Privacidade</h1>
        </header>
        <div className={styles.containerContant}>
            <h2>Bem-vindo à Política de Privacidade do Corretor Lab</h2>
            <p>Esta Política de Privacidade descreve como coletamos, usamos e protegemos as informações pessoais fornecidas
                por você ao utilizar nosso CRM focado em corretores, o Corretor Lab.</p>

            <h2>Coleta de Informações</h2>
            <p>Coletamos informações pessoais quando você se cadastra no Corretor Lab, incluindo nome, e-mail e informações
                sobre clientes para facilitar a gestão de sua carteira de corretores. Também podemos coletar dados de uso
                para melhorar nossos serviços.</p>

            <h2>Uso das Informações</h2>
            <p>Utilizamos as informações para oferecer e melhorar os serviços do Corretor Lab, garantindo que os corretores
                possam gerenciar suas operações de maneira eficiente. As informações não serão compartilhadas com terceiros
                sem o seu consentimento, exceto quando exigido por lei.</p>

            <h2>Proteção de Dados</h2>
            <p>O Corretor Lab adota medidas de segurança para proteger suas informações contra acessos não autorizados, uso
                indevido ou divulgação. No entanto, nenhum sistema de segurança é 100% seguro, e não podemos garantir a
                proteção absoluta dos seus dados.</p>

            <h2>Cookies</h2>
            <p>Utilizamos cookies para melhorar sua experiência no nosso site e entender como você interage com o Corretor
                Lab. Você pode desativar os cookies através das configurações do seu navegador, mas isso pode afetar algumas
                funcionalidades da plataforma.</p>

            <h2>Seus Direitos</h2>
            <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Entre em
                contato conosco através do e-mail <a href="mailto:contato@corretorlab.com">contato@corretorlab.com</a> para
                exercer esses direitos.</p>

            <h2>Alterações na Política de Privacidade</h2>
            <p>O Corretor Lab reserva-se o direito de modificar esta Política de Privacidade a qualquer momento. As
                alterações entrarão em vigor imediatamente após a publicação no site.</p>
        </div>

        <footer className={styles.footerPolice}>
            <p>&copy; 2024 Corretor Lab. Todos os direitos reservados.</p>
        </footer>
        </body>
    )
}
