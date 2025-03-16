import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Donador } from "./donador.entity";
import { Ley } from "./ley.entity";
import { Licitacion } from "./licitacion.entity";

@Entity()
export class Licencia {
    @PrimaryGeneratedColumn()
    id : number
    
    @Column()
    nombre : string

    @Column()
    numeroIdentificador : string

    @Column()
    descripcion : string

    @Column()
    codigoLicencia : string

    @Column({ default: 'En Servicio' })
    disponibilidad: string;

    @Column({ nullable: true })
    modoAdquisicion: string;

    @Column({ type: 'date' })
    vigenciaInicio: Date;

    @Column({ type: 'date' })
    vigenciaFin: Date;

    @ManyToOne(() => Donador, { nullable: true })
    donador: Donador;

    @ManyToOne(() => Licitacion, licitacion => licitacion.licencias, { nullable: true })
    licitacion?: Licitacion;

}