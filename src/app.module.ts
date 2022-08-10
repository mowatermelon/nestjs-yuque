import { Module } from '@nestjs/common'
import { HomeModule } from 'src/home/home.module'
import { TaskModule } from 'src/task/task.module'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { YuqueModule } from './yuque/yuque.module'
import { APP_FILTER } from '@nestjs/core'
import { AllExceptionsFilter } from './common/exception/exception-filter'

@Module({
  imports: [
    HomeModule,
    TaskModule,
    YuqueModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
