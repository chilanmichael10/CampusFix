import {
  Component,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReportesApi, ReporteApi } from '../../core/services/reportes-api';

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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  searchTerm = '';
  selectedEstado = 'Todos';
  selectedPrioridad = 'Todas';
  selectedCategoria = 'Todas';

  reportes: ReporteVisual[] = [];
  cargando = false;
  errorCarga = '';

  mostrarFormulario = false;
  mostrandoDetalle = false;
  guardando = false;
  mensajeFormulario = '';
  reporteSeleccionado: ReporteApi | null = null;

  nuevoReporte = {
    titulo: '',
    problema: '',
    aula: '',
    prioridad: 'Media',
    reportadoPor: ''
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.mostrarFormulario =
      this.route.snapshot.routeConfig?.path === 'reportes/nuevo';

    this.cargarReportes();
  }

  cargarReportes(): void {
    this.cargando = true;
    this.errorCarga = '';

    this.reportesApi.obtenerTodos().subscribe({
      next: datos => {
        this.reportes = datos.map(reporte => ({
          id: reporte.id,
          titulo: reporte.titulo || reporte.problema || 'Sin título',
          ubicacion: reporte.aula || 'Sin ubicación',
          categoria: reporte.categoriaId != null
            ? `Categoría #${reporte.categoriaId}`
            : 'Sin categoría',
          prioridad: reporte.prioridad || 'Media',
          estado: reporte.estado || 'Reportado',
          fecha: this.formatearFecha(reporte.fechaReporte)
        }));
        this.cargando = false;
      },
      error: error => {
        console.error('Error al cargar reportes:', error);
        this.errorCarga = error.status === 401
          ? 'La API rechazó la sesión. Vuelve a iniciar sesión.'
          : error.status === 403
            ? 'Tu usuario no tiene permisos para consultar estos reportes.'
            : 'No se pudieron cargar los reportes. Verifica que la API esté activa.';
        this.cargando = false;
      }
    });
  }

  abrirFormulario(): void {
    this.mensajeFormulario = '';
    this.mostrarFormulario = true;
    this.mostrandoDetalle = false;
    this.reporteSeleccionado = null;
  }

  cerrarVentana(): void {
    this.mostrarFormulario = false;
    this.mostrandoDetalle = false;
    this.mensajeFormulario = '';
    this.router.navigate(['/reportes']);
  }

  crearReporte(): void {
    this.mensajeFormulario = '';

    const titulo = this.nuevoReporte.titulo.trim();
    const problema = this.nuevoReporte.problema.trim();
    const aula = this.nuevoReporte.aula.trim();
    const reportadoPor = this.nuevoReporte.reportadoPor.trim();

    if (!titulo || !problema || !aula || !reportadoPor) {
      this.mensajeFormulario = 'Completa todos los campos obligatorios.';
      return;
    }

    this.guardando = true;

    this.reportesApi.crear({
      titulo,
      problema,
      aula,
      prioridad: this.nuevoReporte.prioridad,
      reportadoPor
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.nuevoReporte = {
          titulo: '',
          problema: '',
          aula: '',
          prioridad: 'Media',
          reportadoPor: ''
        };
        this.mostrarFormulario = false;
        this.router.navigate(['/reportes']).then(() => {
          this.cargarReportes();
        });
      },
      error: error => {
        console.error('Error al crear reporte:', error);
        this.guardando = false;
        this.mensajeFormulario = error.status === 401
          ? 'La API rechazó la sesión. Inicia sesión nuevamente.'
          : error.status === 403
            ? 'Tu rol no tiene permiso para crear reportes.'
            : 'No se pudo guardar el reporte. Revisa la API e inténtalo otra vez.';
      }
    });
  }

  verDetalle(id: number): void {
    this.mensajeFormulario = '';

    this.reportesApi.obtenerPorId(id).subscribe({
      next: reporte => {
        this.reporteSeleccionado = reporte;
        this.mostrandoDetalle = true;
        this.mostrarFormulario = false;
      },
      error: error => {
        console.error('Error al consultar detalle:', error);
        this.errorCarga = error.status === 403
          ? 'No tienes permiso para consultar este reporte.'
          : error.status === 404
            ? 'El reporte ya no existe.'
            : 'No se pudo consultar el detalle del reporte.';
      }
    });
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';

    const convertida = new Date(fecha);
    if (Number.isNaN(convertida.getTime())) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(convertida);
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

      return matchesSearch && matchesEstado &&
        matchesPrioridad && matchesCategoria;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedEstado = 'Todos';
    this.selectedPrioridad = 'Todas';
    this.selectedCategoria = 'Todas';
  }
}