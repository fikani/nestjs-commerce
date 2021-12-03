import { DynamicModule, Global, Inject, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ClassConstructor } from 'class-transformer';
import { MongoDbRepository } from './mongodb.repository';

@Global()
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
  providers: [],
  exports: [],
})
export class MongodbUtilsModule {
  /** Creates repository as  EntityRepository*/
  static repository(
    configs: {
      entityClass: ClassConstructor<any>;
      entitySchema: any;
    }[],
  ): DynamicModule {
    return {
      module: MongodbUtilsModule,
      imports: [
        MongooseModule.forFeature(
          configs.map((data) => ({
            name: data.entityClass.name,
            collection: data.entityClass.name,
            schema: data.entitySchema,
          })),
        ),
      ],
      providers: configs
        .map((data) => [
          {
            provide: `${data.entityClass.name}Repository`,
            useFactory: async (model) =>
              new MongoDbRepository(model, data.entityClass),
            inject: [getModelToken(data.entityClass.name)],
          },
          {
            provide: `${data.entityClass.name}Class`,
            useValue: data.entityClass,
          },
        ])
        .flat(),

      exports: configs
        .map((data) => [
          `${data.entityClass.name}Repository`,
          `${data.entityClass.name}Class`,
        ])
        .flat(),
    };
  }
}
