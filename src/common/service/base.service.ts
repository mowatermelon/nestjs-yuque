/* eslint-disable @typescript-eslint/no-this-alias */
import { Logger, Injectable } from '@nestjs/common'
import {
  CommonServiceInterface,
  IFormatData,
  IFunction,
} from 'src/common/interfaces/common-service.interface'

const isProduction = process.env.NODE_ENV === 'prod'
import fs = require('fs')
import path = require('path')
import { IDateConfig } from 'src/config/date'
import {
  IResponseOptions,
  PlainObject,
} from '../interfaces/common-service.interface'
import { ConfigService } from '@nestjs/config'
import { HttpService, HttpModuleOptions } from '@nestjs/axios'
import { EStatusCodesList } from '../constants'
export { HttpService, HttpModuleOptions } from '@nestjs/axios'

@Injectable()
export default class BaseService implements CommonServiceInterface {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public get allField(): Array<string> {
    return ['id', 'state', 'createdAt', 'updatedAt', 'deletedAt']
  }

  public get config(): ConfigService {
    return this.configService
  }

  public get dateConfig(): IDateConfig {
    return this.configService.get<IDateConfig>('date')
  }

  public get CURR_YEAR(): string {
    return this.dateConfig.currYear.toString()
  }

  public get CURR_MOUTH(): string {
    return `${this.CURR_YEAR}-${this.formatDateStr(this.dateConfig.currMonth)}`
  }

  public get CURR_DATE(): string {
    return `${this.formatDateStr(this.dateConfig.currDate)}`
  }

  public get CURR_DAY_STR(): string {
    const { currDateStr, currYear, currMonth, currDate } = this.dateConfig
    return currDateStr || `${currYear}-${currMonth}-${currDate}`
  }

  public get FORMAT_DAY_STR(): string {
    const { currYear, currMonth } = this.dateConfig
    return `${currYear}${this.formatDateStr(currMonth)}${this.CURR_DATE}`
  }

  /**
   * 获取当前时间的 YYYY年MM月DD日 HH:MM:SS
   */
  public get FORMAT_DAY_TIME_STR(): string {
    const currDateObj = new Date()
    const currHour = currDateObj.getHours() //获取当前小时数(0-23)
    const currMinute = currDateObj.getMinutes() //获取当前分钟数(0-59)
    const currSecond = currDateObj.getSeconds() //获取当前秒数(0-59)

    const { currYear, currMonth, currDate } = this.dateConfig
    return `${currYear}年${this.formatDateStr(currMonth)}月${this.formatDateStr(
      currDate,
    )}日 ${this.formatDateStr(currHour)}:${this.formatDateStr(
      currMinute,
    )}:${this.formatDateStr(currSecond)}`
  }

  public get isProdEnv(): boolean {
    return isProduction
  }

  public get isLocalEnv(): boolean {
    return !isProduction
  }

  public formatDateStr(formatDate: number | string) {
    return formatDate?.toString()?.padStart(2, '0')
  }

