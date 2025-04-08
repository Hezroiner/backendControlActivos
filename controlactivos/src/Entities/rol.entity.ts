import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Rol {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 50 })
    nombre: string

    @Column({ type: 'text' })
    descripcion: string

    @OneToMany(() => User, (user) => user.rol)  // Relación inversa One-to-Many
    users: User[];
}