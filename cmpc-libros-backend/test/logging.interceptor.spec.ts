import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

describe('LoggingInterceptor', () => {
  it('debe estar definido', () => {
    const interceptor = new LoggingInterceptor();
    expect(interceptor).toBeInstanceOf(LoggingInterceptor);
  });
});
