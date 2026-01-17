import { Container } from 'inversify';
import { authModule } from './bindings/autn.bindings';

const container = new Container({ defaultScope: 'Singleton' });

container.load(authModule);

export default container;
