import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { handleServiceException } from '../helpers/handle-exceptions.helper';

@Injectable()
export class EmailService {
  private readonly apiKey = process.env.BREVO_API_KEY;
  private readonly senderEmail = process.env.BREVO_SENDER_EMAIL;
  private readonly senderName = process.env.BREVO_SENDER_NAME ?? 'VitalPath';

  async sendRecoverPasswordEmail(to: string, html: string) {
    try {
      const url = 'https://api.brevo.com/v3/smtp/email';

      await axios.post(
        url,
        {
          sender: {
            email: this.senderEmail,
            name: this.senderName,
          },
          to: [{ email: to }],
          subject: 'Recuperar contraseña',
          htmlContent: html,
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('[BrevoEmailError]', error.response?.data ?? error);
      handleServiceException(error);
    }
  }

  async sendWelcomePatientEmail(to: string, html: string) {
    try {
      const url = 'https://api.brevo.com/v3/smtp/email';

      await axios.post(
        url,
        {
          sender: {
            email: this.senderEmail,
            name: this.senderName,
          },
          to: [{ email: to }],
          subject: '¡Bienvenido a VitalPath! - Tus credenciales',
          htmlContent: html,
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('[BrevoEmailError]', error.response?.data ?? error);
      handleServiceException(error);
    }
  }
}
