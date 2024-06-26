import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { Roles } from 'src/decorators/roles-auth.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { GetAllAuditsDto } from './dtos/get-all-audits.dto';

@ApiTags('Audit Logs')
@Controller('logs')
@ApiBearerAuth()
export class AuditController {
  constructor(private auditService: AuditService) {}

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Get()
  @ApiOperation({
    summary: 'Get All Audits',
    description: 'Endpoint to get all audit logs.',
  })
  getAllAudits(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('email') email?: string,
  ) {
    const request: GetAllAuditsDto = {
      page,
      limit,
      email,
    };
    return this.auditService.getAllAudits(request);
  }
}
