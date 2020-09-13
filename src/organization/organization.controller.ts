import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
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
  async register(@Body() createUserDto: CreateOrganizationDto) {
    return await this.organizationService.createOrganization(createUserDto);
  }

  @Post("otp")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register user" })
  @ApiCreatedResponse({})
  async generateToken(@Body() generateTokenDto: GenerateTokenDto) {
    return await this.organizationService.generateToken(generateTokenDto);
  }
}
