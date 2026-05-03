import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { EmailService } from './email.service';
import { handleServiceException } from '../helpers/handle-exceptions.helper';

jest.mock('axios');
jest.mock('../helpers/handle-exceptions.helper');

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
    process.env.BREVO_API_KEY = 'test-key';
    process.env.BREVO_SENDER_EMAIL = 'sender@test.com';
    process.env.BREVO_SENDER_NAME = 'VitalPath';
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendRecoverPasswordEmail', () => {
    it('should send an email successfully via Brevo API', async () => {
      const to = 'user@test.com';
      const html = '<p>Recover your password</p>';
      (axios.post as jest.Mock).mockResolvedValue({ data: 'success' });

      await service.sendRecoverPasswordEmail(to, html);

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { email: 'sender@test.com', name: 'VitalPath' },
          to: [{ email: to }],
          subject: 'Recuperar contraseña',
          htmlContent: html,
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            'api-key': 'test-key',
            'Content-Type': 'application/json',
            accept: 'application/json',
          }),
        }),
      );
    });

    it('should handle errors and call handleServiceException', async () => {
      const to = 'user@test.com';
      const html = '<p>Recover your password</p>';
      const error = { response: { data: 'error detail' } };
      (axios.post as jest.Mock).mockRejectedValue(error);

      await service.sendRecoverPasswordEmail(to, html);

      expect(handleServiceException).toHaveBeenCalledWith(error);
    });
  });
});
