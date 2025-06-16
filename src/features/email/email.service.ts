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
      console.log(
        `[EmailService] Sucesso: Consulta REALIZADA enviada para ${customerEmail}`,
      );
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
      console.log(
        `[EmailService] Sucesso: Consulta CANCELADA (por consultor) enviada para ${customerEmail}`,
      );
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
      console.log(
        `[EmailService] Sucesso: Consulta CANCELADA (por cliente) enviada para consultor ${consultantEmail}`,
      );
    } catch (error) {
      console.error(
        `[EmailService] Erro ao enviar email de status CANCELADA (por cliente) para consultor ${consultantEmail}:`,
        error,
      );
    }
  }
}
