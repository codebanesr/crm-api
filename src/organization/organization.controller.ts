import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { ValidateNewOrganizationDto } from './dto/validation.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
@ApiTags("organization")
export class OrganizationController {
    constructor(private organizationService: OrganizationService) {

    }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register user" })
  @ApiCreatedResponse({})
  async register(@Body() createOrganizationDto: CreateOrganizationDto) {
    Logger.debug(createOrganizationDto);
    return await this.organizationService.createOrganization(createOrganizationDto);
  }

  @Post("otp")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Generates an otp for given mobile number and sends it to that number" })
  @ApiCreatedResponse({})
  async generateToken(@Body() generateTokenDto: GenerateTokenDto) {
    return await this.organizationService.generateToken(generateTokenDto);
  }


  @Post("isValid")
  @ApiOperation({ summary: "Validate create-organization paylod"})
  @ApiCreatedResponse({})
  async isValidAttribute(@Body() validateNewOrganizationDto: ValidateNewOrganizationDto) {
    return this.organizationService.isAttributeValid(validateNewOrganizationDto);
  }
}
