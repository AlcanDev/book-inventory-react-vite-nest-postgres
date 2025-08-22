import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  it('debe estar definido y retornar saludo', () => {
    const svc = new AppService();
    const ctrl = new AppController(svc);
    expect(ctrl.getHello()).toBeDefined();
  });
});
