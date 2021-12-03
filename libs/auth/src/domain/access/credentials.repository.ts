import { MongoDbRepository } from '@app/mongodb-utils/mongodb.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Credentials } from './credentials';

@Injectable()
export class CredentialsRepository extends MongoDbRepository<Credentials> {
  constructor(@InjectModel(Credentials.name) model: Model<Credentials>) {
    super(model, Credentials);
  }

  findByUserId(userId: string): Promise<Credentials> {
    return this.find({ userId: userId }, 1, 1).then((result) => result[0]);
  }
}
