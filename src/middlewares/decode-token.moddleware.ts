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
    } catch (err) {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
  }
}
