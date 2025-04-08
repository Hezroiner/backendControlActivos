import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Proveedor } from "./proveedor.entity";
import { Ley } from "./ley.entity";
import { Activo } from "./activo.entity";  // Relación con Activo
import { Licencia } from "./licencia.entity";

export enum Moneda {
    COLON = 'CRC',
    DOLAR = 'USD',
}

@Entity()
export class Licitacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    numActa: string;

    @Column()
    numLicitacion: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column('decimal', { precision: 15, scale: 2 })
    monto: number;

    @Column({ type: 'enum', enum: Moneda })
    moneda: Moneda;

    @Column({ type: 'text' })
    descripcion: string

    @Column()
    fecha: Date;

    @Column({ default: 'En Servicio' })
    disponibilidad: string;

    @ManyToOne(() => Proveedor, proveedor => proveedor.licitaciones)
    proveedor: Proveedor;

    @ManyToOne(() => Ley)
    ley: Ley;

    @OneToMany(() => Activo, activo => activo.licitacion)
    activos: Activo[];

    @OneToMany(() => Licencia, licencia => licencia.licitacion)
    licencias: Licencia[];
}
