# Nest + yuque

Nest.js + typescript + axios + swagger + yuque

## Project description

Nest.js + swagger-based Wordbird document processing backend service project

Full functional description, [Chinese version description](./README_CN.md)

- Yuque API docking, only write to the specified knowledge base write documents and read the specified knowledge base documents
  - For more API docking, please see the official documentation <https://www.yuque.com/yuque/developer> Yuque
- Standardized the global config configuration access specification
- Global logger middleware and global exception catch handling
- `axios`
- 'Commitlint', 'Eslint', 'Prettier' and 'Husky'
- 'jest' and 'e2e'
- 'cron' nest's scheduled service requests
- Request data to be automatically written to a local folder

The interface returns the specification

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

## Project usage

#### Clone project

```sh
git clone https://github.com/mowatermelon/nestjs-yuque.git
cd nestjs-yuque
```

#### Install dependencies

```sh
npm i
```

#### Local development

```bash
# development with watch
$ npm run start

# production mode
$ npm run start:prod
```

#### Configure the sparrow information

> Pass [The official instructions for obtaining token steps](https://www.yuque.com/yuque/developer/api#785a3731) edit `src/config/yuque.ts` configuration

**All open APIs need to be authenticated by a token before they can be accessed, and the domain name of the API to access the API under a space needs to use the domain name corresponding to the space**

![Personal private token](https://cdn.nlark.com/yuque/0/2019/png/84145/1556263208113-272c18c0-2608-48b5-81b0-141b49ef432f.png?x-oss-process=image%2Fresize%2Cw_2022%2Climit_0)

```typescript
export const yuqueConfig: IYuqueConfig = {
  api: 'https://www.yuque.com/api/', // The requested address of the Historical Knowledge Group
  xApi: 'https://eva.yuque.com', // Replace it with the address of your own knowledge space
  token: '',
  // Replace it with the ID of your personal knowledge group/space
  groupId: 11111,
  csrfToken: '',
  csrfSession: '',
}
```

#### View the interface documentation information

visit <localhost:3001/swagger>

![image](https://user-images.githubusercontent.com/18508817/183946136-cebfeb5d-094f-4641-9540-f480ee0bd138.png)


#### Build the nestjs project

```sh
npm run build
```

## A description of the file structure

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

**Some of the more important root profiles**

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

## Additional notes

- Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
- Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
