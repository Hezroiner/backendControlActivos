import { IsEmail } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Licitacion } from "./licitacion.entity";
@Entity()
export class Proveedor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    vendedor: string;

    @Column({ type: 'varchar', length: 100 })
    nombreEmpresa: string;

    @Column({ type: 'varchar', length: 9 })
    telefonoProveedor: string;
    
    @Column({ type: 'varchar', length: 9 })
    telefonoEmpresa: string;
    
    @Column({unique : true})
    @IsEmail()
    email: string;

    @Column({ default: 'En Servicio' })
    disponibilidad: string;
    
    @OneToMany(() => Licitacion, licitacion => licitacion.proveedor)
    licitaciones : Licitacion

}