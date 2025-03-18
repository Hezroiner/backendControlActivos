import { CreateInventarioDetalleDto } from './create-inventario-detalle.dto';

export class CreateInventarioDto {
  // Fecha en la que se realiza el inventario
  readonly fecha: Date;
  // ID del docente que realiza el inventario
  readonly docenteId: number;
  // ID de la ubicación (aula) en la que se realiza el inventario
  readonly ubicacionId: number;
  // Lista de detalles de inventario para cada activo
  readonly detalles: CreateInventarioDetalleDto[];
}
