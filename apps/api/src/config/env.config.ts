export const EnvConfig = () => ({
  enviroment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3002,
  mongo_uri: process.env.MONGO_URI,
  mongo_db_name: process.env.MONGO_DB_NAME,
  jwt_secret: process.env.JWT_SECRET,
  frontend_url: process.env.FRONTEND_URL,
  brevo_api_key: process.env.BREVO_API_KEY,
  brevo_sender_email: process.env.BREVO_SENDER_EMAIL,
  brevo_sender_name: process.env.BREVO_SENDER_NAME,
});
