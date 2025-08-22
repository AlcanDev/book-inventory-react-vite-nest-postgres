import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

function makeHost() {
  const res: any = {
    statusCode: 0,
    body: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    },
  };
  const host: ArgumentsHost = {
    switchToHttp: () => ({
      getResponse: () => res,
      getRequest: () => ({ url: '/x' }),
    }),
  } as any;
  return { host, res };
}

describe('HttpExceptionFilter branches', () => {
  it('maneja errores genéricos (no HttpException) como 500', () => {
    const filter = new AllExceptionsFilter();
    const { host, res } = makeHost();

    filter.catch(new Error('boom'), host);

    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/x',
      }),
    );
  });

  it('mantiene status y payload cuando es HttpException', () => {
    const filter = new AllExceptionsFilter();
    const { host, res } = makeHost();

    filter.catch(
      new HttpException({ message: 'bad' }, HttpStatus.BAD_REQUEST),
      host,
    );

    expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/x',
      }),
    );
  });
});
