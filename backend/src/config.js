
module.exports = {
  isDev: (process.env.NODE_ENV !== 'production'),
  isGitlab: process.env.IS_GITLAB === 'true' ? true : false,
  port: (+process.env.PORT) || 1337,
  jwtSecret: process.env.JWT_SECRET || "mysecretkey",
  db: {
    host: process.env.DB_HOST || 'postgres',
    user: process.env.DB_USER || 'vagrant',
    pass: process.env.DB_PASS || 'vagrant',
    port: +process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'pkeeper'
  }
};
