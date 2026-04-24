import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '@modules/users/users.service';
import { User } from '@database/entities/user/user.entity';
import * as bcryptjs from 'bcryptjs';
import { VerificationService } from './verification.service';

@Controller('auth')
export class AuthController {
  private userRepository: Repository<User>;
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly verificationService: VerificationService,
    private readonly datasource: DataSource,
  ) {
    this.userRepository = this.datasource.getRepository(User);
  }

  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  // @Post('login-admin')
  // async signInAdmin(@Body() signInDto: SignInDto) {
  //   return await this.authService.signInAdmin(signInDto);
  // }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const token = crypto.randomBytes(32).toString('hex'); // Gerar token único
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Expira em 1h
    await this.userRepository.save(user);

    return { message: 'E-mail de recuperação enviado com sucesso' };
  }

  @Post('reset-password')
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Senha redefinida com sucesso' };
  }

  // auth.controller.ts - Add these endpoints
  @Post('verify-email-code')
  async verifyEmailCode(@Body() body: { email: string; code: string }) {
    return this.verificationService.verifyEmailCode(body.email, body.code);
  }

  @Post('resend-verification-code')
  async resendVerificationCode(@Body() body: { email: string }) {
    return this.verificationService.sendEmailVerificationCode(body.email);
  }

  @Post('send-password-reset-code')
  async sendPasswordResetCode(@Body() body: { email: string }) {
    console.log('send', body.email);
    return this.verificationService.sendPasswordResetCode(body.email);
  }

  @Post('verify-password-reset-code')
  async verifyPasswordResetCode(@Body() body: { email: string; code: string }) {
    return this.verificationService.verifyPasswordResetCode(
      body.email,
      body.code,
    );
  }

  @Post('resend-password-reset-code')
  async resendPasswordResetCode(@Body() body: { email: string }) {
    return this.verificationService.sendPasswordResetCode(body.email);
  }

  @Post('reset-password2')
  async resetPassword2(
    @Body() body: { email: string; resetToken: string; newPassword: string },
  ) {
    return this.verificationService.resetPassword(
      body.email,
      body.resetToken,
      body.newPassword,
    );
  }

  @Post('send-registration-code')
  async sendRegistrationCode(
    @Body() body: { userId: string; email: string; username: string },
  ) {
    return this.verificationService.sendRegistrationVerificationCode(
      body.userId,
      body.email,
      body.username,
    );
  }

  @Post('verify-registration-email')
  async verifyRegistrationEmailCode(
    @Body() body: { email: string; code: string },
  ) {
    return this.verificationService.verifyRegistrationEmailCode(
      body.email,
      body.code,
    );
  }

  @Post('resend-registration-code')
  async resendRegistrationCode(@Body() body: { email: string }) {
    return this.verificationService.resendRegistrationVerificationCode(
      body.email,
    );
  }
}
