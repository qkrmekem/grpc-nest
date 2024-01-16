import { Test, TestingModule } from '@nestjs/testing';
import { HeroesService } from './hero.controller';
import { HeroService } from './hero.service';

describe('HeroController', () => {
  let controller: HeroesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroesService],
      providers: [HeroService],
    }).compile();

    controller = module.get<HeroesService>(HeroesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
