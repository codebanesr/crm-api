"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const request_ip_1 = require("request-ip");
const Cryptr = require("cryptr");
let AuthService = class AuthService {
    constructor(userModel, refreshTokenModel, roleModel) {
        this.userModel = userModel;
        this.refreshTokenModel = refreshTokenModel;
        this.roleModel = roleModel;
        this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    }
    createAccessToken(userId, singleLoginKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.sign({ userId, singleLoginKey }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            return this.encryptText(accessToken);
        });
    }
    createRefreshToken(req, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = new this.refreshTokenModel({
                userId,
                refreshToken: uuid_1.v4(),
                ip: this.getIp(req),
                browser: this.getBrowserInfo(req),
                country: this.getCountry(req),
            });
            yield refreshToken.save();
            return refreshToken.refreshToken;
        });
    }
    findRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield this.refreshTokenModel.findOne({ refreshToken: token });
            if (!refreshToken) {
                throw new common_1.UnauthorizedException('User has been logged out.');
            }
            return refreshToken.userId;
        });
    }
    validateUser(jwtPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({
                _id: jwtPayload.userId,
                singleLoginKey: jwtPayload.singleLoginKey,
                verified: true
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found.');
            }
            return user;
        });
    }
    jwtExtractor(request) {
        let token = null;
        if (request.header('x-token')) {
            token = request.get('x-token');
        }
        else if (request.headers.authorization) {
            token = request.headers.authorization.replace('Bearer ', '').replace(' ', '');
        }
        else if (request.body.token) {
            token = request.body.token.replace(' ', '');
        }
        if (request.query.token) {
            token = request.body.token.replace(' ', '');
        }
        const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
        if (token) {
            try {
                token = cryptr.decrypt(token);
            }
            catch (err) {
                throw new common_1.BadRequestException('LOGOUT');
            }
        }
        return token;
    }
    returnJwtExtractor() {
        return this.jwtExtractor;
    }
    getIp(req) {
        return request_ip_1.getClientIp(req);
    }
    getBrowserInfo(req) {
        return req.header['user-agent'] || 'XX';
    }
    getCountry(req) {
        return req.header['cf-ipcountry'] ? req.header['cf-ipcountry'] : 'XX';
    }
    encryptText(text) {
        return this.cryptr.encrypt(text);
    }
    getPermissionsArray(roleType) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.roleModel.findOne({ value: roleType }, { permissions: 1 }).lean().exec();
            const permissions = result.permissions.map((permission) => permission.value);
            return permissions;
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __param(1, mongoose_1.InjectModel('RefreshToken')),
    __param(2, mongoose_1.InjectModel('Role')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map