import { ConsultantAuthService } from './consultant-auth.service';
import { CreateConsultantDto } from 'src/shared/dtos/create-consultant.dto';
export declare class ConsultantAuthController {
    private readonly ConsultantAuthService;
    constructor(ConsultantAuthService: ConsultantAuthService);
    register(req: Request, body: CreateConsultantDto): Promise<any>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
