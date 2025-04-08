import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Licitacion } from "./licitacion.entity";

@Entity()
export class Licencia {
    @PrimaryGeneratedColumn()
    id : number
    
    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 50 })
    numeroIdentificador: string;

    @Column({ type: 'text' })
    descripcion: string;

    @Column({ type: 'varchar', length: 50 })
    codigoLicencia: string;

    @Column({ default: 'En Servicio' })
    disponibilidad: string;

    @Column({ nullable: true })
    modoAdquisicion: string;

    @Column({ type: 'date' })
    vigenciaInicio: Date;

    @Column({ type: 'date' })
    vigenciaFin: Date;

    @ManyToOne(() => Licitacion, licitacion => licitacion.licencias, { nullable: true })
    licitacion?: Licitacion;

}