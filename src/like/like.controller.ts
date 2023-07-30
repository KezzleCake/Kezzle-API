import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/user/entities/roles.enum';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.Buyer)
  @Get(':id/cakes_likes')
  getCake(@Param('id') userId: string) {
    return this.likeService.findUserLikeCake(userId);
  }
}
