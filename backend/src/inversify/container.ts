import { Container } from 'inversify';
import { authModule } from './bindings/auth.bindings';
import { serviceModule } from './bindings/service.bindings';
import { adminModule } from './bindings/admin.bindings';
import { userModule } from './bindings/user.bindings';

const container = new Container({ defaultScope: 'Singleton' });

container.load(authModule, serviceModule, adminModule, userModule);

export default container;
