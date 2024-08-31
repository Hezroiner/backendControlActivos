import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number;
    
    @Column()
    nombre : string;

    @Column()
    descripcion : string;

    @Column()
    apellido_1 : string;

    @Column()
    apellido_2 : string;

    @Column()
    email : string;

    @Column()
    contraseña : string;

    @Column()
    rol : string;
}