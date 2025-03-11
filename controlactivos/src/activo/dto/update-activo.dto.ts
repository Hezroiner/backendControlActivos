import { Moneda } from "@app/Entities/licitacion.entity";

export class UpdateActivoDTO {
    nombre?: string;
    descripcion?: string;
    marca?: string;
    serie?: string;
    estado?: string;
    modelo?: string;
    numPlaca?: string;
    foto?: string;
    precio?: number;
    moneda?: Moneda;
    observacion?: string;
    ubicacionId?: number;
    modoAdquisicion?: string; // "Ley" o "Donación"
    licitacionId: number;// Campo opcional para ley
}
