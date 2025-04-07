  import { Component } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Router, RouterModule } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
  import { AuthService } from '../../core/services/auth.service';

  @Component({
    selector: 'app-login',
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
  <h2>Login</h2>
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <label for="email">Email</label>
    <input type="email" id="email" formControlName="email" placeholder="Enter your email" required />

    <label for="password">Password</label>
    <input type="password" id="password" formControlName="password" placeholder="Enter your password" required />

    <button type="submit" [disabled]="form.invalid">Login</button>
  </form>
  <p class="switch-text">
    Don't have an account?
    <a routerLink="/signup">Sign up</a>
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

  &:focus {
    outline: none;
    border-color: #7b2cbf;
    box-shadow: 0 0 0 3px rgba(123, 44, 191, 0.1);
  }
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

  &:hover {
    background-color: #5a189a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.switch-text {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;

  a {
    color: #7b2cbf;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}


`]

    
  })
  export class LoginComponent {
    form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    constructor(
      private fb: FormBuilder,
      private auth: AuthService,
      private router: Router,
      private snack: MatSnackBar
    ) {}

    onSubmit() {
      if (this.form.valid) {
        const { email, password } = this.form.value;
        this.auth.login(email!, password!).subscribe({
          next: (res) => {
            this.auth.saveToken(res.token);
            this.snack.open('Login successful', 'Close', { duration: 3000 });
            this.router.navigate(['/employees']);
          },
          error: () => {
            this.snack.open('Invalid login credentials', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }
