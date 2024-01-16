import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamCall, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata, ServerDuplexStream, ServerUnaryCall } from '@grpc/grpc-js';
import { Observable, Subject, from } from 'rxjs';

export interface HeroById {
  id: number;
}

export interface Hero {
  id: number;
  name: string;
}

export interface HelloRequest {
  greeting: string;
}

export interface HelloResponse {
  reply: string;
}

export interface Void{}

@Controller()
export class HeroesService {
  @GrpcMethod() // ('프로토 서비스', '프로토 핸들러') 둘 모두 생략 가능하며 이 경우 클래스 이름과 메서드 이름과 매칭됨
  findOne(data: HeroById, metadata: Metadata, call: ServerUnaryCall<any, any>) {
    console.log(JSON.stringify(metadata.toHttp2Headers()));
    
    const responseMetadata = new Metadata();
    responseMetadata.add('Custom', 'please');
    console.log(responseMetadata.getMap());
    call.sendMetadata(responseMetadata);
    
    console.log(`메타데이터 확인 ${JSON.stringify(responseMetadata.getMap())}`);
    const tmp = responseMetadata.getMap();
    console.log(tmp);
    
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];

    
    
    return items.find(({ id }) => id === data.id);
    // return {meta : JSON.stringify(responseMetadata.getMap())};
  }

  @GrpcMethod()
  find(data: Void, metadata: Metadata, call: ServerDuplexStream<any, any>): Observable<Hero>{
    console.log(`find호출, 메타데이터 확인 ${JSON.stringify(metadata)}`);
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'John2' },
      { id: 3, name: 'John3' },
      { id: 4, name: 'John4' },
      { id: 5, name: 'John5' },
    ];

    return from(items);
  }

  @GrpcStreamMethod('HelloService')
  bidiHello(messages: Observable<any>, metadata: Metadata, call: ServerDuplexStream<any, any>): Observable<any> {
    const subject = new Subject();

    const responseMetadata = new Metadata();
    responseMetadata.add('Set-Cookie', 'yummy_cookie=choco');
    call.sendMetadata(responseMetadata);

    const onNext = message => {
      console.log('tnwjd',message);
      subject.next({
        reply: 'Hello, world!',
        meta: JSON.stringify(responseMetadata.clone().getMap())
      });
    };
    const onComplete = () => subject.complete();
    messages.subscribe({
      next: onNext,
      complete: onComplete,
    });

    // const newMeta = new Metadata();
    // newMeta.set('custom', '제발');
    // call.sendMetadata(newMeta);

    return subject.asObservable();
  }

  // @GrpcStreamCall()
  // bidiHello(requestStream: any){
  //   requestStream.on('data', message => {
  //     console.log('서버', message);
  //     requestStream.write({
  //       reply: 'Hello, world!'
  //     })
  //   })
  // }

  @GrpcStreamCall()
  lotsOfGreetings(requestStream: any, callback: (err: unknown, value: HelloResponse) => void){
    requestStream.on('data', message => {
      console.log(message);
    });
    requestStream.on('end', ( )=> callback(null, {reply: 'Hello, world!'}));
  }
}