import { ConfigService } from '@nestjs/config';
export declare class DateUtilsService {
    private readonly configService;
    constructor(configService: ConfigService);
    getZonedDate(date?: Date): Date;
}
