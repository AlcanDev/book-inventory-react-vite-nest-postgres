import { ArgumentsHost, HttpException } from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/filters/http-exception.filter';

function mockHost(): ArgumentsHost {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const getResponse = () => ({ status });
  const getRequest = () => ({ url: '/x', method: 'GET' });
  return {
    switchToHttp: () => ({ getResponse, getRequest }),
  } as unknown as ArgumentsHost;
}

describe('HttpExceptionFilter', () => {
  it('instancia sin errores y llama a response.status', () => {
    const filter = new AllExceptionsFilter();
    const host = mockHost();
    const ex = new HttpException('fail', 418);

    filter.catch(ex, host);

    expect(
      (host.switchToHttp() as any).getResponse().status,
    ).toHaveBeenCalledWith(418);
  });
});
