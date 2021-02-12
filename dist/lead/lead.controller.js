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
exports.LeadController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lead_service_1 = require("./lead.service");
const find_all_dto_1 = require("./dto/find-all.dto");
const update_lead_dto_1 = require("./dto/update-lead.dto");
const geo_location_dto_1 = require("./dto/geo-location.dto");
const reassign_lead_dto_1 = require("./dto/reassign-lead.dto");
const create_email_template_dto_1 = require("./dto/create-email-template.dto");
const platform_express_1 = require("@nestjs/platform-express");
const generic_dto_1 = require("./dto/generic.dto");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_activity_dto_1 = require("../user/dto/user-activity.dto");
const follow_up_dto_1 = require("./dto/follow-up.dto");
const fetch_next_lead_dto_1 = require("./dto/fetch-next-lead.dto");
const update_contact_dto_1 = require("./dto/update-contact.dto");
const create_lead_dto_1 = require("./dto/create-lead.dto");
const get_transaction_dto_1 = require("./dto/get-transaction.dto");
const xlsx_1 = require("xlsx");
const fs_1 = require("fs");
let LeadController = class LeadController {
    constructor(leadService) {
        this.leadService = leadService;
    }
    getAllLeadColumns(campaignId, remove = [], user) {
        common_1.Logger.debug(remove);
        return this.leadService.getLeadColumns(campaignId, remove);
    }
    insertOne(body, user, campaignId, campaignName) {
        const { organization, email } = user;
        return this.leadService.createLead(body, email, organization, campaignId, campaignName);
    }
    getTransactions(user, body, isStreamable, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization, email, roleType } = user;
            const { response, total } = yield this.leadService.getTransactions(organization, email, roleType, body, isStreamable);
            if (!isStreamable) {
                return res.status(200).send({ response, total });
            }
            if (isStreamable) {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                const wb = xlsx_1.utils.book_new();
                const ws = xlsx_1.utils.json_to_sheet(JSON.parse(JSON.stringify(response)));
                xlsx_1.utils.book_append_sheet(wb, ws, 'transactions');
                const filename = "transactions.xlsx";
                const wb_opts = { bookType: 'xlsx', type: 'binary' };
                xlsx_1.writeFile(wb, filename, wb_opts);
                const stream = fs_1.createReadStream(filename);
                stream.pipe(res);
                stream.on("close", () => {
                    return res.end();
                });
            }
        });
    }
    findAll(body, user) {
        const { page, perPage, sortBy = "createdAt", showCols, searchTerm, filters, typeDict, campaignId } = body;
        const { email, roleType, organization } = user;
        return this.leadService.findAll(page, perPage, sortBy, showCols, searchTerm, filters, email, roleType, organization, typeDict, campaignId);
    }
    addGeoLocation(body, user) {
        const { lat, lng } = body;
        const { _id, organization } = user;
        return this.leadService.addGeolocation(_id, lat, lng, organization);
    }
    updateLead(user, updateLeadObj, leadId) {
        const { organization, email: handlerEmail, fullName: handlerName } = user;
        return this.leadService.updateLead(Object.assign(Object.assign({}, updateLeadObj), { leadId, organization, handlerEmail, handlerName }));
    }
    addContact(body, leadId) {
        return this.leadService.addContact(body, leadId);
    }
    reassignLead(body, user) {
        return this.leadService.reassignLead(user.email, body.oldUserEmail, body.newUserEmail, body.lead);
    }
    getLeadHistoryById(user, externalId) {
        const { organization } = user;
        return this.leadService.getLeadHistoryById(externalId, organization);
    }
    getUsersPerformance(req) {
        return this.leadService.getPerformance();
    }
    getLeadSuggestions(user, externalId, page = 1, perPage = 20) {
        const { organization } = user;
        return this.leadService.suggestLeads(user.email, externalId, organization);
    }
    getBasicOverview(req) {
        return this.leadService.getBasicOverview();
    }
    getAllEmailTemplates(user, limit = 10, skip = 0, campaignId) {
        const { organization } = user;
        return this.leadService.getAllEmailTemplates(limit || 20, skip || 0, campaignId, organization);
    }
    createEmailTemplate(user, body) {
        const { email: userEmail, organization } = user;
        const { content, subject, campaignId, attachments, templateName } = body;
        return this.leadService.createEmailTemplate(userEmail, content, subject, campaignId, attachments, organization, templateName);
    }
    sendBulkEmails(req, body) {
        const { email: userEmail, organization } = req.user;
        const { emails, subject, text, attachments } = body;
        return this.leadService.sendBulkEmails(emails, subject, text, attachments, organization);
    }
    uploadMultipleLeadFiles(user, body) {
        const { email, organization, _id, pushtoken } = user;
        const { campaignName, files, campaignId } = body;
        return this.leadService.uploadMultipleLeadFiles(files, campaignName, email, organization, _id, pushtoken, campaignId);
    }
    saveEmailAttachments(files) {
        return this.leadService.saveEmailAttachments(files);
    }
    findOneById(leadId, user) {
        const { organization } = user;
        return this.leadService.findOneById(leadId, organization);
    }
    leadActivityByUser(email, startDate, endDate) {
        return this.leadService.leadActivityByUser(startDate, endDate, email);
    }
    fetchNextLead(user, campaignId, body) {
        const { organization, email, roleType } = user;
        const { filters, typeDict } = body;
        return this.leadService.fetchNextLead({
            campaignId,
            filters,
            email,
            organization,
            typeDict,
            roleType
        });
    }
    getAllAlarms(user, body) {
        const { organization } = user;
        return this.leadService.getAllAlarms(body, organization);
    }
    usersActivityLog(userActivityDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            const { dateRange, userEmail } = userActivityDto;
            return this.leadService.getUsersActivity(dateRange, userEmail, organization);
        });
    }
    fetchFollowUps(followUpDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            const { interval, userEmail, campaignName, page, perPage, } = followUpDto;
            yield this.leadService.checkPrecondition(user, userEmail);
            const limit = Number(perPage);
            const skip = Number((+page - 1) * limit);
            return this.leadService.getFollowUps({
                interval,
                organization,
                email: userEmail || user.email,
                campaignName,
                limit,
                page,
                skip,
            });
        });
    }
};
__decorate([
    common_1.Get("getAllLeadColumns/:campaignId"),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiOperation({
        summary: "Get lead by id",
    }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Param("campaignId")),
    __param(1, common_1.Query('remove')),
    __param(2, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "getAllLeadColumns", null);
__decorate([
    common_1.Post("/create/:campaignId/:campaignName"),
    swagger_1.ApiOperation({ summary: "Creates New Lead" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __param(1, current_user_decorator_1.CurrentUser()),
    __param(2, common_1.Param("campaignId")),
    __param(3, common_1.Param("campaignName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lead_dto_1.CreateLeadDto, Object, String, String]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "insertOne", null);
__decorate([
    common_1.Post("transactions"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.Query('isStreamable')),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_transaction_dto_1.GetTransactionDto, Boolean, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getTransactions", null);
__decorate([
    common_1.Post("findAll"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "Fetches all lead for the given user" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Body()), __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_dto_1.FindAllDto, Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "findAll", null);
__decorate([
    common_1.Post("geoLocation"),
    swagger_1.ApiOperation({ summary: "Adds users location emitted from the device" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Body()), __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [geo_location_dto_1.GeoLocationDto, Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "addGeoLocation", null);
__decorate([
    common_1.Put(":id"),
    swagger_1.ApiOperation({ summary: "Adds users location emitted from the device" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_lead_dto_1.UpdateLeadDto, String]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "updateLead", null);
__decorate([
    common_1.Put("contact/:leadId"),
    swagger_1.ApiOperation({ summary: "Adds contact information" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()), __param(1, common_1.Param("leadId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_contact_dto_1.UpdateContactDto, String]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "addContact", null);
__decorate([
    common_1.Post("reassignLead"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "Adds users location emitted from the device" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reassign_lead_dto_1.ReassignLeadDto, Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "reassignLead", null);
__decorate([
    common_1.Get("getLeadHistoryById/:externalId"),
    swagger_1.ApiOperation({
        summary: "Get leads history by passing in external id of lead",
    }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Param("externalId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "getLeadHistoryById", null);
__decorate([
    common_1.Get("user/performance"),
    swagger_1.ApiOperation({ summary: "Get users performance" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "getUsersPerformance", null);
__decorate([
    common_1.Get("suggest/:externalId"),
    swagger_1.ApiOperation({ summary: "Get users performance" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Param("externalId")),
    __param(2, common_1.Query("page")),
    __param(3, common_1.Query("perPage")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "getLeadSuggestions", null);
__decorate([
    common_1.Get("basicOverview"),
    swagger_1.ApiOperation({
        summary: "Get basic performance overviews for graphs, deprecated",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "getBasicOverview", null);
__decorate([
    common_1.Get("getAllEmailTemplates"),
    swagger_1.ApiOperation({
        summary: "Get all saved email templates",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Query("limit")),
    __param(2, common_1.Query("skip")),
    __param(3, common_1.Query("campaignId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "getAllEmailTemplates", null);
__decorate([
    common_1.Post("createEmailTemplate"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({
        summary: "Create an email template to be used by agents",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_email_template_dto_1.CreateEmailTemplateDto]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "createEmailTemplate", null);
__decorate([
    common_1.Post("bulkEmail"),
    swagger_1.ApiOperation({
        summary: "Send Bulk Emails",
    }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_email_template_dto_1.BulkEmailDto]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "sendBulkEmails", null);
__decorate([
    common_1.Post("uploadMultipleLeadFiles"),
    swagger_1.ApiOperation({
        summary: "Upload multiple lead files",
    }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, generic_dto_1.UploadMultipleFilesDto]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "uploadMultipleLeadFiles", null);
__decorate([
    common_1.Post("saveAttachments"),
    swagger_1.ApiOperation({
        summary: "Upload multiple lead files",
    }),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor("files[]")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "saveEmailAttachments", null);
__decorate([
    common_1.Get(":leadId"),
    swagger_1.ApiOperation({
        summary: "Get lead by id",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Param("leadId")), __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "findOneById", null);
__decorate([
    common_1.Get("activity/:email"),
    swagger_1.ApiOperation({
        summary: "Get lead by id",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param("email")),
    __param(1, common_1.Query("startDate")),
    __param(2, common_1.Query("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "leadActivityByUser", null);
__decorate([
    common_1.Post("fetchNextLead/:campaignId"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({
        summary: "Fetches next lead for telecaller operative, always returns one lead in that category, this has to be sorted by last updated at desc",
    }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Param("campaignId")),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, fetch_next_lead_dto_1.FetchNextLeadDto]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "fetchNextLead", null);
__decorate([
    common_1.Post("alarms/getAll"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({
        summary: "Gets all alarms generated for a user in an organization",
    }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LeadController.prototype, "getAllAlarms", null);
__decorate([
    common_1.Post("/activity/logs"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("admin"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({ summary: "Register user" }),
    __param(0, common_1.Body()),
    __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_activity_dto_1.UserActivityDto, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "usersActivityLog", null);
__decorate([
    common_1.Post("/followUp"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("admin"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({ summary: "Register user" }),
    __param(0, common_1.Body()),
    __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [follow_up_dto_1.FollowUpDto, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "fetchFollowUps", null);
LeadController = __decorate([
    swagger_1.ApiTags("Lead"),
    common_1.Controller("lead"),
    __metadata("design:paramtypes", [lead_service_1.LeadService])
], LeadController);
exports.LeadController = LeadController;
//# sourceMappingURL=lead.controller.js.map