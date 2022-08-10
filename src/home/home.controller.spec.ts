import { Test, TestingModule } from '@nestjs/testing'
import { HomeController } from './home.controller'
import { HomeService } from './home.service'

describe('AppController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [HomeService],
    }).compile()
  })

  describe('getHello', () => {
    it('should return "Hello eva!"', () => {
      const homeController = app.get<HomeController>(HomeController)
      expect(homeController.getHello()).toBe('Hello eva!')
    })
  })
})
