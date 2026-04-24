import { User } from '@database/entities/user/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'shared/email/email.service';
import { Repository } from 'typeorm';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendEmailVerificationCode(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiry

    // Update user with verification code
    user.emailVerificationCode = code;
    user.emailVerificationCodeExpires = expiresAt;
    await this.userRepository.save(user);

    // Send email with code
    await this.emailService.sendEmailVerificationCode({
      to: user.email,
      username: user.firstname,
      code: code,
      purpose: 'email_verification',
      expiryMinutes: 5,
    });

    return {
      message: 'Código de verificação enviado com sucesso',
      expiresAt: expiresAt,
    };
  }

  async verifyEmailCode(email: string, code: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.emailVerificationCode || !user.emailVerificationCodeExpires) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Nenhum código de verificação encontrado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.emailVerificationCodeExpires < new Date()) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Código de verificação expirado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.emailVerificationCode !== code) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Código de verificação inválido',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpires = null;
    await this.userRepository.save(user);

    return {
      message: 'Email verificado com sucesso',
      userId: user.id,
    };
  }

  async sendPasswordResetCode(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiry

    // Update user with reset code
    user.resetPasswordCode = code;
    user.resetPasswordCodeExpires = expiresAt;
    await this.userRepository.save(user);

    // Send email with code
    await this.emailService.sendEmailVerificationCode({
      to: user.email,
      username: user.firstname,
      code: code,
      purpose: 'password_reset',
      expiryMinutes: 5,
    });

    return {
      message: 'Código de recuperação enviado com sucesso',
      expiresAt: expiresAt,
      success: true,
    };
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.resetPasswordCode || !user.resetPasswordCodeExpires) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Nenhum código de recuperação encontrado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.resetPasswordCodeExpires < new Date()) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Código de recuperação expirado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.resetPasswordCode !== code) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Código de recuperação inválido',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Generate a temporary token for password reset
    const resetToken = this.generateVerificationCode(); // You might want to use JWT here
    const tokenExpires = new Date();
    tokenExpires.setMinutes(tokenExpires.getMinutes() + 15); // 15 minutes for password reset

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpires;
    await this.userRepository.save(user);

    return {
      message: 'Código verificado com sucesso',
      resetToken: resetToken,
      success: true,
    };
  }

  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string,
  ): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Nenhuma solicitação de recuperação encontrada',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Token de recuperação expirado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.resetPasswordToken !== resetToken) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Token de recuperação inválido',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Update password and clear reset fields
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpires = null;

    await this.userRepository.save(user);

    return {
      message: 'Senha redefinida com sucesso',
      success: true,
    };
  }

  // Add these methods to the existing VerificationService

  async sendRegistrationVerificationCode(
    userId: string,
    email: string,
    username: string,
  ): Promise<any> {
    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiry

    // Update user with verification code
    await this.userRepository.update(userId, {
      emailVerificationCode: code,
      emailVerificationCodeExpires: expiresAt,
    });

    // Send email with code
    await this.emailService.sendEmailVerificationCode({
      to: email,
      username,
      code: code,
      purpose: 'email_verification',
      expiryMinutes: 5,
    });

    return {
      message: 'Código de verificação enviado com sucesso',
      expiresAt: expiresAt,
    };
  }

  async verifyRegistrationEmailCode(email: string, code: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.emailVerificationCode || !user.emailVerificationCodeExpires) {
      throw new HttpException(
        {
          statusCode: 400,
          message:
            'Nenhum código de verificação encontrado. Solicite um novo código.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.emailVerificationCodeExpires < new Date()) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Código de verificação expirado. Solicite um novo código.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.emailVerificationCode !== code) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Código de verificação inválido',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpires = null;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Email verificado com sucesso',
      userId: user.id,
    };
  }

  async resendRegistrationVerificationCode(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if user already has a valid code that hasn't expired
    if (
      user.emailVerificationCodeExpires &&
      user.emailVerificationCodeExpires > new Date()
    ) {
      // Calculate remaining time
      const remainingTime = Math.ceil(
        (user.emailVerificationCodeExpires.getTime() - new Date().getTime()) /
          1000,
      );
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;

      throw new HttpException(
        {
          statusCode: 400,
          message: `Aguarde ${minutes}:${seconds.toString().padStart(2, '0')} para solicitar um novo código`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Generate new code
    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.userRepository.update(user.id, {
      emailVerificationCode: code,
      emailVerificationCodeExpires: expiresAt,
    });

    await this.emailService.sendEmailVerificationCode({
      to: user.email,
      username: user.firstname,
      code: code,
      purpose: 'email_verification',
      expiryMinutes: 5,
    });

    return {
      success: true,
      message: 'Novo código enviado com sucesso',
      expiresAt: expiresAt,
    };
  }
}
