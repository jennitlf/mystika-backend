"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterTableConsultantSupport1748440310158 = void 0;
class AlterTableConsultantSupport1748440310158 {
    constructor() {
        this.name = 'AlterTableConsultantSupport1748440310158';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "consultant_support" DROP CONSTRAINT "FK_1ca6a5329c23d7d4e209797cb8a"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ALTER COLUMN "status" SET DEFAULT 'pendente'`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ALTER COLUMN "admResponsible" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ADD CONSTRAINT "FK_1ca6a5329c23d7d4e209797cb8a" FOREIGN KEY ("admResponsible") REFERENCES "adm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "consultant_support" DROP CONSTRAINT "FK_1ca6a5329c23d7d4e209797cb8a"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ALTER COLUMN "admResponsible" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ADD CONSTRAINT "FK_1ca6a5329c23d7d4e209797cb8a" FOREIGN KEY ("admResponsible") REFERENCES "adm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.AlterTableConsultantSupport1748440310158 = AlterTableConsultantSupport1748440310158;
//# sourceMappingURL=1748440310158-alterTableConsultantSupport.js.map