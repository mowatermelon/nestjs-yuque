import { Controller, Delete, Get, Post, Put } from '@nestjs/common'
import { HomeService } from './home.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('home')
@Controller('/home')
export class HomeController {
  constructor(private readonly currService: HomeService) {}

  @Get()
  @ApiOperation({
    summary: 'get home',
    description: 'get 请求基础学习',
  })
  public getHello(): string {
    return this.currService.getHello()
  }

  @Post()
  @ApiOperation({
    summary: 'post home',
    description: 'Post 请求基础学习',
  })
  public postHello(): string {
    return this.currService.getHello()
  }

  @Put()
  @ApiOperation({
    summary: 'put home',
    description: 'Put 请求基础学习',
  })
  public putHello(): string {
    return this.currService.getHello()
  }

  @Delete()
  @ApiOperation({
    summary: 'delete home',
    description: 'Delete 请求基础学习',
  })
  public deleteHello(): string {
    return this.currService.getHello()
  }
}
