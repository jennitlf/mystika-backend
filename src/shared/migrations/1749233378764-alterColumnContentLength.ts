import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnContentLength1749233378764 implements MigrationInterface {
    name = 'AlterColumnContentLength1749233378764'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "content" DROP NOT NULL`);

        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "content" TYPE character varying(600)`);

        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "content" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "content" DROP NOT NULL`);

        
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "content" TYPE character varying(300)`);

       
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "content" SET NOT NULL`);
    }
}
