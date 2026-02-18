import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import { ServiceRepository } from '@/repositories/ServiceRepository';
import { ServiceService } from '@/services/ServiceService';
import { ServiceController } from '@/controllers/ServiceController';
import { IServiceRepository } from '@/interfaces/repositories/IServiceRepository';
import { IServiceService } from '@/interfaces/services/IServiceService';

export const serviceModule = new ContainerModule(({ bind }) => {
  bind<IServiceRepository>(TYPES.ServiceRepository)
    .to(ServiceRepository)
    .inSingletonScope();
  bind<IServiceService>(TYPES.ServiceService)
    .to(ServiceService)
    .inSingletonScope();
  bind<ServiceController>(TYPES.ServiceController)
    .to(ServiceController)
    .inSingletonScope();
});
