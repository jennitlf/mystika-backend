import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateConsultationDefaultPendente1749927251007 implements MigrationInterface {
    name = 'UpdateConsultationDefaultPendente1749927251007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" ALTER COLUMN "attended" SET DEFAULT 'pendente'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" ALTER COLUMN "attended" SET DEFAULT 'pending'`);
    }

}
