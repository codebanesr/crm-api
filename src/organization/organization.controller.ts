import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { User } from "../user/interfaces/user.interface";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { ValidateNewOrganizationDto } from "./dto/validation.dto";
import { OrganizationService } from "./organization.service";
import { UpdateQuotaDto } from "./dto/update-quota.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Logger } from "nestjs-pino";
import { RoleType } from "../shared/role-type.enum";
@Controller("organization")
@ApiTags("organization")
@UseGuards(RolesGuard)
export class OrganizationController {
  constructor(
    private organizationService: OrganizationService,
    private logger: Logger
  ) {}

  @Get()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Get all organizations",
  })
  @UseGuards(AuthGuard("jwt"))
  @Roles("reseller", "superAdmin")
  public async getAllOrganizations() {
    return this.organizationService.getAllOrganizations();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Registers Organization and automatically creates a user for that organization",
  })
  @UseGuards(AuthGuard("jwt"))
  @Roles("reseller", "superAdmin")
  @ApiCreatedResponse({})
  async register(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() user: User
  ) {
    this.logger.debug(createOrganizationDto);
    const { _id, fullName } = user;
    return this.organizationService.createOrganization(
      createOrganizationDto,
      _id,
      fullName
    );
  }

  @ApiOperation({
    summary: "Get all organization details for logged in reseller",
  })
  @UseGuards(AuthGuard("jwt"))
  @Roles("reseller", "superAdmin")
  @Get("reseller")
  async getAllResellerOrganizations(@CurrentUser() user: User) {
    const { _id } = user;
    return this.organizationService.getAllResellerOrganization(_id);
  }

  @Post("otp")
  @UseGuards(AuthGuard("jwt"))
  @Roles("reseller", "superAdmin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Generates an otp for given mobile number and sends it to that number",
  })
  @ApiCreatedResponse({})
  async generateToken(@Body() generateTokenDto: GenerateTokenDto) {
    return await this.organizationService.generateToken(generateTokenDto);
  }

  @Post("quota")
  @UseGuards(AuthGuard("jwt"))
  @Roles("reseller", "superAdmin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Generates an otp for given mobile number and sends it to that number",
  })
  @ApiCreatedResponse({})
  async createOrUpdateUserQuota(@Body() updateQuota: UpdateQuotaDto) {
    return this.organizationService.createOrUpdateUserQuota(updateQuota);
  }

  @Post("isValid")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Validate create-organization paylod" })
  @ApiCreatedResponse({})
  async isValidAttribute(
    @Body() validateNewOrganizationDto: ValidateNewOrganizationDto
  ) {
    return this.organizationService.isAttributeValid(
      validateNewOrganizationDto
    );
  }

  @Get("transactions")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Validate create-organization paylod" })
  @ApiCreatedResponse({})
  async getPayments(@Query("organization") organization: string) {
    return this.organizationService.getAllPayments(organization);
  }

  @Get("current")
  @UseGuards(AuthGuard("jwt"))
  @Roles(RoleType.admin)
  async getCurrentOrganization(@CurrentUser() user: User) {
    const { organization } = user;
    return this.organizationService.getCurrentOrganization(organization);
  }

  @Delete("delete/:organizationId")
  @UseGuards(AuthGuard("jwt"))
  @Roles(RoleType.superAdmin)
  async deleteCurrentOrganization(
    @Param("organizationId") organizationId: string
  ) {
    return this.organizationService.deleteOrganization(organizationId);
  }
}
