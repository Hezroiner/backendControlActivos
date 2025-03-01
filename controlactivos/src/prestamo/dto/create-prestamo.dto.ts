export class CreatePrestamoDTO {
  activoId: number;
  prestadoPorId: number;
  prestadoAId: number;
  ubicacionId: number;
  ubicacionActualId: number;  // Nueva propiedad para la ubicación actual
  fechaPrestamo: Date;
  fechaDevolucion?: Date;  // Fecha de devolución opcional
}
