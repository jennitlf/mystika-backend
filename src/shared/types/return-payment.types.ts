export interface returnCard {
    id: number;
    status: string;
    status_detail: string;
    payer_email: string;
}

export interface returnPix {
    id: number;
    qr_code: string;
    qr_code_base64: string;
}

export interface returnBoleto {
    id: number;
    boleto_url: string;
    status: string;
    status_detail: string;
    payer_email: string;
}