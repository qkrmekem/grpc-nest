import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroesService } from './hero.controller';
import { HeroClientModule } from './client/hero.client.module';

@Module({
  imports: [HeroClientModule],
  controllers: [HeroesService],
  providers: [HeroService],
})
export class HeroModule {}
