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
  supabase_url: process.env.SUPABASE_URL,
  supabase_service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY,
  groq_api_key: process.env.GROQ_API_KEY,
});
