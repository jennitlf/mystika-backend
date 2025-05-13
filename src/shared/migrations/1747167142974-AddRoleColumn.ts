import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleColumn1747167142974 implements MigrationInterface {
    name = 'AddRoleColumn1747167142974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE consultant
            ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'consultant';
        `);
        await queryRunner.query(`
            ALTER TABLE customer
            ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'customer';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE consultant
            DROP COLUMN role;
        `);
        await queryRunner.query(`
            ALTER TABLE customer
            DROP COLUMN role;
        `);
    }

}
