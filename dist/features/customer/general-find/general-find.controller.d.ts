import { GeneralFindService } from './general-find.service';
export declare class GeneralFindController {
    private readonly generalFindService;
    constructor(generalFindService: GeneralFindService);
    generalConsultantData(page?: number, limit?: number, name?: string, specialties?: string[], minValue?: number, maxValue?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            lastPage: number;
        };
    }>;
}
