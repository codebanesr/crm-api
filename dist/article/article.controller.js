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
exports.ArticleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const article_service_1 = require("./article.service");
const create_article_dto_1 = require("./dto/create-article.dto");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("./../auth/decorators/roles.decorator");
let ArticleController = class ArticleController {
    constructor(articleService) {
        this.articleService = articleService;
    }
    getAllArticle() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.getAllArticles();
        });
    }
    getOneArticles(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.getOneArticle(params.id);
        });
    }
    createArticle(createArticleDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.createArticle(createArticleDto);
        });
    }
    updateWithAllParams(params, createArticleDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.updateArticlePut(params.id, createArticleDto);
        });
    }
    deleteOneArticle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.deleteArticle(params.id);
        });
    }
};
__decorate([
    common_1.Get(),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({ summary: 'Get All article', }),
    swagger_1.ApiOkResponse({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getAllArticle", null);
__decorate([
    common_1.Get(':id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({ summary: 'Get One article', }),
    swagger_1.ApiParam({ name: 'id', description: 'id of article' }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getOneArticles", null);
__decorate([
    common_1.Post(),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Roles('admin'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    }),
    swagger_1.ApiOperation({ summary: 'Create one article', }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createArticle", null);
__decorate([
    common_1.Put(':id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Roles('admin'),
    swagger_1.ApiOperation({ summary: 'Update one article by id ( all params )', }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiParam({ name: 'id', description: 'id of article' }),
    swagger_1.ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Param()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "updateWithAllParams", null);
__decorate([
    common_1.Delete(':id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Roles('admin'),
    swagger_1.ApiOperation({ summary: 'Delete one article', }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    }),
    swagger_1.ApiParam({ name: 'id', description: 'id of article we want to delete.' }),
    swagger_1.ApiOkResponse({}),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "deleteOneArticle", null);
ArticleController = __decorate([
    swagger_1.ApiTags('Article'),
    common_1.Controller('article'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [article_service_1.ArticleService])
], ArticleController);
exports.ArticleController = ArticleController;
//# sourceMappingURL=article.controller.js.map