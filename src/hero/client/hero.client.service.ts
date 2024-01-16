import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable, toArray } from "rxjs";
import { Hero } from "../hero.controller";

// proto파일에 정의된 Service를 인터페이스로 구현해줌
interface HeroesService {
    findOne(data: { id: number }): Observable<any>;
    find({}): Observable<any>;
}

@Injectable()
export class HeroClientService implements OnModuleInit {

    private heroesService: HeroesService;

    constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc){}

    onModuleInit(): any {
        this.heroesService = this.client.getService<HeroesService>('HeroesService');
    }

    findOne(): any {
        return this.heroesService.findOne({ id: 1 })
        .subscribe({
            next: (result) => {
                console.log('클라이언트',result);
                
            }
        });
    }

    find(): Observable<Hero[]> {
        return this.heroesService.find({})
            .pipe(toArray());
    }

}