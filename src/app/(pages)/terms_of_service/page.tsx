import React from 'react';
import styles from './TermsOfService.module.css';

export default function TermsOfServicePage() {
    return (
        <div className={styles.body}>
            <header className={styles.headerTerms}>
                <h1>Termos de Serviço</h1>
            </header>

            <div className={styles.containerContent}>
                <h2>Bem-vindo aos Termos de Serviço do Corretor Lab</h2>
                <p>Última atualização: [11/08/2024]</p>

                <h2>1. Descrição do Serviço</h2>
                <p>O Corretor Lab é uma plataforma de CRM focada em corretores de seguros, oferecendo funcionalidades como controle de funil de leads, entrada de dados pessoais de clientes, informações de saúde, dados financeiros e apólices de seguros.</p>

                <h2>2. Cadastro e Responsabilidades do Usuário</h2>
                <p>Para utilizar o Corretor Lab, você deve criar uma conta fornecendo informações precisas e atualizadas. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.</p>

                <h2>3. Planos e Pagamentos</h2>
                <p>O Corretor Lab oferece planos de assinatura mensal e anual (com desconto). O pagamento deve ser realizado de acordo com a modalidade escolhida no momento da assinatura. Você pode cancelar sua assinatura mensal a qualquer momento sem custos adicionais. Em caso de plano anual, o cancelamento não dará direito a reembolsos proporcionais.</p>
                <p>Os valores das assinaturas podem ser ajustados, com aviso prévio de [30 dias]. No momento, os preços dos serviços ainda não foram fixados.</p>

                <h2>4. Uso Aceitável</h2>
                <p>Ao utilizar o Corretor Lab, você concorda em:</p>
                <ul>
                    <li>Não compartilhar informações confidenciais ou sensíveis sem o consentimento dos seus clientes.</li>
                    <li>Não utilizar o sistema para atividades ilícitas ou que violem os direitos de terceiros.</li>
                    <li>Cumprir com as regulamentações aplicáveis, como a Lei Geral de Proteção de Dados (LGPD).</li>
                </ul>

                <h2>5. Restrições e Suspensão</h2>
                <p>Reservamo-nos o direito de suspender ou cancelar sua conta em caso de violação dos Termos de Serviço, uso indevido da plataforma ou falta de pagamento.</p>

                <h2>6. Propriedade Intelectual</h2>
                <p>Todos os conteúdos e funcionalidades do Corretor Lab, incluindo, mas não se limitando a, textos, gráficos, logos, ícones e software, são de nossa propriedade e protegidos por leis de direitos autorais e propriedade intelectual.</p>

                <h2>7. Limitação de Responsabilidade</h2>
                <p>O Corretor Lab não se responsabiliza por:</p>
                <ul>
                    <li>Danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou da incapacidade de usar a plataforma.</li>
                    <li>Erros, interrupções ou atrasos no sistema causados por fatores fora do nosso controle.</li>
                </ul>

                <h2>8. Privacidade e Proteção de Dados</h2>
                <p>O Corretor Lab coleta e processa dados pessoais conforme estabelecido em nossa <a href="/politica-de-privacidade">Política de Privacidade</a>. Todos os dados dos usuários e clientes são tratados de acordo com a LGPD.</p>

                <h2>9. Rescisão</h2>
                <p>Você pode encerrar sua conta no Corretor Lab a qualquer momento. Ao encerrar sua conta, todos os seus dados serão deletados de forma permanente, exceto nos casos em que for necessário mantê-los para cumprimento de obrigações legais.</p>

                <h2>10. Alterações nos Termos de Serviço</h2>
                <p>Podemos atualizar estes Termos de Serviço periodicamente. Qualquer alteração será comunicada por e-mail ou através da plataforma, com antecedência mínima de [30 dias].</p>

                <h2>11. Contato</h2>
                <p>Em caso de dúvidas ou esclarecimentos sobre os Termos de Serviço, entre em contato conosco através do e-mail: <a href="mailto:contato@corretorlab.com">contato@corretorlab.com</a>.</p>
            </div>

            <footer className={styles.footerTerms}>
                <p>&copy; 2024 Corretor Lab. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
