import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Inventario } from './inventario.entity';
import { Activo } from '@app/Entities/activo.entity';

@Entity()
export class InventarioDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con el inventario principal
  @ManyToOne(() => Inventario, inventario => inventario.detalles)
  inventario: Inventario;

  // Activo que se está inventariando
  @ManyToOne(() => Activo)
  activo: Activo;

  // Estado provisional reportado por el docente: "Bueno", "Regular" o "Malo"
  @Column({
    type: 'varchar',
    length: 50,
    default: 'Bueno'
  })
  estadoProvisional: string;

  // Detalle o comentario adicional
  @Column({ type: 'text', nullable: true })
  detalle: string;
}