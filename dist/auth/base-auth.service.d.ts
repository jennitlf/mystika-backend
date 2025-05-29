import { JwtService } from '@nestjs/jwt';
export declare abstract class BaseAuthService<T> {
    protected readonly jwtService: JwtService;
    protected readonly service: T;
    constructor(jwtService: JwtService, service: T);
    register(createDto: any): Promise<any>;
    private validateEmail;
    private validateCpf;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
