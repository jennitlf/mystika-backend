// src/modules/payment/payment.controller.ts
import { Controller, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { PaymentService } from './payment.service';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentStatus } from 'src/shared/entities/payments.entity';

interface CustomRequest extends Request {
  rawBody?: Buffer;
  body: any;
}



@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @Post('card')
  @UseGuards(createRoleGuard(['user']))
  async processCardPayment(
    @Req() req,
    @Body() body: any
  ) {
    const userId = req.user.id;
    return await this.paymentService.card(userId, body);
  }

  @Post('pix')
  @UseGuards(createRoleGuard(['user']))
  async createPixPayment(
    @Req() req,
    @Body() body: any
  ) {
    const userId = req.user.id;
    return await this.paymentService.pix(userId, body);
  }

  @Post('boleto')
  @UseGuards(createRoleGuard(['user']))
  async createBoletoPayment(
    @Req() req,
    @Body() body: any
  ) {
    const userId = req.user.id;
    return await this.paymentService.boleto(userId, body);
  }

  @Post('webhook')
  async mercadoPagoWebhook(@Req() req: CustomRequest, @Res() res: Response) {
    try {

      if (req.headers['content-type'] !== 'application/json') {
        return res
          .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
          .send('Content-Type must be application/json');
      }

      const rawBodyBuffer = req.rawBody;
      const body = req.body;

      if (!rawBodyBuffer || !body) {
        console.error('Webhook: Corpo da requisição raw ou parseado está vazio ou não disponível.');
        return res.sendStatus(HttpStatus.BAD_REQUEST);
      }

      const signatureHeader = req.headers['x-signature'] as string;
      const x_request_id = req.headers['x-request-id'] as string;
      const id_notificacao = body?.data?.id;

      if (!signatureHeader) {
        console.warn('Webhook: Missing x-signature header');
        return res.status(HttpStatus.BAD_REQUEST).send('Missing signature header');
      }

      const secret = this.configService.get<string>('MERCADO_PAGO_WEBHOOK_SECRET');
      if (!secret) {
        console.error('Erro: Chave secreta do Mercado Pago não configurada.');
        return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const signatureParts = signatureHeader.split(',');
      let receivedSignature = '';
      let timestamp = '';

      for (const part of signatureParts) {
        if (part.startsWith('ts=')) {
          timestamp = part.substring(3);
        } else if (part.startsWith('v1=')) {
          receivedSignature = part.substring(3);
        }
      }

      if (!receivedSignature || !timestamp) {
        console.warn('Webhook: Invalid x-signature format');
        return res.status(HttpStatus.BAD_REQUEST).send('Invalid x-signature format');
      }

      let dataToHash = '';
      if (id_notificacao) {
        dataToHash += `id:${id_notificacao};`;
      }
      if (x_request_id) {
        dataToHash += `request-id:${x_request_id};`;
      }
      if (timestamp) {
        dataToHash += `ts:${timestamp};`;
      }

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(dataToHash)
        .digest('hex');

      if (receivedSignature !== expectedSignature) {
        console.warn('Webhook: Invalid signature');
        return res.status(HttpStatus.UNAUTHORIZED).send('Invalid signature');
      }

      console.log('Webhook: Assinatura validada com sucesso!');

      if (body?.type === 'payment' && body?.data?.id) {
        const paymentId = body.data.id;
        const newStatus = body.data.status;
        const statusUpdatedAt = body.data.date_last_updated ? new Date(body.data.date_last_updated) : new Date();

        const mappedStatus = this.mapMercadoPagoStatus(newStatus);

        await this.paymentService.updateStatusPayment(
          paymentId,
          mappedStatus,
          statusUpdatedAt,
        );
        console.log(`Pagamento ID ${paymentId} atualizado para status: ${newStatus}`);
      } else if (body?.type === 'application_mp' && body?.action === 'test_alert') {
        console.log('Webhook de teste do Mercado Pago recebido:', body);
      } else {
        console.log('Tipo de webhook não esperado ou sem ID no body:', body);
      }

      return res.sendStatus(HttpStatus.OK);
    } catch (error) {
      console.error('Erro no webhook do Mercado Pago:', error);
      if (error instanceof Error && error.message.includes('signature')) {
        return res.status(HttpStatus.UNAUTHORIZED).send(error.message);
      }
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private mapMercadoPagoStatus(mpStatus: string): PaymentStatus {
    switch (mpStatus) {
      case 'pending':
        return PaymentStatus.PENDING;
      case 'approved':
        return PaymentStatus.APPROVED;
      case 'in_process':
        return PaymentStatus.IN_PROCESS;
      case 'rejected':
        return PaymentStatus.REJECTED;
      case 'cancelled':
        return PaymentStatus.CANCELED;
      case 'refunded':
        return PaymentStatus.REFUNDED;
      case 'charged_back':
        return PaymentStatus.CHARGEBACK;
      case 'authorized':
        return PaymentStatus.authorized;
      default:
        console.warn(`Status do Mercado Pago desconhecido: ${mpStatus}. Mapeando para 'OTHER'.`);
        return PaymentStatus.OTHER;
    }
  }
}