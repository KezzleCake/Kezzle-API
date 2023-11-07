import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async cakeSearch(
    @Query('keyword') keywords: string,
    @Query('page') page,
    @GetUser() userDto: IUser,
  ) {
    return await this.searchService.search(keywords, parseInt(page), userDto);
  }

  @Get('rank')
  async keywordRank(@Query('startDate') startDate, @Query('endDate') endDate) {
    return await this.searchService.getRank(startDate, endDate);
  }

  @Get(':id')
  async userLatest(@Param('id') userId: string) {
    return await this.searchService.getLatest(userId);
  }
}
