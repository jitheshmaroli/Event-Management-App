import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import { IAuthService } from '@/interfaces/services/IAuthService';
import { UserRepository } from '@/repositories/UserRepository';
import { AuthService } from '@/services/AuthService';
import { AuthController } from '@/controllers/AuthController';

export const authModule = new ContainerModule(({ bind }) => {
  bind<IUserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

  bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

  bind<AuthController>(TYPES.AuthController)
    .to(AuthController)
    .inSingletonScope();
});
