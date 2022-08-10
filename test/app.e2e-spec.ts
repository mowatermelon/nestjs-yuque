import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { HomeModule } from './../src/home/home.module'
import { INestApplication } from '@nestjs/common'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [HomeModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/home (GET)', () => {
    return request(app.getHttpServer())
      .get('/home')
      .expect(200)
      .expect('Hello eva!')
  })
})
