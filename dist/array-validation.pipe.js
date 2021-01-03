"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
exports.ArrayValidationPipe = lodash_1.memoize(createArrayValidationPipe);
function createArrayValidationPipe(itemType) {
    class MixinArrayValidationPipe extends common_1.ValidationPipe {
        transform(values, metadata) {
            if (!Array.isArray(values)) {
                return values;
            }
            return Promise.all(values.map(value => super.transform(value, Object.assign(Object.assign({}, metadata), { metatype: itemType }))));
        }
    }
    return common_1.mixin(MixinArrayValidationPipe);
}
//# sourceMappingURL=array-validation.pipe.js.map