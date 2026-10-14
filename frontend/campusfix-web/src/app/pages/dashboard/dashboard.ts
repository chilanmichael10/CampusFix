import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DashboardSlide {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  link: string;
  alt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  currentSlide = signal(0);

  private carouselTimer?: ReturnType<typeof setInterval>;

  readonly carouselInterval = 4000;

  readonly slides: DashboardSlide[] = [
    {
      image: '/assets/images/carousel/carrucel1.jpg',
      eyebrow: 'BIENVENIDO A CAMPUSFIX',
      title: 'Un campus en mejores condiciones',
      description:
        'Reporta incidencias y contribuye a mantener nuestros espacios seguros y funcionales.',
      link: '/reportes/nuevo',
      alt: 'Instalaciones del campus universitario'
    },
    {
      image: '/assets/images/carousel/carrucel2.jpg',
      eyebrow: 'MANTENIMIENTO DEL CAMPUS',
      title: 'Cada espacio cuenta',
      description:
        'Ayúdanos a identificar problemas y mejorar las instalaciones universitarias.',
      link: '/reportes',
      alt: 'Espacios universitarios que requieren mantenimiento'
    },
    {
      image: '/assets/images/carousel/carrucel3.jpg',
      eyebrow: 'ATENCIÓN Y SEGUIMIENTO',
      title: 'Tus reportes tienen seguimiento',
      description:
        'Consulta las incidencias y facilita la coordinación de las tareas de mantenimiento.',
      link: '/reportes',
      alt: 'Atención de incidencias del campus'
    },
    {
      image: '/assets/images/carousel/carrucel4.jpg',
      eyebrow: 'ESPACIOS PARA APRENDER',
      title: 'Cuidemos juntos nuestro campus',
      description:
        'Un entorno cuidado ayuda a toda la comunidad universitaria.',
      link: '/reportes/nuevo',
      alt: 'Espacios de aprendizaje universitario'
    },
    {
      image: '/assets/images/carousel/carrucel5.jpg',
      eyebrow: 'GESTIÓN DE INCIDENCIAS',
      title: 'Del reporte a la solución',
      description:
        'Centraliza la información y facilita la atención de los problemas del campus.',
      link: '/reportes',
      alt: 'Gestión y seguimiento de reportes'
    },
    {
      image: '/assets/images/carousel/carrucel6.jpg',
      eyebrow: 'CAMPUSFIX',
      title: 'Construimos un mejor espacio',
      description:
        'Cada incidencia atendida contribuye a una mejor experiencia universitaria.',
      link: '/reportes/nuevo',
      alt: 'Campus universitario y sus instalaciones'
    }
  ];

  stats = [
    {
      label: 'Reportes totales',
      value: 128,
      description: 'Registrados en el sistema',
      icon: '▤',
      type: 'primary'
    },
    {
      label: 'Pendientes',
      value: 24,
      description: 'Requieren atención',
      icon: '◷',
      type: 'warning'
    },
    {
      label: 'En proceso',
      value: 18,
      description: 'Actualmente atendidos',
      icon: '⚒',
      type: 'info'
    },
    {
      label: 'Resueltos',
      value: 86,
      description: 'Casos solucionados',
      icon: '✓',
      type: 'success'
    }
  ];

  recentActivity = [
    {
      title: 'Reporte #105',
      description: 'Proyector sin funcionamiento',
      time: 'Hace 15 minutos',
      status: 'Asignado'
    },
    {
      title: 'Reporte #104',
      description: 'Aire acondicionado',
      time: 'Hace 42 minutos',
      status: 'En reparación'
    },
    {
      title: 'Reporte #103',
      description: 'Falla eléctrica en aula',
      time: 'Hace 1 hora',
      status: 'Reportado'
    },
    {
      title: 'Reporte #102',
      description: 'Computadora no enciende',
      time: 'Hace 2 horas',
      status: 'Solucionado'
    }
  ];

  statusData = [
    { label: 'Reportado', value: 32, percentage: 25 },
    { label: 'Asignado', value: 22, percentage: 17 },
    { label: 'En proceso', value: 24, percentage: 19 },
    { label: 'Resuelto', value: 50, percentage: 39 }
  ];

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  private startCarousel(): void {
    this.stopCarousel();

    if (this.slides.length < 2) {
      return;
    }

    this.carouselTimer = setInterval(() => {
      this.nextSlide();
    }, this.carouselInterval);
  }

  private stopCarousel(): void {
    if (this.carouselTimer !== undefined) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = undefined;
    }
  }

  nextSlide(): void {
    if (this.slides.length < 2) {
      return;
    }

    this.currentSlide.update(
      index => (index + 1) % this.slides.length
    );
  }

  previousSlide(): void {
    if (this.slides.length < 2) {
      return;
    }

    this.currentSlide.update(
      index => (index - 1 + this.slides.length) % this.slides.length
    );
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) {
      return;
    }

    this.currentSlide.set(index);
  }

  onCarouselImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;
    image.src = '/assets/images/dashboard-campus.webp';
  }

  trackSlide(index: number): number {
    return index;
  }

  trackStat(_: number, item: { label: string }): string {
    return item.label;
  }

  trackActivity(_: number, item: { title: string }): string {
    return item.title;
  }
}
