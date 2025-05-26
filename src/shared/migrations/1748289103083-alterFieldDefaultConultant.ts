import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFieldDefaultConultant1748289103083 implements MigrationInterface {
    name = 'AlterFieldDefaultConultant1748289103083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultant" ALTER COLUMN "image_consultant" SET DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultant" ALTER COLUMN "image_consultant" SET DEFAULT 'NaN'`);
    }

}
