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
            <p>Esta Política de Privacidade descreve como coletamos, usamos e protegemos as informações pessoais
                fornecidas
                por você ao utilizar nosso CRM focado em corretores, o Corretor Lab.</p>

            <h2>Integrações com Google Services</h2>
            <p>O Corretor Lab utiliza integrações com o Google Calendar e Google Meet para permitir o agendamento e a
                gestão de reuniões diretamente pela nossa plataforma. Ao conceder permissões para acessar seu Google
                Calendar, coletamos e utilizamos os seguintes dados:</p>
            <ul>
                <li>Informações de eventos de calendário, como título, data, hora e participantes, para agendar reuniões
                    em nome dos usuários.
                </li>
                <li>Integração com o Google Meet para gerar links de reuniões automaticamente.</li>
            </ul>
            <p>Essas informações são usadas exclusivamente para facilitar a criação e gestão de eventos no calendário e
                nunca são compartilhadas com terceiros sem o seu consentimento.</p>
            <p>Você pode revogar o acesso ao Google Calendar e Google Meet a qualquer momento nas configurações de sua
                conta Google.</p>

            <h2>Coleta de Informações</h2>
            <p>Coletamos informações pessoais ao utilizar nosso CRM, incluindo nome, e-mail, informações sobre clientes,
                e dados relacionados ao Google Calendar, como eventos agendados e links de reuniões do Google Meet, para
                melhorar a gestão das atividades dos corretores.</p>

            <h2>Uso das Informações</h2>
            <p>Utilizamos as informações para fornecer e aprimorar os serviços do Corretor Lab, como o agendamento de
                reuniões por meio do Google Calendar e a criação automática de links de Google Meet. As informações
                coletadas dessas integrações são utilizadas apenas para facilitar a gestão de eventos e não são
                compartilhadas com terceiros sem o seu consentimento, exceto quando exigido por lei.</p>


            <h2>Proteção de Dados</h2>
            <p>O Corretor Lab adota medidas de segurança para proteger suas informações contra acessos não autorizados,
                uso
                indevido ou divulgação. No entanto, nenhum sistema de segurança é 100% seguro, e não podemos garantir a
                proteção absoluta dos seus dados.</p>

            <h2>Cookies</h2>
            <p>Utilizamos cookies para melhorar sua experiência no nosso site e entender como você interage com o
                Corretor
                Lab. Você pode desativar os cookies através das configurações do seu navegador, mas isso pode afetar
                algumas
                funcionalidades da plataforma.</p>

            <h2>Seus Direitos</h2>
            <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Isso
                inclui a revogação de acesso aos serviços do Google, como Google Calendar e Google Meet. Entre em
                contato conosco através do e-mail <a
                    href="mailto:contato@corretorlab.com">contato@corretorlab.com</a> para exercer esses direitos.</p>


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
