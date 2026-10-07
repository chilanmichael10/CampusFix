import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../core/services/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  menuOpen = false;

  readonly user = this.auth.getUser();

  get role(): string {
    return this.user?.roles?.[0] ?? 'Usuario';
  }

  get userName(): string {
    return this.user?.nombreCompleto ?? 'Usuario CampusFix';
  }

  get userInitials(): string {
    const name = this.userName.trim();

    if (!name) {
      return 'CF';
    }

    const parts = name.split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }
}