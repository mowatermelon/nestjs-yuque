import { Injectable, Logger } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { EPathType, EBoothUrl } from 'src/common/constants'
import {
  IResponseOptions,
  PlainObject,
} from 'src/common/interfaces/common-service.interface'
import BaseService, { HttpModuleOptions } from 'src/common/service/base.service'
import { IYuqueConfig } from 'src/config/yuque'
import { IRequestPathConfig, IYuqueDocsDetail } from './yuque.dto'

@Injectable()
export class YuqueService extends BaseService {
  public get yuqueConfig(): IYuqueConfig {
    return this.config.get<IYuqueConfig>('yuque')
  }

  private get GROUP_ID(): number {
    return Number(this.yuqueConfig.groupId)
  }

  private get REPO_ID(): number {
    return this.yuqueConfig.groupId
  }

  private get TOKEN(): string {
    return this.yuqueConfig.token
  }

  private get CSRF_TOKEN(): string {
    return this.yuqueConfig.csrfToken || ''
  }

  private get CSRF_SESSION(): string {
    return this.yuqueConfig.csrfSession || ''
  }

  public async editDoc(repoId: number, docsId: number, docs: IYuqueDocsDetail) {
    const type = EPathType.docs
    const path = this.getRequestPath(type, repoId, docsId)
    const res: IResponseOptions<IYuqueDocsDetail> = (await this.putRequest(
      path,
      {
        data: docs,
      },
    )) as unknown as IResponseOptions<IYuqueDocsDetail>
    const attr = ['id', 'title']
    res.success &&
      (res.data = this.getCamelizeObj<IYuqueDocsDetail>(res.data, attr))
    return res
  }

  public async getDocDetail(repoId: number, docId: number, jumpType = '') {
    const type = EPathType.detail
    const path = this.getRequestPath(type, repoId, docId)
    const res: IResponseOptions<IYuqueDocsDetail> = (await this.getRequest(
      path,
      {},
      { jumpType },
    )) as unknown as IResponseOptions<IYuqueDocsDetail>
    const attr = [
      'id',
      'title',
      'description',
      'slug',
      'body',
      'body_html',
      'word_count',
      'cover',
      'creator',
      'created_at',
      'updated_at',
      'book_id',
    ]
    res.success &&
      (res.data = this.getCamelizeObj<IYuqueDocsDetail>(res.data, attr))
    return res
  }

  public async writeDoc(repoId: number, docs: IYuqueDocsDetail) {
    const type = EPathType.docs
    const path = this.getRequestPath(type, repoId)
    const res: IResponseOptions<IYuqueDocsDetail> = (await this.postRequest(
      path,
      {
        data: docs,
      },
    )) as unknown as IResponseOptions<IYuqueDocsDetail>
    const attr = ['id', 'title', 'slug', 'body_html', 'body', 'cover']
    res.success &&
      (res.data = this.getCamelizeObj<IYuqueDocsDetail>(res.data, attr))
    return res
  }

  public async writeOrEditDoc({
    repoId,
    docs,
    needUpdate = true,
    boothName = '',
  }: {
    repoId: number
    docs: IYuqueDocsDetail
    needUpdate?: boolean
    boothName?: string
  }) {
    let res: IResponseOptions<IYuqueDocsDetail> = { success: true, data: docs }
    // 查询语雀知识库文档信息
    const { data: currArticleData } =
      (await this.getDocDetail(repoId, Number(docs.slug), boothName)) || {}
    // 查看语雀知识库数据状态
    if (!currArticleData?.id) {
      this.otherInfoTip('yuque', 'write')
      res = await this.writeDoc(repoId, docs)
    } else if (currArticleData?.id) {
      this.otherInfoTip('yuque', 'update')
      res.data = currArticleData
      // 更新文档信息
      docs['_force_asl'] = 1
      needUpdate && (res = await this.editDoc(repoId, currArticleData.id, docs))
    }
    return res
  }

  public fail(error: string) {
    return this.baseError(error, 404)
  }

  public getRequest(
    path: string,
    option = {},
    otherOption?: IRequestPathConfig,
  ) {
    return this.request(path, { ...option, method: 'get' }, otherOption)
  }

  public postRequest(
    path: string,
    option = {},
    otherOption?: IRequestPathConfig,
  ) {
    return this.request(
      path,
      {
        ...option,
        method: 'post',
      },
      otherOption,
    )
  }

