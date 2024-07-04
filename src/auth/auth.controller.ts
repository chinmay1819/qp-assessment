import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Responses } from 'src/shared/const/responses';
import { StatusCodes } from 'src/shared/const/status-codes';
import { CustomMessages } from 'src/shared/const/custom-messages';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    try {
      const token = await this.authService.login(loginDto);
      if (!token) {
        throw new UnauthorizedException();
      }
      return new Responses(
        StatusCodes.OK,
        token,
        CustomMessages.LOGIN_SUCCESS,
        true,
      );
    } catch (error) {
      return new Responses(
        StatusCodes.NOT_FOUND,
        '',
        CustomMessages.USER_NOT_FOUND,
        false,
      );
    }
  }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.registerUser(createUserDto);
    return new Responses(
      StatusCodes.CREATED,
      user,
      CustomMessages.USER_CREATED,
      true,
    );
  }
}
