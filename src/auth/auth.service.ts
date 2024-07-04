import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Roles } from './dto/roles.enum';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string | null> {
    if (loginDto.username === Roles.User && loginDto.password === 'password') {
      return this.generateToken(loginDto.username, Roles.User);
    } else if (
      loginDto.username === Roles.Admin &&
      loginDto.password === 'adminpassword'
    ) {
      return this.generateToken(loginDto.username, Roles.Admin);
    }
    return null;
  }

  private generateToken(username: string, role: string): string {
    const payload = { username, role };
    return this.jwtService.sign(payload);
  }

  isUser(req: Request): boolean {
    // Assuming 'admin' role has full access
    return req['user']['role'] === Roles.User;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const newUser = this.userRepository.create(createUserDto);

    return this.userRepository.save(newUser);
  }
}
