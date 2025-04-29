import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@app/Entities/user.entity';
import { Rol } from '@app/Entities/rol.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Ubicacion } from '@app/Entities/ubicacion.entity';

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

  // Obtener ubicaciones de un usuario específico
  async getUbicacionesByUserId(userId: number): Promise<Ubicacion[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ubicaciones'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user.ubicaciones;
  }

  // Buscar usuario por email
  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['rol', 'ubicaciones'],
    });
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({ relations: ['rol', 'ubicaciones'] });
    users.forEach(user => delete user.contraseña);
    return users;
  }

  // Obtener un usuario por ID
  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['rol', 'ubicaciones'] });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    delete user.contraseña;
    return user;
  }

  // Crear usuario (ubicaciones opcionales)
  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    // Verificar email existente
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDTO.email } });
    if (existingUser) {
      throw new BadRequestException('El email ya está en uso.');
    }

    // Verificar rol
    const rol = await this.rolRepository.findOne({ where: { id: createUserDTO.rolId } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Separar ubicaciones opcionales del resto de datos
    const { ubicacionIds, ...userData } = createUserDTO;

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(createUserDTO.contraseña, 10);

    // Crear y guardar el usuario base (sin ubicaciones)
    const newUser = this.userRepository.create({
      ...userData,
      contraseña: hashedPassword,
      rol,
    });
    await this.userRepository.save(newUser);

    // Si enviaron ubicaciones, asociarlas
    if (ubicacionIds && ubicacionIds.length > 0) {
      const ubicaciones = await this.ubicacionRepository.findByIds(ubicacionIds);
      if (ubicaciones.length !== ubicacionIds.length) {
        throw new NotFoundException('Una o más ubicaciones no fueron encontradas');
      }
      newUser.ubicaciones = ubicaciones;
      await this.userRepository.save(newUser);
    }

    return newUser;
  }

  // Actualizar usuario
  async updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
    const user = await this.getUser(id);

    // Actualizar rol si viene
    if (updateUserDTO.rolId) {
      const rol = await this.rolRepository.findOne({ where: { id: updateUserDTO.rolId } });
      if (!rol) {
        throw new NotFoundException('Rol no encontrado');
      }
      user.rol = rol;
    }

    // Actualizar ubicaciones si vienen
    if (updateUserDTO.ubicacionIds && updateUserDTO.ubicacionIds.length > 0) {
      const ubicaciones = await this.ubicacionRepository.findByIds(updateUserDTO.ubicacionIds);
      if (ubicaciones.length !== updateUserDTO.ubicacionIds.length) {
        throw new NotFoundException('Una o más ubicaciones no fueron encontradas');
      }
      user.ubicaciones = ubicaciones;
    }

    // Asignar otros campos
    Object.assign(user, updateUserDTO);

    // Si actualizan contraseña
    if (updateUserDTO.contraseña) {
      user.contraseña = await bcrypt.hash(updateUserDTO.contraseña, 10);
    }

    return await this.userRepository.save(user);
  }

  // Marcar disponibilidad de usuario
  async updateDisponibilidadUsuario(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('No se encontró al Usuario');
    }
    if (user.disponibilidad === 'Fuera de Servicio') {
      throw new BadRequestException('El Usuario ya está marcado como "Fuera de Servicio"');
    }
    user.disponibilidad = 'Fuera de Servicio';
    await this.userRepository.save(user);
  }

  // Obtener docentes
  async getDocentes(): Promise<User[]> {
    const docentes = await this.userRepository.find({
      where: { rol: { id: 2 } },
      relations: ['rol', 'ubicaciones'],
    });
    if (!docentes.length) {
      throw new NotFoundException('No se encontraron docentes');
    }
    docentes.forEach(docente => delete docente.contraseña);
    return docentes;
  }
}
