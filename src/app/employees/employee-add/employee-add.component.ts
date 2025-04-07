import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!, $last_name: String!, $email: String!, $gender: String!,
    $designation: String!, $salary: Float!, $date_of_joining: String!,
    $department: String!
  ) {
    addEmployee(
      first_name: $first_name, last_name: $last_name, email: $email, gender: $gender,
      designation: $designation, salary: $salary, date_of_joining: $date_of_joining,
      department: $department
    ) {
      id
    }
  }
`;

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatSnackBarModule
  ],
  template: `
    <div class="form-container">
  <h2>Add Employee</h2>
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <label for="first_name">First Name</label>
    <input id="first_name" formControlName="first_name" placeholder="Enter first name" required />

    <label for="last_name">Last Name</label>
    <input id="last_name" formControlName="last_name" placeholder="Enter last name" required />

    <label for="email">Email</label>
    <input type="email" id="email" formControlName="email" placeholder="Enter email" required />

    <label for="gender">Gender</label>
    <select id="gender" formControlName="gender" required>
      <option value="" disabled selected>Select gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>

    <label for="designation">Designation</label>
    <input id="designation" formControlName="designation" placeholder="Enter designation" required />

    <label for="salary">Salary</label>
    <input type="number" id="salary" formControlName="salary" placeholder="Enter salary" required />

    <label for="date_of_joining">Date of Joining</label>
    <input type="date" id="date_of_joining" formControlName="date_of_joining" required />

    <label for="department">Department</label>
    <input id="department" formControlName="department" placeholder="Enter department" required />

    <button type="submit" [disabled]="form.invalid">Add Employee</button>
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

input,
select {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #eef3fc;
  transition: border 0.3s ease;
}

input:focus,
select:focus {
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
export class AddEmployeeComponent {
  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', Validators.required],
    designation: ['', Validators.required],
    salary: [null, Validators.required],
    date_of_joining: ['', Validators.required],
    department: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private apollo: Apollo, private router: Router, private snack: MatSnackBar) {}

  onSubmit() {
    if (this.form.valid) {
      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: this.form.value
      }).subscribe({
        next: () => {
          this.snack.open('Employee added successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/employees']);
          
        },
        error: (err: any) => {
          const message = err?.graphQLErrors?.[0]?.message ?? err.message ?? 'Unexpected error';
          console.error('GraphQL Error:', message);
          this.snack.open('Failed to add employee: ' + message, 'Close', { duration: 3000 });
        }
        
        
      });
    }
  }
}
