"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterColumnPhoneTableConsultantSupport1748439989504 = void 0;
class AlterColumnPhoneTableConsultantSupport1748439989504 {
    constructor() {
        this.name = 'AlterColumnPhoneTableConsultantSupport1748439989504';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "consultant_support" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ADD "phone" character varying NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "consultant_support" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "consultant_support" ADD "phone" integer NOT NULL`);
    }
}
exports.AlterColumnPhoneTableConsultantSupport1748439989504 = AlterColumnPhoneTableConsultantSupport1748439989504;
//# sourceMappingURL=1748439989504-alterColumnPhoneTableConsultantSupport.js.map