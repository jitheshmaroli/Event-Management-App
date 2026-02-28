import {
  Model,
  ClientSession,
  UpdateQuery,
  ProjectionType,
  QueryOptions,
  QueryFilter,
} from 'mongoose';
import { IBaseRepository } from '@/interfaces/repositories/IBaseRepository';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(entity: Partial<T> | T, session?: ClientSession): Promise<T> {
    const doc = new this.model(entity);
    const saved = session ? await doc.save({ session }) : await doc.save();
    return saved.toObject() as T;
  }

  async findById(id: string, session?: ClientSession): Promise<T | null> {
    const query = this.model.findById(id);
    if (session) query.session(session);
    const doc = await query.lean().exec();
    return doc as T | null;
  }

  async findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions
  ): Promise<T | null> {
    return this.model
      .findOne(filter, projection, options)
      .lean()
      .exec() as Promise<T | null>;
  }

  async findMany(
    filter: QueryFilter<T>,
    options: {
      skip?: number;
      limit?: number;
      sort?: Record<string, 1 | -1 | string>;
      populate?: string | string[];
      session?: ClientSession;
    } = {}
  ): Promise<T[]> {
    let query = this.model.find(filter);

    if (options.session) query = query.session(options.session);
    if (options.skip !== undefined) query = query.skip(options.skip);
    if (options.limit !== undefined) query = query.limit(options.limit);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (options.sort) query = query.sort(options.sort as any);
    if (options.populate) query = query.populate(options.populate);

    return query.lean().exec() as Promise<T[]>;
  }

  async updateById(
    id: string,
    updates: UpdateQuery<T>,
    session?: ClientSession
  ): Promise<T | null> {
    const query = this.model.findByIdAndUpdate(id, updates, { new: true });
    if (session) query.session(session);
    const doc = await query.lean().exec();
    return doc as T | null;
  }

  async updateOne(
    filter: QueryFilter<T>,
    updates: UpdateQuery<T>,
    session?: ClientSession
  ): Promise<boolean> {
    const result = await this.model
      .updateOne(filter, updates, { session })
      .exec();
    return result.modifiedCount === 1;
  }

  async deleteById(id: string, session?: ClientSession): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id, { session }).exec();
    return !!result;
  }

  async count(filter: QueryFilter<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
