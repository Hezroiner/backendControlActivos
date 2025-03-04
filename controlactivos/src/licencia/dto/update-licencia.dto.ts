export class UpdateLicenciaDTO {
    nombre? : string
    descripcion? : string
    codigoLicencia? : string
    disponibilidad?: string;
    leyId?: number
    modoAdquisicion? : string
    vigenciaInicio?: Date;  
    vigenciaFin?: Date; 
}