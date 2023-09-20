import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratorGeneratorModule } from './generator/generatorGenerator.module';
import { LampsNotificationModule } from './notification/lamp/lampNotification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    GeneratorGeneratorModule,
    LampsNotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