  public putRequest(
    path: string,
    option = {},
    otherOption?: IRequestPathConfig,
  ) {
    return this.request(
      path,
      {
        ...option,
        method: 'put',
      },
      otherOption,
    )
  }

  public deleteRequest(
    path: string,
    option = {},
    otherOption?: IRequestPathConfig,
  ) {
    return this.request(
      path,
      {
        ...option,
        method: 'delete',
      },
      otherOption,
    )
  }

  public request(
    path: string,
    option: HttpModuleOptions,
    { isBase = true, isDefault = false, jumpType = '' }: IRequestPathConfig = {
      isBase: true,
      isDefault: false,
    },
  ) {
    this.infoTip(`[request]: ${option.method} request`)
    const headers: PlainObject = {
      'X-Auth-Token': this.TOKEN,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
      'Content-Type': 'application/json',
    }
    if (this.CSRF_TOKEN) {
      headers['x-csrf-token'] = this.CSRF_TOKEN
      headers[
        'Cookie'
      ] = `yuque_ctoken=${this.CSRF_TOKEN};_yuque_session=${this.CSRF_SESSION}`
    }
    const _option = {
      headers,
      ...option,
    }
    const callback = async () => {
      const defaultBasePath = this.getBasePath(jumpType)
      const BASE_PATH = isBase ? `${defaultBasePath}v2` : defaultBasePath
      const res = (await super.request(
        BASE_PATH + path,
        _option,
      )) as AxiosResponse<PlainObject<any>, any>

      const {
        data: { data: resData, abilities },
        status,
        statusText,
        config,
      } = res || {}

      this.otherInfoTip(
        'yuque',
        abilities,
        res.data,
        status,
        statusText,
        config,
      )
      if (status === 404) {
        return this.fail('未找到有效记录')
      }
      if (status !== 200) {
        return this.fail('请求失败')
      }
      const result = this.success(
        '请求语雀接口成功',
        isDefault ? res.data : resData,
      )
      this.writeJSONFile({
        writeFileName: path,
        writeFileData: result,
      })
      return result
    }
    const errHandler = () => {}
    return this.dealFnCatch(callback, errHandler)
  }

  private getBasePath(type?: string): string {
    if (!type) {
      return this.yuqueConfig.api
    }
    return EBoothUrl[type].includes(this.yuqueConfig.xApi)
      ? `${this.yuqueConfig.xApi}/api/`
      : this.yuqueConfig.api
  }

  private getRequestPath(type: EPathType, ...restParam: any[]): string {
    let path = ''
    switch (type) {
      case EPathType.repo: {
        const [groupId = this.GROUP_ID] = restParam
        path = `/groups/${groupId}/repos`
        break
      }
      case EPathType.docs: {
        const [repoId = this.REPO_ID, docsId = ''] = restParam
        path = `/repos/${repoId}/docs${docsId ? `/${docsId}` : ''}`
        break
      }
      case EPathType.toc: {
        const [repoId = this.REPO_ID] = restParam
        path = `/repos/${repoId}/toc`
        break
      }
      case EPathType.detail: {
        const [repoId = this.REPO_ID, docId] = restParam
        path = `/repos/${repoId}/docs/${docId}?raw=1`
        break
      }
      case EPathType.user: {
        const [userId] = restParam
        path = `/users/${userId}`
        break
      }
      case EPathType.tag: {
        const [docId] = restParam
        path = `tags?docId=${docId}`
        break
      }
      case EPathType.member: {
        const [groupId] = restParam
        path = `groups/${groupId}/users`
        break
      }
      case EPathType.comment: {
        const [docId, type] = restParam
        path = `/comments`
        type && (path += `?commentable_type=${type}`)
        docId && (path += `&commentable_id=${docId}`)
        break
      }
      case EPathType.catalog: {
        path = `catalog_nodes`
        break
      }
      case EPathType.meta: {
        const [docId] = restParam
        path = `docs/${docId}/meta`
        break
      }
      case EPathType.share: {
        const [docId] = restParam
        path = `share?target_id=${docId}&target_type=Doc`
        break
      }
      case EPathType.group: {
        path = `/groups`
        break
      }
    }
    return path
  }

  public logger = new Logger(YuqueService.name)
}
