import { Controller, Get, Inject } from "@nestjs/common";
import { HeroClientService } from "./hero.client.service";
import { Observable } from "rxjs";
import { Metadata } from "@grpc/grpc-js";
import { ClientGrpc } from "@nestjs/microservices";


@Controller('/hero-client/v1')
export class HeorClientController{
    constructor(private readonly heroClientService: HeroClientService){}

    @Get('/heroes')
    test(): Observable<any> {
        return this.heroClientService.findOne();
    }

    @Get('/many')
    many(): Observable<any>{
        return this.heroClientService.find();
    }

    @Get('/stream')
    stream(): Observable<any> {
        return this.heroClientService.sendStreamReq();
    }

}