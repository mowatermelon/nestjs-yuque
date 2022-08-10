import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import getServerConfig from './config/configuration'
import { LoggerMiddleware } from './common/middleware/logger.middleware'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const serverConfig = getServerConfig()
  const port = process.env.PORT || serverConfig.port
  if (process.env.NODE_ENV !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle('nestjs swagger example')
      .setDescription(`The nestjs ${process.env.NODE_ENV} API description`)
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swagger', app, document)
  }
  app.use(LoggerMiddleware)
  await app.listen(port)
}
bootstrap()
