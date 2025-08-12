import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Services
import { ServiciosService } from '../admin/servicios';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.css'
})
export class SalesComponent {
  private fb = inject(FormBuilder);
  public serviciosService = inject(ServiciosService);

  saleForm = this.fb.group({
    serviceId: ['', Validators.required],
    clientName: ['', Validators.required],
    amountPaid: [0, [Validators.required, Validators.min(0)]]
  });

  onSubmit(): void {
    if (this.saleForm.valid) {
      console.log('Form Submitted!', this.saleForm.value);
      // In a real app, you would call a service to save the sale
      this.saleForm.reset();
    }
  }
}
