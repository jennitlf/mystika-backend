import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      timeout: 25000,
    } as any);
  }
  /**
   * boas-vindas para usuario
   */
  async sendWelcomeEmailToUser(userEmail: string, userName: string) {
    const subject = `✨ Bem-vindo(a) à Mystika Esoterismo, ${userName}! ✨`;
    const htmlContent = `
      <p>Olá, <strong>${userName}</strong>!</p>
      <p>É com grande alegria que a equipe Mystika Esoterismo lhe dá as boas-vindas ao nosso portal de conhecimento e autoconhecimento.</p>
      <p>Aqui você encontrará um universo de sabedoria ancestral, com especialistas prontos para guiar sua jornada através de consultas esotéricas, leituras de oráculos e muito mais.</p>
      <p>Estamos entusiasmados para fazer parte da sua busca por clareza e bem-estar. Sinta-se à vontade para explorar nossa plataforma e descobrir o que o mundo esotérico tem a oferecer.</p>
      <p>Se tiver alguma dúvida, nossa equipe de suporte está sempre à disposição para ajudar.</p>
      <p>Com Luz e Carinho,</p>
      <p>Equipe Mystika Esoterismo</p>
      <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar email de boas-vindas para o usuário ${userEmail}:`,
        error,
      );
    }
  }

  /**
   * boas-vindas e instruções o consultor
   */
  async sendWelcomeEmailToConsultant(
    consultantEmail: string,
    consultantName: string,
    loginUrl: string = 'https://mystikaesoterismo.netlify.app/consultor/login',
    specialtiesUrl: string = 'https://mystikaesoterismo.netlify.app/consultor/especialidades',
    paymentPlansUrl: string = 'https://mystikaesoterismo.netlify.app/consultor/financeiro',
    schechuleConsultant: string = 'https://mystikaesoterismo.netlify.app/consultor/agenda'
  ) {
    const subject = `🌟 Bem-vindo(a) à Família Mystika Esoterismo, ${consultantName}! 🌟`;
    const htmlContent = `
      <p>Olá, <strong>${consultantName}</strong>!</p>
      <p>Seja muito bem-vindo(a) à comunidade Mystika Esoterismo! Estamos honrados em ter você como um de nossos consultores.</p>
      <p>Sua sabedoria e experiência são valiosas e temos certeza de que muitos buscarão sua orientação.</p>
      <p>Para começar a atender e aparecer em nossa página principal, por favor, siga estes passos importantes:</p>
      <ol>
        <li><strong>Acesse sua Conta:</strong> Faça login na plataforma com seu e-mail e senha cadastrados: <a href="${loginUrl}">${loginUrl}</a></li>
        <li><strong>Cadastre Suas Especialidades:</strong> É crucial que você adicione e configure suas especialidades para que os usuários possam encontrá-lo(a) facilmente: <a href="${specialtiesUrl}">Gerenciar Especialidades</a></li>
        <li><strong>Verifique Seus Planos de Pagamento:</strong> Certifique-se de que seu plano de pagamento está ativo: <a href="${paymentPlansUrl}">Verificar Planos</a></li>
      </ol>
      <p>Assim que suas especialidades estiverem cadastradas e seu plano ativo, seu perfil será disponibilizado nossa home.</p> 
      <p>Após esses passos, não se esqueça de acessar sua agenda: <a href="${schechuleConsultant}">${schechuleConsultant}</a> e cadastrar seus horários de atendimento.</p>
      <p>Se precisar de qualquer suporte ou tiver dúvidas sobre o processo, nossa equipe está pronta para ajudar. Conte conosco para brilhar e compartilhar sua luz!</p>
      <p>Com Gratidão e Sucesso,</p>
      <p>Equipe Mystika Esoterismo</p>
      <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
        to: consultantEmail,
        subject: subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar email de boas-vindas para o consultor ${consultantEmail}:`,
        error,
      );
    }
  }
  /**
 * boas-vindas para novo administrador
 */
