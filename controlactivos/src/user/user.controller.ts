// src/user/user.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/Auth/JwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { User } from '../Entities/user.entity';
import { Ubicacion } from '../Entities/ubicacion.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Nuevo endpoint para obtener las ubicaciones de un usuario específico
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Docente', 'Administrador') // Permitido tanto para Docente como Administrador
  @Get(':id/ubicaciones')
  async getUbicacionesByUserId(@Param('id') id: number): Promise<Ubicacion[]> {
    return this.userService.getUbicacionesByUserId(id); // Llamar al servicio
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Docente', 'Administrador')  // Permitir tanto a Docente como a Administrador
  @Get('docentes')
  async getDocentes(): Promise<User[]> {
    return this.userService.getDocentes();  // Llamar al método del servicio
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')  // Restringimos esta acción solo para Administrador
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDTO: UpdateUserDTO): Promise<User> {
    return this.userService.updateUser(id, updateUserDTO);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')  // Restringimos esta acción solo para Administrador
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
