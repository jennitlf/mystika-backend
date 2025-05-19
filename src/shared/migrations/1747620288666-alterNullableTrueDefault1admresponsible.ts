/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterNullableTrueDefault1admresponsible1747620288666 implements MigrationInterface {
    name = 'AlterNullableTrueDefault1admresponsible1747620288666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "status" character varying(15) DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "customer_support" DROP CONSTRAINT "FK_a930f96832c2356d71a5527c228"`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "admResponsible" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "admResponsible" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "customer_support" ADD CONSTRAINT "FK_a930f96832c2356d71a5527c228" FOREIGN KEY ("admResponsible") REFERENCES "adm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_support" DROP CONSTRAINT "FK_a930f96832c2356d71a5527c228"`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "admResponsible" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "admResponsible" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_support" ADD CONSTRAINT "FK_a930f96832c2356d71a5527c228" FOREIGN KEY ("admResponsible") REFERENCES "adm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "status" character varying(7) DEFAULT 'pending'`);
    }

}
