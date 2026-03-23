export const EnvConfig = () => ({
  enviroment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3002,
  mongo_uri: process.env.MONGO_URI,
  mongo_db_name: process.env.MONGO_DB_NAME,
  jwt_secret: process.env.JWT_SECRET,
  frontend_url: process.env.FRONTEND_URL,
  mail_host: process.env.MAIL_HOST,
  mail_port: process.env.MAIL_PORT,
  mail_user: process.env.MAIL_USER,
  mail_pass: process.env.MAIL_PASS,
});
