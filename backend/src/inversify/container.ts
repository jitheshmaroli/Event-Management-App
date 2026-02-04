import { Container } from 'inversify';
import { authModule } from './bindings/autn.bindings';
import { serviceModule } from './bindings/service.bindings';

const container = new Container({ defaultScope: 'Singleton' });

container.load(authModule, serviceModule);

export default container;
