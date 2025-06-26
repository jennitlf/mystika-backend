import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableschConsulExcepConsultaation1750882300981 implements MigrationInterface {
    name = 'AlterTableschConsulExcepConsultaation1750882300981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_exception" RENAME COLUMN "day_week" TO "unavailable_date_time"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "appoinment_date_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "schedule_exception" DROP COLUMN "unavailable_date_time"`);
        await queryRunner.query(`ALTER TABLE "schedule_exception" ADD "unavailable_date_time" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_exception" DROP COLUMN "unavailable_date_time"`);
        await queryRunner.query(`ALTER TABLE "schedule_exception" ADD "unavailable_date_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "appoinment_date_time"`);
        await queryRunner.query(`ALTER TABLE "schedule_exception" RENAME COLUMN "unavailable_date_time" TO "day_week"`);
    }

}
