"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSITIONS = exports.STAGE = exports.STATUS = void 0;
const STATUS = {
    OPEN: "OPEN",
    CLOSED: "CLOSED"
};
exports.STATUS = STATUS;
const STAGE = {
    CALL: "CALL",
    INTERACTION: "INTERACTION",
    DOCUMENTING: "DOCUMENTING"
};
exports.STAGE = STAGE;
const TRANSITIONS = {
    CREATED: "CREATED",
    INTERACTION: "INTERACTION",
    DOCUMENTING: "DOCUMENTING",
    FAILED: "FAILED",
    SUBMISSION: "SUBMISSION"
};
exports.TRANSITIONS = TRANSITIONS;
//# sourceMappingURL=leadMetadata.js.map