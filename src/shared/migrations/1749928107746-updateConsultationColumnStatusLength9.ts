import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateConsultationColumnStatusLength91749928107746 implements MigrationInterface {
    name = 'UpdateConsultationColumnStatusLength91749928107746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" ALTER COLUMN "status" SET DEFAULT 'pendente'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    }

}
