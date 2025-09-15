import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterUseCase } from '../../../application/use-cases/register.use-case';
import { RegisterRequest } from '../../../domain/models/register-request.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  private registerUseCase = inject(RegisterUseCase);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const request: RegisterRequest = this.registerForm.value;
      this.registerUseCase.execute(request).subscribe({
        next: () => {
          alert('Registration successful!');
          this.router.navigate(['/login']); // Navigate to login after successful registration
        },
        error: (err) => {
          alert('Registration failed: ' + err.message);
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
