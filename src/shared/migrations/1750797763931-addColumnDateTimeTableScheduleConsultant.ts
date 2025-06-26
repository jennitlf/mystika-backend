import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnDateTimeTableScheduleConsultant1750797763931 implements MigrationInterface {
    name = 'AddColumnDateTimeTableScheduleConsultant1750797763931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_consultant" ADD "date_time_initial" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedule_consultant" ADD "date_time_end" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_consultant" DROP COLUMN "date_time_end"`);
        await queryRunner.query(`ALTER TABLE "schedule_consultant" DROP COLUMN "date_time_initial"`);
    }

}
