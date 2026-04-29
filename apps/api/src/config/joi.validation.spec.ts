import { JoiValidationSchema } from './joi.validation';

describe('JoiValidationSchema', () => {
  const validConfig = {
    MONGO_URI: 'mongodb://localhost:27017',
    PORT: 3000,
    MONGO_DB_NAME: 'vitalpath',
    JWT_SECRET: 'secret',
    BREVO_API_KEY: 'key',
    BREVO_SENDER_EMAIL: 'sender@test.com',
    BREVO_SENDER_NAME: 'VitalPath',
    FRONTEND_URL: 'http://localhost:3000',
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
    GROQ_API_KEY: 'groq-key',
  };

  it('should validate a correct configuration', () => {
    const { error, value } = JoiValidationSchema.validate(validConfig);
    expect(error).toBeUndefined();
    expect(value.PORT).toBe(3000);
  });

  it('should fail if a required field is missing', () => {
    const invalidConfig = { ...validConfig } as Partial<typeof validConfig>;
    delete invalidConfig.MONGO_URI;

    const { error } = JoiValidationSchema.validate(invalidConfig);
    expect(error).toBeDefined();
    expect(error?.message).toContain('"MONGO_URI" is required');
  });

  it('should fail if PORT is not a number', () => {
    const invalidConfig = { ...validConfig, PORT: 'abc' };

    const { error } = JoiValidationSchema.validate(invalidConfig);
    expect(error).toBeDefined();
    expect(error?.message).toContain('"PORT" must be a number');
  });
});
