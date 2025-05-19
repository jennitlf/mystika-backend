import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class DecodeTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido ou inválido');
    }
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      (req as RequestWithUser).user = decoded;
      next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error('Erro ao verificar o token:', err.message);
      throw new UnauthorizedException('Token invalido ou expirado');
    }
  }
}
