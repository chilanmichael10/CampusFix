
import {
  Component,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ReportesApi } from '../../core/services/reportes-api';

interface ReporteVisual {
  id: number;
  titulo: string;
  ubicacion: string;
  categoria: string;
  prioridad: string;
  estado: string;
  fecha: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  private readonly reportesApi = inject(ReportesApi);
  private readonly platformId = inject(PLATFORM_ID);

  searchTerm = '';
  selectedEstado = 'Todos';
  selectedPrioridad = 'Todas';
  selectedCategoria = 'Todas';

  reportes: ReporteVisual[] = [];
  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  this.cargarReportes();
}

  cargarReportes(): void {
    this.cargando = true;
    this.errorCarga = '';

    this.reportesApi.obtenerTodos().subscribe({
      next: (datos) => {
        this.reportes = datos.map(reporte => ({
          id: reporte.id,
          titulo: reporte.titulo || reporte.problema || 'Sin título',
          ubicacion: reporte.aula || 'Sin ubicación',
          categoria: reporte.categoriaId !== null
            ? `Categoría #${reporte.categoriaId}`
            : 'Sin categoría',
          prioridad: reporte.prioridad || 'Media',
          estado: reporte.estado || 'Reportado',
          fecha: this.formatearFecha(reporte.fechaReporte)
        }));

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar los reportes:', error);

        this.errorCarga = error.status === 401
          ? 'Tu sesión ha expirado. Inicia sesión nuevamente.'
          : error.status === 403
            ? 'Tu usuario no tiene permisos para consultar todos los reportes.'
            : 'No se pudieron cargar los reportes. Verifica la conexión con la API.';

        this.cargando = false;
      }
    });
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(fechaConvertida);
  }

  get reportesFiltrados(): ReporteVisual[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.reportes.filter(reporte => {
      const matchesSearch = !search ||
        reporte.titulo.toLowerCase().includes(search) ||
        reporte.ubicacion.toLowerCase().includes(search) ||
        reporte.id.toString().includes(search);

      const matchesEstado =
        this.selectedEstado === 'Todos' ||
        reporte.estado === this.selectedEstado;

      const matchesPrioridad =
        this.selectedPrioridad === 'Todas' ||
        reporte.prioridad === this.selectedPrioridad;

      const matchesCategoria =
        this.selectedCategoria === 'Todas' ||
        reporte.categoria === this.selectedCategoria;

      return matchesSearch &&
        matchesEstado &&
        matchesPrioridad &&
        matchesCategoria;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedEstado = 'Todos';
    this.selectedPrioridad = 'Todas';
    this.selectedCategoria = 'Todas';
  }
}
