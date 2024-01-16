import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable, ReplaySubject, tap, toArray } from "rxjs";
import { HelloRequest, HelloResponse, Hero } from "../hero.controller";

// proto파일에 정의된 Service를 인터페이스로 구현해줌
interface HeroesService {
    findOne(data: { id: number }): Observable<any>;
    find({}): Observable<any>;
}

interface HelloService {
    bidiHello(upstream: Observable<HelloRequest>): Observable<HelloResponse>;
    lotsOfGreetings(
        upstream: Observable<HelloRequest>,
    ): Observable<HelloResponse>;
}

@Injectable()
export class HeroClientService implements OnModuleInit {

    private heroesService: HeroesService;
    private helloService: HelloService;

    constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc){}

    onModuleInit(): any {
        this.heroesService = this.client.getService<HeroesService>('HeroesService');
        this.helloService = this.client.getService<HelloService>('HelloService');
    }

    findOne(): any {
        return this.heroesService.findOne({ id: 1 })
            .pipe(tap({
                next: result => {
                    console.log(result);
                    
                }
            }));
        // .subscribe({
        //     next: (result) => {
        //         console.log('클라이언트',result);
                
        //     }
        // });
    }

    find(): Observable<Hero[]> {
        return this.heroesService.find({})
            .pipe(toArray());
    }

    sendStreamReq(){
        const helloRequest$ = new ReplaySubject<HelloRequest>();

        helloRequest$.next({greeting: 'Hello (1)!'});
        helloRequest$.next({greeting: 'Hello (2)!'});
        helloRequest$.complete();

        return this.helloService.bidiHello(helloRequest$);
    }

}