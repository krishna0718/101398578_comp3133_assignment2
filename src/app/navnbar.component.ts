import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  template: `
    <nav *ngIf="isLoggedIn" class="nav-bar">
      <a routerLink="/employees">Employees</a>
      <a routerLink="/employees/add">Add Employee</a>
      <button mat-button color="warn" (click)="logout()">Logout</button>
    </nav>
  `,
  styles: [`
    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #eee;
    }
    a {
      text-decoration: none;
      margin-right: 1rem;
    }
  `]
})
export class NavbarComponent {
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
