import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnPhoneTableConsultantSupport1748439989504 implements MigrationInterface {
    name = 'AlterColumnPhoneTableConsultantSupport1748439989504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultant_support" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultant_support" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ADD "phone" integer NOT NULL`);
    }

}
