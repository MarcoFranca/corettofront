// Coloque o TEXTO INTEGRAL do DPA (v1.0) em HTML.
// Use os capítulos e cláusulas que preparamos na minuta.

const dpaHtmlV1 = `
<h1>Data Processing Addendum (DPA) – CorretorLab CRM</h1>
<p><strong>Última atualização:</strong> 09/08/2025</p>

<h2>1. Partes e Papéis</h2>
<p>Este DPA integra os Termos de Uso. O “Cliente” pode atuar como <strong>Controlador</strong> de dados de seus próprios clientes/lead/titulares, e o CorretorLab atuará como <strong>Operador</strong> no tratamento realizado em nome do Cliente. Em certas hipóteses, o CorretorLab poderá ser <strong>Controlador</strong> (ex.: dados de conta, cobrança, segurança).</p>

<h2>2. Descrição do Tratamento</h2>
<ul>
  <li><strong>Natureza:</strong> coleta, registro, organização, armazenamento, consulta, uso e eliminação.</li>
  <li><strong>Finalidade:</strong> execução dos serviços da Plataforma, conforme instruções do Cliente e funcionalidades contratadas.</li>
  <li><strong>Tipos de dados:</strong> dados cadastrais, contato, dados comerciais (apólices, reuniões, documentos) e demais inseridos pelo Cliente.</li>
  <li><strong>Titulares:</strong> clientes, leads, parceiros e usuários finais do Cliente.</li>
</ul>

<h2>3. Instruções e Conformidade</h2>
<p>O CorretorLab tratará dados somente conforme instruções documentadas do Cliente, a legislação aplicável e este DPA. O Cliente declara possuir base legal adequada para inserir dados na Plataforma.</p>

<h2>4. Suboperadores</h2>
<p>O Cliente autoriza o uso de suboperadores estritamente necessários: Google (agenda/reuniões), Stripe (pagamentos), OpenAI (IA), provedores de nuvem (AWS/GCP/Railway) e outros equivalentes. Manteremos lista atualizável mediante solicitação.</p>

<h2>5. Segurança</h2>
<p>Medidas técnicas e organizacionais: criptografia, controle de acesso, backups, monitoramento e auditoria.</p>

<h2>6. Incidentes de Segurança</h2>
<p>Notificaremos o Cliente sobre incidentes relevantes com dados pessoais dos quais tomarmos ciência, indicando medidas adotadas e, quando aplicável, orientações para mitigação.</p>

<h2>7. Direitos dos Titulares</h2>
<p>Prestaremos suporte razoável para que o Cliente atenda solicitações dos titulares (acesso, correção, eliminação, portabilidade etc.).</p>

<h2>8. Transferências Internacionais</h2>
<p>Poderão ocorrer para países com proteção adequada ou com salvaguardas contratuais compatíveis com a LGPD.</p>

<h2>9. Retorno/Eliminação</h2>
<p>Ao término do contrato ou mediante solicitação do Cliente, eliminaremos os dados pessoais tratados como Operador, salvo retenção exigida por lei ou legítimo interesse devidamente justificado (p. ex. logs de segurança/antifraude).</p>

<h2>10. Auditoria</h2>
<p>Disponibilizaremos informações razoáveis sobre nossas práticas de segurança/privacidade. Auditorias formais devem ser previamente acordadas quanto a escopo, confidencialidade e custos.</p>

<h2>11. Responsabilidade</h2>
<p>Cada parte responde por sua própria conformidade com a LGPD e por danos decorrentes de descumprimento comprovado de suas obrigações neste DPA.</p>

<hr />
<p><small>Este DPA passa a vigorar com a aceitação dos Termos de Uso.</small></p>
`;
export default dpaHtmlV1;
