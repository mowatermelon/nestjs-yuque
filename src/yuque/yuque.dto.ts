import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export interface IRequestPathConfig {
  isBase?: boolean
  isDefault?: boolean
  jumpType?: string
}

export interface IYuqueUser {
  id: number
  type: string
  login: string
  name: string
  description: string
  avatar_url: string
  followers_count: number
  following_count: number
  created_at: string
  updated_at: string
  _serializer: string
}

export interface IYuqueRepo {
  id: number
  type: 'Book' | '文档'
  slug: string
  name: string
  user_id: number
  description: string
  creator_id: number
  public: number
  items_count: number
  likes_count: number
  watches_count: number
  content_updated_at: string
  updated_at: string
  created_at: string
  namespace: string
  user: IYuqueUser
  _serializer: string
}
export type IYuqueCatalogType = 'insert' | 'remove' | 'edit'

export type IYuqueMenuType = 'TITLE' | 'LINK' | 'DOC'

export interface IYuqueDocsDetail {
  bodyHtml?: string
  title?: string
  slug?: string
  public?: number
  format?: string
  body?: string
  id?: number
  book_id?: number
  book?: IYuqueRepo
  user_id?: number
  creator?: IYuqueUser
  body_lake?: string
  body_draft_lake?: string
  status?: number
  view_status?: number
  read_status?: number
  likes_count?: number
  comments_count?: number
  content_updated_at?: string
  deleted_at?: string
  createdAt?: string
  created_at?: string
  updated_at?: string
  published_at?: string
  first_published_at?: string
  word_count?: number
  cover?: string
  description?: string
  custom_description?: string
  hits?: number
  _serializer?: string
}

export interface IYuqueTag {
  book_id: number
  doc_id: number
  id: number
  title: string
  user_id: number
  _serializer: string
}

export class WriteContentDTO implements IYuqueDocsDetail {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public title: string // 标题

  @ApiPropertyOptional()
  @IsString()
  public slug?: string // 文档 Slug

  @ApiPropertyOptional()
  @IsNumber()
  public open?: number // 0 - 私密，1 - 公开  4 仅成员可见

  @ApiPropertyOptional()
  @IsString()
  public format?: string
  // 支持 markdown 和 lake，默认为 markdown
  //  markdown, asl, lake, lakex, spreadjs, html, lakesheet, lakesheet_html, text, lakemind, lakeshow, laketable

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public body: string // format 描述的正文内容，最大允许 5MB
}
