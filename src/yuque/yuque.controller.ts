import { Body, Controller, Param, Put } from '@nestjs/common'
import { YuqueService } from './yuque.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { WriteContentDTO } from './yuque.dto'

@ApiTags('yuque')
@Controller('/yuque')
export class YuqueController {
  constructor(private readonly currService: YuqueService) {}

  @Put('/detail/:repoId/:docId')
  @ApiOperation({
    summary: 'getDocDetail',
    description: '获取指定知识库的指定文章详情',
  })
  public async getDocDetail(
    @Param('repoId') repoId: number,
    @Param('docId') docId: number,
  ) {
    return await this.currService.getDocDetail(repoId, docId)
  }

  @Put('/write/:repoId')
  @ApiOperation({
    summary: 'writeDoc',
    description: '给指定知识库写入文档内容',
  })
  public async writeDoc(
    @Body() ContentWriteOptionsBody: WriteContentDTO,
    @Param('repoId') repoId: number,
  ) {
    const data = await this.currService.writeDoc(
      repoId,
      ContentWriteOptionsBody,
    )
    return data
  }
}
