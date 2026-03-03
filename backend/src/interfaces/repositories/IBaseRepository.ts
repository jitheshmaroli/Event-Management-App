/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ClientSession,
  UpdateQuery,
  ProjectionType,
  QueryOptions,
  QueryFilter,
} from 'mongoose';

export interface IBaseRepository<T> {
  create(entity: Partial<T> | T, session?: ClientSession): Promise<T>;
  findById(id: string, session?: ClientSession): Promise<T | null>;
  findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions
  ): Promise<T | null>;
  findMany(
    filter: QueryFilter<T>,
    options?: {
      skip?: number;
      limit?: number;
      sort?: Record<string, 1 | -1 | string>;
      populate?: any;
      projection?: any;
      session?: ClientSession;
    }
  ): Promise<T[]>;
  updateById(
    id: string,
    updates: UpdateQuery<T>,
    session?: ClientSession
  ): Promise<T | null>;
  updateOne(
    filter: QueryFilter<T>,
    updates: UpdateQuery<T>,
    session?: ClientSession
  ): Promise<boolean>;
  deleteById(id: string, session?: ClientSession): Promise<boolean>;
  count(filter: QueryFilter<T>): Promise<number>;
}
