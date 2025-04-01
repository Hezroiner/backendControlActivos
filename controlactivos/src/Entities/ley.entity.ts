import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Licitacion } from "./licitacion.entity";
@Entity()
export class Ley {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    numLey: string;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'text' })
    detalle: string;

    @Column({ default: 'En Servicio' })
    disponibilidad: string;

    @OneToMany(() => Licitacion, licitacion => licitacion.ley)
    licitaciones: Licitacion[];
}