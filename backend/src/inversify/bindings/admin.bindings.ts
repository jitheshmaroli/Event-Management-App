import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import { AdminController } from '@/controllers/AdminController';
import { IAdminService } from '@/interfaces/services/IAdminService';
import { AdminService } from '@/services/AdminService';

export const adminModule = new ContainerModule(({ bind }) => {
  bind<IAdminService>(TYPES.AdminService).to(AdminService).inSingletonScope();
  bind<AdminController>(TYPES.AdminController)
    .to(AdminController)
    .inSingletonScope();
});
