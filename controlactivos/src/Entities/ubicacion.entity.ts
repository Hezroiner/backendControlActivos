import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Activo } from "./activo.entity";
import { User } from "./user.entity";
import { Inventario } from "./inventario.entity";

@Entity()
export class Ubicacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 50})
    nombre: string;
    
    @Column({type: 'text'})
    descripcion: string;

    @Column({type: 'varchar', length: 50})
    pabellon: string;

    @Column({ default: 'En Servicio' })
    disponibilidad: string;

    @OneToMany(() => Activo, activo => activo.ubicacion)
    activos: Activo[];

    @ManyToMany(() => User, user => user.ubicaciones)  // Relación Many-to-Many con User
    users: User[];

    @OneToMany(() => Inventario, inventario => inventario.ubicacion)
    inventarios: Inventario[];
}