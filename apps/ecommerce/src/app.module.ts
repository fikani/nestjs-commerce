import { CatalogModule } from '@app/catalog/catalog.module';
import { CrudModule } from '@app/crud';
import { MongodbUtilsModule } from '@app/mongodb-utils';
import { Module } from '@nestjs/common';
import { AuthModule } from 'libs/auth/src/auth.module';
import { Example } from './example';
import { ExampleSchema } from './example.schema';

@Module({
  imports: [
    MongodbUtilsModule,

    CrudModule.forFeature({
      entityClass: Example,
      entitySchema: ExampleSchema,
    }),
    AuthModule,
    CatalogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
