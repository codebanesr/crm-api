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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const fs_1 = require("fs");
const config_1 = require("../config/config");
let UploadService = class UploadService {
    constructor() {
        this.s3Manager = new aws_sdk_1.S3({
            accessKeyId: config_1.default.s3.accessKeyId,
            secretAccessKey: config_1.default.s3.secretAccessKey,
            region: config_1.default.s3.region,
        });
    }
    uploadFile(key, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                Bucket: "molecule.uploads",
                Key: key + file.name,
                Body: file,
            };
            return new Promise((resolve, reject) => {
                this.s3Manager.upload(params, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        });
    }
    uploadFileBuffer(key, fileBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                Bucket: "applesaucecrm",
                Key: key,
                Body: fileBuffer,
            };
            return this.s3Manager.upload(params).promise();
        });
    }
    uploadFileStream({ filePath, contentType, key }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.s3Manager.upload({
                Bucket: "applesaucecrm",
                Key: key,
                ContentType: contentType,
                Body: fs_1.createReadStream(filePath)
            }).promise();
            return result;
        });
    }
};
UploadService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map