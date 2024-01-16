import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerDuplexStream, ServerUnaryCall } from '@grpc/grpc-js';
import { Observable, from } from 'rxjs';

export interface HeroById {
  id: number;
}

export interface Hero {
  id: number;
  name: string;
}

export interface Void{}

@Controller()
export class HeroesService {
  @GrpcMethod() // ('프로토 서비스', '프로토 핸들러') 둘 모두 생략 가능하며 이 경우 클래스 이름과 메서드 이름과 매칭됨
  findOne(data: HeroById, metadata: Metadata, call: ServerUnaryCall<any, any>) {
    
    const responseMetadata = new Metadata();
    responseMetadata.add('Custom', 'please');
    call.sendMetadata(responseMetadata);
    
    console.log(`메타데이터 확인 ${JSON.stringify(metadata)}`);
    
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];
    
    return items.find(({ id }) => id === data.id);
    // return header;
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
}