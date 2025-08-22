import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('TransformInterceptor', () => {
  it('debe estar definido', () => {
    const interceptor = new TransformInterceptor();
    expect(interceptor).toBeInstanceOf(TransformInterceptor);
  });
});
