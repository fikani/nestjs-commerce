import { Repository } from '@app/common/repository';
import { MongodbUtilsModule } from '@app/mongodb-utils';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { BaseApi } from './base.api';
import { Entity } from './base.dto';

@Module({})
export class CrudModule {
  static forFeature<T extends Entity, K extends BaseApi<T>>(data: {
    entityClass: ClassConstructor<T>;
    entitySchema: any;
    repository?: ClassConstructor<Repository<T>>;
    api?: ClassConstructor<K>;
  }): DynamicModule {
    const providers = [...CrudModule.getApiProvider(data)];
    const imports = [];

    if (data.repository) {
      providers.push({
        provide: `${data.entityClass.name}Repository`,
        useClass: data.repository,
      });
    } else {
      imports.push(
        MongodbUtilsModule.repository([
          {
            entityClass: data.entityClass,
            entitySchema: data.entitySchema,
          },
        ]),
      );
    }

    return {
      module: CrudModule,
      controllers: [],
      providers: providers,
      exports: providers,
      imports: imports,
    };
  }

  private static getApiProvider(data) {
    if (data.api) {
      return [
        data.api,
        {
          provide: `${data.entityClass.name}Api`,
          useExisting: data.api,
        },
      ];
    }

    return [
      {
        provide: `${data.entityClass.name}Api`,
        useFactory: async (repository) =>
          new BaseApi(repository, data.entityClass),
        inject: [`${data.entityClass.name}Repository`],
      },
    ];
  }
}
