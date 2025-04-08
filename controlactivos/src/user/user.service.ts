import { Injectable, NotFoundException, BadRequestException, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@app/Entities/user.entity';
import { Rol } from '@app/Entities/rol.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Ubicacion } from '@app/Entities/ubicacion.entity';

@Injectable()
export class UserService implements OnApplicationBootstrap{
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    @InjectRepository(Ubicacion)
    private ubicacionRepository: Repository<Ubicacion>,
  ) { }

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
    const users = await this.userRepository.find({ relations: ['rol', 'ubicaciones'] });

    users.forEach(user => {
      delete user.contraseña;
    });

    return users;

    /* return await this.userRepository.find({ relations: ['rol', 'ubicaciones'] }); */
  }

  // Método para obtener un usuario por ID
  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['rol', 'ubicaciones'] });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    delete user.contraseña;
    return user;
  }


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


  async updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {

    const user = await this.getUser(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }


    if (updateUserDTO.rolId) {
      const rol = await this.rolRepository.findOne({ where: { id: updateUserDTO.rolId } });
      if (!rol) {
        throw new NotFoundException('Rol no encontrado');
      }
      user.rol = rol;
    }


    if (updateUserDTO.ubicacionIds && updateUserDTO.ubicacionIds.length > 0) {
      const ubicaciones = await this.ubicacionRepository.findByIds(updateUserDTO.ubicacionIds);
      if (ubicaciones.length !== updateUserDTO.ubicacionIds.length) {
        throw new NotFoundException('Una o más ubicaciones no fueron encontradas');
      }
      user.ubicaciones = ubicaciones;
    }


    Object.assign(user, updateUserDTO);

    if (updateUserDTO.contraseña) {
      user.contraseña = await bcrypt.hash(updateUserDTO.contraseña, 10);
    }

    return await this.userRepository.save(user);
  }

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


  async getDocentes(): Promise<User[]> {
    const docentes = await this.userRepository.find({
      where: {
        rol: { id: 2 },
      },
      relations: ['rol', 'ubicaciones'],
    });

    if (!docentes.length) {
      throw new NotFoundException('No se encontraron docentes');
    }

    docentes.forEach(docente => {
      delete docente.contraseña;
    });
    return docentes;
  }

  async onApplicationBootstrap() {
    // Definir el email y contraseña del usuario administrador por defecto
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      this.logger.log('El usuario administrador ya existe.');
      return;
    }

    const adminRol = await this.rolRepository.findOne({ where: { nombre: 'Administrador' } });
    if (!adminRol) {
      this.logger.error('No se encontró el rol Administrador. Asegúrate de que se ejecute el seed de roles antes.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear el usuario administrador
    const adminUser = this.userRepository.create({
      nombre: 'Super Admin',
      apellido_1: 'Admin',
      apellido_2: 'User',
      email: adminEmail,
      contraseña: hashedPassword,
      disponibilidad: 'En Servicio',
      rol: adminRol,
      ubicaciones: [], // Puedes asignar ubicaciones si es necesario
    });

    await this.userRepository.save(adminUser);
    this.logger.log('Usuario administrador creado correctamente.');
  }

}
