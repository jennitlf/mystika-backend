import { MigrationInterface, QueryRunner } from "typeorm";

export class DropColumnDayWeekTableScheduleConsultant1748620716480 implements MigrationInterface {
    name = 'DropColumnDayWeekTableScheduleConsultant1748620716480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_consultant" DROP COLUMN "day_week"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" DROP CONSTRAINT "FK_1ca6a5329c23d7d4e209797cb8a"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ALTER COLUMN "status" SET DEFAULT 'pendente'`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ALTER COLUMN "admResponsible" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ADD CONSTRAINT "FK_1ca6a5329c23d7d4e209797cb8a" FOREIGN KEY ("admResponsible") REFERENCES "adm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultant_support" DROP CONSTRAINT "FK_1ca6a5329c23d7d4e209797cb8a"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ALTER COLUMN "admResponsible" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ADD CONSTRAINT "FK_1ca6a5329c23d7d4e209797cb8a" FOREIGN KEY ("admResponsible") REFERENCES "adm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_consultant" ADD "day_week" integer NOT NULL`);
    }

}
