import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ubicacion } from "./ubicacion.entity";
import { Licitacion, Moneda } from "./licitacion.entity"; // Relación con Licitacion
import { text } from "stream/consumers";

@Entity()
export class Activo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable : true })
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

    @Column({ nullable: true })

    foto: string;

    @Column( 'decimal', { nullable: true, precision: 15, scale: 2 })
    precio: number;

    @Column({type: 'enum', enum: Moneda})
    moneda : Moneda;

    @Column({ type : 'text' , nullable: true })
    observacion: string;

    @Column()
    modoAdquisicion: string;

    @ManyToOne(() => Ubicacion, ubicacion => ubicacion.activos)
    ubicacion: Ubicacion;

    @ManyToOne(() => Licitacion, licitacion => licitacion.activos, { nullable: true })
    licitacion?: Licitacion;

}
