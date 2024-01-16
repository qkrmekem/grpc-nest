import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ServerCredentials } from '@grpc/grpc-js';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'hero',
  //     protoPath: join(__dirname, './hero/hero.proto'),
  //   },
  // });
  // await app.listen();

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      credentials: ServerCredentials.createInsecure(),
      protoPath: join(__dirname, './hero/hero.proto'),
    }
  })

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