async sendWelcomeEmailToAdmin(adminEmail: string, adminName: string) {
  const subject = `🌟 Bem-vindo(a) ao Painel Administrativo da Mystika Esoterismo, ${adminName}! 🌟`;
  const htmlContent = `
    <p>Olá, <strong>${adminName}</strong>!</p>
    <p>É com muita satisfação que lhe damos as boas-vindas ao time de administradores da Mystika Esoterismo.</p>
    <p>Agora você faz parte de uma equipe dedicada a oferecer suporte e organização aos nossos serviços esotéricos, ajudando a promover uma experiência enriquecedora para os nossos usuários e especialistas.</p>
    <p>Acesse o painel administrativo para começar a gerenciar os recursos disponíveis:</p>
    <p><a href="${process.env.ADMIN_PANEL_URL}" style="color: #ffffff; background-color: #5A67D8; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Acessar o Painel Administrativo</a></p>
    <p>Certifique-se de manter suas credenciais seguras e entre em contato com o suporte caso necessite de qualquer assistência.</p>
    <p>Estamos animados para trabalhar com você nessa jornada!</p>
    <p>Com Luz e Carinho,</p>
    <p>Equipe Mystika Esoterismo</p>
    <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
  `;

  try {
    await this.transporter.sendMail({
      from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error(
      `[EmailService] Erro ao enviar email de boas-vindas para o administrador ${adminEmail}:`,
      error,
    );
  }
}
  // --- MÉTODOS PARA O CLIENTE ---
  /**
   * Envia um e-mail ao consultor informando sobre uma NOVA CONSULTA AGENDADA
   */
  async sendNewConsultationScheduledToConsultant(
    consultantEmail: string,
    consultantName: string,
    customerName: string,
    nameSpecialty: string,
    appointmentDate: string,
    appointmentTime: string,
  ) {
    const subject = `🎉 Nova Consulta Agendada! - ${nameSpecialty}`;
    const htmlContent = `
      <p>Prezado(a) <strong>${consultantName}</strong>,</p>
      <p>Temos uma excelente notícia! Uma nova consulta de <strong>${nameSpecialty}</strong> foi agendada em sua agenda.</p>
      <ul>
        <li><strong>Cliente:</strong> ${customerName}</li>
        <li><strong>Data:</strong> ${appointmentDate}</li>
        <li><strong>Hora:</strong> ${appointmentTime}</li>
      </ul>
      <p>Por favor, verifique sua agenda para confirmar os detalhes.</p>
      <p>Desejamos uma ótima consulta!</p>
      <p>Atenciosamente,</p>
      <p>Equipe Mystika Esoterismo</p>
      <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
        to: consultantEmail,
        subject: subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar email de nova consulta agendada para consultor ${consultantEmail}:`,
        error,
      );
    }
  }
  /**
   * Envia um e-mail ao cliente informando que a consulta foi MARCADA COMO REALIZADA
   * (Usado quando o consultor atualiza o status)
   */
  async sendConsultationCompletedToCustomer(
    customerEmail: string,
    customerName: string,
    consultantName: string,
    nameSpecialty: string,
    appointmentDate: string,
    appointmentTime: string,
  ) {
    const subject = `✨ Sua Consulta de ${nameSpecialty} Foi Realizada com Sucesso! ✨`;
    const htmlContent = `
      <p>Olá, <strong>${customerName}</strong>!</p>
      <p>Temos uma ótima notícia! Sua consulta de <strong>${nameSpecialty}</strong> com <strong>${consultantName}</strong>, agendada para <strong>${appointmentDate} às ${appointmentTime}</strong>, foi oficialmente marcada como <strong>REALIZADA</strong>.</p>
      <p>Esperamos que tenha sido uma experiência enriquecedora e que tenha encontrado as respostas e orientações que buscava.</p>
      <p>Ficamos muito felizes em poder ajudar na sua jornada. Se precisar de algo mais ou desejar agendar uma nova consulta, estamos à disposição!</p>
      <p>Com carinho,</p>
      <p>Equipe Mystika Esoterismo</p>
      <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar email de status REALIZADA para ${customerEmail}:`,
        error,
      );
    }
  }

  /**
   * Envia um e-mail ao cliente informando que a consulta foi CANCELADA PELO CONSULTOR
   * (Usado quando o consultor atualiza o status para 'cancelada')
   */
  async sendConsultationCanceledByConsultantToCustomer(
    customerEmail: string,
    customerName: string,
    consultantName: string,
    nameSpecialty: string,
    appointmentDate: string,
    appointmentTime: string,
  ) {
    const subject = `⚠️ Aviso Importante: Sua Consulta de ${nameSpecialty} Foi Cancelada`;
    const htmlContent = `
      <p>Olá, <strong>${customerName}</strong>!</p>
      <p>Lamentamos informar que sua consulta de <strong>${nameSpecialty}</strong> com <strong>${consultantName}</strong>, agendada para <strong>${appointmentDate} às ${appointmentTime}</strong>, foi <strong>CANCELADA</strong>.</p>
      <p>Pedimos desculpas por qualquer inconveniente que isso possa causar. Entendemos que imprevistos acontecem e estamos aqui para ajudar.</p>
      <p>Você pode reagendar uma nova consulta a qualquer momento em nossa plataforma ou entrar em contato com nosso suporte caso tenha dúvidas.</p>
      <p>Agradecemos a sua compreensão e esperamos vê-lo(a) em breve!</p>
      <p>Atenciosamente,</p>
      <p>Equipe Mystika Esoterismo</p>
      <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar email de status CANCELADA (por consultor) para ${customerEmail}:`,
        error,
      );
    }
  }

  // --- MÉTODO PARA O CONSULTOR ---

  /**
   * Envia um e-mail ao consultor informando que a consulta foi CANCELADA PELO CLIENTE
   * (Usado quando o cliente cancela a consulta)
   */
  async sendConsultationCanceledByCustomerToConsultant(
    consultantEmail: string,
    consultantName: string,
    customerName: string,
    nameSpecialty: string,
    appointmentDate: string,
    appointmentTime: string,
  ) {
    const subject = `🔔 Aviso: Consulta Cancelada por Cliente - ${nameSpecialty}`;
    const htmlContent = `
      <p>Prezado(a) <strong>${consultantName}</strong>,</p>
      <p>Gostaríamos de informar que a consulta de <strong>${nameSpecialty}</strong>, agendada com <strong>${customerName}</strong> para <strong>${appointmentDate} às ${appointmentTime}</strong>, foi <strong>CANCELADA pelo cliente</strong>.</p>
      <p>Esta vaga já foi liberada em sua agenda. Fique atento(a) a novas oportunidades de agendamento.</p>
      <p>Em caso de dúvidas, entre em contato com nossa equipe de suporte.</p>
      <p>Atenciosamente,</p>
      <p>Equipe Mystika Esoterismo</p>
      <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
        to: consultantEmail,
        subject: subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar email de status CANCELADA (por cliente) para consultor ${consultantEmail}:`,
        error,
      );
    }
  }
  // --- MÉTODO PARA O adm ---
  /**
 * notificação de consulta marcada como realizada
 */
  async sendConsultationCompletedEmail(consultantEmail: string, consultantName: string, consultationId: number) {
    const subject = `✅ Consulta Realizada com Sucesso!`;
    const htmlContent = `
      <p>Olá, <strong>${consultantName}</strong>,</p>
      <p>Estamos felizes em informar que a consulta de ID <strong>${consultationId}</strong> foi marcada como <strong>Realizada</strong> pela administração do sistema.</p>
      <p>Obrigado por fornecer seus serviços e por contribuir para o sucesso do nosso portal de consultas esotéricas.</p>
      <p>Se precisar de assistência ou tiver alguma dúvida, sinta-se à vontade para entrar em contato com nosso suporte.</p>
      <p>Agradecemos pela sua dedicação e estamos à disposição para o que precisar.</p>
      <p>Com Luz e Carinho,</p>
      <p>Equipe Mystika Esoterismo</p>
      <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
        to: consultantEmail,
        subject: subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar notificação de consulta realizada para ${consultantEmail}:`,
        error,
      );
    }
  }
  /**
 * notificação de consulta cancelada por inconsistência
 */
  async sendConsultationCancelledEmail(consultantEmail: string, consultantName: string, consultationId: number) {
    const subject = `⚠️ Consulta Cancelada: Inconsistência Detectada`;
    const htmlContent = `
      <p>Olá, <strong>${consultantName}</strong>,</p>
      <p>Informamos que a consulta de ID <strong>${consultationId}</strong> foi cancelada devido a uma inconsistência identificada.</p>
      <p>Se você acredita que houve um engano ou deseja mais informações sobre o motivo do cancelamento, por favor, entre em contato com o suporte através do nosso site:</p>
      <p>Agradecemos pela sua compreensão e estamos à disposição para ajudar.</p>
      <p>Com Luz e Carinho,</p>
      <p>Equipe Mystika Esoterismo</p>
      <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Mystika Esoterismo" <${process.env.EMAIL_USER}>`,
        to: consultantEmail,
        subject: subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar notificação de consulta cancelada para ${consultantEmail}:`,
        error,
      );
    }
  }
}
