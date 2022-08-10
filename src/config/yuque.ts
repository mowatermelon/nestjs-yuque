export interface IYuqueConfig {
  api: string
  xApi: string
  token: string
  groupId: number
  csrfToken: string
  csrfSession: string
}

export const yuqueConfig: IYuqueConfig = {
  api: 'https://www.yuque.com/api/', // 历史知识小组的请求地址
  xApi: 'https://eva.yuque.com', // 替换成你自己的知识空间的地址
  token: '',
  // 替换成个人专属的知识小组/空间的 id
  groupId: 11111,
  csrfToken: '',
  csrfSession: '',
}
