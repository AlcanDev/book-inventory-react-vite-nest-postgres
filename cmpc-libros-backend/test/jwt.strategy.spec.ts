import { JwtStrategy } from '../src/auth/jwt.strategy';

describe('JwtStrategy', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: 'testsecret' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('debe estar definido', () => {
    const strategy = new JwtStrategy();
    expect(strategy).toBeInstanceOf(JwtStrategy);
  });
});
