import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

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
    {
      label: 'Reportado',
      value: 32,
      percentage: 25
    },
    {
      label: 'Asignado',
      value: 24,
      percentage: 19
    },
    {
      label: 'En reparación',
      value: 18,
      percentage: 14
    },
    {
      label: 'Solucionado',
      value: 54,
      percentage: 42
    }
  ];

}