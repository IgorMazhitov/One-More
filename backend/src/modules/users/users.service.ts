import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Not, Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { ChangeUserDto } from './dtos/change-user.dto';
import * as crypt from 'bcryptjs';
import { GetAllUsersDto } from './dtos/get-all-users.dto';
import { validateEmail, validateName, validatePassword } from 'src/common/helpers/validations';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      let role = null;
      if (dto.roleId) {
        role = await this.rolesRepository.findOne({
          where: {
            id: dto.roleId,
          },
        });
      } else {
        role = await this.rolesRepository.findOne({
          where: {
            name: 'User',
          },
        });
      }
      this.validateUser(dto);
      const hashPassword = await crypt.hash(dto.password, 5);
      const user: User = await this.usersRepository.save({
        ...dto,
        password: hashPassword,
        role,
      });
      return user;
    } catch (error) {
      throw new Error(`Error during user creation: ${error.message}`);
    }
  }

  validateUser(dto: CreateUserDto): boolean {
    try {
      const { password, email, userName } = dto;
      validatePassword(password);
      validateEmail(email);
      validateName(userName);
      return true;
    } catch (error) {
      throw new Error(`Error during user validation: ${error.message}`);
    }
  }

  async changeUser(dto: ChangeUserDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: dto.id,
        },
      });
      const roleToChange = await this.rolesRepository.findOne({
        where: {
          id: dto.roleId,
        },
      });
      if (!user || !roleToChange) {
        throw new HttpException('User or Role not found', HttpStatus.NOT_FOUND);
      }
      const isPasswordSame = dto.password === user.password;
      const hashPassword = await crypt.hash(dto.password, 5);
      const userToUpdate = {
        ...user,
        userName: dto.userName,
        email: dto.email,
        role: roleToChange,
      };
      if (!isPasswordSame) {
        userToUpdate.password = hashPassword;
      }
      const updatedUser = await this.usersRepository.save({
        ...userToUpdate
      });
      return updatedUser;
    } catch (error) {
      throw new Error(`Error during change user: ${error.message}`);
    }
  }

  async getAllUsers(body: GetAllUsersDto) {
    try {
      const { limit, page, senderId, roleId } = body;
      const user: User = await this.getUserById(senderId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      let users: User[] = null;
      const skip = (page - 1) * limit;
      let count = 0;

      if (user.role.name === 'Admin') {
        const [fetchedUsers, fetchedCount] = await this.usersRepository.findAndCount({
          where: {
            id: Not(user.id),
            role: {
              id: roleId,
            },
          },
          relations: {
            role: true,
          },
          skip,
          take: limit,
        });
        users = fetchedUsers;
        count = fetchedCount;
      } else {
        const [fetchedUsers, fetchedCount] = await this.usersRepository.findAndCount({
          select: {
            userName: true,
            id: true,
            role: {
              name: true,
              id: true,
            },
          },
          where: {
            id: Not(user.id),
            role: {
              id: roleId,
            },
          },

          relations: {
            role: true,
          },
          skip,
          take: limit,
        });
        users = fetchedUsers;
        count = fetchedCount;
      }
      return {users, count};
    } catch (error) {
      throw new Error(`Error during getting all users: ${error.message}`);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email,
        },
        relations: {
          role: true,
        },
      });
      return user;
    } catch (error) {
      throw new Error(`Error during get user by email: ${error.message}`);
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id,
        },
        relations: {
          role: true,
        },
      });
      return user;
    } catch (error) {
      throw new Error(`Error during get user by id: ${error.message}`);
    }
  }
}
