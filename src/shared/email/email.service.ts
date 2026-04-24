import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendRegistrationCode(to: string) {
    try {
      console.log(to);
      const sentEmailInfo = await this.mailService.sendMail({
        to,
        subject: 'NUTRISCAN',
        text: 'Use este código para te registrares.',
        template: './registration-code.hbs',
      });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'email sent sucessfully',
        data: sentEmailInfo,
        path: '/send/email',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.log(`Failed to send email | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to sent email',
          error: error.message,
          path: '/send/email',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendEmailIfValueIsHigh(data: {
    to: string;
    username: string;
    glucoseValue: number;
    timestamp?: Date;
  }) {
    try {
      const sentEmailInfo = await this.mailService.sendMail({
        to: data.to,
        subject: '⚠️ NUTRISCAN - Alerta de Glicemia Elevada',
        template: './sendAlertIfGlucoseHigh',
        context: {
          username: data.username,
          glucoseValue: data.glucoseValue,
          date: data.timestamp || new Date(),
          appName: 'NutriScan',
          supportEmail: 'suporte@nutriscan.com',
        },
      });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Email de alerta enviado com sucesso',
        data: {
          messageId: sentEmailInfo.messageId,
          to: data.to,
        },
        path: '/send/email',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Falha ao enviar email | Para: ${data.to} | Erro: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 500,
          method: 'POST',
          message: 'Falha ao enviar email de alerta',
          error: error.message,
          path: '/send/email',
          timestamp: Date.now(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendEmailReport(data: {
    to: string;
    username: string;
    content: string;
    title: string;
  }) {
    try {
      const sentEmailInfo = await this.mailService.sendMail({
        to: data.to,
        subject: 'NUTRISCAN ',
        template: './sendReport',
        context: {
          username: data.username,
          title: data.title,
          content: data.content,
          date: new Date(),
          appName: 'NutriScan',
          supportEmail: 'suporte@nutriscan.com',
        },
      });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Email de alerta enviado com sucesso',
        data: {
          messageId: sentEmailInfo.messageId,
          to: data.to,
        },
        path: '/send/email',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Falha ao enviar email | Para: ${data.to} | Erro: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 500,
          method: 'POST',
          message: 'Falha ao enviar email de alerta',
          error: error.message,
          path: '/send/email',
          timestamp: Date.now(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendEmailVerificationCode(data: {
    to: string;
    username: string;
    code: string;
    purpose: 'email_verification' | 'password_reset';
    expiryMinutes?: number;
  }) {
    try {
      console.log({
        ...data,
      });
      const title =
        data.purpose === 'email_verification'
          ? 'Verifique seu endereço de email'
          : 'Recuperação de senha';

      const sentEmailInfo = await this.mailService.sendMail({
        to: data.to,
        subject: `🔐 ${title} - Nutriscan`,
        template: './mail-verification-code',
        context: {
          username: data.username,
          verificationCode: data.code,
          purpose:
            data.purpose === 'email_verification'
              ? 'confirmar seu endereço de email'
              : 'redefinir sua senha',
          title: title,
          expiryMinutes: data.expiryMinutes || 5,
          appName: 'NutriScan',
          supportEmail: 'suporte@nutriscan.com',
          year: new Date().getFullYear(),
        },
      });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Código de verificação enviado com sucesso',
        data: {
          messageId: sentEmailInfo.messageId,
          to: data.to,
        },
        path: '/send/email',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Falha ao enviar código de verificação | Para: ${data.to} | Erro: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 500,
          method: 'POST',
          message: 'Falha ao enviar código de verificação',
          error: error.message,
          path: '/send/email',
          timestamp: Date.now(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
