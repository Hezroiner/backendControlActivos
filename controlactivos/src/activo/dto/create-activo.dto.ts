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
    observacion?: string;
    ubicacionId: number;
    modoAdquisicion: string;
    licitacionId?:number
}
