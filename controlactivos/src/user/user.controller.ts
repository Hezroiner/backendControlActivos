import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from '@app/Authchocoo/JwtAuthGuard';
import { RolesGuard } from '@app/Authchocoo/roles.guard';
import { Roles } from '@app/Authchocoo/roles.decorator';
import { User } from '@app/Entities/user.entity';
import { Ubicacion } from '@app/Entities/ubicacion.entity';


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
  @Roles('Administrador')
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDTO: UpdateUserDTO): Promise<User> {
    return this.userService.updateUser(id, updateUserDTO);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador') 
  @Patch(':id/disponibilidad')
  updateDisponibilidadoUsuario(@Param('id') id: number) {
      return this.userService.updateDisponibilidadUsuario(id);
  } 
}
   