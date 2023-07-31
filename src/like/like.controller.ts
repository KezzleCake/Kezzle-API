import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('cake/:id/cakes_likes')
  getCake(@Param('id') userId: string) {
    return this.likeService.findUserLikeCake(userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('cake/:id/likes')
  likeCake(@Param('id') cakeId: string, @GetUser() userDto: IUser) {
    return this.likeService.addLikeList(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('cake/:id/likes')
  notLikeCake(@Param('id') cakeId: string, @GetUser() userDto: IUser) {
    return this.likeService.removeLikeList(cakeId, userDto);
  }
}
