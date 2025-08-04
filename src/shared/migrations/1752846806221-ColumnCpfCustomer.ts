import { MigrationInterface, QueryRunner } from "typeorm";

export class ColumnCpfCustomer1752846806221 implements MigrationInterface {
    name = 'ColumnCpfCustomer1752846806221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "cpf" character varying(11) NOT NULL DEFAULT 'NaN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "cpf"`);
    }

}
