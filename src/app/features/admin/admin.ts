import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { UserService, Employee } from './user';
import { ServiciosService, BoutiqueService } from './servicios';

// Angular Material Modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {
  // Inject services
  public userService = inject(UserService);
  public serviciosService = inject(ServiciosService);

  // Define columns for the tables
  employeeColumns: string[] = ['name', 'email', 'isActive', 'actions'];
  serviceColumns: string[] = ['name', 'price', 'duration', 'isActive', 'actions'];

  // --- Employee Action Handlers ---
  addEmployee() {
    console.log('Opening add employee dialog...');
    // In a real implementation, this would open a MatDialog
  }

  editEmployee(employee: Employee) {
    console.log('Opening edit employee dialog for:', employee);
  }

  toggleEmployeeStatus(employee: Employee) {
    if (employee.isActive) {
      this.userService.deactivateUser(employee.id);
    } else {
      this.userService.reactivateUser(employee.id);
    }
  }

  // --- Service Action Handlers ---
  addService() {
    console.log('Opening add service dialog...');
  }

  editService(service: BoutiqueService) {
    console.log('Opening edit service dialog for:', service);
  }

  toggleServiceStatus(service: BoutiqueService) {
    if (service.isActive) {
      this.serviciosService.deactivateService(service.id);
    } else {
      this.serviciosService.reactivateService(service.id);
    }
  }
}
