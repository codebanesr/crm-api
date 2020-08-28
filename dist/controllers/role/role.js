"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsArray = exports.getAllPermissions = exports.addPermission = exports.deleteOne = exports.patch = exports.findOneById = exports.insertOne = exports.createOrUpdate = exports.findAll = void 0;
const Role_1 = __importDefault(require("../../models/Role"));
const permission_1 = __importDefault(require("../../models/permission"));
exports.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield Role_1.default.aggregate([
        { $match: {} },
        { $project: { value: 1, permissions: 1, label: 1 } }
    ]);
    res.status(200).json(roles);
});
exports.createOrUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body.role, { _id } = _a, others = __rest(_a, ["_id"]);
    const result = yield Role_1.default.updateOne({ value: others.value }, others, { upsert: true }).lean().exec();
    return res.status(200).send(result);
});
exports.insertOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const role = new Role_1.default(body);
    const result = yield role.save();
    return res.status(200).send(result);
});
exports.findOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.leadId;
    const lead = yield Role_1.default.findById(id);
    res.status(200).send(lead);
});
exports.patch = (req, res) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Role_1.default.update({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
        res.status(200).json({
            message: "Lead updated",
            request: {
                type: "GET",
                url: "http://localhost:3000/lead/" + id
            }
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.deleteOne = (req, res) => {
    const id = req.params.productId;
    Role_1.default.remove({ _id: id })
        .exec()
        .then((result) => {
        res.status(200).json({
            message: "Lead deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/lead",
                body: { name: "String", price: "Number" }
            }
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.addPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { permission } = req.body;
    console.log(permission);
    const result = yield permission_1.default.create(permission);
    return res.status(200).send(result);
});
exports.getAllPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield permission_1.default.find({}).lean().exec();
    return res.status(200).send(response);
});
exports.getPermissionsArray = (roleType) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(roleType);
    const result = yield Role_1.default.findOne({ value: roleType }, { permissions: 1 }).lean().exec();
    const permissions = result.permissions.map((permission) => permission.value);
    return permissions;
});
//# sourceMappingURL=role.js.map