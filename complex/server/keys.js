module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REFIS_PORT,
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT,
  ssl:
    process.env.NODE_ENV !== "production"
      ? false
      : { rejectUnauthoried: false },
};
