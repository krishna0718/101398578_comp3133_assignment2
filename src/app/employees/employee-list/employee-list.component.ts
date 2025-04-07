
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

const GET_ALL_EMPLOYEES = gql`
  query {
    getAllEmployees {
      id
      first_name
      last_name
      email
      department
      designation
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule],
  template: `
    <h2 style="text-align:center">Employee Directory</h2>
    <table mat-table [dataSource]="employees" class="mat-elevation-z2">
      <ng-container matColumnDef="first_name">
        <th mat-header-cell *matHeaderCellDef>First Name</th>
        <td mat-cell *matCellDef="let e">{{ e.first_name }}</td>
      </ng-container>

      <ng-container matColumnDef="last_name">
        <th mat-header-cell *matHeaderCellDef>Last Name</th>
        <td mat-cell *matCellDef="let e">{{ e.last_name }}</td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let e">{{ e.email }}</td>
      </ng-container>

      <ng-container matColumnDef="designation">
        <th mat-header-cell *matHeaderCellDef>Designation</th>
        <td mat-cell *matCellDef="let e">{{ e.designation }}</td>
      </ng-container>

      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef>Department</th>
        <td mat-cell *matCellDef="let e">{{ e.department }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let e">
          <button mat-button color="primary" [routerLink]="['/employees', e.id]">View</button>
          <button mat-button color="accent" [routerLink]="['/employees/edit', e.id]">Edit</button>
          <button mat-button color="warn" (click)="deleteEmployee(e.id)">Delete</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  `,
  styles: [`
   :host {
  display: block;
  padding: 2rem;
  background-color: #f3f6f9;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

/* Page Title */
h2 {
  text-align: center;
  color: #333;
  font-weight: 500;
  margin-bottom: 2rem;
}

/* Table Styling */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Header Row */
th {
  background-color: #eeeeee;
  color: #333;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  font-size: 0.95rem;
}

/* Body Cells */
td {
  padding: 1rem;
  font-size: 0.93rem;
  color: #444;
  border-top: 1px solid #e0e0e0;
  vertical-align: middle;
}

/* Hover Row Effect */
tr:hover {
  background-color: #f9f9f9;
}

/* Action Buttons */
.actions button {
  border: none;
  background: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 4px 10px;
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

button.view {
  color: #6200ea;
}
button.edit {
  color: #00c853;
}
button.delete {
  color: #d32f2f;
}

.actions button:hover {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}


  `]
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  columns: string[] = ['first_name', 'last_name', 'email', 'designation', 'department', 'actions'];

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.apollo.watchQuery({ query: GET_ALL_EMPLOYEES })
      .valueChanges
      .pipe(map((result: any) => result.data.getAllEmployees))
      .subscribe((data) => this.employees = data);
  }

  deleteEmployee(id: string) {
    this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
    }).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== id);
      },
      error: () => {
        alert('Failed to delete employee.');
      }
    });
  }
}