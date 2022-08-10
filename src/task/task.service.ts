import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import BaseService from 'src/common/service/base.service'

@Injectable()
export class TaskService extends BaseService {
  @Cron('45 * * * * *')
  public handleCron() {
    this.otherInfoTip(this.success('loop', this.CURR_DAY_STR))
    this.logger.debug('Called when the current second is 45')
  }

  public getHello(): string {
    return 'Hello watermelon!'
  }

  public logger = new Logger(TaskService.name)
}
