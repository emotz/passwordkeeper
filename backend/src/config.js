
module.exports = {
  isDev: (process.env.NODE_ENV !== 'production'),
  isGitlab: process.env.IS_GITLAB === 'true' ? true : false,
  port: process.env.PORT || 1337,
  jwtSecret: process.env.JWT_SECRET || "mysecretkey"
};
