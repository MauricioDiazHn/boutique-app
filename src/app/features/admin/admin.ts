import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services & Models
import { UserService, EmployeeProfile } from './user';
import { ServiciosService, BoutiqueService } from './servicios';

// Angular Material Modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  // Inject services
  private userService = inject(UserService);
  private serviciosService = inject(ServiciosService);
  private snackBar = inject(MatSnackBar);

  // Local state signals
  public employees = signal<EmployeeProfile[]>([]);
  public services = signal<BoutiqueService[]>([]);

  // Define columns for the tables, updated for new models
  employeeColumns: string[] = ['full_name', 'email', 'role', 'actions'];
  serviceColumns: string[] = ['name', 'description', 'price', 'actions'];

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.employees.set(await this.userService.getEmployees());
    this.services.set(await this.serviciosService.getServices());
  }

  // --- Action Handlers ---
  // Placeholder for add/edit dialogs
  addOrEditItem(itemType: 'employee' | 'service', item?: any) {
    this.snackBar.open(`Función para añadir/editar ${itemType} no implementada.`, 'Cerrar', { duration: 3000 });
    console.log(`Dialog for ${itemType}`, item);
  }

  async deleteService(service: BoutiqueService) {
    try {
      await this.serviciosService.deleteService(service.id);
      this.snackBar.open('Servicio eliminado con éxito.', 'Cerrar', { duration: 3000 });
      await this.loadData(); // Refresh data
    } catch (error) {
      this.snackBar.open('Error al eliminar el servicio.', 'Cerrar', { duration: 3000 });
      console.error(error);
    }
  }

  // NOTE: Deleting employees is a sensitive operation and is not implemented.
  // It would typically be handled via Supabase admin functions or a different UI flow.
}
