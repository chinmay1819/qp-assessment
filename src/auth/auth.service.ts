import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Roles } from './dto/roles.enum';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid Credentials !');
    }
    let roleOfUser;
    if (user.username == 'admin') {
      roleOfUser = Roles.Admin;
    } else {
      roleOfUser = Roles.User;
    }
    return this.generateToken(user.username, roleOfUser);
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
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
}
