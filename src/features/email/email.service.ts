import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'email@gmail.com',
        pass: 'senha',
      },
    });
  }

  async sendConsultationStatusUpdate(
    customerEmail: string,
    customerName: string,
    consultantName: string,
    appointmentDate: string,
    appointmentTime: string,
    oldStatus: string,
    newStatus: string,
  ) {
    const subject = `Atualização do Status da Sua Consulta - ID: ${customerName}`;
    const htmlContent = `
      <p>Olá, ${customerName}!</p>
      <p>Gostaríamos de informar que o status da sua consulta foi atualizado.</p>
      <ul>
        <li><strong>Consultor(a):</strong> ${consultantName}</li>
        <li><strong>Data:</strong> ${appointmentDate}</li>
        <li><strong>Hora:</strong> ${appointmentTime}</li>
        <li><strong>Status Anterior:</strong> ${oldStatus}</li>
        <li><strong>Novo Status:</strong> <strong>${newStatus}</strong></li>
      </ul>
      <p>Se tiver alguma dúvida, entre em contato.</p>
      <p>Atenciosamente,<br>Sua Equipe de Consultas</p>
    `;

    try {
      await this.transporter.sendMail({
        from: '"Mystika Esoterismo" <email@gmail.com>',
        to: customerEmail,
        subject: subject,
        html: htmlContent,
      });
      console.log(`Email de status enviado para ${customerEmail}`);
    } catch (error) {
      console.error(`Erro ao enviar email para ${customerEmail}:`, error);
    }
  }
}