# Nest + yuque

Nest.js + typescript + axios + swagger + yuque

## 项目说明

基于 Nest.js + swagger 的语雀文档处理后端服务项目

完整功能说明

- 语雀 api 对接,只写了给指定知识库写入文档和读取指定知识库文档
  - 更多 api 对接可以查看语雀官方文档 <https://www.yuque.com/yuque/developer>
- 规范了全局 config 配置接入规范
- 全局的 logger 中间件和全局的异常捕获处理
- `axios`
- `commitlint` ,`eslint`,`prettier`和 `husky`
- `jest` 和 `e2e`
- `cron` nest 的定时服务请求
- 请求数据自动写入本地文件夹

接口返回规范

```typescript
export interface IResponseOptions<T = any, R = IResponseCount> {
  success: boolean
  count?: number
  counts?: R
  data?: T
  errMsg?: string
  errCode?: number
}
```

## 项目使用

#### clone 项目

```sh
git clone https://github.com/mowatermelon/nestjs-yuque.git
cd nestjs-yuque
```

#### 安装依赖

```sh
npm i
```

#### 本地开发

```bash
# development with watch
$ npm run start

# production mode
$ npm run start:prod
```

#### 配置语雀信息

> 通过 [官方说明获取 token 步骤](https://www.yuque.com/yuque/developer/api#785a3731)修改 src/config/yuque.ts 配置

**语雀所有的开放 API 都需要 Token 验证之后才能访问,空间下访问 API 的域名需要使用空间对应的域名**

![Personal private token](https://cdn.nlark.com/yuque/0/2019/png/84145/1556263208113-272c18c0-2608-48b5-81b0-141b49ef432f.png?x-oss-process=image%2Fresize%2Cw_2022%2Climit_0)

```typescript
export const yuqueConfig: IYuqueConfig = {
  api: 'https://www.yuque.com/api/', // 历史知识小组的请求地址
  xApi: 'https://eva.yuque.com', // 替换成你自己的知识空间的地址
  token: '',
  // 替换成个人专属的知识小组/空间的 id
  groupId: 11111,
  csrfToken: '',
  csrfSession: '',
}
```

#### 查看接口文档信息

访问 <localhost:3001/swagger>

#### 构建 nestjs 项目

```sh
npm run build
```

#### 测试项目

```sh
# 单元测试
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 文件结构说明

```text
nestjs-yuque
├── coverage                                * Coverage reports after running `yarn coverage` command.
├── dist                                    * Optimized code for production after `yarn build` is run.
├── src
│   └── <module>                            * Folder where specific modules all files are stored
│       └── dto                             * Data Transfer Objects.
│       └── entity                          * Models for module.
│       └── pipes                           * Includes validation pipes for NestJS modules.
│       └── serializer                      * Includes serializer for model data.
│       └── <module>.controller.ts          * Controller file.
│       └── <module>.controller.spec.ts     * Test file for Controller.
│       └── <module>.module.ts              * root module file for module.
│       └── <module>.service.ts             * Service file for <module>.
│       └── <module>.service.spec.ts        * Test file for service.
│       └── <module>.repository.ts          * Repository file for <module>.
│       └── <module>.repository.spec.ts     * Test file for repository.
│   └── common                              * Common helpers function, dto, entity, exception, decorators etc.
│   └── config                              * Configuration variables files.
│   └── app.module.ts                       * Root module of the application.
│   └── main.ts                             * The entry file of the application which uses the core function NestFactory to create a Nest application instance.
├── test                                    * Contains E2E tests
```

**一些比较重要的根配置文件**

```text
.
├── .editorconfig                           * Coding styles (also by programming language).
├── .env                                    * Environment variables for docker.
├── .prettierrc.js                          * Formatting Prettier options.
├── .eslintrc.js                            * ESLint configuration and rules.
├── .docker-compose.yml                     * Docker compose configuration.
├── Dockerfile                              * Docker file for prod environment.
├── Dockerfile.dev                          * Docker file for dev environment.
├── tsconfig.json                           * Typescript configuration for application.
```

## 其他说明

- Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
- Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
