// src/middlewares/raw-body.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

// Estender a interface Request para incluir 'rawBody'
interface CustomRequest extends Request {
  rawBody?: Buffer;
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    // Para depuração
    console.log('RawBodyMiddleware activated');

    // Cria e executa o parser JSON do body-parser com a função 'verify'.
    // Esta função será executada ANTES que o JSON seja parseado para req.body.
    bodyParser.json({
      limit: '10mb', // Use o mesmo limite que você deseja
      verify: (req: CustomRequest, res: Response, buf: Buffer, encoding: string) => {
        // Salva o buffer original no req.rawBody
        if (buf && buf.length) {
          req.rawBody = buf;
        }
      },
    })(req, res, next);
  }
}