import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css'
})
export class Administracion {
  private readonly route = inject(ActivatedRoute);

  get titulo(): string {
    const seccion = this.route.snapshot.data['titulo'];
    return seccion ?? 'Administración';
  }
}