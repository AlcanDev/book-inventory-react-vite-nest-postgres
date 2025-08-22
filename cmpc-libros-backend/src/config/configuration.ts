export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  env: process.env.NODE_ENV ?? 'development',
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    name: process.env.DB_NAME ?? 'cmpc_libros',
    user: process.env.DB_USER ?? 'cmpc',
    pass: process.env.DB_PASS ?? 'cmpc_password',
  },
});
