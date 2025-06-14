import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateConsultationLength91749927539776 implements MigrationInterface {
    name = 'UpdateConsultationLength91749927539776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "attended"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "attended" character varying(9) DEFAULT 'pendente'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "attended"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "attended" character varying(7) DEFAULT 'pendente'`);
    }

}
