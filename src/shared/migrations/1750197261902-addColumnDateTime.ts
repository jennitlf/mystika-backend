import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnDateTime1750197261902 implements MigrationInterface {
    name = 'AddColumnDateTime1750197261902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" ADD "appoinment_datetime" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "appoinment_datetime"`);
    }

}
