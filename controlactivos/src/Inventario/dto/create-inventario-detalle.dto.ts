export class CreateInventarioDetalleDto {
    readonly activoId: number;
    // Estado provisional reportado por el docente: "Bueno", "Regular" o "Malo"
    readonly estadoProvisional: string;
    // Campo opcional para observaciones o detalles adicionales
    readonly detalle?: string;
  }
  