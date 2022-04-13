import {
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ReqUser } from "src/users/decorators/req-user.decorator";
import { User } from "src/users/entities/user.entity";
import { Game } from "./entities/game.entity";
import { GameService } from "./game.service";

@Controller('games')
export class GameController {
    constructor(private gameService: GameService) { }

    @Get('user/:userId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getGamesHistory(
        @ReqUser() user: User,
        @Param('userId', ParseIntPipe) userId: number): Promise<Game[]> {
        return this.gameService.getGamesHistory(Number(userId));
    }
}
