import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleColumn1747167142974 implements MigrationInterface {
    name = 'AddRoleColumn1747167142974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE consultants
            ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'consultant';
        `);
        await queryRunner.query(`
            ALTER TABLE customers
            ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'customer';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE consultants
            DROP COLUMN role;
        `);
        await queryRunner.query(`
            ALTER TABLE customers
            DROP COLUMN role;
        `);
    }

}
