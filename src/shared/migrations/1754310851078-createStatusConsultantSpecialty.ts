import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStatusConsultantSpecialty1754310851078 implements MigrationInterface {
    name = 'CreateStatusConsultantSpecialty1754310851078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultant_specialty" ADD "status" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultant_specialty" DROP COLUMN "status"`);
    }

}
