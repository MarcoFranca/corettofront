// Coloque aqui o TEXTO INTEGRAL dos Termos de Uso (versão 1.0) em HTML.
// Dica: pegue o contrato que finalizamos e converta os títulos/itens para <h3>, <p>, <ul>, <li> etc.
// Evite inline CSS aqui; o container do modal/páginas já estiliza.

const termsHtmlV1 = `
<h1>Termos de Uso – CorretorLab CRM</h1>
<p><strong>Última atualização:</strong> 09/08/2025</p>
<p>Estes Termos regulam o uso do CorretorLab CRM, de titularidade da Autentika Digital Ltda. (“<strong>CorretorLab</strong>”, “<strong>Plataforma</strong>”, “<strong>nós</strong>”). Ao usar a Plataforma, você (“<strong>Usuário</strong>”) concorda com estes Termos e com a Política de Privacidade.</p>

<h2>1. Objeto</h2>
<p>O CorretorLab é um software SaaS de gestão para corretores de seguros, com funcionalidades de leads, clientes, apólices, agenda, integrações (Google, Stripe, OpenAI) e assistente de IA (Cora).</p>

<h2>2. Cadastro e Conta</h2>
<ul>
  <li>Você deve fornecer dados verdadeiros e manter sua conta segura (credenciais sob sigilo).</li>
  <li>É responsável por toda atividade realizada a partir da sua conta.</li>
</ul>

<h2>3. Uso Permitido</h2>
<ul>
  <li>É vedado uso ilícito, violação de direitos de terceiros, engenharia reversa, exploração de vulnerabilidades ou sobrecarga de infraestrutura.</li>
  <li>É vedado inserir dados de titulares sem base legal adequada nos termos da LGPD.</li>
</ul>

<h2>4. Conteúdo do Usuário</h2>
<p>O conteúdo inserido por você (clientes, leads, apólices, documentos) é de sua responsabilidade. Você declara possuir as autorizações necessárias de titulares e se compromete a tratá-lo conforme a LGPD.</p>

<h2>5. Integrações e Terceiros</h2>
<ul>
  <li><strong>Google</strong>: autenticação, agenda e reuniões (Calendar/Meet); acesso ocorre apenas mediante consentimento/autorização do Usuário.</li>
  <li><strong>Stripe</strong>: processamento de pagamentos/assinaturas (nunca armazenamos integralmente dados sensíveis de cartão).</li>
  <li><strong>OpenAI</strong>: processamento de mensagens/insights da Cora IA.</li>
  <li><strong>Nuvem (AWS/GCP/Railway)</strong>: hospedagem segura da aplicação e dados.</li>
</ul>
<p>Os serviços de terceiros têm seus próprios termos e políticas, que também devem ser observados.</p>

<h2>6. Propriedade Intelectual</h2>
<p>Todo o software, marca, layout, código e conteúdos da Plataforma pertencem ao CorretorLab. É proibido copiar, reproduzir ou criar derivados sem autorização.</p>

<h2>7. Planos, Pagamentos e Renovação</h2>
<p>Planos e preços são apresentados na Plataforma. Assinaturas são geridas via Stripe. Falhas de pagamento podem resultar em suspensão ou limitação de recursos.</p>

<h2>8. Suporte e Disponibilidade</h2>
<p>Empregamos melhores práticas de mercado para disponibilidade e suporte. A Plataforma pode passar por manutenções programadas.</p>

<h2>9. Limitação de Responsabilidade</h2>
<ul>
  <li>Relatórios e insights são de apoio e não substituem análise profissional do Usuário.</li>
  <li>Não respondemos por atos/omissões de terceiros (Google, Stripe, OpenAI, provedores) ou por conteúdo inserido pelo Usuário.</li>
</ul>

<h2>10. Privacidade e Proteção de Dados</h2>
<p>O tratamento de dados pessoais segue a <a href="/legal/privacidade" target="_blank" rel="noopener">Política de Privacidade</a>. O <a href="/legal/dpa" target="_blank" rel="noopener">DPA</a> integra estes Termos quando aplicável (controlador/operador).</p>

<h2>11. Alterações</h2>
<p>Podemos atualizar estes Termos a qualquer tempo. Alterações relevantes serão comunicadas e entrarão em vigor após o prazo informado na notificação.</p>

<h2>12. Lei Aplicável e Foro</h2>
<p>Aplica-se a legislação brasileira, especialmente o Marco Civil da Internet e a LGPD. Foro: Niterói/RJ.</p>

<hr />
<p><small>Ao prosseguir, você declara ter lido e concordado com estes Termos.</small></p>
`;
export default termsHtmlV1;
