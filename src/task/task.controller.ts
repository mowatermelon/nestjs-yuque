import { Controller, Get } from '@nestjs/common'
import { TaskService } from './task.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('task')
@Controller('/task')
export class TaskController {
  constructor(private readonly currService: TaskService) {}

  @Get()
  public getHello(): string {
    return this.currService.getHello()
  }
}
