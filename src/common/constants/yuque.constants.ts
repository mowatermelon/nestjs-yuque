export enum EYuqueWebhookType {
  update = 'update',
  insert = 'publish',
}

export enum EPathType {
  /**
   * 文档
   */
  toc = 'toc',
  /**
   * 文档
   */
  docs = 'docs',
  /**
   * 知识库
   */
  repo = 'repo',
  /**
   * 文档详情
   */
  detail = 'detail',
  /**
   * 用户
   */
  user = 'user',
  /**
   * 标签
   */
  tag = 'tag',
  /**
   * 团队用户
   */
  member = 'member',
  /**
   * 评论
   */
  comment = 'comments',
  /**
   * 目录
   */
  catalog = 'catalog',
  /**
   * 版权信息
   */
  meta = 'meta',
  /**
   * 分享地址
   */
  share = 'share',
  /**
   * 分享地址
   */
  group = 'group',
}

/**
 * 内容展台的枚举定义
 */
export enum EBoothUrl {
  /**
   * 语雀官方发布日志知识小组,可以直接使用 api/v2
   */
  test = 'https://www.yuque.com/yuque/changelog',
  /**
   * 空间指定知识库,需要使用直接使用 eva.yuque.com
   */
  xTest = 'https://eva.yuque.com',
}
