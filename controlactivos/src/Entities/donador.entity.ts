import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Donador {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    nombre : string;

    @Column()
    descripcion : string;

    @Column()
    fecha : Date;
}