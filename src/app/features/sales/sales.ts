import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Services & Models
import { ServiciosService, BoutiqueService } from '../admin/servicios';

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
export class SalesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private serviciosService = inject(ServiciosService);

  // Local state for services
  public services = signal<BoutiqueService[]>([]);

  saleForm = this.fb.group({
    serviceId: ['', Validators.required],
    clientName: ['', Validators.required],
    amountPaid: [0, [Validators.required, Validators.min(0)]]
  });

  async ngOnInit() {
    // In a real app, you might want to only fetch "active" services,
    // but the current schema doesn't have an 'isActive' flag.
    this.services.set(await this.serviciosService.getServices());
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      console.log('Form Submitted!', this.saleForm.value);
      // TODO: This should call a SalesService to save the sale to Supabase.
      this.saleForm.reset();
    }
  }
}
