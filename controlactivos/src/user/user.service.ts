// src/user/user.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/Entities/user.entity';
import { Rol } from 'src/Entities/rol.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Ubicacion } from 'src/Entities/ubicacion.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    @InjectRepository(Ubicacion)
    private ubicacionRepository: Repository<Ubicacion>,
  ) {}

  // Método para obtener las ubicaciones de un usuario específico
  async getUbicacionesByUserId(userId: number): Promise<Ubicacion[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ubicaciones'], // Relacionamos las ubicaciones
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user.ubicaciones;
  }

  // Método para buscar usuario por email y cargar su rol
  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['rol', 'ubicaciones'],  // Cargamos la relación con el rol y ubicaciones del usuario
    });
  }

  // Método para obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['rol', 'ubicaciones'] });
  }

  // Método para obtener un usuario por ID
  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['rol', 'ubicaciones'] });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  // Método para crear un usuario
  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDTO.email } });
    if (existingUser) {
      throw new BadRequestException('El email ya está en uso.');
    }

    const rol = await this.rolRepository.findOne({ where: { id: createUserDTO.rolId } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    const ubicaciones = await this.ubicacionRepository.findByIds(createUserDTO.ubicacionIds || []);
    if (ubicaciones.length !== (createUserDTO.ubicacionIds?.length || 0)) {
      throw new NotFoundException('Una o más ubicaciones no fueron encontradas');
    }

    const hashedPassword = await bcrypt.hash(createUserDTO.contraseña, 10);

    const newUser = this.userRepository.create({
      ...createUserDTO,
      contraseña: hashedPassword,
      rol,
      ubicaciones,
    });

    return await this.userRepository.save(newUser);
  }

// Método para actualizar un usuario
async updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
  // Buscar el usuario por ID
  const user = await this.getUser(id);
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  // Actualización del rol
  if (updateUserDTO.rolId) {
    const rol = await this.rolRepository.findOne({ where: { id: updateUserDTO.rolId } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    user.rol = rol; // Asignar el rol encontrado
  }

  // Actualización de ubicaciones
  if (updateUserDTO.ubicacionIds && updateUserDTO.ubicacionIds.length > 0) {
    const ubicaciones = await this.ubicacionRepository.findByIds(updateUserDTO.ubicacionIds);
    if (ubicaciones.length !== updateUserDTO.ubicacionIds.length) {
      throw new NotFoundException('Una o más ubicaciones no fueron encontradas');
    }
    user.ubicaciones = ubicaciones; // Asignar las ubicaciones encontradas
  }

  // Asignar las demás propiedades que vienen en el DTO
  Object.assign(user, updateUserDTO);

  // Guardar el usuario actualizado
  return await this.userRepository.save(user);
}

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUser(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.delete(id);
  }

  // Método para obtener todos los docentes
  async getDocentes(): Promise<User[]> {
    const docentes = await this.userRepository.find({
      where: {
        rol: { id: 2 },  // ID del rol de docente
      },
      relations: ['rol', 'ubicaciones'],
    });

    if (!docentes.length) {
      throw new NotFoundException('No se encontraron docentes');
    }

    return docentes;
  }
}
