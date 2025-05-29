"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterNullableTrueDefault1admresponsible1747620288666 = void 0;
class AlterNullableTrueDefault1admresponsible1747620288666 {
    constructor() {
        this.name = 'AlterNullableTrueDefault1admresponsible1747620288666';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "status" character varying(15) DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "customer_support" DROP CONSTRAINT "FK_a930f96832c2356d71a5527c228"`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "admResponsible" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "admResponsible" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "customer_support" ADD CONSTRAINT "FK_a930f96832c2356d71a5527c228" FOREIGN KEY ("admResponsible") REFERENCES "adm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "customer_support" DROP CONSTRAINT "FK_a930f96832c2356d71a5527c228"`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "admResponsible" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "admResponsible" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_support" ADD CONSTRAINT "FK_a930f96832c2356d71a5527c228" FOREIGN KEY ("admResponsible") REFERENCES "adm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "status" character varying(7) DEFAULT 'pending'`);
    }
}
exports.AlterNullableTrueDefault1admresponsible1747620288666 = AlterNullableTrueDefault1admresponsible1747620288666;
//# sourceMappingURL=1747620288666-alterNullableTrueDefault1admresponsible.js.map