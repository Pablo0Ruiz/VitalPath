export const EnvConfig = () => ({
  enviroment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3002,
  mongo_uri: process.env.MONGO_URI,
  mongo_db_name: process.env.MONGO_DB_NAME,
});
