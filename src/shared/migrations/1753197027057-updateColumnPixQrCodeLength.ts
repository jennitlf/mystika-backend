import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnPixQrCodeLength1753197027057 implements MigrationInterface {
    name = 'UpdateColumnPixQrCodeLength1753197027057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "pix_qr_code_url"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "pix_qr_code_url" character varying(5000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "pix_qr_code_url"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "pix_qr_code_url" character varying(500)`);
    }

}
