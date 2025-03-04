export class CreateLicenciaDTO {
    nombre : string
    descripcion : string
    codigoLicencia : string
    disponibilidad?: string;
    modoAdquisicion : string
    leyId? : number
    vigenciaInicio: Date;  
    vigenciaFin: Date;
}