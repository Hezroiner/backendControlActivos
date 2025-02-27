import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ubicacion } from "./ubicacion.entity";
import { Licitacion } from "./licitacion.entity"; // Relación con Licitacion

@Entity()
export class Activo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    marca: string;

    @Column()
    serie: string;

    @Column({
        type: 'varchar',
        length: 50,
        default: 'Activo',  // Valor predeterminado "Activo"
    })
    disponibilidad: string;

    @Column({
        type: 'varchar',
        length: 50,
        default: 'Bueno',  // Valor predeterminado "Bueno"
    })
    estado: string;

    @Column()
    modelo: string;

    @Column()
    numPlaca: string;

    @Column({nullable : true})

    foto: string;

    @Column({ nullable: true })
    precio: number;

    @Column({ nullable: true })
    observacion: string;

    @Column()
    modoAdquisicion: string;

    @ManyToOne(() => Ubicacion, ubicacion => ubicacion.activos)
    ubicacion: Ubicacion;

    @ManyToOne(() => Licitacion, licitacion => licitacion.activos, { nullable: true })
    licitacion?: Licitacion;

}
