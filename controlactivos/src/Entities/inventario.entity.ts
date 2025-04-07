import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@app/Entities/user.entity';
import { Ubicacion } from '@app/Entities/ubicacion.entity';
import { InventarioDetalle } from './inventario-detalle.entity';

@Entity()
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  // Fecha en la que se realiza el inventario
  @Column({ type: 'date' })
  fecha: Date;

  // Docente que realiza el inventario
  @ManyToOne(() => User, user => user.inventarios)
  docente: User;

  // Ubicación (aula) en la que se realiza el inventario
  @ManyToOne(() => Ubicacion, ubicacion => ubicacion.inventarios)
  ubicacion: Ubicacion;

  // Detalles de los activos inventariados
  @OneToMany(() => InventarioDetalle, detalle => detalle.inventario, { cascade: true })
  detalles: InventarioDetalle[];

  // Nueva columna para marcar si el inventario ya fue revisado
  @Column({ default: false })
  revisado: boolean;
}
