// import { Pagination } from 'src/paginate';
export interface IResponseCount {
  count: number
  pageNo: number
  pageSize: number
  all: number
}
export type PlainObject<T = any> = Record<string, T>

export interface IResponseOptions<T = any, R = IResponseCount> {
  success: boolean
  count?: number
  counts?: R
  data?: T
  errMsg?: string
  errCode?: number
}

export interface IFormatData {
  [name: string]: any
}
export type IFunction<R = any> = (...args: any[]) => R
/**
 * common service interface
 */
export interface CommonServiceInterface {
  baseSuccess<T, R>(data: T, count?: R): IResponseOptions<T, R>
  baseError(errMsg: string, errCode: number): IResponseOptions
  otherInfoTip(...msg: any[]): void
  objInfoTip(msg: PlainObject): void
  infoTip(msg: string): void
  errorTip(msg: string): void
  warnTip(msg: string): void
  formatOptions<T = PlainObject>(obj: T, whiteParamList: Array<string>): T
}
