import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail } from 'class-validator';
import { Rol } from "./rol.entity";
import { Ubicacion } from "./ubicacion.entity";
import { Inventario } from "./inventario.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;

    @Column({ type: 'varchar', length: 50 })
    apellido_1: string;

    @Column({ type: 'varchar', length: 50 })
    apellido_2: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    contraseña: string;

    @Column({ default: 'En Servicio' })
    disponibilidad: string;

    @ManyToOne(() => Rol, (rol) => rol.users)  // Relación Many-to-One
    rol: Rol;

    @ManyToMany(() => Ubicacion, ubicacion => ubicacion.users)  // Relación Many-to-Many
    @JoinTable()  // Especifica que esta entidad posee la tabla intermedia
    ubicaciones: Ubicacion[];

    @OneToMany(() => Inventario, inventario => inventario.docente)
    inventarios: Inventario[];
}
