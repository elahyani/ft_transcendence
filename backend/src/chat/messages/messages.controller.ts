import {
    Controller,
    Get,
    HttpCode,
    Param,
    Req,
    UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { DirectMessage } from "./entities/direct-messages.entity";
import { MessageChannel } from "./entities/message-channel.entity";
import { MessagesService } from "./messages.service";

@Controller('messages')
export class MessagesController {

    constructor(private messagesService: MessagesService) {}
    
    // http://${host}:${port}/channels/messages/:channelId
    // return  all the message belong to this channel
    @Get('/channels/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async getMessagesChannel(@Param('channelId') channelId: string | number) : Promise<MessageChannel[]>  {
        return await this.messagesService.getMessagesByChannelId(Number(channelId));
    }

    // http://${host}:${port}/direct/messages/:userId
    // return all the messages between the logged user and the user with userId
    @Get('/direct/:userId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async getDirectMessages(@Req() _req: any, @Param('userId') userId: string | number): Promise<DirectMessage[]> {
        return await this.messagesService.getAllDirectMessages(Number(_req.user.id), Number(userId));
    }
}