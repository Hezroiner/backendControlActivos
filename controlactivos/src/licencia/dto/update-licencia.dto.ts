export class UpdateLicenciaDTO {
    nombre? : string;
    descripcion? : string;
    codigoLicencia? : string;
    disponibilidad?: string;
    modoAdquisicion? : string
    vigenciaInicio?: Date;  
    vigenciaFin?: Date; 
}