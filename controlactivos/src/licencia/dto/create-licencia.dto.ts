export class CreateLicenciaDTO {
    nombre : string
    descripcion : string
    numeroIdentificador:string;
    codigoLicencia : string
    disponibilidad?: string;
    modoAdquisicion : string
    licitacionId?:number
    vigenciaInicio: Date;  
    vigenciaFin: Date;
}