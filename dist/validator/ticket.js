"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ticketValidator = (data) => {
    const schema = {
        type: "array",
        items: {
            type: "object",
            required: ['leadId', 'email'],
            properties: {
                leadId: { type: "string" },
                email: { type: "string" },
                assignedTo: { type: "string" }
            },
        }
    };
    var ajv = new ajv_1.default({
        allErrors: true,
        verbose: true
    });
    var validate = ajv.compile(schema);
    var valid = validate(data);
    return { valid, validate };
};
exports.default = ticketValidator;
//# sourceMappingURL=ticket.js.map