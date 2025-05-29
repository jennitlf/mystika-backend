"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterTableConsultationcolumnattended1747785352446 = void 0;
class AlterTableConsultationcolumnattended1747785352446 {
    constructor() {
        this.name = 'AlterTableConsultationcolumnattended1747785352446';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "consultation" ADD "attended" character varying(7) DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "status" SET DEFAULT 'pendente'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "customer_support" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "attended"`);
    }
}
exports.AlterTableConsultationcolumnattended1747785352446 = AlterTableConsultationcolumnattended1747785352446;
//# sourceMappingURL=1747785352446-alterTableConsultationcolumnattended.js.map