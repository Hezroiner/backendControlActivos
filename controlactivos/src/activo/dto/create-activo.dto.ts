import { Moneda } from "@app/Entities/licitacion.entity";

export class CreateActivoDTO {
    nombre: string;
    descripcion: string;
    marca: string;
    serie: string;
    estado?: string;
    disponibilidad?: string;
    modelo: string;
    numPlaca: string;
    foto: string;
    precio: number;
    moneda: Moneda;
    observacion?: string;
    ubicacionId: number;
    modoAdquisicion: string;
    licitacionId?:number
}
