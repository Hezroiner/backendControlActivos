import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Rol{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    nombre : string

    @Column()
    descripcion : string

    @OneToMany(() => User, (user) => user.rol)  // Relación inversa One-to-Many
    users: User[];
}