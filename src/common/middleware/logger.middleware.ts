import { Logger } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { PlainObject } from '../interfaces/common-service.interface'

const formatMsg = (msg: PlainObject) => (msg ? JSON.stringify(msg) : '{}')

export const LoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logger = new Logger('LoggerMiddleware')
  const path = req.url
  if (path.indexOf('swagger') > -1) {
    logger.log(`request ${path}`)
    next()
  } else {
    const { body, query, params, httpVersion } = req
    logger.log(
      ` ip: ${req.ip}
        httpVersion:${httpVersion}
        remoteAddress: ${req.socket.remoteAddress}
        remotePort: ${req.socket.remotePort}
        protocol: ${req.protocol}
        origin: ${req.header('referer')} `,
    )
    logger.log(` header: ${formatMsg(req.header)} `)
    logger.log(
      `request start -->  params:${formatMsg(params)} body: ${formatMsg(
        body,
      )}, query: ${formatMsg(query)}`,
    )
    next()
    const { statusCode: resStatus } = res
    logger.log(
      `request end -->  status: ${resStatus}, data: ${formatMsg(res.app)} `,
    )
  }
}
