import { Injectable } from '@nestjs/common'

@Injectable()
export class HomeService {
  public getHello(): string {
    return 'Hello eva!'
  }
}
