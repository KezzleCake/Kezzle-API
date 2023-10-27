import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurationService } from './curation.service';

@Controller('curation')
export class CurationController {
  constructor(private readonly curationService: CurationService) {}

  @Post()
  createNewCuration(
    @Query('keyword') keywords: string,
    @Query('disc') disc: string,
    @Query('note') note: string,
  ) {
    return this.curationService.createCuration(keywords, disc, note);
  }

  @Get()
  homeCuration() {
    return this.curationService.homeCuration();
  }

  @Get(':id')
  showCuration(@Param('id') curationId: string, @Query('page') page: string) {
    return this.curationService.showCuration(curationId, parseInt(page));
  }
}
