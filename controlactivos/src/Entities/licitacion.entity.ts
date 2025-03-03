import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Proveedor } from "./proveedor.entity";
import { Ley } from "./ley.entity";
import { Activo } from "./activo.entity";  // Relación con Activo
import { Licencia } from "./licencia.entity";

@Entity()
export class Licitacion {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    numActa : number;

    @Column()
    numLicitacion : number;

    @Column()
    nombre : string;

    @Column()
    monto : number;

    @Column()
    descripcion : string

    @Column()
    fecha : Date;

    @Column({ default: 'En Servicio' })
    disponibilidad: string;

    @ManyToOne(() => Proveedor , proveedor => proveedor.licitaciones)
    proveedor: Proveedor;

    @ManyToOne(() => Ley)
    ley: Ley; 

    @OneToMany(() => Activo, activo => activo.licitacion)
    activos: Activo[];

    @OneToMany(() => Licencia, licencia => licencia.licitacion) 
    licencias: Licencia[];
}
