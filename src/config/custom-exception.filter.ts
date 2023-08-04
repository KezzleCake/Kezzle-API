import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Webhook, MessageBuilder } from 'discord-webhook-node';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly webhook = new Webhook(process.env.DISCORD_WEBHOOK_URL);

  private readonly isProduction = process.env.NODE_ENV === 'production';

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    let errorParams = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      errorParams = {
        statusCode: exception.getStatus(),
        message: exception['response']['message'] || exception.message,
      };
    }

    if (errorParams.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.isProduction
        ? this.webhook.send(
            new MessageBuilder().setDescription(exception.stack).setTimestamp(),
          )
        : console.log(exception.stack);
    }

    const responseBody = {
      ...errorParams,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, errorParams.statusCode);
  }
}
