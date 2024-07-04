import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    if (!token) {
      throw new UnauthorizedException();
    }
    return { token };
  }
}
