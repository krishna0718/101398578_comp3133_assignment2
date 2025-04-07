
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
  <div class="form-container">
    <h2>Sign Up</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label for="username">Username</label>
      <input type="text" id="username" formControlName="username" placeholder="Enter your username" required />

      <label for="email">Email</label>
      <input type="email" id="email" formControlName="email" placeholder="Enter your email" required />

      <label for="password">Password</label>
      <input type="password" id="password" formControlName="password" placeholder="Enter your password" required />

      <button type="submit" [disabled]="form.invalid">Sign Up</button>
    </form>
    <p class="switch-text">
      Already have an account?
      <a routerLink="/login">Login</a>
    </p>
  </div>
`,
styles: [`
  .form-container {
    max-width: 400px;
    margin: 5rem auto;
    padding: 2rem 2.5rem;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  h2 {
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 1.8rem;
    color: #333;
  }

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.4rem;
    color: #444;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1.2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border 0.3s;
  }

  input:focus {
    outline: none;
    border-color: #7b2cbf;
    box-shadow: 0 0 0 3px rgba(123, 44, 191, 0.1);
  }

  button {
    width: 100%;
    padding: 0.9rem;
    border: none;
    background-color: #7b2cbf;
    color: white;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  button:hover {
    background-color: #5a189a;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .switch-text {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.95rem;
  }

  .switch-text a {
    color: #7b2cbf;
    font-weight: 600;
    text-decoration: none;
  }

  .switch-text a:hover {
    text-decoration: underline;
  }
`]
})
export class SignupComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.apollo.mutate({
        mutation: SIGNUP_MUTATION,
        variables: this.form.value
      }).subscribe({
        next: () => {
          this.snack.open('Signup successful', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.snack.open(err.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
