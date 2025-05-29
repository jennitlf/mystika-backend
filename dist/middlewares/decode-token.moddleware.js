"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodeTokenMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let DecodeTokenMiddleware = class DecodeTokenMiddleware {
    use(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Token não fornecido ou inválido');
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch (err) {
            console.error('Erro ao verificar o token:', err.message);
            throw new common_1.UnauthorizedException('Token invalido ou expirado');
        }
    }
};
exports.DecodeTokenMiddleware = DecodeTokenMiddleware;
exports.DecodeTokenMiddleware = DecodeTokenMiddleware = __decorate([
    (0, common_1.Injectable)()
], DecodeTokenMiddleware);
//# sourceMappingURL=decode-token.moddleware.js.map