  public sleep(time = 1000) {
    !isNaN(time) && (time = 1000)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(time)
      }, time)
    })
  }

  public getCodeStr(prefix: string, count: number): string {
    return `${prefix}${count.toString().padStart(10, '0')}`
  }

  public getYearArr(): number[] {
    const currYear = Number(this.CURR_YEAR) + 1
    const yearArr = []
    for (let year = 2020; year <= currYear; year++) {
      yearArr.push(year)
    }
    return yearArr
  }

  public baseSuccess<T = PlainObject, R = number>(
    data: T,
    count?: R,
  ): IResponseOptions<T, R> {
    const isObjCount = typeof count === 'object'
    const dataLength = Array.isArray(data) ? data.length : undefined
    return {
      success: true,
      data,
      count: typeof count === 'number' ? count : dataLength,
      counts: isObjCount ? count : undefined,
    }
  }

  public baseError(errMsg: string, errCode: number): IResponseOptions {
    return {
      success: false,
      errMsg,
      errCode,
    }
  }

  public otherInfoTip(...msg: any[]): void {
    this.logger.debug('[eva-nestjs-debug]', ...msg)
  }

  public objInfoTip(msg: PlainObject): void {
    this.logger.debug('[eva-nestjs-debug]', JSON.stringify(msg))
  }

  public infoTip(msg: string): void {
    !this.isProdEnv && this.logger.verbose('[eva-nestjs-info]', msg)
  }

  public errorTip(msg: string): void {
    !this.isProdEnv && this.logger.error('[eva-nestjs-error]', msg)
  }

  public warnTip(msg: string): void {
    !this.isProdEnv && this.logger.warn('[eva-nestjs-warn]', msg)
  }

  // 从下划线转为驼峰
  public formatDBDataToCamelize(data: string): string {
    return this.camelCase(data)
  }

  public formatDBDataToCamelizeObj(data: IFormatData): IFormatData {
    return this.mapObjAttr(data, this.camelCase)
  }

  public getCamelizeObj<T>(data: T, attr?: string[]): T {
    if (this.checkEmptyObject(data)) {
      return data
    }
    if (!Array.isArray(attr) || !attr.length) {
      return this.formatDBDataToCamelizeObj(data) as T
    }
    return attr.reduce((acc, curr) => {
      data[curr] && (acc[this.formatDBDataToCamelize(curr)] = data[curr])
      return acc
    }, {}) as T
  }

  public formatOptions<T = PlainObject>(
    obj: T,
    whiteParamList: Array<string> = [],
  ): T {
    if (typeof obj !== 'object') {
      return obj
    }
    const badParamList = [undefined, '', null]
    for (const name in obj) {
      ;(badParamList.includes(obj[name as string]) ||
        !whiteParamList.includes(name)) &&
        delete obj[name]
    }
    return obj
  }

  public async request<T = PlainObject>(
    path: string,
    option: HttpModuleOptions,
    otherOption: PlainObject = {},
  ) {
    this.infoTip(`[request]: ${option.method} request`)
    try {
      this.infoTip(
        `[request]: ${path} ,option:${JSON.stringify(
          option,
        )} ,otherOption:${JSON.stringify(otherOption)}`,
      )
      return await this.httpService.axiosRef.request<T>({
        url: path,
        ...option,
      })
    } catch (err) {
      const isProdEnv = !this.isLocalEnv
      const defaultErrMsg = '[catch request error]'
      const errMsg = isProdEnv ? 'Internal Server Error' : err.message
      // 从 error 对象上读出各个属性，设置到响应中
      this.errorTip(`${defaultErrMsg} ${errMsg}`)
      return this.baseError(`${defaultErrMsg} ${errMsg}`, 500)
    }
  }

  public getRequest(path: string, option = {}) {
    return this.request(path, { ...option, method: 'get' })
  }

  public postRequest(path: string, option = {}) {
    return this.request(path, {
      ...option,
      method: 'post',
    })
  }

  public putRequest(path: string, option = {}) {
    return this.request(path, {
      ...option,
      method: 'put',
    })
  }

  public deleteRequest(path: string, option = {}) {
    return this.request(path, {
      ...option,
      method: 'delete',
    })
  }

  public fileRequest(path: string, option = {}) {
    this.infoTip(`[request]: file request`)
    return this.request(path, {
      ...option,
      method: 'get',
    })
  }

  public toInt(str: number | string): number | string {
    if (typeof str === 'number') return str
    if (!str) return str
    return parseInt(str, 10) || 0
  }

  /**
   * generate random string code providing length
   * @param length
   * @param uppercase
   * @param lowercase
   * @param numerical
   */
  public generateRandomCode(
    length: number,
    uppercase = true,
    lowercase = true,
    numerical = true,
  ): string {
    let result = ''
    const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz'
    const upperCaseAlphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numericalLetters = '0123456789'
    let characters = ''
    if (uppercase) {
      characters += upperCaseAlphabets
    }
    if (lowercase) {
      characters += lowerCaseAlphabets
    }
    if (numerical) {
      characters += numericalLetters
    }
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  public checkEmptyObject(obj: PlainObject) {
    return !obj || Object.keys(obj).length === 0
  }

  public checkIsNumStr(num: string | number) {
    return !Number.isNaN(Number(num))
  }

  public checkResData(table: Partial<IResponseOptions>, dealFn: IFunction) {
    const { errMsg, errCode } = table || {}
    return errMsg === undefined
      ? dealFn.call(this, table)
      : this.baseError(errMsg, errCode)
  }

  public checkFindDatas(table: string | Array<any>, errMsg = '记录未找到') {
    if (!table || typeof table === 'string') {
      return this.notFound(errMsg)
    }
    return table.length === 0
      ? this.notFound(errMsg)
      : this.success('查找成功', table)
  }

  public checkFindData(
    table: string | PlainObject,
    errMsg = '记录未找到',
    { needFormat = true }: { needFormat?: boolean } = {},
  ) {
    if (!table || typeof table === 'string') {
      return this.notFound(errMsg)
    }
    const data = needFormat ? this.formatOptions(table, this.allField) : table
    return Object.keys(data).length === 0
      ? this.notFound(errMsg)
      : this.success('查找成功', data)
  }

  public dealFnCatch(callback: () => any, errHandler?: IFunction): any {
    try {
      return callback()
    } catch (e) {
      this.writeTXTFile({
        writeFileName: Number(new Date()).toString(),
        writeFileData: e,
      })
      errHandler && errHandler(e)
    }
  }

  // set success data
  public success<T = IFormatData>(msg: string, data: T) {
    this.infoTip(msg)
    return this.baseSuccess(data)
  }

  // set failed msg
  public fail(error: string) {
    return this.baseError(error, EStatusCodesList.internalServerError)
  }

  // set notfount msg
  public notFound(error: string) {
    return this.baseError(error, EStatusCodesList.notFound)
  }

  // set noAuthorized msg
  public noAuthorized(error: string) {
    return this.baseError(error, EStatusCodesList.unauthorizedAccess)
  }

  // set Authorized msg
  public authorized(error: string) {
    return this.baseError(error, EStatusCodesList.authorizedAccess)
  }

  public formatTel(sTel: string) {
    return sTel ? sTel.replace(/(\d{3})(\d{4})(\d{4})/g, '$1****$3') : ''
  }

  public fakeTel(): string {
    return (
      '100' +
      Math.round(Math.random() * 10000000)
        .toString()
        .padEnd(8, '9')
    )
  }

  public randomString(len = 6) {
    const chars =
      'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    const maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }

  public readFile({ readFileName }: { readFileName: string }) {
    this.infoTip(`读取文件:${this.getSavePath(readFileName)}`)
    return fs.readFileSync(this.getSavePath(readFileName), 'utf-8')
  }

  public readFolder({
    readFileName,
    fnCallBack,
  }: {
    readFileName: string
    fnCallBack: (...param: any[]) => any
  }) {
    this.infoTip(`读取文件夹:${this.getSavePath(readFileName)}`)
    return fs
      .readdirSync(this.getSavePath(readFileName), 'utf-8')
      .map(fnCallBack)
  }

  public readJSONFile({
    readFileName,
    needDataFormat = true,
  }: {
    readFileName: string
    needDataFormat?: boolean
  }) {
    const res = this.readFile({
      readFileName: `./data/json/${this.formatFileNameWithDate(
        readFileName,
        needDataFormat,
      )}.json`,
    })
    return res ? JSON.parse(res) : res
  }

  public readMDFile({
    readFileName,
    needDataFormat = true,
  }: {
    readFileName: string
    needDataFormat?: boolean
  }) {
    return this.readFile({
      readFileName: `./data/md/${this.formatFileNameWithDate(
        readFileName,
        needDataFormat,
      )}.md`,
    })
  }

  public readTXTFile({
    readFileName,
    needDataFormat = true,
  }: {
    readFileName: string
    needDataFormat?: boolean
  }) {
    return this.readFile({
      readFileName: `./data/txt/${this.formatFileNameWithDate(
        readFileName,
        needDataFormat,
      )}.txt`,
    })
  }

  public writeFile({
    writeFileName,
    writeFileData,
  }: {
    writeFileName: string
    writeFileData: string
  }) {
    this.infoTip(`文件开始写入： ${this.getSavePath(writeFileName)}`)
    const savePath = this.getSavePath(writeFileName)
    // 生产环境不写入文件
    if (!this.isLocalEnv || !fs) {
      this.infoTip(`正式环境不写入文件： ${this.getSavePath(writeFileName)}`)
      return
    }
    // 如果文件夹不存在，则直接创建
    if (!fs.existsSync(path.dirname(savePath))) {
      fs.mkdirSync(path.dirname(savePath), { recursive: true })
    }
    typeof writeFileData !== 'string' &&
      (writeFileData = JSON.stringify(writeFileData, null, 2))
    fs.writeFileSync(savePath, writeFileData)
    this.infoTip(`文件写入成功： ${this.getSavePath(writeFileName)}`)
  }

  public writeJSONFile<T = string>({
    writeFileName,
    writeFileData,
  }: {
    writeFileName: string
    writeFileData: T
  }) {
    this.writeFile({
      writeFileName: `./data/json/${this.formatFileNameWithDate(
        writeFileName,
      )}.json`,
      writeFileData: JSON.stringify(writeFileData, null, 2),
    })
  }

  public writeMDFile({
    writeFileName,
    writeFileData,
  }: {
    writeFileName: string
    writeFileData: string
  }) {
    this.writeFile({
      writeFileName: `./data/md/${this.formatFileNameWithDate(
        writeFileName,
      )}.md`,
      writeFileData,
    })
  }

  public writeTXTFile({
    writeFileName,
    writeFileData,
  }: {
    writeFileName: string
    writeFileData: string
  }) {
    this.writeFile({
      writeFileName: `./data/txt/${this.formatFileNameWithDate(
        writeFileName,
      )}.txt`,
      writeFileData,
    })
  }

  public formatMdStr(str: string) {
    return str
      .replace(/\|\|/g, '|')
      .split('\n')
      .map((item) => {
        const defaultReg = /([^`\|])\|([^`\|])/g
        const tempStr = item.replace(defaultReg, '$1----$2')
        return tempStr
          .split('|')
          .join('\t')
          .replace('----', '|')
          .replace(/`/g, '')
      })
      .join('\n')
  }

  public formatArr2MD<T>({
    defaultData,
    titleArr,
    savePath,
  }: {
    defaultData: Array<T>
    titleArr: Array<string>
    savePath: string
  }) {
    const DEFAUlT_TAG = '|'
    this.infoTip(
      `获取数据长度 ：${defaultData.length} 标题数据长度 ：${titleArr.length}`,
    )
    let formatStr = `|${titleArr.join(`\`${DEFAUlT_TAG}\``)}|\n`
    defaultData.reduce(
      (_acc, curr) => (
        typeof curr === 'string'
          ? (formatStr += `|\`${curr}\`|`)
          : Object.keys(curr)
              .filter((_item, idx) => idx < titleArr.length)
              .map(
                (item) =>
                  (formatStr += `|${curr[item] ? `\`${curr[item]}\`` : ''}|`),
              )
              .join(` ${DEFAUlT_TAG} `),
        (formatStr += '\n')
      ),
      '',
    )
    this.infoTip(`转译完成`)
    this.writeMDFile({
      writeFileName: savePath,
      writeFileData: this.formatMdStr(formatStr),
    })
  }

  public formatObj2MD<T>({
    defaultData,
    titleArr,
    savePath,
  }: {
    defaultData: Record<string, T>
    titleArr: Array<string>
    savePath: string
  }) {
    const DEFAUlT_TAG = '|'
    let formatStr = `|${titleArr.join(DEFAUlT_TAG)}|\n`
    for (const name in defaultData) {
      const currItem = defaultData[name]
      Object.keys(currItem)
        .map(
          (item) =>
            (formatStr += `|${currItem[item] ? `\`${currItem[item]}\`` : ''}|`),
        )
        .join(` ${DEFAUlT_TAG} `)
      formatStr += '\n'
    }
    this.writeMDFile({
      writeFileName: savePath,
      writeFileData: this.formatMdStr(formatStr),
    })
  }

  public tranTxt2BaseArr({
    sTxt,
    isObject = false,
    titleNameIndex,
    fnCallBack,
  }: {
    sTxt: string
    isObject: boolean
    titleNameIndex: number
    fnCallBack: IFunction
  }) {
    if (!sTxt) {
      return isObject ? {} : []
    }
    const baseArr = sTxt.split('\n').map((item) => item.split('\t'))
    this.otherInfoTip(`分割之后的长度是：${baseArr.length}`)
    if (!isObject) {
      return baseArr
    }
    const repeatArr = []
    const res = baseArr.reduce((acc, cur, idx) => {
      if (!cur[titleNameIndex]) {
        this.otherInfoTip(`第${idx} 行 title 字段有误`, titleNameIndex, cur)
        return acc
      }
      if (!acc[cur[titleNameIndex]]) {
        acc[cur[titleNameIndex]] = {}
      } else {
        // 之前已经读写过
        this.otherInfoTip(
          '已经读写过',
          titleNameIndex,
          cur[titleNameIndex],
          cur,
        )
        repeatArr.push(cur)
      }
      fnCallBack ? fnCallBack(acc, cur) : (acc[cur[titleNameIndex]] = cur)
      return acc
    }, {})
    this.otherInfoTip(`转换成对象之后的长度是：${Object.keys(res).length}`)
    this.otherInfoTip(`重复读写过 ${repeatArr.length}`)
    repeatArr.length &&
      this.writeJSONFile({
        writeFileName: 'repeatArr',
        writeFileData: repeatArr,
      })
    return res
  }

  public checkSameObj(
    data: PlainObject,
    compareData: PlainObject,
    whiteParams: string[] = [],
    option: { checkEmpty?: boolean } = { checkEmpty: true },
  ) {
    let isSame = true
    for (const item in data) {
      const param = item as keyof typeof compareData
      if (whiteParams.includes(item)) {
        continue
      }

      const checkEmpty = option.checkEmpty ? true : Boolean(data[param])
      if (checkEmpty && !Object.is(data[param], compareData[param])) {
        this.writeJSONFile({
          writeFileName: `${Number(new Date()).toString()}-${param}`,
          writeFileData: {
            diffParam: param,
            currData: data,
            oldData: compareData,
          },
        })
        isSame = false
        break
      }
    }
    return isSame
  }

  public pathResolve(sPath: string): string {
    return path.resolve(process.cwd(), sPath)
  }

  // 图片在线地址校验
  public checkOnlineImagePath(imagePath = '') {
    const imagePathReg = /^https:\/\/.+\.jpeg|\.jpg|\.png$/
    return imagePathReg.test(imagePath)
  }

  private formatFileNameWithDate(name: string, needDataFormat = true): string {
    return needDataFormat
      ? `${name}_${new Date().toLocaleDateString().replace(/\//g, '-')}`
      : name
  }

  private getSavePath(fileName: string): string {
    return this.pathResolve(`./temp/${fileName}`)
  }

  // 格式化下划线参数为驼峰参数，便于使用
  private mapObjAttr(
    data: IFormatData,
    formatFn: (attr: string) => string,
  ): IFormatData {
    if (!data) {
      return data
    }
    const res = {}
    for (const attr in data) {
      res[formatFn(attr)] = data[attr]
    }
    return res
  }

  private camelCase(word: string) {
    word = word.toLowerCase()
    return word.replace(
      /[a-z]*(?:_)*/g,
      (marchWord: string, marchIndex: number) => {
        if (!marchWord) {
          return ''
        }
        const letterArray = marchWord.split('')
        const firstLetter =
          marchIndex !== 0
            ? String(letterArray[0]).toUpperCase()
            : letterArray[0]
        const hasSymbol = letterArray[letterArray.length - 1] === '_'
        const otherLetter = hasSymbol
          ? letterArray.slice(1, -1)
          : letterArray.slice(1)
        return firstLetter + otherLetter.join('')
      },
    )
  }

  public logger = new Logger(BaseService.name)
}
