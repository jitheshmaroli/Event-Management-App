import { UserController } from '@/controllers/UserController';
import { IUserService } from '@/interfaces/services/IUserService';
import { UserService } from '@/services/UserService';
import { ContainerModule } from 'inversify';
import { TYPES } from '../types';

export const userModule = new ContainerModule(({ bind }) => {
  bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
  bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inSingletonScope();
});
