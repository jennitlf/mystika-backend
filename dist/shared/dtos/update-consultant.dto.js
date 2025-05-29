"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConsultantDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_consultant_dto_1 = require("./create-consultant.dto");
class UpdateConsultantDto extends (0, mapped_types_1.PartialType)(create_consultant_dto_1.CreateConsultantDto) {
}
exports.UpdateConsultantDto = UpdateConsultantDto;
//# sourceMappingURL=update-consultant.dto.js.map