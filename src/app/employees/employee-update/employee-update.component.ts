
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs';

const GET_EMPLOYEE = gql`
  query GetEmployeeById($id: ID!) {
    getEmployeeById(id: $id) {
      first_name
      last_name
      email
      designation
      salary
      department
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!,
    $first_name: String,
    $last_name: String,
    $email: String,
    $designation: String,
    $salary: Float,
    $department: String
  ) {
    updateEmployee(
      id: $id,
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      designation: $designation,
      salary: $salary,
      department: $department
    ) {
      id
    }
  }
`;

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatInputModule, MatButtonModule, MatSnackBarModule, MatSelectModule
  ],
  template: `
   <div class="form-container">
  <h2>Edit Employee</h2>
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <label for="first_name">First Name</label>
    <input id="first_name" formControlName="first_name" placeholder="Enter first name" required />

    <label for="last_name">Last Name</label>
    <input id="last_name" formControlName="last_name" placeholder="Enter last name" required />

    <label for="email">Email</label>
    <input type="email" id="email" formControlName="email" placeholder="Enter email" required />

    <label for="designation">Designation</label>
    <input id="designation" formControlName="designation" placeholder="Enter designation" required />

    <label for="salary">Salary</label>
    <input type="number" id="salary" formControlName="salary" placeholder="Enter salary" required />

    <label for="department">Department</label>
    <input id="department" formControlName="department" placeholder="Enter department" required />

    <button type="submit" [disabled]="form.invalid">Update Employee</button>
  </form>
</div>

  `,
  styles: [`
   .form-container {
  max-width: 500px;
  margin: 5rem auto;
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #222;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #eef3fc;
  transition: border 0.3s ease;
}

input:focus {
  border-color: #7b2cbf;
  outline: none;
  box-shadow: 0 0 0 3px rgba(123, 44, 191, 0.1);
}

button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #7b2cbf;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #5a189a;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

  `]
})
export class EditEmployeeComponent implements OnInit {
  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    designation: ['', Validators.required],
    salary: [null, Validators.required],
    department: ['', Validators.required]
  });

  id: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private apollo: Apollo, private router: Router, private snack: MatSnackBar) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.apollo.watchQuery({ query: GET_EMPLOYEE, variables: { id: this.id } })
      .valueChanges.pipe(map((res: any) => res.data.getEmployeeById))
      .subscribe(emp => this.form.patchValue(emp));
  }

  onSubmit() {
    if (this.form.valid && this.id) {
      this.apollo.mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: { id: this.id, ...this.form.value }
      }).subscribe({
        next: () => {
          this.snack.open('Employee updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/employees']);
        },
        error: () => {
          this.snack.open('Failed to update employee', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
