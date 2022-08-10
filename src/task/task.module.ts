import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TaskController } from './task.controller'
import { TaskService } from './task.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
