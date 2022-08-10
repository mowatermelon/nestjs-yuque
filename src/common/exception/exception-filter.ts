import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const isProdEnv = process.env.NODE_ENV === 'prod'
    const ctx = host.switchToHttp()
    const isHttpError = exception instanceof HttpException
    const httpStatus = isHttpError
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR
    const exceptionMsgObj = (
      isHttpError ? exception.getResponse() : exception
    ) as { message: string; stack: Record<string, any> }
    const httpMsg = `[eva catch error] ${exceptionMsgObj.message}`
    const logger = new Logger('LoggerMiddleware')
    const response = ctx.getResponse<Response>()

    logger.error('Error: ', {
      meta: {
        error: exceptionMsgObj.message,
        stack: exceptionMsgObj.stack,
      },
    })

    const responseBody = {
      success: false,
      errMsg: isProdEnv ? 'Internal Server Error' : httpMsg, // 生产环境不提示具体错误信息
      errCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    httpAdapter.reply(response, responseBody, httpStatus)
  }
}
