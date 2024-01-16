import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { HeroClientService } from "./hero.client.service";
import { HeorClientController } from "./hero.client.controller";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'HERO_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'hero',
                    protoPath: join(__dirname, '../hero.proto'),
                },
            },
        ]),
    ],
    providers: [HeroClientService],
    controllers: [HeorClientController]
})
export class HeroClientModule{}