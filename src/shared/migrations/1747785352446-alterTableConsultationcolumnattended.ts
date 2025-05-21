import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableConsultationcolumnattended1747785352446 implements MigrationInterface {
    name = 'AlterTableConsultationcolumnattended1747785352446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" ADD "attended" character varying(7) DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "status" SET DEFAULT 'pendente'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "attended"`);
    }

}
