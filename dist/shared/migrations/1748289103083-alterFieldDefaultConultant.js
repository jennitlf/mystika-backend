"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterFieldDefaultConultant1748289103083 = void 0;
class AlterFieldDefaultConultant1748289103083 {
    constructor() {
        this.name = 'AlterFieldDefaultConultant1748289103083';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "consultant" ALTER COLUMN "image_consultant" SET DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "consultant" ALTER COLUMN "image_consultant" SET DEFAULT 'NaN'`);
    }
}
exports.AlterFieldDefaultConultant1748289103083 = AlterFieldDefaultConultant1748289103083;
//# sourceMappingURL=1748289103083-alterFieldDefaultConultant.js.map